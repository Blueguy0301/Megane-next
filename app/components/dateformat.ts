const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

export const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: userTimeZone, // Use user's preferred time zone
}
export const convertDate = (date: string) => new Date(date)
    .toLocaleString("en-US", options).replace(/ /g, "\u202f")