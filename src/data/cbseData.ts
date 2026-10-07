export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  chapterId: string;
  subjectId: string;
  topic: string; // Used for weak area diagnosis
  year: string;  // e.g. "CBSE 2023", "CBSE 2022"
}

export interface WorksheetQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswerIndex?: number;
  explanation: string;
  category?: "formula" | "mcq" | "satq" | "3marks" | "5marks" | "case-based" | "other";
  sourceType?: "NCERT Exemplar" | "Actual Board Exam (PYQ)" | "Competency Assessment";
  year?: string;
  marks?: number;
}

export interface Chapter {
  id: string;
  title: string;
  notes: string;
  worksheet: WorksheetQuestion[];
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  chapters: Chapter[];
}

export const CBSE_SUBJECTS: Subject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    color: "blue",
    chapters: [
      {
        id: "real-numbers",
        title: "Real Numbers",
        notes: "### 1. The Fundamental Theorem of Arithmetic\nEvery composite number can be uniquely expressed (factorised) as a product of prime numbers, irrespective of the order in which the prime factors occur.\n\n### 2. Properties and Relations\nFor any two positive integers a and b:\n- HCF(a, b) × LCM(a, b) = a × b\n- HCF is the product of the smallest power of each common prime factor.\n- LCM is the product of the greatest power of each prime factor involved.\n\n### 3. Irrational Numbers\n- A number is irrational if it cannot be written in the form p/q, where p and q are integers and q ≠ 0.\n- If a prime p divides a², then p divides a, where a is a positive integer. This fundamental lemma is used to prove the irrationality of √2, √3, √5, etc., using proof by contradiction.",
        worksheet: [
          {
            id: "m-w1-1",
            question: "State the Fundamental Theorem of Arithmetic and express 156 as a product of its prime factors. (Formula & Concept)",
            category: "formula",
            explanation: "The Fundamental Theorem of Arithmetic states that every composite number can be uniquely expressed as a product of prime numbers, up to the order of factors.\n\nPrime factorization of 156:\n156 = 2 × 78\n78 = 2 × 39\n39 = 3 × 13\nThus, 156 = 2² × 3 × 13. (CBSE Board 2025)"
          },
          {
            id: "m-w1-2",
            question: "If two positive integers p and q can be written as p = ab² and q = a³b, where a and b are prime numbers, then find LCM(p, q). (1 Mark MCQ)",
            options: ["ab", "a²b²", "a³b²", "a³b³"],
            correctAnswerIndex: 2,
            category: "mcq",
            explanation: "To find the LCM of p and q, we take the highest power of each prime factor involved.\n- For factor 'a', the powers are 1 in p and 3 in q, so we take a³.\n- For factor 'b', the powers are 2 in p and 1 in q, so we take b².\nTherefore, LCM(p, q) = a³b². (CBSE Board 2025)"
          },
          {
            id: "m-w1-3",
            question: "Given that HCF(306, 657) = 9, find LCM(306, 657). (1 Mark MCQ)",
            options: ["22338", "22383", "23238", "21338"],
            correctAnswerIndex: 0,
            category: "mcq",
            explanation: "Using the formula: HCF(a, b) × LCM(a, b) = a × b\n9 × LCM(306, 657) = 306 × 657\nLCM(306, 657) = (306 × 657) / 9 = 34 × 657 = 22338. (CBSE Board 2025)"
          },
          {
            id: "m-w1-4",
            question: "Prove that √5 is irrational. (3 Marks Short Answer)",
            category: "3marks",
            explanation: "Proof by Contradiction:\n1. Assume √5 is rational, so √5 = a/b where a and b are co-prime integers (HCF = 1) and b ≠ 0.\n2. Squaring both sides: 5 = a²/b² => a² = 5b².\n3. Since 5 divides a², 5 must also divide a (Fundamental Theorem of Arithmetic).\n4. Let a = 5c for some integer c. Then (5c)² = 5b² => 25c² = 5b² => b² = 5c².\n5. Since 5 divides b², 5 must also divide b.\n6. This means 5 is a common factor of both a and b, which contradicts our assumption that a and b are co-prime.\n7. Therefore, √5 is irrational. (CBSE Board 2025)"
          },
          {
            id: "m-w1-5",
            question: "Prove that 3 + 2√5 is irrational, given that √5 is irrational. (3 Marks Short Answer)",
            category: "3marks",
            explanation: "1. Let us assume, to the contrary, that 3 + 2√5 is rational.\n2. Therefore, we can find co-prime integers a and b (b ≠ 0) such that:\n   3 + 2√5 = a/b\n3. Rearranging the terms:\n   2√5 = (a/b) - 3\n   2√5 = (a - 3b)/b\n   √5 = (a - 3b)/(2b)\n4. Since a and b are integers, (a - 3b)/(2b) is rational, which means √5 is rational.\n5. But this contradicts the fact that √5 is irrational.\n6. Hence, our assumption is incorrect; 3 + 2√5 is irrational. (CBSE Board 2025)"
          },
          {
            id: "m-w1-6",
            question: "An army contingent of 616 members is to march behind an army band of 32 members in a parade. The two groups are to march in the same number of columns. What is the maximum number of columns in which they can march? (5 Marks Long Answer)",
            category: "5marks",
            explanation: "To find the maximum number of columns, we need to calculate the HCF of 616 and 32.\n\nUsing prime factorization:\n616 = 2³ × 7 × 11 = 8 × 7 × 11\n32 = 2⁵ = 32\n\nThe common factor with the smallest power is 2³ = 8.\nTherefore, HCF(616, 32) = 8.\n\nThus, the maximum number of columns in which they can march is 8. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "polynomials",
        title: "Polynomials",
        notes: "### 1. Geometrical Meaning of Zeroes\nThe zeroes of a polynomial p(x) are the x-coordinates of the points where the graph of y = p(x) intersects the x-axis.\n- A linear polynomial has at most 1 zero.\n- A quadratic polynomial can have at most 2 zeroes.\n- A cubic polynomial can have at most 3 zeroes.\n\n### 2. Quadratic Polynomial Coefficients\nIf α and β are the zeroes of the quadratic polynomial ax² + bx + c (a ≠ 0), then:\n- Sum of zeroes (α + β) = -b/a = -(Coefficient of x) / (Coefficient of x²)\n- Product of zeroes (α × β) = c/a = Constant term / (Coefficient of x²)\n\n### 3. Cubic Polynomial Coefficients\nIf α, β, and γ are the zeroes of the cubic polynomial ax³ + bx² + cx + d, then:\n- α + β + γ = -b/a\n- αβ + βγ + γα = c/a\n- αβγ = -d/a",
        worksheet: [
          {
            id: "m-w2-1",
            question: "State the relationship formulas between the zeroes (α, β) and the coefficients of the quadratic polynomial ax² + bx + c. (Formula & Concept)",
            category: "formula",
            explanation: "For any quadratic polynomial ax² + bx + c (where a ≠ 0) with zeroes α and β:\n1. Sum of zeroes: α + β = -b/a = -(coefficient of x) / (coefficient of x²)\n2. Product of zeroes: α × β = c/a = (constant term) / (coefficient of x²). (CBSE Board 2025)"
          },
          {
            id: "m-w2-2",
            question: "If one zero of the quadratic polynomial x² + 3x + k is 2, then find the value of k. (1 Mark MCQ)",
            options: ["10", "-10", "5", "-5"],
            correctAnswerIndex: 1,
            category: "mcq",
            explanation: "Since 2 is a zero of the polynomial p(x) = x² + 3x + k, we must have p(2) = 0.\np(2) = (2)² + 3(2) + k = 0\n4 + 6 + k = 0\n10 + k = 0 => k = -10. (CBSE Board 2025)"
          },
          {
            id: "m-w2-3",
            question: "Find a quadratic polynomial each with the given numbers as the sum and product of its zeroes respectively: 1/4, -1. (1 Mark MCQ)",
            options: ["4x² - x - 4", "4x² + x - 4", "x² - 4x - 4", "4x² - x + 4"],
            correctAnswerIndex: 0,
            category: "mcq",
            explanation: "A quadratic polynomial is given by k[x² - (sum of zeroes)x + (product of zeroes)]. Substituting the values: k[x² - (1/4)x - 1]. For k = 4, the polynomial is 4x² - x - 4. (CBSE Board 2025)"
          },
          {
            id: "m-w2-4",
            question: "Find the zeroes of the quadratic polynomial x² - 2x - 8, and verify the relationship between the zeroes and the coefficients. (3 Marks Short Answer)",
            category: "3marks",
            explanation: "1. Factorise the polynomial: x² - 2x - 8 = x² - 4x + 2x - 8 = x(x - 4) + 2(x - 4) = (x - 4)(x + 2).\n2. Setting it to 0 gives the zeroes: α = 4 and β = -2.\n3. Verification:\n- Sum of zeroes: α + β = 4 + (-2) = 2. Formally, -b/a = -(-2)/1 = 2 (Verified).\n- Product of zeroes: α × β = 4 × (-2) = -8. Formally, c/a = -8/1 = -8 (Verified). (CBSE Board 2025)"
          },
          {
            id: "m-w2-5",
            question: "Find the zeroes of the quadratic polynomial 4s² - 4s + 1 and verify the relationship between the zeroes and the coefficients. (3 Marks Short Answer)",
            category: "3marks",
            explanation: "1. Factorise 4s² - 4s + 1 = (2s - 1)². Setting to 0 gives s = 1/2, s = 1/2.\n2. So, α = 1/2 and β = 1/2.\n3. Verification:\n- Sum of zeroes: α + β = 1/2 + 1/2 = 1. Formally, -b/a = -(-4)/4 = 1 (Verified).\n- Product of zeroes: α × β = 1/2 × 1/2 = 1/4. Formally, c/a = 1/4 (Verified). (CBSE Board 2025)"
          },
          {
            id: "m-w2-6",
            question: "If α and β are the zeroes of the quadratic polynomial f(x) = x² - p(x + 1) - c such that (α + 1)(β + 1) = 0, find the value of c. (5 Marks Long Answer)",
            category: "5marks",
            explanation: "1. Expand and rearrange the polynomial f(x) = x² - px - (p + c).\n2. Comparing with ax² + bx + c, we get:\n   a = 1, b = -p, and constant term = -(p + c).\n3. Find relationships:\n   - α + β = -b/a = p\n   - αβ = c/a = -(p + c)\n4. Given condition: (α + 1)(β + 1) = 0\n   αβ + α + β + 1 = 0\n5. Substitute the values:\n   -(p + c) + p + 1 = 0\n   -p - c + p + 1 = 0\n   -c + 1 = 0 => c = 1.\nThus, the value of c is 1. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "linear-equations",
        title: "Pair of Linear Equations in Two Variables",
        notes: "### 1. Algebraic & Graphical Representation\nA pair of linear equations in two variables x and y is written as:\na₁x + b₁y + c₁ = 0\na₂x + b₂y + c₂ = 0\n\n### 2. Consistency & Ratios\nWe can determine consistency by comparing the coefficient ratios:\n- Intersecting Lines (Unique Solution / Consistent): a₁/a₂ ≠ b₁/b₂\n- Coincident Lines (Infinitely Many Solutions / Consistent): a₁/a₂ = b₁/b₂ = c₁/c₂\n- Parallel Lines (No Solution / Inconsistent): a₁/a₂ = b₁/b₂ ≠ c₁/c₂\n\n### 3. Algebraic Solution Methods\n- Substitution Method: Express one variable in terms of the other from one equation, and substitute into the second.\n- Elimination Method: Multiply equations by constants to make the coefficients of one variable equal, then add or subtract to eliminate that variable.",
        worksheet: [
          {
            id: "m-w3-1",
            question: "State the algebraic conditions of consistency and dependency for a pair of linear equations in two variables. (Formula & Concept)",
            category: "formula",
            explanation: "For two linear equations a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0:\n1. Unique Solution (Consistent): a₁/a₂ ≠ b₁/b₂\n2. Infinitely Many Solutions (Consistent & Dependent): a₁/a₂ = b₁/b₂ = c₁/c₂\n3. No Solution (Inconsistent): a₁/a₂ = b₁/b₂ ≠ c₁/c₂. (CBSE Board 2025)"
          },
          {
            id: "m-w3-2",
            question: "For what value of k, the pair of linear equations kx - y = 2 and 6x - 2y = 3 has a unique solution? (1 Mark MCQ)",
            options: ["k = 3", "k ≠ 3", "k ≠ 0", "k = 0"],
            correctAnswerIndex: 1,
            category: "mcq",
            explanation: "For a unique solution, we must have a₁/a₂ ≠ b₁/b₂.\nHere, a₁ = k, b₁ = -1, a₂ = 6, b₂ = -2.\nTherefore, k/6 ≠ -1/(-2)\nk/6 ≠ 1/2\nk ≠ 3. (CBSE Board 2025)"
          },
          {
            id: "m-w3-3",
            question: "On comparing the ratios a₁/a₂, b₁/b₂ and c₁/c₂, find out whether the lines representing the following pair of linear equations intersect at a point, are parallel or coincident: 5x - 4y + 8 = 0, 7x + 6y - 9 = 0. (1 Mark MCQ)",
            options: ["Intersect at a point", "Parallel", "Coincident", "None of these"],
            correctAnswerIndex: 0,
            category: "mcq",
            explanation: "Here, a₁/a₂ = 5/7, b₁/b₂ = -4/6 = -2/3. Since a₁/a₂ ≠ b₁/b₂, the lines intersect at a point. (CBSE Board 2025)"
          },
          {
            id: "m-w3-4",
            question: "Solve the following pair of linear equations by the elimination method: 2x + 3y = 11 and 2x - 4y = -24. (3 Marks Short Answer)",
            category: "3marks",
            explanation: "1. Let equation (1) be: 2x + 3y = 11, and equation (2) be: 2x - 4y = -24.\n2. Subtracting equation (2) from (1):\n   (2x + 3y) - (2x - 4y) = 11 - (-24)\n   7y = 35 => y = 5.\n3. Substitute y = 5 in equation (1):\n   2x + 3(5) = 11 => 2x + 15 = 11 => 2x = -4 => x = -2.\nThus, x = -2, y = 5. (CBSE Board 2025)"
          },
          {
            id: "m-w3-5",
            question: "Solve the following pair of linear equations by the substitution method: x + y = 14 and x - y = 4. (3 Marks Short Answer)",
            category: "3marks",
            explanation: "1. From the second equation: x = y + 4.\n2. Substitute x into the first equation:\n(y + 4) + y = 14 => 2y + 4 = 14 => 2y = 10 => y = 5.\n3. Substitute y = 5 back to find x:\nx = 5 + 4 = 9.\n4. Therefore, the unique solution is x = 9, y = 5. (CBSE Board 2025)"
          },
          {
            id: "m-w3-6",
            question: "A fraction becomes 9/11, if 2 is added to both the numerator and the denominator. If 3 is added to both the numerator and the denominator it becomes 5/6. Find the fraction. (5 Marks Long Answer)",
            category: "5marks",
            explanation: "1. Let the fraction be x/y, where x is the numerator and y is the denominator.\n2. According to the first condition:\n   (x + 2)/(y + 2) = 9/11\n   11(x + 2) = 9(y + 2)\n   11x + 22 = 9y + 18\n   11x - 9y = -4   --- (Equation 1)\n3. According to the second condition:\n   (x + 3)/(y + 3) = 5/6\n   6(x + 3) = 5(y + 3)\n   6x + 18 = 5y + 15\n   6x - 5y = -3    --- (Equation 2)\n4. From (Equation 2), we have: 5y = 6x + 3 => y = (6x + 3)/5.\n5. Substitute y into (Equation 1):\n   11x - 9[(6x + 3)/5] = -4\n   55x - 9(6x + 3) = -20\n   55x - 54x - 27 = -20\n   x = 7.\n6. Substitute x = 7 in equation for y:\n   y = (6(7) + 3)/5 = 45/5 = 9.\nThus, the fraction is 7/9. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "quadratic-equations",
        title: "Quadratic Equations",
        notes: "### 1. Standard Form\nA quadratic equation in the variable x is of the form:\nax² + bx + c = 0, where a, b, c are real numbers, and a ≠ 0.\n\n### 2. Solution Methods\n- Factorisation (Splitting the middle term): Express the quadratic expression as a product of two linear factors and equate each to zero.\n- Quadratic Formula: If b² - 4ac ≥ 0, the roots of ax² + bx + c = 0 are:\nx = [-b ± √(b² - 4ac)] / 2a\n\n### 3. Nature of Roots\nThe term D = b² - 4ac is called the Discriminant:\n- Two Distinct Real Roots if D > 0.\n- Two Equal Real Roots if D = 0.\n- No Real Roots if D < 0.",
        worksheet: [
          {
            id: "m-w4-1",
            question: "State the general form of a quadratic equation and the Quadratic Formula, including the role of the discriminant D in determining the nature of roots. (Formula & Concept)",
            category: "formula",
            explanation: "1. General form: ax² + bx + c = 0 (a ≠ 0, a,b,c are real numbers).\n2. Quadratic Formula: x = [-b ± √(b² - 4ac)] / 2a.\n3. Discriminant D = b² - 4ac determines the nature of roots:\n   - Two distinct real roots: D > 0\n   - Two equal real roots: D = 0\n   - No real roots: D < 0. (CBSE Board 2025)"
          },
          {
            id: "m-w4-2",
            question: "Find the values of k for which the quadratic equation 2x² + kx + 3 = 0 has two equal roots. (1 Mark MCQ)",
            options: ["k = ±√24", "k = ±√12", "k = ±6", "k = ±2"],
            correctAnswerIndex: 0,
            category: "mcq",
            explanation: "For equal roots, Discriminant D = b² - 4ac = 0. Here, k² - 4(2)(3) = 0 => k² = 24 => k = ±√24 = ±2√6. (CBSE Board 2025)"
          },
          {
            id: "m-w4-3",
            question: "Which of the following quadratic equations has no real roots? (1 Mark MCQ)",
            options: ["x² - 4x + 3 = 0", "x² + 4x + 5 = 0", "2x² - 3x - 2 = 0", "x² - 2x = 0"],
            correctAnswerIndex: 1,
            category: "mcq",
            explanation: "Checking discriminant D = b² - 4ac:\nFor x² + 4x + 5 = 0:\nD = 4² - 4(1)(5) = 16 - 20 = -4. Since D < 0, this equation has no real roots. (CBSE Board 2025)"
          },
          {
            id: "m-w4-4",
            question: "Find the roots of the quadratic equation x² - 3x - 10 = 0 by factorisation. (3 Marks Short Answer)",
            category: "3marks",
            explanation: "1. Factorise by splitting the middle term: x² - 5x + 2x - 10 = 0.\n2. Group the terms: x(x - 5) + 2(x - 5) = 0 => (x - 5)(x + 2) = 0.\n3. Equate each factor to zero: x - 5 = 0 or x + 2 = 0.\n4. Hence, the roots are x = 5 and x = -2. (CBSE Board 2025)"
          },
          {
            id: "m-w4-5",
            question: "Find the roots of the quadratic equation 2x² - 5x + 3 = 0 using the quadratic formula. (3 Marks Short Answer)",
            category: "3marks",
            explanation: "1. Identify coefficients: a = 2, b = -5, c = 3.\n2. Calculate Discriminant D = b² - 4ac = (-5)² - 4(2)(3) = 25 - 24 = 1.\n3. Since D > 0, roots are real and distinct.\n4. Use Quadratic Formula: x = [-b ± √D] / 2a = [-(-5) ± √1] / 2(2) = (5 ± 1) / 4.\n   - Root 1: (5 + 1)/4 = 6/4 = 3/2.\n   - Root 2: (5 - 1)/4 = 4/4 = 1.\nRoots are 3/2 and 1. (CBSE Board 2025)"
          },
          {
            id: "m-w4-6",
            question: "A motor boat whose speed is 18 km/h in still water takes 1 hour more to go 24 km upstream than to return downstream to the same spot. Find the speed of the stream. (5 Marks Long Answer)",
            category: "5marks",
            explanation: "1. Let the speed of the stream be x km/h.\n2. Speed of the boat upstream = (18 - x) km/h, and speed downstream = (18 + x) km/h.\n3. Time taken to travel upstream = 24 / (18 - x) hours.\n   Time taken to travel downstream = 24 / (18 + x) hours.\n4. According to the problem:\n   [24 / (18 - x)] - [24 / (18 + x)] = 1\n5. Solving the equation:\n   24 [ (18 + x) - (18 - x) ] / [ (18 - x)(18 + x) ] = 1\n   24 [ 2x ] / (324 - x²) = 1\n   48x = 324 - x²\n   x² + 48x - 324 = 0\n6. Solve by factorisation:\n   x² + 54x - 6x - 324 = 0\n   x(x + 54) - 6(x + 54) = 0\n   (x - 6)(x + 54) = 0\n7. Since speed cannot be negative, x = 6.\nThus, the speed of the stream is 6 km/h. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "arithmetic-progressions",
        title: "Arithmetic Progressions",
        notes: "### 1. General Concepts\nAn Arithmetic Progression (AP) is a sequence of numbers in which each term is obtained by adding a fixed number d (common difference) to the preceding term, except the first term a.\nGeneral form: a, a + d, a + 2d, a + 3d, ...\n\n### 2. nth Term of an AP\nThe nth term a_n is given by:\na_n = a + (n - 1)d, where a is the first term, and d is the common difference.\n\n### 3. Sum of First n Terms\nThe sum S_n of the first n terms is:\nS_n = (n/2) × [2a + (n - 1)d]\nAlternatively, if the last term l is known:\nS_n = (n/2) × [a + l], where l = a_n.\n\n### 4. Arithmetic Mean\nIf three numbers a, b, and c are in AP, then b is the arithmetic mean of a and c, given by:\nb = (a + c) / 2",
        worksheet: [
          {
            id: "m-w5-1",
            question: "State the formula for the nth term of an AP and the sum of first n terms. (Formula & Concept)",
            category: "formula",
            explanation: "For an Arithmetic Progression (AP) with first term 'a' and common difference 'd':\n1. The nth term is: a_n = a + (n - 1)d.\n2. The sum of first n terms is: S_n = (n/2) × [2a + (n - 1)d] = (n/2) × [a + l], where l is the last term a_n. (CBSE Board 2025)"
          },
          {
            id: "m-w5-2",
            question: "Choose the correct choice: 30th term of the AP: 10, 7, 4, ... is: (1 Mark MCQ)",
            options: ["97", "77", "-77", "-87"],
            correctAnswerIndex: 2,
            category: "mcq",
            explanation: "Here, a = 10, d = 7 - 10 = -3. We want a₃₀ = a + 29d = 10 + 29(-3) = 10 - 87 = -77. (CBSE Board 2025)"
          },
          {
            id: "m-w5-3",
            question: "The 11th term of the AP: -3, -1/2, 2, ... is: (1 Mark MCQ)",
            options: ["28", "22", "-38", "-46.5"],
            correctAnswerIndex: 1,
            category: "mcq",
            explanation: "Here, a = -3, d = -1/2 - (-3) = -1/2 + 3 = 5/2.\na₁₁ = a + 10d = -3 + 10(5/2) = -3 + 25 = 22. (CBSE Board 2025)"
          },
          {
            id: "m-w5-4",
            question: "Find the 31st term of an AP whose 11th term is 38 and the 16th term is 73. (3 Marks Short Answer)",
            category: "3marks",
            explanation: "1. Let first term be 'a' and common difference be 'd'.\n2. Given: a₁₁ = a + 10d = 38  --- (Equation 1)\n   Given: a₁₆ = a + 15d = 73  --- (Equation 2)\n3. Subtract Equation 1 from Equation 2:\n   5d = 35 => d = 7.\n4. Substitute d = 7 in Equation 1:\n   a + 10(7) = 38 => a + 70 = 38 => a = -32.\n5. Find 31st term:\n   a₃₁ = a + 30d = -32 + 30(7) = -32 + 210 = 178.\nThus, the 31st term is 178. (CBSE Board 2025)"
          },
          {
            id: "m-w5-5",
            question: "Find the sum of the AP: 2, 7, 12, ... to 10 terms. (3 Marks Short Answer)",
            category: "3marks",
            explanation: "1. Identify parameters: first term a = 2, common difference d = 7 - 2 = 5, and number of terms n = 10.\n2. Use the sum formula: S_n = (n/2) × [2a + (n - 1)d].\n3. Calculate: S₁₀ = (10/2) × [2(2) + (10 - 1)5] = 5 × [4 + 9(5)] = 5 × [4 + 45] = 5 × 49 = 245.\nTherefore, the sum is 245. (CBSE Board 2025)"
          },
          {
            id: "m-w5-6",
            question: "The sum of the third and the seventh terms of an AP is 6 and their product is 8. Find the sum of first sixteen terms of the AP. (5 Marks Long Answer)",
            category: "5marks",
            explanation: "1. Let first term be 'a' and common difference be 'd'.\n2. Third term a₃ = a + 2d, seventh term a₇ = a + 6d.\n3. Given: a₃ + a₇ = 6\n   (a + 2d) + (a + 6d) = 6 => 2a + 8d = 6 => a + 4d = 3 => a = 3 - 4d.\n4. Given product: a₃ × a₇ = 8\n   (a + 2d)(a + 6d) = 8\n   (3 - 4d + 2d)(3 - 4d + 6d) = 8\n   (3 - 2d)(3 + 2d) = 8\n   9 - 4d² = 8 => 4d² = 1 => d² = 1/4 => d = ±1/2.\n5. Case 1: If d = 1/2, then a = 3 - 4(1/2) = 3 - 2 = 1.\n   Sum S₁₆ = (16/2) [ 2(1) + 15(1/2) ] = 8 [ 2 + 7.5 ] = 8 [ 9.5 ] = 76.\n6. Case 2: If d = -1/2, then a = 3 - 4(-1/2) = 3 + 2 = 5.\n   Sum S₁₆ = (16/2) [ 2(5) + 15(-1/2) ] = 8 [ 10 - 7.5 ] = 8 [ 2.5 ] = 20.\nThus, the sum of first 16 terms is either 76 or 20. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "triangles",
        title: "Triangles",
        notes: "### 1. Similar Figures\nTwo figures having the same shape but not necessarily the same size are called similar figures.\n- All congruent figures are similar, but similar figures are not necessarily congruent.\n\n### 2. Similarity of Polygons\nTwo polygons with the same number of sides are similar if:\n- Their corresponding angles are equal.\n- Their corresponding sides are in the same ratio (proportional).\n\n### 3. Basic Proportionality Theorem (BPT)\n- Thales Theorem: If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio.\n- Converse of BPT: If a line divides any two sides of a triangle in the same ratio, then the line is parallel to the third side.\n\n### 4. Criteria for Similarity\n- AAA Similarity (or AA): If corresponding angles are equal, corresponding sides are proportional.\n- SSS Similarity: If corresponding sides are proportional, corresponding angles are equal.\n- SAS Similarity: If one angle of a triangle is equal to one angle of another, and the sides including these angles are proportional.",
        worksheet: [
          {
            id: "m-w6-1",
            question: "State the Thales Theorem (Basic Proportionality Theorem) and its converse. (Formula & Concept)",
            category: "formula",
            explanation: "1. Basic Proportionality Theorem (Thales Theorem): If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio.\n2. Converse of BPT: If a line divides any two sides of a triangle in the same ratio, then the line is parallel to the third side. (CBSE Board 2025)"
          },
          {
            id: "m-w6-2",
            question: "In triangle ABC, DE || BC. If AD = 1.5 cm, DB = 3 cm, and AE = 1 cm, find the length of EC. (1 Mark MCQ)",
            options: ["2 cm", "3 cm", "1.5 cm", "2.5 cm"],
            correctAnswerIndex: 0,
            category: "mcq",
            explanation: "By the Basic Proportionality Theorem (BPT), since DE || BC, we have AD/DB = AE/EC.\nSubstituting the values:\n1.5 / 3 = 1 / EC\n1/2 = 1 / EC => EC = 2 cm. (CBSE Board 2025)"
          },
          {
            id: "m-w6-3",
            question: "If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, prove that the other two sides are divided in the same ratio. (5 Marks Long Answer)",
            category: "5marks",
            explanation: "Let ABC be a triangle in which a line parallel to side BC intersects other sides AB and AC at D and E respectively.\n1. Join BE and CD, and draw DM ⊥ AC and EN ⊥ AB.\n2. Area of ΔADE = 1/2 × Base × Height = 1/2 × AD × EN.\nArea of ΔBDE = 1/2 × DB × EN.\nTherefore, Area(ΔADE) / Area(ΔBDE) = (1/2 × AD × EN) / (1/2 × DB × EN) = AD/DB. (Equation 1)\n3. Similarly, Area(ΔADE) / Area(ΔDEC) = 1/2 × AE × DM / (1/2 × EC × DM) = AE/EC. (Equation 2)\n4. Note that ΔBDE and ΔDEC are on the same base DE and between parallel lines DE and BC. Therefore, Area(ΔBDE) = Area(ΔDEC).\n5. From Equations 1, 2, and 4, we conclude: AD/DB = AE/EC.\nThis completes the proof of the Basic Proportionality Theorem (BPT). (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "coordinate-geometry",
        title: "Coordinate Geometry",
        notes: "### 1. Distance Formula\nThe distance between any two points P(x₁, y₁) and Q(x₂, y₂) is:\nPQ = √[(x₂ - x₁)² + (y₂ - y₁)²]\nSpecial Case: The distance of a point P(x, y) from the origin O(0, 0) is:\nOP = √(x² + y²)\n\n### 2. Section Formula\nThe coordinates of the point P(x, y) which divides the line segment joining A(x₁, y₁) and B(x₂, y₂) internally in the ratio m₁:m₂ are:\nx = (m₁x₂ + m₂x₁) / (m₁ + m₂)\ny = (m₁y₂ + m₂y₁) / (m₁ + m₂)\n\n### 3. Mid-point Formula\nThe mid-point P of the line segment joining A(x₁, y₁) and B(x₂, y₂) is given by:\nP = ( (x₁ + x₂) / 2, (y₁ + y₂) / 2 )",
        worksheet: [
          {
            id: "m-w7-1",
            question: "Find the distance between the points (2, 3) and (4, 1).",
            options: ["√2 units", "2√2 units", "4 units", "8 units"],
            correctAnswerIndex: 1,
            explanation: "Using Distance Formula: d = √[(4 - 2)² + (1 - 3)²] = √[2² + (-2)²] = √[4 + 4] = √8 = 2√2 units. (NCERT Exercise 7.1 Q1(i))"
          },
          {
            id: "m-w7-2",
            question: "Find the coordinates of the point which divides the line segment joining (-1, 7) and (4, -3) in the ratio 2:3.",
            explanation: "1. Let A(-1, 7) and B(4, -3). The ratio is m₁:m₂ = 2:3.\n2. Apply Section Formula:\nx = (m₁x₂ + m₂x₁) / (m₁ + m₂) = (2(4) + 3(-1)) / (2 + 3) = (8 - 3) / 5 = 5 / 5 = 1.\ny = (m₁y₂ + m₂y₁) / (m₁ + m₂) = (2(-3) + 3(7)) / (2 + 3) = (-6 + 21) / 5 = 15 / 5 = 3.\n3. The required point is (1, 3). (NCERT Exercise 7.2 Q1)"
          }
        ]
      },
      {
        id: "trigonometry",
        title: "Introduction to Trigonometry",
        notes: "### 1. Trigonometric Ratios\nFor acute angle θ in a right triangle:\n- sin θ = Opposite / Hypotenuse\n- cos θ = Adjacent / Hypotenuse\n- tan θ = Opposite / Adjacent\n- cosec θ = 1 / sin θ, sec θ = 1 / cos θ, cot θ = 1 / tan θ\n\n### 2. Specific Angles values\n- sin 30° = 1/2, cos 30° = √3/2, tan 30° = 1/v3\n- sin 45° = 1/v2, cos 45° = 1/v2, tan 45° = 1\n- sin 60° = √3/2, cos 60° = 1/2, tan 60° = √3\n\n### 3. Trigonometric Identities\n- sin² θ + cos² θ = 1\n- 1 + tan² θ = sec² θ\n- 1 + cot² θ = cosec² θ",
        worksheet: [
          {
            id: "m-w8-1",
            question: "In a right triangle ABC, right-angled at B, AB = 24 cm, BC = 7 cm. Find the value of sin A and cos A.",
            options: ["sin A = 7/25, cos A = 24/25", "sin A = 24/25, cos A = 7/25", "sin A = 7/24, cos A = 24/7", "sin A = 25/7, cos A = 25/24"],
            correctAnswerIndex: 0,
            explanation: "First, find Hypotenuse AC using Pythagoras: AC = √(AB² + BC²) = √(24² + 7²) = √(576 + 49) = √625 = 25 cm. Now, sin A = opposite/hypotenuse = BC/AC = 7/25, and cos A = adjacent/hypotenuse = AB/AC = 24/25. (NCERT Exercise 8.1 Q1(i))"
          },
          {
            id: "m-w8-2",
            question: "Evaluate: sin 60° cos 30° + sin 30° cos 60°.",
            explanation: "1. Substitute the known trigonometric values:\nsin 60° = √3/2, cos 30° = √3/2, sin 30° = 1/2, cos 60° = 1/2.\n2. Substitute these in the expression:\n(√3/2 × √3/2) + (1/2 × 1/2) = 3/4 + 1/4 = 4/4 = 1.\n3. Therefore, the evaluated value is 1. (NCERT Exercise 8.2 Q1(i))"
          }
        ]
      },
      {
        id: "some-applications-trig",
        title: "Some Applications of Trigonometry",
        notes: "### 1. Key Terminology\n- Line of Sight: Line from observer's eye to the viewed point on the object.\n- Angle of Elevation: Angle between the horizontal and the line of sight looking up.\n- Angle of Depression: Angle between the horizontal and the line of sight looking down.\n\n### 2. Practical Trigonometry\nUse ratios (usually tan θ = opposite/adjacent, or sin θ) to calculate unknown heights of towers, trees, or widths of rivers based on measured angles.",
        worksheet: [
          {
            id: "m-w9-1",
            question: "A circus artist is climbing a 20 m long rope, which is tightly stretched and tied from the top of a vertical pole to the ground. Find the height of the pole, if the angle made by the rope with the ground level is 30°.",
            options: ["10 m", "20 m", "10√3 m", "5 m"],
            correctAnswerIndex: 0,
            explanation: "Let height of pole be h. The rope is hypotenuse AC = 20 m, angle θ = 30°. Using sin θ = Opp/Hyp: sin 30° = h / 20 => 1/2 = h / 20 => h = 10 m. (NCERT Exercise 9.1 Q1)"
          },
          {
            id: "m-w9-2",
            question: "A tree breaks due to a storm and the broken part bends so that the top of the tree touches the ground making an angle of 30° with it. The distance from the foot of the tree to the point where the top touches the ground is 8 m. Find the height of the tree.",
            explanation: "Let the unbroken tree be total height AB + AC, where AB is the vertical part standing and AC is the broken part touching the ground. We have a right triangle ABC, right-angled at B.\n1. Distance BC = 8 m, and angle ∠ACB = 30°.\n2. Finding standing part AB using tan 30° = AB / BC => 1/√3 = AB / 8 => AB = 8 / √3 m.\n3. Finding broken part AC using cos 30° = BC / AC => √3/2 = 8 / AC => AC = 16 / √3 m.\n4. The total height of the tree is AB + AC = 8/√3 + 16/V3 = 24 / √3 = 8√3 m.\n5. Therefore, the total height of the tree is 8√3 m. (NCERT Exercise 9.1 Q2)"
          }
        ]
      },
      {
        id: "circles",
        title: "Circles",
        notes: "### 1. Tangent to a Circle\nA tangent to a circle is a line that intersects the circle at only one point.\n- The point where the tangent touches the circle is called the point of contact.\n\n### 2. Radius and Tangent Perpendicularity\nThe tangent at any point of a circle is perpendicular to the radius through the point of contact. (Theorem 10.1)\n\n### 3. Tangents from an External Point\nThe lengths of tangents drawn from an external point to a circle are equal. (Theorem 10.2)",
        worksheet: [
          {
            id: "m-w10-1",
            question: "From a point Q, the length of the tangent to a circle is 24 cm and the distance of Q from the centre is 25 cm. Find the radius of the circle.",
            options: ["7 cm", "12 cm", "15 cm", "24.5 cm"],
            correctAnswerIndex: 0,
            explanation: "Let OP be the radius. Triangle OPQ is right-angled at P. By Pythagoras Theorem, OQ² = OP² + PQ² => 25² = OP² + 24² => 625 = OP² + 576 => OP² = 49 => OP = 7 cm. (NCERT Exercise 10.2 Q1)"
          },
          {
            id: "m-w10-2",
            question: "Prove that the lengths of tangents drawn from an external point to a circle are equal.",
            explanation: "Let a circle have center O, and P be an external point. Let PQ and PR be two tangents touching the circle at Q and R respectively.\n1. Join OQ, OR and OP. We have right triangles OQP and ORP (since tangent is perpendicular to radius, ∠OQP = ∠ORP = 90°).\n2. In ΔOQP and ΔORP:\n- OQ = OR (radii of the same circle)\n- OP = OP (common hypotenuse)\n- ∠OQP = ∠ORP = 90°\n3. By RHS congruency criterion, ΔOQP ≅ ΔORP.\n4. By CPCT (Corresponding Parts of Congruent Triangles), PQ = PR.\nThis proves that the lengths of the tangents are equal. (NCERT Theorem 10.2)"
          }
        ]
      },
      {
        id: "areas-circles",
        title: "Areas Related to Circles",
        notes: "### 1. Basic Formulae\n- Circumference of a circle = 2πr\n- Area of a circle = πr²\n\n### 2. Area of Sector of a Circle\n- Area of Sector of angle θ = (θ / 360°) × πr²\n- Length of an Arc of sector of angle θ = (θ / 360°) × 2πr\n\n### 3. Area of Segment of a Circle\n- Area of Segment = Area of corresponding Sector - Area of corresponding triangle.",
        worksheet: [
          {
            id: "m-w11-1",
            question: "Find the area of a sector of a circle with radius 6 cm if the angle of the sector is 60°.",
            options: ["132/7 cm²", "154/7 cm²", "44/7 cm²", "22/7 cm²"],
            correctAnswerIndex: 0,
            explanation: "Area of sector = (θ/360°) × πr² = (60/360) × (22/7) × 6 × 6 = (1/6) × (22/7) × 36 = 132/7 cm². (NCERT Exercise 11.1 Q1)"
          },
          {
            id: "m-w11-2",
            question: "The length of the minute hand of a clock is 14 cm. Find the area swept by the minute hand in 5 minutes.",
            explanation: "1. The minute hand acts as the radius of a circle, r = 14 cm.\n2. In 60 minutes, the hand sweeps 360°. Therefore, in 5 minutes, it sweeps: θ = (360° / 60) × 5 = 30°.\n3. Area swept is the area of a sector of angle 30°:\nArea = (θ/360°) × πr² = (30/360) × (22/7) × 14 × 14 = (1/12) × 22 × 2 × 14 = (1/12) × 616 = 154/3 cm² (or approx 51.33 cm²).\n4. Hence, the swept area is 154/3 cm². (NCERT Exercise 11.1 Q3)"
          }
        ]
      },
      {
        id: "surface-areas-volumes",
        title: "Surface Areas and Volumes",
        notes: "### 1. Combinations of Solids\nTo solve problems involving composite solids, we analyze individual solids (cylinder, cone, sphere, hemisphere, cuboid) and aggregate their properties.\n\n### 2. Surface Areas of Combined Solids\nWhen combining solids, the total surface area (TSA) of the new solid is the sum of the curved surface areas (CSA) of the individual parts that remain visible (overlapping surfaces are deducted).\n\n### 3. Volumes of Combined Solids\nThe total volume is simply the algebraic sum of the volumes of all component solids, regardless of their contact surfaces.",
        worksheet: [
          {
            id: "m-w12-1",
            question: "2 cubes each of volume 64 cm³ are joined end to end. Find the surface area of the resulting cuboid.",
            options: ["160 cm²", "120 cm²", "80 cm²", "240 cm²"],
            correctAnswerIndex: 0,
            explanation: "Volume of each cube = a³ = 64 => side a = 4 cm. Joining end-to-end creates a cuboid of dimensions: Length l = 4 + 4 = 8 cm, Width w = 4 cm, Height h = 4 cm. Surface area of cuboid = 2(lw + wh + hl) = 2(8×4 + 4×4 + 4×8) = 2(32 + 16 + 32) = 2(80) = 160 cm². (NCERT Exercise 12.1 Q1)"
          },
          {
            id: "m-w12-2",
            question: "A solid is in the form of a cone standing on a hemisphere with both their radii being equal to 1 cm and the height of the cone is equal to its radius. Find the volume of the solid in terms of π.",
            explanation: "1. Identify parameters: radius of hemisphere r = 1 cm, radius of cone r = 1 cm, and height of cone h = 1 cm.\n2. Volume of solid = Volume of cone + Volume of hemisphere:\nVolume = (1/3)πr²h + (2/3)πr³\n3. Substitute the values:\nVolume = (1/3)π(1)²(1) + (2/3)π(1)³ = (1/3)π + (2/3)π = π cm³.\n4. Therefore, the volume of the solid is π cm³. (NCERT Exercise 12.2 Q1)"
          }
        ]
      },
      {
        id: "statistics",
        title: "Statistics",
        notes: "### 1. Mean of Grouped Data\nThree methods are used:\n- Direct Method: x̄ = Σf_ix_i / Σf_i\n- Assumed Mean Method: x̄ = a + Σf_id_i / Σf_i (where d_i = x_i - a)\n- Step-deviation Method: x̄ = a + [Σf_iu_i / Σf_i] × h (where u_i = (x_i - a)/h)\n\n### 2. Mode of Grouped Data\nMode = l + [ (f₁ - f₀) / (2f₁ - f₀ - f₂) ] × h\nwhere l is lower limit of modal class, f₁ is frequency of modal class, f₀ is frequency of preceding class, f₂ is frequency of succeeding class, and h is class size.\n\n### 3. Median of Grouped Data\nMedian = l + [ ( (n/2) - cf ) / f ] × h\nwhere l is lower limit of median class, cf is cumulative frequency of preceding class, f is frequency of median class, and h is class size.\n\n### 4. Empirical Relationship\n3 Median = Mode + 2 Mean",
        worksheet: [
          {
            id: "m-w13-1",
            question: "If the mean of a frequency distribution is 24 and the mode is 24, find its median.",
            options: ["24", "12", "48", "36"],
            correctAnswerIndex: 0,
            explanation: "Using 3 Median = Mode + 2 Mean => 3 Median = 24 + 2(24) = 72 => Median = 72 / 3 = 24. (NCERT Chapter 13 Theory)"
          },
          {
            id: "m-w13-2",
            question: "Find the median of a grouped data where lower limit l = 125, total frequency n = 68, cumulative frequency cf = 22, frequency of median class f = 20, and class size h = 20.",
            explanation: "1. Write the median formula:\nMedian = l + [ ( (n/2) - cf ) / f ] × h\n2. Substitute the given values:\nMedian = 125 + [ ( (68/2) - 22 ) / 20 ] × 20\n3. Simplify the calculation:\nMedian = 125 + [ (34 - 22) / 20 ] × 20 = 125 + 12 = 137.\n4. Therefore, the median is 137. (NCERT Chapter 13 Exercise)"
          }
        ]
      },
      {
        id: "probability",
        title: "Probability",
        notes: "### 1. Theoretical Probability\nP(E) = (Number of outcomes favorable to E) / (Total number of equally likely outcomes).\n\n### 2. Axioms and Ranges\n- For any event E, the probability lies between 0 and 1: 0 ≤ P(E) ≤ 1.\n- Sure or Certain Event: P(E) = 1.\n- Impossible Event: P(E) = 0.\n\n### 3. Complementary Events\nFor any event E, not E (written as Ē) is its complement:\nP(E) + P(Ē) = 1",
        worksheet: [
          {
            id: "m-w14-1",
            question: "Which of the following cannot be the probability of an event?",
            options: ["2/3", "-1.5", "15%", "0.7"],
            correctAnswerIndex: 1,
            explanation: "The probability of any event must lie between 0 and 1, inclusive (0 ≤ P(E) ≤ 1). A negative value like -1.5 is impossible. (NCERT Exercise 14.1 Q4)"
          },
          {
            id: "m-w14-2",
            question: "A bag contains 3 red balls and 5 black balls. A ball is drawn at random from the bag. What is the probability that the ball drawn is: (i) red? (ii) not red?",
            explanation: "1. Find total outcomes: Total balls = 3 Red + 5 Black = 8 balls.\n2. (i) Probability of Red: P(Red) = Favorable outcomes / Total outcomes = 3/8.\n3. (ii) Probability of Not Red: P(Not Red) = 1 - P(Red) = 1 - 3/8 = 5/8.\n4. Hence, (i) P(Red) = 3/8, and (ii) P(Not Red) = 5/8. (NCERT Exercise 14.1 Q8)"
          }
        ]
      }
    ]
  },
  {
    id: "science",
    name: "Science",
    color: "emerald",
    chapters: [
      {
        id: "chem-reactions",
        title: "Chemical Reactions and Equations",
        notes: "### 1. Balancing\nRespects Conservation of Mass.\n\n### 2. Types of Reactions\nCombination, Decomposition, Displacement, Double Displacement, Redox (Oxidation-Reduction).",
        worksheet: [
          {
            id: "s-w1",
            question: "Which gas is evolved when lead nitrate crystals are heated in a dry test tube?",
            options: ["Oxygen and Nitrogen dioxide (Brown fumes)", "Nitrogen and Hydrogen", "Pure chlorine", "Sulphur dioxide"],
            correctAnswerIndex: 0,
            explanation: "Thermal decomposition of Lead Nitrate yields Lead Oxide, Oxygen, and Nitrogen Dioxide which escapes as characteristic brown fumes. (CBSE Board 2020)"
          },
          {
            id: "s-w1-2",
            question: "Which of the following is a displacement reaction?",
            options: [
              "Fe(s) + CuSO4(aq) → FeSO4(aq) + Cu(s)",
              "CaCO3(s) → CaO(s) + CO2(g)",
              "2H2(g) + O2(g) → 2H2O(l)",
              "NaOH(aq) + HCl(aq) → NaCl(aq) + H2O(l)"
            ],
            correctAnswerIndex: 0,
            explanation: "In a displacement reaction, a highly reactive element displaces a less reactive element from its salt solution. Here, Iron displaces Copper. (CBSE Board 2018)"
          }
        ]
      },
      {
        id: "acids-bases",
        title: "Acids, Bases and Salts",
        notes: "### 1. Classification\nAcids liberate H+, Bases OH-. Neutralization yields Salt + Water.\n\n### 2. Commercial Compounds\nNaOH (Chlor-Alkali), Bleaching Powder (CaOCl₂), Baking Soda (NaHCO₃), Plaster of Paris.",
        worksheet: [
          {
            id: "s-w2",
            question: "What is the chemical formula of Plaster of Paris?",
            options: ["CaSO4 · 1/2 H2O", "CaSO4 · 2 H2O", "CaSO4 · H2O", "2 CaSO4 · H2O"],
            correctAnswerIndex: 0,
            explanation: "POP is Calcium Sulphate Hemihydrate (CaSO4 · 1/2 H2O). On mixing with water it sets into Gypsum (Dihydrate). (CBSE Board 2022)"
          },
          {
            id: "s-w2-2",
            question: "What is the pH range of a healthy human body?",
            options: ["7.0 to 7.8", "6.2 to 6.8", "8.1 to 8.5", "5.5 to 6.2"],
            correctAnswerIndex: 0,
            explanation: "All biological metabolic reactions in the human body occur within a tight, slightly alkaline pH range of 7.0 to 7.8. (CBSE Board 2019)"
          }
        ]
      },
      {
        id: "metals-nonmetals",
        title: "Metals and Non-Metals",
        notes: "### 1. Properties\nMetals are basic oxides; nonmetals are acidic oxides. Metals displace less active metals.\n\n### 2. Extraction\nCalcination (carbonate ores) and Roasting (sulphide ores).",
        worksheet: [
          {
            id: "s-w3",
            question: "Which of the following non-metals is a liquid at standard room temperature?",
            options: ["Bromine", "Mercury", "Phosphorus", "Iodine"],
            correctAnswerIndex: 0,
            explanation: "Bromine is the only non-metal that is a liquid at standard room temperature. Mercury is a metal with liquid state. (CBSE Board 2019)"
          },
          {
            id: "s-w3-2",
            question: "Galvanisation is a method of protecting iron from rusting by coating it with a thin layer of which metal?",
            options: ["Zinc", "Aluminium", "Silver", "Nickel"],
            correctAnswerIndex: 0,
            explanation: "Galvanisation provides sacrificial corrosion protection to steel or iron items by coating them in zinc. (CBSE Board 2021)"
          }
        ]
      },
      {
        id: "carbon-compounds",
        title: "Carbon and Its Compounds",
        notes: "### 1. Versatile Nature\nCatenation (self-linking) and Tetravalency allow carbon to form a vast array of compounds.\n\n### 2. Hydrocarbons\nSaturated (alkanes) and Unsaturated (alkenes, alkynes). Simple structural isomers.",
        worksheet: [
          {
            id: "s-w4",
            question: "What is the general formula for Alkenes?",
            options: ["C_n H_2n", "C_n H_2n+2", "C_n H_2n-2", "C_n H_n"],
            correctAnswerIndex: 0,
            explanation: "Alkenes are unsaturated hydrocarbons with a double bond. Their general formula is C_n H_2n. (CBSE Board 2020)"
          },
          {
            id: "s-w4-2",
            question: "Which of the following belongs to a homologous series of Alkanes?",
            options: ["C2H6", "C2H4", "C2H2", "CH3OH"],
            correctAnswerIndex: 0,
            explanation: "Alkanes follow the formula C_n H_2n+2. Ethane (C2H6) is an alkane, whereas C2H4 is an alkene, and C2H2 is an alkyne. (CBSE Board 2017)"
          }
        ]
      },
      {
        id: "periodic-classification",
        title: "Periodic Classification of Elements",
        notes: "### 1. Modern Periodic Law\nProperties of elements are a periodic function of their atomic numbers, proposed by Henry Moseley.\n\n### 2. Trends\nValency, Atomic Radius, and Metallic character trends down group & across period.",
        worksheet: [
          {
            id: "s-w5",
            question: "How does the metallic character of elements change across a period from left to right?",
            options: ["Decreases", "Increases", "Remains unchanged", "First increases then decreases"],
            correctAnswerIndex: 0,
            explanation: "From left to right across a period, nuclear charge increases making it harder to lose valence electrons, hence metallic character decreases. (CBSE Board 2022)"
          }
        ]
      },
      {
        id: "life-processes",
        title: "Life Processes",
        notes: "### 1. Nutrition & Respiration\nAutotrophic/heterotrophic digestion. Aerobic (mitochondria) vs Anaerobic (lactic acid/yeast) respiration.\n\n### 2. Circulation & Excretion\nDouble circulation in human hearts. Nephron filtration in kidneys.",
        worksheet: [
          {
            id: "s-w6",
            question: "In human male heart, which chamber receives oxygenated blood from the lungs?",
            options: ["Left Atrium", "Right Atrium", "Left Ventricle", "Right Ventricle"],
            correctAnswerIndex: 0,
            explanation: "Oxygenated blood flows from lungs via pulmonary veins directly into the Left Atrium. (CBSE Board 2021)"
          },
          {
            id: "s-w6-2",
            question: "The breakdown of pyruvate to give carbon dioxide, water and energy takes place in which cell organelle?",
            options: ["Mitochondria", "Cytoplasm", "Chloroplast", "Nucleus"],
            correctAnswerIndex: 0,
            explanation: "Anaerobic respiration breaks down pyruvate in cytoplasm, whereas aerobic respiration breaks it down inside mitochondria to release massive ATP energy. (CBSE Board 2019)"
          }
        ]
      },
      {
        id: "control-coordination",
        title: "Control and Coordination",
        notes: "### 1. Nervous System\nNeuron, synapses, reflex action, and the regions of the Human Brain.\n\n### 2. Hormones\nAdrenaline, Thyroxine, Insulin, Growth Hormones, and Plant auxins/gibberellins.",
        worksheet: [
          {
            id: "s-w7",
            question: "Which plant hormone is primarily responsible for promoting cell elongation and phototropic curvature?",
            options: ["Auxin", "Cytokinin", "Abscisic Acid", "Gibberellin"],
            correctAnswerIndex: 0,
            explanation: "Auxin is synthesized at shoot tips and diffuses to the shaded side, causing cells there to grow longer and bend the plant towards light. (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "organisms-reproduce",
        title: "How Do Organisms Reproduce?",
        notes: "### 1. Asexual Reproduction\nFission, Budding, Spore formation, Regeneration, Vegetative propagation.\n\n### 2. Sexual Reproduction\nFlowering plants pollination, Human reproductive system, and contraception methods.",
        worksheet: [
          {
            id: "s-w8",
            question: "Which of the following is a female contraceptive barrier method?",
            options: ["Diaphragm", "Copper-T", "Oral Pills", "Tubectomy"],
            correctAnswerIndex: 0,
            explanation: "A diaphragm is a mechanical barrier that prevents sperm from reaching the egg. Oral pills adjust chemistry, and Copper-T is an IUCD. (CBSE Board 2018)"
          }
        ]
      },
      {
        id: "heredity-evolution",
        title: "Heredity and Evolution",
        notes: "### 1. Mendelian Genetics\nMendel's trials with Pea Plants (Monohybrid 3:1, Dihydrate 9:3:3:1 ratios). Law of Dominance.\n\n### 2. Sex Determination\nDetermined by paternal sperm chromosome (X or Y) in humans.",
        worksheet: [
          {
            id: "s-w9",
            question: "If a pure tall pea plant (TT) is crossed with a pure dwarf plant (tt), what is the ratio of tall to dwarf plants in the F2 generation?",
            options: ["3:1", "1:1", "9:3:3:1", "all tall"],
            correctAnswerIndex: 0,
            explanation: "F1 is hybrid tall (Tt). Interbreeding F1 (Tt x Tt) yields TT, Tt, Tt, tt. The phenotypic ratio of Tall:Dwarf is 3:1. (CBSE Board 2019)"
          }
        ]
      },
      {
        id: "light-reflection",
        title: "Light – Reflection and Refraction",
        notes: "### 1. Mirror and Lens Formula\n- Mirror: 1/f = 1/v + 1/u, Magnification m = -v/u\n- Lens: 1/f = 1/v - 1/u, Magnification m = v/u\n- Power of lens P = 1 / f (in meters) (Dioptre D).",
        worksheet: [
          {
            id: "s-w10",
            question: "A convex lens has a focal length of 50 cm. What is its optical refracting power?",
            options: ["+2 D", "-2 D", "+0.5 D", "+5 D"],
            correctAnswerIndex: 0,
            explanation: "Power = 1 / f(in m). 50 cm = 0.5 m. Power = 1 / 0.5 = +2 Dioptres. Positive indicates a converging convex lens. (CBSE Board 2022)"
          }
        ]
      },
      {
        id: "human-eye",
        title: "The Human Eye and the Colourful World",
        notes: "### 1. Vision Defects\n- Myopia (shortsightedness): Corrected with concave lenses.\n- Hypermetropia (farsightedness): Corrected with convex lenses.\n\n### 2. Natural Phenomona\nPrism dispersion, atmospheric refraction (twinkling of stars), and scattering of light (blue sky).",
        worksheet: [
          {
            id: "s-w11",
            question: "Which optical phenomenon is primarily responsible for the brilliant spectrum of colors seen during a rainbow?",
            options: ["Dispersion, internal reflection, and refraction", "Atmospheric scattering-only", "Direct total diffraction", "Interference"],
            correctAnswerIndex: 0,
            explanation: "Water droplets act as tiny prisms. Light undergoes refraction, dispersion, internal reflection and refraction to form rainbows. (CBSE Board 2021)"
          }
        ]
      },
      {
        id: "electricity",
        title: "Electricity",
        notes: "### 1. Ohm's Law & Parameters\nV = IR. Resistance R = ρ(l/A). Joule heating H = I²Rt.",
        worksheet: [
          {
            id: "s-w12",
            question: "Calculate the heat produced in a resistor of 10 Ω when a current of 2 A flows for 5 seconds.",
            options: ["200 J", "100 J", "40 J", "20 J"],
            correctAnswerIndex: 0,
            explanation: "Heat H = I²Rt = (2)² × 10 × 5 = 4 × 50 = 200 Joules. (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "magnetic-effects",
        title: "Magnetic Effects of Electric Current",
        notes: "### 1. Magnetic Fields\nSolenoids, Field patterns of conductors. Right Hand Thumb rule.\n\n### 2. Rules\nFleming's Left Hand Rule (force on current carrying conductor in external magnetic fields). Overloading & short circuits.",
        worksheet: [
          {
            id: "s-w13",
            question: "According to Fleming's Left Hand Rule, what does the index Forefinger represent?",
            options: ["Direction of Magnetic Field", "Direction of Force/Motion", "Direction of Induced Current", "Direction of electric voltage"],
            correctAnswerIndex: 0,
            explanation: "ThUMB represents Motion, Forefinger represents Magnetic Field, and Middle finger represents electric Current. (CBSE Board 2020)"
          }
        ]
      },
      {
        id: "sources-energy",
        title: "Sources of Energy",
        notes: "### 1. Energy Reserves\nConventional (Coal, Thermal, Hydro) vs Non-Conventional (Solar, Wind, Nuclear, Biogas) energy grids.",
        worksheet: [
          {
            id: "s-w14",
            question: "What is the main constituent of Biogas (Gobar gas)?",
            options: ["Methane (CH4)", "Carbon dioxide", "Hydrogen sulphide", "Ethane"],
            correctAnswerIndex: 0,
            explanation: "Biogas contains up to 75% Methane (CH4) gas, which makes it an excellent, clean, non-smoking fuel. (CBSE Board 2017)"
          }
        ]
      },
      {
        id: "our-environment",
        title: "Our Environment",
        notes: "### 1. Ecosystem Dynamics\nFood chains, trophic levels. Ten-percent energy flow law.\n\n### 2. Ozone Layer Depletion\nChlorofluorocarbons (CFCs) breaking O₃ molecules, causing skin disorders.",
        worksheet: [
          {
            id: "s-w15",
            question: "If 1000 Joules of energy is available at the producer level, how much energy is transferred to the primary consumers under Lindeman's 10% model?",
            options: ["100 Joules", "10 Joules", "1 Joule", "1000 Joules"],
            correctAnswerIndex: 0,
            explanation: "Only 10% of energy is passed to the next trophic level. 10% of 1000 J is 100 J. (CBSE Board 2021)"
          }
        ]
      },
      {
        id: "resource-management",
        title: "Management of Natural Resources",
        notes: "### 1. Five R's\nRefuse, Reduce, Reuse, Repurpose, Recycle.\n\n### 2. Dams & Water Conservation\nKhadins, water harvesting layouts.",
        worksheet: [
          {
            id: "s-w16",
            question: "Which of the following is a traditional rain-water harvesting structure in Rajasthan?",
            options: ["Khadins", "Kulhs", "Bhandaras", "Eris"],
            correctAnswerIndex: 0,
            explanation: "Khadins are ancient water harvesting earth mounds built in Rajasthan desert regions to support crops. (CBSE Board 2019)"
          }
        ]
      }
    ]
  },
  {
    id: "english",
    name: "English",
    color: "rose",
    chapters: [
      {
        id: "letter-god",
        title: "A Letter to God (Prose)",
        notes: "### G.L. Fuentes\nFaith can move mountains but irony rules human relationships.",
        worksheet: [
          {
            id: "e-w1",
            question: "What did Lencho call the post-office employees in his second message to God?",
            options: ["A bunch of crooks", "Saviors of humanity", "Unhelpful clerks", "Generous donors"],
            correctAnswerIndex: 0,
            explanation: "Believing the workers pocketed 30 pesos of the 100 pesos, Lencho called them 'a bunch of crooks'. (CBSE Board 2020)"
          },
          {
            id: "e-w1-q1",
            question: "In what manner did Lencho's cornfield suffer damage? Did he hold any expectations of receiving assistance? (3 Marks)",
            explanation: "Lencho's cornfield suffered complete damage due to a devastating hailstorm that left the field looking as if covered in salt, with no leaves left on trees and flowers gone from the plants.\n\nHe had absolute, unflinching expectations of receiving assistance. He wrote a letter to God requesting 100 pesos to sow his field again and support his family, firmly believing God would help him. (CBSE Board 2025)"
          },
          {
            id: "e-w1-q2",
            question: "Illustrate Lencho's unwavering faith in the divine. (3 Marks)",
            explanation: "Lencho's faith shines brightly during his distress. He treated God as a real, personal entity and wrote a letter directly to Him. He did not blame God for the disaster, but instead suspected the post office employees of stealing when he received only 70 pesos, showing his pure and innocent belief that God could never make a mistake. (CBSE Board 2025)"
          },
          {
            id: "e-w1-q3",
            question: "What were the problems that made Lencho write a letter to God? (3 Marks)",
            explanation: "A devastating hailstorm completely ruined his corn crop, leaving no food for his family. Facing severe starvation and having no other resource or savings to purchase fresh seeds, Lencho wrote a letter to God asking for 100 pesos to recover his losses and feed his family. (CBSE Board 2025)"
          },
          {
            id: "e-w1-q4",
            question: "Why did Lencho not trust the post office employees? (3 Marks)",
            explanation: "Lencho received only 70 pesos instead of the 100 pesos he had requested. Since he had absolute, unwavering faith in God and believed that God could neither make a mistake nor deny him his request, he concluded that the post office workers must have stolen the remaining 30 pesos, calling them a 'bunch of crooks'. (CBSE Board 2025)"
          },
          {
            id: "e-w1-q5",
            question: "Faith is like a ray of hope in a distressful situation. Discuss 'A Letter to God' with reference to Lencho's unflinching faith in God. (3/5 Marks)",
            explanation: "Lencho is a hardworking farmer who depends entirely on his crops for survival. When a hailstorm destroys his livelihood, his strong faith in God prompts him to write a letter asking for 100 pesos instead of giving up. He never doubts God's existence and suspects the postal staff rather than questioning God. His belief inspires the postmaster to assist him, illustrating how hope and determination keep a person mentally strong in distress. (CBSE Board 2025)"
          },
          {
            id: "e-w1-q6",
            question: "Read the extract and answer the questions:\n\"Not a leaf remained on the trees. The corn was totally destroyed. The flowers were gone from the plants. Lencho’s soul was filled with sadness. When the storm had passed, he stood in the middle of the field and said to his sons, 'A plague of locusts would have left more than this. The hail has left nothing. This year we will have no corn.' That night was a sorrowful one. 'All our work, for nothing.' 'There’s no one who can help us.' 'We’ll all go hungry this year.'\"\n\n(i) Why were there no leaves left on the trees?\n(A) The locusts ate them up.\n(B) An earthquake had occurred.\n(C) There was a hailstorm.\n(D) The animals grazed on them.\n\n(ii) Fill in the blank with the correct word from the brackets:\nLencho felt __________ (jubilant/devastated) when he saw his destroyed corn fields.\n\n(iii) When Lencho says, 'All our work, for nothing,' what does he refer to? Explain in about 40 words.\n\n(iv) Why would Lencho have preferred a plague of locusts to a hailstorm? (5 Marks)",
            explanation: "**(i)** (C) There was a hailstorm.\n\n**(ii)** devastated\n\n**(iii)** He refers to his hard work farming the cornfield for months. The hailstorm destroyed his entire crop in a single hour, leaving his family with no corn and rendering all his physical labor completely useless.\n\n**(iv)** Because a plague of locusts would have left at least something behind, whereas the hailstorm left absolutely nothing. (CBSE Board 2025)"
          },
          {
            id: "e-w1-q7",
            question: "Comment on the reactions and feelings of Lencho and Nelson Mandela when they faced challenges in their lives. (A Letter to God & Nelson Mandela: Long Walk to Freedom) (6 Marks)",
            explanation: "Lencho and Nelson Mandela represent two distinct but powerful approaches to adversity:\n\n1. **Lencho's Reaction**: Faced with physical ruin, he seeks solace in a pure, unquestioning faith in an external, divine helper. His response is active and direct—writing a letter requesting money—but it lacks self-awareness, as he misinterprets human kindness as dishonesty.\n\n2. **Nelson Mandela's Reaction**: Faced with systemic, political oppression, Mandela draws on internal strength, community solidarity, and personal struggle. He actively fights for freedom, accepting the twin obligations to his family and his people, believing in the eventual triumph of humanity.\n\nWhile Lencho's faith is localized and self-focused, Mandela's courage is collective and revolutionary. (CBSE Board 2025)"
          },
          {
            id: "e-w1-q8",
            question: "Analyse and evaluate the role of faith in 'A Letter to God' and 'The Sermon at Benares'. (6 Marks)",
            explanation: "Faith acts as a transformational force in both texts, though it manifests differently:\n\n1. **In 'A Letter to God'**: Lencho's faith is innocent, literal, and absolute. It keeps his hope alive during a crisis, but also blinds him to the reality of human charity, as he suspects the post office staff who helped him. His faith is unwavering but unreflective.\n\n2. **In 'The Sermon at Benares'**: Kisa Gotami's initial faith is a desperate seeking of a cure for her dead son. The Buddha elevates her faith by sending her to collect mustard seeds from a death-free house. Her search leads to self-realization and enlightenment, accepting mortality as a universal truth.\n\nUltimately, Lencho's faith is a source of hope, whereas Kisa's faith evolves into deep, spiritual wisdom. (CBSE Board 2025)"
          },
          {
            id: "e-w1-q9",
            question: "Analyse the similarities and differences between the young seagull from 'Two Stories about Flying' and Lencho from 'A Letter to God', and provide a rationale for the significant role faith plays in challenging and adverse situations on life. (6 Marks)",
            explanation: "Both characters undergo major physical and psychological trials:\n\n1. **Similarities**: Both face severe limitations and fear of survival. The young seagull is physically terrified of flying and starving, while Lencho is emotionally devastated by the loss of his livelihood. Both require a form of faith to overcome their crises.\n\n2. **Differences**: The young seagull's challenge is overcoming self-doubt and fear of physical flight, pushed by his family's tough love. Lencho's challenge is economic survival, relying entirely on a letter to God.\n\n3. **Role of Faith**: Faith acts as a powerful psychological anchor. For the seagull, it is self-belief and natural instinct. For Lencho, it is divine faith. It provides the courage necessary to take action in challenging times. (CBSE Board 2025)"
          },
          {
            id: "e-w1-q10",
            question: "Compare and contrast the role of faith between the young Seagull from 'Two Stories about Flying' and Lencho from 'A Letter to God'. (6 Marks)",
            explanation: "The nature and source of faith contrast sharply between the two:\n\n1. **The Young Seagull**: Starts with complete self-doubt and fear of his wings. His faith is latent and must be coaxed out through hunger and the mother's clever motivation. It is an internal, experiential faith that grows only after his first plunge.\n\n2. **Lencho**: Possesses complete, unwavering, and blind faith from the very beginning. He does not need a push or experience; he is absolutely confident of receiving help. His faith is externalized and spiritual, treated as a natural truth.\n\nWhile the seagull discovers faith through action, Lencho acts solely because of his pre-existing faith. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "nelson-mandela",
        title: "Nelson Mandela: Long Walk to Freedom (Prose)",
        notes: "### Nelson R. Mandela\nApartheid's legacy and the human dual obligations.",
        worksheet: [
          {
            id: "e-w2",
            question: "According to Nelson Mandela, what are the twin obligations?",
            options: [
              "Obligations to family and obligations to people/country",
              "Obligation to secure weapons and safe guards",
              "Obligation to trade and earn capital",
              "None of these"
            ],
            correctAnswerIndex: 0,
            explanation: "The text states every man has dual obligations - first to family/parents and second to community/citizens. (CBSE Board 2022)"
          },
          {
            id: "e-w2-q1",
            question: "Why, according to Mandela, was it important to learn to hate? (3 Marks)",
            explanation: "Mandela believed that since people must learn to hate, they can also be taught to love, because love comes far more naturally to the human heart than its opposite. In prison, seeing even a brief glimmer of humanity in a guard was enough to prove that man's goodness can be hidden but never extinguished. (CBSE Board 2025)"
          },
          {
            id: "e-w2-q2",
            question: "The transition from the apartheid system in South Africa to a new era of equality reflects broader historical trends in the struggle for human rights and social justice. Elaborate. (3 Marks)",
            explanation: "Apartheid was a system of extreme racial discrimination, segregation, and denial of basic human rights to black Africans. The transition to a democratic, non-racial government of equal rights reflects a wider historical movement toward human dignity, social justice, and equality, proving that collective, persistent struggle can overthrow deeply entrenched systems of oppression. (CBSE Board 2025)"
          },
          {
            id: "e-w2-q3",
            question: "Mandela in his speech says, 'The policy of apartheid created a deep and lasting wound in my country and my people.' Explain the significance of the word 'wound'. (3 Marks)",
            explanation: "The word 'wound' symbolizes the profound emotional, social, and psychological trauma inflicted by decades of oppressive, brutal, and discriminatory white rule under the apartheid system on the black people of South Africa. It represents a scar of inferiority, fear, and loss of dignity that requires generations of healing. (CBSE Board 2025)"
          },
          {
            id: "e-w2-q4",
            question: "Why does the author use the phrase 'that drove a law-abiding citizen to become a criminal' to describe Mandela? (3 Marks)",
            explanation: "Mandela was driven by a deep yearning to secure basic freedom and dignity for his oppressed people. To fight against the unjust and inhumane laws of apartheid, he was forced to defy those laws, transforming him from a peaceful, law-abiding attorney into an outlaw and revolutionary who was hunted and imprisoned by the state. (CBSE Board 2025)"
          },
          {
            id: "e-w2-q5",
            question: "How did Mandela learn the meaning of 'courage'? (3 Marks)",
            explanation: "Mandela learned the meaning of courage by observing his comrades in the struggle risk and sacrifice their lives for an idea. He witnessed men and women stand up to brutal attacks and torture without breaking, demonstrating a resilience that defied imagination. He realized courage is not the absence of fear, but the triumph over it. (CBSE Board 2025)"
          },
          {
            id: "e-w2-q6",
            question: "Why did Mandela feel that liberation was important for both the oppressor and the oppressed? (3 Marks)",
            explanation: "Mandela believed that both the oppressor and the oppressed are robbed of their humanity. While the oppressed is physically enslaved, the oppressor is a prisoner of hatred, locked behind the bars of prejudice and narrow-mindedness. Thus, both must be liberated to restore mutual human dignity. (CBSE Board 2025)"
          },
          {
            id: "e-w2-q7",
            question: "In what way did Mandela’s yearning for freedom alter the course of his life? (3 Marks)",
            explanation: "Mandela's deep desire to secure freedom and self-respect for his people transformed him completely. It turned a frightened young lawyer into a bold, law-defying rebel, drove a family-loving husband to live like a homeless monk, and forced a life-loving man to live in isolation, dedicating himself fully to the struggle. (CBSE Board 2025)"
          },
          {
            id: "e-w2-q8",
            question: "How did Nelson Mandela’s understanding of freedom change over the course of time? (3 Marks)",
            explanation: "As a child, freedom was simple: running in fields and swimming in streams. As a student, it was transitory: staying out at night and reading what he pleased. As a young man, it was basic and honorable: earning a living, marrying, and having a family. Finally, as an adult, he realized freedom is indivisible and fought for the political emancipation of all black Africans. (CBSE Board 2025)"
          },
          {
            id: "e-w2-q9",
            question: "Why does Mandela feel very strongly about 'an extraordinary human disaster'? (3 Marks)",
            explanation: "Mandela refers to the brutal policy of apartheid, which he calls an extraordinary human disaster because it legalized racial discrimination, oppression, and systematic humiliation of black-skinned people in their own homeland by a white minority for decades. (CBSE Board 2025)"
          },
          {
            id: "e-w2-q10",
            question: "Read the extract and answer the questions:\n\"It is from these comrades in the struggle that I learned the true meaning of courage. Time and again, I have seen men and women risk and give up their lives for an idea. I have seen men and women stand up to attacks and torture without breaking, showing a strength and resilience that defies the imagination. I learned that courage was not the absence of fear, but the triumph over it. The brave man is not he who does not feel afraid, but he who conquers that fear.\"\n\n(i) What effect does the experience described have on the speaker?\n\n(ii) Select one inference about the idea of courage from the given context:\n(A) being fearless\n(B) absence of fear\n(C) feeding your fears\n(D) ability to overcome fear\n\n(iii) According to the author, what does true courage entail? How does this perspective differ from a common misconception? (Answer in 40 words)\n\n(iv) Fill in the blank with the correct phrase from the bracket:\nMen stood up to torture showing strength and resilience that is ____________ (impossible to understand / seeped in reality). (5 Marks)",
            explanation: "**(i)** It helped him realize the true meaning of courage, resilience, and strength through conquering fear.\n\n**(ii)** (D) ability to overcome fear\n\n**(iii)** True courage entails the triumph over fear rather than its complete absence. This differs from the common misconception that being brave means feeling absolutely no fear or avoiding risk.\n\n**(iv)** impossible to understand (CBSE Board 2025)"
          },
          {
            id: "e-w2-q11",
            question: "In 'The Ball Poem', Berryman explores loss, growing up, and transformation. Mandela also experienced loss of freedom. Compare and contrast the commonality of themes. (6 Marks)",
            explanation: "Both texts explore the universal theme of dealing with loss and the maturity that comes from it:\n\n1. **The Ball Poem**: Centers on a young boy learning the 'epistemology of loss' after losing his ball. He learns to accept that material losses are an inevitable part of life and must be met with emotional resilience and growth.\n\n2. **Long Walk to Freedom**: Centers on Mandela and his nation accepting the collective loss of freedom, dignity, and loved ones during decades of struggle against apartheid. They learn to turn this loss into a source of indomitable courage and strength.\n\nBoth works demonstrate that while loss causes deep pain, accepting and overcoming it is vital for personal and collective transformation and maturity. (CBSE Board 2025)"
          },
          {
            id: "e-w2-q12",
            question: "Both 'Nelson Mandela: Long Walk to Freedom' and 'The Trees' by Adrienne Rich explore themes of transformation, liberation, and the power to change. Examine the commonality. (6 Marks)",
            explanation: "Both works serve as powerful metaphors for the unstoppable struggle for liberation:\n\n1. **Nelson Mandela**: Portrays the historic, long struggle of black Africans breaking free from the suffocating, artificial chains of apartheid to establish a democratic state of equal rights.\n\n2. **The Trees**: Portrays decorative, confined trees rebelling against their domestic house veranda, working all night to break glass barriers and reclaim their natural, rightful home in the open forest.\n\n**Commonality**: Both explore the idea that the desire for freedom is natural and cannot be permanently suppressed. Whether it is human society or nature, the power to change and achieve liberation will eventually break down any artificial boundaries of captivity. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "stories-flying",
        title: "Two Stories About Flying (Prose)",
        notes: "### 1. His First Flight & 2. Black Aeroplane\nConquering fears and finding faith over stormy clouds.",
        worksheet: [
          {
            id: "e-w3",
            question: "Who guided the Dakota pilot safely out of the severe storm clouds?",
            options: ["A mysterious pilot in a black aeroplane", "His own auto-pilot computer", "The Paris air station", "The radio operator"],
            correctAnswerIndex: 0,
            explanation: "A black plane with no lights on wings guided the pilot safely through storm clouds before disappearing. (CBSE Board 2021)"
          },
          {
            id: "e-w3-q1",
            question: "What strategy did the mother adopt to teach the young seagull how to fly? (3 Marks)",
            explanation: "The mother seagull adopted a clever strategy of tough love: she let him starve on the ledge for 24 hours, then flew near him dangling a piece of fish just out of reach. Driven by extreme hunger, the young seagull dived off the cliff, forcing his wings to spread and launch into flight. (CBSE Board 2025)"
          },
          {
            id: "e-w3-q2",
            question: "The young seagull’s fear of flying and reluctance to leave his ledge contribute to the development of the theme of independence and courage. Justify. (3 Marks)",
            explanation: "His fear creates the central conflict, illustrating that physical and psychological boundaries can only be broken by taking a risk. His parents' strict refusal to feed him forces him to overcome self-doubt, proving that true independence requires stepping out of one's comfort zone and showing courage in the face of fear. (CBSE Board 2025)"
          },
          {
            id: "e-w3-q3",
            question: "'He was not falling headlong now. He was soaring gradually downwards and outwards, he was no longer afraid.' Describe the young seagull’s experiences just before this moment. (3 Marks)",
            explanation: "Just before this, the young seagull was paralyzed by fear, watching his family fly from a distance while starving for 24 hours. When he dived for the fish, a monstrous terror seized him, his heart stood still, and he felt he was falling headlong. But within a minute, his wings spread, wind rushed against his chest, and his fear turned into soaring confidence. (CBSE Board 2025)"
          },
          {
            id: "e-w3-q4",
            question: "Why was the seagull afraid to fly? Why was he alone? (3 Marks)",
            explanation: "The young seagull was afraid to fly because he lacked confidence, believing his wings were too weak and would never support him over the vast sea. He was left alone on the ledge by his family to starve, as part of a deliberate lesson to push him to overcome his cowardice. (CBSE Board 2025)"
          },
          {
            id: "e-w3-q5",
            question: "Motivation influences our willingness to overcome challenges. Discuss how the young seagull demonstrates this. (3 Marks)",
            explanation: "The young seagull was too terrified to fly despite his parents' verbal threats. However, his hunger became an overwhelming motivator when he saw his mother carrying a piece of fish. The sheer desperation for food overcame his deep-seated fear, demonstrating that necessity is the mother of action and courage. (CBSE Board 2025)"
          },
          {
            id: "e-w3-q6",
            question: "Read the extract and answer the questions:\n\"He felt certain that his wings would never support him; so he bent his head and ran away back to the little hole under the ledge where he slept at night... His father and mother had come around calling to him shrilly, upbraiding him, threatening to let him starve on his ledge unless he flew away. But for the life of him he could not move.\"\n\n(i) State one inference about the parents of the baby seagull.\n\n(ii) Where did the little seagull sleep at night?\n\n(iii) Which factors contributed to his reluctance to fly despite threats? (Answer in 40 words)\n\n(iv) Which word correctly substitutes 'muster up' in the extract?\n(A) review (B) resolve (C) distribute (D) gather (5 Marks)",
            explanation: "**(i)** They show tough love and parenting concern, using strict measures to push him to be independent.\n\n**(ii)** In a little hole under the ledge.\n\n**(iii)** His deep-seated fear that his wings would fail, the terrifying height of the cliff, and his lack of self-confidence despite seeing his shorter-winged siblings fly.\n\n**(iv)** (D) gather (CBSE Board 2025)"
          },
          {
            id: "e-w3-q7",
            question: "Read the extract and answer the questions:\n\"The moon was coming up in the east, behind me, and stars were shining... I was flying my old Dakota aeroplane over France back to England. I was dreaming of my holiday and looking forward to being with my family. I looked at my watch: one thirty in the morning.\"\n\n(i) What time of the day is the extract set in?\n(A) dawn (B) afternoon (C) night (D) dusk\n\n(ii) State one inference about the writer from the given context.\n\n(iii) Fill in the blank: The phrase 'clear sky' adds to a sense of ___________ (favourable/flavourful) weather.\n\n(iv) How does the serene atmosphere contribute to the mood and anticipation? (Answer in 40 words) (5 Marks)",
            explanation: "**(i)** (C) night\n\n**(ii)** He is a family-loving man, excited and eagerly looking forward to spending his holiday with them.\n\n**(iii)** favourable\n\n**(iv)** The calm, cloudless night creates a tranquil and peaceful mood, intensifying his joyful anticipation of having a hearty English breakfast with his family. (CBSE Board 2025)"
          },
          {
            id: "e-w3-q8",
            question: "Read the extract and answer the questions:\n\"That was twenty-four hours ago... all day long, he had watched his parents flying about with his brothers and sister, perfecting them in the art of flight... standing on a rock, while his parents circled around raising a proud cackle...\"\n\n(i) Fill in the blank: The phrase 'proud cackle' adds to a sense of ___________ (noise/pride).\n\n(ii) How do the parents teach their young to be independent?\n\n(iii) Describe the contrasting reactions of the parents to their children.\n\n(iv) The word 'devour' in the extract most nearly means:\n(A) scared (B) gobbled (C) preserved (D) cooled (5 Marks)",
            explanation: "**(i)** pride\n\n**(ii)** By perfecting them in flight, teaching them to skim the waves, and showing them how to dive for fish.\n\n**(iii)** They praise and circle the successful brother with a proud cackle, while they leave the young seagull alone, taunting him for his cowardice.\n\n**(iv)** (B) gobbled (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "diary-anne-frank",
        title: "From the Diary of Anne Frank (Prose)",
        notes: "### Anne Frank\nPaper has more patience than people. Expression of a young Jewish girl.",
        worksheet: [
          {
            id: "e-w4",
            question: "What was the name of Anne Frank's personal diary?",
            options: ["Kitty", "Betty", "Rosy", "Margot"],
            correctAnswerIndex: 0,
            explanation: "Anne Frank treated her diary as a true friend and called it 'Kitty'. (CBSE Board 2019)"
          },
          {
            id: "e-w4-q1",
            question: "In what way does 'Anne Frank's Diary' reflect the theme of isolation? (3 Marks)",
            explanation: "The diary reflects physical isolation in the Secret Annex to escape Nazi persecution, as well as emotional isolation, as Anne felt deeply misunderstood and lonely among the adults, making her diary 'Kitty' her sole true confidant. (CBSE Board 2025)"
          },
          {
            id: "e-w4-q2",
            question: "Why did Mr. Keesing decide to stop punishing Anne for her talkative nature? (3 Marks)",
            explanation: "Mr. Keesing stopped punishing Anne because she answered his essay punishments with brilliant, humorous creativity, culminating in a witty poem about a father duck biting his talkative ducklings, which won his amusement and respect. (CBSE Board 2025)"
          },
          {
            id: "e-w4-q3",
            question: "Anne Frank was a sensitive and mature girl. Elaborate on how she handled her relationship with Mr. Keesing. (3 Marks)",
            explanation: "Instead of rebelling or becoming sullen when Mr. Keesing punished her, Anne showed remarkable maturity by accepting his punishments with good humor. She wrote clever, logical essays that argued talkativeness was a female student trait, turning Mr. Keesing's strict punishments into a source of mutual laughter. (CBSE Board 2025)"
          },
          {
            id: "e-w4-q4",
            question: "Why did Anne Frank believe that 'paper has more patience than people'? (3 Marks)",
            explanation: "Anne believed paper has more patience than people because a diary is silent, non-judgmental, and never loses interest or gets irritated. She felt she could pour her deepest thoughts, anxieties, and secrets into her diary without fearing betrayal or criticism, unlike with friends or family. (CBSE Board 2025)"
          },
          {
            id: "e-w4-q5",
            question: "Read the extract and answer the questions:\n\"I get along pretty well with all my teachers. There are nine of them, seven men and two women. Mr. Keesing, the old fogey who teaches maths, was annoyed with me for ages because I talked so much. After several warnings, he assigned me extra homework. An essay on the subject, 'A Chatterbox'.\"\n\n(i) Why was Mr. Keesing annoyed with Anne?\n\n(ii) State whether true or false:\nAnne got along terribly with all of her teachers.\n\n(iii) What does the phrase 'old fogey' indicate about Mr. Keesing’s character as perceived by Anne? (Answer in 40 words)\n\n(iv) Which topic did Mr. Keesing assign to Anne as extra homework?\n(A) A Quack Doctor\n(B) A Chatterbox\n(C) A Silent Bird\n(D) An Incorrigible talker (5 Marks)",
            explanation: "**(i)** Because she talked too much in his class.\n\n**(ii)** False.\n\n**(iii)** It indicates that Anne perceived him as old-fashioned, traditional, and excessively strict in his ideas and teaching methods.\n\n**(iv)** (B) A Chatterbox (CBSE Board 2025)"
          },
          {
            id: "e-w4-q6",
            question: "Both Anne Frank in 'From the Diary of Anne Frank' and Kisa Gotami in 'The Sermon at Benares' undergo a process of maturity. Compare and contrast their experiences. (6 Marks)",
            explanation: "Both Anne Frank and Kisa Gotami go through a profound shift in maturity, though under different circumstances:\n\n1. **Anne Frank**: Her maturity is a gradual, internal psychological development. Facing the isolation of the Secret Annex, she turns to her diary, self-reflecting on her relationships, her personality, and the harsh political reality around her. She learns to cope with her isolation with humor and resilience.\n\n2. **Kisa Gotami**: Her maturity is a sudden, traumatic spiritual awakening. Overwhelmed by grief at her son's death, she is guided by the Buddha to find a household untouched by death. Her quest helps her realize mortality is universal, transforming her grief into spiritual understanding.\n\nWhile Anne’s maturity is quiet and reflective, Kisa’s is direct and philosophical. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "hundred-dresses-1",
        title: "The Hundred Dresses – I (Prose)",
        notes: "### Eleanor Estes\nExplores discrimination, class system, and bullying of Wanda Petronski.",
        worksheet: [
          {
            id: "e-w5",
            question: "Why did Wanda Petronski sit in the quiet corner seat of Room 13?",
            options: [
              "Because her feet were usually caked with dry street mud",
              "Because she was extremely noisy",
              "Because she was very rich",
              "Because she won the math contest"
            ],
            correctAnswerIndex: 0,
            explanation: "Wanda sat there because she came from Boggins Heights and her shoes were usually muddy. (CBSE Board 2018)"
          },
          {
            id: "e-w5-q1",
            question: "Why did Maddie feel guilty about Peggy's teasing of Wanda Petronski? (3 Marks)",
            explanation: "Maddie felt guilty because she silently stood by while Peggy mocked Wanda. Since Maddie was poor herself, her fear of becoming the next target made her a silent, complicit accomplice to the bullying. (CBSE Board 2025)"
          },
          {
            id: "e-w5-q2",
            question: "True friendship requires standing up for what is right. Discuss why Maddie decides she will never stand by silently again. (3 Marks)",
            explanation: "After Wanda leaves due to the teasing, Maddie is filled with remorse. She realizes her silence made her as cowardly as Peggy, prompting her to vow never to stand by silently again, even if it means losing her friendship with Peggy. (CBSE Board 2025)"
          },
          {
            id: "e-w5-q3",
            question: "What did Maddie want to write to Peggy, and why did she tear it up? (3 Marks)",
            explanation: "Maddie wanted to write a note to Peggy asking her to stop teasing Wanda about her hundred dresses. However, she tore it up in fear, realizing that Peggy might turn her teasing onto Maddie instead, mocking her for wearing Peggy's old hand-me-down dresses. (CBSE Board 2025)"
          },
          {
            id: "e-w5-q4",
            question: "Read the extract and answer the questions:\n\"Today, Monday, Wanda Petronski was not in her seat. But nobody, not even Peggy and Madeline, the girls who started all the fun, noticed her absence. Usually Wanda sat in the seat next to the last seat in the last row in Room 13. She sat in the corner of the room where the rough boys who did not make good marks sat...\"\n\n(i) Why did nobody notice Wanda’s absence on Monday?\n\n(ii) State whether true or false:\nWanda was highly popular and sat in the front row.\n\n(iii) Why did the 'rough boys' sit in the corner of Room 13? Explain in about 40 words.\n\n(iv) Who were the girls who 'started all the fun'?\n(A) Peggy and Maddie\n(B) Miss Mason and Maddie\n(C) Wanda and Peggy\n(D) Maddie and Wanda (5 Marks)",
            explanation: "**(i)** Because she was extremely quiet, kept to herself, and had no close friends at school.\n\n**(ii)** False.\n\n**(iii)** They sat in the corner because they were noisy, scored poor marks, made the most scuffling of feet, and roared with laughter at any joke, making it the least disciplined spot in class.\n\n**(iv)** (A) Peggy and Maddie (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "hundred-dresses-2",
        title: "The Hundred Dresses – II (Prose)",
        notes: "### Eleanor Estes\nWanda's forgiveness and her beautiful dress designs.",
        worksheet: [
          {
            id: "e-w6",
            question: "What drawings did Wanda gift to Peggy and Maddie respectively?",
            options: [
              "Green dress with red trimmings to Peggy, Blue dress to Maddie",
              "Two landscape oil drawings",
              "Portraits of Mrs. Mason",
              "A cartoon of Room 13"
            ],
            correctAnswerIndex: 0,
            explanation: "Wanda gifted the green drawing to Peggy and the blue dress drawing to Maddie, highlighting her forgiveness. (CBSE Board 2020)"
          },
          {
            id: "e-w6-q1",
            question: "What was the tone of Wanda Petronski's letter to Miss Mason? What does it reveal about her? (3 Marks)",
            explanation: "Wanda's letter had a warm, friendly, and forgiving tone. Instead of showing any bitterness or anger about her treatment at school, she gifted her beautiful drawings to Peggy and Maddie, revealing her noble, generous, and loving nature. (CBSE Board 2025)"
          },
          {
            id: "e-w6-q2",
            question: "Analyze the theme of remorse and redemption in 'The Hundred Dresses – II'. (3 Marks)",
            explanation: "The theme of remorse is shown through Maddie's sleepless nights and deep guilt after Wanda's departure. Redemption is achieved when Maddie and Peggy write a friendly letter, and Wanda responds by gifting them her custom dress drawings with their faces drawn on them. (CBSE Board 2025)"
          },
          {
            id: "e-w6-q3",
            question: "Why did Mr. Petronski write a letter to the school teacher? What did he express? (3 Marks)",
            explanation: "Mr. Petronski wrote a letter to inform the school that Wanda and her brother would no longer attend, as they were moving to a big city. He expressed quiet hurt, stating that in the city, nobody would mock them for their unusual Polish name or ask 'funny' questions. (CBSE Board 2025)"
          },
          {
            id: "e-w6-q4",
            question: "How did Peggy try to justify her behavior toward Wanda? What does this reveal about her mindset? (3 Marks)",
            explanation: "Peggy tried to justify her teasing by arguing that she never actually called Wanda names or made her cry, and that by asking about her hundred dresses, she had actually inspired Wanda to design the beautiful drawings that won the contest. This reveals Peggy's self-defensive and mildly insensitive mindset. (CBSE Board 2025)"
          },
          {
            id: "e-w6-q5",
            question: "Wanda Petronski's letter and her gift of drawings represent a lesson in empathy and forgiveness. Discuss. (3/5 Marks)",
            explanation: "Instead of harboring anger or seeking revenge for being teased and bullied, Wanda responded with absolute grace and forgiveness. By gifting her award-winning dress designs specifically to her teasers, Peggy and Maddie, and drawing their faces on them, she showed that she bore no ill-will, serving as a powerful lesson in empathy. (CBSE Board 2025)"
          },
          {
            id: "e-w6-q6",
            question: "Read the extract and answer the questions:\n\"Dear Teacher: My Wanda will not come to your school any more... No more holler Pollack. No more ask why funny name. Plenty of funny names in the big city. Yours truly, Jan Petronski.\"\n\n(i) Who wrote the letter to Miss Mason?\n\n(ii) State the primary reason Wanda is leaving the school.\n\n(iii) What does the phrase 'No more ask why funny name' indicate about the social environment of the school? (Answer in 40 words)\n\n(iv) Where are Wanda and her family moving to?\n(A) Boggins Heights\n(B) A small village\n(C) A big city\n(D) Poland (5 Marks)",
            explanation: "**(i)** Wanda’s father, Mr. Jan Petronski.\n\n**(ii)** Because she was bullied and mocked by her classmates for her unusual name and poverty.\n\n**(iii)** It indicates that the social environment of the school lacked sensitivity and inclusivity, harboring subtle xenophobia and prejudice against students from immigrant backgrounds.\n\n**(iv)** (C) A big city (CBSE Board 2025)"
          },
          {
            id: "e-w6-q7",
            question: "Bullying and discrimination can leave permanent scars on a child's mind. Discuss the psychological impact of teasing on Wanda, Maddie, and Peggy, and how they individually cope with it. (6 Marks)",
            explanation: " teases and discrimination affect all three characters deeply, but in distinct ways:\n\n1. **Wanda Petronski**: She is the direct target. She suffers silently, sitting in a quiet corner, caking her feet in mud. Her coping mechanism is highly creative and noble—she constructs an imaginary world of 'a hundred dresses' in her closet, eventually expressing her forgiveness and talent through her award-winning drawings.\n\n2. **Maddie**: She represents the silent bystander. She feels intense, sickening guilt and suffers from sleeplessness and anxiety. She copes by making a firm resolution never to stand by silently again, actively pursuing redemption.\n\n3. **Peggy**: She represents the perpetrator. Initially unaware of the emotional damage she causes, she rationalizes her behavior. Confronted with the consequences, she feels a milder remorse but is comforted by Wanda's forgiveness.\n\nUltimately, the text teaches that bullying harms both target and bystander, and healing comes through empathy and remorse. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "glimpses-of-india",
        title: "Glimpses of India (Prose)",
        notes: "### Baker from Goa, Coorg, Tea from Assam\nFascinating diverse cultural vignettes of Indian landscapes.",
        worksheet: [
          {
            id: "e-w7",
            question: "What is the traditional Goan baker known as?",
            options: ["Pader", "Kabai", "Bol", "Baker"],
            correctAnswerIndex: 0,
            explanation: "The elder Goan bakers are traditionally called Paders. (CBSE Board 2022)"
          },
          {
            id: "e-w7-q1",
            question: "Explain the reasons for Rajvir's excitement on seeing the tea plantation and Pranjol's lack of enthusiasm. (3 Marks)",
            explanation: "Rajvir was excited because he was visiting Assam for the first time and witnessing vast, beautiful tea gardens that he had only read about. In contrast, Pranjol had been born and raised on a tea plantation, so the sights were ordinary and familiar to him. (CBSE Board 2025)"
          },
          {
            id: "e-w7-q2",
            question: "How does the portrayal of the baker's attire and role in the village emphasize the cultural and social significance of bread-making within the Goan community? (3 Marks)",
            explanation: "The Goan baker (pader) held a vital position in the community, as festivals and weddings were incomplete without specific breads (like bol and bolinhas). The baker's unique attire (kabai) and daily musical arrival symbolized a beloved Portuguese-Goan tradition. (CBSE Board 2025)"
          },
          {
            id: "e-w7-q3",
            question: "Why is the bread-maker still considered an essential part of Goan village life? (3 Marks)",
            explanation: "Even though the Portuguese left long ago, their traditional bread-making craft continues. The old furnaces, along with the children or grandchildren of the original bakers, still exist, maintaining Goa's cultural connection to fresh bread for celebrations, marriages, and daily breakfasts. (CBSE Board 2025)"
          },
          {
            id: "e-w7-q4",
            question: "What does the author tell us about the Coorgi people's courage and descent? (3 Marks)",
            explanation: "The Coorgi people are fiercely independent, brave, and hospitable. They are of Greek or Arabic descent, and their courage is legendary; the Coorg Regiment is one of the most decorated in the Indian Army, and General Cariappa, the first Chief of the Indian Army, was a Coorgi. (CBSE Board 2025)"
          },
          {
            id: "e-w7-q5",
            question: "Briefly explain the two popular legends regarding the origin of tea. (3 Marks)",
            explanation: "The two legends are:\n1. **Chinese Legend**: An emperor accidentally discovered tea when some tea leaves blew into his boiling water, giving it a delicious flavor.\n\n2. **Indian Legend**: Bodhidharma, an ancient Buddhist ascetic, cut off his eyelids to prevent sleep during meditation. Ten tea plants grew from his eyelids, and their leaves banished sleep when boiled in water. (CBSE Board 2025)"
          },
          {
            id: "e-w7-q6",
            question: "Read the extract and answer the questions:\n\"Our baker used to be a friend, companion and guide. He used to come at least twice a day... The children ran to meet him not for the loaf of bread, but for those bread-bangles which they chose carefully...\"\n\n(i) How did the children treat the baker?\n\n(ii) State whether true or false:\nThe baker was considered an unwelcome intruder in Goan households.\n\n(iii) What does the phrase 'bread-bangles' indicate about the baker's inventory? (Answer in 40 words)\n\n(iv) How often did the baker visit the author’s house?\n(A) Once a week\n(B) Twice a day\n(C) On festivals only\n(D) Every hour (5 Marks)",
            explanation: "**(i)** They treated him as a friend, companion, and guide, eagerly waiting for his musical arrival.\n\n**(ii)** False.\n\n**(iii)** It indicates that besides standard loaves of bread for adults, the baker specially made sweet, circular bread-bangles to appeal directly to children.\n\n**(iv)** (B) Twice a day (CBSE Board 2025)"
          },
          {
            id: "e-w7-q7",
            question: "The author shares three different accounts of regional pride and heritage in 'Glimpses of India'. Choose any two accounts and analyze how traditional occupations and geography shape the identity of their people. (6 Marks)",
            explanation: " occupations and geographical settings are fundamental in forming regional identity:\n\n1. **A Baker from Goa**: The traditional occupation of baking, inherited from Portuguese ancestors, remains a central pillar of Goan social life. The baker's musical bamboo stick, his attire, and his furnace represent a living heritage, keeping the community's warm, celebratory identity alive.\n\n2. **Coorg (Kodagu)**: The rugged, evergreen rainforest geography and coffee plantations shape Coorg's martial identity. The people's fierce independence, Greek/Arabic ancestry, hospitable nature, and legendary military bravery are directly nurtured by their mountainous, isolated homeland.\n\nBoth accounts show that cultural identity is deeply rooted in local traditions, geography, and historical occupations. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "mijbil-otter",
        title: "Mijbil the Otter (Prose)",
        notes: "### Gavin Maxwell\nPet bonding and the fun-loving character of Mijbil in Basra.",
        worksheet: [
          {
            id: "e-w8",
            question: "What type of companion animal was Mijbil?",
            options: ["An otter", "A golden retriever", "A badger", "A parrot"],
            correctAnswerIndex: 0,
            explanation: "Mijbil was a unique Iraqi marsh otter Maxwell brought to London. (CBSE Board 2021)"
          },
          {
            id: "e-w8-q1",
            question: "Mijbil's transportation to England was no less than a nightmare for the author. Justify using incidents from the lesson. (3 Marks)",
            explanation: "The airline required Mijbil to be in a box. Mijbil tore the box lining, injuring himself and leaving it blood-spattered. Later, he escaped the box inside the cabin, causing extreme panic and chaos before the author retrieved him. (CBSE Board 2025)"
          },
          {
            id: "e-w8-q2",
            question: "Mijbil the Otter is portrayed as an intelligent, friendly, and playful animal who thrives on affection. Discuss how these traits are depicted. (3 Marks)",
            explanation: "Mijbil's intelligence is shown when he learns to turn on the bathroom tap to play with water. His playful nature is highlighted by his self-invented games with marbles, balls, and water, showing high cognitive skills and affection. (CBSE Board 2025)"
          },
          {
            id: "e-w8-q3",
            question: "What did Gavin Maxwell do to keep Mijbil active and happy in London? (3 Marks)",
            explanation: "In London, Gavin Maxwell took Mijbil for long walks, allowing him to lead and explore. He also engaged Mijbil in active, playful exercises, such as jumping over low walls, running along school railings, and playing with a wide array of toys like ping-pong balls and marbles. (CBSE Board 2025)"
          },
          {
            id: "e-w8-q4",
            question: "Why did the air hostess win the author's deepest gratitude during the flight? (3 Marks)",
            explanation: "The air hostess was extremely cooperative, calm, and understanding. Recognizing the author's intense anxiety, she permitted him to keep Mijbil on his knees, and when Mijbil escaped and caused panic, she actively helped locate the pet, earning the author's lifelong gratitude. (CBSE Board 2025)"
          },
          {
            id: "e-w8-q5",
            question: "Read the extract and answer the questions:\n\"With this second letter, I took my book to the Consul-General and registered it... Two days later, my mail arrived. I carried it to my bedroom to read... There, squatting on the floor, were two Arabs; beside them lay a sack that squirmed from time to time...\"\n\n(i) What did the author receive from the two Arabs?\n\n(ii) State whether true or false:\nThe Arabs brought the author a parcel of clothes.\n\n(iii) What does the word 'squirmed' indicate about the contents of the sack? (Answer in 40 words)\n\n(iv) Where did the author carry his mail to read?\n(A) Bedroom (B) Library (C) Kitchen (D) Veranda (5 Marks)",
            explanation: "**(i)** A sack containing a male Iraqi marsh otter (Mijbil), sent by his friend.\n\n**(ii)** False.\n\n**(iii)** It indicates that whatever was inside the sack was alive, active, and moving in a twisted, restless manner, creating anticipation for the reader.\n\n**(iv)** (A) Bedroom (CBSE Board 2025)"
          },
          {
            id: "e-w8-q6",
            question: "Read the extract and answer the questions:\n\"When I returned, there was an appalling spectacle. There was complete silence from the box, but from its airholes and chinks around the lid, blood had trickled and dried... I whipped off the lock and tore open the flaps, and Mij, exhausted and blood-spattered, whimpered and caught at my leg.\"\n\n(i) Why was there blood trickling from the box?\n\n(ii) Select one word from the extract that means 'shocking or horrifying':\n(A) spectacle (B) trickled (C) whimpered (D) appalling\n\n(iii) Describe Mijbil's physical and emotional state when the author opened the box. (Answer in 40 words)\n\n(iv) Fill in the blank: The box had dried blood on its airholes, indicating a ____________ (painful/peaceful) struggle inside. (5 Marks)",
            explanation: "**(i)** Because Mijbil had desperately tried to tear open the metal lining of the box to escape, cutting himself in the process.\n\n**(ii)** (D) appalling\n\n**(iii)** He was physically exhausted, covered in dried blood, and emotionally terrified, whimpering and clinging to the author's leg for safety and comfort.\n\n**(iv)** painful (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "madam-rides-bus",
        title: "Madam Rides the Bus (Prose)",
        notes: "### Vallikkannan\nEight-year-old Valli's independent micro-bus journey and death encounter.",
        worksheet: [
          {
            id: "e-w9",
            question: "How much did Valli pay for a one-way bus ticket to town?",
            options: ["30 paise", "50 paise", "60 paise", "10 paise"],
            correctAnswerIndex: 0,
            explanation: "Valli saved coins carefully to pay the one-way fair of exactly 30 paise. (CBSE Board 2023)"
          },
          {
            id: "e-w9-q1",
            question: "How did Valli manage to gather information about the bus ride she was planning? (3 Marks)",
            explanation: "Valli gathered information by listening closely to conversations between her neighbors and regular bus passengers. She also asked discreet, casual questions to find out the fare, travel time, and distance to town. (CBSE Board 2025)"
          },
          {
            id: "e-w9-q2",
            question: "Why was Valli's excitement on the bus dampened on her return journey? What deep truth does she realize? (3 Marks)",
            explanation: "On her return journey, Valli saw the same playful cow that had amused her earlier lying dead by the roadside, hit by a fast vehicle. This sight deeply saddened her and made her realize the fragile nature of life and the harsh reality of death. (CBSE Board 2025)"
          },
          {
            id: "e-w9-q3",
            question: "Valli was a meticulous planner. Justify this statement with reference to how she planned her bus ride. (3 Marks)",
            explanation: "Valli saved every stray coin that came her way, suppressing her temptations to buy toys, peppermints, or ride the merry-go-round to save exactly 60 paise. She also chose the quiet afternoon hours when her mother slept, and calculated the timings to return home before being noticed. (CBSE Board 2025)"
          },
          {
            id: "e-w9-q4",
            question: "What was Valli's deepest desire, and how did she feel watching the bus every day? (3 Marks)",
            explanation: "Valli's deepest desire was to ride the bus that traveled between her village and the nearest town. Watching the bus carry a new set of passengers each hour filled her with an overwhelming sense of longing, curiosity, and excitement. (CBSE Board 2025)"
          },
          {
            id: "e-w9-q5",
            question: "Read the extract and answer the questions:\n\"There was a girl named Valliammai who was called Valli for short. She was eight years old and very curious about things. Her favourite pastime was standing in the front doorway of her house, watching what was happening in the street outside. There were no playmates of her own age on her street, and this was about all she had to do.\"\n\n(i) What was Valli's age?\n\n(ii) State Valli's favorite pastime.\n\n(iii) Why did Valli stand in the front doorway? Explain in about 40 words.\n\n(iv) Which word in the extract means 'the quality of wanting to know more'?\n(A) curious (B) pastime (C) street (D) doorway (5 Marks)",
            explanation: "**(i)** Eight years old.\n\n**(ii)** Standing in the front doorway of her house, watching what was happening in the street outside.\n\n**(iii)** Because there were no children of her own age on her street to play with, so watching the lively street outside was her only source of amusement and curiosity.\n\n**(iv)** (A) curious (CBSE Board 2025)"
          },
          {
            id: "e-w9-q6",
            question: "Age is not a barrier to possessing wisdom, determination, and independence. Analyze Valli's character as a mature, self-reliant eight-year-old in 'Madam Rides the Bus'. (6 Marks)",
            explanation: " Valli displays a remarkable level of self-reliance, determination, and planning that is rare for an eight-year-old:\n\n1. **Financial Discipline**: She saves money diligently, showing immense self-control by denying herself simple childhood pleasures like sweets, balloons, and amusement rides to collect the bus fare.\n\n2. **Meticulous Planning**: She gathers detailed information about the bus schedule, fares, and journey times, leaving no detail to chance.\n\n3. **Independent Demeanor**: On the bus, she refuses to be treated as a child, rejecting help from the conductor or the elderly passengers, paying her own fare, and asserting her independence.\n\n4. **Handling Reality**: Her encounter with death (the dead cow) shows her emotional depth. She does not throw a tantrum; instead, she matures instantly, understanding the silent transition of life into death.\n\nThus, Valli proves that maturity is shaped by observation, determination, and experience rather than age alone. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "sermon-benares",
        title: "The Sermon at Benares (Prose)",
        notes: "### Lord Buddha\nKisa Gotami leads to understand that death is organic and inevitable.",
        worksheet: [
          {
            id: "e-w10",
            question: "What did Buddha ask Kisa Gotami to bring as a cure for her dead son?",
            options: [
              "A handful of mustard seeds from a house where no one had died",
              "A bag of rare mountain herbs",
              "Holy water from the Ganges",
              "Gold coins"
            ],
            correctAnswerIndex: 0,
            explanation: "Buddha asked for mustard seeds from a house untouched by death, proving everyone suffers loss. (CBSE Board 2023)"
          },
          {
            id: "e-w10-q1",
            question: "Why did Buddha send Kisa Gotami to find mustard seeds? What was the outcome? (3 Marks)",
            explanation: "Buddha sent Kisa Gotami to find mustard seeds from a house untouched by death to cure her son. Going door-to-door, she realized every family had suffered loss, helping her understand that grief and death are universal. (CBSE Board 2025)"
          },
          {
            id: "e-w10-q2",
            question: "'Not from weeping or from grieving will anyone obtain peace of mind; on the contrary, his pain will be greater.' Validate this preaching of Buddha. (3 Marks)",
            explanation: "Kisa Gotami's excessive grief only isolated her and deepened her pain without bringing her son back. It was only when she stopped weeping and accepted the universal law of mortality that she found true peace of mind. (CBSE Board 2025)"
          },
          {
            id: "e-w10-q3",
            question: "Describe Kisa Gotami's behavior after her son's death, and how her neighbors reacted. (3 Marks)",
            explanation: "Overwhelmed with immense grief, Kisa Gotami carried her dead child's body to all her neighbors, asking them for medicine to cure him. Her neighbors pitied her but thought she had lost her mind, telling her that the boy was dead and no medicine could bring him back. (CBSE Board 2025)"
          },
          {
            id: "e-w10-q4",
            question: "How did Kisa Gotami realize that her grief had made her selfish? (3 Marks)",
            explanation: "Kisa Gotami sat at the wayside, watching the city lights flicker and die out. She realized that the lives of mortals are just like these lights, flickering for a while and then extinguishing. She understood that death is common to all, and that in her grief, she had been selfishly seeking to exempt only her son from mortality. (CBSE Board 2025)"
          },
          {
            id: "e-w10-q5",
            question: "Read the extract and answer the questions:\n\"At Benares, Kisa Gotami went from house to house, and the people pitied her and said, 'Here is mustard-seed; take it!' But when she asked, 'Did a son or daughter, a father or mother, die in your family?' they answered her, 'Alas! the living are few, but the dead are many. Do not remind us of our deepest grief.' And there was no house but some beloved one had died in it.\"\n\n(i) Why did Kisa Gotami go from house to house?\n\n(ii) State whether true or false:\nKisa Gotami found many houses where no one had died.\n\n(iii) What does the phrase 'the living are few, but the dead are many' mean? Explain in about 40 words.\n\n(iv) What did the people ask Kisa Gotami not to remind them of?\n(A) Their wealth (B) Their deepest grief (C) Their ancestors (D) Their mistakes (5 Marks)",
            explanation: "**(i)** To collect mustard seeds from a household where no beloved person had ever died, as requested by the Buddha to cure her dead son.\n\n**(ii)** False.\n\n**(iii)** It means that over time, the number of deceased ancestors far exceeds the small number of people currently alive, emphasizing that death is an inevitable, continuous, and universal truth.\n\n**(iv)** (B) Their deepest grief (CBSE Board 2025)"
          },
          {
            id: "e-w10-q6",
            question: "Death is common to all, yet we suffer as if we are the only ones affected. Analyze the sermon given by Buddha to Kisa Gotami, explaining how it helps a grieving person cope with a loss. (6 Marks)",
            explanation: " Buddha's sermon teaches the absolute, universal law of impermanence and mortality:\n\n1. **The Nature of Life**: Life of mortals is brief, combined with pain, and bound to end in death. Just as ripe fruits are in danger of falling, or earthen vessels made by a potter break, all living beings must die.\n\n2. **The Futility of Grief**: Weeping, grieving, or complaining does not bring back the dead. Instead, it makes the body sick, pale, and causes more self-inflicted pain, without altering the reality of loss.\n\n3. **Attaining Peace**: A wise person who understands the nature of the world does not grieve. True peace of mind is achieved only by drawing out the 'arrow of lamentation' and accepting death as an organic, inevitable, and universal truth.\n\nBuddha's words help transform Kisa Gotami's selfish, isolated grief into a compassionate, universal understanding of human suffering, providing a path to emotional healing. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "proposal",
        title: "The Proposal (Prose)",
        notes: "### Anton Chekhov\nFarce comedy of property disputes between Lomov, Chubukov and Natalya.",
        worksheet: [
          {
            id: "e-w11",
            question: "What property boundaries are Lomov and Natalya quarreling about initially?",
            options: ["Oxen Meadows", "Birchwood Forests", "Burnt Hills", "Siberian Plains"],
            correctAnswerIndex: 0,
            explanation: "They argue over the historical title of ownership of Oxen Meadows. (CBSE Board 2020)"
          },
          {
            id: "e-w11-q1",
            question: "Lomov and Natalya argue over properties instead of settling the marriage proposal. What does this reveal about their characters? (3 Marks)",
            explanation: "This reveals that both Lomov and Natalya are highly argumentative, prideful, and materialistic. They prioritize ancestral property (Oxen Meadows) and family pride over mutual affection and the primary purpose of Lomov's visit. (CBSE Board 2025)"
          },
          {
            id: "e-w11-q2",
            question: "Engaging in discussions and disputes rarely leads to problem resolution. Support this statement with evidence from 'The Proposal'. (3 Marks)",
            explanation: "In 'The Proposal', Lomov's attempt to propose repeatedly devolves into loud, hysterical arguments over Oxen Meadows and dogs. The disputes lead to physical illness for Lomov and extreme emotional distress, showing that stubborn disputes only block resolution. (CBSE Board 2025)"
          },
          {
            id: "e-w11-q3",
            question: "Why does Lomov decide to marry Natalya? What are his practical considerations? (3 Marks)",
            explanation: "Lomov is 35 years old—a critical age for marriage. He suffers from palpitations, sleeplessness, and needs to live a quiet, regular life. He considers Natalya an excellent housekeeper, well-educated, and not bad-looking, making her a highly practical match. (CBSE Board 2025)"
          },
          {
            id: "e-w11-q4",
            question: "How does Chubukov behave when Lomov first asks for Natalya’s hand? How does his behavior change later? (3 Marks)",
            explanation: "Chubukov is initially overjoyed, kissing and hugging Lomov, stating he had been hoping for this match for a long time. However, as soon as a dispute over Oxen Meadows arises, Chubukov loses his temper, joins Natalya in insulting Lomov, and drives him out of his house. (CBSE Board 2025)"
          },
          {
            id: "e-w11-q5",
            question: "Read the extract and answer the questions:\n\"LOMOV: My heart’s palpitating awfully, my ears are roaring... I must have my stand. My aunt’s grandmother gave the free use of these Meadows in perpetuity to the peasants of your father’s grandfather...\"\n\n(i) Why are Lomov’s ears roaring and heart palpitating?\n\n(ii) State whether true or false:\nLomov’s aunt’s grandmother gifted the Meadows permanently to Chubukov’s family.\n\n(iii) What does Lomov mean by saying 'I must have my stand'? Explain in about 40 words.\n\n(iv) Which property is Lomov referring to?\n(A) Oxen Meadows (B) Birchwood Forests (C) Burnt Hills (D) Red Meadows (5 Marks)",
            explanation: "**(i)** Because he is highly agitated and physically ill from arguing hysterically with Natalya over Oxen Meadows.\n\n**(ii)** False.\n\n**(iii)** He means that he refuses to back down on his claim of ownership because he believes he has solid historical and documentary proof, emphasizing his pride.\n\n**(iv)** (A) Oxen Meadows (CBSE Board 2025)"
          },
          {
            id: "e-w11-q6",
            question: "'The Proposal' is a satirical commentary on the wealthy families of Russian society who view marriage as a business deal rather than a union of hearts. Elaborate. (6 Marks)",
            explanation: " Anton Chekhov's 'The Proposal' brilliantly satirizes the materialistic outlook of 19th-century wealthy Russian landowners:\n\n1. **Marriage as a Transaction**: Lomov does not propose out of love. He approaches Natalya with cool, practical calculations about his age, health, and her housekeeping abilities, while Chubukov welcomes the proposal as a lucrative alliance that secures their property.\n\n2. **Absence of Emotion**: Instead of romantic courtship, Natalya and Lomov immediately fall into bitter, childish arguments over Oxen Meadows and their hunting dogs (Squeezer and Guess), demonstrating their extreme pride and greed.\n\n3. **Quick Resolution**: Even when Lomov collapses and is feared dead, Chubukov desperately forces them to kiss and agree to the marriage the moment Lomov recovers. Even after accepting, they immediately resume their arguing, proving that the marriage is merely a social and financial arrangement.\n\nChekhov exposes how wealth and pride degrade human relationships, reducing marriage to a superficial business transaction. (CBSE Board 2025)"
          }
        ]
      },
      // First Flight (Poems)
      {
        id: "dust-snow",
        title: "Dust of Snow (Poem)",
        notes: "### Robert Frost\nSmall natural incidents can trigger big positive mindset shifts.",
        worksheet: [
          {
            id: "e-w12",
            question: "What shook down the dust of snow from the Hemlock tree?",
            options: ["A crow", "A squirrel", "A heavy storm", "The poet himself"],
            correctAnswerIndex: 0,
            explanation: "A crow shook down particles of snow onto Robert Frost's shoulders, reviving his downcast mood. (CBSE Board 2019)"
          },
          {
            id: "e-w12-q1",
            question: "What happened to the poet when a dust of snow fell on him? What message does this convey?",
            explanation: "When the crow shook down dust of snow from the hemlock tree onto the poet, it instantly changed his mood from downcast to cheerful. It conveys the message that nature has supreme healing power and even simple events can uplift the human spirit. (CBSE Board 2025)"
          },
          {
            id: "e-w12-q2",
            question: "How does Robert Frost use unconventional symbols like the 'hemlock tree' and the 'crow' to represent positive change?",
            explanation: "Crows and hemlock trees are conventionally associated with gloom, darkness, and poison. However, Frost reverses these symbols. By having a crow shake pure, white snow from a hemlock tree to save his day, he shows that beauty and emotional transformation can emerge from unexpected, traditionally negative elements. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "fire-ice",
        title: "Fire and Ice (Poem)",
        notes: "### Robert Frost\nDestruction of the world through desire (fire) and hatred (ice).",
        worksheet: [
          {
            id: "e-w13",
            question: "In Frost's view, 'Ice' is a metaphor for what human emotion?",
            options: ["Greed", "Hatred", "Compassion", "Apathy"],
            correctAnswerIndex: 1,
            explanation: "Frost compares fire to passion/desire, and ice to cold indifference/hatred. (CBSE Board 2020)"
          },
          {
            id: "e-w13-q1",
            question: "How does Frost use fire and ice as symbols to explore the destructive forces of human emotions?",
            explanation: "Frost uses fire to symbolize desire, passion, greed, and lust, which burn uncontrollably. He uses ice to symbolize hatred, coldness, rigidity, and indifference, which freeze human empathy. Both unchecked emotions are shown to be equally capable of destroying the world. (CBSE Board 2025)"
          },
          {
            id: "e-w13-q2",
            question: "According to Robert Frost, how will the world end twice? Contrast the two forces he describes.",
            explanation: "The poet believes the world could end first by fire, representing intense, consuming desire. However, if it had to perish twice, ice (representing cold hatred) is equally powerful and sufficient to bring about complete destruction. Fire is violent and passionate, while ice is silent and cold. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "tiger-zoo",
        title: "A Tiger in the Zoo (Poem)",
        notes: "### Leslie Norris\nContrast between wild natural freedom and concrete cage captivity.",
        worksheet: [
          {
            id: "e-w14",
            question: "How does the tiger behave towards the zoo visitors?",
            options: ["He ignores them complete", "He roars aggressively at them", "He tries to play with them", "He eats food from their hands"],
            correctAnswerIndex: 0,
            explanation: "The tiger stalks quietly in his cage, ignoring the artificial crowds of visitors. (CBSE Board 2022)"
          },
          {
            id: "e-w14-q1",
            question: "Why does the tiger in the zoo ignore the visitors? What does this show?",
            explanation: "The tiger ignores visitors because he feels helpless, frustrated, and angry inside his concrete cage. The presence of tourists does not interest him; instead, his thoughts are focused on his lost freedom and memories of his majestic life in the forest. (CBSE Board 2025)"
          },
          {
            id: "e-w14-q2",
            question: "Contrast the life of the tiger in his natural habitat with his confinement in the zoo.",
            explanation: "In the forest, the tiger is a powerful predator who roams freely, hides in shadows, and hunts deer near water sources. In the zoo, he is locked in a small concrete cell, his strength confined behind bars. Captivity strips him of his dignity and natural instincts, leaving him to pace aimlessly in silent rage. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "how-tell-wild-animals",
        title: "How to Tell Wild Animals (Poem)",
        notes: "### Carolyn Wells\nHumorous description of distinct identifier traits of wild predators.",
        worksheet: [
          {
            id: "e-w15",
            question: "According to the poet, what feature identifies an Asian Lion?",
            options: ["A large tawny beast with a terrifying roar", "Yellow stripe markings", "Webbed feet", "Spotty skin"],
            correctAnswerIndex: 0,
            explanation: "If a large, tawny beast roars at you in the East, it is the classic Asian Lion. (CBSE SQP 2020)"
          },
          {
            id: "e-w15-q1",
            question: "How does the poet humorously distinguish the Asian Lion from the Bengal Tiger?",
            explanation: "The poet distinguishes them by appearance and behavior: the Asian Lion is a large, tawny beast that roars at you so terrifyingly that you feel like you are dying. In contrast, the Bengal Tiger is a noble wild beast with black stripes on a yellow coat who quietly 'welcomes' you by eating you. (CBSE Board 2025)"
          },
          {
            id: "e-w15-q2",
            question: "Analyze the tone and purpose of Carolyn Wells' poem 'How to Tell Wild Animals'. How does she make dangerous beasts seem amusing?",
            explanation: "The tone is highly satirical, playful, and humorous. Wells' purpose is to describe wild predators using extreme, comical situations where the reader is being attacked or eaten. By suggesting that a bear's tight hug is friendly or that a leopard's repeated pouncing is a polite introduction, she juxtaposes deadly danger with lighthearted humor. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "ball-poem",
        title: "The Ball Poem (Poem)",
        notes: "### John Berryman\nLearning the epistemology of loss. Growth through fading toys.",
        worksheet: [
          {
            id: "e-w16",
            question: "Why does the poet choose NOT to offer another ball to the boy?",
            options: [
              "Because it is cheap, and the boy must learn the sense of responsibility",
              "Because he has no money",
              "Because the boy refused it",
              "None of these"
            ],
            correctAnswerIndex: 0,
            explanation: "Loss is a part of life. The poet wants the boy to discover how to handle loss responsibly. (CBSE Board 2023)"
          },
          {
            id: "e-w16-q1",
            question: "Why does the poet say 'And no one buys a ball back'? What lesson is the boy learning?",
            explanation: "The poet says this to highlight that some losses in life are irreversible, and money cannot replace lost emotional attachments. The boy is learning his first lesson in the 'epistemology of loss'—how to accept responsibility, cope with grief, and stand up after losing a precious possession. (CBSE Board 2025)"
          },
          {
            id: "e-w16-q2",
            question: "Why does the poet choose not to console the boy or offer him money to buy another ball?",
            explanation: "The poet intentionally does not console the boy or offer money because doing so would interfere with a vital life lesson. The boy needs to experience the pain of loss to understand responsibility and emotional maturity. This approach is highly effective because it allows the boy to grow internally by realizing that material things are transient. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "amanda",
        title: "Amanda! (Poem)",
        notes: "### Robin Klein\nAn analytical look at parental nagging making young girls retreat into fantasy.",
        worksheet: [
          {
            id: "e-w17",
            question: "What does Amanda imagine herself to be to escape parent scoldings?",
            options: ["A mermaid, an orphan, and Rapunzel", "An astronaut", "A high school teacher", "A military officer"],
            correctAnswerIndex: 0,
            explanation: "Amanda escapes into dreams of being a silent mermaid in green seas, an orphan on streets, and Rapunzel. (CBSE Board 2022)"
          },
          {
            id: "e-w17-q1",
            question: "Why is the second verse of the poem 'Amanda!' written in brackets?",
            explanation: "The verses in brackets represent Amanda's inner thoughts and private daydreams. They offer a direct, silent contrast to the external world where she is constantly nagged and instructed by her mother, highlighting her psychological escape into a fantasy world of absolute freedom. (CBSE Board 2025)"
          },
          {
            id: "e-w17-q2",
            question: "How does the poet highlight the conflict between parental control and a child's yearning for freedom in 'Amanda!'?",
            explanation: "The conflict is built through alternating stanzas: the mother issues strict, repetitive commands about posture, homework, and cleanliness. In response, Amanda mentally retreats into bracketed fantasies—imagining herself as a peaceful mermaid drifting in the sea, a free orphan roaming the streets, or Rapunzel in a quiet tower—revealing how over-parenting drives her to seek extreme isolation. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "trees",
        title: "The Trees (Poem)",
        notes: "### Adrienne Rich\nFemininst metaphor of trees breaking out of houses into natural wild forests.",
        worksheet: [
          {
            id: "e-w18",
            question: "What are the tree roots trying to achieve throughout the night?",
            options: [
              "To free themselves from the cracks in the veranda floor",
              "To drink water inside cylinders",
              "To grow flowers",
              "To break windows"
            ],
            correctAnswerIndex: 0,
            explanation: "The roots work all night to free themselves from the captivity of the decorative house floor. (CBSE Board 2021)"
          },
          {
            id: "e-w18-q1",
            question: "Explain the comparison between the boughs of the trees and 'newly discharged patients' in the poem 'The Trees'.",
            explanation: "The boughs shuffling under the roof are compared to newly discharged patients who are half-dazed and moving hesitantly toward the clinic doors. This comparison highlights the trees' long, exhausting confinement indoors and their slow, disoriented transition as they struggle to adjust to their newfound freedom in the forest. (CBSE Board 2025)"
          },
          {
            id: "e-w18-q2",
            question: "How does Adrienne Rich bring out the conflict between man and nature in 'The Trees'?",
            explanation: "Rich depicts man's artificial confinement of nature by keeping decorative trees inside houses. However, nature rebels against this control: all night, the leaves strain toward glass, roots work to disengage from floor cracks, and boughs force their way out. The glass breaks, and the trees stumble forward into the night to reclaim their natural home, symbolizing the inevitable triumph of nature over human imprisonment. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "fog",
        title: "Fog (Poem)",
        notes: "### Carl Sandburg\nComparing natural silent fog to a cat's soft feet on absolute quiet.",
        worksheet: [
          {
            id: "e-w19",
            question: "Which animal metaphor does Sandburg use to describe slow, silent fog?",
            options: ["A cat", "A dog", "A horse", "A falcon"],
            correctAnswerIndex: 0,
            explanation: "Sandburg writes 'The fog comes on little cat feet', highlighting silent entry. (CBSE Board 2018)"
          },
          {
            id: "e-w19-q1",
            question: "How does Carl Sandburg compare the movement of fog to a cat? What does this metaphor convey?",
            explanation: "Sandburg compares fog to a cat by saying it comes on 'little cat feet' and sits 'looking over harbor and city on silent haunches'. This metaphor beautifully conveys the extremely silent, gentle, and stealthy way fog enters, lingers, and leaves without warning or noise. (CBSE Board 2025)"
          },
          {
            id: "e-w19-q2",
            question: "Compare the depiction of nature in Robert Frost's 'Dust of Snow' and Carl Sandburg's 'Fog'. How do both find beauty in ordinary elements?",
            explanation: "Both poets highlight the profound, quiet impact of everyday natural phenomena. Frost focuses on a small, sudden event—snow falling from a tree—to show nature's immediate healing power on the human mind. Sandburg describes fog through a quiet, living cat metaphor, capturing nature's mysterious, independent, and silent presence. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "tale-custard-dragon",
        title: "The Tale of Custard the Dragon (Poem)",
        notes: "### Ogden Nash\nHumourous ballad showing humble Custard fighting a pirate while others run.",
        worksheet: [
          {
            id: "e-w20",
            question: "Who saved Belinda's household from the fierce armed pirate?",
            options: ["Custard the Dragon", "Ink the kitten", "Blink the mouse", "Mustard the dog"],
            correctAnswerIndex: 0,
            explanation: "While others fled, Custard swallowed the pirate, demonstrating true courage when verified. (CBSE Board 2520)"
          },
          {
            id: "e-w20-q1",
            question: "Describe the contrast between Custard's everyday behavior and his actions during the pirate's attack.",
            explanation: "In everyday life, Custard appears cowardly, crying for a nice safe cage while Belinda and her other pets mock him. However, when the armed pirate attacks, Custard shows immediate, real courage: he snorts like an engine, clashes his tail, and bravely swallows the pirate whole while the boastful pets flee in terror. (CBSE Board 2025)"
          },
          {
            id: "e-w20-q2",
            question: "How does Ogden Nash use humor, irony, and role reversal to convey a message about true bravery?",
            explanation: "Nash uses playful rhyming and comic descriptions of Belinda's boastful pets (Ink, Blink, Mustard) who claim to be as brave as lions. The supreme irony occurs when they all flee screaming from the pirate, while the 'cowardly' dragon Custard steps up and kills him, showing that true bravery is quiet and shown in action. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "for-anne-gregory",
        title: "For Anne Gregory (Poem)",
        notes: "### W.B. Yeats\nTrue love looks past outward yellow hair into the inner spiritual soul.",
        worksheet: [
          {
            id: "e-w21",
            question: "According to W.B. Yeats, who can love Anne Gregory purely for herself?",
            options: ["Only God", "All young suitors", "Her grandmother", "The village priest"],
            correctAnswerIndex: 0,
            explanation: "Yeats asserts that only God is capable of loving our inner spiritual self rather than external beauty. (CBSE Board 2022)"
          },
          {
            id: "e-w21-q1",
            question: "What is the significance of Anne Gregory's 'yellow hair' in the poem?",
            explanation: "Anne's yellow hair represents conventional, superficial standards of physical beauty. Suitors fall in love with her because of this striking physical trait, but the poet points out that this makes their love shallow and conditional, as they fail to see her true inner qualities. (CBSE Board 2025)"
          },
          {
            id: "e-w21-q2",
            question: "How does W.B. Yeats contrast human love with divine love in the poem?",
            explanation: "Yeats contrasts human love, which is shallow and conditional on external appearance (yellow hair), with divine love, which is absolute and unconditional. Suitors love Anne for her hair, whereas only God is capable of loving a person 'for yourself alone', looking past physical decay to value the spiritual soul. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "triumph-surgery",
        title: "A Triumph of Surgery (Suppl.)",
        notes: "### James Herriot\nTricki's pampering and vet Dr. Herriot's recovery plan.",
        worksheet: [
          {
            id: "e-w22",
            question: "What physical treatment cured Tricki's bloating at the hospital?",
            options: [
              "Two days water-diet with plenty of play activities",
              "A highly complex veterinary surgery",
              "Vitamin food tablets",
              "Absolute isolation cage"
            ],
            correctAnswerIndex: 0,
            explanation: "Tricki got zero medicine; just a natural diet of water and competitive play with other dogs. (CBSE Board 2019)"
          },
          {
            id: "e-w22-q1",
            question: "Why did Dr. Herriot find Mrs. Pumphrey's parenting style harmful for Tricki?",
            explanation: "Dr. Herriot found it harmful because her over-indulgence and constant pampering with rich food, chocolates, and malt (without physical exercise) led to Tricki becoming bloated, listless, and seriously ill. (CBSE Board 2025)"
          },
          {
            id: "e-w22-q2",
            question: "Mrs. Pumphrey's love for Tricki was excessive and ultimately harmful. Discuss how over-pampering can prove hazardous, referencing the story.",
            explanation: "The story shows that blind, excessive affection can harm those we care about. Mrs. Pumphrey ignored Dr. Herriot's warnings, treating Tricki's laziness with more food instead of exercise. It was only after a strict regime of a water diet and natural play at the surgery that Tricki recovered, proving that discipline is more vital than pampering. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "thief-story",
        title: "The Thief's Story (Suppl.)",
        notes: "### Ruskin Bond\nConscience and the power of educational empowerment over small thefts.",
        worksheet: [
          {
            id: "e-w23",
            question: "Why did Hari return to Anil's home after taking the currency?",
            options: [
              "Because he valued education more than temporary stolen wealth",
              "Because the train was delayed",
              "Because police spotted him",
              "Because he lost the key"
            ],
            correctAnswerIndex: 0,
            explanation: "Hari Singh realized that Anil's writing lessons could secure him a respectable, unlimited future. (CBSE Board 2020)"
          },
          {
            id: "e-w23-q1",
            question: "How did Anil earn a living? How did his career contrast with Hari Singh's expectations?",
            explanation: "Anil earned a living by writing in fits and starts for magazines, receiving irregular payments. This contrasted with Hari's expectation of working for a wealthy man with steady income, but Anil offered him something far more valuable: education. (CBSE Board 2025)"
          },
          {
            id: "e-w23-q2",
            question: "How does educational empowerment lead to a change of heart in Hari Singh?",
            explanation: "Hari Singh initially joined Anil to exploit and rob him. However, when Anil began teaching him to write sentences and do basic math, Hari realized education could secure him a respectable, unlimited future far greater than small thefts. This realization and Anil's complete trust made him return the stolen money, proving trust and education can reform criminals. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "midnight-visitor",
        title: "The Midnight Visitor (Suppl.)",
        notes: "### Robert Arthur\nQuick analytical wit beats loaded weapons. Ausable vs Max.",
        worksheet: [
          {
            id: "e-w24",
            question: "How did Ausable outsmart Max who held a pistol?",
            options: [
              "By inventing a fake balcony story outside the window",
              "By fighting him physically",
              "By using a secret smoke screen",
              "By calling backup police"
            ],
            correctAnswerIndex: 0,
            explanation: "Ausable made up a story about a balcony. Max jumped out of the window to escape and fell to his death. (CBSE Board 2021)"
          },
          {
            id: "e-w24-q1",
            question: "How does Ausable's appearance and demeanor contrast with the stereotype of a secret agent?",
            explanation: "Ausable was extremely fat, spoke with a sloppy American accent, and lived in a small, gloomy French hotel room. He completely lacked the conventional glamour, fit physique, and mysterious aura associated with romantic secret agents. (CBSE Board 2025)"
          },
          {
            id: "e-w24-q2",
            question: "Ausable did not fit any description of a secret agent, yet he proved to be a master of espionage. Support this with evidence from the story.",
            explanation: "Despite his fat appearance and humble hotel room, Ausable possessed exceptional mental alertness and presence of mind. When Max threatened him with a pistol, Ausable did not panic. Instead, he calmly spun a convincing, detailed story about a non-existent balcony and a police arrival, driving Max to jump to his death, proving that wit is more powerful than weapons. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "question-trust",
        title: "A Question of Trust (Suppl.)",
        notes: "### Victor Canning\nHonour among thieves. Horace Danby gets tricked by a pretty lady.",
        worksheet: [
          {
            id: "e-w25",
            question: "Who got Horace Danby arrested for the Shotover Grange robbery?",
            options: [
              "A young lady thief dressed in red who pretended to be the owner",
              "His own assistant",
              "The housekeeper",
              "A local jewelry merchant"
            ],
            correctAnswerIndex: 0,
            explanation: "Horace trusted a lady in red who claimed to own the house. She tricked him into leaving his fingerprints everywhere. (CBSE Board 2018)"
          },
          {
            id: "e-w25-q1",
            question: "Why did Horace Danby break into houses only once a year? How was he caught?",
            explanation: "Horace robbed only once a year to fund his expensive, secret passion for collecting rare and costly books. He was caught because he allowed a charming female thief dressed in red to trick him into opening the safe without gloves, leaving his fingerprints everywhere. (CBSE Board 2025)"
          },
          {
            id: "e-w25-q2",
            question: "Analyze how Horace Danby's careful planning was undone by a clever adversary who exploited his gentle nature.",
            explanation: "Horace planned his robberies meticulously, studying Shotover Grange for weeks. However, his quiet, non-violent nature made him panic when he met the lady in red. She confidently posed as the owner, and Horace, eager to avoid trouble, blindly obeyed her instructions to open the safe for her. He forgot to wear gloves, showing how easily trust can be exploited by a clever rival. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "footprints-suppl",
        title: "Footprints Without Feet (Suppl.)",
        notes: "### H.G. Wells\nBrilliant scientist Griffin abuses discovery of invisibility for selfish thefts.",
        worksheet: [
          {
            id: "e-w26",
            question: "What physical drug allowed Griffin to become transparent like glass?",
            options: ["A rare combination of chemical drugs", "A radioactive mineral", "A biological serum", "None of these"],
            correctAnswerIndex: 0,
            explanation: "Griffin swallowed rare chemical formulations which made his body as transparent as sheet glass. (CBSE Board 2019)"
          },
          {
            id: "e-w26-q1",
            question: "Why did Griffin's landlord ask him to leave, and how did Griffin retaliate?",
            explanation: "The landlord disliked Griffin's eccentric, irritable behavior and tried to eject him from the house. In revenge, Griffin set the landlord's house on fire, swallowed rare drugs to become invisible, and escaped naked into the cold streets. (CBSE Board 2025)"
          },
          {
            id: "e-w26-q2",
            question: "Griffin was a brilliant scientist, but a lawless person. Justify this statement with incidents from the story.",
            explanation: "Griffin achieved a historic scientific breakthrough by discovering how to make the human body invisible. Instead of using this for the benefit of humanity, he used it for selfish, criminal purposes: burning down his landlord's house, robbing a London store, assaulting shopkeepers, and stealing money from a clergyman, proving that knowledge without morals is dangerous. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "making-scientist",
        title: "The Making of a Scientist (Suppl.)",
        notes: "### Robert W. Peterson\nHow Richard Ebright's collection of Viceroy butterflies triggered scientific fame.",
        worksheet: [
          {
            id: "e-w27",
            question: "Which book gifted by his mother inspired Richard Ebright toward Biology?",
            options: [
              "The Travels of Monarch X",
              "The Origin of Species",
              "Our Butterfly Friends",
              "The Golden Insect Era"
            ],
            correctAnswerIndex: 0,
            explanation: "The book opened the world of science to Richard, introducing migration of Monarch butterflies. (CBSE Board 2521)"
          },
          {
            id: "e-w27-q1",
            question: "What role did Richard Ebright's mother play in his journey of becoming a scientist?",
            explanation: "Ebright's mother was his constant companion and guide. She encouraged his curiosity, bought him scientific equipment, took him on trips, and gifted him the book 'The Travels of Monarch X' which sparked his lifelong passion for biology. (CBSE Board 2025)"
          },
          {
            id: "e-w27-q2",
            question: "What ingredients go into the making of a true scientist? Illustrate with reference to Richard Ebright's research.",
            explanation: "The making of a scientist requires a first-rate mind, intense scientific curiosity, and the determination to win for the right reasons. Richard Ebright possessed these traits. Beginning with simple butterfly tagging, he constantly asked deeper questions, eventually identifying insect hormones and discovering how cells read DNA, showing that constant curiosity drives scientific breakthroughs. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "necklace",
        title: "The Necklace (Suppl.)",
        notes: "### Guy de Maupassant\nPride and vanity leads Matilda to replacement of a cheap artificial necklace.",
        worksheet: [
          {
            id: "e-w28",
            question: "How long did it take the Loisels to pay off the huge debt for replacement?",
            options: ["10 years", "5 years", "2 years", "20 years"],
            correctAnswerIndex: 0,
            explanation: "They worked in poverty for exactly 10 years to pay off 36,000 francs. (CBSE Board 2020)"
          },
          {
            id: "e-w28-q1",
            question: "Why was Matilda Loisel unhappy with her life? What did she yearn for?",
            explanation: "Matilda was born into a family of clerks and married a minor official. She was deeply unhappy because she believed she was born for luxury, dreaming of elegant dinners, exquisite clothes, and high society status that she could not afford. (CBSE Board 2025)"
          },
          {
            id: "e-w28-q2",
            question: "How did Matilda Loisel's vanity and obsession with high society lead to her ruin? Discuss the lesson she learns too late.",
            explanation: "Matilda's refusal to attend a ball without expensive jewels drove her to borrow a diamond necklace from a friend. She lost it, and instead of confessing, she and her husband bought a replacement for 36,000 francs. This forced them into ten years of grueling debt and hard labor, ruining her youth and beauty. She realized too late that the original necklace was fake, proving that pride and pretense lead to tragedy. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "hack-driver",
        title: "The Hack Driver (Suppl.)",
        notes: "### Sinclair Lewis\nOliver Lutkins masquerades as safe companion 'Bill Magnuson' to trick a lawyer.",
        worksheet: [
          {
            id: "e-w29",
            question: "Who was 'Bill' the friendly hack driver in reality?",
            options: ["Oliver Lutkins himself", "The local magistrate", "Lutkins' brother", "The town sheriff"],
            correctAnswerIndex: 0,
            explanation: "The friendly hack driver who drove the lawyer around searching for Lutkins was actually Lutkins himself! (CBSE Board 2022)"
          },
          {
            id: "e-w29-q1",
            question: "Why was the narrator sent to New Mullion? What was his first impression of the town?",
            explanation: "The narrator, a young lawyer, was sent to serve a summons on a witness named Oliver Lutkins. His first impression was disappointing as the streets were muddy and dirty, but he was immediately cheered by the warm, friendly demeanor of a hack driver at the station. (CBSE Board 2025)"
          },
          {
            id: "e-w29-q2",
            question: "Appearance can be highly deceptive. How does Oliver Lutkins outsmart the young lawyer in 'The Hack Driver'?",
            explanation: "Lutkins immediately recognized that the lawyer was inexperienced. Posing as 'Bill' the hack driver, he volunteered to help find Lutkins, charging him hourly for the search. He took the lawyer to various shops, always entering first to warn his accomplices. He made the lawyer pay for his lunch and even introduced him to his mother, completely outwitting the gullible lawyer while keeping him in the dark. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "bholi",
        title: "Bholi (Suppl.)",
        notes: "### K.A. Abbas\nBholi gains educational pride and rejects greedy dowry groom Bishamber.",
        worksheet: [
          {
            id: "e-w30",
            question: "Why did Bholi refuse to marry Bishamber on wedding day?",
            options: [
              "Because he was a mean, greedy, cowardly old man demanding Rs 5,000 dowry",
              "Because she loved someone else",
              "Because she wanted to move to London",
              "Because her school teacher told her so"
            ],
            correctAnswerIndex: 0,
            explanation: "Bholi gained courage through schooling, refusing a greedy husband who insulted her father. (CBSE Board 2023)"
          },
          {
            id: "e-w30-q1",
            question: "Why did Bholi's parents accept Bishamber's marriage proposal despite his age?",
            explanation: "They accepted because Bishamber was a well-to-do grocer with a big shop, his own house, and a healthy bank balance. He was also older, had a limp, and had grown-up children, but they feared Bholi's pockmarks and lack of sense would otherwise keep her unmarried forever. (CBSE Board 2025)"
          },
          {
            id: "e-w30-q2",
            question: "Bholi's journey from a neglected, silent child to a confident, independent young woman is a triumph of education. Discuss.",
            explanation: "As a child, Sulekha was neglected, mocked as simpleton, and suffered from stammering. Schooling and a compassionate teacher changed everything, giving her knowledge, confidence, and self-respect. When Bishamber greedily demanded Rs 5,000 dowry, Bholi bravely rejected him. She stood up to protect her parents' honor, proving that education empowers individuals to stand against social evils. (CBSE Board 2025)"
          }
        ]
      },
      {
        id: "book-saved-earth",
        title: "The Book That Saved the Earth (Suppl.)",
        notes: "### Claire Boiko\n25th Century Martian attack repelled by simple Mother Goose rhymes.",
        worksheet: [
          {
            id: "e-w31",
            question: "Which nursery book saves Earth from Think Tank's Martian army?",
            options: [
              "A book of 'Mother Goose' rhymes",
              "A textbook of Physical Chemistry",
              "William Shakespeare's Romeo and Juliet",
              "A modern handbook of Astronomy"
            ],
            correctAnswerIndex: 0,
            explanation: "The Martian ruler Think Tank misinterprets simple rhymes as code words showing humans are high tech, fleeing in terror. (CBSE Board 2022)"
          },
          {
            id: "e-w31-q1",
            question: "How does Think-Tank interpret the rhymes in 'Mother Goose' as direct threats to Mars?",
            explanation: "Think-Tank, being extremely literal and arrogant, misinterprets 'Humpty Dumpty' as a depiction of himself. He thinks humans have discovered his design and are plotting to overthrow him, causing him to panic and cancel the invasion. (CBSE Board 2025)"
          },
          {
            id: "e-w31-q2",
            question: "Arrogance and lack of real knowledge can lead to a comical downfall. Analyze the character of Think-Tank.",
            explanation: "Think-Tank is portrayed as an incredibly arrogant and self-important ruler who demands worship from his crew. Despite his boasts of superior intellect, he is completely ignorant of Earth's culture. He mistakes books for sandwiches, and interprets simple nursery rhymes as military strategies. His lack of critical thinking leads to a hilarious panic, proving that shallow vanity is no match for simple common sense. (CBSE Board 2025)"
          }
        ]
      }
    ]
  },
  {
    id: "social-science",
    name: "Social Science",
    color: "amber",
    chapters: [
      // History
      {
        id: "nat-europe",
        title: "The Rise of Nationalism in Europe (History)",
        notes: "### 1. French Revolution Legacy\nIntroduced 'la patrie' (homeland) and equal civil rights under custom flag.\n\n### 2. German/Italian unifications\nDesigned by Bismarck and Mazzini/Garibaldi respectively.",
        worksheet: [
          {
            id: "h-w1",
            question: "Who was proclaimed Chief Emperor of united Germany in January 1871 at Versailles?",
            options: ["Kaiser William I", "Otto von Bismarck", "Napoleon III", "Victor Emmanuel II"],
            correctAnswerIndex: 0,
            explanation: "Prussian King William I was crowned Emperor in the Hall of Mirrors at Versailles. (CBSE Board 2020)"
          },
          {
            id: "h-w1-satq",
            question: "What was the main aim of the Treaty of Vienna in 1815?",
            explanation: "The main aim of the Treaty of Vienna (1815) was to undo most of the changes that had come about in Europe during the Napoleonic wars and to restore the conservative monarchies that had been overthrown by Napoleon. (CBSE Board 2022)"
          }
        ]
      },
      {
        id: "nat-india",
        title: "Nationalism in India (History)",
        notes: "### 1. Champaran/Kheda Satyagraha\nGandhi's early experiments with active truth campaigns.\n\n### 2. Dandi March 1930\nGandhiji walked 240 miles to break salt salt legislation.",
        worksheet: [
          {
            id: "h-w2",
            question: "At which place did the Civil Disobedience campaign launch officially in 1930?",
            options: ["Dandi", "Champaran", "Chauri Chaura", "Sabarmati"],
            correctAnswerIndex: 0,
            explanation: "Upon walking from Sabarmati, Gandhiji manufactured salt at Dandi海岸, officially initiating civil disobedience. (CBSE Board 2021)"
          },
          {
            id: "h-w2-satq",
            question: "Why did Mahatma Gandhi decide to withdraw the Non-Cooperation Movement in February 1922?",
            explanation: "Gandhiji withdrew the Non-Cooperation Movement because of the violent incident at Chauri Chaura (Gorakhpur, UP) where a peaceful crowd turned violent and set fire to a police station, burning 22 policemen alive. Adhering strictly to satyagraha and non-violence, he called off the movement. (CBSE Board 2019)"
          }
        ]
      },
      {
        id: "global-world",
        title: "The Making of a Global World (History)",
        notes: "### 1. Silk Route networks\nConnecting trade, culture, and foods (potatoes).\n\n### 2. Post-war economy\nBretton Woods institutions (IMF and World Bank).",
        worksheet: [
          {
            id: "h-w3",
            question: "Which disease decimated 90% of Africa's cattle population in the late 1880s?",
            options: ["Rinderpest", "Smallpox", "Cholera", "Foot-and-Mouth disease"],
            correctAnswerIndex: 0,
            explanation: "Rinderpest (cattle plague) arrived with imported Italian cattle and devastated African livelihood. (CBSE Board 2022)"
          },
          {
            id: "h-w3-satq",
            question: "What was the indentured labor system?",
            explanation: "Indentured labor was a system of bonded labor under contract, where workers from India and China were recruited to work on plantations, mines, and railway projects in colonies for a specific period (usually 5 years) before they could return home. It was often described as a 'new system of slavery'. (CBSE Board 2020)"
          }
        ]
      },
      {
        id: "industrialisation",
        title: "The Age of Industrialisation (History)",
        notes: "### 1. Proto-industrial age\nProduction controlled by merchant guilds before factories.\n\n### 2. Steam power\nJames Watt improves Newcomen design. Gomasthas inspect weavers.",
        worksheet: [
          {
            id: "h-w4",
            question: "Who was a 'Gomastha' in Indian colonial textile history?",
            options: [
              "A paid supervisor appointed by East India Company to inspect weavers",
              "A traditional village headman",
              "An independent local cotton merchant",
              "A worker inside steam spinning mills"
            ],
            correctAnswerIndex: 0,
            explanation: "Gomasthas were paid agents who surveyed quality, collected supplies, and broke direct weaver trade. (CBSE Board 2019)"
          },
          {
            id: "h-w4-satq",
            question: "Why did early industrial merchants in Britain prefer hand labor over steam-powered machines?",
            explanation: "Early Victorian industrialists preferred hand labor because: (1) There was an abundance of cheap human labor, making wages low. (2) Heavy machinery required large capital investment and was costly to repair. (3) Many seasonal industries required labor only during specific months. (4) Exquisite hand-designed products with intricate patterns were in high demand over uniform machine-made goods. (CBSE Board 2021)"
          }
        ]
      },
      {
        id: "print-culture",
        title: "Print Culture and the Modern World (History)",
        notes: "### 1. Chinese roots\nWoodblock prints. Gutenberg's mechanical printing press 1448.\n\n### 2. Vernacular Act\nRestricted Indian free press expression in 1878.",
        worksheet: [
          {
            id: "h-w5",
            question: "Who printed the first mechanical bible using movable metal types in 1448?",
            options: ["Johann Gutenberg", "Marco Polo", "Erasmus", "Martin Luther"],
            correctAnswerIndex: 0,
            explanation: "Gutenberg developed the first metal-cast printing press in Mainz, Germany, printing the Bible. (CBSE Board 2020)"
          },
          {
            id: "h-w5-satq",
            question: "What was the significance of the Vernacular Press Act of 1878?",
            explanation: "The Vernacular Press Act was passed by the British colonial government in 1878 to censor and suppress nationalistic reports in vernacular newspapers. It was modeled on the Irish Press Laws, giving the government extensive rights to censor, warn, and confiscate printing presses of non-English language publishers. (CBSE Board 2018)"
          }
        ]
      },
      // Geography
      {
        id: "resources-dev",
        title: "Resources and Development (Geo)",
        notes: "### 1. Classification\nBiotic/abiotic, renewable/nonrenewable. Agenda 21 sustainable rules.\n\n### 2. Black Soils\nAlso known as Regur soils, highly suited for cotton cash farming.",
        worksheet: [
          {
            id: "g-w1",
            question: "Which soil type is famous as 'Regur' and ideal for growing cotton crops?",
            options: ["Black Soil", "Alluvial Soil", "Red and Yellow Soil", "Laterite Soil"],
            correctAnswerIndex: 0,
            explanation: "Black soil is known as Regur. It has high clay and water holding capacity, perfect for cotton. (CBSE Board 2021)"
          },
          {
            id: "g-w1-satq",
            question: "What is sustainable development? Mention the significance of Agenda 21.",
            explanation: "Sustainable development means development should take place without damaging the environment, and development in the present should not compromise the needs of future generations. Agenda 21 was signed in 1992 at the Earth Summit (Rio de Janeiro) to achieve global sustainable development and combat environmental damage, poverty, and disease through global cooperation. (CBSE Board 2020)"
          }
        ]
      },
      {
        id: "forest-wildlife",
        title: "Forest and Wildlife Resources (Geo)",
        notes: "### 1. Biodiversities\nIUCN categories: Normal, Endangered, Vulnerable, Rare species.\n\n### 2. Joint Forest Management\nCollaborative community protection of forests since 1988 (Odisha).",
        worksheet: [
          {
            id: "g-w2",
            question: "Which community-level movement in Himalayas successfully resisted deforestation by hugging trees?",
            options: ["Chipko Movement", "Beej Bachao Andolan", "Narmada Bachao", "Tehri Demonstration"],
            correctAnswerIndex: 0,
            explanation: "Chipko movement in Uttarakhand hills resisted commercial logging through tree-hugging actions. (CBSE Board 2020)"
          },
          {
            id: "g-w2-satq",
            question: "What is Joint Forest Management (JFM)?",
            explanation: "Joint Forest Management (JFM) is a program in India that involves local communities in the management and restoration of degraded forests. It was formally launched in 1988 by the state of Odisha, and it emphasizes that community protection is rewarded with non-timber forest benefits and a share in harvested timber. (CBSE Board 2021)"
          }
        ]
      },
      {
        id: "water-resources",
        title: "Water Resources (Geo)",
        notes: "### 1. Integrated Management\nDams as modern temples (Nehru).\n\n### 2. Rainwater Harvesting\nGuls/Kuls and rooftop channels.",
        worksheet: [
          {
            id: "g-w3",
            question: "On which river is the massive Sardar Sarovar Dam built?",
            options: ["Narmada River", "Krishna River", "Mahanadi River", "Sutlej River"],
            correctAnswerIndex: 0,
            explanation: "Sardar Sarovar Dam is a major concrete utility built across Narmada river in Gujarat. (CBSE Board 2022)"
          },
          {
            id: "g-w3-satq",
            question: "Why did Jawaharlal Nehru refer to dams as the 'temples of modern India'?",
            explanation: "Jawaharlal Nehru proudly proclaimed dams as the 'temples of modern India' because they would integrate the development of agriculture and the village economy with rapid industrialization and the growth of the urban economy, leading India to overall progress. (CBSE Board 2019)"
          }
        ]
      },
      {
        id: "agriculture",
        title: "Agriculture (Geo)",
        notes: "### 1. Farming Types\nPrimitive subsistence, Intensive, and Commercial farming.\n\n### 2. Major Crops\nRice (Kharif, high rain) and Wheat (Rabi, cool dry times).",
        worksheet: [
          {
            id: "g-w4",
            question: "Which of the following is a classic dry Rabi crop?",
            options: ["Wheat", "Paddy (Rice)", "Cotton", "Maize"],
            correctAnswerIndex: 0,
            explanation: "Wheat is sown in winter months (Rabi cycle) and requires moderate rain and cool weather. (CBSE Board 2023)"
          },
          {
            id: "g-w4-satq",
            question: "Distinguish between Kharif and Rabi cropping seasons.",
            explanation: "Kharif crops are sown with the onset of monsoon (June-July) and harvested in autumn (September-October); key crops include rice, maize, and cotton. Rabi crops are sown in winter (October-December) and harvested in summer (April-June); key crops include wheat, barley, and peas. (CBSE Board 2022)"
          }
        ]
      },
      {
        id: "minerals-energy",
        title: "Minerals and Energy Resources (Geo)",
        notes: "### 1. Classification\nMetallic (ferrous, nonferrous) and Nonmetallic minerals.\n\n### 2. Fuels\nCoal (Anthracite is premium grade), Petroleum, and Solar.",
        worksheet: [
          {
            id: "g-w5",
            question: "Which variety of coal is considered the highest quality hard coal?",
            options: ["Anthracite", "Bituminous", "Lignite", "Peat"],
            correctAnswerIndex: 0,
            explanation: "Anthracite contains over 80% carbon, burns with high heat and minimal smoke. (CBSE Board 2022)"
          },
          {
            id: "g-w5-satq",
            question: "Why is solar energy fast becoming popular in India?",
            explanation: "Solar energy is becoming highly popular in India because: (1) India is a tropical country with abundant sunlight year-round. (2) It is a clean, renewable source of energy that reduces reliance on fossil fuels. (3) Photovoltaic technology is rapidly declining in cost, making it highly accessible to rural households for lighting and cooking. (CBSE Board 2021)"
          }
        ]
      },
      {
        id: "manufacturing-industries",
        title: "Manufacturing Industries (Geo)",
        notes: "### 1. Contribution\nValue addition. Agro-based vs Mineral-based grids.\n\n### 2. Locations\nProximities to inputs, labor availability, and ports.",
        worksheet: [
          {
            id: "g-w6",
            question: "Where is the largest public sector iron and steel plant cluster centered in India?",
            options: ["Chhotanagpur Plateau", "Deccan Dry Plain", "Thar Desert frontier", "Malabar Coast"],
            correctAnswerIndex: 0,
            explanation: "Chhotanagpur has rich iron ore reserves and coal mines, making it the hub of steel plants. (CBSE Board 2019)"
          },
          {
            id: "g-w6-satq",
            question: "Why is the Chhotanagpur Plateau region the main hub for iron and steel industries in India?",
            explanation: "The Chhotanagpur Plateau has several relative advantages for the iron and steel industry: (1) High-grade iron ore is available in close proximity at low cost. (2) High-quality coking coal and limestone deposits are nearby. (3) Cheap labor is available from the surrounding states of Bihar, Odisha, and West Bengal. (4) Good transport network facilitates raw material movement. (CBSE Board 2020)"
          }
        ]
      },
      {
        id: "lifelines-economy",
        title: "Lifelines of National Economy (Geo)",
        notes: "### 1. Transport infrastructures\nRoadways (Golden Quadrilateral), Railways, Pipelines, and Waterways.\n\n### 2. Communications & Trade\nPorts support 95% of international bulk shipments.",
        worksheet: [
          {
            id: "g-w7",
            question: "Which super-highway project links Srinagar to Kanyakumari and Silchar to Porbandar?",
            options: [
              "North-South and East-West Corridor",
              "National Highway 1",
              "Golden Quadrilateral Super Highways",
              "Express Border Corridor"
            ],
            correctAnswerIndex: 0,
            explanation: "The North-South and East-West corridors are major multi-lane highway schemes designed to reduce travel duration. (CBSE Board 2020)"
          },
          {
            id: "g-w7-satq",
            question: "What are the advantages of pipeline transportation in India?",
            explanation: "The key advantages of pipeline transport are: (1) It is used to transport water, crude oil, petroleum products, and natural gas over long distances very safely. (2) Initial construction costs are high, but running and maintenance costs are extremely low. (3) It eliminates trans-shipment losses and transit delays. (4) Pipelines can be laid through difficult terrains, water bodies, and forests. (CBSE Board 2018)"
          }
        ]
      },
      // Civics
      {
        id: "power-sharing",
        title: "Power Sharing (Civics)",
        notes: "### 1. Cases\nBelgium's accommodation models vs Sri Lanka's majoritarian doom.\n\n### 2. Forms\nLegislature/Executive/Judiciary checks (Horizontal) vs Central/State tiers (Vertical).",
        worksheet: [
          {
            id: "c-w1",
            question: "Why did Sri Lankan Tamils initiate widespread civil protests in the late 1950s?",
            options: [
              "The 1956 act established Sinhala as the sole official language",
              "They were denied right to cast votes",
              "They wanted to migrate to India",
              "None of these"
            ],
            correctAnswerIndex: 0,
            explanation: "The majoritarian 1956 Sinhala-only act made Tamils feel isolated, triggering civil protests. (CBSE Board 2020)"
          },
          {
            id: "c-w1-satq",
            question: "What are the horizontal and vertical forms of power-sharing?",
            explanation: "Horizontal power sharing distributes power among different organs of the government (Legislature, Executive, and Judiciary), ensuring a system of checks and balances since they are placed at the same level. Vertical power sharing divides power among different levels of government (Central/Union, State/Provincial, and local levels like Panchayats), where the higher level delegates authority to lower levels. (CBSE Board 2019)"
          }
        ]
      },
      {
        id: "federalism",
        title: "Federalism (Civics)",
        notes: "### 1. Key Tiers\nConstitutional sharing. Coming-together vs Holding-together countries.\n\n### 2. Lists\nUnion (Defense), State (Police), and Concurrent (Education) lists.",
        worksheet: [
          {
            id: "c-w2",
            question: "Which lists of subjects handles overlapping legislation by both Center and State departments?",
            options: ["Concurrent List", "Union List", "State List", "Residual List"],
            correctAnswerIndex: 0,
            explanation: "Concurrent List subjects (like Education, Forest, Marriage) allow both tiers to legislate, with Center taking priority in disputes. (CBSE Board 2021)"
          },
          {
            id: "c-w2-satq",
            question: "What is decentralization? What was the significance of the 1992 Constitutional Amendment in India?",
            explanation: "Decentralization is the delegation of power and authority from Central and State governments to local self-governments (Panchayats and Municipalities). The 1992 Constitutional Amendment made local self-government constitutionally mandatory, introduced regular elections, reserved one-third of all seats for women, and established State Election Commissions. (CBSE Board 2022)"
          }
        ]
      },
      {
        id: "gender-religion",
        title: "Gender, Religion and Caste (Civics)",
        notes: "### 1. Social divisions\nFemininst actions for wage equality. Secularism protects diverse faiths.\n\n### 2. Caste in Politics\nCaste bias, but politics also alters caste systems.",
        worksheet: [
          {
            id: "c-w3",
            question: "A state that does NOT have any official religion and treats all religions equally is called...",
            options: ["Secular State", "Theocratic State", "Monarchical State", "Communal State"],
            correctAnswerIndex: 0,
            explanation: "The Indian constitution guarantees secularism, prohibiting any religion from becoming state-sponsored. (CBSE Board 2022)"
          },
          {
            id: "c-w3-satq",
            question: "How does caste express itself in Indian politics?",
            explanation: "Caste expresses itself in politics in several ways: (1) While choosing candidates, parties keep the caste composition of the electorate in mind. (2) Political parties make appeals to caste sentiments to muster electoral support. (3) No parliamentary constituency in India has a single caste majority, forcing candidates to win the trust of multiple caste communities. (4) Elections are also about mobilizing marginalized castes to gain political representation. (CBSE Board 2020)"
          }
        ]
      },
      {
        id: "political-parties",
        title: "Political Parties (Civics)",
        notes: "### 1. Functions\nFormulate policies, contest elections, and balance public opinion.\n\n### 2. Party Systems\nOne-party (China), Two-party (USA), and Multi-party (India) options.",
        worksheet: [
          {
            id: "c-w4",
            question: "How many recognized National political parties existed in India according to recent board records?",
            options: ["6 to 8 parties", "10 parties", "2 parties", "Above 50 parties"],
            correctAnswerIndex: 0,
            explanation: "Parties certified by the Election Commission based on clear vote percentages. (CBSE Board 2023)"
          },
          {
            id: "c-w4-satq",
            question: "State any three main functions of a political party.",
            explanation: "The primary functions of political parties are: (1) Contest Elections: Candidates are put forward to compete for public office. (2) Formulate Policies: They present different policies and programs to voters, who choose among them. (3) Form and Run Governments: The party winning the majority of seats forms and runs the administration, executing its policies. (CBSE Board 2021)"
          }
        ]
      },
      {
        id: "outcomes-democracy",
        title: "Outcomes of Democracy (Civics)",
        notes: "### 1. Values\nAccountable, responsive, and legitimate governance.\n\n### 2. Performance\nAlthough slower, democracy reduces arbitrary extreme choices.",
        worksheet: [
          {
            id: "c-w5",
            question: "In what key aspect is a democratic government superior to non-democratic alternatives?",
            options: [
              "It is a legitimate government accountable to the people",
              "It always guarantees instant economic growth",
              "It eliminates all income disparities",
              "It is completely error-free"
            ],
            correctAnswerIndex: 0,
            explanation: "Even with flaws, democracy remains legally legitimate and responsive to citizens through regular voting. (CBSE Board 2023)"
          },
          {
            id: "c-w5-satq",
            question: "How is a democratic government accountable, responsive, and legitimate?",
            explanation: "A democratic government is: (1) Accountable: Citizens have the right to choose their representatives and hold them responsible through regular free elections. (2) Responsive: It is expected to pay attention to the needs, demands, and public opinions of its citizens. (3) Legitimate: It is a government of the people, by the people, and is constitutionally established, ensuring legal authority. (CBSE Board 2022)"
          }
        ]
      },
      // Economics
      {
        id: "development",
        title: "Development (Economics)",
        notes: "### 1. Metrics\nPer capita income (World Bank) vs Human Development Index (UNDP). Life expectancy, literacy rates.",
        worksheet: [
          {
            id: "ec-w1",
            question: "Which global organization uses the Human Development Index (HDI) to compare country progress?",
            options: ["UNDP (United Nations Development Programme)", "World Bank", "IMF", "UNESCO"],
            correctAnswerIndex: 0,
            explanation: "UNDP publishes reports comparing education levels, health markers and income ratios. (CBSE Board 2021)"
          },
          {
            id: "ec-w1-satq",
            question: "What is the main criterion used by the World Bank to classify countries? Mention any two limitations of this criterion.",
            explanation: "The World Bank uses 'Per Capita Income' (average income per person) to classify countries into rich and low-income categories. Limitations of this criterion are: (1) It hides disparities; it doesn't show how income is distributed among the population. (2) It ignores other crucial human welfare factors such as education, healthcare, life expectancy, and infant mortality rate. (CBSE Board 2019)"
          }
        ]
      },
      {
        id: "sectors-economy",
        title: "Sectors of the Indian Economy (Economics)",
        notes: "### 1. Divisions\nPrimary (Natural extraction), Secondary (Industrial), and Tertiary (Services).\n\n### 2. Protections\nUnorganized sector challenges. NREGA 2005 100-day wage security.",
        worksheet: [
          {
            id: "ec-w2",
            question: "How many days of guaranteed manual wage labor does NREGA 2005 offer?",
            options: ["100 days", "150 days", "200 days", "50 days"],
            correctAnswerIndex: 0,
            explanation: "The Act provides a fallback of 100 days of manual work per rural household. (CBSE Board 2022)"
          },
          {
            id: "ec-w2-satq",
            question: "Why is the tertiary sector becoming so important in India?",
            explanation: "The tertiary (service) sector is growing rapidly in India because: (1) Basic services like hospitals, educational institutions, post offices, and banks are vital and their demand is rising. (2) Development of agriculture and industry leads to development of services like transport, trade, and storage. (3) Rise in income levels causes people to demand tourism, shopping, and private schooling. (4) Information and communication technology services have become highly essential. (CBSE Board 2021)"
          }
        ]
      },
      {
        id: "money-credit",
        title: "Money and Credit (Economics)",
        notes: "### 1. Dual transactions\nDouble coincidence of wants eliminated by fiat Money.\n\n### 2. Credit\nFormal (Banks, regulated by RBI) vs Informal (Moneylenders, high interest exploitation). Self Help Groups (SHGs).",
        worksheet: [
          {
            id: "ec-w3",
            question: "Which formal regulator supervises the lending actions of commercial banks in India?",
            options: ["Reserve Bank of India (RBI)", "Ministry of Finance", "State Bank of India", "SEBI"],
            correctAnswerIndex: 0,
            explanation: "The RBI supervises cash reserves, rates of interest, and credit guidelines to ensure systemic safety. (CBSE Board 2023)"
          },
          {
            id: "ec-w3-satq",
            question: "What is the basic idea behind Self Help Groups (SHGs) for the poor?",
            explanation: "The basic idea behind SHGs (usually 15-20 rural women) is: (1) To organize the rural poor into small groups to pool their savings regularly. (2) To provide timely, low-interest micro-loans for self-employment or personal needs without requiring any collateral, which poor households lack. (3) To help women become financially self-reliant and provide a platform to discuss social issues. (CBSE Board 2020)"
          }
        ]
      },
      {
        id: "globalisation",
        title: "Globalisation and the Indian Economy (Economics)",
        notes: "### 1. MNC Action\nForeign investments cross-borders. Trade liberalisation.\n\n### 2. WTO\nSets terms for global trading blocks since 1995. Special Economic Zones (SEZs).",
        worksheet: [
          {
            id: "ec-w4",
            question: "What are Special Economic Zones (SEZs) designed to achieve?",
            options: [
              "To attract foreign multi-national investments with top infrastructure & tax breaks",
              "To protect traditional handloom weavers",
              "To offer free farm loans",
              "To develop borders"
            ],
            correctAnswerIndex: 0,
            explanation: "SEZs offer tax exemptions and world-class utilities to encourage external manufacturing. (CBSE Board 2021)"
          },
          {
            id: "ec-w4-satq",
            question: "What is globalization? Mention any two factors that have enabled globalization.",
            explanation: "Globalization is the process of rapid integration and interconnection between different countries, through foreign trade and foreign investment by Multinational Corporations (MNCs). Two enabling factors are: (1) Rapid improvement in technology, particularly in telecommunications, computers, and internet. (2) Liberalization of foreign trade and investment policies, removing trade barriers. (CBSE Board 2022)"
          }
        ]
      },
      {
        id: "consumer-rights",
        title: "Consumer Rights (Economics)",
        notes: "### 1. Exploitation\nAdulteration, under-weighing, and false advertisement.\n\n### 2. COPRA 1986\nProvides clear judicial channels: Safety, Information, Choice, Redressal.",
        worksheet: [
          {
            id: "ec-w5",
            question: "When a consumer is sold defective machinery, which right allows him to seek compensation in consumer courts?",
            options: ["Right to Seek Redressal", "Right to Information", "Right to Represent", "Right to Choose"],
            correctAnswerIndex: 0,
            explanation: "The Right to Seek Redressal allows consumers to file files for refund, replacement, or compensation damage. (CBSE Board 2020)"
          },
          {
            id: "ec-w5-satq",
            question: "Explain the three-tier quasi-judicial machinery set up under COPRA (Consumer Protection Act) for redressal of consumer disputes in India.",
            explanation: "Under COPRA, a three-tier quasi-judicial system is set up: (1) District Forum (District level): Handles cases where claims are up to Rs. 1 crore (revised). (2) State Commission (State level): Handles cases with claims between Rs. 1 crore and Rs. 10 crore. (3) National Commission (National level): Handles cases with claims exceeding Rs. 10 crore. Consumers can appeal to higher tiers if they are unsatisfied with the lower court's decision. (CBSE Board 2021)"
          }
        ]
      }
    ]
  },
  {
    id: "class-10-ai",
    name: "Artificial Intelligence",
    color: "indigo",
    chapters: [
      {
        id: "ai-comm",
        title: "Communication Skills-II",
        notes: "### 1. Methods of Communication\nVerbal, Non-Verbal, and Visual communication methods.\n\n### 2. Communication Barriers\nPhysical, organizational, cultural, linguistic, and interpersonal barriers.",
        worksheet: [
          {
            id: "ai-c1",
            question: "Which of the following is an example of non-verbal communication?",
            options: ["Writing an email", "Gestures and facial expressions", "Speaking on the phone", "Giving a presentation"],
            correctAnswerIndex: 1,
            explanation: "Non-verbal communication involves conveying messages without words, such as through posture, gestures, and eye contact. (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "ai-self",
        title: "Self-Management Skills-II",
        notes: "### 1. Stress Management\nTechniques including yoga, exercise, vacations, and proper sleep cycles.\n\n### 2. Self-Reliance & Motivation\nAbility to work independently, set personal goals, and find intrinsic motivation.",
        worksheet: [
          {
            id: "ai-c2",
            question: "Which of the following is a physical agent of stress?",
            options: ["Mental anxiety", "High noise levels or lack of sleep", "Peer pressure", "Financial problems"],
            correctAnswerIndex: 1,
            explanation: "High noise and lack of sleep are environmental and physical stressors affecting the body directly. (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "ai-ict",
        title: "ICT Skills-II",
        notes: "### 1. Operating System Basics\nUnderstanding GUI, files and directories, and basic system utilities.\n\n### 2. System Maintenance\nRegular backups, virus scanning, and clearing temporary storage sheets.",
        worksheet: [
          {
            id: "ai-c3",
            question: "What is the utility of defragmenting a computer hard drive?",
            options: ["To delete files permanently", "To organize scattered file fragments for optimal storage and access speed", "To install custom security patches", "To increase physical RAM size"],
            correctAnswerIndex: 1,
            explanation: "Defragmentation groups files' parts together to make retrieval much faster. (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "ai-ent",
        title: "Entrepreneurial Skills-II",
        notes: "### 1. Characteristics of Entrepreneurs\nRisk-taking, innovation, persistence, and continuous learning.\n\n### 2. Role in Society\nGenerating jobs, wealth creation, and community development.",
        worksheet: [
          {
            id: "ai-c4",
            question: "What is the primary role of an entrepreneur in a developing economy?",
            options: ["To avoid taking financial risks", "To generate local employment and create value", "To consume maximum public resources", "To work as a government officer"],
            correctAnswerIndex: 1,
            explanation: "Entrepreneurs play a vital role by driving innovation and hiring people. (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "ai-green",
        title: "Green Skills-II",
        notes: "### 1. Sustainable Development\nMeeting modern needs without compromising future generations' resources.\n\n### 2. Green Economy\nAn economy that aims for sustainable development without degrading the environment.",
        worksheet: [
          {
            id: "ai-c5",
            question: "Which of the following is one of the 17 Sustainable Development Goals (SDGs) of the UN?",
            options: ["Colonizing other planets", "Climate Action", "Unrestricted coal mining", "Maximizing industrial effluents"],
            correctAnswerIndex: 1,
            explanation: "SDG 13 is Climate Action, aiming to combat climate changes and its impacts. (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "ai-intro",
        title: "Unit 1: Introduction to AI",
        notes: "### 1. What is AI?\nAI is a branch of computer science aiming to create intelligent machines that simulate human cognitive processes.\n\n### 2. AI, ML, and DL Relations\n- Artificial Intelligence (AI): The broad umbrella concept.\n- Machine Learning (ML): Subset of AI that enables systems to learn from data.\n- Deep Learning (DL): Subset of ML utilizing deep multi-layered artificial neural networks.",
        worksheet: [
          {
            id: "ai-w1-1",
            question: "Which of the following is a subset of Machine Learning that uses multi-layered artificial neural networks?",
            options: ["Deep Learning", "Supervised Learning", "Natural Language Processing", "Expert Systems"],
            correctAnswerIndex: 0,
            explanation: "Deep Learning is a subset of ML based on artificial neural networks with multiple layers (deep representation). (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "ai-cycle",
        title: "Unit 2: AI Project Cycle",
        notes: "### 1. Key Phases\n1. Problem Scoping: Setting targets and understanding constraints.\n2. Data Acquisition: Gathering relevant inputs.\n3. Data Exploration: Visualizing and organizing statistics.\n4. Modeling: Choosing models and algorithms.\n5. Evaluation: Rating performance accuracy.",
        worksheet: [
          {
            id: "ai-w2",
            question: "Which phase of the AI Project Cycle utilizes tools like the '4Ws Problem Canvas'?",
            options: ["Problem Scoping", "Data Acquisition", "Data Exploration", "Modeling"],
            correctAnswerIndex: 0,
            explanation: "The 4Ws Problem Canvas (Who, What, Where, Why) is the standard tool used in Problem Scoping. (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "ai-data-lit",
        title: "Unit 3: Data Literacy",
        notes: "### 1. Core Concepts\nUnderstanding standard datasets, fields, attributes, and formats.\n\n### 2. Data Cleaning\nRemoving duplicate records, fixing missing variables, and dealing with outliers.",
        worksheet: [
          {
            id: "ai-w3",
            question: "Why is data exploration and cleaning considered highly vital before feeding data into models?",
            options: ["To make sure no bad, duplicated, or highly biased data corrupts the AI", "To make the file look colorful", "To double the database size", "To convert all text into binary digits instantly"],
            correctAnswerIndex: 0,
            explanation: "Clean and well-visualized data prevents bad training (the 'Garbage In, Garbage Out' rule). (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "ai-apps",
        title: "Unit 4: AI Applications",
        notes: "### 1. Key Domains\n- Computer Vision (CV): Object detection, image processing, segmentation.\n- Natural Language Processing (NLP): Chatbots, translation, sentiment search.\n- Data Sciences (DS): Predictions, recommendation engines.",
        worksheet: [
          {
            id: "ai-w4",
            question: "Which AI domain is primarily used in self-driving cars to identify street signs and pedestrians?",
            options: ["Computer Vision", "Natural Language Processing", "Data Science", "Web Development"],
            correctAnswerIndex: 0,
            explanation: "Identifying physical objects from visual feeds relies on Computer Vision algorithms. (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "ai-practical",
        title: "Practical Work",
        notes: "### 1. Hands-on AI Projects\nBuilding simple models, compiling worksheets, and completing evaluation tasks.\n\n### 2. Python Basics\nLibraries like NumPy, Pandas, and Matplotlib are vital tools.",
        worksheet: [
          {
            id: "ai-w5",
            question: "Which Python library is standard for data manipulation and analysis in AI projects?",
            options: ["Pandas", "Django", "HTML", "Flask"],
            correctAnswerIndex: 0,
            explanation: "Pandas provides high-performance data structures like DataFrames for data analysis. (CBSE Board 2024)"
          }
        ]
      }
    ]
  },
  {
    id: "computer-applications",
    name: "Computer Applications",
    color: "cyan",
    chapters: [
      {
        id: "ca-networking",
        title: "Unit 1: Networking",
        notes: "### 1. Internet Basics\nWorld Wide Web, Web browsers, Servers, Domain Names, and TCP/IP protocol.\n\n### 2. Services\nEmail, Chat, Video conferencing, and digital portals.",
        worksheet: [
          {
            id: "ca-n1",
            question: "Which of the following protocols is responsible for dividing files into packets for transmission over the Internet?",
            options: ["TCP", "IP", "HTTP", "FTP"],
            correctAnswerIndex: 0,
            explanation: "TCP (Transmission Control Protocol) breaks data into packets and reassembles them at the destination. (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "ca-html",
        title: "Unit 2: HTML",
        notes: "### 1. Web Page Structuring\nHTML tags, attributes, formatting elements, and lists (`<ul>`, `<ol>`).\n\n### 2. Advanced Layouts\nCreating tables (`<table>`), inserting images (`<img>`), and building hyperlinks (`<a>`).",
        worksheet: [
          {
            id: "ca-h1",
            question: "Which HTML tag is used to create a numbered (ordered) list?",
            options: ["<ol>", "<ul>", "<li>", "<list>"],
            correctAnswerIndex: 0,
            explanation: "The <ol> tag is used to define an ordered list (numbered) in HTML. (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "ca-spreadsheet",
        title: "Unit 3: Spreadsheet (Calc / Excel)",
        notes: "### 1. Basics\nRows, columns, cells, and standard sheets navigation.\n\n### 2. Formulas and Referencing\nRelative and Absolute cell referencing ($A$1), sum, average, charts, and filtering.",
        worksheet: [
          {
            id: "ca-s1",
            question: "Which cell reference prevents both the row and column from changing when a formula is copied?",
            options: ["$A$1", "$A1", "A$1", "A1"],
            correctAnswerIndex: 0,
            explanation: "An absolute cell reference (using $ before both column and row) locks the cell reference during copying. (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "ca-doc",
        title: "Unit 4: Digital Documentation & Presentation",
        notes: "### 1. Word Processing\nHeader, footer, page formatting, borders, and templates.\n\n### 2. Slide Presentations\nSlide transitions, custom animations, templates, and multimedia links.",
        worksheet: [
          {
            id: "ca-d1",
            question: "In word processing, what is the area reserved at the bottom margin of every page called?",
            options: ["Footer", "Header", "Sidebar", "Footnote"],
            correctAnswerIndex: 0,
            explanation: "The footer is the dedicated section appearing at the bottom of each page. (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "ca-ethics",
        title: "Unit 5: Cyber Ethics & Safety",
        notes: "### 1. Netiquette\nProper behavior on the internet, respecting privacy, and preventing plagiarism.\n\n### 2. Cyber Security\nAvoiding virus downloads, protecting digital footprints, and securing personal data.",
        worksheet: [
          {
            id: "ca-e1",
            question: "The legal rights protecting authors and creators of original digital works from illegal replication is known as:",
            options: ["Copyrights", "Plagiarism", "Phishing", "Spamming"],
            correctAnswerIndex: 0,
            explanation: "Copyright protection is an essential component of Intellectual Property Rights. (CBSE Board 2024)"
          }
        ]
      }
    ]
  },
  {
    id: "sanskrit",
    name: "Sanskrit (संस्कृतम्)",
    color: "orange",
    chapters: [
      {
        id: "sk-shuchi",
        title: "शुचिपर्यावरणम्",
        notes: "### १. पाठ परिचय\n'शुचिपर्यावरणम्' आधुनिकसंस्कृतकविः हरिदत्तशर्मणः लसल्लतिका इति रचनासंग्रहात् संकलितोऽस्ति। अत्र महानगराणां प्रदूषणोपरि चिन्ता प्रकटीकृता।",
        worksheet: [
          {
            id: "sk-s1",
            question: "महानगरेषु दिवानिशं प्रचलति किम्?",
            options: ["कालायसचक्रम्", "जलयानम्", "विद्युच्चक्रम्", "वायुयानम्"],
            correctAnswerIndex: 0,
            explanation: "महानगरेषु अहोरात्रं 'कालायसचक्रम्' (लोहचक्रम्) प्रचलति यत् पर्यावरणं दूषयति। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "sk-buddhi",
        title: "बुद्धिर्बलवती सदा",
        notes: "### १. पाठ परिचय\n'बुद्धिर्बलवती सदा' शुकसप्ततिः इति कथाग्रन्थात् संकलितः अस्ति। अत्र स्वबुद्ध्या व्याघ्रस्य भयात् मुक्तायाः बुद्धिमत्याः स्त्रियाः कथा अस्ति।",
        worksheet: [
          {
            id: "sk-s2",
            question: "बुद्धिमती कुत्र व्याघ्रं ददर्श?",
            options: ["गहनकानने", "गृहे", "ग्रामे", "नदीतीरे"],
            correctAnswerIndex: 0,
            explanation: "बुद्धिमती स्वपुत्रद्वयेन सह पितृगृहं गच्छन्ती गहनकानने एकं व्याघ्रं ददर्श। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "sk-vyayama",
        title: "व्यायामः सर्वदा पथ्यः",
        notes: "### १. पाठ परिचय\n'व्यायामः सर्वदा पथ्यः' सुश्रुतसंहितायाः चिकित्सास्थाने वर्णितोऽस्ति। अत्र व्यायामस्य लाभाः सुविस्तरेण प्रतिपादिताः सन्ति।",
        worksheet: [
          {
            id: "sk-s3",
            question: "कस्य शरीरं व्यायामं कुर्वतः सदा आरोग्यप्रदं भवति?",
            options: ["व्यायामशीलस्य", "आलस्ययुक्तस्य", "अतीव कृशस्य", "रोगिणः"],
            correctAnswerIndex: 0,
            explanation: "व्यायामं कुर्वतः जनस्य शरीरं बलिष्ठं आरोग्ययुक्तं च भवति। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "sk-shishu",
        title: "शिशुलालनम्",
        notes: "### १. पाठ परिचय\n'शिशुलालनम्' दिङ्नागविरचितस्य कुन्दमाला इति नाटकस्य अंशः अस्ति। अत्र श्रीरामस्य लव-कुशयोः प्रति वात्सल्यं दर्शितम्।",
        worksheet: [
          {
            id: "sk-s4",
            question: "लवकुशयोः वंशस्य कर्ता कः?",
            options: ["सहस्रदीधितिः (सूर्यः)", "चन्द्रः", "शिवः", "विष्णुः"],
            correctAnswerIndex: 0,
            explanation: "लवकुशयोः सूर्यवंशोद्भवत्वात् सूर्यः एव तयोः वंशस्य कर्ता वर्तते। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "sk-janani",
        title: "जननी तुल्यवत्सला",
        notes: "### १. पाठ परिचय\n'जननी तुल्यवत्सला' महाभारतस्य वनपर्वतः उद्धृतः अस्ति। अत्र मातुरपत्यस्नेहस्य अद्वितीयं निरूपणं वर्तते।",
        worksheet: [
          {
            id: "sk-s5",
            question: "दुर्बले सुते कस्याः अधिका कृपा भवति?",
            options: ["मातुः", "पितुः", "भ्रातुः", "भगिन्याः"],
            correctAnswerIndex: 0,
            explanation: "सर्वेषु अपत्येषु मातुः स्नेहः समानः एव भवति, परन्तु दुर्बले सुते मातुः अधिका कृपा भवति। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "sk-subhashita",
        title: "सुभाषितानि",
        notes: "### १. पाठ परिचय\n'सुभाषितानि' ग्रन्थे विभिन्नसंस्कृतकाव्येभ्यः नीति-सदाचारविषयकाः दश श्लोकाः संकलिताः सन्ति।",
        worksheet: [
          {
            id: "sk-s6",
            question: "मनुष्याणां शरीरस्थो महान् शत्रुः कः?",
            options: ["आलस्यम्", "उद्यमः", "क्रोधः", "लोभः"],
            correctAnswerIndex: 0,
            explanation: "श्लोकानुसारम् आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः (शत्रुः) अस्ति। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "sk-mangalam",
        title: "मङ्गलम्",
        notes: "### १. पाठ परिचय\nउपनिषदां मन्त्राः अत्र मङ्गलरूपेण संकलिताः सन्ति। अत्र परमेश्वरस्य आराधना अस्ति।",
        worksheet: [
          {
            id: "sk-s7",
            question: "सत्यस्य मुखं केन पात्रेण अपिहितम् अस्ति?",
            options: ["हिरण्मयेन", "रजतपुष्पेण", "ताम्रेण", "लौहेन"],
            correctAnswerIndex: 0,
            explanation: "सत्यस्य मुखं हिरण्मयेन (स्वर्णमयेन) पात्रेण आच्छादितम् अस्ति। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "sk-niti",
        title: "नीतिशतकम्",
        notes: "### १. पाठ परिचय\nभर्तृहरिविरचितस्य नीतिशतकस्य श्लोकाः छात्रेषु सदाचारं नीतिज्ञानं च वर्धयन्ति।",
        worksheet: [
          {
            id: "sk-s8",
            question: "विद्वज्जनसंसर्गे कः वर्धते?",
            options: ["ज्ञानम्", "अहङ्कारः", "लोभः", "क्रोधः"],
            correctAnswerIndex: 0,
            explanation: "सज्जनानां सङ्गत्या मनुष्यस्य विवेकः ज्ञानं च वर्धते। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "sk-sukti",
        title: "सूक्तयः",
        notes: "### १. पाठ परिचय\nतमिळ्भाषायाः प्रसिद्धग्रन्थस्य 'तिरुक्कुरळ्' इत्यस्य संस्कृतानुवादः अत्र सूक्तिरूपेण संकलितः।",
        worksheet: [
          {
            id: "sk-s9",
            question: "पिता पुत्राय बाल्ये किं यच्छति?",
            options: ["विद्याधनम्", "क्रीडनकम्", "धनम्", "वस्त्रम्"],
            correctAnswerIndex: 0,
            explanation: "पिता स्वपुत्राय बाल्यकाले महत् विद्याधनं यच्छति। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "sk-bhakti",
        title: "भक्तिगीतम्",
        notes: "### १. पाठ परिचय\nभaktiरसपूर्णानि सुमधुराणि गीतानि भगवतः वन्दना च अत्र वर्तते।",
        worksheet: [
          {
            id: "sk-s10",
            question: "भक्ताः भक्त्या कं नमन्ति?",
            options: ["जगदीश्वरम्", "पशुम्", "द्रुमम्", "शैलम्"],
            correctAnswerIndex: 0,
            explanation: "भक्ताः श्रद्धापूर्वकं जगदीश्वरं (परमात्मानं) नमन्ति।"
          }
        ]
      },
      {
        id: "sk-prarthana",
        title: "प्रार्थना",
        notes: "### १. पाठ परिचय\nकल्याणकामाय भगवतः प्रार्थना लोककल्याणाय च सङ्कल्पाः।",
        worksheet: [
          {
            id: "sk-s11",
            question: "'सर्वे भवन्तु सुखिनः' इति मन्त्रे कस्य कामना अस्ति?",
            options: ["लोककल्याणस्य", "स्वार्थस्य", "विनाशस्य", "शत्रुतायाः"],
            correctAnswerIndex: 0,
            explanation: "'सर्वे भवन्तु सुखिनः' इति श्लोके लोककल्याणस्य प्राणिमात्रस्य च सुखस्य कामना वर्तते।"
          }
        ]
      },
      {
        id: "sk-deshbhakti",
        title: "देशभक्तिः",
        notes: "### १. पाठ परिचय\nदेशस्य गौरवं, मातृभूमेः वन्दना, राष्ट्रियैकतायाः गुणाः च अत्र वर्णिताः।",
        worksheet: [
          {
            id: "sk-s12",
            question: "'जननी जन्मभूमिश्च' कुतोऽपि गरीयसी?",
            options: ["स्वर्गादपि", "गृहादपि", "राष्ट्रादपि", "नगरादपि"],
            correctAnswerIndex: 0,
            explanation: "'जननी जन्मभूमिश्च स्वर्गादपि गरीयसी' इति नीतिवाक्यं मातृभूमिं स्वर्गस्य अपि अपेक्षया श्रेष्ठतरं मन्यते। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "sk-sauharda",
        title: "सौहार्दं प्रकृतेः शोभा",
        notes: "### १. पाठ परिचय\nअस्मिन् पाठे परस्परं स्नेहेन समताभावेन च स्थातुं उपदेशः दत्तः। वन्यजीवाः परस्परं विवदन्ते प्रकृतिमहोदया च तान् बोधयति।",
        worksheet: [
          {
            id: "sk-s13",
            question: "कः वनराजपदाय आत्मनः योग्यं मन्यते?",
            options: ["सिंहादयः सर्वे पशवः", "गजः", "मयूरः", "पिकः"],
            correctAnswerIndex: 0,
            explanation: "पाठे सिंहादयः खगाः च परस्परं विवादं कुर्वन्तः वनराजपदाय आत्मनः योग्यं मन्यन्ते। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "sk-vichitra",
        title: "विचित्रः साक्षी",
        notes: "### १. पाठ परिचय\n'विचित्रः साक्षी' इति कथा ओमप्रकाशठाकुरविरचिता। अत्र न्यायालये बुद्धिकौशलेन सत्यस्य प्रकाशनं दर्शितम्।",
        worksheet: [
          {
            id: "sk-s14",
            question: "न्यायाधीशः कः आसीत्?",
            options: ["बङ्किमचन्द्रः", "आरक्षी", "चौरः", "अतिथिकीटः"],
            correctAnswerIndex: 0,
            explanation: "न्यायाधीशः बङ्किमचन्द्रः आसीत्, यः बुद्धिकौशलेन शवं साक्षिणं कृत्वा सत्यं प्रकटितवान्। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "sk-sandhi",
        title: "सन्धि (स्वर, व्यंजन, विसर्ग)",
        notes: "### १. व्याकरणम् - सन्धिः\nद्वयोः वर्णयोः मेलनेन यः विकारः उत्पद्यते सः सन्धिः।\n- व्यञ्जनसन्धिः: जश्त्वम्, परसवर्णम्, अनुस्वारः।\n- विसर्गसन्धिः: उत्वम्, रत्वम्, विसर्गलोपः।",
        worksheet: [
          {
            id: "sk-s15",
            question: "'वाक् + ईशः' इत्यस्य सन्धिपदं किमस्ति?",
            options: ["वागीशः", "वाकीशः", "वाचिशः", "वागशः"],
            correctAnswerIndex: 0,
            explanation: "जश्त्वसन्धिनियमानुसारं ककारस्य गकारः भूत्वा 'वागीशः' भवति। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "sk-samasa",
        title: "समास",
        notes: "### १. समास परिचय\n- अव्ययीभावः (उप, अनु, प्रति, सह)\n- तत्पुरुषः (विभक्तिः)\n- द्वन्द्वः (च अर्थे)\n- बहुव्रीहिः (अन्यपदप्रधानः)",
        worksheet: [
          {
            id: "sk-s16",
            question: "'कृष्णसर्पः' इत्यस्य विग्रहवाक्यं किमस्ति?",
            options: ["कृष्णः सर्पः", "कृष्णस्य सर्पः", "कृष्णे सर्पः", "कृष्णाय सर्पः"],
            correctAnswerIndex: 0,
            explanation: "विशेषण-विशेष्यभावात् अत्र कर्मधारयसमासः अस्ति - कृष्णः सर्पः। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "sk-pratyaya",
        title: "प्रत्यय",
        notes: "### १. कृदन्ताः तद्धिताः च\n- मतुप्, त्व, तल्, टाप्, ङीप् प्रत्ययानां प्रयोगः।\n- मतुप्: अस्ति अस्मिन् अर्थे (बुद्धि + मतुप् = बुद्धिमती)।",
        worksheet: [
          {
            id: "sk-s17",
            question: "'महत् + त्व' योजनेन किं रूपं सिद्ध्यति?",
            options: ["महत्त्वम्", "महता", "महत्त्व", "महत्वी"],
            correctAnswerIndex: 0,
            explanation: "'त्व' प्रत्ययः नपुंसकलिङ्गे प्रयुज्यते, अतः 'महत्त्वम्' इति रूपं भवति। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "sk-upasarga",
        title: "उपसर्ग",
        notes: "### १. उपसर्गाः\nधातोः पूर्वं युक्ताः शब्दांशाः उपसर्गाः (प्र, परा, अप, सम्, अनु, अव, निर्, दुर्, वि, आ, अति)।",
        worksheet: [
          {
            id: "sk-s18",
            question: "'अनुगच्छति' इति पदे कः उपसर्गः अस्ति?",
            options: ["अनु", "अन्", "अ", "गच्छ"],
            correctAnswerIndex: 0,
            explanation: "'अनु' उपसर्गः गच्छति धातोः पूर्वं प्रयुक्तः अस्ति। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "sk-karaka",
        title: "कारक",
        notes: "### १. उपपदविभक्तयः\nनमस, सह, विना, प्रति, अलम्, बही, भी, रुच् इत्यादीनां योगे विशिष्टा विभक्तयः भवन्ति।",
        worksheet: [
          {
            id: "sk-s19",
            question: "'नमः' योगे का विभक्तिः भवति?",
            options: ["चतुर्थी", "द्वितीया", "तृतीया", "पञ्चमी"],
            correctAnswerIndex: 0,
            explanation: "'नमः' योगे चतुर्थी विभक्तिः भवति (यथा- श्रीशिवाय नमः)। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "sk-vachya",
        title: "वाच्य",
        notes: "### १. वाच्यपरिवर्तनम्\nकर्तृवाच्यं, कर्मवाच्यं, भाववाच्यं च।\n- वाच्यपरिवर्तनम्",
        worksheet: [
          {
            id: "sk-s20",
            question: "'अहं पुस्तकं पठामि' कर्मवाच्ये किं भविष्यति?",
            options: ["मया पुस्तकं पठ्यते", "मया पुस्तकः पठ्यते", "मम पुस्तकं पठ्यते", "मया पुस्तकं पठामि"],
            correctAnswerIndex: 0,
            explanation: "अहं तृतीयायां 'मया', पुस्तकं प्रथमायां 'पुस्तकं', क्रिया 'पठ्यते' इति जायते। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "sk-avyaya",
        title: "अव्यय",
        notes: "### १. अव्ययपदानि\nसदा, अपि, एव, कुत्र, श्वः, ह्यः, इतस्ततः, सहसा, वृथा, कदा इत्यादीनि रूपाणि त्रिसु लिङ्गेषु समानानि भवन्ति।",
        worksheet: [
          {
            id: "sk-s21",
            question: "'saha svah gamisyati' avyayam asti?",
            options: ["श्वः", "सः", "गमिष्यति", "कोऽपि न"],
            correctAnswerIndex: 0,
            explanation: "'श्वः' (Tomorrow) इति अव्ययपदं वर्तते यस्य रूपं कदापि न परिवर्तते। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "sk-shabdarupa",
        title: "शब्दरूप",
        notes: "### १. अकारान्त, आकारान्त शब्दरूपाणि\nबालक, लता, मुनि, नदी, साधु, राजन्, आत्मन् इति शब्दानां विभक्तयः।",
        worksheet: [
          {
            id: "sk-s22",
            question: "'बालक' शब्दस्य षष्ठी बहुवचने किं रूपं भवति?",
            options: ["बालकानाम्", "बालकेषु", "बालकान्", "बालकैः"],
            correctAnswerIndex: 0,
            explanation: "'बालक' शब्दस्य षष्ठी बहुवचने 'बालकानाम्' इति रूपं भवति। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "sk-dhaturupa",
        title: "धातुरूप",
        notes: "### १. लकाराः\nलट् (वर्तमान), लृट् (भविष्य), लङ् (भूत), लोट् (आज्ञा), विधिलिङ् (उपदेश) लकाराणां रूपाणि (पठ्, गम्, लिख्, कृ, सेव्)।",
        worksheet: [
          {
            id: "sk-s23",
            question: "'पठेयुः' इति रूपं कस्मिन् लकारे अस्ति?",
            options: ["विधिलिङ्", "लट्", "लृट्", "लोट्"],
            correctAnswerIndex: 0,
            explanation: "'पठेयुः' इति पठ् धातोः विधिलिङ् लकारे प्रथमपुरुषस्य बहुवचनरूपं वर्तते। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "sk-ashuddhi",
        title: "अशुद्धि संशोधन",
        notes: "### १. अशुद्धि संशोधनम्\nकर्ता-क्रिया काल-लिङ्ग वचनविभक्तीनां नियमानुसारं वाक्यानां शुद्धीकरणम्।",
        worksheet: [
          {
            id: "sk-s24",
            question: "'सः गृहं गच्छन्ति' इत्यस्य शुद्धरूपं किमस्ति?",
            options: ["सः गृहं गच्छति", "ते गृहं गच्छति", "सः गृहं गच्छसि", "मया गृहं गच्छति"],
            correctAnswerIndex: 0,
            explanation: "एकवचनकर्त्रा 'सः' सह एकवचनक्रिया 'गच्छति' एव युक्ता भवति। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "sk-vakya-nirman",
        title: "वाक्य निर्माण",
        notes: "### १. संस्कृत वाक्यरचना\nकारकविभक्तीनां धातुरूपाणां च सम्यक् प्रयोगेण सरलवाक्यनिर्माणम्।",
        worksheet: [
          {
            id: "sk-s25",
            question: "'राम फल खाता है' संस्कृत अनुवादः कः?",
            options: ["रामः फलं खादति", "रामं फल खादति", "रामेण फलं खादति", "रामः फलानि खादसि"],
            correctAnswerIndex: 0,
            explanation: "कर्ता रामः (प्रथमा), कर्म फलं (द्वितीया), क्रिया खादति इति कर्तृवाच्ये शुद्धम् वाक्यम्।"
          }
        ]
      },
      {
        id: "sk-patra",
        title: "पत्र लेखन",
        notes: "### १. औपचारिक/अनौपचारिक पत्रम्\nमञ्जूषातः योग्यपदानि चित्वा रिक्तस्थानपूरणेन पत्रलेखनम्।",
        worksheet: [
          {
            id: "sk-s26",
            question: "पत्रस्य अन्ते पितरं प्रति किं कथ्यते?",
            options: ["सादरं प्रणामाः", "सविनय निवेदनम्", "भवदीयः शिष्यः", "सादरं वन्दना"],
            correctAnswerIndex: 0,
            explanation: "अनौपचारिकपत्रे गुरुजनानां कृते 'सादरं प्रणामाः' इति सादरं वन्द्यते।"
          }
        ]
      },
      {
        id: "sk-chitra",
        title: "चित्र वर्णन",
        notes: "### १. चित्र वर्णनम्\nदत्तचित्रं दृष्ट्वा मञ्जूषायाः साहाय्येन पञ्च वाक्यानां निर्माणम्।",
        worksheet: [
          {
            id: "sk-s27",
            question: "चित्रे बालकाः क्रीडन्ति इति वाक्ये क्रियापदं किम्?",
            options: ["क्रीडन्ति", "चित्रे", "बालकाः", "पश्यन्ति"],
            correctAnswerIndex: 0,
            explanation: "'क्रीडन्ति' (Play) इति वाक्यस्य धात्वात्मकं क्रियापदं वर्तते।"
          }
        ]
      },
      {
        id: "sk-samvada",
        title: "संवाद पूर्ति",
        notes: "### १. संवाद पूर्तिः\nद्वयोः जनयोः वार्तालापं पूरयितुं मञ्जूषातः योग्यानि पदानि चित्वा लिखनम्।",
        worksheet: [
          {
            id: "sk-s28",
            question: "कः कुशलप्रश्नाय प्रयुज्यते?",
            options: ["अथ कथं भवन्तः?", "नमो नमः", "धन्यवादः", "कथं श्वः?"],
            correctAnswerIndex: 0,
            explanation: "कुशलमङ्गलप्रश्नाय 'अथ कथं भवन्तः' अथवा 'कथं वर्तते' इति प्रयुज्यते।"
          }
        ]
      },
      {
        id: "sk-anuchheda",
        title: "अनुच्छेद लेखन",
        notes: "### १. अनुच्छेद लेखनम्\nदत्तविषयम् (यथा- परोपकारः, मम विद्यालयः, संस्कृतभाषायाः महत्त्वम्) आधृत्य पञ्च सरलवाक्यानां लेखनम्।",
        worksheet: [
          {
            id: "sk-s29",
            question: "'परोपकाराय पुण्याय...' इति सूक्त्या कः सन्देशः दीयते?",
            options: ["अन्येषां कल्याणम् अस्माकं धर्मः", "स्वार्थसाधनम्", "क्रोधप्रदर्शनम्", "कालयापनम्"],
            correctAnswerIndex: 0,
            explanation: "परोपकारः एव जीवनस्य परमं पुण्यकार्यं वर्तते।"
          }
        ]
      },
      {
        id: "sk-anuvada",
        title: "अनुवाद",
        notes: "### १. अनुवाद कला\nहिन्दी/आङ्ग्लभाषया लिखितानां सरलवाक्यानां संस्कृतभाषायां शुद्धानुवादः।",
        worksheet: [
          {
            id: "sk-s30",
            question: "'वह जाता है' इत्यस्य संस्कृतानुवादः कः?",
            options: ["सः गच्छति", "ते गच्छन्ति", "त्वं गच्छसि", "अहं गच्छामि"],
            correctAnswerIndex: 0,
            explanation: "प्रथमपुरुष-एकवचनस्य अनुवादः 'सः गच्छति' भवति।"
          }
        ]
      }
    ]
  },
  {
    id: "hindi",
    name: "Hindi (हिंदी)",
    color: "rose",
    chapters: [
      {
        id: "hi-bhai-sahab",
        title: "बड़े भाई साहब",
        notes: "### 1. पाठ का परिचय\nप्रेमचंद द्वारा लिखित यह कहानी बाल-मनोविज्ञान और शिक्षा व्यवस्था की खामियों को उजागर करती है। बड़ा भाई उम्र में बड़ा होने के कारण स्वयं को एक आदर्श रूप में प्रस्तुत करने की कोशिश में अपने बचपन को दबा देता है।",
        worksheet: [
          {
            id: "hi-hs1",
            question: "लेखक के बड़े भाई साहब उससे उम्र में कितने साल बड़े थे?",
            options: ["पाँच साल", "तीन साल", "दो साल", "चार साल"],
            correctAnswerIndex: 0,
            explanation: "लेखक के बड़े भाई साहब उनसे उम्र में पाँच साल बड़े थे, लेकिन पढ़ाई में केवल तीन दर्जे आगे थे। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "hi-diary",
        title: "डायरी का एक पन्ना",
        notes: "### 1. पाठ का परिचय\nसीताराम सेकसरिया द्वारा रचित यह पाठ 26 जनवरी 1931 के ऐतिहासिक दिन के कलकत्ता (कोलकाता) में स्वतंत्रता दिवस मनाने के जोश को दर्शाती है।",
        worksheet: [
          {
            id: "hi-hs2",
            question: "26 जनवरी 1930 को पूरे भारत में किस रूप में मनाया गया था?",
            options: ["प्रथम स्वतंत्रता दिवस के रूप में", "गणतंत्र दिवस के रूप में", "शहीद दिवस के रूप में", "कोलकाता मुक्ति दिवस के रूप में"],
            correctAnswerIndex: 0,
            explanation: "26 जनवरी 1930 को पूरे भारत में प्रथम स्वतंत्रता दिवस के रूप में घोषित किया गया था। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "hi-tatara",
        title: "तताँरा-वामीरो कथा",
        notes: "### 1. पाठ का परिचय\nलीलाधर मंडलोई द्वारा लिखित यह लोककथा अंडमान-निकोबार द्वीप समूह के एक छोटे से द्वीप पर आधारित है। यह पारंपरिक शत्रुता को समाप्त करने के लिए दो प्रेमियों के बलिदान की करुण गाथा है।",
        worksheet: [
          {
            id: "hi-hs3",
            question: "तताँरा की तलवार की क्या विशेषता मानी जाती थी?",
            options: ["वह लकड़ी की होने के बावजूद उसमें अद्भुत दैवीय शक्ति थी", "वह शुद्ध सोने की बनी हुई थी", "उससे वह कभी युद्ध नहीं हारता था", "वह लोहे की सबसे भारी तलवार थी"],
            correctAnswerIndex: 0,
            explanation: "तताँरा की तलवार लकड़ी की थी पर लोगों का मानना था कि उसमें कोई विलक्षण दैवीय शक्ति थी। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "hi-teesri-kasam",
        title: "तीसरी कसम के शिल्पकार शैलेन्द्र",
        notes: "### 1. पाठ का परिचय\nप्रहलाद अग्रवाल द्वारा रचित यह लेख फिल्म 'तीसरी कसम' और उसके गीतकार शैलेन्द्र के संवेनशील व्यक्तित्व पर प्रकाश डालता है। यह कलात्मक मूल्यों और व्यावसायिकता के अंतर्द्वंद्व को दिखाता है।",
        worksheet: [
          {
            id: "hi-hs4",
            question: "शिल्पकार शैलेन्द्र ने फिल्म 'तीसरी कसम' का निर्माण किसकी कहानी पर किया था?",
            options: ["फणीश्वरनाथ रेणु", "प्रेमचंद", "जयशंकर प्रसाद", "हरिशंकर परसाई"],
            correctAnswerIndex: 0,
            explanation: "फिल्म 'तीसरी कसम' फणीश्वरनाथ रेणु की अत्यंत प्रसिद्ध कहानी 'मारे गए गुलफाम' पर आधारित थी। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "hi-dukh",
        title: "अब कहाँ दूसरे के दुख से दुखी होने वाले",
        notes: "### 1. पाठ का परिचय\nनिदा फ़ाज़ली द्वारा रचित यह पाठ मनुष्य की बढ़ती स्वार्थपरता, शहरीकरण और पर्यावरण के विनाश पर चिंता व्यक्त करता है। इसमें पशु-पक्षियों के प्रति संवेदनशीलता को भी दर्शाया गया है।",
        worksheet: [
          {
            id: "hi-hs5",
            question: "सुलेमान की किस विशेषता का उल्लेख पाठ में किया गया है?",
            options: ["वह केवल मानवों ही नहीं, बल्कि पशु-पक्षियों के भी रखवाले और हमदर्द थे", "वह युद्ध कला में निपुण राजा थे", "वह बहुत अमीर व्यक्ति थे", "वह एक कड़े प्रशासक थे"],
            correctAnswerIndex: 0,
            explanation: "ग्रंथों के अनुसार सुलेमान केवल मनुष्यों के ही राजा नहीं थे, बल्कि वे छोटे-से-छोटे जीव-जंतुओं के प्रति भी अपार करुणा रखते थे। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "hi-pattiyan",
        title: "पतझर में टूटी पत्तियाँ",
        notes: "### 1. पाठ का परिचय\nरवींद्र केलेकर द्वारा लिखित इस पाठ में दो प्रसंग हैं—'गिन्नी का सोना' (व्यावहारिकता बनाम आदर्श) और 'झेन की देन' (जापान में मानसिक तनाव दूर करने की टी-सेरेमनी)।",
        worksheet: [
          {
            id: "hi-hs6",
            question: "'गिन्नी का सोना' प्रसंग में 'शुद्ध आदर्शों' की तुलना किससे की गई है?",
            options: ["शुद्ध सोने से", "ताँबे की मिलावट से", "गिन्नी के सोने से", "लोहे से"],
            correctAnswerIndex: 0,
            explanation: "'गिन्नी का सोना' में शुद्ध आदर्शों को शुद्ध सोने की तरह अमूल्य और चमकीला बताया गया है। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "hi-kartoos",
        title: "कारतूस",
        notes: "### 1. पाठ का परिचय\nहबीब तनवीर द्वारा लिखित यह एकांकी देशभक्त जाँबाज वज़ीर अली की बहादुरी पर आधारित है, जो अंग्रेजों की छावनी में घुसकर कर्नल की आँखों में धूल झोंककर कारतूस हासिल कर लेता है।",
        worksheet: [
          {
            id: "hi-hs7",
            question: "वज़ीर अली अंग्रेजों की छावनी में किस रूप में गया था?",
            options: ["सवार (घुड़सवार) बनकर अकेला", "अपने पूरे सैनिकों के दल के साथ", "एक भिखारी के भेष में", "व्यापारी बनकर"],
            correctAnswerIndex: 0,
            explanation: "वज़ीर अली अंग्रेजों के कर्नल की छावनी में अत्यंत निर्भीकता के साथ अकेला घुड़सवार बनकर घुसा था। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "hi-sakhi",
        title: "साखी – कबीर",
        notes: "### 1. पाठ का परिचय\nकबीर की साखियाँ (दोहे) व्यावहारिक ज्ञान, प्रेम, अहंकार के त्याग, और ईश्वर की सर्वव्यापकता को दर्शाती हैं।",
        worksheet: [
          {
            id: "hi-hs8",
            question: "कबीर के अनुसार मीठी वाणी बोलने से क्या प्रभाव पड़ता है?",
            options: ["मन को शांति और दूसरों को सुख की प्राप्ति होती है", "वाणी में भारीपन आता है", "मनुष्य की अमीरता का पता चलता है", "लोग डरने लगते हैं"],
            correctAnswerIndex: 0,
            explanation: "ऐसी वाणी बोलिए, मन का आपा खोइ, औरन को सीतल करै, आपहु सीतल होइ। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "hi-pada",
        title: "पद – मीराबाई",
        notes: "### 1. पाठ का परिचय\nमीराबाई के ये पद भगवान श्री कृष्ण के प्रति उनके अनन्य प्रेम, भक्ति, और समर्पण को प्रकट करते हैं। वे कृष्ण से अपनी रक्षा की गुहार लगाती हैं।",
        worksheet: [
          {
            id: "hi-hs9",
            question: "मीराबाई श्री कृष्ण की चाकरी (दासी बनकर सेवा) क्यों करना चाहती हैं?",
            options: ["ताकि वे रोज़ कृष्ण के दर्शन पा सकें और उनके गुण गा सकें", "ताकि उन्हें बहुत सा धन मिल सके", "ताकि वे महल में घूम सकें", "ताकि वे युद्ध में भाग ले सकें"],
            correctAnswerIndex: 0,
            explanation: "मीरा कृष्ण की दासी बनकर उनके लिए बाग लगाना चाहती हैं ताकि हर सुबह कृष्ण के दर्शन आसानी से पा सकें। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "hi-manushyata",
        title: "मनुष्यता – मैथिलीशरण गुप्त",
        notes: "### 1. पाठ का परिचय\nराष्ट्रकवि मैथिलीशरण गुप्त की यह कविता परोपकार, उदारता, और बंधुत्व की भावना को ही सच्ची मनुष्यता बताती है।",
        worksheet: [
          {
            id: "hi-hs10",
            question: "कवि के अनुसार 'सच्चा मनुष्य' कौन है?",
            options: ["जो दूसरों की भलाई के लिए जीता और मरता है", "जो बहुत धनी और प्रसिद्ध हो", "जो एकांत में केवल तपस्या करे", "जो अपने परिवार की चिंता करे"],
            correctAnswerIndex: 0,
            explanation: "गुप्त जी के अनुसार, 'वही मनुष्य है कि जो मनुष्य के लिए मरे'। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "hi-parvat",
        title: "पर्वत प्रदेश में पावस – सुमित्रानंदन पंत",
        notes: "### 1. पाठ का परिचय\nयह कविता वर्षा ऋतु में पर्वतीय अंचल के पल-पल बदलते रूप और उसकी जादुई सुंदरता का अत्यंत सजीव चित्रण करती है।",
        worksheet: [
          {
            id: "hi-hs11",
            question: "पर्वत की छाती से बहते हुए झरने किसके समान दिखाई दे रहे हैं?",
            options: ["मोतियों की सुंदर लड़ियों के समान", "सफ़ेद रेशमी धागों के समान", "चाँदी के विशाल तारों के समान", "फूलों की माला के समान"],
            correctAnswerIndex: 0,
            explanation: "पर्वतीय झरने झाग से भरे होने के कारण चमकते मोतियों की लड़ियों के समान आकर्षक लगते हैं। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "hi-topa",
        title: "तोप – वीरेंद्र मिश्र",
        notes: "### 1. पाठ का परिचय\nयह कविता 1857 के स्वतंत्रता संग्राम की एक तोप के माध्यम से याद दिलाती है कि अत्याचारी कितना भी शक्तिशाली हो, एक दिन उसका अंत निश्चित है।",
        worksheet: [
          {
            id: "hi-hs12",
            question: "ईस्ट इंडिया कंपनी की तोप को आज कहाँ प्रदर्शित किया गया है?",
            options: ["कस्बे के मुख्य प्रवेश द्वार पर (कंपनी बाग में)", "संग्रहालय के भीतर बंद कमरे में", "दिल्ली के लाल किले में", "स्कूल के मुख्य मैदान में"],
            correctAnswerIndex: 0,
            explanation: "ईस्ट इंडिया कंपनी द्वारा लाई गई यह ऐतिहासिक तोप कंपनी बाग के प्रवेश द्वार पर पर्यटकों को दिखाने के लिए सजाकर रखी गई है। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "hi-fida",
        title: "कर चले हम फ़िदा – कैफ़ी आज़मी",
        notes: "### 1. पाठ का परिचय\nफिल्म 'हकीकत' के इस प्रसिद्ध गीत में भारतीय सैनिकों की देशभक्ति, वीरता और देश पर मर मिटने के जज्बे को दर्शाया गया है।",
        worksheet: [
          {
            id: "hi-hs13",
            question: "सैनिक देशवासियों को देश की रक्षा की ज़िम्मेदारी किस रूप में सौंप रहे हैं?",
            options: ["यह कहकर कि अब देश तुम्हारे हवाले है", "यह कहकर कि युद्ध अब समाप्त हो गया", "यह कहकर कि वे घर वापस आ रहे हैं", "यह कहकर कि सब अपनी रक्षा स्वयं करें"],
            correctAnswerIndex: 0,
            explanation: "'कर चले हम फ़िदा जान-ओ-तन साथियों, अब तुम्हारे हवाले वतन साथियों'—सैनिक देश की बागडोर देशवासियों के हाथ में सौंपते हैं। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "hi-atmatran",
        title: "आत्मत्राण – रवीन्द्रनाथ ठाकुर",
        notes: "### 1. पाठ का परिचय\nयह प्रार्थना गीत ईश्वर से दुखों को दूर करने की नहीं, बल्कि उन दुखों और संकटों पर विजय पाने की शक्ति और साहस माँगने की प्रेरणा देता है।",
        worksheet: [
          {
            id: "hi-hs14",
            question: "कवि ईश्वर से क्या प्रार्थना कर रहा है?",
            options: ["वह जीवन के दुखों से कभी न डरे और उस पर विजय पाने का आत्मबल पाए", "कि ईश्वर उसके सारे कष्ट स्वयं ही दूर कर दे", "कि उसे बहुत सा धन मिल जाए", "कि उसके सारे शत्रु नष्ट हो जाएँ"],
            correctAnswerIndex: 0,
            explanation: "कवि ईश्वर से संकटों को हरने की नहीं, बल्कि उन संकटों का सामना करने की निर्भीकता माँगता है। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "hi-harihar-kaka",
        title: "हरिहर काका",
        notes: "### 1. पाठ का परिचय\nमिथिलेश्वर द्वारा रचित यह कहानी ग्रामीण जीवन में स्वार्थ, संपत्ति के लालच और धर्म के नाम पर होने वाले शोषण को उजागर करती है।",
        worksheet: [
          {
            id: "hi-hs15",
            question: "हरिहर काका अपनी ज़मीन-जायदाद किसके नाम नहीं लिखना चाहते थे?",
            options: ["ठाकुरबारी के महंत और अपने लालची भाइयों के नाम", "अपने बेटों के नाम", "गाँव के गरीब लोगों के नाम", "सरकार के नाम"],
            correctAnswerIndex: 0,
            explanation: "काका जानते थे कि जब तक ज़मीन उनके पास है, सभी उनका सम्मान करेंगे, संपत्ति हाथ से जाते ही वे बेसहारा हो जाएँगे। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "hi-sapno",
        title: "सपनों के-से दिन",
        notes: "### 1. पाठ का परिचय\nगुरदयाल सिंह द्वारा लिखित यह संस्मरण लेखक के बचपन, स्कूल के दिनों और उनके हेडमास्टर व सख्त पीटी सर प्रीतम चंद के चरित्र को दर्शाता है।",
        worksheet: [
          {
            id: "hi-hs16",
            question: "पीटी सर प्रीतम चंद स्कूल के बच्चों को किस बात के लिए सख्त सज़ा देते थे?",
            options: ["थोड़ी सी भी अनुशासनहीनता या होमवर्क न करने पर", "स्कूल देर से आने पर", "खेलों में भाग न लेने पर", "यूनिफॉर्म गंदी रखने पर"],
            correctAnswerIndex: 0,
            explanation: "पीटी सर अत्यंत सख्त मिजाज के थे और अनुशासनहीनता या अशुद्धियों पर बच्चों को निर्दयता से सजा देते थे। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "hi-topi-shukla",
        title: "टोपी शुक्ला",
        notes: "### 1. पाठ का परिचय\nराही मासूम रज़ा द्वारा लिखित यह कहानी दो अलग-अलग धर्मों के बच्चों (टोपी शुक्ला और इफ़्फ़न) के बीच की अटूट दोस्ती और पारिवारिक स्नेह की मार्मिक कहानी है।",
        worksheet: [
          {
            id: "hi-hs17",
            question: "टोपी शुक्ला को इफ़्फ़न के घर जाना क्यों बहुत अच्छा लगता था?",
            options: ["क्योंकि इफ़्फ़न की दादी से उसे अपार और निस्वार्थ स्नेह मिलता था", "क्योंकि वहाँ उसे स्वादिष्ट भोजन मिलता था", "क्योंकि वे दोनों वहाँ खिलौनों से खेलते थे", "क्योंकि इफ़्फ़न का घर बहुत बड़ा था"],
            correctAnswerIndex: 0,
            explanation: "इफ़्फ़न की दादी का प्यार टोपी के सूने जीवन को संबल प्रदान करता था, इसलिए वह हर समय दादी के पास बैठना पसंद करता था। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "hi-pad-parichay",
        title: "पद परिचय",
        notes: "### 1. व्याकरण - पद परिचय\nवाक्य में प्रयुक्त शब्द 'पद' कहलाते हैं। उनका व्याकरणिक परिचय (संज्ञा, सर्वनाम, विशेषण, क्रिया, लिंग, वचन, कारक) देना ही 'पद परिचय' है।",
        worksheet: [
          {
            id: "hi-hs18",
            question: "'मोहन स्कूल जाता है।' इस वाक्य में 'मोहन' शब्द का सही पद परिचय क्या होगा?",
            options: ["व्यक्तिवाचक संज्ञा, पुल्लिंग, एकवचन, कर्ता कारक", "जातिवाचक संज्ञा, स्त्रीलिंग, एकवचन, कर्म कारक", "सर्वनाम, पुल्लिंग, बहुवचन", "विशेषण, एकवचन"],
            correctAnswerIndex: 0,
            explanation: "'मोहन' एक व्यक्ति विशेष का नाम होने के कारण व्यक्तिवाचक संज्ञा है, पुल्लिंग और एकवचन है तथा क्रिया का कर्ता है। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "hi-vakya-rupantaran",
        title: "वाक्य रूपांतरण",
        notes: "### 1. वाक्य भेद और रूपांतरण\nरचना के आधार पर वाक्य के तीन भेदों (सरल, संयुक्त, मिश्र) का आपस में अर्थ बदले बिना बदलना वाक्य रूपांतरण कहलाता है।",
        worksheet: [
          {
            id: "hi-hs19",
            question: "'जैसे ही सूरज निकला, वैसे ही अँधेरा दूर हो गया।' यह रचना की दृष्टि से कौन सा वाक्य है?",
            options: ["मिश्र वाक्य", "सरल वाक्य", "संयुक्त वाक्य", "इच्छावाचक वाक्य"],
            correctAnswerIndex: 0,
            explanation: "'जैसे ही... वैसे ही' योजक शब्दों से जुड़े होने के कारण यह एक प्रधान और एक आश्रित उपवाक्य वाला मिश्र वाक्य है। (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "hi-muhavare",
        title: "मुहावरे",
        notes: "### 1. मुहावरे का अर्थ\nवे वाक्यांश जो अपने सामान्य अर्थ को छोड़कर किसी विशेष या लांशिक अर्थ को प्रकट करते हैं, मुहावरे कहलाते हैं। (जैसे - अक्ल पर पत्थर पड़ना)",
        worksheet: [
          {
            id: "hi-hs20",
            question: "'दाँतों तले उँगली दबाना' मुहावरे का सही अर्थ निम्नलिखित में से क्या है?",
            options: ["आश्चर्यचकित होना", "भूख लगना", "बहुत क्रोध करना", "दाँत दर्द होना"],
            correctAnswerIndex: 0,
            explanation: "इस मुहावरे का प्रयोग तब किया जाता है जब कोई किसी अद्भुत या असंभव कार्य को देखकर अत्यधिक हैरान रह जाता है। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "hi-samasa",
        title: "समास",
        notes: "### 1. समास का परिचय\nदो या दो से अधिक शब्दों को मिलाकर संक्षेप करने की प्रक्रिया समास कहलाती है।\n- अव्ययीभाव, तत्पुरुष, कर्मधारय, द्विगु, द्वंद्व, बहुव्रीहि समास।",
        worksheet: [
          {
            id: "hi-hs21",
            question: "'यथाशक्ति' शब्द में कौन सा समास प्रयुक्त हुआ है?",
            options: ["अव्ययीभाव समास", "तत्पुरुष समास", "द्वंद्व समास", "बहुव्रीहि समास"],
            correctAnswerIndex: 0,
            explanation: "पहला पद 'यथा' अव्यय और प्रधान होने के कारण यहाँ अव्ययीभाव समास (शक्ति के अनुसार) है। (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "hi-rachna",
        title: "रचनात्मक लेखन",
        notes: "### 1. रचनात्मक लेखन विधाएँ\n- औपचारिक पत्र लेखन (शिकायती, संपादकीय, व्यावसायिक)\n- सूचना लेखन (कम शब्दों में सटीक जानकारी)\n- विज्ञापन लेखन (आकर्षक और प्रभावपूर्ण)\n- लघु कथा या ईमेल लेखन",
        worksheet: [
          {
            id: "hi-hs22",
            question: "औपचारिक पत्र की शुरुआत में सबसे पहले क्या लिखा जाता है?",
            options: ["प्रेषक का पता और सेवा में / कार्यालयी संबोधन", "विषय का विस्तार", "सादर धन्यवाद और हस्ताक्षर", "बधाई संदेश"],
            correctAnswerIndex: 0,
            explanation: "औपचारिक पत्रों में शिष्टाचार के अनुसार प्रेषक का पता, तिथि और प्राप्तकर्ता अधिकारी का पद व पता लिखा जाता है। (CBSE Board 2023)"
          }
        ]
      }
    ]
  },
  {
    id: "french",
    name: "French",
    color: "sky",
    chapters: [
      {
        id: "fr-amis",
        title: "Retrouvons nos amis",
        notes: "### 1. Vocabulaire Clé\n- Retrouver: To meet again / reconnect.\n- Se saluer: To greet each other.\n\n### 2. Salutations standard\n- Salut ! / Bonjour !\n- Comment ça va ? / Ça va bien, merci.",
        worksheet: [
          {
            id: "fr-w1-1",
            question: "Comment dites-vous 'Nice to meet you' en français ?",
            options: ["Enchanté", "De rien", "S'il vous plaît", "Félicitations"],
            correctAnswerIndex: 0,
            explanation: "'Enchanté' is the standard French expression used to say 'Nice to meet you' or 'Delighted'. (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "fr-bac",
        title: "Après le bac",
        notes: "### 1. Future Tense (Le Futur Simple)\nUsed to describe plans after finishing high school (le baccalauréat).\n- Pattern: Infinitive + endings (-ai, -as, -a, -ons, -ez, -ont).",
        worksheet: [
          {
            id: "fr-w2-1",
            question: "Traduisez en français: 'Next year, I will study at the university.'",
            options: [
              "L'année prochaine, j'étudierai à l'université.",
              "L'année prochaine, j'étudie à l'université.",
              "L'année prochaine, j'ai étudié à l'université.",
              "L'année prochaine, je vais étudier à l'université."
            ],
            correctAnswerIndex: 0,
            explanation: "'j'étudierai' is the future simple form of 'étudier', which matches the translation perfectly. (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "fr-travail",
        title: "Chercher du travail",
        notes: "### 1. Vocabulaire Professionnel\n- Un emploi / un travail: A job.\n- Un CV (Curriculum Vitae): Resume.\n- Une lettre de motivation: Cover letter.",
        worksheet: [
          {
            id: "fr-w3",
            question: "Lequel des documents suivants est indispensable pour postuler à un emploi ?",
            options: ["Un CV et une lettre de motivation", "Un passeport", "Une carte d'identité scolaire", "Un livre de classe"],
            correctAnswerIndex: 0,
            explanation: "A CV and a motivation letter are standard files required for job applications in French. (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "fr-lire",
        title: "Le plaisir de lire",
        notes: "### 1. Expressions littéraires\n- Lire: To read.\n- Un roman: A novel.\n- Un auteur / un écrivain: An author/writer.",
        worksheet: [
          {
            id: "fr-w4",
            question: "Quel pronom relatif complète la phrase: 'Le livre _____ j'ai acheté est captivant' ?",
            options: ["que", "qui", "dont", "où"],
            correctAnswerIndex: 0,
            explanation: "'que' represents the direct object of the verb 'ai acheté' (I bought the book). (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "fr-medias",
        title: "Les médias",
        notes: "### 1. Les moyens d'information\n- Le journal, la télévision, la radio, l'internet.\n- Un journaliste, un article, un reportage.",
        worksheet: [
          {
            id: "fr-w5",
            question: "Quel média est principalement caractérisé par la diffusion de presse écrite imprimée ?",
            options: ["Le journal", "La radio", "La télévision", "L'internet"],
            correctAnswerIndex: 0,
            explanation: "'Le journal' represents the print media (newspaper) in French. (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "fr-gouts",
        title: "Chacun ses goûts",
        notes: "### 1. Exprimer ses préférences\n- Aimer, adorer, préférer, détester.\n- Les loisirs, les sports, le cinéma, la musique.",
        worksheet: [
          {
            id: "fr-w6",
            question: "Complétez avec le pronom correct: 'J'aime le chocolat, je _____ mange souvent.'",
            options: ["en", "y", "le", "la"],
            correctAnswerIndex: 0,
            explanation: "We use 'en' to replace nouns introduced by a partitive article (du chocolat). (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "fr-forme",
        title: "En pleine forme",
        notes: "### 1. La Santé et le Sport\n- Faire du sport, manger sainement, se détendre.\n- Être en bonne santé, avoir mal à la tête/gorge.",
        worksheet: [
          {
            id: "fr-w7",
            question: "Quelle expression exprime le fait d'avoir une excellente santé physique ?",
            options: ["Être en pleine forme", "Avoir de la fièvre", "Être fatigué", "Aller chez le médecin"],
            correctAnswerIndex: 0,
            explanation: "'Être en pleine forme' means to be in great shape or fully healthy. (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "fr-env",
        title: "L’environnement",
        notes: "### 1. Protection de la nature\n- Protéger la planète, recycler les déchets, économiser l'eau.\n- Le réchauffement climatique, la pollution.",
        worksheet: [
          {
            id: "fr-w8",
            question: "Que peut-on faire pour protéger l'environnement au quotidien ?",
            options: ["Recycler les déchets and économiser l'eau", "Jeter du plastique dans les rivières", "Gaspiller l'énergie", "Couper tous les arbres"],
            correctAnswerIndex: 0,
            explanation: "Recycling and saving water are key daily green habits. (CBSE Board 2024)"
          }
        ]
      },
      {
        id: "fr-metro",
        title: "Métro, boulot, dodo",
        notes: "### 1. La vie quotidienne active\n- Prendre le métro, aller au bureau, dormir.\n- Gérer le stress du quotidien, trouver un équilibre.",
        worksheet: [
          {
            id: "fr-w9",
            question: "Que signifie l'expression familière française 'Métro, boulot, dodo' ?",
            options: ["La routine quotidienne métro-travail-sommeil", "Des vacances à la mer", "Un voyage de noces", "Une fête d'anniversaire"],
            correctAnswerIndex: 0,
            explanation: "This expression describes the repetitive daily grind of modern urban life. (CBSE Board 2023)"
          }
        ]
      },
      {
        id: "fr-republique",
        title: "Vive la République !",
        notes: "### 1. Les symboles de la France\n- La fête nationale: 14 juillet.\n- La devise: Liberté, Égalité, Fraternité.\n- L'hymne national: La Marseillaise.",
        worksheet: [
          {
            id: "fr-w10",
            question: "Quelle est la date de la Fête Nationale en France ?",
            options: ["Le 14 juillet", "Le 4 juillet", "Le 1er mai", "Le 25 décembre"],
            correctAnswerIndex: 0,
            explanation: "Bastille Day (French National Day) is celebrated annually on the 14th of July. (CBSE Board 2024)"
          }
        ]
      }
    ]
  }
];

export const CBSE_QUESTIONS: Question[] = [

  // Let's create a healthy pool of diagnostic test questions with topic and year fields
  {
    id: "poly-q1",
    question: "If a quadratic polynomial p(x) has zeroes at -2 and 5, which of the following is correct?",
    options: ["x² - 3x - 10", "x² + 3x - 10", "x² - 3x + 10", "x² + 3x + 10"],
    correctAnswerIndex: 0,
    explanation: "Sum of zeroes = -2 + 5 = 3. Product = -2 * 5 = -10. Equation is x² - (sum)x + (product) = x² - 3x - 10.",
    chapterId: "polynomials",
    subjectId: "mathematics",
    topic: "Syllabus Zeroes Relation",
    year: "CBSE Board 2023"
  },
  {
    id: "quad-q1",
    question: "Which of the following quadratic equations has two equal real roots?",
    options: ["x² - 4x + 4 = 0", "x² - 4x - 4 = 0", "x² + 2x + 5 = 0", "x² - x + 1 = 0"],
    correctAnswerIndex: 0,
    explanation: "For x² - 4x + 4 = 0, D = (-4)² - 4(1)(4) = 16 - 16 = 0, which implies two real equal roots.",
    chapterId: "quadratic-equations",
    subjectId: "mathematics",
    topic: "Roots discriminant",
    year: "CBSE Board 2022"
  },
  {
    id: "chem-q1",
    question: "When Ferrous Sulphate crystals are heated in a dry test tube, what color shift occurs?",
    options: ["Green to white/brown", "Blue to yellow", "Colourless to black", "No change"],
    correctAnswerIndex: 0,
    explanation: "Ferrous sulphate heptahydrate (FeSO4 · 7H2O) crystals are green. On heating, they lose water of crystallization and decompose into reddish-brown Fe2O3. (CBSE Board 2020)",
    chapterId: "chem-reactions",
    subjectId: "science",
    topic: "Thermal Decomposition",
    year: "CBSE Board 2020"
  },
  {
    id: "h-q1",
    question: "Who designed the iconic allegorical painting of female figure 'Germania' in 1848 representating German nationhood?",
    options: ["Philip Veit", "Giuseppe Mazzini", "Frederic Sorrieu", "Lorenzo Ghiberti"],
    correctAnswerIndex: 0,
    explanation: "Philip Veit painted Germania on a cotton banner, representing the assembly in St. Paul's Church. (CBSE Board 2019)",
    chapterId: "nat-europe",
    subjectId: "social-science",
    topic: "Visual Representations of Nationalism",
    year: "CBSE Board 2019"
  },
  {
    id: "light-q1",
    question: "An object is placed at a distance of 10 cm in front of a concave mirror of focal length 15 cm. Find the nature of the image.",
    options: ["Virtual, erect and magnified", "Real, inverted and diminished", "Real, inverted and magnified", "Virtual, erect and diminished"],
    correctAnswerIndex: 0,
    explanation: "Since the object distance (10 cm) is less than the focal length (15 cm), the object is between pole P and focus F, yielding a virtual, erect, and magnified image. (CBSE Board 2021)",
    chapterId: "light-reflection",
    subjectId: "science",
    topic: "Mirror Ray Diagrams",
    year: "CBSE Board 2021"
  }
];

export interface DailyQuiz {
  id: string;
  date: string;
  questions: Question[];
}

export const DAILY_QUIZZES: DailyQuiz[] = [
  {
    id: "dq-day1",
    date: "Day 1 - Revision Kickoff",
    questions: [
      {
        id: "dq1-q1",
        question: "When dry HCl gas is passed over dry litmus paper, what change in color is observed?",
        options: ["Turns red", "Turns blue", "No change in color", "Turns green"],
        correctAnswerIndex: 2,
        explanation: "Dry HCl gas does not dissociate into H+ ions in the absolute absence of water. Thus, it displays no acidic behavior and fails to change the color of dry litmus. (CBSE Board 2020)",
        chapterId: "acids-bases",
        subjectId: "science",
        topic: "Acidic properties",
        year: "CBSE Board 2020"
      },
      {
        id: "dq1-q2",
        question: "Find the HCF of the smallest prime number and the smallest composite number.",
        options: ["1", "2", "4", "6"],
        correctAnswerIndex: 1,
        explanation: "Smallest prime number is 2. Smallest composite number is 4. HCF(2, 4) = 2. (CBSE Board 2018)",
        chapterId: "real-numbers",
        subjectId: "mathematics",
        topic: "HCF Calculation",
        year: "CBSE Board 2018"
      },
      {
        id: "dq1-q3",
        question: "Why did Lencho require exactly one hundred pesos from God?",
        options: ["To buy a brand new vehicle", "To sow his field again and to live until the next harvest comes", "To travel to the capital", "To rebuild his home's roof"],
        correctAnswerIndex: 1,
        explanation: "His complete maize corn crop was destroyed by severe hailstorms, requiring money to sustain his family. (CBSE Board 2019)",
        chapterId: "letter-god",
        subjectId: "english",
        topic: "Story comprehension",
        year: "CBSE Board 2019"
      }
    ]
  },
  {
    id: "dq-day2",
    date: "Day 2 - Board Target Prep",
    questions: [
      {
        id: "dq2-q1",
        question: "What is the common ratio (common difference) of an AP whose nth term is a_n = 3n + 7?",
        options: ["3", "7", "10", "1"],
        correctAnswerIndex: 0,
        explanation: "a_1 = 3(1)+7 = 10. a_2 = 3(2)+7 = 13. d = a_2 - a_1 = 13 - 10 = 3. (CBSE Board 2021)",
        chapterId: "arithmetic-progressions",
        subjectId: "mathematics",
        topic: "AP nth term",
        year: "CBSE Board 2021"
      },
      {
        id: "dq2-q2",
        question: "Which of the following describes the key function of human respiratory alveoli?",
        options: ["Filter dust out from air", "Provide immense surface area for gas exchange", "Produce mucus security", "Pumping deoxygenated blood"],
        correctAnswerIndex: 1,
        explanation: "Balloon-like structures called alveoli provide a massive, thin surface area for the diffusion of CO2 and O2 gases. (CBSE Board 2021)",
        chapterId: "life-processes",
        subjectId: "science",
        topic: "Respiratory structures",
        year: "CBSE Board 2021"
      },
      {
        id: "dq2-q3",
        question: "Which list of subjects includes Education, Forest, Trade Unions, and Marriage in India?",
        options: ["Union List", "State List", "Concurrent List", "Residual Powers list"],
        correctAnswerIndex: 2,
        explanation: "Concurrent List covers these items because they hold shared interest for both central policies and individual states. (CBSE Board 2022)",
        chapterId: "federalism",
        subjectId: "social-science",
        topic: "Constitutional Lists",
        year: "CBSE Board 2022"
      }
    ]
  }
];

