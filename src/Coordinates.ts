import { CoordinateHelper } from './helper/CoordinateHelper';
import { LatLng } from './interfaces/coordinates/LatLng'
import { DegreeMinutes } from './interfaces/coordinates/DegreeMinutes'
import { DegreeMinuteSeconds } from './interfaces/coordinates/DegreeMinuteSeconds'
import { Utm } from './interfaces/coordinates/Utm'

export class Coordinates {

    constructor() {}

    dd: LatLng;
    dm: DegreeMinutes;
    // dms: DegreeMinuteSeconds;
    utm: Utm;

    static fromDD(dd: LatLng) {
        let coords = new Coordinates();
        // Init dd
        coords.dd = dd;

        // Convert to DM
        coords.dm = CoordinateHelper.coordinateLatLngToDm(dd);
        // Convert to UTM
        coords.utm = CoordinateHelper.coordinateLatLngToUtm(dd);

        return coords;
    }

    static fromDM(dm: DegreeMinutes) {
        let coords = new Coordinates();
        // Init DM
        coords.dm = dm;

        // Convert to DD
        coords.dd = CoordinateHelper.coordinateDmToLatLng(dm);
        // Convert to UTM
        coords.utm = CoordinateHelper.coordinateLatLngToUtm(coords.dd);

        return coords;
    }

    // static fromDMS(dms: DegreeMinuteSeconds) {
    //     let coords = new Coordinates();
    //     return coords;
    // }

    // static fromUTM(utm: Utm) {
    //     let coords = new Coordinates();
    //     return coords;
    // }
}