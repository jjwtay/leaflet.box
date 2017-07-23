L.Box = L.Polygon.extend({
    options: {
        fill: true,
        fillColor: '#ffff00',
        fillOpacity: 0.2
    },

    initialize ({
        center = [0, 0],
        width = 100,
        length = 1000,
        bearing = 0,
        rhumb = false,
        rotatable = true,
        moveable = true,
        wideable = true,
        lengthable = true,
        ...options
    }) {
        this.setOptions(options)
            .setCenter(center)
            .setWidth(width)
            .setLength(length)
            .setBearing(bearing)
            .setRhumb(rhumb)

        this.rotatable = rotatable
        this.moveable = moveable
        this.wideable = wideable
        this.lengthable = lengthable

        this._setLatLngs(this.getLatLngs())
    },

    getCenter () { return this._center },

    setCenter (center) {
        this._center = L.latLng(center)
        return this.redraw()
    },

    getWidth () { return this._width },

    setWidth (width = 100) {
        this._width = Math.abs(width)
        return this.redraw()
    },

    getLength () { return this._length },

    setLength (length = 100) {
        this._length = Math.abs(length)
        return this.redraw()
    },

    getBearing () { return this._bearing },

    setBearing (bearing = 0) {
        this._bearing = bearing % 360
        return this.redraw()
    },

    getOptions () { return this.options },

    setOptions (options = {}) {
        L.setOptions(this, options)
        return this.redraw()
    },

    getLatLngs () {
        const latLngs = []

        const hypotenuse = Math.sqrt(Math.pow(this.getWidth()/2 , 2) + Math.pow(this.getLength()/2 , 2))

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

    setLatLngs (latLngs = this.getLatLngs()) {
        this._setLatLngs(latLngs)
        return this.redraw()
    },

    getMaxMin (values) {
        return values.reduce((acc, val) => {
            const newAcc = {...acc}
            if (val < newAcc.min) newAcc.min = val
            if (val > newAcc.max) newAcc.max = val
            return newAcc
        }, {min: 0, max: 0})
    },

    setStyle: L.Path.prototype.setStyle,

    getRhumb () { return this._rhumb },

    setRhumb (rhumb = 45) {
        this._rhumb = rhumb
        return this.redraw()
    },

    computeDestinationPoint (
        start = {lat: 0, lng: 0},
        distance = 1,
        bearing = 0,
        radius = 6378137,
        rhumb = this.getRhumb()
    ) {
        if (rhumb) {
            /*http://www.movable-type.co.uk/scripts/latlong.html*/

            const δ = Number(distance) / radius // angular distance in radians
            const φ1 = start.lat * Math.PI / 180
            const λ1 = start.lng * Math.PI / 180
            const θ = bearing * Math.PI / 180

            const Δφ = δ * Math.cos(θ)
            let φ2 = φ1 + Δφ

            // check for some daft bugger going past the pole, normalise latitude if so
            if (Math.abs(φ2) > Math.PI/2) φ2 = φ2>0 ? Math.PI-φ2 : -Math.PI-φ2

            const Δψ = Math.log(Math.tan(φ2/2+Math.PI/4)/Math.tan(φ1/2+Math.PI/4))
            const q = Math.abs(Δψ) > 10e-12 ? Δφ / Δψ : Math.cos(φ1) // E-W course becomes ill-conditioned with 0/0

            const Δλ = δ*Math.sin(θ)/q
            const λ2 = λ1 + Δλ

            //return new LatLon(φ2.toDegrees(), (λ2.toDegrees()+540) % 360 - 180); // normalise to −180..+180°
            return {
                lat: φ2 * 180 / Math.PI,
                lng: ((λ2 * 180 / Math.PI) + 540) % 360 - 180
            }
        }
        const bng = bearing * Math.PI / 180

        const lat1 = start.lat * Math.PI / 180
        const lon1 = start.lng * Math.PI / 180

        let lat2 = Math.asin( Math.sin(lat1)*Math.cos(distance/radius) +
            Math.cos(lat1)*Math.sin(distance/radius)*Math.cos(bng))

        let lon2 = lon1 + Math.atan2(Math.sin(bng)*Math.sin(distance/radius)*Math.cos(lat1),
            Math.cos(distance/radius)-Math.sin(lat1)*Math.sin(lat2))

        lat2 = lat2 * 180 / Math.PI
        lon2 = lon2 * 180 / Math.PI

        return {
            lat: lat2,
            lng: lon2
        }

    },

    _update () {
        if (!this._map) { return }

        this._clipPoints()
        this._simplifyPoints()
        this._updatePath()
    },

    _updatePath () {
        this._renderer._updatePoly(this, true)
    },
})

L.box = ({
    center = [0, 0],
    width = 100,
    length = 100,
    bearing = 0,
    rhumb = false,
    rotatable = true,
    moveable = true,
    wideable = true,
    lengthable = true,
    ...options
}) =>
    new L.Box({center, width, rhumb, length, bearing, rotatable, moveable, wideable, lengthable, ...options})

L.rect = ({
    ...options
}) =>
    new L.Box({...options, bearing: 0, rotatable: false})