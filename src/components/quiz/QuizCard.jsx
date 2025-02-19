// src/components/quiz/QuizCard.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import QuestionTimer from './QuestionTimer';
import AnswerOption from './AnswerOption';
import ScoreBoard from './ScoreBoard';
import { quizService } from '../../services/quizService';
import { SAMPLE_QUESTIONS, QUIZ_INSTRUCTIONS } from '../../constants/quiz';
import { Clock, CheckSquare, Calculator, PlayCircle, HelpCircle, Timer, Brain, Target, Award, ChevronRight } from 'lucide-react';

const QuizCard = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showScore, setShowScore] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [totalTimeLeft, setTotalTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  const currentQuestion = SAMPLE_QUESTIONS[currentQuestionIndex];

  useEffect(() => {
    if (startTime) {
      const timer = setInterval(() => {
        const now = Date.now();
        const totalElapsed = Math.floor((now - startTime) / 1000);
        const questionElapsed = Math.floor((now - (questionStartTime || startTime)) / 1000);
        
        setTotalTimeLeft(Math.max(30 * 60 - totalElapsed, 0));
        setTimeLeft(Math.max(currentQuestion.timeLimit - questionElapsed, 0));

        if (currentQuestion.timeLimit - questionElapsed <= 0) {
          handleTimeUp();
        }
        
        if (30 * 60 - totalElapsed <= 0) {
          handleQuizComplete();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startTime, questionStartTime, currentQuestion]);

  const handleStartQuiz = () => {
    setShowInstructions(false);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  const handleTimeUp = () => {
    if (currentQuestion.type === 'integer' && currentAnswer) {
      handleSubmitAnswer();
    } else {
      moveToNextQuestion();
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
      setCurrentAnswer('');
      setTimeLeft(180);
    } else {
      handleQuizComplete();
    }
  };

  const handleAnswer = (answer) => {
    if (currentQuestion.type === 'multiple-choice') {
      const newAnswer = {
        questionId: currentQuestion.id,
        selectedAnswer: answer,
        isCorrect: quizService.validateAnswer(currentQuestion, answer)
      };
      setAnswers([...answers, newAnswer]);
      moveToNextQuestion();
    } else {
      setCurrentAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (currentQuestion.type === 'integer' && currentAnswer !== '') {
      const newAnswer = {
        questionId: currentQuestion.id,
        selectedAnswer: parseInt(currentAnswer),
        isCorrect: quizService.validateAnswer(currentQuestion, parseInt(currentAnswer))
      };
      setAnswers([...answers, newAnswer]);
      moveToNextQuestion();
    }
  };

  const handleQuizComplete = () => {
    setShowScore(true);
  };

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-blue-50 to-white">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto pt-20 px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Interactive Quiz
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Challenge yourself with our expertly crafted questions
            </p>
          </div>

          <Card className="w-full overflow-hidden backdrop-blur-sm bg-white/90 shadow-2xl border border-gray-100/20 rounded-2xl">
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quiz Instructions</h2>
                    <p className="text-gray-500">Read carefully before starting</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                  <Award className="w-4 h-4" />
                  <span>Top-rated quiz platform</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                      <CheckSquare className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Multiple Choice</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{QUIZ_INSTRUCTIONS[0]}</p>
                </div>

                <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-2 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Integer Type</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{QUIZ_INSTRUCTIONS[1]}</p>
                </div>

                <div className="group p-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-2 bg-red-500 rounded-lg group-hover:scale-110 transition-transform">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Calculator Usage</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{QUIZ_INSTRUCTIONS[2]}</p>
                </div>

                <div className="group p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-2 bg-green-500 rounded-lg group-hover:scale-110 transition-transform">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Time Limit</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{QUIZ_INSTRUCTIONS[3]}</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <Button 
                  onClick={handleStartQuiz}
                  className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    Start Quiz
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Button>
                <p className="mt-4 text-sm text-gray-500">
                  Good luck on your quiz journey!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (showScore) {
    return <ScoreBoard answers={answers} />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-blue-50 to-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto py-8 px-4">
        <Card className="w-full backdrop-blur-sm bg-white/95 shadow-2xl border border-gray-100/20 rounded-2xl">
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="relative h-12 w-12 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-blue-100"></div>
                  <span className="relative text-blue-600 font-bold">{currentQuestionIndex + 1}/{SAMPLE_QUESTIONS.length}</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Progress</h3>
                  <div className="w-40 h-2 bg-gray-100 rounded-full mt-1">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / SAMPLE_QUESTIONS.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 rounded-lg border border-purple-100">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-purple-600 font-medium">
                    Total: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                  <Timer className="w-4 h-4 text-blue-500" />
                  <span className={`font-medium ${timeLeft <= 30 ? 'text-red-500' : 'text-blue-600'}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                {currentQuestion.question}
              </h3>

              {currentQuestion.type === 'multiple-choice' ? (
                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group relative overflow-hidden"
                    >
                      <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-medium flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-gray-700 group-hover:text-gray-900">{option}</span>
                      </div>
                      <div className="absolute inset-0 border-2 border-blue-500 scale-0 group-hover:scale-100 transition-transform rounded-xl"></div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                      placeholder="Enter your numerical answer"
                      value={currentAnswer}
                      onChange={(e) => handleAnswer(e.target.value)}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Calculator className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={!currentAnswer}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold text-lg 
                             disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-blue-700 
                             transition-all shadow-md hover:shadow-lg disabled:hover:shadow-none 
                             transform hover:scale-[1.01] disabled:hover:scale-100"
                  >
                    <span className="flex items-center justify-center">
                      Submit Answer
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </span>
                  </Button>
                </div>
              )}
            </div>

            {/* Question Progress Dots */}
            <div className="flex justify-center space-x-2">
              {SAMPLE_QUESTIONS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuestionIndex 
                      ? 'bg-blue-500 w-4' 
                      : index < currentQuestionIndex 
                        ? 'bg-blue-200' 
                        : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizCard;