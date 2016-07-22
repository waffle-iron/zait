import { Promise } from 'es6-promise';

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
   * @param {Promise} Promise, that returns received measures
   */
  getLoadTime() {
    return new Promise(resolve => {
      const measures = {};
      let startTime;
      let endTime;

      /**
       * Timeout event handler
       *
       * @inner
       */
      const timeoutHandler = () => { // TODO maybe timeout handler is no needed
        endTime = new Date().getTime();

        measures.loadTime = endTime - startTime;
        measures.status = 'timeout';

        this.casper.removeListener('timeout', timeoutHandler);

        /* eslint-disabled */

        this.casper.removeListener('page.resource.received', receiveHandler);

        /* eslint-enabled */

        resolve(measures);
      };

      /**
       * Request handler to set start time of page resource load
       *
       * @inner
       */
      const requestHandler = () => {
        startTime = new Date().getTime();

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
        if (resource.status !== null) {
          measures.status = resource.status;
        } else {
          measures.status = 'load error';
        }

        this.casper.removeListener('timeout', timeoutHandler);
        this.casper.removeListener('page.resource.received', receiveHandler);
        resolve(measures);
      };

      /**
       * @todo Add jsdoc for events events
       */
      this.casper.on('page.resource.requested', requestHandler);
      this.casper.on('stepTimeout', timeoutHandler);
      this.casper.on('page.resource.received', receiveHandler);
    });
  }
}

export default TimeReceiver;
