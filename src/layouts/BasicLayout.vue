<script setup lang="ts">
import {ref} from "vue";
import Index from "../pages/Index.vue";
import Contact from "../pages/Contact.vue";
import User from "../pages/User.vue";
const onClickLeft = () => history.back();
let active = ref('index');
let title= "Centor-";
</script>

<template>
<div id="content" style="padding: 10px;">
  <template v-if="active==='index'">
    <Index />
  </template>
  <template v-if="active==='contact'">
    <Contact />
  </template>
  <template v-if="active==='user'">
    <User />
  </template>
</div>
  <van-tabbar 
  fixed
  v-model="active">
    <van-tabbar-item icon="home-o" name="index">Home</van-tabbar-item>
    <van-tabbar-item icon="friends-o" name="contact">Contact</van-tabbar-item>
    <van-tabbar-item icon="user-o" name="user">Me</van-tabbar-item>
  </van-tabbar>
</template>


