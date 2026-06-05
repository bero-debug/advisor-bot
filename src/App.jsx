import { useState, useEffect, useCallback, useRef } from "react";


// ─── الثيمات ──────────────────────────────────────────────────────────────────
const THEMES = {
  gold: {
    name:"ذهبي",
    emoji:"🟡",
    bg:"linear-gradient(160deg,#fdf6ec 0%,#fef9f0 60%,#fdf0dc 100%)",
    card:"rgba(255,255,255,0.85)",
    header:"rgba(255,255,255,0.85)",
    accent:"#e8a030",
    accentDark:"#c87d0a",
    accentGrad:"linear-gradient(135deg,#e8a030,#c87d0a)",
    accentShadow:"#e8a03035",
    accentBorder:"rgba(232,160,48,0.25)",
    accentBg:"#fff8ee",
    accentLight:"#f9f5ef",
    tabActive:"#c87d0a",
    tabBorder:"#e8a030",
    inputBg:"#f9f5ef",
    text:"#1a1a1a",
    subtext:"#b09070",
    divider:"rgba(232,160,48,0.1)",
    splashBg:"linear-gradient(160deg,#fdf6ec 0%,#fef9f0 60%,#fdf0dc 100%)",
    disclaimer:"rgba(255,255,255,0.6)",
  },
  blue: {
    name:"سماوي",
    emoji:"🔵",
    bg:"linear-gradient(160deg,#f0f7ff 0%,#e8f4fd 50%,#deeeff 100%)",
    card:"rgba(255,255,255,0.88)",
    header:"rgba(255,255,255,0.88)",
    accent:"#0a84ff",
    accentDark:"#006edb",
    accentGrad:"linear-gradient(135deg,#0a84ff,#006edb)",
    accentShadow:"#0a84ff30",
    accentBorder:"rgba(10,132,255,0.22)",
    accentBg:"#e8f3ff",
    accentLight:"#f0f7ff",
    tabActive:"#006edb",
    tabBorder:"#0a84ff",
    inputBg:"#f0f7ff",
    text:"#1a1a2e",
    subtext:"#6e8aaa",
    divider:"rgba(10,132,255,0.1)",
    splashBg:"linear-gradient(160deg,#deeeff 0%,#e8f4fd 60%,#f0f7ff 100%)",
    disclaimer:"rgba(255,255,255,0.65)",
  },
  green: {
    name:"زمردي",
    emoji:"🟢",
    bg:"linear-gradient(160deg,#f0faf4 0%,#e8f5ed 50%,#dff2e8 100%)",
    card:"rgba(255,255,255,0.88)",
    header:"rgba(255,255,255,0.88)",
    accent:"#30d158",
    accentDark:"#1a9e3f",
    accentGrad:"linear-gradient(135deg,#30d158,#1a9e3f)",
    accentShadow:"#30d15830",
    accentBorder:"rgba(48,209,88,0.22)",
    accentBg:"#e8f9ee",
    accentLight:"#f0faf4",
    tabActive:"#1a9e3f",
    tabBorder:"#30d158",
    inputBg:"#f0faf4",
    text:"#0f2a1a",
    subtext:"#5a8a6a",
    divider:"rgba(48,209,88,0.1)",
    splashBg:"linear-gradient(160deg,#dff2e8 0%,#e8f5ed 60%,#f0faf4 100%)",
    disclaimer:"rgba(255,255,255,0.65)",
  },
  dark: {
    name:"ليلي",
    emoji:"⚫",
    bg:"linear-gradient(160deg,#0f1117 0%,#141820 60%,#0d1015 100%)",
    card:"rgba(30,35,50,0.9)",
    header:"rgba(20,24,36,0.95)",
    accent:"#e8a030",
    accentDark:"#c87d0a",
    accentGrad:"linear-gradient(135deg,#e8a030,#c87d0a)",
    accentShadow:"#e8a03030",
    accentBorder:"rgba(232,160,48,0.2)",
    accentBg:"rgba(232,160,48,0.1)",
    accentLight:"rgba(30,35,50,0.8)",
    tabActive:"#e8a030",
    tabBorder:"#e8a030",
    inputBg:"rgba(255,255,255,0.06)",
    text:"#f0f0f0",
    subtext:"#8a8a9a",
    divider:"rgba(255,255,255,0.07)",
    splashBg:"linear-gradient(160deg,#0f1117 0%,#141820 100%)",
    disclaimer:"rgba(0,0,0,0.3)",
  },
};

// ─── ملف المستخدم ─────────────────────────────────────────────────────────────
const USER_PROFILE = {
  level:"مبتدئ", goal:"أرباح سريعة (مضاربة)", risk:"منخفض",
  totalLoss:"5000-20000", liquidity:"محدودة", horizon:"سنة فأكثر",
  aiPersona:`أنت مستشار استثماري شخصي باللهجة السعودية العامية، متخصص في سوق تداول السعودي.
صاحبك مبتدئ، عنده خسارة في محفظته تتراوح بين 5000-20000 ريال، سيولته محدودة، وأفقه الزمني سنة فأكثر.
شخصيتك: صديق خبير يتكلم بعامية سعودية مريحة، صريح وما تجامل، تعطي رأي واضح.
تشرح المصطلحات بمثال بسيط. لا تشجع المضاربة لمبتدئ بسيولة محدودة.
ابدأ بـ "نصيحتي لك:" أو "صراحة:" وأضف دائماً "هذا رأيي مو نصيحة مالية رسمية."`
};

// ─── الأسهم ───────────────────────────────────────────────────────────────────
const STOCKS_LIST = [
  {symbol:"2222",name:"أرامكو",sector:"طاقة"},
  {symbol:"1120",name:"الراجحي",sector:"بنوك"},
  {symbol:"1180",name:"الأهلي",sector:"بنوك"},
  {symbol:"1150",name:"الإنماء",sector:"بنوك"},
  {symbol:"1010",name:"الرياض",sector:"بنوك"},
  {symbol:"2010",name:"سابك",sector:"بتروكيماويات"},
  {symbol:"7010",name:"الاتصالات",sector:"اتصالات"},
  {symbol:"1211",name:"معادن",sector:"تعدين"},
  {symbol:"1302",name:"المتقدمة",sector:"تقنية"},
  {symbol:"2170",name:"الصناعات الكهربائية",sector:"صناعة"},
  {symbol:"2243",name:"لوبريف",sector:"صناعة"},
  {symbol:"4003",name:"بن داوود",sector:"تجزئة"},
  {symbol:"4190",name:"جرير",sector:"تجزئة"},
  {symbol:"4321",name:"سينومي سنترز",sector:"تجزئة"},
  {symbol:"4322",name:"سينومي ريتيل",sector:"تجزئة"},
  {symbol:"4310",name:"سيرا",sector:"عقارات"},
  {symbol:"4020",name:"دار الأركان",sector:"عقارات"},
  {symbol:"2380",name:"پترو رابغ",sector:"بتروكيماويات"},
  {symbol:"4200",name:"مجموعة تداول",sector:"مالية"},
  {symbol:"2350",name:"سافكو",sector:"بتروكيماويات"},
];

// ─── مؤشرات فنية ─────────────────────────────────────────────────────────────
function calcRSI(p){if(p.length<14)return 50;let g=0,l=0;for(let i=p.length-14;i<p.length-1;i++){const d=p[i+1]-p[i];if(d>0)g+=d;else l+=Math.abs(d);}return parseFloat((100-100/(1+g/(l||1))).toFixed(1));}
function calcMA(p,n){const s=p.slice(-n);return parseFloat((s.reduce((a,b)=>a+b,0)/s.length).toFixed(2));}
function calcMACD(p){if(p.length<26)return 0;const e=(arr,n)=>arr.slice(-n).reduce((a,b)=>a+b,0)/n;return parseFloat((e(p,12)-e(p,26)).toFixed(3));}
function getSignal(p){
  const c=p[p.length-1],rsi=calcRSI(p),macd=calcMACD(p),ma7=calcMA(p,Math.min(7,p.length)),ma20=calcMA(p,Math.min(20,p.length));
  let s=0;
  if(rsi<35)s+=2;else if(rsi<45)s+=1;else if(rsi>65)s-=2;else if(rsi>55)s-=1;
  if(macd>0)s+=1;else s-=1;
  if(c>ma7&&ma7>ma20)s+=2;else if(c<ma7&&ma7<ma20)s-=2;
  if(s>=3)return{label:"شراء قوي",color:"#2d6a4f",bg:"#d8f3dc",dot:"#52b788"};
  if(s>=1)return{label:"شراء",color:"#40916c",bg:"#e8f5e9",dot:"#74c69d"};
  if(s<=-3)return{label:"بيع قوي",color:"#c1121f",bg:"#ffe0e0",dot:"#e63946"};
  if(s<=-1)return{label:"بيع",color:"#d62828",bg:"#fff0f0",dot:"#e07a7a"};
  return{label:"انتظار",color:"#b5640a",bg:"#fff3e0",dot:"#e8a030"};
}

// ─── رسم بياني ───────────────────────────────────────────────────────────────
function SparkLine({prices,positive}){
  if(!prices||prices.length<2)return null;
  const W=120,H=40,mn=Math.min(...prices),mx=Math.max(...prices),rng=mx-mn||1;
  const pts=prices.map((p,i)=>`${(i/(prices.length-1))*W},${H-((p-mn)/rng)*(H-4)-2}`).join(" ");
  const col=positive?"#40916c":"#d62828";
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:40,display:"block"}}>
      <polyline points={pts} fill="none" stroke={col} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

// ─── حالة السوق ───────────────────────────────────────────────────────────────
function marketStatus(){
  const r=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Riyadh"}));
  const d=r.getDay(),h=r.getHours()+r.getMinutes()/60;
  return{open:d>=0&&d<=4&&h>=10&&h<15};
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function fetchRealPrice(symbol){
  try{
    const res=await fetch(`https://app.sahmk.sa/api/v1/quote/${symbol}/`,{headers:{"Accept":"application/json"}});
    if(!res.ok)return null;
    const d=await res.json();
    return{price:parseFloat(d.price),change:parseFloat(d.change),changePct:parseFloat(d.change_percent),volume:parseInt(d.volume)||0};
  }catch{return null;}
}

// ─── بيانات ثابتة ─────────────────────────────────────────────────────────────
const SEED={
  "2222":[25.10,25.20,25.05,24.90,25.00,24.80,24.95,25.30,25.20,25.10,25.40,25.25,25.15,25.00,25.20,25.35,25.28,25.10,25.22,25.18,25.30,25.26,25.14,25.00,24.95,25.05,25.20,25.18,25.10,25.26],
  "1120":[87.5,88.0,87.8,88.2,88.5,88.3,88.0,88.4,88.6,88.2,88.1,88.5,88.7,88.3,88.0,88.4,88.6,88.2,88.3,88.5,88.1,88.0,88.4,88.2,88.3,88.5,88.2,88.1,88.3,88.4],
  "1180":[41.5,41.8,42.0,41.9,42.2,42.1,42.4,42.3,42.0,41.8,42.1,42.5,42.3,42.0,42.2,42.6,42.4,42.1,42.3,42.5,42.2,42.0,42.4,42.3,42.1,42.2,42.5,42.3,42.1,42.3],
  "1150":[26.0,26.2,26.5,26.3,26.8,26.6,26.4,26.9,27.1,26.8,26.5,26.9,27.2,26.9,26.6,26.8,27.1,26.9,26.6,26.8,27.0,26.8,26.5,26.8,27.0,26.8,26.6,26.7,26.8,26.9],
  "1010":[24.0,24.3,24.6,24.4,24.8,24.6,24.3,24.7,25.0,24.7,24.4,24.8,25.1,24.8,24.5,24.7,25.0,24.8,24.5,24.8,25.0,24.8,24.4,24.7,25.0,24.8,24.5,24.7,24.8,24.9],
  "2010":[94.0,94.5,95.0,94.8,95.2,95.5,95.0,94.8,95.2,95.4,95.1,94.9,95.3,95.5,95.2,94.8,95.0,95.4,95.2,95.0,95.3,95.1,94.9,95.2,95.4,95.1,95.0,95.2,95.3,95.2],
  "7010":[103,104,104.5,104,105,104.8,104.2,104.6,105,104.5,104.2,104.8,105.2,104.8,104.4,104.6,105,104.8,104.5,104.7,104.9,104.6,104.4,104.8,105,104.7,104.5,104.7,104.8,104.6],
  "1211":[57.5,58.0,58.5,58.0,58.7,58.5,58.2,58.7,59.0,58.7,58.4,58.8,59.1,58.8,58.5,58.7,59.0,58.8,58.5,58.8,59.0,58.8,58.4,58.7,59.0,58.8,58.5,58.7,58.8,58.7],
  "1302":[18.0,17.8,17.5,17.2,17.0,16.8,17.1,16.9,16.6,16.4,16.8,16.5,16.2,16.5,16.3,16.0,16.3,16.1,15.9,16.2,16.0,15.8,16.0,15.8,15.6,15.9,15.7,15.5,15.7,15.8],
  "2170":[28.0,28.3,28.6,28.4,28.8,28.6,28.3,28.7,29.0,28.7,28.4,28.8,29.1,28.8,28.5,28.7,29.0,28.8,28.5,28.8,29.0,28.8,28.4,28.7,29.0,28.8,28.5,28.7,28.8,28.9],
  "2243":[45.0,45.5,46.0,45.8,46.2,46.0,45.7,46.1,46.4,46.1,45.8,46.2,46.5,46.2,45.9,46.1,46.4,46.2,45.9,46.2,46.4,46.2,45.8,46.1,46.4,46.2,45.9,46.1,46.2,46.3],
  "4003":[32.0,32.4,32.8,32.6,33.0,32.8,32.5,32.9,33.2,32.9,32.6,33.0,33.3,33.0,32.7,32.9,33.2,33.0,32.7,33.0,33.2,33.0,32.6,32.9,33.2,33.0,32.7,32.9,33.0,33.1],
  "4190":[88.0,88.5,89.0,88.8,89.2,89.0,88.7,89.1,89.4,89.1,88.8,89.2,89.5,89.2,88.9,89.1,89.4,89.2,88.9,89.2,89.4,89.2,88.8,89.1,89.4,89.2,88.9,89.1,89.2,89.3],
  "4321":[14.0,14.2,14.5,14.3,14.6,14.4,14.2,14.5,14.8,14.5,14.3,14.6,14.9,14.6,14.4,14.6,14.9,14.7,14.4,14.7,14.9,14.7,14.3,14.6,14.9,14.7,14.4,14.6,14.7,14.8],
  "4322":[10.0,10.2,10.4,10.3,10.5,10.4,10.2,10.5,10.7,10.5,10.3,10.5,10.8,10.6,10.4,10.5,10.8,10.6,10.4,10.6,10.8,10.6,10.3,10.5,10.8,10.6,10.4,10.5,10.6,10.7],
  "4310":[22.0,22.3,22.6,22.4,22.8,22.6,22.3,22.7,23.0,22.7,22.4,22.8,23.1,22.8,22.5,22.7,23.0,22.8,22.5,22.8,23.0,22.8,22.4,22.7,23.0,22.8,22.5,22.7,22.8,22.9],
  "4020":[8.0,8.2,8.4,8.3,8.5,8.4,8.2,8.5,8.7,8.5,8.3,8.5,8.8,8.6,8.4,8.5,8.8,8.6,8.4,8.6,8.8,8.6,8.3,8.5,8.8,8.6,8.4,8.5,8.6,8.7],
  "2380":[17.2,17.4,17.6,17.5,17.8,17.6,17.4,17.8,18.0,17.8,17.5,17.8,18.1,17.9,17.6,17.8,18.0,17.8,17.6,17.8,18.0,17.8,17.5,17.8,18.0,17.8,17.6,17.7,17.8,17.8],
  "4200":[21.5,21.8,22.0,21.9,22.1,22.0,21.8,22.1,22.3,22.1,22.0,22.2,22.4,22.2,22.0,22.1,22.3,22.1,22.0,22.2,22.3,22.1,22.0,22.1,22.2,22.1,22.0,22.1,22.2,22.1],
  "2350":[90.0,90.5,91.0,90.8,91.2,91.0,90.7,91.1,91.4,91.1,90.8,91.2,91.5,91.2,90.9,91.1,91.4,91.2,90.9,91.2,91.4,91.2,90.8,91.1,91.4,91.2,90.9,91.1,91.2,91.3],
};

// ─── Chat Bubble ──────────────────────────────────────────────────────────────
function ChatBubble({msg}){
  const isUser=msg.role==="user";
  return(
    <div style={{display:"flex",justifyContent:isUser?"flex-start":"flex-end",marginBottom:12,gap:8}}>
      {!isUser&&<div style={{width:32,height:32,borderRadius:"50%",background:T.accentGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0,boxShadow:`0 2px 8px ${T.accentShadow}`}}>🤖</div>}
      <div style={{maxWidth:"78%",background:isUser?T.accentGrad:T.card,borderRadius:isUser?"18px 18px 18px 4px":"18px 18px 4px 18px",padding:"12px 16px",fontSize:13,lineHeight:1.8,color:isUser?"#ffffff":T.text,boxShadow:isUser?`0 4px 15px ${T.accentShadow}`:"0 2px 12px rgba(0,0,0,0.06)",whiteSpace:"pre-wrap",fontFamily:"'Cairo',sans-serif"}}>
        {msg.content}
      </div>
      {isUser&&<div style={{width:32,height:32,borderRadius:"50%",background:"#f0ebe0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>👤</div>}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function AdvisorBot(){
  const [tab,setTab]=useState("stocks");
  const [stocks,setStocks]=useState([]);
  const [fetching,setFetching]=useState(false);
  const [lastUpdate,setLastUpdate]=useState(null);
  const [market,setMarket]=useState(marketStatus());
  const [apiOk,setApiOk]=useState(null);
  const [selected,setSelected]=useState(null);
  const [myStocks,setMyStocks]=useState(()=>{try{const s=localStorage.getItem("myStocks");return s?JSON.parse(s):[];}catch{return[];}});
  const [showAddForm,setShowAddForm]=useState(false);
  const [formData,setFormData]=useState({symbol:"",buyPrice:"",qty:""});
  const [messages,setMessages]=useState([{role:"assistant",content:`أهلاً! أنا مستشارك الاستثماري 🤖\n\nشفت وضعك: مبتدئ، عندك خسارة في محفظتك، سيولتك محدودة، وعندك صبر سنة فأكثر.\n\n📌 ابدأ بتبويب "محفظتي" وأضف أسهمك مع سعر الشراء\n\nأو اسألني أي سؤال مباشرة! 👇`}]);
  const [chatInput,setChatInput]=useState("");
  const [chatLoading,setChatLoading]=useState(false);
  const [themeKey,setThemeKey]=useState(()=>localStorage.getItem("advisorTheme")||"gold");
  const T=THEMES[themeKey]||THEMES.gold;
  const [showThemePicker,setShowThemePicker]=useState(false);
  useEffect(()=>{localStorage.setItem("advisorTheme",themeKey);},[themeKey]);
  const [splash,setSplash]=useState(true);
  const chatEndRef=useRef(null);

  useEffect(()=>{try{localStorage.setItem("myStocks",JSON.stringify(myStocks));}catch{};},[myStocks]);
  useEffect(()=>{setTimeout(()=>setSplash(false),2200);},[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  const buildStocks=useCallback(async()=>{
    setFetching(true);setMarket(marketStatus());
    const results=await Promise.all(STOCKS_LIST.map(async s=>{
      const seed=[...(SEED[s.symbol]||Array(30).fill(10))];
      let prices=seed,realData=await fetchRealPrice(s.symbol);
      if(realData&&!isNaN(realData.price)){setApiOk(true);prices[prices.length-1]=realData.price;}
      else if(apiOk!==true)setApiOk(false);
      const cur=prices[prices.length-1],prev=prices[prices.length-2];
      return{...s,prices,current:cur,
        change:realData?realData.change:parseFloat((cur-prev).toFixed(2)),
        changePct:realData?realData.changePct:parseFloat(((cur-prev)/prev*100).toFixed(2)),
        volume:realData?.volume||0,isReal:!!realData,
        rsi:calcRSI(prices),macd:calcMACD(prices),
        ma7:calcMA(prices,7),ma20:calcMA(prices,20),signal:getSignal(prices)};
    }));
    setStocks(results);setLastUpdate(new Date());setFetching(false);
  },[apiOk]);

  useEffect(()=>{buildStocks();},[]);

  const getPortfolioCalc=()=>{
    let totalCost=0,totalNow=0;
    const items=myStocks.map(h=>{
      const s=stocks.find(x=>x.symbol===h.symbol);
      const cp=s?s.current:h.buyPrice;
      const cost=h.buyPrice*h.qty,now=cp*h.qty,pnl=now-cost;
      totalCost+=cost;totalNow+=now;
      return{...h,currentPrice:cp,cost,now,pnl,pnlPct:(pnl/cost*100),signal:s?.signal};
    });
    return{items,totalCost,totalNow,totalPnl:totalNow-totalCost,totalPnlPct:totalCost>0?(totalNow-totalCost)/totalCost*100:0};
  };

  const addToMyStocks=()=>{
    if(!formData.symbol||!formData.buyPrice||!formData.qty)return;
    const found=STOCKS_LIST.find(s=>s.symbol===formData.symbol);
    if(!found)return;
    setMyStocks(prev=>[...prev.filter(s=>s.symbol!==formData.symbol),{...found,buyPrice:parseFloat(formData.buyPrice),qty:parseInt(formData.qty)}]);
    setFormData({symbol:"",buyPrice:"",qty:""});setShowAddForm(false);
  };

  const analyzePortfolio=async()=>{
    setTab("chat");
    const calc=getPortfolioCalc();
    if(calc.items.length===0){setMessages(prev=>[...prev,{role:"assistant",content:"أضف أسهمك في تبويب محفظتي أول 👆"}]);return;}
    const details=calc.items.map(h=>`- ${h.name}: اشتريت بـ ${h.buyPrice} والآن ${h.currentPrice?.toFixed(2)} | ${h.pnl>=0?"ربح":"خسارة"}: ${Math.abs(h.pnl).toFixed(0)} ريال (${h.pnlPct.toFixed(1)}%) | إشارة: ${h.signal?.label||"؟"}`).join("\n");
    const msg=`حلل محفظتي الكاملة:\n${details}\n\nإجمالي: ${calc.totalPnl>=0?"ربح":"خسارة"} ${Math.abs(calc.totalPnl).toFixed(0)} ريال (${calc.totalPnlPct.toFixed(1)}%)\n\nأبي:\n1. تحليل كل سهم\n2. أيها أبيع وأيها أتمسك\n3. استراتيجية تعويض الخسارة خلال سنة مع سيولة محدودة`;
    await sendMessage(msg);
  };

  const analyzeStock=async(stock)=>{
    setSelected(stock);setTab("chat");
    const h=myStocks.find(x=>x.symbol===stock.symbol);
    let msg=`حلل سهم ${stock.name} (${stock.symbol})\nالسعر: ${stock.current} ر.س | التغير: ${stock.changePct}%\nRSI: ${stock.rsi} | MA7: ${stock.ma7} | MA20: ${stock.ma20}\nالإشارة: ${stock.signal.label}`;
    if(h){const pnl=(stock.current-h.buyPrice)*h.qty;msg+=`\n\nعندي ${h.qty} سهم اشتريتها بـ ${h.buyPrice} ر.س | ${pnl>=0?"ربح":"خسارة"}: ${pnl.toFixed(0)} ريال`;}
    await sendMessage(msg);
  };

  const sendMessage=async(text)=>{
    const userText=text||chatInput.trim();
    if(!userText)return;
    setChatInput("");
    const calc=getPortfolioCalc();
    const portfolioCtx=calc.items.length>0?`\n\nمحفظة المستخدم:\n${calc.items.map(h=>`${h.name}: ${h.qty} سهم بـ ${h.buyPrice} والآن ${h.currentPrice?.toFixed(2)||"?"} (${h.pnl>=0?"ربح":"خسارة"} ${Math.abs(h.pnl||0).toFixed(0)} ريال)`).join("\n")}\nإجمالي: ${calc.totalPnl>=0?"ربح":"خسارة"} ${Math.abs(calc.totalPnl).toFixed(0)} ريال`:"";
    const newMessages=[...messages,{role:"user",content:userText}];
    setMessages(newMessages);setChatLoading(true);
    const sys=`${USER_PROFILE.aiPersona}${portfolioCtx}\nحالة السوق: ${market.open?"مفتوح":"مغلق"}`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",
        headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true","x-api-key":import.meta.env.VITE_ANTHROPIC_KEY||"","anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-sonnet-4-5",max_tokens:1000,system:sys,messages:newMessages.map(m=>({role:m.role,content:m.content}))})});
      let data;const raw=await res.text();
      try{data=JSON.parse(raw);}catch{setMessages(prev=>[...prev,{role:"assistant",content:"⚠️ مشكلة في الاتصال، جرب مرة ثانية."}]);setChatLoading(false);return;}
      if(!res.ok)setMessages(prev=>[...prev,{role:"assistant",content:`⚠️ ${data?.error?.message||"خطأ، جرب مرة ثانية."}`}]);
      else setMessages(prev=>[...prev,{role:"assistant",content:data.content?.map(c=>c.text||"").join("")||"تعذّر الرد."}]);
    }catch(err){setMessages(prev=>[...prev,{role:"assistant",content:"⚠️ مشكلة في الاتصال، جرب مرة ثانية."}]);}
    setChatLoading(false);
  };

  const calc=getPortfolioCalc();

  // ─── Splash ─────────────────────────────────────────────────────────────────
  if(splash)return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:T.splashBg,fontFamily:"'Cairo',sans-serif",direction:"rtl",position:"relative",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet"/>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:0.3}50%{transform:scale(1.5);opacity:1}}`}</style>

      {/* Chart bars as pure divs - no SVG */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"65%",display:"flex",alignItems:"flex-end",gap:3,padding:"0 8px",opacity:0.12}}>
        {[55,70,45,85,60,95,50,80,65,90,55,75,88,62,92].map((h,i)=>(
          <div key={i} style={{flex:1,height:`${h}%`,background:T.accent,borderRadius:"4px 4px 0 0"}}/>
        ))}
      </div>

      {/* Rising line as div overlay */}
      <div style={{position:"absolute",bottom:"25%",left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${T.accent}40,${T.accent})`,opacity:0.3}}/>

      {/* Content */}
      <div style={{flex:1}}/>
      <div style={{padding:"0 32px 64px"}}>
        <div style={{display:"inline-flex",alignItems:"center",background:T.accentGrad,borderRadius:20,padding:"5px 14px",marginBottom:20}}>
          <span style={{fontSize:11,color:"white",fontWeight:700}}>السوق السعودي · تداول</span>
        </div>
        <div style={{fontSize:40,fontWeight:900,color:T.text,lineHeight:1.2,marginBottom:12}}>
          مستشارك<br/>
          <span style={{color:T.accent}}>الاستثماري</span>
        </div>
        <div style={{fontSize:14,color:T.subtext,lineHeight:1.8,marginBottom:36,maxWidth:280}}>
          تحليل ذكي للأسهم السعودية وتوصيات مخصصة لملفك الاستثماري
        </div>
        <div style={{display:"flex",gap:8}}>
          {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:T.accent,opacity:0.35,animation:`pulse 1.4s ease-in-out ${i*0.2}s infinite`}}/>)}
        </div>
      </div>
    </div>
  );

  return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:T.bg,fontFamily:"'Cairo','Segoe UI',sans-serif",direction:"rtl"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet"/>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{background:T.header,borderBottom:`1px solid ${T.divider}`,padding:"12px 16px",flexShrink:0,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:12,background:T.accentGrad,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 12px ${T.accentShadow}`}}><svg width="22" height="22" viewBox="0 0 56 56" fill="none">
              <rect x="4"  y="36" width="9" height="16" rx="3" fill="white" opacity="0.5"/>
              <rect x="16" y="26" width="9" height="26" rx="3" fill="white" opacity="0.7"/>
              <rect x="28" y="16" width="9" height="36" rx="3" fill="white" opacity="0.9"/>
              <rect x="40" y="8"  width="9" height="44" rx="3" fill="white"/>
              <polyline points="8,38 20,28 32,18 48,8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
              <circle cx="48" cy="8" r="4" fill="white"/>
            </svg></div>
            <div>
              <div style={{fontSize:15,fontWeight:900,color:T.text}}>مستشارك الاستثماري</div>
              <div style={{fontSize:10,color:T.subtext,display:"flex",gap:5,alignItems:"center"}}>
                <span style={{color:T.accent,fontWeight:700}}>مبتدئ</span>·<span>مضاربة</span>·<span>مخاطرة منخفضة</span>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {/* Theme picker button */}
            <button onClick={()=>setShowThemePicker(p=>!p)} style={{background:T.accentGrad,border:"none",borderRadius:20,padding:"6px 12px",cursor:"pointer",fontFamily:"Cairo",color:"#fff",display:"flex",alignItems:"center",gap:5,boxShadow:`0 3px 10px ${T.accentShadow}`,fontSize:12,fontWeight:700}}>
              🎨 <span>ثيم</span>
            </button>
            <div style={{background:market.open?"#e8f5e9":"#fff0f0",border:`1px solid ${market.open?"#a5d6a7":"#ffcdd2"}`,borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700,color:market.open?"#2e7d32":"#c62828"}}>
              {market.open?"● مفتوح":"● مغلق"}
            </div>
            {apiOk!==null&&<div style={{background:apiOk?"#e3f2fd":"#fff9c4",border:`1px solid ${apiOk?"#90caf9":"#fff176"}`,borderRadius:20,padding:"3px 10px",fontSize:10,color:apiOk?"#1565c0":"#f57f17"}}>
              {apiOk?"📡 حقيقي":"📋 تاريخي"}
            </div>}
            <button onClick={buildStocks} disabled={fetching} style={{background:fetching?T.accentLight:T.accentGrad,border:"none",borderRadius:20,color:fetching?T.subtext:"#fff",padding:"6px 14px",cursor:fetching?"default":"pointer",fontSize:12,fontFamily:"Cairo",fontWeight:700,boxShadow:fetching?"none":`0 4px 12px ${T.accentShadow}`}}>
              {fetching?"⏳ ...":"🔄 تحديث"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div style={{background:"rgba(255,255,255,0.7)",borderBottom:"1px solid rgba(232,160,48,0.12)",padding:"0 16px",flexShrink:0,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
        <div style={{display:"flex",gap:0}}>
          {[["stocks","📊 الأسهم"],["portfolio","💼 محفظتي"],["chat","💬 المستشار"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{background:"transparent",border:"none",borderBottom:tab===id?`2.5px solid ${T.tabBorder}`:"2.5px solid transparent",color:tab===id?T.tabActive:T.subtext,padding:"10px 14px",cursor:"pointer",fontSize:12,fontFamily:"Cairo",fontWeight:tab===id?700:400,transition:"all .2s"}}>
              {label}
              {id==="portfolio"&&myStocks.length>0&&<span style={{background:T.accent,borderRadius:10,fontSize:9,padding:"1px 6px",marginRight:4,color:"#fff",fontWeight:700}}>{myStocks.length}</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>

        {/* ── تبويب الأسهم ─────────────────────────────────────────────── */}
        {tab==="stocks"&&(
          <div style={{flex:1,overflowY:"auto",padding:"14px 14px"}}>
            {!market.open&&<div style={{background:T.accentBg,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:"10px 14px",marginBottom:12,fontSize:12,color:T.accentDark,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16}}>🕐</span> السوق مغلق — الأسعار هي آخر إغلاق، التوصيات ثابتة.
            </div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:12}}>
              {stocks.map(stock=>{
                const h=myStocks.find(x=>x.symbol===stock.symbol);
                const pnl=h?(stock.current-h.buyPrice)*h.qty:null;
                const isUp=stock.change>=0;
                return(
                  <div key={stock.symbol} onClick={()=>analyzeStock(stock)} style={{background:T.card,borderRadius:18,padding:"14px 12px",cursor:"pointer",transition:"all .2s",boxShadow:selected?.symbol===stock.symbol?`0 8px 30px ${T.accentShadow}`:"0 2px 12px rgba(0,0,0,0.06)",border:selected?.symbol===stock.symbol?`1.5px solid ${T.accent}`:`1.5px solid ${T.divider}`,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div>
                        <div style={{fontWeight:800,fontSize:13,color:T.text,lineHeight:1.3}}>{stock.name}</div>
                        <div style={{fontSize:10,color:T.subtext,marginTop:2}}>{stock.symbol}</div>
                      </div>
                      <div style={{background:stock.signal.bg,color:stock.signal.color,borderRadius:8,padding:"2px 7px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>
                        {stock.signal.label}
                      </div>
                    </div>
                    <SparkLine prices={stock.prices} positive={isUp}/>
                    <div style={{marginTop:8}}>
                      <div style={{fontSize:17,fontWeight:900,color:T.text}}>{stock.current} <span style={{fontSize:10,color:T.subtext,fontWeight:400}}>ر.س</span></div>
                      <div style={{fontSize:12,fontWeight:700,color:isUp?"#2d6a4f":"#c1121f"}}>
                        {isUp?"▲":"▼"} {Math.abs(stock.changePct)}%
                      </div>
                      {pnl!==null&&<div style={{fontSize:11,fontWeight:700,color:pnl>=0?"#2d6a4f":"#c1121f",marginTop:2,background:pnl>=0?"#d8f3dc":"#ffe0e0",borderRadius:6,padding:"2px 6px",display:"inline-block"}}>
                        {pnl>=0?"ربح +":"خسارة "}{Math.abs(pnl).toFixed(0)} ر.س
                      </div>}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:8,borderTop:`1px solid ${T.divider}`,alignItems:"center"}}>
                      <span style={{fontSize:10,color:T.subtext}}>RSI <b style={{color:stock.rsi<35?"#2d6a4f":stock.rsi>65?"#c1121f":"#b5640a"}}>{stock.rsi}</b></span>
                      <button onClick={e=>{e.stopPropagation();if(h)setMyStocks(p=>p.filter(x=>x.symbol!==stock.symbol));else{setFormData({symbol:stock.symbol,buyPrice:"",qty:""});setShowAddForm(true);setTab("portfolio");}}} style={{background:h?"#ffe0e0":T.accentBg,border:`1px solid ${h?"#ffcdd2":T.accentBorder}`,borderRadius:8,color:h?"#c1121f":T.accentDark,fontSize:10,padding:"3px 8px",cursor:"pointer",fontFamily:"Cairo",fontWeight:600}}>
                        {h?"✕ إزالة":"＋ أضف"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── تبويب المحفظة ────────────────────────────────────────────── */}
        {tab==="portfolio"&&(
          <div style={{flex:1,overflowY:"auto",padding:"14px 14px"}}>
            {myStocks.length>0&&(
              <div style={{background:T.card,borderRadius:20,padding:"16px",marginBottom:14,boxShadow:"0 4px 20px rgba(0,0,0,0.06)",border:`1px solid ${T.accentBorder}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{fontWeight:900,fontSize:15,color:T.text}}>💼 ملخص محفظتي</div>
                  <button onClick={analyzePortfolio} style={{background:T.accentGrad,border:"none",borderRadius:20,color:"#fff",padding:"7px 16px",cursor:"pointer",fontSize:12,fontFamily:"Cairo",fontWeight:700,boxShadow:`0 4px 12px ${T.accentShadow}`}}>🤖 حلل كل شيء</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
                  {[["رأس المال",calc.totalCost.toFixed(0),"#1a1a1a",""],["القيمة الحالية",calc.totalNow.toFixed(0),"#1a1a1a",""],
                    [calc.totalPnl>=0?"الربح":"الخسارة",(calc.totalPnl>=0?"+":"")+calc.totalPnl.toFixed(0),calc.totalPnl>=0?"#2d6a4f":"#c1121f",calc.totalPnl>=0?"#d8f3dc":"#ffe0e0"]
                  ].map(([label,val,color,bg],i)=>(
                    <div key={i} style={{background:bg||T.accentLight,borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
                      <div style={{fontSize:10,color:T.subtext,marginBottom:4}}>{label}</div>
                      <div style={{fontSize:15,fontWeight:900,color}}>{val}</div>
                      <div style={{fontSize:9,color:T.subtext}}>ريال</div>
                    </div>
                  ))}
                </div>
                {calc.items.map(h=>(
                  <div key={h.symbol} style={{background:T.accentLight,borderRadius:12,padding:"12px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:13,color:T.text}}>{h.name}</div>
                      <div style={{fontSize:11,color:T.subtext,marginTop:2}}>{h.qty} سهم · دخلت بـ {h.buyPrice} ر.س</div>
                      {h.signal&&<div style={{background:h.signal.bg,color:h.signal.color,display:"inline-block",borderRadius:6,padding:"1px 8px",fontSize:10,fontWeight:700,marginTop:4}}>{h.signal.label}</div>}
                    </div>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontSize:14,fontWeight:900,color:T.text}}>{h.currentPrice?.toFixed(2)} ر.س</div>
                      <div style={{fontSize:12,fontWeight:700,color:h.pnl>=0?"#2d6a4f":"#c1121f"}}>{h.pnl>=0?"+":""}{h.pnl.toFixed(0)} ر.س</div>
                      <div style={{fontSize:10,color:h.pnl>=0?"#40916c":"#d62828"}}>{h.pnlPct.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showAddForm&&(
              <div style={{background:T.card,borderRadius:20,padding:"16px",marginBottom:14,boxShadow:"0 4px 20px rgba(0,0,0,0.08)",border:`1px solid ${T.accentBorder}`}}>
                <div style={{fontWeight:800,fontSize:14,color:T.text,marginBottom:12}}>إضافة سهم</div>
                <select value={formData.symbol} onChange={e=>setFormData(p=>({...p,symbol:e.target.value}))} style={{width:"100%",background:T.inputBg,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:"10px",color:T.text,fontSize:13,fontFamily:"Cairo",marginBottom:10,outline:"none",boxSizing:"border-box"}}>
                  <option value="">اختر السهم</option>
                  {STOCKS_LIST.map(s=><option key={s.symbol} value={s.symbol}>{s.name} ({s.symbol})</option>)}
                </select>
                <input type="number" placeholder="سعر الشراء (ريال)" value={formData.buyPrice} onChange={e=>setFormData(p=>({...p,buyPrice:e.target.value}))} style={{width:"100%",background:T.inputBg,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:"10px",color:T.text,fontSize:13,fontFamily:"Cairo",marginBottom:10,outline:"none",boxSizing:"border-box"}}/>
                <input type="number" placeholder="عدد الأسهم" value={formData.qty} onChange={e=>setFormData(p=>({...p,qty:e.target.value}))} style={{width:"100%",background:"#f9f5ef",border:"1px solid rgba(232,160,48,0.25)",borderRadius:12,padding:"10px",color:"#1a1a1a",fontSize:13,fontFamily:"Cairo",marginBottom:12,outline:"none",boxSizing:"border-box"}}/>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={addToMyStocks} style={{flex:1,background:T.accentGrad,border:"none",borderRadius:12,color:"#fff",padding:"11px",cursor:"pointer",fontSize:13,fontFamily:"Cairo",fontWeight:700,boxShadow:`0 4px 12px ${T.accentShadow}`}}>إضافة ✓</button>
                  <button onClick={()=>setShowAddForm(false)} style={{flex:1,background:T.accentLight,border:"none",borderRadius:12,color:T.subtext,padding:"11px",cursor:"pointer",fontSize:13,fontFamily:"Cairo"}}>إلغاء</button>
                </div>
              </div>
            )}

            <button onClick={()=>setShowAddForm(true)} style={{width:"100%",background:T.card,border:`2px dashed ${T.accentBorder}`,borderRadius:16,color:T.accentDark,padding:"14px",cursor:"pointer",fontSize:13,fontFamily:"Cairo",fontWeight:700,marginBottom:8}}>
              ＋ أضف سهم لمحفظتي
            </button>

            {myStocks.length===0&&!showAddForm&&(
              <div style={{textAlign:"center",padding:"40px 0",color:T.subtext}}>
                <div style={{fontSize:40,marginBottom:12}}>💼</div>
                <div style={{fontSize:14,fontWeight:700,color:T.text}}>أضف أسهمك مع سعر الشراء</div>
                <div style={{fontSize:12,marginTop:6,color:T.subtext}}>والبوت يحسب ربحك وخسارتك</div>
              </div>
            )}
          </div>
        )}

        {/* ── تبويب المستشار ───────────────────────────────────────────── */}
        {tab==="chat"&&(
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"8px 14px",borderBottom:`1px solid ${T.divider}`,display:"flex",gap:6,flexWrap:"wrap",flexShrink:0,background:T.header,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
              {["عندي خسارة في سهم، أبيع أو أتمسك؟","أعطني استراتيجية تعويض الخسارة","ما معنى RSI؟","كيف أحدد وقف الخسارة؟","نصيحة لمبتدئ؟"].map(q=>(
                <button key={q} onClick={()=>sendMessage(q)} style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:20,color:T.accentDark,fontSize:11,padding:"5px 12px",cursor:"pointer",fontFamily:"Cairo",whiteSpace:"nowrap",fontWeight:600,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
                  {q}
                </button>
              ))}
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"14px 14px",background:"transparent"}}>
              <div style={{maxWidth:720,margin:"0 auto"}}>
                {messages.map((m,i)=><ChatBubble key={i} msg={m}/>)}
                {chatLoading&&(
                  <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12,gap:8}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#e8a030,#c87d0a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>🤖</div>
                    <div style={{background:"rgba(255,255,255,0.9)",borderRadius:"18px 18px 4px 18px",padding:"12px 16px",color:T.accentDark,fontSize:13,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",display:"flex",gap:6,alignItems:"center"}}>
                      {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:T.accent,animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite`}}/>)}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef}/>
              </div>
            </div>
            <div style={{padding:"10px 14px",borderTop:`1px solid ${T.divider}`,background:T.header,flexShrink:0,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
              <div style={{maxWidth:720,margin:"0 auto",display:"flex",gap:8}}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()} placeholder="اسأل مستشارك..." style={{flex:1,background:T.inputBg,border:`1.5px solid ${T.accentBorder}`,borderRadius:14,padding:"11px 14px",color:T.text,fontSize:13,fontFamily:"Cairo",outline:"none"}}/>
                <button onClick={()=>sendMessage()} disabled={chatLoading||!chatInput.trim()} style={{background:chatLoading||!chatInput.trim()?"#f5efe5":"linear-gradient(135deg,#e8a030,#c87d0a)",border:"none",borderRadius:14,color:chatLoading||!chatInput.trim()?"#c0a080":"#fff",padding:"11px 18px",cursor:chatLoading||!chatInput.trim()?"default":"pointer",fontSize:13,fontFamily:"Cairo",fontWeight:700,boxShadow:chatLoading||!chatInput.trim()?"none":`0 4px 12px ${T.accentShadow}`}}>إرسال</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{background:T.disclaimer,borderTop:`1px solid ${T.divider}`,padding:"6px 14px",textAlign:"center",fontSize:10,color:T.subtext,flexShrink:0}}>
        ⚠️ للأغراض التعليمية فقط — لا تمثل نصيحة استثمارية مرخصة
      </div>

      {/* Theme picker - bottom sheet */}
      {showThemePicker&&(
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={()=>setShowThemePicker(false)}>
          <div style={{background:"rgba(0,0,0,0.3)",position:"absolute",inset:0}}/>
          <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:T.card,borderRadius:"24px 24px 0 0",padding:"20px 20px 36px",backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)",boxShadow:"0 -8px 40px rgba(0,0,0,0.15)"}}>
            {/* Handle */}
            <div style={{width:40,height:4,borderRadius:2,background:T.subtext,opacity:0.3,margin:"0 auto 20px"}}/>
            <div style={{fontSize:15,fontWeight:900,color:T.text,textAlign:"center",marginBottom:20,fontFamily:"Cairo"}}>اختر ثيم التطبيق</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
              {Object.entries(THEMES).map(([key,th])=>(
                <button key={key} onClick={()=>{setThemeKey(key);setShowThemePicker(false);}} style={{background:themeKey===key?T.accentBg:"transparent",border:`2px solid ${themeKey===key?T.accent:T.divider}`,borderRadius:16,padding:"14px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,transition:"all .2s"}}>
                  <div style={{width:44,height:44,borderRadius:12,background:th.accentGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 4px 12px ${th.accentShadow}`}}>{th.emoji}</div>
                  <span style={{fontSize:12,color:T.text,fontFamily:"Cairo",fontWeight:themeKey===key?700:500}}>{th.name}</span>
                  {themeKey===key&&<div style={{width:6,height:6,borderRadius:"50%",background:T.accent}}/>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
