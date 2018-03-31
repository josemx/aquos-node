import SerialPort from 'serialport';

const InvalidInputError = new Error('Invalid value. Aborted');

const returnPad = commandString => commandString.padEnd(8) + '\r';

const power = value => {
  if (value === 'on' || value === 'off') {
    console.log(`[power]: turning ${value} tv`);
    const cv = value === 'on' ? 1 : 0
    return returnPad('POWR' + cv);
  } else {
    throw InvalidInputError;
  }
};

const input = value => {
  const vai = parseInt(value);
  if (value === 'toggle') {
    console.log('[input]: toggling input');
    return returnPad('ITGDx');
  } else if (value === 'tv' || (vai > 0 && vai < 8)) {
    console.log(`[input]: switching to input ${value}`);
    const IxVD = value === 'tv' ? 'ITVD' : 'IAVD';
    const iv = value === 'tv' ? 0 : vai;
    return returnPad(IxVD + iv);
  } else {
    throw InvalidInputError;
  }
};

const volume = value => {
  const vai = parseInt(value);
  console.log(vai, vai <= 0, vai > 61, vai <= 0 && vai > 61);
  if (vai >= 0 && vai < 61) {
    console.log(`[volume]: adjusting volume to ${value}`);
    return returnPad('VOLM' + vai);
  } else {
    throw InvalidInputError;
  }
};

const mute = value => {
  if (value === 'true' || value === 'false') {
    const bool = value === 'true' ? true : false;
    const type = bool ? '' : 'un';
    console.log(`[mute]: ${type}muting`);
    const mv = bool ? 1 : 0;
    return returnPad('MUTE' + mv);
  } else {
    throw InvalidInputError;
  }
};

const commands = {
  power,
  input,
  volume,
  mute,
};

const processCommand = args => {
  const { command, value } = args;

  const aquos = new SerialPort('/dev/cu.usbserial');

  aquos.on('error', (err) => {
    throw new Error(`[aquos]: error ${err}`);
  });

  aquos.on('open', () => {
    console.log('[port]: opened');

    const asciiCommand = commands[command](value[0]);
    aquos.write(asciiCommand, 'ascii');
    aquos.drain(() => {
      console.log('[port]: drained');
      aquos.close();
    });
  });

  aquos.on('data', (data) => {
    console.log('[data]:', data);
  });

  aquos.on('close', () => {
    console.log('[port]: closed');
  });

};

export default processCommand;
