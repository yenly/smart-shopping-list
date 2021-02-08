import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

// param: pDate in milliseconds
// return: duration object
export const calculateDateDuration = (pDate) => {
  if (pDate === undefined) {
    return false;
  }
  const purchaseDate = dayjs(pDate);
  const today = dayjs();
  const duration = dayjs.duration(today.diff(purchaseDate));
  return duration;
};

export const isWithinADay = (pDate) => {
  const duration = calculateDateDuration(pDate);
  return Math.round(duration.asMinutes()) < 60;
};

export const isWithinMinutes = (pDate) => {
  const duration = calculateDateDuration(pDate);
  return Math.round(duration.asMinutes()) <= 5;
};
