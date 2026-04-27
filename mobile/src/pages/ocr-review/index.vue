<script setup lang="ts">
import { reactive } from "vue";

import { useAppStore } from "../../stores/appStore";

const store = useAppStore();
const draft = reactive({ ...store.state.data.ocrDraft });

function confirm() {
  try {
    store.confirmOcrDraft(draft);
    uni.showToast({ title: "已加入计划", icon: "success" });
    uni.switchTab({ url: "/pages/today/index" });
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : "确认失败", icon: "none" });
  }
}
</script>

<template>
  <view class="app-page">
    <view class="section">
      <view class="title">人工确认</view>
      <view class="subtitle">低置信字段必须人工确认，确认后才生成正式用药提醒。</view>
    </view>

    <view class="card stack">
      <view>
        <view class="field-label">名称</view>
        <input v-model="draft.title" />
      </view>
      <view>
        <view class="field-label">剂量</view>
        <input v-model="draft.dose" />
      </view>
      <view>
        <view class="field-label">频次</view>
        <input v-model="draft.frequency" />
      </view>
      <view>
        <view class="field-label">时间</view>
        <input v-model="draft.time" />
      </view>
      <view>
        <view class="field-label">说明</view>
        <textarea v-model="draft.instruction" />
      </view>
      <button class="btn success" @tap="confirm">确认并生成提醒</button>
    </view>
  </view>
</template>
