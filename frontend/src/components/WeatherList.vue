<script setup lang="ts">
import type { Weather } from "../types/weather";

defineProps<{
  forecasts: Weather[];
  selectedArea: string;
}>();

function getLabel(date: string) {
  const today = new Date();
  const target = new Date(date);

  // 日付だけ比較するために0時に揃える
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diff = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diff === 0) return "今日";
  if (diff === 1) return "明日";
  if (diff === 2) return "明後日";

  return target.toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
  });
}

function getWeatherIcon(weather: string) {
  if (
    weather.replace(/\s+/g, "").includes("晴") &&
    weather.replace(/\s+/g, "").includes("くもり")
  )
    return "/icons/default.png";
  if (weather.includes("雨") || weather.includes("あめ"))
    return "/icons/rain.png";
  if (weather.includes("曇") || weather.includes("くもり"))
    return "/icons/cloud.png";
  if (weather.includes("晴") || weather.includes("はれ"))
    return "/icons/sun.png";
  if (weather.includes("雷") || weather.includes("かみなり"))
    return "/icons/thunder.png";
  if (weather.includes("雪") || weather.includes("ゆき"))
    return "/icons/snow.png";
  return "/icons/default.png";
}
</script>

<template>
  <transition-group name="fade" tag="div" class="cards" :key="selectedArea">
    <div
      v-for="(item, index) in forecasts.slice(0, 3)"
      :key="item.date"
      class="card"
      :style="{ animationDelay: `${index * 0.2}s` }"
    >
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
  </transition-group>
</template>
