<script setup lang="ts">
import { computed } from "vue";

import { useAppStore } from "../../stores/appStore";

const store = useAppStore();
const records = computed(() => [...store.state.data.records].sort((a, b) => b.actualAt.localeCompare(a.actualAt)));
const completionRate = computed(() => {
  const total = store.state.data.tasks.length;
  if (!total) return 0;
  const done = store.state.data.tasks.filter((task) => task.status === "done" || task.status === "backfilled").length;
  return Math.round((done / total) * 100);
});
</script>

<template>
  <view class="app-page">
    <view class="section">
      <view class="title">进展</view>
      <view class="subtitle">从本地记录生成趋势和导出报告。</view>
    </view>

    <view class="card row">
      <view>
        <view class="metric">{{ completionRate }}%</view>
        <view class="subtitle">任务完成率</view>
      </view>
      <button class="btn secondary" @tap="store.createReport()">生成报告</button>
    </view>

    <view v-for="record in records" :key="record.id" class="card">
      <view class="row">
        <view class="task-title">{{ record.note }}</view>
        <view class="tag">{{ record.action }}</view>
      </view>
      <view class="subtitle">{{ record.actualAt }}</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.metric {
  font-size: 32px;
  font-weight: 800;
}

.task-title {
  font-size: 16px;
  font-weight: 700;
}
</style>
