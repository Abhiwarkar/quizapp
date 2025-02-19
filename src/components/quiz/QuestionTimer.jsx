// src/components/quiz/QuestionTimer.jsx
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { quizService } from '../../services/quizService';

const QuestionTimer = ({ startTime, onTimeUp }) => {
  const [remainingTime, setRemainingTime] = useState(
    quizService.getRemainingTime(startTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const newRemainingTime = quizService.getRemainingTime(startTime);
      setRemainingTime(newRemainingTime);

      if (newRemainingTime <= 0) {
        clearInterval(timer);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, onTimeUp]);

  const formattedTime = quizService.formatTime(remainingTime);
  const isLowTime = remainingTime <= 60; // Last minute

  return (
    <div className={`flex items-center ${isLowTime ? 'text-red-500' : 'text-gray-600'}`}>
      <Timer className="w-4 h-4 mr-1" />
      <span className="font-mono">{formattedTime}</span>
    </div>
  );
};

export default QuestionTimer;