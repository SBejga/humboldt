import { LatLng } from './../interfaces/coordinates/LatLng';
import { DegreeMinutes } from './../interfaces/coordinates/DegreeMinutes';
import { Utm as IUtm } from '../interfaces/coordinates/Utm';

import * as UtmLib from 'utm';
import { DegreeMinuteSeconds } from '../interfaces/coordinates/DegreeMinuteSeconds';
import { DM_REGEX} from './regex';

export class CoordinateHelper {

    /**
     * Parses a string to Degree-Minute coordinate format
     * @param coordinate string to parse
     */
    static parseDegreeMinute(coordinate: string) : DegreeMinutes | null {
        let matchArray = DM_REGEX.exec(coordinate);
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

        let newDegreeMinutes : DegreeMinutes = {
            latitude: {
                hemisphere: NS,
                degree: NS_D,
                minutes: NS_M
            },
            longitude: {
                hemisphere: EW,
                degree: EW_D,
                minutes: EW_M
            }
        }
        return newDegreeMinutes;
    }

    /**
     * Validates a string in a Degree-Minute coordinate format
     * @param coordinate string to validate
     */
    static validateDegreeMinute(coordinate: string) : boolean {
        let dm = CoordinateHelper.parseDegreeMinute(coordinate);

        //not null
        if (dm === null) {
            return false;
        }

        //Degrees 0 <= x <= 90 or 180
        if (dm.latitude.degree < 0 || dm.latitude.degree > 90) {
            return false;
        }
        if (dm.longitude.degree < 0 || dm.longitude.degree > 180) {
            return false;
        }

        // Minutes 0.001 <= x <= 60.999
        if (dm.latitude.minutes < 0.001 || dm.latitude.minutes > 60.999) {
            return false;
        }
        if (dm.longitude.minutes < 0.001 || dm.longitude.minutes > 60.999) {
            return false;
        }

        return true;
    }

    /**
     * Parses a string with Degree-Minutes (DM) and convert into LatLng coordinate format
     * @param string to parse and convert
     * @returns latlng decimals fixed to 6 digits
     */
    static coordinateDmStringToLatLng(coordinate: string): LatLng | null {
        let dm = CoordinateHelper.parseDegreeMinute(coordinate);
        let validDm = CoordinateHelper.validateDegreeMinute(coordinate);

        if (validDm === false || dm === null) {
            return null;
        }

        return CoordinateHelper.coordinateDmToLatLng(dm);
    }

    /**
     * Converts Degree-Minutes (DM) to LatLng coordinate format
     * @param dm coordinates to convert
     * @returns latlng decimals fixed to 6 digits
     */
    static coordinateDmToLatLng(dm: DegreeMinutes): LatLng {
        let latlng = {
            lat: {
                degree: Number(dm.latitude.degree),
                minutes: Number(dm.latitude.minutes),
            },
            lon: {
                degree: Number(dm.longitude.degree),
                minutes: Number(dm.longitude.minutes),
            }
        }

        //Calculate to DDD.DDDDDD
        let lat = latlng.lat.degree + latlng.lat.minutes / 60;
        let lng = latlng.lon.degree + latlng.lon.minutes / 60;

        //change to negative if S or W
        if (dm.latitude.hemisphere === "S") {
            lat *= -1;
        }
        if (dm.longitude.hemisphere === "W") {
            lng *= -1;
        }

        return {
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lng.toFixed(6))
        }
    }

    /**
     * Converts LatLng to Degree-Minutes (DM) coordinate format
     * @param latlng coordinates to convert
     */
    static coordinateLatLngToDm(latlng: LatLng) : DegreeMinutes {
        //get N/S by +/- of lat, E/W by +/- of lng
        let latHeading = latlng.latitude >= 0 ? "N" : "S";
        let lngHeading = latlng.longitude >= 0 ? "E" : "W";

        //get integer without float and ignore negative
        let latDegree = Math.floor(Math.abs(latlng.latitude));
        let lngDegree = Math.floor(Math.abs(latlng.longitude));

        //calc minutes
        let latMinutes = 60 * (Math.abs(latlng.latitude) - latDegree);
        let lngMinutes = 60 * (Math.abs(latlng.longitude) - lngDegree);

        //max 3 float digits of minutes
        let latMinutesFixed = Number(latMinutes.toFixed(3));
        let lngMinutesFixed = Number(lngMinutes.toFixed(3));

        let resultDegreeMinute : DegreeMinutes = {
            latitude: {
                hemisphere: latHeading,
                degree: latDegree,
                minutes: latMinutesFixed
            },
            longitude: {
                hemisphere: lngHeading,
                degree: lngDegree,
                minutes: lngMinutesFixed
            }
        }
        return resultDegreeMinute;
    }

    /**
     * Converts Degree-Minute-Seconds (DMS) to LatLng coordinate format
     * @param dms coordinates to convert
     * @returns latlng decimals fixed to 6 digits
     */
    static coordinateDmsToLatLng(dms: DegreeMinuteSeconds): LatLng {

        //Calculate to DDD.DDDDDD
        let lat = dms.latitude.degree + dms.latitude.minutes / 60 + dms.latitude.seconds / 60 / 60;
        let lng = dms.longitude.degree + dms.longitude.minutes / 60 + dms.longitude.seconds / 60 / 60;

        //change to negative if S or W
        if (dms.latitude.hemisphere === "S") {
            lat *= -1;
        }
        if (dms.longitude.hemisphere === "W") {
            lng *= -1;
        }

        return {
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lng.toFixed(6))
        }
    }

    /**
     * Converts LatLng to Degree-Minute-Seconds (DMS) coordinate format
     * @param latlng coordinates to convert
     */
    static coordinateLatLngToDms(latlng: LatLng) : DegreeMinuteSeconds {
        //get N/S by +/- of lat, E/W by +/- of lng
        let latHeading = latlng.latitude >= 0 ? "N" : "S";
        let lngHeading = latlng.longitude >= 0 ? "E" : "W";

        let absLat = Math.abs(latlng.latitude);
        let absLng = Math.abs(latlng.longitude);

        //get integer without float and ignore negative
        let latDegree = Math.floor(absLat);
        let lngDegree = Math.floor(absLng);

        //calc minutes
        // with decimals parts which is decimal seconds
        let latDecimalMinutes = 60 * (absLat - latDegree);
        let lngDecimalMinutes = 60 * (absLng - lngDegree);
        // only whole part
        let latMinutes = Math.floor(Number(latDecimalMinutes.toFixed(4)));
        let lngMinutes = Math.floor(Number(lngDecimalMinutes.toFixed(4)));

        //calc seconds
        let latSeconds = 60 * (latDecimalMinutes - latMinutes);
        let lngSeconds = 60 * (lngDecimalMinutes - lngMinutes);

        //max 2 float digits of seconds
        let latSecondsFixed = Number(latSeconds.toFixed(2));
        let lngSecondsFixed = Number(lngSeconds.toFixed(2));

        let resultDegreeMinuteSeconds : DegreeMinuteSeconds = {
            latitude: {
                hemisphere: latHeading,
                degree: latDegree,
                minutes: latMinutes,
                seconds: latSecondsFixed,
            },
            longitude: {
                hemisphere: lngHeading,
                degree: lngDegree,
                minutes: Math.floor(lngMinutes),
                seconds: lngSecondsFixed,
            }
        }
        return resultDegreeMinuteSeconds;
    }

    /**
     * Converts LatLng to UTM coordinate format
     * @param latlng coordinates to convert
     */
    static coordinateLatLngToUtm(latlng: LatLng): IUtm {
        const { zoneNum, zoneLetter, easting, northing } = UtmLib.fromLatLon(latlng.latitude, latlng.longitude);
        return {
            zoneNumber: zoneNum,
            zoneLetter,
            easting: Number(easting.toFixed(3)),
            northing: Number(northing.toFixed(3)),
        }
    }

    /**
     * Converts UTM to LatLng coordinate format
     * @param utm coordinates to convert
     * @returns latlng decimals fixed to 6 digits
     */
    static coordinateUtmToLatLng(utm: IUtm): LatLng {
        const {latitude, longitude} = UtmLib.toLatLon(utm.easting, utm.northing, utm.zoneNumber, utm.zoneLetter);
        return {
            latitude: Number(latitude.toFixed(6)),
            longitude: Number(longitude.toFixed(6)),
        }
    }
}