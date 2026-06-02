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
