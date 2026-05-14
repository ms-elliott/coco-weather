<script setup lang="ts">
import { ref, onMounted } from 'vue'

type Weather = {
    date: string
    weather: string
    temperature: {
        min?: number
        max?: number
    }
    precipitstionProbability: number
}

type WeatherResponse = {
    location: string
    forecasts:Weather[]
}

const weatherData = ref<WeatherResponse | null>(null)
const loading = ref(true)

onMounted(async () => {
    try {
        const res = await fetch('http://localhost:3000/api/weather')
        const data = await res.json()
        weatherData.value = data
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="container">
        <div class="header">
            <img src="/logo.svg" class="logo" />
        </div>

        <div v-if="loading">読み込み中...</div>

        <div v-else-if="weatherData">
            <h2>{{  weatherData.location }}</h2>

            <div class="cards">
                <div v-for="(item, index) in weatherData.forecasts" :key="index" class="card">
                    <p>{{ item.date }}</p>
                    <p>{{ item.weather }}</p>
                    <p>{{ item.temperature.min }}℃ / {{ item.temperature.max }}℃</p>
                    <p>{{ item.precipitstionProbability }}%</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.container {
    max-width: 900px;
    margin: auto;
    text-align: center;
}

.cards {
    display: flex;
    gap: 16px;
    justify-content: center;
}

.card {
    background-color: #f0f8ff;
    padding: 16px;
    border-radius: 12px;
    width: 150px;
}
</style>
