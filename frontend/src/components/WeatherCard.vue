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

<style scored>
.card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  z-index: 1;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  animation: fadeUp 0.6s ease forwards;
  opacity: 0;
  flex: 1;
  min-width: 200px;
}

@media (max-width: 600px) {
  .card {
    width: 90%;
    flex: none;
    min-width: unset;
  }
}

.card:first-child {
  transform: scale(1.05);
}

.card:nth-child(2) {
  animation-delay: 0.1s;
}

.card:nth-child(3) {
  animation-delay: 0.2s;
}

.card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  z-index: 10;
  transform: translateY(-8px) scale(1.03);
}

.card p:nth-child(2) {
  font-size: 20px;
  font-weight: bold;
}

.card p:nth-child(3) {
  color: #ffb703; /* 太陽カラー */
}

.label {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 8px;
}

.date {
  font-size: 14px;
  margin-bottom: 18px;
}

.weather {
  font-size: 40px;
  margin: 10px 0;
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
}

.weather-discribe {
  font-size: 14px;
  text-align: center;
  margin-bottom: 10px;
}

.icon {
  width: 50%;
  height: 50%;
}

@media (max-width: 600px) {
  .icon {
    width: 60px;
    height: 60px;
  }
}

temp {
  font-size: 24px;
  font-weight: bold;
}

.min {
  color: #4dabf7;
  margin-right: 6px;
}

.max {
  color: #ff6b6b;
}

.rain {
  font-size: 14px;
  color: #555;
  margin-top: 8px;
}

@media (max-width: 600px) {
  .label {
    font-size: 16px;
  }

  .date {
    font-size: 14px;
  }

  .weather {
    font-size: 28px; /* ← 小さくする */
  }

  .temp {
    font-size: 22px; /* ← 大きくする */
    font-weight: bold;
  }

  .rain {
    font-size: 16px;
  }
}
</style>
