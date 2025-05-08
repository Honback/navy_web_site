import { Bed, Hourglass, MapPin } from "lucide-react";

interface ScheduleItem {
  time: string;
  activity: string;
}

const day1Schedule: ScheduleItem[] = [
  { time: "10:00 ~ 11:00", activity: "교육장 이동 및 도착" },
  { time: "11:00 ~ 12:00", activity: "입교식 및 교육안내" },
  { time: "12:00 ~ 13:00", activity: "중식" },
  { time: "13:00 ~ 14:50", activity: "해군 정체성 초빙강연" },
  { time: "14:50 ~ 15:00", activity: "휴식시간" },
  { time: "15:00 ~ 17:00", activity: "정신전력 강화 프로그램" },
  { time: "17:00 ~ 18:00", activity: "행정시간" },
  { time: "18:00 ~ 18:50", activity: "석식" }
];

const day2Schedule: ScheduleItem[] = [
  { time: "07:00 ~ 08:00", activity: "조식" },
  { time: "08:00 ~ 09:00", activity: "행정 시간 (체크아웃)" },
  { time: "09:00 ~ 11:00", activity: "군인정신 초빙강연" },
  { time: "11:00 ~ 11:50", activity: "퇴소식 / 교육 설문조사" },
  { time: "12:00 ~ 12:50", activity: "중식" },
  { time: "13:00 ~ 13:50", activity: "부대 복귀" }
];

const oneDay: ScheduleItem[] = [
  { time: "09:00 ~ 09:30", activity: "교육장 이동" },
  { time: "09:30 ~ 10:00", activity: "입교식 및 교육안내" },
  { time: "10:00 ~ 11:50", activity: "해군 정체성 초빙강연" },
  { time: "11:50 ~ 13:20", activity: "중식" },
  { time: "13:20 ~ 13:30", activity: "휴식 시간" },
  { time: "13:30 ~ 15:00", activity: "군인정신 초빙강연" },
  { time: "15:00 ~ 15:20", activity: "행정 시간" },
  { time: "15:20 ~ 17:00", activity: "정신전력 강화 프로그램" },
  { time: "17:00 ~ 17:30", activity: "부대 복귀" }
];

interface LocationItem {
  title: string;
  places: string;
}

const locations: LocationItem[] = [
  { title: "1함대 권역", places: "동해 무릉건강숲, 동해보양온천컨벤션 등" },
  { title: "2함대 권역", places: "화성 YBM연수원 등" },
  { title: "3함대 권역", places: "청호인재개발원, DB생명 인재개발원 등" },
  { title: "진해 및 부산 권역", places: "진해 이순신리더십센터, 부산 아르피나 등" }
];

const Schedule = () => {
  // 공통 스타일 정의
  const textStyle = {
    wordBreak: 'keep-all' as const,
    overflowWrap: 'break-word' as const
  };

  return (
    <section id="schedule" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-2xl font-bold text-navy mb-3" style={textStyle}>교육 운영 방식</h2>
          <p className="text-base md:text-lg text-gray-600" style={textStyle}>합숙형과 집중형 중 선택 가능한 유연한 교육 운영</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-10">
          <div className="md:w-1/2">
            <div className="bg-navy text-white rounded-t-lg p-4 md:p-5">
              <h3 className="text-lg md:text-xl font-bold flex items-center" style={textStyle}>
                <Bed className="mr-2 text-gold" size={20} />
                <span className="text-gold font-bold">합숙형 교육 (1박 2일)</span>
              </h3>
            </div>
            <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
              <div className="p-4 md:p-5 border-b border-gray-200">
                <h4 className="font-bold text-navy-light text-base mb-3" style={textStyle}>1일차</h4>
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    {day1Schedule.map((item, index) => (
                      <tr 
                        key={index} 
                        className={`${index < day1Schedule.length - 1 ? "border-b border-gray-200" : ""} ${index % 2 === 0 ? "bg-blue-50/50" : ""}`}
                      >
                        <td className="py-2 pr-3 text-gray-600 whitespace-nowrap">{item.time}</td>
                        <td className="py-2" style={textStyle}>{item.activity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 md:p-5">
                <h4 className="font-bold text-navy-light text-base mb-3" style={textStyle}>2일차</h4>
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    {day2Schedule.map((item, index) => (
                      <tr 
                        key={index} 
                        className={`${index < day2Schedule.length - 1 ? "border-b border-gray-200" : ""} ${index % 2 === 0 ? "bg-blue-50/50" : ""}`}
                      >
                        <td className="py-2 pr-3 text-gray-600 whitespace-nowrap">{item.time}</td>
                        <td className="py-2" style={textStyle}>{item.activity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="bg-navy text-white rounded-t-lg p-4 md:p-5">
              <h3 className="text-lg md:text-xl font-bold flex items-center" style={textStyle}>
                <Hourglass className="mr-2 text-gold" size={20} />
                <span className="text-gold font-bold">집중형 교육 (1일)</span>
              </h3>
            </div>
            <div className="bg-white rounded-b-lg shadow-md overflow-hidden p-4 md:p-5">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {oneDay.map((item, index) => (
                    <tr 
                      key={index} 
                      className={`${index < oneDay.length - 1 ? "border-b border-gray-200" : ""} ${index % 2 === 0 ? "bg-blue-50/50" : ""}`}
                    >
                      <td className="py-2 pr-3 text-gray-600 whitespace-nowrap">{item.time}</td>
                      <td className="py-2" style={textStyle}>{item.activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Schedule;