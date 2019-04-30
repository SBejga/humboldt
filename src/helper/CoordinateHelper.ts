import { LatLng } from './../interfaces/coordinates/LatLng';
import { DegreeMinutes } from './../interfaces/coordinates/DegreeMinutes';
import { Utm as IUtm } from '../interfaces/coordinates/Utm';

import * as UtmLib from 'utm';
import { DM_REGEX} from './regex';

export class CoordinateHelper {

    static parseDegreeMinute(coordinate: string) : DegreeMinutes | null {
        let RE = new RegExp(DM_REGEX, "g");
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

    static validateDegreeMinute(coordinate: string) : boolean {
        let dm = CoordinateHelper.parseDegreeMinute(coordinate);

        //not null
        if (dm === null) {
            return false;
        }

        // N, S, E or W
        if (dm.latitude.hemisphere !== "N" && dm.latitude.hemisphere !== "S") {
            return false;
        }
        if (dm.longitude.hemisphere !== "E" && dm.longitude.hemisphere !== "W") {
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

    static coordinateDmStringToLatLng(coordinate: string): LatLng | null {
        let dm = CoordinateHelper.parseDegreeMinute(coordinate);
        let validDm = CoordinateHelper.validateDegreeMinute(coordinate);

        if (validDm === false || dm === null) {
            return null;
        }

        return CoordinateHelper.coordinateDmToLatLng(dm);
    }

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

    static coordinateLatLngToUtm(latlng: LatLng): IUtm {
        const { zoneNum, zoneLetter, easting, northing } = UtmLib.fromLatLon(latlng.latitude, latlng.longitude);
        return {
            zoneNumber: zoneNum,
            zoneLetter,
            easting: Number(easting.toFixed(3)),
            northing: Number(northing.toFixed(3)),
        }
    }
    static coordinateUtmToLatLng(utm: IUtm): LatLng {
        const {latitude, longitude} = UtmLib.toLatLon(utm.easting, utm.northing, utm.zoneNumber, utm.zoneLetter);
        return {
            latitude: Number(latitude.toFixed(6)),
            longitude: Number(longitude.toFixed(6)),
        }
    }
}