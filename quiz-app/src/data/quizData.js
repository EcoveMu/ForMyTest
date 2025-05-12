// 測驗資料轉換檔
// 用於將本地JSON檔案資料轉換為Firebase格式

import { convertJsonToFirebase, mergeJsonData, shuffleQuestions } from '../utils/dataConverter';

// 使用 try-catch 安全匯入 JSON 檔案
let jsonDataL21 = {};
let jsonDataL22 = {};
let jsonDataL23 = {};

try {
  // 引入您的三個JSON檔案
  jsonDataL21 = require('./L21.json');
  console.log('成功載入 L21.json');
} catch (error) {
  console.error('載入 L21.json 失敗:', error);
  jsonDataL21 = {};
}

try {
  jsonDataL22 = require('./L22.json');
  console.log('成功載入 L22.json');
} catch (error) {
  console.error('載入 L22.json 失敗:', error);
  jsonDataL22 = {};
}

try {
  jsonDataL23 = require('./L23.json');
  console.log('成功載入 L23.json');
} catch (error) {
  console.error('載入 L23.json 失敗:', error);
  jsonDataL23 = {};
}

// 準備合併資料
const allJsonData = [jsonDataL21, jsonDataL22, jsonDataL23].filter(data => 
  data && typeof data === 'object' && Object.keys(data).length > 0
);

// 創建測試資料 (如果沒有有效的JSON數據，使用預設資料)
let testData = {};

if (allJsonData.length > 0) {
  try {
    // 合併資料並打亂問題順序
    console.log('合併測驗資料中...');
    const mergedData = mergeJsonData(allJsonData);
    console.log('打亂問題順序中...');
    testData = shuffleQuestions(mergedData);
    console.log('測驗資料準備完成');
  } catch (error) {
    console.error('處理測驗資料時出錯:', error);
    // 使用預設測試資料
    testData = {
      "範例類別": {
        "title": "範例測驗",
        "sections": {
          "範例章節": {
            "title": "範例章節標題",
            "sub_sections": {
              "範例子章節": {
                "title": "範例子章節標題",
                "questions": [
                  {
                    "question_text": "這是一個範例問題",
                    "options": {
                      "A": "選項A",
                      "B": "選項B",
                      "C": "選項C",
                      "D": "選項D"
                    },
                    "correct_answer": "A",
                    "solution": "這是範例解析"
                  }
                ]
              }
            }
          }
        }
      }
    };
  }
} else {
  console.warn('沒有找到有效的測驗資料，使用預設資料');
  // 使用預設測試資料
  testData = {
    "範例類別": {
      "title": "範例測驗",
      "sections": {
        "範例章節": {
          "title": "範例章節標題",
          "sub_sections": {
            "範例子章節": {
              "title": "範例子章節標題",
              "questions": [
                {
                  "question_text": "這是一個範例問題",
                  "options": {
                    "A": "選項A",
                    "B": "選項B",
                    "C": "選項C",
                    "D": "選項D"
                  },
                  "correct_answer": "A",
                  "solution": "這是範例解析"
                }
              ]
            }
          }
        }
      }
    }
  };
}

// 輸出測試資料
export { testData };

// 準備上傳到Firebase的資料
const prepareDataForFirebase = () => {
  // 使用合併的資料
  const jsonData = testData;
  
  // 轉換為Firebase格式
  const firebaseData = convertJsonToFirebase(jsonData, 'quiz-data-1');
  
  return firebaseData;
};

// 您也可以分別為每個JSON檔案創建上傳功能
const prepareIndividualDataForFirebase = () => {
  try {
    const dataL21 = Object.keys(jsonDataL21).length > 0 
      ? convertJsonToFirebase(jsonDataL21, 'quiz-data-L21') 
      : null;
    
    const dataL22 = Object.keys(jsonDataL22).length > 0 
      ? convertJsonToFirebase(jsonDataL22, 'quiz-data-L22') 
      : null;
    
    const dataL23 = Object.keys(jsonDataL23).length > 0 
      ? convertJsonToFirebase(jsonDataL23, 'quiz-data-L23') 
      : null;
    
    return [dataL21, dataL22, dataL23].filter(Boolean);
  } catch (error) {
    console.error('準備個別檔案資料時出錯:', error);
    return [];
  }
};

export { prepareDataForFirebase, prepareIndividualDataForFirebase }; 