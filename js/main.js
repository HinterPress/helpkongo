let level = 1;
let roundplace = 1;

let successNumber = 0;
let wrongNumber = 0;

let getFirstNumber = 0;
let getTwoNumber = 0;

let minRandNumber = 1;
let maxRandNumber = 10;

let questionTime = [];
let questionProblem = [];
let userInfo = [];
let contentQuestion = "";
let answerNumber = 0;

var timerVariable = setInterval(countUpTimer, 1000);
var timeStop = false;
var totalSeconds = 0;

const questionElement = document.getElementById("question");
const levelElement = document.getElementById("level");
const resultBtn = document.getElementById("resultbtn");

levelElement.innerHTML = level;

resultBtn.addEventListener("click", () => {
    checkResult(-3);
});

document.getElementById("resultinput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        resultBtn.click();
    }
});

document.getElementById("lastnameChoose").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        start('questions');
    }
});

function createAudio(status) {
    const getAudioContent = document.querySelector('.audio');
    getAudioContent.innerHTML = '<audio controls autoplay><source src="music/' + status + '.mp3" type="audio/mpeg"></audio>';
}

getRandContentNumber(questionElement, 2, 10);

function checkResult(number) {
    let resultStatus = "";

    var numberInput = false;
    if (number === -3) {
        var getInputResult = document.getElementById("resultinput");
        number = parseInt(getInputResult.value);
        numberInput = true;
    }
    const questionString = contentQuestion;
    if (!timeStop) {
        if (answerNumber === number) {
            if (numberInput) {
                getInputResult.readOnly = true;
            }
            createAudio('true');
            // resultStatus = "<img data-img='true' src='img/true.png'>";
            resultStatus = "img/true.png";
            questionTime.push({ "question": questionString, 'time': document.getElementById("timeshow").innerHTML });
            roundplace++;
            timeStop = true;
            if (!userInfo['questions']) {
                userInfo['questions'] = 1;
            }
            if (!userInfo['time']) {
                userInfo['time'] = 0;
            }
            userInfo['time'] = userInfo['time'] += totalSeconds;
            totalSeconds = 0;
            successNumber++;
            userInfo['questions'] = userInfo['questions'] += 1;
            document.querySelector('.success-div').innerHTML = successNumber;
            questionElement.querySelector("img").src = resultStatus;

            setTimeout(() => {
                timeStop = false;
                levelRange();
                if (numberInput) {
                    getInputResult.readOnly = false;
                    getInputResult.value = '';
                }
            }, 500);
        } else {
            if (numberInput) {
                if (getInputResult.value.length === 0) {
                    return;
                }
                getInputResult.value = '';
            }
            createAudio('falsee');
            // resultStatus = "<img data-img='false' src='img/false1.png' >";
            resultStatus = "img/false1.png";
            questionElement.querySelector("img").src = resultStatus;

            wrongNumber++;
            questionProblem.push({ "question": questionString });
            document.querySelector('.wrong-div').innerHTML = wrongNumber;
        }
    }
}

function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function start(page) {
    const getChooseTypeMain = document.getElementById("choose-type-main");
    const getChooseTypeName = document.getElementById("choose-type-name");
    const getChooseResult = document.getElementById("choose-result");
    const questionContent = document.getElementById("questions");
    const ratingContent = document.getElementById("result-table");
    const name = document.getElementById("nameChoose");
    const lastname = document.getElementById("lastnameChoose");
    if (page == 'choose') {
        getChooseTypeMain.classList.remove('d-flex');
        getChooseTypeMain.style.display = 'none';
        getChooseTypeName.classList.add('d-flex');
        getChooseTypeName.style.removeProperty = 'display';
    } else if (page == 'questions') {
        if (name.value.length < 3) {
            name.style.setProperty('border-color', '#ff0909', 'important');
            return;
        } else {
            name.style.setProperty('border-color', '#000', 'important');
        }
        if (lastname.value.length < 3) {
            lastname.style.setProperty('border-color', '#ff0909', 'important');
            return;
        } else {
            lastname.style.setProperty('border-color', '#000', 'important');
        }
        userInfo["name"] = name.value;
        userInfo["lastname"] = lastname.value;
        getChooseTypeName.classList.remove('d-flex');
        getChooseTypeName.style.display = 'none';
        questionContent.style.display = 'block';
        totalSeconds = 0;
    } else if (page == 'rating') {
        getChooseTypeMain.classList.remove('d-flex');
        getChooseTypeMain.style.display = 'none';
        ratingContent.style.display = 'inline-block';
        getData();
    } else if (page == 'result') {
        if (!userInfo['time']) {
            userInfo['time'] = 0;
        }
        userInfo['time'] = userInfo['time'] += totalSeconds;
        questionContent.style.display = 'none';
        getChooseResult.style.display = 'block';
        userInfo['wrong'] = wrongNumber;
        userInfo['success'] = successNumber;

        document.getElementById("resultlevel").innerHTML = level;
        // document.getElementById("countanswer").innerHTML = userInfo['questions'] - 1;
        document.getElementById("resulttrue").innerHTML = userInfo['success'];
        document.getElementById("resultfalse").innerHTML = userInfo['wrong'];
        const secondsToMinutes = Math.floor(userInfo['time'] / 60) + ':' + ('0' + Math.floor(userInfo['time'] % 60)).slice(-2);
        document.getElementById("resulttime").innerHTML = secondsToMinutes;

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "api.php", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = this.responseText;
            }
        };
        var data = {
            user: '1',
            name: userInfo['name'],
            lastname: userInfo['lastname'],
            level: level,
            questions: userInfo['questions'],
            success: userInfo['success'],
            wrong: userInfo['wrong'],
            time: secondsToMinutes,
            errorList: questionProblem
        };
        xhttp.send(JSON.stringify(data));
    }
}

function getRandContentNumber(element, min, max) {
    let oldFirstnumber = getFirstNumber;
    let oldTwoNumber = getTwoNumber;

    let getFirstNumberArray = [];
    let getTwoNumberArray = [];
    let contentQuestion = "";
    let actionArray = ['-', '+'];

    let ActionReturn = actionArray[Math.floor(Math.random() * actionArray.length)];

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

    if (ActionReturn == '-') {
        if (getFirstNumber > getTwoNumber) {
            answerNumber = getFirstNumber - getTwoNumber;
        } else {
            answerNumber = getTwoNumber - getFirstNumber;
        }
    } else if (ActionReturn == '+') {
        answerNumber = getFirstNumber + getTwoNumber;
    }

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

    if (ActionReturn == '+') {
        contentQuestion = getFirstNumber + "+" + getTwoNumber;
    } else if (ActionReturn == '-') {
        if (getFirstNumber > getTwoNumber) {
            contentQuestion = getFirstNumber + "-" + getTwoNumber;
        } else {
            contentQuestion = getTwoNumber + "-" + getFirstNumber;
        }
    }
    element.innerHTML = "<span>" + contentQuestion + " = </span> <img data-img='native' src='img/whatres.png' >";
}

function countUpTimer() {
    if (!timeStop) {
        ++totalSeconds;
        let hour = Math.floor(totalSeconds / 3600);
        let minute = Math.floor((totalSeconds - hour * 3600) / 60);
        let seconds = totalSeconds - (hour * 3600 + minute * 60);

        seconds = seconds < 10 ? "0" + seconds : seconds;
        minute = minute < 10 ? "0" + minute : minute;
        document.getElementById("timeshow").innerHTML = minute + " : " + seconds;
    }
}

function onlyNumberKey(evt) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
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

function getData() {
    const getTableContentHead = document.getElementById("result-table");
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            getTableContentHead.innerHTML = '<table class="table table-striped"><thead><tr><th>სახელი/გვარი</th><th>დონე</th><th>სწორი</th><th>არასწორი</th><th>დრო</th> </tr> </thead> <tbody></tbody></table>';
            const bodyTable = getTableContentHead.querySelector("tbody");
            let data = JSON.parse(this.responseText);
            data.data.forEach(function (e) {
                bodyTable.innerHTML += '<tr><td>' + e.name + ' ' + e.lastname + '</td><td>' + e.level + '</td><td>' + e.answtrue + '</td><td>' + e.answfalse + '</td><td>' + e.time + '</td></tr>';
            });
        }
    };
    request.open('GET', 'api.php?getRating');
    request.send();
}