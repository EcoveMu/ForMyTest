import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Quiz({ quizData }) {
  const { categoryId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60); // 每題60秒
  
  // 取得目前要顯示的問題資料
  const questions = quizData[categoryId]?.sections[sectionId]?.sub_sections[subSectionId]?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  
  // 處理倒數計時
  useEffect(() => {
    if (timeLeft <= 0) {
      // 時間到，自動前進到下一題
      handleNext();
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  // 當切換到新題目時重設狀態
  useEffect(() => {
    setSelectedOption(null);
    setTimeLeft(60);
  }, [currentQuestionIndex]);
  
  if (!currentQuestion) {
    return <div>找不到測驗問題</div>;
  }
  
  // 選擇答案
  const handleOptionSelect = (optionKey) => {
    if (selectedOption) return; // 已經選過就不能再選
    
    setSelectedOption(optionKey);
    setAnswers(prev => [
      ...prev, 
      {
        questionIndex: currentQuestionIndex,
        question: currentQuestion.question_text,
        userAnswer: optionKey,
        correctAnswer: currentQuestion.correct_answer,
        isCorrect: optionKey === currentQuestion.correct_answer,
        solution: currentQuestion.solution  // 保存解析以便在結果頁顯示
      }
    ]);
  };
  
  // 前進到下一題
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // 如果是最後一題，導向結果頁面
      navigate('/results', { 
        state: { 
          answers, 
          totalQuestions: questions.length,
          categoryId: categoryId,
          categoryTitle: quizData[categoryId]?.title,
          sectionId: sectionId,
          sectionTitle: quizData[categoryId]?.sections[sectionId]?.title,
          subSectionId: subSectionId,
          subSectionTitle: quizData[categoryId]?.sections[sectionId]?.sub_sections[subSectionId]?.title
        } 
      });
    }
  };
  
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  return (
    <div>
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="quiz-card">
        <div className="quiz-header">
          <span>問題 {currentQuestionIndex + 1} / {questions.length}</span>
          <span className="timer">剩餘時間: {timeLeft} 秒</span>
        </div>
        
        <div className="question">{currentQuestion.question_text}</div>
        
        <div className="options">
          {Object.entries(currentQuestion.options).map(([key, value]) => (
            <div 
              key={key}
              className={`option ${selectedOption === key ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(key)}
            >
              <strong>{key}.</strong> {value}
            </div>
          ))}
        </div>
        
        <div className="button-group">
          {selectedOption && (
            <button 
              className="button"
              onClick={handleNext}
            >
              {isLastQuestion ? '查看結果' : '下一題'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz; 