// const { Telegraf } = require("telegraf");
import { Telegraf } from "telegraf";

// Создать бота с полученным ключом
const bot = new Telegraf("5597101962:AAGVjOy6T1Fp26Ondks1TXd8zX4yxix83ps");

// Обработчик начала диалога с ботом
bot.start('message',(ctx) => {
//   ctx.reply(
//     `Приветствую, ${
//        ctx.from.first_name ? ctx.from.first_name : "хороший человек"
//     }! Набери /help и увидишь, что я могу.`
//   )
ctx.reply('Здравствуйте, нажмите на любую интересующую вас кнопку', )
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Inline keyboard', {
        reply_markup: {
            inline_keybaard: [
                [
                    {
                        text: 'ONE',
                        callback_data: '1'
                    }
                ],
                [
                    {
                        text: 'TWO',
                        callback_data: '2'
                    }
                ]
            ]
        }
    })
});

// Обработчик команды /help
bot.help((ctx) => ctx.reply("Справка в процессе"));

// Обработчик команды /whoami
bot.command("whoami", (ctx) => {
  const { id, username, first_name, last_name } = ctx.from;
  return ctx.replyWithMarkdown(`Кто ты в телеграмме:
*id* : ${id}
*username* : ${username}
*Имя* : ${first_name}
*Фамилия* : ${last_name}
*chatId* : ${ctx.chat.id}`);
});

// Обработчик простого текста
bot.on("text", (ctx) => {
  return ctx.reply(ctx.message.text);
});

// Запуск бота
bot.launch();