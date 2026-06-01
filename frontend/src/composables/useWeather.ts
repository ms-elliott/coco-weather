import { ref } from "vue";
import type { WeatherResponse } from "../types/weather";

const API_URL = "https://coco-weather.onrender.com";

export function useWeather() {
  const weatherData = ref<WeatherResponse | null>(null);
  const overview = ref<string>("");
  const isFirstLoad = ref(true);
  const loading = ref<boolean>(true);
  const error = ref<string | null>(null);

  // 天気取得
  async function fetchWeather(area: string) {
    const res = await fetch(`${API_URL}/api/weather?area=${area}`);

    if (!res.ok) {
      throw new Error("天気データ取得失敗");
    }

    const data: WeatherResponse = await res.json();
    weatherData.value = data;
  }

  // 概況取得
  async function fetchOverview(area: string) {
    const res = await fetch(`${API_URL}/api/overview?area=${area}`);

    if (!res.ok) {
      throw new Error("概況取得失敗");
    }

    const data = await res.json();
    overview.value = data.text;
  }

  // まとめて取得
  async function fetchAll(area: string) {
    if (isFirstLoad.value) {
      loading.value = true;
    }

    error.value = null;

    try {
      await Promise.all([fetchWeather(area), fetchOverview(area)]);
    } catch (e) {
      console.error(e);
      error.value = "データ取得に失敗しました";
    } finally {
      loading.value = false;
      isFirstLoad.value = false;
    }
  }

  return {
    weatherData,
    overview,
    loading,
    error,
    fetchAll,
  };
}
