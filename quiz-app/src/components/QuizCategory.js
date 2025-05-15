import React from 'react';
import { Link, useParams } from 'react-router-dom';

function QuizCategory({ quizData }) {
  const { categoryId } = useParams();
  
  if (!quizData || !quizData[categoryId]) {
    return <div>找不到此類別的測驗</div>;
  }

  const category = quizData[categoryId];

  return (
    <div>
      <h2>{categoryId}: {category.title}</h2>
      
      {Object.keys(category.sections).map(sectionId => {
        const section = category.sections[sectionId];
        
        return (
          <div key={sectionId} className="quiz-card">
            <h3>{sectionId}: {section.title}</h3>
            
            <div className="category-list">
              {Object.keys(section.sub_sections).map(subSectionId => {
                const subSection = section.sub_sections[subSectionId];
                const questionCount = subSection.questions?.length || 0;
                
                return (
                  <Link 
                    to={`/quiz/${categoryId}/${sectionId}/${subSectionId}`}
                    key={subSectionId}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="category-card">
                      <h4>{subSectionId}: {subSection.title}</h4>
                      <p>共 {questionCount} 題</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
      
      <div className="button-group">
        <Link to="/">
          <button className="button">返回首頁</button>
        </Link>
      </div>
    </div>
  );
}

export default QuizCategory; 