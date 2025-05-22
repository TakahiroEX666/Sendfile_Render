const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: '/tmp/' });

const FILE_PATH = '/tmp/singlefile';
let lastUploadedName = null;

// อัปโหลดไฟล์ (ผ่าน Tasker หรือ POST tool)
app.post('/upload', upload.single('file'), (req, res) => {
  if (fs.existsSync(FILE_PATH)) {
    fs.unlinkSync(FILE_PATH);
  }
  fs.renameSync(req.file.path, FILE_PATH);
  lastUploadedName = req.file.originalname;
  res.json({ status: 'ok', message: 'File uploaded successfully' });
});

// ดาวน์โหลดไฟล์ (ลิงก์คงที่)
app.get('/file', (req, res) => {
  if (fs.existsSync(FILE_PATH)) {
    res.download(FILE_PATH, lastUploadedName || 'download');
  } else {
    res.status(404).send('No file uploaded yet.');
  }
});

// เช็กลิงก์ปัจจุบัน (กัน Timeout สำหรับ Tasker)
app.get('/link', (req, res) => {
  if (fs.existsSync(FILE_PATH)) {
    res.json({ available: true, url: `${req.protocol}://${req.get('host')}/file` });
  } else {
    res.json({ available: false });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});
