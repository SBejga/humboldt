import { CoordinateHelper } from './helper/CoordinateHelper';
import { LatLng } from './interfaces/coordinates/LatLng'
import { DegreeMinutes } from './interfaces/coordinates/DegreeMinutes'
import { DegreeMinuteSeconds } from './interfaces/coordinates/DegreeMinuteSeconds'
import { Utm } from './interfaces/coordinates/Utm'

export class Coordinates {

    constructor() {}

    dd: LatLng;
    dm: DegreeMinutes;
    dms: DegreeMinuteSeconds;
    utm: Utm;

    static fromDD(dd: LatLng): Coordinates {
        let coords = new Coordinates();
        // Init dd
        coords.dd = dd;

        // Convert to DM
        coords.dm = CoordinateHelper.coordinateLatLngToDm(dd);
        // Convert to DMS
        coords.dms = CoordinateHelper.coordinateLatLngToDms(dd);
        // Convert to UTM
        coords.utm = CoordinateHelper.coordinateLatLngToUtm(dd);

        return coords;
    }

    static fromDM(dm: DegreeMinutes): Coordinates {
        let coords = new Coordinates();
        // Init DM
        coords.dm = dm;

        // Convert to DD
        coords.dd = CoordinateHelper.coordinateDmToLatLng(dm);
        // Convert to DMS
        coords.dms = CoordinateHelper.coordinateLatLngToDms(coords.dd);
        // Convert to UTM
        coords.utm = CoordinateHelper.coordinateLatLngToUtm(coords.dd);

        return coords;
    }

    static fromDMS(dms: DegreeMinuteSeconds) {
        let coords = new Coordinates();
        // Init DMS
        coords.dms = dms;

        // Convert to DD
        coords.dd = CoordinateHelper.coordinateDmsToLatLng(dms);
        // Convert to DM
        coords.dm = CoordinateHelper.coordinateLatLngToDm(coords.dd);
        // Convert to UTM
        coords.utm = CoordinateHelper.coordinateLatLngToUtm(coords.dd);
        return coords;
    }

    static fromUTM(utm: Utm): Coordinates {
        let coords = new Coordinates();
        // Init UTM
        coords.utm = utm;

        // Convert to DD
        coords.dd = CoordinateHelper.coordinateUtmToLatLng(utm);
        // Convert to DM
        coords.dm = CoordinateHelper.coordinateLatLngToDm(coords.dd);
        // Convert to DMS
        coords.dms = CoordinateHelper.coordinateLatLngToDms(coords.dd);

        return coords;
    }
}