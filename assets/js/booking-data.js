/* =====================================================================
   ▼▼▼ 예약 현황 입력하는 곳 (이 부분만 고치면 됩니다) ▼▼▼

   limit   : 하루에 받을 수 있는 대수 → 이 수를 채우면 자동으로 "마감"
   full    : 예약이 다 찬 날 → 달력에 "마감" 으로 표시됩니다
             (limit 과 상관없이 손으로 막고 싶을 때 씁니다)
   closed  : 쉬는 날 (공휴일, 임시 휴무) → "휴무" 로 표시됩니다
             일요일은 자동 휴무입니다. 토요일은 둘째 · 넷째만 자동 휴무이고,
             나머지 토요일은 영업일입니다 (09:00 – 13:00)
   slots   : 그날 잡힌 예약 → 날짜를 누르면 시간과 차종이 보입니다
             { t:"09:00", car:"쏘렌토 2.0" } 처럼 적습니다
             k 를 넣으면 차종 옆에 작은 표가 붙습니다
             "점검" 이 들어가면 파란 표, 그 외에는 빨간 표입니다
             { t:"09:00", car:"쏘렌토 2.0", k:"수리" }
             { t:"09:00", car:"쏘렌토 2.0", k:"DPF 점검" } 처럼 앞에 말을 붙여도 됩니다
             모르거나 안 붙이고 싶으면 k 를 아예 쓰지 않으면 됩니다
   note    : 달력 아래에 보여줄 안내 한 줄 (없으면 "")
   booking : 네이버 예약 주소 (아직 없으면 "" 로 두세요)

   ※ 차량번호 · 고객 성명 · 연락처는 절대 넣지 마세요.
     손님 정보는 예약 장부(사장님 전용 페이지)에만 적습니다.

   ※ 지금은 원모터스 인천점과 인천에프원모터스가 예약을 같이 씁니다.
     예약은 아래 one 칸에만 적으시면 두 홈페이지에 똑같이 보입니다.
     (따로 쓰고 싶어지면 맨 아래 SHARED 를 false 로 바꾸세요)
   ===================================================================== */
window.BOOKING = {
  updated: "2026-10-06",

  one: {   /* 원모터스 인천점 */
    limit:  5,
    full:   [],
    closed: ["2026-10-03", "2026-10-09"],
    slots: {
      "2026-09-28": [ { t:"09:00", car:"쏘렌토 2.0" },
                      { t:"13:00", car:"포르쉐 카이엔" },
                      { t:"15:00", car:"SM6" } ],
      "2026-09-29": [ { t:"13:00", car:"말리부" },
                      { t:"15:00", car:"BMW 520d" },
                      { t:"16:30", car:"스타렉스" } ],
      "2026-09-30": [ { t:"13:00", car:"G4 렉스턴 2017년식" } ],
      "2026-10-01": [ { t:"10:00", car:"카니발" },
                      { t:"15:00", car:"벤츠 E300 2011년식" },
                      { t:"15:30", car:"YF 쏘나타 LPG 2010년식" } ],
      "2026-10-02": [ { t:"09:00", car:"BMW 320d GT 2017년식" } ],
      "2026-10-06": [ { t:"10:00", car:"지프 커맨더 3.0 CRD 2007년식", k:"수리" },
                      { t:"10:00", car:"BMW 120d 쿠페 2013년식", k:"경고등 점검" } ],
      "2026-10-07": [ { t:"09:00", car:"더 뉴 쏘렌토 2018년식", k:"점검" },
                      { t:"10:00", car:"포드 몬데오 2017년식", k:"수리" },
                      { t:"10:00", car:"아우디 A4 2014년식", k:"점검" } ],
      "2026-10-08": [ { t:"09:00", car:"볼보 XC60 2013년식", k:"수리" } ],
      "2026-10-12": [ { t:"10:00", car:"미니 쿠퍼 D 2015년식", k:"수리" } ],
      "2026-10-13": [ { t:"18:30", car:"K5 2018년식", k:"수리" } ],
      "2026-10-14": [ { t:"09:00", car:"뉴쏘렌토 R 2013년식", k:"DPF 점검" } ]
    },
    note:   "",
    booking: ""
  },

  f1: {    /* 인천에프원모터스 */
    limit:  5,
    full:   [],
    closed: ["2026-10-03", "2026-10-09"],
    slots: {},
    note:   "",
    booking: ""
  }
};
/* ▲▲▲ 여기까지 ▲▲▲ */


/* =====================================================================
   두 지점 예약을 하나로 합쳐서 보여줍니다.
   따로 쓰고 싶으면 아래 true 를 false 로 바꾸기만 하면 됩니다.
   ===================================================================== */
window.BOOKING_SHARED = true;

(function () {
  if (!window.BOOKING_SHARED) return;
  var B = window.BOOKING;
  if (!B || !B.one || !B.f1) return;
  var A = B.one, F = B.f1;

  function uniq(list) {
    var seen = {}, out = [];
    (list || []).forEach(function (v) { if (v && !seen[v]) { seen[v] = 1; out.push(v); } });
    return out.sort();
  }

  var slots = {};
  [A, F].forEach(function (src) {
    var sl = (src && src.slots) || {};
    Object.keys(sl).forEach(function (day) {
      var list = sl[day] || [];
      if (!slots[day]) slots[day] = [];
      list.forEach(function (s) {
        var dup = slots[day].some(function (x) { return x.t === s.t && x.car === s.car; });
        if (!dup) slots[day].push({ t: s.t, car: s.car, k: s.k });
      });
    });
  });
  Object.keys(slots).forEach(function (day) {
    slots[day].sort(function (x, y) { return String(x.t || '').localeCompare(String(y.t || '')); });
  });

  var merged = {
    limit:   Math.max(Number(A.limit) || 0, Number(F.limit) || 0),
    full:    uniq((A.full || []).concat(F.full || [])),
    closed:  uniq((A.closed || []).concat(F.closed || [])),
    slots:   slots,
    note:    A.note || F.note || "",
    booking: A.booking || F.booking || ""
  };

  function copy() {
    return {
      limit: merged.limit,
      full: merged.full.slice(),
      closed: merged.closed.slice(),
      slots: merged.slots,
      note: merged.note,
      booking: merged.booking
    };
  }
  B.one = copy();
  B.f1  = copy();
})();
