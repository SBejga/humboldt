# Humboldt

some common tools for map. Convert coordinates etc.

For example interfaces of markers to show on a map. And functions to convert between coordinate formats (degrees to degree minutes).

## Coordinates

At first a really short and rough explaination of coordinates and their types and formats.

Different formats to express coordinates:

- Degrees (D) e.g. 48.137222°
- Degree minutes (DM) e.g. 48° 8.233')

A Geolocation is a set of two coordinates: Latitude and Longitude.
For latitude the north-south position and for longitude the east-west position.

My favorite format to represent a geolocation is using compass signs (North / South, East / West) and degree minutes:

	N 48° 8.233' E 11° 34.533

Another popular representation like Google Maps is using is just both decimal degrees with latitude at first, followed by longitude and separated by a comma or simicolon.

	48.137222; 11.575556

North and east have positive degrees. South and west will be negative. For example for Rio de Janeiro `-22.908333; -43.196389`


