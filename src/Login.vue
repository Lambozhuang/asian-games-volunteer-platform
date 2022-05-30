<template>
  <n-layout
    position="absolute"
    style="height: 100%; display: flex; justify-content: center"
  >
    <n-card
      style="
        min-width: 600px;
        max-width: 600px;
        padding: 20px 20px 20px 20px;
        margin-top: 100px;
      "
    >
      <n-grid cols="10" :x-gap="12">
        <n-grid-item span="5">
          <n-space vertical align="start">
            <div class="login-title">志愿者管理平台</div>
            <div class="login-description1">2022杭州亚运会</div>
            <div class="login-description2">管理员登录入口</div>
          </n-space>
        </n-grid-item>
        <n-grid-item span="5">
          <n-space vertical align="center" justify="center">
            <n-input
              class="login-input"
              type="text"
              placeholder="用户"
              v-model:value="userName"
            ></n-input>
            <n-input
              class="login-input"
              type="password"
              show-password-on="mousedown"
              placeholder="密码"
              v-model:value="password"
            ></n-input>
            <n-button class="login-button" type="primary" @click="login">
              登录
            </n-button>
          </n-space>
        </n-grid-item>
      </n-grid>
    </n-card>
  </n-layout>
</template>

<script setup>
import { ref } from "vue";
import {
  NButton,
  NInput,
  NSpace,
  NCard,
  NLayout,
  NGrid,
  NGridItem,
} from "naive-ui";
import { useRouter } from "vue-router";
import axios from "axios";
import common from "./Common.vue";

let userName = ref("");
let password = ref("");

const router = useRouter();

function login() {
  console.log(userName.value);
  console.log(password.value);

  axios({
    method: "post",
    url: "/api/v1/login",
    data: {
      username: userName.value,
      password: password.value,
    },
  })
    .then(function (response) {
      if (response.data.code === 0) {
        console.log("登录成功");
        common.userinfo.username = userName.value;
        router.push({ name: "index" });
      }
    })
    .catch(function (error) {
      console.log("登录失败");
      console.log(error);
    });
}
</script>

<style>
.login-button,
.login-input {
  min-width: 200px;
  max-width: 200px;
}

.login-title {
  font-size: 20px;
  font-weight: bolder;
}

.login-title,
.login-description1,
.login-description2 {
  max-width: 250px;
}

.login-description1 {
  color: rgb(33, 199, 255);
}
</style>
