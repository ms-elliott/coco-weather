// 1つの要素
export type JmaForecastItem = {
    timeSeries: {
        timeDefines: string[];
        areas: {
            area: {
                name: string;
                code: string;
            };
            weathers?: string[];
            temps?: string[];
            pops?: string[];
        }[];
    }[];
};

// 全体（配列）
export type JmaForecast = JmaForecastItem[];
