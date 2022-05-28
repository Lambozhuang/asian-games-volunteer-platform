<template>
  <n-space style="padding-bottom: 10px; width: 100%" justify="space-between">
    <n-button tertiary type="primary" @click="refreshTable"> 刷新 </n-button>
    <n-button tertiary type="info" @click="addJob">添加岗位</n-button>
  </n-space>
  <n-data-table
    :columns="columns"
    :data="dataRef"
    :pagination="pagination"
    :style="{ height: `${height}px` }"
    :loading="loading"
    flex-height
  />
  <n-modal
    v-model:show="showAddJob"
    preset="dialog"
    title="添加岗位"
    style="width: 600px"
    :show-icon="false"
    :mask-closable="false"
    :closable="false"
  >
    <job-form type="add" @dismiss="dismissModal" />
  </n-modal>
  <n-modal
    v-model:show="showEditJob"
    preset="dialog"
    title="编辑岗位"
    style="width: 600px"
    :show-icon="false"
    :mask-closable="false"
    :closable="false"
  >
    <job-form type="edit" @dismiss="dismissModal" :data="selectedData" />
  </n-modal>
</template>
<script setup>
import {
  NDataTable,
  NSpace,
  NInput,
  NButton,
  NModal,
  useLoadingBar,
  useDialog,
  useMessage,
} from "naive-ui";
import { ref, onMounted, h } from "vue";
import axios from "axios";
import JobForm from "./JobForm.vue";
import common from "../Common.vue";

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
    title: "工作地点",
    key: "location",
  },
  {
    title: "详细信息",
    key: "content",
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
              editJob(row);
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
              deleteJob(row);
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
const selectedData = ref({});

// UI
const height = ref(document.documentElement.clientHeight - 180);
const loading = ref(true);
const showAddJob = ref(false);
const showEditJob = ref(false);
const loadingBar = useLoadingBar();
const dialog = useDialog();
const message = useMessage();

onMounted(() => {
  window.onresize = () => {
    changeHeight();
  };
  changeHeight();

  // axios for list
  query(pagination.value.page, pagination.value.pageSize).then((data) => {
    dataRef.value = data.jobs;
    pagination.value.pageCount = data.pageCount;
    pagination.value.itemCount = data.itemCount;
    loading.value = false;
    console.log(data);
    console.log(pagination.value);
  });
});

function changeHeight() {
  height.value = document.documentElement.clientHeight - 180;
}

function query(page, pageSize = 20) {
  let offset = (page - 1) * pageSize;
  return new Promise(function (resolve, reject) {
    axios({
      method: "get",
      url: "/api/team/" + common.userinfo.team_id + "/jobs",
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
        data.jobs = data.jobs == null ? [] : data.jobs;
        resolve(data);
      } else if (response.data.code === 404) {
        console.log("岗位无数据");
        let data = {
          num: 0,
          jobs: [],
        };
        resolve(data);
      }
    });
  });
}

function refreshTable() {
  loading.value = true;
  loadingBar.start();
  pagination.value = {
    page: 1,
    pageCount: 1,
    pageSize: 20,
    itemCount: 0,
  };
  query(pagination.value.page, pagination.value.pageSize).then((data) => {
    loadingBar.finish();
    dataRef.value = data.jobs;
    pagination.value.pageCount = data.pageCount;
    pagination.value.itemCount = data.itemCount;
    loading.value = false;
    console.log(data);
    console.log(pagination.value);
  });
}

function addJob() {
  showAddJob.value = true;
}

function editJob(data) {
  selectedData.value = data;
  showEditJob.value = true;
}

function deleteJob(data) {
  data.team_id = data.team_id == null ? -1 : data.team_id;
  dialog.error({
    title: "警告",
    content: "删除后将无法恢复",
    positiveText: "确认删除",
    negativeText: "取消",
    onPositiveClick: () => {
      loading.value = true;
      loadingBar.start();
      axios({
        method: "delete",
        url: "/api/team/" + data.team_id + "/job/" + data.id,
      })
        .then((response) => {
          if (response.data.code === 0) {
            loadingBar.finish();
            message.success("删除成功");
            console.log("删除成功");
            setTimeout(() => {
              location.reload();
            }, 300);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onNegativeClick: () => {},
  });
}

function dismissModal(status) {
  loading.value = true;
  loadingBar.start();
  query(pagination.value.page, pagination.value.pageSize).then((data) => {
    dataRef.value = data.jobs;
    pagination.value.pageCount = data.pageCount;
    pagination.value.itemCount = data.itemCount;
    loading.value = false;
    loadingBar.finish();
    console.log(data);
    console.log(pagination.value);
  });
  if (status === "add") {
    message.success("添加成功");
  } else if (status === "edit") {
    message.success("修改成功");
  }
  showAddJob.value = false;
  showEditJob.value = false;
}
</script>
<style></style>
