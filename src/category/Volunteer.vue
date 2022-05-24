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
  useDialog,
} from "naive-ui";
import { onMounted, ref, reactive, h } from "vue";
import VolunteerForm from "./VolunteerForm.vue";

// data
const columnsReactive = [
  {
    title: "编号",
    key: "id",
    width: 60,
  },
  {
    title: "姓名",
    key: "name",
  },
  {
    title: "身份证号",
    key: "id_number",
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "性别",
    key: "gender",
    width: 60,
    render(row) {
      let gender = row.gender ? "男" : "女";
      return h("div", {}, gender);
    },
  },
  {
    title: "联系方式",
    key: "tel",
  },
  {
    title: "志愿",
    key: "intention",
  },
  {
    title: "岗位",
    key: "job",
  },
  {
    title: "状态",
    key: "status",
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
              console.log("delete " + row.id);
              deleteVolunteer(row);
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
const dialog = useDialog();

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

function deleteVolunteer(data) {
  data.team_id = data.team_id == null ? -1 : data.team_id;
  dialog.error({
    title: "警告",
    content: "删除后将无法恢复",
    positiveText: "确认删除",
    negativeText: "取消",
    onPositiveClick: () => {
      loading.value = true;
      axios({
        method: "delete",
        url: "/api/team/" + data.team_id + "/volunteer/" + data.id,
      })
        .then((response) => {
          if (response.data.code === 0) {
            message.success("删除成功");
            console.log("删除成功");
            location.reload();
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
