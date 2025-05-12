# 互動式測驗網站

這是一個基於React和Firebase的互動式測驗網站專案，可以將JSON格式的測驗題目轉換為互動式網頁測驗。

## 功能特色

- 支援多層級測驗結構（類別/章節/子章節）
- 選擇題答題界面
- 即時答題回饋與解析
- 倒數計時功能
- 成績統計與記錄
- 響應式設計，適合手機/平板/電腦使用

## 快速開始

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm start
```

### 建置生產版本

```bash
npm run build
```

## 部署至Firebase

1. 安裝Firebase CLI：

```bash
npm install -g firebase-tools
```

2. 登入Firebase：

```bash
firebase login
```

3. 初始化Firebase專案：

```bash
firebase init
```

4. 選擇Hosting和Firestore服務

5. 部署專案：

```bash
npm run deploy
```

## 匯入題目

將JSON題目檔案放入`src/data`資料夾，然後在`src/index.js`中匯入並使用。

## JSON資料格式

參考 `正確的 JSON 檔案結構.json` 的格式，包含類別、章節、子章節和問題。

## 作者

請填入您的資訊

## 授權

ISC授權 