const inputForm = document.querySelector(".input-form")
const liftContainer = document.querySelector(".lift-container")
const state = {
    lifts: [],
    floors: {}
}
const queue = []

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
    if(numberOfLifts <= 0 || numberOfFloors <= 0){
     event.target[0].value = ''; event.target[1].value = ''
     alert("Please enter valid number of lifts/floors")
    }    
    else {
        if(screen.width <= 550 && numberOfLifts <= 3) addLiftsAndFloors(numberOfFloors, numberOfLifts)
        else if(screen.width <= 1150 && screen.width > 550 && numberOfLifts <= 5) addLiftsAndFloors(numberOfFloors, numberOfLifts)
        else if(screen.width > 1150 && numberOfLifts <= 10) addLiftsAndFloors(numberOfFloors, numberOfLifts)
        else {
            document.querySelector(".generate-lift-btn").textContent = "Maximum lifts exceeded"
        }
    }
}
   

function addLiftsAndFloors(nof,nol){
    // creating floors
    for(let i = 0;i <= nof;i++){
        const floorContainer = document.createElement("div")

        floorContainer.className = "floor-container"
        floorContainer.setAttribute("data-floor",i)

        floorContainer.innerHTML = `
        <div class="button-container">
           ${i !== nof ? `<button class="up" data-floor=${i} data-direction="up">⬆</button>` : ``} 
           ${i !== 0 ? `<button class="down" data-floor=${i} data-direction="down">⬇</button>` : ``}
        </div>
        <p class="floor-number">FLOOR - ${i}</p>
        `
        
        document.querySelector(".lift-container").prepend(floorContainer)
    } 
   // creating lifts
    for(let i = 1; i <= nol; i++){
        const lift = document.createElement("div")
        
        lift.className = "lift"
        lift.setAttribute("data-lift",i)
        // styling of lift
        lift.style.left = `${(5+(i*20))}`+"%"
        lift.innerHTML = `
                        <div class="lift-door left-door"></div>
                        <div class="lift-door right-door"></div>
                        `

        document.querySelector(".lift-container").append(lift)
      
    }
    // initialising lift positions
    document.querySelectorAll(".lift").forEach((element,index) => {
        state.lifts[index] = {id:element.dataset.lift, pos: 0, busy: false, liftHeight: 0}
    })
    
    

    document.querySelectorAll(".button-container .up").forEach(element => {
        element.addEventListener("click",(event) => liftCallHandler(event,event.target.dataset.floor))
    })
    
    document.querySelectorAll(".button-container .down").forEach(element => {
        element.addEventListener("click",(event) => liftCallHandler(event,event.target.dataset.floor))
    })
}
inputForm.addEventListener("submit",liftSimulationGenerator)

document.querySelector('#no-of-lifts').addEventListener("focus",()=>{
    document.querySelector(".generate-lift-btn").textContent = "generate"
})


function liftCallHandler(event,floor){
    const destFloor = Number(floor)
    const direction = event.target.dataset.direction
    try{
        if(state.floors["F"+destFloor+direction].assigned){
            return
        }
    }
    catch{
        event.target.classList.add("active")
        // pass
    }
    // MOVE LIFT
    function moveLift(lift){
        const liftEl = document.querySelector(`[data-lift="${lift}"]`)
        const currentLiftHeight = state.lifts[lift-1].liftHeight
        const multiplier = destFloor - state.lifts[lift-1].pos
        if(multiplier >= 0){
            var translateValue = (100*Math.abs(multiplier)) + currentLiftHeight
        }
        else{
            var translateValue = currentLiftHeight - (100*Math.abs(multiplier))
        }
        liftEl.style.transform= `translateY(-${translateValue}px)`
        liftEl.style.transition = `transform ${Math.abs(multiplier)*2}s linear`
        // updating state of lift height from ground
        state.lifts[lift-1].liftHeight = translateValue
         
        setTimeout(
            () => {
                liftEl.querySelectorAll(".lift *").forEach(
                    el => {
                        el.classList.add("active")
                    }
                )
                setTimeout(
                    () => {
                        event.target.classList.remove("active")
                        delete state.floors["F"+destFloor+direction];
                        state.lifts[lift-1].pos = destFloor;
                        state.lifts[lift-1].busy = false;
                        liftEl.querySelectorAll(".lift *").forEach(el =>{
                            el.classList.remove("active")
                        }) 
                        if(queue.length > 0){
                            liftCallHandler(queue[queue.length - 1].event,queue[queue.length - 1].id)
                            queue.pop()
                        }
                    }
               ,5000 )
            }
        ,2000 * Math.abs(multiplier))
    }
    
    function findNearestAvailableLift(){
        let nearestAvailableLift = null
        let counter = 0
            for(let i = 0;i<state.lifts.length;i++){
                if(!state.lifts[i].busy){
                    if(counter === 0){
                        nearestAvailableLift = state.lifts[i].id
                        counter++;
                    }
                    else{
                        currentAvailabeLiftDistance = Math.abs(state.lifts[nearestAvailableLift-1].pos - destFloor)
                        newAvailableLiftDistance = Math.abs(state.lifts[i].pos - destFloor)
                        if(newAvailableLiftDistance < currentAvailabeLiftDistance){
                            nearestAvailableLift = state.lifts[i].id
                        }
                    }
                }
            }
             
            if(nearestAvailableLift !== null){
                
                state.lifts[nearestAvailableLift - 1].busy = true
                state.floors["F"+destFloor+direction] = { assigned: nearestAvailableLift }
                
               moveLift(nearestAvailableLift)
            }
            else{
                let existingCallInQueue = 0
                for(const x in queue){
                    if(Number(queue[x].id) === destFloor && queue[x].direction === direction ){
                        existingCallInQueue++
                    }
                }
                if (existingCallInQueue === 0) {
                 queue.unshift({id: destFloor,event,assigned: null,direction})
                }
            }
       
}
  findNearestAvailableLift() 
}


