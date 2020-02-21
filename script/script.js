'use strict';

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
  deadlineDay: [[2, 7], [3, 10], [7, 10]],
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
  mobileTemplates = document.getElementById('mobileTemplates');



function showElem(el) {
  el.style.display = 'block';
}

function hideElem(el) {
  el.style.display = 'none';
}

function priceCalc(el) {
  let result = 0;
  let index = 0;
  let options = [];

  if (el.name === 'whichSite') {
    for (const item of formCalc.elements) {
      if (item.type === 'checkbox') {
        item.checked = false;
      }
    }
    hideElem(fastRange);
  }

  

  for (const item of formCalc.elements) {
    if (item.name === 'whichSite' && item.checked) {
      index = DATA.whichSite.indexOf(item.value);
    } else if (item.classList.contains('calc-handler') && item.checked) {
      options.push(item.value);
    }
  }
  
  options.forEach((key) => {
    if (typeof(DATA[key]) === 'number') {
      if (key === 'sendOrder') {
        result += DATA[key];
      } else {
        result += DATA.price[index] * DATA[key]/100; 
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
  totalPriceSum.textContent = result;
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
      if (adapt.checked) {
        mobileTemplates.disabled = false;
        mobileTemplates.checked = false;
      } else {
        mobileTemplates.disabled = true;
      }
  }

}



startButton.addEventListener('click', function() {
  showElem(mainForm);
  hideElem(firstScreen);
});

endButton.addEventListener('click', function() {
  for (const elem of formCalc.elements) {
    if (elem.tagName === 'FIELDSET') {
      hideElem(elem);
    }
  }

  showElem(total);

});

formCalc.addEventListener('change', handlerCBForm);