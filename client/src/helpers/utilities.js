export function FormatPrice(priceFormat) {
  const config = {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 9,
  };
  const formated = new Intl.NumberFormat("vi-VN", config).format(priceFormat);
  return formated;
}

export function FormatDate(dateFormat) {
  const dateObj =
    dateFormat instanceof Date ? dateFormat : new Date(dateFormat);
  const date = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  const formated = date + "-" + month + "-" + year;
  return formated;
}

export function AddDay(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date;
}
