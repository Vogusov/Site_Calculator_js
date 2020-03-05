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
  editable = document.getElementById('editable'),
  mobileTemplates = document.getElementById('mobileTemplates'),
  typeSite = document.querySelector('.type-site'),
  maxDeadline = document.querySelector('.max-deadline'),
  rangeDeadline = document.querySelector('.range-deadline'),
  deadlineValue = document.querySelector('.deadline-value'),
  yesNoString = document.querySelectorAll('.yes-no-string'),
  yesNoCheckBox = document.querySelectorAll('.yes-no-checkbox'),
  calcDdescription = document.querySelector('.calc-description-1'),
  metrikaYandex = document.getElementById('metrikaYandex'),
  analyticsGoogle = document.getElementById('analyticsGoogle'),
  sendOrder  =document.getElementById('sendOrder'),
  cardHead = document.querySelector('.card-head'),
  totalPrice = document.querySelector('.total_price'),
  firstFieldset = document.querySelector('.first-fieldset');


function changeYesNo() {
  yesNoCheckBox.forEach(el => {    

    if (el.checked) {      
      yesNoString.forEach(str => {

        if (str.dataset.val === el.value) {
          str.innerHTML = 'Да';
        } 
      });

    } else {

      yesNoString.forEach(str => {

        if (str.dataset.val === el.value) {
          str.innerHTML = 'Нет';
        } 
      });       
    }
  });
}



function declOfNum(n, titles, from) {
  return n + ' ' + titles[from ? (n % 10 === 1 && n % 100 !== 11 ? 1 : 2) : 
    (n % 10 === 1 && n % 100 !== 11) ? 0 && n % 0 :
     n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}



function showElem(el) {
  el.style.display = 'block';
}

function hideElem(el) {
  el.style.display = 'none';
}



function dopOptionsString () {
  let str = '';

  if (metrikaYandex.checked || analyticsGoogle.checked || sendOrder.checked ) {
    str += 'Подключим';

    if (metrikaYandex.checked) {
      str += ' Яндекс Метрику';
      
      if  (analyticsGoogle.checked && sendOrder.checked) {
        str += ', Гугл Аналитику и отправку заявок на почту.';
        return str;
      }

      if (analyticsGoogle.checked || sendOrder.checked) {
        str += ' и';
      }        
    }

    if (analyticsGoogle.checked) {
      str += ' Гугл Аналитику';

      if (sendOrder.checked) {
        str += ' и';
      }
    }

    if (sendOrder.checked) {
      str += ' отправку заявок на почту';
    }
    str += '.';
      
  }
  return str;
}



function renderTextContent(total, site, maxDay, minDay) {
  totalPriceSum.textContent = total;
  typeSite.textContent = site;
  maxDeadline.textContent = declOfNum(maxDay, DAY_ARRAY, true);
  rangeDeadline.min = minDay;
  rangeDeadline.max = maxDay;
  deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_ARRAY);

  changeYesNo();
  
  calcDdescription.textContent = `
  Сделаем ${site} ${adapt.checked ?
    ', адаптированный под мобильные устройства и планшеты' : ''}.
    ${editable.checked ? `Установим панель админстратора,
    чтобы вы могли самостоятельно менять содержание на сайте без разработчика.` : ''}
    ${dopOptionsString()}
    `;
}



function priceCalc(el = {}) {
  let result = 0;
  let index = 0;
  let options = [];
  let site = '';
  let maxDeadlineDay = DATA.deadlineDay[index][1];
  let minDeadlineDay = DATA.deadlineDay[index][0];
  let overPercent = 0;

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
    } else if (item.classList.contains('want-faster') && item.checked) {
      const overDay = maxDeadlineDay - rangeDeadline.value;
      overPercent = overDay * (DATA.deadlinePercent[index] / 100);
    } 
  }

  result += DATA.price[index];

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

  

  
  result += result * overPercent;

  renderTextContent(result, site, maxDeadlineDay, minDeadlineDay);
}



function handlerCBForm(event) {
  const target = event.target;

  if (target.classList.contains('want-faster')) {
    target.checked ? showElem(fastRange) : hideElem(fastRange);
    priceCalc(target);
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



function moveBackTotal () {
  if (document.documentElement.getBoundingClientRect().bottom > document.documentElement.clientHeight + 150) {
    totalPrice.classList.remove('totalPriceBottom');
    firstFieldset.after(totalPrice);
    window.removeEventListener('scroll', moveBackTotal);
    window.addEventListener('scroll', moveTotal);
  }
}


function moveTotal() {
  if (document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight + 150) {
    totalPrice.classList.add('totalPriceBottom');
    endButton.before(totalPrice);
    window.removeEventListener('scroll', moveTotal);
    window.addEventListener('scroll', moveBackTotal);
  }
}




startButton.addEventListener('click', function () {
  showElem(mainForm);
  hideElem(firstScreen);
  window.addEventListener('scroll', moveTotal);
});

endButton.addEventListener('click', function () {

  for (const elem of formCalc.elements) {
    if (elem.tagName === 'FIELDSET') {
      hideElem(elem);
    }
  }

  cardHead.textContent = 'Заявка на рвзработку сайта';
  hideElem(totalPrice);

  showElem(total);

});

formCalc.addEventListener('change', handlerCBForm);

priceCalc();