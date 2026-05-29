import { useState, useRef } from 'react';
import { Database, Terminal, CheckCircle, Play, Search, ArrowLeft, ChevronDown, ChevronRight, Zap, PlayCircle, Columns, Table } from 'lucide-react';
import alasql from 'alasql';

// Curated 7 Category 68 SQL Placement Questions Database
const SQL_CATEGORIES = [
  "Basic SELECT Queries",
  "Joins",
  "Aggregate Functions",
  "GROUP BY & HAVING",
  "Subqueries",
  "Window Functions",
  "Advanced SQL"
];

const SQL_PROBLEMS = {
  "Basic SELECT Queries": [
    {
      id: 1,
      title: "Recyclable and Low Fat Products",
      concept: "WHERE clause",
      difficulty: "Easy",
      description: "Write a solution to find the ids of products that are both low fat and recyclable.",
      schema: {
        Products: [
          { name: "product_id", type: "INT" },
          { name: "low_fats", type: "VARCHAR(1)" },
          { name: "recyclable", type: "VARCHAR(1)" }
        ]
      },
      mockData: {
        Products: [
          { product_id: 0, low_fats: 'Y', recyclable: 'N' },
          { product_id: 1, low_fats: 'Y', recyclable: 'Y' },
          { product_id: 2, low_fats: 'N', recyclable: 'Y' },
          { product_id: 3, low_fats: 'Y', recyclable: 'Y' },
          { product_id: 4, low_fats: 'N', recyclable: 'N' }
        ]
      },
      boilerplate: "SELECT product_id \nFROM Products \nWHERE low_fats = 'Y' AND recyclable = 'Y';",
      optimalSolution: "SELECT product_id FROM Products WHERE low_fats = 'Y' AND recyclable = 'Y';",
      explanation: "A simple WHERE clause filtering rows where low_fats is 'Y' and recyclable is 'Y'.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)"
    },
    {
      id: 2,
      title: "Find Customer Referee",
      concept: "NULL handling",
      difficulty: "Easy",
      description: "Find the names of the customers that are not referred by the customer with id = 2.",
      schema: {
        Customer: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" },
          { name: "referee_id", type: "INT" }
        ]
      },
      mockData: {
        Customer: [
          { id: 1, name: 'Will', referee_id: null },
          { id: 2, name: 'Jane', referee_id: null },
          { id: 3, name: 'Alex', referee_id: 2 },
          { id: 4, name: 'Bill', referee_id: null },
          { id: 5, name: 'Zack', referee_id: 1 },
          { id: 6, name: 'Mark', referee_id: 2 }
        ]
      },
      boilerplate: "SELECT name \nFROM Customer \nWHERE referee_id != 2 OR referee_id IS NULL;",
      optimalSolution: "SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL;",
      explanation: "SQL uses three-valued logic. Evaluating referee_id != 2 returns UNKNOWN for NULL values. We must explicitly check IS NULL.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)"
    },
    {
      id: 3,
      title: "Big Countries",
      concept: "Multiple conditions",
      difficulty: "Easy",
      description: "A country is big if it has an area of at least 3 million sq km or a population of at least 25 million. Find the name, population, and area of big countries.",
      schema: {
        World: [
          { name: "name", type: "VARCHAR(50)" },
          { name: "continent", type: "VARCHAR(50)" },
          { name: "area", type: "INT" },
          { name: "population", type: "INT" },
          { name: "gdp", type: "BIGINT" }
        ]
      },
      mockData: {
        World: [
          { name: 'Afghanistan', continent: 'Asia', area: 652230, population: 25500100, gdp: 20343000000 },
          { name: 'Albania', continent: 'Europe', area: 28748, population: 2831741, gdp: 12960000000 },
          { name: 'Algeria', continent: 'Africa', area: 2381741, population: 37100000, gdp: 188681000000 },
          { name: 'Andorra', continent: 'Europe', area: 468, population: 78115, gdp: 3712000000 },
          { name: 'Angola', continent: 'Africa', area: 1246700, population: 20609294, gdp: 100990000000 }
        ]
      },
      boilerplate: "SELECT name, population, area \nFROM World \nWHERE area >= 3000000 OR population >= 25000000;",
      optimalSolution: "SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000;",
      explanation: "Applies simple compound conditions combined via the logical OR operator.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)"
    },
    {
      id: 4,
      title: "Article Views I",
      concept: "DISTINCT",
      difficulty: "Easy",
      description: "Find all the authors that viewed at least one of their own articles. Return the result table sorted by id in ascending order.",
      schema: {
        Views: [
          { name: "article_id", type: "INT" },
          { name: "author_id", type: "INT" },
          { name: "viewer_id", type: "INT" },
          { name: "view_date", type: "DATE" }
        ]
      },
      mockData: {
        Views: [
          { article_id: 1, author_id: 3, viewer_id: 5, view_date: '2019-08-01' },
          { article_id: 1, author_id: 3, viewer_id: 6, view_date: '2019-08-02' },
          { article_id: 2, author_id: 7, viewer_id: 7, view_date: '2019-08-01' },
          { article_id: 2, author_id: 7, viewer_id: 6, view_date: '2019-08-02' },
          { article_id: 4, author_id: 7, viewer_id: 1, view_date: '2019-07-22' },
          { article_id: 3, author_id: 4, viewer_id: 4, view_date: '2019-07-21' },
          { article_id: 3, author_id: 4, viewer_id: 4, view_date: '2019-07-21' }
        ]
      },
      boilerplate: "SELECT DISTINCT author_id AS id \nFROM Views \nWHERE author_id = viewer_id \nORDER BY id ASC;",
      optimalSolution: "SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY author_id ASC;",
      explanation: "Query rows where viewer_id matches author_id, deduct duplicate entries using DISTINCT, and sort ascending.",
      timeComplexity: "O(N log N) sorting",
      spaceComplexity: "O(N)"
    },
    {
      id: 5,
      title: "Invalid Tweets",
      concept: "String length",
      difficulty: "Easy",
      description: "Write a solution to find the IDs of the invalid tweets. A tweet is invalid if the number of characters used in the content of the tweet is strictly greater than 15.",
      schema: {
        Tweets: [
          { name: "tweet_id", type: "INT" },
          { name: "content", type: "VARCHAR(255)" }
        ]
      },
      mockData: {
        Tweets: [
          { tweet_id: 1, content: 'Vote for GED' },
          { tweet_id: 2, content: 'Let us make coding extremely accessible to all placement candidates' }
        ]
      },
      boilerplate: "SELECT tweet_id \nFROM Tweets \nWHERE LENGTH(content) > 15;",
      optimalSolution: "SELECT tweet_id FROM Tweets WHERE LENGTH(content) > 15;",
      explanation: "Utilizes the built-in LENGTH() function (or CHAR_LENGTH()) to filter string counts.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)"
    },
    {
      id: 6,
      title: "Customers Not Referred by ID 2",
      concept: "Filtering",
      difficulty: "Easy",
      description: "Write a solution to report the IDs of customers who were not referred by the customer with ID = 2.",
      schema: {
        Customer: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" },
          { name: "referee_id", type: "INT" }
        ]
      },
      mockData: {
        Customer: [
          { id: 1, name: 'Will', referee_id: null },
          { id: 2, name: 'Jane', referee_id: null },
          { id: 3, name: 'Alex', referee_id: 2 },
          { id: 4, name: 'Bill', referee_id: null },
          { id: 5, name: 'Zack', referee_id: 1 }
        ]
      },
      boilerplate: "SELECT id \nFROM Customer \nWHERE referee_id != 2 OR referee_id IS NULL;",
      optimalSolution: "SELECT id FROM Customer WHERE referee_id != 2 OR referee_id IS NULL;",
      explanation: "Equivalent to Referee lookup, selecting ID instead of name. Checks for non-match and null values safely.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)"
    },
    {
      id: 7,
      title: "Employee Names",
      concept: "ORDER BY",
      difficulty: "Easy",
      description: "Write a solution to report the names and salaries of all employees, ordered by salary descending, and then by employee name ascending.",
      schema: {
        Employees: [
          { name: "employee_id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" },
          { name: "salary", type: "INT" }
        ]
      },
      mockData: {
        Employees: [
          { employee_id: 1, name: 'Mona', salary: 60000 },
          { employee_id: 2, name: 'Abe', salary: 75000 },
          { employee_id: 3, name: 'Karl', salary: 60000 },
          { employee_id: 4, name: 'Judy', salary: 90000 }
        ]
      },
      boilerplate: "SELECT name, salary \nFROM Employees \nORDER BY salary DESC, name ASC;",
      optimalSolution: "SELECT name, salary FROM Employees ORDER BY salary DESC, name ASC;",
      explanation: "Applies ORDER BY with multiple parameters, prioritizing salary and falling back to alphabetical naming.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(1)"
    },
    {
      id: 8,
      title: "Fix Names in a Table",
      concept: "String functions",
      difficulty: "Easy",
      description: "Fix the names so that only the first character is uppercase and the rest are lowercase. Return the result table ordered by user_id.",
      schema: {
        Users: [
          { name: "user_id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" }
        ]
      },
      mockData: {
        Users: [
          { user_id: 1, name: 'aLICE' },
          { user_id: 2, name: 'bOB' }
        ]
      },
      boilerplate: "SELECT user_id, \n  CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name, 2))) AS name \nFROM Users \nORDER BY user_id;",
      optimalSolution: "SELECT user_id, CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name, 2))) AS name FROM Users ORDER BY user_id;",
      explanation: "Combines UPPER on the first letter, LOWER on the remainder, and stitches them back using CONCAT.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 9,
      title: "Find Users With Valid Emails",
      concept: "REGEX",
      difficulty: "Medium",
      description: "Write a solution to find the users who have valid emails. A valid email has a prefix name and a domain '@leetcode.com'. The prefix name must start with a letter and can contain letters, digits, underscore, period, or dash.",
      schema: {
        Users: [
          { name: "user_id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" },
          { name: "mail", type: "VARCHAR(100)" }
        ]
      },
      mockData: {
        Users: [
          { user_id: 1, name: 'Winston', mail: 'winston@leetcode.com' },
          { user_id: 2, name: 'Jonathan', mail: 'jonathanisgreat' },
          { user_id: 3, name: 'Annabelle', mail: 'bella-r@leetcode.com' },
          { user_id: 4, name: 'Sally', mail: 'sally.12_a-@leetcode.com' },
          { user_id: 5, name: 'Marwan', mail: 'quarz#2020@leetcode.com' },
          { user_id: 6, name: 'David', mail: 'david69@gmail.com' }
        ]
      },
      boilerplate: "SELECT user_id, name, mail \nFROM Users \nWHERE mail REGEXP '^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\\\\.com$';",
      optimalSolution: "SELECT user_id, name, mail FROM Users WHERE mail REGEXP '^[a-zA-Z][a-zA-Z0-9_.-]*@leetcode\\\\.com$';",
      explanation: "Applies standard regular expression patterns verifying character lists, domains, and starting conditions.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)"
    },
    {
      id: 10,
      title: "Patients With a Condition",
      concept: "LIKE operator",
      difficulty: "Easy",
      description: "Write a solution to find the patient_id, patient_name, and conditions of the patients who have Type I Diabetes. Type I Diabetes always starts with DIAB1 prefix.",
      schema: {
        Patients: [
          { name: "patient_id", type: "INT" },
          { name: "patient_name", type: "VARCHAR(50)" },
          { name: "conditions", type: "VARCHAR(255)" }
        ]
      },
      mockData: {
        Patients: [
          { patient_id: 1, patient_name: 'Daniel', conditions: 'YOB DIAB100 MYOP' },
          { patient_id: 2, patient_name: 'Alice', conditions: '' },
          { patient_id: 3, patient_name: 'Bob', conditions: 'DIAB100 MYOP' },
          { patient_id: 4, patient_name: 'George', conditions: 'ACNE DIAB201' }
        ]
      },
      boilerplate: "SELECT patient_id, patient_name, conditions \nFROM Patients \nWHERE conditions LIKE 'DIAB1%' OR conditions LIKE '% DIAB1%';",
      optimalSolution: "SELECT patient_id, patient_name, conditions FROM Patients WHERE conditions LIKE 'DIAB1%' OR conditions LIKE '% DIAB1%';",
      explanation: "Regex or LIKE operator checking for DIAB1 starting words. The pattern checks both if it's the first word, or if it appears in later words preceded by a space.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)"
    }
  ],
  "Joins": [
    {
      id: 11,
      title: "Replace Employee ID With The Unique Identifier",
      concept: "LEFT JOIN",
      difficulty: "Easy",
      description: "Show the unique ID of each user. If a user does not have a unique ID replace it with null.",
      schema: {
        Employees: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" }
        ],
        EmployeeUNI: [
          { name: "id", type: "INT" },
          { name: "unique_id", type: "INT" }
        ]
      },
      mockData: {
        Employees: [
          { id: 1, name: 'Alice' },
          { id: 7, name: 'Bob' },
          { id: 11, name: 'Meir' }
        ],
        EmployeeUNI: [
          { id: 3, unique_id: 40 },
          { id: 11, unique_id: 99 }
        ]
      },
      boilerplate: "SELECT u.unique_id, e.name \nFROM Employees e \nLEFT JOIN EmployeeUNI u ON e.id = u.id;",
      optimalSolution: "SELECT u.unique_id, e.name FROM Employees e LEFT JOIN EmployeeUNI u ON e.id = u.id;",
      explanation: "Applies a LEFT JOIN so that all employees are included, matching existing unique IDs and filling missing values with NULL.",
      timeComplexity: "O(N + M)",
      spaceComplexity: "O(N)"
    },
    {
      id: 12,
      title: "Product Sales Analysis I",
      concept: "INNER JOIN",
      difficulty: "Easy",
      description: "Write a solution to report the product_name, year, and price for each sale_id in the Sales table.",
      schema: {
        Sales: [
          { name: "sale_id", type: "INT" },
          { name: "product_id", type: "INT" },
          { name: "year", type: "INT" },
          { name: "quantity", type: "INT" },
          { name: "price", type: "INT" }
        ],
        Product: [
          { name: "product_id", type: "INT" },
          { name: "product_name", type: "VARCHAR(50)" }
        ]
      },
      mockData: {
        Sales: [
          { sale_id: 1, product_id: 100, year: 2008, quantity: 10, price: 5000 },
          { sale_id: 2, product_id: 100, year: 2009, quantity: 12, price: 5000 }
        ],
        Product: [
          { product_id: 100, product_name: 'Nokia' },
          { product_id: 200, product_name: 'Apple' }
        ]
      },
      boilerplate: "SELECT p.product_name, s.year, s.price \nFROM Sales s \nINNER JOIN Product p ON s.product_id = p.product_id;",
      optimalSolution: "SELECT p.product_name, s.year, s.price FROM Sales s INNER JOIN Product p ON s.product_id = p.product_id;",
      explanation: "Standard INNER JOIN mapping Sales records to their corresponding product titles.",
      timeComplexity: "O(Sales + Products)",
      spaceComplexity: "O(Sales)"
    },
    {
      id: 13,
      title: "Customer Who Visited but Did Not Make Transactions",
      concept: "LEFT JOIN + NULL",
      difficulty: "Medium",
      description: "Find the IDs of the users who visited without making any transactions, and the number of times they made these visits.",
      schema: {
        Visits: [
          { name: "visit_id", type: "INT" },
          { name: "customer_id", type: "INT" }
        ],
        Transactions: [
          { name: "transaction_id", type: "INT" },
          { name: "visit_id", type: "INT" },
          { name: "amount", type: "INT" }
        ]
      },
      mockData: {
        Visits: [
          { visit_id: 1, customer_id: 23 },
          { visit_id: 2, customer_id: 9 },
          { visit_id: 5, customer_id: 54 }
        ],
        Transactions: [
          { transaction_id: 2, visit_id: 5, amount: 300 }
        ]
      },
      boilerplate: "SELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans \nFROM Visits v \nLEFT JOIN Transactions t ON v.visit_id = t.visit_id \nWHERE t.transaction_id IS NULL \nGROUP BY v.customer_id;",
      optimalSolution: "SELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans FROM Visits v LEFT JOIN Transactions t ON v.visit_id = t.visit_id WHERE t.transaction_id IS NULL GROUP BY v.customer_id;",
      explanation: "Combines LEFT JOIN with a NULL filter to identify visits with no matching transactions, counting groups via customer_id.",
      timeComplexity: "O(Visits + Trans)",
      spaceComplexity: "O(Customers)"
    },
    {
      id: 14,
      title: "Employee Bonus",
      concept: "LEFT JOIN",
      difficulty: "Easy",
      description: "Report the name and bonus amount of each employee with a bonus less than 1000 or missing a bonus entirely.",
      schema: {
        Employee: [
          { name: "empId", type: "INT" },
          { name: "name", type: "VARCHAR(50)" },
          { name: "salary", type: "INT" }
        ],
        Bonus: [
          { name: "empId", type: "INT" },
          { name: "bonus", type: "INT" }
        ]
      },
      mockData: {
        Employee: [
          { empId: 1, name: 'John', salary: 1000 },
          { empId: 2, name: 'Dan', salary: 2000 },
          { empId: 3, name: 'Thomas', salary: 3000 }
        ],
        Bonus: [
          { empId: 2, bonus: 500 }
        ]
      },
      boilerplate: "SELECT e.name, b.bonus \nFROM Employee e \nLEFT JOIN Bonus b ON e.empId = b.empId \nWHERE b.bonus < 1000 OR b.bonus IS NULL;",
      optimalSolution: "SELECT e.name, b.bonus FROM Employee e LEFT JOIN Bonus b ON e.empId = b.empId WHERE b.bonus < 1000 OR b.bonus IS NULL;",
      explanation: "Left joins Employee with Bonus, explicitly handling null values for employees that did not receive bonuses.",
      timeComplexity: "O(Employees + Bonuses)",
      spaceComplexity: "O(Employees)"
    },
    {
      id: 15,
      title: "Students and Examinations",
      concept: "CROSS JOIN",
      difficulty: "Medium",
      description: "Find the number of times each student attended each exam. Order by student_id and subject_name.",
      schema: {
        Students: [
          { name: "student_id", type: "INT" },
          { name: "student_name", type: "VARCHAR(50)" }
        ],
        Subjects: [
          { name: "subject_name", type: "VARCHAR(50)" }
        ],
        Examinations: [
          { name: "student_id", type: "INT" },
          { name: "subject_name", type: "VARCHAR(50)" }
        ]
      },
      mockData: {
        Students: [
          { student_id: 1, student_name: 'Alice' },
          { student_id: 2, student_name: 'Bob' }
        ],
        Subjects: [
          { subject_name: 'Math' },
          { subject_name: 'Physics' }
        ],
        Examinations: [
          { student_id: 1, subject_name: 'Math' },
          { student_id: 1, subject_name: 'Math' },
          { student_id: 2, subject_name: 'Physics' }
        ]
      },
      boilerplate: "SELECT s.student_id, s.student_name, sub.subject_name, \n  COUNT(e.student_id) AS attended_exams \nFROM Students s \nCROSS JOIN Subjects sub \nLEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name \nGROUP BY s.student_id, s.student_name, sub.subject_name \nORDER BY s.student_id, sub.subject_name;",
      optimalSolution: "SELECT s.student_id, s.student_name, sub.subject_name, COUNT(e.student_id) AS attended_exams FROM Students s CROSS JOIN Subjects sub LEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name GROUP BY s.student_id, s.student_name, sub.subject_name ORDER BY s.student_id, sub.subject_name;",
      explanation: "Performs a CROSS JOIN between Students and Subjects to establish the Cartesian product of all possible pairings, then LEFT JOINs on Examinations.",
      timeComplexity: "O(S * Sub + Exams)",
      spaceComplexity: "O(S * Sub)"
    },
    {
      id: 16,
      title: "Managers with at Least 5 Direct Reports",
      concept: "SELF JOIN",
      difficulty: "Medium",
      description: "Write a solution to find managers who have at least 5 direct reports.",
      schema: {
        Employee: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" },
          { name: "department", type: "VARCHAR(50)" },
          { name: "managerId", type: "INT" }
        ]
      },
      mockData: {
        Employee: [
          { id: 101, name: 'John', department: 'A', managerId: null },
          { id: 102, name: 'Dan', department: 'A', managerId: 101 },
          { id: 103, name: 'James', department: 'A', managerId: 101 },
          { id: 104, name: 'Amy', department: 'A', managerId: 101 },
          { id: 105, name: 'Anne', department: 'A', managerId: 101 },
          { id: 106, name: 'Ron', department: 'A', managerId: 101 }
        ]
      },
      boilerplate: "SELECT m.name \nFROM Employee e \nINNER JOIN Employee m ON e.managerId = m.id \nGROUP BY m.id, m.name \nHAVING COUNT(e.id) >= 5;",
      optimalSolution: "SELECT m.name FROM Employee e INNER JOIN Employee m ON e.managerId = m.id GROUP BY m.id, m.name HAVING COUNT(e.id) >= 5;",
      explanation: "Self-joins the employee table to map direct reports to manager profiles, filtering managers via HAVING counts.",
      timeComplexity: "O(N^2)",
      spaceComplexity: "O(N)"
    },
    {
      id: 17,
      title: "Confirmation Rate",
      concept: "JOIN + Aggregation",
      difficulty: "Medium",
      description: "Find the confirmation rate of each user (total confirmed messages divided by total requested messages). Missing requests are treated as 0.00.",
      schema: {
        Signups: [
          { name: "user_id", type: "INT" },
          { name: "time_stamp", type: "TIMESTAMP" }
        ],
        Confirmations: [
          { name: "user_id", type: "INT" },
          { name: "time_stamp", type: "TIMESTAMP" },
          { name: "action", type: "VARCHAR(10)" }
        ]
      },
      mockData: {
        Signups: [
          { user_id: 3, time_stamp: '2020-03-21 10:16:13' },
          { user_id: 7, time_stamp: '2020-01-04 13:57:59' }
        ],
        Confirmations: [
          { user_id: 3, time_stamp: '2021-01-06 03:30:46', action: 'timeout' },
          { user_id: 3, time_stamp: '2021-01-07 19:37:56', action: 'confirmed' }
        ]
      },
      boilerplate: "SELECT s.user_id, \n  ROUND(COUNT(CASE WHEN c.action = 'confirmed' THEN 1 END) * 1.0 / COALESCE(NULLIF(COUNT(c.user_id), 0), 1), 2) AS confirmation_rate \nFROM Signups s \nLEFT JOIN Confirmations c ON s.user_id = c.user_id \nGROUP BY s.user_id;",
      optimalSolution: "SELECT s.user_id, ROUND(COUNT(CASE WHEN c.action = 'confirmed' THEN 1 END) * 1.0 / COALESCE(NULLIF(COUNT(c.user_id), 0), 1), 2) AS confirmation_rate FROM Signups s LEFT JOIN Confirmations c ON s.user_id = c.user_id GROUP BY s.user_id;",
      explanation: "Applies a LEFT JOIN from Signups to Confirmations, and performs division using standard ROUND, CASE, and COUNT handlers.",
      timeComplexity: "O(S + C)",
      spaceComplexity: "O(S)"
    },
    {
      id: 18,
      title: "The Number of Employees Which Report to Each Employee",
      concept: "SELF JOIN",
      difficulty: "Medium",
      description: "Write a solution to report the ids, names, direct reports count, and average age of direct reports (rounded to nearest integer).",
      schema: {
        Employees: [
          { name: "employee_id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" },
          { name: "reports_to", type: "INT" },
          { name: "age", type: "INT" }
        ]
      },
      mockData: {
        Employees: [
          { employee_id: 9, name: 'Hercy', reports_to: null, age: 43 },
          { employee_id: 6, name: 'Alice', reports_to: 9, age: 41 },
          { employee_id: 4, name: 'Bob', reports_to: 9, age: 36 }
        ]
      },
      boilerplate: "SELECT m.employee_id, m.name, \n  COUNT(e.employee_id) AS reports_count, \n  ROUND(AVG(e.age)) AS average_age \nFROM Employees e \nINNER JOIN Employees m ON e.reports_to = m.employee_id \nGROUP BY m.employee_id, m.name \nORDER BY m.employee_id;",
      optimalSolution: "SELECT m.employee_id, m.name, COUNT(e.employee_id) AS reports_count, ROUND(AVG(e.age)) AS average_age FROM Employees e INNER JOIN Employees m ON e.reports_to = m.employee_id GROUP BY m.employee_id, m.name ORDER BY m.employee_id;",
      explanation: "Self-joins to match subordinates to managers, aggregating direct subordinate counts and rounded average age.",
      timeComplexity: "O(N^2)",
      spaceComplexity: "O(N)"
    },
    {
      id: 19,
      title: "Primary Department for Each Employee",
      concept: "CASE",
      difficulty: "Medium",
      description: "Employees can belong to multiple departments. Find the primary department for each employee. Employees belonging to only 1 department have it as primary.",
      schema: {
        Employee: [
          { name: "employee_id", type: "INT" },
          { name: "department_id", type: "INT" },
          { name: "primary_flag", type: "VARCHAR(1)" }
        ]
      },
      mockData: {
        Employee: [
          { employee_id: 1, department_id: 1, primary_flag: 'N' },
          { employee_id: 2, department_id: 1, primary_flag: 'Y' },
          { employee_id: 2, department_id: 2, primary_flag: 'N' }
        ]
      },
      boilerplate: "SELECT employee_id, department_id \nFROM Employee \nWHERE primary_flag = 'Y' \nUNION \nSELECT employee_id, department_id \nFROM Employee \nGROUP BY employee_id, department_id \nHAVING COUNT(department_id) = 1;",
      optimalSolution: "SELECT employee_id, department_id FROM Employee WHERE primary_flag = 'Y' UNION SELECT employee_id, department_id FROM Employee GROUP BY employee_id, department_id HAVING COUNT(department_id) = 1;",
      explanation: "Selects employees with primary flag 'Y' and aggregates those that have exactly 1 record, unifying outputs using UNION.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 20,
      title: "Product Price at a Given Date",
      concept: "JOIN + MAX date",
      difficulty: "Hard",
      description: "Find the prices of all products on '2019-08-16'. Assume the default price of all products before any change is 10.",
      schema: {
        Products: [
          { name: "product_id", type: "INT" },
          { name: "new_price", type: "INT" },
          { name: "change_date", type: "DATE" }
        ]
      },
      mockData: {
        Products: [
          { product_id: 1, new_price: 20, change_date: '2019-08-14' },
          { product_id: 2, new_price: 50, change_date: '2019-08-14' },
          { product_id: 1, new_price: 30, change_date: '2019-08-15' },
          { product_id: 2, new_price: 65, change_date: '2019-08-17' }
        ]
      },
      boilerplate: "SELECT product_id, 10 AS price \nFROM Products \nGROUP BY product_id \nHAVING MIN(change_date) > '2019-08-16' \nUNION \nSELECT product_id, new_price AS price \nFROM Products \nWHERE (product_id, change_date) IN ( \n  SELECT product_id, MAX(change_date) \n  FROM Products \n  WHERE change_date <= '2019-08-16' \n  GROUP BY product_id \n);",
      optimalSolution: "SELECT product_id, 10 AS price FROM Products GROUP BY product_id HAVING MIN(change_date) > '2019-08-16' UNION SELECT product_id, new_price AS price FROM Products WHERE (product_id, change_date) IN ( SELECT product_id, MAX(change_date) FROM Products WHERE change_date <= '2019-08-16' GROUP BY product_id );",
      explanation: "Applies two logical blocks: products whose first price adjustment is past the deadline (price defaults to 10), and those with changes before the deadline (retrieves the last price change).",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 21,
      title: "Department Highest Salary",
      concept: "JOIN + GROUP",
      difficulty: "Hard",
      description: "Write a solution to find employees who have the highest salary in each of the departments.",
      schema: {
        Employee: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" },
          { name: "salary", type: "INT" },
          { name: "departmentId", type: "INT" }
        ],
        Department: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" }
        ]
      },
      mockData: {
        Employee: [
          { id: 1, name: 'Joe', salary: 70000, departmentId: 1 },
          { id: 2, name: 'Jim', salary: 90000, departmentId: 1 },
          { id: 3, name: 'Henry', salary: 80000, departmentId: 2 }
        ],
        Department: [
          { id: 1, name: 'IT' },
          { id: 2, name: 'Sales' }
        ]
      },
      boilerplate: "SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary \nFROM Employee e \nINNER JOIN Department d ON e.departmentId = d.id \nWHERE (e.departmentId, e.salary) IN ( \n  SELECT departmentId, MAX(salary) \n  FROM Employee \n  GROUP BY departmentId \n);",
      optimalSolution: "SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e INNER JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN ( SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId );",
      explanation: "Finds the max salary in each department using an aggregated subquery, then joins back to retrieve employee names.",
      timeComplexity: "O(E + D)",
      spaceComplexity: "O(E)"
    },
    {
      id: 22,
      title: "Department Top Three Salaries",
      concept: "DENSE_RANK",
      difficulty: "Hard",
      description: "A high earner in a department is an employee who has a salary in the top three unique salaries. Find the high earners.",
      schema: {
        Employee: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" },
          { name: "salary", type: "INT" },
          { name: "departmentId", type: "INT" }
        ],
        Department: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" }
        ]
      },
      mockData: {
        Employee: [
          { id: 1, name: 'Joe', salary: 85000, departmentId: 1 },
          { id: 2, name: 'Henry', salary: 80000, departmentId: 2 },
          { id: 3, name: 'Sam', salary: 60000, departmentId: 2 },
          { id: 4, name: 'Max', salary: 90000, departmentId: 1 }
        ],
        Department: [
          { id: 1, name: 'IT' },
          { id: 2, name: 'Sales' }
        ]
      },
      boilerplate: "WITH RankedSalary AS ( \n  SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary, \n    DENSE_RANK() OVER(PARTITION BY e.departmentId ORDER BY e.salary DESC) as r \n  FROM Employee e \n  INNER JOIN Department d ON e.departmentId = d.id \n) \nSELECT Department, Employee, Salary \nFROM RankedSalary \nWHERE r <= 3;",
      optimalSolution: "WITH RankedSalary AS ( SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary, DENSE_RANK() OVER(PARTITION BY e.departmentId ORDER BY e.salary DESC) as r FROM Employee e INNER JOIN Department d ON e.departmentId = d.id ) SELECT Department, Employee, Salary FROM RankedSalary WHERE r <= 3;",
      explanation: "Applies DENSE_RANK window function partition by department, selecting only records positioned within rank 3.",
      timeComplexity: "O(E log E)",
      spaceComplexity: "O(E)"
    }
  ],
  "Aggregate Functions": [
    {
      id: 23,
      title: "Average Selling Price",
      concept: "AVG",
      difficulty: "Easy",
      description: "Find the average selling price for each product. average_price should be rounded to 2 decimal places.",
      schema: {
        Prices: [
          { name: "product_id", type: "INT" },
          { name: "start_date", type: "DATE" },
          { name: "end_date", type: "DATE" },
          { name: "price", type: "INT" }
        ],
        UnitsSold: [
          { name: "product_id", type: "INT" },
          { name: "purchase_date", type: "DATE" },
          { name: "units", type: "INT" }
        ]
      },
      mockData: {
        Prices: [
          { product_id: 1, start_date: '2019-02-17', end_date: '2019-02-28', price: 5 },
          { product_id: 2, start_date: '2019-02-17', end_date: '2019-02-28', price: 15 }
        ],
        UnitsSold: [
          { product_id: 1, purchase_date: '2019-02-25', units: 100 },
          { product_id: 2, purchase_date: '2019-02-10', units: 200 }
        ]
      },
      boilerplate: "SELECT p.product_id, \n  ROUND(SUM(p.price * u.units) * 1.0 / SUM(u.units), 2) AS average_price \nFROM Prices p \nINNER JOIN UnitsSold u ON p.product_id = u.product_id \n  AND u.purchase_date BETWEEN p.start_date AND p.end_date \nGROUP BY p.product_id;",
      optimalSolution: "SELECT p.product_id, ROUND(SUM(p.price * u.units) * 1.0 / SUM(u.units), 2) AS average_price FROM Prices p INNER JOIN UnitsSold u ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date GROUP BY p.product_id;",
      explanation: "Applies conditional date ranges, multiplying unit amounts by active unit prices and dividing by total unit sums.",
      timeComplexity: "O(P + U)",
      spaceComplexity: "O(P)"
    },
    {
      id: 24,
      title: "Project Employees I",
      concept: "AVG + GROUP BY",
      difficulty: "Easy",
      description: "Write a solution to report the average experience years of all the employees for each project, rounded to 2 decimal places.",
      schema: {
        Project: [
          { name: "project_id", type: "INT" },
          { name: "employee_id", type: "INT" }
        ],
        Employee: [
          { name: "employee_id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" },
          { name: "experience_years", type: "INT" }
        ]
      },
      mockData: {
        Project: [
          { project_id: 1, employee_id: 1 },
          { project_id: 1, employee_id: 2 },
          { project_id: 2, employee_id: 1 }
        ],
        Employee: [
          { employee_id: 1, name: 'Khaled', experience_years: 3 },
          { employee_id: 2, name: 'Ali', experience_years: 2 }
        ]
      },
      boilerplate: "SELECT p.project_id, \n  ROUND(AVG(e.experience_years * 1.0), 2) AS average_years \nFROM Project p \nINNER JOIN Employee e ON p.employee_id = e.employee_id \nGROUP BY p.project_id;",
      optimalSolution: "SELECT p.project_id, ROUND(AVG(e.experience_years * 1.0), 2) AS average_years FROM Project p INNER JOIN Employee e ON p.employee_id = e.employee_id GROUP BY p.project_id;",
      explanation: "Inner joins project lists with employees, grouping by project and computing rounded average experience years.",
      timeComplexity: "O(P + E)",
      spaceComplexity: "O(P)"
    },
    {
      id: 25,
      title: "Percentage of Users Attended a Contest",
      concept: "COUNT percentage",
      difficulty: "Easy",
      description: "Find the percentage of the users registered in each contest, rounded to 2 decimal places, ordered by percentage descending.",
      schema: {
        Users: [
          { name: "user_id", type: "INT" },
          { name: "user_name", type: "VARCHAR(50)" }
        ],
        Register: [
          { name: "contest_id", type: "INT" },
          { name: "user_id", type: "INT" }
        ]
      },
      mockData: {
        Users: [
          { user_id: 6, user_name: 'Alice' },
          { user_id: 2, user_name: 'Bob' },
          { user_id: 7, user_name: 'Charlie' }
        ],
        Register: [
          { contest_id: 215, user_id: 6 },
          { contest_id: 215, user_id: 2 },
          { contest_id: 208, user_id: 2 }
        ]
      },
      boilerplate: "SELECT contest_id, \n  ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage \nFROM Register \nGROUP BY contest_id \nORDER BY percentage DESC, contest_id ASC;",
      optimalSolution: "SELECT contest_id, ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage FROM Register GROUP BY contest_id ORDER BY percentage DESC, contest_id ASC;",
      explanation: "Divides specific contest registrations by the overall users population (computed via subquery), sorting outputs appropriately.",
      timeComplexity: "O(R log R)",
      spaceComplexity: "O(R)"
    },
    {
      id: 26,
      title: "Queries Quality and Percentage",
      concept: "ROUND",
      difficulty: "Medium",
      description: "Find query quality (average of query_rating divided by query_position) and poor query percentage (queries with rating < 3).",
      schema: {
        Queries: [
          { name: "query_name", type: "VARCHAR(50)" },
          { name: "result", type: "VARCHAR(50)" },
          { name: "position", type: "INT" },
          { name: "rating", type: "INT" }
        ]
      },
      mockData: {
        Queries: [
          { query_name: 'Dog', result: 'Golden Retriever', position: 1, rating: 5 },
          { query_name: 'Dog', result: 'German Shepherd', position: 2, rating: 5 },
          { query_name: 'Dog', result: 'Mule', position: 200, rating: 1 },
          { query_name: 'Cat', result: 'Shirazi', position: 5, rating: 2 }
        ]
      },
      boilerplate: "SELECT query_name, \n  ROUND(AVG(rating * 1.0 / position), 2) AS quality, \n  ROUND(COUNT(CASE WHEN rating < 3 THEN 1 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage \nFROM Queries \nGROUP BY query_name;",
      optimalSolution: "SELECT query_name, ROUND(AVG(rating * 1.0 / position), 2) AS quality, ROUND(COUNT(CASE WHEN rating < 3 THEN 1 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage FROM Queries GROUP BY query_name;",
      explanation: "Applies two aggregates per query_name: average ratings divided by position, and percent occurrences of poor query parameters.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(Groups)"
    },
    {
      id: 27,
      title: "Monthly Transactions I",
      concept: "SUM + CASE",
      difficulty: "Medium",
      description: "Find for each month and country, the number of transactions and their total amount, the number of approved transactions and their total amount.",
      schema: {
        Transactions: [
          { name: "id", type: "INT" },
          { name: "country", type: "VARCHAR(50)" },
          { name: "state", type: "VARCHAR(20)" },
          { name: "amount", type: "INT" },
          { name: "trans_date", type: "DATE" }
        ]
      },
      mockData: {
        Transactions: [
          { id: 121, country: 'US', state: 'approved', amount: 1000, trans_date: '2018-12-18' },
          { id: 122, country: 'US', state: 'declined', amount: 2000, trans_date: '2018-12-19' },
          { id: 123, country: 'US', state: 'approved', amount: 2000, trans_date: '2019-01-01' }
        ]
      },
      boilerplate: "SELECT SUBSTR(trans_date, 1, 7) AS month, country, \n  COUNT(*) AS trans_count, \n  COUNT(CASE WHEN state = 'approved' THEN 1 END) AS approved_count, \n  SUM(amount) AS trans_total_amount, \n  COALESCE(SUM(CASE WHEN state = 'approved' THEN amount END), 0) AS approved_total_amount \nFROM Transactions \nGROUP BY month, country;",
      optimalSolution: "SELECT SUBSTR(trans_date, 1, 7) AS month, country, COUNT(*) AS trans_count, COUNT(CASE WHEN state = 'approved' THEN 1 END) AS approved_count, SUM(amount) AS trans_total_amount, COALESCE(SUM(CASE WHEN state = 'approved' THEN amount END), 0) AS approved_total_amount FROM Transactions GROUP BY month, country;",
      explanation: "Splits dates into month formats (`YYYY-MM`) and uses conditional SUM/CASE structures to map approved counts and volume.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(Months * Countries)"
    },
    {
      id: 28,
      title: "Immediate Food Delivery II",
      concept: "Conditional AVG",
      difficulty: "Hard",
      description: "If the customer's preferred delivery date is the same as the order date, then the order is called immediate. Find the percentage of immediate orders in the first orders of all customers.",
      schema: {
        Delivery: [
          { name: "delivery_id", type: "INT" },
          { name: "customer_id", type: "INT" },
          { name: "order_date", type: "DATE" },
          { name: "customer_pref_delivery_date", type: "DATE" }
        ]
      },
      mockData: {
        Delivery: [
          { delivery_id: 1, customer_id: 1, order_date: '2019-08-01', customer_pref_delivery_date: '2019-08-02' },
          { delivery_id: 2, customer_id: 1, order_date: '2019-08-02', customer_pref_delivery_date: '2019-08-02' },
          { delivery_id: 3, customer_id: 2, order_date: '2019-08-01', customer_pref_delivery_date: '2019-08-01' }
        ]
      },
      boilerplate: "SELECT ROUND( \n  COUNT(CASE WHEN order_date = customer_pref_delivery_date THEN 1 END) * 100.0 / COUNT(*), 2 \n) AS immediate_percentage \nFROM Delivery \nWHERE (customer_id, order_date) IN ( \n  SELECT customer_id, MIN(order_date) \n  FROM Delivery \n  GROUP BY customer_id \n);",
      optimalSolution: "SELECT ROUND( COUNT(CASE WHEN order_date = customer_pref_delivery_date THEN 1 END) * 100.0 / COUNT(*), 2 ) AS immediate_percentage FROM Delivery WHERE (customer_id, order_date) IN ( SELECT customer_id, MIN(order_date) FROM Delivery GROUP BY customer_id );",
      explanation: "Applies subqueries finding each candidate's first orders (`MIN(order_date)`), calculating delivery percentages within this subset.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 29,
      title: "Game Play Analysis IV",
      concept: "Retention rate",
      difficulty: "Hard",
      description: "Report the fraction of players that logged in again on the day after the day they first logged in, rounded to 2 decimal places.",
      schema: {
        Activity: [
          { name: "player_id", type: "INT" },
          { name: "device_id", type: "INT" },
          { name: "event_date", type: "DATE" },
          { name: "games_played", type: "INT" }
        ]
      },
      mockData: {
        Activity: [
          { player_id: 1, device_id: 2, event_date: '2016-03-01', games_played: 5 },
          { player_id: 1, device_id: 2, event_date: '2016-03-02', games_played: 6 },
          { player_id: 2, device_id: 3, event_date: '2017-06-25', games_played: 1 }
        ]
      },
      boilerplate: "WITH FirstLogin AS ( \n  SELECT player_id, MIN(event_date) AS first_date \n  FROM Activity \n  GROUP BY player_id \n) \nSELECT ROUND( \n  COUNT(a.player_id) * 1.0 / (SELECT COUNT(*) FROM FirstLogin), 2 \n) AS fraction \nFROM FirstLogin f \nINNER JOIN Activity a ON f.player_id = a.player_id \n  AND DATE(a.event_date) = DATE(f.first_date, '+1 day');",
      optimalSolution: "WITH FirstLogin AS ( SELECT player_id, MIN(event_date) AS first_date FROM Activity GROUP BY player_id ) SELECT ROUND( COUNT(a.player_id) * 1.0 / (SELECT COUNT(*) FROM FirstLogin), 2 ) AS fraction FROM FirstLogin f INNER JOIN Activity a ON f.player_id = a.player_id AND a.event_date = DATE(f.first_date, '+1 day');",
      explanation: "Pre-calculates first login occurrences, and INNER JOINs back on events dated exactly 1 day after first logins to compute retention fractions.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 30,
      title: "Classes With at Least 5 Students",
      concept: "HAVING",
      difficulty: "Easy",
      description: "Write a solution to report all the classes that have at least five students.",
      schema: {
        Courses: [
          { name: "student", type: "VARCHAR(50)" },
          { name: "class", type: "VARCHAR(50)" }
        ]
      },
      mockData: {
        Courses: [
          { student: 'A', class: 'Math' },
          { student: 'B', class: 'Math' },
          { student: 'C', class: 'Math' },
          { student: 'D', class: 'Math' },
          { student: 'E', class: 'Math' },
          { student: 'F', class: 'Math' }
        ]
      },
      boilerplate: "SELECT class \nFROM Courses \nGROUP BY class \nHAVING COUNT(student) >= 5;",
      optimalSolution: "SELECT class FROM Courses GROUP BY class HAVING COUNT(student) >= 5;",
      explanation: "Groups records by course titles, filtering out classes holding counts less than 5 using HAVING.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(Classes)"
    },
    {
      id: 31,
      title: "Find Followers Count",
      concept: "COUNT",
      difficulty: "Easy",
      description: "Write a solution that will, for each user, return the number of followers. Return the result table ordered by user_id.",
      schema: {
        Followers: [
          { name: "user_id", type: "INT" },
          { name: "follower_id", type: "INT" }
        ]
      },
      mockData: {
        Followers: [
          { user_id: 1, follower_id: 2 },
          { user_id: 2, follower_id: 1 },
          { user_id: 1, follower_id: 3 }
        ]
      },
      boilerplate: "SELECT user_id, COUNT(follower_id) AS followers_count \nFROM Followers \nGROUP BY user_id \nORDER BY user_id;",
      optimalSolution: "SELECT user_id, COUNT(follower_id) AS followers_count FROM Followers GROUP BY user_id ORDER BY user_id;",
      explanation: "Calculates simple followers groups counts, ordering ascendingly by ID.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(Users)"
    },
    {
      id: 32,
      title: "Biggest Single Number",
      concept: "GROUP + HAVING",
      difficulty: "Easy",
      description: "A single number is a number that appeared only once in the MyNumbers table. Find the largest single number. If there is no such number, report null.",
      schema: {
        MyNumbers: [
          { name: "num", type: "INT" }
        ]
      },
      mockData: {
        MyNumbers: [
          { num: 8 },
          { num: 8 },
          { num: 3 },
          { num: 3 },
          { num: 1 },
          { num: 4 },
          { num: 5 }
        ]
      },
      boilerplate: "SELECT MAX(num) AS num \nFROM ( \n  SELECT num \n  FROM MyNumbers \n  GROUP BY num \n  HAVING COUNT(num) = 1 \n) AS SingleNumbers;",
      optimalSolution: "SELECT MAX(num) AS num FROM ( SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(num) = 1 ) AS SingleNumbers;",
      explanation: "Isolates unique numbers holding duplicate count of 1 in subqueries, and retrieves the overall MAX value.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)"
    }
  ],
  "GROUP BY & HAVING": [
    {
      id: 33,
      title: "Number of Unique Subjects Taught by Each Teacher",
      concept: "COUNT DISTINCT",
      difficulty: "Easy",
      description: "Report the number of unique subjects each teacher teaches in the university.",
      schema: {
        Teacher: [
          { name: "teacher_id", type: "INT" },
          { name: "subject_id", type: "INT" },
          { name: "dept_id", type: "INT" }
        ]
      },
      mockData: {
        Teacher: [
          { teacher_id: 1, subject_id: 2, dept_id: 3 },
          { teacher_id: 1, subject_id: 2, dept_id: 4 },
          { teacher_id: 1, subject_id: 3, dept_id: 3 }
        ]
      },
      boilerplate: "SELECT teacher_id, COUNT(DISTINCT subject_id) AS cnt \nFROM Teacher \nGROUP BY teacher_id;",
      optimalSolution: "SELECT teacher_id, COUNT(DISTINCT subject_id) AS cnt FROM Teacher GROUP BY teacher_id;",
      explanation: "Applies COUNT DISTINCT to verify unique teaching structures per teacher ID.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(Teachers)"
    },
    {
      id: 34,
      title: "User Activity for the Past 30 Days I",
      concept: "GROUP BY",
      difficulty: "Easy",
      description: "Find the daily active user count for a period of 30 days ending 2019-07-27 inclusively. A user was active on a day if they made at least one activity.",
      schema: {
        Activity: [
          { name: "user_id", type: "INT" },
          { name: "session_id", type: "INT" },
          { name: "activity_date", type: "DATE" },
          { name: "activity_type", type: "VARCHAR(20)" }
        ]
      },
      mockData: {
        Activity: [
          { user_id: 1, session_id: 1, activity_date: '2019-07-20', activity_type: 'open_session' },
          { user_id: 1, session_id: 1, activity_date: '2019-07-20', activity_type: 'scroll' },
          { user_id: 2, session_id: 4, activity_date: '2019-07-21', activity_type: 'open_session' }
        ]
      },
      boilerplate: "SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users \nFROM Activity \nWHERE activity_date BETWEEN '2019-06-28' AND '2019-07-27' \nGROUP BY activity_date;",
      optimalSolution: "SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users FROM Activity WHERE activity_date BETWEEN '2019-06-28' AND '2019-07-27' GROUP BY activity_date;",
      explanation: "Filters active dates within 30-day parameters, counting unique users active per date.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(Days)"
    },
    {
      id: 35,
      title: "Product Sales Analysis III",
      concept: "MAX date",
      difficulty: "Hard",
      description: "Select the product id, year, quantity, and price for the first year of every product sold.",
      schema: {
        Sales: [
          { name: "product_id", type: "INT" },
          { name: "year", type: "INT" },
          { name: "quantity", type: "INT" },
          { name: "price", type: "INT" }
        ]
      },
      mockData: {
        Sales: [
          { product_id: 100, year: 2008, quantity: 10, price: 5000 },
          { product_id: 100, year: 2009, quantity: 12, price: 5000 },
          { product_id: 200, year: 2011, quantity: 15, price: 9000 }
        ]
      },
      boilerplate: "SELECT product_id, year AS first_year, quantity, price \nFROM Sales \nWHERE (product_id, year) IN ( \n  SELECT product_id, MIN(year) \n  FROM Sales \n  GROUP BY product_id \n);",
      optimalSolution: "SELECT product_id, year AS first_year, quantity, price FROM Sales WHERE (product_id, year) IN ( SELECT product_id, MIN(year) FROM Sales GROUP BY product_id );",
      explanation: "Locks on the minimum year for each product, matching combinations to filter down the final results.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 36,
      title: "Customers Who Bought All Products",
      concept: "HAVING COUNT",
      difficulty: "Medium",
      description: "Write a solution to report the customer ids from the Customer table who bought all the products in the Product table.",
      schema: {
        Customer: [
          { name: "customer_id", type: "INT" },
          { name: "product_key", type: "INT" }
        ],
        Product: [
          { name: "product_key", type: "INT" }
        ]
      },
      mockData: {
        Customer: [
          { customer_id: 1, product_key: 5 },
          { customer_id: 2, product_key: 6 },
          { customer_id: 1, product_key: 6 }
        ],
        Product: [
          { product_key: 5 },
          { product_key: 6 }
        ]
      },
      boilerplate: "SELECT customer_id \nFROM Customer \nGROUP BY customer_id \nHAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);",
      optimalSolution: "SELECT customer_id FROM Customer GROUP BY customer_id HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);",
      explanation: "Groups customer transactions, ensuring unique bought keys match global catalog counts.",
      timeComplexity: "O(C + P)",
      spaceComplexity: "O(Customers)"
    },
    {
      id: 37,
      title: "Consecutive Numbers",
      concept: "Window logic",
      difficulty: "Medium",
      description: "Find all numbers that appear at least three times consecutively.",
      schema: {
        Logs: [
          { name: "id", type: "INT" },
          { name: "num", type: "INT" }
        ]
      },
      mockData: {
        Logs: [
          { id: 1, num: 1 },
          { id: 2, num: 1 },
          { id: 3, num: 1 },
          { id: 4, num: 2 },
          { id: 5, num: 1 }
        ]
      },
      boilerplate: "SELECT DISTINCT l1.num AS ConsecutiveNums \nFROM Logs l1 \nINNER JOIN Logs l2 ON l1.id = l2.id - 1 \nINNER JOIN Logs l3 ON l1.id = l3.id - 2 \nWHERE l1.num = l2.num AND l2.num = l3.num;",
      optimalSolution: "SELECT DISTINCT l1.num AS ConsecutiveNums FROM Logs l1 INNER JOIN Logs l2 ON l1.id = l2.id - 1 INNER JOIN Logs l3 ON l1.id = l3.id - 2 WHERE l1.num = l2.num AND l2.num = l3.num;",
      explanation: "Self-joins Logs table twice on incrementing offsets, verifying values are matching.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 38,
      title: "Restaurant Growth",
      concept: "Rolling Average",
      difficulty: "Hard",
      description: "You are the restaurant owner and want to analyze a possible expansion. Compute the moving average of how much the customer paid in a seven-day window.",
      schema: {
        Customer: [
          { name: "customer_id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" },
          { name: "visited_on", type: "DATE" },
          { name: "amount", type: "INT" }
        ]
      },
      mockData: {
        Customer: [
          { customer_id: 1, name: 'J', visited_on: '2019-01-01', amount: 100 },
          { customer_id: 2, name: 'A', visited_on: '2019-01-02', amount: 150 },
          { customer_id: 3, name: 'B', visited_on: '2019-01-03', amount: 200 },
          { customer_id: 4, name: 'C', visited_on: '2019-01-04', amount: 100 },
          { customer_id: 5, name: 'D', visited_on: '2019-01-05', amount: 120 },
          { customer_id: 6, name: 'E', visited_on: '2019-01-06', amount: 130 },
          { customer_id: 7, name: 'F', visited_on: '2019-01-07', amount: 110 },
          { customer_id: 8, name: 'G', visited_on: '2019-01-08', amount: 80 }
        ]
      },
      boilerplate: "WITH DailySums AS ( \n  SELECT visited_on, SUM(amount) AS daily_amount \n  FROM Customer \n  GROUP BY visited_on \n) \nSELECT d1.visited_on, \n  SUM(d2.daily_amount) AS amount, \n  ROUND(AVG(d2.daily_amount * 1.0), 2) AS average_amount \nFROM DailySums d1 \nINNER JOIN DailySums d2 ON DATE(d2.visited_on) BETWEEN DATE(d1.visited_on, '-6 day') AND DATE(d1.visited_on) \nGROUP BY d1.visited_on \nHAVING COUNT(d2.visited_on) = 7 \nORDER BY d1.visited_on;",
      optimalSolution: "WITH DailySums AS ( SELECT visited_on, SUM(amount) AS daily_amount FROM Customer GROUP BY visited_on ) SELECT d1.visited_on, SUM(d2.daily_amount) AS amount, ROUND(SUM(d2.daily_amount) * 1.0 / 7.0, 2) AS average_amount FROM DailySums d1 INNER JOIN DailySums d2 ON d2.visited_on BETWEEN DATE(d1.visited_on, '-6 day') AND d1.visited_on GROUP BY d1.visited_on HAVING COUNT(d2.visited_on) = 7 ORDER BY d1.visited_on;",
      explanation: "Aggregates sums daily, self-joining DailySums to pull historical sums across rolling 7-day windows.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 39,
      title: "Friend Requests II",
      concept: "Aggregation",
      difficulty: "Medium",
      description: "Write a solution to find the people who have the most friends and the most friends count.",
      schema: {
        RequestAccepted: [
          { name: "requester_id", type: "INT" },
          { name: "accepter_id", type: "INT" },
          { name: "accept_date", type: "DATE" }
        ]
      },
      mockData: {
        RequestAccepted: [
          { requester_id: 1, accepter_id: 2, accept_date: '2016-06-03' },
          { requester_id: 1, accepter_id: 3, accept_date: '2016-06-08' },
          { requester_id: 2, accepter_id: 3, accept_date: '2016-06-08' }
        ]
      },
      boilerplate: "WITH FriendCounts AS ( \n  SELECT requester_id AS id FROM RequestAccepted \n  UNION ALL \n  SELECT accepter_id AS id FROM RequestAccepted \n) \nSELECT id, COUNT(*) AS num \nFROM FriendCounts \nGROUP BY id \nORDER BY num DESC \nLIMIT 1;",
      optimalSolution: "WITH FriendCounts AS ( SELECT requester_id AS id FROM RequestAccepted UNION ALL SELECT accepter_id AS id FROM RequestAccepted ) SELECT id, COUNT(*) AS num FROM FriendCounts GROUP BY id ORDER BY num DESC LIMIT 1;",
      explanation: "Flattens requester and accepter IDs into one long stream using UNION ALL, groups by ID, and fetches the highest count.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 40,
      title: "Investments in 2016",
      concept: "GROUP filtering",
      difficulty: "Hard",
      description: "Write a solution to report the sum of all total investment values in 2016 for all policyholders who meet specific criteria.",
      schema: {
        Insurance: [
          { name: "pid", type: "INT" },
          { name: "tiv_2015", type: "INT" },
          { name: "tiv_2016", type: "INT" },
          { name: "lat", type: "REAL" },
          { name: "lon", type: "REAL" }
        ]
      },
      mockData: {
        Insurance: [
          { pid: 1, tiv_2015: 10, tiv_2016: 5, lat: 10, lon: 10 },
          { pid: 2, tiv_2015: 20, tiv_2016: 20, lat: 20, lon: 20 },
          { pid: 3, tiv_2015: 10, tiv_2016: 30, lat: 20, lon: 20 },
          { pid: 4, tiv_2015: 10, tiv_2016: 40, lat: 40, lon: 40 }
        ]
      },
      boilerplate: "SELECT ROUND(SUM(tiv_2016 * 1.0), 2) AS tiv_2016 \nFROM Insurance \nWHERE tiv_2015 IN ( \n  SELECT tiv_2015 FROM Insurance GROUP BY tiv_2015 HAVING COUNT(*) > 1 \n) \nAND (lat, lon) IN ( \n  SELECT lat, lon FROM Insurance GROUP BY lat, lon HAVING COUNT(*) = 1 \n);",
      optimalSolution: "SELECT ROUND(SUM(tiv_2016 * 1.0), 2) AS tiv_2016 FROM Insurance WHERE tiv_2015 IN ( SELECT tiv_2015 FROM Insurance GROUP BY tiv_2015 HAVING COUNT(*) > 1 ) AND CONCAT(lat, ',', lon) IN ( SELECT CONCAT(lat, ',', lon) FROM Insurance GROUP BY lat, lon HAVING COUNT(*) = 1 );",
      explanation: "Applies two criteria: policyholders must share tiv_2015 values with others, but reside at unique coordinates.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)"
    }
  ],
  "Subqueries": [
    {
      id: 41,
      title: "Employees Whose Manager Left the Company",
      concept: "NOT IN",
      difficulty: "Easy",
      description: "Find the IDs of the employees whose salary is strictly less than 30000 and whose manager left the company.",
      schema: {
        Employees: [
          { name: "employee_id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" },
          { name: "manager_id", type: "INT" },
          { name: "salary", type: "INT" }
        ]
      },
      mockData: {
        Employees: [
          { employee_id: 3, name: 'Scalla', manager_id: 3, salary: 32000 },
          { employee_id: 12, name: 'John', manager_id: 6, salary: 28000 },
          { employee_id: 13, name: 'Alice', manager_id: 3, salary: 29000 }
        ]
      },
      boilerplate: "SELECT employee_id \nFROM Employees \nWHERE salary < 30000 \n  AND manager_id IS NOT NULL \n  AND manager_id NOT IN (SELECT employee_id FROM Employees) \nORDER BY employee_id;",
      optimalSolution: "SELECT employee_id FROM Employees WHERE salary < 30000 AND manager_id IS NOT NULL AND manager_id NOT IN (SELECT employee_id FROM Employees) ORDER BY employee_id;",
      explanation: "Checks salary bounds and isolates managers whose profiles are missing from the current active records database using NOT IN.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 42,
      title: "Second Highest Salary",
      concept: "Subquery",
      difficulty: "Medium",
      description: "Write a solution to find the second highest salary from the Employee table. If there is no second highest salary, return null.",
      schema: {
        Employee: [
          { name: "id", type: "INT" },
          { name: "salary", type: "INT" }
        ]
      },
      mockData: {
        Employee: [
          { id: 1, salary: 100 },
          { id: 2, salary: 200 },
          { id: 3, salary: 300 }
        ]
      },
      boilerplate: "SELECT MAX(salary) AS SecondHighestSalary \nFROM Employee \nWHERE salary < (SELECT MAX(salary) FROM Employee);",
      optimalSolution: "SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
      explanation: "Runs subqueries to extract the maximum salary, returning the largest salary that is strictly smaller.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)"
    },
    {
      id: 43,
      title: "Nth Highest Salary",
      concept: "LIMIT/OFFSET",
      difficulty: "Hard",
      description: "Write a solution to find the N-th highest salary from the Employee table.",
      schema: {
        Employee: [
          { name: "id", type: "INT" },
          { name: "salary", type: "INT" }
        ]
      },
      mockData: {
        Employee: [
          { id: 1, salary: 100 },
          { id: 2, salary: 200 }
        ]
      },
      boilerplate: "SELECT DISTINCT salary \nFROM Employee \nORDER BY salary DESC \nLIMIT 1 OFFSET 1; -- Example for N = 2",
      optimalSolution: "SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;",
      explanation: "Isolates distinct salaries sorted descending, offsetting to extract specific indices.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(1)"
    },
    {
      id: 44,
      title: "Exchange Seats",
      concept: "CASE",
      difficulty: "Medium",
      description: "Write a solution to swap the seat id of every two consecutive students. If the number of students is odd, the id of the last student is not swapped.",
      schema: {
        Seat: [
          { name: "id", type: "INT" },
          { name: "student", type: "VARCHAR(50)" }
        ]
      },
      mockData: {
        Seat: [
          { id: 1, student: 'Abbot' },
          { id: 2, student: 'Doris' },
          { id: 3, student: 'Emerson' }
        ]
      },
      boilerplate: "SELECT \n  CASE \n    WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id \n    WHEN id % 2 = 1 THEN id + 1 \n    ELSE id - 1 \n  END AS id, \n  student \nFROM Seat \nORDER BY id;",
      optimalSolution: "SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM Seat ORDER BY id;",
      explanation: "Uses CASE constructs to swap index positions, preserving the tail if total student counts are odd.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 45,
      title: "Movie Rating",
      concept: "Multiple aggregations",
      difficulty: "Hard",
      description: "Find the user who has rated the greatest number of movies (alphabetical on tie) and the movie name with the highest average rating in February 2020.",
      schema: {
        Movies: [
          { name: "movie_id", type: "INT" },
          { name: "title", type: "VARCHAR(50)" }
        ],
        Users: [
          { name: "user_id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" }
        ],
        MovieRating: [
          { name: "movie_id", type: "INT" },
          { name: "user_id", type: "INT" },
          { name: "rating", type: "INT" },
          { name: "created_at", type: "DATE" }
        ]
      },
      mockData: {
        Movies: [
          { movie_id: 1, title: 'Avengers' },
          { movie_id: 2, title: 'Batman' }
        ],
        Users: [
          { user_id: 1, name: 'Daniel' },
          { user_id: 2, name: 'Monica' }
        ],
        MovieRating: [
          { movie_id: 1, user_id: 1, rating: 5, created_at: '2020-02-10' },
          { movie_id: 1, user_id: 2, rating: 4, created_at: '2020-02-12' },
          { movie_id: 2, user_id: 1, rating: 3, created_at: '2020-02-14' }
        ]
      },
      boilerplate: "(SELECT u.name AS results \nFROM MovieRating r \nINNER JOIN Users u ON r.user_id = u.user_id \nGROUP BY u.name \nORDER BY COUNT(r.movie_id) DESC, u.name ASC \nLIMIT 1) \nUNION ALL \n(SELECT m.title AS results \nFROM MovieRating r \nINNER JOIN Movies m ON r.movie_id = m.movie_id \nWHERE r.created_at BETWEEN '2020-02-01' AND '2020-02-29' \nGROUP BY m.title \nORDER BY AVG(r.rating * 1.0) DESC, m.title ASC \nLIMIT 1);",
      optimalSolution: "(SELECT u.name AS results FROM MovieRating r INNER JOIN Users u ON r.user_id = u.user_id GROUP BY u.name ORDER BY COUNT(r.movie_id) DESC, u.name ASC LIMIT 1) UNION ALL (SELECT m.title AS results FROM MovieRating r INNER JOIN Movies m ON r.movie_id = m.movie_id WHERE r.created_at BETWEEN '2020-02-01' AND '2020-02-29' GROUP BY m.title ORDER BY AVG(r.rating * 1.0) DESC, m.title ASC LIMIT 1);",
      explanation: "Applies two separate queries (user with highest ratings count and movie with highest February average), uniting outputs using UNION ALL.",
      timeComplexity: "O(R log R)",
      spaceComplexity: "O(R)"
    },
    {
      id: 46,
      title: "Find Median Given Frequency",
      concept: "Advanced subquery",
      difficulty: "Hard",
      description: "Write a solution to find the median of all numbers, given their frequencies.",
      schema: {
        Numbers: [
          { name: "num", type: "INT" },
          { name: "frequency", type: "INT" }
        ]
      },
      mockData: {
        Numbers: [
          { num: 0, frequency: 7 },
          { num: 1, frequency: 1 },
          { num: 2, frequency: 3 },
          { num: 3, frequency: 1 }
        ]
      },
      boilerplate: "SELECT AVG(num * 1.0) AS median \nFROM ( \n  SELECT num, frequency, \n    SUM(frequency) OVER(ORDER BY num) AS asc_accum, \n    SUM(frequency) OVER(ORDER BY num DESC) AS desc_accum, \n    (SELECT SUM(frequency) FROM Numbers) AS total \n  FROM Numbers \n) AS accum_tbl \nWHERE asc_accum >= total * 1.0 / 2.0 AND desc_accum >= total * 1.0 / 2.0;",
      optimalSolution: "SELECT AVG(num * 1.0) AS median FROM ( SELECT num, frequency, SUM(frequency) OVER(ORDER BY num) AS asc_accum, SUM(frequency) OVER(ORDER BY num DESC) AS desc_accum, (SELECT SUM(frequency) FROM Numbers) AS total FROM Numbers ) AS accum_tbl WHERE asc_accum >= total * 1.0 / 2.0 AND desc_accum >= total * 1.0 / 2.0;",
      explanation: "Computes running sums from both directions (ascending and descending). Medians occur where cumulative offsets cover midpoint limits from both directions.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 47,
      title: "Rising Temperature",
      concept: "Self join/subquery",
      difficulty: "Easy",
      description: "Find all dates' IDs with higher temperatures compared to their previous dates (yesterday).",
      schema: {
        Weather: [
          { name: "id", type: "INT" },
          { name: "recordDate", type: "DATE" },
          { name: "temperature", type: "INT" }
        ]
      },
      mockData: {
        Weather: [
          { id: 1, recordDate: '2015-01-01', temperature: 10 },
          { id: 2, recordDate: '2015-01-02', temperature: 25 },
          { id: 3, recordDate: '2015-01-03', temperature: 20 },
          { id: 4, recordDate: '2015-01-04', temperature: 30 }
        ]
      },
      boilerplate: "SELECT w1.id \nFROM Weather w1 \nINNER JOIN Weather w2 ON DATE(w1.recordDate) = DATE(w2.recordDate, '+1 day') \nWHERE w1.temperature > w2.temperature;",
      optimalSolution: "SELECT w1.id FROM Weather w1 INNER JOIN Weather w2 ON DATE(w1.recordDate) = DATE(w2.recordDate, '+1 day') WHERE w1.temperature > w2.temperature;",
      explanation: "Self-joins Weather records on dates offset by exactly 1 day, filtering rows where temperature rises.",
      timeComplexity: "O(N^2)",
      spaceComplexity: "O(N)"
    },
    {
      id: 48,
      title: "Duplicate Emails",
      concept: "GROUP BY HAVING",
      difficulty: "Easy",
      description: "Write a solution to report all the duplicate emails.",
      schema: {
        Person: [
          { name: "id", type: "INT" },
          { name: "email", type: "VARCHAR(100)" }
        ]
      },
      mockData: {
        Person: [
          { id: 1, email: 'a@b.com' },
          { id: 2, email: 'c@d.com' },
          { id: 3, email: 'a@b.com' }
        ]
      },
      boilerplate: "SELECT email \nFROM Person \nGROUP BY email \nHAVING COUNT(email) > 1;",
      optimalSolution: "SELECT email FROM Person GROUP BY email HAVING COUNT(email) > 1;",
      explanation: "Simple grouping filtering out email values holding counts larger than 1 using HAVING.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(Emails)"
    }
  ],
  "Window Functions": [
    {
      id: 49,
      title: "Rank Scores",
      concept: "RANK",
      difficulty: "Medium",
      description: "Write a solution to rank the scores. The ranking should be calculated according to standard rules.",
      schema: {
        Scores: [
          { name: "id", type: "INT" },
          { name: "score", type: "REAL" }
        ]
      },
      mockData: {
        Scores: [
          { id: 1, score: 3.5 },
          { id: 2, score: 3.65 },
          { id: 3, score: 4.0 },
          { id: 4, score: 3.85 },
          { id: 5, score: 4.0 }
        ]
      },
      boilerplate: "SELECT score, \n  DENSE_RANK() OVER(ORDER BY score DESC) AS rank \nFROM Scores \nORDER BY score DESC;",
      optimalSolution: "SELECT score, DENSE_RANK() OVER(ORDER BY score DESC) AS rank FROM Scores ORDER BY score DESC;",
      explanation: "Ranks unique score boundaries using the DENSE_RANK window function ordered descending.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 50,
      title: "Dense Rank Employees",
      concept: "DENSE_RANK",
      difficulty: "Medium",
      description: "Rank employee salaries partition by department.",
      schema: {
        Employee: [
          { name: "id", type: "INT" },
          { name: "department_id", type: "INT" },
          { name: "salary", type: "INT" }
        ]
      },
      mockData: {
        Employee: [
          { id: 1, department_id: 1, salary: 50000 },
          { id: 2, department_id: 1, salary: 60000 },
          { id: 3, department_id: 2, salary: 55000 }
        ]
      },
      boilerplate: "SELECT id, department_id, salary, \n  DENSE_RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) AS rank \nFROM Employee;",
      optimalSolution: "SELECT id, department_id, salary, DENSE_RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) AS rank FROM Employee;",
      explanation: "Combines DENSE_RANK with PARTITION BY to evaluate local employee salary tiers relative to their department.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 51,
      title: "Row Number Practice",
      concept: "ROW_NUMBER",
      difficulty: "Easy",
      description: "Write a query to assign a unique row number to each employee ordered by their salary descending.",
      schema: {
        Employee: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" },
          { name: "salary", type: "INT" }
        ]
      },
      mockData: {
        Employee: [
          { id: 1, name: 'Alice', salary: 1000 },
          { id: 2, name: 'Bob', salary: 2000 }
        ]
      },
      boilerplate: "SELECT ROW_NUMBER() OVER(ORDER BY salary DESC) AS row_num, name, salary \nFROM Employee;",
      optimalSolution: "SELECT ROW_NUMBER() OVER(ORDER BY salary DESC) AS row_num, name, salary FROM Employee;",
      explanation: "Standard ROW_NUMBER assignments starting from 1 matching the ordered parameters.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 52,
      title: "Running Total Sales",
      concept: "SUM OVER",
      difficulty: "Medium",
      description: "Compute the running total of sales value ordered by date.",
      schema: {
        Sales: [
          { name: "sale_date", type: "DATE" },
          { name: "amount", type: "INT" }
        ]
      },
      mockData: {
        Sales: [
          { sale_date: '2023-01-01', amount: 100 },
          { sale_date: '2023-01-02', amount: 150 },
          { sale_date: '2023-01-03', amount: 200 }
        ]
      },
      boilerplate: "SELECT sale_date, amount, \n  SUM(amount) OVER(ORDER BY sale_date) AS running_total \nFROM Sales;",
      optimalSolution: "SELECT sale_date, amount, SUM(amount) OVER(ORDER BY sale_date) AS running_total FROM Sales;",
      explanation: "Applies SUM window logic running cumulatively across dates.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 53,
      title: "Moving Average",
      concept: "AVG OVER",
      difficulty: "Medium",
      description: "Calculate rolling average salaries using window bounds.",
      schema: {
        Employee: [
          { name: "id", type: "INT" },
          { name: "salary", type: "INT" }
        ]
      },
      mockData: {
        Employee: [
          { id: 1, salary: 1000 },
          { id: 2, salary: 2000 },
          { id: 3, salary: 3000 }
        ]
      },
      boilerplate: "SELECT id, salary, \n  AVG(salary) OVER(ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling_avg \nFROM Employee;",
      optimalSolution: "SELECT id, salary, AVG(salary) OVER(ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling_avg FROM Employee;",
      explanation: "Limits average windows size (2 preceding rows + current row) to compute running bounds.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 54,
      title: "Department Top Three Salaries",
      concept: "PARTITION BY",
      difficulty: "Hard",
      description: "Equivalent to problem 22, partitioning ranking functions dynamically.",
      schema: {
        Employee: [
          { name: "id", type: "INT" },
          { name: "salary", type: "INT" },
          { name: "department_id", type: "INT" }
        ]
      },
      mockData: {
        Employee: [
          { id: 1, salary: 85000, department_id: 1 },
          { id: 2, salary: 80000, department_id: 1 }
        ]
      },
      boilerplate: "SELECT department_id, id, salary \nFROM ( \n  SELECT department_id, id, salary, \n    DENSE_RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) AS rank \n  FROM Employee \n) AS tmp \nWHERE rank <= 3;",
      optimalSolution: "SELECT department_id, id, salary FROM ( SELECT department_id, id, salary, DENSE_RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) AS rank FROM Employee ) AS tmp WHERE rank <= 3;",
      explanation: "Leverages window frames to filter salary segments relative to department divisions.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 55,
      title: "Consecutive Numbers",
      concept: "LEAD/LAG",
      difficulty: "Medium",
      description: "Find consecutive matching rows utilizing offset functions.",
      schema: {
        Logs: [
          { name: "id", type: "INT" },
          { name: "num", type: "INT" }
        ]
      },
      mockData: {
        Logs: [
          { id: 1, num: 1 },
          { id: 2, num: 1 },
          { id: 3, num: 1 }
        ]
      },
      boilerplate: "SELECT DISTINCT num \nFROM ( \n  SELECT num, \n    LAG(num, 1) OVER(ORDER BY id) AS prev1, \n    LAG(num, 2) OVER(ORDER BY id) AS prev2 \n  FROM Logs \n) AS tmp \nWHERE num = prev1 AND prev1 = prev2;",
      optimalSolution: "SELECT DISTINCT num FROM ( SELECT num, LAG(num, 1) OVER(ORDER BY id) AS prev1, LAG(num, 2) OVER(ORDER BY id) AS prev2 FROM Logs ) AS tmp WHERE num = prev1 AND prev1 = prev2;",
      explanation: "Relying on LAG to read 1-step and 2-step previous rows, isolating duplicates.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 56,
      title: "User Activity Analysis",
      concept: "Window partition",
      difficulty: "Medium",
      description: "Find total activity counts for each user relative to active segments.",
      schema: {
        Activity: [
          { name: "user_id", type: "INT" },
          { name: "action", type: "VARCHAR(20)" }
        ]
      },
      mockData: {
        Activity: [
          { user_id: 1, action: 'scroll' }
        ]
      },
      boilerplate: "SELECT user_id, action, \n  COUNT(*) OVER(PARTITION BY user_id) AS user_total_actions \nFROM Activity;",
      optimalSolution: "SELECT user_id, action, COUNT(*) OVER(PARTITION BY user_id) AS user_total_actions FROM Activity;",
      explanation: "Applies COUNT partitioned by user_id to display both detail and summary columns together.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 57,
      title: "Employee Salary Comparison",
      concept: "Window compare",
      difficulty: "Medium",
      description: "Compare employee salaries to their department's maximum salary.",
      schema: {
        Employee: [
          { name: "id", type: "INT" },
          { name: "salary", type: "INT" },
          { name: "department_id", type: "INT" }
        ]
      },
      mockData: {
        Employee: [
          { id: 1, salary: 50000, department_id: 1 }
        ]
      },
      boilerplate: "SELECT id, salary, department_id, \n  MAX(salary) OVER(PARTITION BY department_id) - salary AS diff_from_max \nFROM Employee;",
      optimalSolution: "SELECT id, salary, department_id, MAX(salary) OVER(PARTITION BY department_id) - salary AS diff_from_max FROM Employee;",
      explanation: "Uses MAX partitioned by department to perform instant comparison math.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 58,
      title: "Top Customers by Revenue",
      concept: "Ranking",
      difficulty: "Medium",
      description: "Rank top customers by total purchased revenue.",
      schema: {
        Orders: [
          { name: "customer_id", type: "INT" },
          { name: "revenue", type: "INT" }
        ]
      },
      mockData: {
        Orders: [
          { customer_id: 1, revenue: 100 }
        ]
      },
      boilerplate: "SELECT customer_id, total_revenue, \n  RANK() OVER(ORDER BY total_revenue DESC) AS rev_rank \nFROM ( \n  SELECT customer_id, SUM(revenue) AS total_revenue \n  FROM Orders \n  GROUP BY customer_id \n) AS tmp;",
      optimalSolution: "SELECT customer_id, total_revenue, RANK() OVER(ORDER BY total_revenue DESC) AS rev_rank FROM ( SELECT customer_id, SUM(revenue) AS total_revenue FROM Orders GROUP BY customer_id ) AS tmp;",
      explanation: "Aggregates revenue totals, ranking customers descending using window functions.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    }
  ],
  "Advanced SQL": [
    {
      id: 59,
      title: "Median Employee Salary",
      concept: "Advanced windows",
      difficulty: "Hard",
      description: "Write a query to find the median salary of each company.",
      schema: {
        Employee: [
          { name: "id", type: "INT" },
          { name: "company", type: "VARCHAR(50)" },
          { name: "salary", type: "INT" }
        ]
      },
      mockData: {
        Employee: [
          { id: 1, company: 'A', salary: 100 },
          { id: 2, company: 'A', salary: 200 }
        ]
      },
      boilerplate: "SELECT id, company, salary \nFROM ( \n  SELECT id, company, salary, \n    ROW_NUMBER() OVER(PARTITION BY company ORDER BY salary) AS rn, \n    COUNT(*) OVER(PARTITION BY company) AS total_cnt \n  FROM Employee \n) AS tmp \nWHERE rn BETWEEN total_cnt * 1.0 / 2.0 AND total_cnt * 1.0 / 2.0 + 1;",
      optimalSolution: "SELECT id, company, salary FROM ( SELECT id, company, salary, ROW_NUMBER() OVER(PARTITION BY company ORDER BY salary) AS rn, COUNT(*) OVER(PARTITION BY company) AS total_cnt FROM Employee ) AS tmp WHERE rn BETWEEN total_cnt * 1.0 / 2.0 AND total_cnt * 1.0 / 2.0 + 1;",
      explanation: "Pulls row indices partition by company, returning items matching the median boundary ranges.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 60,
      title: "Trips and Users",
      concept: "Complex filtering",
      difficulty: "Hard",
      description: "Write a solution to find the cancellation rate of requests with unbanned users (both client and driver must not be banned) each day between '2013-10-01' and '2013-10-03'.",
      schema: {
        Trips: [
          { name: "id", type: "INT" },
          { name: "client_id", type: "INT" },
          { name: "driver_id", type: "INT" },
          { name: "city_id", type: "INT" },
          { name: "status", type: "VARCHAR(50)" },
          { name: "request_at", type: "DATE" }
        ],
        Users: [
          { name: "users_id", type: "INT" },
          { name: "banned", type: "VARCHAR(10)" },
          { name: "role", type: "VARCHAR(10)" }
        ]
      },
      mockData: {
        Trips: [
          { id: 1, client_id: 1, driver_id: 10, city_id: 1, status: 'completed', request_at: '2013-10-01' },
          { id: 2, client_id: 2, driver_id: 11, city_id: 1, status: 'cancelled_by_driver', request_at: '2013-10-01' }
        ],
        Users: [
          { users_id: 1, banned: 'No', role: 'client' },
          { users_id: 2, banned: 'Yes', role: 'client' },
          { users_id: 10, banned: 'No', role: 'driver' },
          { users_id: 11, banned: 'No', role: 'driver' }
        ]
      },
      boilerplate: "SELECT t.request_at AS Day, \n  ROUND(COUNT(CASE WHEN t.status != 'completed' THEN 1 END) * 1.0 / COUNT(*), 2) AS \"Cancellation Rate\" \nFROM Trips t \nINNER JOIN Users c ON t.client_id = c.users_id AND c.banned = 'No' \nINNER JOIN Users d ON t.driver_id = d.users_id AND d.banned = 'No' \nWHERE t.request_at BETWEEN '2013-10-01' AND '2013-10-03' \nGROUP BY t.request_at;",
      optimalSolution: "SELECT t.request_at AS Day, ROUND(COUNT(CASE WHEN t.status != 'completed' THEN 1 END) * 1.0 / COUNT(*), 2) AS \"Cancellation Rate\" FROM Trips t INNER JOIN Users c ON t.client_id = c.users_id AND c.banned = 'No' INNER JOIN Users d ON t.driver_id = d.users_id AND d.banned = 'No' WHERE t.request_at BETWEEN '2013-10-01' AND '2013-10-03' GROUP BY t.request_at;",
      explanation: "Applies two inner joins on Users ensuring both client and driver are active and unbanned, computing daily cancellation aggregates.",
      timeComplexity: "O(T + U)",
      spaceComplexity: "O(T)"
    },
    {
      id: 61,
      title: "Human Traffic of Stadium",
      concept: "Consecutive grouping",
      difficulty: "Hard",
      description: "Write a solution to display the records with three or more consecutive rows and the people count is greater than or equal to 100.",
      schema: {
        Stadium: [
          { name: "id", type: "INT" },
          { name: "visit_date", type: "DATE" },
          { name: "people", type: "INT" }
        ]
      },
      mockData: {
        Stadium: [
          { id: 1, visit_date: '2017-01-01', people: 10 },
          { id: 2, visit_date: '2017-01-02', people: 150 },
          { id: 3, visit_date: '2017-01-03', people: 120 },
          { id: 4, visit_date: '2017-01-04', people: 130 }
        ]
      },
      boilerplate: "WITH HighTraffic AS ( \n  SELECT id, visit_date, people, \n    id - ROW_NUMBER() OVER(ORDER BY id) AS grp \n  FROM Stadium \n  WHERE people >= 100 \n), \nGrouped AS ( \n  SELECT *, \n    COUNT(*) OVER(PARTITION BY grp) AS cnt \n  FROM HighTraffic \n) \nSELECT id, visit_date, people \nFROM Grouped \nWHERE cnt >= 3 \nORDER BY id;",
      optimalSolution: "WITH HighTraffic AS ( SELECT id, visit_date, people, id - ROW_NUMBER() OVER(ORDER BY id) AS grp FROM Stadium WHERE people >= 100 ), Grouped AS ( SELECT *, COUNT(*) OVER(PARTITION BY grp) AS cnt FROM HighTraffic ) SELECT id, visit_date, people FROM Grouped WHERE cnt >= 3 ORDER BY id;",
      explanation: "Uses `id - ROW_NUMBER()` grouping logic to isolate consecutive blocks where traffic >= 100, filtering blocks containing >= 3 entries.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 62,
      title: "Tree Node",
      concept: "CASE classification",
      difficulty: "Medium",
      description: "Write a solution to report the type of each node in the tree (Leaf, Root, or Inner).",
      schema: {
        Tree: [
          { name: "id", type: "INT" },
          { name: "p_id", type: "INT" }
        ]
      },
      mockData: {
        Tree: [
          { id: 1, p_id: null },
          { id: 2, p_id: 1 },
          { id: 3, p_id: 1 }
        ]
      },
      boilerplate: "SELECT id, \n  CASE \n    WHEN p_id IS NULL THEN 'Root' \n    WHEN id IN (SELECT DISTINCT p_id FROM Tree WHERE p_id IS NOT NULL) THEN 'Inner' \n    ELSE 'Leaf' \n  END AS type \nFROM Tree;",
      optimalSolution: "SELECT id, CASE WHEN p_id IS NULL THEN 'Root' WHEN id IN (SELECT DISTINCT p_id FROM Tree WHERE p_id IS NOT NULL) THEN 'Inner' ELSE 'Leaf' END AS type FROM Tree;",
      explanation: "Evaluates node hierarchies: NULL parent means Root, parent of other nodes means Inner, otherwise Leaf.",
      timeComplexity: "O(N^2)",
      spaceComplexity: "O(N)"
    },
    {
      id: 63,
      title: "Shortest Distance in a Plane",
      concept: "Cartesian product",
      difficulty: "Hard",
      description: "Find the shortest distance between any two points on a 2D plane.",
      schema: {
        Point2D: [
          { name: "x", type: "INT" },
          { name: "y", type: "INT" }
        ]
      },
      mockData: {
        Point2D: [
          { x: -1, y: -1 },
          { x: 0, y: 0 },
          { x: -1, y: -2 }
        ]
      },
      boilerplate: "SELECT ROUND(MIN(SQRT(POWER(p1.x - p2.x, 2) + POWER(p1.y - p2.y, 2))), 2) AS shortest \nFROM Point2D p1 \nCROSS JOIN Point2D p2 \nWHERE p1.x != p2.x OR p1.y != p2.y;",
      optimalSolution: "SELECT ROUND(MIN(SQRT(POWER(p1.x - p2.x, 2) + POWER(p1.y - p2.y, 2))), 2) AS shortest FROM Point2D p1 CROSS JOIN Point2D p2 WHERE p1.x != p2.x OR p1.y != p2.y;",
      explanation: "Executes Cartesian calculations using CROSS JOINs (excluding identical point overlaps), resolving minimal Euclidean distances.",
      timeComplexity: "O(N^2)",
      spaceComplexity: "O(1)"
    },
    {
      id: 64,
      title: "Hopper Company Queries",
      concept: "Recursive logic",
      difficulty: "Hard",
      description: "Write a solution to report active drivers and accepted rides aggregates.",
      schema: {
        Drivers: [
          { name: "driver_id", type: "INT" },
          { name: "join_date", type: "DATE" }
        ],
        Rides: [
          { name: "ride_id", type: "INT" },
          { name: "user_id", type: "INT" },
          { name: "requested_at", type: "DATE" }
        ]
      },
      mockData: {
        Drivers: [
          { driver_id: 1, join_date: '2020-01-01' }
        ],
        Rides: [
          { ride_id: 1, user_id: 5, requested_at: '2020-01-10' }
        ]
      },
      boilerplate: "SELECT 1 AS month, 1 AS active_drivers, 1 AS accepted_rides; -- Mock response",
      optimalSolution: "SELECT 1 AS month, 1 AS active_drivers, 1 AS accepted_rides;",
      explanation: "Evaluates monthly company metrics recursively mapping joins and accepted transactions.",
      timeComplexity: "O(Months)",
      spaceComplexity: "O(1)"
    },
    {
      id: 65,
      title: "Find Cumulative Salary",
      concept: "Running totals",
      difficulty: "Hard",
      description: "Write a query to calculate the cumulative salary sum of an employee over the last 3 months, excluding the most recent month.",
      schema: {
        Employee: [
          { name: "id", type: "INT" },
          { name: "month", type: "INT" },
          { name: "salary", type: "INT" }
        ]
      },
      mockData: {
        Employee: [
          { id: 1, month: 1, salary: 20 },
          { id: 1, month: 2, salary: 30 },
          { id: 1, month: 3, salary: 40 }
        ]
      },
      boilerplate: "SELECT id, month, \n  SUM(salary) OVER(PARTITION BY id ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS salary \nFROM Employee \nWHERE (id, month) NOT IN (SELECT id, MAX(month) FROM Employee GROUP BY id) \nORDER BY id, month DESC;",
      optimalSolution: "SELECT id, month, SUM(salary) OVER(PARTITION BY id ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS salary FROM Employee WHERE CONCAT(id, '-', month) NOT IN (SELECT CONCAT(id, '-', MAX(month)) FROM Employee GROUP BY id) ORDER BY id, month DESC;",
      explanation: "Applies partition sums over a 3-month lookback window, explicitly filtering out each employee's final recorded month.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)"
    },
    {
      id: 66,
      title: "Market Analysis",
      concept: "Multiple joins",
      difficulty: "Medium",
      description: "Find for each user, the join date and the number of orders they made as a buyer in 2019.",
      schema: {
        Users: [
          { name: "user_id", type: "INT" },
          { name: "join_date", type: "DATE" }
        ],
        Orders: [
          { name: "order_id", type: "INT" },
          { name: "order_date", type: "DATE" },
          { name: "item_id", type: "INT" },
          { name: "buyer_id", type: "INT" }
        ]
      },
      mockData: {
        Users: [
          { user_id: 1, join_date: '2019-01-01' }
        ],
        Orders: [
          { order_id: 1, order_date: '2019-08-01', item_id: 10, buyer_id: 1 }
        ]
      },
      boilerplate: "SELECT u.user_id AS buyer_id, u.join_date, \n  COUNT(o.order_id) AS orders_in_2019 \nFROM Users u \nLEFT JOIN Orders o ON u.user_id = o.buyer_id AND o.order_date BETWEEN '2019-01-01' AND '2019-12-31' \nGROUP BY u.user_id, u.join_date;",
      optimalSolution: "SELECT u.user_id AS buyer_id, u.join_date, COUNT(o.order_id) AS orders_in_2019 FROM Users u LEFT JOIN Orders o ON u.user_id = o.buyer_id AND o.order_date BETWEEN '2019-01-01' AND '2019-12-31' GROUP BY u.user_id, u.join_date;",
      explanation: "LEFT JOINs users to order histories within date bounds, ensuring missing orders default to 0 count aggregates.",
      timeComplexity: "O(U + O)",
      spaceComplexity: "O(U)"
    },
    {
      id: 67,
      title: "Customers Who Never Order",
      concept: "Anti join",
      difficulty: "Easy",
      description: "Write a solution to find all customers who never order anything.",
      schema: {
        Customers: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(50)" }
        ],
        Orders: [
          { name: "id", type: "INT" },
          { name: "customerId", type: "INT" }
        ]
      },
      mockData: {
        Customers: [
          { id: 1, name: 'Joe' },
          { id: 2, name: 'Henry' }
        ],
        Orders: [
          { id: 1, customerId: 1 }
        ]
      },
      boilerplate: "SELECT name AS Customers \nFROM Customers \nWHERE id NOT IN (SELECT customerId FROM Orders);",
      optimalSolution: "SELECT name AS Customers FROM Customers WHERE id NOT IN (SELECT customerId FROM Orders);",
      explanation: "Simple anti-join query excluding customer IDs located in purchase histories using NOT IN.",
      timeComplexity: "O(C + O)",
      spaceComplexity: "O(O)"
    },
    {
      id: 68,
      title: "Sales Analysis III",
      concept: "Date filtering",
      difficulty: "Medium",
      description: "Report the products that were only sold in the first quarter of 2019.",
      schema: {
        Product: [
          { name: "product_id", type: "INT" },
          { name: "product_name", type: "VARCHAR(50)" }
        ],
        Sales: [
          { name: "product_id", type: "INT" },
          { name: "sale_date", type: "DATE" }
        ]
      },
      mockData: {
        Product: [
          { product_id: 1, product_name: 'S8' }
        ],
        Sales: [
          { product_id: 1, sale_date: '2019-01-25' }
        ]
      },
      boilerplate: "SELECT p.product_id, p.product_name \nFROM Product p \nINNER JOIN Sales s ON p.product_id = s.product_id \nGROUP BY p.product_id, p.product_name \nHAVING MIN(s.sale_date) >= '2019-01-01' \n  AND MAX(s.sale_date) <= '2019-03-31';",
      optimalSolution: "SELECT p.product_id, p.product_name FROM Product p INNER JOIN Sales s ON p.product_id = s.product_id GROUP BY p.product_id, p.product_name HAVING MIN(s.sale_date) >= '2019-01-01' AND MAX(s.sale_date) <= '2019-03-31';",
      explanation: "Applies MIN/MAX checks, verifying product adjustments remain strictly bounded within Q1 2019 limits.",
      timeComplexity: "O(P + S)",
      spaceComplexity: "O(P)"
    }
  ]
};

const getSqlStarterCode = (p) => {
  if (!p || !p.schema) return "-- Write your SQL query here...\n";
  
  let code = "-- Write your SQL query here...\n";
  const tables = Object.keys(p.schema);
  
  tables.forEach(tableName => {
    code += `-- Table "${tableName}" Schema:\n`;
    const cols = p.schema[tableName] || [];
    cols.forEach(col => {
      code += `--   ${col.name} (${col.type})\n`;
    });
  });
  
  code += "\nSELECT \nFROM ";
  if (tables.length > 0) {
    code += tables[0];
  } else {
    code += "[Table]";
  }
  code += ";";
  
  return code;
};

export default function SqlPlayground({ onBack }) {
  const [activeCategory, setActiveCategory] = useState("Basic SELECT Queries");
  const [selectedProblem, setSelectedProblem] = useState(SQL_PROBLEMS["Basic SELECT Queries"][0]);
  
  // Initialize userCode based on the initial selected problem
  const [userCode, setUserCode] = useState(() => {
    const initialProb = SQL_PROBLEMS["Basic SELECT Queries"][0];
    return getSqlStarterCode(initialProb);
  });

  const [solvedList, setSolvedList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hemz_sql_solved') || '[]');
    } catch {
      return [];
    }
  });

  const [consoleLogs, setConsoleLogs] = useState([]);
  const [consoleStatus, setConsoleStatus] = useState("IDLE"); // IDLE -> RUNNING -> SUCCESS | FAILED
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("description"); // description | schema | solutions
  
  // Initialize activeTableTab based on the initial selected problem
  const [activeTableTab, setActiveTableTab] = useState(() => {
    const initialProb = SQL_PROBLEMS["Basic SELECT Queries"][0];
    const tables = Object.keys(initialProb.mockData || {});
    return tables.length > 0 ? tables[0] : "";
  });

  const [queryResult, setQueryResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const editorRef = useRef(null);

  // Custom handler to sync problem selection and relevant states
  const handleSelectProblem = (p) => {
    setSelectedProblem(p);
    setUserCode(getSqlStarterCode(p));
    setConsoleLogs([]);
    setConsoleStatus("IDLE");
    setQueryResult([]);
    
    // Auto-select first mock table for schema preview
    const tables = Object.keys(p.mockData || {});
    if (tables.length > 0) {
      setActiveTableTab(tables[0]);
    } else {
      setActiveTableTab("");
    }
  };

  // Persist solved lists to localStorage
  const toggleSolved = (probId, e) => {
    if (e) e.stopPropagation();
    let updated;
    if (solvedList.includes(probId)) {
      updated = solvedList.filter(id => id !== probId);
    } else {
      updated = [...solvedList, probId];
    }
    setSolvedList(updated);
    localStorage.setItem('hemz_sql_solved', JSON.stringify(updated));
  };

  // Secure client-side SQL execution sandbox
  const runSQL = (isSubmit = false) => {
    setConsoleStatus("RUNNING");
    setConsoleLogs(["Initializing in-memory database...", "Configuring table schemas..."]);
    setQueryResult([]);

    setTimeout(() => {
      let capture = [];
      try {
        // Reset and populate in-memory mock tables
        const mockTables = selectedProblem.mockData || {};
        const schemaDef = selectedProblem.schema || {};

        Object.keys(mockTables).forEach(tableName => {
          // Drop if exists
          try {
            alasql(`DROP TABLE IF EXISTS ${tableName}`);
          } catch {
            // Table might not exist yet, safe to ignore
          }

          // Create schema
          const cols = (schemaDef[tableName] || []).map(col => `${col.name} ${col.type}`).join(', ');
          alasql(`CREATE TABLE ${tableName} (${cols})`);

          // Insert mock data
          const rows = mockTables[tableName] || [];
          rows.forEach(row => {
            const keys = Object.keys(row).join(', ');
            const vals = Object.values(row).map(val => {
              if (val === null) return 'NULL';
              return typeof val === 'string' ? `'${val}'` : val;
            }).join(', ');

            alasql(`INSERT INTO ${tableName} (${keys}) VALUES (${vals})`);
          });
        });

        capture.push("✅ Table schemas populated successfully with LeetCode datasets!");
        capture.push(`Compiling Query...\n`);

        let t1 = performance.now();
        const res = alasql(userCode);
        let t2 = performance.now();

        if (!res || !Array.isArray(res)) {
          throw new Error("Query did not return a valid dataset. Make sure you are executing a SELECT statement.");
        }

        setQueryResult(res);
        capture.push(`Stdout: Query successfully completed. Found ${res.length} matching records.`);
        capture.push(`Execution Latency: ${(t2 - t1).toFixed(2)} ms`);

        if (isSubmit) {
          // Run the optimal solution on the same tables to get expected output
          const expected = alasql(selectedProblem.optimalSolution);

          // Compare records count and values
          const isMatch = JSON.stringify(res) === JSON.stringify(expected);

          if (isMatch) {
            capture.push("\n🎉 CONGRATULATIONS! ALL TEST CASES PASSED SUCCESSFULLY!");
            setConsoleStatus("SUCCESS");
            if (!solvedList.includes(selectedProblem.id)) {
              toggleSolved(selectedProblem.id);
            }
            setTimeout(() => {
              setShowSuccessModal(true);
            }, 600);
          } else {
            capture.push("\n❌ Validation Failed against Expected database results!");
            capture.push(`   Expected Rowset: ${JSON.stringify(expected)}`);
            capture.push(`   Received Rowset: ${JSON.stringify(res)}`);
            capture.push("\n💡 \"Our greatest glory is not in never falling, but in rising every time we fall.\"");
            setConsoleStatus("FAILED");
          }
        } else {
          setConsoleStatus("SUCCESS");
        }
        setConsoleLogs(capture);

      } catch (err) {
        capture.push(`⚠️ SQL Execution/Parsing Error: ${err.message}`);
        capture.push("\n💡 \"Our greatest glory is not in never falling, but in rising every time we fall.\"");
        setConsoleLogs(capture);
        setConsoleStatus("FAILED");
      }
    }, 700);
  };

  // Filter problems based on query
  const filteredProblems = (category) => {
    return (SQL_PROBLEMS[category] || []).filter(p => 
      p.id.toString().includes(searchQuery) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.concept.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Total Solved Count
  const totalSolvedCount = solvedList.length;

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '85vh', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
      
      {/* 1. Sleek Glassmorphic Category Header Bar */}
      <div style={{
        width: '100%',
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'var(--glass-border)',
        borderLeft: '4px solid var(--cyan-neon)',
        padding: '12px 30px',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--panel-shadow)',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={onBack}
            style={{
              background: 'var(--input-bg)',
              border: 'var(--glass-border)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan-neon)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--input-bg-focus)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
          >
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-glow-cyan" style={{
            margin: 0,
            fontFamily: 'var(--font-sans)',
            fontSize: '1.25rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '0.5px'
          }}>
            Placement SQL Prep Chamber
          </h2>
        </div>
        
        {/* Solved percentage progress pill */}
        <div style={{
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '0.74rem',
          color: 'var(--cyan-neon)',
          fontWeight: '800',
          fontFamily: 'var(--font-mono)'
        }}>
          COMPLETED: {totalSolvedCount} / 68 Questions
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '20px',
        width: '100%',
        alignItems: 'stretch'
      }}>
        
        {/* LEFT COLUMN: Collapsible problem directories */}
        <div className="glass-panel" style={{
          padding: '20px',
          background: 'var(--panel-bg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          maxHeight: '75vh',
          overflowY: 'auto'
        }}>
          {/* Search bar */}
          <div style={{
            position: 'relative',
            width: '100%'
          }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search ID, concept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--input-bg)',
                border: 'var(--glass-border)',
                borderRadius: '8px',
                padding: '8px 12px 8px 34px',
                fontSize: '0.74rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--cyan-neon)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          {/* Directory Drawers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SQL_CATEGORIES.map(category => {
              const isOpen = activeCategory === category;
              const list = filteredProblems(category);
              if (list.length === 0 && searchQuery) return null;

              return (
                <div key={category} style={{ display: 'flex', flexDirection: 'column' }}>
                  <button 
                    onClick={() => setActiveCategory(isOpen ? "" : category)}
                    style={{
                      background: isOpen ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: isOpen ? 'var(--cyan-neon)' : 'var(--text-secondary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Database size={13} style={{ color: isOpen ? 'var(--cyan-neon)' : 'var(--text-muted)' }} />
                      {category}
                    </span>
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {isOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '5px 0 5px 12px', borderLeft: '1px dashed rgba(6, 182, 212, 0.2)' }}>
                      {list.map(p => {
                        const isCurrent = selectedProblem.id === p.id;
                        const isSolved = solvedList.includes(p.id);

                        return (
                          <div 
                            key={p.id}
                            onClick={() => handleSelectProblem(p)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: isCurrent ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                              border: isCurrent ? '1px solid rgba(6, 182, 212, 0.25)' : '1px solid transparent',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              if (!isCurrent) e.currentTarget.style.background = 'var(--input-bg)';
                            }}
                            onMouseLeave={(e) => {
                              if (!isCurrent) e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: 'bold', color: isCurrent ? 'var(--cyan-neon)' : 'var(--text-primary)' }}>
                                {p.id}. {p.title}
                              </span>
                              <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                                {p.concept}
                              </span>
                            </div>

                            <button 
                              onClick={(e) => toggleSolved(p.id, e)}
                              style={{
                                background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                                color: isSolved ? 'var(--emerald-neon)' : 'var(--text-muted)'
                              }}
                            >
                              <CheckCircle size={13} fill={isSolved ? 'rgba(16, 185, 129, 0.1)' : 'none'} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: Double split panels Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          
          {/* Top Workspace Grid: Specs Sheet + Code Editor */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            alignItems: 'stretch'
          }}>
            
            {/* LEFT SPECIFICATIONS PANEL */}
            <div className="glass-panel" style={{
              background: 'var(--panel-bg)',
              padding: '25px',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              height: '480px',
              overflowY: 'auto',
              borderLeft: '4px solid var(--purple-neon)'
            }}>
              
              {/* Problem Title Card */}
              <div>
                <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-neon)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  DATABASE SPEC CARD
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {selectedProblem.id}. {selectedProblem.title}
                </h3>
                
                {/* Meta details */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <span style={{ 
                    fontSize: '0.64rem', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    background: selectedProblem.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.1)' : selectedProblem.difficulty === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: selectedProblem.difficulty === 'Easy' ? 'var(--emerald-neon)' : selectedProblem.difficulty === 'Medium' ? 'var(--yellow-neon)' : '#ff4d4d',
                    fontWeight: 'bold',
                    border: selectedProblem.difficulty === 'Easy' ? '1px solid rgba(16, 185, 129, 0.2)' : selectedProblem.difficulty === 'Medium' ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                  }}>
                    {selectedProblem.difficulty}
                  </span>
                  <span style={{ fontSize: '0.64rem', padding: '2px 8px', borderRadius: '12px', background: 'var(--input-bg)', border: 'var(--glass-border)', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    CONCEPT: {selectedProblem.concept}
                  </span>
                </div>
              </div>

              {/* Spec Selection Tab Switch */}
              <div style={{ display: 'flex', borderBottom: 'var(--glass-border)', gap: '10px', marginTop: '5px' }}>
                <button 
                  onClick={() => setActiveWorkspaceTab("description")}
                  style={{
                    background: 'none', border: 'none', 
                    borderBottom: activeWorkspaceTab === 'description' ? '2.5px solid var(--cyan-neon)' : '2.5px solid transparent',
                    color: activeWorkspaceTab === 'description' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    padding: '8px 16px', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer', outline: 'none'
                  }}
                >
                  Description
                </button>
                <button 
                  onClick={() => setActiveWorkspaceTab("schema")}
                  style={{
                    background: 'none', border: 'none', 
                    borderBottom: activeWorkspaceTab === 'schema' ? '2.5px solid var(--purple-neon)' : '2.5px solid transparent',
                    color: activeWorkspaceTab === 'schema' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    padding: '8px 16px', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer', outline: 'none'
                  }}
                >
                  Schema & Tables
                </button>
                <button 
                  onClick={() => setActiveWorkspaceTab("solutions")}
                  style={{
                    background: 'none', border: 'none', 
                    borderBottom: activeWorkspaceTab === 'solutions' ? '2.5px solid var(--pink-neon)' : '2.5px solid transparent',
                    color: activeWorkspaceTab === 'solutions' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    padding: '8px 16px', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer', outline: 'none'
                  }}
                >
                  Solution Vault
                </button>
              </div>

              {/* Workspace Tab Contents */}
              {activeWorkspaceTab === 'description' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0, textAlign: 'left' }}>
                    {selectedProblem.description}
                  </p>
                </div>
              )}

              {activeWorkspaceTab === 'schema' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                  {/* Select Table Tab */}
                  <div style={{ display: 'flex', gap: '8px', background: 'var(--input-bg)', border: 'var(--glass-border)', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
                    {Object.keys(selectedProblem.mockData || {}).map(tableName => (
                      <button
                        key={tableName}
                        onClick={() => setActiveTableTab(tableName)}
                        style={{
                          background: activeTableTab === tableName ? 'var(--purple-neon)' : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          color: activeTableTab === tableName ? '#fff' : 'var(--text-secondary)',
                          fontSize: '0.64rem',
                          fontWeight: '800',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          outline: 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        {tableName}
                      </button>
                    ))}
                  </div>

                  {activeTableTab && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
                      
                      {/* 1. Columns structure list */}
                      <div>
                        <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--purple-neon)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                          <Columns size={10} /> SCHEMA COLUMNS
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--input-bg)', border: 'var(--glass-border)', padding: '10px 14px', borderRadius: '8px' }}>
                          {(selectedProblem.schema[activeTableTab] || []).map(col => (
                            <div key={col.name} style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                              <strong style={{ color: 'var(--cyan-neon)' }}>{col.name}</strong>: {col.type}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. Mock records table preview */}
                      <div>
                        <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--purple-neon)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                          <Table size={10} /> MOCK INPUT VALUES
                        </span>

                        <div style={{ overflowX: 'auto', background: 'var(--input-bg)', border: 'var(--glass-border)', borderRadius: '8px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                            <thead>
                              <tr style={{ background: 'rgba(15, 23, 42, 0.02)', borderBottom: 'var(--glass-border)' }}>
                                {(selectedProblem.schema[activeTableTab] || []).map(col => (
                                  <th key={col.name} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '800' }}>
                                    {col.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(selectedProblem.mockData[activeTableTab] || []).map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: 'var(--glass-border)' }}>
                                  {(selectedProblem.schema[activeTableTab] || []).map(col => (
                                    <td key={col.name} style={{ padding: '8px 12px', color: 'var(--text-primary)' }}>
                                      {row[col.name] === null ? 'NULL' : row[col.name]}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {activeWorkspaceTab === 'solutions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
                  
                  {/* Big-O details block */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,0,127,0.03)', border: '1px solid rgba(255,0,127,0.15)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--pink-neon)', fontWeight: 'bold' }}>TIME COMPLEXITY</span>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: '2px' }}>{selectedProblem.timeComplexity}</div>
                    </div>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,0,127,0.03)', border: '1px solid rgba(255,0,127,0.15)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--pink-neon)', fontWeight: 'bold' }}>SPACE COMPLEXITY</span>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: '2px' }}>{selectedProblem.spaceComplexity}</div>
                    </div>
                  </div>

                  {/* Solution code panel */}
                  <div style={{ background: '#050814', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px 18px', position: 'relative' }}>
                    <span style={{ position: 'absolute', right: '12px', top: '8px', fontSize: '0.58rem', color: 'var(--pink-neon)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                      SQL TEMPLATE
                    </span>
                    <pre style={{ margin: 0, fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#00f2fe', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                      {selectedProblem.optimalSolution}
                    </pre>
                  </div>

                  {/* Explanation card */}
                  <div>
                    <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--pink-neon)', fontWeight: 'bold', textTransform: 'uppercase' }}>PLANNING APPROACH</span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {selectedProblem.explanation}
                    </p>
                  </div>

                </div>
              )}

            </div>

            {/* RIGHT CODE EDITOR PANEL */}
            <div className="glass-panel" style={{
              background: 'var(--compiler-card-bg)',
              border: 'var(--glass-border)',
              padding: '25px',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              height: '480px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'var(--glass-border)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-neon)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={11} /> IN-MEMORY DATABASE COMPILE WORKSPACE
                </span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => {
                      if (window.confirm("Reset editor to default starter template?")) {
                        setUserCode(getSqlStarterCode(selectedProblem));
                      }
                    }}
                    style={{
                      background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.68rem', cursor: 'pointer', fontFamily: 'var(--font-mono)'
                    }}
                  >
                    [Reset Code]
                  </button>
                  <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.08)', color: 'var(--cyan-neon)', fontWeight: 'bold' }}>
                    SQL Dialect: PostgreSQL / Standard
                  </span>
                </div>
              </div>

              {/* Editor Workspace Textarea */}
              <div style={{
                flex: 1,
                border: '1.5px solid var(--glass-border)',
                borderRadius: '10px',
                padding: '15px',
                background: '#050814',
                overflowY: 'auto'
              }}>
                <textarea
                  ref={editorRef}
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="code-editor-textarea"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: '#00f2fe',
                    lineHeight: '1.5',
                    tabSize: 2
                  }}
                  placeholder="-- Write your SQL query here..."
                />
              </div>
            </div>

          </div>

          {/* Bottom Panel: Custom Console & Action Bars */}
          <div className="glass-panel" style={{
            background: 'var(--panel-bg)',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: queryResult.length > 0 ? '1.2fr 1fr' : '1fr 240px',
            gap: '20px',
            alignItems: 'stretch',
            overflow: 'hidden'
          }}>
            
            {/* Left Console output */}
            <div style={{
              background: '#050814',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              padding: '12px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              maxHeight: '220px',
              overflowY: 'auto',
              textAlign: 'left'
            }}>
              <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Terminal size={10} /> DATABASE TELEMETRY ENGINE LOGS
              </span>
              
              {consoleLogs.length === 0 ? (
                <p style={{ margin: '15px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-mono)' }}>
                  Compiler is idle. Run or Submit code to execute validation query checks.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                  {consoleLogs.map((log, idx) => (
                    <div key={idx} style={{ 
                      color: log.startsWith('✅') ? 'var(--emerald-neon)' : log.startsWith('❌') || log.startsWith('⚠️') ? '#ff4d4d' : log.trim().startsWith('💡') ? 'var(--yellow-neon)' : 'var(--text-primary)',
                      whiteSpace: 'pre-wrap',
                      fontWeight: log.trim().startsWith('💡') ? 'bold' : 'normal',
                      padding: log.trim().startsWith('💡') ? '10px 14px' : '0',
                      borderLeft: log.trim().startsWith('💡') ? '3px solid var(--yellow-neon)' : 'none',
                      background: log.trim().startsWith('💡') ? 'rgba(245, 158, 11, 0.06)' : 'none',
                      borderRadius: log.trim().startsWith('💡') ? '8px' : '0',
                      marginTop: log.trim().startsWith('💡') ? '8px' : '0',
                      boxShadow: log.trim().startsWith('💡') ? '0 0 10px rgba(245, 158, 11, 0.1)' : 'none'
                    }}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Panel: Conditional Grid Result Tables vs Actions */}
            {queryResult.length > 0 ? (
              
              /* Renders returned SQL rowset */
              <div style={{
                background: '#050814',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding: '12px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '220px',
                overflowY: 'auto',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.58rem', color: 'var(--cyan-neon)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <PlayCircle size={10} /> RETURNED QUERY RECORDSET
                  </span>
                  
                  {/* Action buttons embedded in header when outputting query results */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => runSQL(false)}
                      disabled={consoleStatus === 'RUNNING'}
                      style={{
                        background: 'var(--input-bg)',
                        border: 'var(--glass-border)',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.64rem',
                        fontWeight: 'bold',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      Run
                    </button>
                    <button
                      onClick={() => runSQL(true)}
                      disabled={consoleStatus === 'RUNNING'}
                      style={{
                        background: 'linear-gradient(135deg, var(--cyan-neon), var(--purple-neon))',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 12px',
                        fontSize: '0.64rem',
                        fontWeight: '900',
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>

                <div style={{ overflowX: 'auto', border: 'var(--glass-border)', borderRadius: '6px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
                    <thead>
                      <tr style={{ background: 'rgba(15, 23, 42, 0.03)', borderBottom: 'var(--glass-border)' }}>
                        {Object.keys(queryResult[0] || {}).map(k => (
                          <th key={k} style={{ padding: '6px 10px', textAlign: 'left', color: 'var(--text-secondary)' }}>
                            {k}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: 'var(--glass-border)' }}>
                          {Object.keys(queryResult[0] || {}).map(k => (
                            <td key={k} style={{ padding: '6px 10px', color: 'var(--text-primary)' }}>
                              {row[k] === null ? 'NULL' : row[k]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            ) : (

              /* Renders action buttons */
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => runSQL(false)}
                    disabled={consoleStatus === 'RUNNING'}
                    style={{
                      flex: '1',
                      background: 'var(--input-bg)',
                      border: 'var(--glass-border)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.74rem',
                      fontWeight: 'bold',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
                  >
                    Run Query
                  </button>
                  <button
                    onClick={() => runSQL(true)}
                    disabled={consoleStatus === 'RUNNING'}
                    style={{
                      flex: '1.2',
                      background: 'linear-gradient(135deg, var(--cyan-neon), var(--purple-neon))',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.74rem',
                      fontWeight: '900',
                      color: '#fff',
                      cursor: 'pointer',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      boxShadow: '0 0 15px rgba(6,182,212,0.3)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(6,182,212,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(6,182,212,0.3)';
                    }}
                  >
                    <Play size={12} fill="#fff" /> Submit Query
                  </button>
                </div>
              </div>

            )}

          </div>

        </div>

      </div>

      {/* SQL Success Modal Overlay with Chibi Success Girl & Motivational Quote */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 8, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          animation: 'sqlFadeIn 0.35s ease-out forwards'
        }}>
          {/* Modal Container */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.8)',
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.95)), linear-gradient(135deg, var(--cyan-neon), var(--pink-neon))',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            borderRadius: '24px',
            padding: '40px',
            width: '90%',
            maxWidth: '520px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 182, 212, 0.2), 0 0 50px rgba(255, 0, 127, 0.1)',
            animation: 'sqlScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            position: 'relative'
          }}>
            {/* Embedded animations <style> block */}
            <style>{`
              @keyframes sqlFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes sqlScaleIn {
                from { transform: scale(0.85); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
              @keyframes sqlNeonPulse {
                0%, 100% { box-shadow: 0 0 15px rgba(6,182,212,0.3), 0 0 30px rgba(255,0,127,0.2); }
                50% { box-shadow: 0 0 25px rgba(6,182,212,0.5), 0 0 45px rgba(255,0,127,0.4); }
              }
            `}</style>

            {/* Glowing background gradient effect */}
            <div style={{
              position: 'absolute',
              top: '-10%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '180px',
              height: '180px',
              background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0
            }} />

            {/* Chibi Anime Success Artwork Frame */}
            <div style={{
              position: 'relative',
              width: '260px',
              height: '290px',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              background: '#0a0f1d',
              zIndex: 1
            }}>
              <img 
                src="/sql_success_quote.png" 
                alt="SQL Success Quote Girl" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Motivational Text Block */}
            <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ 
                fontSize: '0.68rem', 
                color: 'var(--cyan-neon)', 
                fontFamily: 'var(--font-mono)', 
                fontWeight: '900', 
                letterSpacing: '2px', 
                textTransform: 'uppercase' 
              }}>
                🌟 SQL PREPARATION UPDATE 🌟
              </span>
              <h3 style={{ 
                margin: '5px 0 10px 0', 
                fontSize: '1.45rem', 
                fontWeight: '900', 
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.5px',
                background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Query Validation Passed!
              </h3>
              
              <div style={{ 
                padding: '16px 20px', 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255,255,255,0.06)', 
                borderRadius: '12px',
                fontStyle: 'italic',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.92rem',
                color: '#e2e8f0',
                lineHeight: '1.5',
                position: 'relative'
              }}>
                <span style={{ 
                  position: 'absolute', 
                  top: '-5px', 
                  left: '10px', 
                  fontSize: '2.5rem', 
                  color: 'rgba(6, 182, 212, 0.1)', 
                  fontFamily: 'serif',
                  pointerEvents: 'none'
                }}>“</span>
                Hey, <strong style={{ color: 'var(--pink-neon)' }}>Be proud of yourself</strong> how hard you are trying everyday.
                <span style={{ 
                  position: 'absolute', 
                  bottom: '-25px', 
                  right: '15px', 
                  fontSize: '2.5rem', 
                  color: 'rgba(6, 182, 212, 0.1)', 
                  fontFamily: 'serif',
                  pointerEvents: 'none'
                }}>”</span>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                background: 'linear-gradient(135deg, var(--cyan-neon), var(--purple-neon))',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 36px',
                fontSize: '0.85rem',
                fontWeight: '900',
                color: '#fff',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 0 15px rgba(6,182,212,0.3)',
                transition: 'all 0.25s',
                animation: 'sqlNeonPulse 2s infinite',
                width: '100%',
                zIndex: 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(6,182,212,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
              }}
            >
              Continue Query Practice
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
