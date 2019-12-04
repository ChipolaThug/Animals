
let liste = JSON.parse(AnimalList);

// Main script
window.addEventListener("load", function(){

    // Three variables to save the distance between the 3 points,
    // and 2 variables to indentify which distance is the solo one on the isosceles triangle.
        let distanceBetween1and2;    
        let distanceBetween1and3;     
        let distanceBetween2and3;    
        let distanceSolo;
        let distanceDuo;    
    // Randomly choose an animal on the JSON list.
        let numberOfAnimalLeftToGuess = 5;
        let listeAnimauxLeft = [0, 1, 2, 3, 4];
        let currentAnimalToGuess = Math.trunc(Math.random()*numberOfAnimalLeftToGuess);
        let animal = liste[listeAnimauxLeft[currentAnimalToGuess]]["trouver"];
    // Getter for the different elements to interact with.
    // The 2 different view :
        let game = document.getElementById("gameView");
        let image = document.getElementById("imageView");
    // Image view.
        let GoBackToGuessButton = document.getElementById("GoBackToGuessButton");     
        let imageOfAnimal = document.getElementById("imageOfAnimal");
    // Guess view (game).
        let nameOfAnimal = document.getElementById("nameOfAnimal");
        let suggestionPlace = document.getElementById("suggestionPlace");
    // Debbug Variables.
        let numberOfTouch = document.getElementById("numberOfTouch");
        let distance = document.getElementById("distance");            
        let distanceVal = document.getElementById("distanceVal");
    // Success view.
        let menuSound = document.getElementById("victorySound");
        let menuImage = document.getElementById("victoryImage");

    // Display the name of current animal to guess.
        nameOfAnimal.innerHTML = animal;
    // Boolean to know the current view to display.
        let gameView = true;
    /* Define the current state :   
       working  -> idle state
       waiting  -> view display, block tangible interaction
       fail     -> wrong object
       success  -> good object   */           
        let state = "working";

    // TODO
    let audio;
    let widthIconMenu  = 80;
    let heightIconMenu = 80;
    let animalProposeALone, animalProposeDuo;
    let xMult   = 1.2;    
    let yMult   = 1.1;
    let offSetY = 60;
    let offSetX = 0;

    // function that changes the animal to find in the system and change the name displayed
    function changeAnimal(){   
        currentAnimalToGuess = Math.trunc(Math.random()*numberOfAnimalLeftToGuess);
        animal = liste[listeAnimauxLeft[currentAnimalToGuess]]["trouver"];
        nameOfAnimal.innerHTML = animal;
    }

    // function that calculate the distance between two points
    // 4 parameters P1 (x,y) and P2 (x,y)
    // return distance
   
    /**
     * @param  int x1
     * @param  int x2
     * @param  int y1
     * @param  int y2
     * @returns number distance
     */
    function Distance(x1, x2, y1, y2){
        let d = Math.sqrt((y2 - y1)*(y2 - y1) + (x2 - x1)*(x2 - x1));
        return Math.trunc(d/27);
    }

    // function that is triggered when the animal is recongnized
    function Succes(){
        numberOfAnimalLeftToGuess--;
        nameOfAnimal.style.color = "";; 
        if(numberOfAnimalLeftToGuess == 0){
            document.location.href='menu.html';
        }
        listeAnimauxLeft.splice(currentAnimalToGuess, 1);
        menuSound.style.display  = "none";
        menuImage.style.display  = "none";
        state = "working";
        changeAnimal();
    }

    // function that is triggered when the animal isn't recongnized
    function Fail(){
        nameOfAnimal.style.color = "red";
        setTimeout(function(){ nameOfAnimal.style.color = ""; }, 500);
    }

    // function that display the menu at the calculate position
    function popUpSucces(posX,posY){
        nameOfAnimal.style.color = "green";
        menuImage.style.top     = (((posY*yMult)-offSetY)-(heightIconMenu*1.5)) +"px";
        menuImage.style.left    = (((posX*xMult)-offSetX)+(widthIconMenu/2)+60) +"px";
        menuImage.style.display = "block";
	    menuImage.onclick = function() {
            document.body.style.background = "black no-repeat right bottom";
            game.style.display  = "none";
            image.style.display = "block";
            gameView = false;
            state = "waiting"; 
            imageOfAnimal.src = liste[listeAnimauxLeft[currentAnimalToGuess]]["image"];
        };
        menuSound.style.top     = (((posY*yMult)-offSetY)+(heightIconMenu/2)) +"px";
        menuSound.style.left    = (((posX*xMult)-offSetX)+(widthIconMenu/2)+60) +"px";
        menuSound.style.display = "block";
        menuSound.onclick = function() { 
            audio = new Audio(liste[listeAnimauxLeft[currentAnimalToGuess]]["audio"]);
            audio.play();
		    state = "waiting"; 
        };posY
    }

    // function that checks if the object is the animal asked by the system
    function TestSucces(dAlone, dDuo, x, y){
        animalProposeALone = liste[listeAnimauxLeft[currentAnimalToGuess]]["distanceSolo"];
        animalProposeDuo = liste[listeAnimauxLeft[currentAnimalToGuess]]["distanceDuo"];
        if(dAlone == animalProposeALone && dDuo == animalProposeDuo){
            animalPropose = liste[listeAnimauxLeft[currentAnimalToGuess]]["trouver"];
            popUpSucces(x,y);
		    state = "succes"; // -> state succes
        } else {
            Fail();
		    state = "fail"; // -> state fail
        }        
    }

    // listener when the tangible object is add/remove from the suggestionPlace
    suggestionPlace.addEventListener("touchstart", function(ev) {
        if(gameView){
            if(state != "waiting"){
                let touch1, touch2, touch3;
                if (ev.touches.length > 0){
                    touch1 = ev.touches.item(0);
                    distance.innerHTML    = "P 1 (x) : " + touch1.clientX;
                    distanceVal.innerHTML = "P 1 (y) : " + touch1.clientY;
                }
                if (ev.touches.length > 1){
                    touch2 = ev.touches.item(1);
                }
                if (ev.touches.length > 2){
                    touch3 = ev.touches.item(2);
                }
                numberOfTouch.innerHTML = "Number of Touch : " + ev.touches.length;
                if (ev.touches.length == 3){
                    distanceBetween1and2  = Distance(touch1.clientX, touch2.clientX, touch1.clientY, touch2.clientY);
                    distanceBetween1and3  = Distance(touch1.clientX, touch3.clientX, touch1.clientY, touch3.clientY);
                    distanceBetween2and3  = Distance(touch2.clientX, touch3.clientX, touch2.clientY, touch3.clientY);
                    distance.innerHTML    = "Distances : " + distanceBetween1and2;
                    distanceVal.innerHTML = distanceBetween1and2 + " : " + distanceBetween1and3 + " : " + distanceBetween2and3;
                }
                if(distanceBetween1and2 == distanceBetween1and3){
                    distanceDuo  = distanceBetween1and2;
                    distanceSolo = distanceBetween2and3;
                } else if(distanceBetween1and2 == distanceBetween2and3){
                    distanceDuo  = distanceBetween1and2;
                    distanceSolo = distanceBetween1and3;
                } else if(distanceBetween1and3 == distanceBetween2and3){
                    distanceDuo  = distanceBetween1and3;
                    distanceSolo = distanceBetween1and2;
                } else {
                    distanceDuo  = 0;
                    distanceSolo = 0;
                }
                if (ev.touches.length == 3 ){
                    TestSucces(distanceSolo, distanceDuo,((touch1.clientX+touch2.clientX+touch3.clientX)/3),((touch1.clientY+touch2.clientY+touch3.clientY)/3));
                }
                else{
                    if(state  != "succes"){
                        state == "working";
                    }
                }
            }
        } 
    });

    // listener when the tangible object is oving on the suggestionPlace
    suggestionPlace.addEventListener("touchmove", function(ev) {
        if(state == "succes"){
            let touch1, touch2, touch3;
            touch1 = ev.touches.item(0);
            touch2 = ev.touches.item(1);
            touch3 = ev.touches.item(2);
            if(distanceBetween1and2 == distanceBetween1and3){
                distanceDuo  = distanceBetween1and2;
                distanceSolo = distanceBetween2and3;
            } else if(distanceBetween1and2 == distanceBetween2and3){
                distanceDuo  = distanceBetween1and2;
                distanceSolo = distanceBetween1and3;
            } else if(distanceBetween1and3 == distanceBetween2and3){
                distanceDuo  = distanceBetween1and3;
                distanceSolo = distanceBetween1and2;
            } else {
                distanceDuo  = null;
                distanceSolo = null;
            }
            TestSucces(distanceSolo, distanceDuo,((touch1.clientX+touch2.clientX+touch3.clientX)/3),((touch1.clientY+touch2.clientY+touch3.clientY)/3));
        }
        else{
            menuSound.style.display = "none";
            menuImage.style.display = "none";
        }
    });

    GoBackToGuessButton.addEventListener("touchstart", function(ev) {
        goBackToGuess();
    });

    function goBackToGuess(){
        game.style.display = "block";
        image.style.display = "none";
        document.body.style.background = "";
        gameView = true;
        Succes();
    }
});