/*
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-08 14:32:14
 * @LastEditors: your name
 * @LastEditTime: 2024-05-08 14:32:14
 */
export const lineColors = [
  "#218acd",
  "#f794bd",
  "#f0c996",
  "#b3cf3c",
  "#e0e0e0",
  "#117241",
  "#f69a09",
  "#9dc0c8",
];
export const changeStations = [
  "钟家村",
  "大智路",
  "王家湾",
  "宏图大道",
  "常青花园",
  "范湖",
  "王家墩东",
  "江汉路",
  "街道口",
  "宗关",
  "码头潭公园",
  "园博园北",
  "巨龙大道",
  "黄浦路",
  "循礼门",
  "武昌火车站",
  "螃蟹岬",
  "徐家棚",
  "岳家嘴",
  "洪山广场",
  "野芷湖",
];
export const historyWarningData = {
  去年: [
    {
      name: "一月",
      value: 130,
    },
    {
      name: "二月",
      value: 150,
    },
    {
      name: "三月",
      value: 150,
    },
    {
      name: "四月",
      value: 131,
    },
    {
      name: "五月",
      value: 151,
    },
    {
      name: "六月",
      value: 163,
    },
    {
      name: "七月",
      value: 230,
    },
    {
      name: "八月",
      value: 155,
    },
    {
      name: "九月",
      value: 130,
    },
    {
      name: "十月",
      value: 111,
    },
    {
      name: "十一月",
      value: 222,
    },
    {
      name: "十二月",
      value: 260,
    },
  ],
  今年: [
    {
      name: "一月",
      value: 110,
    },
    {
      name: "二月",
      value: 120,
    },
    {
      name: "三月",
      value: 130,
    },
    {
      name: "四月",
      value: 111,
    },
    {
      name: "五月",
      value: 151,
    },
    {
      name: "六月",
      value: 123,
    },
    {
      name: "七月",
      value: 210,
    },
    {
      name: "八月",
      value: 135,
    },
    {
      name: "九月",
      value: 110,
    },
    {
      name: "十月",
      value: 101,
    },
    {
      name: "十一月",
      value: 162,
    },
    {
      name: "十二月",
      value: 230,
    },
  ],
};
// 站点管理需要查询的分类
export const stationMangeItems = [
  {
    title: "站点拥挤度",
    icon: "metro-lineRoute",
    id: "lineCrowd",
    active: false,
  },
  {
    title: "周边查询",
    icon: "metro-zhoubian",
    id: "stationAround",
    active: false,
  },
  {
    title: "路径规划",
    icon: "metro-lujingguihua",
    id: "pathDesign",
    active: false,
  },
  {
    title: "站控措施",
    icon: "metro-ditie",
    id: "stationControl",
    active: false,
  },
];

// 重保活动
export const activity = [
  {
    id: 3,
    activedLine:'1号线',
    activity: "领导参观",
    activedPlace: "长江大桥",
    activedTime: "8:30",
  },
  {
    id: 7,
    activedLine:'1号线',
    activity: "足球赛",
    activedPlace: "体育场",
    activedTime: "10:30",
  },
  {
    id: 12,
    activedLine:'1号线',
    activity: "领导巡视",
    activedPlace: "大学",
    activedTime: "14:30",
  },
  {
    id: 14,
    activedLine:'1号线',
    activity: "露天演出",
    activedPlace: "景区",
    activedTime: "16:30",
  }
];

// 站控措施
export const station_solutions=[
  {
    title:'重保',
    iconName:'metro-yibao'
  },
  {
    title:'安检',
    iconName:'metro--control'
  },{
    title:'封站',
    iconName:'metro-jinzhi'
  },{
    title:'分批放行乘客',
    iconName:'metro-yonghu'
  },{
    title:'设立导流围栏',
    iconName:'metro-fence-full'
  },{
    title:'关闭部分进站闸机',
    iconName:'metro-zhaji'
  },{
    title:'减缓售票速度',
    iconName:'metro-shoupiao'
  },{
    title:'改变电梯运行方向',
    iconName:'metro-dianti'
  },{
    title:'引导乘客分流',
    iconName:'metro-code-branch'
  }
]

// 地铁历史
export const line_history = [
  {
    name: "一号线",
    id: 1,
    history: [
      {
        timePoint: "2000-12",
        message: "武汉地铁1号线一期开工",
      },
      {
        timePoint: "2002-06",
        message: "武汉地铁1号线一期主体工程基本完工",
      },
      {
        timePoint: "2003-12",
        message: "武汉地铁1号线开始试运行",
      },
      {
        timePoint: "2004-07",
        message: "武汉地铁1号线进入观光试运营",
      },
      {
        timePoint: "2005-12",
        message:
          "武汉地铁1号线二期工程东段开工建设，西段开始铺设管道，为开工做前期准备",
      },
      {
        timePoint: "2010-06",
        message: "武汉地铁1号线二期全线试车",
      },
      {
        timePoint: "2014-05",
        message: "武汉地铁1号线三期汉口北延长线实现试运营",
      },
      {
        timePoint: "2017-05",
        message: "武汉地铁1号线四期泾河延长线3座车站完成轨道铺设",
      },
    ],
  },
  {
    name: "二号线",
    id: 2,
    history: [
      {
        timePoint: "2009-01",
        message: "武汉地铁2号线一期开工",
      },
      {
        timePoint: "2010-01",
        message: "2号线一期工程名光区间贯通",
      },
      {
        timePoint: "2011-09",
        message: "武汉地铁2号线一期工程越江隧道左线工程贯通",
      },
      {
        timePoint: "2012-02",
        message: "武汉地铁2号线一期工程实现全线隧道贯通",
      },
      {
        timePoint: "2012-12",
        message: "武汉地铁2号线一期开通试运营",
      },
      {
        timePoint: "2014-12",
        message: "武汉地铁2号线南延线暨光谷广场综合体工程开工建设",
      },
      {
        timePoint: "2015-05",
        message: "武汉地铁2号线机场线二期工程开工",
      },
      {
        timePoint: "2016-12",
        message: "武汉地铁2号线二期工程（机场线）建设完工开始运营",
      },
      {
        timePoint: "2019-02",
        message: "武汉地铁2号线三期工程（南延线）建设完工开始运营",
      },
    ],
  },
  {
    name: "三号线",
    id: 3,
    history: [
      {
        timePoint: "2012-02",
        message: "武汉地铁3号线一期工程开工仪式在后湖大道站举行",
      },
      {
        timePoint: "2014-10",
        message: "武汉地铁3号线一期工程开始铺轨",
      },
      {
        timePoint: "2015-12",
        message: "武汉地铁3号线一期工程（宏图大道站至沌阳大道站）开通运营。",
      },
      {
        timePoint: "2022-12",
        message: "12月30日，武汉地铁3号线二期工程正式开工建设。",
      },
    ],
  },
  {
    name: "四号线",
    id: 4,
    history: [
      {
        timePoint: "2005-05",
        message: "武汉地铁4号线开始开展预可研报告修编，工程分段分期实施",
      },
      {
        timePoint: "2009-09",
        message: "武汉地铁4号线一期工程土建施工正式进入施工阶段",
      },
      {
        timePoint: "2009-12",
        message: "武汉地铁4号线二期工程开始建设",
      },
      {
        timePoint: "2012-05",
        message: "武汉地铁4号线一期工程线网管理服务中心实现主体结构封顶",
      },
      {
        timePoint: "2012-11",
        message: "武汉地铁4号线二期工程复拦越江隧道正式开挖",
      },
      {
        timePoint: "2013-12",
        message: "武汉地铁4号线一期工程开通试运营",
      },
      {
        timePoint: "2014-12",
        message: "武汉地铁4号线二期工程开通试运营",
      },
      {
        timePoint: "2015-12",
        message: "武汉地铁4号线蔡甸线凤凰山站点开工",
      },
      {
        timePoint: "2019-09",
        message: "武汉地铁4号线三期（蔡甸线）工程建设完成并通车",
      },
    ],
  },
  {
    name: "五号线",
    id: 5,
    history: [
      {
        timePoint: "2015-12",
        message: "7月，武汉地铁5号线开始探路。12月23日，武钢站开工建设",
      },
      {
        timePoint: "2016-09",
        message:
          "武汉地铁5号线启动第二次环评。同年，武汉地铁5号线进入全面建设阶段",
      },
      {
        timePoint: "2019-08",
        message: "武汉地铁5号线高架段全线贯通",
      },
      {
        timePoint: "2021-12",
        message: "武汉地铁5号线开通运营,武汉地铁5号线二期工程开工建设",
      },
      {
        timePoint: "2023-07",
        message: "武汉地铁5号线起点调整工程预计2023年内开通",
      },
    ],
  },
  {
    name: "六号线",
    id: 6,
    history: [
      {
        timePoint: "2012-12",
        message:
          "中华人民共和国国家发展和改革委员会批复了武汉地铁6号线一期工程",
      },
      {
        timePoint: "2013-08",
        message: "武汉地铁6号线一期工程开工建设",
      },
      {
        timePoint: "2014-04",
        message: "4月4日，武汉地铁6号线首个区间贯通",
      },
      {
        timePoint: "2016-12",
        message:
          "12月28日，武汉地铁6号线一期工程（金银湖公园站至东风公司站）开通运营",
      },
      {
        timePoint: "2017-07",
        message: "6号线二期工程土建预埋工程开工",
      },
      {
        timePoint: "2021-12",
        message: "6号线二期工程开通运营",
      },
      {
        timePoint: "2022-12",
        message: "武汉地铁6号线三期正式开工",
      },
    ],
  },
  {
    name: "七号线",
    id: 7,
    history: [
      {
        timePoint: "2013-12",
        message:
          "12月28日，武汉地铁7号线一期工程（含武汉长江公铁隧道）全面开工建设。",
      },
      {
        timePoint: "2018-10",
        message: "武汉地铁7号线一期工程（园博园北站至野芷湖站）开通运营",
      },
      {
        timePoint: "2018-12",
        message: "武汉地铁7号线南延线（野芷湖站至青龙山地铁小镇站）开通运营",
      },
      {
        timePoint: "2020-05",
        message: "武汉地铁7号线北延线正式开工建设。",
      },
      {
        timePoint: "2022-12",
        message:
          "12月30日，武汉地铁7号线北延线（前川线）一期工程（横店站至园博园北站）开通初期运营。",
      },
    ],
  },
  {
    name: "八号线",
    id: 8,
    history: [
      {
        timePoint: "2013-12",
        message: "武汉地铁8号线开工仪式举行",
      },
      {
        timePoint: "2014-10",
        message: "徐家棚站围护结构开始施工",
      },
      {
        timePoint: "2017-12",
        message: "武汉地铁8号线一期工程（金潭路站至梨园站）开通运营",
      },
      {
        timePoint: "2019-11",
        message: "武汉地铁8号线三期工程（野芷湖站至军运村站）开通运营",
      },
      {
        timePoint: "2021-01",
        message: "武汉地铁8号线二期工程开通运营",
      },
      {
        timePoint: "2022-08",
        message: "武汉地铁8号线――钢结构主体顺利完工",
      },
    ],
  },
];