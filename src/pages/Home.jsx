import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import ConfirmDateDialog from "../components/ConfirmDateDialog";
import HighlightDays from "../components/HighlightDays";
import { getFlo, putFlo } from "../api/flo";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const DATE_FORMAT_TEMPLATE = "YYYY/MM/DD";

export default function Home() {
  const [originData, setOriginData] = useState([]);
  const parserData = useRef(new Map());
  const [highlightedDays, setHighlightedDays] = useState([]);

  const [openDateDialog, setOpenDateDialog] = useState(false);

  const options = new Array(30)
    .fill(undefined)
    .map((item, index) =>
      dayjs().subtract(index, "day").format(DATE_FORMAT_TEMPLATE)
    );

  const latestData = originData[0];
  const shouldSelectStart = latestData?.duration;
  const dateDialogButtonText = shouldSelectStart ? "姨妈来了？" : "姨妈走了？";
  const dateDialogTitle = shouldSelectStart
    ? "选择经期开始日期"
    : "经期结束日期";

  function handleCloseDateDialog(newValue) {
    setOpenDateDialog(false);

    if (newValue) {
      if (latestData?.duration) {
        putFlo([
          {
            date: dayjs(newValue).format(DATE_FORMAT_TEMPLATE),
          },
          ...originData,
        ]).then((data) => {
          setOriginData(data);
        });
      } else {
        const newOriginData = [...originData];
        newOriginData[0].duration =
          dayjs
            .duration(
              dayjs(newValue).valueOf() - dayjs(newOriginData[0].date).valueOf()
            )
            .asDays() + 1;
        putFlo(newOriginData).then((data) => {
          setOriginData(data);
        });
      }
    }
  }

  function handleMonthChange(date) {
    setHighlightedDays(
      parserData.current.get(dayjs(date).year())?.get(dayjs(date).month()) || []
    );
  }

  useEffect(() => {
    getFlo().then((data) => {
      setOriginData(data);
    });
  }, []);

  useEffect(() => {
    function addParserData(date, duration) {
      const year = dayjs(date).year();
      if (!parserData.current.get(year))
        parserData.current.set(year, new Map());
      const month = dayjs(date).month();
      if (!parserData.current.get(year).get(month))
        parserData.current.get(year).set(month, []);
      parserData.current.get(year).get(month).push(dayjs(date).date());

      if (duration) {
        let count = duration;
        let newDate = date;
        while (--count) {
          newDate = dayjs(newDate).add(1, "day");
          const year = dayjs(newDate).year();
          if (!parserData.current.get(year)) parserData.set(year, new Map());
          const month = dayjs(newDate).month();
          if (!parserData.current.get(year).get(month))
            parserData.current.get(year).set(month, []);
          parserData.current.get(year).get(month).push(dayjs(newDate).date());
        }
      }
    }

    parserData.current = new Map();
    for (const item of originData) {
      addParserData(item.date, item.duration);
    }

    setHighlightedDays(
      parserData.current.get(dayjs().year())?.get(dayjs().month()) || []
    );
  }, [originData]);

  return (
    <div>
      <DateCalendar
        views={["day"]}
        slots={{
          day: HighlightDays,
        }}
        slotProps={{
          day: {
            highlightedDays,
          },
        }}
        onMonthChange={handleMonthChange}
      />
      <Button
        variant="contained"
        style={{ backgroundColor: "#e64935" }}
        onClick={() => setOpenDateDialog(true)}
      >
        {dateDialogButtonText}
      </Button>
      <ConfirmDateDialog
        open={openDateDialog}
        onClose={handleCloseDateDialog}
        value={dayjs().format(DATE_FORMAT_TEMPLATE)}
        options={options}
        title={dateDialogTitle}
      />
    </div>
  );
}
