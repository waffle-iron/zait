/** @module Reporters */

import json2yaml from 'json2yaml';
import fs from 'fs';
import Reporter from './Reporter';

/**
 * YAML Reporter class
 * @extends Reporter
 */
class YamlReporter extends Reporter {
  /**
   * Initialize reporter
   *
   * @param {Object} measures measures
   * @param {Object|Undefined} options Reporter options
   * @param {String} env Get environment for testing
   */
  constructor(measures, options = {}, env = 'prod') {
    if (env === 'test') {
      fs.write = fs.writeFileSync;
    }

    const defaultOptions = {
      report_path: './zait.report.yml'
    };

    super(measures, Object.assign(defaultOptions, options));
  }

  /**
   * Output YAML report file
   */
  report() {
    const yamlReport = json2yaml.stringify(this._measures);

    try {
      fs.write(this._options.report_path, yamlReport);

      this._reportSuccessMsg = `Success! YAML report was wrote in ${this._options.report_path}`;
      this.reportStatusCode = 0;
    } catch (e) {
      this.reportStatusCode = 1;

      this._reportFailMsg = `${e}`;
    }
  }
}

export default YamlReporter;
