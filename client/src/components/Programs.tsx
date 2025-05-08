import {
  CheckCircle,
  ShieldAlert,
  Anchor,
  Users,
  Brain,
  Star,
  Award,
  Shield,
} from "lucide-react";
import navyLectureImage from "../assets/navy_image2.jpg";
import navyOnboardImage from "../assets/navy_img_1.jpg";
import navyCeremonyImage from "../assets/navy_ceremony.jpg";
import navyTeamMeetingImage from "../assets/navy_img_2.jpg";

const Programs = () => {
  // 공통 스타일 정의
  const textStyle = {
    wordBreak: "keep-all" as const,
    overflowWrap: "break-word" as const,
  };

  return (
    <section id="programs" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2
            className="text-2xl md:text-2xl font-bold text-navy mb-3"
            style={textStyle}
          >
            교육 프로그램 안내
          </h2>
          <p className="text-base md:text-lg text-gray-600" style={textStyle}>
            정예 해군 장병 육성을 위한 체계적인 교육 프로그램 구성
          </p>
        </div>

        {/* 메인 프로그램 3가지 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* 1. 해군 정체성 초빙강연 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <img
                src={navyLectureImage}
                alt="해군 정체성 초빙강연"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 md:p-5">
              <div className="flex items-center mb-2">
                <Anchor className="text-gold w-4 h-4 mr-2 flex-shrink-0" />
                <h3
                  className="text-base md:text-lg font-bold text-navy"
                  style={textStyle}
                >
                  해군 정체성 초빙강연
                </h3>
              </div>
              <p
                className="text-sm font-bold bg-blue-50 px-2 py-1 rounded-sm mb-3 md:mb-4"
                style={textStyle}
              >
                해군 자긍심 고취 및 정체성 함양 교육
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-gold mr-2 flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} />
                  </span>
                  <span style={textStyle}>
                    해군 창군기, 발전 과정, 주요 해전 이해
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2 flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} />
                  </span>
                  <span style={textStyle}>
                    제1·2연평해전 등 피로써 지킨 바다의 역사
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2 flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} />
                  </span>
                  <span style={textStyle}>세계 속 대한민국 해군의 위상</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 2. 군인정신 초빙강연 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <img
                src={navyOnboardImage}
                alt="군인정신 초빙강연"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 md:p-5">
              <div className="flex items-center mb-2">
                <Award className="text-gold w-4 h-4 mr-2 flex-shrink-0" />
                <h3
                  className="text-base md:text-lg font-bold text-navy"
                  style={textStyle}
                >
                  군인정신 초빙강연
                </h3>
              </div>
              <p
                className="text-sm font-bold bg-blue-50 px-2 py-1 rounded-sm mb-3 md:mb-4"
                style={textStyle}
              >
                국가관·대적관·군인정신 함양
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-gold mr-2 flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} />
                  </span>
                  <span style={textStyle}>
                    투철한 국가관과 자유민주주의 이념 확립
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2 flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} />
                  </span>
                  <span style={textStyle}>북한의 군사적 위협과 실상 이해</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2 flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} />
                  </span>
                  <span style={textStyle}>한미동맹의 중요성 인식</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. 정신전력 강화 프로그램(선택형) */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <img
                src={navyTeamMeetingImage}
                alt="정신전력 강화 프로그램"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 md:p-5">
              <div className="flex items-center mb-2">
                <Star className="text-gold w-4 h-4 mr-2 flex-shrink-0" />
                <h3
                  className="text-base md:text-lg font-bold text-navy"
                  style={textStyle}
                >
                  정신전력 강화 프로그램
                </h3>
              </div>
              <p
                className="text-sm font-bold text-gray-600 bg-blue-50 px-2 py-1 rounded-sm mb-3 md:mb-4"
                style={textStyle}
              >
                부대 특성에 맞게 선택형으로 진행
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-gold mr-2 flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} />
                  </span>
                  <span style={textStyle}>
                    함정 특성과 요구에 맞게 프로그램 선택 가능
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2 flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} />
                  </span>
                  <span style={textStyle}>
                    부대 맞춤형 활동으로 교육 효과 극대화
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2 flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} />
                  </span>
                  <span style={textStyle}>
                    아래 5가지 프로그램 중 선택 가능
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-5 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center mb-5">
                <h3
                  className="text-lg md:text-xl font-bold text-navy mb-2 md:mb-0 md:mr-4"
                  style={textStyle}
                >
                  교육 프로그램 소개
                </h3>
                <p className="text-sm text-gray-600" style={textStyle}>
                  교육 과정별 특징과 세부 내용
                </p>
              </div>

              <div className="grid gap-5">
                <div className="border border-gray-200 rounded-lg p-4 md:p-5 hover:border-gold transition">
                  <h4
                    className="text-base font-bold text-navy mb-2 flex items-start"
                    style={textStyle}
                  >
                    <span className="bg-white text-navy rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <Anchor size={16} className="text-navy" />
                    </span>
                    해군 정체성 초빙강연
                  </h4>
                  <ul className="space-y-1 pl-4 md:pl-8 text-sm">
                    <li className="list-disc" style={textStyle}>
                      창군 80주년을 맞아 해군의 역사와 위상에 대한 이해
                    </li>
                    <li className="list-disc" style={textStyle}>
                      해군의 가치와 비전에 대한 전문가 강연
                    </li>
                    <li className="list-disc" style={textStyle}>
                      해군만의 특성을 이해하고 자긍심 고취
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 md:p-5 hover:border-gold transition">
                  <h4
                    className="text-base font-bold text-navy mb-2 flex items-start"
                    style={textStyle}
                  >
                    <span className="bg-white text-navy rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <Shield size={16} className="text-navy" />
                    </span>
                    군인정신 초빙강연
                  </h4>
                  <ul className="space-y-1 pl-4 md:pl-8 text-sm">
                    <li className="list-disc" style={textStyle}>
                      올바른 국가관과 대적관 확립을 위한 강연
                    </li>
                    <li className="list-disc" style={textStyle}>
                      군인으로서의 핵심가치와 사명감 함양
                    </li>
                    <li className="list-disc" style={textStyle}>
                      해군 장병으로서의 정체성과 책임감 강화
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 md:p-5 hover:border-gold transition">
                  <h4
                    className="text-base font-bold text-navy mb-2 flex items-start"
                    style={textStyle}
                  >
                    <span className="bg-white text-navy rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <Brain size={16} className="text-navy" />
                    </span>
                    심리역량 강화 교육
                  </h4>
                  <ul className="space-y-1 pl-4 md:pl-8 text-sm">
                    <li className="list-disc" style={textStyle}>
                      모바일 성격유형 검사 등을 활용하여 장병 개인별 심리적 강점
                      인지
                    </li>
                    <li className="list-disc" style={textStyle}>
                      자기이해를 바탕으로 한 개인 맞춤형 심리역량 강화 방안 제시
                    </li>
                    <li className="list-disc" style={textStyle}>
                      전투상황 등 극한 스트레스 환경에서의 자기조절 및 대처기법
                      습득
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 p-4 rounded-lg border-l-4 border-gold">
                <p className="text-gray-700" style={textStyle}>
                  "모든 교육 프로그램은 함정 특성과 요구에 맞게 조정 가능합니다.
                  교육 문의는 운영사무국으로 연락주시기 바랍니다."
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Programs;
