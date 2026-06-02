import { ref } from "vue";
import { useAreas } from "./useAreas";

// 現在地ロジック
export function useLocation() {
  const isLocating = ref(false);
  const { findAreaCodeFromPref } = useAreas();

  //   async function getAreaCodeFromLatLon(lat: number, lon: number) {
  //     const res = await fetch(
  //       `https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${lat}&lon=${lon}`,
  //     );

  //     const data = await res.json();
  //     const muniCd = data.results.muniCd;
  //     const prefCode = muniCd.slice(0, 2);

  //     return findAreaCodeFromPref(prefCode);
  //   }

  function getCurrentLocation(): Promise<string> {
    isLocating.value = true;

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            const res = await fetch(
              `https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${lat}&lon=${lon}`,
            );

            const data = await res.json();
            const muniCd = data.results.muniCd;
            const prefCode = muniCd.slice(0, 2);

            const areaCode = findAreaCodeFromPref(prefCode);

            resolve(areaCode);
          } catch (e) {
            reject(e);
          } finally {
            isLocating.value = false;
          }
        },
        (err) => {
          isLocating.value = false;
          reject(err);
        },
      );
    });
  }

  return {
    isLocating,
    getCurrentLocation,
  };
}
