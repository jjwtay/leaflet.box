import uglify from 'rollup-plugin-uglify'

export default {
    entry: 'leaflet.box.js',
    plugins: [
        uglify()
    ],
    dest: 'leaflet.box.min.js'
}