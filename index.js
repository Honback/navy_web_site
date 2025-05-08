const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // 정적 파일 제공

// 메인 라우트
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 이메일 발송 API
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: '필수 항목을 모두 입력해주세요.'
      });
    }

    // 환경 변수 확인 로그
    console.log('환경변수 체크:', { 
      EMAIL_USER: process.env.EMAIL_USER ? '설정됨' : '미설정', 
      EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD ? '설정됨' : '미설정' 
    });

    // 트랜스포터 생성
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    // 이메일 옵션
    const mailOptions = {
      from: `"웹사이트 문의" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `웹사이트 문의: ${name}님으로부터`,
      html: `
        <h2>웹사이트 문의</h2>
        <p><strong>이름:</strong> ${name}</p>
        <p><strong>이메일:</strong> ${email}</p>
        <p><strong>연락처:</strong> ${phone || '제공되지 않음'}</p>
        <p><strong>메시지:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // 이메일 발송
    const info = await transporter.sendMail(mailOptions);
    console.log('이메일 발송 성공:', info.messageId);

    res.status(200).json({
      success: true,
      message: '문의가 성공적으로 전송되었습니다.'
    });
  } catch (error) {
    console.error('이메일 발송 오류:', error);

    res.status(500).json({
      success: false,
      message: '문의 전송에 실패했습니다. 다시 시도해주세요.'
    });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});


