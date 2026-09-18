/* =====================================================================
   ▼▼▼ 대기 현황 입력하는 곳 (이 부분만 고치면 됩니다) ▼▼▼

   updated : 마지막으로 고친 날짜
   shop    : "f1" = 인천에프원모터스 / "one" = 원모터스 인천점
   status  : "working" 작업 중 / "parts" 부품 대기 / "waiting" 입고 대기 / "done" 출고 완료
   car     : 차종 (차량번호 · 고객 이름은 절대 쓰지 마세요)
   work    : 작업 종류
   date    : 예상 입고일 또는 출고일 (모르면 "")
   link    : 정비사례 페이지 주소 (없으면 "")
   sample  : true 면 "예시" 표시 → 실제 차량으로 바꾸면 이 줄을 지우세요
   ===================================================================== */
window.SCHEDULE = {
  /* 첫 화면 띠 표시: true = 켬 / false = 끔 (실제 차량으로 바꾼 뒤 true 로) */
  showOnHome: false,

  updated: "2026-09-17",
  cars: [
    { shop:"one", status:"working", car:"벤츠 E250",           work:"엔진 소음 · 오일 소모 정밀 진단",   date:"",       link:"", sample:true },
    { shop:"one", status:"parts",   car:"BMW 520d",            work:"엔진보링 · 부품 입고 대기",          date:"9월 23일경 부품 도착 예정", link:"", sample:true },
    { shop:"one", status:"waiting", car:"아우디 A6",           work:"간헐적 경고등 고장진단",             date:"9월 26일경 입고", link:"", sample:true },
    { shop:"one", status:"waiting", car:"폭스바겐 티구안",     work:"배터리 반복 방전 점검",              date:"9월 29일경 입고", link:"", sample:true },
    { shop:"one", status:"done",    car:"벤츠 CLA250",         work:"엔진 탈부착 · 실린더헤드 교환",       date:"2026년 8월 출고", link:"cases-onemotors.html" },

    { shop:"f1",  status:"working", car:"현대 포터2",          work:"커먼레일 인젝터 점검 · 교환",        date:"",       link:"", sample:true },
    { shop:"f1",  status:"waiting", car:"기아 쏘렌토",         work:"DPF 클리닝",                         date:"9월 22일경 입고", link:"", sample:true },
    { shop:"f1",  status:"waiting", car:"KGM 렉스턴 스포츠",   work:"출력 저하 고장코드 진단",            date:"9월 24일경 입고", link:"", sample:true },
    { shop:"f1",  status:"done",    car:"현대 스타렉스",       work:"인젝터 교환 · 시운전 완료",          date:"9월 출고", link:"", sample:true }
  ]
};
/* ▲▲▲ 여기까지 ▲▲▲ */
