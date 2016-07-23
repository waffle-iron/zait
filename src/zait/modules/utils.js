/** @module utlis */
import chalk from 'phantomjs-chalk';

/**
 * Transform measures to array table
 *
 * @param {Object} results measures to transform
 * @param {Boolean} raw Returns table without changes?(colorizing etc.)
 * @returns {Array} Array table
 */
export function measuresToArrayTable(results, raw = false) {
  const header = Object.keys(results[0]);
  const table = [];

  table.push(header);

  results.forEach(row => {
    const column = [];

    for (const colName in row) {
      if (row.hasOwnProperty(colName)) {
        let value = row[colName];

        // TODO needs refactor(maybe)
        if (!raw) {
          switch (colName) {
            case 'status':

              // Check the first number of status code
              if (
                ['timeout', 'load error'].indexOf(value) === -1 &&
                [1, 2, 3].indexOf((value / 100) | 0) !== -1
              ) {
                value = chalk.green(value);
              } else {
                value = chalk.red(value);
              }

              column.push(value);
              break;
            default:
              column.push(value);
          }
        } else {
          column.push(value);
        }
      }
    }

    table.push(column);
  });

  return table;
}
