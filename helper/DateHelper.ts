interface DateObject {
  calendar: {
    [key: string]: any;
    identifier: string;
  };
  day: number;
  era: string;
  month: number;
  year: number;
}

export function convertToDateString(dateObject: DateObject) {
  const { year, month, day } = dateObject;

  const paddedMonth = String(month).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");

  const dateString = `${year}-${paddedMonth}-${paddedDay}`;

  return dateString;
}
