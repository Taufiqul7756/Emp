export function trimCharStart(str: string, charlist: string): string {
	if (charlist === undefined) return str;

	return str.replace(new RegExp(`^[${charlist}]+`), "");
}

export function trimCharEnd(str: string, charlist: string): string {
	if (charlist === undefined) return str;

	return str.replace(new RegExp(`[${charlist}]+$`), "");
}

export function trimChar(str: string, charlist: string): string {
	let r = trimCharStart(str, charlist);
	r = trimCharEnd(r, charlist);
	return r;
}

export function ucFirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function titleCase(str: string): string {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function snakeCase(str: string): string {
	return str?.toLowerCase().split(" ").join("_");
}

export function abbreviate(str: string, maxLength = 30): string {
	return `${str.substring(0, maxLength)}...`;
}

export function insertAt(src: string, position: number, target: string) {
	return src.slice(0, position) + target + src.slice(position);
}

export function truncateText(text: string | null | undefined, maxLength: number): string {
	if (text && text.length > maxLength) {
		return `${text.substring(0, maxLength)}...`;
	}
	return text ?? "-";
}

export function padId(id: string | number | null) {
	return id?.toString().padStart(3, "0") ?? "";
}
