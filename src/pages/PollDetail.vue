<template>
    <div id="pollDetail" style="display: flex;
  flex-direction: column;">
    <van-tabs v-model:active="active">
  <van-tab class="tabs" title="Main Page">
    <PollMain />
  </van-tab>
  <van-tab class="tabs" title="Data">
    <PollData />
  </van-tab>
</van-tabs>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import PollData from "./Poll/PollData.vue";
import PollMain from "./Poll/PollMain.vue";
const active = ref(0);

// 当页面加载完成后
onMounted(() => {
const element: any = document.getElementById('pollDetail');
const rect = element.getBoundingClientRect();
const windowHeight = window.innerHeight;

const remainingHeight = windowHeight - rect.bottom;
// 将class为tabs的元素的高度设置为剩余高度
const tabs = document.getElementsByClassName('tabs');
for (let i = 0; i < tabs.length; i++) {
    tabs[i].setAttribute('style', `height: ${remainingHeight}px`);
}
});

</script>

