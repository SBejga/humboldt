import { LatLng } from './../src/interfaces/coordinates/LatLng';
import * as chai from "chai";
import { CoordinateHelper } from './../src/helper/CoordinateHelper';

describe('DegreeMinutes', () => {

    // DM to LatLng
    // https://rechneronline.de/geo-koordinaten/#umrechnung

    describe('Munich', () => {
        let DM_Munich = "N 48° 08.233' E 011° 34.533'";
        let DM_Munich_noLeadingZero = "N 48° 8.233' E 11° 34.533'";
        let DM_clean = DM_Munich.replace(/°/g, "").replace(/'/g, "");
        let DD_Munich = {lat: 48.137217, lng: 11.575550}

        it(DM_Munich, () => {
            chai.expect(CoordinateHelper.validateDegreeMinute(DM_Munich)).to.be.true;
        });
        it(DM_Munich_noLeadingZero, () => {
            chai.expect(CoordinateHelper.validateDegreeMinute(DM_Munich_noLeadingZero)).to.be.true;
        });
        it(DM_clean, () => {
            chai.expect(CoordinateHelper.validateDegreeMinute(DM_clean)).to.be.true;
        });
        it(`${DD_Munich.lat}, ${DD_Munich.lng}`, () => {
            //from DM to LatLng
            let dmToLatLng = CoordinateHelper.coordinateDmToLatLng(DM_Munich) as LatLng; //exclude null
            chai.expect(dmToLatLng).to.be.not.null;
            chai.expect(dmToLatLng.lat).to.equal(DD_Munich.lat);
            chai.expect(dmToLatLng.lng).to.equal(DD_Munich.lng);

            //from LatLng back to DM
            let backToDm = CoordinateHelper.coordinateLatLngToDm(DD_Munich);
            chai.expect(backToDm).to.be.not.null;
            chai.expect(backToDm.latitude.hemisphere).to.equal("N");
            chai.expect(backToDm.latitude.degree).to.equal(48);
            chai.expect(backToDm.latitude.minutes).to.equal(8.233);
            chai.expect(backToDm.longitude.hemisphere).to.equal("E");
            chai.expect(backToDm.longitude.degree).to.equal(11);
            chai.expect(backToDm.longitude.minutes).to.equal(34.533);
        })
    });

    describe('Rio de Janeiro', () => {
        let DM_Rio = "S 22° 54.500' W 043° 11.783''";
        let DM_Rio_noLeadingZero = "S 22° 54.500' W 43° 011.783''";
        let DM_clean = DM_Rio.replace(/°/g, "").replace(/'/g, "");
        let DD_Rio = {lat: -22.908333, lng: -43.196383};

        it(DM_Rio, () => {
            chai.expect(CoordinateHelper.validateDegreeMinute(DM_Rio)).to.be.true;
        });
        it(DM_Rio_noLeadingZero, () => {
            chai.expect(CoordinateHelper.validateDegreeMinute(DM_Rio_noLeadingZero)).to.be.true;
        });
        it(DM_clean, () => {
            chai.expect(CoordinateHelper.validateDegreeMinute(DM_clean)).to.be.true;
        });
        it(`${DD_Rio.lat}, ${DD_Rio.lng}`, () => {
            //from DM to LatLng
            let dmToLatLng = CoordinateHelper.coordinateDmToLatLng(DM_Rio) as LatLng; //exclude null
            chai.expect(dmToLatLng.lat).to.equal(DD_Rio.lat);
            chai.expect(dmToLatLng.lng).to.equal(DD_Rio.lng);

            //from LatLng back to DM
            let backToDm = CoordinateHelper.coordinateLatLngToDm(DD_Rio);
            chai.expect(backToDm).to.be.not.null;
            chai.expect(backToDm.latitude.hemisphere).to.equal("S");
            chai.expect(backToDm.latitude.degree).to.equal(22);
            chai.expect(backToDm.latitude.minutes).to.equal(54.500);
            chai.expect(backToDm.longitude.hemisphere).to.equal("W");
            chai.expect(backToDm.longitude.degree).to.equal(43);
            chai.expect(backToDm.longitude.minutes).to.equal(11.783);
        })
    });

});