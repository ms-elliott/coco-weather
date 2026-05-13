import { JmaForecast } from "../types/jmaForecast";
import { WeatherResponse } from "../types/weather";

export function transform(data: JmaForecast): WeatherResponse {
    if (!data || data.length === 0) {
        throw new Error("データが空です");
    }

    const ts = data[0]?.timeSeries;

    if (!ts || ts.length < 3) {
        throw new Error("timeSeriesが不正です");
    }

    // 👇 ここが重要（直接 ts[0] を使わない）
    const weatherSeries = ts[0];
    const popSeries = ts[1];
    const tempSeries = ts[2];

    if (!weatherSeries) {
        throw new Error("weatherSeriesが不正です");
    }

    const area = weatherSeries.areas?.[0];

    if (!area) {
        throw new Error("areaが存在しません");
    }

    return {
        location: area.area.name,
        forecasts: weatherSeries.timeDefines.map((date, i) => ({
            date,
            weather: area.weathers?.[i] ?? "",
            temperature: {
                min: Number(tempSeries?.areas?.[0]?.temps?.[i * 2]),
                max: Number(tempSeries?.areas?.[0]?.temps?.[i * 2 + 1]),
            },
            precipitationProbability: Number(
                popSeries?.areas?.[0]?.pops?.[i] ?? 0,
            ),
        })),
    };
}
