export interface CalendarEventInput {
  title: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  description?: string;
  location?: string;
}
