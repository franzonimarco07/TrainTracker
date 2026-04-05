import { useState, useEffect, useCallback, useRef } from "react";

const CLAUDE_MODEL = "claude-sonnet-4-20250514";

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Ico = ({ d, s=16, stroke="currentColor", fill="none", sw=1.5 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:"block"}}>
    {Array.isArray(d)?d.map((p,i)=><path key={i} d={p}/>):<path d={d}/>}
  </svg>
);
const IcoTrain    = ({s=18}) => <Ico s={s} d={["M9 3h6l1 8H8L9 3z","M8 11v5a2 2 0 0 0 4 0v0a2 2 0 0 0 4 0v-5","M6 21h12","M9 21v-2","M15 21v-2","M12 3v8"]}/>;
const IcoSearch   = ({s=15}) => <Ico s={s} d={["M21 21l-4.35-4.35","M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"]}/>;
const IcoSwap     = ({s=15}) => <Ico s={s} d={["M7 16V4m0 0L3 8m4-4 4 4","M17 8v12m0 0 4-4m-4 4-4-4"]}/>;
const IcoFilter   = ({s=14}) => <Ico s={s} d="M3 6h18M7 12h10M11 18h2"/>;
const IcoWifi     = ({s=13}) => <Ico s={s} d={["M5 12.55a11 11 0 0 1 14.08 0","M1.42 9a16 16 0 0 1 21.16 0","M8.53 16.11a6 6 0 1 6.95 0","M12 20h.01"]}/>;
const IcoOk       = ({s=13}) => <Ico s={s} d="M20 6L9 17l-5-5" sw={2}/>;
const IcoWarn     = ({s=13}) => <Ico s={s} d={["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"]}/>;
const IcoPin      = ({s=14}) => <Ico s={s} d={["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z","M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4"]}/>;
const IcoWalk     = ({s=14}) => <Ico s={s} d={["M13 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z","M7 21l3-7 2 2 2-4 4 9","M5 13l2-4 4 2 2-2"]}/>;
const IcoBus      = ({s=14}) => <Ico s={s} d={["M8 6v6","M16 6v6","M2 12h19.6","M18 18h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2","M8 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0","M14 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0"]}/>;
const IcoEuro     = ({s=14}) => <Ico s={s} d={["M4 9h1l1 1H4m4-1V7a3 3 0 0 1 6 0v2","M6 13h12","M6 17h12"]}/>;
const IcoDelay    = ({s=14}) => <Ico s={s} d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6v6l4 2","M16 2l4 2-4 2"]}/>;
const IcoFood     = ({s=13}) => <Ico s={s} d={["M18 8h1a4 4 0 0 1 0 8h-1","M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z","M6 1v3","M10 1v3","M14 1v3"]}/>;
const IcoLeaf     = ({s=13}) => <Ico s={s} d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1C7 19 7 19 9 19h5c3 0 8-3 8-9-3 0-5 0-5-2z"/>;
const IcoX        = ({s=14}) => <Ico s={s} d="M18 6L6 18M6 6l12 12"/>;
const IcoBack     = ({s=16}) => <Ico s={s} d="M19 12H5M12 5l-7 7 7 7"/>;
const IcoBookmark = ({s=15,fill="none"}) => <Ico s={s} fill={fill} d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>;
const IcoSeat     = ({s=13}) => <Ico s={s} d={["M20.38 3.46L16 2a4 4 0 0 1 3.46 3.46","M4 6V2","M4 6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2","M4 6H2","M14 6h2","M8 22v-4","M8 22h3","M16 22v-4","M16 22h-3","M8 18a4 4 0 0 1 8 0"]}/>;
const IcoTrash    = ({s=13}) => <Ico s={s} d={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"]}/>;
const IcoChevR    = ({s=12}) => <Ico s={s} d="M9 18l6-6-6-6"/>;
const IcoClock    = ({s=14}) => <Ico s={s} d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6v6l4 2"]}/>;
const IcoExtLink  = ({s=13}) => <Ico s={s} d={["M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6","M15 3h6v6","M10 14L21 3"]}/>;
const IcoHistory  = ({s=13}) => <Ico s={s} d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6v6l3 3"]}/>;

// ─── DATA ────────────────────────────────────────────────────────────────────
const CITIES = ["Roma","Milano","Napoli","Torino","Firenze","Bologna","Venezia","Bari",
  "Palermo","Genova","Verona","Padova","Trieste","Brescia","Ancona","Catania",
  "Messina","Salerno","Pisa","Perugia","Trento","Bolzano","Cagliari","Pescara",
  "Modena","Parma","Reggio Emilia","Reggio Calabria"];

const TTYPES = [
  {id:"all",label:"Tutti"},{id:"FR",label:"Frecciarossa"},{id:"FA",label:"Frecciargento"},
  {id:"FB",label:"Frecciabianca"},{id:"IC",label:"Intercity"},{id:"RE",label:"Regionale"},{id:"RV",label:"Reg. Veloce"},
];

const META = {
  FR:{color:"#C0392B",label:"Frecciarossa",  bg:"#fdf0ef",gradient:"linear-gradient(135deg,#C0392B,#e74c3c)"},
  FA:{color:"#7D3C98",label:"Frecciargento", bg:"#f5eefb",gradient:"linear-gradient(135deg,#7D3C98,#9b59b6)"},
  FB:{color:"#1A6BA0",label:"Frecciabianca", bg:"#eaf3fb",gradient:"linear-gradient(135deg,#1A6BA0,#2980b9)"},
  IC:{color:"#009246",label:"Intercity",     bg:"#e6f4ec",gradient:"linear-gradient(135deg,#007A3B,#009246)"},
  RE:{color:"#BA4A00",label:"Regionale",     bg:"#fdf2e9",gradient:"linear-gradient(135deg,#BA4A00,#e67e22)"},
  RV:{color:"#117A65",label:"Reg. Veloce",   bg:"#e8f8f5",gradient:"linear-gradient(135deg,#117A65,#16a085)"},
};

const CITY_INFO = {
  Roma:    {center:"Termini → Centro",walk:15,bus:8,taxi:12,metro:"Metro A/B",landmark:"Colosseo, Trastevere"},
  Milano:  {center:"Centrale → Duomo",walk:20,bus:10,taxi:15,metro:"Metro M2/M3",landmark:"Duomo, Navigli"},
  Napoli:  {center:"Centrale → Spaccanapoli",walk:12,bus:7,taxi:10,metro:"Metro L1/L2",landmark:"Piazza del Plebiscito"},
  Firenze: {center:"S.M.N. → Duomo",walk:10,bus:0,taxi:8,metro:"No metro",landmark:"Duomo, Uffizi"},
  Bologna: {center:"Centrale → Piazza Maggiore",walk:18,bus:12,taxi:15,metro:"Bus veloce",landmark:"Piazza Maggiore"},
  Venezia: {center:"S.Lucia → Rialto",walk:25,bus:0,taxi:0,metro:"Vaporetto",landmark:"Rialto, San Marco"},
  Torino:  {center:"Porta Nuova → Piazza Castello",walk:12,bus:8,taxi:10,metro:"Metro M1",landmark:"Mole Antonelliana"},
  Verona:  {center:"P.Nuova → Arena",walk:18,bus:10,taxi:12,metro:"No metro",landmark:"Arena di Verona"},
  Padova:  {center:"Centrale → Piazza Erbe",walk:15,bus:8,taxi:10,metro:"Tram",landmark:"Basilica S.Antonio"},
  Bari:    {center:"Centrale → Città Vecchia",walk:10,bus:6,taxi:8,metro:"Bus",landmark:"Castello Svevo"},
  Genova:  {center:"Piazza Principe → Porto",walk:12,bus:7,taxi:10,metro:"Metro",landmark:"Porto Antico"},
  Trieste: {center:"Centrale → Piazza Unità",walk:20,bus:10,taxi:12,metro:"No metro",landmark:"Piazza Unità d'Italia"},
};
const getCity = c => CITY_INFO[c] || {center:`${c} → Centro`,walk:15,bus:8,taxi:12,metro:"Info n/d",landmark:"Centro città"};

const STOPS = {"Roma-Milano":["Firenze","Bologna"],"Milano-Roma":["Bologna","Firenze"],"Milano-Venezia":["Verona","Padova"],"Venezia-Milano":["Padova","Verona"]};
const getStops = (f,t) => (STOPS[`${f}-${t}`]||["Bologna","Firenze","Verona"]).filter(c=>c!==f&&c!==t);

const DELAY_TRAINS = [
  {id:"FR9610",route:"Roma → Milano",  dep:"06:00",delay:0, platform:5,status:"ok",  type:"FR"},
  {id:"FR9614",route:"Milano → Roma",  dep:"06:25",delay:8, platform:3,status:"warn",type:"FR"},
  {id:"FA8300",route:"Roma → Venezia", dep:"07:10",delay:22,platform:7,status:"warn",type:"FA"},
  {id:"IC504", route:"Torino → Napoli",dep:"07:35",delay:0, platform:2,status:"ok",  type:"IC"},
  {id:"FR9620",route:"Roma → Torino",  dep:"08:00",delay:5, platform:4,status:"warn",type:"FR"},
  {id:"RE2241",route:"Bologna → Pisa", dep:"08:15",delay:45,platform:9,status:"bad", type:"RE"},
  {id:"FB8800",route:"Roma → Bari",    dep:"08:40",delay:0, platform:1,status:"ok",  type:"FB"},
  {id:"RV3102",route:"Milano → Genova",dep:"09:00",delay:12,platform:6,status:"warn",type:"RV"},
  {id:"FR9630",route:"Milano → Napoli",dep:"09:15",delay:0, platform:5,status:"ok",  type:"FR"},
  {id:"RE4450",route:"Venezia → Trieste",dep:"09:30",delay:33,platform:8,status:"bad",type:"RE"},
  {id:"IC640", route:"Genova → Roma",  dep:"09:55",delay:7, platform:3,status:"warn",type:"IC"},
  {id:"FA8320",route:"Firenze → Napoli",dep:"10:10",delay:0,platform:2,status:"ok",  type:"FA"},
];

// Only trains departing from "now" onwards (simulate with hour >= current hour)
function getUpcomingDelays() {
  const h = new Date().getHours();
  return DELAY_TRAINS.filter(t => parseInt(t.dep.split(":")[0]) >= h);
}

function genTrains(from, to, filters) {
  const types=["FR","FA","FB","IC","RE","RV"];
  const prices={FR:45,FA:38,FB:28,IC:22,RE:8,RV:12};
  const durs={FR:90,FA:110,FB:140,IC:160,RE:220,RV:180};
  const stops=getStops(from,to);
  const out=[];
  const pad2=n=>String(n).padStart(2,"0");
  const toHM=n=>`${pad2(Math.floor(n/60)%24)}:${pad2(n%60)}`;
  // Only future trains — start from current hour
  const startH = new Date().getHours();
  for(let i=0;i<20;i++){
    const type=types[i%6];
    const depH=startH+Math.floor(i*0.9),depM=(i*17)%60;
    const nCh=i%3===0?0:i%3===1?1:2;
    const durMin=durs[type]+(i*7)%40;
    const totM=depH*60+depM+durMin;
    const price=prices[type]+(i*3)%35;
    const legs=[];
    if(nCh>0){
      const ls=stops.slice(0,nCh);
      let cur=depH*60+depM;
      const ld=Math.floor(durMin/(nCh+1));
      ls.forEach((stop,li)=>{
        const wait=12+(i*7+li*11)%48,le=cur+ld;
        legs.push({from:li===0?from:ls[li-1],to:stop,dep:toHM(cur),arr:toHM(le),waitMin:wait,platform:1+(i+li)%12,trainId:`${types[(i+li+1)%6]}${2000+i*10+li}`});
        cur=le+wait;
      });
      legs.push({from:ls[ls.length-1],to,dep:toHM(cur),arr:toHM(totM),waitMin:0,platform:1+(i+5)%12,trainId:`${type}${1000+i}`});
    }
    if(filters.trainType!=="all"&&type!==filters.trainType)continue;
    if(filters.maxPrice&&price>+filters.maxPrice)continue;
    if(filters.directOnly&&nCh>0)continue;
    if(filters.withChanges&&nCh===0)continue;
    if(filters.wifiOnly&&!(type==="FR"||type==="FA"))continue;
    if(filters.timeRange==="morning"&&(depH<6||depH>=12))continue;
    if(filters.timeRange==="afternoon"&&(depH<12||depH>=18))continue;
    if(filters.timeRange==="evening"&&depH<18)continue;
    if(nCh>0&&legs.length>1){
      const ws=legs.slice(0,-1).map(l=>l.waitMin);
      if(filters.minConn&&Math.min(...ws)<+filters.minConn)continue;
      if(filters.maxConn&&Math.max(...ws)>+filters.maxConn)continue;
    }
    out.push({
      id:`${type}${1000+i}`,type,name:META[type].label,
      dep:`${pad2(depH%24)}:${pad2(depM)}`,
      arr:`${pad2(Math.floor(totM/60)%24)}:${pad2(totM%60)}`,
      durMin,dur:`${Math.floor(durMin/60)}h ${durMin%60}m`,
      price,seats:20+(i*37)%200,onTime:i%5!==0,changes:nCh,legs,from,to,
      wifi:type==="FR"||type==="FA",food:type==="FR"||type==="FA"||type==="IC",
      co2:Math.floor(durMin*0.8),platform:1+(i*3)%16,
      operator:type==="FR"||type==="FA"||type==="FB"?"Trenitalia AV":type==="IC"?"Trenitalia Intercity":"Trenitalia Regionale",
      trainNumber:`${type}${1000+i}`,
    });
  }
  return out;
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const G = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F2F0EB; --surface: #fff; --border: #E8E4DC;
    --ink: #1A1A1A; --muted: #888; --faint: #CCC;
    --green: #009246; --green-lt: #E6F4EC; --green-dk: #007A3B;
    --orange: #E67E22; --red: #C0392B;
    --sans: 'DM Sans', sans-serif; --serif: 'DM Serif Display', serif;
    --r: 14px;
    --shadow: 0 1px 6px rgba(0,0,0,.04), 0 2px 14px rgba(0,0,0,.05);
    --shadow-lg: 0 8px 32px rgba(0,0,0,.12);
    --nav-h: 64px;
  }
  html, body { height: 100%; }
  body { background: var(--bg); font-family: var(--sans); color: var(--ink); }
  input, select, button { font-family: var(--sans); }
  input[type=range] { -webkit-appearance:none; height:2px; border-radius:2px; background:#E8E4DC; outline:none; cursor:pointer; width:100%; display:block; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:var(--green); border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,.2); cursor:pointer; }
  input[type=date]::-webkit-calendar-picker-indicator { opacity:.4; cursor:pointer; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-thumb { background:#D0CBC4; border-radius:4px; }
  .card { background:var(--surface); border-radius:var(--r); border:1px solid var(--border); box-shadow:var(--shadow); }
  .lift { transition: box-shadow .18s, transform .18s; }
  .lift:hover { box-shadow:var(--shadow-lg); transform:translateY(-2px); }
  .chip { cursor:pointer; transition:all .13s; }
  .sug:hover { background:#EDE9E1; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none} }
  .up { animation:fadeUp .26s ease both; }
  @keyframes fadeIn { from{opacity:0}to{opacity:1} }
  .fade { animation:fadeIn .2s ease both; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.3} }
  .pulse { animation:pulse 1.8s ease-in-out infinite; }
  @keyframes slideUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none} }
  .slide-up { animation:slideUp .28s cubic-bezier(.2,0,.2,1) both; }
  @keyframes navPop { 0%{transform:scale(1)}50%{transform:scale(1.16)}100%{transform:scale(1)} }
  .nav-pop { animation: navPop .2s ease; }
  @keyframes shimmer { 0%{background-position:-500px 0}100%{background-position:500px 0} }
  .shimmer { background:linear-gradient(90deg,#ece9e3 25%,#e0ddd6 50%,#ece9e3 75%); background-size:500px 100%; animation:shimmer 1.4s ease-in-out infinite; border-radius:8px; }
  @keyframes trackMove {
    0%   { stroke-dashoffset: 120; }
    100% { stroke-dashoffset: -120; }
  }
  @keyframes trainSlide {
    0%   { transform: translateX(-80px); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateX(340px); opacity: 0; }
  }
  @keyframes dot1 { 0%,100%{opacity:.2} 20%{opacity:1} }
  @keyframes dot2 { 0%,100%{opacity:.2} 40%{opacity:1} }
  @keyframes dot3 { 0%,100%{opacity:.2} 60%{opacity:1} }
`;

const INP = {width:"100%",background:"#F9F8F6",border:"1px solid #E8E4DC",borderRadius:8,padding:"10px 12px",fontSize:14,color:"#1A1A1A",outline:"none"};
const LBL = {display:"block",fontSize:10,color:"#999",letterSpacing:.6,textTransform:"uppercase",marginBottom:5};
const sc  = s => s==="ok"?"#009246":s==="bad"?"#C0392B":"#E67E22";
const sl  = s => s==="ok"?"In orario":s==="bad"?"Grave ritardo":"In ritardo";

// ─── LOGO ────────────────────────────────────────────────────────────────────
function Logo({s=32}) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="9" fill="#1A1A1A"/>
      <rect x="6" y="14" width="28" height="14" rx="3" fill="#F4F2ED"/>
      <path d="M6 17 Q3 17 3 23 L6 23 Z" fill="#F4F2ED"/>
      <rect x="9"  y="17" width="5" height="5" rx="1.5" fill="#1A1A1A" opacity=".7"/>
      <rect x="17" y="17" width="5" height="5" rx="1.5" fill="#1A1A1A" opacity=".7"/>
      <rect x="25" y="17" width="4" height="5" rx="1.5" fill="#1A1A1A" opacity=".7"/>
      <rect x="2"  y="29" width="36" height="2" rx="1" fill="#F4F2ED" opacity=".35"/>
      <circle cx="10" cy="29" r="2.5" fill="#009246"/>
      <circle cx="22" cy="29" r="2.5" fill="#009246"/>
      <circle cx="34" cy="29" r="2.5" fill="#009246"/>
    </svg>
  );
}

// ─── LOADER (beautiful SVG train animation) ───────────────────────────────────
function TrainLoader({msg}) {
  return (
    <div style={{padding:"48px 20px 32px",display:"flex",flexDirection:"column",alignItems:"center",gap:24}}>
      {/* SVG animated train on track */}
      <div style={{position:"relative",width:280,height:70,overflow:"hidden"}}>
        {/* Track */}
        <svg width="280" height="20" viewBox="0 0 280 20" style={{position:"absolute",bottom:4}}>
          {/* Rail base */}
          <rect x="0" y="8" width="280" height="3" rx="1.5" fill="#E0DDD6"/>
          {/* Animated rail highlight */}
          <rect x="0" y="8" width="280" height="3" rx="1.5" fill="url(#rail-grad)">
            <animate attributeName="x" from="-280" to="280" dur="1.5s" repeatCount="indefinite"/>
          </rect>
          <defs>
            <linearGradient id="rail-grad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#009246" stopOpacity="0"/>
              <stop offset="40%" stopColor="#009246" stopOpacity=".6"/>
              <stop offset="60%" stopColor="#009246" stopOpacity=".6"/>
              <stop offset="100%" stopColor="#009246" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* Sleepers */}
          {[0,40,80,120,160,200,240].map(x=>(
            <rect key={x} x={x} y="6" width="12" height="8" rx="1" fill="#D0CBC4"/>
          ))}
        </svg>
        {/* Train SVG sliding across */}
        <div style={{position:"absolute",bottom:14,animation:"trainSlide 2s cubic-bezier(.4,0,.6,1) infinite"}}>
          <svg width="80" height="36" viewBox="0 0 80 36" fill="none">
            {/* Body */}
            <rect x="4" y="4" width="70" height="22" rx="5" fill="#1A1A1A"/>
            {/* Nose */}
            <path d="M4 8 Q0 8 0 16 Q0 24 4 24 Z" fill="#1A1A1A"/>
            {/* Windows */}
            <rect x="10" y="8"  width="12" height="9" rx="2" fill="#F4F2ED" opacity=".9"/>
            <rect x="26" y="8"  width="12" height="9" rx="2" fill="#F4F2ED" opacity=".9"/>
            <rect x="42" y="8"  width="12" height="9" rx="2" fill="#F4F2ED" opacity=".9"/>
            <rect x="58" y="8"  width="10" height="9" rx="2" fill="#F4F2ED" opacity=".7"/>
            {/* Green stripe */}
            <rect x="0" y="26" width="74" height="3" rx="1.5" fill="#009246"/>
            {/* Wheels */}
            <circle cx="14" cy="31" r="5" fill="#333" stroke="#009246" strokeWidth="2"/>
            <circle cx="14" cy="31" r="2" fill="#009246"/>
            <circle cx="38" cy="31" r="5" fill="#333" stroke="#009246" strokeWidth="2"/>
            <circle cx="38" cy="31" r="2" fill="#009246"/>
            <circle cx="62" cy="31" r="5" fill="#333" stroke="#009246" strokeWidth="2"/>
            <circle cx="62" cy="31" r="2" fill="#009246"/>
            {/* Speed lines */}
            <line x1="2" y1="11" x2="-8" y2="11" stroke="#009246" strokeWidth="1.5" strokeLinecap="round" opacity=".7"/>
            <line x1="2" y1="16" x2="-12" y2="16" stroke="#009246" strokeWidth="1" strokeLinecap="round" opacity=".4"/>
            <line x1="2" y1="21" x2="-7" y2="21" stroke="#009246" strokeWidth="1.5" strokeLinecap="round" opacity=".7"/>
          </svg>
        </div>
      </div>

      {/* Dots */}
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{width:7,height:7,borderRadius:"50%",background:"#009246",
            animation:`dot${i+1} 1.2s ease-in-out infinite`}}/>
        ))}
      </div>

      {/* Message */}
      <p style={{fontSize:13,color:"#888",letterSpacing:.3,minWidth:220,textAlign:"center"}}>{msg}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card" style={{marginBottom:8,padding:"14px 16px"}}>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <div className="shimmer" style={{width:42,height:42,borderRadius:9,flexShrink:0}}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
          <div className="shimmer" style={{height:16,width:"42%"}}/>
          <div className="shimmer" style={{height:11,width:"60%"}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
          <div className="shimmer" style={{width:52,height:22,borderRadius:6}}/>
          <div className="shimmer" style={{width:68,height:32,borderRadius:8}}/>
        </div>
      </div>
    </div>
  );
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
function Chip({active,onClick,children,gold,color}) {
  const bg  = active ? (gold?"#7A5218":color||"#009246") : (gold?"#FBF5E6":"#fff");
  const cl  = active ? "#fff" : (gold?"#8A6020":"#666");
  const bdr = active ? (gold?"#7A5218":color||"#009246") : (gold?"#DFD0AC":"#E8E4DC");
  return <button onClick={onClick} className="chip" style={{padding:"4px 11px",borderRadius:20,fontSize:12,background:bg,color:cl,border:`1px solid ${bdr}`}}>{children}</button>;
}

function Tog({label,checked,onChange}) {
  return (
    <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",userSelect:"none",flexShrink:0}}>
      <div onClick={()=>onChange(!checked)} style={{width:30,height:17,borderRadius:9,background:checked?"#009246":"#D0CBC4",position:"relative",transition:"background .18s",cursor:"pointer",flexShrink:0}}>
        <div style={{position:"absolute",top:2.5,left:checked?14:2.5,width:12,height:12,borderRadius:"50%",background:"#fff",transition:"left .16s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
      </div>
      <span style={{fontSize:12,color:"#666",whiteSpace:"nowrap"}}>{label}</span>
    </label>
  );
}

// ─── SMART INPUT (autocomplete + history) ─────────────────────────────────────
function SmartInput({label, value, onChange, history, onSelect, placeholder}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);

  const citySugg = value.length >= 1
    ? CITIES.filter(c => c.toLowerCase().startsWith(value.toLowerCase()) && c !== value).slice(0, 4)
    : [];
  const histSugg = !value
    ? history.filter((h,i) => history.indexOf(h)===i).slice(0, 4)
    : [];

  const showDropdown = focused && (citySugg.length > 0 || histSugg.length > 0);

  useEffect(() => {
    const handler = e => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{position:"relative"}}>
      <label style={LBL}>{label}</label>
      <input
        value={value}
        onChange={e => { onChange(e.target.value); setFocused(true); }}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        style={INP}
        placeholder={placeholder}
        autoComplete="off"
      />
      {showDropdown && (
        <div style={{position:"absolute",top:"calc(100% + 3px)",left:0,right:0,zIndex:300,background:"#fff",border:"1px solid #E8E4DC",borderRadius:10,boxShadow:"0 8px 28px rgba(0,0,0,.13)",overflow:"hidden"}}>
          {histSugg.length > 0 && (
            <>
              <div style={{padding:"6px 12px 4px",fontSize:9,color:"#BBB",letterSpacing:.8,textTransform:"uppercase",display:"flex",alignItems:"center",gap:5}}>
                <IcoHistory s={10}/> Recenti
              </div>
              {histSugg.map(h => (
                <div key={h} className="sug" onMouseDown={() => { onSelect(h); setFocused(false); }}
                  style={{padding:"9px 13px",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:8,color:"#555"}}>
                  <span style={{color:"#CCC"}}><IcoHistory s={12}/></span>{h}
                </div>
              ))}
              {citySugg.length > 0 && <div style={{height:1,background:"#F5F3EE",margin:"2px 0"}}/>}
            </>
          )}
          {citySugg.map(c => (
            <div key={c} className="sug" onMouseDown={() => { onSelect(c); setFocused(false); }}
              style={{padding:"9px 13px",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:8,color:"#333"}}>
              <span style={{color:"#CCC"}}><IcoPin s={11}/></span>
              <span><strong>{c.slice(0,value.length)}</strong>{c.slice(value.length)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({page, onChange, savedCount}) {
  const [popped, setPopped] = useState(null);
  const tap = id => { setPopped(id); setTimeout(()=>setPopped(null),220); onChange(id); };

  const tabs = [
    {id:"search", label:"Cerca",   icon:a=><IcoSearch s={a?19:17}/>},
    {id:"delays", label:"Ritardi", icon:a=><IcoDelay  s={a?19:17}/>},
    {id:"saved",  label:"Salvati", icon:a=><IcoBookmark s={a?19:17} fill={a?"#009246":"none"}/>, badge:savedCount},
  ];

  return (
    <nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,background:"rgba(255,255,255,.94)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderTop:"1px solid #E8E4DC",height:"var(--nav-h)",display:"flex",alignItems:"center",paddingBottom:"env(safe-area-inset-bottom)",boxShadow:"0 -1px 0 #E8E4DC,0 -4px 20px rgba(0,0,0,.06)"}}>
      {tabs.map(t => {
        const active = page===t.id;
        return (
          <button key={t.id} onClick={()=>tap(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,background:"none",border:"none",cursor:"pointer",padding:"8px 0",position:"relative",color:active?"#009246":"#BBBBBB"}}>
            <div className={popped===t.id?"nav-pop":""} style={{width:40,height:28,borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",background:active?"#E6F4EC":"transparent",transition:"background .15s",position:"relative"}}>
              {t.icon(active)}
              {t.badge>0 && <div style={{position:"absolute",top:-2,right:2,width:16,height:16,borderRadius:"50%",background:"#C0392B",color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff"}}>{t.badge}</div>}
            </div>
            <span style={{fontSize:10,fontWeight:active?600:400,letterSpacing:.2,transition:"color .15s"}}>{t.label}</span>
            {active && <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:2.5,background:"#009246",borderRadius:"0 0 2px 2px"}}/>}
          </button>
        );
      })}
    </nav>
  );
}

// ─── CITY CARD ────────────────────────────────────────────────────────────────
function CityCard({city}) {
  const d = getCity(city);
  return (
    <div className="card" style={{flex:"1 1 240px",padding:"16px 18px"}}>
      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
        <span style={{color:"#009246"}}><IcoPin s={14}/></span>
        <span style={{fontFamily:"var(--serif)",fontSize:16}}>{city}</span>
      </div>
      <p style={{fontSize:10,color:"#AAA",letterSpacing:.4,textTransform:"uppercase",marginBottom:10}}>{d.center}</p>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {[
          {icon:<IcoWalk s={12}/>,color:"#4A90E2",text:`A piedi: ${d.walk} min`},
          ...(d.bus>0?[{icon:<IcoBus s={12}/>,color:"#E67E22",text:`Bus/Tram: ${d.bus} min`}]:[]),
          ...(d.taxi>0?[{icon:<IcoEuro s={12}/>,color:"#C0A020",text:`Taxi: ~€${d.taxi}`}]:[]),
          {icon:<IcoTrain s={12}/>,color:"#9B59B6",text:d.metro},
        ].map((r,i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:7}}>
            <span style={{color:r.color,flexShrink:0}}>{r.icon}</span>
            <span style={{fontSize:12,color:"#555"}}>{r.text}</span>
          </div>
        ))}
      </div>
      <div style={{marginTop:10,padding:"6px 10px",background:"#F9F8F6",borderRadius:6}}>
        <span style={{fontSize:11,color:"#999"}}>🏛 {d.landmark}</span>
      </div>
    </div>
  );
}

// ─── DETAIL PAGE ──────────────────────────────────────────────────────────────
function DetailPage({t, saved, onSave}) {
  const m = META[t.type];
  const delay = DELAY_TRAINS.find(d => d.id===t.id);

  return (
    <div className="slide-up" style={{maxWidth:900,margin:"0 auto",padding:"16px 14px",paddingBottom:"calc(var(--nav-h) + 20px)"}}>

      {/* ── HERO ── */}
      <div style={{borderRadius:16,overflow:"hidden",marginBottom:14,boxShadow:"0 4px 24px rgba(0,0,0,.13)"}}>
        {/* Gradient header */}
        <div style={{background:m.gradient,padding:"24px 22px 20px",position:"relative",overflow:"hidden"}}>
          {/* Subtle circles */}
          <div style={{position:"absolute",right:-40,top:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
          <div style={{position:"absolute",left:-20,bottom:-50,width:120,height:120,borderRadius:"50%",background:"rgba(0,0,0,.06)"}}/>

          <div style={{position:"relative"}}>
            {/* Top row: type + status */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{background:"rgba(0,0,0,.22)",borderRadius:6,padding:"3px 10px",fontSize:11,color:"rgba(255,255,255,.95)",fontWeight:700,letterSpacing:.6}}>{t.type}</span>
                <span style={{fontSize:12,color:"rgba(255,255,255,.65)"}}>{m.label} · {t.trainNumber}</span>
              </div>
              {delay && (
                <span style={{marginLeft:"auto",fontSize:11,fontWeight:600,color:"#fff",
                  background:delay.status==="ok"?"rgba(0,146,70,.5)":delay.status==="bad"?"rgba(192,57,43,.55)":"rgba(230,126,34,.5)",
                  padding:"4px 11px",borderRadius:20,display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:delay.status==="ok"?"#a8f0c8":"#ff9b9b"}} className="pulse"/>
                  {delay.status==="ok"?"In orario":`+${delay.delay} min`}
                </span>
              )}
            </div>

            {/* Times */}
            <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:12}}>
              <div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.5)",marginBottom:4,letterSpacing:.6,textTransform:"uppercase"}}>Partenza</div>
                <div style={{fontFamily:"var(--serif)",fontSize:40,color:"#fff",lineHeight:1,letterSpacing:-1}}>{t.dep}</div>
                <div style={{fontSize:15,color:"rgba(255,255,255,.85)",marginTop:6,fontWeight:500}}>{t.from}</div>
              </div>
              <div style={{textAlign:"center",padding:"0 8px"}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:8}}>{t.dur}</div>
                <div style={{display:"flex",alignItems:"center",gap:3}}>
                  <div style={{width:7,height:7,borderRadius:"50%",border:"2px solid rgba(255,255,255,.6)",flexShrink:0}}/>
                  <div style={{flex:1,height:1.5,background:"rgba(255,255,255,.25)"}}/>
                  {t.changes>0 && <div style={{width:5,height:5,borderRadius:"50%",background:"rgba(255,255,255,.4)",flexShrink:0}}/>}
                  {t.changes>0 && <div style={{flex:1,height:1.5,background:"rgba(255,255,255,.25)"}}/>}
                  <div style={{width:7,height:7,borderRadius:"50%",border:"2px solid rgba(255,255,255,.6)",flexShrink:0}}/>
                </div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.45)",marginTop:6,letterSpacing:.5}}>
                  {t.changes===0?"DIRETTO":`${t.changes} CAMBIO`}
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:10,color:"rgba(255,255,255,.5)",marginBottom:4,letterSpacing:.6,textTransform:"uppercase"}}>Arrivo</div>
                <div style={{fontFamily:"var(--serif)",fontSize:40,color:"#fff",lineHeight:1,letterSpacing:-1}}>{t.arr}</div>
                <div style={{fontSize:15,color:"rgba(255,255,255,.85)",marginTop:6,fontWeight:500}}>{t.to}</div>
              </div>
            </div>
          </div>
        </div>

        {/* White info strip */}
        <div style={{background:"#fff",padding:"14px 20px",display:"flex",alignItems:"center",gap:0,overflowX:"auto",borderBottom:"1px solid #F0EDE8"}}>
          {[
            {label:"Binario",value:`Bin. ${t.platform}`},
            {label:"Operatore",value:t.operator},
            {label:"Prezzo",value:`€${t.price}`,accent:true},
          ].map((x,i) => (
            <div key={i} style={{flex:"1 0 90px",padding:"0 14px",borderRight:i<2?"1px solid #F0EDE8":"none",minWidth:0}}>
              <div style={{fontSize:9,color:"#BBB",letterSpacing:.6,textTransform:"uppercase",marginBottom:3,whiteSpace:"nowrap"}}>{x.label}</div>
              <div style={{fontSize:14,fontWeight:x.accent?700:500,color:x.accent?"#009246":"#333",whiteSpace:"nowrap"}}>{x.value}</div>
            </div>
          ))}
          {/* Save + Book */}
          <div style={{marginLeft:"auto",display:"flex",gap:8,flexShrink:0,paddingLeft:14}}>
            <button onClick={onSave} style={{display:"flex",alignItems:"center",gap:5,background:saved?"#009246":"#fff",border:`1px solid ${saved?"#009246":"#E8E4DC"}`,borderRadius:20,padding:"7px 14px",fontSize:12,cursor:"pointer",color:saved?"#fff":"#555",transition:"all .15s",whiteSpace:"nowrap"}}>
              <IcoBookmark s={12} fill={saved?"#fff":"none"}/>{saved?"Salvato":"Salva"}
            </button>
            <button
              onClick={()=>window.open(`https://www.trenitalia.com/it/prenotazioni.html?from=${encodeURIComponent(t.from)}&to=${encodeURIComponent(t.to)}`,"_blank")}
              style={{display:"flex",alignItems:"center",gap:5,background:"#009246",border:"none",borderRadius:20,padding:"7px 16px",fontSize:12,cursor:"pointer",color:"#fff",fontWeight:600,whiteSpace:"nowrap",boxShadow:"0 2px 8px rgba(0,146,70,.3)"}}>
              <IcoExtLink s={11}/>Prenota ora
            </button>
          </div>
        </div>
      </div>

      {/* ── AMENITIES ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:8,marginBottom:14}}>
        {[
          {icon:<IcoWifi s={15}/>,  color:"#1A6BA0",bg:"#eaf3fb",label:"Wi-Fi",   val:t.wifi?"Disponibile":"—",      ok:t.wifi},
          {icon:<IcoFood s={15}/>,  color:"#7D3C98",bg:"#f5eefb",label:"Ristoro", val:t.food?"Disponibile":"—",      ok:t.food},
          {icon:<IcoLeaf s={15}/>,  color:"#009246",bg:"#e6f4ec",label:"CO₂",     val:`−${t.co2}g vs auto`,          ok:true},
          {icon:<IcoSeat s={15}/>,  color:"#E67E22",bg:"#fdf2e9",label:"Posti",   val:`${t.seats} liberi`,           ok:t.seats>30},
        ].map((x,i) => (
          <div key={i} className="card" style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:9,background:x.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{color:x.color}}>{x.icon}</span>
            </div>
            <div>
              <div style={{fontSize:9,color:"#BBB",letterSpacing:.5,textTransform:"uppercase",marginBottom:2}}>{x.label}</div>
              <div style={{fontSize:12,fontWeight:500,color:x.ok?"#333":"#BBB"}}>{x.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── ITINERARY ── */}
      {t.changes>0 && t.legs.length>0 && (
        <div className="card" style={{padding:"18px",marginBottom:14}}>
          <p style={{fontSize:10,color:"#BBB",letterSpacing:.6,textTransform:"uppercase",marginBottom:16}}>Itinerario dettagliato</p>
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",left:15,top:18,bottom:18,width:2,background:"linear-gradient(180deg,#009246,#E8E4DC)",borderRadius:1,opacity:.4}}/>
            {t.legs.map((leg,i) => (
              <div key={i} style={{marginBottom:6}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:META[t.type].bg,border:"2px solid #fff",boxShadow:"0 0 0 2px #E8E4DC",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,zIndex:1}}>
                    <span style={{color:META[t.type].color}}><IcoTrain s={11}/></span>
                  </div>
                  <div style={{flex:1,background:"#F9F8F6",borderRadius:9,padding:"10px 13px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
                      <div>
                        <span style={{fontWeight:600,fontSize:14}}>{leg.dep}</span>
                        <span style={{color:"#CCC",margin:"0 6px",fontSize:12}}>→</span>
                        <span style={{fontWeight:600,fontSize:14}}>{leg.arr}</span>
                      </div>
                      <span style={{fontSize:10,background:"#E8E4DC",padding:"2px 8px",borderRadius:5,color:"#777",alignSelf:"center"}}>Bin. {leg.platform}</span>
                    </div>
                    <div style={{fontSize:11,color:"#888",marginTop:3}}>{leg.from} → {leg.to}</div>
                    <div style={{fontSize:9,color:"#C0BBAF",marginTop:1}}>{leg.trainId}</div>
                  </div>
                </div>
                {leg.waitMin>0 && (
                  <div style={{paddingLeft:42,paddingTop:5,paddingBottom:5}}>
                    <span style={{fontSize:11,color:"#B07D2A",background:"#FBF5E6",border:"1px solid #EDE0C0",padding:"4px 10px",borderRadius:20,display:"inline-flex",alignItems:"center",gap:5}}>
                      <IcoClock s={10}/> {leg.waitMin} min di attesa · {leg.waitMin<15?"Cambio stretto":"Tempo sufficiente"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CITY INFO ── */}
      <p style={{fontSize:10,color:"#BBB",letterSpacing:.6,textTransform:"uppercase",marginBottom:10}}>Come raggiungere il centro</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <CityCard city={t.from}/><CityCard city={t.to}/>
      </div>
    </div>
  );
}

// ─── TRAIN CARD (list) ────────────────────────────────────────────────────────
function TrainCard({t, onView}) {
  const m = META[t.type];
  return (
    <div className="card lift up" style={{marginBottom:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>onView(t)}>
      <div style={{height:3,background:m.gradient}}/>
      <div style={{padding:"13px 15px",display:"flex",alignItems:"center",gap:11,flexWrap:"wrap"}}>
        {/* Type badge */}
        <div style={{flexShrink:0,width:40,height:40,borderRadius:9,background:m.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:m.color}}/>
          <span style={{fontSize:8,fontWeight:700,color:m.color,letterSpacing:.4}}>{t.type}</span>
        </div>
        {/* Times */}
        <div style={{flexShrink:0}}>
          <div style={{display:"flex",alignItems:"baseline",gap:6}}>
            <span style={{fontFamily:"var(--serif)",fontSize:19,letterSpacing:-.2}}>{t.dep}</span>
            <span style={{color:"#DDD",fontSize:10}}>→</span>
            <span style={{fontFamily:"var(--serif)",fontSize:19,letterSpacing:-.2}}>{t.arr}</span>
          </div>
          <div style={{display:"flex",gap:5,marginTop:3,alignItems:"center"}}>
            <span style={{fontSize:10,color:"#AAA"}}>{t.dur}</span>
            {t.changes===0
              ?<span style={{fontSize:9,color:"#009246",background:"#E6F4EC",padding:"1px 6px",borderRadius:9}}>Diretto</span>
              :<span style={{fontSize:9,color:"#E67E22",background:"#FEF3E2",padding:"1px 6px",borderRadius:9}}>{t.changes} cambio</span>}
          </div>
        </div>
        {/* Route + amenities */}
        <div style={{flex:"1 1 60px",minWidth:0}}>
          <div style={{fontSize:11,color:"#999",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.from} → {t.to}</div>
          <div style={{display:"flex",gap:6,marginTop:3}}>
            {t.wifi&&<span style={{display:"flex",alignItems:"center",gap:2,fontSize:9,color:"#1A6BA0"}}><IcoWifi s={9}/>Wi-Fi</span>}
            {t.food&&<span style={{display:"flex",alignItems:"center",gap:2,fontSize:9,color:"#7D3C98"}}><IcoFood s={9}/>Ristoro</span>}
          </div>
        </div>
        {/* On-time */}
        <div style={{flexShrink:0}}>
          {t.onTime
            ?<span style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:"#009246"}}><IcoOk s={9}/>Puntuale</span>
            :<span style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:"#E67E22"}}><IcoWarn s={9}/>Possibili ritardi</span>}
        </div>
        {/* Price */}
        <div style={{flexShrink:0,textAlign:"right",minWidth:50}}>
          <div style={{fontFamily:"var(--serif)",fontSize:20,lineHeight:1}}>€{t.price}</div>
          <div style={{fontSize:9,color:"#BBB",marginTop:1}}>p.p.</div>
        </div>
        {/* Book button */}
        <button
          onClick={e=>{e.stopPropagation();window.open(`https://www.trenitalia.com/it/prenotazioni.html?from=${encodeURIComponent(t.from)}&to=${encodeURIComponent(t.to)}`,"_blank");}}
          style={{flexShrink:0,background:"#009246",color:"#fff",border:"none",borderRadius:8,padding:"8px 13px",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5,boxShadow:"0 2px 8px rgba(0,146,70,.25)",whiteSpace:"nowrap"}}>
          <IcoExtLink s={11}/>Prenota
        </button>
        <span style={{color:"#CCC",flexShrink:0}}><IcoChevR s={12}/></span>
      </div>
    </div>
  );
}

// ─── DELAYS PAGE (full page, not modal) ───────────────────────────────────────
function DelaysPage() {
  const [q,setQ]     = useState("");
  const [tab,setTab] = useState("all");
  const upcoming = getUpcomingDelays();
  const list = upcoming.filter(t => {
    const m = t.id.toLowerCase().includes(q.toLowerCase()) || t.route.toLowerCase().includes(q.toLowerCase());
    return tab==="all"?m : tab==="ok"?m&&t.delay===0 : tab==="bad"?m&&t.delay>=30 : m&&t.delay>0&&t.delay<30;
  });
  const ontime = upcoming.filter(t=>t.delay===0).length;
  const delayed = upcoming.filter(t=>t.delay>0);
  const avg = delayed.length ? Math.round(delayed.reduce((a,t)=>a+t.delay,0)/delayed.length) : 0;

  return (
    <div className="fade" style={{maxWidth:900,margin:"0 auto",padding:"20px 14px",paddingBottom:"calc(var(--nav-h) + 20px)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
        <span style={{color:"#009246"}}><IcoDelay s={20}/></span>
        <div>
          <h1 style={{fontFamily:"var(--serif)",fontSize:22,lineHeight:1}}>Monitor Ritardi</h1>
          <p style={{fontSize:12,color:"#AAA",marginTop:2}}>Treni in partenza oggi — aggiornamento in tempo reale</p>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#009246",boxShadow:"0 0 0 3px rgba(0,146,70,.2)"}} className="pulse"/>
          <span style={{fontSize:10,color:"#888",letterSpacing:1,textTransform:"uppercase"}}>Live</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:18}}>
        {[
          {v:upcoming.length, l:"Treni oggi",    c:"#1A1A1A"},
          {v:ontime,          l:"In orario",      c:"#009246"},
          {v:upcoming.length-ontime, l:"In ritardo", c:"#E67E22"},
          {v:avg?`${avg} min`:"—",l:"Media ritardo", c:"#C0392B"},
        ].map((s,i) => (
          <div key={i} className="card" style={{padding:"14px 10px",textAlign:"center"}}>
            <div style={{fontFamily:"var(--serif)",fontSize:24,color:s.c,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:9,color:"#AAA",letterSpacing:.5,textTransform:"uppercase",marginTop:5}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Search + tabs */}
      <div className="card" style={{padding:"12px 14px",marginBottom:12,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:"1 1 160px",minWidth:0}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#CCC",pointerEvents:"none"}}><IcoSearch s={12}/></span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cerca treno o tratta…" style={{...INP,paddingLeft:30,fontSize:12,padding:"8px 10px 8px 30px"}}/>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {[["all","Tutti"],["ok","In orario"],["warn","Ritardo"],["bad","Grave"]].map(([k,l]) => (
            <Chip key={k} active={tab===k} onClick={()=>setTab(k)}
              color={k==="ok"?"#009246":k==="bad"?"#C0392B":k==="warn"?"#E67E22":undefined}>{l}</Chip>
          ))}
        </div>
      </div>

      {/* Cards */}
      {list.length===0
        ? <div className="card" style={{padding:"48px 20px",textAlign:"center"}}><p style={{color:"#CCC",fontSize:14}}>Nessun treno trovato</p></div>
        : <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {list.map(t => {
              const color = sc(t.status);
              const pct = Math.min(t.delay/60*100,100);
              return (
                <div key={t.id} className="card up" style={{overflow:"hidden"}}>
                  <div style={{display:"flex",alignItems:"stretch"}}>
                    {/* Status bar left */}
                    <div style={{width:5,background:color,flexShrink:0}}/>
                    <div style={{flex:1,padding:"13px 16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                        {/* ID */}
                        <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                          <div style={{width:9,height:9,borderRadius:"50%",background:META[t.type].color}}/>
                          <span style={{fontSize:13,fontWeight:700}}>{t.id}</span>
                          <span style={{fontSize:10,color:"#BBB",background:"#F4F2ED",padding:"2px 7px",borderRadius:5}}>{t.dep}</span>
                        </div>
                        {/* Route */}
                        <span style={{fontSize:12,color:"#777",flex:1,minWidth:80}}>{t.route}</span>
                        {/* Platform */}
                        <span style={{fontSize:10,color:"#999",background:"#F0EDE8",padding:"3px 8px",borderRadius:6,flexShrink:0}}>Bin. {t.platform}</span>
                        {/* Status badge */}
                        <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:color+"18",color,flexShrink:0}}>
                          {t.status==="ok"?<IcoOk s={10}/>:<IcoWarn s={10}/>}{sl(t.status)}
                        </span>
                        {/* Delay */}
                        <div style={{flexShrink:0,minWidth:48,textAlign:"right"}}>
                          {t.delay===0
                            ?<span style={{fontSize:14,color:"#009246",fontWeight:700}}>—</span>
                            :<span style={{fontSize:15,color,fontWeight:800}}>+{t.delay}<span style={{fontSize:10,fontWeight:400,marginLeft:1}}>min</span></span>}
                        </div>
                      </div>
                      {/* Delay bar */}
                      {t.delay>0 && (
                        <div style={{marginTop:10,height:4,background:"#F0EDE8",borderRadius:2,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:2}}/>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      }
    </div>
  );
}

// ─── SAVED PAGE ───────────────────────────────────────────────────────────────
function SavedPage({saved, onRemove, onView}) {
  if(saved.length===0) return (
    <div className="fade" style={{maxWidth:900,margin:"0 auto",padding:"64px 20px",textAlign:"center",paddingBottom:"calc(var(--nav-h) + 64px)"}}>
      <div style={{width:56,height:56,borderRadius:16,background:"#F0EDE8",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
        <IcoBookmark s={24}/>
      </div>
      <p style={{fontFamily:"var(--serif)",fontSize:22,marginBottom:8}}>Nessuna tratta salvata</p>
      <p style={{fontSize:14,color:"#AAA",lineHeight:1.6}}>Cerca un treno e salva le tratte<br/>per monitorarle velocemente.</p>
    </div>
  );

  const ontime = saved.filter(t=>{const d=DELAY_TRAINS.find(x=>x.id===t.id);return !d||d.delay===0;}).length;
  return (
    <div className="fade" style={{maxWidth:900,margin:"0 auto",padding:"20px 14px",paddingBottom:"calc(var(--nav-h) + 20px)"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:18}}>
        {[{v:saved.length,l:"Salvate",c:"#1A1A1A"},{v:ontime,l:"In orario",c:"#009246"},{v:saved.length-ontime,l:"Con ritardi",c:"#E67E22"}].map((s,i)=>(
          <div key={i} className="card" style={{padding:"14px 10px",textAlign:"center"}}>
            <div style={{fontFamily:"var(--serif)",fontSize:26,color:s.c,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:9,color:"#AAA",letterSpacing:.5,textTransform:"uppercase",marginTop:5}}>{s.l}</div>
          </div>
        ))}
      </div>
      <p style={{fontSize:10,color:"#AAA",letterSpacing:.6,textTransform:"uppercase",marginBottom:10}}>Le tue tratte</p>
      {saved.map(t=>{
        const m=META[t.type];
        const delay=DELAY_TRAINS.find(d=>d.id===t.id);
        const color=delay?sc(delay.status):"#CCC";
        return (
          <div key={t.id} className="card lift" style={{overflow:"hidden",cursor:"pointer",marginBottom:9}} onClick={()=>onView(t)}>
            <div style={{height:3,background:m.gradient}}/>
            <div style={{padding:"13px 16px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <div style={{flexShrink:0,width:38,height:38,borderRadius:9,background:m.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:m.color}}/>
                <span style={{fontSize:8,fontWeight:700,color:m.color,letterSpacing:.3}}>{t.type}</span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                  <span style={{fontFamily:"var(--serif)",fontSize:18}}>{t.dep}</span>
                  <span style={{color:"#DDD",fontSize:10}}>→</span>
                  <span style={{fontFamily:"var(--serif)",fontSize:18}}>{t.arr}</span>
                </div>
                <div style={{fontSize:11,color:"#888",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.from} → {t.to} · {t.dur}</div>
              </div>
              {delay
                ?<div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:20,fontSize:11,fontWeight:600,background:color+"15",color,flexShrink:0}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"currentColor"}} className={delay.status!=="ok"?"pulse":""}/>
                  {delay.status==="ok"?"In orario":`+${delay.delay} min`}
                </div>
                :<div style={{fontSize:11,color:"#CCC",padding:"5px 10px",borderRadius:20,border:"1px solid #F0EDE8",flexShrink:0}}>—</div>}
              <div style={{fontFamily:"var(--serif)",fontSize:18,flexShrink:0}}>€{t.price}</div>
              <button onClick={e=>{e.stopPropagation();onRemove(t.id);}} style={{background:"none",border:"none",cursor:"pointer",color:"#DDD",padding:4,display:"flex",flexShrink:0,transition:"color .15s",borderRadius:6}} onMouseEnter={e=>e.currentTarget.style.color="#C0392B"} onMouseLeave={e=>e.currentTarget.style.color="#DDD"}>
                <IcoTrash s={14}/>
              </button>
              <span style={{color:"#CCC",flexShrink:0}}><IcoChevR s={12}/></span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [stack, setStack]   = useState([{page:"search",data:null}]);
  const current             = stack[stack.length-1];
  const [navPage,setNavPage]= useState("search");

  const navigate = useCallback((page,data=null)=>{
    setStack(s=>[...s,{page,data}]);
    window.scrollTo({top:0,behavior:"instant"});
  },[]);

  const goBack = useCallback(()=>{
    setStack(s=>{
      if(s.length<=1) return s;
      const prev=s[s.length-2];
      if(prev.page!=="detail") setNavPage(prev.page);
      return s.slice(0,-1);
    });
    window.scrollTo({top:0,behavior:"instant"});
  },[]);

  useEffect(()=>{
    const onPop=()=>{goBack();window.history.pushState(null,"","");};
    window.history.pushState(null,"","");
    window.addEventListener("popstate",onPop);
    return()=>window.removeEventListener("popstate",onPop);
  },[goBack]);

  const switchNav = id => {
    setNavPage(id);
    setStack([{page:id,data:null}]);
    window.scrollTo({top:0,behavior:"instant"});
  };

  // State
  const [from,setFrom]       = useState("Roma");
  const [to,setTo]           = useState("Milano");
  const [date,setDate]       = useState(new Date().toISOString().split("T")[0]);
  const [pax,setPax]         = useState(1);
  const [trains,setTrains]   = useState([]);
  const [loading,setLoad]    = useState(false);
  const [loadMsg,setLoadMsg] = useState("");
  const [searched,setSrch]   = useState(false);
  const [sortBy,setSort]     = useState("price");
  const [aiText,setAiText]   = useState("");
  const [aiLoad,setAiLoad]   = useState(false);
  const [showConn,setConn]   = useState(false);
  const [saved,setSaved]     = useState([]);
  const [searchHistory,setHistory] = useState([]);
  const [filters,setF]       = useState({trainType:"all",maxPrice:"",directOnly:false,wifiOnly:false,timeRange:"all",withChanges:false,minConn:"",maxConn:""});

  const isDetail = current.page==="detail";
  const isSaved  = id => saved.some(s=>s.id===id);
  const toggleSave = t => setSaved(s=>s.some(x=>x.id===t.id)?s.filter(x=>x.id!==t.id):[...s,t]);

  const MSGS = ["Interrogando Trenitalia…","Controllando i binari…","Verificando le coincidenze…","Confrontando i prezzi…","Ottimizzando il percorso…","Quasi pronto…"];

  const search = async () => {
    if(!from||!to) return;
    // Save history
    setHistory(h=>[from,to,...h.filter(x=>x!==from&&x!==to)].slice(0,8));
    setLoad(true); setSrch(false); setAiText("");
    let mi=0; setLoadMsg(MSGS[0]);
    const iv=setInterval(()=>{mi=(mi+1)%MSGS.length;setLoadMsg(MSGS[mi]);},700);
    await new Promise(r=>setTimeout(r,2100));
    clearInterval(iv);
    let res=genTrains(from,to,filters);
    if(sortBy==="price")     res.sort((a,b)=>a.price-b.price);
    else if(sortBy==="duration") res.sort((a,b)=>a.durMin-b.durMin);
    else                     res.sort((a,b)=>a.dep.localeCompare(b.dep));
    setTrains(res); setLoad(false); setSrch(true);
    setAiLoad(true);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:CLAUDE_MODEL,max_tokens:1000,messages:[{role:"user",content:`Tratta: ${from}→${to}, data: ${date}, ${pax} passeggero/i.\nTreni disponibili (i migliori): ${res.slice(0,5).map(t=>`${t.id} ${t.dep}-${t.arr} ${t.dur} €${t.price} ${t.changes===0?"diretto":t.changes+" cambio/i"}`).join("; ")}\nDai un consiglio pratico in 2 frasi. Italiano, diretto.`}]})});
      const d=await r.json(); setAiText(d.content?.[0]?.text||"");
    }catch{ setAiText("Consiglio non disponibile."); }
    setAiLoad(false);
  };

  const sorted=[...trains].sort((a,b)=>sortBy==="price"?a.price-b.price:sortBy==="duration"?a.durMin-b.durMin:a.dep.localeCompare(b.dep));

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <style>{G}</style>

      {/* ── TOP BAR ── */}
      <header style={{position:"sticky",top:0,zIndex:100,height:50,background:"#1A1A1A",display:"flex",alignItems:"center",padding:"0 16px",gap:10,boxShadow:"0 1px 0 rgba(255,255,255,.04),0 2px 12px rgba(0,0,0,.2)"}}>
        {isDetail && (
          <button onClick={goBack} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",borderRadius:7,padding:"5px 11px",color:"#F4F2ED",fontSize:12,cursor:"pointer",flexShrink:0}}>
            <IcoBack s={12}/>Indietro
          </button>
        )}
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>switchNav("search")}>
          <Logo s={28}/>
          <span style={{fontFamily:"var(--serif)",fontSize:17,color:"#F4F2ED",fontStyle:"italic",letterSpacing:.2}}>TrainTracker</span>
        </div>
        <div style={{flex:1}}/>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:"#009246",boxShadow:"0 0 0 3px rgba(0,146,70,.2)"}} className="pulse"/>
          <span style={{fontSize:10,color:"#666",letterSpacing:1,textTransform:"uppercase"}}>Live</span>
        </div>
      </header>

      {/* ── DETAIL ── */}
      {isDetail && current.data && (
        <DetailPage t={current.data} saved={isSaved(current.data.id)} onSave={()=>toggleSave(current.data)}/>
      )}

      {/* ── DELAYS ── */}
      {current.page==="delays" && <DelaysPage/>}

      {/* ── SAVED ── */}
      {current.page==="saved" && (
        <SavedPage saved={saved} onRemove={id=>setSaved(s=>s.filter(x=>x.id!==id))} onView={t=>navigate("detail",t)}/>
      )}

      {/* ── SEARCH ── */}
      {current.page==="search" && (
        <main style={{maxWidth:900,margin:"0 auto",padding:"16px 14px",paddingBottom:"calc(var(--nav-h) + 20px)"}}>

          {/* Search card */}
          <div className="card" style={{padding:"18px 16px 14px",marginBottom:12}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
              <div style={{flex:"1 1 120px",minWidth:0}}>
                <SmartInput label="Partenza" value={from} onChange={setFrom} history={searchHistory} onSelect={v=>{setFrom(v);}} placeholder="Da…"/>
              </div>
              <button onClick={e=>{e.stopPropagation();setFrom(to);setTo(from);}}
                style={{alignSelf:"flex-end",width:34,height:38,background:"none",border:"1px solid #E8E4DC",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#AAA",flexShrink:0,transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#009246";e.currentTarget.style.color="#009246";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#E8E4DC";e.currentTarget.style.color="#AAA";}}>
                <IcoSwap s={13}/>
              </button>
              <div style={{flex:"1 1 120px",minWidth:0}}>
                <SmartInput label="Arrivo" value={to} onChange={setTo} history={searchHistory} onSelect={v=>{setTo(v);}} placeholder="A…"/>
              </div>
              <div style={{flex:"1 1 100px",minWidth:0}}>
                <label style={LBL}>Data</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={INP}/>
              </div>
              <div style={{flex:"0 0 64px"}}>
                <label style={LBL}>Pax</label>
                <select value={pax} onChange={e=>setPax(+e.target.value)} style={INP}>
                  {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <button onClick={search} disabled={loading} style={{alignSelf:"flex-end",height:38,padding:"0 20px",flexShrink:0,background:loading?"#CCC":"#009246",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:6,transition:"background .2s",whiteSpace:"nowrap",boxShadow:loading?"none":"0 2px 10px rgba(0,146,70,.3)"}}>
                <IcoSearch s={12}/>{loading?"…":"Cerca"}
              </button>
            </div>

            <div style={{height:1,background:"#F0EDE8",margin:"14px 0"}}/>

            {/* Filters */}
            <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{display:"flex",alignItems:"center",gap:4,color:"#CCC",fontSize:11,flexShrink:0}}><IcoFilter s={12}/>Filtri</span>
              {TTYPES.map(t=><Chip key={t.id} active={filters.trainType===t.id} onClick={()=>setF(f=>({...f,trainType:t.id}))}>{t.label}</Chip>)}
              <div style={{width:1,height:12,background:"#E8E4DC",flexShrink:0}}/>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontSize:11,color:"#999",whiteSpace:"nowrap"}}>Max €</span>
                <input type="number" placeholder="—" value={filters.maxPrice} onChange={e=>setF(f=>({...f,maxPrice:e.target.value}))} style={{...INP,width:54,padding:"5px 7px",fontSize:12}}/>
              </div>
              <select value={filters.timeRange} onChange={e=>setF(f=>({...f,timeRange:e.target.value}))} style={{...INP,padding:"5px 7px",fontSize:11,width:"auto",flexShrink:0}}>
                <option value="all">Qualsiasi ora</option>
                <option value="morning">Mattina 6–12</option>
                <option value="afternoon">Pomeriggio 12–18</option>
                <option value="evening">Sera 18–24</option>
              </select>
              <Tog label="Diretti" checked={filters.directOnly} onChange={v=>setF(f=>({...f,directOnly:v,withChanges:v?false:f.withChanges}))}/>
              <Tog label="Wi-Fi"   checked={filters.wifiOnly}   onChange={v=>setF(f=>({...f,wifiOnly:v}))}/>
              <Chip gold active={showConn} onClick={()=>setConn(v=>!v)}>Coincidenze</Chip>
            </div>

            {showConn && (
              <div style={{marginTop:12,padding:"14px 16px",background:"#FDFAF3",border:"1px solid #EDE5CE",borderRadius:10}}>
                <p style={{fontSize:10,color:"#8A6020",letterSpacing:.5,textTransform:"uppercase",marginBottom:10}}>Filtro coincidenze</p>
                <div style={{marginBottom:10}}><Tog label="Solo treni con coincidenze" checked={filters.withChanges} onChange={v=>setF(f=>({...f,withChanges:v,directOnly:v?false:f.directOnly}))}/></div>
                <div style={{display:"flex",gap:24,flexWrap:"wrap",marginBottom:10}}>
                  {[
                    {label:"Attesa min",max:120,color:"#B07D2A",val:filters.minConn||"0",empty:!filters.minConn,cb:v=>setF(f=>({...f,minConn:v==="0"?"":v}))},
                    {label:"Attesa max",max:180,color:"#4E8C6A",val:filters.maxConn||"180",empty:!filters.maxConn,cb:v=>setF(f=>({...f,maxConn:v==="180"?"":v}))},
                  ].map(s=>(
                    <div key={s.label} style={{flex:"1 1 160px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:10,color:"#9A9690",letterSpacing:.4,textTransform:"uppercase"}}>{s.label}</span>
                        {s.empty?<span style={{fontSize:11,color:"#C0BBAF"}}>—</span>:<span style={{fontSize:11,color:s.color,fontWeight:600}}>{s.val} min</span>}
                      </div>
                      <input type="range" min={0} max={s.max} value={+s.val} onChange={e=>s.cb(e.target.value)} style={{accentColor:s.color}}/>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {[{l:"Veloce 10–20m",mn:"10",mx:"20"},{l:"Comoda 20–45m",mn:"20",mx:"45"},{l:"Rilassata 30–90m",mn:"30",mx:"90"},{l:"Qualsiasi",mn:"",mx:""}].map(p=>(
                    <Chip key={p.l} active={filters.minConn===p.mn&&filters.maxConn===p.mx} onClick={()=>setF(f=>({...f,minConn:p.mn,maxConn:p.mx}))}>{p.l}</Chip>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI suggestion */}
          {(aiText||aiLoad) && (
            <div className="card up" style={{padding:"12px 16px",marginBottom:12,display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:"#1A1A1A",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{color:"#009246",fontSize:11,fontWeight:700}}>A</span>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:9,color:"#CCC",letterSpacing:.6,textTransform:"uppercase",marginBottom:3}}>Consiglio AI</p>
                <p style={{fontSize:13,color:aiLoad?"#CCC":"#444",lineHeight:1.6}}>{aiLoad?"Analisi in corso…":aiText}</p>
              </div>
            </div>
          )}

          {/* Results header */}
          {searched&&!loading && (
            <div className="up" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:6}}>
              <p style={{fontSize:12,color:"#888"}}>
                <span style={{color:"#1A1A1A",fontWeight:600}}>{trains.length}</span> treni trovati oggi
                {sorted[0]&&<> · da <span style={{color:"#009246",fontWeight:600}}>€{sorted[0].price}</span></>}
              </p>
              <div style={{display:"flex",gap:4}}>
                {[["price","Prezzo"],["duration","Durata"],["departure","Orario"]].map(([k,l])=>(
                  <Chip key={k} active={sortBy===k} onClick={()=>setSort(k)}>{l}</Chip>
                ))}
              </div>
            </div>
          )}

          {/* Loader */}
          {loading && <><TrainLoader msg={loadMsg}/>{[1,2,3].map(i=><SkeletonCard key={i}/>)}</>}

          {/* Train list */}
          {!loading && sorted.map(t=>(
            <TrainCard key={t.id} t={t} onView={t=>navigate("detail",t)}/>
          ))}

          {/* Empty */}
          {searched&&!loading&&trains.length===0 && (
            <div className="card" style={{padding:"48px 20px",textAlign:"center"}}>
              <p style={{fontFamily:"var(--serif)",fontSize:20,marginBottom:7}}>Nessun treno trovato</p>
              <p style={{fontSize:13,color:"#AAA"}}>Modifica i filtri o la data di ricerca.</p>
            </div>
          )}

          {/* Welcome */}
          {!searched&&!loading && (
            <div className="up" style={{textAlign:"center",padding:"32px 20px"}}>
              <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
                <Logo s={52}/>
              </div>
              <p style={{fontFamily:"var(--serif)",fontSize:22,marginBottom:6}}>Dove vuoi andare?</p>
              <p style={{fontSize:13,color:"#AAA",lineHeight:1.6,marginBottom:20}}>Cerca treni in partenza da oggi in poi.</p>
              <div style={{display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center"}}>
                {[["Roma","Milano"],["Milano","Venezia"],["Napoli","Roma"],["Firenze","Bologna"]].map(([a,b])=>(
                  <button key={`${a}-${b}`} onClick={()=>{setFrom(a);setTo(b);}} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 14px",borderRadius:20,background:"#fff",border:"1px solid #E8E4DC",fontSize:12,color:"#555",cursor:"pointer",transition:"all .15s",boxShadow:"var(--shadow)"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="#009246";e.currentTarget.style.color="#009246";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#E8E4DC";e.currentTarget.style.color="#555";}}>
                    <IcoTrain s={11}/>{a} → {b}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ── BOTTOM NAV ── */}
      <BottomNav page={navPage} onChange={switchNav} savedCount={saved.length}/>
    </div>
  );
}
