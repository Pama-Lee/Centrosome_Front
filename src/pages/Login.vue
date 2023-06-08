<script setup lang="ts">
import { showDialog, Loading } from 'vant';
import { ref } from 'vue';
import { useCookies } from 'vue3-cookies';
import rootjam from "../service/rootjam";

const appid = "dc9272ab9ab4c762";
const loading = ref(false);

const { cookies } = useCookies();

// 调用接口进行登录
const login = async (token: string) => {
  const res = await rootjam.verfiyToken(token);
  if (res.data.code === 200) {
    //window.location.href = "/";
    console.log(res.data);
    // 存放token在cookie
    cookies.set("token", res.data.data.token);

    // 如果localstorage中有redirect参数，跳转到redirect页面
    if (localStorage.getItem("redirect")) {
      window.location.href = localStorage.getItem("redirect") as string;
      localStorage.removeItem("redirect");
    } else {
      window.location.href = "/";
    }
  } else {
    showDialog({
      title: "提示",
      message: "登录失败:"+res.data.message,
    }).then(() => {
      window.location.href = "/login";
    });
  }
  loading.value = false;
};


// 如果url不存在token，跳转到Rootjam登录页面
if (!window.location.href.includes("token")) {
  // 如果url中有redirect参数，储存到localstorage中
  if (window.location.href.includes("redirect")) {
    const redirect = window.location.href.split("redirect=")[1];
    localStorage.setItem("redirect", redirect);
  }
  window.location.href = "https://rootjam.pamalee.cn/?appid="+appid;
} else {
    const token = window.location.href.split("token=")[1];
    loading.value = true;
    const l = login(token);
}





</script>

<template>
    <div v-if="loading">
        <van-loading style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        " type="spinner" size="75" color="#1989fa" />
    </div>
</template>