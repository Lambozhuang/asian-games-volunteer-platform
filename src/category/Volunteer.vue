<template>
  <n-space style="padding-bottom: 10px; width: 100%" justify="space-between">
    <n-space>
      <n-input type="text" placeholder="搜索..." />
      <n-button tertiary type="primary">搜索</n-button>
    </n-space>
    <n-button tertiary type="info" @click="addVolunteer()">添加志愿者</n-button>
  </n-space>
  <n-data-table
    remote
    :columns="columns"
    :data="dataRef"
    :loading="loading"
    :pagination="paginationReactive"
    :style="{ height: `${height}px` }"
    @update:page="handlePageChange"
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
    <volunteer-form type="add" @dismiss="dismissModal" />
  </n-modal>
  <n-modal
    v-model:show="showEditVolunteer"
    preset="dialog"
    title="编辑志愿者"
    style="width: 600px"
    :show-icon="false"
    :auto-focus="false"
    :mask-closable="false"
    :closable="false"
  >
    <volunteer-form type="edit" @dismiss="dismissModal" :data="selectedData" />
  </n-modal>
</template>
<script setup>
import axios from "axios";
import {
  NDataTable,
  NSpace,
  NInput,
  NButton,
  NModal,
  NForm,
  NGrid,
  useLoadingBar,
  useMessage,
} from "naive-ui";
import { onMounted, ref, reactive, h } from "vue";
import VolunteerForm from "./VolunteerForm.vue";

// data
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
              console.log("edit " + row.id);
              editVolunteer(row);
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
const paginationReactive = ref({
  page: 1,
  pageCount: 1,
  pageSize: 20,
  itemCount: 0,
});

const showAddVolunteer = ref(false);
const showEditVolunteer = ref(false);

const selectedData = ref({});

// UI
const height = ref(document.documentElement.clientHeight - 180);

const message = useMessage();

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
  query(paginationReactive.value.page, paginationReactive.value.pageSize).then(
    (data) => {
      dataRef.value = data.volunteers;
      paginationReactive.value.pageCount = data.pageCount;
      paginationReactive.value.itemCount = data.itemCount;
      loading.value = false;
      console.log(data);
      console.log(paginationReactive.value);
    }
  );
});

function query(page, pageSize = 20) {
  let offset = (page - 1) * pageSize;
  return new Promise(function (resolve, reject) {
    axios({
      method: "get",
      url: "/api/team/-1/volunteers",
      params: {
        offset: offset,
        "page-size": pageSize,
      },
    }).then(function (response) {
      if (response.data.code === 0) {
        console.log("成功获取志愿者列表");
        const data = response.data.data;
        data.itemCount = response.data.data.num;
        data.pageCount = (data.itemCount - 1) / pageSize;
        resolve(response.data.data);
      }
    });
  });
}

function handlePageChange(currentPage) {
  console.log(currentPage);
  console.log(loading.value);
  if (!loading.value) {
    loading.value = true;
    query(currentPage, paginationReactive.value.pageSize).then((data) => {
      dataRef.value = data.volunteers;
      paginationReactive.value.page = currentPage;
      paginationReactive.value.pageCount = data.pageCount;
      paginationReactive.value.itemCount = data.itemCount;
      loading.value = false;
    });
  }
}

function addVolunteer() {
  showAddVolunteer.value = true;
}

function editVolunteer(data) {
  selectedData.value = data;
  showEditVolunteer.value = true;
}

function dismissModal(status) {
  console.log(status);
  if (status === "add") {
    message.success("添加成功");
  } else if (status === "edit") {
    message.success("修改成功");
  }
  showAddVolunteer.value = false;
  showEditVolunteer.value = false;
}
</script>
<style></style>
