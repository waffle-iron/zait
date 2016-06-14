import {metricsToArrayTable} from '../src/modules/utils';
import {assert} from 'chai';
import chalk from 'phantomjs-chalk';

describe('Utils',  function () {
  describe('metricsToArrayTable', function () {
    const metrics = [
      {
        url: 'domain.com',
        starttime: 1,
        endtime: 2,
        status: 'OK'
      },
      {
        url: 'domain1.com',
        starttime: 100,
        endtime: 2000,
        status: '401'
      }
    ];

    it('should returns an array', function () {
      assert.isArray(metricsToArrayTable(metrics));
    });

    it('should returns correct header', function () {
      assert.deepEqual(metricsToArrayTable(metrics)[0], ['url', 'starttime', 'endtime', 'status']);
    });

    it('the first row of metrics should contains green status message', function () {
      assert.notStrictEqual(metricsToArrayTable(metrics)[1][3].indexOf(chalk.styles.green.open), -1);
    });

    it('the second row of metrics should contains red status message', function () {
      assert.notStrictEqual(metricsToArrayTable(metrics)[2][3].indexOf(chalk.styles.red.open), -1);
    });
  });
});