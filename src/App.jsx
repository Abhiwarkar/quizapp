import React from 'react'
import QuizCard from './components/quiz/QuizCard'
import { SAMPLE_QUESTIONS } from './constants/quiz'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Interactive Quiz Platform
        </h1>
        <QuizCard questions={SAMPLE_QUESTIONS} />
      </div>
    </div>
  )
}

export default App