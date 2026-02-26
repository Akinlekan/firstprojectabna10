document.addEventListener('DOMContentLoaded', function () {
    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const resultDisplay = document.getElementById('result');
    const expressionDisplay = document.getElementById('expression');
    const errorMessage = document.getElementById('errorMessage');
    const calculateBtn = document.getElementById('calculateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const operatorBtns = document.querySelectorAll('.operator-btn');

    let selectedOperator = null;

    // Operator button selection
    operatorBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            operatorBtns.forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            selectedOperator = btn.getAttribute('data-op');
            clearError();
        });
    });

    // Calculate button
    calculateBtn.addEventListener('click', function () {
        performCalculation();
    });

    // Allow Enter key to trigger calculation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            performCalculation();
        }
    });

    // Clear button
    clearBtn.addEventListener('click', function () {
        num1Input.value = '';
        num2Input.value = '';
        resultDisplay.textContent = '0';
        expressionDisplay.textContent = '';
        operatorBtns.forEach(function (b) {
            b.classList.remove('active');
        });
        selectedOperator = null;
        clearError();
    });

    function performCalculation() {
        clearError();

        const num1 = num1Input.value.trim();
        const num2 = num2Input.value.trim();

        if (num1 === '') {
            showError('Please enter the first number.');
            num1Input.focus();
            return;
        }

        if (num2 === '') {
            showError('Please enter the second number.');
            num2Input.focus();
            return;
        }

        if (!selectedOperator) {
            showError('Please select an operator (+, −, ×, ÷).');
            return;
        }

        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                num1: num1,
                num2: num2,
                operator: selectedOperator
            })
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.error) {
                showError(data.error);
                resultDisplay.textContent = 'Error';
                expressionDisplay.textContent = '';
            } else {
                const opSymbol = getSymbol(selectedOperator);
                expressionDisplay.textContent = num1 + ' ' + opSymbol + ' ' + num2 + ' =';
                resultDisplay.textContent = data.result;
            }
        })
        .catch(function () {
            showError('Something went wrong. Please try again.');
        });
    }

    function getSymbol(op) {
        switch (op) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            default: return op;
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
    }

    function clearError() {
        errorMessage.textContent = '';
    }
});
