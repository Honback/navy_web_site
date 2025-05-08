import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

// 텍스트에서 ** 사이의 내용을 볼드 처리하는 유틸리티 함수
const formatTextWithBold = (text: string): React.ReactNode => {
  // ** 기호로 둘러싸인 텍스트를 찾아 볼드 처리
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // 볼드 처리할 텍스트 (**를 제거하고 강조)
      const boldText = part.substring(2, part.length - 2);
      return <strong key={index} className="font-bold text-navy-dark">{boldText}</strong>;
    }
    // 일반 텍스트는 그대로 반환
    return part;
  });
};

interface FAQItem {
  question: string;
  answer: string | React.ReactNode; // 문자열 또는 React 노드 허용
}

const faqItems: FAQItem[] = [
  {
    question: "교육 신청은 어떻게 하나요?",
    answer: "교육 대상 함정을 선정하고, 각 함정이 **1일 또는 2일 프로그램** 중 어떤 걸 운영할지는 **각 함대 정훈공보실**에서 결정합니다. 각 함대 정훈공보실과 협의하여 **신청 날짜, 프로그램 형태**(1일/2일) 등을 제출하시기 바랍니다. **1차 신청기한 취합은 5월 중 완료 예정**이며, 교육일 변경은 **최소 6주 전**에 운영사무국에 통보해주시기 바랍니다."
  },
  {
    question: "준비물은 무엇인가요?",
    answer: "**필기구, 세면도구, 운동복**(필요시) 등이 필요합니다. 정확한 준비물 목록은 **교육 확정 후 운영 사무국에서 제공하는 안내**를 참조하세요."
  },
  {
    question: "일정 변경은 가능한가요?",
    answer: "**불가피한 사유**로 정해진 일정에 교육 진행이 불가능한 경우, 변경이 가능합니다. 일정을 변경하는 경우, 교육장 등에서 **위약금**이 발생합니다. **긴급한 출동 등 불가피한 사유일 경우에만** 일정을 변경하여 주시기 바랍니다. 일정 취소 후 다음 일정 예약은 교육장 대관 등을 위해 **2개월 이후의 날짜**를 선택해주셔야 합니다."
  },
  {
    question: "원하는 특정 날짜에 교육 진행이 가능한가요?",
    answer: "희망 날짜가 신청 날짜와 **2달 정도 차이**가 있으면 대부분 교육 진행이 가능합니다. 원활한 교육장 대관을 위해 **충분한 시간(2달 이상)**을 두고 교육 신청을 해주시기 바랍니다."
  },
  {
    question: "'정신전력 강화 프로그램'은 부대에서 선택할 수 있나요?",
    answer: "**가능합니다**. (필수 교육 외) **팀 빌딩, 레크리에이션** 등 부대 희망 프로그램을 운영사무국에 제안해주시면 최대한 반영되도록 노력하겠습니다."
  },
  {
    question: "필승해군캠프가 진행되는 장소는 어떻게 선정하나요?",
    answer: "교육 희망 날짜에 **교육장과 숙소 등 예약이 가능한 시설**을 확인합니다. 그리고 예약 가능 시설 중 **가장 좋은 환경을 가진 곳**을 선정합니다. 또한 **부대 인근 시설을 우선 고려**합니다."
  },
  {
    question: "필승해군캠프 관련하여 정훈공보실/부대 담당자/운영사무국의 주요 역할은 무엇인가요?",
    answer: "**정훈공보실**은 교육 대상 부대 선정과 일정 조율을, **부대 담당자**는 교육생 인솔과 현장 지원을, **운영사무국**은 교육 장소 섭외와 강사 매칭 및 전반적인 교육 운영을 담당합니다. 각 주체가 협력하여 성공적인 교육이 이루어질 수 있도록 합니다."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  // 답변을 렌더링하는 함수
  const renderAnswer = (answer: string | React.ReactNode): React.ReactNode => {
    if (typeof answer === 'string') {
      return formatTextWithBold(answer);
    }
    return answer;
  };

  // 공통 스타일 정의
  const textStyle = {
    wordBreak: 'keep-all' as const,
    overflowWrap: 'break-word' as const
  };

  return (
    <section id="faq" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10 bg-navy-dark p-6 md:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-wide" style={textStyle}>FAQ (자주 묻는 질문)</h2>
          <p className="text-base md:text-lg text-white/90" style={textStyle}>더 알고 싶은 내용이 있나요?</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {faqItems.map((item, index) => (
                <div key={index} className="faq-item">
                  <button 
                    className="faq-question w-full px-4 md:px-6 py-3 md:py-4 text-left focus:outline-none flex justify-between items-center hover:bg-gray-50"
                    onClick={() => toggleQuestion(index)}
                    aria-expanded={openIndex === index}
                    style={textStyle}
                  >
                    <span className="font-bold text-navy text-sm md:text-base pr-2">{item.question}</span>
                    <ChevronDown 
                      className={`text-navy transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                      size={18}
                    />
                  </button>
                  <div className={`faq-answer px-4 md:px-6 py-3 md:py-4 bg-gray-50/70 ${openIndex === index ? 'block' : 'hidden'}`}>
                    <div className="text-gray-700 text-sm md:text-base leading-relaxed space-y-2 tracking-wide" style={textStyle}>
                      {renderAnswer(item.answer)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
