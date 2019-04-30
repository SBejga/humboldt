import { LatLng } from '../interfaces/coordinates/LatLng';
import * as chai from "chai";
import { CoordinateHelper } from '../helper/CoordinateHelper';
import { Utm } from '../interfaces/coordinates/Utm';

interface AllCoordinateFormats {
    dm_string: string,
    dm_string_nounits: string,
    dm_string_nozeros: string,
    dd: LatLng,
    utm: Utm,
}

type TestLocations = { [id: string]: AllCoordinateFormats };

// https://www.deine-berge.de/Rechner/Koordinaten
const testCoords: TestLocations = {
    munich: {
        dm_string: "N 48° 08.233' E 011° 34.533'",
        dm_string_nounits: "N 48 08.233 E 011 34.533",
        dm_string_nozeros: "N 48° 8.233' E 11° 34.533'",
        dd: {latitude: 48.137217, longitude: 11.57555},
        utm: { zoneNumber: 32, zoneLetter: 'U', easting: 691607.433, northing: 5334759.818 },
    },
    rio: {
        dm_string: "S 22° 54.500' W 043° 11.783'",
        dm_string_nounits: "S 22 54.500 W 043 11.783",
        dm_string_nozeros: "S 22° 54.500' W 43° 011.783'",
        dd: {latitude: -22.908333, longitude: -43.196383},
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