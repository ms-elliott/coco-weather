<script setup lang="ts">
import { ref, onMounted, computed, watch, watchEffect } from "vue";

import { useWeather } from "./composables/useWeather";
import { useLocation } from "./composables/useLocation";
import { useAreas } from "./composables/useAreas";

import AreaSelector from "./components/AreaSelector.vue";
import WeatherList from "./components/WeatherList.vue";
import Overview from "./components/Overview.vue";
import Footer from "./components/Footer.vue";

const selectedRegion = ref("関東甲信");
const selectedArea = ref("130000");

const { weatherData, overview, fetchAll, loading, error } = useWeather();
const { isLocating, getCurrentLocation } = useLocation();
const { findRegionByAreaCode } = useAreas();

onMounted(() => {
  fetchAll(selectedArea.value);
});

function getBg(weather: string) {
  if (
    weather.replace(/\s+/g, "").includes("晴") &&
    weather.replace(/\s+/g, "").includes("くもり")
  )
    return "default";
  if (weather.includes("雨") || weather.includes("雪")) return "rainy";
  if (weather.startsWith("くもり") || weather.includes("雷")) return "cloudy";
  if (weather.startsWith("晴")) return "sunny";
  return "default";
}

const currentWeather = computed(() => {
  return weatherData.value?.forecasts?.[0]?.weather ?? "";
});

watchEffect(() => {
  document.body.className = getBg(currentWeather.value);
});

// 初回　＋　エリア変更
watch(selectedArea, (area) => {
  (fetchAll(area), { immediate: true });
});

// 現在地
async function handleLocation() {
  try {
    const areaCode = await getCurrentLocation();

    selectedArea.value = areaCode;

    // regionも同期
    const region = findRegionByAreaCode(areaCode);
    if (region) {
      selectedRegion.value = region.region;
    }
  } catch (e) {
    alert("位置情報の取得に失敗しました");
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <img src="/logo.svg" class="logo" />
    </div>

    <div v-if="loading" class="loading">読み込み中...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else-if="weatherData">
      <AreaSelector
        v-model:region="selectedRegion"
        v-model:area="selectedArea"
        :isLocating="isLocating"
        @location="handleLocation"
      />
      <WeatherList
        v-if="weatherData"
        :forecasts="weatherData.forecasts"
        :selectedArea="selectedArea"
      />
      <Overview v-if="overview" :text="overview" :key="selectedArea" />
      <Footer />
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: "Helvetica", sans-serif;
  color: #666;
}

.container {
  max-width: 1000px;
  margin: auto;
  padding: 40px;
  text-align: center;
  min-height: 100vh;
  transition: background 0.8s ease;
}

@media (max-width: 600px) {
  .container {
    padding: 12px;
  }
}

/* 晴れ */
body.sunny {
  /* background: linear-gradient(135deg, #89f7fe, #66a6ff); */
  background: linear-gradient(135deg, #fff8dc, #add8e6);
}

/* 雨 */
body.rainy {
  background: linear-gradient(135deg, lightgray, #6495ed);
}

/* 曇 */
body.cloudy {
  background: linear-gradient(135deg, white, #304352);
}

/* fallback */
body.default {
  background: linear-gradient(135deg, white, #add8e6);
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
}

.logo {
  width: 60%;
}

.loading {
  font-size: 18px;
}

h1 {
  color: white;
  font-size: 28px;
}

h4.location {
  font-weight: bold;
  color: #666;
}

.fade-enter-active {
  transition: all 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
