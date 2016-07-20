import { Casper } from 'casper';
import fs from 'fs';

import { metricsToArrayTable } from './modules/utils';
import { message } from './modules/cli';

import Parser from './modules/Parser';
import TimeReceiver from './modules/TimeReceiver';
import reportersRegister from './modules/reporters/reportersRegister';

const casper = new Casper({
  verbose: true,
  exitOnError: false
});

casper.on('error', function errHandler(err) {
  this.log(err, 'error');
});

const args = JSON.parse(casper.cli.get(0)); // JSON object of args passed by Python
const conf = fs.read(args.configPath);
const parser = new Parser(args.parser, conf);
const commands = parser.parsedCommands;
const timeReceiver = new TimeReceiver(casper);
const metrics = [];

message.setLevel('info');

casper.options.pageSettings.resourceTimeout = parser.parsedConfig.timeout || 1000;

casper.on('page.resource.requested', (res) => {
  message.print(`${res.method}: ${res.url}`); // TODO: make info message and trace mode
});

casper.on('page.resource.received', (res) => {
  // TODO: make error handlers

  switch (res.status / 100 | 0) {
    case 2:
      message.success(`${res.url} was loaded`); // TODO: make info message and trace mode
      break;
    case 3:
      message.print(`Redirect to ${res.redirectURL}`);
      break;
    default:
      message.warn(`Error with ${res.url}`);
  }
});

casper.start().eachThen(commands, res => {
  const command = res.data;

  const curMetricIndex = metrics.push({
    url: command.url,
    method: command.opts.method
  }) - 1;

  timeReceiver.setPageLoadingTime(metrics[curMetricIndex]);

  casper.open(command.url, command.opts);
}).run();

casper.then(() => {
  message.table(metricsToArrayTable(metrics));

  const reporter = new reportersRegister[parser.reporter.name](metrics, parser.reporter.options);

  reporter.report();

  if (reporter.reportStatusCode === 0) {
    message.success(reporter.reportLog);
  } else {
    message.err(reporter.reportLog);
  }

  casper.exit(reporter.reportStatusCode);
});

