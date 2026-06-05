import { useState, useEffect, useCallback, useRef } from "react";

// ─── ملف المستخدم ─────────────────────────────────────────────────────────────
const USER_PROFILE = {
  level: "مبتدئ", goal: "أرباح سريعة (مضاربة)", risk: "منخفض",
  totalLoss: "5000-20000", liquidity: "محدودة", horizon: "سنة فأكثر",
  aiPersona: `أنت مستشار استثماري شخصي باللهجة السعودية العامية، متخصص في سوق تداول السعودي.
صاحبك مبتدئ، عنده خسارة في محفظته تتراوح بين 5000-20000 ريال، سيولته محدودة، وأفقه الزمني سنة فأكثر.

شخصيتك:
- صديق خبير يتكلم بعامية سعودية مريحة
- صريح وما تجامل، حتى لو الخبر مو زين
- تعطي رأي واضح: "أنا رأيي تبيع / تمسك / تشتري"
- تشرح المصطلحات بمثال بسيط بين قوسين

كيف تتعامل مع المواقف:
- خسارة في سهم: تعاطف + خيارات واضحة (بيع/تمسك/توسيط) + تأثير على الخسارة الكلية
- طلب استراتيجية تعويض: خطة واقعية تناسب سيولة محدودة وأفق سنة+
- سؤال عام: اشرح بمثال عملي قصير
- لو ذكر مبلغ: احسب له تقريباً

مبادئ ثابتة:
- دائماً اذكر: "هذا رأيي مو نصيحة مالية رسمية"
- لا تشجع المضاربة لمبتدئ بسيولة محدودة
- ركز على الحفاظ على رأس المال أولاً ثم التعويض تدريجياً
- ابدأ بـ "نصيحتي لك:" أو "صراحة:" حسب السياق`
};

// ─── الأسهم ───────────────────────────────────────────────────────────────────
const STOCKS_LIST = [
  // أسهم مضافة مسبقاً
  { symbol: "1150", name: "الإنماء",             sector: "بنوك" },
  { symbol: "1302", name: "المتقدمة",            sector: "تقنية" },
  { symbol: "2010", name: "سابك",                sector: "بتروكيماويات" },
  { symbol: "2170", name: "الصناعات الكهربائية", sector: "صناعة" },
  { symbol: "2243", name: "لوبريف",              sector: "صناعة" },
  { symbol: "4003", name: "بن داوود",            sector: "تجزئة" },
  { symbol: "4190", name: "جرير",                sector: "تجزئة" },
  { symbol: "4321", name: "سينومي سنترز",        sector: "تجزئة" },
  { symbol: "4322", name: "سينومي ريتيل",        sector: "تجزئة" },
  { symbol: "4310", name: "سيرا",                sector: "عقارات" },
  // الشركات الكبرى
  { symbol: "2222", name: "أرامكو السعودية",     sector: "طاقة" },
  { symbol: "1120", name: "الراجحي",             sector: "بنوك" },
  { symbol: "1180", name: "الأهلي السعودي",      sector: "بنوك" },
  { symbol: "7010", name: "الاتصالات السعودية",  sector: "اتصالات" },
  { symbol: "1211", name: "معادن",               sector: "تعدين" },
  { symbol: "2380", name: "پترو رابغ",           sector: "بتروكيماويات" },
  { symbol: "4200", name: "مجموعة تداول",        sector: "مالية" },
  { symbol: "2350", name: "سافكو",               sector: "بتروكيماويات" },
  { symbol: "1010", name: "الرياض",              sector: "بنوك" },
  { symbol: "1030", name: "السعودي الفرنسي",     sector: "بنوك" },
  { symbol: "2060", name: "نماء للكيماويات",     sector: "بتروكيماويات" },
  { symbol: "4001", name: "الحكير",              sector: "تجزئة" },
  { symbol: "4161", name: "أبو خضر",             sector: "تجزئة" },
  { symbol: "4240", name: "المناطق الاقتصادية",  sector: "عقارات" },
  { symbol: "4020", name: "دار الأركان",         sector: "عقارات" },
];

// ─── مؤشرات فنية ─────────────────────────────────────────────────────────────
function calcRSI(prices) {
  if (prices.length < 14) return 50;
  let g=0,l=0;
  for(let i=prices.length-14;i<prices.length-1;i++){const d=prices[i+1]-prices[i];if(d>0)g+=d;else l+=Math.abs(d);}
  return parseFloat((100-100/(1+g/(l||1))).toFixed(1));
}
function calcMA(prices,n){const s=prices.slice(-n);return parseFloat((s.reduce((a,b)=>a+b,0)/s.length).toFixed(2));}
function calcMACD(prices){
  if(prices.length<26)return 0;
  const ema=(arr,n)=>arr.slice(-n).reduce((a,b)=>a+b,0)/n;
  return parseFloat((ema(prices,12)-ema(prices,26)).toFixed(3));
}
function getSignal(prices){
  const cur=prices[prices.length-1],rsi=calcRSI(prices),macd=calcMACD(prices);
  const ma7=calcMA(prices,Math.min(7,prices.length)),ma20=calcMA(prices,Math.min(20,prices.length));
  let s=0;
  if(rsi<35)s+=2;else if(rsi<45)s+=1;else if(rsi>65)s-=2;else if(rsi>55)s-=1;
  if(macd>0)s+=1;else s-=1;
  if(cur>ma7&&ma7>ma20)s+=2;else if(cur<ma7&&ma7<ma20)s-=2;
  if(s>=3) return{label:"شراء قوي",color:"#00e676",bg:"#00e67622",icon:"▲▲"};
  if(s>=1) return{label:"شراء",    color:"#69f0ae",bg:"#69f0ae18",icon:"▲"};
  if(s<=-3)return{label:"بيع قوي", color:"#ff1744",bg:"#ff174422",icon:"▼▼"};
  if(s<=-1)return{label:"بيع",     color:"#ff6b6b",bg:"#ff6b6b18",icon:"▼"};
  return          {label:"انتظار", color:"#ffd740",bg:"#ffd74018",icon:"◆"};
}

// ─── رسم بياني ───────────────────────────────────────────────────────────────
function MiniChart({prices}){
  if(!prices||prices.length<2)return null;
  const W=110,H=36,mn=Math.min(...prices),mx=Math.max(...prices),rng=mx-mn||1;
  const pts=prices.map((p,i)=>`${(i/(prices.length-1))*W},${H-((p-mn)/rng)*(H-4)-2}`).join(" ");
  const isUp=prices[prices.length-1]>=prices[0];
  return(<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:36}}>
    <polyline points={pts} fill="none" stroke={isUp?"#00e676":"#ff1744"} strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>);
}

function marketStatus(){
  const r=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Riyadh"}));
  const d=r.getDay(),h=r.getHours()+r.getMinutes()/60;
  return{open:d>=0&&d<=4&&h>=10&&h<15};
}

async function fetchRealPrice(symbol){
  try{
    const res=await fetch(`https://app.sahmk.sa/api/v1/quote/${symbol}/`,{headers:{"Accept":"application/json"}});
    if(!res.ok)return null;
    const d=await res.json();
    return{price:parseFloat(d.price),change:parseFloat(d.change),changePct:parseFloat(d.change_percent),volume:parseInt(d.volume)||0};
  }catch{return null;}
}

// ─── بيانات تاريخية ثابتة ────────────────────────────────────────────────────
const SEED={
  "1150":[26.0,26.2,26.5,26.3,26.8,26.6,26.4,26.9,27.1,26.8,26.5,26.9,27.2,26.9,26.6,26.8,27.1,26.9,26.6,26.8,27.0,26.8,26.5,26.8,27.0,26.8,26.6,26.7,26.8,26.9],
  "1302":[18.0,17.8,17.5,17.2,17.0,16.8,17.1,16.9,16.6,16.4,16.8,16.5,16.2,16.5,16.3,16.0,16.3,16.1,15.9,16.2,16.0,15.8,16.0,15.8,15.6,15.9,15.7,15.5,15.7,15.8],
  "2010":[94.0,94.5,95.0,94.8,95.2,95.5,95.0,94.8,95.2,95.4,95.1,94.9,95.3,95.5,95.2,94.8,95.0,95.4,95.2,95.0,95.3,95.1,94.9,95.2,95.4,95.1,95.0,95.2,95.3,95.2],
  "2170":[28.0,28.3,28.6,28.4,28.8,28.6,28.3,28.7,29.0,28.7,28.4,28.8,29.1,28.8,28.5,28.7,29.0,28.8,28.5,28.8,29.0,28.8,28.4,28.7,29.0,28.8,28.5,28.7,28.8,28.9],
  "2243":[45.0,45.5,46.0,45.8,46.2,46.0,45.7,46.1,46.4,46.1,45.8,46.2,46.5,46.2,45.9,46.1,46.4,46.2,45.9,46.2,46.4,46.2,45.8,46.1,46.4,46.2,45.9,46.1,46.2,46.3],
  "4003":[32.0,32.4,32.8,32.6,33.0,32.8,32.5,32.9,33.2,32.9,32.6,33.0,33.3,33.0,32.7,32.9,33.2,33.0,32.7,33.0,33.2,33.0,32.6,32.9,33.2,33.0,32.7,32.9,33.0,33.1],
  "4190":[88.0,88.5,89.0,88.8,89.2,89.0,88.7,89.1,89.4,89.1,88.8,89.2,89.5,89.2,88.9,89.1,89.4,89.2,88.9,89.2,89.4,89.2,88.8,89.1,89.4,89.2,88.9,89.1,89.2,89.3],
  "4321":[14.0,14.2,14.5,14.3,14.6,14.4,14.2,14.5,14.8,14.5,14.3,14.6,14.9,14.6,14.4,14.6,14.9,14.7,14.4,14.7,14.9,14.7,14.3,14.6,14.9,14.7,14.4,14.6,14.7,14.8],
  "4322":[10.0,10.2,10.4,10.3,10.5,10.4,10.2,10.5,10.7,10.5,10.3,10.5,10.8,10.6,10.4,10.5,10.8,10.6,10.4,10.6,10.8,10.6,10.3,10.5,10.8,10.6,10.4,10.5,10.6,10.7],
  "4310":[22.0,22.3,22.6,22.4,22.8,22.6,22.3,22.7,23.0,22.7,22.4,22.8,23.1,22.8,22.5,22.7,23.0,22.8,22.5,22.8,23.0,22.8,22.4,22.7,23.0,22.8,22.5,22.7,22.8,22.9],
  "2222":[25.10,25.20,25.05,24.90,25.00,24.80,24.95,25.30,25.20,25.10,25.40,25.25,25.15,25.00,25.20,25.35,25.28,25.10,25.22,25.18,25.30,25.26,25.14,25.00,24.95,25.05,25.20,25.18,25.10,25.26],
  "1120":[87.5,88.0,87.8,88.2,88.5,88.3,88.0,88.4,88.6,88.2,88.1,88.5,88.7,88.3,88.0,88.4,88.6,88.2,88.3,88.5,88.1,88.0,88.4,88.2,88.3,88.5,88.2,88.1,88.3,88.4],
  "1180":[41.5,41.8,42.0,41.9,42.2,42.1,42.4,42.3,42.0,41.8,42.1,42.5,42.3,42.0,42.2,42.6,42.4,42.1,42.3,42.5,42.2,42.0,42.4,42.3,42.1,42.2,42.5,42.3,42.1,42.3],
  "7010":[103,104,104.5,104,105,104.8,104.2,104.6,105,104.5,104.2,104.8,105.2,104.8,104.4,104.6,105,104.8,104.5,104.7,104.9,104.6,104.4,104.8,105,104.7,104.5,104.7,104.8,104.6],
  "1211":[57.5,58.0,58.5,58.0,58.7,58.5,58.2,58.7,59.0,58.7,58.4,58.8,59.1,58.8,58.5,58.7,59.0,58.8,58.5,58.8,59.0,58.8,58.4,58.7,59.0,58.8,58.5,58.7,58.8,58.7],
  "2380":[17.2,17.4,17.6,17.5,17.8,17.6,17.4,17.8,18.0,17.8,17.5,17.8,18.1,17.9,17.6,17.8,18.0,17.8,17.6,17.8,18.0,17.8,17.5,17.8,18.0,17.8,17.6,17.7,17.8,17.8],
  "4200":[21.5,21.8,22.0,21.9,22.1,22.0,21.8,22.1,22.3,22.1,22.0,22.2,22.4,22.2,22.0,22.1,22.3,22.1,22.0,22.2,22.3,22.1,22.0,22.1,22.2,22.1,22.0,22.1,22.2,22.1],
  "2350":[90.0,90.5,91.0,90.8,91.2,91.0,90.7,91.1,91.4,91.1,90.8,91.2,91.5,91.2,90.9,91.1,91.4,91.2,90.9,91.2,91.4,91.2,90.8,91.1,91.4,91.2,90.9,91.1,91.2,91.3],
  "1010":[24.0,24.3,24.6,24.4,24.8,24.6,24.3,24.7,25.0,24.7,24.4,24.8,25.1,24.8,24.5,24.7,25.0,24.8,24.5,24.8,25.0,24.8,24.4,24.7,25.0,24.8,24.5,24.7,24.8,24.9],
  "1030":[42.0,42.4,42.8,42.6,43.0,42.8,42.5,42.9,43.2,42.9,42.6,43.0,43.3,43.0,42.7,42.9,43.2,43.0,42.7,43.0,43.2,43.0,42.6,42.9,43.2,43.0,42.7,42.9,43.0,43.1],
  "2060":[16.0,16.2,16.5,16.3,16.6,16.4,16.2,16.5,16.8,16.5,16.3,16.6,16.9,16.6,16.4,16.6,16.9,16.7,16.4,16.7,16.9,16.7,16.3,16.6,16.9,16.7,16.4,16.6,16.7,16.8],
  "4001":[28.0,28.3,28.6,28.4,28.8,28.6,28.3,28.7,29.0,28.7,28.4,28.8,29.1,28.8,28.5,28.7,29.0,28.8,28.5,28.8,29.0,28.8,28.4,28.7,29.0,28.8,28.5,28.7,28.8,28.9],
  "4161":[18.0,18.3,18.6,18.4,18.8,18.6,18.3,18.7,19.0,18.7,18.4,18.8,19.1,18.8,18.5,18.7,19.0,18.8,18.5,18.8,19.0,18.8,18.4,18.7,19.0,18.8,18.5,18.7,18.8,18.9],
  "4240":[12.0,12.2,12.4,12.3,12.5,12.4,12.2,12.5,12.7,12.5,12.3,12.5,12.8,12.6,12.4,12.5,12.8,12.6,12.4,12.6,12.8,12.6,12.3,12.5,12.8,12.6,12.4,12.5,12.6,12.7],
  "4020":[8.0,8.2,8.4,8.3,8.5,8.4,8.2,8.5,8.7,8.5,8.3,8.5,8.8,8.6,8.4,8.5,8.8,8.6,8.4,8.6,8.8,8.6,8.3,8.5,8.8,8.6,8.4,8.5,8.6,8.7],
};

// ─── مكون فقاعة المحادثة ─────────────────────────────────────────────────────
function ChatBubble({msg}){
  const isUser=msg.role==="user";
  return(
    <div style={{display:"flex",justifyContent:isUser?"flex-start":"flex-end",marginBottom:10}}>
      {!isUser&&<div style={{width:28,height:28,borderRadius:"50%",background:"#1565c0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginLeft:8,flexShrink:0}}>🤖</div>}
      <div style={{maxWidth:"82%",background:isUser?"#eef3ff":"#ffffff",border:`1px solid ${isUser?"#b8ccf0":"#dde8f5"}`,borderRadius:isUser?"14px 14px 14px 4px":"14px 14px 4px 14px",padding:"10px 14px",fontSize:13,lineHeight:1.8,color:isUser?"#1565c0":"#1a2340",whiteSpace:"pre-wrap"}}>{msg.content}</div>
      {isUser&&<div style={{width:28,height:28,borderRadius:"50%",background:"#dde8ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginRight:8,flexShrink:0}}>👤</div>}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function AdvisorBot() {
  const [tab,        setTab]        = useState("stocks");
  const [stocks,     setStocks]     = useState([]);
  const [fetching,   setFetching]   = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [market,     setMarket]     = useState(marketStatus());
  const [apiOk,      setApiOk]      = useState(null);
  const [selected,   setSelected]   = useState(null);

  // المحفظة الشخصية
  const [myStocks,   setMyStocks]   = useState(()=>{ try{ const s=localStorage.getItem("myStocks"); return s?JSON.parse(s):[]; }catch{return[];} });
  useEffect(()=>{ try{ localStorage.setItem("myStocks",JSON.stringify(myStocks)); }catch{} },[myStocks]);
  const [showAddForm,setShowAddForm]= useState(false);
  const [formData,   setFormData]   = useState({symbol:"",buyPrice:"",qty:""});

  // المحادثة
  const [messages,   setMessages]   = useState([
    {role:"assistant",content:`أهلاً! أنا مستشارك الاستثماري 🤖\n\nشفت وضعك: عندك خسارة في محفظتك، سيولتك محدودة، وعندك صبر سنة فأكثر — هذا الوضع يمكن نشتغل فيه بذكاء.\n\n📌 ابدأ بتبويب "محفظتي" وأضف أسهمك مع سعر الشراء، وأعطيك:\n• تحليل كل سهم\n• استراتيجية تعويض الخسارة\n• متى تبيع ومتى تتمسك\n\nأو اسألني أي سؤال مباشرة! 👇`}
  ]);
  const [chatInput,  setChatInput]  = useState("");
  const [chatLoading,setChatLoading]= useState(false);
  const chatEndRef = useRef(null);

  // ─── جلب الأسهم ────────────────────────────────────────────────────────────
  const buildStocks = useCallback(async () => {
    setFetching(true); setMarket(marketStatus());
    const results = await Promise.all(STOCKS_LIST.map(async s=>{
      const seed=[...(SEED[s.symbol]||Array(30).fill(10))];
      let prices=seed, realData=await fetchRealPrice(s.symbol);
      if(realData&&!isNaN(realData.price)){setApiOk(true);prices[prices.length-1]=realData.price;}
      else if(apiOk!==true) setApiOk(false);
      const cur=prices[prices.length-1],prev=prices[prices.length-2];
      return{...s,prices,current:cur,
        change:realData?realData.change:parseFloat((cur-prev).toFixed(2)),
        changePct:realData?realData.changePct:parseFloat(((cur-prev)/prev*100).toFixed(2)),
        volume:realData?.volume||0,isReal:!!realData,
        rsi:calcRSI(prices),macd:calcMACD(prices),
        ma7:calcMA(prices,7),ma20:calcMA(prices,20),signal:getSignal(prices)};
    }));
    setStocks(results); setLastUpdate(new Date()); setFetching(false);
  },[apiOk]);

  useEffect(()=>{buildStocks();},[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  // ─── حسابات المحفظة ─────────────────────────────────────────────────────────
  const getPortfolioCalc = () => {
    let totalCost=0,totalNow=0;
    const items = myStocks.map(h=>{
      const s=stocks.find(x=>x.symbol===h.symbol);
      const currentPrice=s?s.current:h.buyPrice;
      const cost=h.buyPrice*h.qty;
      const now=currentPrice*h.qty;
      const pnl=now-cost;
      const pnlPct=((now-cost)/cost*100);
      totalCost+=cost; totalNow+=now;
      return{...h,currentPrice,cost,now,pnl,pnlPct,signal:s?.signal};
    });
    const totalPnl=totalNow-totalCost;
    const totalPnlPct=totalCost>0?(totalNow-totalCost)/totalCost*100:0;
    return{items,totalCost,totalNow,totalPnl,totalPnlPct};
  };

  // ─── إضافة سهم للمحفظة ──────────────────────────────────────────────────────
  const addToMyStocks = () => {
    if(!formData.symbol||!formData.buyPrice||!formData.qty)return;
    const found=STOCKS_LIST.find(s=>s.symbol===formData.symbol);
    if(!found)return;
    setMyStocks(prev=>[...prev.filter(s=>s.symbol!==formData.symbol),
      {...found,buyPrice:parseFloat(formData.buyPrice),qty:parseInt(formData.qty)}]);
    setFormData({symbol:"",buyPrice:"",qty:""});
    setShowAddForm(false);
  };

  // ─── تحليل المحفظة كاملة بالـ AI ───────────────────────────────────────────
  const analyzePortfolio = async () => {
    setTab("chat");
    const calc=getPortfolioCalc();
    if(calc.items.length===0){
      setMessages(prev=>[...prev,{role:"assistant",content:"أضف أسهمك في تبويب محفظتي أول وأحللها لك 👆"}]);
      return;
    }
    const details=calc.items.map(h=>`- ${h.name}: اشتريت بـ ${h.buyPrice} والآن ${h.currentPrice.toFixed(2)} | ${h.pnl>=0?"ربح":"خسارة"}: ${Math.abs(h.pnl).toFixed(0)} ريال (${h.pnlPct.toFixed(1)}%) | إشارة: ${h.signal?.label||"غير محدد"}`).join("\n");
    const msg=`حلل محفظتي الكاملة:\n${details}\n\nإجمالي: ${calc.totalPnl>=0?"ربح":"خسارة"} ${Math.abs(calc.totalPnl).toFixed(0)} ريال (${calc.totalPnlPct.toFixed(1)}%)\n\nأبي:\n1. تحليل كل سهم\n2. أيها أبيع وأيها أتمسك\n3. استراتيجية تعويض الخسارة خلال سنة مع سيولة محدودة`;
    await sendMessage(msg);
  };

  // ─── تحليل سهم واحد ─────────────────────────────────────────────────────────
  const analyzeStock = async (stock) => {
    setSelected(stock); setTab("chat");
    const holding=myStocks.find(h=>h.symbol===stock.symbol);
    let msg=`حلل سهم ${stock.name} (${stock.symbol})\nالسعر: ${stock.current} ر.س | التغير: ${stock.changePct}%\nRSI: ${stock.rsi} | MA7: ${stock.ma7} | MA20: ${stock.ma20}\nالإشارة: ${stock.signal.label}`;
    if(holding){
      const pnl=(stock.current-holding.buyPrice)*holding.qty;
      msg+=`\n\nعندي ${holding.qty} سهم اشتريتها بـ ${holding.buyPrice} ر.س\nالربح/الخسارة الحالية: ${pnl>=0?"+":""}${pnl.toFixed(0)} ريال`;
    }
    await sendMessage(msg);
  };


  // ─── إرسال رسالة ────────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const userText=text||chatInput.trim();
    if(!userText)return;
    setChatInput("");
    const calc=getPortfolioCalc();
    const portfolioContext=calc.items.length>0?`\n\nمحفظة المستخدم الحالية:\n${calc.items.map(h=>`${h.name}: ${h.qty} سهم بسعر شراء ${h.buyPrice} والآن ${h.currentPrice?.toFixed(2)||"?"} (${h.pnl>=0?"ربح":"خسارة"} ${Math.abs(h.pnl||0).toFixed(0)} ريال)`).join("\n")}\nإجمالي المحفظة: ${calc.totalPnl>=0?"ربح":"خسارة"} ${Math.abs(calc.totalPnl).toFixed(0)} ريال`:"";
    const newMessages=[...messages,{role:"user",content:userText}];
    setMessages(newMessages); setChatLoading(true);

    const systemPrompt=`${USER_PROFILE.aiPersona}${portfolioContext}\n\nحالة السوق: ${market.open?"مفتوح":"مغلق"}`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true","x-api-key":import.meta.env.VITE_ANTHROPIC_KEY||"","anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-sonnet-4-5",max_tokens:1000,system:systemPrompt,messages:newMessages.map(m=>({role:m.role,content:m.content}))}),
      });
      let data; const rawText=await res.text();
      try{data=JSON.parse(rawText);}catch{
        setMessages(prev=>[...prev,{role:"assistant",content:"⚠️ مشكلة في الاتصال، جرب مرة ثانية."}]);
        setChatLoading(false);return;
      }
      if(!res.ok){
        setMessages(prev=>[...prev,{role:"assistant",content:`⚠️ ${data?.error?.message||"خطأ في الاتصال، جرب مرة ثانية."}`}]);
      }else{
        const reply=data.content?.map(c=>c.text||"").join("")||"تعذّر الرد.";
        setMessages(prev=>[...prev,{role:"assistant",content:reply}]);
      }
    }catch(err){
      setMessages(prev=>[...prev,{role:"assistant",content:"⚠️ مشكلة في الاتصال، جرب مرة ثانية."}]);
    }
    setChatLoading(false);
  };

  const calc=getPortfolioCalc();
  const buyCount=stocks.filter(s=>s.signal?.label.includes("شراء")).length;
  const sellCount=stocks.filter(s=>s.signal?.label.includes("بيع")).length;

  const [splash, setSplash] = useState(true);
  useEffect(()=>{ setTimeout(()=>setSplash(false), 2000); },[]);

  if(splash) return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#1a2e6e 0%,#0d5abf 100%)",fontFamily:"'Cairo','Segoe UI',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet"/>
      <div style={{width:90,height:90,borderRadius:"50%",background:"linear-gradient(135deg,#1565c0,#0288d1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,marginBottom:20,boxShadow:"0 0 40px #1565c060"}}>🤖</div>
      <div style={{fontSize:24,fontWeight:900,color:"#0d6efd",marginBottom:8}}>مستشارك الاستثماري</div>
      <div style={{fontSize:13,color:"#7a8eaa",marginBottom:30}}>بوت تداول ذكي للسوق السعودي</div>
      <div style={{display:"flex",gap:6}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#1565c0",animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite`,opacity:0.7}}/>
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:0.4}50%{transform:scale(1.4);opacity:1}}`}</style>
    </div>
  );

  return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"#f5f0e8",color:"#1a2340",fontFamily:"'Cairo','Segoe UI',sans-serif",direction:"rtl"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{background:"#ffffff",borderBottom:"1px solid #1a2540",padding:"10px 14px",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#1565c0,#0288d1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🤖</div>
            <div>
              <div style={{fontSize:15,fontWeight:900,color:"#0d6efd"}}>مستشارك الاستثماري</div>
              <div style={{fontSize:10,color:"#7a8eaa",display:"flex",gap:5}}>
                <span style={{color:"#ffd740"}}>مبتدئ</span>·<span style={{color:"#ff7043"}}>مضاربة</span>·<span style={{color:"#66bb6a"}}>مخاطرة منخفضة</span>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <span style={{background:market.open?"#e8f5e9":"#ffebee",border:`1px solid ${market.open?"#66bb6a":"#ef9a9a"}`,borderRadius:5,padding:"2px 8px",color:market.open?"#2e7d32":"#c62828",fontSize:10,fontWeight:700}}>{market.open?"● مفتوح":"● مغلق"}</span>
            {apiOk!==null&&<span style={{background:apiOk?"#e3f2fd":"#fffde7",border:`1px solid ${apiOk?"#90caf9":"#fff176"}`,borderRadius:5,padding:"2px 8px",color:apiOk?"#1565c0":"#f9a825",fontSize:10}}>{apiOk?"📡 حقيقي":"📋 تاريخي"}</span>}
            <button onClick={buildStocks} disabled={fetching} style={{background:fetching?"#dde8f5":"#1565c0",border:"none",borderRadius:7,color:"#fff",padding:"6px 12px",cursor:fetching?"default":"pointer",fontSize:12,fontFamily:"Cairo",fontWeight:700}}>{fetching?"⏳":"🔄"}</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{background:"#ffffff",borderBottom:"1px solid #1a2540",padding:"0 14px",flexShrink:0}}>
        <div style={{display:"flex",gap:0}}>
          {[["stocks","📊 الأسهم"],["portfolio","💼 محفظتي"],["chat","💬 المستشار"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{background:"transparent",border:"none",borderBottom:tab===id?"2px solid #0d6efd":"2px solid transparent",color:tab===id?"#0d6efd":"#7a8eaa",padding:"9px 14px",cursor:"pointer",fontSize:12,fontFamily:"Cairo",fontWeight:tab===id?700:400}}>
              {label}
              {id==="portfolio"&&myStocks.length>0&&<span style={{background:"#1565c0",borderRadius:10,fontSize:9,padding:"1px 5px",marginRight:4,color:"#fff"}}>{myStocks.length}</span>}
              {id==="portfolio"&&calc.totalPnl<0&&myStocks.length>0&&<span style={{color:"#ff6b6b",fontSize:9,marginRight:3}}>▼</span>}
            </button>
          ))}
        </div>
      </div>

      {/* المحتوى */}
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>

        {/* ── تبويب الأسهم ─────────────────────────────────────────────── */}
        {tab==="stocks"&&(
          <div style={{flex:1,overflowY:"auto",padding:"10px 12px"}}>
            {!market.open&&<div style={{background:"#fff8e1",border:"1px solid #ffe082",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:11,color:"#f57f17"}}>🕐 السوق مغلق — الأسعار هي آخر إغلاق</div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
              {stocks.map(stock=>{
                const holding=myStocks.find(h=>h.symbol===stock.symbol);
                const pnl=holding?(stock.current-holding.buyPrice)*holding.qty:null;
                return(
                  <div key={stock.symbol} onClick={()=>analyzeStock(stock)} style={{background:"#fdfaf5",border:`1px solid ${selected?.symbol===stock.symbol?"#4fc3f7":"#1a2540"}`,borderRadius:12,padding:"11px 13px",cursor:"pointer"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div>
                        <div style={{fontWeight:700,fontSize:13}}>{stock.name}</div>
                        <div style={{fontSize:10,color:"#7a8eaa"}}>{stock.symbol} · {stock.sector}</div>
                      </div>
                      <div style={{background:stock.signal.bg,border:`1px solid ${stock.signal.color}50`,borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:700,color:stock.signal.color}}>{stock.signal.icon} {stock.signal.label}</div>
                    </div>
                    <MiniChart prices={stock.prices}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                      <div>
                        <div style={{fontSize:15,fontWeight:900}}>{stock.current} <span style={{fontSize:9,color:"#7a8eaa"}}>ر.س</span></div>
                        <div style={{fontSize:11,fontWeight:700,color:stock.change>=0?"#00e676":"#ff1744"}}>{stock.change>=0?"+":""}{stock.change} ({stock.changePct}%)</div>
                      </div>
                      <div style={{textAlign:"left"}}>
                        <div style={{fontSize:10,color:"#7a8eaa"}}>RSI: <span style={{fontWeight:700,color:stock.rsi<35?"#2e7d32":stock.rsi>65?"#c62828":"#f9a825"}}>{stock.rsi}</span></div>
                        {holding&&<div style={{fontSize:10,fontWeight:700,color:pnl>=0?"#00e676":"#ff6b6b"}}>{pnl>=0?"ربح+":"خسارة "}{Math.abs(pnl).toFixed(0)} ر.س</div>}
                      </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:7,borderTop:"1px solid #e8eef8",paddingTop:6,alignItems:"center"}}>
                      <span style={{fontSize:10,color:"#0d6efd"}}>اضغط للتحليل →</span>
                      <button onClick={e=>{e.stopPropagation();if(holding){setMyStocks(p=>p.filter(h=>h.symbol!==stock.symbol));}else{setFormData({symbol:stock.symbol,buyPrice:"",qty:""});setShowAddForm(true);setTab("portfolio");}}} style={{background:holding?"#ff174420":"transparent",border:`1px solid ${holding?"#ff1744":"#2d3a52"}`,borderRadius:4,color:holding?"#ff6b6b":"#546e7a",fontSize:10,padding:"2px 7px",cursor:"pointer",fontFamily:"Cairo"}}>
                        {holding?"✕ إزالة":"＋ محفظتي"}
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
          <div style={{flex:1,overflowY:"auto",padding:"10px 12px"}}>

            {/* ملخص المحفظة */}
            {myStocks.length>0&&(
              <div style={{background:"#fdfaf5",border:"1px solid #d8e2f5",borderRadius:12,padding:"14px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontWeight:900,fontSize:14,color:"#0d6efd"}}>💼 ملخص محفظتي</div>
                  <button onClick={analyzePortfolio} style={{background:"#1565c0",border:"none",borderRadius:8,color:"#fff",padding:"6px 14px",cursor:"pointer",fontSize:12,fontFamily:"Cairo",fontWeight:700}}>🤖 حلل كل شيء</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                  <div style={{background:"#f0ece2",borderRadius:8,padding:"8px",textAlign:"center"}}>
                    <div style={{fontSize:11,color:"#7a8eaa"}}>رأس المال</div>
                    <div style={{fontSize:14,fontWeight:900,color:"#1565c0"}}>{calc.totalCost.toFixed(0)}</div>
                    <div style={{fontSize:9,color:"#7a8eaa"}}>ريال</div>
                  </div>
                  <div style={{background:"#f0ece2",borderRadius:8,padding:"8px",textAlign:"center"}}>
                    <div style={{fontSize:11,color:"#7a8eaa"}}>القيمة الحالية</div>
                    <div style={{fontSize:14,fontWeight:900,color:"#1565c0"}}>{calc.totalNow.toFixed(0)}</div>
                    <div style={{fontSize:9,color:"#7a8eaa"}}>ريال</div>
                  </div>
                  <div style={{background:calc.totalPnl>=0?"#00e67610":"#ff174410",borderRadius:8,padding:"8px",textAlign:"center",border:`1px solid ${calc.totalPnl>=0?"#00e67640":"#ff174440"}`}}>
                    <div style={{fontSize:11,color:"#7a8eaa"}}>{calc.totalPnl>=0?"الربح":"الخسارة"}</div>
                    <div style={{fontSize:14,fontWeight:900,color:calc.totalPnl>=0?"#00e676":"#ff1744"}}>{calc.totalPnl>=0?"+":""}{calc.totalPnl.toFixed(0)}</div>
                    <div style={{fontSize:9,color:calc.totalPnl>=0?"#00e676":"#ff1744"}}>{calc.totalPnlPct.toFixed(1)}%</div>
                  </div>
                </div>

                {/* تفاصيل الأسهم */}
                {calc.items.map(h=>(
                  <div key={h.symbol} style={{background:"#f0ece2",borderRadius:8,padding:"10px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>{h.name}</div>
                      <div style={{fontSize:10,color:"#7a8eaa"}}>{h.qty} سهم · دخلت بـ {h.buyPrice} ر.س</div>
                      {h.signal&&<div style={{fontSize:10,color:h.signal.color,marginTop:2}}>{h.signal.icon} {h.signal.label}</div>}
                    </div>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontSize:13,fontWeight:900,color:"#1a2340"}}>{h.currentPrice?.toFixed(2)} ر.س</div>
                      <div style={{fontSize:12,fontWeight:700,color:h.pnl>=0?"#00e676":"#ff1744"}}>{h.pnl>=0?"+":""}{h.pnl.toFixed(0)} ر.س</div>
                      <div style={{fontSize:10,color:h.pnl>=0?"#00e676":"#ff6b6b"}}>{h.pnlPct.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* فورم إضافة سهم */}
            {showAddForm&&(
              <div style={{background:"#eef3ff",border:"1px solid #b8ccf0",borderRadius:12,padding:"14px",marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:13,color:"#0d6efd",marginBottom:10}}>إضافة سهم لمحفظتي</div>
                <select value={formData.symbol} onChange={e=>setFormData(p=>({...p,symbol:e.target.value}))} style={{width:"100%",background:"#f0ece2",border:"1px solid #b8ccf0",borderRadius:7,padding:"8px",color:"#1a2340",fontSize:12,fontFamily:"Cairo",marginBottom:8}}>
                  <option value="">اختر السهم</option>
                  {STOCKS_LIST.map(s=><option key={s.symbol} value={s.symbol}>{s.name} ({s.symbol})</option>)}
                </select>
                <input type="number" placeholder="سعر الشراء (ريال)" value={formData.buyPrice} onChange={e=>setFormData(p=>({...p,buyPrice:e.target.value}))} style={{width:"100%",background:"#f0ece2",border:"1px solid #b8ccf0",borderRadius:7,padding:"8px",color:"#1a2340",fontSize:12,fontFamily:"Cairo",marginBottom:8,outline:"none",boxSizing:"border-box"}}/>
                <input type="number" placeholder="عدد الأسهم" value={formData.qty} onChange={e=>setFormData(p=>({...p,qty:e.target.value}))} style={{width:"100%",background:"#f0ece2",border:"1px solid #b8ccf0",borderRadius:7,padding:"8px",color:"#1a2340",fontSize:12,fontFamily:"Cairo",marginBottom:10,outline:"none",boxSizing:"border-box"}}/>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={addToMyStocks} style={{flex:1,background:"#1565c0",border:"none",borderRadius:7,color:"#fff",padding:"9px",cursor:"pointer",fontSize:13,fontFamily:"Cairo",fontWeight:700}}>إضافة ✓</button>
                  <button onClick={()=>setShowAddForm(false)} style={{flex:1,background:"#dde8ff",border:"none",borderRadius:7,color:"#1565c0",padding:"9px",cursor:"pointer",fontSize:13,fontFamily:"Cairo"}}>إلغاء</button>
                </div>
              </div>
            )}

            <button onClick={()=>setShowAddForm(true)} style={{width:"100%",background:"#eef3ff",border:"2px dashed #b8ccf0",borderRadius:10,color:"#0d6efd",padding:"12px",cursor:"pointer",fontSize:13,fontFamily:"Cairo",fontWeight:700,marginBottom:8}}>
              ＋ أضف سهم لمحفظتي
            </button>

            {myStocks.length===0&&!showAddForm&&(
              <div style={{textAlign:"center",padding:"30px 0",color:"#7a8eaa"}}>
                <div style={{fontSize:32,marginBottom:10}}>💼</div>
                <div style={{fontSize:13}}>أضف أسهمك مع سعر الشراء</div>
                <div style={{fontSize:11,marginTop:4}}>والبوت يحسب ربحك وخسارتك ويعطيك توصية</div>
              </div>
            )}
          </div>
        )}

        {/* ── تبويب المستشار ───────────────────────────────────────────── */}
        {tab==="chat"&&(
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"7px 12px",borderBottom:"1px solid #1a2540",display:"flex",gap:6,flexWrap:"wrap",flexShrink:0,background:"#f0ece2"}}>
              {["عندي خسارة في سهم، أبيع أو أتمسك؟","أعطني استراتيجية تعويض الخسارة","ما معنى RSI؟","كيف أحدد وقف الخسارة؟","نصيحة لمبتدئ؟"].map(q=>(
                <button key={q} onClick={()=>sendMessage(q)} style={{background:"#eef3ff",border:"1px solid #b8ccf0",borderRadius:20,color:"#1565c0",fontSize:11,padding:"4px 10px",cursor:"pointer",fontFamily:"Cairo",whiteSpace:"nowrap"}}>{q}</button>
              ))}
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"12px 12px"}}>
              <div style={{maxWidth:720,margin:"0 auto"}}>
                {messages.map((m,i)=><ChatBubble key={i} msg={m}/>)}
                {chatLoading&&(
                  <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:"#1565c0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginLeft:8}}>🤖</div>
                    <div style={{background:"#e8f0fe",border:"1px solid #d0dcf5",borderRadius:"14px 14px 4px 14px",padding:"10px 16px",color:"#0d6efd",fontSize:13}}>يفكر... ⏳</div>
                  </div>
                )}
                <div ref={chatEndRef}/>
              </div>
            </div>
            <div style={{padding:"8px 12px",borderTop:"1px solid #1a2540",background:"#ffffff",flexShrink:0}}>
              <div style={{maxWidth:720,margin:"0 auto",display:"flex",gap:8}}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()} placeholder="اسأل مستشارك..." style={{flex:1,background:"#eef3ff",border:"1px solid #b8ccf0",borderRadius:10,padding:"9px 12px",color:"#1a2340",fontSize:13,fontFamily:"Cairo",outline:"none"}}/>
                <button onClick={()=>sendMessage()} disabled={chatLoading||!chatInput.trim()} style={{background:chatLoading||!chatInput.trim()?"#dde8f5":"#1565c0",border:"none",borderRadius:10,color:"#fff",padding:"9px 16px",cursor:chatLoading||!chatInput.trim()?"default":"pointer",fontSize:13,fontFamily:"Cairo",fontWeight:700}}>إرسال</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{background:"#fff8ee",borderTop:"1px solid #2a1e00",padding:"5px 12px",textAlign:"center",fontSize:10,color:"#a07800",flexShrink:0}}>
        ⚠️ للأغراض التعليمية فقط — لا تمثل نصيحة استثمارية مرخصة
      </div>
    </div>
  );
}
