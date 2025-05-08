import { ClipboardList, Presentation, BarChart } from "lucide-react";

const Staff = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-navy mb-4">담당자 업무 안내</h2>
          <p className="text-xl text-gray-600">원활한 교육 진행을 위한 담당자(겸임정훈관) 업무 가이드</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 mb-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-navy"> {/* Modified */}
                <div className="mb-6">
                  <div className="flex items-center justify-center">
                    <ClipboardList size={24} className="text-navy mr-3" />
                    <h3 className="text-xl font-bold text-navy">사전 준비</h3>
                    <span className="text-sm text-gray-500 ml-2">(D-30~D-1)</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-navy mr-2">•</span>
                    <span>교육 신청</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-navy mr-2">•</span>
                    <span>일정/장소 확인</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-navy mr-2">•</span>
                    <span>참가자 안내</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-navy mr-2">•</span>
                    <span>자료 확인</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gold"> {/* Modified */}
                <div className="mb-6">
                  <div className="flex items-center justify-center">
                    <Presentation size={24} className="text-gold mr-3" />
                    <h3 className="text-xl font-bold text-navy">교육 당일</h3>
                    <span className="text-sm text-gray-500 ml-2">(D-Day)</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-navy mr-2">•</span>
                    <span>참가자 인솔</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-navy mr-2">•</span>
                    <span>교육 참여 독려</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-navy mr-2">•</span>
                    <span>질서 유지</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-navy mr-2">•</span>
                    <span>비상상황 대비</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border-2 border-navy"> {/* Modified */}
                <div className="mb-6">
                  <div className="flex items-center justify-center">
                    <BarChart size={24} className="text-navy mr-3" />
                    <h3 className="text-xl font-bold text-navy">사후 관리</h3>
                    <span className="text-sm text-gray-500 ml-2">(D+1~D+7)</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-navy mr-2">•</span>
                    <span>안전한 복귀</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-navy mr-2">•</span>
                    <span>설문조사 독려</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-navy mr-2">•</span>
                    <span>결과 공유</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-navy mr-2">•</span>
                    <span>피드백 제출</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 p-4 rounded-lg border-l-4 border-gold">
              <p className="text-gray-700 italic">
                "교육 시작 약 4주 전에 운영사무국 직원이 개별적으로 연락을 드리며, 이후 업무 및 체크리스트를 전달드립니다. 함께 협의하여 성공적인 교육을 준비해주세요."
              </p>
            </div>
          </div>
        </div>

        {/* Resources 버튼 */}
        <div className="flex justify-center mt-8">
          <a
            href="#resources"
            className="bg-navy hover:bg-navy-dark text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-lg"
          >
            운영매뉴얼 바로가기
          </a>
        </div>
      </div>
    </section>
  );
};

export default Staff;