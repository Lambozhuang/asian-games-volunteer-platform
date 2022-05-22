<template>
  <n-space style="padding-bottom: 10px; width: 100%" justify="space-between">
    <n-space>
      <n-input type="text" placeholder="搜索..." />
      <n-button tertiary type="primary">搜索</n-button>
    </n-space>
    <n-button tertiary type="info">添加志愿者</n-button>
  </n-space>
  <n-data-table
    :columns="columns"
    :data="dataRef"
    :pagination="pagination"
    :style="{ height: `${height}px` }"
    @update:page="handlePageChange"
    flex-height
  />
</template>
<script setup>
import axios from "axios";
import { NDataTable, NSpace, NInput, NButton } from "naive-ui";
import { onMounted, ref, reactive, h } from "vue";

// table
const columnsReactive = [
  {
    title: "编号",
    key: "id",
  },
  {
    title: "姓名",
    key: "name",
  },
  {
    title: "性别",
    key: "gender",
    render(row) {
      let gender = row.gender ? "男" : "女";
      return h("div", {}, gender);
    },
  },
  {
    title: "岗位",
    key: "job",
  },
  {
    title: "操作",
    key: "action",
    render(row) {
      return h("div", {}, [
        h(
          NButton,
          {
            ghost: true,
            style: "margin-right: 10px",
            onClick: () => {
              console.log("edit");
            },
          },
          {
            default: () => "编辑",
          }
        ),
        h(
          NButton,
          {
            type: "error",
            ghost: true,
            onClick: () => {
              console.log("delete");
            },
          },
          {
            default: () => "删除",
          }
        ),
      ]);
    },
  },
];
const columns = ref(columnsReactive);
const dataRef = ref([]);
const loading = ref(true);
const paginationReactive = reactive({
  page: 1,
  pageSize: 20,
});
const pagination = ref(paginationReactive);

// UI
const height = ref(document.documentElement.clientHeight - 180);

function changeHeight() {
  height.value = document.documentElement.clientHeight - 180;
}

onMounted(() => {
  // UI
  window.onresize = () => {
    changeHeight();
  };
  changeHeight();

  // axios for list
  query(paginationReactive.page, paginationReactive.pageSize).then((data) => {
    dataRef.value = data;
    console.log(data);
  });
});

function query(page, pageSize = 20) {
  let offset = page - 1;
  return new Promise(function (resolve, reject) {
    axios({
      method: "get",
      url: "/api/team/-1/volunteers",
      params: {
        offset: offset,
        "page-size": pageSize,
      },
    }).then(function (response) {
      if (response.data.code === 200) {
        console.log("成功获取志愿者列表");
        resolve(response.data.data);
      }
    });
  });
}

function handlePageChange(currentPage) {
  if (!loading.value) {
    loading.value = true;
    query(currentPage, paginationReactive.pageSize).then((data) => {
      dataRef.value = data;
      paginationReactive.page = currentPage;
      loading.value = false;
    });
  }
}
</script>
<style></style>
