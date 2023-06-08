<template>
  <div>
    <van-button type="primary" block @click="addContact">Add</van-button>
    <van-list v-model:loading="loading" :finished="finished" finished-text="Nothing more" @load="onLoad"
      style="padding-top: 20px;">
      <van-cell-group>


        <van-swipe-cell v-for="item in list" :key="item.tid">
          <van-cell :title="item.name" />
          <template #right>
            <van-button square text="Delete" type="danger" class="delete-button" @click="deleteContact(item)" />
          </template>
        </van-swipe-cell>
      </van-cell-group>
    </van-list>
    <van-dialog v-model:show="show" title="Add Contact" confirm-button-text="Add" cancel-button-text="Cancel"
      show-cancel-button :before-close="confirmAdd">
      <van-field v-model="name" type="text" label="Name" placeholder="Contact Name" />
      <van-field required v-model="add" type="email" label="Email" placeholder="Please type in contact email" />
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
// 联系人页面
import { ref } from "vue";
import { useCookies } from "vue3-cookies";
import contact from "../service/contact";
import { showToast } from 'vant';


const { cookies } = useCookies();
const loading = ref(false);
const finished = ref(false);
const list: any = ref([]);
const show = ref(false);
const add = ref();
const name = ref();


const onLoad = async () => {
  // 获取联系人列表
  loading.value = true;
  const res = await contact.getContactList(cookies.get("token"));
  if (res.data.code === 200) {
    console.log(res)
    list.value = res.data.data;
  }
  loading.value = false;
  finished.value = true;
};

// 弹出添加联系人对话框
const addContact = () => {
  show.value = true;
};

const confirmAdd = (action: any) => {
  // 如果是取消，直接返回
  if (action === "cancel") {
    return true;
  }

  // 检查邮箱格式, 利用正则表达式
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (!reg.test(add.value)) {
    showToast({
      message: 'Invalid Email',
      position: 'top',
    });
    return false;
  }
  // 添加联系人
  contact.addContact(cookies.get("token"), add.value, name.value).then((res) => {
    if (res.data.code === 200 || res.data.code === '200') {
      add.value = "";
      show.value = false;
      onLoad();
      return true;
    } else {
      // 拦截
      showToast({
        message: 'Add Contact Failed:' + res.data.message,
        position: 'top',
      });
      return false;
    }
  });

};

const deleteContact = (item: any) => {
  contact.deleteContact(cookies.get("token"), item.tid).then((res) => {
    if (res.data.code === 200 || res.data.code === '200') {
      onLoad();
      return true;
    } else {
      // 拦截
      showToast({
        message: 'Delete Contact Failed:' + res.data.message,
        position: 'top',
      });
    }
  });
};


</script>