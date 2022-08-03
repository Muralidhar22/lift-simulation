const inputForm = document.querySelector(".input-form")
const storeData = {} 

function liftSimulationGenerator(event){
    event.preventDefault()
    document.querySelectorAll(".floor-container").forEach(element => {
        element.remove()
    })
    const numberOfFloors = Number(event.target[0].value)
    const numberOfLifts = Number(event.target[1].value)
    if(numberOfLifts === 0 || numberOfFloors === 0) alert("Please enter valid number of lifts/floors")
    else addLiftsAndFloors(numberOfFloors, numberOfLifts)
    console.log(storeData)
}
function addLiftsAndFloors(nof,nol){
    console.log("adding lifts and floors",nof,nol)
    for(let i = 0;i <= nof;i++){
        const floorContainer = document.createElement("div")
        const liftUpBtn = document.createElement("button")
        const liftDownBtn = document.createElement("button")
        const floorNumber = document.createElement("h2")
        const btnContainer = document.createElement("button-container")
        
        floorContainer.className = "floor-container"

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

    for(let i = 0; i <= nol; i++){
        const lift = document.createElement("div")

        lift.className = "lift"
    }
}
inputForm.addEventListener("submit",liftSimulationGenerator)