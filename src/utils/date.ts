const getTimeStamp = (): string => {
	const today_string: string = new Date().toLocaleString("en-US", { timeZone: "America/Toronto" })       // set timezone
	const today: Date = new Date(Date.parse(today_string))
	const day: string = String(today.getDate()).padStart(2, '0');
	const month: string = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
	const year: number = today.getFullYear();

	const hour: string = String(today.getHours()).padStart(2, '0')
	const minute: string = String(today.getMinutes()).padStart(2, '0')
	const second: string = String(today.getSeconds()).padStart(2, '0')

	return `${year}-${month}-${day}-${hour}:${minute}:${second}`

}

export { getTimeStamp }