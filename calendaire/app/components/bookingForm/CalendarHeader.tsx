import type { AriaButtonProps } from "@react-aria/button";
import { useDateFormatter } from "@react-aria/i18n";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import type { CalendarState } from "@react-stately/calendar";
import type { DOMAttributes, FocusableElement } from "@react-types/shared";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { CalendarButton } from "./CalendarButton";
import { motion } from "framer-motion";

export function CalendarHeader({
  state,
  calendarProps,
  prevButtonProps,
  nextButtonProps,
}: {
  state: CalendarState;
  calendarProps: DOMAttributes<FocusableElement>;
  prevButtonProps: AriaButtonProps<"button">;
  nextButtonProps: AriaButtonProps<"button">;
}) {
  const monthDateFormatter = useDateFormatter({
    month: "long",
    year: "numeric",
    timeZone: state.timeZone,
  });

  const [monthName, _, year] = monthDateFormatter
    .formatToParts(state.visibleRange.start.toDate(state.timeZone))
    .map((part) => part.value);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between pb-4 gap-2">
      <VisuallyHidden>
        <h2>{calendarProps["aria-label"]}</h2>
      </VisuallyHidden>

      <motion.div 
        className="flex items-center space-x-2"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        key={`${monthName}-${year}`}
        transition={{ duration: 0.2 }}
      >
        <CalendarIcon className="size-4 text-primary" />
        <h2 aria-hidden className="font-semibold text-base">
          {monthName}{" "}
          <span className="text-muted-foreground font-medium">
            {year}
          </span>
        </h2>
      </motion.div>
      
      <div className="flex items-center gap-2">
        <CalendarButton 
          {...prevButtonProps}
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <ChevronLeftIcon className="size-4" />
        </CalendarButton>
        <CalendarButton 
          {...nextButtonProps}
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <ChevronRightIcon className="size-4" />
        </CalendarButton>
      </div>
    </div>
  );
}