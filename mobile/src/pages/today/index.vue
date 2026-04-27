<script setup lang="ts">
import { computed } from "vue";

import { useAppStore } from "../../stores/appStore";
import type { Task, TaskAction } from "../../domain/types";

const store = useAppStore();
const tasks = computed(() => store.todayTasks());
const risks = computed(() => store.risks());
const doneCount = computed(() => tasks.value.filter((task) => task.status === "done" || task.status === "backfilled").length);

function go(path: string) {
  uni.navigateTo({ url: path });
}

function openTask(task: Task) {
  uni.navigateTo({ url: `/pages/task-detail/index?taskId=${task.id}` });
}

function quickAction(task: Task, action: TaskAction) {
  try {
    store.performTaskAction(task.id, action);
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : "操作失败", icon: "none" });
  }
}
</script>

<template>
  <view class="app-page">
    <view class="section row">
      <view>
        <view class="title">今日照护</view>
        <view class="subtitle">本地保存任务、记录和提醒，AI 只做识别辅助。</view>
      </view>
      <view class="tag">{{ doneCount }}/{{ tasks.length }}</view>
    </view>

    <view v-if="risks.length" class="section">
      <view v-for="risk in risks" :key="risk.id" class="card risk">
        <view class="row">
          <view class="task-title">{{ risk.title }}</view>
          <view class="tag">{{ risk.severity === "high" ? "高" : "中" }}</view>
        </view>
        <view class="subtitle">{{ risk.description }}</view>
      </view>
    </view>

    <view class="section">
      <view v-if="tasks.length === 0" class="card empty">今天还没有任务。</view>
      <view v-for="task in tasks" :key="task.id" class="card">
        <view class="row" @tap="openTask(task)">
          <view>
            <view class="task-title">{{ task.title }}</view>
            <view class="subtitle">{{ task.scheduledAt.slice(11, 16) }} · {{ task.instruction }}</view>
          </view>
          <view class="tag">{{ task.status }}</view>
        </view>
        <view class="actions">
          <button class="btn success" :disabled="task.status !== 'pending' && task.status !== 'delayed'" @tap="quickAction(task, 'done')">完成</button>
          <button class="btn secondary" :disabled="task.status !== 'pending'" @tap="quickAction(task, 'delayed')">延后</button>
          <button class="btn warn" :disabled="task.status !== 'pending' && task.status !== 'delayed'" @tap="quickAction(task, 'skipped')">跳过</button>
        </view>
      </view>
    </view>

    <view class="section actions">
      <button class="btn" @tap="go('/pages/import/index')">导入医嘱</button>
      <button class="btn secondary" @tap="go('/pages/therapy/index')">查看计划</button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.task-title {
  color: #164e63;
  font-size: 17px;
  font-weight: 700;
}

.risk {
  border-color: #f1c981;
  background: #fffaf0;
}

.actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.section.actions {
  grid-template-columns: 1fr 1fr;
}
</style>
