<template>

  <van-skeleton title :row="10" :loading="loading" style="padding-bottom: 20px;">
    <div class="mdui-ripple" style="padding-bottom: 7px" v-for="data in datas">
      <div class="mdui-card" :id="data.pid" @click="jumpToPoll(data.pid)">
        <div class="mdui-card-primary">
          <div class="mdui-card-primary-title">{{data.title}}</div>
          <div class="mdui-card-primary-subtitle">{{ data.des }}</div>
          <div class="mdui-card-primary-subtitle">{{ data.des }}</div>
        </div>
      </div>
    </div>
  </van-skeleton>


</template>

<script setup lang="ts">
import {ApiRequest} from "../units/api";
  import {ref} from "vue";
  import mdui from "mdui";
  import router from "../router/index";
  import { useCookies } from "vue3-cookies";

  const { cookies } = useCookies();
let loading = ref(true);
  let datas = ref();
  let time = Date.now();
  ApiRequest("POST","poll/getPolls",{"ltoken":cookies.get("token"),"t":time,"page":1}).then(
      function (data){
        if (data.status === 200){
          datas.value = data.data.data.records;
          loading.value = false;
        }
      }
  );

  function deletePoll(pid: any){
    alert(pid);
  }

  function disablePoll(pid: any){

  }

  const jumpToPoll = (pid: any) => {
    window.location.href = "/pollDetail?p=" + pid;
  }

</script>

<style scoped>

</style>