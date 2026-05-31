export function getLabel(date: string) {
  const today = new Date();
  const target = new Date(date);

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

export function getWeatherIcon(weather: string) {
  if (
    weather.replace(/\s+/g, "").includes("晴") &&
    weather.replace(/\s+/g, "").includes("くもり")
  )
    return "/icons/default.png";

  if (weather.includes("雨")) return "/icons/rain.png";
  if (weather.includes("曇")) return "/icons/cloud.png";
  if (weather.includes("晴")) return "/icons/sun.png";
  if (weather.includes("雷")) return "/icons/thunder.png";
  if (weather.includes("雪")) return "/icons/snow.png";

  return "/icons/default.png";
}
