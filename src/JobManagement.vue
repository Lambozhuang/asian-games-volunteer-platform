<template>
  <n-data-table :columns="columns" :data="tableData" :bordered="false" />
</template>
<script setup>
import { NDataTable } from "naive-ui";
import { ref } from "vue";

const createColumns = () => {
  return [
    {
      title: "编号",
      key: "no",
    },
    {
      title: "名称",
      key: "name",
    },
    {
      title: "详细信息",
      key: "age",
    },
    {
      title: "操作",
      key: "actions",
    },
  ];
};

const columns = ref(createColumns());
</script>
<style></style>