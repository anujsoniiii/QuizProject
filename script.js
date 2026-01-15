const quizData = [
    { question: "Which of the following is a client-side language?", a: "Java", b: "C", c: "Python", d: "JavaScript", correct: "d" },
    { question: "What does HTML stand for?", a: "HyperText Markup Language", b: "Cascading Style Sheet", c: "Jason Object Notation", d: "Helicopters Terminals Motorboats Lamborghinis", correct: "a" },
    { question: "What year was JavaScript launched?", a: "1996", b: "1995", c: "1994", d: "none of the above", correct: "b" },
    { question: "What does CSS stand for?", a: "HyperText Markup Language", b: "Cascading Style Sheet", c: "Jason Object Notation", d: "Control Style Sheet", correct: "b" },
    { question: "Which tag is used to create a hyperlink in HTML?", a: "<a>", b: "<link>", c: "<href>", d: "<url>", correct: "a" },
    { question: "Which property is used to change the background color in CSS?", a: "color", b: "background-color", c: "bgcolor", d: "background", correct: "b" },
    { question: "Inside which HTML element do we put the JavaScript?", a: "<js>", b: "<javascript>", c: "<script>", d: "<code>", correct: "c" },
    { question: "Which symbol is used for comments in CSS?", a: "// comment", b: "/* comment */", c: "<!-- comment -->", d: "# comment", correct: "b" },
    { question: "Which tag is used to define an image in HTML?", a: "<img>", b: "<picture>", c: "<image>", d: "<src>", correct: "a" },
    { question: "Which CSS property is used to make text bold?", a: "font-style", b: "text-decoration", c: "font-weight", d: "font-bold", correct: "c" }
];

const container = document.querySelector(".container");
container.innerHTML = `
    <div class="col" style="text-align:center;">
        <h2>Enter your name to start the quiz 🎯</h2>
        <input type="text" id="userInput" placeholder="Enter your name" 
            style="padding:10px; width:80%; margin-top:10px; border:1px solid #ccc; border-radius:8px; text-align:center;">
        <br><br>
        <button id="startBtn" style="background:linear-gradient(90deg,#6a11cb,#2575fc); color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;">Start Quiz</button>
    </div>
`;

// Shuffle function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

document.getElementById("startBtn").addEventListener("click", function () {
    const name = document.getElementById("userInput").value.trim();
    if (name === "") {
        alert("Please enter your name to continue!");
        return;
    }
    shuffleArray(quizData); // Randomize question order
    startQuiz(name);
});

function startQuiz(userName) {
    let index = 0, correct = 0, incorrect = 0, total = quizData.length;

    container.innerHTML = `
        <h4 id="timer"></h4>
        <div id="progressBar" style="height:10px;width:0%;background-color:#4b6cb7;transition:width 0.5s;"></div>
        <h4 id="questionProgress" style="text-align:center; margin-bottom:10px; color:#333; font-weight:500;"></h4>
        <div class="col"><h3 id="questionBox"></h3></div>
        <div class="col box"><input name="option" type="radio" id="first" value="a"><label for="first"></label></div>
        <div class="col box"><input name="option" type="radio" id="second" value="b"><label for="second"></label></div>
        <div class="col box"><input name="option" type="radio" id="third" value="c"><label for="third"></label></div>
        <div class="col box"><input name="option" type="radio" id="fourth" value="d"><label for="fourth"></label></div>
        <button id="submit">Submit</button>
    `;

    let questionBox = document.getElementById("questionBox");
    let allInputs = document.querySelectorAll("input[type='radio']");
    let timerDisplay = document.getElementById("timer");
    let progressBar = document.getElementById("progressBar");
    let timer;
    let timeLeft = 10;

    const loadQuestion = () => {
        if (index === total) return quizEnd();
        reset();
        updateQuestionProgress();
        startTimer();
        updateProgress();
        const data = quizData[index];
        questionBox.innerHTML = `${index + 1}) ${data.question}`;
        allInputs[0].nextElementSibling.innerText = data.a;
        allInputs[1].nextElementSibling.innerText = data.b;
        allInputs[2].nextElementSibling.innerText = data.c;
        allInputs[3].nextElementSibling.innerText = data.d;
    };

    function startTimer() {
        clearInterval(timer);
        timeLeft = 10;
        timerDisplay.classList.remove("red");
        timerDisplay.innerText = timeLeft;

        timer = setInterval(() => {
            timeLeft--;

            if (timeLeft <= 3) timerDisplay.classList.add("red");
            else timerDisplay.classList.remove("red");

            timerDisplay.innerText = timeLeft;

            if (timeLeft === 0) {
                clearInterval(timer);
                index++;
                loadQuestion();
            }
        }, 1000);
    }

    function updateProgress() {
        let progressPercent = (index / total) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }

    function updateQuestionProgress() {
        const progressEl = document.getElementById("questionProgress");
        progressEl.innerText = `Question ${index + 1} of ${total}`;
    }

    document.querySelector("#submit").addEventListener("click", function () {
        const data = quizData[index];
        const ans = getAnswer();
        if (!ans) {
            alert("Please select an answer before submitting!");
            return;
        }
        clearInterval(timer);
        allInputs.forEach((inputEl) => {
            let label = inputEl.nextElementSibling;
            if (inputEl.value === data.correct) {
                label.style.color = "green";
            } else if (inputEl.checked && inputEl.value !== data.correct) {
                label.style.color = "red";
            }
        });
        if (ans === data.correct) {
            correct++;
            
        } else {
            incorrect++;
            
        }
        setTimeout(() => {
            index++;
            loadQuestion();
        }, 1000);
    });

    const getAnswer = () => {
        let ans;
        allInputs.forEach((inputEl) => {
            if (inputEl.checked) ans = inputEl.value;
        });
        return ans;
    };

    const reset = () => {
        allInputs.forEach((inputEl) => {
            inputEl.checked = false;
            inputEl.nextElementSibling.style.color = "black";
        });
    };

    const quizEnd = () => {
        clearInterval(timer);
        progressBar.style.width = "100%";

        // Emoji reaction
        let emoji = "";
        const percent = (correct / total) * 100;
        if (percent === 100) emoji = "🏆🎉";
        else if (percent >= 70) emoji = "🎉😊";
        else if (percent >= 50) emoji = "🙂";
        else emoji = "😢";

        container.innerHTML = `
            <div class="col" style="text-align:center;">
                <h2>${emoji} Quiz Completed ${emoji}</h2>
                <h3>Hey ${userName}, you scored ${correct} / ${total}</h3>
                <button onclick="location.reload()" style="padding:10px 20px;margin-top:15px;background-color:#4b6cb7;color:#fff;border:none;border-radius:10px;cursor:pointer;">Restart Quiz</button>
            </div>
        `;

        // Simple emoji confetti for score >= 50%
        if (percent >= 50) {
            for (let i = 0; i < 30; i++) {
                const confetti = document.createElement("div");
                confetti.classList.add("confetti");
                confetti.style.left = Math.random() * window.innerWidth + "px";
                confetti.style.setProperty("--rand-x", Math.random());
                const emojis = ["🎉", "✨", "🎊", "💫", "🌟"];
                confetti.innerText = emojis[Math.floor(Math.random() * emojis.length)];
                document.body.appendChild(confetti);
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }
        }
    };

    loadQuestion();
}
