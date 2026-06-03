<script setup lang="ts">
import { computed } from "vue";
import { areas } from "../data/areas";

const props = defineProps<{
  region: string;
  area: string;
  isLocating: boolean;
}>();

const emit = defineEmits(["update:region", "update:area", "location"]);

// region変更
function onRegionChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value;

  emit("update:region", value);

  const target = areas.find((a) => a.region === value);
  if (target) {
    emit("update:area", target.list[0].code);
  }
}

// area変更
function onAreaChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  emit("update:area", value);
}

// フィルタ
const filteredAreas = computed(() => {
  return areas.find((a) => a.region === props.region)?.list ?? [];
});
</script>

<template>
  <div class="selector-wrapper">
    <button
      class="location-btn"
      @click="emit('location')"
      :disabled="isLocating"
    >
      <span v-if="isLocating" class="loading-content">
        <span class="spinner"></span>
        取得中...
      </span>
      <span v-else>📍 現在地</span>
    </button>
    <select :value="region" @change="onRegionChange">
      <option v-for="r in areas" :key="r.region" :value="r.region">
        {{ r.region }}
      </option>
    </select>
    <select :value="area" @change="onAreaChange">
      <option v-for="area in filteredAreas" :key="area.code" :value="area.code">
        {{ area.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.selector-wrapper {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.location-btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: #ffb770;
  color: black;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}

/* くるくる */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #ccc;
  border-top: 2px solid #333;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* アニメーション */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ボタン無効時 */
.location-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.location-btn:hover {
  background: #ff8c00;
}

/* select共通 */
.selector-wrapper select {
  appearance: none; /* デフォルト矢印消す */
  -webkit-appearance: none;
  -moz-appearance: none;

  padding: 10px 36px 10px 14px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  background: white;
  color: #333;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;

  background-image: url("data:image/svg+xml;utf8,<svg fill='%23666' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M5 7l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;

  transition: all 0.2s ease;
}

/* ホバー */
.selector-wrapper select:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* フォーカス */
.selector-wrapper select:focus {
  outline: none;
  box-shadow: 0 0 0 2px #4dabf7;
}

/* カスタム矢印 */
.selector-wrapper {
  position: relative;
}

@media (max-width: 600px) {
  .selector-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .selector-wrapper select {
    width: 68%;
    font-size: 16px;
  }
}
</style>
