import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function Results() {
  const location = useLocation();
  const { 
    answers = [], 
    totalQuestions = 0,
    categoryId = '',
    categoryTitle = '',
    sectionId = '',
    sectionTitle = '',
    subSectionId = '',
    subSectionTitle = ''
  } = location.state || {};
  
  // 計算測驗統計資料
  const correctAnswersCount = answers.filter(answer => answer.isCorrect).length;
  const score = Math.floor((correctAnswersCount / totalQuestions) * 100);
  
  // 產生測驗結果評語
  const getFeedback = () => {
    if (score >= 90) return '優異！你已精通此主題！';
    if (score >= 80) return '非常好！只有一些小細節需要加強。';
    if (score >= 70) return '好！你已掌握大部分內容。';
    if (score >= 60) return '及格！還有一些概念需要複習。';
    return '繼續努力！建議重新學習本主題。';
  };
  
  return (
    <div className="results">
      <h2>測驗結果</h2>
      
      <div className="quiz-card">
        <h3>{categoryId ? `${categoryId}: ` : ''}{categoryTitle}</h3>
        <h4>{sectionId ? `${sectionId}: ` : ''}{sectionTitle} - {subSectionId ? `${subSectionId}: ` : ''}{subSectionTitle}</h4>
        
        <div className="score">{score}分</div>
        <p>共{totalQuestions}題，答對{correctAnswersCount}題</p>
        <p className="feedback">{getFeedback()}</p>
        
        <h3 className="mt-4">答題記錄</h3>
        {answers.map((answer, index) => (
          <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="question">
              <span className="question-number">{index + 1}. </span>
              {answer.question}
            </div>
            <div className="answer-details">
              <div>你的答案: <strong>{answer.userAnswer}</strong></div>
              {!answer.isCorrect && (
                <div>正確答案: <strong>{answer.correctAnswer}</strong></div>
              )}
            </div>
          </div>
        ))}
        
        <div className="button-group">
          <Link to="/">
            <button className="button">返回首頁</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Results; 