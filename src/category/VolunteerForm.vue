<template>
  <n-form
    ref="formRef"
    :model="formValue"
    :rules="rules"
    :disabled="confirmLoading"
  >
    <n-grid cols="20" :x-gap="24">
      <n-form-item-grid-item :span="8" label="姓名" path="name">
        <n-input placeholder="输入姓名" v-model:value="formValue.name" />
      </n-form-item-grid-item>
      <n-form-item-grid-item :span="2" />
      <n-form-item-grid-item :span="8" label="性别" path="gender">
        <n-radio-group v-model:value="formValue.gender">
          <n-radio value="true"> 男 </n-radio>
          <n-radio value="false"> 女 </n-radio>
        </n-radio-group>
      </n-form-item-grid-item>
      <n-form-item-grid-item :span="2" />
      <!--  -->
      <n-form-item-grid-item :span="12" label="身份证号码" path="id_number">
        <n-input
          placeholder="输入身份证号码"
          v-model:value="formValue.id_number"
        />
      </n-form-item-grid-item>
      <n-form-item-grid-item :span="8" />
      <!--  -->
      <n-form-item-grid-item :span="8" label="联系方式" path="tel">
        <n-input placeholder="输入联系方式" v-model:value="formValue.tel" />
      </n-form-item-grid-item>
      <n-form-item-grid-item :span="2" />
      <n-form-item-grid-item :span="8" label="个人职业" path="employment">
        <n-input
          placeholder="输入个人职业"
          v-model:value="formValue.employment"
        />
      </n-form-item-grid-item>
      <n-form-item-grid-item :span="2" />
      <!--  -->
      <n-form-item-grid-item :span="20" label="工作经历" path="experience">
        <n-input
          type="textarea"
          placeholder="个人工作经历..."
          v-model:value="formValue.experience"
        />
      </n-form-item-grid-item>
      <!--  -->
      <n-form-item-grid-item :span="8" label="选择团队" path="team_id">
        <n-select
          v-model:value="formValue.team_id"
          placeholder="选择团队"
          :options="teamOptions"
          :default-value="-1"
          :disabled="true"
        />
      </n-form-item-grid-item>
      <n-form-item-grid-item :span="2" />
      <n-form-item-grid-item :span="8" label="选择志愿者岗位" path="intention">
        <n-select
          v-model:value="formValue.intention"
          placeholder="选择志愿者岗位"
          :options="jobOptions"
        />
      </n-form-item-grid-item>
      <n-form-item-grid-item :span="2" />
      <!--  -->

      <n-form-item-grid-item :span="12" label="个人免冠照链接" path="avatar">
        <n-input placeholder="URL" v-model:value="formValue.avatar" />
      </n-form-item-grid-item>
    </n-grid>
  </n-form>
  <n-space justify="end">
    <n-button @click="handleCancel()" :disabled="confirmLoading">取消</n-button>
    <n-button
      type="primary"
      @click="handleConfirm()"
      :loading="confirmLoading"
      >{{ type }}</n-button
    >
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

const type = ref("");
const jobOptions = ref([]);
const teamOptions = ref([
  {
    value: -1,
    label: "默认",
  },
]);
const formRef = ref(null);
const formValue = ref({
  name: "",
  gender: null,
  id_number: "",
  tel: null,
  employment: "",
  experience: "",
  avatar: "",
  intention: null,
  team_id: -1,
  intention: null,
});
const rules = ref({
  name: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入姓名",
  },
  gender: {
    required: true,
    trigger: "change",
    message: "请选择性别",
  },
  id_number: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入身份证号",
  },
  tel: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入联系方式",
  },
  employment: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入个人职业",
  },
  experience: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入个人工作经历",
  },
  avatar: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入个人免冠照连接",
  },
  intention: {
    type: "number",
    required: true,
    trigger: ["blur", "change"],
    message: "请选择志愿者岗位",
  },
  // team_id: {
  //   required: true,
  //   trigger: ["blur", "change"],
  //   message: "请选择团队",
  // },
});

const confirmLoading = ref(false);

onMounted(() => {
  if (props.type === "add") {
    type.value = "添加";
  } else if (props.type === "edit") {
    type.value = "确认";
    console.log(props.data);

    let tempData = props.data;
    tempData.gender = tempData.gender ? "true" : "false";

    formValue.value = tempData;
  }

  axios({
    method: "get",
    url: "/api/team/" + formValue.value.team_id + "/jobs",
  })
    .then((response) => {
      if (response.data.code === 0) {
        console.log("获取岗位列表成功");
        jobOptions.value = response.data.data.map((v) => {
          return { value: v.id, label: v.name };
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

function handleCancel() {
  emits("dismiss");
}

function handleConfirm() {
  console.log(formValue.value)
  formRef.value?.validate((errors) => {
    if (!errors) {
      console.log("Infomation validated.");
      if (props.type === "add") {
        // add
        console.log("add confirm");
        console.log(formValue.value);

        confirmLoading.value = true;
        const payload = formValue.value;
        payload.status = 0;
        payload.gender = payload.gender === "true" ? true : false;
        axios({
          method: "post",
          url: "/api/team/-1/volunteer/",
          data: payload,
        })
          .then((response) => {
            if (response.data.code === 0) {
              console.log("添加成功");
              emits("dismiss", "add");
            }
          })
          .catch((error) => {
            console.log(error);
            confirmLoading.value = false;
          });
      } else if (props.type === "edit") {
        // edit
        console.log("edit confirm");
        console.log(formValue.value);

        confirmLoading.value = true;

        const payload = formValue.value;
        payload.status = Number(payload.status);
        payload.gender = payload.gender === "true" ? true : false;
        payload.team_id = payload.team_id == null ? -1 : payload.team_id;
        axios({
          method: "patch",
          url: "/api/team/-1/volunteer/" + payload.id,
          data: payload,
        })
          .then((response) => {
            if (response.data.code === 0) {
              console.log("修改成功");
              emits("dismiss", "edit");
            }
          })
          .catch((error) => {
            console.log(error);
            confirmLoading.value = false;
          });
      }
    } else {
      console.log(errors);
    }
  });
}
</script>

<style></style>