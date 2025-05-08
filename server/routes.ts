import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { sendEmail } from "./services/email";

interface AccessRequestBody {
  name: string;
  rank: string;
  unit: string;
  email: string;
  phone: string;
  reason: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get('/api/healthcheck', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // 일정표 접근 요청 이메일 전송 API
  app.post('/api/access-request', async (req: Request, res: Response) => {
    try {
      const { name, rank, unit, email, phone, reason } = req.body as AccessRequestBody;

      const htmlContent = `
        <h2>필승해군캠프 일정표 접근 요청</h2>
        <p><strong>이름:</strong> ${name}</p>
        <p><strong>계급:</strong> ${rank}</p>
        <p><strong>소속:</strong> ${unit}</p>
        <p><strong>이메일:</strong> ${email}</p>
        <p><strong>연락처:</strong> ${phone}</p>
        <p><strong>요청사유:</strong> ${reason}</p>
      `;

      const textContent = `
        필승해군캠프 일정표 접근 요청
        이름: ${name}
        계급: ${rank}
        소속: ${unit}
        이메일: ${email}
        연락처: ${phone}
        요청사유: ${reason}
      `;

      // from 필드는 이제 email.ts에서 고정값으로 설정됨
      const success = await sendEmail({
        to: 'kdh@parancompany.co.kr',
        subject: '필승해군캠프 일정표 접근 요청',
        html: htmlContent,
        text: textContent
      });

      if (success) {
        return res.status(200).json({ success: true, message: '이메일이 전송되었습니다' });
      } else {
        return res.status(500).json({ success: false, message: '이메일 전송에 실패했습니다' });
      }
    } catch (error) {
      console.error('Email sending error:', error);
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
