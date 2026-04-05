import { useState, useEffect } from "react";

const CLAUDE_MODEL = "claude-sonnet-4-20250514";

// ── SVG Icons ────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", sw = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p,i) => <path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const IcoTrain    = ({s=18}) => <Icon size={s} d={["M9 3h6l1 8H8L9 3z","M8 11v5a2 2 0 0 0 4 0v0a2 2 0 0 0 4 0v-5","M6 21h12","M9 21v-2","M15 21v-2","M12 3v8"]}/>;
const IcoSearch   = ({s=15}) => <Icon size={s} d={["M21 21l-4.35-4.35","M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"]}/>;
const IcoSwap     = () => <Icon size={15} d={["M7 16V4m0 0L3 8m4-4 4 4","M17 8v12m0 0 4-4m-4 4-4-4"]}/>;
const IcoFilter   = () => <Icon size={14} d="M3 6h18M7 12h10M11 18h2"/>;
const IcoWifi     = () => <Icon size={13} d={["M5 12.55a11 11 0 0 1 14.08 0","M1.42 9a16 16 0 0 1 21.16 0","M8.53 16.11a6 6 0 1 6.95 0","M12 20h.01"]}/>;
const IcoClock    = ({s=13}) => <Icon size={s} d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6v6l4 2"]}/>;
const IcoChevron  = ({up,s=13}) => <Icon size={s} d={up?"M18 15l-6-6-6 6":"M6 9l6 6 6-6"}/>;
const IcoOk       = () => <Icon size={13} d="M20 6L9 17l-5-5" sw={2}/>;
const IcoWarn     = ({s=13}) => <Icon size={s} d={["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"]}/>;
const IcoMapPin   = ({s=14}) => <Icon size={s} d={["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z","M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4"]}/>;
const IcoWalk     = ({s=14}) => <Icon size={s} d={["M13 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z","M7 21l3-7 2 2 2-4 4 9","M5 13l2-4 4 2 2-2"]}/>;
const IcoBus      = ({s=14}) => <Icon size={s} d={["M8 6v6","M16 6v6","M2 12h19.6","M18 18h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2","M8 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0","M14 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0"]}/>;
const IcoEuro     = ({s=14}) => <Icon size={s} d={["M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z","M20.5 10H14","M7.5 4c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5H18","M4 20.5c0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-13c-.83 0-1.5.67-1.5 1.5v3z"]}/>;
const IcoDelay    = ({s=14}) => <Icon size={s} d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6v6l4 2","M16 2l4 2-4 2"]}/>;
const IcoArrowR   = ({s=14}) => <Icon size={s} d="M5 12h14M13 6l6 6-6 6"/>;
const IcoHome     = ({s=16}) => <Icon size={s} d={["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z","M9 22V12h6v10"]}/>;
const IcoX        = ({s=14}) => <Icon size={s} d="M18 6L6 18M6 6l12 12"/>;
const IcoFood     = ({s=13}) => <Icon size={s} d={["M18 8h1a4 4 0 0 1 0 8h-1","M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z","M6 1v3","M10 1v3","M14 1v3"]}/>;
const IcoLeaf     = ({s=13}) => <Icon size={s} d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1C7 19 7 19 9 19h5c3 0 8-3 8-9-3 0-5 0-5-2z"/>;

// ── Data ─────────────────────────────────────────────────────────────────────
const CITIES = ["Roma","Milano","Napoli","Torino","Firenze","Bologna","Venezia","Bari",
  "Palermo","Genova","Verona","Padova","Trieste","Brescia","Ancona","Catania",
  "Messina","Salerno","Pisa","Perugia","Trento","Bolzano","Cagliari","Pescara",
  "Modena","Parma","Reggio Emilia","Reggio Calabria"];

const TTYPES = [
  {id:"all",label:"Tutti"},{id:"FR",label:"Frecciarossa"},{id:"FA",label:"Frecciargento"},
  {id:"FB",label:"Frecciabianca"},{id:"IC",label:"Intercity"},{id:"RE",label:"Regionale"},{id:"RV",label:"Reg. Veloce"},
];

const META = {
  FR:{color:"#C0392B",label:"Frecciarossa",dot:"#e74c3c"},
  FA:{color:"#7D3C98",label:"Frecciargento",dot:"#9b59b6"},
  FB:{color:"#1A6BA0",label:"Frecciabianca",dot:"#2980b9"},
  IC:{color:"#1E8449",label:"Intercity",dot:"#27ae60"},
  RE:{color:"#BA4A00",label:"Regionale",dot:"#e67e22"},
  RV:{color:"#117A65",label:"Reg. Veloce",dot:"#16a085"},
};

// City center distance data (km from main station)
const CITY_INFO = {
  Roma:    {center:"Termini → Centro",walk:15,bus:8,taxi:12,metro:"Metro A/B disp.",landmark:"Colosseo, Trastevere"},
  Milano:  {center:"Centrale → Duomo",walk:20,bus:10,taxi:15,metro:"Metro M2/M3 disp.",landmark:"Duomo, Navigli"},
  Napoli:  {center:"Centrale → Spaccanapoli",walk:12,bus:7,taxi:10,metro:"Metro L1/L2 disp.",landmark:"Piazza del Plebiscito"},
  Firenze: {center:"S.M.N. → Duomo",walk:10,bus:0,taxi:8,metro:"No metro",landmark:"Duomo, Uffizi"},
  Bologna: {center:"Centrale → Piazza Maggiore",walk:18,bus:12,taxi:15,metro:"Bus veloce",landmark:"Piazza Maggiore"},
  Venezia: {center:"S.Lucia → Rialto",walk:25,bus:0,taxi:0,metro:"Vaporetto disp.",landmark:"Rialto, San Marco"},
  Torino:  {center:"Porta Nuova → Piazza Castello",walk:12,bus:8,taxi:10,metro:"Metro M1 disp.",landmark:"Mole Antonelliana"},
  Verona:  {center:"P.Nuova → Arena",walk:18,bus:10,taxi:12,metro:"No metro",landmark:"Arena di Verona"},
  Padova:  {center:"Centrale → Piazza Erbe",walk:15,bus:8,taxi:10,metro:"Tram disp.",landmark:"Basilica S.Antonio"},
  Bari:    {center:"Centrale → Città Vecchia",walk:10,bus:6,taxi:8,metro:"Bus disp.",landmark:"Castello Svevo"},
  Genova:  {center:"Piazza Principe → Porto",walk:12,bus:7,taxi:10,metro:"Metro disp.",landmark:"Porto Antico"},
  Trieste: {center:"Centrale → Piazza Unità",walk:20,bus:10,taxi:12,metro:"No metro",landmark:"Piazza Unità d'Italia"},
};

const getCity = (c) => CITY_INFO[c] || {center:`${c} Centrale → Centro`,walk:15,bus:8,taxi:12,metro:"Info non disponibile",landmark:"Centro città"};

const STOPS = {"Roma-Milano":["Firenze","Bologna"],"Milano-Roma":["Bologna","Firenze"],"Milano-Venezia":["Verona","Padova"],"Venezia-Milano":["Padova","Verona"]};
const getStops = (f,t) => (STOPS[`${f}-${t}`]||["Bologna","Firenze","Verona"]).filter(c=>c!==f&&c!==t);

// Delay simulation data
const DELAY_TRAINS = [
  {id:"FR9610",route:"Roma → Milano",dep:"06:00",delay:0,platform:5,status:"in-orario",type:"FR"},
  {id:"FR9614",route:"Milano → Roma",dep:"06:25",delay:8,platform:3,status:"ritardo",type:"FR"},
  {id:"FA8300",route:"Roma → Venezia",dep:"07:10",delay:22,platform:7,status:"ritardo",type:"FA"},
  {id:"IC504",route:"Torino → Napoli",dep:"07:35",delay:0,platform:2,status:"in-orario",type:"IC"},
  {id:"FR9620",route:"Roma → Torino",dep:"08:00",delay:5,platform:4,status:"ritardo",type:"FR"},
  {id:"RE2241",route:"Bologna → Pisa",dep:"08:15",delay:45,platform:9,status:"grave",type:"RE"},
  {id:"FB8800",route:"Roma → Bari",dep:"08:40",delay:0,platform:1,status:"in-orario",type:"FB"},
  {id:"RV3102",route:"Milano → Genova",dep:"09:00",delay:12,platform:6,status:"ritardo",type:"RV"},
  {id:"FR9630",route:"Milano → Napoli",dep:"09:15",delay:0,platform:5,status:"in-orario",type:"FR"},
  {id:"RE4450",route:"Venezia → Trieste",dep:"09:30",delay:33,platform:8,status:"grave",type:"RE"},
  {id:"IC640",route:"Genova → Roma",dep:"09:55",delay:7,platform:3,status:"ritardo",type:"IC"},
  {id:"FA8320",route:"Firenze → Napoli",dep:"10:10",delay:0,platform:2,status:"in-orario",type:"FA"},
];

function genTrains(from, to, filters) {
  const types = ["FR","FA","FB","IC","RE","RV"];
  const prices = {FR:45,FA:38,FB:28,IC:22,RE:8,RV:12};
  const durs   = {FR:90,FA:110,FB:140,IC:160,RE:220,RV:180};
  const stops  = getStops(from, to);
  const out    = [];

  for (let i=0; i<20; i++) {
    const type   = types[i % 6];
    const depH   = 5 + Math.floor(i * 1.1);
    const depM   = (i * 17) % 60;
    const nCh    = i%3===0 ? 0 : i%3===1 ? 1 : 2;
    const durMin = durs[type] + (i*7)%40;
    const totM   = depH*60+depM+durMin;
    const arrH   = Math.floor(totM/60)%24;
    const arrM   = totM%60;
    const price  = prices[type] + (i*3)%35;

    const legs = [];
    if (nCh>0) {
      const ls = stops.slice(0,nCh);
      let cur = depH*60+depM;
      const ld = Math.floor(durMin/(nCh+1));
      ls.forEach((stop,li)=>{
        const wait = 12+(i*7+li*11)%48;
        const le   = cur+ld;
        const h2   = n=>String(Math.floor(n/60)%24).padStart(2,"0");
        const m2   = n=>String(n%60).padStart(2,"0");
        legs.push({from:li===0?from:ls[li-1],to:stop,
          dep:`${h2(cur)}:${m2(cur)}`,arr:`${h2(le)}:${m2(le)}`,
          waitMin:wait,platform:1+(i+li)%12,trainId:`${types[(i+li+1)%6]}${2000+i*10+li}`});
        cur=le+wait;
      });
      const h2=n=>String(Math.floor(n/60)%24).padStart(2,"0");
      const m2=n=>String(n%60).padStart(2,"0");
      legs.push({from:ls[ls.length-1],to,dep:`${h2(cur)}:${m2(cur)}`,
        arr:`${String(arrH).padStart(2,"0")}:${String(arrM).padStart(2,"0")}`,
        waitMin:0,platform:1+(i+5)%12,trainId:`${type}${1000+i}`});
    }

    if (filters.trainType!=="all" && type!==filters.trainType) continue;
    if (filters.maxPrice && price>+filters.maxPrice) continue;
    if (filters.directOnly && nCh>0) continue;
    if (filters.withChanges && nCh===0) continue;
    if (filters.wifiOnly && !(type==="FR"||type==="FA")) continue;
    if (filters.timeRange==="morning"   && (depH<6||depH>=12)) continue;
    if (filters.timeRange==="afternoon" && (depH<12||depH>=18)) continue;
    if (filters.timeRange==="evening"   && depH<18) continue;
    if (nCh>0 && legs.length>1) {
      const ws = legs.slice(0,-1).map(l=>l.waitMin);
      if (filters.minConn && Math.min(...ws)<+filters.minConn) continue;
      if (filters.maxConn && Math.max(...ws)>+filters.maxConn) continue;
    }

    out.push({
      id:`${type}${1000+i}`,type,name:META[type].label,
      dep:`${String(depH%24).padStart(2,"0")}:${String(depM).padStart(2,"0")}`,
      arr:`${String(arrH).padStart(2,"0")}:${String(arrM).padStart(2,"0")}`,
      durMin,dur:`${Math.floor(durMin/60)}h ${durMin%60}m`,
      price,seats:20+(i*37)%200,onTime:i%5!==0,
      changes:nCh,legs,from,to,
      wifi:type==="FR"||type==="FA",food:type==="FR"||type==="FA"||type==="IC",
      co2:Math.floor(durMin*0.8),
    });
  }
  return out;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Drop({items, onSel}) {
  return (
    <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#fff",border:"1px solid #E5E2DC",borderRadius:10,zIndex:100,boxShadow:"0 8px 24px rgba(0,0,0,.1)",overflow:"hidden"}}>
      {items.map(c=>(
        <div key={c} className="sugitem" onMouseDown={()=>onSel(c)}
          style={{padding:"10px 14px",fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",color:"#333",display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:"#BBB"}}><IcoMapPin s={12}/></span>{c}
        </div>
      ))}
    </div>
  );
}

function Tog({label, checked, onChange}) {
  return (
    <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",userSelect:"none"}}>
      <div onClick={()=>onChange(!checked)} style={{
        width:32,height:18,borderRadius:9,background:checked?"#1A1A1A":"#D9D6D0",
        position:"relative",transition:"background .2s",flexShrink:0,cursor:"pointer",
      }}>
        <div style={{position:"absolute",top:3,left:checked?15:3,width:12,height:12,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
      </div>
      <span style={{fontSize:12,color:"#666",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>{label}</span>
    </label>
  );
}

function Slider({label, max, color, value, empty, onChange, onClear, hint}) {
  return (
    <div style={{flex:"1 1 200px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{fontSize:11,color:"#9A9690",letterSpacing:.4,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>{label}</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {!empty&&<span style={{fontSize:13,color,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>{value} min</span>}
          {!empty&&<button onClick={onClear} style={{background:"none",border:"none",cursor:"pointer",color:"#CCC",padding:0,display:"flex"}}><IcoX s={12}/></button>}
          {empty&&<span style={{fontSize:12,color:"#C0BBAF",fontFamily:"'DM Sans',sans-serif"}}>—</span>}
        </div>
      </div>
      <input type="range" min={0} max={max} value={value||0} onChange={e=>onChange(e.target.value)}
        style={{width:"100%",accentColor:color}}/>
      {hint&&<p style={{fontSize:10,color:"#C0BBAF",marginTop:4,fontFamily:"'DM Sans',sans-serif"}}>{hint}</p>}
    </div>
  );
}

// ── City Info Card ─────────────────────────────────────────────────────────
function CityInfoCard({city}) {
  const info = getCity(city);
  return (
    <div style={{background:"#fff",borderRadius:14,padding:"18px 20px",border:"1px solid #EDEAE4",flex:"1 1 260px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <span style={{color:"#E63946"}}><IcoMapPin s={16}/></span>
        <span style={{fontFamily:"'DM Serif Display',serif",fontSize:16,color:"#1A1A1A"}}>{city}</span>
      </div>
      <p style={{fontSize:11,color:"#AAA",letterSpacing:.5,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginBottom:10}}>{info.center}</p>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:"#4A90E2"}}><IcoWalk s={13}/></span>
          <span style={{fontSize:13,color:"#555",fontFamily:"'DM Sans',sans-serif"}}>A piedi: <strong>{info.walk} min</strong></span>
        </div>
        {info.bus>0&&<div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:"#E67E22"}}><IcoBus s={13}/></span>
          <span style={{fontSize:13,color:"#555",fontFamily:"'DM Sans',sans-serif"}}>Bus/Tram: <strong>{info.bus} min</strong></span>
        </div>}
        {info.taxi>0&&<div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:"#F1C40F"}}><IcoEuro s={13}/></span>
          <span style={{fontSize:13,color:"#555",fontFamily:"'DM Sans',sans-serif"}}>Taxi: <strong>~€{info.taxi}</strong></span>
        </div>}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:"#9B59B6"}}><IcoTrain s={13}/></span>
          <span style={{fontSize:13,color:"#555",fontFamily:"'DM Sans',sans-serif"}}>{info.metro}</span>
        </div>
      </div>
      <div style={{marginTop:12,padding:"8px 12px",background:"#F9F8F6",borderRadius:8}}>
        <span style={{fontSize:11,color:"#AAA",fontFamily:"'DM Sans',sans-serif"}}>🏛 {info.landmark}</span>
      </div>
    </div>
  );
}

// ── Delay Board ─────────────────────────────────────────────────────────────
function DelayBoard({onClose}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = DELAY_TRAINS.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) || t.route.toLowerCase().includes(search.toLowerCase());
    if (filter==="all") return matchSearch;
    if (filter==="delayed") return matchSearch && t.delay>0;
    if (filter==="ontime") return matchSearch && t.delay===0;
    if (filter==="serious") return matchSearch && t.delay>=30;
    return matchSearch;
  });

  const statusColor = (s) => s==="in-orario"?"#27AE60":s==="grave"?"#E74C3C":"#E67E22";
  const statusLabel = (s) => s==="in-orario"?"In orario":s==="grave"?"Grave ritardo":"Ritardo";
  const delayOntime = DELAY_TRAINS.filter(t=>t.delay===0).length;
  const delayAvg = Math.round(DELAY_TRAINS.filter(t=>t.delay>0).reduce((a,t)=>a+t.delay,0)/DELAY_TRAINS.filter(t=>t.delay>0).length);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:700,maxHeight:"85vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(0,0,0,.2)"}}>

        {/* Header */}
        <div style={{padding:"22px 28px 16px",borderBottom:"1px solid #F0EDE8",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#1A1A1A"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{color:"#F5F3EE"}}><IcoDelay s={18}/></span>
            <span style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:"#F5F3EE"}}>Monitor Ritardi</span>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <IcoX s={16}/>
          </button>
        </div>

        {/* Stats bar */}
        <div style={{display:"flex",gap:0,background:"#F9F8F6",borderBottom:"1px solid #EDEAE4"}}>
          {[
            {label:"Totali",value:DELAY_TRAINS.length,color:"#1A1A1A"},
            {label:"In orario",value:delayOntime,color:"#27AE60"},
            {label:"In ritardo",value:DELAY_TRAINS.length-delayOntime,color:"#E67E22"},
            {label:"Ritardo medio",value:`${delayAvg} min`,color:"#E74C3C"},
          ].map((s,i)=>(
            <div key={i} style={{flex:1,padding:"14px 16px",borderRight:i<3?"1px solid #EDEAE4":"none",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:700,color:s.color,fontFamily:"'DM Sans',sans-serif"}}>{s.value}</div>
              <div style={{fontSize:10,color:"#AAA",letterSpacing:.5,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div style={{padding:"14px 20px",display:"flex",gap:10,alignItems:"center",borderBottom:"1px solid #F0EDE8",flexWrap:"wrap"}}>
          <div style={{flex:1,position:"relative",minWidth:180}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#CCC"}}><IcoSearch s={14}/></span>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Cerca treno o tratta…"
              style={{width:"100%",background:"#F9F8F6",border:"1px solid #E5E2DC",borderRadius:9,padding:"9px 14px 9px 34px",fontSize:13,color:"#1A1A1A",outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
          </div>
          {[["all","Tutti"],["ontime","In orario"],["delayed","In ritardo"],["serious","Grave (≥30m)"]].map(([k,l])=>(
            <button key={k} onClick={()=>setFilter(k)} style={{
              padding:"7px 14px",borderRadius:20,fontSize:12,fontFamily:"'DM Sans',sans-serif",
              border:`1px solid ${filter===k?"#1A1A1A":"#E5E2DC"}`,
              background:filter===k?"#1A1A1A":"#fff",
              color:filter===k?"#fff":"#666",cursor:"pointer",
            }}>{l}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{overflowY:"auto",flex:1}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:"#F9F8F6"}}>
                {["Treno","Tratta","Partenza","Binario","Stato","Ritardo"].map(h=>(
                  <th key={h} style={{padding:"10px 16px",fontSize:10,color:"#AAA",letterSpacing:.6,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",textAlign:"left",borderBottom:"1px solid #EDEAE4",fontWeight:500}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t,i)=>(
                <tr key={t.id} style={{borderBottom:"1px solid #F5F3EE",background:i%2===0?"#fff":"#FEFEFE"}}>
                  <td style={{padding:"13px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:META[t.type].dot,flexShrink:0}}/>
                      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#1A1A1A"}}>{t.id}</span>
                    </div>
                    <div style={{fontSize:10,color:"#AAA",fontFamily:"'DM Sans',sans-serif",marginTop:2,paddingLeft:14}}>{META[t.type].label}</div>
                  </td>
                  <td style={{padding:"13px 16px",fontSize:13,color:"#555",fontFamily:"'DM Sans',sans-serif"}}>{t.route}</td>
                  <td style={{padding:"13px 16px",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#1A1A1A"}}>{t.dep}</td>
                  <td style={{padding:"13px 16px"}}>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,background:"#F0EDE8",padding:"3px 8px",borderRadius:6,color:"#666"}}>Bin.{t.platform}</span>
                  </td>
                  <td style={{padding:"13px 16px"}}>
                    <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:500,
                      background:statusColor(t.status)+"15",color:statusColor(t.status)}}>
                      {t.status==="in-orario"?<IcoOk/>:<IcoWarn s={11}/>}
                      {statusLabel(t.status)}
                    </span>
                  </td>
                  <td style={{padding:"13px 16px"}}>
                    {t.delay===0
                      ?<span style={{fontSize:13,color:"#27AE60",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>—</span>
                      :<span style={{fontSize:13,color:t.delay>=30?"#E74C3C":"#E67E22",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>+{t.delay} min</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0&&(
            <div style={{padding:"40px",textAlign:"center",color:"#CCC",fontFamily:"'DM Sans',sans-serif",fontSize:14}}>Nessun treno trovato</div>
          )}
        </div>

        <div style={{padding:"12px 20px",borderTop:"1px solid #F0EDE8",background:"#F9F8F6"}}>
          <p style={{fontSize:11,color:"#CCC",fontFamily:"'DM Sans',sans-serif",textAlign:"center"}}>Dati aggiornati simulati · Aggiornamento ogni 2 min</p>
        </div>
      </div>
    </div>
  );
}

// ── Train Card ────────────────────────────────────────────────────────────────
function TrainCard({t, expanded, onToggle}) {
  const m = META[t.type];
  return (
    <div className="hov-card fu" style={{background:"#fff",borderRadius:14,border:"1px solid #EDEAE4",overflow:"hidden",marginBottom:10,cursor:"pointer"}} onClick={onToggle}>
      <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>

        {/* Type badge */}
        <div style={{flexShrink:0,width:44,height:44,borderRadius:10,background:m.color+"18",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:2}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:m.dot}}/>
          <span style={{fontSize:9,fontWeight:700,color:m.color,fontFamily:"'DM Sans',sans-serif",letterSpacing:.5}}>{t.type}</span>
        </div>

        {/* Times */}
        <div style={{flex:"0 0 auto"}}>
          <div style={{display:"flex",alignItems:"baseline",gap:10}}>
            <span style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#1A1A1A",letterSpacing:-0.5}}>{t.dep}</span>
            <span style={{color:"#DDD",fontSize:14}}>→</span>
            <span style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#1A1A1A",letterSpacing:-0.5}}>{t.arr}</span>
          </div>
          <div style={{display:"flex",gap:10,marginTop:4,alignItems:"center"}}>
            <span style={{fontSize:11,color:"#AAA",fontFamily:"'DM Sans',sans-serif"}}>{t.dur}</span>
            {t.changes===0
              ?<span style={{fontSize:11,color:"#27AE60",background:"#E8F8EE",padding:"2px 7px",borderRadius:10,fontFamily:"'DM Sans',sans-serif"}}>Diretto</span>
              :<span style={{fontSize:11,color:"#E67E22",background:"#FEF3E2",padding:"2px 7px",borderRadius:10,fontFamily:"'DM Sans',sans-serif"}}>{t.changes} cambio</span>}
          </div>
        </div>

        {/* Route */}
        <div style={{flex:1,minWidth:100}}>
          <div style={{fontSize:12,color:"#888",fontFamily:"'DM Sans',sans-serif"}}>{t.from} → {t.to}</div>
          <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>
            {t.wifi&&<span title="Wi-Fi" style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:"#4A90E2",fontFamily:"'DM Sans',sans-serif"}}><IcoWifi/>Wi-Fi</span>}
            {t.food&&<span style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:"#9B59B6",fontFamily:"'DM Sans',sans-serif"}}><IcoFood/>Ristoro</span>}
            <span style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:"#27AE60",fontFamily:"'DM Sans',sans-serif"}}><IcoLeaf/>{t.co2}g CO₂</span>
          </div>
        </div>

        {/* Status */}
        <div style={{flexShrink:0,textAlign:"center"}}>
          {t.onTime
            ?<span style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#27AE60",fontFamily:"'DM Sans',sans-serif"}}><IcoOk/>Puntuale</span>
            :<span style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#E67E22",fontFamily:"'DM Sans',sans-serif"}}><IcoWarn s={11}/>Ritardi</span>}
          <div style={{fontSize:10,color:"#CCC",fontFamily:"'DM Sans',sans-serif",marginTop:2}}>{t.seats} posti</div>
        </div>

        {/* Price */}
        <div style={{flexShrink:0,textAlign:"right"}}>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:24,color:"#1A1A1A",letterSpacing:-0.5}}>€{t.price}</div>
          <div style={{fontSize:10,color:"#BBB",fontFamily:"'DM Sans',sans-serif"}}>per persona</div>
        </div>

        <div style={{flexShrink:0,color:"#CCC",transition:"transform .2s",transform:expanded?"rotate(180deg)":""}}>
          <IcoChevron s={14}/>
        </div>
      </div>

      {/* Expanded details */}
      {expanded&&(
        <div style={{borderTop:"1px solid #F5F3EE",padding:"18px 20px",background:"#FDFCFB"}}>
          <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
            {/* Train ID */}
            <div style={{flex:"0 0 auto"}}>
              <p style={{fontSize:10,color:"#AAA",letterSpacing:.5,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>Treno</p>
              <p style={{fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif",color:"#333"}}>{t.id}</p>
            </div>
            <div style={{flex:"0 0 auto"}}>
              <p style={{fontSize:10,color:"#AAA",letterSpacing:.5,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>Tipologia</p>
              <p style={{fontSize:14,fontFamily:"'DM Sans',sans-serif",color:m.color,fontWeight:500}}>{m.label}</p>
            </div>
            <div style={{flex:"0 0 auto"}}>
              <p style={{fontSize:10,color:"#AAA",letterSpacing:.5,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>Totale ({t.changes+1} {t.changes===0?"treno":"treni"})</p>
              <p style={{fontSize:14,fontFamily:"'DM Serif Display',serif",color:"#1A1A1A"}}>€{t.price * 1} per persona</p>
            </div>
          </div>

          {t.changes>0&&t.legs.length>0&&(
            <div style={{marginTop:16}}>
              <p style={{fontSize:10,color:"#AAA",letterSpacing:.5,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginBottom:12}}>Itinerario dettagliato</p>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {t.legs.map((leg,i)=>(
                  <div key={i}>
                    <div style={{display:"flex",alignItems:"center",gap:12,background:"#fff",borderRadius:10,padding:"10px 14px",border:"1px solid #EDEAE4"}}>
                      <span style={{fontSize:11,fontWeight:700,color:"#555",fontFamily:"'DM Sans',sans-serif",minWidth:32}}>{leg.dep}</span>
                      <span style={{flex:1,fontSize:12,color:"#888",fontFamily:"'DM Sans',sans-serif"}}>{leg.from} → {leg.to}</span>
                      <span style={{fontSize:11,color:"#AAA",fontFamily:"'DM Sans',sans-serif"}}>{leg.arr}</span>
                      <span style={{fontSize:10,color:"#777",background:"#F0EDE8",padding:"2px 7px",borderRadius:5,fontFamily:"'DM Sans',sans-serif"}}>Bin.{leg.platform}</span>
                      <span style={{fontSize:10,color:"#999",fontFamily:"'DM Sans',sans-serif"}}>{leg.trainId}</span>
                    </div>
                    {leg.waitMin>0&&(
                      <div style={{textAlign:"center",padding:"4px 0",fontSize:11,color:"#B07D2A",fontFamily:"'DM Sans',sans-serif"}}>
                        ⏱ Attesa {leg.waitMin} min per cambio
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page,   setPage]  = useState("search"); // "search" | "delays"
  const [from,   setFrom]  = useState("Roma");
  const [to,     setTo]    = useState("Milano");
  const [date,   setDate]  = useState(new Date().toISOString().split("T")[0]);
  const [pax,    setPax]   = useState(1);
  const [trains, setTrain] = useState([]);
  const [loading,setLoad]  = useState(false);
  const [searched,setSrch] = useState(false);
  const [expanded,setExp]  = useState(null);
  const [sortBy,  setSort] = useState("price");
  const [aiText,  setAiText] = useState("");
  const [aiLoad,  setAiLoad] = useState(false);
  const [showConn,setConn] = useState(false);
  const [fromQ,   setFromQ] = useState([]);
  const [toQ,     setToQ]   = useState([]);
  const [showDelays,setShowDelays] = useState(false);
  const [filters, setF]    = useState({
    trainType:"all",maxPrice:"",directOnly:false,wifiOnly:false,
    timeRange:"all",withChanges:false,minConn:"",maxConn:"",
  });

  const sug = (v,set) => set(v?CITIES.filter(c=>c.toLowerCase().startsWith(v.toLowerCase())).slice(0,5):[]);
  const swap = () => {setFrom(to);setTo(from);};

  const search = async () => {
    if (!from||!to) return;
    setLoad(true); setSrch(false); setExp(null); setAiText("");
    await new Promise(r=>setTimeout(r,650));
    let res = genTrains(from,to,filters);
    if (sortBy==="price")     res.sort((a,b)=>a.price-b.price);
    if (sortBy==="duration")  res.sort((a,b)=>a.durMin-b.durMin);
    if (sortBy==="departure") res.sort((a,b)=>a.dep.localeCompare(b.dep));
    setTrain(res); setLoad(false); setSrch(true);

    setAiLoad(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:CLAUDE_MODEL,max_tokens:1000,messages:[{role:"user",
          content:`Tratta: ${from}→${to}, ${date}, ${pax} passeggero/i.
Treni: ${res.slice(0,5).map(t=>`${t.id} ${t.dep}-${t.arr} ${t.dur} €${t.price} ${t.changes===0?"diretto":t.changes+" cambio/i"}`).join("; ")}
Consiglio in 2 frasi, italiano, pratico.`}]})
      });
      const d = await r.json();
      setAiText(d.content?.[0]?.text||"");
    } catch { setAiText("Consiglio non disponibile."); }
    setAiLoad(false);
  };

  const sorted = [...trains].sort((a,b)=>
    sortBy==="price"?a.price-b.price:sortBy==="duration"?a.durMin-b.durMin:a.dep.localeCompare(b.dep)
  );

  const INP = {width:"100%",background:"#F9F8F6",border:"1px solid #E5E2DC",borderRadius:9,padding:"10px 14px",fontSize:14,color:"#1A1A1A",outline:"none",fontFamily:"'DM Sans',sans-serif"};
  const LBL = {display:"block",fontSize:11,color:"#9A9690",letterSpacing:.5,textTransform:"uppercase",marginBottom:6,fontFamily:"'DM Sans',sans-serif"};

  return (
    <div style={{minHeight:"100vh",background:"#F5F3EE",fontFamily:"'Palatino Linotype',serif",color:"#1A1A1A"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input[type=range]{-webkit-appearance:none;height:2px;border-radius:2px;outline:none;cursor:pointer;background:#E5E2DC;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.18);}
        input,select{font-family:inherit;}
        .hov-card{transition:box-shadow .18s,transform .18s;}
        .hov-card:hover{box-shadow:0 4px 24px rgba(0,0,0,.08);transform:translateY(-1px);}
        .chip{transition:background .14s,color .14s,border-color .14s;cursor:pointer;}
        .sugitem:hover{background:#EDE9E1;}
        @keyframes fu{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        .fu{animation:fu .3s ease both;}
        input[type=date]::-webkit-calendar-picker-indicator{opacity:.4;cursor:pointer;}
        .nav-btn{transition:all .15s;cursor:pointer;}
        .nav-btn:hover{background:rgba(255,255,255,.12)!important;}
        .nav-btn.active{background:rgba(255,255,255,.15)!important;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:#F0EDE8;}
        ::-webkit-scrollbar-thumb{background:#D0CBC4;border-radius:3px;}
      `}</style>

      {/* ── TOPBAR ── */}
      <header style={{background:"#1A1A1A",padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,0,0,.15)"}}>

        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>{setSrch(false);setTrain([]);}}>
          <div style={{width:32,height:32,borderRadius:8,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"#F5F3EE"}}><IcoTrain s={17}/></span>
          </div>
          <span style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:"#F5F3EE",letterSpacing:.2}}>Treni Italia</span>
        </div>

        {/* Center nav */}
        <nav style={{display:"flex",alignItems:"center",gap:4}}>
          {[
            {id:"search", label:"Cerca", icon:<IcoSearch s={13}/>},
            {id:"delays", label:"Ritardi", icon:<IcoDelay s={13}/>},
          ].map(n=>(
            <button key={n.id} className={`nav-btn${page===n.id?" active":""}`}
              onClick={()=>{ if(n.id==="delays"){setShowDelays(true);}else{setPage(n.id);} }}
              style={{display:"flex",alignItems:"center",gap:6,padding:"7px 16px",borderRadius:8,border:"none",
                background:page===n.id?"rgba(255,255,255,.15)":"transparent",color:"#F5F3EE",
                fontSize:13,fontFamily:"'DM Sans',sans-serif",letterSpacing:.2}}>
              {n.icon}{n.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <span style={{fontSize:10,color:"#666",letterSpacing:1.5,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",display:"flex",gap:8,alignItems:"center"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#27AE60",display:"inline-block",boxShadow:"0 0 0 3px rgba(39,174,96,.2)"}}/>
            Live
          </span>
          <div style={{height:20,width:1,background:"rgba(255,255,255,.1)"}}/>
          <span style={{fontSize:11,color:"#555",letterSpacing:1,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Trenitalia · Italo</span>
        </div>
      </header>

      <main style={{maxWidth:960,margin:"0 auto",padding:"32px 20px"}}>

        {/* ── SEARCH CARD ── */}
        <div style={{background:"#fff",borderRadius:18,boxShadow:"0 2px 20px rgba(0,0,0,.06)",padding:"28px 32px",marginBottom:24}}>

          {/* Row 1 */}
          <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
            <div style={{flex:"1 1 148px",position:"relative"}}>
              <label style={LBL}>Partenza</label>
              <input value={from} onChange={e=>{setFrom(e.target.value);sug(e.target.value,setFromQ);}}
                onBlur={()=>setTimeout(()=>setFromQ([]),160)} style={INP} placeholder="Da…"/>
              {fromQ.length>0&&<Drop items={fromQ} onSel={c=>{setFrom(c);setFromQ([]);}}/>}
            </div>

            <button onClick={swap} style={{flexShrink:0,background:"none",border:"1px solid #E5E2DC",borderRadius:8,width:36,height:44,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#9A9690",transition:"all .15s"}}>
              <IcoSwap/>
            </button>

            <div style={{flex:"1 1 148px",position:"relative"}}>
              <label style={LBL}>Arrivo</label>
              <input value={to} onChange={e=>{setTo(e.target.value);sug(e.target.value,setToQ);}}
                onBlur={()=>setTimeout(()=>setToQ([]),160)} style={INP} placeholder="A…"/>
              {toQ.length>0&&<Drop items={toQ} onSel={c=>{setTo(c);setToQ([]);}}/>}
            </div>

            <div style={{flex:"1 1 130px"}}>
              <label style={LBL}>Data</label>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={INP}/>
            </div>

            <div style={{flex:"0 0 88px"}}>
              <label style={LBL}>Passeggeri</label>
              <select value={pax} onChange={e=>setPax(+e.target.value)} style={INP}>
                {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <button onClick={search} disabled={loading} style={{
              flexShrink:0,height:44,background:loading?"#CCC":"#1A1A1A",color:"#fff",
              border:"none",borderRadius:10,padding:"0 26px",fontSize:14,
              fontFamily:"'DM Sans',sans-serif",fontWeight:500,cursor:loading?"not-allowed":"pointer",
              display:"flex",alignItems:"center",gap:8,letterSpacing:.2,transition:"background .2s",
            }}>
              <IcoSearch s={14}/>{loading?"Ricerca…":"Cerca"}
            </button>
          </div>

          <div style={{height:1,background:"#F0EDE8",margin:"20px 0"}}/>

          {/* Filters row */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,color:"#CCC",marginRight:2}}>
              <IcoFilter/><span style={{fontSize:11,letterSpacing:.5,fontFamily:"'DM Sans',sans-serif",color:"#CCC"}}>Filtri</span>
            </div>
            {TTYPES.map(t=>(
              <button key={t.id} className="chip" onClick={()=>setF(f=>({...f,trainType:t.id}))} style={{
                padding:"4px 12px",borderRadius:20,fontSize:12,border:`1px solid ${filters.trainType===t.id?"#1A1A1A":"#E5E2DC"}`,
                background:filters.trainType===t.id?"#1A1A1A":"#fff",color:filters.trainType===t.id?"#fff":"#666",
                fontFamily:"'DM Sans',sans-serif",
              }}>{t.label}</button>
            ))}
            <div style={{width:1,height:16,background:"#E5E2DC"}}/>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:12,color:"#9A9690",fontFamily:"'DM Sans',sans-serif"}}>Max €</span>
              <input type="number" placeholder="—" value={filters.maxPrice}
                onChange={e=>setF(f=>({...f,maxPrice:e.target.value}))}
                style={{...INP,width:64,padding:"5px 10px",fontSize:13}}/>
            </div>
            <select value={filters.timeRange} onChange={e=>setF(f=>({...f,timeRange:e.target.value}))}
              style={{...INP,padding:"5px 10px",fontSize:12,width:"auto"}}>
              <option value="all">Qualsiasi ora</option>
              <option value="morning">Mattina (6–12)</option>
              <option value="afternoon">Pomeriggio (12–18)</option>
              <option value="evening">Sera (18–24)</option>
            </select>
            <Tog label="Diretti" checked={filters.directOnly} onChange={v=>setF(f=>({...f,directOnly:v,withChanges:v?false:f.withChanges}))}/>
            <Tog label="Wi-Fi" checked={filters.wifiOnly} onChange={v=>setF(f=>({...f,wifiOnly:v}))}/>
            <button className="chip" onClick={()=>setConn(v=>!v)} style={{
              padding:"4px 13px",borderRadius:20,fontSize:12,fontFamily:"'DM Sans',sans-serif",
              border:`1px solid ${showConn?"#B07D2A":"#E5E2DC"}`,
              background:showConn?"#FBF5E6":"#fff",
              color:showConn?"#8A6020":"#666",
              display:"flex",alignItems:"center",gap:5,
            }}>Coincidenze</button>
          </div>

          {showConn&&(
            <div style={{marginTop:18,padding:"20px 24px",background:"#FDFAF3",border:"1px solid #EDE5CE",borderRadius:12}}>
              <p style={{fontSize:11,color:"#8A6020",letterSpacing:.8,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginBottom:16}}>Filtro coincidenze</p>
              <div style={{marginBottom:14}}>
                <Tog label="Solo treni con coincidenze" checked={filters.withChanges}
                  onChange={v=>setF(f=>({...f,withChanges:v,directOnly:v?false:f.directOnly}))}/>
              </div>
              <div style={{display:"flex",gap:40,flexWrap:"wrap",marginBottom:16}}>
                <Slider label="Attesa minima" max={120} color="#B07D2A"
                  value={filters.minConn||0} empty={!filters.minConn}
                  onChange={v=>setF(f=>({...f,minConn:v==="0"?"":v}))}
                  onClear={()=>setF(f=>({...f,minConn:""}))}
                  hint="Tempo sufficiente per il cambio"/>
                <Slider label="Attesa massima" max={180} color="#4E8C6A"
                  value={filters.maxConn||180} empty={!filters.maxConn}
                  onChange={v=>setF(f=>({...f,maxConn:v==="180"?"":v}))}
                  onClear={()=>setF(f=>({...f,maxConn:""}))}
                  hint="Evita attese eccessive"/>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {[{label:"Veloce 10–20m",min:"10",max:"20"},{label:"Comoda 20–45m",min:"20",max:"45"},{label:"Rilassata 30–90m",min:"30",max:"90"},{label:"Qualsiasi",min:"",max:""}].map(p=>(
                  <button key={p.label} className="chip" onClick={()=>setF(f=>({...f,minConn:p.min,maxConn:p.max}))} style={{
                    padding:"4px 12px",borderRadius:20,fontSize:11,fontFamily:"'DM Sans',sans-serif",
                    border:"1px solid #E0D9C8",
                    background:filters.minConn===p.min&&filters.maxConn===p.max?"#1A1A1A":"#fff",
                    color:filters.minConn===p.min&&filters.maxConn===p.max?"#fff":"#888",
                  }}>{p.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── AI SUGGESTION ── */}
        {(aiText||aiLoad)&&(
          <div className="fu" style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:20,padding:"16px 20px",background:"#fff",borderRadius:12,border:"1px solid #EDEAE4",boxShadow:"0 1px 8px rgba(0,0,0,.04)"}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"#1A1A1A",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{color:"#fff",fontSize:13,fontFamily:"'DM Serif Display',serif"}}>A</span>
            </div>
            <div>
              <p style={{fontSize:10,color:"#CCC",letterSpacing:.8,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginBottom:5}}>Consiglio AI</p>
              {aiLoad
                ?<p style={{fontSize:14,color:"#CCC",fontFamily:"'DM Sans',sans-serif"}}>Analisi in corso…</p>
                :<p style={{fontSize:14,color:"#333",lineHeight:1.65,fontFamily:"'DM Sans',sans-serif"}}>{aiText}</p>}
            </div>
          </div>
        )}

        {/* ── CITY INFO (shown after search) ── */}
        {searched&&trains.length>0&&(
          <div className="fu" style={{marginBottom:20}}>
            <p style={{fontSize:11,color:"#AAA",letterSpacing:.8,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginBottom:12}}>Come raggiungere il centro</p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <CityInfoCard city={from}/>
              <CityInfoCard city={to}/>
            </div>
          </div>
        )}

        {/* ── RESULTS HEADER ── */}
        {searched&&(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
            <p style={{fontSize:14,color:"#888",fontFamily:"'DM Sans',sans-serif"}}>
              <span style={{color:"#1A1A1A",fontWeight:600}}>{trains.length}</span> treni trovati
              {sorted[0]&&<> · da <span style={{color:"#27AE60",fontWeight:600}}>€{sorted[0].price}</span></>}
            </p>
            <div style={{display:"flex",gap:6}}>
              {[["price","Prezzo"],["duration","Durata"],["departure","Orario"]].map(([k,l])=>(
                <button key={k} className="chip" onClick={()=>setSort(k)} style={{
                  padding:"5px 12px",borderRadius:20,fontSize:12,fontFamily:"'DM Sans',sans-serif",
                  border:`1px solid ${sortBy===k?"#1A1A1A":"#E5E2DC"}`,
                  background:sortBy===k?"#1A1A1A":"#fff",
                  color:sortBy===k?"#fff":"#666",
                }}>{l}</button>
              ))}
            </div>
          </div>
        )}

        {/* ── TRAIN CARDS ── */}
        {loading&&(
          <div style={{textAlign:"center",padding:"50px 0"}}>
            <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",gap:16}}>
              <div style={{width:40,height:40,border:"2px solid #E5E2DC",borderTop:"2px solid #1A1A1A",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
              <p style={{fontSize:13,color:"#AAA",fontFamily:"'DM Sans',sans-serif"}}>Ricerca in corso…</p>
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
          </div>
        )}

        {!loading&&sorted.map((t,i)=>(
          <TrainCard key={t.id} t={t}
            expanded={expanded===t.id}
            onToggle={()=>setExp(expanded===t.id?null:t.id)}/>
        ))}

        {searched&&!loading&&trains.length===0&&(
          <div style={{textAlign:"center",padding:"60px 20px",background:"#fff",borderRadius:14,border:"1px solid #EDEAE4"}}>
            <p style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#1A1A1A",marginBottom:8}}>Nessun treno trovato</p>
            <p style={{fontSize:14,color:"#AAA",fontFamily:"'DM Sans',sans-serif"}}>Prova a modificare i filtri o la data.</p>
          </div>
        )}

      </main>

      {/* ── DELAY BOARD MODAL ── */}
      {showDelays&&<DelayBoard onClose={()=>setShowDelays(false)}/>}
    </div>
  );
}
