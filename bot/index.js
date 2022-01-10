const Calendar = require('../');
const Telegraf = require('telegraf');
const {Markup} = require("telegraf");
const bot = new Telegraf('731263070:AAELIVwAWXaRzbr55T-MikkXxvMqEYdwnfI');

const calendar = new Calendar(bot, {
    startWeekDay: 1,
    weekDayNames: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
    monthNames: [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ]
});
const AlexMolotsylo = 444177989
const AlexMolotsylo2 = 4442177989
let dates = []
let note = ''

calendar.setDateListener((context, date) => {
    dates.push(date)
    context.reply(date)

});


bot.command("calendar", context => {
    const today = new Date();
    const minDate = new Date();
    minDate.setMonth(today.getMonth() - 2);
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 2);
    maxDate.setDate(today.getDate());
    context.reply(`Выбирай даты отпуска
    /addNote  -  добавить примечание
    /reset  -  сбросить
    /seeall  -  посмотреть превью сообщения перед отправкой твоему прямому начальнику
    /sendAlexMolotsylo  -  отправить выбраные даты @AlexMolotsylo
    `, calendar.setMinDate(minDate).setMaxDate(maxDate).getCalendar())
});

bot.command('start', ({reply, chat}) => {
    reply(`Привет ${chat.username}! Тут ты можешь записать себе отпуск =)
    /help  -  помощь по боту`, Markup
        .keyboard(['/calendar', '/help'])
        .oneTime()
        .resize()
        .extra()
    )
})

bot.command('help', (ctx) => ctx.reply(`
/calendar  -  открыть календарь для выбора дат
/addNote  -  добавить примечание к сообщению
/seeall  -  посмотреть превью сообщения перед отправкой твоему прямому начальнику
/sendAlexMolotsylo  -  отправить выбранные даты @AlexMolotsylo
/reset  -  сбросить
/help  -  помощь по боту
`))

bot.command('seeall', (ctx) => ctx.reply(`
    ${ctx?.chat?.first_name ? ctx?.chat?.first_name : ''} ${ctx?.chat?.last_name ? ctx?.chat?.last_name : ''} (@${ctx.chat.username} ) хочет записать отпуск на даты:
    ${dates.join(" , ")}
    ${note !== '' ? 'Примечание: ' + note : ''}`
))

bot.command('reset', (ctx) => {
    dates = []
    note = ''
    return false
})

bot.command('addNote', ({reply}) => {
    bot.on('text', (ctx) => {
        note = ctx.message.text
        ctx.reply(`Примечание: ${note}`)
    })
})

bot.command('sendAlexMolotsylo', (ctx) => {
    ctx.telegram.sendMessage(AlexMolotsylo,
        `
        ${ctx?.chat?.first_name ? ctx?.chat?.first_name : ''} ${ctx?.chat?.last_name ? ctx?.chat?.last_name : ''} (@${ctx.chat.username} ) хочет записать отпуск на даты:
         ${dates.join(" , ")}
         ${note !== '' ? 'Примечание: ' + note : ''}
         `
    )
    ctx.telegram.sendMessage(ctx.message.chat.id,
        `@AlexMolotsylo было отправленно сообщение с текстом :
        "${ctx?.chat?.first_name ? ctx?.chat?.first_name : ''} ${ctx?.chat?.last_name ? ctx?.chat?.last_name : ''} (@${ctx.chat.username} ) хочет записать отпуск на даты:
         ${dates.join(" , ")} '"
         ${note !== '' ? 'Примечание: ' + note : ''}
         `
    )

    dates = []
})

bot.hears('s', (ctx) => {
    let now = new Date();
    let millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now;
    if (millisTill10 < 0) {
        millisTill10 += 86400000; //
    }
    setTimeout(function () {
        ctx.reply('Hey there 10 AM')
    }, millisTill10);
})
bot.catch((err) => {
    console.log("Error in bot:", err);
});


bot.startPolling();
