<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useAttrStore } from "@/store/bm/goods/attr";
import { useCategoryStore } from "@/store/bm/goods/category";
import { usePublicHooks } from "@/views/hooks";

const props = defineProps({
  catId: { type: Number as PropType<Number> },
  warning: { type: String as PropType<String> }
});
const { switchStyle } = usePublicHooks();

const attrStore = useAttrStore();
const categoryStore = useCategoryStore();
// 关联的属性
const relateAttr = ref([]);

/**
 * * 根据分类id获取当前分类属性
 */
const init = async () => {
  // 初始化值为空数组
  relateAttr.value = [];

  // 根据分类id查询属性信息
  const catId = props.catId;
  if (catId) {
    await attrStore.getAttrNotRelateList({ catId });
    const res = await attrStore.getAttrListByCatId({
      catId: catId
    });
    attrStore.attrList.push(...res);
    relateAttr.value = res.map(item => item.attrId);
  } else {
    await attrStore.getAttrList();
  }
};
const getTippyContent = (option: any) => {
  const type = option.type === 0 ? "规格参数" : "销售属性";
  const name = option.name.length > 4 ? `【${option.name}】` : "";
  return `${name}${type}${option.desc ? "-" : ""}${option.desc}`;
};
onMounted(async () => {
  await init();
  console.log("relateAttr", relateAttr.value, "all", attrStore.attrList);
});

defineExpose({ relateAttr });
</script>

<template>
  <div class="flex flex-col items-center">
    <el-text v-show="warning" class="mx-1" type="danger">{{ warning }}</el-text>
    <el-transfer
      v-model="relateAttr"
      :props="{
        key: 'attrId',
        label: 'name'
      }"
      :button-texts="['撤回', '添加']"
      :data="attrStore.attrList"
      filter-placeholder="查找路由"
      :format="{
        noChecked: `总共 $\{total}`,
        hasChecked: '${checked}/${total}'
      }"
      :titles="['未添加', '已添加']"
      class="m-3"
      filterable
    >
      <template #default="{ option }">
        <div class="container">
          <span
            v-tippy="{
              content: getTippyContent(option)
            }"
            class="span"
            :class="option.type === 0 ? 'spuAttr' : 'skuAttr'"
          >
            {{ option.name }}
          </span>
          <el-switch
            v-model="option.choose"
            class="ml-auto"
            :style="{
              '--el-switch-on-color': option.type === 1 ? '#13ce66' : '#409eff'
            }"
            active-text="多选"
            inactive-text="单选"
            :active-value="1"
            :inactive-value="0"
            inline-prompt
          />
        </div>
      </template>
    </el-transfer>
  </div>
</template>
<style lang="scss" scoped>
.container {
  display: inline-block;
  display: flex;
  justify-content: space-between;
  width: 123px;
}

.span {
  //超出部分隐藏
  overflow: hidden;
  text-overflow: ellipsis;
}

.spuAttr {
  color: #409eff;
}

.skuAttr {
  color: #13ce66;
}
</style>
