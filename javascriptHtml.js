document.addEventListener('DOMContentLoaded', function() {
    // Quiz data
    const quizData = [
        {
            question: "What does HTML stand for?",
            options: [" Hyper Text Markup Language" , "High Tech Markup Language","Hyperlink and Text Markup Language"," Home Tool Markup Language"],
            correctAnswer: 0,
            explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.",
        },
        {
            question: "Which HTML tag is used to create a hyperlink??",
            options: ["link"," a","href","hyperlink"],
            correctAnswer: 2,
            explanation: "The <a> tag is used to create hyperlinks in HTML. It stands for anchor.",
        },
        {
            question: "Which of the following is the correct way to comment in HTML?",
            options: ["// This is a comment"," /* This is a comment */"," <!-- This is a comment -- -->","# This is a comment"],
            correctAnswer: 2,
            explanation: "In HTML, comments are written using <!-- comment --> syntax. They are not displayed in the browser.",
        },
        {
            question: "Which of the following is NOT a valid HTML5 element?",
            options: ["<footer>","<section>","<header>","<blink>"],
            correctAnswer: 3,
            explanation: "<blink> is not a valid HTML5 element. It was used in older versions of HTML but is deprecated.",
        },
        {
            question: "Which input type is used for passwords in an HTML form?",
            options: ["<input type=text>","<input type=password>"," <input type=hidden>"," <input type=secure>"],
            correctAnswer: 1,
            explanation: "<input type=password> is used for password fields in HTML forms. It hides the input characters.",
        },
        
    ];

    // DOM elements
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    const progressElement = document.getElementById('progress');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const submitButton = document.getElementById('submit-btn');
    const resultContainer = document.getElementById('result-container');
    const questionContainer = document.getElementById('question-container');
    const scoreElement = document.getElementById('score');
    const maxScoreElement = document.getElementById('max-score');
    const feedbackElement = document.getElementById('feedback');
    const retryButton = document.getElementById('retry-btn');

    // Quiz state
    let currentQuestionIndex = 0;
    let userAnswers = Array(quizData.length).fill(null);
    let score = 0;

    // Initialize quiz
    function initQuiz() {
        totalQuestionsElement.textContent = quizData.length;
        showQuestion();
        updateProgressBar();
        updateNavigationButtons();
    }

    // Display current question
    function showQuestion() {
        const question = quizData[currentQuestionIndex];
        questionElement.textContent = question.question;
        
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            
            if (userAnswers[currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }
            
            optionElement.addEventListener('click', () => selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
        
        currentQuestionElement.textContent = currentQuestionIndex + 1;
    }

    // Handle option selection
    function selectOption(optionIndex) {
        const options = document.querySelectorAll('.option');
        
        options.forEach(option => {
            option.classList.remove('selected');
        });
        
        options[optionIndex].classList.add('selected');
        userAnswers[currentQuestionIndex] = optionIndex;
        updateNavigationButtons();
    }

    // Navigate to next question
    function nextQuestion() {
        if (currentQuestionIndex < quizData.length - 1) {
            currentQuestionIndex++;
            showQuestion();
            updateProgressBar();
            updateNavigationButtons();
        }
    }

    // Navigate to previous question
    function prevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
            updateProgressBar();
            updateNavigationButtons();
        }
    }

    // Update navigation buttons state
    function updateNavigationButtons() {
        prevButton.disabled = currentQuestionIndex === 0;
        
        if (currentQuestionIndex < quizData.length - 1) {
            nextButton.disabled = userAnswers[currentQuestionIndex] === null;
            nextButton.classList.remove('hidden');
            submitButton.classList.add('hidden');
        } else {
            nextButton.classList.add('hidden');
            submitButton.classList.remove('hidden');
            submitButton.disabled = userAnswers[currentQuestionIndex] === null;
        }
    }

    // Update progress bar
    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
        progressElement.style.width = `${progress}%`;
    }

    // Calculate and display results
    function showResults() {
        score = 0;
        let feedbackHTML = '';
        
        quizData.forEach((question, index) => {
            const isCorrect = userAnswers[index] === question.correctAnswer;
            if (isCorrect) {
                score++;
            }
            
            feedbackHTML += `
                <div class="feedback-item">
                    <h3>Question ${index + 1}: ${question.question}</h3>
                    <p class="${isCorrect ? 'correct' : 'incorrect'}">
                        Your answer: ${question.options[userAnswers[index]] || 'Not answered'}
                    </p>
                    <p>Correct answer: ${question.options[question.correctAnswer]}</p>
                    <p class="explanation">${question.explanation}</p>
                </div>
            `;
        });
        
        questionContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        scoreElement.textContent = score;
        maxScoreElement.textContent = quizData.length;
        feedbackElement.innerHTML = feedbackHTML;
    }

    // Reset quiz
    function resetQuiz() {
        currentQuestionIndex = 0;
        userAnswers = Array(quizData.length).fill(null);
        score = 0;
        
        questionContainer.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        
        showQuestion();
        updateProgressBar();
        updateNavigationButtons();
    }

    // Event listeners
    nextButton.addEventListener('click', nextQuestion);
    prevButton.addEventListener('click', prevQuestion);
    submitButton.addEventListener('click', showResults);
    retryButton.addEventListener('click', resetQuiz);

    // Initialize the quiz
    initQuiz();
});