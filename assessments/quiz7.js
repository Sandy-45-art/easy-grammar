// Import Firebase modules
import { db, auth } from '../public/firebase.js'; // Adjust the path if necessary
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Define quiz data
const quizData = [
    {
        question: 'Which punctuation mark is used at the end of a sentence?',
        options: ['Comma (,)', 'Period (.)', 'Question Mark (?)', 'Exclamation Mark (!)'],
        answer: 'Period (.)',
    },
    {
        question: 'Which punctuation mark is used to show excitement or strong feelings?',
        options: ['Period (.)', 'Comma (,)', 'Exclamation Mark (!)', 'Colon (:)'],
        answer: 'Exclamation Mark (!)',
    },
    {
        question: 'What punctuation mark do you use to ask a question?',
        options: ['Period (.)', 'Semicolon (;)', 'Question Mark (?)', 'Comma(,)'],
        answer: 'Question Mark (?)',
    },
    {
        question: 'Which punctuation mark is used to separate items in a list?',
        options: ['Comma (,)', 'Period (.)', 'Colon (:)', 'Dash (—)'],
        answer: 'Comma (,)',
    },
    {
        question: 'Which punctuation mark is used to show what someone said?',
        options: ['Parentheses ( )', 'Quotation Marks (" ")', 'Semicolon (;)', 'Colon (:)'],
        answer: 'Quotation Marks (" ")',
    },
    {
        question: 'Which punctuation mark is used to connect two related sentences?',
        options: ['Comma (,)', 'Dash (—)', 'Semicolon (;)', 'Period(.)'],
        answer: 'Semicolon (;)',
    },
    {
        question: 'Which punctuation mark is used to show that something belongs to someone?',
        options: ['Exclamation Mark(!)', 'Comma(,)', 'Period(.)', 'Apostrophe'],
        answer: 'Apostrophe',
    },
    {
        question: 'Which punctuation mark introduces a list or explanation?',
        options: ['Colon(:)', 'Question Mark(?)', 'Semicolon(;)', 'Quotation Marks(" ")'],
        answer: 'Colon(:)',
    },
    {
        question: 'Which punctuation mark is used to add extra information in a sentence?',
        options: ['Period(.)', 'Parentheses ( )', 'Dash (—)', 'Comma (,)'],
        answer: 'Parentheses ( )',
    },
    {
        question: 'Which punctuation mark shows a pause in a sentence?',
        options: ['Period (.)', 'Semicolon(;)', 'Dash (—)', 'Comma (,)'],
        answer: 'Comma (,)',
    },
];

// HTML elements
const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const submitButton = document.getElementById('submit');
const retryButton = document.getElementById('retry');
const showAnswerButton = document.getElementById('showAnswer');

// State variables
let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];
const topic = "Punctuations";

// Shuffle function for options
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Display the current question
function displayQuestion() {
    const questionData = quizData[currentQuestion];

    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.innerHTML = questionData.question;

    const optionsElement = document.createElement('div');
    optionsElement.className = 'options';

    const shuffledOptions = [...questionData.options];
    shuffleArray(shuffledOptions);

    for (let i = 0; i < shuffledOptions.length; i++) {
        const option = document.createElement('label');
        option.className = 'option';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'quiz';
        radio.value = shuffledOptions[i];

        const optionText = document.createTextNode(shuffledOptions[i]);

        option.appendChild(radio);
        option.appendChild(optionText);
        optionsElement.appendChild(option);
    }

    quizContainer.innerHTML = '';
    quizContainer.appendChild(questionElement);
    quizContainer.appendChild(optionsElement);
}

// Check the answer and handle scoring
function checkAnswer() {
    const selectedOption = document.querySelector('input[name="quiz"]:checked');
    if (selectedOption) {
        const answer = selectedOption.value;
        if (answer === quizData[currentQuestion].answer) {
            score++;
        } else {
            incorrectAnswers.push({
                question: quizData[currentQuestion].question,
                incorrectAnswer: answer,
                correctAnswer: quizData[currentQuestion].answer,
            });
        }
        currentQuestion++;
        selectedOption.checked = false;
        if (currentQuestion < quizData.length) {
            displayQuestion();
        } else {
            displayResult();
            saveScoreToFirestore(); // Save score to Firestore
        }
    }
}

// Display the result and answers
function displayResult() {
    quizContainer.style.display = 'none';
    submitButton.style.display = 'none';
    retryButton.style.display = 'inline-block';
    showAnswerButton.style.display = 'inline-block';
    resultContainer.innerHTML = `You scored ${score} out of ${quizData.length}!`;
}

// Retry the quiz
function retryQuiz() {
    currentQuestion = 0;
    score = 0;
    incorrectAnswers = [];
    quizContainer.style.display = 'block';
    submitButton.style.display = 'inline-block';
    retryButton.style.display = 'none';
    showAnswerButton.style.display = 'none';
    resultContainer.innerHTML = '';
    displayQuestion();
}

// Show incorrect answers
function showAnswer() {
    quizContainer.style.display = 'none';
    submitButton.style.display = 'none';
    retryButton.style.display = 'inline-block';
    showAnswerButton.style.display = 'none';

    let incorrectAnswersHtml = '';
    for (let i = 0; i < incorrectAnswers.length; i++) {
        incorrectAnswersHtml += `
<p>
<strong>Question:</strong> ${incorrectAnswers[i].question}<br>
<strong>Your Answer:</strong> ${incorrectAnswers[i].incorrectAnswer}<br>
<strong>Correct Answer:</strong> ${incorrectAnswers[i].correctAnswer}
</p>
`;
    }

    resultContainer.innerHTML = `
<p>You scored ${score} out of ${quizData.length}!</p>
<p>Incorrect Answers:</p>
${incorrectAnswersHtml}
`;
}

// Save the quiz score to Firestore
async function saveScoreToFirestore() {
    try {
        const user = auth.currentUser; // Get the current user
        if (user) {
            await addDoc(collection(db, 'quizScores'), {
                userId: user.uid,
                topic: topic,
                score: score,
                timestamp: serverTimestamp()
            });
            console.log("Score successfully saved to Firestore!");
        } else {
            console.log("User not authenticated. Score not saved.");
        }
    } catch (error) {
        console.error("Error saving score to Firestore: ", error);
    }
}

// Event listeners
submitButton.addEventListener('click', checkAnswer);
retryButton.addEventListener('click', retryQuiz);
showAnswerButton.addEventListener('click', showAnswer);

document.addEventListener('DOMContentLoaded', () => {
    displayQuestion();
});