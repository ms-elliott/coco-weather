import { ref } from "vue";
import { useAreas } from "./useAreas";

// 現在地ロジック
export function useLocation() {
  const isLocating = ref(false);
  const { findAreaCodeFromPref } = useAreas();

  async function getAreaCodeFromLatLon(lat: number, lon: number) {
    const res = await fetch(
      `https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${lat}&lon=${lon}`,
    );

    const data = await res.json();
    const muniCd = data.results.muniCd;
    const prefCode = muniCd.slice(0, 2);

    return findAreaCodeFromPref(prefCode);
  }

  function getCurrentLocation(callback: (areaCode: string) => void) {
    isLocating.value = true;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          const areaCode = await getAreaCodeFromLatLon(lat, lon);

          callback(areaCode);
        } catch (e) {
          alert("現在地取得失敗");
        } finally {
          isLocating.value = false;
        }
      },
      () => {
        alert("位置情報エラー");
        isLocating.value = false;
      },
    );
  }

  return {
    isLocating,
    getCurrentLocation,
  };
}
