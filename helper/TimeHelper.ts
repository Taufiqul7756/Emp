export function formateTime(timeString: string) {
	const date = new Date(timeString);

	const hour = date.getHours() % 12;
	const minute = date.getMinutes().toString().padStart(2, "0");

	const meridian = hour === 0 ? "AM" : hour >= 12 ? "PM" : "AM";

	return `${hour}:${minute} ${meridian}`;
}
