const { default: meColors } = require("src/components/meColors");

export function getAttendanceStatusColor(status) {
  switch (status) {
    case "PRESENT":
      return meColors.success.main;
    case "LATE":
      return meColors.orange;
    case "EXCUSED":
      return meColors.yellow;
    case "ABSENT":
      return meColors.danger
    default:
      return meColors.grey;
  }
}

export const getDays = (year, month) => {
  return new Date(year, month, 0).getDate();
};

export function getStartOfWeek() {
  const firstDayOfWeek = new Date();
  const todayDate = firstDayOfWeek.getDate();
  const todayInt = firstDayOfWeek.getDay();
  var lastWeekDate = todayDate - todayInt;
  if (lastWeekDate < 1) {
    lastWeekDate += getDays(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth());
    var prevMonth = firstDayOfWeek.getMonth() - 1;
    if (prevMonth < 0) prevMonth = 12;
    firstDayOfWeek.setMonth(prevMonth);
  }
  firstDayOfWeek.setHours(0);
  firstDayOfWeek.setMinutes(0);
  firstDayOfWeek.setSeconds(0);
  firstDayOfWeek.setDate(lastWeekDate);
  return firstDayOfWeek;
}

export function getStartOfMonth() {
  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  return firstOfMonth;
}

export function getStartOfYear() {
  const firstOfYear = new Date();
  firstOfYear.setDate(1);
  firstOfYear.setMonth(0)
  return firstOfYear;
}

export function percentage(partialValue, totalValue, decimalPlace = 2) {
  return Math.floor(((100 * partialValue) / totalValue) * 10**decimalPlace) / 10**decimalPlace;
} 