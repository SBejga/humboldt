import { DM_REGEX, DMS_REGEX, UTM_REGEX } from './regex';

describe('DM Strings', () => {
    const dms = [
        "N 36° 12.289440' E 138° 15.175440'",
        "S 36 12.289 W 138 15.175",
        "N 36 12.289 E 011 05.175",
        "N 36 12.289 E 11 5.175",
    ];
    it('test strings', () => {
        dms.forEach(dm => {
            const test = DM_REGEX.test(dm);
            expect(test).toEqual(true);
        });
    });
    it('match regex groups', () => {
        dms.forEach(dm => {
            const matchGroups = DM_REGEX.exec(dm) as RegExpExecArray;
            expect(matchGroups).not.toBeNull();
            expect(matchGroups.length).toBe(6+1);
        });
    })
});

describe('DMS Strings', () => {
    const dms = [
        "N 36° 12' 17.3664\" E 189 59' 59.9999\"",
        "S 36 12 17.3664 W 138 15 10.5264",
        "N 36 02 01.36 E 011 05 01.52",
        "N 36 2 1.36 E 11 5 1.50",
        "N 36 2 1.36 E 11 5 1.5",
    ];
    it('test strings', () => {
        dms.forEach(dm => {
            const test = DMS_REGEX.test(dm);
            expect(test).toEqual(true);
        });
    });
    it('match regex groups', () => {
        dms.forEach(dm => {
            const matchGroups = DMS_REGEX.exec(dm) as RegExpExecArray;
            expect(matchGroups).not.toBeNull();
            expect(matchGroups.length).toBe(8+1);
        });
    })
});

describe('UTM Strings', () => {
    const utms = [
        "33U 430402.359 5708016.936",
        "33S 443662.992 3977196.104",
        "54S 253025.544 4010165.552"
    ];
    it('test strings', () => {
        utms.forEach(utm => {
            const test = UTM_REGEX.test(utm);
            expect(test).toEqual(true);
        });
    });
    it('match regex groups', () => {
        utms.forEach(utm => {
            const matchGroups = UTM_REGEX.exec(utm) as RegExpExecArray;
            expect(matchGroups).not.toBeNull();
            expect(matchGroups.length).toBe(4+1);
        });
    })
});