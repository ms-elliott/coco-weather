<script setup lang="ts">
import type { Weather } from "../types/weather";
import WeatherCard from "./WeatherCard.vue";

defineProps<{
  forecasts: Weather[];
  selectedArea: string;
  getLabel: (date: string) => string;
  getWeatherIcon: (weather: string) => string;
}>();
</script>

<template>
  <transition-group name="fade" tag="div" class="cards" :key="selectedArea">
    <WeatherCard
      v-for="(item, index) in forecasts.slice(0, 3)"
      :key="item.date"
      :item="item"
      :index="index"
      :getLabel="getLabel"
      :getWeatherIcon="getWeatherIcon"
    />

    <!-- <div
      v-for="(item, index) in forecasts.slice(0, 3)"
      :key="item.date"
      class="card"
      :style="{ animationDelay: `${index * 0.2}s` }"
    ></div> -->
  </transition-group>
</template>
