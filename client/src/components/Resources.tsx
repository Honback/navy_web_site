import {
  Book,
  Calendar,
  ExternalLink,
  Lock,
  User,
  Phone,
  Building,
  Mail,
  Award,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

// 다이얼로그 상태를 관리할 전역 변수
let dialogSetterFunction: ((open: boolean) => void) | null = null;

// 외부에서 다이얼로그를 열 수 있는 함수
export function openCalendarDialog() {
  if (dialogSetterFunction) {
    dialogSetterFunction(true);
  } else {
    console.error("다이얼로그 세터 함수가 설정되지 않았습니다.");
  }
}

interface AccessRequestForm {
  email: string;
  name: string;
  rank: string;
  unit: string;
  phone: string;
  reason: string;
}

const Resources = () => {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AccessRequestForm>({
    email: "",
    name: "",
    rank: "",
    unit: "",
    phone: "",
    reason: "",
  });
  const { toast } = useToast();

  // 컴포넌트가 마운트될 때 다이얼로그 세터 함수를 전역 변수에 저장
  useEffect(() => {
    dialogSetterFunction = setLoginDialogOpen;

    // 컴포넌트가 언마운트될 때 정리
    return () => {
      dialogSetterFunction = null;
    };
  }, []);

  const handleCalendarAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoginDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.endsWith("@gmail.com")) {
      toast({
        title: "Gmail 계정이 필요합니다",
        description: "Gmail로만 일정표에 접근할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 폼 데이터를 API로 전송합니다
      const response = await fetch("/api/access-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 성공 메시지 표시
        toast({
          title: "요청이 제출되었습니다",
          description:
            "관리자 승인 후 이메일로 일정표 접근 권한을 보내드립니다.",
        });

        // 폼 초기화 및 다이얼로그 닫기
        setLoginDialogOpen(false);
        setFormData({
          email: "",
          name: "",
          rank: "",
          unit: "",
          phone: "",
          reason: "",
        });
      } else {
        // 에러 메시지 표시
        toast({
          title: "요청 제출 실패",
          description:
            data.message ||
            "요청을 처리하는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("요청 제출 오류:", error);
      toast({
        title: "요청 제출 실패",
        description:
          "서버 연결에 문제가 발생했습니다. 나중에 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  // 공통 스타일 정의
  const textStyle = {
    wordBreak: "keep-all" as const,
    overflowWrap: "break-word" as const,
  };

  return (
    <section id="resources" className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2
            className="text-2xl md:text-2xl font-bold text-navy mb-3"
            style={textStyle}
          >
            필승해군캠프 자료실
          </h2>
          <p className="text-base md:text-lg text-gray-600" style={textStyle}>
            교육에 필요한 자료들을 확인하세요
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white rounded-lg shadow-lg p-5 md:p-6 flex flex-col">
            <div className="flex items-center mb-3 md:mb-4">
              <Book className="text-navy w-6 h-6 md:w-7 md:h-7 mr-2 md:mr-3 flex-shrink-0" />
              <h3
                className="text-lg md:text-xl font-bold text-navy"
                style={textStyle}
              >
                운영매뉴얼
              </h3>
            </div>
            <p
              className="text-sm md:text-base text-gray-600 mb-5 md:mb-6 flex-grow"
              style={textStyle}
            >
              필승해군캠프 운영매뉴얼 (부대 담당자용) 문서입니다. 교육 준비 및
              진행에 필요한 상세 내용을 확인하세요.
            </p>
            <Button
              className="mt-auto flex items-center justify-center bg-navy hover:bg-navy-dark text-sm md:text-base"
              onClick={() =>
                window.open(
                  "https://coal-trampoline-cb5.notion.site/1-1-1e76db55f81c80c19fc1e35f05d90f4a?pvs=4",
                  "_blank",
                )
              }
            >
              매뉴얼 보기
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-5 md:p-6 flex flex-col">
            <div className="flex items-center mb-3 md:mb-4">
              <Calendar className="text-navy w-6 h-6 md:w-7 md:h-7 mr-2 md:mr-3 flex-shrink-0" />
              <h3
                className="text-lg md:text-xl font-bold text-navy"
                style={textStyle}
              >
                전체 일정표
              </h3>
            </div>
            <p
              className="text-sm md:text-base text-gray-600 mb-5 md:mb-6 flex-grow"
              style={textStyle}
            >
              필승해군캠프 일정표는 보안 문서로, Gmail을 통한 개인정보 확인 및
              관리자 승인 후 제공됩니다.
            </p>
            <Button
              className="mt-auto flex items-center justify-center bg-navy hover:bg-navy-dark text-sm md:text-base text-yellow-300 hover:text-yellow-400"
              onClick={handleCalendarAccess}
            >
              일정표 접속 요청
              <Lock className="ml-2 h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={textStyle}>일정표 접근 요청</DialogTitle>
            <DialogDescription style={textStyle}>
              보안 사항으로 인적사항 확인이 필요합니다. 아래 정보를 입력하시면
              관리자 검토 후 접근 권한을 드립니다.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="name"
                  className="flex items-center font-medium text-navy whitespace-nowrap"
                  style={textStyle}
                >
                  <User className="h-4 w-4 mr-1.5" /> 이름{" "}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="홍길동"
                  className="text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="rank"
                  className="flex items-center font-medium text-navy whitespace-nowrap"
                  style={textStyle}
                >
                  <Award className="h-4 w-4 mr-1.5" /> 계급{" "}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="rank"
                  name="rank"
                  value={formData.rank}
                  onChange={handleInputChange}
                  placeholder="중령"
                  className="text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="unit"
                  className="flex items-center font-medium text-navy whitespace-nowrap"
                  style={textStyle}
                >
                  <Building className="h-4 w-4 mr-1.5" /> 소속{" "}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  placeholder="해군본부"
                  className="text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="email"
                  className="flex items-center font-medium text-navy whitespace-nowrap"
                  style={textStyle}
                >
                  <Mail className="h-4 w-4 mr-1.5" /> 이메일{" "}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@gmail.com"
                  className="text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="phone"
                  className="flex items-center font-medium text-navy whitespace-nowrap"
                  style={textStyle}
                >
                  <Phone className="h-4 w-4 mr-1.5" /> 연락처{" "}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="010-1234-5678"
                  className="text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="reason"
                  className="flex items-center font-medium text-navy whitespace-nowrap"
                  style={textStyle}
                >
                  요청사유
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="일정표 접근이 필요한 사유를 간략히 기재해주세요."
                  className="text-sm"
                  rows={3}
                />
              </div>
              <div className="mt-2">
                <p
                  className="text-xs md:text-sm text-gray-500 leading-relaxed"
                  style={textStyle}
                >
                  ※ Gmail로만 일정표에 접근할 수 있습니다.{" "}
                  <br className="hidden md:block" />
                  제공하신 정보는 관리자 이메일로 전송되며 승인 후 접근 권한이
                  부여됩니다.
                </p>
                <p className="text-xs text-gray-500 mt-1" style={textStyle}>
                  <span className="text-red-500">*</span> 표시는 필수 입력
                  항목입니다.
                </p>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLoginDialogOpen(false)}
                className="text-sm"
              >
                취소
              </Button>
              <Button
                type="submit"
                className="bg-navy hover:bg-navy-dark text-sm"
              >
                요청 제출
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Resources;
