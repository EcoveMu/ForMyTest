import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import QuizCategory from './QuizCategory';
import Quiz from './Quiz';
import Results from './Results';
import Admin from './Admin';
import Header from './Header';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../index';
import { testData } from '../data/quizData';

function App() {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 從Firebase載入資料，若失敗則使用測試資料
    const fetchQuizData = async () => {
      try {
        // 先使用本地測試資料，確保快速載入
        if (testData && Object.keys(testData).length > 0) {
          console.log('使用本地測試資料');
          setQuizData(testData);
          setLoading(false);
          return;
        }
        
        // 如果本地測試資料為空，嘗試從Firebase載入
        console.log('嘗試從Firebase載入資料...');
        
        // 檢查Firebase是否已正確初始化
        if (!db) {
          console.warn('Firebase未初始化，使用預設資料');
          throw new Error('Firebase未初始化');
        }
        
        const categoriesCollection = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        
        if (!categoriesSnapshot.empty) {
          const categoriesData = {};
          
          categoriesSnapshot.forEach(doc => {
            categoriesData[doc.id] = doc.data();
          });
          
          console.log('從Firebase成功載入資料');
          setQuizData(categoriesData);
        } else {
          // 若Firebase沒有資料，則使用本地測試資料
          console.log('Firebase沒有資料，使用測試資料');
          setQuizData(testData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('載入資料時出錯:', err);
        
        // 發生錯誤時使用測試資料
        console.log('載入資料時發生錯誤，使用測試資料');
        setQuizData(testData);
        
        // 只在測試資料也為空時設定錯誤狀態
        if (!testData || Object.keys(testData).length === 0) {
          setError('無法載入測驗資料。請檢查您的JSON檔案格式是否正確。');
        }
        
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">載入中...</div>
        <div className="loading-text">正在準備測驗資料，請稍候...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <p>請檢查您的JSON檔案格式是否正確，或嘗試重新整理頁面。</p>
        <button onClick={() => window.location.reload()} className="button">
          重新整理
        </button>
      </div>
    );
  }

  // 檢查quizData是否有有效的測驗資料
  const hasValidData = quizData && Object.keys(quizData).length > 0;

  if (!hasValidData) {
    return (
      <div className="error-container">
        <div className="error">沒有可用的測驗資料</div>
        <p>請使用管理介面上傳JSON檔案，或將檔案放入src/data資料夾。</p>
        <a href="/admin" className="button">
          前往管理介面
        </a>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home quizData={quizData} />} />
          <Route path="/category/:categoryId" element={<QuizCategory quizData={quizData} />} />
          <Route path="/quiz/:categoryId/:sectionId/:subSectionId" element={<Quiz quizData={quizData} />} />
          <Route path="/results" element={<Results />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 