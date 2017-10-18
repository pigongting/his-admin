import moment from 'moment';

export function getTimeStamp() {
  return (new Date()).getTime();
}

export function isValidDate(str) {
  if (typeof str !== 'string') return false;

  const d = moment(str, 'YYYY-MM-DD');
  if (d == null || !d.isValid()) return false;

  return str.indexOf(d.format('YYYY-M-D')) >= 0
      || str.indexOf(d.format('YYYY-MM-DD')) >= 0
      || str.indexOf(d.format('YY-M-D')) >= 0
      || str.indexOf(d.format('YY-MM-DD')) >= 0;
}
