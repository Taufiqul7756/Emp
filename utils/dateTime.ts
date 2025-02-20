export const isDateValid = (date: string) => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

// export const isDateValid = (date: string) => {
//   const selectedDate = new Date(date);
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   return selectedDate >= today;
// };