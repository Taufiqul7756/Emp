export const isValidBangladeshiMobileNumber = (number: string) => {
  // Regex for Bangladeshi mobile numbers (starts with 01, followed by 9 digits)
  const bdMobileRegex = /^01[3-9]\d{8}$/;
  return bdMobileRegex.test(number);
};