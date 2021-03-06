import { Promise } from 'es6-promise';
import { extendBuiltin } from './utils';
import { message as logger } from './cli';

export class LoadError extends extendBuiltin(Error) {

  /**
   * Ser error message
   *
   * @param {String} message Error message
   */
  constructor(message, measures) {
    super(message);
    this.message = message;
    this.name = 'LoadError';
    this.measures = measures;
  }
}

/**
 *
 * Time receiver class
 *
 * @constructor
 *
 * @param {Object} casper Casper instance
 *
 */
class TimeReceiver {
  constructor(casper) {
    this.casper = casper;
  }

  /**
   * Get page resource load time
   *
   * @returns {Promise} Promise, that returns received measures
   */
  getLoadTime() {
    return new Promise((resolve, reject) => {
      const measures = {};
      let startTime;
      let endTime;

      /**
       * Timeout event handler
       *
       * @inner
       */
      const timeoutHandler = (resource) => {
        endTime = new Date().getTime();

        measures.loadTime = endTime - startTime;
        measures.status = 599;

        /* eslint-disable */

        this.casper.removeListener('page.resource.received', receiveHandler);

        /* eslint-enable */

        reject(
          new LoadError(
            `Couldn't load ${resource.url}. Status: ${measures.status}(timeout)`,
            measures
          )
        );
      };

      /**
       * Request handler to set start time of page resource load
       *
       * @inner
       */
      const requestHandler = () => {
        this.casper.page.onResourceTimeout = timeoutHandler;

        startTime = new Date().getTime(); // TODO needs refactoring

        measures.startTime = startTime;

        this.casper.removeListener('page.resource.requested', requestHandler);
      };

      /**
       * Receive handler to set end time of resource load
       * and reset listeners.
       *
       * @inner
       */
      const receiveHandler = (resource) => {
        endTime = new Date().getTime();

        measures.loadTime = endTime - startTime;

        switch (parseInt(resource.status / 100, 10)) {
          case 2:
            measures.status = resource.status;
            resolve(measures);
            break;
          case 3:
            logger.print(`Redirect to ${resource.redirectURL}`); // TODO maybe needs a trace?
            return;
          default:
            measures.status = resource.status;

            reject(
              new LoadError(
                `Couldn't load ${resource.url}. Status: ${measures.status}`,
                measures
              )
            );
        }

        this.casper.removeListener('page.resource.received', receiveHandler);
      };

      /**
       * @todo Add jsdoc for events events
       */
      this.casper.on('page.resource.requested', requestHandler);
      this.casper.on('page.resource.received', receiveHandler);
    });
  }
}

export default TimeReceiver;
