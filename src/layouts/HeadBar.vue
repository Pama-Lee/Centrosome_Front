<template>
      <van-nav-bar 
      :title="getTitle()" 
      :left-text="status ? '' : 'Back'"
      :left-arrow="!status"
      @click-left="back"
      >
  </van-nav-bar>
</template>
<script setup lang="ts">
    import { ref } from "vue";
import router from "../router";
    const status = ref(false);
    // 如果位于主页
    if (window.location.pathname === "/") {
      status.value = true;
    }
    // 点击返回按钮
    const back = () => {
        if (window.history.length === 1) {
            window.location.href = "/";
        } else {
            window.history.back();
        }
    };

    // 当路由发生变化时
    router.afterEach((to, from) => {
        if (to.path === "/") {
            status.value = true;
        } else {
            status.value = false;
        }
        });
    
    const getTitle = () => {
        // 获取路由名称
        const name = router.currentRoute.value.name;
        if (name === "home") return "Centro";
        return name?.toString();
    };
</script>