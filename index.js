const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: process.env.MC_HOST,
  port: Number(process.env.MC_PORT),
  username: process.env.MC_USER,
  version: process.env.MC_VERSION
});

function r(min, max) {
  return Math.random() * (max - min) + min;
}

bot.on('spawn', () => {
  setInterval(() => {
    const move = ['forward', 'left', 'right'][Math.floor(Math.random()*3)];
    bot.setControlState(move, true);
    setTimeout(() => bot.setControlState(move, false), r(300,800));
    bot.look(Math.random()*360, r(-10,10), true);
  }, r(4000,9000));

  setInterval(() => {
    if (Math.random() < 0.3) {
      bot.setControlState('jump', true);
      setTimeout(()=>bot.setControlState('jump', false), 300);
    }
  }, r(10000,16000));

  setTimeout(() => process.exit(0), r(25,35)*60000);
});

bot.on('end', () => process.exit(0));
