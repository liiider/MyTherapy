<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

import type { TaskAction } from "../../domain/types";
import { useAppStore } from "../../stores/appStore";

const store = useAppStore();
const taskId = ref("");
const task = computed(() => store.state.data.tasks.find((item) => item.id === taskId.value));
const note = ref("");

onLoad((query) => {
  taskId.value = String(query?.taskId ?? "");
});

function act(action: TaskAction) {
  if (!task.value) return;
  try {
    store.performTaskAction(task.value.id, action, undefined, note.value);
    uni.showToast({ title: "已记录", icon: "success" });
    uni.navigateBack();
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : "操作失败", icon: "none" });
  }
}
</script>

<template>
  <view class="app-page">
    <view v-if="!task" class="card empty">任务不存在。</view>
    <view v-else>
      <view class="section">
        <view class="title">{{ task.title }}</view>
        <view class="subtitle">{{ task.scheduledAt }} · {{ task.source }}</view>
      </view>

      <view class="card stack">
        <view>
          <view class="field-label">说明</view>
          <view>{{ task.instruction }}</view>
        </view>
        <view>
          <view class="field-label">备注</view>
          <textarea v-model="note" placeholder="可选" />
        </view>
        <button class="btn success" @tap="act('done')">完成</button>
        <button class="btn secondary" @tap="act('delayed')">延后 30 分钟</button>
        <button class="btn warn" @tap="act('backfilled')">补记</button>
        <button class="btn ghost" @tap="act('skipped')">跳过</button>
      </view>
    </view>
  </view>
</template>
