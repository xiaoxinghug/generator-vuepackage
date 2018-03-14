module.exports = function(from, to) {
    let distance = -1
    const PI = 3.14159265358979323846264338327950288
    let lat1 = from.latitude / 180.0 * PI
    let lon1 = from.longitude / 180.0 * PI
    let lat2 = to.latitude / 180.0 * PI
    let lon2 = to.longitude / 180.0 * PI
    if (lat2 !== 0 && lon2 !== 0 && lat1 !== 0 && lat2 !== 0) {
        let dlat = lat2 - lat1
        let dlon = lon2 - lon1
        let a = Math.sin(dlat / 2.0) * Math.sin(dlat / 2.0) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2.0) * Math.sin(dlon / 2.0)
        let c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a))
        distance = 6371000 * c
    }
    return distance
}
