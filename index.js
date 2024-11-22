const Telegraf = require('telegraf')
require('dotenv').config()
const bot = new Telegraf.Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Salam bu kotlin.tm!'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Salam diymesen hic zat etjek dal!'));
bot.hears('kotlin',(ctx)=> ctx.reply("Kotlin-da name soragyn bar?"));
bot.command('help', async (ctx) => {
  await ctx.sendMessage("Hello click this button", {
    reply_markup: {
      keyboard: [
        [{text: "Ktor"}],
        [{text:"Kotlin russian documentation"}]
      ]
    }
  })
});
bot.on("message", async ctx => {
  // bad, you did not await ctx.reply()
  ctx.reply("Hello there!");
  
  // good, you awaited your requests
  await ctx.reply("Hello there!");
  
  // also applies to any other async calls you may make
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await res.json();
  await ctx.reply(JSON.stringify(data).substring(0, 4000));
  
  // returning calls is also okay, because the promise will be returned
  return res.statusText;
});
bot.launch()