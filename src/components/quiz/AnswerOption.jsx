// src/components/quiz/AnswerOption.jsx
import React from 'react';
import { Button } from '../ui/Button';

const AnswerOption = ({ label, onClick, isSelected, isCorrect, showFeedback }) => {
  let className = 'w-full justify-start text-left';
  
  if (showFeedback) {
    if (isSelected) {
      className += isCorrect ? ' bg-green-500 hover:bg-green-600' : ' bg-red-500 hover:bg-red-600';
    } else if (isCorrect) {
      className += ' bg-green-500 hover:bg-green-600';
    }
  }

  return (
    <Button
      onClick={onClick}
      className={className}
      disabled={showFeedback}
    >
      {label}
    </Button>
  );
};

export default AnswerOption;