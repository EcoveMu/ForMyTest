/**
 * 將本地JSON檔案轉換為Firebase格式的工具
 * 這個工具可以用來處理從多個JSON檔案匯入的測驗資料
 */

/**
 * 將本地JSON資料轉換為Firebase適合的格式
 * @param {Object} jsonData - 從本地JSON檔案載入的資料
 * @param {string} fileId - 唯一識別此檔案的ID
 * @returns {Object} - 轉換後適合Firebase的資料結構
 */
export const convertJsonToFirebase = (jsonData, fileId) => {
  // 基本上，Firebase結構與原始JSON結構相似
  // 但我們可能需要添加其他中繼資料或進行格式調整
  return {
    id: fileId,
    createdAt: new Date().toISOString(),
    data: jsonData
  };
};

/**
 * 從多個JSON檔案合併數據
 * @param {Array<Object>} jsonFiles - 多個JSON檔案的數據陣列
 * @returns {Object} - 合併後的數據物件
 */
export const mergeJsonData = (jsonFiles) => {
  const mergedData = {};
  
  try {
    jsonFiles.forEach((file, index) => {
      // 使用檔案數據合併到主要數據物件
      if (file && typeof file === 'object') {
        Object.entries(file).forEach(([key, value]) => {
          mergedData[key] = value;
        });
      } else {
        console.warn(`警告: 檔案索引 ${index} 無效或不是物件`);
      }
    });
  } catch (error) {
    console.error('合併JSON數據時出錯:', error);
  }
  
  return mergedData;
};

/**
 * 將JSON資料中的問題打亂順序
 * @param {Object} jsonData - 測驗數據
 * @returns {Object} - 問題順序打亂後的測驗數據
 */
export const shuffleQuestions = (jsonData) => {
  try {
    // 安全複製數據
    const shuffled = JSON.parse(JSON.stringify(jsonData || {}));
    
    // 遍歷每個類別
    Object.keys(shuffled || {}).forEach(categoryId => {
      const category = shuffled[categoryId];
      if (!category || typeof category !== 'object') return;
      
      // 遍歷每個章節
      Object.keys(category.sections || {}).forEach(sectionId => {
        const section = category.sections[sectionId];
        if (!section || typeof section !== 'object') return;
        
        // 遍歷每個子章節
        Object.keys(section.sub_sections || {}).forEach(subSectionId => {
          const subSection = section.sub_sections[subSectionId];
          if (!subSection || typeof subSection !== 'object') return;
          
          // 如果有問題，就打亂順序
          if (Array.isArray(subSection.questions) && subSection.questions.length > 0) {
            subSection.questions = shuffleArray(subSection.questions);
          }
        });
      });
    });
    
    return shuffled;
  } catch (error) {
    console.error('打亂問題順序時出錯:', error);
    // 出錯時返回原始數據
    return jsonData || {};
  }
};

/**
 * 打亂陣列順序的輔助函數
 * @param {Array} array - 原始陣列
 * @returns {Array} - 打亂順序後的陣列
 */
const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}; 