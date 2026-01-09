// Math Problem Generator for Grades 5-15

class MathProblemGenerator {
    constructor(grade = 10) {
        this.grade = grade;
        this.difficulty = 'medium';
        this.currentProblem = null;
        this.currentAnswer = null;
    }

    setGrade(grade) {
        this.grade = parseInt(grade);
    }

    setDifficulty(level) {
        this.difficulty = level;
    }

    generateProblem() {
        // Problem types based on grade - simplified for wider range
        let problemTypes = [];

        if (this.grade >= 5) {
            problemTypes.push('arithmetic', 'geometry');
        }
        if (this.grade >= 6) {
            problemTypes.push('percentage', 'sequences');
        }
        if (this.grade >= 7) {
            problemTypes.push('algebra');
        }
        if (this.grade >= 9) {
            problemTypes.push('powers');
        }
        if (this.grade >= 10) {
            problemTypes.push('quadratic', 'trigonometry');
        }
        if (this.grade >= 12) {
            problemTypes.push('advancedAlgebra', 'calculus');
        }

        const type = problemTypes[Math.floor(Math.random() * problemTypes.length)];
        let problem;

        switch (type) {
            case 'algebra':
                problem = this.generateAlgebra();
                break;
            case 'quadratic':
                problem = this.generateQuadratic();
                break;
            case 'arithmetic':
                problem = this.generateArithmetic();
                break;
            case 'geometry':
                problem = this.generateGeometry();
                break;
            case 'trigonometry':
                problem = this.generateTrigonometry();
                break;
            case 'sequences':
                problem = this.generateSequences();
                break;
            case 'percentage':
                problem = this.generatePercentage();
                break;
            case 'powers':
                problem = this.generatePowers();
                break;
            case 'advancedAlgebra':
                problem = this.generateAdvancedAlgebra();
                break;
            case 'calculus':
                problem = this.generateCalculus();
                break;
            default:
                problem = this.generateArithmetic();
        }

        this.currentProblem = problem;
        return problem;
    }

    generateAlgebra() {
        // Simplified linear equations for grades 7+
        const a = Math.floor(Math.random() * 5) + 2;  // 2-6 instead of 2-10
        const b = Math.floor(Math.random() * 10) - 5;  // -5 to 4 instead of -10 to 9
        const x = Math.floor(Math.random() * 8) + 1;  // 1-8 instead of 1-10
        const c = a * x + b;

        this.currentAnswer = x;
        return {
            question: `Solve for x: ${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}`,
            answer: x,
            type: 'Algebra'
        };
    }

    generateQuadratic() {
        // Simple quadratic: x^2 = n
        const n = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169][Math.floor(Math.random() * 12)];
        const x = Math.sqrt(n);

        this.currentAnswer = x;
        return {
            question: `Find positive value of x: x² = ${n}`,
            answer: x,
            type: 'Quadratic'
        };
    }

    generateArithmetic() {
        const operations = [
            () => {
                // Simplified addition/subtraction for grades 5+
                const a = Math.floor(Math.random() * 30) + 10;  // 10-39
                const b = Math.floor(Math.random() * 30) + 10;  // 10-39
                const c = Math.floor(Math.random() * 20) + 5;   // 5-24
                this.currentAnswer = a + b - c;
                return {
                    question: `Calculate: ${a} + ${b} - ${c}`,
                    answer: this.currentAnswer,
                    type: 'Arithmetic'
                };
            },
            () => {
                // Simplified multiplication
                const a = Math.floor(Math.random() * 12) + 3;  // 3-14
                const b = Math.floor(Math.random() * 8) + 2;   // 2-9
                this.currentAnswer = a * b;
                return {
                    question: `Calculate: ${a} × ${b}`,
                    answer: this.currentAnswer,
                    type: 'Arithmetic'
                };
            },
            () => {
                // Simplified division
                const b = Math.floor(Math.random() * 8) + 2;   // 2-9
                const result = Math.floor(Math.random() * 12) + 3;  // 3-14
                const a = b * result;
                this.currentAnswer = result;
                return {
                    question: `Calculate: ${a} ÷ ${b}`,
                    answer: this.currentAnswer,
                    type: 'Arithmetic'
                };
            }
        ];

        return operations[Math.floor(Math.random() * operations.length)]();
    }

    generateGeometry() {
        const problems = [
            () => {
                // Simplified area of rectangle
                const length = Math.floor(Math.random() * 10) + 3;  // 3-12
                const width = Math.floor(Math.random() * 10) + 3;   // 3-12
                this.currentAnswer = length * width;
                return {
                    question: `Area of rectangle (length=${length}cm, width=${width}cm)?`,
                    answer: this.currentAnswer,
                    type: 'Geometry'
                };
            },
            () => {
                // Simplified perimeter of square
                const side = Math.floor(Math.random() * 12) + 3;  // 3-14
                this.currentAnswer = 4 * side;
                return {
                    question: `Perimeter of square with side ${side}cm?`,
                    answer: this.currentAnswer,
                    type: 'Geometry'
                };
            },
            () => {
                // Simplified area of triangle
                const base = Math.floor(Math.random() * 8) + 4;   // 4-11
                const height = Math.floor(Math.random() * 8) + 4; // 4-11
                this.currentAnswer = (base * height) / 2;
                return {
                    question: `Area of triangle (base=${base}cm, height=${height}cm)?`,
                    answer: this.currentAnswer,
                    type: 'Geometry'
                };
            }
        ];

        return problems[Math.floor(Math.random() * problems.length)]();
    }

    generateTrigonometry() {
        const angles = [0, 30, 45, 60, 90];
        const angle = angles[Math.floor(Math.random() * angles.length)];
        
        const sinValues = { 0: 0, 30: 0.5, 45: 0.71, 60: 0.87, 90: 1 };
        const cosValues = { 0: 1, 30: 0.87, 45: 0.71, 60: 0.5, 90: 0 };

        const useSpecialCase = Math.random() > 0.5;

        if (useSpecialCase && (angle === 30 || angle === 60)) {
            // Pythagorean triplets
            const triplets = [[3, 4, 5], [5, 12, 13], [8, 15, 17]];
            const triplet = triplets[Math.floor(Math.random() * triplets.length)];
            this.currentAnswer = triplet[2];
            return {
                question: `Pythagorean: If sides are ${triplet[0]} and ${triplet[1]}, find hypotenuse`,
                answer: this.currentAnswer,
                type: 'Trigonometry'
            };
        }

        const useSin = Math.random() > 0.5;
        if (useSin) {
            this.currentAnswer = sinValues[angle];
            return {
                question: `Value of sin(${angle}°)? (round to 2 decimals)`,
                answer: this.currentAnswer,
                type: 'Trigonometry'
            };
        } else {
            this.currentAnswer = cosValues[angle];
            return {
                question: `Value of cos(${angle}°)? (round to 2 decimals)`,
                answer: this.currentAnswer,
                type: 'Trigonometry'
            };
        }
    }

    generateSequences() {
        const problems = [
            () => {
                // Arithmetic progression
                const a = Math.floor(Math.random() * 10) + 1;
                const d = Math.floor(Math.random() * 5) + 2;
                const n = Math.floor(Math.random() * 5) + 5;
                this.currentAnswer = a + (n - 1) * d;
                return {
                    question: `A.P.: first term=${a}, common diff=${d}. Find ${n}th term`,
                    answer: this.currentAnswer,
                    type: 'Sequences'
                };
            },
            () => {
                // Simple pattern
                const start = Math.floor(Math.random() * 5) + 2;
                const diff = Math.floor(Math.random() * 4) + 2;
                const sequence = [start, start + diff, start + 2 * diff, start + 3 * diff];
                this.currentAnswer = start + 4 * diff;
                return {
                    question: `Next in sequence: ${sequence.join(', ')}, ?`,
                    answer: this.currentAnswer,
                    type: 'Sequences'
                };
            }
        ];

        return problems[Math.floor(Math.random() * problems.length)]();
    }

    generatePercentage() {
        const problems = [
            () => {
                const total = [100, 200, 500, 1000][Math.floor(Math.random() * 4)];
                const percent = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
                this.currentAnswer = (total * percent) / 100;
                return {
                    question: `What is ${percent}% of ${total}?`,
                    answer: this.currentAnswer,
                    type: 'Percentage'
                };
            },
            () => {
                const original = Math.floor(Math.random() * 100) + 50;
                const increase = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
                this.currentAnswer = original + (original * increase) / 100;
                return {
                    question: `${original} increased by ${increase}% equals?`,
                    answer: this.currentAnswer,
                    type: 'Percentage'
                };
            }
        ];

        return problems[Math.floor(Math.random() * problems.length)]();
    }

    generatePowers() {
        const problems = [
            () => {
                // Simplified powers
                const base = Math.floor(Math.random() * 5) + 2;  // 2-6
                const power = Math.floor(Math.random() * 3) + 2; // 2-4
                this.currentAnswer = Math.pow(base, power);
                return {
                    question: `Calculate: ${base}^${power}`,
                    answer: this.currentAnswer,
                    type: 'Powers'
                };
            },
            () => {
                // Common powers
                const values = [[2, 8, 256], [3, 4, 81], [4, 3, 64], [5, 3, 125], [2, 6, 64]];
                const selected = values[Math.floor(Math.random() * values.length)];
                this.currentAnswer = selected[2];
                return {
                    question: `What is ${selected[0]}^${selected[1]}?`,
                    answer: this.currentAnswer,
                    type: 'Powers'
                };
            }
        ];

        return problems[Math.floor(Math.random() * problems.length)]();
    }

    generateAdvancedAlgebra() {
        // For grades 11-12: More complex algebra
        const problems = [
            () => {
                // Simultaneous equations hint
                const x = Math.floor(Math.random() * 5) + 2;
                const y = Math.floor(Math.random() * 5) + 2;
                const a = Math.floor(Math.random() * 3) + 2;
                const b = Math.floor(Math.random() * 3) + 2;
                const result = a * x + b * y;
                this.currentAnswer = result;
                return {
                    question: `If x=${x} and y=${y}, find ${a}x + ${b}y`,
                    answer: this.currentAnswer,
                    type: 'Advanced Algebra'
                };
            },
            () => {
                // Factorization awareness
                const a = Math.floor(Math.random() * 5) + 2;
                const b = Math.floor(Math.random() * 5) + 2;
                const product = a * b;
                const sum = a + b;
                this.currentAnswer = product;
                return {
                    question: `Two numbers sum to ${sum}. If one is ${a}, what's their product?`,
                    answer: this.currentAnswer,
                    type: 'Advanced Algebra'
                };
            }
        ];
        return problems[Math.floor(Math.random() * problems.length)]();
    }

    generateCalculus() {
        // Basic calculus concepts for grade 12
        const problems = [
            () => {
                // Simple derivative concept
                const n = Math.floor(Math.random() * 5) + 2;
                const x = Math.floor(Math.random() * 4) + 1;
                this.currentAnswer = n * Math.pow(x, n - 1);
                return {
                    question: `Derivative of x^${n} at x=${x}? (d/dx[x^n] = nx^(n-1))`,
                    answer: this.currentAnswer,
                    type: 'Calculus'
                };
            },
            () => {
                // Simple integration concept
                const n = Math.floor(Math.random() * 3) + 2;
                this.currentAnswer = n + 1;
                return {
                    question: `∫x^${n} dx = x^? / (${n + 1}) + C. Find the power`,
                    answer: this.currentAnswer,
                    type: 'Calculus'
                };
            }
        ];
        return problems[Math.floor(Math.random() * problems.length)]();
    }

    getCurrentProblem() {
        return this.currentProblem;
    }

    checkAnswer(userAnswer) {
        if (!this.currentProblem) return false;

        const correctAnswer = this.currentProblem.answer;
        const userNum = parseFloat(userAnswer);

        // Allow small margin for decimal answers
        if (Math.abs(userNum - correctAnswer) < 0.01) {
            return true;
        }

        return false;
    }
}

export { MathProblemGenerator };
