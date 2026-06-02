<script setup lang="ts">
import type { Weather } from "../types/weather";

defineProps<{
  item: Weather;
  index: number;
  getLabel: (date: string) => string;
  getWeatherIcon: (weather: string) => string;
}>();
</script>

<template>
  <div class="card" :style="{ animationDelay: `${index * 0.2}s` }">
    <h2 class="label">{{ getLabel(item.date) }}</h2>
    <!-- 日付 -->
    <p class="date">
      {{
        new Date(item.date).toLocaleDateString("ja-JP", {
          month: "numeric",
          day: "numeric",
          weekday: "short",
        })
      }}
    </p>
    <!-- 天気 -->
    <div class="weather-wrapper">
      <div class="weather">
        <img :src="getWeatherIcon(item.weather)" class="icon" />
      </div>
      <!-- <div class="weather-discribe">
              <p>{{ item.weather.replace(/\s+/g, "") }}</p>
            </div> -->
    </div>
    <!-- 気温（メイン） -->
    <p class="temp">
      <span class="min">{{ item.temperature.min ?? "-" }}°</span>
      <span class="max">{{ item.temperature.max ?? "-" }}°</span>
    </p>
    <!-- 降水 -->
    <p class="rain">☔ {{ item.precipitationProbability ?? "-" }}%</p>
  </div>
</template>
