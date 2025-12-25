const mineflayer = require('mineflayer');

let reconnectCount = 0;
let bot;

function startBot(delay = 0) {
  setTimeout(() => {
    bot = mineflayer.createBot({
      host: process.env.MC_HOST,
      port: Number(process.env.MC_PORT),
      username: process.env.MC_USER,
      version: process.env.MC_VERSION
    });

    function r(min, max) {
      return Math.random() * (max - min) + min;
    }

    bot.once('spawn', () => {
      reconnectCount = 0; // reset when success
      console.log("Joined server");

      setInterval(() => {
        const move = ['forward', 'left', 'right'][Math.floor(Math.random()*3)];
        bot.setControlState(move, true);
        setTimeout(() => bot.setControlState(move, false), r(300,800));
        bot.look(Math.random()*360, r(-10,10), true);
      }, r(5000,9000));

      // natural restart
      setTimeout(() => process.exit(0), r(25,35)*60000);
    });

    bot.on('end', reconnect);
    bot.on('kicked', reconnect);
    bot.on('error', () => {});
  }, delay);
}

function reconnect() {
  reconnectCount++;

  let delay;
  if (reconnectCount <= 2) {
    delay = 3000;        // first 2 fast reconnect
  } else {
    delay = 60000;       // then wait 1 minute
  }

  console.log(`Reconnect attempt ${reconnectCount}, wait ${delay/1000}s`);
  startBot(delay);
}

startBot();
