<template>
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
  NRadioGroup,
  NRadio,
  NSelect,
} from "naive-ui";
import { onMounted, ref } from "vue";

const props = defineProps(["type", "data"]);
const emits = defineEmits(["dismiss"]);

const formRef = ref(null);
const formValue = ref({
  name: "",
  gender: null,
  id_number: "",
  tel: null,
  employment: "",
  experience: "",
  avatar: "",
  job_id: null,
  team_id: -1,
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
  if (props.type === "add") {
    
    emits("dismiss");
  } else if (props.type === "edit") {
    
    emits("dismiss");
  }
}

function handleCancel() {
  emits("dismiss");
}
</script>
<style></style>
