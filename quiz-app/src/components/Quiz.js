import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Quiz({ quizData }) {
  const { categoryId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  
  // 取得目前要顯示的問題資料
  const questions = quizData[categoryId]?.sections[sectionId]?.sub_sections[subSectionId]?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  
  // 當切換到新題目時重設狀態
  useEffect(() => {
    setSelectedOption(null);
  }, [currentQuestionIndex]);
  
  if (!currentQuestion) {
    return <div>找不到測驗問題</div>;
  }
  
  // 選擇答案
  const handleOptionSelect = (optionKey) => {
    // 移除已選擇就不能再選的限制
    setSelectedOption(optionKey);
  };
  
  // 獲取當前答案對象
  const getCurrentAnswer = () => {
    return {
      questionIndex: currentQuestionIndex,
      question: currentQuestion.question_text,
      userAnswer: selectedOption,
      correctAnswer: currentQuestion.correct_answer,
      isCorrect: selectedOption === currentQuestion.correct_answer,
      solution: currentQuestion.solution,  // 保存解析以便在結果頁顯示
      options: currentQuestion.options // 新增選項內容
    };
  };
  
  // 前進到下一題
  const handleNext = () => {
    // 確保用戶選擇了答案
    if (!selectedOption) return;
    
    // 將答案添加到答案陣列中
    const currentAnswer = getCurrentAnswer();
    
    // 檢查是否已經有這題的答案，如果有就替換
    const answerExists = answers.findIndex(answer => answer.questionIndex === currentQuestionIndex);
    
    let updatedAnswers = [...answers];
    if (answerExists !== -1) {
      // 替換現有答案
      updatedAnswers[answerExists] = currentAnswer;
    } else {
      // 添加新答案
      updatedAnswers = [...updatedAnswers, currentAnswer];
    }
    
    setAnswers(updatedAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // 如果是最後一題，導向結果頁面
      navigate('/results', { 
        state: { 
          answers: updatedAnswers,
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