const Telegraf = require("telegraf");
const express = require("express");
const OpenAI = require("openai");
const axios = require("axios");
const jsdom = require("jsdom");
const cors = require("cors");

const app = express();
const port = 3000;
require("dotenv").config();
app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});
const bot = new Telegraf.Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply("Salam kotlin kod yazyp ugradyn we rezultady gorun!!!")
);
bot.command("help", async (ctx) => {
  await ctx.sendMessage("Meselemin gornushini saylan!!!", {
    reply_markup: {
      keyboard: [
        [
          {
            text: `fun main() {
                  println("Salam dunya");
              }`,
          },
        ],
        [
          {
            text: `fun main() {
                for (i in 1..3) {
                  println(i)
              }
            }`,
          },
        ],
      ],
    },
  });
});
bot.on("message", async (ctx) => {
  // bad, you did not await ctx.reply()
  ctx.reply("Ustinde ishlenyar...");
  ctx.reply("Kotlin kod yuklenyar...");
  const res = await axios.post(
    "https://api.kotlinlang.org/api/2.0.21/compiler/run",
    {
      args: "",
      files: [
        {
          name: "File.kt",
          text: ctx.message.text,
          publicId: "",
        },
      ],
      confType: "java",
    }
  );
  try {
    const message = res.data.text
      .replace(
        "<outStream>",
        "```\n/*🎉 USTUNLIKLI ISHLEDI 🚀\n" + ctx.message.text + "*/\n"
      )
      .replace("</outStream>", "```");

    await ctx.reply(message, { parse_mode: "MarkdownV2" });
  } catch (err) {
    await ctx.reply("🔴 Yalnyshlyk yuze cykdy ❌");
    ctx.reply(res.data.errors["File.kt"].map((it) => it.message));
  }
  //var i = 0;while (i < 5) {println(i);i++;}
  // returning calls is also okay, because the promise will be returned
  return "OK";
});
bot.launch();

app.get("/", async (req, res) => {
  const chatCompletion = await openAi.chat.completions.create({
    messages: [{ role: "user", content: "write calculater jetpack compose" }],
    model: "gpt-4o-mini",
  });
  console.log(chatCompletion);

  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
