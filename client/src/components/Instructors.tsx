
import { useEffect, useState } from 'react';
import jungdaejinImage from '../assets/jungdaejin.jpg';
import joosungImage from '../assets/joosung.png';
import hanseoImage from '../assets/hanseo.jpg';
import kwonImage from '../assets/kwon.png';
import wangDrImage from '../assets/wang_dr.png';
import choiAdmImage from '../assets/choi_adm.png';
import kangProImage from '../assets/kang_pro.jpg';
import kangColImage from '../assets/kang_col.jpg';
import kimProImage from '../assets/kim_pro.jpeg';
import jungDrImage from '../assets/jung_dr.jpg';
import hanViceImage from '../assets/han_vice.jpg';
import hongProImage from '../assets/hong_pro.jpg';

interface Instructor {
  name: string;
  title: string;
  image: string;
}

const instructors: Instructor[] = [
  { name: "정대진", title: "교수", image: jungdaejinImage },
  { name: "주성하", title: "북한전문기자", image: joosungImage },
  { name: "한서희", title: "북한정보 자문위원", image: hanseoImage },
  { name: "권기형", title: "참전 용사", image: kwonImage },
  { name: "왕선택", title: "박사", image: wangDrImage },
  { name: "최명환", title: "제독(예)", image: choiAdmImage },
  { name: "강동완", title: "교수", image: kangProImage },
  { name: "강정희", title: "대령(예)", image: kangColImage },
  { name: "김동수", title: "교수", image: kimProImage },
  { name: "정성장", title: "박사", image: jungDrImage },
  { name: "한용섭", title: "부총장", image: hanViceImage },
  { name: "홍석훈", title: "교수", image: hongProImage }
];

const Instructors = () => {
  const textStyle = {
    wordBreak: 'keep-all' as const,
    overflowWrap: 'break-word' as const
  };

  return (
    <section id="instructors" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-2xl font-bold text-navy mb-3" style={textStyle}>
            강사진 소개
          </h2>
          <p className="text-base md:text-lg text-gray-600" style={textStyle}>
            해군 장병들에게 전문성과 감동을 전하는 강사진
          </p>
          <p className="text-sm text-gray-500 mt-2">
            총 {instructors.length}명의 전문 강사진
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex animate-scroll gap-8 py-4">
            {[...instructors, ...instructors].map((instructor, index) => (
              <div
                key={index}
                className="flex-none w-40 flex flex-col items-center mx-2"
              >
                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 border-2 border-gray-300 ${instructor.name === "최명환" ? "md:w-48" : ""}`}>
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-full object-cover filter grayscale"
                  />
                </div>
                <h4 className="text-lg font-bold text-navy mb-1" style={textStyle}>
                  {instructor.name}
                </h4>
                <p className="text-sm text-gray-600" style={textStyle}>
                  {instructor.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-3 md:p-4 rounded-lg border-l-4 border-gold mt-8">
          <p className="text-gray-700 text-sm" style={textStyle}>
            "현장 경험과 전문 지식을 겸비한 최고의 강사진이 해군 장병들에게 생생한 교육을 제공합니다."
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
          display: inline-flex;
          will-change: transform;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Instructors;
