import { useState, useEffect, useCallback, useRef } from "react";

// ─── بيانات المستخدم الشخصية ──────────────────────────────────────────────────
const USER_PROFILE = {
  level: "مبتدئ",
  goal: "أرباح سريعة (مضاربة)",
  risk: "منخفض",
  // تعليمات للذكاء الاصطناعي بناءً على الملف الشخصي
  aiPersona: `أنت مستشار استثماري شخصي باللهجة السعودية العامية، متخصص في سوق تداول السعودي.
صاحبك مبتدئ، يريد أرباحاً سريعة لكن مخاطرته منخفضة — تناقض واضح تنبّه له بلطف.

شخصيتك:
- صديق خبير يتكلم بعامية سعودية مريحة، مو رسمي زيادة
- صريح وما تجامل، حتى لو الخبر مو زين
- تعطي رأي واضح: "أنا رأيي تبيع / تمسك / تشتري" مو كلام مبهم
- تشرح المصطلحات الفنية بمثال بسيط بين قوسين

كيف تتعامل مع المواقف المختلفة:
- لو المستخدم يذكر خسارة: أول شي تعاطف، ثم حلل وضعه بهدوء، واعطه خيارات واضحة (بيع / تمسك / متوسط التكلفة)
- لو يسأل عن سهم محدد: حللها بناءً على المعلومات المتاحة واذكر المخاطر
- لو سؤال عام عن التداول: اشرح بمثال عملي قصير
- لو ذكر مبلغ محدد: تعامل معه بجدية واحسب له تقريباً

مبادئ ثابتة:
- دائماً اذكر: "هذا رأيي مو نصيحة مالية رسمية"
- لا تشجع المضاربة لمبتدئ عنده مخاطرة منخفضة
- اقترح دائماً بديل أكثر أمان
- ابدأ الرد بـ "نصيحتي لك:" أو "صراحة:" حسب السياق`
};

// ─── الأسهم ───────────────────────────────────────────────────────────────────
const STOCKS_LIST = [
  { symbol: "2222", name: "أرامكو السعودية", sector: "طاقة" },
  { symbol: "1180", name: "الأهلي السعودي",  sector: "بنوك" },
  { symbol: "1120", name: "الراجحي",          sector: "بنوك" },
  { symbol: "2010", name: "سابك",             sector: "بتروكيماويات" },
  { symbol: "7010", name: "الاتصالات السعودية",sector: "اتصالات" },
  { symbol: "2380", name: "پترو رابغ",        sector: "بتروكيماويات" },
  { symbol: "4200", name: "مجموعة تداول",     sector: "مالية" },
  { symbol: "1211", name: "معادن",           sector: "تعدين" },
  { symbol: "1150", name: "الإنماء",               sector: "بنوك" },
  { symbol: "1302", name: "المتقدمة",              sector: "تقنية" },
  { symbol: "2010", name: "سابك",                  sector: "بتروكيماويات" },
  { symbol: "2170", name: "الصناعات الكهربائية",   sector: "صناعة" },
  { symbol: "2243", name: "لوبريف",                sector: "صناعة" },
  { symbol: "4003", name: "بن داوود",              sector: "تجزئة" },
  { symbol: "4190", name: "جرير",                  sector: "تجزئة" },
  { symbol: "4321", name: "سينومي سنترز",          sector: "تجزئة" },
  { symbol: "4322", name: "سينومي ريتيل",          sector: "تجزئة" },
  { symbol: "4310", name: "سيرا",                  sector: "طيران" },
];

// ─── مؤشرات فنية ─────────────────────────────────────────────────────────────
function calcRSI(prices) {
  if (prices.length < 14) return 50;
  let gains = 0, losses = 0;
  for (let i = prices.length - 14; i < prices.length - 1; i++) {
    const d = prices[i + 1] - prices[i];
    if (d > 0) gains += d; else losses += Math.abs(d);
  }
  return parseFloat((100 - 100 / (1 + gains / (losses || 1))).toFixed(1));
}
function calcMA(prices, n) {
  const s = prices.slice(-n);
  return parseFloat((s.reduce((a,b)=>a+b,0)/s.length).toFixed(2));
}
function calcMACD(prices) {
  if (prices.length < 26) return 0;
  const ema = (arr, n) => arr.slice(-n).reduce((a,b)=>a+b,0)/n;
  return parseFloat((ema(prices,12)-ema(prices,26)).toFixed(3));
}
function getSignal(prices) {
  const cur=prices[prices.length-1], rsi=calcRSI(prices), macd=calcMACD(prices);
  const ma7=calcMA(prices,Math.min(7,prices.length)), ma20=calcMA(prices,Math.min(20,prices.length));
  let score=0;
  if(rsi<35) score+=2; else if(rsi<45) score+=1; else if(rsi>65) score-=2; else if(rsi>55) score-=1;
  if(macd>0) score+=1; else score-=1;
  if(cur>ma7&&ma7>ma20) score+=2; else if(cur<ma7&&ma7<ma20) score-=2;
  if(score>=3)  return{label:"شراء قوي",color:"#00e676",bg:"#00e67622",icon:"▲▲",risk:"عالي"};
  if(score>=1)  return{label:"شراء",    color:"#69f0ae",bg:"#69f0ae18",icon:"▲", risk:"متوسط"};
  if(score<=-3) return{label:"بيع قوي", color:"#ff1744",bg:"#ff174422",icon:"▼▼",risk:"عالي"};
  if(score<=-1) return{label:"بيع",     color:"#ff6b6b",bg:"#ff6b6b18",icon:"▼", risk:"متوسط"};
  return             {label:"انتظار",  color:"#ffd740",bg:"#ffd74018",icon:"◆", risk:"منخفض"};
}

// ─── رسم بياني ───────────────────────────────────────────────────────────────
function MiniChart({prices}){
  if(!prices||prices.length<2) return null;
  const W=110,H=38,mn=Math.min(...prices),mx=Math.max(...prices),rng=mx-mn||1;
  const pts=prices.map((p,i)=>`${(i/(prices.length-1))*W},${H-((p-mn)/rng)*(H-4)-2}`).join(" ");
  const isUp=prices[prices.length-1]>=prices[0];
  return(<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:38}}>
    <polyline points={pts} fill="none" stroke={isUp?"#00e676":"#ff1744"} strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>);
}

// ─── حالة السوق ───────────────────────────────────────────────────────────────
function marketStatus(){
  const now=new Date();
  const riyadh=new Date(now.toLocaleString("en-US",{timeZone:"Asia/Riyadh"}));
  const day=riyadh.getDay(),hour=riyadh.getHours()+riyadh.getMinutes()/60;
  return{open:day>=0&&day<=4&&hour>=10&&hour<15};
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function fetchRealPrice(symbol){
  try{
    const res=await fetch(`https://app.sahmk.sa/api/v1/quote/${symbol}/`,{headers:{"Accept":"application/json"}});
    if(!res.ok) return null;
    const d=await res.json();
    return{price:parseFloat(d.price),change:parseFloat(d.change),changePct:parseFloat(d.change_percent),volume:parseInt(d.volume)||0};
  }catch{return null;}
}

// ─── بيانات ثابتة ─────────────────────────────────────────────────────────────
const SEED={
  "2222":[25.10,25.20,25.05,24.90,25.00,24.80,24.95,25.30,25.20,25.10,25.40,25.25,25.15,25.00,25.20,25.35,25.28,25.10,25.22,25.18,25.30,25.26,25.14,25.00,24.95,25.05,25.20,25.18,25.10,25.26],
  "1180":[41.5,41.8,42.0,41.9,42.2,42.1,42.4,42.3,42.0,41.8,42.1,42.5,42.3,42.0,42.2,42.6,42.4,42.1,42.3,42.5,42.2,42.0,42.4,42.3,42.1,42.2,42.5,42.3,42.1,42.3],
  "1120":[87.5,88.0,87.8,88.2,88.5,88.3,88.0,88.4,88.6,88.2,88.1,88.5,88.7,88.3,88.0,88.4,88.6,88.2,88.3,88.5,88.1,88.0,88.4,88.2,88.3,88.5,88.2,88.1,88.3,88.4],
  "2010":[94.0,94.5,95.0,94.8,95.2,95.5,95.0,94.8,95.2,95.4,95.1,94.9,95.3,95.5,95.2,94.8,95.0,95.4,95.2,95.0,95.3,95.1,94.9,95.2,95.4,95.1,95.0,95.2,95.3,95.2],
  "7010":[103,104,104.5,104,105,104.8,104.2,104.6,105,104.5,104.2,104.8,105.2,104.8,104.4,104.6,105,104.8,104.5,104.7,104.9,104.6,104.4,104.8,105,104.7,104.5,104.7,104.8,104.6],
  "2380":[17.2,17.4,17.6,17.5,17.8,17.6,17.4,17.8,18.0,17.8,17.5,17.8,18.1,17.9,17.6,17.8,18.0,17.8,17.6,17.8,18.0,17.8,17.5,17.8,18.0,17.8,17.6,17.7,17.8,17.8],
  "4200":[21.5,21.8,22.0,21.9,22.1,22.0,21.8,22.1,22.3,22.1,22.0,22.2,22.4,22.2,22.0,22.1,22.3,22.1,22.0,22.2,22.3,22.1,22.0,22.1,22.2,22.1,22.0,22.1,22.2,22.1],
  "1211":[57.5,58.0,58.5,58.0,58.7,58.5,58.2,58.7,59.0,58.7,58.4,58.8,59.1,58.8,58.5,58.7,59.0,58.8,58.5,58.8,59.0,58.8,58.4,58.7,59.0,58.8,58.5,58.7,58.8,58.7],
};

// ─── مكونات المحادثة ──────────────────────────────────────────────────────────
function ChatBubble({msg}){
  const isUser=msg.role==="user";
  return(
    <div style={{display:"flex",justifyContent:isUser?"flex-start":"flex-end",marginBottom:10}}>
      {!isUser&&<div style={{width:28,height:28,borderRadius:"50%",background:"#1565c0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginLeft:8,flexShrink:0}}>🤖</div>}
      <div style={{
        maxWidth:"82%",
        background:isUser?"#0d1b3e":"#131e38",
        border:`1px solid ${isUser?"#1e3a6e":"#1e2d50"}`,
        borderRadius:isUser?"14px 14px 14px 4px":"14px 14px 4px 14px",
        padding:"10px 14px",fontSize:13,lineHeight:1.8,
        color:isUser?"#90caf9":"#dde3f0",
        whiteSpace:"pre-wrap",
      }}>{msg.content}</div>
      {isUser&&<div style={{width:28,height:28,borderRadius:"50%",background:"#1a2540",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginRight:8,flexShrink:0}}>👤</div>}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function AdvisorBot() {
  const [tab,       setTab]       = useState("stocks"); // stocks | chat
  const [stocks,    setStocks]    = useState([]);
  const [fetching,  setFetching]  = useState(false);
  const [lastUpdate,setLastUpdate]= useState(null);
  const [market,    setMarket]    = useState(marketStatus());
  const [apiOk,     setApiOk]     = useState(null);
  const [portfolio, setPortfolio] = useState({});
  const [selected,  setSelected]  = useState(null);

  // Chat
  const [messages,  setMessages]  = useState([
    {role:"assistant",content:`أهلاً! أنا مستشارك الاستثماري الشخصي 🤖\n\nشفت ملفك: مبتدئ، تبي أرباح سريعة، لكن مخاطرتك منخفضة.\nأكون صريح معك — هذا المزيج صعب، لكن نشتغل عليه بذكاء.\n\nتقدر تسألني أي شي، مثلاً:\n• "عندي خسارة في سهم كذا، أبيع أو أتمسك؟"\n• "اشتريت بسعر كذا وهو الآن أقل، وش أسوي؟"\n• "أنصحني وين أحط ١٠٬٠٠٠ ريال؟"\n\nأو اضغط على أي سهم من تبويب الأسهم وأحللها لك! 👇`}
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading,setChatLoading]=useState(false);
  const chatEndRef = useRef(null);

  // ─── جلب الأسهم ────────────────────────────────────────────────────────────
  const buildStocks = useCallback(async () => {
    setFetching(true);
    setMarket(marketStatus());
    const results = await Promise.all(STOCKS_LIST.map(async s=>{
      const seed=[...( SEED[s.symbol]||[])];
      let prices=seed, realData=await fetchRealPrice(s.symbol);
      if(realData&&!isNaN(realData.price)){setApiOk(true);prices[prices.length-1]=realData.price;}
      else if(apiOk!==true) setApiOk(false);
      const cur=prices[prices.length-1], prev=prices[prices.length-2];
      return{...s,prices,current:cur,
        change:realData?realData.change:parseFloat((cur-prev).toFixed(2)),
        changePct:realData?realData.changePct:parseFloat(((cur-prev)/prev*100).toFixed(2)),
        volume:realData?.volume||0, isReal:!!realData,
        rsi:calcRSI(prices),macd:calcMACD(prices),
        ma7:calcMA(prices,7),ma20:calcMA(prices,20),signal:getSignal(prices)};
    }));
    setStocks(results); setLastUpdate(new Date()); setFetching(false);
  },[apiOk]);

  useEffect(()=>{buildStocks();},[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  // ─── تحليل سهم → يفتح المحادثة ──────────────────────────────────────────
  const analyzeStock = async (stock) => {
    setSelected(stock);
    setTab("chat");
    const userMsg = `حلل لي سهم ${stock.name} (${stock.symbol})\nالسعر: ${stock.current} ر.س | التغير: ${stock.changePct}%\nRSI: ${stock.rsi} | MACD: ${stock.macd} | MA7: ${stock.ma7} | MA20: ${stock.ma20}\nالإشارة: ${stock.signal.label}`;
    await sendMessage(userMsg);
  };

  // ─── رد احتياطي لو فشل الـ API ─────────────────────────────────────────────
  const fallbackReply = (text) => {
    const t = text.toLowerCase();
    if(t.includes("خسار") && (t.includes("متقدم") || t.includes("1302"))){
      return `صراحة معك:

سهم المتقدمة (1302) تعرّض لضغط خلال الفترة الأخيرة.

عندك ٣ خيارات:

1️⃣ البيع الآن
تتحمل الخسارة وتوقف النزيف. مناسب لو تحتاج السيولة أو ما تقدر تتحمل خسارة أكبر.

2️⃣ الاحتفاظ والانتظار
لو الشركة أساسياتها قوية، الصبر قد يُعيد جزء من الخسارة. لكن مو ضمان.

3️⃣ التوسيط (Averaging Down)
تشتري كميات إضافية بسعر أقل لتخفيض متوسط سعر الشراء. ⚠️ خطر: لو السهم استمر بالنزول خسارتك تكبر.

🔴 رأيي لك كمبتدئ بمخاطرة منخفضة:
الخيار الأول أو الثاني أفضل من الثالث. ٦٠٠٠ ريال خسارة مؤلمة لكن أفضل من ١٢٠٠٠.

هذا رأيي مو نصيحة مالية رسمية.`;
    }
    if(t.includes("خسار")){
      return `صراحة معك:

الخسارة جزء طبيعي من التداول، حتى المحترفين يخسرون.

السؤال الأهم: كم نسبة الخسارة من رأس مالك الكلي؟

• لو أقل من ١٠٪: ممكن تتمسك وتنتظر
• لو بين ١٠-٢٠٪: فكر جدياً بالبيع
• لو أكثر من ٢٠٪: الأفضل تقطع الخسارة عادةً

أخبرني اسم السهم والسعر اللي اشتريت فيه وأعطيك نصيحة أدق. 🎯`;
    }
    if(t.includes("أرامكو") || t.includes("2222")){
      return `أرامكو (2222) هي من أكثر الأسهم أماناً في تداول.

✅ نقاط القوة:
• دعم حكومي قوي
• توزيع أرباح منتظم
• حجم تداول عالي = سيولة ممتازة

⚠️ نقاط الضعف:
• سعرها مرتبط بأسعار النفط
• تحرك بطيء، مو مناسبة للمضاربة السريعة

🎯 لملفك كمبتدئ بمخاطرة منخفضة: أرامكو خيار معقول للاحتفاظ طويل المدى.

هذا رأيي مو نصيحة مالية رسمية.`;
    }
    if(t.includes("rsi")){
      return `RSI (مؤشر القوة النسبية) بالبساطة:

تخيله كـ"مقياس إجهاد السهم" من 0 إلى 100:

📉 أقل من 30 = السهم "متعب من النزول" → فرصة شراء محتملة
📈 أكثر من 70 = السهم "متعب من الصعود" → قد ينزل قريباً
⚖️ بين 30-70 = منطقة طبيعية

مثال: لو RSI = 25، يعني السهم نزل كثير وقد يرتد لفوق قريباً.`;
    }
    if(t.includes("وقف الخسارة") || t.includes("stop loss")){
      return `وقف الخسارة (Stop Loss) هو أمر تضعه مسبقاً يبيع السهم تلقائياً لو نزل لسعر معين.

مثال بسيط:
اشتريت سهم بـ 100 ريال
وضعت وقف خسارة عند 90 ريال
→ لو السهم نزل لـ 90، يُباع تلقائياً وتخسر 10٪ بس بدل ما تخسر أكثر

📏 القاعدة الشائعة للمبتدئين:
ضع وقف الخسارة عند 5-10٪ تحت سعر الشراء.

⚠️ مهم: ما كل منصات التداول السعودية تدعم هذا الأمر تلقائياً.`;
    }
    return null;
  };

  // ─── إرسال رسالة للمستشار ──────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const userText = text || chatInput.trim();
    if (!userText) return;
    setChatInput("");
    const newMessages = [...messages, {role:"user",content:userText}];
    setMessages(newMessages);
    setChatLoading(true);

    const systemPrompt = `${USER_PROFILE.aiPersona}

ملف المستخدم:
- الخبرة: ${USER_PROFILE.level}
- الهدف: ${USER_PROFILE.goal}
- تحمل المخاطرة: ${USER_PROFILE.risk}
- حالة السوق: ${market.open?"مفتوح":"مغلق (إجازة)"}
${portfolio&&Object.keys(portfolio).filter(k=>portfolio[k]).length>0?`- محفظته: ${Object.keys(portfolio).filter(k=>portfolio[k]).join(", ")}`:""}

قواعد الرد:
1. الأسلوب بسيط وودي، كأنك تشرح لصديق
2. شرح أي مصطلح فني بين قوسين
3. دائماً ذكر مستوى الخطر بوضوح
4. إذا التوصية مضاربة — نبه ووفر بديل أكثر أمان
5. الردود مختصرة ومنظمة`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "anthropic-dangerous-direct-browser-access":"true",
        },
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:systemPrompt,
          messages:newMessages.map(m=>({role:m.role,content:m.content})),
        }),
      });
      let data;
      const rawText = await res.text();
      try { data = JSON.parse(rawText); }
      catch {
        const fb = fallbackReply(userText);
        setMessages(prev=>[...prev,{role:"assistant",content: fb || "⚠️ خطأ غير متوقع. جرب مرة ثانية."}]);
        setChatLoading(false); return;
      }
      if(!res.ok){
        const fb = fallbackReply(userText);
        const errMsg = fb || data?.error?.message || `خطأ ${res.status}`;
        setMessages(prev=>[...prev,{role:"assistant",content:`${fb ? "" : "⚠️ "}${errMsg}`}]);
      } else {
        const reply=data.content?.map(c=>c.text||"").join("")||"تعذّر الرد.";
        setMessages(prev=>[...prev,{role:"assistant",content:reply}]);
      }
    }catch(err){
      const fb = fallbackReply(userText);
      setMessages(prev=>[...prev,{role:"assistant",content: fb || `⚠️ مشكلة اتصال: ${err.message}`}]);
    }
    setChatLoading(false);
  };

  const buyCount=stocks.filter(s=>s.signal.label.includes("شراء")).length;
  const sellCount=stocks.filter(s=>s.signal.label.includes("بيع")).length;

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"#080c18",color:"#dde3f0",fontFamily:"'Cairo','Segoe UI',sans-serif",direction:"rtl"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet"/>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{background:"#0c1428",borderBottom:"1px solid #1a2540",padding:"12px 16px",flexShrink:0}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#1565c0,#0288d1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🤖</div>
            <div>
              <div style={{fontSize:16,fontWeight:900,color:"#4fc3f7"}}>مستشارك الاستثماري</div>
              <div style={{fontSize:10,color:"#546e7a",display:"flex",gap:6}}>
                <span style={{color:"#ffd740"}}>مبتدئ</span>·
                <span style={{color:"#ff7043"}}>مضاربة</span>·
                <span style={{color:"#66bb6a"}}>مخاطرة منخفضة</span>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{background:market.open?"#00e67618":"#ff174418",border:`1px solid ${market.open?"#00e676":"#ff1744"}`,borderRadius:5,padding:"2px 9px",color:market.open?"#00e676":"#ff6b6b",fontSize:11,fontWeight:700}}>
              {market.open?"● مفتوح":"● مغلق"}
            </span>
            {apiOk!==null&&<span style={{background:apiOk?"#4fc3f715":"#ffd74015",border:`1px solid ${apiOk?"#4fc3f740":"#ffd74040"}`,borderRadius:5,padding:"2px 9px",color:apiOk?"#4fc3f7":"#ffd740",fontSize:10}}>
              {apiOk?"📡 حقيقي":"📋 تاريخي"}
            </span>}
            <button onClick={buildStocks} disabled={fetching} style={{background:fetching?"#1a2540":"#1565c0",border:"none",borderRadius:7,color:"#fff",padding:"6px 14px",cursor:fetching?"default":"pointer",fontSize:12,fontFamily:"Cairo",fontWeight:700}}>
              {fetching?"⏳":"🔄"} تحديث
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div style={{background:"#0c1428",borderBottom:"1px solid #1a2540",padding:"0 16px",flexShrink:0}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",gap:0}}>
          {[["stocks","📊 الأسهم"],["chat","💬 المستشار"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{
              background:"transparent",border:"none",borderBottom:tab===id?"2px solid #4fc3f7":"2px solid transparent",
              color:tab===id?"#4fc3f7":"#546e7a",padding:"10px 18px",cursor:"pointer",
              fontSize:13,fontFamily:"Cairo",fontWeight:tab===id?700:400,transition:"all .15s",
            }}>{label}{id==="stocks"&&tab!=="stocks"&&(buyCount>0||sellCount>0)&&<span style={{background:"#ff1744",borderRadius:10,fontSize:9,padding:"1px 5px",marginRight:5,color:"#fff"}}>{buyCount+sellCount}</span>}</button>
          ))}
        </div>
      </div>

      {/* ── المحتوى ─────────────────────────────────────────────────────── */}
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>

        {/* تبويب الأسهم */}
        {tab==="stocks"&&(
          <div style={{flex:1,overflowY:"auto",padding:"12px 14px"}}>
            <div style={{maxWidth:900,margin:"0 auto"}}>
              {!market.open&&<div style={{background:"#1a1206",border:"1px solid #4a3600",borderRadius:9,padding:"9px 14px",marginBottom:11,fontSize:12,color:"#ffb300"}}>
                🕐 السوق مغلق — الأسعار هي آخر إغلاق، التوصيات ثابتة وهذا طبيعي.
              </div>}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:10}}>
                {stocks.map(stock=>(
                  <div key={stock.symbol} onClick={()=>analyzeStock(stock)} style={{
                    background:"#0d1422",border:`1px solid ${selected?.symbol===stock.symbol?"#4fc3f7":"#1a2540"}`,
                    borderRadius:13,padding:"12px 14px",cursor:"pointer",transition:"border-color .15s",
                  }}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div>
                        <div style={{fontWeight:700,fontSize:13}}>{stock.name}</div>
                        <div style={{fontSize:10,color:"#546e7a"}}>{stock.symbol} · {stock.sector}</div>
                      </div>
                      <div style={{background:stock.signal.bg,border:`1px solid ${stock.signal.color}50`,borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:700,color:stock.signal.color}}>
                        {stock.signal.icon} {stock.signal.label}
                      </div>
                    </div>
                    <MiniChart prices={stock.prices}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                      <div>
                        <div style={{fontSize:16,fontWeight:900}}>{stock.current} <span style={{fontSize:9,color:"#546e7a"}}>ر.س</span></div>
                        <div style={{fontSize:11,fontWeight:700,color:stock.change>=0?"#00e676":"#ff1744"}}>{stock.change>=0?"+":""}{stock.change} ({stock.changePct}%)</div>
                      </div>
                      <div style={{textAlign:"left"}}>
                        <div style={{fontSize:10,color:"#546e7a"}}>RSI: <span style={{fontWeight:700,color:stock.rsi<35?"#00e676":stock.rsi>65?"#ff1744":"#ffd740"}}>{stock.rsi}</span></div>
                        <div style={{fontSize:10,color:"#546e7a"}}>MA7: <b style={{color:"#90caf9"}}>{stock.ma7}</b></div>
                      </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:7,borderTop:"1px solid #1a2540",paddingTop:6,alignItems:"center"}}>
                      <span style={{fontSize:10,color:"#4fc3f7",fontWeight:600}}>اضغط للتحليل المفصل →</span>
                      <button onClick={e=>{e.stopPropagation();setPortfolio(p=>({...p,[stock.symbol]:!p[stock.symbol]}));}} style={{
                        background:portfolio[stock.symbol]?"#1565c030":"transparent",
                        border:`1px solid ${portfolio[stock.symbol]?"#1565c0":"#2d3a52"}`,
                        borderRadius:4,color:portfolio[stock.symbol]?"#4fc3f7":"#546e7a",
                        fontSize:10,padding:"2px 7px",cursor:"pointer",fontFamily:"Cairo",
                      }}>{portfolio[stock.symbol]?"★ محفظتي":"☆ أضف"}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* تبويب المستشار */}
        {tab==="chat"&&(
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            {/* أسئلة سريعة */}
            <div style={{padding:"8px 14px",borderBottom:"1px solid #1a2540",display:"flex",gap:6,flexWrap:"wrap",flexShrink:0,background:"#0a0f1e"}}>
              {["عندي خسارة في سهم، أبيع أو أتمسك؟","ما أفضل سهم الآن؟","كيف أحدد وقف الخسارة؟","ما معنى RSI؟","نصيحة لمبتدئ عنده ١٠٠٠٠ ريال؟"].map(q=>(
                <button key={q} onClick={()=>sendMessage(q)} style={{
                  background:"#0d1b3e",border:"1px solid #1e3a6e",borderRadius:20,
                  color:"#90caf9",fontSize:11,padding:"4px 11px",cursor:"pointer",fontFamily:"Cairo",
                  whiteSpace:"nowrap",
                }}>{q}</button>
              ))}
            </div>
            {/* الرسائل */}
            <div style={{flex:1,overflowY:"auto",padding:"14px 14px"}}>
              <div style={{maxWidth:720,margin:"0 auto"}}>
                {messages.map((m,i)=><ChatBubble key={i} msg={m}/>)}
                {chatLoading&&(
                  <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:"#1565c0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginLeft:8}}>🤖</div>
                    <div style={{background:"#131e38",border:"1px solid #1e2d50",borderRadius:"14px 14px 4px 14px",padding:"10px 16px",color:"#4fc3f7",fontSize:13}}>
                      يفكر... ⏳
                    </div>
                  </div>
                )}
                <div ref={chatEndRef}/>
              </div>
            </div>
            {/* إدخال */}
            <div style={{padding:"10px 14px",borderTop:"1px solid #1a2540",background:"#0c1428",flexShrink:0}}>
              <div style={{maxWidth:720,margin:"0 auto",display:"flex",gap:8}}>
                <input
                  value={chatInput}
                  onChange={e=>setChatInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()}
                  placeholder="اسأل مستشارك... (مثل: هل الآن وقت شراء أرامكو؟)"
                  style={{flex:1,background:"#0d1b3e",border:"1px solid #1e3a6e",borderRadius:10,padding:"10px 14px",color:"#dde3f0",fontSize:13,fontFamily:"Cairo",outline:"none"}}
                />
                <button onClick={()=>sendMessage()} disabled={chatLoading||!chatInput.trim()} style={{
                  background:chatLoading||!chatInput.trim()?"#1a2540":"#1565c0",
                  border:"none",borderRadius:10,color:"#fff",padding:"10px 18px",
                  cursor:chatLoading||!chatInput.trim()?"default":"pointer",
                  fontSize:13,fontFamily:"Cairo",fontWeight:700,
                }}>إرسال</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* تنبيه */}
      <div style={{background:"#0d0a05",borderTop:"1px solid #2a1e00",padding:"6px 14px",textAlign:"center",fontSize:10,color:"#5a4500",flexShrink:0}}>
        ⚠️ للأغراض التعليمية فقط — لا تمثل نصيحة استثمارية مرخصة
      </div>
    </div>
  );
}
