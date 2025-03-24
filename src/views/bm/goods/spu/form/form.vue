<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { FormProps } from "../utils/types";
import { rules } from "../utils/columns";
import { usePublicHooks } from "@/views/hooks";
import ReUpload from "@/components/ReUpload";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    name: "",
    status: 0,
    image: [],
    price: 0,
    discount: 0,
    attrText: "",
    desc: "",
    attrs: [],
    mainImage: []
  })
});
const { switchStyle } = usePublicHooks();

const formRef = ref();
const newFormInline = ref(props.formInline);
function getRef() {
  return formRef.value;
}

defineExpose({ getRef });
</script>
<template>
  <el-form
    ref="formRef"
    :model="newFormInline"
    :rules="rules"
    label-width="98px"
  >
    <!-- 商品名称 -->
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入商品名称"
          />
        </el-form-item>
      </re-col>
    </el-row>
    <!-- 商品主图 -->
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="商品主图" prop="image">
          <ReUpload v-model="newFormInline.image" />
        </el-form-item>
      </re-col>
    </el-row>
    <!-- 商品图集 -->
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="商品图集" prop="mainImage">
          <ReUpload v-model="newFormInline.mainImage" multiple :limit="10" />
        </el-form-item>
      </re-col>
    </el-row>
    <!-- 商品价格、折扣 -->
    <el-row :gutter="30">
      <re-col :value="12">
        <el-form-item label="商品价格" prop="name">
          <el-input-number
            v-model="newFormInline.price"
            :min="0"
            :step="0.01"
            :precision="2"
            placeholder="请输入价格"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12">
        <el-form-item label="商品折扣" prop="discount">
          <el-input-number
            v-model="newFormInline.discount"
            :min="0"
            :step="0.01"
            :precision="2"
            placeholder="请输入折扣"
          />
        </el-form-item>
      </re-col>
    </el-row>
    <!-- 商品规格参数 -->
    <el-row :gutter="30">
      <re-col>
        <el-form-item v-for="item in newFormInline.attrs" :key="item.id">
          <template #label>
            <span v-tippy="item.desc" class="inline"
              >{{ item.attrName }}
              <el-tag v-if="item.choose === 1" type="success" size="small"
                >多选</el-tag
              ></span
            >
          </template>
          <el-select
            v-model="item.value"
            class="attr-select"
            :multiple="item.choose === 1"
            filterable
            clearable
            allow-create
            default-first-option
            placeholder="请选择或输入值"
          >
            <el-option
              v-for="val in item.options"
              :key="val"
              :label="val"
              :value="val"
            />
          </el-select>
          <el-checkbox
            v-model="item.quickShow"
            :true-value="1"
            :false-value="0"
          >
            快速展示
          </el-checkbox>
        </el-form-item>
      </re-col>
    </el-row>
    <!-- 商品属性描述文字、状态 -->
    <el-row :gutter="30">
      <re-col :value="16">
        <el-form-item label="属性描述文字" prop="attrText">
          <el-input
            v-model="newFormInline.attrText"
            clearable
            placeholder="请输入属性描述文字"
          />
        </el-form-item>
      </re-col>
      <re-col :value="8">
        <el-form-item label="商品状态">
          <el-switch
            v-model="newFormInline.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="启售"
            inactive-text="停售"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>
    </el-row>
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="商品描述" prop="desc">
          <el-input
            v-model="newFormInline.desc"
            placeholder="请输入描述信息"
            type="textarea"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
<style lang="scss">
.attr-select {
  width: 280px;
  margin-right: 12px;
}
</style>
