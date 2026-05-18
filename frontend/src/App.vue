<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

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

onMounted(async () => {
    try {
        const res = await fetch("http://localhost:3000/api/weather");
        const data = await res.json();
        weatherData.value = data;
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
});

function getWeatherIcon(weather: string) {
    if (weather.includes("雷")) return "/icons/thunder.png";
    if (weather.includes("雪")) return "/icons/snow.png";
    if (weather.includes("雨")) return "/icons/rain.png";
    if (weather.includes("曇")) return "/icons/cloud.png";
    if (weather.includes("晴")) return "/icons/sun.png";
    return "/icons/default.png";
}

function getBg(weather: string) {
    if (weather.includes("雨") || weather.includes("雪")) return "rainy";
    if (weather.includes("曇") || weather.includes("雷")) return "cloudy";
    if (weather.includes("晴")) return "sunny";
    return "default";
}

const currentWeather = computed(() => {
    return weatherData.value?.forecasts?.[0]?.weather ?? "";
});

const overview = ref("");

onMounted(async () => {
    const res = await fetch("http://localhost:3000/api/overview");
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
</script>

<template>
    <div :class="['container', getBg(currentWeather)]">
        <div class="header">
            <img src="/logo.svg" class="logo" />
        </div>

        <div v-if="loading" class="loading">読み込み中...</div>

        <div v-else-if="weatherData">
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
                    <p class="weather">
                        <img :src="getWeatherIcon(item.weather)" class="icon" />
                    </p>
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
    gap: 16px;
    justify-content: center;
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

.icon {
    width: 48px;
    height: 48px;
    width: 50%;
    height: 50%;
}

temp {
    font-size: 24px;
    font-weight: bold;
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
}

.overview-card::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 20px;
    border: 10px solid transparent;
    border-top-color: #fff;
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
