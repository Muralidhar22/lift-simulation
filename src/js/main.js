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
    else addLiftsAndFloors(numberOfFloors, numberOfLifts)
}
   

function addLiftsAndFloors(nof,nol){
    // creating floors
    for(let i = 0;i <= nof;i++){
        const floorContainer = document.createElement("div")

        floorContainer.className = "floor-container"
        floorContainer.setAttribute("data-floor",i)

        floorContainer.innerHTML = `
        <div class="button-container">
           ${i !== nof ? `<button class="up" data-floor=${i}>⬆</button>` : ``} 
           ${i !== 0 ? `<button class="down" data-floor=${i}>⬇</button>` : ``}
        </div>
        <h2 class="floor-number">Floor - ${i}</h2>
        `
        
        document.querySelector(".lift-container").prepend(floorContainer)
    } 
   // creating lifts
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



function liftCallHandler(event,floor){
    const destFloor = Number(floor)
    try{
        if(state.floors[destFloor].assigned){
            console.log("already called and assigned")
            return
        }
    }
    catch{
        event.target.classList.add("active")
        console.log("not called and assigned")
        // pass
    }
    // MOVE LIFT
    function moveLift(lift){
        console.log("available lift:",lift,Math.abs(destFloor - state.lifts[lift-1].pos))
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
                liftEl.classList.add("active")  
                setTimeout(
                    () => {
                        event.target.classList.remove("active")
                        delete state.floors[destFloor];
                        state.lifts[lift-1].pos = destFloor;
                        state.lifts[lift-1].busy = false;
                        liftEl.classList.remove("active")
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
                state.floors[destFloor] = {assigned: nearestAvailableLift}
               moveLift(nearestAvailableLift)
            }
            else{
                queue.unshift({id: destFloor,event,assigned: null})
                console.log("queue added:",queue)
            }
       
}
  findNearestAvailableLift() 
}


