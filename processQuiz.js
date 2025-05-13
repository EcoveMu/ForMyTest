const fs = require('fs');
const path = './quiz-app/src/data/L21.json';

// 讀取 JSON 檔案
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 遍歷所有題目，尋找其中的自然語言子句
function processAllQuestions(obj) {
  if (obj.questions && Array.isArray(obj.questions)) {
    obj.questions.forEach(question => {
      const correctAnswer = question.correct_answer;
      if (question.solution && typeof question.solution === 'string') {
        // 簡單的方法：直接將原始 solution 包裝成格式化 HTML
        let formattedSolution = `<strong>(${correctAnswer}) 正確。</strong> `;
        
        // 分割 solution 文本，找出各選項的解釋
        const solutionText = question.solution;
        let parts = solutionText.split(/([A-D])[ \)：:]/);
        
        if (parts.length > 1) {
          // 找到了選項分割點，可以結構化處理
          let explanations = {};
          let currentKey = null;
          
          // 提取正確選項的解釋
          let correctExplanation = "";
          for (let i = 0; i < parts.length; i++) {
            if (parts[i] === correctAnswer && i < parts.length - 1) {
              correctExplanation = parts[i+1].trim();
              break;
            }
          }
          
          // 如果沒能提取出正確選項解釋，使用原始 solution 的前一部分
          if (!correctExplanation) {
            const firstPeriod = solutionText.indexOf('。');
            correctExplanation = firstPeriod > 0 ? 
                                 solutionText.substring(0, firstPeriod + 1) : 
                                 solutionText.split(/[\.。]/)[0] + '。';
          }
          
          formattedSolution += correctExplanation + '<br/><br/>';
          
          // 提取所有選項的解釋
          for (let i = 0; i < parts.length; i++) {
            if (['A', 'B', 'C', 'D'].includes(parts[i]) && i < parts.length - 1) {
              const optionKey = parts[i];
              const explanation = parts[i+1].trim();
              formattedSolution += `<strong>(${optionKey})</strong> ${explanation}<br/>`;
            }
          }
        } else {
          // 沒找到選項分割點，直接使用原始 solution
          formattedSolution += solutionText;
        }
        
        // 更新 solution
        question.solution = formattedSolution;
      }
    });
  }
  
  // 遞歸處理所有子節
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      processAllQuestions(obj[key]);
    }
  }
}

processAllQuestions(data);

// 寫回檔案
fs.writeFileSync(path, JSON.stringify(data, null, 4), 'utf8');
console.log('已成功更新 L21.json 檔案'); 