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
        rhumb = false,
        ...options
    }) {
        this.setOptions(options)
            .setCenter(center)
            .setWidth(width)
            .setLength(length)
            .setBearing(bearing)
            .setRhumb(rhumb)

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

    getRhumb: function () { return this._rhumb },

    setRhumb: function (rhumb = 45) {
        this._rhumb = rhumb
        return this.redraw()
    },

    computeDestinationPoint: function (
        start = {lat: 0, lng: 0},
        distance = 1,
        bearing = 0,
        radius = 6378137,
        rhumb = this.getRhumb()
    ) {
        if (rhumb) {
            let d = distance,
                θ = bearing * Math.PI / 180,
                φ = start.lat * Math.PI / 180,
                λ = start.lng * Math.PI / 180,
                R = radius
            /*http://www.movable-type.co.uk/scripts/latlong.html*/

            var δ = Number(distance) / radius; // angular distance in radians
            var φ1 = start.lat * Math.PI / 180
            var λ1 = start.lng * Math.PI / 180
            var θ = bearing * Math.PI / 180

            var Δφ = δ * Math.cos(θ);
            var φ2 = φ1 + Δφ;

            // check for some daft bugger going past the pole, normalise latitude if so
            if (Math.abs(φ2) > Math.PI/2) φ2 = φ2>0 ? Math.PI-φ2 : -Math.PI-φ2;

            var Δψ = Math.log(Math.tan(φ2/2+Math.PI/4)/Math.tan(φ1/2+Math.PI/4));
            var q = Math.abs(Δψ) > 10e-12 ? Δφ / Δψ : Math.cos(φ1); // E-W course becomes ill-conditioned with 0/0

            var Δλ = δ*Math.sin(θ)/q;
            var λ2 = λ1 + Δλ;

            //return new LatLon(φ2.toDegrees(), (λ2.toDegrees()+540) % 360 - 180); // normalise to −180..+180°
            return {
                lat: φ2 * 180 / Math.PI,
                lng: ((λ2 * 180 / Math.PI) + 540) % 360 - 180
            }
        }
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
    rhumb = false,
    ...options
}) =>
    new L.Box({center, width, rhumb, length, bearing, ...options})


