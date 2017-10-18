import moment from 'moment';

export function changeDataType(data, changearr) {
  const newdata = data;

  changearr.map((item, index) => {
    switch (item.target) {
      case 'number2string':
        newdata[item.field] = newdata[item.field].toString();
        break;
      case 'string2arraynumber':
        newdata[item.field] = (() => {
          const arr = [];
          try {
            newdata[item.replace].split('-').map((ele) => {
              arr.push(parseInt(ele, 10));
              return ele;
            });
          } catch (e) {
            arr.push(newdata[parseInt(item.replace, 10)]);
          }
          return arr;
        })();
        break;
      case 'boolean2number':
        newdata[item.field] = (newdata[item.field]) ? 1 : 2;
        break;
      case 'number2boolean':
        newdata[item.field] = (newdata[item.field] === 1) || false;
        break;
      case 'time2moment':
        newdata[item.field] = moment(newdata[item.field]);
        break;
      case 'addrlevel':
        newdata[item.field] = (() => {
          const o = newdata[item.field];
          const a = o.toString().split('').map((ele, i) => parseInt(ele, 10));
          const one = parseInt(`${a[0]}${a[1]}0000`, 10);
          const two = parseInt(`${a[0]}${a[1]}${a[2]}${a[3]}00`, 10);

          if (a[2] === 0 && a[3] === 0 && a[4] === 0 && a[5] === 0) {
            return [o];
          } else if (a[4] === 0 && a[5] === 0) {
            return [one, o];
          } else {
            return [one, two, o];
          }
        })();
        break;
      default:
        break;
    }

    return item;
  });

  return newdata;
}

