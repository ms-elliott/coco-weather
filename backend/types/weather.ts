export type Weather = {
    date: string;
    weather: string;
    temperature: {
        min?: number;
        max?: number;
    };
    precipitationProbability?: number;
};

export type WeatherResponse = {
    location: string;
    forecasts: Weather[];
};
