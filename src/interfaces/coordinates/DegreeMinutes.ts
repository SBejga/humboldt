export type Hemisphere = "N" | "S" | "E" | "W";

export interface DegreeMinutes {
    latitude: {
        hemisphere: "N" | "S" | string,
        degree: number,
        minutes: number
    },
    longitude: {
        hemisphere: "E" | "W" | string,
        degree: number,
        minutes: number
    }
}