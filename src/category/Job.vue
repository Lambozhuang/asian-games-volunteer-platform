<template>
  <n-space style="padding-bottom: 10px; width: 100%" justify="space-between">
    <n-button tertiary type="primary" @click="refreshTable()"> 刷新 </n-button>
    <n-button tertiary type="info">添加岗位</n-button>
  </n-space>
  <n-data-table
    :columns="columns"
    :data="dataRef"
    :pagination="pagination"
    :style="{ height: `${height}px` }"
    flex-height
  />
  <n-modal
    v-model:show="showAddVolunteer"
    preset="dialog"
    title="添加志愿者"
    style="width: 600px"
    :show-icon="false"
    :mask-closable="false"
    :closable="false"
  >
    <job-form @dismiss="dismissModal" />
  </n-modal>
</template>
<script setup>
import { NDataTable, NSpace, NInput, NButton, NModal } from "naive-ui";
import { ref, onMounted } from "vue";
import JobForm from "./JobForm.vue";

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
    title: "详细信息",
    key: "content",
  },
  {
    title: "工作地点",
    key: "location",
  },
  {
    title: "操作",
    key: "action",
    width: 160,
    render(row) {
      return h("div", {}, [
        h(
          NButton,
          {
            ghost: true,
            style: "margin-right: 10px",
            onClick: () => {
              console.log("edit " + row.id);
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
              console.log("delete " + row.id);
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

function query(page, pageSize = 20) {
  let offset = (page - 1) * pageSize;
  return new Promise(function (resolve, reject) {
    axios({
      method: "get",
      url: "/api/team/-1/jobs",
      params: {
        offset: offset,
        "page-size": pageSize,
      },
    }).then(function (response) {
      if (response.data.code === 0) {
        console.log("成功获取岗位列表");
        console.log(response.data.data);
        let data = response.data.data;
        data.itemCount = response.data.data.num;
        data.pageCount = Math.round((data.itemCount - 1) / pageSize);
        resolve(data);
      }
    });
  });
}
</script>
<style></style>
