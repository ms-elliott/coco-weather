import axios from "axios";

export async function fetchJmaForecast(areaCode: string) {
    const url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${areaCode}.json`;
    console.log("🔥 FETCH URL:", areaCode);

    const response = await axios.get(url);

    return response.data;
}
