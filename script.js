let display = document.getElementById('display');
let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        if (currentInput === '0') {
            currentInput = num;
        } else {
            currentInput += num;
        }
    }
    updateDisplay();
}

function appendOperator(op) {
    if (op === '.') {
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
    } else {
        if (operator !== null && !shouldResetDisplay) {
            calculate();
        }
        previousInput = currentInput;
        operator = op;
        shouldResetDisplay = true;
    }
    updateDisplay();
}

function calculate() {
    if (operator === null || previousInput === '') return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero!');
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    result = Math.round(result * 10000000) / 10000000;
    
    currentInput = result.toString();
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function formatIndianNumber(numStr) {
    if (numStr === '' || numStr === null || numStr === undefined) return '0';
    // Preserve sign
    let sign = '';
    if (numStr[0] === '-') {
        sign = '-';
        numStr = numStr.slice(1);
    }

    // Split integer and fraction
    const parts = numStr.split('.');
    let intPart = parts[0] || '0';
    const fracPart = parts[1] !== undefined ? '.' + parts[1] : '';

    // If intPart is small, just return
    if (intPart.length <= 3) return sign + intPart + fracPart;

    const last3 = intPart.slice(-3);
    let rest = intPart.slice(0, -3);
    // Insert commas every 2 digits from the right in the 'rest' part
    rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return sign + rest + ',' + last3 + fracPart;
}

function updateDisplay() {
    // Show Indian-style grouped number in the display, but keep currentInput as-is
    display.value = formatIndianNumber(currentInput);
}

function calculateSquareRoot() {
    const num = parseFloat(currentInput);
    if (num < 0) {
        alert('Cannot calculate square root of negative number!');
        return;
    }
    currentInput = Math.sqrt(num).toString();
    shouldResetDisplay = true;
    updateDisplay();
}

function calculatePercentage() {
    const num = parseFloat(currentInput);
    currentInput = (num / 100).toString();
    shouldResetDisplay = true;
    updateDisplay();
}

// Initialize display
updateDisplay();

// Allow keyboard input
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendOperator('.');
    if (e.key === '+' || e.key === '-') appendOperator(e.key);
    if (e.key === '*') {
        e.preventDefault();
        appendOperator('*');
    }
    if (e.key === '/') {
        e.preventDefault();
        appendOperator('/');
    }
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    }
    if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
    }
    if (e.key === 'Escape') {
        clearDisplay();
    }
});
