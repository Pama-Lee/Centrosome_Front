<template>

  <van-skeleton title :row="10" :loading="loading">
    <div :mdui-menu="`{align:'right',target: '#menu-${data.pid}'}`" class="mdui-ripple" style="padding-bottom: 7px" v-for="data in datas.data">
      <div class="mdui-card" :id="data.pid" >
        <div class="mdui-card-primary">
          <div class="mdui-card-primary-title">{{data.title}}</div>
          <div class="mdui-card-primary-subtitle">{{ data.des }}</div>
          <div class="mdui-card-primary-subtitle">{{ data.des }}</div>
        </div>
      </div>
    </div>
    <ul v-for="data in datas.data" class="mdui-menu" :id="`menu-${data.pid}`">
      <li class="mdui-menu-item">
        <a>Title:{{data.title}}</a>
      </li>
      <li class="mdui-divider"></li>
      <li class="mdui-menu-item">
        <router-link :to="{ path: '/createGroupPoll', query: { pid: data.pid }}">
          Edit
        </router-link>
      </li>
      <li class="mdui-menu-item">
        <a @click="disablePoll(data.pid)">Disable</a>
      </li>
      <li class="mdui-menu-item">
        <a @click="deletePoll(data.pid)">Delete this Poll</a>
      </li>
    </ul>
  </van-skeleton>


</template>

<script setup>
import {ApiRequest} from "../units/api";
  import {ref} from "vue";
  import mdui from "mdui";
  import router from "../router/index";

let loading = ref(true);
  let datas = ref();
  let time = Date.now();
  ApiRequest("POST","poll/getPolls",{"ltoken":"923319ae86cdb3a4273f71778557109e","t":time,"page":1}).then(
      function (data){
        if (data.status === 200){
          datas.value = data;
          loading.value = false;
        }
      }
  );

  function deletePoll(pid){
    alert(pid);
  }

  function disablePoll(pid){

  }

</script>

<style scoped>

</style>