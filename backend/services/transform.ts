import { error } from "node:console";
import { JmaForecast } from "../types/jmaForecast";
import { WeatherResponse } from "../types/weather";

export function transform(data: JmaForecast): WeatherResponse {
    // -----------------------------
    // データチェック
    // -----------------------------
    const ts = data?.[0]?.timeSeries;

    if (!ts || ts.length < 3) {
        throw new Error("timeSeriesが不正");
    }

    const weatherSeries = ts[0];
    const popSeries = ts[1];
    const tempSeries = ts[2];

    if (!weatherSeries) {
        throw new Error("weatherSeriesが不正");
    }

    const area = weatherSeries.areas?.[0];
    if (!area) {
        throw new Error("areaが存在しません");
    }

    const tempArea = tempSeries?.areas?.[0];
    const popArea = popSeries?.areas?.[0];

    // -----------------------------
    // forecasts生成
    // -----------------------------
    return {
        location: area.area.name,
        forecasts: weatherSeries.timeDefines.map((date: string, i: number) => {
            const weather = area.weathers?.[i] ?? "";

            // -----------------------------
            // 気温（完全修正版）
            // -----------------------------
            let min: number | undefined;
            let max: number | undefined;
            const temps = tempArea?.temps;

            if (tempSeries?.timeDefines && temps) {
                const sameDayTemps = tempSeries.timeDefines
                    .map((t: string, idx: number) => {
                        if (t.slice(0, 10) === date.slice(0, 10)) {
                            return Number(temps[idx]);
                        }
                        return null;
                    })
                    .filter((n): n is number => n !== null && !isNaN(n));

                // 👇 これ追加（重要）
                const uniqueTemps = [...new Set(sameDayTemps)];

                if (uniqueTemps.length === 1) {
                    max = uniqueTemps[0];
                    min = undefined;
                } else if (uniqueTemps.length > 1) {
                    min = Math.min(...uniqueTemps);
                    max = Math.max(...uniqueTemps);
                }
            }
            // -----------------------------
            // 降水確率（最大値を採用）
            // -----------------------------
            let precipitationProbability = 0;

            const pops = popArea?.pops;

            if (popSeries?.timeDefines && pops) {
                const sameDayPops = popSeries.timeDefines
                    .map((t: string, idx: number) => {
                        if (t.slice(0, 10) === date.slice(0, 10)) {
                            return pops[idx]; // ← 修正ポイント
                        }
                        return null;
                    })
                    .filter(
                        (p): p is string =>
                            p !== null && p !== "" && p !== "--",
                    )
                    .map((p) => Number(p))
                    .filter((n) => !isNaN(n));

                if (sameDayPops.length > 0) {
                    precipitationProbability = Math.max(...sameDayPops);
                }
            }

            return {
                date,
                weather,
                temperature: {
                    ...(min !== undefined ? { min } : {}),
                    ...(max !== undefined ? { max } : {}),
                },
                precipitationProbability,
            };
        }),
    };
}
