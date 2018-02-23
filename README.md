# Humboldt

[![Build Status](https://travis-ci.org/SBejga/humboldt.svg?branch=master)](https://travis-ci.org/SBejga/humboldt) [![npm version](https://badge.fury.io/js/humboldt.svg)](https://badge.fury.io/js/humboldt)

some common tools for map. Convert coordinates etc.

For example interfaces of markers to show on a map. And functions to convert between coordinate formats (degrees to degree minutes).

## General

### Coordinates

At first a really short and rough explaination of coordinates and their types and formats.

Different formats to express coordinates:

- Degrees (D) e.g. 48.137222°
- Degree minutes (DM) e.g. 48° 8.233')

A Geolocation is a set of two coordinates: Latitude and Longitude.
For latitude the north-south position and for longitude the east-west position.

My favorite format to represent a geolocation is using compass signs (North / South, East / West) and degree minutes:

    N 48° 08.233' E 11° 034.533' (Munich, Germany)
    S 22° 54.500' W 43° 011.783' (Rio de Janeiro, Brazil)

Another popular representation like Google Maps is using is just both decimal degrees with latitude at first, followed by longitude and separated by a comma or simicolon.

    48.137222; 11.575556

North and east have positive degrees. South and west will be negative. For example for Rio de Janeiro `-22.908333; -43.196389`

## Features

### CoordinateHelper

parse and validate geo coordinates in format degrees and minutes.
Convert degrees and minutes to decimal degrees

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
static coordinateLatLngToDm(latlng: LatLng) : DegreeMinute
```