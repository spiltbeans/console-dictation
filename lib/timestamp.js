const getTimeStamp  = ({offsetDay = 0, offsetMonth = 0, offsetYear = 0, offsetHour = 0, offsetMinute = 0}={} ) => {
    let today = new Date();
    let day = String(today.getDate() + offsetDay).padStart(2, '0');
    let month = String(today.getMonth() + 1 + offsetMonth).padStart(2, '0'); //January is 0
    let year = today.getFullYear() + offsetYear;

    let hour = String(today.getHours() + offsetHour).padStart(2, '0')
    let minute = String(today.getMinutes() + offsetMinute).padStart(2, '0')

    //Logic to see if offset pushes date past a real date/time
    if(parseInt(minute) >= 60){
        minute = String(parseInt(minute) - 60).padStart(2, '0')
        hour = String(parseInt(hour) + 1).padStart(2, '0')
    }
    
    if(parseInt(hour) > 24){
        hour = String(parseInt(hour) - 24).padStart(2, '0')
        day = String(parseInt(day) + 1).padStart(2, '0')
    }

    [month_incrementor, new_day] = incrementMonth(month, day)
    day = String(new_day).padStart(2, '0')
    month = String(parseInt(month) + month_incrementor).padStart(2, '0')

    if(parseInt(month) > 12){
        month = String(parseInt(month) - 12).padStart(2, '0')
        year = String(parseInt(year) + 1)
    }
    
    return `${year}-${month}-${day}-${hour}:${minute}`
     
}

const incrementMonth = (month, day)=>{

    const ThirtyOne = [1,3,5,7,8,10,12]
    const Thirty = [ 4 , 6 , 9 , 11 ]
    let thisMonth = 0

    //Check to see if month is either 31, 30 or 28 days
    ThirtyOne.forEach(num =>{ if(num === parseInt(month)) thisMonth = 31 })
    Thirty.forEach(num =>{ if(num === parseInt(month)) thisMonth = 30 })
    if('2' === month) thisMonth = 28

    return parseInt(day) > thisMonth ? [1, parseInt(day) - thisMonth] : [0, parseInt(day)]
}

module.exports = getTimeStamp