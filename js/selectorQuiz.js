//GAME CODE
var gameActive = true;
var health = 3;
var score = 0;
var currentTarget;
var heartFlasher1;
var heartFlasher2;
var heartFlasher3;
var hudInterval;
var listElements = [];
var usedElements = [];
//Hud update strings
var beginText;
var correctText;
var wrongText;
var currentTargetText;
var gameOverText;
var finalScoreText;

function selectorQuiz() {
    this.initializeQuestions = function (listElements) {
        updateQuizDisplay(currentTargetText + "<span>" + listElements[currentTarget] + "</span>");
        $('#quizDisplayBox span').removeClass('embiggen');
        $('#quizDisplayBox span').addClass('embiggen');
        updateScoreDisplay();
        staticHud(beginText);
    }
    this.startGame = function () {
        gameActive = true;
        health = 3;
        score = 0;
        listElements = [];
        usedElements = [];
        beginText = "Please make a selection.";
        correctText = "Correct!";
        wrongText = "Wrong!";
        currentTargetText = "Your current target is: ";
        gameOverText = "Game Over!";
        finalScoreText = "Your final score is: ";
        currentGame = gameModes.selector;
        document.getElementById("css").href = "css/selectorStyle.css";
        $("#playAgainBox").click(function () {
            selector.resetGame();
        })
        $('#layerName li').each(function (i, obj) {
            if (i != 0) {
                listElements[i + 1] = $(obj).data("name");
                obj.textContent = "";
                $(obj).css("border", "0px");
            }
        });
        currentTarget = getRandomInt(2, listElements.length);
        $("[id^='heart']").removeClass("heartDie");
        this.initializeQuestions(listElements);
    }
    this.chooseNextTarget = function () {
        for (var i = 2; i < listElements.length; i++) {
            if (usedElements[i] != 1) {
                break;
            }
            if (i == listElements.length - 1) {
                userData.selectorQuizData.complete = true;
                ++userData.selectorQuizData.attempts;
                ++userData.selectorQuizData.wins;
                if (score > userData.selectorQuizData.highScore) {
                    userData.selectorQuizData.highScore = score;
                }
                userData.selectorQuizData.scores[userData.selectorQuizData.scores.length] = score;
                saveUserData();
                endGame();
            }
        }
        if (gameActive) {
            while (true) {
                currentTarget = getRandomInt(2, listElements.length);
                if (!usedElements[currentTarget]) {
                    this.initializeQuestions(listElements);
                    // updateQuizDisplay(currentTargetText + listElements[currentTarget]);
                    break;
                }
            }
        }
    }
    this.beginHeartFlash = function (heartIndex) {
        $('#heart' + heartIndex).addClass("heartDie")
            //$('#heart' + heartIndex).attr("src", "HeartContainer.svg");
    }
    this.endGame = function () {
        gameActive = false;
        clearInterval(hudInterval);
        updateQuizDisplay(gameOverText);
        staticHud(finalScoreText + score);
        $('#playAgainBox').css("visibility", "visible");
        $('#playAgainBox').css("pointer-events", "all");
    }
    var endGame = function () {
        gameActive = false;
        clearInterval(hudInterval);
        updateQuizDisplay(gameOverText);
        staticHud(finalScoreText + score);
        $('#playAgainBox').css("visibility", "visible");
        $('#playAgainBox').css("pointer-events", "all");
    }
    this.changeGame = function () {
        gameActive = false;
        health = 3;
        score = 0;
        currentTarget = null;
        usedElements = [];
        $("#playAgainBox").css("visibility", "hidden");
        $('#layerName li').each(function (i, obj) {
            if (i != 0) {
                obj.textContent = listElements[i + 1];
            }
        });
        listElements = [];
    }
    this.resetGame = function () {
        console.log("reset");
        this.startGame();
        this.initializeQuestions()
            //  gameActive = true;
            //health = 3;
            //score = 0;
            ///currentTarget = null;
            ///  usedElements = [];
            //        $('#van li').each(function (i, obj) {
            //            if (i != 0) {
            //                obj.textContent = "";
            //            }
            //        });
            //
            //        clearInterval(heartFlasher1);
            //        clearInterval(heartFlasher2);
            //        clearInterval(heartFlasher3);
            //        
            //        $("#playAgainBox").css("visibility", "hidden");
            //        $('#playAgainBox').css("pointer-events", "none");
            //        $("#heart1").attr("src", "Heart.svg");
            //        $("#heart2").attr("src", "Heart.svg");
            //        $("#heart3").attr("src", "Heart.svg");
            //
            //        currentTarget = getRandomInt(2, listElements.length);
            //        updateQuizDisplay(currentTargetText + listElements[currentTarget]);
            //        updateScoreDisplay();
            //        staticHud(beginText);
    }
    var updateQuizDisplay = function (string) {
        $('#quizDisplay').html(string);
    }
    var updateScoreDisplay = function () {
        $('#scoreDisplay').html("Score: " + score);
    }
    this.updateScoreDisplay = function () {
            $('#scoreDisplay').html("Score: " + score);
        }
        //Sends a message to be displayed on the hud, goes away after two seconds
    this.updateHud = function (inputString) {
            clearInterval(hudInterval);
            var i = 0;
            var displayString = "";
            var waitTime = 20;
            var passTime = 10;
            hudInterval = setInterval(function () {
                if (waitTime === 20) {
                    displayString += inputString.charAt(0);
                    $('#hud').html(displayString);
                    inputString = inputString.substr(1, inputString.length);
                }
                if (inputString == "") {
                    --waitTime;
                }
                if (waitTime <= 0) {
                    displayString = displayString.substr(0, displayString.length - 1);
                    $('#hud').html(displayString);
                    if (displayString == "") {
                        if (passTime <= 0) {
                            staticHud(beginText);
                        }
                        --passTime;
                    }
                }
            }, 1000 / 15);
        }
        //Sends a message to be displayed on the hud, stays until another message is sent
    var staticHud = function (inputString) {
        clearInterval(hudInterval);
        var i = 0;
        var displayString = "";
        var waitTime = 20;
        hudInterval = setInterval(function () {
            if (waitTime === 20) {
                displayString += inputString.charAt(0);
                $('#hud').html(displayString);
                inputString = inputString.substr(1, inputString.length);
            }
            if (inputString == "") {
                clearInterval(hudInterval);
            }
        }, 1000 / 15);
    }
    var why;
    var randomColor = function (x) {
        why = setInterval(function () {
            $("#stage").css("background-color", "#" + getRandomInt(0, 16777215).toString(16));
        }, 1000 / 60);
    }
    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}