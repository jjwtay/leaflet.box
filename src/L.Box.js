L.Box = L.Polygon.extend({
    options: {
        fill: true,
        fillColor: '#ffff00',
        fillOpacity: 0.2
    },

    initialize: function ({
        center = [0, 0],
        width = 100,
        length = 1000,
        bearing = 0,
        ...options
    }) {
        this.setOptions(options)
            .setCenter(center)
            .setWidth(width)
            .setLength(length)
            .setBearing(bearing)

        this._setLatLngs(this.getLatLngs())
    },

    getCenter: function() { return this._center },

    setCenter: function(center) {
        this._center = L.latLng(center)
        return this.redraw()
    },

    getWidth: function() { return this._width },

    setWidth: function (width = 100) {
        this._width = Math.abs(width)
        return this.redraw()
    },

    getLength: function() { return this._length },

    setLength: function (length = 100) {
        this._length = Math.abs(length)
        return this.redraw()
    },

    getBearing: function() { return this._bearing },

    setBearing: function (bearing = 0) {
        this._bearing = bearing % 360
        return this.redraw()
    },

    getOptions: function () { return this.options },

    setOptions: function (options = {}) {
        L.setOptions(this, options)
        return this.redraw()
    },

    getLatLngs() {
        let latLngs = []

        let hypotenuse = Math.sqrt(Math.pow(this.getWidth()/2 , 2) + Math.pow(this.getLength()/2 , 2))
        
        latLngs.push(this.computeDestinationPoint(
            this.getCenter(),
            hypotenuse,
            this.getBearing() - Math.atan2(this.getWidth(), this.getLength()) * 180 / Math.PI
        ))
        latLngs.push(this.computeDestinationPoint(
            this.getCenter(),
            hypotenuse,
            this.getBearing() - Math.atan2(this.getWidth(), -this.getLength()) * 180 / Math.PI
        ))
        latLngs.push(this.computeDestinationPoint(
            this.getCenter(),
            hypotenuse,
            this.getBearing() - Math.atan2(-this.getWidth(), -this.getLength()) * 180 / Math.PI
        ))
        latLngs.push(this.computeDestinationPoint(
            this.getCenter(),
            hypotenuse,
            this.getBearing() - Math.atan2(-this.getWidth(), this.getLength()) * 180 / Math.PI
        ))

        return [latLngs]
    },

    setLatLngs: function(latLngs) {
        this._setLatLngs(this.getLatLngs())
        return this.redraw()
    },

    getMaxMin(values) {
        return values.reduce((acc, val) => {
                                let newAcc = {...acc}
                                if (val < newAcc.min) newAcc.min = val
                                if (val > newAcc.max) newAcc.max = val
                                return newAcc
                            }, {min: 0, max: 0})
    },

    setStyle: L.Path.prototype.setStyle,

    computeDestinationPoint: function (
        start = {lat: 0, lng: 0},
        distance = 1,
        bearing = 0,
        radius = 6378137
    ) {

        let bng = bearing * Math.PI / 180

        var lat1 = start.lat * Math.PI / 180
        var lon1 = start.lng * Math.PI / 180

        var lat2 = Math.asin( Math.sin(lat1)*Math.cos(distance/radius) +
            Math.cos(lat1)*Math.sin(distance/radius)*Math.cos(bng))

        var lon2 = lon1 + Math.atan2(Math.sin(bng)*Math.sin(distance/radius)*Math.cos(lat1),
                    Math.cos(distance/radius)-Math.sin(lat1)*Math.sin(lat2))
                    
        lat2 = lat2 * 180 / Math.PI
        lon2 = lon2 * 180 / Math.PI

        return {
            lat: lat2,
            lng: lon2
        }

    },

    _update: function () {
		if (!this._map) { return; }

		this._clipPoints();
		this._simplifyPoints();
		this._updatePath();
    },

    _updatePath: function () {
        this._renderer._updatePoly(this, true)
    },
})

L.box = ({
    center = [0, 0],
    width = 100,
    length = 100,
    bearing = 0,
    ...options
}) =>
    new L.Box({center, width, length, bearing, ...options})


