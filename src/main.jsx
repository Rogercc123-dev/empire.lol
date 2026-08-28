import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Crown, Flame, Globe2, Menu, Search, Shield, Sparkles, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import './styles.css';

const territories = [
  ['ai', 'AI', 'Technology', 25], ['software', 'Software', 'Technology', 10], ['programming', 'Programming', 'Technology', 10], ['javascript', 'JavaScript', 'Technology', 10], ['python', 'Python', 'Technology', 10], ['web-development', 'Web Development', 'Technology', 10], ['cybersecurity', 'Cybersecurity', 'Technology', 10], ['robotics', 'Robotics', 'Technology', 25], ['3d-printing', '3D Printing', 'Technology', 10], ['hardware', 'Hardware', 'Technology', 10], ['cloud', 'Cloud', 'Technology', 10], ['open-source', 'Open Source', 'Technology', 10], ['apps', 'Apps', 'Technology', 10], ['startups', 'Startups', 'Technology', 25], ['saas', 'SaaS', 'Technology', 25], ['data', 'Data', 'Technology', 10], ['ar-vr', 'AR/VR', 'Technology', 10], ['blockchain', 'Blockchain', 'Technology', 10], ['bitcoin', 'Bitcoin', 'Technology', 25], ['tech', 'Tech', 'Technology', 100],
  ['marketing', 'Marketing', 'Business', 10], ['advertising', 'Advertising', 'Business', 10], ['ecommerce', 'E-commerce', 'Business', 10], ['finance', 'Finance', 'Business', 25], ['investing', 'Investing', 'Business', 10], ['entrepreneurship', 'Entrepreneurship', 'Business', 10], ['consulting', 'Consulting', 'Business', 10], ['freelancing', 'Freelancing', 'Business', 5], ['real-estate', 'Real Estate', 'Business', 10], ['banking', 'Banking', 'Business', 25], ['venture-capital', 'Venture Capital', 'Business', 25], ['productivity', 'Productivity', 'Business', 10], ['jobs', 'Jobs', 'Business', 10], ['money', 'Money', 'Business', 25], ['business', 'Business', 'Business', 100],
  ['space', 'Space', 'Science', 25], ['rockets', 'Rockets', 'Science', 10], ['aerospace', 'Aerospace', 'Science', 25], ['aviation', 'Aviation', 'Science', 10], ['engineering', 'Engineering', 'Science', 25], ['physics', 'Physics', 'Science', 10], ['chemistry', 'Chemistry', 'Science', 10], ['biology', 'Biology', 'Science', 10], ['astronomy', 'Astronomy', 'Science', 10], ['nuclear', 'Nuclear', 'Science', 10], ['energy', 'Energy', 'Science', 10], ['climate', 'Climate', 'Science', 10], ['science', 'Science', 'Science', 25], ['mars', 'Mars', 'Science', 25], ['earth', 'Earth', 'Science', 100],
  ['gaming', 'Gaming', 'Culture', 25], ['music', 'Music', 'Culture', 25], ['movies', 'Movies', 'Culture', 10], ['anime', 'Anime', 'Culture', 10], ['memes', 'Memes', 'Culture', 25], ['youtube', 'YouTube', 'Culture', 25], ['streaming', 'Streaming', 'Culture', 10], ['tiktok', 'TikTok', 'Culture', 25], ['football', 'Football', 'Culture', 25], ['sports', 'Sports', 'Culture', 25], ['photography', 'Photography', 'Culture', 10], ['art', 'Art', 'Culture', 10], ['fashion', 'Fashion', 'Culture', 10], ['travel', 'Travel', 'Culture', 10], ['culture', 'Culture', 'Culture', 25],
  ['ireland', 'Ireland', 'Places', 25], ['dublin', 'Dublin', 'Places', 25], ['belfast', 'Belfast', 'Places', 10], ['uk', 'UK', 'Places', 50], ['london', 'London', 'Places', 50], ['europe', 'Europe', 'Places', 50], ['usa', 'USA', 'Places', 50], ['new-york', 'New York', 'Places', 25], ['california', 'California', 'Places', 25], ['canada', 'Canada', 'Places', 25], ['australia', 'Australia', 'Places', 25], ['japan', 'Japan', 'Places', 25], ['south-korea', 'South Korea', 'Places', 10], ['china', 'China', 'Places', 25], ['india', 'India', 'Places', 25], ['singapore', 'Singapore', 'Places', 10], ['germany', 'Germany', 'Places', 25], ['france', 'France', 'Places', 25], ['italy', 'Italy', 'Places', 10], ['world', 'World', 'Places', 100],
  ['cars', 'Cars', 'Wildcard', 10], ['coffee', 'Coffee', 'Wildcard', 5], ['food', 'Food', 'Wildcard', 10], ['fitness', 'Fitness', 'Wildcard', 10], ['education', 'Education', 'Wildcard', 10], ['university', 'University', 'Wildcard', 10], ['work', 'Work', 'Wildcard', 5], ['internet', 'Internet', 'Wildcard', 100], ['future', 'Future', 'Wildcard', 25], ['freedom', 'Freedom', 'Wildcard', 10], ['luxury', 'Luxury', 'Wildcard', 10], ['everything', 'Everything', 'Wildcard', 100], ['nothing', 'Nothing', 'Wildcard', 10]
].map(([id, name, category, price]) => ({ id, name, category, price, owner: null, stake: price }));

const seededOwners = {
  ai: { owner: '@northstar', stake: 32 },
  space: { owner: '@orbital', stake: 47 },
  ireland: { owner: '@foundry', stake: 27 },
  gaming: { owner: '@pixelworks', stake: 41 },
  photography: { owner: '@luma', stake: 12 }
};

const initialTerritories = territories.map((t) => seededOwners[t.id] ? { ...t, ...seededOwners[t.id] } : t);

const activity = [
  ['@northstar', 'conquered', 'AI', 32, '2m ago'],
  ['@orbital', 'defended', 'SPACE', 47, '7m ago'],
  ['@foundry', 'conquered', 'IRELAND', 27, '13m ago'],
  ['@pixelworks', 'conquered', 'GAMING', 41, '21m ago'],
  ['@luma', 'defended', 'PHOTOGRAPHY', 12, '31m ago']
];

const categoryConfig = {
  Technology: { center: [455, 330], hue: 0 },
  Business: { center: [770, 430], hue: 1 },
  Science: { center: [450, 665], hue: 2 },
  Culture: { center: [820, 680], hue: 3 },
  Places: { center: [1110, 355], hue: 4 },
  Wildcard: { center: [1090, 700], hue: 5 }
};

function seededPosition(index, total, category) {
  const [cx, cy] = categoryConfig[category].center;
  const ring = Math.floor(index / 6);
  const angle = (index % 6) * (Math.PI * 2 / 6) + ring * 0.55;
  const radius = 88 + ring * 42;
  const wobble = Math.sin(index * 1.73) * 13;
  return {
    x: cx + Math.cos(angle) * (radius + wobble),
    y: cy + Math.sin(angle) * (radius + wobble),
  };
}

function layout(items) {
  const counts = Object.fromEntries(Object.keys(categoryConfig).map((key) => [key, 0]));
  return items.map((item) => {
    const index = counts[item.category]++;
    return { ...item, ...seededPosition(index, items.length, item.category) };
  });
}

function App() {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [mobileNav, setMobileNav] = useState(false);
  const [items, setItems] = useState(initialTerritories);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef(null);

  const laidOut = useMemo(() => layout(items), [items]);
  const visible = useMemo(() => laidOut.filter(t => (category === 'All' || t.category === category) && t.name.toLowerCase().includes(query.toLowerCase())), [laidOut, query, category]);
  const visibleIds = useMemo(() => new Set(visible.map(t => t.id)), [visible]);
  const activeTerritory = active ? items.find(x => x.id === active) : null;
  const totalValue = items.reduce((sum, t) => sum + (t.owner ? t.stake : 0), 0);
  const owned = items.filter(t => t.owner).length;
  const priceFor = (t) => t.owner ? Math.max(t.stake + 2, Math.ceil(t.stake * 1.1)) : t.price;
  const categories = ['All', 'Technology', 'Business', 'Science', 'Culture', 'Places', 'Wildcard'];

  const nodesByCategory = useMemo(() => Object.fromEntries(Object.keys(categoryConfig).map(cat => [cat, laidOut.filter(n => visibleIds.has(n.id) && n.category === cat)])), [laidOut, visibleIds]);

  function demoClaim(t) {
    const price = priceFor(t);
    setItems(prev => prev.map(item => item.id === t.id ? ({ ...item, owner: '@you', stake: price }) : item));
    setActive(null);
  }

  function resetView() { setZoom(1); setPan({ x: 0, y: 0 }); }
  function changeZoom(delta) { setZoom(v => Math.min(1.65, Math.max(0.72, +(v + delta).toFixed(2)))); }
  function onPointerDown(e) {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e) {
    if (!drag.current) return;
    setPan({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y });
  }
  function onPointerUp() { drag.current = null; }
  function onWheel(e) { e.preventDefault(); changeZoom(e.deltaY > 0 ? -0.06 : 0.06); }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top">EMPIRE<span>.LOL</span></a>
        <nav className={mobileNav ? 'nav open' : 'nav'}>
          <a href="#map">Map</a><a href="#leaderboard">Leaderboard</a><a href="#activity">Activity</a><a href="#how">How it works</a>
        </nav>
        <div className="header-actions">
          <button className="ghost-btn desktop-only">Build your empire <ArrowUpRight size={15}/></button>
          <button className="icon-btn mobile-menu" onClick={() => setMobileNav(v => !v)} aria-label="Menu"><Menu size={20}/></button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot"/> THE INTERNET IS FOR SALE</div>
            <h1>OWN THE<br/><em>INTERNET.</em></h1>
            <p>Claim territory. Defend it. Conquer everything.</p>
            <div className="hero-actions"><a className="primary-btn" href="#map">Explore the map <ArrowUpRight size={17}/></a><a className="text-link" href="#how">How it works <ArrowUpRight size={15}/></a></div>
          </div>
          <div className="hero-stat-card">
            <div className="stat-card-label">LIVE EMPIRE VALUE</div>
            <div className="big-number">£{totalValue.toLocaleString()}</div>
            <div className="mini-grid"><span><b>{owned}</b> territories owned</span><span><b>100</b> total territories</span></div>
            <div className="pulse-line"><span>●</span> Live map activity</div>
          </div>
        </section>

        <section id="map" className="map-section map-experience">
          <div className="section-head map-head"><div><span className="kicker">01 / THE MAP</span><h2>Explore the internet.</h2><p className="map-subtitle">Niches pull together. Related worlds connect. Drag to roam.</p></div><div className="map-tools"><div className="search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a territory"/></div></div></div>
          <div className="category-row">{categories.map(c => <button key={c} className={category === c ? 'chip active' : 'chip'} onClick={() => setCategory(c)}>{c}</button>)}</div>

          <div className="map-shell" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onWheel={onWheel}>
            <div className="map-noise" />
            <div className="map-grid-lines" />
            <div className="map-world" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
              <svg className="map-links" viewBox="0 0 1380 930" preserveAspectRatio="none" aria-hidden="true">
                {Object.entries(categoryConfig).map(([cat, cfg]) => {
                  const group = nodesByCategory[cat];
                  if (!group?.length) return null;
                  return group.slice(0, -1).map((node, i) => {
                    const next = group[i + 1];
                    const hot = hovered && (node.id === hovered || next.id === hovered || node.category === laidOut.find(x => x.id === hovered)?.category);
                    return <line key={`${cat}-${node.id}-${next.id}`} x1={node.x} y1={node.y} x2={next.x} y2={next.y} className={hot ? 'link hot' : 'link'} />;
                  });
                })}
                {Object.values(categoryConfig).map((cfg, i, arr) => {
                  if (i === arr.length - 1) return null;
                  const next = arr[i + 1];
                  return <path key={`bridge-${i}`} d={`M ${cfg.center[0]} ${cfg.center[1]} C ${(cfg.center[0] + next.center[0]) / 2} ${cfg.center[1] - 60}, ${(cfg.center[0] + next.center[0]) / 2} ${next.center[1] + 60}, ${next.center[0]} ${next.center[1]}`} className="bridge" />;
                })}
                {Object.entries(categoryConfig).map(([cat, cfg]) => <circle key={`hub-${cat}`} cx={cfg.center[0]} cy={cfg.center[1]} r="4" className="hub-dot" />)}
              </svg>

              {Object.entries(categoryConfig).map(([cat, cfg]) => {
                const count = nodesByCategory[cat]?.length || 0;
                if (!count) return null;
                return <div key={cat} className="cluster-label" style={{ left: cfg.center[0], top: cfg.center[1] }}><span>{cat}</span><small>{count} territories</small></div>;
              })}

              {visible.map((t) => {
                const size = t.price >= 100 ? 102 : t.price >= 50 ? 90 : t.price >= 25 ? 78 : 68;
                const isHot = hovered === t.id;
                return <button key={t.id} className={`bubble ${t.owner ? 'owned' : ''} ${isHot ? 'hot' : ''}`} style={{ left: t.x, top: t.y, width: size, height: size }} onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)} onClick={() => setActive(t.id)} aria-label={`Explore ${t.name}`}>
                  <span className="bubble-glow" />
                  <span className="bubble-content"><span className="bubble-name">{t.name}</span><span className="bubble-meta">{t.owner ? t.owner : `£${priceFor(t)}`}</span></span>
                  {t.owner && <span className="bubble-crown">♛</span>}
                </button>;
              })}
            </div>

            <div className="map-hint"><span>Drag</span> to explore <i>·</i> <span>Scroll</span> to zoom</div>
            <div className="map-controls"><button onClick={() => changeZoom(0.12)} aria-label="Zoom in"><ZoomIn size={16}/></button><button onClick={() => changeZoom(-0.12)} aria-label="Zoom out"><ZoomOut size={16}/></button><button onClick={resetView} aria-label="Reset view"><RotateCcw size={15}/></button></div>
            <div className="map-legend"><span className="legend-dot open"/> open <span className="legend-dot owned"/> owned <span className="legend-line"/> related</div>
          </div>
        </section>

        <section className="split-section">
          <div className="panel" id="activity"><div className="panel-head"><div><span className="kicker">02 / ACTIVITY</span><h3>Live conquests.</h3></div><span className="live-badge">● LIVE</span></div>{activity.map(([user, action, territory, amount, time]) => <div className="activity-row" key={user + territory}><div className="activity-icon">{action === 'defended' ? <Shield size={15}/> : <Flame size={15}/>}</div><div className="activity-copy"><b>{user}</b> {action} <strong>{territory}</strong><span>{time}</span></div><div className="activity-price">£{amount}</div></div>)}</div>
          <div className="panel" id="leaderboard"><div className="panel-head"><div><span className="kicker">03 / RANKINGS</span><h3>Top empires.</h3></div><Crown size={18}/></div>{[['@orbital', '£482'], ['@northstar', '£321'], ['@pixelworks', '£241'], ['@foundry', '£187'], ['@luma', '£96']].map(([user, value], i) => <div className="rank-row" key={user}><span className="rank">0{i+1}</span><span className="rank-user">{user}</span><strong>{value}</strong></div>)}</div>
        </section>

        <section id="how" className="how-section"><span className="kicker">04 / THE RULES</span><h2>A simple game with<br/>one brutal rule.</h2><div className="how-grid"><div><span>01</span><h4>Claim</h4><p>Pick an open territory and become its first owner.</p></div><div><span>02</span><h4>Conquer</h4><p>Anyone can take it by beating the current stake.</p></div><div><span>03</span><h4>Defend</h4><p>Lose your territory? Pay the next stake and take it back.</p></div><div><span>04</span><h4>Share</h4><p>Every conquest becomes a public moment worth sharing.</p></div></div></section>
      </main>

      <footer><div className="brand footer-brand">EMPIRE<span>.LOL</span></div><div className="footer-copy">Own the internet. One territory at a time.</div><div className="footer-links"><a href="#map">Map</a><a href="#leaderboard">Rankings</a><a href="#how">Rules</a></div></footer>

      {activeTerritory && <div className="modal-backdrop" onClick={() => setActive(null)}><div className="modal" onClick={e => e.stopPropagation()}><button className="close-btn" onClick={() => setActive(null)}><X size={20}/></button><div className="modal-icon"><Globe2 size={24}/></div><span className="kicker">TERRITORY / {activeTerritory.category.toUpperCase()}</span><h3>{activeTerritory.name}</h3><div className="modal-owner"><span>Current owner</span><strong>{activeTerritory.owner || 'Unclaimed'}</strong></div><div className="modal-price"><span>{activeTerritory.owner ? 'Next stake' : 'Starting price'}</span><b>£{priceFor(activeTerritory)}</b></div><button className="primary-btn wide" onClick={() => demoClaim(activeTerritory)}>{activeTerritory.owner ? 'Conquer territory' : 'Claim territory'} <ArrowUpRight size={17}/></button><p className="demo-note"><Sparkles size={14}/> Payments are mocked in this prototype.</p></div></div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
