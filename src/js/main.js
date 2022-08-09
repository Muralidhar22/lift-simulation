const inputForm = document.querySelector(".input-form")
const liftContainer = document.querySelector(".lift-container")
const storeData = [] 

function liftSimulationGenerator(event){
    event.preventDefault() //preventing page reload after form submit
    document.querySelectorAll(".floor-container").forEach(element => {
        element.remove() // removing all existing floor elements on form submit
    })
    document.querySelectorAll(".lift").forEach(element => {
        element.remove() // removing all existing lift elements on form submit
    })

    const numberOfFloors = Number(event.target[0].value)
    const numberOfLifts = Number(event.target[1].value)
    if(numberOfLifts === 0 || numberOfFloors === 0) alert("Please enter valid number of lifts/floors")
    else addLiftsAndFloors(numberOfFloors, numberOfLifts)
   
}
function addLiftsAndFloors(nof,nol){
    for(let i = 0;i <= nof;i++){
        const floorContainer = document.createElement("div")
        const liftUpBtn = document.createElement("button")
        const liftDownBtn = document.createElement("button")
        const floorNumber = document.createElement("h2")
        const btnContainer = document.createElement("button-container")
        
        floorContainer.className = "floor-container"
        floorContainer.setAttribute("data-floor",i)

        btnContainer.className = "button-container"
        liftUpBtn.setAttribute("data-floor",i)
        liftUpBtn.appendChild(document.createTextNode("Up"))
        liftUpBtn.className = "up"

        liftDownBtn.setAttribute("data-floor",i)
        liftDownBtn.appendChild(document.createTextNode("Down"))
        liftDownBtn.className = "down"
        
        floorNumber.className = "floor-number"
        floorNumber.appendChild(document.createTextNode(`Floor - ${i}`))

        btnContainer.append(liftUpBtn, liftDownBtn)
        floorContainer.append(btnContainer,floorNumber)
        
        document.querySelector(".lift-container").prepend(floorContainer)
    } 

    for(let i = 1; i <= nol; i++){
        const lift = document.createElement("div")

        lift.className = "lift"
        lift.setAttribute("data-lift",i)
        // styling of lift
        lift.style.left = (100+(i*60))+"px"

        document.querySelector(".lift-container").append(lift)
      
    }
    // initialising lift positions
    document.querySelectorAll(".lift").forEach((element,index) => {
        storeData[index] = {id:element.dataset.lift, pos: 0 }
    })
    

    document.querySelectorAll(".button-container .up").forEach(element => {
        element.addEventListener("click",moveLiftUp)
    })
    
    document.querySelectorAll(".button-container .down").forEach(element => {
        element.addEventListener("click",moveLiftDown)
    })
}
inputForm.addEventListener("submit",liftSimulationGenerator)

// disabling buttons while a lift is moving
function disableButtons(){
    document.querySelectorAll(".button-container *").forEach(el => {
        el.disabled = false;
        el.style.opacity = "0.5"
    })
}
// enabling buttons when no lift is moving
function enableButtons(){
    document.querySelectorAll(".button-container *").forEach(el => {
        el.disabled = false;
        el.style.opacity = "1"
    })
}

// moving lift when pressed on up button
function moveLiftUp(event){
    let id = null
    function findAvailableLift() {
        for(let i = 0;i<storeData.length;i++){
            if(event.target.dataset.floor > storeData[i].pos){
                return storeData[i].id
            }
        }
        return 0
    }

    const availableLift = findAvailableLift()
   console.log(availableLift)
    if(availableLift !== 0){
        const elem = document.querySelector(`[data-lift="${availableLift}"]`)
        const floorHeight = document.querySelector(`[data-floor="${event.target.dataset.floor}"].floor-container`).offsetHeight
        let pos = (elem.style.bottom).match(/(\d+)/) ? (elem.style.bottom).match(/(\d+)/)[0] : 0
        let counter = 0
        
        disableButtons()
        id = setInterval(liftMovement, 10);
        baseCaseVal = floorHeight * (event.target.dataset.floor - storeData[availableLift-1].pos) 
       
        function liftMovement() {
            if (counter === baseCaseVal) {
                storeData[availableLift-1].pos = Number(event.target.dataset.floor)
                enableButtons()
                clearInterval(id)
            } 
            else {
                counter++;
                pos++; 
                elem.style.bottom = pos + "px"
            }
        }
    }
    else{
        alert("No lifts available")
    }
}
// moving lift when pressed on down button
function moveLiftDown(event){
    let id = null
    function findAvailableLift() {
        for(let i = 0;i<storeData.length;i++){
            if(event.target.dataset.floor < storeData[i].pos){
                return storeData[i].id
            }
        }
        return 0
    }

    const availableLift = findAvailableLift()
   
    if(availableLift !== 0){
        const elem = document.querySelector(`[data-lift="${availableLift}"]`)
        const floorHeight = document.querySelector(`[data-floor="${event.target.dataset.floor}"].floor-container`).offsetHeight
        let pos = (elem.style.bottom).match(/(\d+)/) ? (elem.style.bottom).match(/(\d+)/)[0] : 0
        let counter = 0
        
        disableButtons()
        id = setInterval(liftMovement, 10);
        baseCaseVal = floorHeight * (storeData[availableLift-1].pos - event.target.dataset.floor) 
     
        function liftMovement() {
            if (counter === baseCaseVal) {
                storeData[availableLift-1].pos = Number(event.target.dataset.floor)
                enableButtons()
                clearInterval(id)
            } 
            else {
                counter++;
                pos--; 
                elem.style.bottom = pos + "px"
            }
        }
    }
    else{
        alert("No lifts available")
    }
    
}


