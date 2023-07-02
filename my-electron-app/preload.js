// Проверяем, что текущая страница является "index.html"
if (window.location.pathname.endsWith("index.html")) {
  const { ipcRenderer } = require("electron");

  // Функция для сохранения значений полей в sessionStorage
  function saveFieldValuesToStorage() {
    const inputs = Array.from(document.querySelectorAll(".lamp-input"));
    const fieldValues = inputs.map((input) => input.value);
    sessionStorage.setItem("fieldValues", JSON.stringify(fieldValues));
  }

  // Функция для восстановления значений полей из sessionStorage
  function restoreFieldValuesFromStorage() {
    const fieldValues = JSON.parse(sessionStorage.getItem("fieldValues")) || [];
    const inputs = Array.from(document.querySelectorAll(".lamp-input"));
    inputs.forEach((input, index) => {
      input.value = fieldValues[index] || "";
    });
  }

  ipcRenderer.on("initial-values", (event, values) => {
    const [value1, value2] = values;
    document.getElementById("value1").textContent = value1;
    document.getElementById("value2").textContent = value2
      .toString(2)
      .split("")
      .reverse()
      .join("");
  });

  window.addEventListener("DOMContentLoaded", () => {
    console.log("The page has been loaded!");
    const inputs = Array.from(document.querySelectorAll(".lamp-input"));
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        const inputValues = inputs.map((input) => input.value || "0").join("");
        const reversedBinaryString = inputValues.split("").reverse().join("");
        const decimalNumber = parseInt(reversedBinaryString, 2);
        console.log(decimalNumber);
        ipcRenderer.send("dec", decimalNumber);
        saveFieldValuesToStorage(); // Сохранение значений полей
      });
    });
  });

  ipcRenderer.on("update-values", (event, values) => {
    const [value1, value2] = values;
    const binaryString = value2
      .toString(2)
      .split("")
      .reverse()
      .join("")
      .padEnd(16, "0");
    document.getElementById("value1").textContent = value1;
    document.getElementById("value2").textContent = binaryString;
    const binaryArray = binaryString.split("");
    const lampContainers = document.querySelectorAll(".lamp-container");
    for (let i = 0; i < lampContainers.length; i++) {
      const lamp = lampContainers[i].querySelector(".lamp");
      const input = lampContainers[i].querySelector(".lamp-input");
      const binaryValue = binaryArray[i];
      input.value = binaryValue;
      if (binaryValue === "1") {
        lamp.classList.add("lamp-on");
        lamp.classList.remove("lamp-off");
      } else {
        lamp.classList.add("lamp-off");
        lamp.classList.remove("lamp-on");
      }
    }
  });

  // Восстановление значений полей при загрузке страницы
  window.addEventListener("DOMContentLoaded", restoreFieldValuesFromStorage);
  
  window.addEventListener("beforeunload", () => {
    saveFieldValuesToStorage(); // Сохранение значений полей перед покиданием страницы
  });

  window.addEventListener("unload", () => {
    sessionStorage.removeItem("fieldValues"); // Очистка sessionStorage при полном выходе со страницы
  });

  window.addEventListener("pagehide", () => {
    saveFieldValuesToStorage(); // Сохранение значений полей при скрытии страницы (например, при переходе на другую страницу)
  });

  window.addEventListener("pageshow", () => {
    restoreFieldValuesFromStorage(); // Восстановление значений полей при показе страницы (после возвращения на страницу)
  });

  window.addEventListener("popstate", () => {
    restoreFieldValuesFromStorage(); // Восстановление значений полей при использовании кнопок навигации браузера
  });

  window.addEventListener("hashchange", () => {
    restoreFieldValuesFromStorage(); // Восстановление значений полей при изменении хэша в URL
  });

  window.addEventListener("hashchange", () => {
    restoreFieldValuesFromStorage(); // Восстановление значений полей при изменении хэша в URL
  });

  window.addEventListener("unload", () => {
    sessionStorage.removeItem("fieldValues"); // Очистка sessionStorage при полном выходе со страницы
  });

  window.addEventListener("pagehide", () => {
    saveFieldValuesToStorage(); // Сохранение значений полей при скрытии страницы (например, при переходе на другую страницу)
  });

  window.addEventListener("pageshow", () => {
    restoreFieldValuesFromStorage(); // Восстановление значений полей при показе страницы (после возвращения на страницу)
  });

  window.addEventListener("popstate", () => {
    restoreFieldValuesFromStorage(); // Восстановление значений полей при использовании кнопок навигации браузера
  });
}



  if (window.location.pathname.endsWith("glavnaya.html") || window.location.pathname.endsWith("index.html")) {
    const { ipcRenderer } = require("electron");
// Функция для сохранения ошибки в хранилище
function saveErrorToStorage(errorDescription) {
  const errors = JSON.parse(sessionStorage.getItem("errors")) || [];
  errors.push(errorDescription);
  sessionStorage.setItem("errors", JSON.stringify(errors));
}

// Функция для загрузки ошибок из хранилища и добавления их в пользовательский интерфейс
function loadErrorsFromStorage() {
  const errors = JSON.parse(sessionStorage.getItem("errors")) || [];
  const errorBox = document.getElementById("error-box");
  if (errorBox) {
    errors.forEach((error) => {
      if (error) {
        const errorElement = document.createElement("p");
        errorElement.textContent = error;
        errorBox.appendChild(errorElement);

        // Добавление разделителя после каждой ошибки
        const divider = document.createElement("hr");
        errorBox.appendChild(divider);
      }
    });
  }
}

if (window.location.pathname.endsWith("glavnaya.html") || window.location.pathname.endsWith("index.html")) {
  const { ipcRenderer } = require("electron");

// Функция для сохранения ошибки в хранилище
function saveErrorToStorage(errorDescription) {
  const errors = JSON.parse(sessionStorage.getItem("errors")) || [];
  errors.push(errorDescription);
  sessionStorage.setItem("errors", JSON.stringify(errors));

  // Загрузка ошибок из хранилища после сохранения
  loadErrorsFromStorage();
}

// Функция для загрузки ошибок из хранилища и добавления их в пользовательский интерфейс
function loadErrorsFromStorage() {
  const errors = JSON.parse(sessionStorage.getItem("errors")) || [];
  const errorBox = document.getElementById("error-box");
  if (errorBox) {
    // Очистка содержимого errorBox перед добавлением ошибок
    errorBox.innerHTML = "";

    errors.forEach((error) => {
      if (error) {
        const errorElement = document.createElement("p");
        errorElement.textContent = error;
        errorBox.appendChild(errorElement);

        // Добавление разделителя после каждой ошибки
        const divider = document.createElement("hr");
        errorBox.appendChild(divider);
      }
    });
  }
}


// Проверка кода ошибки и вывод рекомендаций
ipcRenderer.on("update-values2", (event, value) => {
  const value2 = value;
  // Проверка значений value2 и применение стилей к иконкам в зависимости от ошибки
  if (window.location.pathname.endsWith("glavnaya.html")) {
    if (value2 === 16) {
      // Ошибка: Зажатие
      document.querySelector('.recycle-icon').style.color = 'black';
      document.querySelector('.bolt-icon').style.color = 'black';
      document.querySelector('.tick').style.color = 'black';
      document.querySelector('.exclamation-icon').style.color = 'orange';
      document.querySelector('.warning-icon').style.color = 'black';
    } else if (value2 === 10) {
      // Ошибка: Перегрев
      document.querySelector('.recycle-icon').style.color = 'black';
      document.querySelector('.bolt-icon').style.color = 'black';
      document.querySelector('.tick').style.color = 'black';
      document.querySelector('.exclamation-icon').style.color = 'black';
      document.querySelector('.warning-icon').style.color = 'red';
    } else if (value2 === 8) {
      // Ошибка: Падение скорости
      document.querySelector('.recycle-icon').style.color = 'black';
      document.querySelector('.bolt-icon').style.color = '';
      document.querySelector('.tick').style.color = '';
      document.querySelector('.exclamation-icon').style.color = 'black';
      document.querySelector('.warning-icon').style.color = 'black';
    } else if (value2 === 6) {
      // Ошибка: Уменьшение тока
      document.querySelector('.recycle-icon').style.color = '';
      document.querySelector('.bolt-icon').style.color = 'black';
      document.querySelector('.tick').style.color = '';
      document.querySelector('.exclamation-icon').style.color = 'black';
      document.querySelector('.warning-icon').style.color = 'black';
    } else if (value2 === 12) {
      // Ошибка: Увеличение тока
      document.querySelector('.recycle-icon').style.color = '';
      document.querySelector('.bolt-icon').style.color = 'red';
      document.querySelector('.tick').style.color = '';
      document.querySelector('.exclamation-icon').style.color = 'black';
      document.querySelector('.warning-icon').style.color = 'black';
    } else {
      // Нормальное состояние
      document.querySelector('.recycle-icon').style.color = 'blue';
      document.querySelector('.bolt-icon').style.color = 'yellow';
      document.querySelector('.tick').style.color = '#4CAF50';
      document.querySelector('.exclamation-icon').style.color = 'black';
      document.querySelector('.warning-icon').style.color = 'black';
    }
  }

  // Сохранение ошибки в хранилище
  const errorDescription = getErrorDescription(value2);
  saveErrorToStorage(errorDescription);

// Остановка анимации гифки и вращения лопастей при наличии ошибки и на странице "glavnaya.html"
if ([6, 8, 10, 12, 16].includes(value2) && window.location.pathname.endsWith("glavnaya.html")) {
  const gifImage = document.getElementById('stop-animation');
  const staticImage = document.createElement('img');
  staticImage.src = 'staticImage.png'; // Путь к статичному изображению

  if (!gifImage.nextElementSibling || gifImage.nextElementSibling.src !== staticImage.src) {
    gifImage.style.display = 'none'; // Скрываем гиф-изображение

    if (!gifImage.nextElementSibling) {
      const parentElement = gifImage.parentNode;
      parentElement.insertBefore(staticImage, gifImage); // Вставляем статичное изображение перед гиф-изображением
      parentElement.removeChild(gifImage); // Удаляем гиф-изображение из DOM
    } else {
      gifImage.nextElementSibling.src = staticImage.src; // Обновляем источник статичного изображения
    }
  }

  const blades = document.querySelectorAll('.blade');
  blades.forEach((blade) => {
    blade.classList.add('paused'); // Добавляем класс .paused для остановки анимации в CSS
  });
}


});

// Загрузка ошибок из хранилища при загрузке страницы
window.addEventListener("DOMContentLoaded", loadErrorsFromStorage);

// Функция для получения описания ошибки на основе кода
function getErrorDescription(errorCode) {
  let errorDescription = "";
  switch (errorCode) {
    case 16:
      errorDescription = "Зажатие. Необходима техподдержка компании - производителя";
      break;
    case 10:
      errorDescription = "Перегрев. Остановите работу на время, проверьте работоспособность в холостом режиме";
      break;
    case 8:
      errorDescription = "Падение скорости. Проверьте количество стружки на конвейерной ленте";
      break;
    case 6:
      errorDescription = "Уменьшение тока. Отрегулируйте настройки комплекса и проверьте количество стружки";
      break;
    case 12:
      errorDescription = "Увеличение тока. Отрегулируйте настройки комплекса и проверьте количество стружки";
      break;
    default:
      // Если значение errorCode не соответствует ни одному коду ошибки, не выводим сообщение об ошибке
      errorDescription = "";
      break;
  }
  return errorDescription;
  
}
// Очистка списка ошибок при завершении работы
window.addEventListener("beforeunload", () => {
  sessionStorage.removeItem("errors");
});
}
}

