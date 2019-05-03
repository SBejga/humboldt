import { LatLng } from '../interfaces/coordinates/LatLng';
import * as chai from "chai";
import { CoordinateHelper } from '../helper/CoordinateHelper';
import { Utm } from '../interfaces/coordinates/Utm';
import { DegreeMinuteSeconds } from '../interfaces/coordinates/DegreeMinuteSeconds';

interface AllCoordinateFormats {
    dm_string: string,
    dm_string_nounits: string,
    dm_string_nozeros: string,
    dd: LatLng,
    dms: DegreeMinuteSeconds,
    utm: Utm,
}

type TestLocations = { [id: string]: AllCoordinateFormats };

// https://www.deine-berge.de/Rechner/Koordinaten
const testCoords: TestLocations = {
    munich: {
        dm_string: "N 48° 08.233' E 011° 34.533'",
        dm_string_nounits: "N 48 08.233 E 011 34.533",
        dm_string_nozeros: "N 48° 8.233' E 11° 34.533'",
        dms: {
            latitude: {hemisphere: 'N', degree: 48, minutes: 8, seconds: 13.98},
            longitude: {hemisphere: 'E',degree: 11, minutes: 34, seconds: 31.98}
        },
        dd: {latitude: 48.137217, longitude: 11.57555},
        utm: { zoneNumber: 32, zoneLetter: 'U', easting: 691607.433, northing: 5334759.818 },
    },
    rio: {
        dm_string: "S 22° 54.500' W 043° 11.783'",
        dm_string_nounits: "S 22 54.500 W 043 11.783",
        dm_string_nozeros: "S 22° 54.500' W 43° 011.783'",
        dd: {latitude: -22.908333, longitude: -43.196383},
        dms: {
            latitude: {hemisphere: 'S', degree: 22, minutes: 54, seconds: 30.00},
            longitude: {hemisphere: 'W',degree: 43, minutes: 11, seconds: 46.98}
        },
        utm: { zoneNumber: 23, zoneLetter: 'K', easting: 684983.441, northing: 7465494.088 },
    }
}

describe('validate DM', () => {
    const keys = Object.keys(testCoords);
    for (let key of keys) {
        it(key, () => {
            const coords = testCoords[key];
            chai.expect(CoordinateHelper.validateDegreeMinute(coords.dm_string)).to.be.true;
            chai.expect(CoordinateHelper.validateDegreeMinute(coords.dm_string_nounits)).to.be.true;
            chai.expect(CoordinateHelper.validateDegreeMinute(coords.dm_string_nozeros)).to.be.true;
        });
    }
});

describe('convert DM to LatLng', () => {
    const keys = Object.keys(testCoords);
    for (let key of keys) {
        it(key, () => {
            const coords = testCoords[key];
            let dmToLatLng = CoordinateHelper.coordinateDmStringToLatLng(coords.dm_string) as LatLng;
            chai.expect(dmToLatLng).to.be.not.null;
            chai.expect(dmToLatLng.latitude).to.equal(coords.dd.latitude);
            chai.expect(dmToLatLng.longitude).to.equal(coords.dd.longitude);
        });
    }
});

describe('convert LatLng to DM', () => {
    it('munich', () => {
        //from LatLng to DM
        let backToDm = CoordinateHelper.coordinateLatLngToDm(testCoords.munich.dd);
        chai.expect(backToDm).to.be.not.null;
        chai.expect(backToDm.latitude.hemisphere).to.equal("N");
        chai.expect(backToDm.latitude.degree).to.equal(48);
        chai.expect(backToDm.latitude.minutes).to.equal(8.233);
        chai.expect(backToDm.longitude.hemisphere).to.equal("E");
        chai.expect(backToDm.longitude.degree).to.equal(11);
        chai.expect(backToDm.longitude.minutes).to.equal(34.533);
    });
    it('rio', () => {
        //from LatLng back to DM
        let backToDm = CoordinateHelper.coordinateLatLngToDm(testCoords.rio.dd);
        chai.expect(backToDm).to.be.not.null;
        chai.expect(backToDm.latitude.hemisphere).to.equal("S");
        chai.expect(backToDm.latitude.degree).to.equal(22);
        chai.expect(backToDm.latitude.minutes).to.equal(54.500);
        chai.expect(backToDm.longitude.hemisphere).to.equal("W");
        chai.expect(backToDm.longitude.degree).to.equal(43);
        chai.expect(backToDm.longitude.minutes).to.equal(11.783);
    })
});

describe('convert DMS to LatLng', () => {
    const keys = Object.keys(testCoords);
    for (let key of keys) {
        it(key, () => {
            const coords = testCoords[key];
            let dmsToLatLng = CoordinateHelper.coordinateDmsToLatLng(coords.dms) as LatLng;
            chai.expect(dmsToLatLng).to.be.not.null;
            chai.expect(dmsToLatLng.latitude).to.equal(coords.dd.latitude);
            chai.expect(dmsToLatLng.longitude).to.equal(coords.dd.longitude);
        });
    }
});

describe('convert LatLng to DMS', () => {
    const keys = Object.keys(testCoords);
    for (let key of keys) {
        it(key, () => {
            const coords = testCoords[key];
            let backToDms = CoordinateHelper.coordinateLatLngToDms(coords.dd);
            chai.expect(backToDms).to.be.not.null;
            chai.expect(backToDms.latitude.hemisphere).to.equal(coords.dms.latitude.hemisphere);
            chai.expect(backToDms.latitude.degree).to.equal(coords.dms.latitude.degree);
            chai.expect(backToDms.latitude.minutes).to.equal(coords.dms.latitude.minutes);
            chai.expect(backToDms.latitude.seconds).to.equal(coords.dms.latitude.seconds);
            chai.expect(backToDms.longitude.hemisphere).to.equal(coords.dms.longitude.hemisphere);
            chai.expect(backToDms.longitude.degree).to.equal(coords.dms.longitude.degree);
            chai.expect(backToDms.longitude.minutes).to.equal(coords.dms.longitude.minutes);
            chai.expect(backToDms.longitude.seconds).to.equal(coords.dms.longitude.seconds);
        });
    }
});

describe('convert LatLng to UTM', () => {
    const keys = Object.keys(testCoords);
    for (let key of keys) {
        it(key, () => {
            const coords = testCoords[key];
            let utm = CoordinateHelper.coordinateLatLngToUtm(coords.dd);
            chai.expect(utm).to.be.not.null;
            chai.expect(utm.zoneNumber).to.equal(coords.utm.zoneNumber);
            chai.expect(utm.zoneLetter).to.equal(coords.utm.zoneLetter);
            chai.expect(utm.easting).to.equal(coords.utm.easting);
            chai.expect(utm.northing).to.equal(coords.utm.northing);
        });
    }
});

describe('convert  UTM to LatLng', () => {
    const keys = Object.keys(testCoords);
    for (let key of keys) {
        it(key, () => {
            const coords = testCoords[key];
            let latlng = CoordinateHelper.coordinateUtmToLatLng(coords.utm);
            chai.expect(latlng).to.be.not.null;
            chai.expect(latlng).to.be.not.null;
            // only test 5 digits because of calculation deviation!
            chai.expect(toFixedNum(latlng.latitude, 5)).to.equal(toFixedNum(coords.dd.latitude, 5));
            chai.expect(toFixedNum(latlng.longitude, 5)).to.equal(toFixedNum(coords.dd.longitude, 5));
        });
    }
});

const toFixedNum = (num: number, digits: number) => {
    return Number(num.toFixed(digits));
}