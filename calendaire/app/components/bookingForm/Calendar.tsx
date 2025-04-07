import { createCalendar } from "@internationalized/date";
import { CalendarProps, DateValue, useCalendar, useLocale } from "react-aria";
import { useCalendarState } from "react-stately";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { motion } from "framer-motion";

export function Calendar(
  props: CalendarProps<DateValue> & {
    isDateUnavailable?: (date: DateValue) => boolean;
  }
) {
  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    visibleDuration: { months: 1 },
    locale,
    createCalendar,
  });

  const { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state
  );
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...calendarProps} 
      className="inline-block rounded-lg border border-border p-4 shadow-sm bg-card"
    >
      <CalendarHeader
        state={state}
        calendarProps={calendarProps}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
      />
      <motion.div 
        className="flex gap-8"
        key={state.visibleRange.start.toString()}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <CalendarGrid
          state={state}
          isDateUnavailable={props.isDateUnavailable}
        />
      </motion.div>
    </motion.div>
  );
}