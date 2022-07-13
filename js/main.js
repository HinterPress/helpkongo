let level = 1;
let roundplace = 1;

let successNumber = 0;
let wrongNumber = 0;

let getFirstNumber = 0;
let getTwoNumber = 0;

let minRandNumber = 1;
let maxRandNumber = 10;

let questionTime = [];

const questionElement = document.getElementById("question");
const levelElement = document.getElementById("level");

levelElement.innerHTML = level;

var timerVariable = setInterval(countUpTimer, 1000);
var timeStop = false;
var totalSeconds = 0;

function createAudio(status) {
    const getAudioContent = document.querySelector('.audio');
    getAudioContent.innerHTML = '<audio controls autoplay><source src="music/' + status + '.mp3" type="audio/mpeg"></audio>';
}

getRandContentNumber(questionElement, 2, 10);

function checkResult(number) {
    const resultPlus = getFirstNumber + getTwoNumber;
    let resultStatus = "";
    if (!timeStop) {
        if (resultPlus === number) {
            createAudio('true');
            resultStatus = "<img src='img/true.png' style='width: 9.1%'>";
            const questionString = getFirstNumber + " + " + getTwoNumber;
            questionTime.push({ "question": questionString, 'time': document.getElementById("timeshow").innerHTML });
            roundplace++;
            timeStop = true;
            totalSeconds = 0;
            successNumber++;
            document.querySelector('.success-div').innerHTML = successNumber;
            questionElement.innerHTML = "<span>" + getFirstNumber + "+" + getTwoNumber + " = </span>" + resultStatus;
            setTimeout(() => {
                timeStop = false;
                levelRange();
            }, 500);
        } else {
            createAudio('falsee');
            resultStatus = "<img src='img/false1.png' style='width: 9.1%'>";
            wrongNumber++;
            document.querySelector('.wrong-div').innerHTML = wrongNumber;
            questionElement.innerHTML = "<span>" + getFirstNumber + "+" + getTwoNumber + " = </span>" + resultStatus;
        }
    }
}

function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandContentNumber(element, min, max) {
    var oldFirstnumber = getFirstNumber;
    var oldTwoNumber = getTwoNumber;

    var getFirstNumberArray = [];
    var getTwoNumberArray = [];

    for (let index = 0; index < 5; index++) {
        let numberFirst = generateRandomIntegerInRange(min, max);
        if (getFirstNumberArray.includes(numberFirst)) {
            numberFirst += 1;
        }
        getFirstNumberArray.push(numberFirst);
    }

    for (let index = 0; index < 5; index++) {
        let numberTwo = generateRandomIntegerInRange(min, max);
        if (getTwoNumberArray.includes(numberTwo)) {
            numberTwo += 1;
        }
        getTwoNumberArray.push(numberTwo);
    }

    getFirstNumber = getFirstNumberArray[Math.floor(Math.random() * getFirstNumberArray.length)];
    getTwoNumber = getTwoNumberArray[Math.floor(Math.random() * getTwoNumberArray.length)];
    let answerNumber = getFirstNumber + getTwoNumber;
    let numberAnswer = [answerNumber];

    for (let index = 0; index < 3; index++) {
        let minlocal = answerNumber - 15;
        if (minlocal < 1) {
            minlocal = 1;
        }
        var getNumber = generateRandomIntegerInRange(minlocal, answerNumber + 4);
        if (getNumber === numberAnswer || numberAnswer.includes(getNumber) || getNumber === 0) {
            getNumber += 1;
        }
        numberAnswer.push(getNumber);
    }
    numberAnswer.sort(function () { return 0.5 - Math.random() });
    document.getElementById("answersbutton").innerHTML = "";
    numberAnswer.forEach(function (e) {
        let button = '<div class="col"><button class="btn-rand-quest" onclick="checkResult(' + e + ')" role="button">' + e + '</button></div>';
        document.getElementById("answersbutton").innerHTML += button;
    });

    if (oldFirstnumber === getFirstNumber || oldTwoNumber === getTwoNumber) {
        levelRange();
        return;
    }

    element.innerHTML = "<span>" + getFirstNumber + "+" + getTwoNumber + " = </span> <img src='img/whatres.png' style='width: 11%;'>";
}

function countUpTimer() {
    if (!timeStop) {
        ++totalSeconds;
        var hour = Math.floor(totalSeconds / 3600);
        var minute = Math.floor((totalSeconds - hour * 3600) / 60);
        var seconds = totalSeconds - (hour * 3600 + minute * 60);
        seconds = seconds < 10 ? "0" + seconds : seconds;
        minute = minute < 10 ? "0" + minute : minute;
        document.getElementById("timeshow").innerHTML = minute + " : " + seconds;
    }
}

function levelRange() {
    if (roundplace === 5) {
        level++;
        roundplace = 1;
        levelElement.innerHTML = level;
        minRandNumber = minRandNumber + 9;
        maxRandNumber = maxRandNumber + 30;
        createAudio("nextlevel");
    }
    getRandContentNumber(questionElement, minRandNumber, maxRandNumber);
}