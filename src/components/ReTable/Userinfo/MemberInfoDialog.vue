<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { fetchQueryMember } from "@/api/bm/member";
import userAvatarIcon from "@/assets/svg/user_avatar.svg?component";

const props = defineProps({
  memberId: { type: String as PropType<String> }
});
const memberInfo = ref();
const loading = ref(false);

/**
 * * 获取用户信息
 */
const getmemberInfo = async () => {
  loading.value = true;
  // 如果没有传入用户ID直接返回
  if (!props.memberId) {
    loading.value = false;
    return;
  }

  // 判断是否是web端
  const result = await fetchQueryMember(props.memberId);
  if (result.code === 200) {
    memberInfo.value = result.result;
  }

  loading.value = false;
};
defineEmits(["close"]);

onMounted(() => {
  getmemberInfo();
});
</script>

<template>
  <div>
    <div v-if="memberId && memberInfo" class="list-card-item bg-bg_color">
      <!-- 标题内容 -->
      <el-row justify="space-between">
        <div class="flex flex-row justify-center items-center">
          <div class="list-card-item_detail--logo">
            <userAvatarIcon />
          </div>
          <h1 class="list-card-item_detail--name">用户信息</h1>
        </div>
        <el-tag
          :color="memberInfo.status === 0 ? '#F67676' : '#00a870'"
          class="mx-1 list-card-item_detail--operation--tag"
          effect="dark"
        >
          状态：{{ memberInfo.status === 0 ? "禁用" : "正常" }}
        </el-tag>
      </el-row>

      <!-- 用户详情 -->
      <el-descriptions border>
        <el-descriptions-item label="头像" :width="100" align="center">
          <el-image
            :src="memberInfo.avatar"
            style="width: 100px; height: 100px"
          />
        </el-descriptions-item>
        <el-descriptions-item label="用户名" :width="100">{{
          memberInfo.username
        }}</el-descriptions-item>
        <el-descriptions-item label="昵称" :width="100">{{
          memberInfo.nickname
        }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{
          memberInfo.phone
        }}</el-descriptions-item>
        <el-descriptions-item label="性别">
          <el-tag v-if="memberInfo.gender === 1">男</el-tag>
          <el-tag v-if="memberInfo.gender === 0" type="danger">女</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="生日">{{
          memberInfo.birthday
        }}</el-descriptions-item>
        <el-descriptions-item label="余额">{{
          memberInfo.balance
        }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="1.5"
          >{{ memberInfo.createTime }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 加载内容 -->
    <div v-if="loading" class="list-card-item bg-bg_color">
      <!-- 标题内容 -->
      <el-row justify="space-between">
        <div class="flex flex-row justify-center items-center">
          <div class="list-card-item_detail--logo">
            <userAvatarIcon />
          </div>
          <h1 class="list-card-item_detail--name">用户详情</h1>
        </div>
        <el-tag
          class="mx-1 list-card-item_detail--operation--tag"
          color="#00a870"
          effect="dark"
        >
          loading...</el-tag
        >
      </el-row>

      <!-- 用户详情 -->
      <el-descriptions border>
        <el-descriptions-item label="头像" :width="100" align="center">
          <el-skeleton animated class="flex justify-center">
            <template #template>
              <el-skeleton-item
                style="width: 100px; height: 100px"
                variant="image"
              />
            </template>
          </el-skeleton>
        </el-descriptions-item>
        <el-descriptions-item label="用户名" :width="100">
          <el-skeleton :rows="1" animated />
        </el-descriptions-item>
        <el-descriptions-item label="昵称" :width="100">
          <el-skeleton :rows="1" animated />
        </el-descriptions-item>

        <el-descriptions-item label="邮箱">
          <el-skeleton :rows="1" animated />
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          <el-skeleton :rows="1" animated />
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          <el-skeleton :rows="1" animated />
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="1.5">
          <el-skeleton :rows="1" animated />
        </el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="1.5">
          <el-skeleton :rows="1" animated />
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 数据为空 -->
    <el-empty
      v-if="(!memberId || !memberInfo) && !loading"
      description="没有数据"
    />
  </div>
</template>

<style lang="scss" scoped>
.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: 3px;

  &_detail {
    &--logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      font-size: 26px;
      color: #0052d9;
      background: #e0ebff;
      border-radius: 50%;

      &__disabled {
        color: #a1c4ff;
      }
    }

    &--operation {
      display: flex;
      height: 100%;

      &--tag {
        margin: 15px 0;
        border: 0;
      }
    }

    &--name {
      margin: 0 0 0 8px;
      font-size: 16px;
      font-weight: 400;
    }
  }

  &__disabled {
    .list-card-item_detail--name,
    .list-card-item_detail--desc {
      color: var(--el-text-color-disabled);
    }

    .list-card-item_detail--operation--tag {
      color: #bababa;
    }
  }
}
</style>
