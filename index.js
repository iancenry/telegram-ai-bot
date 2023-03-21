const express = require('express')
const TelegramBot = require('node-telegram-bot-api');
const {Configuration, OpenAIApi} = require('openai')
const dotenv = require('dotenv')

const app = express();
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const bot = new TelegramBot(token, {polling: true});


// Listen for any kind of message. There are different kinds of messages.
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const msgContent = msg.text

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt : msgContent,
    temperature: 0,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  })
  
  bot.sendMessage(chatId, response.data.choices[0].text);

  bot.sendMessage(chatId, 'Received your message');
});



const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

