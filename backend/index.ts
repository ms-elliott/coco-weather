import express from "express";
import cors from "cors";
import { fetchJmaForecast } from "./services/jmaApi";
import { transform } from "./services/transform";
import { fetchOverview } from "./services/fetchOverview";

const app = express();

app.use(cors());

const PORT = 3000;

// app.get("/", (req, res) => {
//     res.send("API OK");
// });

// app.get("/api/weather", async (req, res) => {
//     try {
//         const raw = await fetchJmaForecast("130000"); // 東京都
//         const data = transform(raw);

//         res.json(data);
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({ error: "failed" });
//     }
// });

// app.get("/api/overview", async (req, res) => {
//     try {
//         const data = await fetchOverview();
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ error: "取得失敗" });
//     }
// });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
