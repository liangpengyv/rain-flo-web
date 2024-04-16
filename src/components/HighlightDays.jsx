import PropTypes from "prop-types";
import Badge from "@mui/material/Badge";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

HighlightDays.propTypes = {
  highlightedDays: PropTypes.array.isRequired,
  outsideCurrentMonth: PropTypes.bool.isRequired,
  day: PropTypes.object.isRequired,
};

export default function HighlightDays({
  highlightedDays = [],
  outsideCurrentMonth,
  day,
  ...other
}) {
  const isSelected =
    !outsideCurrentMonth && highlightedDays.indexOf(day.date()) >= 0;

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "❤️" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}
