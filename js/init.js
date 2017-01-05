//var currentGame;
var typing;
var selector;
var gameModes = new function () {
    this.typing = 1;
    this.selector = 2;
    this.indexCards = 3;
}
var userData = new Object();

userDataSetup();

function userDataSetup() {
    userData.logons = 0;
    userData.typingQuizData = new Object();
    userData.typingQuizData.complete = false;
    userData.typingQuizData.attempts = 0;
    userData.typingQuizData.wins = 0;
    userData.typingQuizData.losses = 0;
    userData.typingQuizData.highScore = 0;
    userData.typingQuizData.scores = new Array();
    userData.typingQuizData.missCount = new Array();
    userData.selectorQuizData = new Object();
    userData.selectorQuizData.complete = false;
    userData.selectorQuizData.attempts = 0;
    userData.selectorQuizData.wins = 0;
    userData.selectorQuizData.losses = 0;
    userData.selectorQuizData.highScore = 0;
    userData.selectorQuizData.scores = new Array();
    userData.selectorQuizData.missCount = new Array();
}

$(function () {
    loadUserData();
    $('#nav').load("map.html", function () {
            $.getJSON("simple.json", loadNavData);
        })
        // Font resize
    $("body").css("visibility", "hidden");
    $("#background, #picture").css("visibility", "hidden");
    $("#playAgainBox").mouseenter(function () {
        $("#playAgainBox").css("background-color", "#4e2a7f");
    });
    $("#playAgainBox").mouseleave(function () {
        $("#playAgainBox").css("background-color", "#3a3a3a");
    });
    //  window.addEventListener("mousedown", mouseDown);
    window.addEventListener("keypress", keyDown);
    typing = new typingQuiz();
    selector = new selectorQuiz();
    indexCards = new indexCards();
    indexCards.startGame();
 
    $("body").css("visibility", "visible");
    $("#background, #picture").css("visibility", "visible");
});

function loadNavData(data) {
    var layerName = $("#layerName")
    var navRoot = $("#nav");
    data.layers.forEach(function (item, index) {
        console.log(item)
        var Objli = $('<li></li>');
        Objli.text(item.lname)
        Objli.attr("id", item.id)
        Objli.attr("data-name", item.lname)
        Objli.attr("class", item.id)
        layerName.append(Objli)
    })
    $("#background, #picture").css("width", data.width + "%")
    $("#background, #picture").css("height", data.width + "%")
    var sections = layerName.children().length;
    //console.log(sections)
    var size = Math.floor(256 / sections);
    for (var i = 1; i <= sections; i++) {
        $("#" + i).addClass("fs-" + size);
    }
    for (var i = 2; i <= sections; i++) {
        $("." + i + ", #" + i).hover(highlight, hoverOut);
        $("." + i + ", #" + i).mousedown(mouseDown);
    }
    var img = $("#background"); // Get my img elem
    var pic_real_width, pic_real_height;
    $("<img/>") // Make in memory copy of image to avoid css issues
        .attr("src", $(img).attr("src")).load(function () {
            pic_real_width = this.width; // Note: $(this).width() will not
            pic_real_height = this.height; // work for in memory images.
            var aspect = pic_real_width / pic_real_height;
            var scaleHeight = 100 / aspect;
            $("#background, #picture, #nav, #dragHome").css("width", "100%")
            $("#background, #picture, #nav, #dragHome").css("height", scaleHeight + "%")
        });
    //makeDND()
       resizeWindow();
}

function makeDND() {
    $('#imagemap').prepend("<div id='dragHome'></div>");
    var layerCount = $('#layerName').children().length;
    loop = 1;
    $("<img/>") // Make in memory copy of image to avoid css issues
        .attr("src", $("#background").attr("src")).load(function () {
            var pic_real_width = this.width;
            var pic_real_height = this.height;
            while (layerCount - loop++) {
                $('.' + loop).unbind("hover");
                dragItem = "<img id='drag-" + loop + "' src='drag-layer-" + loop + ".png'/>";
                $('#dragHome').append(dragItem)
                $("<img/>") // Make in memory copy of image to avoid css issues
                    .attr("src", $("#drag-" + loop).attr("src")).load(function () {
                        var item = $(this).attr("src").split("-")[2].split(".")[0]
                        var percentHeight = this.height / pic_real_height * 100;
                        var percentWidth = this.width / pic_real_width * 100;
                        $("#drag-" + item).css("width", percentWidth + "%")
                        $("#drag-" + item).css("height", percentHeight + "%")
                        $("#drag-" + item).css("float", "left")
                        $("#drag-" + item).css("position", "relative")
                    })
                console.log($("#drag-" + loop).width(), pic_real_width)
            }
            $('#dragHome').children().draggable({
                stack: "img"
                , revert: true
            });
        })
    $('.map').droppable({
        drop: function (event, ui) {
            var dropped = $(event.target).attr("href")
            var dragged = ui.draggable.attr('id').split("-")[1]
            console.log(dragged, dropped)
            if (dragged == dropped && !$("#drop-" + dropped).length) {
                $("#drag-" + dragged).remove();
                dragItem = "<img id='drop-" + dropped + "' src='layer-" + dropped + ".png'/>";
                $('#imagemap').append(dragItem)
                $("#drop-" + dropped).attr("style", $('#background').attr("style"))
                $("#drop-" + dropped).css("position", "absolute")
                $("#drop-" + dropped).css("z-index", 100 + dropped);
            }
            console.log($(event.target).attr("href"), ui.draggable.attr('id'))
        }
    });
    $('#layerName').html("")
}

function mouseDown() {
    if (currentGame == gameModes.typing) {
        if (gameActive && !selectorLock) {
            if (currentSelection != 1) {
                if (usedElements[currentSelection] == null) {
                    typing.beginIRCQuiz(currentSelection, listElements[currentSelection]);
                    usedElements[currentSelection] = 1;
                    setTimeout(function () {
                        $("#textInput").get(0).focus();
                    }, 1);
                }
            }
        }
    }
    else if (currentGame == gameModes.selector) {
        if (gameActive) {
            if (currentSelection != 1) {
                if (listElements[currentSelection] == listElements[currentTarget]) {
                    selector.updateHud(correctText);
                    ++score;
                    document.getElementById(currentSelection).textContent = listElements[currentSelection];
                    usedElements[currentTarget] = 1;
                    selector.chooseNextTarget();
                    selector.updateScoreDisplay();
                }
                else {
                    selector.updateHud(wrongText);
                    selector.beginHeartFlash(health);
                    --health;
                    console.log(userData.selectorQuizData)
                    if (!userData.selectorQuizData.missCount) {
                        userData.selectorQuizData.missCount = [];
                        userData.selectorQuizData.missCount[currentTarget] = 1;
                    }
                    else {
                        userData.selectorQuizData.missCount[currentTarget] = ++userData.selectorQuizData.missCount[currentTarget];
                    }
                }
                if (health <= 0) {
                    ++userData.selectorQuizData.attempts;
                    ++userData.selectorQuizData.losses;
                    if (score > userData.selectorQuizData.highScore) {
                        userData.selectorQuizData.highScore = score;
                    }
                    userData.selectorQuizData.scores[userData.selectorQuizData.scores.length] = score;
                    saveUserData();
                    selector.endGame();
                }
            }
        }
    }
}

function keyDown(event) {
    if (currentGame == gameModes.typing) {
        if (selectorLock && gameActive && event.keyCode === 13) {
            if (typing.checkInput($("#textInput").val(), quizTarget)) {
                clearInterval(quizInterval);
                clearInterval(scoreInterval);
                typing.updateHud(earnedScoreText1 + typing.calculatePossibleScore() + earnedScoreText2);
                typing.calculateScore();
                typing.updateScoreDisplay();
                document.getElementById(targetIndex).textContent = quizTarget;
                typing.checkAvailableChoices();
                selectorLock = false;
            }
            else {
                typing.updateHud(wrongText);
                typing.takeDamage();
                if (!userData.selectorQuizData.missCount) {
                    userData.selectorQuizData.missCount = [];
                    userData.selectorQuizData.missCount[currentTarget] = 1;
                }
                else {
                    userData.selectorQuizData.missCount[currentTarget] = ++userData.selectorQuizData.missCount[currentTarget];
                }
            }
            $("#textInput").val("");
        }
    }
}

function startIndexCardMode() {
    if (currentGame == gameModes.typing) {
        typing.changeGame();
        indexCards.startGame();
    }
    else if (currentGame == gameModes.selector) {
        selector.changeGame();
        indexCards.startGame();
    }
}

function startTypingGame() {
    if (currentGame == gameModes.selector) {
        selector.changeGame();
        typing.startGame();
    }
    else if (currentGame == gameModes.indexCards) {
        indexCards.changeGame();
        typing.startGame();
    }
}

function startSelectorGame() {
    if (currentGame == gameModes.typing) {
        typing.changeGame();
        selector.startGame();
    }
    else if (currentGame == gameModes.indexCards) {
        indexCards.changeGame();
        selector.startGame();
    }
}

function hover(i) {
    currentSelection = i;
}

function ignoreEvents(e) {
    return false;
};
window.onclick = ignoreEvents;
var currentSelection = "1";
var layerNameRoot; //= document.getElementById("layerName");
var navRoot; //= document.getElementById("nav");
function hoverOut(event) {
    backcol = "#3a3a3a";
    $("#" + currentSelection).css({
        "background-color": backcol
    })
    picname = "layer-1.png";
    var picEl = document.getElementById("picture")
    picEl.src = picname;
    //    currentSelection=$(event.target).attr("class").split(" ")[0];
    //    var picEl = document.getElementById("picture")
    //    if(currentSelection != event.target){
    //      
    //        backcol = "#3a3a3a";
    //        $("#" + currentSelection).css({"background-color":backcol})
    //    }
}

function highlight(event) {
    currentSelection = $(event.target).attr("class").split(" ")[0];
    var picEl = document.getElementById("picture")
        //    for (j = 2; j < layerNameRoot.childNodes.length + 1; j++) {
        //        if (j == currentSelection) {
    picname = "layer-" + currentSelection + ".png";
    picEl.src = picname;
    //            //picEl.style.left=offsetLeft[currentSelection]
    //            //picEl.style.top=offsetTop[currentSelection]
    backcol = "#4e2a7f";
    $("#" + currentSelection).css({
        "background-color": backcol
    })
}

function deselect() {
    currentSelection = 1;
}

function loadUserData() {
    $.ajax({
        method: "GET"
        , url: "ingest.php"
        , dataType: "json"
    }).done(function (data) {
        userData = data;
        if (data == "0") {
            userData = new Object();
            userDataSetup();
        }
        ++userData.logons;
        saveUserData();
    });
}

function saveUserData() {
    $.ajax({
        method: "POST"
        , type: "POST"
        , url: "ingest.php"
        , data: JSON.stringify(userData)
        , dataType: "json"
    }).done(function (msg) {
        console.log(msg);
    });
}

