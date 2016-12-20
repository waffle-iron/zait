/** @module Reporters */

import fs from 'fs';
import Reporter from './Reporter';

/**
 * JSON reporter class
 * @extends Reporter
 */
class JsonReporter extends Reporter {
  /**
   * Initialize reporter
   *
   * @param {Object} measures measures
   * @param {Object|Undefined} options Reporter options
   * @param {String} env Get environment for testing TODO: DI required instead of
   */
  constructor(measures, options = {}, env = 'prod') {
    if (env === 'test') {
      fs.write = fs.writeFileSync;
    }

    const defaultOptions = {
      report_path: './zait.report.json'
    };

    super(measures, Object.assign(defaultOptions, options));
  }

  /**
   * Write json report to file
   */
  report() {
    const jsonReport = JSON.stringify(this._measures, null, 4);

    try {
      fs.write(this._options.report_path, jsonReport);

      this._reportSuccessMsg = `Success! JSON report was wrote in ${this._options.report_path}`;
      this.reportStatusCode = 0;
    } catch (e) {
      this.reportStatusCode = 1;

      this._reportFailMsg = e;
    }
  }
}

export default JsonReporter;
