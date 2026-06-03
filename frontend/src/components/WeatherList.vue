<script setup lang="ts">
import type { Weather } from "../types/weather";
import WeatherCard from "./WeatherCard.vue";

defineProps<{
  forecasts: Weather[];
  selectedArea: string;
}>();
</script>

<template>
  <transition-group name="fade" tag="div" class="cards" :key="selectedArea">
    <WeatherCard
      v-for="(item, index) in forecasts.slice(0, 3)"
      :key="item.date"
      :item="item"
      :index="index"
    />
  </transition-group>
</template>

<style scoped>
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 25px;
  gap: 12px;
}

@media (max-width: 600px) {
  .cards {
    flex-direction: column;
    align-items: center;
  }
}
</style>
