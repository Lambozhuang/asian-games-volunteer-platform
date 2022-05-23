<template>
  <n-config-provider :theme="theme">
    <n-loading-bar-provider>
      <n-message-provider>
        <router-view></router-view>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
<script setup>
import { RouterView } from "vue-router";
import {
  useOsTheme,
  darkTheme,
  NConfigProvider,
  NLoadingBarProvider,
  NMessageProvider,
} from "naive-ui";
import { computed } from "@vue/reactivity";

const osThemeRef = useOsTheme();
const theme = computed(() => (osThemeRef.value === "dark" ? darkTheme : null));
</script>
<style></style>
