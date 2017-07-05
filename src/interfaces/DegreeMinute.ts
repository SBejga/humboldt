export type LatDirection = "N" | "S";
export type LngDirection = "E" | "W";

export interface DegreeMinute {
    lat_direction: string,
    lat_degree: number,
    lat_minutes: number,
    lng_direction: string,
    lng_degree: number,
    lng_minutes: number,

}