<!--
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-08 16:53:39
 * @LastEditors: your name
 * @LastEditTime: 2024-05-08 17:01:34
-->
<template>
    <div id="footer">
      <ul>
          <li v-for="item in menus" :key="item.name">
              <router-link :to="item.path" 
              :class="[item.isActive?'active-item':'',item.name==='首页'?'home':'']">{{item.name}}</router-link>
          </li>
      </ul>
  
    </div>
  </template>
  
  <script setup>
  import router from '@/router'
  import menusData from '@/store/menuData'
  import {ref,watch} from 'vue'
  
  const menus=ref(menusData)
  
  watch(router.currentRoute,(value)=>{
      menus.value= menus.value.map(n=>{
          if(n.path===value.path){
              console.log(n);
              n.isActive=true
          }else{
              n.isActive=false
          }
          return n
      })
  })
  
  </script>
  <style scoped>
  #footer{
      width: 100%;
      height: 73px;
      position: absolute;
      left: 50%;
      bottom: 0.521vw;
      transform: translateX(-50%);
      background: url('../assets/uiResources/footer.png');
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: all;
  }
  
  #footer ul .active-item{
      color: #ec9b02;
      font-size: 12px;
  }
  
  #footer ul{
      width: 28%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      list-style: none;
      margin-top: 24px;
  }
  
  #footer ul a{
      color: #fff;
      font-size: 12px;
      text-decoration: none;
  }
  
  #footer ul li{
      color: #fff;
      cursor: pointer;
  }
  
  #footer ul a:hover{
      color: rgb(97, 89, 89);
  }
  
  
  #footer ul .home{
      display: inline-block;
      transform: translateY(-3px);
  }
  </style>