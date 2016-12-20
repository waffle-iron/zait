import chalk from 'phantomjs-chalk';
import stripAnsi from 'strip-ansi';
import mdTable from 'markdown-table';
import logger from 'loglevel';

// temporary disabled

/* eslint-disable */

/** @namespace */
export const message = {

  /**
   * Print standard message to console
   *
   * @param {String} msg Message for printing
   */
  print(msg) {
    logger.info(msg);
  },

  /**
   * Print error message to console
   *
   * @param {String} msg Message for printing
   */
  err(msg) {
    logger.error(chalk.red(msg));
  },

  /**
   * Print warning message to console
   *
   * @param {String} msg Message for printing
   */
  warn(msg) {
    logger.warn(chalk.yellow(msg));
  },

  /**
   * Print success message to console
   *
   * @param {String} msg Message for printing
   */
  success(msg) {
    logger.info(chalk.green(msg));
  },

  /**
   * Set log level
   *
   * @param {String} lvl Level for log
   */
  set logLevel(lvl) {
    logger.setLevel(lvl);
  },

  /**
   * Get log level
   *
   * returns {Number} Log level
   */
  get logLevel() {
    return logger.getLevel();
  },

  /**
   align: 'c',
   stringLength(str) {
      return stripAnsi(str).length;
    }
   }) {
    this.print(mdTable(ta
   * Print markdown table to console
   *
   * @param {Array} table Table array
   * @param {Object} config Table configuration
   */
  table(table, config = {
    align: 'c',
    stringLength(str) {
      return stripAnsi(str).length;
    }
  }) {
    logger.info(mdTable(table, config));
  }
};

/* eslint-enable */

