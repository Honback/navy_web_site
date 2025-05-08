
import { Phone, Mail, Brain, Users, Activity, LibraryBig } from "lucide-react";

const Application = () => {
  const textStyle = {
    wordBreak: 'keep-all' as const,
    overflowWrap: 'break-word' as const
  };

  return (
    <section id="application" className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">신청 및 진행 절차</h2>
          <p className="text-base md:text-lg text-gray-600">간편하게 신청하고 효과적으로 교육받는 방법</p>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          <div className="border border-gray-200 rounded-lg p-4 md:p-5 hover:border-gold transition">
            <h4 className="text-base font-bold text-navy mb-2 flex items-start" style={textStyle}>
              <span className="bg-white text-navy rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                <Users size={16} className="text-navy" />
              </span>
              1. 교육신청
            </h4>
            <ul className="space-y-1 pl-4 md:pl-8 text-sm">
              <li className="list-disc" style={textStyle}>각 함대 정훈공보실을 통해 신청 날짜, 프로그램 형태(1일/2일) 등 제출</li>
              <li className="list-disc" style={textStyle}>1차 신청기한 취합은 5월 중 완료 예정</li>
              <li className="list-disc" style={textStyle}>세부 프로그램 구성 등은 운영사무국과 협의하여 결정</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 md:p-5 hover:border-gold transition">
            <h4 className="text-base font-bold text-navy mb-2 flex items-start" style={textStyle}>
              <span className="bg-white text-navy rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                <Brain size={16} className="text-navy" />
              </span>
              2. 일정 및 장소 확정
            </h4>
            <ul className="space-y-1 pl-4 md:pl-8 text-sm">
              <li className="list-disc" style={textStyle}>운영사무국에서 교육장소 섭외 및 강사 매칭</li>
              <li className="list-disc" style={textStyle}>신청 함정에 최종 교육 일정 및 장소 통보</li>
              <li className="list-disc" style={textStyle}>교육 관련 세부사항 조율</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 md:p-5 hover:border-gold transition">
            <h4 className="text-base font-bold text-navy mb-2 flex items-start" style={textStyle}>
              <span className="bg-white text-navy rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                <Activity size={16} className="text-navy" />
              </span>
              3. 교육 실시
            </h4>
            <ul className="space-y-1 pl-4 md:pl-8 text-sm">
              <li className="list-disc" style={textStyle}>계획된 일정에 따라 교육 진행</li>
              <li className="list-disc" style={textStyle}>교육 만족도 및 효과성 측정을 위한 설문조사 실시</li>
              <li className="list-disc" style={textStyle}>교육 결과 피드백 수집</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 md:p-5 hover:border-gold transition">
            <h4 className="text-base font-bold text-navy mb-2 flex items-start" style={textStyle}>
              <span className="bg-white text-navy rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                <LibraryBig size={16} className="text-navy" />
              </span>
              4. 사후 관리
            </h4>
            <ul className="space-y-1 pl-4 md:pl-8 text-sm">
              <li className="list-disc" style={textStyle}>운영사무국에서 교육 결과 보고서 작성 및 공유</li>
              <li className="list-disc" style={textStyle}>차기 교육 개선을 위한 피드백 반영</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gold mt-8 max-w-4xl mx-auto">
          <p className="text-gray-700 italic text-sm md:text-base">
            "교육 일정 변경은 교육장 대관 등을 위해 최소 4주 전에 운영사무국에 통보해주시기 바랍니다. 불가피한 일정 변경 시 위약금이 발생할 수 있으니 긴급 출동 등 불가피한 사유일 경우에만 변경해주시길 부탁드립니다."
          </p>
        </div>
      </div>
    </section>
  );
};

export default Application;
