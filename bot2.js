const TelegramBot = require('node-telegram-bot-api');
const db = require('./db');
const axios = require('axios');

const bot = new TelegramBot(`5597101962:AAGVjOy6T1Fp26Ondks1TXd8zX4yxix83ps`, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});

bot.onText(/\/help (.+)/, (msg, [source, match]) => {
    const { id } = msg.chat;
    bot.sendMessage(id, match);
});

async function createUser(name, chat, date) {
    db.query(`INSERT INTO person (name, chat, date) values ($1, $2, $3) RETURNING * `, [name, chat, date]);
}

async function getUsers() {
    const users = await db.query(`SELECT * FROM person`);
    return users.rows;
}

bot.onText(/\/start/, async msg => {
    const { id, first_name } = msg.chat;
    let arr = [];
    let allUsers = await getUsers();
    allUsers.forEach(user => {
        arr.push(user.chat);
    })
    if (!arr.includes(id)) {
        createUser(first_name, id, msg.date);
    }

    bot.sendMessage(id, 'Здравствуйте. Нажмите на любую интересующую Вас кнопку', {
        reply_markup: {
            keyboard: [
                ['Погода в Канаде'],
                ['Хочу почитать!'],
                ['Сделать рассылку'],
            ]
        }
    });
});

bot.on('message', async (msg) => {
    const { id } = msg.chat;
    if (msg.text === 'Погода в Канаде') {

        const weather = await axios.get('https://api.openweathermap.org/data/2.5/weather?id=498817&units=metric&appid=db7c082d05dbf48a5e5946e1386f4b3e&lang=ru')
        bot.sendMessage(id, `в Канаде средняя температура ${Math.round(weather.data.main.temp)} градусов по целсию, ветер ${weather.data.wind.speed} м/с`);
    }
    if (msg.text === 'Хочу почитать!') {
        bot.sendPhoto(id, './python.jpeg', {
            caption: 'Идеальный карманный справочник для быстрого ознакомления с особенностями работы разработчиков на Python. Вы найдете море краткой информации о типах и операторах в Python, именах специальных методов, встроенных функциях, исключениях и других часто используемых стандартных модулях.'
        })
        bot.sendDocument(id, './Python.zip');
    }
    if (msg.text === 'Сделать рассылку') {
        bot.sendMessage(msg.chat.id, 'рассылку делаем?', {
            reply_markup: {
                // inline_keyboard: [
                //     [
                //         {
                //             text: 'Уверен',
                //             callback_data: 'Yess'
                //         },
                //         {
                //             text: 'Отмена',
                //             callback_data: 'Noo'
                //         }
                //     ],

                // ]
                keyboard: [
                    ['Уверен'],
                    ['Отмена'],
                ]
            }
        });
    }
    if (msg.text === 'Отмена') {
        bot.sendMessage(msg.chat.id, 'отменяю', {
            reply_markup: {
                keyboard: [
                    ['Погода в Канаде'],
                    ['Хочу почитать!'],
                    ['Сделать рассылку'],
                ]
            }
        });
    }
    if (msg.text === 'Уверен') {
        bot.sendMessage(msg.chat.id, 'Введите сообщение, которое хотите отправить всем пользователям.', {
            reply_markup: {
                remove_keyboard: true,
            }
            // reply_markup: {
            //     keyboard: [
            //         ['Погода в Канаде'],
            //         ['Хочу почитать!'],
            //         ['Сделать рассылку'],
            //     ]
            // }
        });
        bot.on('message', async msg => {
            let allUsers = await getUsers();
            allUsers.forEach(item => {
                bot.sendMessage(item.chat, `Ваше персональное сообщение для чата ${item.chat}: ${msg.text}`);
            })
            bot.sendMessage(msg.chat.id, 'рассылка сообщений успешно завершена')
        })

    }
});

bot.on('callback_query', query => {
    if (query.data === 'Noo') {
        bot.answerCallbackQuery(query.id, 'отменить');
    }
});