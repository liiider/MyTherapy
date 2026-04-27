<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";

import { useAppStore } from "./stores/appStore";

const store = useAppStore();

onLaunch(() => {
  store.load();
});
</script>

<style lang="scss">
@import "./styles/tokens.scss";

page {
  min-height: 100%;
  background: $color-bg;
  color: $color-text;
  font-family: -apple-system, BlinkMacSystemFont, "Atkinson Hyperlegible", "PingFang SC", "Microsoft YaHei", sans-serif;
}

button {
  min-height: 44px;
  border-radius: $radius-button;
  border: 0;
  font-size: 16px;
}

button::after {
  border: 0;
}

input,
textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  border: 1px solid $color-line;
  border-radius: $radius-card;
  background: $color-panel;
  color: $color-text;
  font-size: 16px;
  padding: 10px 12px;
}

textarea {
  min-height: 112px;
}

.app-page {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 16px;
  background: $color-bg;
}

.section {
  margin-bottom: 16px;
}

.card {
  box-sizing: border-box;
  margin-bottom: 12px;
  padding: 14px;
  border: 1px solid $color-line;
  border-radius: $radius-card;
  background: $color-panel;
  box-shadow: $shadow-soft;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
}

.subtitle {
  color: $color-muted;
  font-size: 14px;
  line-height: 1.45;
}

.meta {
  color: $color-muted;
  font-size: 13px;
}

.tag {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: $color-brand-soft;
  color: $color-brand-strong;
  font-size: 13px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 14px;
  border-radius: $radius-button;
  background: $color-brand;
  color: #fff;
  font-size: 16px;
}

.btn.secondary {
  background: $color-brand-soft;
  color: $color-brand-strong;
}

.btn.success {
  background: $color-success;
}

.btn.warn {
  background: $color-warn-soft;
  color: $color-warn;
}

.btn.ghost {
  background: transparent;
  color: $color-brand-strong;
}

.field-label {
  margin-bottom: 6px;
  color: $color-muted;
  font-size: 13px;
}

.empty {
  padding: 24px 12px;
  color: $color-muted;
  text-align: center;
}
</style>
