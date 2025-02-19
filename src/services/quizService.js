// src/services/quizService.js
import { SAMPLE_QUESTIONS, QUIZ_SETTINGS } from '../constants/quiz';

class QuizService {
  validateAnswer(question, answer) {
    if (!question || answer === null || answer === undefined) return false;
    
    if (question.type === 'multiple-choice') {
      return answer === question.correctAnswer;
    } else if (question.type === 'integer') {
      return parseInt(answer) === question.correctAnswer;
    }
    return false;
  }

  calculateScore(answers) {
    if (!answers || answers.length === 0) return 0;
    
    let correctAnswers = 0;
    answers.forEach(answer => {
      const question = SAMPLE_QUESTIONS.find(q => q.id === answer.questionId);
      if (question && this.validateAnswer(question, answer.selectedAnswer)) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / SAMPLE_QUESTIONS.length) * 100;
    return Math.min(100, Math.round(score)); // Ensure score never exceeds 100%
  }

  formatAnswer(questionId, answer) {
    const question = SAMPLE_QUESTIONS.find(q => q.id === questionId);
    if (!question) return '';

    if (question.type === 'multiple-choice') {
      return String.fromCharCode(65 + answer); // Convert 0 to 'A', 1 to 'B', etc.
    }
    return answer.toString();
  }

  getRemainingTime(startTime) {
    if (!startTime) return 0;
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    return Math.max(0, QUIZ_SETTINGS.TIME_LIMIT - elapsedTime);
  }

  isTimeUp(startTime) {
    return this.getRemainingTime(startTime) <= 0;
  }

  formatTime(seconds) {
    if (!seconds || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getLetterGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}

export const quizService = new QuizService();