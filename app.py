from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    num1 = data.get('num1')
    num2 = data.get('num2')
    operator = data.get('operator')

    try:
        num1 = float(num1)
        num2 = float(num2)
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid numbers provided'}), 400

    if operator == '+':
        result = num1 + num2
    elif operator == '-':
        result = num1 - num2
    elif operator == '*':
        result = num1 * num2
    elif operator == '/':
        if num2 == 0:
            return jsonify({'error': 'Division by zero is not allowed'}), 400
        result = num1 / num2
    else:
        return jsonify({'error': 'Invalid operator'}), 400

    # Return integer if result is whole number
    if result == int(result):
        result = int(result)

    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
