const mineflayer = require('mineflayer');

let retry = 0;

function startBot(delay = 0) {
  setTimeout(() => {
    const bot = mineflayer.createBot({
      host: process.env.MC_HOST,
      port: Number(process.env.MC_PORT),
      username: process.env.MC_USER,
      version: process.env.MC_VERSION
    });

    function r(min, max) {
      return Math.random() * (max - min) + min;
    }

    bot.once('spawn', () => {
      retry = 0;

      // anti-AFK
      setInterval(() => {
        const m = ['forward', 'left', 'right'][Math.floor(Math.random()*3)];
        bot.setControlState(m, true);
        setTimeout(() => bot.setControlState(m, false), r(300,800));
        bot.look(Math.random()*360, r(-10,10), true);
      }, r(5000,9000));

      // job finish after ~8 min
      setTimeout(() => process.exit(0), 11 * 60 * 1000);
    });

    const reconnect = () => {
      retry++;
      const wait = retry <= 2 ? 3000 : 60000;
      setTimeout(startBot, wait);
    };

    bot.on('end', reconnect);
    bot.on('kicked', reconnect);
    bot.on('error', () => {});
  }, delay);
}

startBot();
