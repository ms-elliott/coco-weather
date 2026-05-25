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
        weather.replace(/\s+/g, "") === "晴れ時々くもり" ||
        weather.replace(/\s+/g, "") === "くもり時々晴れ"
    )
        return "./icons/default.png";
    if (weather.startsWith("雨") || weather.startsWith("あめ"))
        return "/icons/rain.png";
    if (weather.startsWith("曇") || weather.startsWith("くもり"))
        return "/icons/cloud.png";
    if (weather.startsWith("晴") || weather.startsWith("はれ"))
        return "/icons/sun.png";
    if (weather.startsWith("雷") || weather.startsWith("かみなり"))
        return "/icons/thunder.png";
    if (weather.startsWith("雪") || weather.startsWith("ゆき"))
        return "/icons/snow.png";
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

const selectedRegion = ref("関東甲信");
const selectedArea = ref("130000");

const filteredAreas = computed(() => {
    return areas.find((a) => a.region === selectedRegion.value)?.list ?? [];
});

watch(selectedRegion, (newRegion) => {
    const region = areas.find((a) => a.region === newRegion);
    if (region) {
        selectedArea.value = region.list[0].code;
        fetchWeather();
    }
});

async function fetchWeather() {
    console.log("selectedArea", selectedArea.value);
    const res = await fetch(
        `https://xxxxx.onrender.com/weather?area=${selectedArea.value}`,
    );
    weatherData.value = await res.json();
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
                <select v-model="selectedRegion">
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
            <h2 class="location">ー {{ weatherData.location }} ー</h2>

            <transition-group name="fade" tag="div" class="cards">
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
                            <img
                                :src="getWeatherIcon(item.weather)"
                                class="icon"
                            />
                        </div>
                        <div class="weather-discribe">
                            <p>{{ item.weather.replace(/\s+/g, "") }}</p>
                        </div>
                    </div>
                    <!-- 気温（メイン） -->
                    <p class="temp">
                        <span class="max"
                            >{{ item.temperature.max ?? "-" }}°</span
                        >
                        <span class="min"
                            >{{ item.temperature.min ?? "-" }}°</span
                        >
                    </p>
                    <!-- 降水 -->
                    <p class="rain">
                        ☔ {{ item.precipitationProbability ?? "-" }}%
                    </p>
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

    .overview-card {
        padding: 16px;
    }
}

/* 晴れ */
.container.sunny {
    /* background: linear-gradient(135deg, #89f7fe, #66a6ff); */
    background: linear-gradient(135deg, #fff8dc, #add8e6);
}

/* 雨 */
.container.rainy {
    background: linear-gradient(135deg, lightgray, #87ceeb);
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
    color: white;
    font-size: 18px;
}

h1 {
    color: white;
    font-size: 28px;
}

h2.location {
    margin-bottom: 30px;
    font-weight: bold;
    color: #666;
}

.cards {
    display: flex;
    gap: 12px;
    padding: 20px;
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
    color: #666;
    margin-bottom: 8px;
}

.date {
    font-size: 14px;
    color: #666;
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

.max {
    color: #ff6b6b;
    margin-right: 6px;
}

.min {
    color: #4dabf7;
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
