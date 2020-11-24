import Moment from "moment"

export const getCurrentTimeZone = (date: string) => {
	return Moment(date).local()
}

export const formatTime = (date: Moment.Moment) => {
	return date.format("YYYY-MM-DD HH:mm:ss")
}