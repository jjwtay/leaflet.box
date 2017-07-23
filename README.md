# leaflet.box
Leaflet Rectangle with Bearing support. Inspired by [leaflet.ellipse](https://github.com/jdfergason/Leaflet.Ellipse). Check out the [Demo](https://jjwtay.github.io/leaflet.box/)

## How to

*Traditional*

    Include leaflet.box.js in your html

    <script src='/path/to/leaflet.box'></script>

*Webpack as non es6 module*

    import './path/to/leaflet.box'

    * If using es6 with object spread you can opt to use the uncompiled src/leaflet.box.js

*ES6 module*

    TODO


## API

*Factory method*

    L.box({
              <LatLng> center,
              <Number> width,
              <Number> length,
              <Number> bearing,
              <Boolean> rhumb,
              <Boolean> rotatable,
              <Boolean> moveable,
              <Boolean> wideable,
              <Boolean> lengthable,
              <...Leaflet Polygon Options>
    })

    L.rect({
        ...same as above except bearing = 0 and rotatable = false
    })

    * center - Leaflet latlng (optional - [0,0])
    * width - width in meters (optional - 100)
    * length - length in meters (optional - 1000)
    * bearing - bearing in degrees (optional - 0)
    * rhumb - use rhumb instead of greater circle (optional - false)
    * rotatable - disable/enable rotate marker (optional - true)
    * moveable - disable/enable center drag marker (optional - true)
    * wideable - disable/enable allowing corners to widen rectangle (optional - true)
    * lengthable -disable/enable allowing corners to lengthen rectangle (optional - true)
    * any leaflet options (e.g. fill, color, fillColor, ....)

## Checkout

[leaflet.draw-box](https://github.com/jjwtay/Leaflet.draw-box) - Leaflet Draw support for leaflet.box.

[leaflet.arc](https://github.com/jjwtay/leaflet.arc) - Leaflet Arc drawing.

[leaflet.draw-arc](https://github.com/jjwtay/leaflet.draw-arc) - Leaflet Draw support for leaflet.arc.

[leaflet.sector](https://github.com/jjwtay/leaflet.sector) - Leaflet Sector drawing.

[leaflet.draw-sector](https://github.com/jjwtay/leaflet.draw-sector) - Leaflet Draw support for leaflet.sector.


## License

This code is provided under the Apache 2.0 license.
