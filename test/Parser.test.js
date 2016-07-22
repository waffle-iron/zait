import Parser from '../src/zait/modules/Parser';
import {assert} from 'chai';

describe('Parser', function () {

  let configJson;
  let configYml;

  before(function () {
    configJson = `{
      "commands": [
        {
          "GET": {
            "url": "http://google.com"
          }
        },
        {
          "GET": {
            "url": "http://mail.ru"
          }
        },
        {
          "GET": {
            "url": "http://yandex.ru"
          }
        }
      ]
    }`;
    configYml = `---
  commands: 
    - 
      GET: 
        url: "http://google.com"
    - 
      GET: 
        url: "http://mail.ru"
    - 
      GET: 
        url: "http://yandex.ru"`;
  });

  describe('parsedConfig', function () {

    it('should returns object, when configuration is valid', function () {
      const parser = new Parser(configJson);

      assert.isObject(parser.parsedConfig);
    });

    it('should throws error when config is invalid', function () {
      const parser = new Parser('{ invalid');

      let getterThrowsErr = false;

      try {
        parser.parsedConfig;
      } catch (e) {
        getterThrowsErr = true;
      }

      assert.isTrue(getterThrowsErr, 'should throw error');
    });

    /*it('should return object when parser is yml', function () {
      assert.isObject(parser.parsedConfig);
    });*/
  });

  describe('parsedCommands', function () {
    it('should returns array of commands', function () {
      const parser = new Parser(configJson);

      assert.isArray(parser.parsedCommands);
    });
  });

  describe('reporter', function () {

    it('should return default reporter(json)', function () {
      const parser = new Parser('{}');

      assert.strictEqual(parser.reporter.name, 'json');
    });

    it('should returns reporter object with reporter name, when reporter specified by string', function () {
      const parser = new Parser('{ "reporter": "yaml" }');

      assert.strictEqual(parser.reporter.name, 'yaml');
    });

    it('should returns object with options and name, when reporter specified by object', function () {
      const jsonConf = JSON.stringify({
        reporter: {
          name: 'yaml',
          report_path: './zait.yml',
          some_option_for_test: 'test'
        }
      });
      const parser = new Parser(jsonConf);

     assert.deepEqual(parser.reporter, {
       name: 'yaml',
       options: {
         report_path: './zait.yml',
         some_option_for_test: 'test'
       }
     });
    });
  });
});
