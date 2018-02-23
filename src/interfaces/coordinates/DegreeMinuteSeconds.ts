import { DegreeMinutes } from './DegreeMinutes';

export interface DegreeMinuteSeconds extends DegreeMinutes {
    latitude: {
        hemisphere: "N" | "S" | string,
        degree: number,
        minutes: number,
        seconds: number
    },
    longitude: {
        hemisphere: "E" | "W" | string,
        degree: number,
        minutes: number,
        seconds: number
    }
}