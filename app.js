let Questions = [];
const ques = document.getElementById("ques");

// Fetch questions from the API
async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        if (!response.ok) {
            throw new Error('Something went wrong!! Unable to fetch the data');
        }
        const data = await response.json();
        Questions = data.results;
        loadQues();
    } catch (error) {
        console.log(error);
        ques.innerHTML = `<h5 style='color: red'>${error}</h5>`;
    }
}

fetchQuestions();

let currQuestion = 0; // Current question index
let score = 0; // User's score

// Function to load a question and its options
function loadQues() {
    if (Questions.length === 0) {
        ques.innerHTML = '<h5>Please Wait!! Loading Questions...</h5>';
        return;
    }

    const opt = document.getElementById("opt");
    const feedback = document.getElementById("feedback");
    feedback.innerHTML = ""; // Clear previous feedback
    feedback.className = "feedback"; // Reset feedback class

    let currentQuestion = Questions[currQuestion].question;
    currentQuestion = currentQuestion.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
    ques.innerText = currentQuestion;

    opt.innerHTML = "";
    const correctAnswer = Questions[currQuestion].correct_answer;
    const incorrectAnswers = Questions[currQuestion].incorrect_answers;
    const options = [correctAnswer, ...incorrectAnswers];
    options.sort(() => Math.random() - 0.5); // Shuffle options

    options.forEach((option) => {
        option = option.replace(/&quot;/g, '"').replace(/&#039;/g, "'");

        const choiceId = `option${Math.random().toString(36).substr(2, 9)}`;

        const choicesdiv = document.createElement("div");
        choicesdiv.classList.add("option");

        const choice = document.createElement("input");
        choice.type = "radio";
        choice.name = "answer";
        choice.value = option;
        choice.id = choiceId;
        choice.addEventListener('change', () => {
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            choicesdiv.classList.add('selected');
            console.log('Selected option:', choicesdiv);
        });

        const choiceLabel = document.createElement("label");
        choiceLabel.htmlFor = choiceId;
        choiceLabel.textContent = option;

        choicesdiv.appendChild(choice);
        choicesdiv.appendChild(choiceLabel);
        opt.appendChild(choicesdiv);
    });
}

// Function to load the final score
function loadScore() {
    const totalScore = document.getElementById("score");
    totalScore.textContent = `You scored ${score} out of ${Questions.length}`;
    totalScore.innerHTML += "<h3>All Answers</h3>";
    Questions.forEach((el, index) => {
        totalScore.innerHTML += `<p>${index + 1}. ${el.correct_answer}</p>`;
    });
}

// Function to load the next question or end the quiz
function nextQuestion() {
    if (currQuestion < Questions.length - 1) {
        currQuestion++;
        loadQues();
    } else {
        document.getElementById("opt").remove();
        document.getElementById("ques").remove();
        document.getElementById("btn").remove();
        loadScore();
    }
}

// Function to load the previous question
function previousQuestion() {
    if (currQuestion > 0) {
        currQuestion--;
        loadQues();
    }
}

// Function to check the selected answer
function checkAns() {
    const selectedAns = document.querySelector('input[name="answer"]:checked');
    if (!selectedAns) {
        alert('Please select an answer!');
        return;
    }

    const feedback = document.getElementById("feedback");
    if (selectedAns.value === Questions[currQuestion].correct_answer) {
        feedback.textContent = "Correct!";
        feedback.classList.add('correct');
    } else {
        feedback.textContent = `Wrong! The correct answer was: ${Questions[currQuestion].correct_answer}`;
        feedback.classList.add('wrong');
    }
}
