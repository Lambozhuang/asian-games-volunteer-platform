<template>
  <n-space style="padding-bottom: 10px; width: 100%" justify="space-between">
    <n-button
      tertiary
      type="primary"
      @click="refreshTable"
    >
      刷新
    </n-button>
    <n-button tertiary type="info">添加团队</n-button>
  </n-space>
  <n-data-table
    :columns="columns"
    :data="dataRef"
    :pagination="pagination"
    :style="{ height: `${height}px` }"
    flex-height
  />
</template>
<script setup>
import { NDataTable, NSpace, NInput, NButton } from "naive-ui";
import { ref, onMounted } from "vue";

const columnsReactive = [
  {
    title: "编号",
    key: "id",
    width: 60,
  },
  {
    title: "名称",
    key: "name",
  },
  {
    title: "组织",
    key: "organization",
  },
  {
    title: "邀请码",
    key: "code",
    width: 100,
  },
];

const columns = ref(columnsReactive);
const dataRef = ref([]);
const pagination = ref({
  page: 1,
  pageSize: 20,
  itemCount: 0,
});

const height = ref(document.documentElement.clientHeight - 180);

onMounted(() => {
  window.onresize = () => {
    changeHeight();
  };
  changeHeight();
});

function changeHeight() {
  height.value = document.documentElement.clientHeight - 180;
  console.log(document.documentElement.clientHeight);
  console.log(height.value);
}
</script>
<style></style>
