<template>
<div>
  <van-skeleton title avatar :row="10" :loading="loading">
  <div class="mdui-container">
    <div class="info">
      <van-cell-group>
  <van-cell title="Name" :value="userInfo.name" />
  <van-cell title="Student ID" :value="userInfo.id" />
  <van-cell title="Email" :value="userInfo.email" label="If You want to edit it , please contact to admin" />
</van-cell-group>
      </div>
  </div>
</van-skeleton>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCookies } from "vue3-cookies";
import user from "../service/user";
import { showDialog } from "vant";


// 进入页面时
const { cookies } = useCookies();
const token = cookies.get("token");
const userInfo = ref({
  email:"",
  name:"",
  id:""
});
const loading = ref(true);


const getUserInfo = async () => {
  const res = await user.getUserInfo(token);
  if (res.data.code === 200) {
    userInfo.value = res.data.data;
    loading.value = false;
  } else {
    showDialog({
      title: "Notice",
      message: "Fetch user info failed",
    })
  }
};

if (loading) {
  getUserInfo();
}

</script>
