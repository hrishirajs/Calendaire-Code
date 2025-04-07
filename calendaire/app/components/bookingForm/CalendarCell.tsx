import { cn } from "@/lib/utils";
import {
  CalendarDate,
  getLocalTimeZone,
  isSameMonth,
  isToday,
} from "@internationalized/date";
import { useRef } from "react";
import { mergeProps, useCalendarCell, useFocusRing } from "react-aria";
import { CalendarState } from "react-stately";
import { motion } from "framer-motion";

export function CalendarCell({
  state,
  date,
  currentMonth,
  isUnavailable,
}: {
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
  isUnavailable?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { cellProps, buttonProps, isSelected, isDisabled, formattedDate } =
    useCalendarCell({ date }, state, ref);

  // Override isDisabled if the date is unavailable
  const finalIsDisabled = isDisabled || isUnavailable;

  const { focusProps, isFocusVisible } = useFocusRing();

  const isOutsideMonth = !isSameMonth(currentMonth, date);

  const isDateToday = isToday(date, getLocalTimeZone());

  return (
    <td
      {...cellProps}
      className={`py-0.5 relative ${isFocusVisible ? "z-10" : "z-0"}`}
    >
      <motion.div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideMonth}
        className="size-10 sm:size-12 outline-none group"
        whileHover={!finalIsDisabled ? { scale: 1.05 } : undefined}
        whileTap={!finalIsDisabled ? { scale: 0.95 } : undefined}
        transition={{ duration: 0.2 }}
      >
        <div
          className={cn(
            "size-full rounded-full flex items-center justify-center text-sm font-medium",
            "transition-all duration-200 ease-in-out",
            finalIsDisabled ? "text-muted-foreground/60 cursor-not-allowed bg-muted/30" : "",
            isFocusVisible ? "ring-2 ring-primary ring-offset-2" : "",
            isSelected 
              ? "bg-primary text-primary-foreground shadow-md" 
              : !finalIsDisabled 
                ? "hover:bg-primary/10 hover:text-primary bg-background border border-border" 
                : ""
          )}
        >
          {formattedDate}
        </div>
        
        {isDateToday && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-0">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "size-1.5 bg-primary rounded-full mt-0.5",
                isSelected && "bg-white"
              )}
            />
          </div>
        )}
      </motion.div>
    </td>
  );
}
