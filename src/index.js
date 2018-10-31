import { ArgumentParser } from 'argparse';

import processCommand from './commands';

const parser = new ArgumentParser({
  prog: 'aquos-node',
  version: '0.1.0',
  description: 'Command Line Interface for Aquos TVs',
});

parser.addArgument(
  ['-p', '--port'],
  {
    nargs: 1,
    help: 'Port to use.',
  },
);

parser.addArgument(
  ['--verbose'],
  {
    action: 'storeTrue',
    help: 'Port to use.',
  },
);

const commonOptVals = {
  nargs: 1,
};

const subparsers = parser.addSubparsers({
  title:'Command',
  dest: 'command',
  help: 'use %(prog)s COMMAND -h for more details',
});

const power = subparsers.addParser('power');
power.addArgument(
  ['value'],
  {
    ...commonOptVals,
    help: 'on/off',
  },
);

const input = subparsers.addParser('input');
input.addArgument(
  ['value'],
  {
    ...commonOptVals,
    help: 'toggle, tv, or 1-7',
  },
);

const volume = subparsers.addParser('volume');
volume.addArgument(
  ['value'],
  {
    ...commonOptVals,
    help: '0-60',
  },
);

const mute = subparsers.addParser('mute');
mute.addArgument(
  ['value'],
  {
    ...commonOptVals,
    help: 'true/false',
  },
);

const args = parser.parseArgs();

processCommand(args);
