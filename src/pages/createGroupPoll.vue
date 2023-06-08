<script setup lang="ts">

import {ref} from "vue";
import {ApiRequest} from "../units/api";
import { useCookies } from "vue3-cookies";
import { showDialog } from "vant";

const { cookies } = useCookies();

// 最小开始时间和最大时间
let minDate = new Date();
let maxDate = new Date(2025, 10, 1);


// 是否显示deadline时间窗口
let deadlineShow = ref(false);
// 是否隐藏其他参与者
let hide = ref(true);

let deadline = ref(false);


const guest = ref(false);


const deadlineTime = {
  date: ref(),
  time: ref()
}


const tmp = {
  date: ref([]),
  startTime: ref([]),
  stopTime: ref([])
}

const allTime: any = ref([]);
const show = ref(false);

const switchShow = () => {
  show.value = !show.value;
}


const text = ref('');
let title = ref();
let des = ref()
let location = ref();

function starts(){
  // 检查是否有相同的时间段
  for (let i = 0, len = allTime.value.length; i < len; i++) {
    if (allTime.value[i].startTime == tmp.startTime.value && allTime.value[i].stopTime == tmp.stopTime.value && allTime.value[i].date == tmp.date.value){
      showDialog({
        title: "Notice",
        message: "The same time period cannot be added",
      });
      return;
    }
  }

  // 如果开始时间大于结束时间
  if (tmp.startTime.value[0] > tmp.stopTime.value[0]) {
    showDialog({
      title: "Notice",
      message: "Start time cannot be greater than end time",
    });
    return;
  }
  if (tmp.startTime.value[0] === tmp.stopTime.value[0] && tmp.startTime.value[1] >= tmp.stopTime.value[1]) {
    showDialog({
      title: "Notice",
      message: "Start time cannot be greater than end time",
    });
    return;
  }
  let dto: any = {
    date: tmp.date.value,
    startTime: tmp.startTime.value,
    stopTime: tmp.stopTime.value
  }
  show.value = false;
  allTime.value.push(dto);
}

// function date_time(datetime: any){
//   let date = new Date(datetime);
//   let year = date.getFullYear(),
//       month = ("0" + (date.getMonth() + 1)).slice(-2),
//       sdate = ("0" + date.getDate()).slice(-2),
//       hour = ("0" + date.getHours()).slice(-2),
//       minute = ("0" + date.getMinutes()).slice(-2)
//   return year + "-" + month + "-" + sdate + " " + hour + ":" + minute;

// }

function renderDate(date: [number, number, number]) {
  const year = date[0];
  const month = date[1];
  const day = date[2];
  return `${year}-${month}-${day}[${getWeek(date)}]`;
}

// 获取星期几
function getWeek(date: [number, number, number]) {
  const weekMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const year = date[0];
  const month = date[1];
  const day = date[2];
  // 根据日期获取星期几
  const week = new Date(year, month-1, day).getDay();
  return weekMap[week];
}

function renderTime(time1: [number, number], time2: [number, number]) {
  const hour1 = time1[0];
  const minute1 = time1[1];
  const hour2 = time2[0];
  const minute2 = time2[1];
  return `${hour1}:${minute1} - ${hour2}:${minute2}`;
}

function renderDeadlineTime(time: [number, number]) {
  const hour = time[0];
  const minute = time[1];
  return `${hour}:${minute}`;
}


function deadFunction(){

  if (deadline.value == true){
    deadlineShow.value = true;
  }
}

function confirmDeadline(){
  deadlineShow.value = false;
}

function submit(){

  ApiRequest("POST","poll/createNewPoll",{"title":title.value,"des":des.value,"location":location.value,"if_deadline":(deadline.value)?1:0,'allow_guest':(guest.value)?1:0,"deadline":JSON.stringify({
  date: deadlineTime.date.value,
  time: deadlineTime.time.value
}),"if_hide":(hide.value)?1:0,"token":cookies.get("token"),"times":JSON.stringify(allTime.value)}).then(
      function (data){
        if (data.data.code == 200){
          showDialog({
            title: "Notice",
            message: "Create successfully",
          }).then(() => {
            // 返回上一页
            window.history.back();
          });
        } else {
          showDialog({
            title: "Notice",
            message: data.data.message,
          });
        }
      }
  );

}

function delete_time(ids: any){
  allTime.value.splice(ids,1);
}

const deadlineConfirm = () => {
  console.log(deadlineTime);
  deadlineShow.value = false;
}

const openDeadline = () => {
  deadlineShow.value = true;
}

const deleteTime = (item: any) => {
  allTime.value.splice(allTime.value.indexOf(item), 1);
}

</script>

<template>
  <van-popup v-model:show="deadlineShow" position="bottom" :style="{ height: '50%' }">
    <van-picker-group
  title="Deadline"
  :tabs="['Date', 'Time']"
  next-step-text="Next"
  :min-date="minDate"
  :max-date="maxDate"
  @confirm="deadlineConfirm"
  confirm-button-text="Confirm"
  cancel-button-text="Cancel"
>
  <van-date-picker
    v-model="deadlineTime.date.value"
    :min-date="minDate"
    :max-date="maxDate"
    cancel-button-text="Cancel"
    confirm-button-text="Confirm"
  />
  <van-time-picker v-model="deadlineTime.time.value" />
</van-picker-group>
</van-popup>
  <van-popup v-model:show="show" position="bottom" :style="{ height: '50%' }">
    <van-picker-group
  title="预约日期"
  :tabs="['选择日期', '选择开始时间', '选择结束时间']"
  next-step-text="下一步"
  :min-date="minDate"
        :max-date="maxDate"
  @confirm="starts"
>
  <van-date-picker
    v-model="tmp.date.value"
    :min-date="minDate"
    :max-date="maxDate"
  />
  <van-time-picker v-model="tmp.startTime.value" />
  <van-time-picker v-model="tmp.stopTime.value" />
</van-picker-group>
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
          <van-switch v-model="deadline" size="22" @change="deadFunction"/>
        </template>
      </van-cell>
      <van-cell v-if="deadline&&deadlineTime.date?.value&&deadlineTime.time?.value" :title="renderDate(deadlineTime.date?.value)" :value="renderDeadlineTime(deadlineTime.time?.value)"/>
      <van-cell center title="Hide participant list">
        <template #right-icon>
          <van-switch v-model="hide" size="20" />
        </template>
      </van-cell>
      <van-cell center title="Allow Guest">
        <template #right-icon>
          <van-switch v-model="guest" size="20" />
        </template>
      </van-cell>
      <h3 style="padding-left: 5px">
        Add your times
      </h3>
      <p v-for="item in allTime">
        <van-swipe-cell>
          <van-cell :title="renderDate(item.date)" :value="renderTime(item.startTime, item.stopTime)" />
  <template #right>
    <van-button square text="Delete" type="danger" class="delete-button" @click="deleteTime(item)" />
  </template>
</van-swipe-cell>
        
      </p>
      <van-button round type="success" @click="switchShow">Add a time</van-button>
    </div>
    <div style="padding-top: 10px"></div>
    <van-button type="primary" block @click="submit">Create</van-button>
  </div>
</template>
