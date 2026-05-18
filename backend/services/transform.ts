import { JmaForecast } from "../types/jmaForecast";
import { WeatherResponse } from "../types/weather";

export function transform(data: JmaForecast): WeatherResponse {
    // ===== ガード =====
    if (!data || data.length === 0) {
        throw new Error("データが空です");
    }

    const ts = data[0]?.timeSeries;

    if (!ts || ts.length < 3) {
        throw new Error("timeSeriesが不正です");
    }

    const weatherSeries = ts[0];
    const popSeries = ts.find((s: any) => s.areas?.[0]?.pops);
    const tempSeries = ts[2];

    if (!weatherSeries || !weatherSeries.areas?.length) {
        throw new Error("weatherSeriesが不正です");
    }

    const area = weatherSeries.areas[0];

    if (!area) {
        throw new Error("areaが存在しません");
    }

    const pop = popSeries?.areas?.[0]?.pops ?? [];
    const temp = tempSeries?.areas?.[0]?.temps ?? [];

    return {
        location: area.area.name,
        forecasts: weatherSeries.timeDefines.map((date: string, i: number) => {
            // ===== 気温 =====
            const temperature: { min?: number; max?: number } = {};

            const tempTimes = tempSeries?.timeDefines ?? [];
            const tempValues = tempSeries?.areas?.[0]?.temps ?? [];

            // 👇 weatherの日付（YYYY-MM-DDだけ比較）
            const weatherDay = date.split("T")[0] ?? "";

            // 👇 temp側から一致する日を探す
            const tempIndex = tempTimes.findIndex((t: string) =>
                t.startsWith(weatherDay),
            );

            if (tempIndex !== -1) {
                const min = Number(tempValues[tempIndex * 2]);
                const max = Number(tempValues[tempIndex * 2 + 1]);

                if (!isNaN(min)) temperature.min = min;
                if (!isNaN(max)) temperature.max = max;
            }

            // ===== 降水確率 =====
            let precipitationProbability: number | undefined = undefined;

            const popTimes = popSeries?.timeDefines ?? [];
            const popValues = popSeries?.areas?.[0]?.pops ?? [];

            if (weatherDay) {
                const indices = popTimes
                    .map((t: string, idx: number) =>
                        t.startsWith(weatherDay) ? idx : -1,
                    )
                    .filter((idx: number) => idx !== -1);

                const validPops = indices
                    .map((idx: number) => popValues[idx])
                    .filter(
                        (p): p is string =>
                            p !== undefined && p !== "" && p !== "--",
                    )
                    .map((p) => Number(p))
                    .filter((n) => !isNaN(n));

                if (validPops.length > 0) {
                    precipitationProbability = Math.max(...validPops);
                }
            }
            const result: any = {
                date,
                weather: area.weathers?.[i] ?? "",
                temperature,
            };

            if (precipitationProbability !== undefined) {
                result.precipitationProbability = precipitationProbability;
            }

            return result;
        }),
    };
}
