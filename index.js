// ==============================
// QUIZ QUESTIONS
// ==============================

const questions = [
    {
        question: "Which language is mainly used to style web pages?",
        options: ["HTML", "CSS", "JavaScript", "Python"],
        answer: "CSS"
    },

    {
        question: "Which keyword is used to declare a constant in JavaScript?",
        options: ["var", "let", "const", "constant"],
        answer: "const"
    },

    {
        question: "Which method is used to select an HTML element by its ID?",
        options: [
            "getElementById()",
            "getElement()",
            "selectById()",
            "queryId()"
        ],
        answer: "getElementById()"
    },

    {
        question: "Which storage mechanism keeps data after the browser is closed?",
        options: [
            "sessionStorage",
            "localStorage",
            "temporaryStorage",
            "memoryStorage"
        ],
        answer: "localStorage"
    },

    {
        question: "Which keyword is used to handle asynchronous operations in JavaScript?",
        options: [
            "async",
            "await",
            "async and await",
            "delay"
        ],
        answer: "async and await"
    }
];


// ==============================
// QUIZ VARIABLES
// ==============================

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

let timeLeft = 30;
let timer;


// ==============================
// HTML ELEMENTS
// ==============================

const questionNumber = document.getElementById("question-number");
const timerElement = document.getElementById("timer");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");

const resultSection = document.getElementById("result-section");
const scoreElement = document.getElementById("score");

const playerNameInput = document.getElementById("player-name");
const saveScoreButton = document.getElementById("save-score-btn");
const leaderboardElement = document.getElementById("leaderboard");

const cityInput = document.getElementById("city-input");
const searchWeatherButton = document.getElementById("search-weather-btn");

const cityNameElement = document.getElementById("city-name");
const temperatureElement = document.getElementById("temperature");
const weatherConditionElement = document.getElementById("weather-condition");
const humidityElement = document.getElementById("humidity");




// ==============================
// DISPLAY QUESTION
// ==============================

function showQuestion() {

    const current = questions[currentQuestion];

    // Show question number
    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    // Show question
    questionElement.textContent = current.question;

    // Clear previous options
    optionsElement.innerHTML = "";

    // Reset selected answer
    selectedAnswer = null;

    // Create options
    current.options.forEach(option => {

        const optionElement = document.createElement("div");

        optionElement.classList.add("option");

        optionElement.textContent = option;

        // When user clicks an option
        optionElement.addEventListener("click", () => {

            // Remove selection from all options
            document.querySelectorAll(".option").forEach(item => {
                item.classList.remove("selected");
            });

            // Select clicked option
            optionElement.classList.add("selected");

            // Store selected answer
            selectedAnswer = option;
        });

        optionsElement.appendChild(optionElement);
    });

    // Start timer
    startTimer();
}


// ==============================
// TIMER
// ==============================

function startTimer() {

    // Stop previous timer
    clearInterval(timer);

    // Reset time
    timeLeft = 30;

    timerElement.textContent = `Time: ${timeLeft}`;

    // Start countdown
    timer = setInterval(() => {

        timeLeft--;

        timerElement.textContent = `Time: ${timeLeft}`;

        // When time reaches zero
        if (timeLeft <= 0) {

            clearInterval(timer);

            moveToNextQuestion();
        }

    }, 1000);
}


// ==============================
// NEXT BUTTON
// ==============================

nextButton.addEventListener("click", () => {

    moveToNextQuestion();

});


// ==============================
// MOVE TO NEXT QUESTION
// ==============================

function moveToNextQuestion() {

    // Stop timer
    clearInterval(timer);

    // Check answer
    if (selectedAnswer === questions[currentQuestion].answer) {
        score++;
    }

    // Move to next question
    currentQuestion++;

    // Check if questions are remaining
    if (currentQuestion < questions.length) {

        showQuestion();

    } else {

        showResult();
    }
}


// ==============================
// SHOW RESULT
// ==============================

function showResult() {

    // Stop timer
    clearInterval(timer);

    // Clear question
    questionElement.textContent = "";

    // Clear options
    optionsElement.innerHTML = "";

    // Hide next button
    nextButton.style.display = "none";

    // Change question number
    questionNumber.textContent = "Quiz Finished";

    // Remove timer text
    timerElement.textContent = "";

    // Show result section
    resultSection.classList.remove("hidden");

    // Show score
    scoreElement.textContent = score;
}




saveScoreButton.addEventListener("click", () => {

    const playerName = playerNameInput.value.trim();

    // Check if name is entered
    if (playerName === "") {
        alert("Please enter your name.");
        return;
    }

    // Get previous scores from localStorage
    let leaderboard = JSON.parse(
        localStorage.getItem("leaderboard")
    ) || [];

    // Create new score
    const playerScore = {
        name: playerName,
        score: score
    };

    // Add new score
    leaderboard.push(playerScore);

    // Save updated leaderboard
    localStorage.setItem(
        "leaderboard",
        JSON.stringify(leaderboard)
    );

    // Display leaderboard
    displayLeaderboard();

    // Clear name input
    playerNameInput.value = "";

    alert("Score saved successfully!");
});

// ==============================
// DISPLAY LEADERBOARD
// ==============================

function displayLeaderboard() {

    // Get scores from localStorage
    let leaderboard = JSON.parse(
        localStorage.getItem("leaderboard")
    ) || [];

    // Clear current leaderboard
    leaderboardElement.innerHTML = "";

    // Sort scores from highest to lowest
    leaderboard.sort((a, b) => b.score - a.score);

    // Display each player
    leaderboard.forEach(player => {

        const listItem = document.createElement("li");

        listItem.classList.add("leaderboard-item");

        listItem.textContent =
            `${player.name} - ${player.score}/${questions.length}`;

        leaderboardElement.appendChild(listItem);
    });
}


// ==============================
// LOAD LEADERBOARD
// ==============================

displayLeaderboard();




// ==============================
// WEATHER FUNCTION
// ==============================

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    try {

        cityNameElement.textContent = "Loading...";
        temperatureElement.textContent = "--";
        weatherConditionElement.textContent = "--";
        humidityElement.textContent = "--";

        // Find city coordinates
        const locationResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
);

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            cityNameElement.textContent = "City not found";
            return;
        }

        const location = locationData.results[0];

        // Get weather using coordinates
        const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`
);

        const weatherData = await weatherResponse.json();

        // Display weather
        cityNameElement.textContent = location.name;

        temperatureElement.textContent =
            `${weatherData.current.temperature_2m} °C`;

        humidityElement.textContent =
            `${weatherData.current.relative_humidity_2m}%`;

        weatherConditionElement.textContent =
            getWeatherCondition(weatherData.current.weather_code);

    } catch (error) {

        console.error(error);

        cityNameElement.textContent = "Error";
        weatherConditionElement.textContent =
            "Unable to fetch weather data.";
    }
}


// ==============================
// WEATHER BUTTON
// ==============================

searchWeatherButton.addEventListener("click", () => {
    getWeather();
});

cityInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {
        getWeather();
    }

});

// ==============================
// WEATHER CONDITION
// ==============================

function getWeatherCondition(code) {

    const conditions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Light snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Rain showers",
        81: "Moderate rain showers",
        82: "Heavy rain showers",
        85: "Snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Thunderstorm with heavy hail"
    };

    return conditions[code] || "Unknown weather";
}