// src/components/quiz/ScoreBoard.jsx
import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { quizService } from '../../services/quizService';
import { SAMPLE_QUESTIONS, QUIZ_SETTINGS } from '../../constants/quiz';
import { quizDB } from '../../services/db';
import { Trophy, Timer, Target, BarChart2, Repeat, CheckCircle, XCircle, Star } from 'lucide-react';

const ScoreBoard = ({ answers }) => {
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const score = quizService.calculateScore(answers);
  const passed = score >= QUIZ_SETTINGS.MIN_PASS_SCORE;
  const grade = quizService.getLetterGrade(score);
  const correctAnswers = answers.filter(a => a.isCorrect).length;

  useEffect(() => {
    const saveAndLoadAttempts = async () => {
      try {
        await quizDB.saveAttempt({
          score,
          totalQuestions: SAMPLE_QUESTIONS.length,
          correctAnswers,
          answers,
          date: new Date().toISOString()
        });

        const allAttempts = await quizDB.getAttempts();
        setAttempts(allAttempts.sort((a, b) => new Date(b.date) - new Date(a.date)));
        const statistics = await quizDB.getStats();
        setStats(statistics);
      } catch (error) {
        console.error('Error saving/loading attempts:', error);
      } finally {
        setLoading(false);
      }
    };

    saveAndLoadAttempts();
  }, [score, answers, correctAnswers]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-blue-600">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Score Card */}
        <Card className="w-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <h2 className="text-3xl font-bold text-center mb-4">
              Quiz Complete!
            </h2>
            <div className="flex justify-center items-center space-x-4">
              <Trophy className="w-12 h-12" />
              <div className="text-6xl font-bold text-center">
                {score}%
                <div className="text-xl mt-2">Grade: {grade}</div>
              </div>
            </div>
            <p className="text-center mt-4 text-blue-100">
              {passed ? 'Excellent work! You\'ve passed the quiz!' : 'Keep practicing to improve your score!'}
            </p>
            <div className="text-center mt-2 text-blue-100">
              {correctAnswers} out of {SAMPLE_QUESTIONS.length} questions correct
            </div>
          </div>

          {/* Statistics Grid */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white">
              <div className="p-4 rounded-xl bg-blue-50 flex flex-col items-center">
                <Target className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Total Attempts</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalAttempts}</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 flex flex-col items-center">
                <Trophy className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-green-600">{stats.bestScore}%</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 flex flex-col items-center">
                <Star className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageScore}%</p>
              </div>
              <div className="p-4 rounded-xl bg-orange-50 flex flex-col items-center">
                <Timer className="w-6 h-6 text-orange-600 mb-2" />
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-orange-600">{stats.completionRate}%</p>
              </div>
            </div>
          )}
        </Card>

        {/* Questions Review */}
        <Card className="w-full">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6">Question Review</h3>
            <div className="space-y-6">
              {SAMPLE_QUESTIONS.map((question, index) => {
                const answer = answers.find(a => a.questionId === question.id);
                const isCorrect = answer?.isCorrect;

                return (
                  <div key={question.id} 
                       className={`p-4 rounded-lg border ${
                         isCorrect ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'
                       } hover:shadow-md transition-all`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-gray-800">
                          {index + 1}. {question.question}
                        </div>
                        <div className="mt-2 text-sm">
                          <div className="text-gray-600">Your answer: 
                            <span className={`ml-2 font-medium ${
                              isCorrect ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {answer ? quizService.formatAnswer(question.id, answer.selectedAnswer) : 'Not answered'}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div className="text-green-600 mt-1">
                              Correct answer: {quizService.formatAnswer(question.id, question.correctAnswer)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Attempt History */}
        {attempts.length > 0 && (
          <Card className="w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Repeat className="w-6 h-6 mr-2" />
                Attempt History
              </h3>
              <div className="space-y-3">
                {attempts.map((attempt, index) => (
                  <div key={index} 
                       className="flex justify-between items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                    <div>
                      <p className="font-medium text-gray-800">Attempt {attempts.length - index}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(attempt.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {attempt.score}%
                      </p>
                      <p className="text-sm text-gray-600">
                        {attempt.correctAnswers || 0}/{attempt.totalQuestions} correct
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center">
          <Button 
            onClick={handleRetry}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all
                     transform hover:scale-105 focus:ring-4 focus:ring-blue-200"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;