<!-- 路径规划组件 -->
<!-- 操作：面板上选择起点和终点，然后点击进入规划模式，进行路径规划 -->
<!-- 路径规划期间，将禁用图层控制，并将图层隐藏，展示路径规划实体以及规划面板 -->
<!-- 点击离开规划，恢复图层控制，并清除规划的结果，隐藏规划面板 -->
<template>
    <div class="route-design-wrapper">
        <div class="route-design">
            <div class="header">
                <i class="iconfont metro-lujingguihua"></i>
                <span>路径规划</span>
                <button class="start-btn" @click="enterDesign">
                    {{ isDesign ? "离开规划模式" : "进入规划模式" }}
                </button>
            </div>
            <div class="content">
                <div>
                    <span style="margin-right: 5px">起点:</span>
                    <a-cascader v-model:value="startStation" :options="options" placeholder="请输入起点站">
                        <template #clearIcon>
                            <i class="iconfont metro-close"></i>
                        </template>
                    </a-cascader>
                    <!-- <a-button style="margin-left: 8px" @click="pickStation('origin')">拾取起点站</a-button> -->
                </div>
                <div>
                    <span style="margin-right: 5px">终点:</span>
                    <a-cascader v-model:value="endStation" :options="options" placeholder="请输入起点站"><template #clearIcon>
                            <i class="iconfont metro-close"></i>
                        </template>
                    </a-cascader>
                    <!-- <a-button style="margin-left: 8px" @click="pickStation('destination')">拾取终点站</a-button> -->
                </div>
            </div>
        </div>
    </div>
    <!-- 路径规划展示面板 -->
    <PathDesignDisplayCard :routeInfo="routeInfo" v-if="isDesign" :cacheData="cacheData"/>
</template>
  
<script setup>
import PathDesignDisplayCard from '@/components/PathDesignDisplayCard.vue';
import { ref, onMounted, watch,onBeforeUnmount } from 'vue';
import { lineColors } from "@/store/staticData";
import { useLineData } from '@/store'
import { renderStation,renderLines,renderStationBill,removeByCacheData,flyToDefaultView } from '@/cesiumTools/effectController'
import { getLinePlan } from "@/api/line";
import { message } from "ant-design-vue";
const lineData = useLineData()
let viewer =lineData.viewer
// 站点数据
const subLineData = ref([])
const startStation = ref([]);
const endStation = ref([]);
// 是否处于规划模式
const isDesign = ref(false);

// 路径规划面板数据
const routeInfo = ref({})

// 路径规划的实体
const cacheData = {
    lineEnts: [],
    stationEnts: [],
    billboards:[]
};

// 路径规划完成的数据
let pathInfo = {

};
// 渲染下拉列表的数据
let options = ref([])
onMounted(async () => {
    viewer = lineData.viewer
    
    subLineData.value = lineData.allData
    if (subLineData.value.length > 0) {
        options.value = subLineData.value.map((item) => {
            const { name, stationsList } = item;
            const children = stationsList.map((s) => ({
                value: s.name,
                label: s.name,
            }));
            return {
                label: name,
                value: name,
                children,
            };
        });
    }
})

onBeforeUnmount(()=>{
    leaveRouteDesign()
})

watch([startStation, endStation], async (value) => {
    if(isDesign.value){
        const data=await getLineData()
        pathInfo=data
        mapChange()
    }
});

const getLineData=async ()=>{
    const start = startStation.value;
    const end = endStation.value;
    //如果起点和终点都填入了数据，就跑服务，获取路径规划数据
    if (start.length && end.length) {
        let params = {};
        // 从lineData中获取坐标信息
        params.origin = getPositon(start[0], start[1]);
        params.destination = getPositon(end[0], end[1]);
        const { code, data } = await getLinePlan(params);
        if (code === 200) {
            return data
        } else {
            message.warn("查询不到相关数据");
            return null
        }
    }
}

const mapChange = () => {
    // 清除之前的道路规划实体
    removeActiveEnts()
    // 第二步,通过数据，渲染站点与路径
    // 获取到所有的站点与路径，渲染地图效果
    const stations = [];
    const paths = [];
    const route = {
        stations: []
    }
    const { distance, segments } = pathInfo;
    route.distance = distance
    segments.forEach((s, sIndex) => {
        // buslines可能为null
        const {
            bus: { buslines },
        } = s;
        if (buslines?.length) {
            const target = buslines[0]
            const color = lineColors[sIndex]
            target.color = color
            route.stations.push(target)

            buslines.forEach((b, index) => {
                const line = { part: index + 1, partStation: [] };
                const { type, arrival_stop, departure_stop, name, polyline, via_stops } = b;
                paths.push({
                    name,
                    part: index + 1,
                    polyline,
                });
                if (type === "地铁线路") {
                    // 先加入起点站
                    let arrival = arrival_stop;
                    let departure = departure_stop;
                    // 如果是最后一段线路，为终点站，否则为换乘站
                    arrival.type = sIndex === segments.length - 1 ? "终点站" : "换乘站";
                    // 如果是第一段线路，为起点站，否则为换乘站
                    departure.type = sIndex === 0 ? "起点站" : "换乘站";

                    line.partStation.push(arrival);
                    via_stops.forEach((v) => {
                        v.type = "途径站";
                        line.partStation.push(v);
                    });

                    line.partStation.push(departure);
                    line.name = name;
                }
                stations.push(line);
            });
        }
    })
    routeInfo.value = route
    // 第二步，渲染站点以及路径,不走effectController内部缓存
    stations.forEach((station, index) => {
        let color = lineColors[index];
        const { partStation } = station;
        // 添加站点
        partStation.forEach(async p=>{
            let {location,name,type}=p
            name=type==='换乘站'?name+'(换乘)' : name
            const positionArr=location.split(",").map(item=>Number(item))
            const position={lng:positionArr[0],lat:positionArr[1]}
            // 这里不能走缓存，因为name不一样，会污染后续的功能
            const stationEnt=renderStation(viewer,{
                position,
                name,
                color:type==='换乘站'? '#e9a526' : color
            })
            const billboard =await renderStationBill(viewer,{
                position,
                name,
                color:type==='换乘站'? '#e9a526' : color,
                attr:{
                    name
                }
            })
            // 存放在组件中
            cacheData.stationEnts.push(stationEnt)
            cacheData.billboards.push(billboard)
        })
    });
    
    // // 添加路径
    paths.forEach((path, index) => {
        const color = lineColors[index];
        const {
            polyline: { polyline },
            name,
        } = path;
        let positionList=polyline.split(';')
        positionList=positionList.map((pos,index)=>{
            const [lng,lat]=pos.split(",").map(item=>Number(item))
            return {
                lng:Number(lng),
                lat:Number(lat)
            }
        })
        const lineEnt = renderLines(viewer, {
            positions: positionList,
            name,
            color
        });
        cacheData.lineEnts.push(lineEnt);
    });
    flyToDefaultView(viewer)
}

const getPositon = (lineName, stationName) => {
    const targetLine = subLineData.value.find((l) => l.name === lineName);
    const { position } = targetLine.stationsList.find(
        (s) => s.name === stationName
    );
    return `${position.lng},${position.lat}`;
};

// 离开规划模式
const leaveRouteDesign = () => {
    removeActiveEnts()
    lineData.controlAll(true)
    isDesign.value=false
    startStation.value=[]
    endStation.value=[]
    pathInfo={}
}

// 进入规划模式
const enterDesign =async () => {
    if (!Object.keys(pathInfo).length) {
        // 检查是否有起点终点站
        if (startStation.value.length && endStation.value.length) {
            // 如果存在的话，跑服务，填充pathInfo
            const data=await getLineData()
            pathInfo=data
        }else{
            message.warn('请先选择起点和终点站点')
            return
        }
    }
    // 如果处于规划模式，就退出
    if(isDesign.value){
        leaveRouteDesign()
        return 
    }
    // 进入规划模式第一步，隐藏当前地图上所有的元素
    // 我们直接交给图层控制组件完成这一步
    lineData.controlAll(false)
    // 第二步，渲染效果
    mapChange()
    isDesign.value=true
};

// 删除规划实体
const removeActiveEnts = () => {
    removeByCacheData(viewer,cacheData)
    cacheData.billboards=[]
    cacheData.lineEnts=[]
    cacheData.stationEnts=[]
};

</script>
<style scoped>
/* 路径规划样式 */
.route-design-wrapper {
    position: absolute;
    right: 14%;
    top: 5%;
}

.route-design {
    width: 320px;
    height: 170px;
    background-color: rgba(0, 0, 0, 0.6);
    border: 1px solid #885f12;
}

.route-design>.header {
    width: 100%;
    height: 40px;
    color: #fff;
    padding-left: 10px;
    background: rgb(255, 255, 255);
    background-image: linear-gradient(180deg,
            rgba(255, 255, 255, 1) 9%,
            rgba(211, 156, 50, 1) 57%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: flex;
    align-items: center;
}

.route-design span {
    margin-left: 5px;
}

.content {
    width: 100%;
    height: 110px;
    pointer-events: all;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    color: #fff;
}

.start-btn {
    width: 80px;
    color: #fff;
    margin-left: 140px;
    background-color: transparent;
    border: 1px solid #885f12;
    font-size: 12px;
    padding: 3px;
    pointer-events: all;
    cursor: pointer;
}

.start-btn:hover {
    background-color: #5c3f096d;
    border: 1px solid #881212;
}
</style>
  