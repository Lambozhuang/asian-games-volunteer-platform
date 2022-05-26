<template>
  <n-layout
    class="layout-container"
    position="absolute"
    style="height: 100%"
    has-sider
  >
    <n-layout-sider
      bordered
      content-style="padding: 15px"
      :native-scrollbar="false"
    >
      <n-space vertical align="center" justify="center">
        <n-h1>志愿者管理平台</n-h1>
      </n-space>
      <n-menu
        :options="menuOptions"
        :default-value="state"
        @update:value="handleMenuUpdate"
      />
    </n-layout-sider>
    <n-layout style="min-width: 1100px">
      <n-layout-header bordered>
        <n-space justify="space-between">
          <n-h3>{{ stateName }}</n-h3>
          <n-space justify="space-between" align="center">
            欢迎，{{ username }}
            <n-button tertiary type="error" size="small" @click="logout"
              >注销</n-button
            >
          </n-space>
        </n-space>
      </n-layout-header>
      <n-layout-content
        content-style="padding: 20px"
        embedded
        :native-scrollbar="false"
      >
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import axios from "axios";
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NMenu,
  NButton,
  NSpace,
  NH1,
  NH2,
  NH3,
} from "naive-ui";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import userinfo from "./Common.vue";

const menuOptions = ref([
  {
    label: "志愿者管理",
    key: "volunteer",
  },
  {
    label: "岗位管理",
    key: "job",
  },
  {
    label: "团队管理",
    key: "team",
  },
]);

const username = ref(userinfo.username);

const router = useRouter();
const route = useRoute();

const state = computed(
  () => route.path.split("/")[route.path.split("/").length - 1]
);

const stateName = computed(() => {
  switch (state.value) {
    case "volunteer":
      return "志愿者管理";
    case "job":
      return "岗位管理";
    case "team":
      return "团队管理";
  }
});

onMounted(() => {
  axios({
    method: "get",
    url: "/api/info",
  })
    .then((response) => {
      if (response.data.code === 0) {
        console.log("身份已验证");
        userinfo.username = response.data.data.username;
        userinfo.root = response.data.data.is_root;
      } else {
        console.log("未登录");
        router.replace({ name: "login" });
      }
    })
    .catch((error) => {
      console.log(error);
      router.replace({ name: "login" });
    });
});

function handleMenuUpdate(key, item) {
  switch (key) {
    case "volunteer":
      router.replace("/index/volunteer");
      break;
    case "job":
      router.replace("/index/job");
      break;
    case "team":
      router.replace("/index/team");
      break;
  }
}

function logout() {
  router.replace("/login");
}
</script>
<style>
.n-layout-header {
  padding: 20px;
}

.n-h3 {
  margin: 0;
  padding: 0;
}
</style>
