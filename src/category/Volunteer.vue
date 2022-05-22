<template>
  <n-space style="padding-bottom: 10px; width: 100%" justify="space-between">
    <n-space>
      <n-input type="text" placeholder="搜索..." />
      <n-button tertiary type="primary">搜索</n-button>
    </n-space>
    <n-button tertiary type="info" @click="addVolunteer()">添加志愿者</n-button>
  </n-space>
  <n-data-table
    :columns="columns"
    :data="dataRef"
    :pagination="pagination"
    :style="{ height: `${height}px` }"
    @update:page="handlePageChange"
    flex-height
  />
  <n-modal
    v-model:show="showAddVolunteer"
    preset="dialog"
    title="添加志愿者"
    style="width: 700px;"
    :show-icon="false"
    :mask-closable="false"
    :closable="false"
  >
    <div>内容</div>
    <template #action>
      <n-space>
        <n-button @click="addVolunteerCancel()">取消</n-button>
        <n-button type="primary" @click="editVolunteerConfirm()">添加</n-button>
      </n-space>
    </template>
  </n-modal>
  <n-modal
    v-model:show="showEditVolunteer"
    preset="dialog"
    title="编辑志愿者"
    style="width: 700px;"
    :show-icon="false"
    :mask-closable="false"
    :closable="false"
  >
    <div>内容</div>
    <template #action>
      <n-space>
        <n-button @click="editVolunteerCancel()">取消</n-button>
        <n-button type="primary" @click="editVolunteerConfirm()">确认</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
<script setup>
import axios from "axios";
import { NDataTable, NSpace, NInput, NButton, NModal } from "naive-ui";
import { onMounted, ref, reactive, h } from "vue";

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
              console.log("edit" + row.id);
              editVolunteer(row.id);
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

const showAddVolunteer = ref(false);
const showEditVolunteer = ref(false);

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

function addVolunteer() {
  showAddVolunteer.value = true;
}

function addVolunteerConfirm() {

}

function addVolunteerCancel() {
  showAddVolunteer.value = false;
}

function editVolunteer(id) {
  showEditVolunteer.value = true;
}

function editVolunteerConfirm() {

}

function editVolunteerCancel() {
  showEditVolunteer.value = false;
}
</script>
<style></style>
