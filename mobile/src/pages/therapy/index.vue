<script setup lang="ts">
import { computed } from "vue";

import { useAppStore } from "../../stores/appStore";

const store = useAppStore();
const rules = computed(() => store.state.data.rules);
</script>

<template>
  <view class="app-page">
    <view class="section">
      <view class="title">用药计划</view>
      <view class="subtitle">提醒规则保存在本机，可由 OCR、AI 或手动创建，生效前需要人工确认。</view>
    </view>

    <view v-for="rule in rules" :key="rule.id" class="card">
      <view class="row">
        <view>
          <view class="task-title">{{ rule.title }}</view>
          <view class="subtitle">{{ rule.schedule.time }} · {{ rule.instruction }}</view>
        </view>
        <view class="tag">{{ rule.status === "enabled" ? "启用" : "暂停" }}</view>
      </view>
      <view v-if="rule.inventory" class="meta">库存 {{ rule.inventory.amount }} {{ rule.inventory.unit }}，阈值 {{ rule.inventory.threshold }}</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.task-title {
  margin-bottom: 4px;
  font-size: 17px;
  font-weight: 700;
}
</style>
