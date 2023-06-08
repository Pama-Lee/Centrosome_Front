<script setup lang="ts">
import BasicLayout from "./layouts/BasicLayout.vue";
import { useCookies } from "vue3-cookies";
import { showDialog } from 'vant';
import HeadBar from "./layouts/HeadBar.vue";
import 'vant/lib/index.css';

const { cookies } = useCookies();

const isAuth = () => {
  return cookies.get("token") ? true : false;
};

const inLogin = () => {
  return window.location.pathname === "/login";
};

const inPollParticipate = () => {
  return window.location.pathname === "/pollParticipate";
};

if (!isAuth() && window.location.pathname !== "/login" && window.location.pathname !== "/pollParticipate") {
  showDialog({
    title: "提示",
    message: "请先登录",
  }).then(() => {
    window.location.href = "/login";
  });
}

// 如果屏幕宽度大于768px，显示提示框
if (window.innerWidth > 768 && cookies.get("isMobile") !== "false") {
  showDialog({
    title: "Notice",
    message: "It is recommended to use mobile phone to view the website",
  });
  // 设置cookie
  cookies.set("isMobile", "false");
} else {
  cookies.set("isMobile", "true");
}

// 设置body高度为屏幕高度
document.body.style.height = window.innerHeight + "px";

// 设置app高度为屏幕高度, 如果app存在
if (document.getElementById("app")) {
  document.getElementById("app")!.style.height = window.innerHeight + "px";
}
</script>

<template>
  <head-bar></head-bar>
  <router-view v-if="isAuth() || inLogin() || inPollParticipate()"></router-view>
</template>

