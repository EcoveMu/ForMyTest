這些題目會透過"netlify.com"做部署
在部署設置中，我有給一些基本指令：
專案位置:EcoveMu/ForMyTest/tree/main/quiz-app
Build command:npm run build
Publish directory:dist

本電腦沒安裝 Node.js，因此是靠netlify輸出dist


我不希望答案是顯示一連串，而是有適當跨行
例如：
(A)aaaaa；(B)asdasss；(C)askdjhs
我要顯示
(A)aaaaa
(B)asdasss
(C)askdjhs

這個是AI應用規畫師的題目
我對於出題的方式不太滿意，因為答案一目了然，通常答案都是：
1.最長的那個
2.說明最多的那個
3.有備註原文(英文)的那個

導致答題者根本不用看仔細題目，就可以選答案...
請逐題幫我檢查、調整

1.盡量都讓長度相似，如果可以，正確答案的長度不要短、也不要長於其他選項
2.舉個例子
A：A方法
B：B方法
C：C方法(C way)，可以有效果
D：D方法

C選項有特別備註C方法的英文，並說明有什麼效果，這樣答題者就很明顯會選C方法，應當要以以下做為調整：
A：A方法(A way)
B：B方法(B way)
C：C方法(C way)
D：D方法(D way)

可以增加其他選項的迷惑性，但不得亂講，其他選項也要是跟AI考試相關的內容
3.專業術語全部都要英文備註

4.請參考附件，這個是AI考試的相關參考資料，有助於你調整內容