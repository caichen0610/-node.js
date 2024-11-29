/**
 * 
 * @param {Date|string|number} date 
 * @returns {string} 
 */
export function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const map = {
    "yyyy": date.getFullYear(),
    "MM": String(date.getMonth() + 1).padStart(2, "0"),
    "dd": String(date.getDate()).padStart(2, "0"),
    "HH": String(date.getHours()).padStart(2, "0"),
    "mm": String(date.getMinutes()).padStart(2, "0"),
    "ss": String(date.getSeconds()).padStart(2, "0"),
  };

  return `${map["yyyy"]}-${map["MM"]}-${map["dd"]} ${map["HH"]}:${map["mm"]}:${map["ss"]}`;
}
