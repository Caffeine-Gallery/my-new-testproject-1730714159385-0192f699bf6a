import { backend } from 'declarations/backend';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('.keypad button, #clear');
let currentInput = '';
let currentOperation = null;
let previousInput = null;

buttons.forEach(button => {
    button.addEventListener('click', () => handleButtonClick(button.textContent));
});

async function handleButtonClick(value) {
    if (value === 'C') {
        clearCalculator();
    } else if (value === '=') {
        await calculateResult();
    } else if (['+', '-', '*', '/'].includes(value)) {
        setOperation(value);
    } else {
        appendNumber(value);
    }
    updateDisplay();
}

function clearCalculator() {
    currentInput = '';
    currentOperation = null;
    previousInput = null;
}

function appendNumber(number) {
    if (number === '.' && currentInput.includes('.')) return;
    currentInput += number;
}

function setOperation(operation) {
    if (currentInput === '') return;
    if (previousInput !== null) {
        calculateResult();
    }
    currentOperation = operation;
    previousInput = currentInput;
    currentInput = '';
}

async function calculateResult() {
    if (previousInput === null || currentOperation === null || currentInput === '') return;

    const num1 = parseFloat(previousInput);
    const num2 = parseFloat(currentInput);

    try {
        let result;
        switch (currentOperation) {
            case '+':
                result = await backend.add(num1, num2);
                break;
            case '-':
                result = await backend.subtract(num1, num2);
                break;
            case '*':
                result = await backend.multiply(num1, num2);
                break;
            case '/':
                if (num2 === 0) throw new Error('Division by zero');
                result = await backend.divide(num1, num2);
                break;
        }
        currentInput = result.toString();
        currentOperation = null;
        previousInput = null;
    } catch (error) {
        currentInput = 'Error';
    }
}

function updateDisplay() {
    display.value = currentInput;
}

// Initialize display
updateDisplay();
