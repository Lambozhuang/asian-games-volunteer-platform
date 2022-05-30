<template>
<n-divider />
  <n-form
    ref="formRef"
    :model="formValue"
    :rules="rules"
    :disabled="confirmLoading"
  >
    <n-grid cols="20" :x-gap="24">
      <n-form-item-grid-item :span="8" label="岗位名称" path="name">
        <n-input placeholder="输入岗位名称" v-model:value="formValue.name" />
      </n-form-item-grid-item>
      <n-form-item-grid-item :span="2" />
      <n-form-item-grid-item :span="8" label="工作地点" path="location">
        <n-input
          placeholder="输入工作地点"
          v-model:value="formValue.location"
        />
      </n-form-item-grid-item>
      <n-form-item-grid-item :span="2" />
      <n-form-item-grid-item :span="20" label="详细信息" path="content">
        <n-input
          type="textarea"
          placeholder="输入详细信息..."
          v-model:value="formValue.content"
        />
      </n-form-item-grid-item>
    </n-grid>
  </n-form>
  <n-space justify="end">
    <n-button @click="handleCancel" :disabled="confirmLoading">取消</n-button>
    <n-button type="primary" @click="handleConfirm" :loading="confirmLoading">
      {{ type }}
    </n-button>
  </n-space>
</template>
<script setup>
import axios from "axios";
import {
  NForm,
  NButton,
  NSpace,
  NGrid,
  NFormItemGridItem,
  NInput,
  NDivider,
  NRadioGroup,
  NRadio,
  NSelect,
} from "naive-ui";
import { onMounted, ref } from "vue";
import common from "../Common.vue";

const props = defineProps(["type", "data"]);
const emits = defineEmits(["dismiss"]);

const formRef = ref(null);
const formValue = ref({
  name: "",
  location: "",
  content: "",
});
const rules = ref({
  name: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入岗位名称",
  },
  location: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入工作地点",
  },
});

// UI
const type = ref("");
const confirmLoading = ref(false);

onMounted(() => {
  if (props.type === "add") {
    type.value = "添加";
  } else if (props.type === "edit") {
    type.value = "确认";
    console.log(props.data);
    formValue.value = props.data;
  }
});

function handleConfirm() {
  console.log(formValue.value);
  formRef.value?.validate(() => {
    confirmLoading.value = true;
    console.log("Infomation validated.");
    if (props.type === "add") {
      // add
      const payload = formValue.value;
      axios({
        method: "post",
        url: "/api/v1/team/" + common.userinfo.team_id + "/job",
        data: payload,
      })
        .then((response) => {
          if (response.data.code === 0) {
            console.log("添加成功");
            emits("dismiss", "add");
          } else {
            confirmLoading.value = false;
          }
        })
        .catch((error) => {
          console.log(error);
          confirmLoading.value = false;
        });
    } else if (props.type === "edit") {
      // edit
      const payload = formValue.value;
      axios({
        method: "patch",
        url: "/api/v1/team/" + common.userinfo.team_id + "/job/" + payload.id,
        data: payload,
      })
        .then((response) => {
          if (response.data.code === 0) {
            console.log("修改成功");
            emits("dismiss", "edit");
          } else {
            confirmLoading.value = false;
          }
        })
        .catch((error) => {
          console.log(error);
          confirmLoading.value = false;
        });
    }
  });
}

function handleCancel() {
  emits("dismiss");
}
</script>
<style></style>
