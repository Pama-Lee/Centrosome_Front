<template>
  <van-notice-bar mode="closeable">Welcome to Centrosome!</van-notice-bar>
  <h1 style="text-align: center;color: rgb(52,52,52)">Start by creating your first Centro</h1>
  <van-button type="primary" size="large" to="createGroupPoll">+ Group Poll</van-button>
  <van-divider />
  <Polls></Polls>
</template>

<script lang="ts" setup>
import Polls from "./Polls.vue";
</script>