import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowUpRight, ChevronRight, Crown, Flame, Search, Shield, Sparkles, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import './styles.css';

const WORLDS = [
  { id:'technology', name:'Technology', eyebrow:'THE BUILDERS', tone:'mint', subtitle:'Software, AI, hardware and the tools shaping what comes next.', topics:['AI','Software','Programming','Robotics','3D Printing','Hardware','Cloud','Open Source','Apps','Startups','SaaS','Data','AR/VR','Blockchain','Bitcoin','Tech'] },
  { id:'science', name:'Science', eyebrow:'THE FRONTIER', tone:'cyan', subtitle:'Questions, discoveries and machines pushing beyond the known.', topics:['Space','Rockets','Aerospace','Aviation','Engineering','Physics','Chemistry','Biology','Astronomy','Nuclear','Energy','Climate','Science','Mars','Earth'] },
  { id:'business', name:'Business', eyebrow:'THE MARKET', tone:'lavender', subtitle:'Capital, companies and the systems that move money.', topics:['Marketing','Advertising','E-commerce','Finance','Investing','Entrepreneurship','Consulting','Freelancing','Real Estate','Banking','Venture Capital','Productivity','Jobs','Money','Business'] },
  { id:'culture', name:'Culture', eyebrow:'THE SIGNAL', tone:'peach', subtitle:'The things people watch, play, listen to and obsess over.', topics:['Gaming','Music','Movies','Anime','Memes','YouTube','Streaming','TikTok','Football','Sports','Photography','Art','Fashion','Travel','Culture'] },
  { id:'places', name:'Places', eyebrow:'THE WORLD', tone:'gold', subtitle:'Countries, cities and the places that connect everything else.', topics:['Ireland','Dublin','Belfast','UK','London','Europe','USA','New York','California','Canada','Australia','Japan','South Korea','China','India','Singapore','Germany','France','Italy','World'] },
  { id:'life', name:'Life', eyebrow:'EVERYTHING ELSE', tone:'rose', subtitle:'Interests, ideas and the weird edges of the internet.', topics:['Cars','Coffee','Food','Fitness','Education','University','Work','Internet','Future','Freedom','Luxury','Everything','Nothing','Electric Cars','Design'] },
];

const SEEDED = {
  AI:{owner:'@northstar',stake:32}, Space:{owner:'@orbital',stake:47}, Ireland:{owner:'@foundry',stake:27}, Gaming:{owner:'@pixelworks',stake:41}, Photography:{owner:'@luma',stake:12},
};

const LINKS = {
  AI:['Data','Python','Robotics','SaaS','Software','Future'], Software:['Programming','Cloud','Apps','AI'], Programming:['JavaScript','Python','Open Source','Software'], Robotics:['3D Printing','Hardware','Engineering'], Startups:['SaaS','Venture Capital','Entrepreneurship','Tech'], Bitcoin:['Blockchain','Finance'],
  Space:['Rockets','Aerospace','Astronomy','Mars','Future'], Rockets:['Engineering','Space'], Aerospace:['Aviation','Engineering','Space'], Engineering:['Physics','3D Printing','Energy'], Earth:['Climate','Energy'], Astronomy:['Mars'],
  Finance:['Investing','Banking','Money','Venture Capital'], Marketing:['Advertising','E-commerce'], Business:['Money','Entrepreneurship'],
  Gaming:['YouTube','Streaming','Memes'], Music:['Movies','TikTok','Culture'], Football:['Sports'], Photography:['Art'], Fashion:['Art'], Travel:['Culture'],
  Ireland:['Dublin','Belfast'], UK:['London'], Europe:['France','Germany','Italy'], USA:['New York','California'], Japan:['South Korea'], World:['Europe','USA','UK'],
  Cars:['Electric Cars','Engineering'], Education:['University'], Design:['Art','Web Development'], Fitness:['Sports'], Food:['Travel'], Internet:['AI','Software','Gaming','YouTube','Marketing'], Future:['AI','Space'],
};

const toneClass = (tone) => `tone-${tone}`;
const priceFor = (topic) => SEEDED[topic] ? Math.max(SEEDED[topic].stake + 2, Math.ceil(SEEDED[topic].stake * 1.1)) : ({Tech:100,Internet:100,Everything:100,Earth:100,Business:100,World:100,AI:25,Space:25,Gaming:25,Bitcoin:25,Startups:25}[topic] || 10);

function topicOwner(topic){ return SEEDED[topic]?.owner || null; }
function topicStake(topic){ return SEEDED[topic]?.stake || priceFor(topic); }

function App(){
  const [worldId,setWorldId]=useState(null);
  const [activeTopic,setActiveTopic]=useState(null);
  const [hovered,setHovered]=useState(null);
  const [query,setQuery]=useState('');
  const [zoom,setZoom]=useState(1);
  const [pan,setPan]=useState({x:0,y:0});
  const [dragging,setDragging]=useState(false);
  const [claimed,setClaimed]=useState({});
  const dragRef=useRef(null);

  const mergedWorlds = useMemo(() => WORLDS.map(w => ({...w, topics:w.topics.map(name => ({name,owner:claimed[name]?.owner || topicOwner(name),stake:claimed[name]?.stake || topicStake(name),price:priceFor(name)}))})), [claimed]);
  const currentWorld = mergedWorlds.find(w=>w.id===worldId) || null;
  const searchHits = useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q) return [];
    return mergedWorlds.flatMap(world => world.topics.filter(t=>t.name.toLowerCase().includes(q)).map(t=>({world,topic:t})));
  },[query,mergedWorlds]);
  const connected = useMemo(()=>{
    if(!hovered) return new Set();
    const s=new Set([hovered]);
    Object.entries(LINKS).forEach(([a,bs])=>{if(a===hovered)bs.forEach(b=>s.add(b));if(bs.includes(hovered))s.add(a)});
    return s;
  },[hovered]);
  const totalOwned = mergedWorlds.reduce((sum,w)=>sum+w.topics.filter(t=>t.owner).length,0);
  const totalValue = mergedWorlds.reduce((sum,w)=>sum+w.topics.filter(t=>t.owner).reduce((s,t)=>s+t.stake,0),0) + Object.keys(claimed).filter(k=>!topicOwner(k)).reduce((s,k)=>s+(claimed[k]?.stake||0),0);
  const activity=[['@northstar','conquered','AI','£32','2m'],['@orbital','defended','SPACE','£47','7m'],['@foundry','conquered','IRELAND','£27','13m'],['@pixelworks','conquered','GAMING','£41','21m']];

  function openWorld(id){setWorldId(id);setActiveTopic(null);setHovered(null);setQuery('');setZoom(.92);setPan({x:0,y:0});}
  function backToWorlds(){setWorldId(null);setActiveTopic(null);setHovered(null);setZoom(1);setPan({x:0,y:0});}
  function startDrag(e){if(e.button!==0 || e.target.closest('button,.search')) return;dragRef.current={x:e.clientX-pan.x,y:e.clientY-pan.y};setDragging(true);e.currentTarget.setPointerCapture?.(e.pointerId)}
  function moveDrag(e){if(dragRef.current)setPan({x:e.clientX-dragRef.current.x,y:e.clientY-dragRef.current.y})}
  function endDrag(){dragRef.current=null;setDragging(false)}
  function changeZoom(delta){setZoom(v=>Math.min(1.55,Math.max(.72,+(v+delta).toFixed(2))))}
  function resetView(){setZoom(worldId?.92:1);setPan({x:0,y:0})}
  function claim(topic){const next=priceFor(topic.name);setClaimed(p=>({...p,[topic.name]:{owner:'@you',stake:next}}));setActiveTopic(null);setHovered(null)}

  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#top">EMPIRE<span>.LOL</span></a><nav><a href="#map">Map</a><a href="#leaderboard">Leaderboard</a><a href="#activity">Activity</a><a href="#how">How it works</a></nav><button className="ghost-btn">Build your empire <ArrowUpRight size={15}/></button></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> THE INTERNET IS FOR SALE</div><h1>OWN THE<br/><em>INTERNET.</em></h1><p>Explore a living atlas of ideas, places and culture. Find something you care about, then make it yours.</p><div className="hero-actions"><a className="primary-btn" href="#map">Explore the map <ArrowUpRight size={16}/></a><a className="text-link" href="#how">How it works <ArrowUpRight size={15}/></a></div></div><div className="hero-stat-card"><div className="stat-card-label">LIVE EMPIRE VALUE</div><div className="big-number">£{totalValue.toLocaleString()}</div><div className="mini-grid"><span><b>{totalOwned}</b> territories owned</span><span><b>100</b> territories</span></div><div className="pulse-line"><span>●</span> The atlas is live</div></div></section>

      <section id="map" className="map-section">
        <div className="section-head map-head"><div><span className="kicker">01 / THE ATLAS</span><div className="atlas-title-row">{worldId && <button className="back-breadcrumb" onClick={backToWorlds}><ArrowLeft size={15}/> Internet</button>}<h2>{currentWorld ? currentWorld.name : 'Explore the internet.'}</h2></div><p className="map-subtitle">{currentWorld ? currentWorld.subtitle : 'Six worlds. Hundreds of connections. Start broad, then zoom into whatever catches your eye.'}</p></div><div className="map-tools"><div className="search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search the internet"/>{query && <button className="clear-search" onClick={()=>setQuery('')}><X size={13}/></button>}</div></div></div>

        {searchHits.length>0 && <div className="search-results">{searchHits.slice(0,6).map(({world,topic})=><button key={world.id+topic.name} onClick={()=>{openWorld(world.id);setActiveTopic(topic.name)}}><span className={`mini-dot ${toneClass(world.tone)}`}/><span>{topic.name}</span><small>{world.name}</small><ChevronRight size={14}/></button>)}</div>}

        <div className={`atlas-stage ${worldId?'inside-world':''}`} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
          <div className="stage-glow glow-a"/><div className="stage-glow glow-b"/><div className="stage-grid"/>
          <div className="stage-inner" style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`}}>
            {!currentWorld && <div className="internet-core"><div className="core-ring ring-outer"/><div className="core-ring ring-inner"/><span>THE<br/>INTERNET</span><small>100 TERRITORIES</small></div>}

            {!currentWorld ? mergedWorlds.map((world,index)=>{
              const presets=[{x:31,y:25,rot:-4,size:340},{x:68,y:24,rot:5,size:320},{x:25,y:66,rot:4,size:315},{x:71,y:65,rot:-5,size:345},{x:48,y:14,rot:2,size:300},{x:50,y:84,rot:-3,size:300}];
              const p=presets[index];
              return <button key={world.id} className={`world-orb ${toneClass(world.tone)}`} style={{left:`${p.x}%`,top:`${p.y}%`,width:p.size,height:p.size,transform:`translate(-50%,-50%) rotate(${p.rot}deg)`}} onClick={()=>openWorld(world.id)} onMouseEnter={()=>setHovered(world.id)} onMouseLeave={()=>setHovered(null)}>
                <span className="orb-sheen"/><span className="orb-halo"/><span className="world-content"><span className="world-eyebrow">{world.eyebrow}</span><strong>{world.name}</strong><span>{world.topics.length} territories</span></span>
                <span className="orbit-topic orbit-one">{world.topics[0]}</span><span className="orbit-topic orbit-two">{world.topics[Math.min(4,world.topics.length-1)]}</span>
              </button>
            }) : <>
              <div className="world-banner"><span className={`mini-dot ${toneClass(currentWorld.tone)}`}/><div><strong>{currentWorld.name}</strong><small>{currentWorld.topics.length} territories in this world</small></div></div>
              <svg className="world-threads" viewBox="0 0 1200 760" preserveAspectRatio="none" aria-hidden="true">
                {currentWorld.topics.map((t,i)=>{const angle=(i/currentWorld.topics.length)*Math.PI*2-.7;const rx=430+(i%3)*35,ry=245+(i%2)*32;const x=600+Math.cos(angle)*rx,y=380+Math.sin(angle)*ry;const neighbor=LINKS[t.name]?.find(n=>currentWorld.topics.some(x=>x.name===n));if(!neighbor)return null;const j=currentWorld.topics.findIndex(x=>x.name===neighbor);if(j<0)return null;const a2=(j/currentWorld.topics.length)*Math.PI*2-.7,x2=600+Math.cos(a2)*rx,y2=380+Math.sin(a2)*ry;return <line key={t.name+neighbor} x1={x} y1={y} x2={x2} y2={y2} className={hovered&&(hovered===t.name||hovered===neighbor)?'world-thread hot':'world-thread'}/>})}
              </svg>
              {currentWorld.topics.map((t,i)=>{const angle=(i/currentWorld.topics.length)*Math.PI*2-.7;const rx=430+(i%3)*35,ry=245+(i%2)*32;const x=600+Math.cos(angle)*rx,y=380+Math.sin(angle)*ry;const hot=hovered===t.name,connected=connected.has(t.name),dim=hovered&&!connected;const big=t.price>=50;return <button key={t.name} className={`topic-node ${toneClass(currentWorld.tone)} ${t.owner?'owned':''} ${hot?'hot':''} ${dim?'dim':''}`} style={{left:x,top:y,width:big?118:94,height:big?118:94}} onMouseEnter={()=>setHovered(t.name)} onMouseLeave={()=>setHovered(null)} onClick={e=>{e.stopPropagation();setActiveTopic(t.name)}}><span className="node-shine"/><span className="topic-label">{t.name}</span><small>{t.owner||`£${t.price}`}</small>{t.owner&&<i>♛</i>}</button>})}
              <div className="world-core"><span>{currentWorld.name}</span><small>EXPLORE CONNECTIONS</small></div>
            </>}
          </div>

          <div className="atlas-overlay top-left">{worldId ? <><span className="kicker">{currentWorld?.eyebrow}</span></> : <><span className="kicker">LEVEL 01</span><strong>THE WORLDS</strong></>}</div>
          <div className="atlas-overlay top-right"><span className="search-tip">{worldId ? 'Hover a territory to reveal its network' : 'Click a world to enter'}</span></div>
          <div className="atlas-controls"><button onClick={()=>changeZoom(.12)}><ZoomIn size={16}/></button><button onClick={()=>changeZoom(-.12)}><ZoomOut size={16}/></button><button onClick={resetView}><RotateCcw size={15}/></button></div>
          <div className="atlas-hint"><span>Drag to roam</span><i/> <span>Scroll to zoom</span></div>
          <div className="atlas-legend"><span><i className="legend-open"/> Open</span><span><i className="legend-owned"/> Owned</span><span><i className="legend-line"/> Connected</span></div>
        </div>
      </section>

      <section className="split-section"><div className="panel" id="activity"><div className="panel-head"><div><span className="kicker">02 / ACTIVITY</span><h3>Live conquests.</h3></div><span className="live-badge">● LIVE</span></div>{activity.map((r,i)=><div className="activity-row" key={i}><div className="activity-icon">{r[1]==='defended'?<Shield size={15}/>:<Flame size={15}/>}</div><div className="activity-copy"><b>{r[0]}</b> {r[1]} <strong>{r[2]}</strong><span>{r[4]} ago</span></div><div className="activity-price">{r[3]}</div></div>)}</div><div className="panel" id="leaderboard"><div className="panel-head"><div><span className="kicker">03 / RANKINGS</span><h3>Top empires.</h3></div><Crown size={18}/></div>{[['@orbital','£482'],['@northstar','£321'],['@pixelworks','£241'],['@foundry','£187'],['@luma','£96']].map(([u,v],i)=><div className="rank-row" key={u}><span className="rank">0{i+1}</span><span className="rank-user">{u}</span><strong>{v}</strong></div>)}</div></section>
      <section id="how" className="how-section"><span className="kicker">04 / THE RULES</span><h2>Explore first.<br/>Conquer second.</h2><div className="how-grid"><div><span>01</span><h4>Explore</h4><p>Move through the internet as a set of connected worlds.</p></div><div><span>02</span><h4>Discover</h4><p>Enter a niche and reveal the territories hiding inside it.</p></div><div><span>03</span><h4>Conquer</h4><p>Take an open territory, or beat the current stake to own it.</p></div><div><span>04</span><h4>Share</h4><p>Every conquest becomes a public moment worth sharing.</p></div></div></section>
    </main>
    <footer><div className="brand footer-brand">EMPIRE<span>.LOL</span></div><div className="footer-copy">Own the internet. One territory at a time.</div><div className="footer-links"><a href="#map">Atlas</a><a href="#leaderboard">Rankings</a><a href="#how">Rules</a></div></footer>

    {activeTopic && <div className="modal-backdrop" onClick={()=>setActiveTopic(null)}><div className="territory-modal" onClick={e=>e.stopPropagation()}><button className="close-btn" onClick={()=>setActiveTopic(null)}><X size={19}/></button><div className="modal-topline"><span className="kicker">{currentWorld?.name?.toUpperCase()} / TERRITORY</span><span className="modal-status">{topicOwner(activeTopic)||claimed[activeTopic] ? 'OWNED' : 'OPEN'}</span></div><h3>{activeTopic}</h3><div className="modal-stats"><div><span>Current stake</span><b>£{claimed[activeTopic]?.stake || topicStake(activeTopic)}</b></div><div><span>{topicOwner(activeTopic)||claimed[activeTopic] ? 'Current owner' : 'Starting price'}</span><b>{claimed[activeTopic]?.owner || topicOwner(activeTopic) || `£${priceFor(activeTopic)}`}</b></div></div><div className="related-list"><span>Connected to</span><div>{(LINKS[activeTopic]||[]).slice(0,6).map(x=><button key={x} onClick={()=>{const w=mergedWorlds.find(world=>world.topics.some(t=>t.name===x));if(w){setWorldId(w.id);setActiveTopic(x)}}}>{x}<ChevronRight size={13}/></button>)}</div></div><button className="primary-btn wide" onClick={()=>claim({name:activeTopic})}>{topicOwner(activeTopic)||claimed[activeTopic] ? 'Conquer territory' : 'Claim territory'} <ArrowUpRight size={16}/></button><p className="demo-note"><Sparkles size={14}/> Prototype checkout — no payment is taken.</p></div></div>}
  </div>
}

createRoot(document.getElementById('root')).render(<App />);
