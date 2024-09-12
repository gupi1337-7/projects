const TelegramBot = require("node-telegram-bot-api");
const Fuse = require("fuse.js");
const token = "*";
const bot = new TelegramBot(token, { polling: true });
const fs = require("fs");

const knowledgeBase = JSON.parse(fs.readFileSync("knowledgeBase.json", "utf8"));
const mainMenu = {
  reply_markup: {
    keyboard: [
      [{ text: "ПО" }],
      [{ text: "Инструкции" }],
      [{ text: "Ввести ошибку" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

const poMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Aisino V73 .0.64",
          url: "https://disk.yandex.ru/d/Dv8QuGyDlpV9Uw",
        },
      ],
      [
        {
          text: "Aisino V37 .02.192",
          url: "https://disk.yandex.ru/d/K7mNavbgAonojA",
        },
      ],
      [
        {
          text: "Aisino V80 .02.192",
          url: "https://disk.yandex.ru/d/Dv8QuGyDlpV9Uw",
        },
      ],
      [
        {
          text: "PAYMOB A90 .2.56",
          url: "https://disk.yandex.ru/d/qA-eD8cRmDCQcw",
        },
      ],
      [
        {
          text: "CENTERM K9 .02.32",
          url: "https://disk.yandex.ru/d/jNiilMJMLjQErg",
        },
      ],
      [
        {
          text: "PAX D270 .33.008",
          url: "https://disk.yandex.ru/d/mi3DD3SqCo4Dqw",
        },
      ],
      [
        {
          text: "PAX D230 .32.003",
          url: "https://disk.yandex.ru/d/DaAM48TVeXEOTA",
        },
      ],
      [
        {
          text: "PAX S920 .32.003",
          url: "https://disk.yandex.ru/d/HjTAC5v1uVKzQw",
        },
      ],

      [
        {
          text: "PAX Q80 .32.003",
          url: "https://disk.yandex.ru/d/bPHOXHMebqyAMA",
        },
      ],
      [
        {
          text: "PAX S800 .32.003",
          url: "https://disk.yandex.ru/d/reUMJtgV5coTqg",
        },
      ],
      [
        {
          text: "PAX S300 .28.009",
          url: "https://disk.yandex.ru/d/Hv8XuruKd_XI4Q",
        },
      ],
      [{ text: "Выйти", callback_data: "exit" }],
    ],
  },
};

const instructionsMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Подготовка V73",
          url: "https://disk.yandex.ru/i/XdU94W-bFoDcTg",
        },
      ],
      [
        {
          text: "Подготовка V37",
          url: "https://disk.yandex.ru/i/-JxycJmd8zsvzg",
        },
      ],
      [
        {
          text: "Подготовка V80",
          url: "https://disk.yandex.ru/i/zqNllykxn9UCTQ",
        },
      ],
      [
        {
          text: "Подготовка PAYMOB A90",
          url: "https://disk.yandex.ru/i/GvfnmQEDZsbYZQ",
        },
      ],
      [
        {
          text: "Подготовка K9",
          url: "https://disk.yandex.ru/i/i0522PJI8cSddA",
        },
      ],

      [
        {
          text: "Подготовка терминалов с ОС Prolin Standalone(Q80, S800, S920, D230)",
          url: "https://disk.yandex.ru/i/P_JRzWu8uYMAkw",
        },
      ],
      [
        {
          text: "Подготовка D270",
          url: "https://disk.yandex.ru/i/JdMkG6nT6BUi_A",
        },
      ],
      [
        {
          text: "Подготовка S300",
          url: "https://disk.yandex.ru/i/jlkL9CUML_227w",
        },
      ],
      [
        {
          text: "Подготовка Standalone Verifone Engage",
          url: "https://disk.yandex.ru/i/hPPOh_jcabHkyw",
        },
      ],
      [
        {
          text: "Подготовка ИКР Verifone Engage",
          url: "https://disk.yandex.ru/i/ONP3ArX-oxyQRQ",
        },
      ],
      [
        {
          text: "Подготовка Standalone Verifone EVO",
          url: "https://disk.yandex.ru/i/avyKaihYRNUdrw",
        },
      ],
      [
        {
          text: "Подготовка ИКР Verifone EVO",
          url: "https://disk.yandex.ru/i/SrwsH_D0bX63Iw",
        },
      ],
      [
        {
          text: "FAQ",
          url: "https://docs.google.com/spreadsheets/d/1NZrhvxVijo2-lym-0UHvLEVPmY62DA6a/edit?gid=2016574789#gid=2016574789",
        },
      ],
      [{ text: "Выйти", callback_data: "exit" }],
    ],
  },
};

const options = {
  includeScore: true,
  keys: ["errorCode", "errorText"],
};

const fuse = new Fuse(knowledgeBase, options);
const messageCount = {};
let totalCounts = 0;
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Выберите опцию:", mainMenu);
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toUpperCase();
  logMessage(chatId, text);

  if (text === "ПО") {
    bot.sendMessage(chatId, "ВЫБЕРИТЕ ПО:", poMenu);
  } else if (text === "ИНСТРУКЦИИ") {
    bot.sendMessage(chatId, "Выберите инструкцию:", instructionsMenu);
  } else if (text === "ВВЕСТИ ОШИБКУ") {
    bot.sendMessage(chatId, "Введите код ошибки или текст ошибки:");
  } else if (text === "/START") {
  } else {
    const response = handleUserInput(text);
    bot.sendMessage(chatId, response);
  }
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "exit") {
    bot.sendMessage(chatId, "Выберите опцию:", mainMenu);
  }
});

function handleUserInput(input) {
  const exactMatch = knowledgeBase.find(
    (entry) =>
      entry.errorCode === input ||
      (entry.errorText && entry.errorText === input)
  );

  if (exactMatch) {
    return `Решение для ${input}:\n${exactMatch.solution}`;
  }

  const result = fuse.search(input);

  if (result.length > 0) {
    let response = `Возможно, вы имели в виду одну из следующих ошибок:\n\n`;
    result.forEach((res, index) => {
      if (index < 3) {
        const { item } = res;
        response += ` Ошибка: ${item.errorCode || item.errorText}\n\nРешение: ${
          item.solution
        }\n\n`;
      }
    });
    response += `\nЕсли из предложенных ошибок вы не нашли нужную, попробуйте ввести запрос еще раз или обратитесь в чат АБ SUPPORT: https://t.me/+TGwsFhynvBs3MzEy`;
    return response;
  }

  return "Ошибка не найдена. Поищите ошибку в FAQ, если не нашли решения там - обратитесь в чат АБ SUPPORT: https://t.me/+TGwsFhynvBs3MzEy\n\n";
}

function logMessage(chatId, text) {
  const normalizedText = text.toLowerCase();
  if (!messageCount[normalizedText]) {
    messageCount[normalizedText] = 0;
  }
  messageCount[normalizedText]++;
  console.log(
    `Chat ID: ${chatId}, Message: ${normalizedText}, Count: ${
      messageCount[normalizedText]
    }, total requests: ${totalCounts++}`
  );
}
