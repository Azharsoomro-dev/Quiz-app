
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showTab(tab) {
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('signupTab').classList.remove('active');

    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.remove('active');

    if (tab === 'login') {
        document.getElementById('loginTab').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.getElementById('signupTab').classList.add('active');
        document.getElementById('signupForm').classList.add('active');
    }
}


function handleSignup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    if (!name || !email || !password) {
        return Swal.fire({ icon: 'error', title: 'Error', text: 'Please fill all fields!' });
    }

    if (!email.includes('@')) {
        return Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email!' });
    }

    const userData = { name, email, password };
    localStorage.setItem('Userdata', JSON.stringify(userData));

    Swal.fire({
        icon: 'success', title: 'Signup Successful!',
        text: 'Your account has been created successfully.', confirmButtonColor: '#667eea'
    });

    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';

    showScreen('dashboardScreen');
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    let saveduser = JSON.parse(localStorage.getItem('Userdata'));

    if (!email || !password)
        return Swal.fire({ icon: 'error', title: 'Error', text: 'Please fill all fields!' });

    if (!saveduser)
        return Swal.fire({ icon: 'error', title: 'No Account Found', text: 'Please sign up first!' });

    if (email === saveduser.email && password === saveduser.password) {
        Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'Welcome back, ' + saveduser.name + '!',
            confirmButtonColor: '#667eea'
        }).then(() => {
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
            showScreen('dashboardScreen');
        });
    } else {
        Swal.fire({ icon: 'error', title: 'Login Failed', text: 'Incorrect email or password!' });
    }

}

const quizdata = {

    html: [
        { question: "What is the full form of HTML?", options: ["Hyper Text Markup Language", "High Transfer Markup", "Hyper Text Machine Language", "Hyperlinks Text Managing"], answer: 0 },
        { question: "What does the <br> tag do?", options: ["Bold text", "New line", "Insert image", "Make border"], answer: 1 },
        { question: "What is the <a> tag used for?", options: ["Audio", "Link", "Heading", "List"], answer: 1 },
        { question: "What type of tag is <img>?", options: ["Closing tag", "Container tag", "Empty tag", "Block tag"], answer: 2 },
        { question: "What is the extension of an HTML file?", options: [".ht", ".html", ".doc", ".script"], answer: 1 },
        { question: "Which is the correct heading tag?", options: ["<h>", "<head>", "<h1>", "<heading>"], answer: 2 },
        { question: "How are HTML comments written?", options: ["// comment", "/* comment */", "<!-- comment -->", "# comment"], answer: 2 },
        { question: "Which tag is used for a line break?", options: ["<break>", "<lb>", "<br>", "<line>"], answer: 2 },
        { question: "Which tag is used for an ordered list?", options: ["<ul>", "<ol>", "<list>", "<order>"], answer: 1 },
        { question: "Where is the <title> tag written?", options: ["Body", "Footer", "Head", "Outside HTML"], answer: 2 }
    ],


    css: [
        { question: "What is the full form of CSS?", options: ["Cascading Style Sheet", "Creative Style Sheet", "Coding Style System", "Color Styling Sheet"], answer: 0 },
        { question: "Which property is used to change text color?", options: ["font", "color", "text", "paint"], answer: 1 },
        { question: "Which property is used for background color?", options: ["bg", "background-color", "color-bg", "back"], answer: 1 },
        { question: "What does padding mean?", options: ["Inner space", "Outer space", "Border", "Font size"], answer: 0 },
        { question: "Which tag is used to link a CSS file?", options: ["<css>", "<script>", "<link>", "<style>"], answer: 2 },
        { question: "Which property sets the border?", options: ["line", "border", "stroke", "outline"], answer: 1 },
        { question: "How to center align text?", options: ["text-align: middle", "text-align: center", "align: center", "center: text"], answer: 1 },
        { question: "Which is the height property?", options: ["size", "height", "h", "block-size"], answer: 1 },
        { question: "How are CSS comments written?", options: ["<!-- -->", "//", "#", "/* */"], answer: 3 },
        { question: "Which is a valid font-size unit?", options: ["px", "cm", "kg", "sec"], answer: 0 }
    ],

    javascript: [
        { question: "What is JavaScript used for?", options: ["Styling", "Structure", "Functionality", "Database"], answer: 2 },
        { question: "Which keyword is used to declare a variable?", options: ["int", "var", "declare", "dim"], answer: 1 },
        { question: "What is the console output command?", options: ["print()", "console.log()", "log.console()", "echo()"], answer: 1 },
        { question: "Which is the correct array syntax?", options: ["{}", "[]", "()", "<>"], answer: 1 },
        { question: "How do you call a function?", options: ["run()", "function call", "functionName()", "execute()"], answer: 2 },
        { question: "What is the datatype for a string in JavaScript?", options: ["str", "text", "string", "sentence"], answer: 2 },
        { question: "Which is the strict equality operator?", options: ["==", "===", "!=", "="], answer: 1 },
        { question: "Which of the following are loops?", options: ["for", "while", "do-while", "All"], answer: 3 },
        { question: "How do you get the length of an array?", options: ["arr.count", "arr.size", "arr.length", "len(arr)"], answer: 2 },
        { question: "Which method is used for event listeners?", options: ["addEvent()", "onEvent()", "addEventListener()", "listen()"], answer: 2 }
    ]

};
let currentQuiz = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 10;
let currentCategory = "";
let selected = -1;

function startQuiz(type) {
    currentCategory = type;
    currentQuiz = quizdata[type];
    currentIndex = 0;
    score = 0;

    document.getElementById("quizType").innerText = type.toUpperCase();

    showScreen("quizScreen");
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timer);

    timeLeft = 10;
    document.getElementById("timeLeft").innerText = timeLeft;
    startTimer();

    let q = currentQuiz[currentIndex];

    document.getElementById("currentQ").innerText = currentIndex + 1;
    document.getElementById("questionText").innerText = q.question;

    const optionsContainer = document.getElementById("optionsContainer");
    optionsContainer.innerHTML = "";

    q.options.forEach((opt, i) => {
        let div = document.createElement("div");
        div.classList.add("option");
        div.innerText = opt;
        div.onclick = () => selectOption(div, i);
        optionsContainer.appendChild(div);
    });

    document.getElementById("nextBtn").disabled = true;
}

function selectOption(div, index) {

    selected = index;

    const correctIndex = currentQuiz[currentIndex].answer;
    const options = document.querySelectorAll(".option");


    options.forEach(op => op.style.pointerEvents = "none");


    if (index !== correctIndex) div.classList.add("wrong");
    options[correctIndex].classList.add("correct");

    document.getElementById("nextBtn").disabled = false;
}


function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timeLeft").innerText = timeLeft;

        let timerElement = document.getElementById("timer");

        if (timeLeft <= 3) {
            timerElement.classList.add("warning");
            timerElement.classList.remove("normal");
        } else {
            timerElement.classList.add("normal");
            timerElement.classList.remove("warning");
        }

        if (timeLeft === 0) {
            clearInterval(timer);
            handleNext();
        }
    }, 1000);
}

function handleNext() {
    let correctAnswer = currentQuiz[currentIndex].answer;

    if (selected === correctAnswer) score++;

    selected = -1;
    currentIndex++;

    if (currentIndex >= currentQuiz.length) {
        showResult();
    } else {
        loadQuestion();
    }
}

function showResult() {
    document.getElementById("finalScore").innerText = `${score}/${currentQuiz.length}`;
    document.getElementById("finalPercentage").innerText =
        `${Math.round((score / currentQuiz.length) * 100)}%`;

    const header = document.getElementById("resultHeader");
    const msg = document.getElementById("resultMessage");

    if (score >= currentQuiz.length * 0.8) {
        header.className = "result-header excellent";
        msg.innerText = "Excellent Job!";
    } else if (score >= currentQuiz.length * 0.5) {
        header.className = "result-header good";
        msg.innerText = "Good Effort!";
    } else {
        header.className = "result-header tryagain";
        msg.innerText = "Try Again!";
    }

    saveScore(currentCategory, score);
    showScreen("resultScreen");
}

function saveScore(category, score) {
    localStorage.setItem("lastScore", score);

    const highKey = category + "_highscore";
    const oldHigh = localStorage.getItem(highKey);

    if (!oldHigh || score > oldHigh) {
        localStorage.setItem(highKey, score);
    }
}


const categorySelect = document.getElementById("categorySelect");

categorySelect.addEventListener("change", () => {
    localStorage.setItem("lastCategory", categorySelect.value);
    displaySavedScores(categorySelect.value);
});

window.addEventListener("load", () => {
    const last = localStorage.getItem("lastCategory");
    if (last) categorySelect.value = last;
    displaySavedScores(categorySelect.value);
});

function displaySavedScores(category) {
    const high = localStorage.getItem(category + "_highscore") || 0;
    const last = localStorage.getItem("lastScore") || 0;

    document.querySelector("#highscore").innerText = "High Score: " + high;
    document.querySelector("#lastscore").innerText = "Last Score: " + last;
}

function resetQuiz() {
    showScreen("welcomescreen");
}
