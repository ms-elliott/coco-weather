<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
// import { areas } from "./data/areas";

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

// type Weather = {
//   date: string;
//   weather: string;
//   temperature: {
//     min?: number;
//     max?: number;
//   };
//   precipitationProbability?: number;
// };

// type WeatherResponse = {
//   location: string;
//   forecasts: Weather[];
// };

// const weatherData = ref<WeatherResponse | null>(null);
// const loading = ref(true);
// const API_URL = "https;://coco-weather.onrender.com";

onMounted(() => {
  fetchAll(selectedArea.value);
});

// onMounted(async () => {
//   try {
//     const res = await fetch(
//       `${API_URL}/api/weather?area=${selectedArea.value}`,
//     );
//     const data = await res.json();
//     weatherData.value = data;
//   } catch (e) {
//     console.error(e);
//   } finally {
//     loading.value = false;
//   }
// });

// function getWeatherIcon(weather: string) {
//   if (
//     weather.replace(/\s+/g, "").includes("晴") &&
//     weather.replace(/\s+/g, "").includes("くもり")
//   )
//     return "/icons/default.png";
//   if (weather.includes("雨") || weather.includes("あめ"))
//     return "/icons/rain.png";
//   if (weather.includes("曇") || weather.includes("くもり"))
//     return "/icons/cloud.png";
//   if (weather.includes("晴") || weather.includes("はれ"))
//     return "/icons/sun.png";
//   if (weather.includes("雷") || weather.includes("かみなり"))
//     return "/icons/thunder.png";
//   if (weather.includes("雪") || weather.includes("ゆき"))
//     return "/icons/snow.png";
//   return "/icons/default.png";
// }

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
  if (weather.includes("雷")) return "/icons/thunder.png";
  if (weather.includes("雪")) return "/icons/snow.png";
  if (weather.includes("雨")) return "/icons/rain.png";
  if (weather.includes("くもり")) return "/icons/cloud.png";
  if (weather.includes("晴")) return "/icons/sun.png";
  return "/icons/default.png";
}

function getBg(weather: string) {
  if (
    weather.replace(/\s+/g, "").includes("晴") &&
    weather.replace(/\s+/g, "").includes("くもり")
  )
    return "default";
  if (weather.includes("雨") || weather.includes("雪")) return "rainy";
  if (weather.includes("くもり") || weather.includes("雷")) return "cloudy";
  if (weather.startsWith("晴")) return "sunny";
  return "default";
}

const currentWeather = computed(() => {
  return weatherData.value?.forecasts?.[0]?.weather ?? "";
});

// const overview = ref("");

// onMounted(async () => {
//   const res = await fetch(`${API_URL}/api/overview`);
//   const data = await res.json();
//   overview.value = data.text;
// });

// function getLabel(date: string) {
//   const today = new Date();
//   const target = new Date(date);

//   // 日付だけ比較するために0時に揃える
//   today.setHours(0, 0, 0, 0);
//   target.setHours(0, 0, 0, 0);

//   const diff = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

//   if (diff === 0) return "今日";
//   if (diff === 1) return "明日";
//   if (diff === 2) return "明後日";

//   return target.toLocaleDateString("ja-JP", {
//     month: "numeric",
//     day: "numeric",
//   });
// }

// const isLocating = ref(false);

// async function getCurrentLocation() {
//   isLocating.value = true;

//   navigator.geolocation.getCurrentPosition(
//     async (pos) => {
//       try {
//         const lat = pos.coords.latitude;
//         const lon = pos.coords.longitude;

//         console.log("現在地:", lat, lon);

//         const areaCode = await getAreaCodeFromLatLon(lat, lon);

//         console.log("決定エリア:", areaCode);

//         const region = findRegionByAreaCode(areaCode);

//         if (region) {
//           selectedRegion.value = region.region;
//         }

//         selectedArea.value = areaCode;

//         await fetchWeather();
//         await fetchOverview();
//       } catch (e) {
//         console.error(e);
//         alert("現在地の取得に失敗しました");
//       } finally {
//         isLocating.value = false; // ← ここ重要
//       }
//     },
//     (err) => {
//       console.error(err);
//       alert("位置情報の取得に失敗しました");
//       isLocating.value = false; // ← 忘れがち
//     },
//   );
// }

// async function getAreaCodeFromLatLon(
//   lat: number,
//   lon: number,
// ): Promise<string> {
//   const res = await fetch(
//     `https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${lat}&lon=${lon}`,
//   );

//   const data = await res.json();

//   const muniCd = data.results.muniCd; // 例: "13101"
//   const prefCode = muniCd.slice(0, 2); // "13"

//   return findAreaCodeFromPref(prefCode);
// }

// function findAreaCodeFromPref(prefCode: string): string {
//   for (const region of areas) {
//     for (const area of region.list) {
//       if (area.code.startsWith(prefCode)) {
//         return area.code;
//       }
//     }
//   }

//   return "130000"; // fallback（東京）
// }

// function findRegionByAreaCode(code: string) {
//   return areas.find((r) => r.list.some((a) => a.code === code));
// }

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

// // 地域変更
// function handleRegion() {
//   const region = areas.find((a) => a.region === selectedRegion.value);
//   if (region) {
//     selectedArea.value = region.list[0].code;
//   }
// }

// function onRegionChange(region: string) {
//   selectedRegion.value = region;

//   const target = areas.find((a) => a.region === region);

//   if (target) {
//     selectedArea.value = target.list[0].code; // ← ここ重要
//   }
// }

// // エリア変更
// function handleArea(area: string) {
//   selectedArea.value = area;
// }

// function handleLocationClick() {
//   getCurrentLocation((areaCode) => {
//     selectedArea.value = areaCode;
//   });
// }

// フィルタ
// const filteredAreas = computed(() => {
//   return areas.find((a) => a.region === selectedRegion.value)?.list ?? [];
// });

// watch(selectedArea, async () => {
//   await Promise.all([fetchWeather(), fetchOverview()]);
// });

// async function fetchWeather() {
//   const res = await fetch(`${API_URL}/api/weather?area=${selectedArea.value}`);
//   weatherData.value = await res.json();
// }

// async function fetchOverview() {
//   const res = await fetch(`${API_URL}/api/overview?area=${selectedArea.value}`);
//   const data = await res.json();
//   overview.value = data.text;
// }
</script>

<template>
  <div :class="['container', getBg(currentWeather)]">
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
      <!-- <div class="selector-wrapper">
        <button
          class="location-btn"
          @click="handleLocation"
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
        <select v-model="selectedArea">
          <option
            v-for="area in filteredAreas"
            :key="area.code"
            :value="area.code"
          >
            {{ area.name }}
          </option>
        </select>
      </div> -->
      <!-- <h4 class="location">ー {{ weatherData.location }} ー</h4> -->

      <WeatherList
        v-if="weatherData"
        :forecasts="weatherData.forecasts"
        :selectedArea="selectedArea"
        :getLabel="getLabel"
        :getWeatherIcon="getWeatherIcon"
      />
      <!-- <transition-group name="fade" tag="div" class="cards" :key="selectedArea"> -->
      <!-- <div
          v-for="(item, index) in weatherData.forecasts.slice(0, 3)"
          :key="item.date"
          class="card"
          :style="{ animationDelay: `${index * 0.2}s` }"
        >
          <h2 class="label">{{ getLabel(item.date) }}</h2> -->
      <!-- 日付 -->
      <!-- <p class="date">
            {{
              new Date(item.date).toLocaleDateString("ja-JP", {
                month: "numeric",
                day: "numeric",
                weekday: "short",
              })
            }}
          </p> -->
      <!-- 天気 -->
      <!-- <div class="weather-wrapper">
            <div class="weather">
              <img :src="getWeatherIcon(item.weather)" class="icon" />
            </div> -->
      <!-- </div> -->
      <!-- 気温（メイン） -->
      <!-- <p class="temp">
            <span class="min">{{ item.temperature.min ?? "-" }}°</span>
            <span class="max">{{ item.temperature.max ?? "-" }}°</span>
          </p> -->
      <!-- 降水 -->
      <!-- <p class="rain">☔ {{ item.precipitationProbability ?? "-" }}%</p>
        </div> -->
      <!-- </transition-group> -->
      <!-- <div class="overview-card">
        <div class="overview-header">
          <span class="icon">📝</span>
          <span class="title">天気概況</span>
        </div>

        <p class="overview-text">
          {{ overview }}
        </p>
      </div>
    </div> -->
      <!-- <div class="footer">
      <p>
        &copy; 2026 ms-elliott / icons by
        <a target="_blank" href="https://icons8.com">Icons8</a>
      </p>
    </div> -->
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

/* @keyframes rainBg {
  0% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(0.8);
  }
  100% {
    filter: brightness(1);
  }
} */

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
