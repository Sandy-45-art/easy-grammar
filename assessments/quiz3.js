// Import Firebase modules
import { db, auth } from '../public/firebase.js'; // Adjust the path if necessary
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Define quiz data
const quizData = [
    {
        question: 'Which adjective describes the noun "elephant"? "The elephant is _____."',
        options: ['Small', 'Red', 'Big', 'Fast'],
        answer: 'Big',
    },
    {
        question: 'Which adjective describes how someone feels when they are smiling? "She is feeling _____."',
        options: ['Sad', 'Happy', 'Soft', 'Big'],
        answer: 'Happy',
    },
    {
        question: 'Which adjective describes the noun "pillow"? "The pillow is _____."',
        options: ['Hard', 'Rough', 'Soft', 'Big'],
        answer: 'Soft',
    },
    {
        question: 'Which adjective would you use to describe a mouse? "The mouse is _____."',
        options: ['Big', 'Small', 'Red', 'Sad'],
        answer: 'Small',
    },
    {
        question: 'Which adjective describes the color of an apple? "The apple is _____."',
        options: ['Blue', 'Green', 'Red', 'Yellow'],
        answer: 'Red',
    },
    {
        question: 'Which adjective describes how someone feels when they are not happy? "He is feeling _____."',
        options: ['Big', 'Sad', 'Small', 'Soft'],
        answer: 'Sad',
    },
    {
        question: 'Which adjective would best describe a car that moves very quickly? "The car is _____."',
        options: ['Slow', 'Fast', 'Big', 'Soft'],
        answer: 'Fast',
    },
    {
        question: 'Which adjective describes the noun "rock"? "The rock is _____."',
        options: ['Soft', 'Hard', 'Small', 'Happy'],
        answer: 'Hard',
    },
    {
        question: 'Which adjective would you use to describe the sun? "The sun is _____."',
        options: ['Cold', 'Happy', 'Hot', 'Soft'],
        answer: 'Hot',
    },
    {
        question: 'Which adjective would best describe a feather? "The feather is _____."',
        options: ['Soft', 'Hard', 'Big', 'Fast'],
        answer: 'Soft',
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
const topic = "Adjectives";

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