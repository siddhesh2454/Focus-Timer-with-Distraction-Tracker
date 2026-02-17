console.log("js is working");

let totalSeconds;
let timerInterval;
let isRunning = false;
let initialSeconds = 1500;
let circumference = 2 * Math.PI * 70;
let mode = "pomodoro";
let userInput

let isRestoredSession =  false;



//object that will be used to update distractions
let distractions = {
    instagram: 0,
    youtube: 0,
    phone: 0,
    other: 0
}


// Grabbing elements from html using js
let grabTimer = document.getElementById("time")

let grabStart = document.getElementById("startbtn")
let grabPause = document.getElementById("pausebtn")
let grabReset = document.getElementById("resetbtn")

let summarySection = document.getElementById("summary")

let progressCircle = document.getElementById("progressCircle")

let progressCirclePercentage = document.getElementById("progressCircle-percentage")

let pomodoroBtn = document.getElementById("pomodoro");
let customizeBtn = document.getElementById("customize");

let okBtn = document.getElementById("ok");

let customTimeContainer = document.querySelector(".customTimeContainer")
customTimeContainer.style.visibility = "hidden"

let input = document.querySelector(".customTimeContainer input")


// Implementing necessary functions
function startTimer() {
    isRestoredSession = false;
    updateSummary()
    if (isRunning) {
        return
    }
    isRunning = true
    if (!totalSeconds) {
        totalSeconds = initialSeconds;
    }
    grabStart.style.visibility = "hidden"
    grabPause.style.visibility = "visible"
    timerInterval = setInterval(() => {
        totalSeconds--;
        if (totalSeconds <= 0) {
            clearInterval(timerInterval)
            isRunning = false
            grabTimer.textContent = "00 : 00"
            alert("Session completed! Check summary below.")
            updateSummary()
            progressCircle.style.strokeDashoffset = 0;
            progressCirclePercentage.textContent = "100%";
            return
        }
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = (totalSeconds % 60);
        grabTimer.textContent = String(minutes).padStart(2, "0") + " : " + String(seconds).padStart(2, "0");

        // For progress circle
        let progress = totalSeconds / initialSeconds;
        let offset = circumference * progress;
        progressCircle.style.strokeDashoffset = offset;

        //For progress circle percentage
        let percentage = Math.floor((1 - progress) * 100)
        progressCirclePercentage.textContent = percentage + "%"

    }, 1000);
}



function pauseTimer() {
    clearInterval(timerInterval)
    isRunning = false;
    grabPause.style.visibility = "hidden";
    grabStart.style.visibility = "visible";
}


function resetTimer() {
    isRestoredSession = false;
    resetSessionState();
    clearInterval(timerInterval)
    totalSeconds = initialSeconds;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = (totalSeconds % 60);
    grabTimer.textContent = String(minutes).padStart(2, "0") + " : " + String(seconds).padStart(2, "0");
    grabStart.style.visibility = "visible";
    grabPause.style.visibility = "hidden";
}


function updateSummary() {
    let insta = distractions.instagram;
    let yt = distractions.youtube;
    let phn = distractions.phone;
    let oth = distractions.other
    if(isRestoredSession){
     summarySection.innerHTML = `<h3>Last Session Summary</h3> <p>Instagram Count : ${insta}</p><p>Youtube Count : ${yt}</p> <p>Phone Count : ${phn}</p> <p>Other Count : ${oth}</p>`
    }else{

        summarySection.innerHTML = `<h3>Current Session Summary</h3> <p>Instagram Count : ${insta}</p><p>Youtube Count : ${yt}</p> <p>Phone Count : ${phn}</p> <p>Other Count : ${oth}</p>`
    }
}


function resetSessionState() {
    totalSeconds = 0;
    progressCircle.style.strokeDashoffset = circumference;
    progressCirclePercentage.textContent = "0%";
    distractions.instagram = 0
    distractions.youtube = 0
    distractions.phone = 0
    distractions.other = 0
    localStorage.setItem("distractions", JSON.stringify(distractions))
    isRestoredSession = false;
    updateSummary()
    isRunning = false

}






// add Event listener to Timer start button
grabStart.addEventListener("click", () => {
    startTimer();

})

// add Event listener to Timer pause button
grabPause.addEventListener("click", () => {
    pauseTimer();
})

// add Event listener to Timer Reset button
grabReset.addEventListener("click", () => {
    resetTimer();
})

// add Event listener to all Track distractions buttons
document.querySelectorAll(".distraction-btns button").forEach((button) => {
    button.addEventListener("click", () => {
        let type = button.dataset.type
        if (isRunning) {
            distractions[type]++
            updateSummary()
            localStorage.setItem("distractions", JSON.stringify(distractions))
        } else {
            alert("Distraction is only counted when Timer is on...!")
        }
    })
});

//Add event listener when user changes the tab
document.addEventListener("visibilitychange", () => {
    if (document.hidden && isRunning) {
        alert("Focus lost...! Stay on task.")
    }
})

// Add event listener to pomodoro button
pomodoroBtn.addEventListener("click", () => {
    mode = "pomodoro"
    pomodoroBtn.style.background = "#c2bcbc"
    customizeBtn.style.background = "white"
    initialSeconds = 1500;
    grabStart.style.visibility = "visible"
    customTimeContainer.style.visibility = "hidden"
    resetSessionState();
    grabTimer.textContent = "25 : 00"
    localStorage.setItem("mode", "pomodoro")
    localStorage.setItem("initialSeconds", initialSeconds);
})

// Add event listener to customize button
customizeBtn.addEventListener("click", () => {
    mode = "customize"
    customizeBtn.style.background = "#c2bcbc"
    pomodoroBtn.style.background = "white"
    customTimeContainer.style.visibility = "visible"
})

//
okBtn.addEventListener("click", () => {
    if (input.value >= 1 && input.value <= 100) {
        clearInterval(timerInterval);
        resetSessionState()
        userInput = Number(input.value)
        initialSeconds = userInput * 60;
        let minutes = Math.floor(initialSeconds / 60);
        let seconds = (initialSeconds % 60);
        grabTimer.textContent = String(minutes).padStart(2, "0") + " : " + String(seconds).padStart(2, "0");
        grabStart.style.visibility = "visible"
        customTimeContainer.style.visibility = "hidden";
        localStorage.setItem("mode", "customize")
        localStorage.setItem("initialSeconds", initialSeconds);
    } else {
        alert("Please enter Minutes between 1 to 100")
    }

})



// localstorage get item logic
let savedMode = localStorage.getItem("mode");
if (savedMode) {
    mode = savedMode
    console.log(savedMode)
    if (mode === "pomodoro") {
        pomodoroBtn.style.background = "#c2bcbc"
        customTimeContainer.style.visibility = "hidden"
        initialSeconds = 1500;
    } else {
        customTimeContainer.style.visibility = "hidden"
        customizeBtn.style.background = "#c2bcbc";
    }
}

let savedTime = localStorage.getItem("initialSeconds")
if (savedTime) {
    let savedTimeConverted = Number(savedTime)
    initialSeconds = savedTimeConverted;
    let minutes = Math.floor(initialSeconds / 60);
    let seconds = initialSeconds % 60;
    grabTimer.textContent = String(minutes).padStart(2, "0") + " : " + String(seconds).padStart(2, "0");

}


let savedDistractions = localStorage.getItem("distractions");

if(savedDistractions){

   let parsed = JSON.parse(savedDistractions);

   distractions.instagram = parsed.instagram;
   distractions.youtube = parsed.youtube;
   distractions.phone = parsed.phone;
   distractions.other = parsed.other;
    isRestoredSession = true
     updateSummary();
}
