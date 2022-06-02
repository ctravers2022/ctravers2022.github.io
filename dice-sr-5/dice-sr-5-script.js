
/**
number pad ---
0-9
EDGE
VS. (move die pool to side of keypad, show new area for next pool, clear pad, enter next pool. repeat)
roll

main dice ---
!!! rolLDie: rand 1-6
!!! rollPool(Z): rollDice Z times
!!! collect results in area
!!! count5s = x
!!! count6s = y
!!! hits = x + y
!!! reroll 6s rollDie y times
!!! addResultsGroup to collected results as reroll group
!!! repeat count6s, rollDie, addResultsGroup while new resultsGroup has 6s
!!! reRoll(Z - (hits)); start counts, 6s

initiative ---
base = input value A
d6 = input value B
rollPool(B)
iniative = sum values of roll and A
roll all initiative
re-order players, sort initiative value
decrease/increase initiative
add/subtract d6 roll

players ---
enter player names separated by ","
enter each iniative base & d6


**/

var players = [
    {
     "name" : "Eric",
     "d6" : "4",
     "mod" : "11"
   },
   {
     "name" : "Jason",
     "d6" : "2",
     "mod" : "13"
   },
   {
     "name" : "Jim",
     "d6" : "4",
     "mod" : "10"
   },
   {
     "name" : "John",
     "d6" : "1",
     "mod" : "5"
   },
   {
     "name" : "Mistie",
     "d6" : "1",
     "mod" : "4"
   },
   {
     "name" : "Monica",
     "d6" : "1",
     "mod" : "10"
   },
   {
     "name" : "NPC",
     "d6" : "1",
     "mod" : "1"
   },
   {
     "name" : "SOAK",
     "d6" : "1",
     "mod" : "1"
   }
 ]
 
 
 
 var resultsArray = []
 var hits = 0
 var countsArray = [0,0,0,0,0,0];
 var protos = document.getElementById("repeatable");
 var protoRow = protos.querySelector(".result-row");
 var protoPlayer = protos.querySelector(".player-row");
 var resultsWindow = document.getElementById("result-rows");
 var global = 0;
 var side="";
 
 function rollNew(input) {
   //set some varibles: edge (yes/no)
   var edge = input.parentElement.querySelector(".edge");
   var number = input.parentElement.querySelector(".dice.number").innerHTML;
   var source = input.parentElement.querySelector(".name").value;
   side = input.parentElement.getAttribute("side");
   //roll dice based on input and if edge was checked. Put results in indicated destination
   var edgeChecked = edge.checked;
   console.log(edge.checked);
   var targetList = display.newResultRow(edgeChecked, source);
   dice.pool(number, edgeChecked, targetList);
 };
 
 function allReset(){
   hits = 0;
   resultsArray = [];
   countsArray = [0,0,0,0,0,0];
   var resultArea = document.getElementById("results-window");
   display.clear(resultArea.querySelector(".results"));
 }
 
 
 var dice = {
   sides: 6,
   roll: function(){
     var max = Math.floor(this.sides) +1;
         var result = Math.floor(Math.random()*(max-1)+1);
         return result;
   },
   pool: function(count, edge, targetList){
     // random number for each of the dice pool and put in resultsArea html 1 at a time
     //if(rerollList){
     //  var targetList = rerollList;
     //}else{var targetList = display.newResultRow(edge);};
     for(var i = 0; i < count; i++){
       //if edge and 6, roll again
       var hit = 0;
       do{
         var result = dice.roll();
         if(result > 4){
           hit = 1; 
         }else(hit = 0);
         display.resultHTML(result, hit, targetList);
       }while(result == 6 && edge);
     };
     edge.checked = false;
     display.hits(targetList);
   },
   countNs: function(resultsArray, n){
     for(var i = 0; i < resultsArray.length; i++){
       if(resultsArray[i] == n){
         countsArray[n-1]++;
       };
     };
   },
   reRoll: function(input){
     input.disabled = true;
     var resultRow = input.parentElement;
     var rerollList = resultRow.querySelector("ul");
     var liResults = rerollList.querySelectorAll("li");
     var reRollCount = 0;
     for(var i = 0; i < liResults.length; i++){
       var result = Number(liResults[i].innerText);
       if( result < 5 ){
         liResults[i].classList.add("rerolled");
         reRollCount++;
       };
     };
     dice.pool(reRollCount, 0 , rerollList);
   },
   initiative: function(input){
     var row = input.parentElement;
     var d6 = row.querySelector(".init-d6").value;
     var mod = row.querySelector(".init-mod").value;
     var result = 0;
     for(var i = 0; i < d6; i++){
       result += dice.roll();
     };
     console.log(result + " " + mod);
     var initResult = Number(result) + Number(mod);
     row.querySelector(".init-result").value = initResult;
   }
 }
 
 var display = {
   reset: function(){
     document.getElementById("result-rows").innerHTML="";
     this.clearRoster("pc-roster");
     this.clearRoster("npc-roster");
   },
   clearRoster: function(roster){
     document.getElementById(roster).innerHTML = "";
   },
   newResultRow: function(edge, source){
     var newRow = protoRow.cloneNode(true);
     newRow.classList.add(side);
     if(edge){
       newRow.querySelector(".reroll").disabled="true";
       newRow.querySelector(".reroll").classList.add("edge");
             };
     //resultsWindow.appendChild(newRow);
     resultsWindow.prepend(newRow);
     if(!source){source = "Anon";};
     newRow.querySelector(".source").innerHTML = source;
     var targetList = newRow.querySelector(".results");
     return targetList;
   },
   resultHTML: function(result, hit, targetList){
     var resultArea = targetList.querySelector(".results");
     var resultItemHTML = document.createElement("li");
     if(hit){resultItemHTML.classList.add("hit");};
     resultItemHTML.innerHTML = result;
     targetList.appendChild(resultItemHTML);
   },
   
   clear: function(element) {
     if(element){ element.innerHTML = ""; };
   },
   hits: function(targetList){
     var hit = targetList.querySelectorAll(".hit");
     targetList.parentElement.querySelector(".hits").value = hit.length;
   },
   addNew: function(rosterID, side, name, d6, mod){
     global++;
     var edgeID = "edge-" + global;
     var targetRoster = document.getElementById(rosterID);
     var newPlayer = protoPlayer.cloneNode(true);
     targetRoster.appendChild(newPlayer);
     var edge = newPlayer.querySelector(".edge");
     edge.setAttribute("id", edgeID);
     newPlayer.setAttribute("side",side);
     var edgeButton = newPlayer.querySelector(".edge-button");
     edgeButton.setAttribute("for", edgeID);
     if(name){newPlayer.querySelector(".name").value = name};
     if(d6){newPlayer.querySelector(".init-d6").value = d6};
     if(mod){newPlayer.querySelector(".init-mod").value = mod};
   },
   updateSlider: function(slider){
     var dicePool = slider.parentElement.querySelector(".dice.number");
     dicePool.innerHTML = slider.value;
   }
 }
 
 
 function setBoard(list){
  for(var i = 0; i < list.length; i++){
    display.addNew('pc-roster','pc',list[i].name,list[i].d6,list[i].mod);
    
  };
 }
 
 setBoard(players);