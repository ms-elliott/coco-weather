import { areas } from "../data/areas";

// エリア変換
export function useAreas() {
  function findAreaCodeFromPref(prefCode: string): string {
    for (const region of areas) {
      for (const area of region.list) {
        if (area.code.startsWith(prefCode)) {
          return area.code;
        }
      }
    }
    return "130000";
  }

  function findRegionByAreaCode(code: string) {
    return areas.find((r) => r.list.some((a) => a.code === code));
  }

  return {
    findAreaCodeFromPref,
    findRegionByAreaCode,
  };
}
