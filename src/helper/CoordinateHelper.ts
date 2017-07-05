import { LatLng } from './../interfaces/LatLng';
import { DegreeMinute } from './../interfaces/DegreeMinute';

const DM_COORDINATE_REGEX = "([NS]) ([0-9]+)°? ([0-9]+\.[0-9]+)'? ([EW]) ([0-9]+)°? ([0-9]+\.[0-9]+)'?";

export class CoordinateHelper {

    static parseDegreeMinute(coordinate: string) : DegreeMinute | null {
        let RE = new RegExp(DM_COORDINATE_REGEX, "g");
        let matchArray = RE.exec(coordinate);
        // console.log("matchArray", matchArray);
        
        //should only found once
        if (!matchArray) {
            // console.log("dm coordinate not matched");
            return null;
        }

        //match[0] = is full regex match, at [1] found group starts
        let NS = matchArray[1];
        let NS_D = Number(matchArray[2]);
        let NS_M = Number(matchArray[3]);
        let EW = matchArray[4];
        let EW_D = Number(matchArray[5]);
        let EW_M = Number(matchArray[6]);

        let newDegreeMinutes : DegreeMinute = {
            lat_direction: NS,
            lat_degree: NS_D,
            lat_minutes: NS_M,
            lng_direction: EW,
            lng_degree: EW_D,
            lng_minutes: EW_M
        }
        return newDegreeMinutes;
    }

    static validateDegreeMinute(coordinate: string) : boolean {
        let dm = CoordinateHelper.parseDegreeMinute(coordinate);

        //not null
        if (dm === null) {
            return false;
        }

        // N, S, E or W
        if (dm.lat_direction !== "N" && dm.lat_direction !== "S") {
            return false;
        }
        if (dm.lng_direction !== "E" && dm.lng_direction !== "W") {
            return false;
        }

        //Degrees 0 <= x <= 90 or 180
        if (dm.lat_degree < 0 || dm.lat_degree > 90) {
            return false;
        }
        if (dm.lng_degree < 0 || dm.lng_degree > 180) {
            return false;
        }

        // Minutes 0.001 <= x <= 60.999
        if (dm.lat_minutes < 0.001 || dm.lat_minutes > 60.999) {
            return false;
        }
        if (dm.lng_minutes < 0.001 || dm.lng_minutes > 60.999) {
            return false;
        }

        return true;
    }

    static coordinateDmToLatLng(coordinate: string): LatLng | null {
        let dm = CoordinateHelper.parseDegreeMinute(coordinate);
        let validDm = CoordinateHelper.validateDegreeMinute(coordinate);

        if (validDm === false || dm === null) {
            return null;
        }

        //Calculate to DDD.DDDDDD
        let lat = dm.lat_degree + dm.lat_minutes / 60;
        let lng = dm.lng_degree + dm.lng_minutes / 60;

        //change to negative if S or W
        if (dm.lat_direction === "S") {
            lat *= -1;
        }
        if (dm.lng_direction === "W") {
            lng *= -1;
        }

        return {
            lat: Number(lat.toFixed(6)),
            lng: Number(lng.toFixed(6))
        }
    }

    static coordinateLatLngToDm(latlng: LatLng) : DegreeMinute {
        //get N/S by +/- of lat, E/W by +/- of lng
        let latHeading = latlng.lat >= 0 ? "N" : "S";
        let lngHeading = latlng.lng >= 0 ? "E" : "W";

        //get integer without float and ignore negative
        let latDegree = Math.floor(Math.abs(latlng.lat));
        let lngDegree = Math.floor(Math.abs(latlng.lng));

        //calc minutes
        let latMinutes = 60 * (Math.abs(latlng.lat) - latDegree);
        let lngMinutes = 60 * (Math.abs(latlng.lng) - lngDegree);

        //max 3 float digits of minutes
        let latMinutesFixed = Number(latMinutes.toFixed(3));
        let lngMinutesFixed = Number(lngMinutes.toFixed(3));

        let resultDegreeMinute : DegreeMinute= {
            lat_direction: latHeading,
            lat_degree: latDegree,
            lat_minutes: latMinutesFixed,
            lng_direction: lngHeading,
            lng_degree: lngDegree,
            lng_minutes: lngMinutesFixed
        }
        return resultDegreeMinute;
    }
}