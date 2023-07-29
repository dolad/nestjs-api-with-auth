export function formatToMonth(dateString: string): string {
  const dateObj = new Date(dateString);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const month = monthNames[dateObj.getMonth()];
  return month;
}
