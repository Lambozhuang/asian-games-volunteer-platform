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
        :value="state"
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
import common from "./Common.vue";

const menuOptions = ref([]);
const username = ref(common.userinfo.username);

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
    case "myTeam":
      return "我的团队";
  }
});

const createMenuOptions1 = [
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
];
const createMenuOptions2 = [
  {
    label: "志愿者管理",
    key: "volunteer",
  },
  {
    label: "岗位管理",
    key: "job",
  },
  {
    label: "我的团队",
    key: "myTeam",
  },
];
onMounted(() => {
  axios({
    method: "get",
    url: "/api/info",
  })
    .then((response) => {
      if (response.data.code === 0) {
        console.log("身份已验证");
        common.userinfo.username = response.data.data.username;
        common.userinfo.is_root = response.data.data.is_root;
        common.userinfo.team_id =
          response.data.data.team_id === null ? -1 : response.data.data.team_id;
        if (response.data.data.is_root) {
          menuOptions.value = createMenuOptions1;
        } else {
          menuOptions.value = createMenuOptions2;
        }
        console.log(menuOptions.value);
        username.value = common.userinfo.username;

        router.replace("/index/volunteer");
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
    case "myTeam":
      router.replace("/index/myTeam");
      break;
  }
}

function logout() {
  delCookie();
  router.replace("/login");
}

function delCookie() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }
  if (cookies.length > 0) {
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      var domain = location.host.substr(location.host.indexOf("."));
      document.cookie =
        name +
        "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" +
        domain;
    }
  }
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
