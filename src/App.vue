<template>
  <n-config-provider :theme="theme">
    <router-view></router-view>
  </n-config-provider>
</template>
<script setup>
import { RouterView } from "vue-router";
import { useOsTheme, darkTheme, NConfigProvider } from "naive-ui";
import { computed } from "@vue/reactivity";

const osThemeRef = useOsTheme()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : null))



</script>
<style>

</style>
