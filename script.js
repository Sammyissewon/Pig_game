"use strict";

//1. Selecting elements
const player0El = document.querySelector(".player--0"); //현재 플레이어
const player1El = document.querySelector(".player--1");
const score0El = document.querySelector("#score--0"); //총 누적 점수
const score1El = document.getElementById("score--1");
const current0El = document.getElementById("current--0"); //해당 판의 누적점수
const current1El = document.getElementById("current--1");
const diceEl = document.querySelector(".dice"); //주사위
const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");

// init 내에 지역스코프였던 함수들을, init 밖에서 선언하여 전역에서 사용할 수 있도록 함.
// let은 값이 필요 없으며, 쉼표로 복수 선언이 가능.
// currentScore는 init 함수 밖에서 선언해야 함. 안 그러면, 주사위 돌릴 때마다 초기값(0)으로 바뀜.
let scores, currentScore, activePlayer, playing;

//2. Starting conditions
// 초기값 함수 선언
const init = function () {
  //CSS의 hidden 스타일 추가
  //btnRoll 이벤트 안에 생성하면, 점수가 매번 초기화 되기 때문에, 이벤트 외부에 변수를 생성.
  //   const scores = [0, 0];
  //   let currentScore = 0;
  //   let activePlayer = 0;
  //   let playing = true;

  // 위에서 let으로 복수 선언한 값들.
  // ⭐️상위 4개 변수는 DOM 외의 변수들. HTML로 유저에게 보여지는 내용말고, 그 뒤에서 실제로 연산이 일어날 변수들.
  currentScore = 0; //⭐️4. Switch 되면, currentScore는 자동으로 0으로 바뀌고, 해당 플레이어도 자동으로 전환됨. 따라서 currentScore[0,0]같이 쓰지 않음
  scores = [0, 0]; //5. 두 플레이어의 누적점수를 배열로 저장하는 변수
  activePlayer = 0; //⭐️6. 현재 플레이어. 플레이어 1부터 게임 시작이기 때문에, 0을 넣음. Switch하면 0->1(플레이어 2)로 전환
  playing = true; // 7. 현재 게임 진행 중 여부

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  diceEl.classList.add("hidden");
  player0El.classList.remove("player--winner");
  player1El.classList.remove("player--winner");
  player0El.classList.add("player--active");
  player1El.classList.remove("player--active");
};

// 초기값 모음을 init로 선언했지만, 호출하지 않으면 아무 일도 일어나지 않는다
// 따라서 이렇게 호출해줘야함.
init();

// btnRoll과 btnHold에서 반복될 코드임으로 함수로 선언
const switchPlayer = function () {
  // Switch to next
  // 1이 나오면 점수가 0점됨.
  // 그럼 상대방에게 턴 넘김
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;

  //현재 플레이어에 배경 넣기
  // toggle: 스타일이 이미 있으면 빼고, 이미 없으면 넣고
  player0El.classList.toggle("player--active");
  player1El.classList.toggle("player--active");
};

//3. Rolling dice functionality
btnRoll.addEventListener("click", function () {
  // 이미 위에서 playing = true라는 boolean을 선언함
  // 즉 아래 코드들은 게임 중(true)일 때만 주사위 굴리기 가능하다는 의미
  if (playing) {
    //3-1. Generating a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;

    //3-2. Display dice
    diceEl.classList.remove("hidden"); // 시작 때 숨겨졌던 주사위 보여주기
    diceEl.src = `asset/dice-${dice}.png`;

    //3-3. Check for rolled 1
    if (dice !== 1) {
      // Add dice to current score
      // 1 라운드 기준: 플레이어 1의 0점 + 주사위 숫자
      currentScore += dice;
      // 현재 플레이어에 따르는 동적 코드
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchPlayer();
    }
  }
});

// 8.
btnHold.addEventListener("click", function () {
  // btnRoll과 같이, 게임 중(true)일 때만 hold를 누를 수 있다는 의미
  if (playing) {
    // 1. Add current score to active player's score
    // scores[1] = scores[1] + currentScore
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    // 2. Check if player's score is >== 20
    if (scores[activePlayer] >= 20) {
      // Finish the game
      // >=20이 되면, 게임 중이 아님(false)바뀌고, 자동으로 위에 btnRoll과 btnHold는 닫히게 됨
      playing = false;
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add("player--winner");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove("player--active");
    } else {
      // Switch to the next player
      switchPlayer();
    }
  }
});

btnNew.addEventListener("click", init);
