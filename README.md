# 📍ココウェザー

気象庁APIを利用した天気予報アプリです。
地域選択や現在地取得に対応し、3日間の天気予報・降水確率・天気概況を表示します。

## URL

* Frontend: [coco-weather-six.vercel.app](https://coco-weather-six.vercel.app/)
* Backend: [coco-weather.onrender.com](https://coco-weather.onrender.com)

---

# 使用技術

## Frontend

* Vue 3
* TypeScript
* Vite

## Backend

* Node.js
* Express
* TypeScript

## API

* 気象庁 天気予報API
* 国土地理院 逆ジオコーディングAPI

---

# 主な機能

* 地方 / エリア選択による天気取得
* 現在地から最適なエリアを自動判定
* 3日間の天気予報表示 (晴、雨、くもり、雪、雷、晴/くもりの6種に分類)
* 降水確率表示
* 天気概況表示
* 天気ごとの背景グラデーション変更
* レスポンシブ対応（スマホ表示対応）
* ローディング表示
* エリア変更時のアニメーション

---

# 画面キャプチャ

| トップ画面　(データ読み込み中　〜　東京都表示、背景：雨・雪)|　現在地表示（静岡県） |
| ---- | ---- |
| <video width="45%" src="https://github.com/user-attachments/assets/86550b51-401c-4516-95a9-78f33a60836b"> | <video width="45%" src="https://github.com/user-attachments/assets/8ffa8184-c8e3-4c4c-9780-4b3c75d23748"> |
| 背景：晴 |　背景：くもり・雷 |
| <video  width="45%" src="https://github.com/user-attachments/assets/766c0535-5f22-408a-ab7d-d3681f23a913"> | <video width="45%" src="https://github.com/user-attachments/assets/bde31d66-4654-4c7a-84bd-924aa2937af5"> |
| 背景：晴/くもり(デフォルト)|　データ取得エラー |
| <video width="45%" src="https://github.com/user-attachments/assets/02b2c9f6-ff44-427b-a5c2-3c1157d1d88c"> | <video width="45%" src="https://github.com/user-attachments/assets/fa997f34-1702-4871-a53f-ae9760575c08">　|

| レスポンシブ対応(モバイル) |
| ---- |
| <img width="399" height="819" alt="スクリーンショット 2026-06-04 午後10 43 37" src="https://github.com/user-attachments/assets/4dd28441-178a-4252-bea0-964339ec10dd" /> |

---

# 工夫したポイント

## 1. 複数データソースの統合

複数の外部APIを組み合わせてデータを統合しています。

【使用しているデータソース】
・気象庁 天気予報API
・気象庁 天気概況API
・国土地理院 逆ジオコーディングAPI
・ブラウザ Geolocation API

【データ連携フロー】
現在地取得
↓
緯度経度取得
↓
国土地理院APIで都道府県判定
↓
天気エリアコードへ変換
↓
気象庁APIから天気情報取得
↓
Frontendへ整形データを返却

異なるレスポンス形式のAPIを統合するため、
Backend側でデータ変換処理を実装しています。

---

## 2. 気象庁APIのデータ整形

気象庁APIはレスポンス構造が複雑だったため、
Backend側で transform 処理を実装し、Frontendで扱いやすい形へ変換しました。

特に以下を考慮しています。

* 気温データの欠損対応
* 最低 / 最高気温の算出
* 降水確率の最大値抽出
* 不要データの除去

---

## 3. 現在地取得機能

ブラウザの Geolocation API を利用し、
現在地の緯度経度から都道府県コードを判定しています。

取得した座標を国土地理院APIへ渡し、
都道府県コードを天気エリアコードへ変換しています。

---

## 4. コンポーネント設計

Vueコンポーネントを責務ごとに分割しました。

* AreaSelector
* WeatherList
* WeatherCard
* Overview
* Footer

また、API通信や位置情報取得は composables に分離しています。

* useWeather
* useLocation
* useAreas

---

## 5. UI / UX

* 天気に応じた背景グラデーション変更
* カードアニメーション
* ローディングスピナー
* モバイル最適化
* transition-group による自然な表示切り替え


---

# セットアップ

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
npm install
npm run start
```
