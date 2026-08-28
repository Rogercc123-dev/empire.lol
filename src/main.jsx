import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowUpRight, ChevronRight, Crown, Flame, Search, Shield, Sparkles, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import './styles.css';

const WORLDS = [
  { id: 'technology', name: 'Technology', eyebrow: 'THE BUILDERS', tone: 'mint', subtitle: 'Software, AI, hardware and the tools shaping what comes next.', topics: ['AI','Software','Programming','Robotics','3D Printing','Hardware','Cloud','Open Source','Apps','Startups','SaaS','Data','AR/VR','Blockchain','Bitcoin','Tech'] },
  { id: 'science', name: 'Science', eyebrow: 'THE FRONTIER', tone: 'cyan', subtitle: 'Questions, discoveries and machines pushing beyond the known.', topics: ['Space','Rockets','Aerospace','Aviation','Engineering','Physics','Chemistry','Biology','Astronomy','Nuclear','Energy','Climate','Science','Mars','Earth'] },
  { id: 'business', name: 'Business', eyebrow: 'THE MARKET', tone: 'lavender', subtitle: 'Capital, companies and the systems that move money.', topics: ['Marketing','Advertising','E-commerce','Finance','Investing','Entrepreneurship','Consulting','Freelancing','Real Estate','Banking','Venture Capital','Productivity','Jobs','Money','Business'] },
  { id: 'culture', name: 'Culture', eyebrow: 'THE SIGNAL', tone: 'peach', subtitle: 'The things people watch, play, listen to and obsess over.', topics: ['Gaming','Music','Movies','Anime','Memes','YouTube','Streaming','TikTok','Football','Sports','Photography','Art','Fashion','Travel','Culture'] },
  { id: 'places', name: 'Places', eyebrow: 'THE WORLD', tone: 'gold', subtitle: 'Countries, cities and the places that connect everything else.', topics: ['Ireland','Dublin','Belfast','UK','London','Europe','USA','New York','California','Canada','Australia','Japan','South Korea','China','India','Singapore','Germany','France','Italy','World'] },
  { id: 'life', name: 'Life', eyebrow: 'EVERYTHING ELSE', tone: 'rose', subtitle: 'Interests, ideas and the weird edges of the internet.', topics: ['Cars','Coffee','Food','Fitness','Education','University','Work','Internet','Future','Freedom','Luxury','Everything','Nothing','Electric Cars','Design'] },
];

const SEEDED = {
  AI: { owner: '@northstar', stake: 32 },
  Space: { owner: '@orbital', stake: 47 },
  Ireland: { owner: '@foundry', stake: 27 },
  Gaming: { owner: '@pixelworks', stake: 41 },
  Photography: { owner: '@luma', stake: 12 },
};

const PRICE_OVERRIDES = { Tech: 100, Internet: 100, Everything: 100, Earth: 100, Business: 100, World: 100, AI: 25, Space: 25, Gaming: 25, Bitcoin: 25, Startups: 25 };

const LINKS = {
  AI: ['Data','Python','Robotics','SaaS','Software','Future'],
  Software: ['Programming','Cloud','Apps','AI'],
  Programming: ['JavaScript','Python','Open Source','Software'],
  Robotics: ['3D Printing','Hardware','Engineering'],
  Startups: ['SaaS','Venture Capital','Entrepreneurship','Tech'],
  Bitcoin: ['Blockchain','Finance'],
  Space: ['Rockets','Aerospace','Astronomy','Mars','Future'],
  Rockets: ['Engineering','Space'],
  Aerospace: ['Aviation','Engineering','Space'],
  Engineering: ['Physics','3D Printing','Energy'],
  Earth: ['Climate','Energy'],
  Astronomy: ['Mars'],
  Finance: ['Investing','Banking','Money','Venture Capital'],
  Marketing: ['Advertising','E-commerce'],
  Business: ['Money','Entrepreneurship'],
  Gaming: ['YouTube','Streaming','Memes'],
  Music: ['Movies','TikTok','Culture'],
  Football: ['Sports'],
  Photography: ['Art'],
  Fashion: ['Art'],
  Travel: ['Culture'],
  Ireland: ['Dublin','Belfast'],
  UK: ['London'],
  Europe: ['France','Germany','Italy'],
  USA: ['New York','California'],
  Japan: ['South Korea'],
  World: ['Europe','USA','UK'],
  Cars: ['Electric Cars','Engineering'],
  Education: ['University'],
  Design: ['Art','Web Development'],
  Fitness: ['Sports'],
  Food: ['Travel'],
  Internet: ['AI','Software','Gaming','YouTube','Marketing'],
  Future: ['AI','Space'],
};

const WORLD_POSITIONS = [
  { left: '18%', top: '27%' },
  { left: '50%', top: '23%' },
  { left: '82%', top: '27%' },
  { left: '19%', top: '73%' },
  { left: '50%', top: '77%' },
  { left: '81%', top: '73%' },
];

const TONE = (tone) => `tone-${tone}`;

function priceFor(topic, claimed) {
  if (claimed[topic]) return claimed[topic].stake + Math.max(2, Math.ceil(claimed[topic].stake * 0.1));
  if (SEEDED[topic]) return Math.max(SEEDED[topic].stake + 2, Math.ceil(SEEDED[topic].stake * 1.1));
  return PRICE_OVERRIDES[topic] || 10;
}

function ownerFor(topic, claimed) {
  return claimed[topic]?.owner || SEEDED[topic]?.owner || null;
}

function stakeFor(topic, claimed) {
  return claimed[topic]?.stake || SEEDED[topic]?.stake || priceFor(topic, claimed);
}

function App() {
  const [worldId, setWorldId] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [claimed, setClaimed] = useState({});
  const dragRef = useRef(null);

  const worlds = useMemo(() => WORLDS.map((world) => ({
    ...world,
    topics: world.topics.map((name) => ({
      name,
      owner: ownerFor(name, claimed),
      stake: stakeFor(name, claimed),
      price: priceFor(name, claimed),
    })),
  })), [claimed]);

  const currentWorld = worlds.find((world) => world.id === worldId) || null;
  const searchHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return worlds.flatMap((world) => world.topics
      .filter((topic) => topic.name.toLowerCase().includes(q))
      .map((topic) => ({ world, topic })));
  }, [query, worlds]);

  const connected = useMemo(() => {
    if (!hovered) return new Set();
    const result = new Set([hovered]);
    Object.entries(LINKS).forEach(([from, to]) => {
      if (from === hovered) to.forEach((item) => result.add(item));
      if (to.includes(hovered)) result.add(from);
    });
    return result;
  }, [hovered]);

  const totalOwned = worlds.reduce((sum, world) => sum + world.topics.filter((topic) => topic.owner).length, 0);
  const totalValue = worlds.reduce((sum, world) => sum + world.topics.reduce((n, topic) => n + (topic.owner ? topic.stake : 0), 0), 0);

  function openWorld(id) {
    setWorldId(id);
    setActiveTopic(null);
    setHovered(null);
    setQuery('');
    setZoom(0.96);
    setPan({ x: 0, y: 0 });
  }

  function backToWorlds() {
    setWorldId(null);
    setActiveTopic(null);
    setHovered(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  function startDrag(event) {
    if (event.button !== 0 || event.target.closest('button, input')) return;
    dragRef.current = { x: event.clientX - pan.x, y: event.clientY - pan.y };
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function moveDrag(event) {
    if (!dragRef.current) return;
    setPan({ x: event.clientX - dragRef.current.x, y: event.clientY - dragRef.current.y });
  }

  function endDrag() {
    dragRef.current = null;
    setDragging(false);
  }

  function changeZoom(delta) {
    setZoom((value) => Math.min(1.35, Math.max(0.78, +(value + delta).toFixed(2))));
  }

  function resetView() {
    setZoom(worldId ? 0.96 : 1);
    setPan({ x: 0, y: 0 });
  }

  function claim(topic) {
    const next = priceFor(topic.name, claimed);
    setClaimed((current) => ({ ...current, [topic.name]: { owner: '@you', stake: next } }));
    setActiveTopic(null);
    setHovered(null);
  }

  const activity = [
    ['@northstar', 'conquered', 'AI', '£32', '2m'],
    ['@orbital', 'defended', 'SPACE', '£47', '7m'],
    ['@foundry', 'conquered', 'IRELAND', '£27', '13m'],
    ['@pixelworks', 'conquered', 'GAMING', '£41', '21m'],
  ];

  const rankings = [
    ['@orbital', '£482'], ['@northstar', '£321'], ['@pixelworks', '£241'], ['@foundry', '£187'], ['@luma', '£96'],
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top">EMPIRE<span>.LOL</span></a>
        <nav><a href="#map">Map</a><a href="#leaderboard">Leaderboard</a><a href="#activity">Activity</a><a href="#how">How it works</a></nav>
        <button className="ghost-btn">Build your empire <ArrowUpRight size={15} /></button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> THE INTERNET IS FOR SALE</div>
            <h1>OWN THE<br /><em>INTERNET.</em></h1>
            <p>Explore a living atlas of ideas, places and culture. Find something you care about, then make it yours.</p>
            <div className="hero-actions"><a className="primary-btn" href="#map">Explore the map <ArrowUpRight size={16} /></a><a className="text-link" href="#how">How it works <ArrowUpRight size={15} /></a></div>
          </div>
          <div className="hero-stat-card"><div className="stat-card-label">LIVE EMPIRE VALUE</div><div className="big-number">£{totalValue.toLocaleString()}</div><div className="mini-grid"><span><b>{totalOwned}</b> territories owned</span><span><b>100</b> territories</span></div><div className="pulse-line"><span>●</span> The atlas is live</div></div>
        </section>

        <section id="map" className="map-section">
          <div className="section-head map-head">
            <div>
              <span className="kicker">01 / THE ATLAS</span>
              <div className="atlas-title-row">{worldId && <button className="back-breadcrumb" onClick={backToWorlds}><ArrowLeft size={15} /> Internet</button>}<h2>{currentWorld ? currentWorld.name : 'Explore the internet.'}</h2></div>
              <p className="map-subtitle">{currentWorld ? currentWorld.subtitle : 'Six worlds. Start broad, then enter a niche when something catches your eye.'}</p>
            </div>
            <div className="map-tools"><div className="search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the internet" />{query && <button className="clear-search" onClick={() => setQuery('')}><X size={13} /></button>}</div></div>
          </div>

          {searchHits.length > 0 && <div className="search-results">{searchHits.slice(0, 6).map(({ world, topic }) => <button key={`${world.id}-${topic.name}`} onClick={() => { openWorld(world.id); setTimeout(() => setActiveTopic(topic.name), 0); }}><span className={`mini-dot ${TONE(world.tone)}`} /><span>{topic.name}</span><small>{world.name}</small><ChevronRight size={14} /></button>)}</div>}

          <div className={`atlas-stage ${worldId ? 'inside-world' : ''} ${dragging ? 'is-dragging' : ''}`} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
            <div className="stage-glow glow-a" /><div className="stage-glow glow-b" /><div className="stage-grid" />

            <div className="stage-inner" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
              {!currentWorld ? (
                <>
                  <div className="internet-core"><div className="core-ring ring-outer" /><div className="core-ring ring-inner" /><span>THE<br />INTERNET</span><small>100 TERRITORIES</small></div>
                  <div className="world-links" aria-hidden="true" />
                  {worlds.map((world, index) => {
                    const pos = WORLD_POSITIONS[index];
                    const featured = world.topics.slice(0, 2);
                    return <button key={world.id} className={`world-orb ${TONE(world.tone)}`} style={{ left: pos.left, top: pos.top }} onClick={() => openWorld(world.id)} onMouseEnter={() => setHovered(world.id)} onMouseLeave={() => setHovered(null)}>
                      <span className="orb-sheen" /><span className="orb-halo" />
                      <span className="world-content"><span className="world-eyebrow">{world.eyebrow}</span><strong>{world.name}</strong><span>{world.topics.length} territories</span></span>
                      <span className="orbit-topic orbit-one">{featured[0]}</span><span className="orbit-topic orbit-two">{featured[1]}</span>
                    </button>;
                  })}
                </>
              ) : (
                <>
                  <div className="world-banner"><span className={`mini-dot ${TONE(currentWorld.tone)}`} /><div><strong>{currentWorld.name}</strong><small>{currentWorld.topics.length} territories · click any to inspect</small></div></div>
                  <svg className="world-threads" viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true">
                    {currentWorld.topics.map((topic, index) => {
                      const cols = 5;
                      const row = Math.floor(index / cols);
                      const col = index % cols;
                      const x = 160 + col * 220 + (row % 2 ? 35 : -20);
                      const y = 150 + row * 125;
                      const neighbor = LINKS[topic.name]?.find((candidate) => currentWorld.topics.some((item) => item.name === candidate));
                      if (!neighbor) return null;
                      const j = currentWorld.topics.findIndex((item) => item.name === neighbor);
                      if (j < 0) return null;
                      const row2 = Math.floor(j / cols);
                      const col2 = j % cols;
                      const x2 = 160 + col2 * 220 + (row2 % 2 ? 35 : -20);
                      const y2 = 150 + row2 * 125;
                      const hot = hovered === topic.name || hovered === neighbor;
                      return <line key={`${topic.name}-${neighbor}`} x1={x} y1={y} x2={x2} y2={y2} className={hot ? 'world-thread hot' : 'world-thread'} />;
                    })}
                  </svg>
                  <div className="world-core"><span>{currentWorld.name}</span><small>CONNECTED TERRITORY</small></div>
                  {currentWorld.topics.map((topic, index) => {
                    const cols = 5;
                    const row = Math.floor(index / cols);
                    const col = index % cols;
                    const x = 160 + col * 220 + (row % 2 ? 35 : -20);
                    const y = 150 + row * 125;
                    const hot = hovered === topic.name;
                    const connectedState = connected.has(topic.name);
                    const dim = Boolean(hovered) && !connectedState;
                    const size = topic.price >= 50 ? 108 : 92;
                    return <button key={topic.name} className={`topic-node ${TONE(currentWorld.tone)} ${topic.owner ? 'owned' : ''} ${hot ? 'hot' : ''} ${dim ? 'dim' : ''}`} style={{ left: x, top: y, width: size, height: size }} onMouseEnter={() => setHovered(topic.name)} onMouseLeave={() => setHovered(null)} onClick={(event) => { event.stopPropagation(); setActiveTopic(topic.name); }}><span className="node-shine" /><span className="topic-label">{topic.name}</span><small>{topic.owner || `£${topic.price}`}</small>{topic.owner && <i>♛</i>}</button>;
                  })}
                </>
              )}
            </div>

            <div className="atlas-overlay top-left">{worldId ? <span className="kicker">{currentWorld?.eyebrow}</span> : <><span className="kicker">LEVEL 01</span><strong>THE WORLDS</strong></>}</div>
            <div className="atlas-overlay top-right">{worldId ? 'Hover a territory to reveal its network' : 'Click a world to enter'}</div>
            <div className="atlas-controls"><button onClick={() => changeZoom(.1)} aria-label="Zoom in"><ZoomIn size={16} /></button><button onClick={() => changeZoom(-.1)} aria-label="Zoom out"><ZoomOut size={16} /></button><button onClick={resetView} aria-label="Reset"><RotateCcw size={15} /></button></div>
            <div className="atlas-hint"><span>Drag to roam</span><i /><span>Scroll to zoom</span></div>
            <div className="atlas-legend"><span><i className="legend-open" /> Open</span><span><i className="legend-owned" /> Owned</span><span><i className="legend-line" /> Connected</span></div>
          </div>
        </section>

        <section className="split-section">
          <div className="panel" id="activity"><div className="panel-head"><div><span className="kicker">02 / ACTIVITY</span><h3>Live conquests.</h3></div><span className="live-badge">● LIVE</span></div>{activity.map(([user, verb, topic, amount, time]) => <div className="activity-row" key={`${user}-${topic}`}><div className="activity-icon">{verb === 'defended' ? <Shield size={15} /> : <Flame size={15} />}</div><div className="activity-copy"><b>{user}</b> {verb} <strong>{topic}</strong><span>{time} ago</span></div><div className="activity-price">{amount}</div></div>)}</div>
          <div className="panel" id="leaderboard"><div className="panel-head"><div><span className="kicker">03 / RANKINGS</span><h3>Top empires.</h3></div><Crown size={18} /></div>{rankings.map(([user, amount], index) => <div className="rank-row" key={user}><span className="rank">0{index + 1}</span><span className="rank-user">{user}</span><strong>{amount}</strong></div>)}</div>
        </section>

        <section id="how" className="how-section"><span className="kicker">04 / THE RULES</span><h2>A simple game with<br />one brutal rule.</h2><div className="how-grid"><div><span>01</span><h4>Claim</h4><p>Pick an open territory and become its first owner.</p></div><div><span>02</span><h4>Conquer</h4><p>Anyone can take it by beating the current stake.</p></div><div><span>03</span><h4>Defend</h4><p>Lose your territory? Pay the next stake and take it back.</p></div><div><span>04</span><h4>Share</h4><p>Every conquest becomes a public moment worth sharing.</p></div></div></section>
      </main>

      <footer><div className="brand footer-brand">EMPIRE<span>.LOL</span></div><div className="footer-copy">Own the internet. One territory at a time.</div><div className="footer-links"><a href="#map">Map</a><a href="#leaderboard">Rankings</a><a href="#how">Rules</a></div></footer>

      {activeTopic && (() => {
        const topic = currentWorld?.topics.find((item) => item.name === activeTopic) || worlds.flatMap((world) => world.topics).find((item) => item.name === activeTopic);
        if (!topic) return null;
        const related = (LINKS[topic.name] || []).filter((name) => worlds.flatMap((world) => world.topics).some((item) => item.name === name)).slice(0, 5);
        return <div className="modal-backdrop" onClick={() => setActiveTopic(null)}><div className="territory-modal" onClick={(event) => event.stopPropagation()}><button className="close-btn" onClick={() => setActiveTopic(null)}><X size={18} /></button><div className="modal-topline"><span className="modal-status">{topic.owner ? 'OWNED TERRITORY' : 'OPEN TERRITORY'}</span><Sparkles size={16} /></div><h3>{topic.name}</h3><div className="modal-stats"><div><span>Current stake</span><b>£{topic.stake}</b></div><div><span>Owner</span><b>{topic.owner || 'Nobody yet'}</b></div></div><div className="related-list"><span>Connected territories</span><div>{related.map((name) => <button key={name} onClick={() => setActiveTopic(name)}>{name}<ChevronRight size={12} /></button>)}</div></div><button className="primary-btn wide" onClick={() => claim(topic)}>{topic.owner ? `Conquer for £${priceFor(topic.name, claimed)}` : `Claim for £${topic.price}`} <ArrowUpRight size={16} /></button><p className="demo-note"><Sparkles size={13} /> Prototype mode — payment is mocked.</p></div></div>;
      })()}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
