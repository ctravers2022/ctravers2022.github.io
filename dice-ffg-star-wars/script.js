var w = window.innerWidth;
var h = window.innerHeight;
document.getElementById("winWidth").innerHTML = window.innerWidth;
document.getElementById("winHieght").innerHTML = window.innerHeight;

var theParent = document.querySelector("#select-dice");
theParent.addEventListener("click", addDice, false);

function addDice(element){
	if(element.target !== element.currentTarget) {
		var clickedItem = element.target;
		switch(clickedItem.getAttribute('type')){
			case 'radio':
				dice.update();
				break;
			case 'button':
				var symbolType = clickedItem.getAttribute('name');
				dice.addSymbol(symbolType);
				break;
		};
	}
	element.stopPropagation();
}

var symbols = {
		blank:"-",
		success:"s",
		advantage:"a",
		triumph:"x",
		threat:"t",
		failure:"f",
		despair:"y",
		lightPip:"Z",
		darkPip:"z"
	};

var dice = {
	types: {
       ability: {
         value:"positive",
         adjacent: 3,
          sides: [
			symbols.blank,
			symbols.success,
			symbols.success,
			symbols.success + symbols.success,
			symbols.advantage,
			symbols.advantage,
			symbols.success + symbols.advantage,
			symbols.advantage + symbols.advantage
		  ]
       },
       proficiency: {
         value:"positive",
         adjacent: 5,
          sides: [
			symbols.blank,
			symbols.success,
			symbols.success,
			symbols.success + symbols.success,
			symbols.success + symbols.success,
			symbols.advantage,
			symbols.success + symbols.advantage,
			symbols.success + symbols.advantage,
			symbols.success + symbols.advantage,
			symbols.advantage + symbols.advantage,
			symbols.advantage + symbols.advantage,
			symbols.triumph
		  ]
       },
       boost: {
         value: "positive",
         adjacent: 4,
          sides: [
			symbols.advantage,
			symbols.advantage,
			symbols.success,
			symbols.success + symbols.advantage,
			symbols.advantage + symbols.advantage,
			symbols.advantage
		  ]
       },
       difficulty: {
         value:"negative",
         adjacent: 3,
          sides: [
			symbols.blank,
			symbols.failure,
			symbols.failure + symbols.failure,
			symbols.threat,
			symbols.threat,
			symbols.threat,
			symbols.threat + symbols.threat,
			symbols.failure + symbols.threat
		  ]
       },
       challenge: {
         value:"negative",
         adjacent:5,
          sides: [
			symbols.blank,
			symbols.failure,
			symbols.failure,
			symbols.failure + symbols.failure,
      symbols.failure + symbols.failure,
			symbols.threat,
			symbols.threat,
			symbols.failure + symbols.threat,
			symbols.failure + symbols.threat,
			symbols.threat + symbols.threat,
			symbols.threat + symbols.threat,
			symbols.despair
		  ],
       },
       setback: {
         value: "negative",
         adjacent:4,
          sides: [
			symbols.blank,
			symbols.blank,
			symbols.failure,
			symbols.failure,
			symbols.threat,
			symbols.threat
		  ],
       },
       force: {
         value:"neutral",
         adjacent:5,
          sides: [
			  symbols.lightPip,
			  symbols.lightPip,
			  symbols.lightPip,
			  symbols.lightPip,
			  symbols.lightPip,
			  symbols.lightPip,
			  symbols.lightPip + symbols.lightPip,
			  symbols.darkPip,
			  symbols.darkPip,
			  symbols.darkPip + symbols.darkPip,
			  symbols.darkPip + symbols.darkPip,
			  symbols.darkPip + symbols.darkPip
		  ]
       }
    },
  clear: function(){
    var diceLabels = document.querySelectorAll('#select-dice input + label');
    for(var i = 0; i < diceLabels.length; i++ ){
      diceLabels[i].classList.remove('active');
    }
    dice.clearDiceWindows(2);
  },
	clearDiceWindows: function(items){
    switch(items){
      case 0:
        document.getElementById("net-results-list").innerHTML = "";
      case 1:
        document.getElementById("assembled-pool").innerHTML = "";
        break;
      case 2:
        document.getElementById("net-results-list").innerHTML = "";
        document.getElementById("assembled-pool").innerHTML = "";
        break;
    };
	},
	update: function(){
  //  debugger;
		dice.clearDiceWindows(1);
		var diceList = document.querySelectorAll('#select-dice input:checked');
		for(var i = 0; i < diceList.length; i++){
			var qty = diceList[i].value;
			var type = diceList[i].getAttribute("name");
			views.activeDice(qty, type);
      dice.add(qty, type);
      
		}
	},	
	add: function(qty, type){
		var pool = document.getElementById("assembled-pool");
		for(var i = 0; i < qty; i++){
			var die = document.createElement('button');
			die.className = type;
			pool.appendChild(die);
		}
	},
	addSymbol: function(symbolType){
		var resultsArea = document.getElementById("net-results");
		var symbol = document.createElement('button');
		symbol.className = symbolType;
		resultsArea.appendChild(symbol);
	},
	randomNumber: function(sides){
		var max = Math.floor(sides) +1;
		var result = Math.floor(Math.random()*(max-1)+1);
		return result;
	},
	roll: function(){
		var diceList = document.querySelectorAll('#select-dice input:checked');
		var resultsArray =[];
		var resultsTextArray = [];
		var resultsTextString = "";
		for(var i = 0; i < diceList.length; i++){
			var qty = diceList[i].value;
			var diceType = diceList[i].getAttribute("name");
			var type = dice.types[diceType];
			var sides = type.sides.length;
			for(var q = 0; q < qty; q++){
				var result = dice.randomNumber(sides);
				resultsArray.push(result);
				var side = result-1;
				var symbol = type.sides[side];
				resultsTextArray.push(symbol);
				resultsTextString += symbol;
			}
		}
		var dicePoolButtons = document.querySelectorAll("#assembled-pool button");
    views.randomizeAppearance(10, dicePoolButtons,resultsTextArray,resultsTextString);
	},
	compareResults: function(resultsTextString){
		var countSuccess = dice.count(resultsTextString, symbols.success);
		var countAdvantage = dice.count(resultsTextString, symbols.advantage);
		var countTriumph = dice.count(resultsTextString, symbols.triumph);
		var countThreat = dice.count(resultsTextString, symbols.threat);
		var countFailure = dice.count(resultsTextString, symbols.failure);
		var countDespair = dice.count(resultsTextString, symbols.despair);
		var netSuccess = [symbols.success, countSuccess - countFailure];
		var netAdvantage = [symbols.advantage, countAdvantage - countThreat];
		var netTriumph = [symbols.triumph, countTriumph];
		var netDespair = [symbols.despair, countDespair];
    var netLight = [symbols.lightPip, dice.count(resultsTextString, symbols.lightPip)];
    var netDark = [symbols.darkPip, dice.count(resultsTextString, symbols.darkPip)];

		if(netSuccess[1] < 0){netSuccess[0] = symbols.failure; netSuccess[1] = Math.abs(netSuccess[1]);}
		if(netAdvantage[1] < 0){netAdvantage[0] = symbols.threat; netAdvantage[1] = Math.abs(netAdvantage[1]);}
		var resultsArray = [netSuccess, netAdvantage, netTriumph, netDespair, netDark, netLight];
    views.results(resultsArray);		
	},
	count: function(results, symbol){
		var stringRegex = new RegExp(symbol, 'g');
		var total = (results.match(stringRegex) || []).length;
		return(total);
	}
};

var views = {
  d100: function(){
    var result = dice.randomNumber(100);
    alert(result);
  },
  randomizeAppearance: function(i,dicePoolButtons,resultsTextArray,resultsTextString){
    if(i <= 0){views.finalSymbols(dicePoolButtons,resultsTextArray,resultsTextString);return};
    setTimeout(function(){
        for(var d = 0; d < dicePoolButtons.length; d++){
          var die = dicePoolButtons[d];
          switch(die.classList[0]){
          case 'ability':
            var sides = dice.types.ability.sides;
            break;
          case 'difficulty':
            var sides = dice.types.difficulty.sides;
            break;
          case 'boost':
            var sides = dice.types.boost.sides;
            break;
          case 'setback':
            var sides = dice.types.setback.sides;
            break;
          case 'proficiency':
            var sides = dice.types.proficiency.sides;
            break;
          case 'challenge':
            var sides = dice.types.challenge.sides;
            break;
          case 'force':
            var sides = dice.types.force.sides;
            break;
        }
        var side = dice.randomNumber(sides.length) - 1;
        dicePoolButtons[d].innerHTML = sides[side];
      }
    views.randomizeAppearance(--i,dicePoolButtons,resultsTextArray,resultsTextString);

    },50);
    
  },
  finalSymbols: function(dicePoolButtons,resultsTextArray,resultsTextString){
    for(var d = 0; d < dicePoolButtons.length; d++){
			dicePoolButtons[d].innerHTML = resultsTextArray[d];
//      views.adjacentDice(dicePoolButtons[d].classList[0]);
		}
		dice.compareResults(resultsTextString);
    
  },
	results: function(resultsArray){
    var netResultsArea = document.getElementById("net-results-list");
    var newRoll = document.createElement("li");
    newRoll.classList.add("roll-result");
    for(var i = 0; i < resultsArray.length; i++){
      var count = resultsArray[i][1];
      var symbol = resultsArray[i][0];
      if(count > 0){
        for(var c = 0; c < count; c ++){
          var resultButton = document.createElement('button');
          resultButton.innerHTML = resultsArray[i][0];
          var tooltip = document.createElement('div');
          tooltip.classList.add('tooltip');
          tooltip.innerHTML = "<span>"+count;
          resultButton.appendChild(tooltip);
          newRoll.appendChild(resultButton);
          netResultsArea.insertBefore(newRoll, netResultsArea.childNodes[0]);
        };
      };
    };
  },
  activeDice: function(qty, type){
    var activeDice = document.querySelectorAll('input[name=' + type + ']+label');
    for(var i = 0; i < activeDice.length; i++){activeDice[i].classList.remove('active');};
    for(var i = 0; i <= qty; i++){
      activeDice[i].classList.add('active');
    }
    return;
  },
  adjacentDice: function(type){
    var adjDice = []
    var adjCount = dice.types[type].adjacent;
    var sides = dice.types[type].sides.length;
    console.log(sides);
    for(var i = 0; i < adjCount; i++){
      var adjSide = dice.randomNumber(sides) - 1;
      var adjSymbol = dice.types[type].sides[adjSide];
      adjDice.push(adjSymbol);
    };
    console.log(adjDice);
  },
  addDestiny: function(){
    var pips = document.querySelectorAll("#destiny-pool .symbol");
    var count = pips.length
    var pipList = document.getElementById("destiny-pool");
    var check = document.createElement("input");
    var eId = count ++;
    check.setAttribute("type","checkbox");
    check.setAttribute("value",eId);
    check.setAttribute("id","destiny-" + eId);
    check.setAttribute("checked", "checked");
    var label = document.createElement("label");
    label.setAttribute("class","symbol");
    label.setAttribute("for","destiny-" + eId);
    pipList.appendChild(check);
    pipList.appendChild(label);
  },
  remDestiny: function(){
    var pipChecks = document.querySelectorAll("#destiny-pool input[type='checkbox']");
    var position = pipChecks.length - 1;
    if(position > 0) {
      var lastCheck = pipChecks[position];console.log(lastCheck);
      var pipLabels = document.querySelectorAll("#destiny-pool label");
      var lastLabel = pipLabels[position];
      lastCheck.remove();
      lastLabel.remove();      
    }
  }
};