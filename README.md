# leaflet.box
Leaflet Rectangle with Bearing support. Inspired by [leaflet.ellipse](https://github.com/jdfergason/Leaflet.Ellipse). Check out the [Demo](https://jjwtay.github.io/Leaflet.draw-box/)

## API

*Factory method*

    L.box({
              <LatLng> center,
              <Number> width,
              <Number> length,
              <Number> bearing
              <...Leaflet Polygon Options>
    })

    * center - Leaflet latlng (optional - [0,0])
    * width - width in meters (optional - 100)
    * length - length in meters (optional - 1000)
    * bearing - bearing in degrees (optional - 0)
    * any leaflet options (e.g. fill, color, fillColor, ....)

## License

This code is provided under the Apache 2.0 license.
