//Click destory typing game

var Simple = {
    layerInfo: {}, 
    health: 3,
    
    layerIndex:0,
    layersLeft:[],
    choiceLayer:{},
    
    init: function () {
        $('#nav').load("map.html", function () {
        $.getJSON("simple.json", Simple.loadSimple);
        $("#healthDisplayBox").css({visibility: "hidden"})
        $("#heart1, #heart2, #heart3").css({visibility: "hidden"})
        $("#guessBox").css({visibility: "hidden"})
    })   
    }, 
    
    gameInit:function(){
        
    Simple.health = 3;    
    Simple.layersLeft = Simple.layerInfo.layers.slice(1)
    Simple.refreshLayerNames();
    $("#heart1, #heart2, #heart3").removeClass("heartDie")
    $("#displayCorrect img").css({display:"none"});
    $("#layerName li").css({display: "none"})
    $("#healthDisplayBox").css({visibility: "visible"})
    $("#heart1, #heart2, #heart3").css({visibility: "visible"})  
    
    },
    
    refreshLayerNames:function(){
        console.log("refresh",Simple.layerInfo.layers)
     Simple.layerInfo.layers.forEach(function (item, index) {
          console.log(item.id,item.lname)
          $("#"+item.id).html(item.lname);
          
          
      })   
        
        
        
    },
    
    populateLayerDivs: function (info) {
        $(info.layers).each(function (index, item) {
            var Objli = $('<li></li>');
            Objli.text(item.lname)
            Objli.attr("id", item.id)
            Objli.attr("data-name", item.lname)
            Objli.attr("class", item.id)
            
            
            var layerImage = $('<img></img>');
            layerImage.attr("src", "layer-"+item.id+".png")
            layerImage.attr("id", "image-"+item.id)
            layerImage.attr("data-name", item.lname)
            layerImage.attr("class", item.id)

            
            if(index==0){
                Objli.appendTo("#headerName") 
                layerImage.appendTo("#background")
            }
            else{
            Objli.appendTo("#layerName")
               layerImage.appendTo("#displayCorrect")
            
            }
            })
    }, 
    
    loadSimple: function (data) {
        Simple.populateLayerDivs(data);
        Simple.makeHoverEvents(data.layers.length)
        Simple.gameSelectorButtons();
        $("#background img,#picture, #nav, #dragHome,#displayCorrect img").css({"width":  data.width+"%","height":data.height+"%"} )
        
        Simple.layerInfo = data;
        IndexGame.init();
    },
    
    gameSelectorButtons: function () {
        $("#buttonBox").children().each(function(index,value){
            
       $(value).click(function(evt){
           switch(evt.target.id) {
               case "indexCardButton":
                   IndexGame.init();
                   break;
               case "typingGameButton":
                   TypingGame.init();
                   break;
               case "selectorGameButton":
                   SelectorGame.init();
                   break;
           }
      });

        })
    }, 
    
    makeHoverEvents: function (numberOfLayers) {
        var size = Math.floor(256 / numberOfLayers);
        for (var i = 1; i <= numberOfLayers; i++) {
            if(i > 1) {
                $("." + i + ", #" + i).hover(Simple.handlerHover, Simple.handlerHover);
            }
            $("#" + i).addClass("fs-" + size);
            // $("." + i + ", #" + i).mousedown(mouseDown);
        }
    }, 
    
    handlerHover: function (event) {
         var hoverData = {
             "mouseenter": { "bgcolor": "#4e2a7f"},
             "mouseleave": { "bgcolor": "#3a3a3a"}
        }
        
        var currentSelection = $(event.target).attr("class").split(" ")[0];
         var picEl = $("#picture")
        var picNum= currentSelection;
          picname = "layer-" + picNum+ ".png";
        if(event.type!="mouseenter")
            {
          picname = "1px.png";
            }

        picEl.attr("src", picname);
        $("#" + currentSelection ).css({
            "background-color": hoverData[event.type].bgcolor
        })
    },
    
    setMessage: function (message,isTemp) {
        if(isTemp)
            {
            $("#tempMessage").remove();
             var tempDiv= $('<div>'+message+'</div>');
             tempDiv.attr("id", "tempMessage")   
            $("#message").append(tempDiv);
            $("#permMessage").css("visibility", "hidden");
            Simple.clickBlocker.create();
                
            $("#tempMessage").stop().fadeTo( 2000 , 0, function() {
                Simple.clickBlocker.destory();
                $("#permMessage").css("visibility", "visible");
            })
            }
            else{
            $("#permMessage").stop().fadeTo( 5 , 0, function() {
        $("#permMessage").html(message);
        $( "#permMessage" ).stop().fadeTo( 5 , 1, function() {
    // Animation complete.
  }); 
  });
            }
    },
    
    wonGame: function() {
        Simple.overlay.create("You Won!");
        Simple.destory();
        IndexGame.init();
        return;
    },
    
    lostGame: function() {
        Simple.overlay.create("You Lost!");
        Simple.destory();
        IndexGame.init();
        return;
    },
    
    damage: function(heartIndex) {
        $('#heart' + heartIndex).addClass("heartDie")
        Simple.health--;
    },
    
    pickLayer: function(isCorrect) {
        if(Simple.layersLeft.length == 0) {
            Simple.wonGame();
            return false;
        }
        if(isCorrect){
            Simple.layerIndex = Math.floor(Math.random() * Simple.layersLeft.length)
        }
        Simple.choiceLayer = Simple.layersLeft[Simple.layerIndex];
        var isTemp=false;
        return true;
    },
    
    overlay: {
        create: function(text) {
            var layerOverlay = $('<div></div>');
            $("#stage").append(layerOverlay)
            
            layerOverlay.attr("id", "overlay")
            layerOverlay.attr("class", "overlay")
            
            layerOverlay.load("overlay.htm", function(){
                 $("#overlayText").text(text);
                 $('#overlayButton').click(function() {
                     Simple.overlay.destroy();   
                     Simple.destory();
                 }
                 )
            })
        },
        
        destroy: function() {
            $("#overlay").remove();
        }
    },
    
    clickBlocker: {
        create: function() {
            var blocker = $('<div></div>');
            $("#stage").append(blocker);
            blocker.attr("id", "blocker");
        },
        
        destory: function() {
            $("#blocker").remove();
        }

    },
    
    destory: function() {
        SelectorGame.destory();
        TypingGame.destory();
    }
}


var SelectorGame = {

    init: function(){
    Simple.destory();
    Simple.gameInit();
    SelectorGame.pickLayer(true);
    $(".map").unbind("click").click(function(evt){SelectorGame.clickedItem(evt)})

    
    },
    
    clickedItem: function(evt){
        var isCorrect = true;
        
        var layerPicked = $(evt.target).attr("class").split(" ")[0];
        
        var isTemp=true;
        
        if (layerPicked == Simple.choiceLayer.id) {
            Simple.setMessage("Correct!",isTemp)
            $("#image-" + Simple.choiceLayer.id).css({display: "block"})
            $("#" + Simple.choiceLayer.id).css({display: "block"})
            $("#tempMessage").css("background-color", "green")
            
            Simple.layersLeft.splice(Simple.layerIndex, 1)
            
        } else { 
            Simple.setMessage("Please try again", isTemp)
            $("#tempMessage").css("background-color", "red")
            isCorrect = false;
            Simple.damage(Simple.health, Simple.layerIndex)
            
            if(Simple.health == 0) {
                Simple.lostGame();
                return;
            }
        }
    SelectorGame.pickLayer(isCorrect)
    },
    
    
    destory: function() {
        $("#displayCorrect img").css({display:"none"});
        $(".map").unbind("click");
    },
    
    pickLayer: function(isCorrect) {
        var isTemp=false;
        if(Simple.pickLayer(isCorrect)) Simple.setMessage("Please select: <span class='blink'>" + Simple.choiceLayer.lname+"</span>",isTemp )
    }
}

var TypingGame = {
    lettersShown:[],
    lastTime:0,
    answerString: "",
    delaySecs:2,
    questionStartTime:0,
    animationFramID:0,
    
    init: function() {
        Simple.destory();
        Simple.gameInit();
        $("#guessBox").css({visibility: "visible"})
        TypingGame.pickLayer(true);
     
        // Make a array [1...n] shufflle it
        
        
        $("#userInput").focus();
        $("#userInput").on('blur',function(){ 
        
        
        $("#userInput").focus();
        })
        TypingGame.pickLetter();
        $("#userInput").unbind("keydown").keydown(function(evt){TypingGame.typedLetter(evt)})
        },
    
    
    pickLayer: function(isCorrect) {
        TypingGame.guessMessageDisplay.destroy();
        $("#userInput").val("")
        TypingGame.lastTime=0; 
        var isTemp = false;
        TypingGame.questionStartTime = new Date().getTime();
        window.cancelAnimationFrame(TypingGame.animationFramID);
        
        if(Simple.pickLayer(isCorrect)) {
            Simple.setMessage("What is the highlighted layer on the right?", isTemp)
        }
        $("#" + Simple.choiceLayer.id).css({display: "block"})
        $("#" + Simple.choiceLayer.id).text("")
        TypingGame.lettersShown = TypingGame.shuffle(Array.from(Array(Simple.choiceLayer.lname.length).keys()))
        TypingGame.answerString = Simple.choiceLayer.lname.replace(/[^ ]/g,"*").split('')
        TypingGame.pickLetter();
    },
    
    highlightPicture: function() {
          $("#image-" + Simple.choiceLayer.id).css({display: "block"}) 
    },
    
    guessMessageDisplay: {
        showMessage: function(message){
            $("#" + Simple.choiceLayer.id).text(message);  
        },
        
        destroy: function() {
            window.cancelAnimationFrame(TypingGame.animationFramID);
        }
    },
    
    typedLetter: function(evt){
        var isTemp=true;
        var inputText = document.getElementById("userInput").value.toLowerCase();
        var lastIndex = inputText.length-1
        
        if(inputText[lastIndex] == Simple.choiceLayer.lname.split('')[lastIndex]) {
            TypingGame.answerString[lastIndex] = inputText[lastIndex]
            $("#" + Simple.choiceLayer.id).text(TypingGame.answerString.join(""));
        }
              
        if (inputText == Simple.choiceLayer.lname) {

            Simple.setMessage("Correct!", isTemp)
           // $("#" + Simple.choiceLayer.id).css({display: "block"})
            $("#tempMessage").css("background-color", "green")
            
            $("#image-" + Simple.choiceLayer.id).css({display: "none"}) 
            Simple.layersLeft.splice(Simple.layerIndex, 1)
            
            TypingGame.pickLayer(true);
        }      
    },
    
    

    pickLetter: function() {
        var currTime = new Date().getTime();
        
        if (currTime >= TypingGame.lastTime + TypingGame.delaySecs*1000)  {
            var shufflePick= TypingGame.lettersShown[0];
            TypingGame.answerString[shufflePick] = Simple.choiceLayer.lname[shufflePick];
            TypingGame.lettersShown.shift();
            TypingGame.lastTime = currTime;
            TypingGame.highlightPicture();
            TypingGame.guessMessageDisplay.showMessage(TypingGame.answerString.join(""));
            
        }     // one second has passed, run some code here
        
        if (TypingGame.lettersShown.length == 0) {
            Simple.damage(Simple.health, Simple.layerIndex);
            if(Simple.health == 0) {
                Simple.lostGame();
                return;
            }
            // Pick a new object
            $("#image-" + Simple.choiceLayer.id).css({display: "none"}) 
            TypingGame.pickLayer(true);
        } else {    
            window.cancelAnimationFrame(TypingGame.animationFramID);
            
             TypingGame.animationFramID = window.requestAnimationFrame(TypingGame.pickLetter);
        }
    },
    

    
    destory: function() {
        TypingGame.guessMessageDisplay.destroy();
        $(".map").unbind("click");
     
        $("#guessBox").css({visibility: "hidden"})
    },
    
    shuffle: function (array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}
}

var IndexGame = {
 init: function(){
    Simple.destory();
    Simple.gameInit();
    var indexMessage = "Hover over a piece of the image to highlight the name on the left";
    $("#layerName li").css({display: "block"})
    $("#healthDisplayBox").css({visibility: "hidden"})
    $("#heart1, #heart2, #heart3").css({visibility: "hidden"})
    var isTemp=false;
    Simple.setMessage(indexMessage,isTemp);
     
}                                         
}


$(function () { 
   Simple.init();
   resizeWindow();
})

