<template>
  <n-grid x-gap="12" :cols="10">
    <n-grid-item :span="2"></n-grid-item>
    <n-grid-item :span="3">
      <n-space align="center" justify="end"> <n-h3>团队名称</n-h3></n-space>
    </n-grid-item>
    <n-grid-item :span="3">
      <n-space align="center" justify="start">
        <n-h3>{{ teamName }}</n-h3></n-space
      >
    </n-grid-item>
    <n-grid-item :span="2"></n-grid-item>
    <n-grid-item :span="2"></n-grid-item>
    <n-grid-item :span="3">
      <n-space align="center" justify="end"> <n-h3>所属组织</n-h3></n-space>
    </n-grid-item>
    <n-grid-item :span="3">
      <n-space align="center" justify="start">
        <n-h3>{{ teamOrganization }}</n-h3></n-space
      >
    </n-grid-item>
    <n-grid-item :span="2"></n-grid-item>
    <n-grid-item :span="2"></n-grid-item>
    <n-grid-item :span="3">
      <n-space align="center" justify="end"> <n-h3>邀请码</n-h3></n-space>
    </n-grid-item>
    <n-grid-item :span="3">
      <n-space align="center" justify="start">
        <n-h3>{{ teamCode }}</n-h3></n-space
      >
    </n-grid-item>
    <n-grid-item :span="2"></n-grid-item>
    <n-grid-item :span="3"></n-grid-item>
    <n-grid-item :span="4"><n-divider /></n-grid-item>
    <n-grid-item :span="3"></n-grid-item>
  </n-grid>
  <n-space justify="center">
    <n-button :loading="loading" @click="editTeam">修改信息</n-button>
  </n-space>

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
import axios from "axios";
import { onMounted, ref } from "vue";
import {
  NH3,
  NButton,
  NModal,
  useLoadingBar,
  useMessage,
  NDivider,
  NGrid,
  NGridItem,
  NSpace,
} from "naive-ui";
import common from "../Common.vue";
import teamForm from "./TeamForm.vue";

const teamName = ref("");
const teamOrganization = ref("");
const teamCode = ref("");
const selectedData = ref({});

const showEditTeam = ref(false);
const loading = ref(false);
const loadingBar = useLoadingBar();
const message = useMessage();

onMounted(() => {
  axios({
    method: "get",
    url: "/api/team/" + common.userinfo.team_id + "/",
  })
    .then((response) => {
      if (response.data.code === 0) {
        teamName.value = response.data.data.name;
        teamOrganization.value = response.data.data.organization;
        teamCode.value = response.data.data.code;
        console.log("成功获取团队信息");
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

function editTeam() {
  console.log(common.userinfo);
  selectedData.value = {
    id: common.userinfo.team_id,
    name: teamName.value,
    organization: teamOrganization.value,
    code: teamCode.value,
  };
  showEditTeam.value = true;
}

function dismissModal(status) {
  loading.value = true;
  loadingBar.start();
  if (status === "edit") {
    message.success("修改成功");
  }
  axios({
    method: "get",
    url: "/api/team/" + common.userinfo.team_id + "/",
  })
    .then((response) => {
      if (response.data.code === 0) {
        teamName.value = response.data.data.name;
        teamOrganization.value = response.data.data.organization;
        teamCode.value = response.data.data.code;
        console.log("成功获取团队信息");
      }
      loading.value = false;
      loadingBar.finish();
    })
    .catch((error) => {
      loading.value = false;
      loadingBar.finish();
      console.log(error);
    });
  showEditTeam.value = false;
}
</script>
<style></style>
