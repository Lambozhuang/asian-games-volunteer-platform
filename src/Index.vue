<template>
  <n-layout
    class="layout-container"
    position="absolute"
    style="height: 100%"
    has-sider
  >
    <n-layout-sider
      bordered
      content-style="padding: 20px"
      :native-scrollbar="false"
    >
      <n-h2>志愿者管理平台</n-h2>
      <n-divider />
      <n-space justify="space-between" align="center">
        <n-h3>欢迎，管理员xxx</n-h3>
        <n-button tertiary type="error" @click="logout()">注销</n-button>
      </n-space>
      <n-divider />
      <n-menu
        :options="menuOptions"
        :default-value="state"
        @update:value="handleMenuUpdate"
      />
    </n-layout-sider>
    <n-layout style="min-width: 600px">
      <n-layout-header bordered>
        <n-h3>{{ stateName }}</n-h3>
      </n-layout-header>
      <n-layout-content embedded :native-scrollbar="false">
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NDivider,
  NMenu,
  NButton,
  NSpace,
  NH1,
  NH2,
  NH3,
} from "naive-ui";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
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
.n-h2,
.n-h3 {
  margin: 0;
  padding: 0;
}
</style>
