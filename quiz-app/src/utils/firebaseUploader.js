/**
 * Firebase上傳工具
 * 用於將處理後的JSON資料上傳至Firebase
 */

import { db } from '../index';
import { collection, doc, setDoc } from 'firebase/firestore';
import { testData } from '../data/quizData';

/**
 * 將類別資料上傳到Firebase
 * @param {string} categoryId - 類別ID
 * @param {Object} categoryData - 類別資料
 * @returns {Promise<void>}
 */
export const uploadCategory = async (categoryId, categoryData) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await setDoc(categoryRef, categoryData);
    console.log(`類別 ${categoryId} 上傳成功`);
    
    // 上傳章節資料
    if (categoryData.sections) {
      const sectionsCollection = collection(categoryRef, 'sections');
      
      for (const sectionId in categoryData.sections) {
        const sectionData = categoryData.sections[sectionId];
        const sectionRef = doc(sectionsCollection, sectionId);
        
        await setDoc(sectionRef, {
          title: sectionData.title
        });
        
        // 上傳子章節資料
        if (sectionData.sub_sections) {
          const subSectionsCollection = collection(sectionRef, 'subSections');
          
          for (const subSectionId in sectionData.sub_sections) {
            const subSectionData = sectionData.sub_sections[subSectionId];
            const subSectionRef = doc(subSectionsCollection, subSectionId);
            
            await setDoc(subSectionRef, {
              title: subSectionData.title
            });
            
            // 上傳問題資料
            if (subSectionData.questions && subSectionData.questions.length > 0) {
              const questionsCollection = collection(subSectionRef, 'questions');
              
              for (let i = 0; i < subSectionData.questions.length; i++) {
                const questionData = subSectionData.questions[i];
                const questionRef = doc(questionsCollection, `question_${i + 1}`);
                
                await setDoc(questionRef, questionData);
              }
            }
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('上傳資料到Firebase時出錯:', error);
    throw error;
  }
};

/**
 * 上傳所有測驗資料到Firebase
 * @param {Object} quizData - 完整的測驗資料
 */
export const uploadAllQuizData = async (quizData = testData) => {
  try {
    for (const categoryId in quizData) {
      await uploadCategory(categoryId, quizData[categoryId]);
    }
    console.log('所有資料上傳完成');
    return true;
  } catch (error) {
    console.error('上傳所有資料時出錯:', error);
    throw error;
  }
}; 