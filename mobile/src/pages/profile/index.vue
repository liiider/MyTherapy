<script setup lang="ts">
import { computed } from "vue";

import { useAppStore } from "../../stores/appStore";

const store = useAppStore();
const reportCount = computed(() => store.state.data.reports.length);

function resetLocal() {
  uni.showModal({
    title: "重置本机数据",
    content: "会清空本机演示数据并恢复初始状态。",
    success: (result) => {
      if (result.confirm) store.reset();
    },
  });
}
</script>

<template>
  <view class="app-page">
    <view class="section">
      <view class="title">我的</view>
      <view class="subtitle">当前版本以本机数据为主，后端只负责 API 中转、账号和未来付费状态。</view>
    </view>

    <view class="card stack">
      <view class="row">
        <view>隐私授权</view>
        <view class="tag">{{ store.state.data.profile.privacyAcknowledged ? "已确认" : "未确认" }}</view>
      </view>
      <view class="row">
        <view>通知状态</view>
        <view class="tag">{{ store.state.data.profile.notificationHealthy ? "正常" : "待检查" }}</view>
      </view>
      <view class="row">
        <view>本地报告</view>
        <view class="tag">{{ reportCount }}</view>
      </view>
      <button v-if="!store.state.data.profile.privacyAcknowledged" class="btn" @tap="store.acknowledgePrivacy()">确认隐私声明</button>
      <button class="btn secondary" @tap="resetLocal">重置本机数据</button>
    </view>
  </view>
</template>
