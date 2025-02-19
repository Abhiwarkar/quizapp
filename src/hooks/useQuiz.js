// src/hooks/useQuiz.js
import { useState, useEffect } from 'react';
import { quizDB } from '../services/db';
import { QUESTIONS, QUIZ_SETTINGS } from '../constants/quiz';

const useQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showScore, setShowScore] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    // Load previous attempts from IndexedDB
    const loadAttempts = async () => {
      try {
        const savedAttempts = await quizDB.getAttempts();
        setAttempts(savedAttempts);
      } catch (error) {
        console.error('Failed to load attempts:', error);
      }
    };

    loadAttempts();
  }, []);

  const startQuiz = () => {
    setShowInstructions(false);
    setStartTime(Date.now());
  };

  const submitAnswer = (answer) => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    
    const newAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answer,
      timeSpent: Date.now() - startTime
    };

    setAnswers([...answers, newAnswer]);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const score = answers.reduce((total, answer) => {
      const question = QUESTIONS.find(q => q.id === answer.questionId);
      return total + (answer.selectedAnswer === question.correctAnswer ? 1 : 0);
    }, 0);

    const attemptData = {
      date: new Date().toISOString(),
      score,
      totalQuestions: QUESTIONS.length,
      timeSpent: Date.now() - startTime,
      answers
    };

    try {
      await quizDB.saveAttempt(attemptData);
      const updatedAttempts = await quizDB.getAttempts();
      setAttempts(updatedAttempts);
    } catch (error) {
      console.error('Failed to save attempt:', error);
    }

    setShowScore(true);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowScore(false);
    setStartTime(null);
    setShowInstructions(true);
  };

  return {
    currentQuestion: QUESTIONS[currentQuestionIndex],
    currentQuestionIndex,
    showInstructions,
    showScore,
    answers,
    attempts,
    startQuiz,
    submitAnswer,
    resetQuiz
  };
};

export default useQuiz;