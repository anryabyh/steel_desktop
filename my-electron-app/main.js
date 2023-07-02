const { app, BrowserWindow, ipcMain } = require('electron');
const http = require('https');
const axios = require("axios");
const path = require("path");
const ModbusRTU = require("modbus-serial");
const plotly = require('plotly')('anryabyh2', 'YdKhJpiJyw4cpxRRyckl');

let numbForWriting;
const client = new ModbusRTU();
const readAddress = 0; // адрес регистра для чтения
const writeAddress = 1; // адрес регистра для записи
let lastWriteTime = 0;
let lastReadValue1;
let lastReadValue2;
let lastReadValue3;
let lastReadValue4;
let lastReadValue5;
let lastReadValue6;



function createWindow() {
  mainWindow = new BrowserWindow({
   
    width: 2000,
    height: 2000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });
  mainWindow.resizable = false
  mainWindow.removeMenu();

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  ipcMain.on("dec", (event, decimalNumber) => {
    console.log("Va" + decimalNumber);
    numbForWriting = decimalNumber;
  });
}

app.on('ready', () => {
  createWindow();
  client.connectRTUBuffered("COM9", { baudRate: 115200 }, () => {
    read();

    setInterval(write, 5000);
    setInterval(read, 5100);

    console.log('Мы тут');
  });
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function write() {
  try {
    const now = Date.now();
    if (now - lastWriteTime >= 5000) {
      client.setID(1);
      const value1 = numbForWriting;
      const value2 = getRandomInt(16);
      const value3 = getRandomInt(16);
      const value4 = getRandomInt(16);
      const value5 = getRandomInt(16);
      const value6 = getRandomInt(16);
      const valuesToWrite = [value1, value2, value3, value4, value5, value6];
      const addressesToWrite = [
        writeAddress,
        writeAddress + 1,
        writeAddress + 2,
        writeAddress + 3,
        writeAddress + 4,
        writeAddress + 5,
      ];

      for (let i = 0; i < valuesToWrite.length; i++) {
        await client.writeRegisters(addressesToWrite[i], [valuesToWrite[i]]);
        console.log(
          `Записано значение ${valuesToWrite[i]} в регистр ${addressesToWrite[i]}`
        );
      }
    }
  } catch (e) {
    console.log("ОШИБКА: ", e);
  }
}

async function read() {
  try {
    const { data } = await client.readHoldingRegisters(readAddress, 6);
    lastReadValue1 = data[0];
    lastReadValue2 = data[1];
    lastReadValue3 = data[2];
    lastReadValue4 = data[3];
    lastReadValue5 = data[4];
    lastReadValue6 = data[5];
    console.log(
      `Прочитано значение ${lastReadValue1} из регистра ${readAddress}`
    );
    console.log(
      `Прочитано значение ${lastReadValue2} из регистра ${readAddress + 1}`
    );
    console.log(
      `Прочитано значение ${lastReadValue3} из регистра ${readAddress + 2}`
    );
    console.log(
      `Прочитано значение ${lastReadValue4} из регистра ${readAddress + 3}`
    );
    console.log(
      `Прочитано значение ${lastReadValue5} из регистра ${readAddress + 4}`
    );
    console.log(
      `Прочитано значение ${lastReadValue6} из регистра ${readAddress + 5}`
    );
   // var requestData =  [lastReadValue1, lastReadValue2, lastReadValue3, lastReadValue4, lastReadValue5, lastReadValue6];
 

  // Добавьте код для проверки и вывода остальных ошибок в соответствующие блоки условий

    const values = [lastReadValue1, lastReadValue2];
    mainWindow.webContents.send('update-values', values);

    const value = lastReadValue2;
    mainWindow.webContents.send('update-values2', value);

    sendLog(lastReadValue2);
  } 
  catch (e) {
    console.log("ОШИБКА: ", e);
  }
}

const layout = {
  title: 'Значения первого и второго регистров производительности',
  xaxis: {
    title: 'Время'
  },
  yaxis: {
    title: 'Значение'
  }
};

const trace1 = {
  x: [],
  y: [],
  mode: 'lines',
  name: 'lastReadValue1'
};

const trace2 = {
  x: [],
  y: [],
  mode: 'lines',
  name: 'lastReadValue2'
};

function createGraph() {
  trace1.x.push(new Date());
  trace1.y.push(lastReadValue1);
  trace2.x.push(new Date());
  trace2.y.push(lastReadValue2);

  if (trace1.x.length > 100) {
    trace1.x.shift();
    trace1.y.shift();
  }
  if (trace2.x.length > 100) {
    trace2.x.shift();
    trace2.y.shift();
  }

  const data = [trace1, trace2];
  const options = { layout: layout, filename: 'lastReadValues', fileopt: 'overwrite' };

  plotly.plot(data, options, function (err, msg) {
    if (err) {
      console.log('Ошибка создания графика: ', err);
    } else {
      console.log('График успешно создан: ', msg.url);
    }
  });
}

async function sendLog(logValue) {
  try {
    const currentTime = new Date().toISOString();

    const requestBody = {
      "id_machine": "1",
      "log": logValue.toString(),
      "type": "info",
      "time": currentTime
    };

    console.log("Отправка лога: ", requestBody);

    const response = await axios.post("https://api-aggregate.s-k56.ru/api/add-log", requestBody);
    console.log('Успешный ответ от сервера:', response.data);
  } catch (error) {
    console.error('Ошибка при отправке запроса:', error);
  }
} 
async function getLogs(id_machine) {
  try {
    const response = await axios.get(`https://api-aggregate.s-k56.ru/api/get-logs?id_machine=${id_machine}`);
    console.log('Успешный ответ от сервера:', response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке запроса:', error);
    return null;
  }
}


// Пример использования функции getLogs и обработки полученных логов
async function getLogFunc() {
  const id_machine = 1; // Здесь указывается нужный id_machine
  const logs = await getLogs(id_machine);

  if (logs) {
    logs.forEach((log) => {
      console.log('ID лога:', log.id);
      console.log('ID машины:', log.id_machine);
      console.log('Лог:', log.log);
      console.log('Тип:', log.type);
      console.log('Время:', log.time);
      console.log('-----------------------');
    });
  } else {
    console.log('Не удалось получить логи');
  }
}

// setInterval(getLogFunc, 10000); // Вызываем получение логов


setInterval(createGraph, 3200);