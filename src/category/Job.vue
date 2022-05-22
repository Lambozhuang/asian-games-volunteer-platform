<template>
  <n-space style="padding-bottom: 10px; width: 100%" justify="space-between">
    <n-space>
      <n-input type="text" placeholder="搜索..." />
      <n-button tertiary type="primary">搜索</n-button>
    </n-space>
    <n-button tertiary type="info">添加岗位</n-button>
  </n-space>
  <n-data-table
    :columns="columns"
    :data="data"
    :row-props="rowProps"
    :pagination="pagination"
    :style="{ height: `${height}px` }"
    flex-height
  />
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="x"
    :y="y"
    :options="options"
    :show="showDropdown"
    :on-clickoutside="onClickoutside"
    @select="handleSelect"
  />
</template>
<script setup>
import { NDataTable, NSpace, NInput, NButton, NDropdown } from "naive-ui";
import { ref, onMounted, nextTick } from "vue";

const columnsReactive = [
  {
    title: "编号",
    key: "id",
  },
  {
    title: "名称",
    key: "name",
  },
  {
    title: "详细信息",
    key: "content",
  },
];
const createData = () => {
  return [];
};
const columns = ref(columnsReactive);
const data = ref(createData());
const pagination = ref({
  pageSize: 20,
});

const options = [
  {
    label: "编辑",
    key: "edit",
  },
  {
    label: () => h("span", { style: { color: "red" } }, "删除"),
    key: "delete",
  },
];
const showDropdown = ref(false);
const x = ref(0);
const y = ref(0);

let currentSelectRow = null;

function handleSelect(e) {
  console.log(currentSelectRow.name);
  console.log(e);

  currentSelectRow = null;
  showDropdown.value = false;
}

function onClickoutside() {
  showDropdown.value = false;
}

const rowProps = ref((row) => {
  return {
    onContextmenu: (e) => {
      currentSelectRow = row;
      e.preventDefault();
      showDropdown.value = false;
      nextTick().then(() => {
        showDropdown.value = true;
        x.value = e.clientX;
        y.value = e.clientY;
      });
    },
  };
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
