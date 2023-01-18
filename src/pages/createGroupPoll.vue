<script setup lang="ts">
import {ref} from "vue";
import {ApiRequest} from "../units/api";

let startTime = new Date();
let stopTime = new Date();
let minDate = new Date();
let maxDate = new Date(2025, 10, 1);

let deadlineTime = ref();

let deadline = ref(false);
let deadlineShow = ref(false);
let hide = ref(true);

let if_deadline = deadline?1:0;
let if_hide = hide?1:0;

let times = new Array();
let cutime: any[] = [];
const starte = ref(false);
const stops = ref(false);
const text = ref('');
let title = ref();
let des = ref()
let location = ref();
const showPopup = () => {
  starte.value = true;
  title.value = "Start Time";
};
function starts(){
  cutime = [];
  starte.value = false;
  console.log(startTime.getTime());
  cutime.push(startTime.getTime());
  stops.value = true;
}
function stopss(){
  stops.value = false;
  cutime.push(stopTime.getTime());
  times[times.length] = cutime;
  cutime = [];
  console.log(times);
}

function datime(datetime: any){
  let date = new Date(datetime);
  let year = date.getFullYear(),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      sdate = ("0" + date.getDate()).slice(-2),
      hour = ("0" + date.getHours()).slice(-2),
      minute = ("0" + date.getMinutes()).slice(-2)
  return year + "-" + month + "-" + sdate + " " + hour + ":" + minute;

}

function deadFunction(){
  if (deadline.value == true){
    deadlineShow.value = true;
  }
}

function confirmDeadline(){
  console.log(deadlineTime);
  deadlineShow.value = false;

}
function submit(){
  ApiRequest("POST","poll/createNewPoll",{"title":title.value,"des":des.value,"location":location.value,"if_deadline":if_deadline,"deadline":deadlineTime.value,"if_hide":if_hide,"token":"623c42f6f708dbf9503c25da6a6aa9af","times":JSON.stringify(times)}).then(
      function (data){
        if (data.status == 200){
          let message = data.data.message;
          alert(message);
        }
      }
  );

}

</script>

<template>
  <van-popup v-model:show="deadlineShow" position="bottom" :style="{ height: '40%' }">
    <van-datetime-picker
        v-model="deadlineTime"
        type="datetime"
        title="DeadLine"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmDeadline"
    /></van-popup>
  <van-popup v-model:show="starte" position="bottom" :style="{ height: '40%' }">
    <van-datetime-picker
        v-model="startTime"
        type="datetime"
        title="Start Time"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="starts"
    />
  </van-popup>
  <van-popup v-model:show="stops" position="bottom" :style="{ height: '40%' }">
    <van-datetime-picker
        v-model="stopTime"
        type="datetime"
        title="Stop Time"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="stopss"
    />

  </van-popup>
  <div class="mdui-container">
    <div style="padding-top: 20px"></div>
    <div class="mdui-card" style="background-color: #FFFFFFAA">
      <h1 class="mdui-card-header">Create Group Poll</h1>
      <van-cell-group inset>
        <van-field v-model="title" required label="Title" placeholder="What's the occasion?" />
        <van-field v-model="des"  rows="5" type="textarea" autosize label="Description" placeholder="Here you can include things like an agenda,instructions,or other details" />
        <van-field v-model="location" required label="Location" placeholder="Where will this happen?" />
      </van-cell-group>
    </div>
    <div class="mdui-card" style="padding: 9px">

      <van-cell style="padding-top: 20px" center title="Set a deadline">
        <template #right-icon>
          <van-tag round size="large" type="success" v-if="deadline">{{datime(deadlineTime)}}</van-tag>
          <van-switch v-model="deadline" size="22" @change="deadFunction"/>
        </template>
      </van-cell>
      <van-cell center title="Hide participant list">
        <template #right-icon>
          <van-switch v-model="hide" size="20" />
        </template>
      </van-cell>
      <h3 style="padding-left: 5px">
        Add your times
      </h3>
      <p v-for="(items,ids) in times">
        <van-tag round size="large" type="primary">{{datime(items[0])}}-{{datime(items[1])}}</van-tag>
      </p>
      <van-button round type="success" @click="showPopup">Add a time</van-button>
    </div>
    <div style="padding-top: 10px"></div>
    <van-button type="primary" block @click="submit">Create</van-button>
  </div>
</template>



<style scoped>

</style>