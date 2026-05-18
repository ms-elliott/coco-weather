import axios from "axios";

export async function fetchOverview() {
    const url =
        "https://www.jma.go.jp/bosai/forecast/data/overview_forecast/130000.json";

    const res = await axios.get(url);

    return {
        text: res.data.text,
        publishingOffice: res.data.publishingOffice,
        reportDatetime: res.data.reportDatetime,
    };
}
