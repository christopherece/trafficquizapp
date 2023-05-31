const date = new Date();
document.querySelector('.year').innerHTML = date.getFullYear();


let questions = document.querySelectorAll('.question');
const nextBtns = document.querySelectorAll('.nextBtn');
const submitBtn = document.querySelector('#submitBtn');

let currentQuestion = 0;
let score = 0;


function showQuestion(index) {
    questions[currentQuestion].classList.remove('active');
    questions[index].classList.add('active');
    currentQuestion = index;
}

function handleNextClick() {
    if (currentQuestion < questions.length - 1) {
        const selectedOption = document.querySelector('input[type="radio"]:checked');
        console.log(selectedOption);

        if (selectedOption) {
            showQuestion(currentQuestion + 1);
        } else {
            alert('Please select an option before proceeding.');
        }
    } else {
        submitBtn.style.display = 'block';
        nextBtns.forEach(btn => btn.style.display = 'none');
    }
    
    // Check if a radio button is selected
    const radioSelected = document.querySelector('input[type="radio"]:checked');
    if (radioSelected) {
        // Get the name of the radio button
        const radioName = radioSelected.name;
        console.log(radioName);
    }
}



function showResult() {
    // Redirect to the result page with parameters
    const url = `/result/${score}/${questions.length}/${encodeURIComponent(JSON.stringify(correctAnswers))}`;
    window.location.href = url;
}

function calculateScore() {
    const options = document.querySelectorAll(`input[name^="q"]`);
    score = 0;
    correctAnswers = [];

    options.forEach(option => {
        if (option.checked && option.dataset.correct === "True") {
            score++;
            correctAnswers.push(option.value);
        }
    });
}

function handleFormSubmit() {
    // Calculate the score and correct answers
    calculateScore();

    // Make an AJAX request to submit the quiz form
    fetch("{% url 'submit_quiz' %}", {
        method: 'POST',
        body: new FormData(document.getElementById('quizForm'))
    })
    .then(response => response.json())
    .then(data => {
        showResult();
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });
}

function attachNextButtonListeners() {
    nextBtns.forEach(btn => btn.addEventListener('click', handleNextClick));
}

submitBtn.addEventListener('click', handleFormSubmit);
showQuestion(0);  // Show the first question initially
attachNextButtonListeners(); // Attach event listeners to the initial next buttons