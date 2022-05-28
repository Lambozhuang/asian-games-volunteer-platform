<template>
  <n-space style="padding-bottom: 10px; width: 100%" justify="space-between">
    <n-button tertiary type="primary" @click="refreshTable"> 刷新 </n-button>
    <n-button tertiary type="info" @click="addTeam">添加团队</n-button>
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
    v-model:show="showAddTeam"
    preset="dialog"
    title="添加团队"
    style="width: 600px"
    :show-icon="false"
    :mask-closable="false"
    :closable="false"
  >
    <team-form type="add" @dismiss="dismissModal" />
  </n-modal>
  <n-modal
    v-model:show="showEditTeam"
    preset="dialog"
    title="编辑团队"
    style="width: 600px"
    :show-icon="false"
    :mask-closable="false"
    :closable="false"
  >
    <team-form type="edit" @dismiss="dismissModal" :data="selectedData" />
  </n-modal>
</template>
<script setup>
import {
  NDataTable,
  NSpace,
  NButton,
  NModal,
  useLoadingBar,
  useDialog,
  useMessage,
} from "naive-ui";
import { ref, onMounted, h } from "vue";
import axios from "axios";
import teamForm from "./TeamForm.vue";

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
              editTeam(row);
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
              deleteTeam(row);
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
const showAddTeam = ref(false);
const showEditTeam = ref(false);
const loadingBar = useLoadingBar();
const message = useMessage();
const dialog = useDialog();

onMounted(() => {
  window.onresize = () => {
    changeHeight();
  };
  changeHeight();

  // axios for list
  query(pagination.value.page, pagination.value.pageSize).then((data) => {
    dataRef.value = data.teams;
    pagination.value.pageCount = data.pageCount;
    pagination.value.itemCount = data.itemCount;
    loading.value = false;
    console.log(data);
    console.log(pagination.value);
  });
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
      url: "/api/teams",
      params: {
        offset: offset,
        "page-size": pageSize,
      },
    }).then(function (response) {
      if (response.data.code === 0) {
        console.log("成功获取团队列表");
        console.log(response.data.data);
        let data = response.data.data;
        data.itemCount = response.data.data.num;
        data.pageCount = Math.round((data.itemCount - 1) / pageSize);
        data.teams = data.teams == null ? [] : data.teams;
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
    dataRef.value = data.teams;
    pagination.value.pageCount = data.pageCount;
    pagination.value.itemCount = data.itemCount;
    loading.value = false;
    console.log(data);
    console.log(pagination.value);
  });
}

function addTeam() {
  showAddTeam.value = true;
}

function editTeam(data) {
  selectedData.value = data;
  showEditTeam.value = true;
}

function deleteTeam(data) {
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
        url: "/api/team/" + data.id + "/",
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
    dataRef.value = data.teams;
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
  showAddTeam.value = false;
  showEditTeam.value = false;
}
</script>
<style></style>
