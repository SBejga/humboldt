# Humboldt 🗺🤵🏻

[![Build Status](https://travis-ci.org/SBejga/humboldt.svg?branch=master)](https://travis-ci.org/SBejga/humboldt) [![npm version](https://badge.fury.io/js/humboldt.svg)](https://badge.fury.io/js/humboldt)

some common tools for map. Convert coordinates etc.

For example interfaces of markers to show on a map. And functions to convert between coordinate formats (degrees to degree minutes).

## General

### Coordinates

At first a really short and rough explaination of coordinates and their types and formats.

Different formats to express coordinates:

- Degrees (D) e.g. 48.137222°
- Degree Minutes (DM) e.g. 48° 8.233'
- Degree Minutes Seconds (DMS) e.g. 48° 8' 13.9992"

A Geolocation is a set of two coordinates: Latitude and Longitude.
For latitude the north or south position and for longitude the east or west position.

My favorite format to represent a geolocation is using compass signs (North / South, East / West) and degree minutes:

    N 48° 08.233' E 11° 034.533' (Munich, Germany)
    S 22° 54.500' W 43° 011.783' (Rio de Janeiro, Brazil)

Another popular representation like Google Maps is using is just both decimal degrees with latitude at first, followed by longitude and separated by a comma or simicolon.

    48.137222; 11.575556

If there is no information of compass signs, North and east have positive degrees. South and west will be negative. For example for Rio de Janeiro `-22.908333; -43.196389`

## Features

### Coordinate Class

initialize with LatLng, DM, UTM. Then all different formats accessable as properties.

```
Coordinates {
    static fromDD(dd: LatLng): Coordinates;
    static fromDM(dm: DegreeMinutes): Coordinates;
    static fromDMS(dms: DegreeMinuteSeconds): Coordinates;
    static fromUTM(utm: Utm): Coordinates;

    dd: LatLng;
    dm: DegreeMinutes;
    dms: DegreeMinuteSeconds;
    utm: Utm;
}
```

### CoordinateHelper

- parse and validate geo coordinates in string of DM format
- Convert LatLng <=> DM
- Convert LatLng <=> DMS
- Convert LatLng <=> UTM

```js
/*
    "N 48° 08.233' E 011° 34.533'"
    =>
        {
            latitude: {
                hemisphere: "N",
                degree: 48,
                minutes: 8.233
            },
            longitude: {
                hemisphere: "E",
                degree: 11,
                minutes: 34.533
            }
        }
*/
static parseDegreeMinute(coordinate: string) : DegreeMinute | null

/*
    "N 48° 08.233' E 011° 34.533'" => true
*/
static validateDegreeMinute(coordinate: string) : boolean

/*
    "N 48° 08.233' E 011° 34.533'" => { latitude: 48.137217, longitude: 11.575550 }
*/
static coordinateDmStringToLatLng(coordinate: string): LatLng | null

/*
    { latitude: 48.137217, longitude: 11.575550 }
    <=>
    {
        latitude: {
            hemisphere: "N",
            degree: 48,
            minutes: 8.233
        },
        longitude: {
            hemisphere: "E",
            degree: 11,
            minutes: 34.533
        }
    }
*/
static coordinateLatLngToDm(latlng: LatLng) : DegreeMinute
static coordinateDmToLatLng(dm: DegreeMinutes): LatLng

/*
    { latitude: 48.137217, longitude: 11.575550 }
    <=>
    {
        latitude: {
            hemisphere: "N",
            degree: 48,
            minutes: 8,
            seconds: 13.98
        },
        longitude: {
            hemisphere: "E",
            degree: 11,
            minutes: 34,
            seconds: 31.98
        }
    }
*/
static coordinateLatLngToDMS(latlng: LatLng): DegreeMinuteSeconds
static coordinateDMSToLatLng(dms: DegreeMinuteSeconds): LatLng

/*
    { latitude: 48.137217, longitude: 11.575550 }
    <=>
    {
        zoneNumber: 32,
        zoneLetter: 'U',
        easting: 691607.433,
        northing: 5334759.818
    }
*/
static coordinateLatLngToUtm(latlng: LatLng): Utm
static coordinateUtmToLatLng(utm: Utm): LatLng
```