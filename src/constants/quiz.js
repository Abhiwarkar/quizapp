// src/constants/quiz.js
export const QUIZ_SETTINGS = {
    TIME_LIMIT: 30 * 60, // 30 minutes in seconds
    MIN_PASS_SCORE: 70,
    ATTEMPTS_ALLOWED: 3,
    SHOW_CORRECT_ANSWER: true,
  };

  export const QUIZ_INSTRUCTIONS = [
    "For multiple-choice questions, select the one best answer (A, B, C, or D).",
    "For integer-type questions, write your numerical answer clearly.",
    "No calculators unless specified.",
    "You have 30 minutes to complete this quiz."
  ];
  
  export const SAMPLE_QUESTIONS  = [
    {
      id: 1,
      type: 'multiple-choice',
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mercury", "Earth", "Mars"],
      correctAnswer: 1, // B. Mercury (0-based index)
      timeLimit: 180 // 3 minutes per question
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: "Which data structure organizes items in a First-In, First-Out (FIFO) manner?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      correctAnswer: 1, // B. Queue
      timeLimit: 180
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: "Which of the following is primarily used for structuring web pages?",
      options: ["Python", "Java", "HTML", "C++"],
      correctAnswer: 2, // C. HTML
      timeLimit: 180
    },
    {
      id: 4,
      type: 'multiple-choice',
      question: "Which chemical symbol stands for Gold?",
      options: ["Au", "Gd", "Ag", "Pt"],
      correctAnswer: 0, // A. Au
      timeLimit: 180
    },
    {
      id: 5,
      type: 'multiple-choice',
      question: "Which of these processes is not typically involved in refining petroleum?",
      options: ["Fractional distillation", "Cracking", "Polymerization", "Filtration"],
      correctAnswer: 3, // D. Filtration
      timeLimit: 180
    },
    {
      id: 6,
      type: 'integer',
      question: "What is the value of 12 + 28?",
      correctAnswer: 40,
      timeLimit: 180
    },
    {
      id: 7,
      type: 'integer',
      question: "How many states are there in the United States?",
      correctAnswer: 50,
      timeLimit: 180
    },
    {
      id: 8,
      type: 'integer',
      question: "In which year was the Declaration of Independence signed?",
      correctAnswer: 1776,
      timeLimit: 180
    },
    {
      id: 9,
      type: 'integer',
      question: "What is the value of pi rounded to the nearest integer?",
      correctAnswer: 3,
      timeLimit: 180
    },
    {
      id: 10,
      type: 'integer',
      question: "If a car travels at 60 mph for 2 hours, how many miles does it travel?",
      correctAnswer: 120,
      timeLimit: 180
    }
  ];