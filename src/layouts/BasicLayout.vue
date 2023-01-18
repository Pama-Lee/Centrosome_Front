<script setup lang="ts">
import {ref} from "vue";
import Index from "../pages/Index.vue";
import Meeting from "../pages/Meeting.vue";
import User from "../pages/User.vue";
const onClickLeft = () => history.back();
let active = ref('index');
let title= "Centor-";
</script>

<template>
  <van-nav-bar title="Centor" left-text="返回" left-arrow>
  </van-nav-bar>
<div id="content" style="padding: 10px">
  <template v-if="active==='index'">
    <Index />
  </template>
  <template v-if="active==='meeting'">
    <Meeting />
  </template>
  <template v-if="active==='user'">
    <User />
  </template>
</div>
  <van-tabbar v-model="active">
    <van-tabbar-item icon="home-o" name="index">Home</van-tabbar-item>
    <van-tabbar-item icon="clock-o" name="meeting">Meeting</van-tabbar-item>
    <van-tabbar-item icon="user-o" name="user">User</van-tabbar-item>
  </van-tabbar>

</template>


