import { Calendar, Edit, Users, MapPin, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { openCalendarDialog } from "./Resources";

// 실제 해군 캠프 이미지 가져오기
import navyImage1 from "../assets/navy/navy_image1.jpg";
import navyImage2 from "../assets/navy/navy_image2.jpg";
import navyImage3 from "../assets/navy/navy_image3.jpg";
import navyImage4 from "../assets/navy/navy_image4.jpg";

// 이미지 배열 - 제공된 해군 캠프 이미지
const backgroundImages = [navyImage1, navyImage2, navyImage3, navyImage4];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  // 배경 이미지 자동 전환 효과
  useEffect(() => {
    const intervalId = setInterval(() => {
      setFadeIn(false); // 페이드 아웃 시작

      // 페이드 아웃 후 이미지 변경
      setTimeout(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % backgroundImages.length,
        );
        setFadeIn(true); // 페이드 인 시작
      }, 1000);
    }, 6000); // 각 이미지를 6초간 표시

    return () => clearInterval(intervalId);
  }, []);

  // 현재 표시되는 이미지
  const currentImage = backgroundImages[currentImageIndex];

  // 공통 스타일 정의
  const textStyle = {
    wordBreak: "keep-all" as const,
    overflowWrap: "break-word" as const,
  };

  return (
    <section className="relative bg-navy-dark text-white py-12 md:py-20">
      <div className="absolute inset-0 z-0 bg-black opacity-75"></div>

      {/* 배경 이미지 슬라이더 */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ${fadeIn ? "" : "opacity-0"}`}
        style={{
          backgroundImage: `url(${currentImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          opacity: fadeIn ? 0.4 : 0,
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-3 md:mb-4 text-white"
            style={{
              textShadow:
                "0 2px 8px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.8)",
              letterSpacing: "0.05em",
              ...textStyle,
            }}
          >
            2025 필승해군캠프
          </h1>
          <p
            className="text-base md:text-lg font-medium mb-6 md:mb-8"
            style={{
              textShadow: "0 2px 5px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.8)",
              letterSpacing: "-0.02em",
              ...textStyle,
            }}
          >
            "싸우면 승리하는 정예 해군 장병 육성을 위한 특별 교육 프로그램"
          </p>

          <div
            className="bg-navy-dark/50 p-4 md:p-5 rounded-lg shadow-lg mb-5 md:mb-8 border border-gold/30 text-left"
            style={textStyle}
          >
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-white text-navy rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  <Users size={12} className="text-navy" />
                </span>
                <span className="text-sm md:text-base" style={textStyle}>
                  <strong>교육 대상</strong> : 해군 해상 근무 장병
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-white text-navy rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  <Calendar size={12} className="text-navy" />
                </span>
                <span className="text-sm md:text-base" style={textStyle}>
                  <strong>교육 형태</strong> : 합숙형(1박 2일) 또는 집중형(1일)
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-white text-navy rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  <MapPin size={12} className="text-navy" />
                </span>
                <span className="text-sm md:text-base" style={textStyle}>
                  <strong>교육 장소</strong> : 함대 소재지 인근 교육시설
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-white text-navy rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  <BookOpen size={12} className="text-navy" />
                </span>
                <span className="text-sm md:text-base" style={textStyle}>
                  <strong>교육 내용</strong> : 해군 정체성 교육, 군인정신 함양,
                  맞춤형 정신전력 프로그램
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSel3vfK_V230x_auFqTlJGY9jIjVnpMAjaV6qAlfMh9Ao05Zg/viewform"
              className="bg-gold text-navy font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-lg text-center hover:bg-gold-dark transition shadow-md flex items-center justify-center text-sm md:text-base"
              style={textStyle}
            >
              <Edit size={16} className="mr-2 flex-shrink-0" /> 교육 신청하기
            </a>

            {/* <button
              onClick={(e) => {
                e.preventDefault();
                openCalendarDialog(); // 일정표 접근 요청 다이얼로그 직접 열기
              }}
              className="bg-white text-navy font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-lg text-center hover:bg-gray-100 transition shadow-md flex items-center justify-center text-sm md:text-base"
              style={textStyle}
            >
              <Calendar size={16} className="mr-2 flex-shrink-0" /> 전체 일정 보기
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
