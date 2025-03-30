document.addEventListener('DOMContentLoaded', function() {
    // Quiz data
    const quizData = [
        {
            question: "What does CSS stand for?",
            options: [" Creative Style Sheets","Cascading Style Sheets","Computer Style Sheets","Colorful Style Sheets"],
            correctAnswer: 1,
            explanation: "CSS stands for Cascading Style Sheets. It is used to style HTML documents.",
        },
        {
            question: "Which HTML tag is used to link an external CSS file?",
            options: ["<css","<link>","<stylesheet>","<style>"],
            correctAnswer: 1,
            explanation: "The <link> tag is used to link an external CSS file to an HTML document. It is placed in the <head> section.",
        },
        {
            question: "Which CSS property is used to change the text color of an element?",
            options: ["fgcolor","color","text-color","font-color"," color"],
            correctAnswer: 3,
            explanation: "The color property is used to change the text color of an element in CSS.",
        },
        {
            question: "Which property is used to set the background color in CSS?",
            options: ["background-color","bgcolor","background","color"],
            correctAnswer: 0,
            explanation: "The background-color property is used to set the background color of an element in CSS.",
        },
        {
            question: "Which CSS property controls the text size??",
            options: ["font-size","text-size","text-style","font-style"],
            correctAnswer: 0,
            explanation: "The font-size property is used to control the size of the text in CSS.",
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