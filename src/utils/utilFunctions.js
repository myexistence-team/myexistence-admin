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