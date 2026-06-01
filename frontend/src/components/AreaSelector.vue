<script setup lang="ts">
import { areas } from "../data/areas";
import { computed } from "vue";

const props = defineProps<{
  selectedRegion: string;
  selectedArea: string;
  isLocating: boolean;
}>();

const emit = defineEmits(["update:region", "update:area", "location"]);

const filteredAreas = computed(() => {
  return areas.find((a) => a.region === props.selectedRegion)?.list ?? [];
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
    <select
      :value="selectedRegion"
      @change="
        emit('update:region', ($event.target as HTMLSelectElement).value)
      "
    >
      <option v-for="r in areas" :key="r.region" :value="r.region">
        {{ r.region }}
      </option>
    </select>
    <select
      :value="selectedArea"
      @change="emit('update:area', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="area in filteredAreas" :key="area.code" :value="area.code">
        {{ area.name }}
      </option>
    </select>
  </div>
</template>
