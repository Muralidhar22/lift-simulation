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
    console.log(storeData)

    document.querySelectorAll(".button-container .up").forEach(element => {
        element.addEventListener("click",moveLiftUp)
    })
    
    document.querySelectorAll(".button-container .down").forEach(element => {
        element.addEventListener("click",moveLiftDown)
    })
}
inputForm.addEventListener("submit",liftSimulationGenerator)

// moving lift when pressed on up button
function moveLiftUp(event){
    let id = null
    console.log("lift called on floor - ",event.target.dataset.floor)
    function findAvailableLift() {
        for(let i = 0;i<storeData.length;i++){
            console.log(event.target.dataset.floor > storeData[i].pos)
            console.log("floor:",event.target.dataset.floor,"lift:",storeData[i].pos)
            if(event.target.dataset.floor > storeData[i].pos){
                return storeData[i].id
            }
        }
        return 0
    }

    const availableLift = findAvailableLift()
    console.log("available lift",availableLift)
    if(availableLift !== 0){
        const elem = document.querySelector(`[data-lift="${availableLift}"]`).getBoundingClientRect()
    
        const floorRect = document.querySelector(`[data-floor="${event.target.dataset.floor}"].floor-container`).getBoundingClientRect()
        console.log("elem:",elem,"floorHeight:",floorRect)
        console.log(document.querySelector(`[data-floor="${event.target.dataset.floor}"]`))
        clearInterval(id);
        id = setInterval(liftMovement, 10);
        
        function liftMovement() {
            if (Math.round(elem.bottom) <= Math.round(floorRect.y)) {
                console.log("base case")
               console.log(elem.bottom,floorRect.bottom)
                storeData[availableLift-1].pos = Number(event.target.dataset.floor)
                console.log("position of lift:",storeData[availableLift-1].pos)
                clearInterval(id);
            } 
            else {
                console.log("moving")
                elem.y-=1;  
                document.querySelector(`[data-lift="${availableLift}"]`).style.top = elem.y + "px"
            }
        }
    }
}
// moving lift when pressed on down button
function moveLiftDown(event){
    let id = null
    console.log("lift called on floor - ",event.target.dataset.floor)
    function findAvailableLift() {
        for(let i = 0;i<storeData.length;i++){
            console.log(event.target.dataset.floor < storeData[i].pos)
            console.log("floor:",event.target.dataset.floor,"lift:",storeData[i].pos)
            if(event.target.dataset.floor < storeData[i].pos){
                return storeData[i].id
            }
        }
        return 0
    }

    const availableLift = findAvailableLift()
    console.log("available lift",availableLift)
    if(availableLift !== 0){
        const elem = document.querySelector(`[data-lift="${availableLift}"]`).getBoundingClientRect()
    
        const floorHeight = document.querySelector(`[data-floor="${event.target.dataset.floor}"].floor-container`).getBoundingClientRect()
        console.log("elem:",elem,"floorHeight:",floorHeight)
        clearInterval(id);
        id = setInterval(liftMovement, 10);
        function liftMovement() {
            if (elem.bottom >= floorHeight.bottom) {
                console.log("base case")
               
                storeData[availableLift-1].pos = Number(event.target.dataset.floor)
                console.log("position of lift:",storeData[availableLift-1].pos)
                clearInterval(id);
            } 
            else {
                console.log("moving")
                elem.y+=1;  
                document.querySelector(`[data-lift="${availableLift}"]`).style.top = elem.y + "px"
            }
        }
    }
    
}


