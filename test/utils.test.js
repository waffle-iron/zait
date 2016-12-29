import {measuresToArrayTable} from '../src/zait/modules/utils';

import fs from 'fs';
import {assert} from 'chai';
import chalk from 'phantomjs-chalk';

describe('Utils',  function () {
  describe('measuresToArrayTable', function () {
    const measures = [
      {
        url: 'domain.com',
        starttime: 1,
        endtime: 2,
        status: 200
      },
      {
        url: 'domain1.com',
        starttime: 100,
        endtime: 2000,
        status: 401
      }
    ];

    it('should returns an array', function () {
      assert.isArray(measuresToArrayTable(measures));
    });

    it('should returns correct header', function () {
      assert.deepEqual(measuresToArrayTable(measures)[0], ['url', 'starttime', 'endtime', 'status']);
    });

    it('the first row of measures should contains green status message or contains status without ' +
      'color if cli doesn\'t support colors', function () {
      const isContainColor = measuresToArrayTable(measures)[1][3].indexOf(chalk.styles.green.open);

      if (chalk.supportsColor) {
        assert.notStrictEqual(isContainColor, -1);
      } else {
        assert.strictEqual(isContainColor, -1);
      }
    });

    it('the second row of measures should contains red status message or contains status without ' +
      'color if cli doesn\'t support colors', function () {
      const isContainColor = measuresToArrayTable(measures)[2][3].indexOf(chalk.styles.red.open);

      if (chalk.supportsColor) {
        assert.notStrictEqual(isContainColor, -1);
      } else {
        assert.strictEqual(isContainColor, -1);
      }
    });

    it('should returns non colorized row when raw argument is true', function () {
      assert.strictEqual(String(measuresToArrayTable(measures, true)[2][3]).indexOf(chalk.styles.red.open), -1);
    });
  });

  describe('readConfig', () => {
    const testFile = {
      yml: './zait.yml',
      json: './zait.json',
      test: './test',
    };

    before(() => {
      testFile
        .entries
        .forEach(([content, path]) => {
          fs.writeFileSync(content, path);
        });
    });

    after(() => {
      testFile
        .entries
        .forEach(([content, path]) => {
          fs.writeFileSync(path);
        })
    });
  });
});
