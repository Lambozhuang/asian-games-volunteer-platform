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
      title: "姓名",
      key: "name",
    },
    {
      title: "年龄",
      key: "age",
    },
    {
      title: "岗位",
      key: "job",
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
