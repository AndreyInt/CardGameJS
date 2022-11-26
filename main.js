const gameBord = document.querySelector('.bord');
let colCard = document.querySelector('#input__colCard').value;
let quantityCard = createMassCard(checkInputColCard, colCard);
let imageArr = ['./img/1.jpg','./img/1.jpg','./img/2.jpg','./img/2.jpg','./img/3.jpg','./img/3.jpg','./img/4.jpg','./img/4.jpg','./img/5.jpg','./img/5.jpg','./img/6.jpg','./img/6.jpg','./img/7.jpg','./img/7.jpg','./img/8.jpg','./img/8.jpg',
'','','','','','','','','','','','','','','','','','','','','','','','','','','','',];
let timeForWaitStart = 3;
let timeGame = 3;
const openCardButton = document.querySelector('.card__check');
const closeCardButton = document.querySelector('.close__card');
const timer = document.querySelector('.timer');
const openCards = document.querySelectorAll('.onlock');
const loseForm = document.querySelector('#form_lose');
const game_end = document.querySelector('.game_end');
createBoard(timeForWaitStart);
openCardButton.addEventListener('click', openAllCard);
closeCardButton.addEventListener('click', closeNoOnlockCard);
gameBord.addEventListener('click', openThisCard);
loseForm.addEventListener('submit', restarGame);


function createBoard(timeForWaitStart) {
  gameBord.setAttribute("style",`width:${quantityCard.length  * 278}px`);
  let copyArr = imageArr.slice(0, quantityCard.length*quantityCard.length);
  shuffle(copyArr);
  let cardEll = '';
  let count = 0;
  for (let i in quantityCard) {
    for (let j in quantityCard[i]) {
      cardEll += `<div class="card_disable">
      <img class="card_photo" data-id = "${parseInt(copyArr[count].split('./img/')[1])}" src="${copyArr[count]}" alt="Карточка">
      </div>`
      count++;
    }
  }  
    gameBord.innerHTML = cardEll;    
    timer.innerText = `${timeForWaitStart}`;
    let timerId = setInterval(changeTimer, 1000);
    let timeWait = timeForWaitStart * 1000;
    setTimeout(gameTimeProcess, timeWait, timerId);
}

function shuffle(copyArr) {
  for (let i = copyArr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); 
    [copyArr[i], copyArr[j]] = [copyArr[j], copyArr[i]];
  }
}  

function openAllCard() {
  document.querySelectorAll('.card_photo').forEach(el => el.setAttribute('style', 'opacity:1'));
}

function closeNoOnlockCard() {
  document.querySelectorAll('.noOnlock').forEach(el => el.setAttribute('style', 'opacity:0'));
} 

let act = [];

function openThisCard(e) {
  if (act.length < 2) {act.push(e.target);} else return
  if ( ( (e.target.classList.contains('noOnlock')) && (act.length === 1) ) || 
  ((e.target.classList.contains('noOnlock')) && (act.length === 2) && (act[0] !== act[1]))) {
    e.target.setAttribute('style', 'opacity:1');
    if ( (act.length === 2) && (act[0].dataset.id === act[1].dataset.id)) {
      act.forEach( (el) => {
        el.classList.add('onlock');
        el.classList.remove('noOnlock');
        act = [];
      })
    } else if ((act.length === 2) && (act[0].dataset.id !== act[1].dataset.id))
      setTimeout(CloseCard, 1000, act);
  } else  { act.pop(); return}
}

function CloseCard(el) {
  act.forEach( (el) => {
    el.setAttribute('style', 'opacity:0')
  });
  act = [];
}

function changeTimer() {
  timeForWaitStart--; 
  timer.innerText = `${timeForWaitStart}`;
}

function gameTimeProcess(timerId) {
  document.querySelectorAll('.card_photo').forEach(el => el.classList.add('noOnlock'));
  let timeStart = new Date();
  document.querySelector('.timer').textContent = timeGame;
  timeGame--;
  timeStart = timeStart.getTime();
  clearInterval(timerId);
  closeNoOnlockCard();
  let GameTimerPer = gameTime();
  win(GameTimerPer, timeStart);
}

function win(GameTimerPer, timeStart) {
  let checkWin = setInterval((GameTimerPer) => {
    let openCards = document.querySelectorAll('.onlock');
    if (openCards.length === quantityCard.length ** 2) {
      document.querySelector('.timer').classList.remove();
      document.querySelector('.timer').classList.add(`win`);
      let timeEnd = new Date();
      timeEnd = timeEnd.getTime();
      let fullTimeGame = String(timeEnd-timeStart);
      document.querySelector('.timer').innerText = `Поздравляем, вы победили! Ваш результат: ${fullTimeGame.slice(0, fullTimeGame.length-3)}.${fullTimeGame.slice(-3)}с`;
      clearInterval(GameTimerPer);
      clearInterval(checkWin);
      EndGameEvent();
    } else if (timeGame === -1) {
      clearInterval(GameTimerPer);
      clearInterval(checkWin);
      EndGameEvent();
      document.querySelector('.timer').classList.add(`win`);
      document.querySelector('.timer').innerText = `Вы проиграли, попробуйте еще`;
    }
  },1,GameTimerPer);
}

function gameTime() {
  return setInterval( () => { 
    if (timeGame < 6) {
      timer.classList.add(`red`);
    }
    timer.innerText = `${timeGame}`;  
    timeGame--},1000);
}

function EndGameEvent() {
  game_end.setAttribute("style",`width:${quantityCard.length  * 320}px; height:${quantityCard.length  * 166}px; display:flex;`);
  if (timer.classList.contains(`red`)) timer.classList.remove(`red`);
}

function restarGame(evt) {
  evt.preventDefault();
  timeForWaitStart = document.querySelector('#input__timeWait').value;
  timeGame = document.querySelector('#input__timeGame').value;
  timer.className = 'timer'; 
  colCard = document.querySelector('#input__colCard').value;
  quantityCard = createMassCard(checkInputColCard, colCard);
  createBoard(timeForWaitStart);
  game_end.setAttribute("style", `display:none;`);
}

function checkInputColCard(colCard) {
  if (colCard % 2 === 0) 
    return colCard;
  return 4;
}

function createMassCard(checkInputColCard, colCard) {
  let n = Number(checkInputColCard(colCard));
  return [...Array(n)].map( _ => [...Array(n)]);
}