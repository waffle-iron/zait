import { Casper } from 'casper';
import fs from 'fs';

import { measuresToArrayTable } from './modules/utils';
import { message } from './modules/cli';

import Parser from './modules/Parser';
import TimeReceiver, { LoadError } from './modules/TimeReceiver';
import reportersRegister from './modules/reporters/reportersRegister';

const casper = new Casper({
  verbose: true,
  exitOnError: true
});

const args = JSON.parse(casper.cli.get(0)); // JSON object of args passed by Python

message.logLevel = args.logLevel;

casper.on('error', err => {
  if (message.logLevel !== 5) {
    casper.log(err, 'error');
  }

  casper.exit(1);
});

const conf = fs.read(args.configPath);
const parser = new Parser(conf);
const commands = parser.parsedCommands;
const timeReceiver = new TimeReceiver(casper);
const measures = [];

casper.options.pageSettings.resourceTimeout = parser.parsedConfig.timeout || 1000;

casper.start().eachThen(commands, res => {
  const command = res.data;

  const curMeasureIndex = measures.push({
    url: command.url,
    method: command.opts.method
  }) - 1;

  const measuresPromise = timeReceiver.getLoadTime();

  message.print(`${measures[curMeasureIndex].method}: ${measures[curMeasureIndex].url}`);

  casper.open(command.url, command.opts);

  measuresPromise
    .then(collectedMeasures => {
      message.success(`${measures[curMeasureIndex].url} was loaded`);
      Object.assign(measures[curMeasureIndex], collectedMeasures);
    })
    .catch(e => {
      if (e instanceof LoadError) {
        message.warn(e.message);

        Object.assign(measures[curMeasureIndex], e.measures);
        return;
      }

      message.err(e); // TODO print error stack
    });
}).run();

casper.then(() => {
  message.table(measuresToArrayTable(measures));

  const reporter = new reportersRegister[parser.reporter.name](measures, parser.reporter.options);

  reporter.report();

  if (reporter.reportStatusCode === 0) {
    message.success(reporter.reportLog);
  } else {
    message.err(reporter.reportLog);
  }

  casper.exit(reporter.reportStatusCode);
});

