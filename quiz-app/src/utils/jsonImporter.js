/**
 * JSON檔案匯入工具
 * 用於將本地JSON檔案匯入系統
 */

import { mergeJsonData, shuffleQuestions } from './dataConverter';

/**
 * 讀取本地JSON檔案
 * @param {File} file - 使用者上傳的JSON檔案
 * @returns {Promise<Object>} - 解析後的JSON對象
 */
export const readJsonFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        resolve(jsonData);
      } catch (error) {
        console.error(`解析檔案 ${file.name} 時出錯:`, error);
        reject(new Error(`檔案格式不正確，無法解析為JSON: ${file.name}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error(`讀取檔案時發生錯誤: ${file.name}`));
    };
    
    reader.readAsText(file);
  });
};

/**
 * 驗證JSON檔案格式是否正確
 * @param {Object} jsonData - 要驗證的JSON數據
 * @returns {boolean} - 是否為有效的測驗資料格式
 */
export const validateQuizFormat = (jsonData) => {
  try {
    // 檢查是否為空
    if (!jsonData || Object.keys(jsonData).length === 0) {
      console.warn('JSON 資料為空或不是物件');
      return false;
    }
    
    // 檢查基本結構 - 寬鬆檢查，只要有一個類別結構正確即可
    let hasValidCategory = false;
    
    for (const categoryId in jsonData) {
      const category = jsonData[categoryId];
      
      // 檢查類別是否包含標題和章節
      if (!category || !category.title || !category.sections) {
        console.warn(`類別 ${categoryId} 缺少標題或章節`);
        continue;
      }
      
      let hasValidSection = false;
      
      // 檢查每個章節
      for (const sectionId in category.sections) {
        const section = category.sections[sectionId];
        
        // 檢查章節是否包含標題和子章節
        if (!section || !section.title || !section.sub_sections) {
          console.warn(`章節 ${sectionId} 缺少標題或子章節`);
          continue;
        }
        
        let hasValidSubSection = false;
        
        // 檢查每個子章節
        for (const subSectionId in section.sub_sections) {
          const subSection = section.sub_sections[subSectionId];
          
          // 檢查子章節是否包含標題
          if (!subSection || !subSection.title) {
            console.warn(`子章節 ${subSectionId} 缺少標題`);
            continue;
          }
          
          // 檢查問題格式
          if (subSection.questions && subSection.questions.length > 0) {
            let allQuestionsValid = true;
            
            for (const question of subSection.questions) {
              // 檢查問題是否包含題目文本、選項、正確答案和解析
              if (!question.question_text || 
                  !question.options || 
                  !question.correct_answer || 
                  !question.solution) {
                console.warn('問題缺少必要欄位');
                allQuestionsValid = false;
                break;
              }
              
              // 檢查選項是否至少有2個
              if (Object.keys(question.options).length < 2) {
                console.warn('問題選項數量不足');
                allQuestionsValid = false;
                break;
              }
              
              // 檢查正確答案是否在選項中
              if (!question.options[question.correct_answer]) {
                console.warn(`正確答案 ${question.correct_answer} 不在選項中`);
                allQuestionsValid = false;
                break;
              }
            }
            
            if (allQuestionsValid) {
              hasValidSubSection = true;
            }
          } else {
            // 沒有問題也算是有效的子章節
            hasValidSubSection = true;
          }
        }
        
        if (hasValidSubSection) {
          hasValidSection = true;
        }
      }
      
      if (hasValidSection) {
        hasValidCategory = true;
      }
    }
    
    return hasValidCategory;
  } catch (error) {
    console.error('驗證JSON格式時出錯:', error);
    return false;
  }
};

/**
 * 匯入多個JSON檔案並處理
 * @param {Array<File>} files - 使用者上傳的JSON檔案陣列
 * @returns {Promise<Object>} - 處理後的合併測驗資料
 */
export const importMultipleJsonFiles = async (files) => {
  try {
    const jsonDataArray = [];
    const errorMessages = [];
    
    // 讀取所有檔案
    for (const file of files) {
      try {
        const jsonData = await readJsonFile(file);
        
        // 驗證檔案格式
        if (validateQuizFormat(jsonData)) {
          jsonDataArray.push(jsonData);
          console.log(`檔案 ${file.name} 驗證成功`);
        } else {
          const message = `檔案 ${file.name} 格式不正確，但仍將嘗試使用`;
          console.warn(message);
          errorMessages.push(message);
          // 即使格式不完全符合，也嘗試使用這些數據
          jsonDataArray.push(jsonData);
        }
      } catch (error) {
        console.error(`處理檔案 ${file.name} 時出錯:`, error);
        errorMessages.push(error.message);
      }
    }
    
    if (jsonDataArray.length === 0) {
      throw new Error('沒有有效的JSON檔案可使用: ' + errorMessages.join('; '));
    }
    
    // 合併所有檔案數據
    console.log('合併資料中...');
    const mergedData = mergeJsonData(jsonDataArray);
    
    // 打亂問題順序
    console.log('正在打亂問題順序...');
    const shuffledData = shuffleQuestions(mergedData);
    
    return shuffledData;
  } catch (error) {
    console.error('匯入JSON檔案時出錯:', error);
    throw error;
  }
}; 