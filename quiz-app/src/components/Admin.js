import React, { useState } from 'react';
import { importMultipleJsonFiles } from '../utils/jsonImporter';
import { uploadAllQuizData } from '../utils/firebaseUploader';

function Admin() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [processedData, setProcessedData] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setMessage('');
    setError('');
  };
  
  const handleImport = async () => {
    if (files.length === 0) {
      setError('請選擇至少一個JSON檔案');
      return;
    }
    
    setLoading(true);
    setMessage('正在處理檔案...');
    setError('');
    
    try {
      // 導入檔案並進行處理
      const importedData = await importMultipleJsonFiles(files);
      setProcessedData(importedData);
      setMessage('檔案處理成功！可以上傳到Firebase了。');
    } catch (err) {
      setError(`檔案處理失敗: ${err.message}`);
      setProcessedData(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpload = async () => {
    if (!processedData) {
      setError('沒有可上傳的資料，請先匯入檔案');
      return;
    }
    
    setLoading(true);
    setMessage('正在上傳資料到Firebase...');
    setError('');
    
    try {
      // 上傳到Firebase
      await uploadAllQuizData(processedData);
      setMessage('資料已成功上傳到Firebase！');
    } catch (err) {
      setError(`上傳失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="admin-panel">
      <h2>測驗管理系統</h2>
      <p>在此處上傳和管理您的測驗資料</p>
      
      <div className="upload-section">
        <h3>上傳JSON檔案</h3>
        
        <div className="file-input">
          <input 
            type="file" 
            accept=".json" 
            multiple 
            onChange={handleFileChange} 
            disabled={loading}
          />
          <p>已選擇 {files.length} 個檔案</p>
        </div>
        
        <div className="button-group">
          <button 
            className="button" 
            onClick={handleImport} 
            disabled={loading || files.length === 0}
          >
            匯入檔案
          </button>
          
          <button 
            className="button" 
            onClick={handleUpload} 
            disabled={loading || !processedData}
          >
            上傳到Firebase
          </button>
        </div>
        
        {loading && <div className="loading">處理中...</div>}
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
      
      {processedData && (
        <div className="preview-section">
          <h3>資料預覽</h3>
          <div className="data-preview">
            <h4>類別數量: {Object.keys(processedData).length}</h4>
            <ul>
              {Object.keys(processedData).map(categoryId => (
                <li key={categoryId}>
                  <strong>{processedData[categoryId].title}</strong>
                  <ul>
                    {Object.keys(processedData[categoryId].sections).map(sectionId => (
                      <li key={sectionId}>
                        {processedData[categoryId].sections[sectionId].title}
                        <ul>
                          {Object.keys(processedData[categoryId].sections[sectionId].sub_sections).map(subSectionId => {
                            const subSection = processedData[categoryId].sections[sectionId].sub_sections[subSectionId];
                            const questionCount = subSection.questions?.length || 0;
                            
                            return (
                              <li key={subSectionId}>
                                {subSection.title} ({questionCount} 題)
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin; 