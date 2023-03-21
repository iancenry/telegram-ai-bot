const express = require('express')
const TelegramBot = require('node-telegram-bot-api');
const {Configuration, OpenAIApi} = require('openai')
const dotenv = require('dotenv')

//init express
const app = express();

//setup environment variables
dotenv.config();

//setup telegram bot access token
const token = process.env.TELEGRAM_BOT_TOKEN;

//config openai API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

//new openai instance
const openai = new OpenAIApi(configuration)

//create a new bot with polling
const bot = new TelegramBot(token, {polling: true});

bot.on("polling_error", (msg) => console.log(msg));

// Listen for any message received
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const msgContent = msg.text

  // send message received to openai api
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt : msgContent,
    temperature: 0,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  })

  //send response from openai api to telegram bot user
  bot.sendMessage(chatId, response.data.choices[0].text);
});

const PORT = process.env.PORT || 5000;
//start express server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));