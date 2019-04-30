import { LatLng } from '../interfaces/coordinates/LatLng';
import * as chai from "chai";
import { CoordinateHelper } from '../helper/CoordinateHelper';

// https://rechneronline.de/geo-koordinaten/#umrechnung
const testCoords = {
    munich: {
        dm_string: "N 48° 08.233' E 011° 34.533'",
        dm_string_nounits: "N 48 08.233 E 011 34.533",
        dm_string_nozeros: "N 48° 8.233' E 11° 34.533'",
        dd: {latitude: 48.137217, longitude: 11.575550},
    },
    rio: {
        dm_string: "S 22° 54.500' W 043° 11.783'",
        dm_string_nounits: "S 22 54.500 W 043 11.783",
        dm_string_nozeros: "S 22° 54.500' W 43° 011.783'",
        dd: {latitude: -22.908333, longitude: -43.196383},
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

describe('LatLng - UTM', () => {
    //TODO:
})