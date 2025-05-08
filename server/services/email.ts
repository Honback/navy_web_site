import nodemailer from 'nodemailer';

interface EmailParams {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    // 환경 변수 확인
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_APP_PASSWORD;

    if (!emailUser || !emailPassword) {
      console.error('Gmail 계정 정보가 환경 변수에 설정되지 않았습니다.');
      return false;
    }

    // 트랜스포터 생성
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword
      }
    });

    // 이메일 옵션 설정
    const mailOptions = {
      from: params.from || `"일정표 접근 요청" <${emailUser}>`,
      to: params.to,
      replyTo: params.replyTo || emailUser,
      subject: params.subject,
      text: params.text || '',
      html: params.html || ''
    };

    // 이메일 발송
    const info = await transporter.sendMail(mailOptions);
    console.log('이메일 발송 성공:', info.messageId);
    return true;
  } catch (error) {
    console.error('Gmail 이메일 오류:', error);
    return false;
  }
}

// 일정표 접근 요청 이메일을 보내는 함수 추가
export async function sendAccessRequestEmail(data: {
  name: string;
  rank: string; 
  department: string;
  email: string;
  phone: string;
  reason: string;
}): Promise<boolean> {
  const { name, rank, department, email, phone, reason } = data;

  
  // HTML 형식 이메일 내용
  const htmlContent = `
    <h2>필승해군캠프 일정표 접근 요청</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px; margin-top: 20px;">
      <tr style="background-color: #f2f2f2;">
        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 30%;">항목</th>
        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 70%;">내용</th>
      </tr>
      <tr>
        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold;">이름</td>
        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${name}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold;">계급</td>
        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${rank}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold;">소속</td>
        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${department}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold;">이메일</td>
        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${email}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold;">연락처</td>
        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${phone}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold;">요청사유</td>
        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${reason ? reason.replace(/\n/g, '<br>') : '제공되지 않음'}</td>
      </tr>
    </table>
  `;

  
  // 텍스트 형식 이메일 내용
  const textContent = `
일정표 접근 요청:
이름: ${name}
계급: ${rank}
소속: ${department}
이메일: ${email}
연락처: ${phone}
요청사유: ${reason}
  `;

  return await sendEmail({
    to: process.env.EMAIL_USER || 'ktj@parancompany.co.kr', // 수신자 이메일
    subject: `일정표 접근 요청: ${name}님`,
    html: htmlContent,
    text: textContent,
    replyTo: email // 답장 시 요청자의 이메일로 발송
  });
}