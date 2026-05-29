<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { areas } from "./data/areas";

type Weather = {
  date: string;
  weather: string;
  temperature: {
    min?: number;
    max?: number;
  };
  precipitationProbability?: number;
};

type WeatherResponse = {
  location: string;
  forecasts: Weather[];
};

const weatherData = ref<WeatherResponse | null>(null);
const loading = ref(true);
const API_URL = "https://coco-weather.onrender.com";

onMounted(async () => {
  try {
    // const res = await fetch("http://localhost:3000/api/weather");
    const res = await fetch(
      `${API_URL}/api/weather?area=${selectedArea.value}`,
    );
    const data = await res.json();
    weatherData.value = data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

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

function getBg(weather: string) {
  if (weather.includes("雨") || weather.includes("雪")) return "rainy";
  if (weather.includes("くもり") || weather.includes("雷")) return "cloudy";
  if (weather.includes("晴")) return "sunny";
  return "default";
}

const currentWeather = computed(() => {
  return weatherData.value?.forecasts?.[0]?.weather ?? "";
});

const overview = ref("");

onMounted(async () => {
  const res = await fetch(`${API_URL}/api/overview`);
  const data = await res.json();
  overview.value = data.text;
});

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

const isLocating = ref(false);

async function getCurrentLocation() {
  isLocating.value = true;

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        console.log("現在地:", lat, lon);

        const areaCode = await getAreaCodeFromLatLon(lat, lon);

        console.log("決定エリア:", areaCode);

        const region = findRegionByAreaCode(areaCode);

        if (region) {
          selectedRegion.value = region.region;
        }

        selectedArea.value = areaCode;

        await fetchWeather();
        await fetchOverview();
      } catch (e) {
        console.error(e);
        alert("現在地の取得に失敗しました");
      } finally {
        isLocating.value = false; // ← ここ重要
      }
    },
    (err) => {
      console.error(err);
      alert("位置情報の取得に失敗しました");
      isLocating.value = false; // ← 忘れがち
    },
  );
}

async function getAreaCodeFromLatLon(
  lat: number,
  lon: number,
): Promise<string> {
  const res = await fetch(
    `https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${lat}&lon=${lon}`,
  );

  const data = await res.json();

  const muniCd = data.results.muniCd; // 例: "13101"
  const prefCode = muniCd.slice(0, 2); // "13"

  return findAreaCodeFromPref(prefCode);
}

function findAreaCodeFromPref(prefCode: string): string {
  for (const region of areas) {
    for (const area of region.list) {
      if (area.code.startsWith(prefCode)) {
        return area.code;
      }
    }
  }

  return "130000"; // fallback（東京）
}

function findRegionByAreaCode(code: string) {
  return areas.find((r) => r.list.some((a) => a.code === code));
}

const selectedRegion = ref("関東甲信");
const selectedArea = ref("130000");

function onRegionChange() {
  const region = areas.find((a) => a.region === selectedRegion.value);
  if (region) {
    selectedArea.value = region.list[0].code;
  }
}

const filteredAreas = computed(() => {
  return areas.find((a) => a.region === selectedRegion.value)?.list ?? [];
});

watch(selectedArea, async () => {
  await Promise.all([fetchWeather(), fetchOverview()]);
});

async function fetchWeather() {
  const res = await fetch(`${API_URL}/api/weather?area=${selectedArea.value}`);
  weatherData.value = await res.json();
}

async function fetchOverview() {
  const res = await fetch(`${API_URL}/api/overview?area=${selectedArea.value}`);
  const data = await res.json();
  overview.value = data.text;
}
</script>

<template>
  <div :class="['container', getBg(currentWeather)]">
    <div class="header">
      <img src="/logo.svg" class="logo" />
    </div>

    <div v-if="loading" class="loading">読み込み中...</div>

    <div v-else-if="weatherData">
      <div class="selector-wrapper">
        <button
          class="location-btn"
          @click="getCurrentLocation"
          :disabled="isLocating"
        >
          <span v-if="isLocating" class="loading-content">
            <span class="spinner"></span>
            取得中...
          </span>
          <span v-else>📍 現在地</span>
        </button>
        <select v-model="selectedRegion" @change="onRegionChange">
          <option
            v-for="region in areas"
            :key="region.region"
            :value="region.region"
          >
            {{ region.region }}
          </option>
        </select>
        <select v-model="selectedArea" @change="fetchWeather">
          <option
            v-for="area in filteredAreas"
            :key="area.code"
            :value="area.code"
          >
            {{ area.name }}
          </option>
        </select>
      </div>
      <h4 class="location">ー {{ weatherData.location }} ー</h4>

      <transition-group name="fade" tag="div" class="cards" :key="selectedArea">
        <div
          v-for="(item, index) in weatherData.forecasts.slice(0, 3)"
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
      <div class="overview-card">
        <div class="overview-header">
          <span class="icon">📝</span>
          <span class="title">天気概況</span>
        </div>

        <p class="overview-text">
          {{ overview }}
        </p>
      </div>
    </div>
    <div class="footer">
      <p>
        &copy; 2026 ms-elliott / icons by
        <a target="_blank" href="https://icons8.com">Icons8</a>
      </p>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: "Helvetica", sans-serif;
  color: #666;
  /* background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 50%, #a1c4fd 100%); */
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

.selector-wrapper select {
  background-image: url("data:image/svg+xml;utf8,<svg fill='%23666' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M5 7l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

@media (max-width: 600px) {
  .selector-wrapper select {
    width: 100%;
    font-size: 16px;
  }
}

.overview-card {
  padding: 16px;
}

/* 晴れ */
.container.sunny {
  /* background: linear-gradient(135deg, #89f7fe, #66a6ff); */
  background: linear-gradient(135deg, #fff8dc, #add8e6);
}

/* 雨 */
.container.rainy {
  background: linear-gradient(135deg, lightgray, #6495ed);
}

/* 曇 */
.container.cloudy {
  background: linear-gradient(135deg, white, #304352);
}

/* fallback */
.container.default {
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
  margin-bottom: 15px;
  font-weight: bold;
  color: #666;
}

.cards {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
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
  .cards {
    flex-direction: column;
    align-items: center;
  }

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

.overview-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-top: 20px;
  position: relative;
  line-height: 1.2;
  text-align: start;
  white-space: pre-line;
  width: 760px;
  animation: fadeUp 0.6s ease;
}

.overview-card::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 20px;
  border: 10px solid transparent;
  border-top-color: #fff;
}

.overview-header {
  margin-bottom: 16px;
}

.title {
  font-weight: bold;
}

.overview-card p {
  font-size: 14px;
}

.footer {
  margin-top: 20px;
  font-size: 12px;
  color: #555;
}

@keyframes rainBg {
  0% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(0.8);
  }
  100% {
    filter: brightness(1);
  }
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
</style>
