'use strict';

const DAY_ARRAY = ['день', 'дня', 'дней'],
  YES_NO_ARRAY = ['Нет', 'Да'];


const DATA = {
  whichSite: ['landing', 'multiPage', 'onlineStore'],
  price: [4000, 8000, 26000],
  desktopTemplates: [50, 40, 30],
  adapt: 20,
  mobileTemplates: 15,
  editable: 10,
  metrikaYandex: [500, 1000, 2000],
  analyticsGoogle: [850, 1350, 3000],
  sendOrder: 500,
  deadlineDay: [
    [2, 7],
    [3, 10],
    [7, 10]
  ],
  deadlinePercent: [20, 17, 15]
};

const startButton = document.querySelector('.start-button'),
  firstScreen = document.querySelector('.first-screen'),
  mainForm = document.querySelector('.main-form'),
  formCalc = document.querySelector('.form-calculate'),
  endButton = document.querySelector('.end-button'),
  total = document.querySelector('.total'),
  fastRange = document.querySelector('.fast-range'),
  totalPriceSum = document.querySelector('.total_price__sum'),
  adapt = document.getElementById('adapt'),
  mobileTemplates = document.getElementById('mobileTemplates'),
  typeSite = document.querySelector('.type-site'),
  maxDeadline = document.querySelector('.max-deadline'),
  rangeDeadline = document.querySelector('.range-deadline'),
  deadlineValue = document.querySelector('.deadline-value'),
  yesNoCheckbox = document.querySelectorAll('.yes-no-checkbox'),
  yesNoString = document.querySelectorAll('.yes-no-string');

function declOfNum(n, titles) {
  return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
    0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}

function showElem(el) {
  el.style.display = 'block';
}

function hideElem(el) {
  el.style.display = 'none';
}

function changeYesNo(event) {

  if (event.target.checked) {
    for (const el of yesNoString) {
      if (el.value === event.target.dataset.val) {
        el.textContent = YES_NO_ARRAY[1];
      }
    }
  } else {
    for (const el of yesNoString) {
      if (el.value === event.target.dataset.val) {
        el.textContent = YES_NO_ARRAY[0];
      }
    }
  }
}

  function renderYesNo() {
    for (const el of yesNoCheckbox) {
      el.addEventListener('change', changeYesNo);
    }
  }


  function renderTextContent(total, site, maxDay, minDay) {
    totalPriceSum.textContent = total;
    typeSite.textContent = site;
    maxDeadline.textContent = declOfNum(maxDay, DAY_ARRAY);
    rangeDeadline.min = minDay;
    rangeDeadline.max = maxDay;
    deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_ARRAY);
    renderYesNo();
  }

  function priceCalc(el) {
    let result = 0;
    let index = 0;
    let options = [];
    let site = '';
    let maxDeadlineDay = DATA.deadlineDay[index][1];
    let minDeadlineDay = DATA.deadlineDay[index][0];
    // let yesNo = '';

    if (el.name === 'whichSite') {
      for (const item of formCalc.elements) {
        if (item.type === 'checkbox') {
          item.checked = false;
          mobileTemplates.disabled = true;
        }
      }
      hideElem(fastRange);
    }

    for (const item of formCalc.elements) {
      if (item.name === 'whichSite' && item.checked) {
        index = DATA.whichSite.indexOf(item.value);
        site = item.dataset.site;
        maxDeadlineDay = DATA.deadlineDay[index][1];
        minDeadlineDay = DATA.deadlineDay[index][0];
      } else if (item.classList.contains('calc-handler') && item.checked) {
        options.push(item.value);
      }
    }

    options.forEach((key) => {
      if (typeof (DATA[key]) === 'number') {
        if (key === 'sendOrder') {
          result += DATA[key];
        } else {
          result += DATA.price[index] * DATA[key] / 100;
        }
      } else {
        if (key === 'desktopTemplates') {
          result += DATA.price[index] * DATA[key][index] / 100;
        } else {
          result += DATA[key][index];
        }
      }
    });

    result += DATA.price[index];

    renderTextContent(result, site, maxDeadlineDay, minDeadlineDay);

  }



  function handlerCBForm(event) {
    const target = event.target;

    if (target.classList.contains('want-faster')) {
      target.checked ? showElem(fastRange) : hideElem(fastRange);
    }

    if (target.classList.contains('calc-handler')) {
      priceCalc(target);
    }

    if (target.id === 'adapt') {
      if (!adapt.checked) {
        mobileTemplates.disabled = true;
      } else {
        mobileTemplates.disabled = false;
        mobileTemplates.checked = false;
      }
    }

  }



  startButton.addEventListener('click', function () {
    showElem(mainForm);
    hideElem(firstScreen);
  });

  endButton.addEventListener('click', function () {
    for (const elem of formCalc.elements) {
      if (elem.tagName === 'FIELDSET') {
        hideElem(elem);
      }
    }

    showElem(total);

  });

  formCalc.addEventListener('change', handlerCBForm);