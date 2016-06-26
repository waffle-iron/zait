/**@module utlis*/
import chalk from 'phantomjs-chalk';

/**
 * Transform metrics to array table
 *
 * @param results Metrics to transform
 * @returns {Array} Array table
 */
export function metricsToArrayTable(results) {
  const header = Object.keys(results[0]);
  let table = [];

  table.push(header);

  results.forEach(row => {
    let column = [];

    for (let colName in row) {
      if (row.hasOwnProperty(colName)) {
        let value = row[colName];

        switch (colName) {
          case 'status':

            //Check the first number of status code
            if (['timeout', 'load error'].indexOf(value) === -1 && [1, 2, 3].indexOf(Number(value[0])) !== -1) {
              value = chalk.green(value);
            } else {
              value = chalk.red(value);
            }

            column.push(value);
            break;
          default:
            column.push(value);
        }
      }

    }

    table.push(column);
  });

  return table;
}
