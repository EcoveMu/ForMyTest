import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import App from './components/App';

// Firebase 配置
// 您需要從 Firebase 控制台獲取這些值
// 訪問 https://console.firebase.google.com/
// 創建一個專案，然後在專案設定中找到這些配置值
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // 替換為您的值
  authDomain: "YOUR_AUTH_DOMAIN", // 替換為您的值
  projectId: "YOUR_PROJECT_ID", // 替換為您的值
  storageBucket: "YOUR_STORAGE_BUCKET", // 替換為您的值
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // 替換為您的值
  appId: "YOUR_APP_ID" // 替換為您的值
};

// 初始化 Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 渲染 React 應用
const root = createRoot(document.getElementById('root'));
root.render(<App />); 