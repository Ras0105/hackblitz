document.addEventListener('DOMContentLoaded', function() {
    // Quiz data
    const quizData = [
        {
            question: "What is JavaScript primarily used for?",
            options: [" Creating stylesheets","Adding interactivity to web pages","Structuring web content","Storing data"],
            correctAnswer: 1,
            explanation: "JavaScript is primarily used for adding interactivity and dynamic behavior to web pages.",
        },
        {
            question: "Which keyword is used to declare a variable in JavaScript?",
            options: ["var","let","const","All of the above"],
            correctAnswer: 3,
            explanation: "All of the above keywords (var, let, const) are used to declare variables in JavaScript. var is function-scoped, let and const are block-scoped.",
        },
        {
            question: "What will typeof null return?",
            options: ["object","null","undefined","string"],
            correctAnswer: 0,
            explanation: "typeof null returns 'object'. This is a known quirk in JavaScript.",
        },
        {
            question: "Which of the following is a JavaScript data type?",
            options: ["String","Number","Boolean","All of the above"],
            correctAnswer: 3,
            explanation: "All of the above are valid JavaScript data types.",
        },
        {
            question: "Which function is used to print something in the browser console?",
            options: ["console.log()","print()","alert()","document.write()"],
            correctAnswer: 0,
            explanation: "console.log() is used to print messages to the browser console for debugging purposes.",
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