import React from 'react';
import { Link } from 'react-router-dom';

function Home({ quizData }) {
  if (!quizData) {
    return <div>沒有可用的測驗資料</div>;
  }

  return (
    <div>
      <h2>選擇測驗類別</h2>
      <div className="category-list">
        {Object.keys(quizData).map(categoryId => (
          <Link 
            to={`/category/${categoryId}`} 
            key={categoryId}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="category-card">
              <h3>{quizData[categoryId]?.title || '無標題'}</h3>
              <p>
                共 {
                  Object.keys(quizData[categoryId]?.sections || {}).reduce((total, sectionId) => {
                    return total + Object.keys(quizData[categoryId]?.sections?.[sectionId]?.sub_sections || {}).reduce((subTotal, subSectionId) => {
                      return subTotal + (quizData[categoryId]?.sections?.[sectionId]?.sub_sections?.[subSectionId]?.questions?.length || 0);
                    }, 0);
                  }, 0)
                } 題
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home; 