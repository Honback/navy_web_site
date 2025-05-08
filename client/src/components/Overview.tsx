import { MessageSquare } from "lucide-react";
import navyOverviewImage from "../assets/navy/navy_image1.jpg";
import navyIdentityImage from "../assets/navy/navy_identity.jpg";

const Overview = () => {
  return (
    <section id="overview" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">필승해군캠프 개요</h2>
          <p className="text-base md:text-lg text-gray-600">해군 장병들의 정신전력 강화를 위한 맞춤형 교육 프로그램</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
          <div className="md:w-1/2">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src={navyOverviewImage}
                alt="해군 필승캠프 강연 장면" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-lg md:text-xl font-bold text-navy mb-3">추진 배경:</h3>
            <ul className="list-disc pl-5 space-y-1.5 mb-4 text-sm md:text-base">
              <li>함정 근무자의 잦은 출동으로 정기적 정신전력 교육 참여 어려움</li>
              <li>함상 근무 장병들의 스트레스 해소 필요</li>
              <li>일상 환경을 벗어난 부대 단합활동 요구</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-navy">
          <p className="text-gray-700 italic text-sm md:text-base">
            "필승해군캠프는 해상 근무 장병들의 정신무장 강화와 자긍심 고취를 위한 교육 프로그램입니다. 부대별 여건에 맞게 합숙교육(1박 2일) 또는 집중교육(1일) 과정으로 운영하고 있습니다."
          </p>
        </div>
      </div>
    </section>
  );
};

export default Overview;
