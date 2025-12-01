export function getRelativeDateLabel(dateString: string): string {
  const inputDate = new Date(dateString);
  const now = new Date();
  const input = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffDays = Math.floor(
    (today.getTime() - input.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays === -1) return "tomorrow";

  // Day of week labels
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  if (diffDays < 7 && diffDays > 1) {
    return daysOfWeek[input.getDay()];
  }
  if (diffDays > -7 && diffDays < -1) {
    return "next " + daysOfWeek[input.getDay()];
  }

  // Last week
  if (diffDays < 14 && diffDays >= 7) {
    return "last " + daysOfWeek[input.getDay()];
  }

  // Weeks ago
  if (diffDays >= 14) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} weeks ago`;
  }

  // Future weeks
  if (diffDays <= -7) {
    const weeks = Math.abs(Math.floor(diffDays / 7));
    return `in ${weeks} weeks`;
  }

  // Fallback to date string
  return inputDate.toLocaleDateString();
}

export function getRelativeDateLabelKey(dateString: string): string {
  const inputDate = new Date(dateString);
  const now = new Date();
  const input = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffDays = Math.floor(
    (today.getTime() - input.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "date.relative.today";
  if (diffDays === 1) return "date.relative.yesterday";
  if (diffDays === -1) return "date.relative.tomorrow";

  // Day of week labels
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  if (diffDays < 7 && diffDays > 1) {
    return `date.relative.this_${daysOfWeek[input.getDay()]}`;
  }
  if (diffDays > -7 && diffDays < -1) {
    return `date.relative.next_${daysOfWeek[input.getDay()]}`;
  }

  // Last week
  if (diffDays < 14 && diffDays >= 7) {
    return `date.relative.last_${daysOfWeek[input.getDay()]}`;
  }

  // Weeks ago
  if (diffDays >= 14) {
    const weeks = Math.floor(diffDays / 7);
    return "date.relative.weeks_ago"; // Use with {weeks}
  }

  // Future weeks
  if (diffDays <= -7) {
    const weeks = Math.abs(Math.floor(diffDays / 7));
    return "date.relative.in_weeks"; // Use with {weeks}
  }

  // Fallback to date string
  return "date.relative.date"; // Use with {date}
}
