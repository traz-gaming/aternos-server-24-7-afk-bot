const mineflayer = require('mineflayer');

let retry = 0;

function startBot() {
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
    retry = 0; // reset retry when joined

    setInterval(() => {
      const move = ['forward', 'left', 'right'][Math.floor(Math.random()*3)];
      bot.setControlState(move, true);
      setTimeout(() => bot.setControlState(move, false), r(300,800));
      bot.look(Math.random()*360, r(-10,10), true);
    }, r(4000,9000));

    setTimeout(() => process.exit(0), r(25,35)*60000);
  });

  bot.on('end', () => {
    retry++;

    // ⏱️ smart delay
    let delay = retry <= 3 ? 3000 : 60000; // first 3 fast, then 1 min

    console.log(`Disconnected. Reconnect in ${delay/1000}s`);
    setTimeout(startBot, delay);
  });

  bot.on('error', () => {});
}

startBot();
