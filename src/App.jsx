import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const THEMES = {
  gold: { name:"ذهبي", emoji:"🟡", bg:"linear-gradient(160deg,#fdf6ec,#fef9f0,#fdf0dc)", card:"rgba(255,255,255,0.88)", header:"rgba(255,255,255,0.88)", accent:"#e8a030", accentDark:"#c87d0a", accentGrad:"linear-gradient(135deg,#e8a030,#c87d0a)", accentShadow:"rgba(232,160,48,0.3)", accentBorder:"rgba(232,160,48,0.25)", accentBg:"#fff8ee", accentLight:"#fdf3e3", text:"#1a1a1a", subtext:"#b09070", divider:"rgba(232,160,48,0.12)", splashBg:"linear-gradient(160deg,#fdf6ec,#fef9f0,#fdf0dc)", inputBg:"#fdf6ec" },
  blue: { name:"سماوي", emoji:"🔵", bg:"linear-gradient(160deg,#f0f7ff,#e8f4fd,#deeeff)", card:"rgba(255,255,255,0.9)", header:"rgba(255,255,255,0.9)", accent:"#0a84ff", accentDark:"#006edb", accentGrad:"linear-gradient(135deg,#0a84ff,#006edb)", accentShadow:"rgba(10,132,255,0.25)", accentBorder:"rgba(10,132,255,0.2)", accentBg:"#e8f3ff", accentLight:"#f0f7ff", text:"#0d1b2e", subtext:"#6e8aaa", divider:"rgba(10,132,255,0.1)", splashBg:"linear-gradient(160deg,#deeeff,#e8f4fd,#f0f7ff)", inputBg:"#f0f7ff" },
  green: { name:"زمردي", emoji:"🟢", bg:"linear-gradient(160deg,#f0faf4,#e8f5ed,#dff2e8)", card:"rgba(255,255,255,0.9)", header:"rgba(255,255,255,0.9)", accent:"#30d158", accentDark:"#1a9e3f", accentGrad:"linear-gradient(135deg,#30d158,#1a9e3f)", accentShadow:"rgba(48,209,88,0.25)", accentBorder:"rgba(48,209,88,0.2)", accentBg:"#e8f9ee", accentLight:"#f0faf4", text:"#0f2a1a", subtext:"#5a8a6a", divider:"rgba(48,209,88,0.1)", splashBg:"linear-gradient(160deg,#dff2e8,#e8f5ed,#f0faf4)", inputBg:"#f0faf4" },
  dark: { name:"ليلي", emoji:"⚫", bg:"linear-gradient(160deg,#0f1117,#141820,#0d1015)", card:"rgba(28,32,46,0.95)", header:"rgba(18,22,34,0.97)", accent:"#e8a030", accentDark:"#c87d0a", accentGrad:"linear-gradient(135deg,#e8a030,#c87d0a)", accentShadow:"rgba(232,160,48,0.25)", accentBorder:"rgba(232,160,48,0.18)", accentBg:"rgba(232,160,48,0.1)", accentLight:"rgba(28,32,46,0.8)", text:"#f0f0f0", subtext:"#8a8a9a", divider:"rgba(255,255,255,0.06)", splashBg:"linear-gradient(160deg,#0f1117,#141820)", inputBg:"rgba(255,255,255,0.05)" },
};

const USER_PROFILE = {
  aiPersona:`أنت مستشار استثماري شخصي باللهجة السعودية العامية، متخصص في سوق تداول السعودي. صاحبك مبتدئ، عنده خسارة في محفظته بين 5000-20000 ريال، سيولته محدودة، أفقه سنة فأكثر. تكلم بعامية سعودية مريحة، صريح، أعطِ رأي واضح. اشرح المصطلحات ببساطة. لا تشجع المضاربة. أضف دائماً: هذا رأيي مو نصيحة مالية رسمية.`
};

const STOCKS_LIST = [
  {symbol:"1010",name:"الرياض",sector:"بنوك"},
  {symbol:"1020",name:"الجزيرة",sector:"بنوك"},
  {symbol:"1030",name:"السعودي الفرنسي",sector:"بنوك"},
  {symbol:"1050",name:"البلاد",sector:"بنوك"},
  {symbol:"1060",name:"العربي الوطني",sector:"بنوك"},
  {symbol:"1080",name:"العربية للاستثمار",sector:"بنوك"},
  {symbol:"1120",name:"الراجحي",sector:"بنوك"},
  {symbol:"1140",name:"الإنماء",sector:"بنوك"},
  {symbol:"1150",name:"الإنماء",sector:"بنوك"},
  {symbol:"1180",name:"الأهلي",sector:"بنوك"},
  {symbol:"1182",name:"الاستثمار",sector:"بنوك"},
  {symbol:"2222",name:"أرامكو",sector:"طاقة"},
  {symbol:"2030",name:"الباحة",sector:"طاقة"},
  {symbol:"2381",name:"صافولا",sector:"طاقة"},
  {symbol:"2010",name:"سابك",sector:"بتروكيماويات"},
  {symbol:"2020",name:"سابك للمغذيات",sector:"بتروكيماويات"},
  {symbol:"2060",name:"نماء",sector:"بتروكيماويات"},
  {symbol:"2070",name:"التصنيع",sector:"بتروكيماويات"},
  {symbol:"2090",name:"النصر للكيماويات",sector:"بتروكيماويات"},
  {symbol:"2100",name:"الخليج للصناعات",sector:"بتروكيماويات"},
  {symbol:"2110",name:"سبكيم",sector:"بتروكيماويات"},
  {symbol:"2120",name:"المتحدة للمؤلفة",sector:"بتروكيماويات"},
  {symbol:"2150",name:"اليمامة للحديد",sector:"بتروكيماويات"},
  {symbol:"2160",name:"أرابكو",sector:"بتروكيماويات"},
  {symbol:"2170",name:"الصناعات الكهربائية",sector:"بتروكيماويات"},
  {symbol:"2180",name:"الزامل للصناعة",sector:"بتروكيماويات"},
  {symbol:"2200",name:"أرامكو توتال",sector:"بتروكيماويات"},
  {symbol:"2210",name:"نورth",sector:"بتروكيماويات"},
  {symbol:"2230",name:"كيمانول",sector:"بتروكيماويات"},
  {symbol:"2240",name:"بترو رابغ",sector:"بتروكيماويات"},
  {symbol:"2243",name:"لوبريف",sector:"بتروكيماويات"},
  {symbol:"2250",name:"إكسبيك",sector:"بتروكيماويات"},
  {symbol:"2290",name:"ينساب",sector:"بتروكيماويات"},
  {symbol:"2300",name:"السعودي للكهرباء",sector:"بتروكيماويات"},
  {symbol:"2310",name:"سيبكو",sector:"بتروكيماويات"},
  {symbol:"2320",name:"الراجحي للصناعة",sector:"بتروكيماويات"},
  {symbol:"2330",name:"المتقدمة",sector:"بتروكيماويات"},
  {symbol:"2340",name:"الجبيل",sector:"بتروكيماويات"},
  {symbol:"2350",name:"سافكو",sector:"بتروكيماويات"},
  {symbol:"2360",name:"ستراتا",sector:"بتروكيماويات"},
  {symbol:"2370",name:"المجموعة السعودية",sector:"بتروكيماويات"},
  {symbol:"2380",name:"پترو رابغ",sector:"بتروكيماويات"},
  {symbol:"2390",name:"رالكو",sector:"بتروكيماويات"},
  {symbol:"3001",name:"أسمنت اليمامة",sector:"أسمنت"},
  {symbol:"3002",name:"أسمنت العربية",sector:"أسمنت"},
  {symbol:"3003",name:"أسمنت القصيم",sector:"أسمنت"},
  {symbol:"3004",name:"أسمنت الجنوب",sector:"أسمنت"},
  {symbol:"3005",name:"أسمنت إنما",sector:"أسمنت"},
  {symbol:"3006",name:"أسمنت الشمالية",sector:"أسمنت"},
  {symbol:"3007",name:"أسمنت تبوك",sector:"أسمنت"},
  {symbol:"3008",name:"أسمنت الجوف",sector:"أسمنت"},
  {symbol:"3010",name:"أسمنت المدينة",sector:"أسمنت"},
  {symbol:"3020",name:"أسمنت الشرقية",sector:"أسمنت"},
  {symbol:"3030",name:"أسمنت نجران",sector:"أسمنت"},
  {symbol:"3040",name:"أسمنت الرياض",sector:"أسمنت"},
  {symbol:"3050",name:"أسمنت حائل",sector:"أسمنت"},
  {symbol:"3060",name:"أسمنت أم القرى",sector:"أسمنت"},
  {symbol:"3080",name:"أسمنت المنطقة",sector:"أسمنت"},
  {symbol:"3090",name:"أسمنت طبوك",sector:"أسمنت"},
  {symbol:"4001",name:"الحكير",sector:"تجزئة"},
  {symbol:"4002",name:"الشايع",sector:"تجزئة"},
  {symbol:"4003",name:"بن داوود",sector:"تجزئة"},
  {symbol:"4006",name:"الثقبة",sector:"تجزئة"},
  {symbol:"4007",name:"المنيع",sector:"تجزئة"},
  {symbol:"4008",name:"أبو موسى",sector:"تجزئة"},
  {symbol:"4009",name:"عبد العزيز الحمد",sector:"تجزئة"},
  {symbol:"4011",name:"سلطان",sector:"تجزئة"},
  {symbol:"4012",name:"بن عفيف",sector:"تجزئة"},
  {symbol:"4013",name:"ذيب",sector:"تجزئة"},
  {symbol:"4014",name:"الدريس",sector:"تجزئة"},
  {symbol:"4015",name:"العتيق",sector:"تجزئة"},
  {symbol:"4016",name:"التوبال",sector:"تجزئة"},
  {symbol:"4017",name:"الأمير",sector:"تجزئة"},
  {symbol:"4018",name:"أسواق الخير",sector:"تجزئة"},
  {symbol:"4019",name:"ابان",sector:"تجزئة"},
  {symbol:"4020",name:"دار الأركان",sector:"عقارات"},
  {symbol:"4031",name:"التعمير",sector:"تجزئة"},
  {symbol:"4040",name:"سلامة",sector:"تجزئة"},
  {symbol:"4050",name:"السدير",sector:"تجزئة"},
  {symbol:"4051",name:"الدواء",sector:"تجزئة"},
  {symbol:"4061",name:"أسواق الدواء",sector:"تجزئة"},
  {symbol:"4100",name:"ثمار",sector:"تجزئة"},
  {symbol:"4110",name:"أسواق النجوم",sector:"تجزئة"},
  {symbol:"4130",name:"الأمير",sector:"تجزئة"},
  {symbol:"4140",name:"البلد الأمين",sector:"تجزئة"},
  {symbol:"4150",name:"الوطنية",sector:"تجزئة"},
  {symbol:"4160",name:"الزامل",sector:"تجزئة"},
  {symbol:"4161",name:"أبو خضر",sector:"تجزئة"},
  {symbol:"4162",name:"البيك",sector:"تجزئة"},
  {symbol:"4163",name:"ماكدونالدز السعودية",sector:"تجزئة"},
  {symbol:"4164",name:"الباحة",sector:"تجزئة"},
  {symbol:"4170",name:"الأندية الرياضية",sector:"تجزئة"},
  {symbol:"4180",name:"اللازوردي",sector:"تجزئة"},
  {symbol:"4190",name:"جرير",sector:"تجزئة"},
  {symbol:"4191",name:"إكسترا",sector:"تجزئة"},
  {symbol:"4192",name:"أبيات",sector:"تجزئة"},
  {symbol:"4193",name:"المراعي",sector:"تجزئة"},
  {symbol:"4194",name:"الرائد",sector:"تجزئة"},
  {symbol:"4195",name:"كيان",sector:"تجزئة"},
  {symbol:"4196",name:"ذات",sector:"تجزئة"},
  {symbol:"4197",name:"واجهة",sector:"تجزئة"},
  {symbol:"4198",name:"دانوب",sector:"تجزئة"},
  {symbol:"4199",name:"جادو",sector:"تجزئة"},
  {symbol:"4200",name:"مجموعة تداول",sector:"مالية"},
  {symbol:"4210",name:"الغذائية",sector:"تجزئة"},
  {symbol:"4220",name:"الحربي",sector:"تجزئة"},
  {symbol:"4230",name:"المملكة",sector:"تجزئة"},
  {symbol:"4240",name:"المناطق الاقتصادية",sector:"عقارات"},
  {symbol:"4250",name:"طيران ناس",sector:"نقل"},
  {symbol:"4260",name:"الاتحاد للطيران",sector:"نقل"},
  {symbol:"4261",name:"فلاي أدير",sector:"نقل"},
  {symbol:"4262",name:"الطيارة",sector:"نقل"},
  {symbol:"4263",name:"موانئ",sector:"نقل"},
  {symbol:"4264",name:"ناس",sector:"نقل"},
  {symbol:"4270",name:"لميا",sector:"نقل"},
  {symbol:"4280",name:"الحجز",sector:"تجزئة"},
  {symbol:"4290",name:"المتميزة",sector:"تجزئة"},
  {symbol:"4300",name:"السهيل",sector:"تجزئة"},
  {symbol:"4310",name:"سيرا",sector:"عقارات"},
  {symbol:"4320",name:"البحر الأحمر",sector:"عقارات"},
  {symbol:"4321",name:"سينومي سنترز",sector:"تجزئة"},
  {symbol:"4322",name:"سينومي ريتيل",sector:"تجزئة"},
  {symbol:"4323",name:"رتال",sector:"عقارات"},
  {symbol:"7010",name:"الاتصالات السعودية",sector:"اتصالات"},
  {symbol:"7020",name:"موبايلي",sector:"اتصالات"},
  {symbol:"7030",name:"زين السعودية",sector:"اتصالات"},
  {symbol:"7040",name:"سلامة",sector:"اتصالات"},
  {symbol:"7203",name:"موبيلي",sector:"اتصالات"},
  {symbol:"1302",name:"المتقدمة",sector:"تقنية"},
  {symbol:"7204",name:"سيلا",sector:"تقنية"},
  {symbol:"1211",name:"معادن",sector:"تعدين"},
  {symbol:"4090",name:"الاتحاد العقاري",sector:"عقارات"},
  {symbol:"2280",name:"الأفلاج",sector:"غذاء"},
  {symbol:"6001",name:"حلواني",sector:"غذاء"},
  {symbol:"6002",name:"نادك",sector:"غذاء"},
  {symbol:"6004",name:"أنعام القابضة",sector:"غذاء"},
  {symbol:"6010",name:"المراعي",sector:"غذاء"},
  {symbol:"6013",name:"الجوف للزراعة",sector:"غذاء"},
  {symbol:"6014",name:"تبوك الزراعية",sector:"غذاء"},
  {symbol:"6015",name:"الشرقية للتنمية",sector:"غذاء"},
  {symbol:"6016",name:"الحفر الذهبي",sector:"غذاء"},
  {symbol:"6020",name:"السعودية للأسماك",sector:"غذاء"},
  {symbol:"6040",name:"أغذية",sector:"غذاء"},
  {symbol:"6050",name:"الدجاج",sector:"غذاء"},
  {symbol:"6060",name:"فطيم",sector:"غذاء"},
  {symbol:"6070",name:"الأطعمة والمنتجات",sector:"غذاء"},
  {symbol:"6090",name:"الأسواق",sector:"غذاء"},
  {symbol:"4062",name:"دله الصحية",sector:"صحة"},
  {symbol:"4065",name:"بيكو",sector:"صحة"},
  {symbol:"2080",name:"أسواق المستشفيات",sector:"صحة"},
  {symbol:"4500",name:"أسواق الدواء",sector:"صحة"},
  {symbol:"4502",name:"التوفيق",sector:"صحة"},
  {symbol:"4504",name:"الموارد",sector:"صحة"},
  {symbol:"4508",name:"المسار",sector:"صحة"},
  {symbol:"4510",name:"ثروة",sector:"صحة"},
  {symbol:"4512",name:"سوما",sector:"صحة"},
  {symbol:"8010",name:"التعاونية",sector:"تأمين"},
  {symbol:"8020",name:"الراجحي تكافل",sector:"تأمين"},
  {symbol:"8030",name:"ملاذ",sector:"تأمين"},
  {symbol:"8040",name:"ميدغلف",sector:"تأمين"},
  {symbol:"8050",name:"الأهلية",sector:"تأمين"},
  {symbol:"8060",name:"المتحدة",sector:"تأمين"},
  {symbol:"8070",name:"سلامة",sector:"تأمين"},
  {symbol:"8080",name:"الإتحاد التجاري",sector:"تأمين"},
  {symbol:"8100",name:"توكيد",sector:"تأمين"},
  {symbol:"8120",name:"العليا",sector:"تأمين"},
  {symbol:"8130",name:"وفا",sector:"تأمين"},
  {symbol:"8150",name:"البركة",sector:"تأمين"},
  {symbol:"8160",name:"الدرع",sector:"تأمين"},
  {symbol:"8170",name:"أمانة",sector:"تأمين"},
  {symbol:"8180",name:"إتحاد الخليج",sector:"تأمين"},
  {symbol:"8190",name:"أسيج",sector:"تأمين"},
  {symbol:"8200",name:"ريسك",sector:"تأمين"},
  {symbol:"8210",name:"بوبا العربية",sector:"تأمين"},
  {symbol:"8230",name:"الوثبة",sector:"تأمين"},
  {symbol:"8240",name:"العربية للتأمين",sector:"تأمين"},
  {symbol:"8250",name:"المملكة",sector:"تأمين"},
  {symbol:"8260",name:"الخليجية",sector:"تأمين"},
  {symbol:"8270",name:"المتوسط والخليج",sector:"تأمين"},
  {symbol:"8280",name:"أليانز",sector:"تأمين"},
  {symbol:"8290",name:"الأولى",sector:"تأمين"},
  {symbol:"8300",name:"الصقر",sector:"تأمين"}
];

const SEED={
  "2222":[25.1,25.2,25.05,24.9,25,24.8,24.95,25.3,25.2,25.1,25.4,25.25,25.15,25,25.2,25.35,25.28,25.1,25.22,25.18,25.3,25.26,25.14,25,24.95,25.05,25.2,25.18,25.1,25.26],
  "1120":[87.5,88,87.8,88.2,88.5,88.3,88,88.4,88.6,88.2,88.1,88.5,88.7,88.3,88,88.4,88.6,88.2,88.3,88.5,88.1,88,88.4,88.2,88.3,88.5,88.2,88.1,88.3,88.4],
  "1180":[41.5,41.8,42,41.9,42.2,42.1,42.4,42.3,42,41.8,42.1,42.5,42.3,42,42.2,42.6,42.4,42.1,42.3,42.5,42.2,42,42.4,42.3,42.1,42.2,42.5,42.3,42.1,42.3],
  "1150":[26,26.2,26.5,26.3,26.8,26.6,26.4,26.9,27.1,26.8,26.5,26.9,27.2,26.9,26.6,26.8,27.1,26.9,26.6,26.8,27,26.8,26.5,26.8,27,26.8,26.6,26.7,26.8,26.9],
  "1010":[24,24.3,24.6,24.4,24.8,24.6,24.3,24.7,25,24.7,24.4,24.8,25.1,24.8,24.5,24.7,25,24.8,24.5,24.8,25,24.8,24.4,24.7,25,24.8,24.5,24.7,24.8,24.9],
  "2010":[94,94.5,95,94.8,95.2,95.5,95,94.8,95.2,95.4,95.1,94.9,95.3,95.5,95.2,94.8,95,95.4,95.2,95,95.3,95.1,94.9,95.2,95.4,95.1,95,95.2,95.3,95.2],
  "7010":[103,104,104.5,104,105,104.8,104.2,104.6,105,104.5,104.2,104.8,105.2,104.8,104.4,104.6,105,104.8,104.5,104.7,104.9,104.6,104.4,104.8,105,104.7,104.5,104.7,104.8,104.6],
  "1211":[57.5,58,58.5,58,58.7,58.5,58.2,58.7,59,58.7,58.4,58.8,59.1,58.8,58.5,58.7,59,58.8,58.5,58.8,59,58.8,58.4,58.7,59,58.8,58.5,58.7,58.8,58.7],
  "1302":[18,17.8,17.5,17.2,17,16.8,17.1,16.9,16.6,16.4,16.8,16.5,16.2,16.5,16.3,16,16.3,16.1,15.9,16.2,16,15.8,16,15.8,15.6,15.9,15.7,15.5,15.7,15.8],
  "2170":[28,28.3,28.6,28.4,28.8,28.6,28.3,28.7,29,28.7,28.4,28.8,29.1,28.8,28.5,28.7,29,28.8,28.5,28.8,29,28.8,28.4,28.7,29,28.8,28.5,28.7,28.8,28.9],
  "2243":[45,45.5,46,45.8,46.2,46,45.7,46.1,46.4,46.1,45.8,46.2,46.5,46.2,45.9,46.1,46.4,46.2,45.9,46.2,46.4,46.2,45.8,46.1,46.4,46.2,45.9,46.1,46.2,46.3],
  "4003":[32,32.4,32.8,32.6,33,32.8,32.5,32.9,33.2,32.9,32.6,33,33.3,33,32.7,32.9,33.2,33,32.7,33,33.2,33,32.6,32.9,33.2,33,32.7,32.9,33,33.1],
  "4190":[88,88.5,89,88.8,89.2,89,88.7,89.1,89.4,89.1,88.8,89.2,89.5,89.2,88.9,89.1,89.4,89.2,88.9,89.2,89.4,89.2,88.8,89.1,89.4,89.2,88.9,89.1,89.2,89.3],
  "4321":[14,14.2,14.5,14.3,14.6,14.4,14.2,14.5,14.8,14.5,14.3,14.6,14.9,14.6,14.4,14.6,14.9,14.7,14.4,14.7,14.9,14.7,14.3,14.6,14.9,14.7,14.4,14.6,14.7,14.8],
  "4322":[10,10.2,10.4,10.3,10.5,10.4,10.2,10.5,10.7,10.5,10.3,10.5,10.8,10.6,10.4,10.5,10.8,10.6,10.4,10.6,10.8,10.6,10.3,10.5,10.8,10.6,10.4,10.5,10.6,10.7],
  "4310":[22,22.3,22.6,22.4,22.8,22.6,22.3,22.7,23,22.7,22.4,22.8,23.1,22.8,22.5,22.7,23,22.8,22.5,22.8,23,22.8,22.4,22.7,23,22.8,22.5,22.7,22.8,22.9],
  "4020":[8,8.2,8.4,8.3,8.5,8.4,8.2,8.5,8.7,8.5,8.3,8.5,8.8,8.6,8.4,8.5,8.8,8.6,8.4,8.6,8.8,8.6,8.3,8.5,8.8,8.6,8.4,8.5,8.6,8.7],
  "2380":[17.2,17.4,17.6,17.5,17.8,17.6,17.4,17.8,18,17.8,17.5,17.8,18.1,17.9,17.6,17.8,18,17.8,17.6,17.8,18,17.8,17.5,17.8,18,17.8,17.6,17.7,17.8,17.8],
  "4200":[21.5,21.8,22,21.9,22.1,22,21.8,22.1,22.3,22.1,22,22.2,22.4,22.2,22,22.1,22.3,22.1,22,22.2,22.3,22.1,22,22.1,22.2,22.1,22,22.1,22.2,22.1],
  "2350":[90,90.5,91,90.8,91.2,91,90.7,91.1,91.4,91.1,90.8,91.2,91.5,91.2,90.9,91.1,91.4,91.2,90.9,91.2,91.4,91.2,90.8,91.1,91.4,91.2,90.9,91.1,91.2,91.3],
};

function calcRSI(p){if(p.length<14)return 50;let g=0,l=0;for(let i=p.length-14;i<p.length-1;i++){const d=p[i+1]-p[i];if(d>0)g+=d;else l+=Math.abs(d);}return parseFloat((100-100/(1+g/(l||1))).toFixed(1));}
function calcMA(p,n){const s=p.slice(-n);return parseFloat((s.reduce((a,b)=>a+b,0)/s.length).toFixed(2));}
function calcMACD(p){if(p.length<26)return 0;const e=(a,n)=>a.slice(-n).reduce((x,y)=>x+y,0)/n;return parseFloat((e(p,12)-e(p,26)).toFixed(3));}
function getSignal(p){
  const c=p[p.length-1],rsi=calcRSI(p),macd=calcMACD(p),ma7=calcMA(p,Math.min(7,p.length)),ma20=calcMA(p,Math.min(20,p.length));
  let s=0;
  if(rsi<35)s+=2;else if(rsi<45)s+=1;else if(rsi>65)s-=2;else if(rsi>55)s-=1;
  if(macd>0)s+=1;else s-=1;
  if(c>ma7&&ma7>ma20)s+=2;else if(c<ma7&&ma7<ma20)s-=2;
  if(s>=3)return{label:"شراء قوي",color:"#2d6a4f",bg:"#d8f3dc"};
  if(s>=1)return{label:"شراء",color:"#40916c",bg:"#e8f5e9"};
  if(s<=-3)return{label:"بيع قوي",color:"#c1121f",bg:"#ffe0e0"};
  if(s<=-1)return{label:"بيع",color:"#d62828",bg:"#fff0f0"};
  return{label:"انتظار",color:"#b5640a",bg:"#fff3e0"};
}

function SparkLine({prices,positive}){
  if(!prices||prices.length<2)return null;
  const W=110,H=38,mn=Math.min(...prices),mx=Math.max(...prices),rng=mx-mn||1;
  const pts=prices.map((p,i)=>`${(i/(prices.length-1))*W},${H-((p-mn)/rng)*(H-4)-2}`).join(" ");
  const col=positive?"#40916c":"#d62828";
  return(<svg viewBox={"0 0 "+W+" "+H} style={{width:"100%",height:38,display:"block"}}><polyline points={pts} fill="none" stroke={col} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/></svg>);
}

function marketStatus(){
  const r=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Riyadh"}));
  return{open:r.getDay()>=0&&r.getDay()<=4&&r.getHours()+r.getMinutes()/60>=10&&r.getHours()+r.getMinutes()/60<15};
}

const SAHMK_KEY=(typeof import.meta!=="undefined"&&import.meta.env)?import.meta.env.VITE_SAHMK_KEY||"":"";

async function fetchRealPrice(symbol){
  try{
    const headers={"Accept":"application/json"};
    if(SAHMK_KEY)headers["X-API-Key"]=SAHMK_KEY;
    const res=await fetch("https://app.sahmk.sa/api/v1/quote/"+symbol+"/",{headers});
    if(!res.ok)return null;
    const d=await res.json();
    return{price:parseFloat(d.price),change:parseFloat(d.change),changePct:parseFloat(d.change_percent),volume:parseInt(d.volume)||0};
  }catch{return null;}
}

export default function App(){
  const [themeKey,setThemeKey]=useState(()=>localStorage.getItem("advisorTheme")||"gold");
  const T=THEMES[themeKey];
  const [showThemePicker,setShowThemePicker]=useState(false);
  const [splash,setSplash]=useState(true);
  const [tab,setTab]=useState("stocks");
  const [search,setSearch]=useState("");
  const [stocks,setStocks]=useState([]);
  const [fetching,setFetching]=useState(false);
  const [market,setMarket]=useState(marketStatus());
  const [apiOk,setApiOk]=useState(null);
  const [selected,setSelected]=useState(null);
  const [myStocks,setMyStocks]=useState(()=>{try{const s=localStorage.getItem("myStocks");return s?JSON.parse(s):[]}catch{return[]}});
  const [showAddForm,setShowAddForm]=useState(false);
  const [formData,setFormData]=useState({symbol:"",buyPrice:"",qty:""});
  const [messages,setMessages]=useState([{role:"assistant",content:"أهلاً! أنا مستشارك الاستثماري 🤖\n\nشفت وضعك: مبتدئ، عندك خسارة في محفظتك، سيولتك محدودة.\n\nأضف أسهمك في تبويب محفظتي وأحللها لك، أو اسألني مباشرة! 👇"}]);
  const [chatInput,setChatInput]=useState("");
  const [chatLoading,setChatLoading]=useState(false);
  const chatEndRef=useRef(null);

  useEffect(()=>{localStorage.setItem("advisorTheme",themeKey);},[themeKey]);
  useEffect(()=>{localStorage.setItem("myStocks",JSON.stringify(myStocks));},[myStocks]);
  useEffect(()=>{const t=setTimeout(()=>setSplash(false),2200);return()=>clearTimeout(t);},[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  const buildStocks=useCallback(async()=>{
    setFetching(true);setMarket(marketStatus());
    const results=await Promise.all(STOCKS_LIST.map(async s=>{
      // Generate realistic prices if no seed data
      const defaultPrice = {
        "بنوك":35,"طاقة":28,"بتروكيماويات":55,"أسمنت":22,"تجزئة":30,
        "اتصالات":80,"تقنية":40,"تعدين":58,"عقارات":18,"غذاء":45,
        "صحة":35,"تأمين":25,"نقل":20,"مالية":22
      }[s.sector]||25;
      const genPrices=(base)=>{let p=base,arr=[];for(let i=0;i<30;i++){p=Math.max(p+(Math.random()-0.49)*p*0.015,1);arr.push(parseFloat(p.toFixed(2)));}return arr;};
      const prices=[...(SEED[s.symbol]||genPrices(defaultPrice))];
      const real=await fetchRealPrice(s.symbol);
      if(real&&!isNaN(real.price)){setApiOk(true);prices[prices.length-1]=real.price;}
      else if(apiOk!==true)setApiOk(false);
      const cur=prices[prices.length-1],prev=prices[prices.length-2];
      return{...s,prices,current:cur,change:real?real.change:parseFloat((cur-prev).toFixed(2)),changePct:real?real.changePct:parseFloat(((cur-prev)/prev*100).toFixed(2)),rsi:calcRSI(prices),ma7:calcMA(prices,7),ma20:calcMA(prices,20),signal:getSignal(prices),isReal:!!real};
    }));
    setStocks(results);setFetching(false);
  },[apiOk]);

  useEffect(()=>{buildStocks();},[]);

  const getCalc=()=>{
    let tc=0,tn=0;
    const items=myStocks.map(h=>{
      const s=stocks.find(x=>x.symbol===h.symbol);
      const cp=s?s.current:h.buyPrice;
      const cost=h.buyPrice*h.qty,now=cp*h.qty,pnl=now-cost;
      tc+=cost;tn+=now;
      return{...h,currentPrice:cp,cost,now,pnl,pnlPct:cost>0?pnl/cost*100:0,signal:s?.signal};
    });
    return{items,totalCost:tc,totalNow:tn,totalPnl:tn-tc,totalPnlPct:tc>0?(tn-tc)/tc*100:0};
  };

  const addStock=()=>{
    if(!formData.symbol||!formData.buyPrice||!formData.qty)return;
    const f=STOCKS_LIST.find(s=>s.symbol===formData.symbol);
    if(!f)return;
    setMyStocks(prev=>[...prev.filter(s=>s.symbol!==formData.symbol),{...f,buyPrice:parseFloat(formData.buyPrice),qty:parseInt(formData.qty)}]);
    setFormData({symbol:"",buyPrice:"",qty:""});setShowAddForm(false);
  };

  const sendMessage=async(text)=>{
    const ut=text||chatInput.trim();
    if(!ut)return;
    setChatInput("");
    const calc=getCalc();
  const filteredStocks=useMemo(()=>{
    const q=search.trim();
    if(!q)return stocks;
    const isNum=q.split("").every(c=>c>="0"&&c<="9");
    if(isNum)return stocks.filter(s=>s.symbol.startsWith(q));
    return stocks.filter(s=>s.name.includes(q)||s.sector===q);
  },[stocks,search]);
    const pCtx=calc.items.length>0?"\n\nمحفظتي:\n"+calc.items.map(h=>h.name+": "+h.qty+" سهم بـ "+h.buyPrice+" والآن "+h.currentPrice?.toFixed(2)+" ("+(h.pnl>=0?"ربح":"خسارة")+" "+Math.abs(h.pnl||0).toFixed(0)+" ريال)").join("\n"):"";
    const nm=[...messages,{role:"user",content:ut}];
    setMessages(nm);setChatLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true","x-api-key":import.meta.env.VITE_ANTHROPIC_KEY||"","anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-5",max_tokens:1000,system:USER_PROFILE.aiPersona+pCtx+"\nالسوق:"+(market.open?"مفتوح":"مغلق"),messages:nm.map(m=>({role:m.role,content:m.content}))})});
      const raw=await res.text();
      let data;try{data=JSON.parse(raw);}catch{setMessages(p=>[...p,{role:"assistant",content:"⚠️ خطأ في الاتصال، جرب مرة ثانية."}]);setChatLoading(false);return;}
      if(!res.ok)setMessages(p=>[...p,{role:"assistant",content:"⚠️ "+(data?.error?.message||"خطأ، جرب مرة ثانية.")}]);
      else setMessages(p=>[...p,{role:"assistant",content:data.content?.map(c=>c.text||"").join("")||"تعذّر الرد."}]);
    }catch{setMessages(p=>[...p,{role:"assistant",content:"⚠️ خطأ في الاتصال، جرب مرة ثانية."}]);}
    setChatLoading(false);
  };

  const analyzeStock=async(stock)=>{
    setSelected(stock);setTab("chat");
    const h=myStocks.find(x=>x.symbol===stock.symbol);
    let msg="حلل سهم "+stock.name+" ("+stock.symbol+")\nالسعر: "+stock.current+" ر.س | التغير: "+stock.changePct+"%\nRSI: "+stock.rsi+" | MA7: "+stock.ma7+" | الإشارة: "+stock.signal.label;
    if(h){const pnl=(stock.current-h.buyPrice)*h.qty;msg+="\n\nعندي "+h.qty+" سهم اشتريتها بـ "+h.buyPrice+" ر.س | "+(pnl>=0?"ربح":"خسارة")+": "+Math.abs(pnl).toFixed(0)+" ريال";}
    await sendMessage(msg);
  };

  const analyzePortfolio=async()=>{
    setTab("chat");
    const calc=getCalc();
  const filteredStocks=useMemo(()=>{
    const q=search.trim();
    if(!q)return stocks;
    const isNum=q.split("").every(c=>c>="0"&&c<="9");
    if(isNum)return stocks.filter(s=>s.symbol.startsWith(q));
    return stocks.filter(s=>s.name.includes(q)||s.sector===q);
  },[stocks,search]);
    if(!calc.items.length){setMessages(p=>[...p,{role:"assistant",content:"أضف أسهمك في تبويب محفظتي أول 👆"}]);return;}
    const msg="حلل محفظتي الكاملة:\n"+calc.items.map(h=>"- "+h.name+": اشتريت بـ "+h.buyPrice+" والآن "+h.currentPrice?.toFixed(2)+" | "+(h.pnl>=0?"ربح":"خسارة")+": "+Math.abs(h.pnl).toFixed(0)+" ريال ("+h.pnlPct.toFixed(1)+"%) | إشارة: "+(h.signal?.label||"؟")).join("\n")+"\n\nإجمالي: "+(calc.totalPnl>=0?"ربح":"خسارة")+" "+Math.abs(calc.totalPnl).toFixed(0)+" ريال ("+calc.totalPnlPct.toFixed(1)+"%)\n\nأبي:\n1. تحليل كل سهم\n2. أيها أبيع وأيها أتمسك\n3. استراتيجية تعويض الخسارة خلال سنة";
    await sendMessage(msg);
  };

  const calc=getCalc();
  const filteredStocks=useMemo(()=>{
    const q=search.trim();
    if(!q)return stocks;
    const isNum=q.split("").every(c=>c>="0"&&c<="9");
    if(isNum)return stocks.filter(s=>s.symbol.startsWith(q));
    return stocks.filter(s=>s.name.includes(q)||s.sector===q);
  },[stocks,search]);

  // ── Splash ──────────────────────────────────────────────────────────────────
  if(splash){
    return(
      <div style={{height:"100vh",display:"flex",flexDirection:"column",background:T.splashBg,fontFamily:"Cairo,sans-serif",direction:"rtl",position:"relative",overflow:"hidden"}}>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet"/>
        <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:0.3}50%{transform:scale(1.5);opacity:1}}`}</style>
        {/* Background bars */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"60%",display:"flex",alignItems:"flex-end",gap:4,padding:"0 10px",opacity:0.13}}>
          {[55,70,45,85,60,95,50,80,65,90,55,75,88,62,92].map((h,i)=>(
            <div key={i} style={{flex:1,height:h+"%",background:T.accent,borderRadius:"4px 4px 0 0"}}/>
          ))}
        </div>
        <div style={{flex:1}}/>
        <div style={{padding:"0 32px 64px"}}>
          <div style={{display:"inline-flex",background:T.accentGrad,borderRadius:20,padding:"5px 14px",marginBottom:20}}>
            <span style={{fontSize:11,color:"white",fontWeight:700}}>السوق السعودي · تداول</span>
          </div>
          <div style={{fontSize:40,fontWeight:900,color:T.text,lineHeight:1.2,marginBottom:12}}>
            مستشارك<br/><span style={{color:T.accent}}>الاستثماري</span>
          </div>
          <div style={{fontSize:14,color:T.subtext,lineHeight:1.8,marginBottom:36,maxWidth:280}}>
            تحليل ذكي للأسهم السعودية وتوصيات مخصصة لملفك الاستثماري
          </div>
          <div style={{display:"flex",gap:8}}>
            {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:T.accent,opacity:0.35,animation:"pulse 1.4s ease-in-out "+(i*0.2)+"s infinite"}}/>)}
          </div>
        </div>
      </div>
    );
  }

  // ── Main App ─────────────────────────────────────────────────────────────────
  return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:T.bg,fontFamily:"Cairo,sans-serif",direction:"rtl"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet"/>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:0.3}50%{transform:scale(1.5);opacity:1}}`}</style>

      {/* Header */}
      <div style={{background:T.header,borderBottom:"1px solid "+T.divider,padding:"12px 14px",flexShrink:0,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:16,fontWeight:900,color:T.text}}>مستشارك الاستثماري</div>
            <div style={{fontSize:10,color:T.subtext,display:"flex",gap:5}}>
              <span style={{color:T.accent,fontWeight:700}}>مبتدئ</span>·<span>مضاربة</span>·<span>مخاطرة منخفضة</span>
            </div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{background:market.open?"#e8f5e9":"#fff0f0",border:"1px solid "+(market.open?"#a5d6a7":"#ffcdd2"),borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700,color:market.open?"#2e7d32":"#c62828"}}>{market.open?"● مفتوح":"● مغلق"}</div>
            {apiOk!==null&&<div style={{background:apiOk?"#e3f2fd":"#fffde7",borderRadius:20,padding:"3px 10px",fontSize:10,color:apiOk?"#1565c0":"#f9a825"}}>{apiOk?"📡 حقيقي":"📋 تاريخي"}</div>}
            <button onClick={()=>setShowThemePicker(p=>!p)} style={{background:T.accentGrad,border:"none",borderRadius:20,padding:"5px 12px",cursor:"pointer",color:"white",fontSize:12,fontFamily:"Cairo",fontWeight:700}}>🎨 ثيم</button>
            <button onClick={buildStocks} disabled={fetching} style={{background:fetching?T.accentLight:T.accentGrad,border:"none",borderRadius:20,color:fetching?T.subtext:"white",padding:"5px 12px",cursor:fetching?"default":"pointer",fontSize:12,fontFamily:"Cairo",fontWeight:700}}>🔄 تحديث</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{background:T.header,borderBottom:"1px solid "+T.divider,padding:"0 14px",flexShrink:0}}>
        <div style={{display:"flex"}}>
          {[["stocks","📊 الأسهم"],["portfolio","💼 محفظتي"],["chat","💬 المستشار"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{background:"transparent",border:"none",borderBottom:tab===id?"2.5px solid "+T.accent:"2.5px solid transparent",color:tab===id?T.accentDark:T.subtext,padding:"10px 14px",cursor:"pointer",fontSize:12,fontFamily:"Cairo",fontWeight:tab===id?700:400}}>
              {label}{id==="portfolio"&&myStocks.length>0&&<span style={{background:T.accent,borderRadius:10,fontSize:9,padding:"1px 5px",marginRight:3,color:"white"}}>{myStocks.length}</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>

        {/* Stocks Tab */}
        {tab==="stocks"&&(
          <div style={{flex:1,overflowY:"auto",padding:"12px"}}>
            {!market.open&&<div style={{background:T.accentBg,border:"1px solid "+T.accentBorder,borderRadius:12,padding:"10px 14px",marginBottom:12,fontSize:12,color:T.accentDark}}>🕐 السوق مغلق — آخر أسعار إغلاق</div>}
            <div style={{marginBottom:10}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 ابحث: اسم السهم أو الرقم أو القطاع" style={{width:"100%",background:T.card,border:"1.5px solid "+T.accentBorder,borderRadius:14,padding:"11px 14px",color:T.text,fontSize:13,fontFamily:"Cairo",outline:"none",boxSizing:"border-box"}}/>
              {search.trim()&&<div style={{fontSize:11,color:T.subtext,marginTop:6,paddingRight:4}}>{filteredStocks.length} نتيجة للبحث عن "{search.trim()}"</div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10}}>
              {filteredStocks.map(stock=>{
                const h=myStocks.find(x=>x.symbol===stock.symbol);
                const pnl=h?(stock.current-h.buyPrice)*h.qty:null;
                return(
                  <div key={stock.symbol} onClick={()=>analyzeStock(stock)} style={{background:T.card,borderRadius:18,padding:"13px 12px",cursor:"pointer",boxShadow:selected?.symbol===stock.symbol?"0 6px 24px "+T.accentShadow:"0 2px 10px rgba(0,0,0,0.05)",border:"1.5px solid "+(selected?.symbol===stock.symbol?T.accent:T.divider),backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div>
                        <div style={{fontWeight:800,fontSize:13,color:T.text}}>{stock.name}</div>
                        <div style={{fontSize:10,color:T.subtext,marginTop:1}}>{stock.symbol}</div>
                      </div>
                      <div style={{background:stock.signal.bg,color:stock.signal.color,borderRadius:8,padding:"2px 7px",fontSize:10,fontWeight:700}}>{stock.signal.label}</div>
                    </div>
                    <SparkLine prices={stock.prices} positive={stock.change>=0}/>
                    <div style={{marginTop:8}}>
                      <div style={{fontSize:16,fontWeight:900,color:T.text}}>{stock.current} <span style={{fontSize:9,color:T.subtext}}>ر.س</span></div>
                      <div style={{fontSize:11,fontWeight:700,color:stock.change>=0?"#2d6a4f":"#c1121f"}}>{stock.change>=0?"▲":"▼"} {Math.abs(stock.changePct)}%</div>
                      {pnl!==null&&<div style={{fontSize:10,fontWeight:700,color:pnl>=0?"#2d6a4f":"#c1121f",background:pnl>=0?"#d8f3dc":"#ffe0e0",borderRadius:5,padding:"2px 6px",display:"inline-block",marginTop:2}}>{pnl>=0?"ربح +":"خسارة "}{Math.abs(pnl).toFixed(0)} ر.س</div>}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,paddingTop:7,borderTop:"1px solid "+T.divider,alignItems:"center"}}>
                      <span style={{fontSize:10,color:T.subtext}}>RSI <b style={{color:stock.rsi<35?"#2d6a4f":stock.rsi>65?"#c1121f":T.accentDark}}>{stock.rsi}</b></span>
                      <button onClick={e=>{e.stopPropagation();if(h)setMyStocks(p=>p.filter(x=>x.symbol!==stock.symbol));else{setFormData({symbol:stock.symbol,buyPrice:"",qty:""});setShowAddForm(true);setTab("portfolio");}}} style={{background:h?"#ffe0e0":T.accentBg,border:"1px solid "+(h?"#ffcdd2":T.accentBorder),borderRadius:7,color:h?"#c1121f":T.accentDark,fontSize:10,padding:"3px 8px",cursor:"pointer",fontFamily:"Cairo",fontWeight:600}}>{h?"✕ إزالة":"＋ أضف"}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {tab==="portfolio"&&(
          <div style={{flex:1,overflowY:"auto",padding:"12px"}}>
            {myStocks.length>0&&(
              <div style={{background:T.card,borderRadius:20,padding:"14px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.05)",border:"1px solid "+T.accentBorder}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontWeight:900,fontSize:15,color:T.text}}>💼 محفظتي</div>
                  <button onClick={analyzePortfolio} style={{background:T.accentGrad,border:"none",borderRadius:20,color:"white",padding:"6px 14px",cursor:"pointer",fontSize:12,fontFamily:"Cairo",fontWeight:700}}>🤖 حلل كل شيء</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                  {[["رأس المال",calc.totalCost.toFixed(0),T.text,""],["القيمة",calc.totalNow.toFixed(0),T.text,""],[(calc.totalPnl>=0?"ربح":"خسارة"),(calc.totalPnl>=0?"+":"")+calc.totalPnl.toFixed(0),calc.totalPnl>=0?"#2d6a4f":"#c1121f",calc.totalPnl>=0?"#d8f3dc":"#ffe0e0"]].map(([l,v,c,bg],i)=>(
                    <div key={i} style={{background:bg||T.accentLight,borderRadius:12,padding:"9px 8px",textAlign:"center"}}>
                      <div style={{fontSize:9,color:T.subtext,marginBottom:3}}>{l}</div>
                      <div style={{fontSize:14,fontWeight:900,color:c}}>{v}</div>
                      <div style={{fontSize:9,color:T.subtext}}>ريال</div>
                    </div>
                  ))}
                </div>
                {calc.items.map(h=>(
                  <div key={h.symbol} style={{background:T.accentLight,borderRadius:12,padding:"10px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:13,color:T.text}}>{h.name}</div>
                      <div style={{fontSize:10,color:T.subtext,marginTop:1}}>{h.qty} سهم · دخلت بـ {h.buyPrice}</div>
                      {h.signal&&<div style={{background:h.signal.bg,color:h.signal.color,display:"inline-block",borderRadius:5,padding:"1px 7px",fontSize:10,fontWeight:700,marginTop:3}}>{h.signal.label}</div>}
                    </div>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontSize:13,fontWeight:900,color:T.text}}>{h.currentPrice?.toFixed(2)} ر.س</div>
                      <div style={{fontSize:11,fontWeight:700,color:h.pnl>=0?"#2d6a4f":"#c1121f"}}>{h.pnl>=0?"+":""}{h.pnl.toFixed(0)} ر.س</div>
                      <div style={{fontSize:10,color:h.pnl>=0?"#40916c":"#d62828"}}>{h.pnlPct.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {showAddForm&&(
              <div style={{background:T.card,borderRadius:20,padding:"14px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.06)",border:"1px solid "+T.accentBorder}}>
                <div style={{fontWeight:800,fontSize:14,color:T.text,marginBottom:10}}>إضافة سهم</div>
                <select value={formData.symbol} onChange={e=>setFormData(p=>({...p,symbol:e.target.value}))} style={{width:"100%",background:T.inputBg,border:"1px solid "+T.accentBorder,borderRadius:11,padding:"10px",color:T.text,fontSize:13,fontFamily:"Cairo",marginBottom:8,outline:"none",boxSizing:"border-box"}}>
                  <option value="">اختر السهم</option>
                  {STOCKS_LIST.map(s=><option key={s.symbol} value={s.symbol}>{s.name} ({s.symbol})</option>)}
                </select>
                <input type="number" placeholder="سعر الشراء (ريال)" value={formData.buyPrice} onChange={e=>setFormData(p=>({...p,buyPrice:e.target.value}))} style={{width:"100%",background:T.inputBg,border:"1px solid "+T.accentBorder,borderRadius:11,padding:"10px",color:T.text,fontSize:13,fontFamily:"Cairo",marginBottom:8,outline:"none",boxSizing:"border-box"}}/>
                <input type="number" placeholder="عدد الأسهم" value={formData.qty} onChange={e=>setFormData(p=>({...p,qty:e.target.value}))} style={{width:"100%",background:T.inputBg,border:"1px solid "+T.accentBorder,borderRadius:11,padding:"10px",color:T.text,fontSize:13,fontFamily:"Cairo",marginBottom:10,outline:"none",boxSizing:"border-box"}}/>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={addStock} style={{flex:1,background:T.accentGrad,border:"none",borderRadius:11,color:"white",padding:"11px",cursor:"pointer",fontSize:13,fontFamily:"Cairo",fontWeight:700}}>إضافة ✓</button>
                  <button onClick={()=>setShowAddForm(false)} style={{flex:1,background:T.accentLight,border:"none",borderRadius:11,color:T.subtext,padding:"11px",cursor:"pointer",fontSize:13,fontFamily:"Cairo"}}>إلغاء</button>
                </div>
              </div>
            )}
            <button onClick={()=>setShowAddForm(true)} style={{width:"100%",background:T.card,border:"2px dashed "+T.accentBorder,borderRadius:16,color:T.accentDark,padding:"14px",cursor:"pointer",fontSize:13,fontFamily:"Cairo",fontWeight:700,marginBottom:8}}>＋ أضف سهم لمحفظتي</button>
            {!myStocks.length&&!showAddForm&&<div style={{textAlign:"center",padding:"40px 0",color:T.subtext}}><div style={{fontSize:36,marginBottom:10}}>💼</div><div style={{fontWeight:700,color:T.text,fontSize:13}}>أضف أسهمك مع سعر الشراء</div><div style={{fontSize:11,marginTop:5}}>والبوت يحسب ربحك وخسارتك</div></div>}
          </div>
        )}

        {/* Chat Tab */}
        {tab==="chat"&&(
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"7px 12px",borderBottom:"1px solid "+T.divider,display:"flex",gap:6,flexWrap:"wrap",flexShrink:0,background:T.header}}>
              {["عندي خسارة في سهم؟","استراتيجية تعويض الخسارة","ما معنى RSI؟","كيف أحدد وقف الخسارة؟","نصيحة لمبتدئ؟"].map(q=>(
                <button key={q} onClick={()=>sendMessage(q)} style={{background:T.card,border:"1px solid "+T.accentBorder,borderRadius:20,color:T.accentDark,fontSize:11,padding:"5px 11px",cursor:"pointer",fontFamily:"Cairo",fontWeight:600,whiteSpace:"nowrap"}}>{q}</button>
              ))}
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"12px"}}>
              {messages.map((m,i)=>{
                const isUser=m.role==="user";
                return(
                  <div key={i} style={{display:"flex",justifyContent:isUser?"flex-start":"flex-end",marginBottom:12,gap:8}}>
                    {!isUser&&<div style={{width:30,height:30,borderRadius:"50%",background:T.accentGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>🤖</div>}
                    <div style={{maxWidth:"78%",background:isUser?T.accentGrad:T.card,borderRadius:isUser?"16px 16px 16px 4px":"16px 16px 4px 16px",padding:"11px 14px",fontSize:13,lineHeight:1.8,color:isUser?"white":T.text,boxShadow:"0 2px 10px rgba(0,0,0,0.06)",whiteSpace:"pre-wrap",fontFamily:"Cairo"}}>{m.content}</div>
                    {isUser&&<div style={{width:30,height:30,borderRadius:"50%",background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>👤</div>}
                  </div>
                );
              })}
              {chatLoading&&(
                <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12,gap:8}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:T.accentGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
                  <div style={{background:T.card,borderRadius:"16px 16px 4px 16px",padding:"11px 16px",display:"flex",gap:5,alignItems:"center"}}>
                    {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:T.accent,opacity:0.4,animation:"pulse 1.2s ease-in-out "+(i*0.2)+"s infinite"}}/>)}
                  </div>
                </div>
              )}
              <div ref={chatEndRef}/>
            </div>
            <div style={{padding:"8px 12px",borderTop:"1px solid "+T.divider,background:T.header,flexShrink:0,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
              <div style={{display:"flex",gap:8}}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()} placeholder="اسأل مستشارك..." style={{flex:1,background:T.inputBg,border:"1.5px solid "+T.accentBorder,borderRadius:13,padding:"10px 13px",color:T.text,fontSize:13,fontFamily:"Cairo",outline:"none"}}/>
                <button onClick={()=>sendMessage()} disabled={chatLoading||!chatInput.trim()} style={{background:chatLoading||!chatInput.trim()?T.accentLight:T.accentGrad,border:"none",borderRadius:13,color:chatLoading||!chatInput.trim()?T.subtext:"white",padding:"10px 16px",cursor:chatLoading||!chatInput.trim()?"default":"pointer",fontSize:13,fontFamily:"Cairo",fontWeight:700}}>إرسال</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div style={{background:T.header,borderTop:"1px solid "+T.divider,padding:"5px 12px",textAlign:"center",fontSize:10,color:T.subtext,flexShrink:0}}>
        ⚠️ للأغراض التعليمية فقط — لا تمثل نصيحة استثمارية مرخصة
      </div>

      {/* Theme Picker Bottom Sheet */}
      {showThemePicker&&(
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={()=>setShowThemePicker(false)}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.35)"}}/>
          <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:T.card,borderRadius:"24px 24px 0 0",padding:"20px 20px 40px",backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)"}}>
            <div style={{width:40,height:4,borderRadius:2,background:T.subtext,opacity:0.3,margin:"0 auto 18px"}}/>
            <div style={{fontSize:15,fontWeight:900,color:T.text,textAlign:"center",marginBottom:18,fontFamily:"Cairo"}}>اختر ثيم التطبيق</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
              {Object.entries(THEMES).map(([key,th])=>(
                <button key={key} onClick={()=>{setThemeKey(key);setShowThemePicker(false);}} style={{background:themeKey===key?T.accentBg:"transparent",border:"2px solid "+(themeKey===key?T.accent:T.divider),borderRadius:14,padding:"12px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                  <div style={{width:40,height:40,borderRadius:12,background:th.accentGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{th.emoji}</div>
                  <span style={{fontSize:11,color:T.text,fontFamily:"Cairo",fontWeight:themeKey===key?700:400}}>{th.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
