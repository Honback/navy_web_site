import { Phone, Mail } from "lucide-react";

const Footer = () => {
  // 공통 스타일 정의
  const textStyle = {
    wordBreak: 'keep-all' as const,
    overflowWrap: 'break-word' as const
  };

  return (
    <footer className="bg-navy-dark text-white py-6 md:py-10">
      <div className="container mx-auto px-4">
        {/* 로고 및 캠프명 */}
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <div className="flex items-center mb-2">
            <img 
            src="/EMBLEM.png" 
            alt="대한민국 해군" 
            className="w-8 h-8 md:w-10 md:h-10 mr-2"
          />
            <h2 className="text-gray-200 text-lg md:text-xl font-bold" style={textStyle}>필승해군캠프</h2>
          </div>
          <p className="text-gray-300 text-sm md:text-base text-center" style={textStyle}>싸우면 승리하는 정예 해군 장병 육성의 요람</p>
        </div>

        {/* 내비게이션 메뉴 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          {/* 교육 정보 */}
          <div className="text-center sm:text-left">
            <h3 className="text-gold font-bold text-base md:text-lg mb-2" style={textStyle}>교육 정보</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li><a href="#overview" className="hover:text-white transition-colors" style={textStyle}>필승해군캠프 개요</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors" style={textStyle}>교육 프로그램</a></li>
              <li><a href="#schedule" className="hover:text-white transition-colors" style={textStyle}>교육 일정</a></li>
              <li><a href="#instructors" className="hover:text-white transition-colors" style={textStyle}>강사진 소개</a></li>
            </ul>
          </div>

          {/* 신청 안내 */}
          <div className="text-center sm:text-left">
            <h3 className="text-gold font-bold text-base md:text-lg mb-2" style={textStyle}>신청 안내</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li><a href="#application" className="hover:text-white transition-colors" style={textStyle}>신청 절차</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors" style={textStyle}>자주 묻는 질문</a></li>
              <li><a href="#resources" className="hover:text-white transition-colors" style={textStyle}>자료실</a></li>
            </ul>
          </div>

          {/* 문의처 */}
          <div className="text-center sm:text-left md:mx-auto">
            <h3 className="text-gold font-bold text-base md:text-lg mb-2" style={textStyle}>문의처</h3>
            <ul className="space-y-1 text-gray-300 text-sm inline-block">
              <li className="flex items-center justify-center sm:justify-start">
                <Phone size={14} className="mr-2 flex-shrink-0" />
                <span style={textStyle}>02-6342-2802</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start">
                <Mail size={14} className="mr-2 flex-shrink-0" />
                <span style={textStyle}>kdh@parancompany.co.kr</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 저작권 */}
        <div className="border-t border-gray-700 pt-4 text-center">
          <p className="text-gray-400 text-xs" style={textStyle}>© 2025 대한민국 해군. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;