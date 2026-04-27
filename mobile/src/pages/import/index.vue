<script setup lang="ts">
import { ref } from "vue";

import { todayISO } from "../../domain/appState";
import type { AiSuggestion, OcrDraft } from "../../domain/types";
import { extractOcrDraft } from "../../services/aiGateway";
import { useAppStore } from "../../stores/appStore";

const store = useAppStore();
const text = ref("晚饭后服用补剂 1 片，20:00 自查恶心和头晕，睡前记录体重。");
const loading = ref(false);

function mockSuggestion(): AiSuggestion {
  return {
    id: `AI-${Date.now()}`,
    rawInput: text.value,
    createdAt: `${todayISO()}T20:00`,
    ruleSuggestions: [
      { type: "symptom", title: "晚间副作用自查", time: "20:00", instruction: "记录恶心、头晕、胃痛", notes: "AI 识别后需人工确认" },
      { type: "metric", title: "睡前体重", time: "21:30", instruction: "记录体重", notes: "用于趋势观察" },
    ],
    oneOffTasks: [{ type: "activity", title: "补充饮水", scheduledAt: `${todayISO()}T19:30`, instruction: "饮水 300ml" }],
    recordSuggestions: [],
    disclaimer: "AI 结果只用于整理，不替代医生诊断或处方。",
  };
}

function saveLocalAi() {
  try {
    if (!store.state.data.profile.privacyAcknowledged) store.acknowledgePrivacy();
    store.saveAiSuggestion(mockSuggestion());
    uni.showToast({ title: "已生成计划", icon: "success" });
    uni.switchTab({ url: "/pages/today/index" });
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : "保存失败", icon: "none" });
  }
}

async function createOcrDraft() {
  loading.value = true;
  try {
    let draft: OcrDraft;
    try {
      draft = await extractOcrDraft({ text: text.value });
    } catch {
      draft = {
        id: `D-${Date.now()}`,
        status: "pending",
        title: "补剂",
        dose: "1 片",
        frequency: "每天 1 次",
        time: "08:30",
        instruction: "饭后服用",
        notes: "离线草稿，需人工核对。",
        confidenceFlags: ["frequency"],
      };
    }
    store.state.data.ocrDraft = draft;
    uni.navigateTo({ url: "/pages/ocr-review/index" });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <view class="app-page">
    <view class="section">
      <view class="title">导入医嘱</view>
      <view class="subtitle">优先在本机整理，只有识别时才请求轻后端。</view>
    </view>

    <view class="card stack">
      <view>
        <view class="field-label">医嘱或处方文本</view>
        <textarea v-model="text" maxlength="500" />
      </view>
      <button class="btn" :disabled="loading" @tap="saveLocalAi">本地生成任务</button>
      <button class="btn secondary" :disabled="loading" @tap="createOcrDraft">生成 OCR 草稿</button>
    </view>

    <view class="card">
      <view class="task-title">隐私确认</view>
      <view class="subtitle">导入后的规则、任务、记录默认保存在本机。未来登录和付费只同步账号状态，不默认上传健康明细。</view>
      <button v-if="!store.state.data.profile.privacyAcknowledged" class="btn secondary" @tap="store.acknowledgePrivacy()">我已知晓</button>
      <view v-else class="tag">已确认</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.task-title {
  margin-bottom: 8px;
  font-size: 17px;
  font-weight: 700;
}
</style>
