const getTimeStamp = () => {
    let today = new Date().toLocaleString("en-US", { timeZone: "America/Toronto" })       // set timezone
    today = new Date(Date.parse(today))
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
    let year = today.getFullYear();

    let hour = String(today.getHours()).padStart(2, '0')
    let minute = String(today.getMinutes()).padStart(2, '0')
    let second = String(today.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day}-${hour}:${minute}:${second}`

}

module.exports = { getTimeStamp }