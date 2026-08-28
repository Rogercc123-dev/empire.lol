import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Crown,
  Flame,
  Grip,
  MousePointer2,
  Search,
  Shield,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import './styles.css';
import {
  CATEGORY_ORDER,
  CATEGORY_TONE,
  CATEGORY_CENTRES,
  createOrganicLayout,
  bubbleSize,
  linkedNodeSet,
} from './graphLayout.js';

const RAW = [
  ['ai', 'AI', 'Technology', 25],
  ['software', 'Software', 'Technology', 10],
  ['programming', 'Programming', 'Technology', 10],
  ['javascript', 'JavaScript', 'Technology', 10],
  ['python', 'Python', 'Technology', 10],
  ['web-development', 'Web Development', 'Technology', 10],
  ['cybersecurity', 'Cybersecurity', 'Technology', 10],
  ['robotics', 'Robotics', 'Technology', 25],
  ['3d-printing', '3D Printing', 'Technology', 10],
  ['hardware', 'Hardware', 'Technology', 10],
  ['cloud', 'Cloud', 'Technology', 10],
  ['open-source', 'Open Source', 'Technology', 10],
  ['apps', 'Apps', 'Technology', 10],
  ['startups', 'Startups', 'Technology', 25],
  ['saas', 'SaaS', 'Technology', 25],
  ['data', 'Data', 'Technology', 10],
  ['ar-vr', 'AR/VR', 'Technology', 10],
  ['blockchain', 'Blockchain', 'Technology', 10],
  ['bitcoin', 'Bitcoin', 'Technology', 25],
  ['tech', 'Tech', 'Technology', 100],
  ['marketing', 'Marketing', 'Business', 10],
  ['advertising', 'Advertising', 'Business', 10],
  ['ecommerce', 'E-commerce', 'Business', 10],
  ['finance', 'Finance', 'Business', 25],
  ['investing', 'Investing', 'Business', 10],
  ['entrepreneurship', 'Entrepreneurship', 'Business', 10],
  ['consulting', 'Consulting', 'Business', 10],
  ['freelancing', 'Freelancing', 'Business', 5],
  ['real-estate', 'Real Estate', 'Business', 10],
  ['banking', 'Banking', 'Business', 25],
  ['venture-capital', 'Venture Capital', 'Business', 25],
  ['productivity', 'Productivity', 'Business', 10],
  ['jobs', 'Jobs', 'Business', 10],
  ['money', 'Money', 'Business', 25],
  ['business', 'Business', 'Business', 100],
  ['space', 'Space', 'Science', 25],
  ['rockets', 'Rockets', 'Science', 10],
  ['aerospace', 'Aerospace', 'Science', 25],
  ['aviation', 'Aviation', 'Science', 10],
  ['engineering', 'Engineering', 'Science', 25],
  ['physics', 'Physics', 'Science', 10],
  ['chemistry', 'Chemistry', 'Science', 10],
  ['biology', 'Biology', 'Science', 10],
  ['astronomy', 'Astronomy', 'Science', 10],
  ['nuclear', 'Nuclear', 'Science', 10],
  ['energy', 'Energy', 'Science', 10],
  ['climate', 'Climate', 'Science', 10],
  ['science', 'Science', 'Science', 25],
  ['mars', 'Mars', 'Science', 25],
  ['earth', 'Earth', 'Science', 100],
  ['gaming', 'Gaming', 'Culture', 25],
  ['music', 'Music', 'Culture', 25],
  ['movies', 'Movies', 'Culture', 10],
  ['anime', 'Anime', 'Culture', 10],
  ['memes', 'Memes', 'Culture', 25],
  ['youtube', 'YouTube', 'Culture', 25],
  ['streaming', 'Streaming', 'Culture', 10],
  ['tiktok', 'TikTok', 'Culture', 25],
  ['football', 'Football', 'Culture', 25],
  ['sports', 'Sports', 'Culture', 25],
  ['photography', 'Photography', 'Culture', 10],
  ['art', 'Art', 'Culture', 10],
  ['fashion', 'Fashion', 'Culture', 10],
  ['travel', 'Travel', 'Culture', 10],
  ['culture', 'Culture', 'Culture', 25],
  ['ireland', 'Ireland', 'Places', 25],
  ['dublin', 'Dublin', 'Places', 25],
  ['belfast', 'Belfast', 'Places', 10],
  ['uk', 'UK', 'Places', 50],
  ['london', 'London', 'Places', 50],
  ['europe', 'Europe', 'Places', 50],
  ['usa', 'USA', 'Places', 50],
  ['new-york', 'New York', 'Places', 25],
  ['california', 'California', 'Places', 25],
  ['canada', 'Canada', 'Places', 25],
  ['australia', 'Australia', 'Places', 25],
  ['japan', 'Japan', 'Places', 25],
  ['south-korea', 'South Korea', 'Places', 10],
  ['china', 'China', 'Places', 25],
  ['india', 'India', 'Places', 25],
  ['singapore', 'Singapore', 'Places', 10],
  ['germany', 'Germany', 'Places', 25],
  ['france', 'France', 'Places', 25],
  ['italy', 'Italy', 'Places', 10],
  ['world', 'World', 'Places', 100],
  ['cars', 'Cars', 'Wildcard', 10],
  ['coffee', 'Coffee', 'Wildcard', 5],
  ['food', 'Food', 'Wildcard', 10],
  ['fitness', 'Fitness', 'Wildcard', 10],
  ['education', 'Education', 'Wildcard', 10],
  ['university', 'University', 'Wildcard', 10],
  ['work', 'Work', 'Wildcard', 5],
  ['internet', 'Internet', 'Wildcard', 100],
  ['future', 'Future', 'Wildcard', 25],
  ['freedom', 'Freedom', 'Wildcard', 10],
  ['luxury', 'Luxury', 'Wildcard', 10],
  ['everything', 'Everything', 'Wildcard', 100],
  ['nothing', 'Nothing', 'Wildcard', 10],
  ['electric-cars', 'Electric Cars', 'Wildcard', 10],
  ['design', 'Design', 'Wildcard', 10],
];

const seededOwners = {
  ai: { owner: '@northstar', stake: 32 },
  space: { owner: '@orbital', stake: 47 },
  ireland: { owner: '@foundry', stake: 27 },
  gaming: { owner: '@pixelworks', stake: 41 },
  photography: { owner: '@luma', stake: 12 },
};

const territories = RAW.map(([id, name, category, price]) => ({
  id,
  name,
  category,
  price,
  owner: seededOwners[id]?.owner ?? null,
  stake: seededOwners[id]?.stake ?? price,
}));

const LINKS = [
  ['ai', 'data', 3], ['ai', 'python', 3], ['ai', 'robotics', 2], ['ai', 'saas', 2], ['ai', 'software', 2], ['ai', 'future', 1],
  ['software', 'programming', 3], ['programming', 'javascript', 2], ['programming', 'python', 2], ['web-development', 'javascript', 2],
  ['web-development', 'software', 2], ['cybersecurity', 'blockchain', 2], ['cloud', 'software', 2], ['apps', 'software', 2],
  ['open-source', 'programming', 2], ['3d-printing', 'robotics', 2], ['hardware', 'robotics', 2], ['startups', 'saas', 3],
  ['startups', 'venture-capital', 2], ['startups', 'entrepreneurship', 2], ['bitcoin', 'blockchain', 3], ['bitcoin', 'finance', 1],
  ['tech', 'startups', 2], ['tech', 'ai', 2], ['marketing', 'advertising', 3], ['marketing', 'ecommerce', 2],
  ['advertising', 'ecommerce', 2], ['finance', 'investing', 3], ['finance', 'banking', 2], ['finance', 'money', 3],
  ['money', 'business', 2], ['venture-capital', 'finance', 2], ['venture-capital', 'startups', 2], ['entrepreneurship', 'business', 2],
  ['productivity', 'jobs', 1], ['real-estate', 'finance', 2], ['consulting', 'business', 2], ['space', 'rockets', 3],
  ['space', 'aerospace', 3], ['space', 'astronomy', 3], ['space', 'mars', 2], ['space', 'future', 2], ['rockets', 'engineering', 2],
  ['aerospace', 'aviation', 3], ['aerospace', 'engineering', 2], ['engineering', 'physics', 2], ['engineering', '3d-printing', 1],
  ['engineering', 'energy', 1], ['astronomy', 'mars', 2], ['earth', 'climate', 3], ['earth', 'energy', 2], ['science', 'physics', 2],
  ['science', 'biology', 2], ['science', 'chemistry', 2], ['energy', 'climate', 2], ['gaming', 'youtube', 2],
  ['gaming', 'streaming', 2], ['gaming', 'memes', 2], ['music', 'movies', 2], ['music', 'tiktok', 2], ['football', 'sports', 3],
  ['photography', 'art', 3], ['fashion', 'art', 2], ['travel', 'culture', 2], ['youtube', 'tiktok', 2], ['movies', 'anime', 1],
  ['music', 'culture', 2], ['ireland', 'dublin', 3], ['ireland', 'belfast', 2], ['uk', 'london', 3], ['europe', 'france', 2],
  ['europe', 'germany', 2], ['europe', 'italy', 2], ['usa', 'new-york', 3], ['usa', 'california', 3], ['japan', 'south-korea', 2],
  ['world', 'europe', 1], ['world', 'usa', 1], ['world', 'uk', 1], ['internet', 'ai', 3], ['internet', 'software', 3],
  ['internet', 'gaming', 2], ['internet', 'youtube', 2], ['internet', 'marketing', 2], ['future', 'ai', 2], ['future', 'space', 2],
  ['cars', 'electric-cars', 3], ['cars', 'engineering', 1], ['education', 'university', 3], ['business', 'money', 2], ['design', 'art', 2],
  ['design', 'web-development', 2], ['fitness', 'sports', 2], ['food', 'travel', 1], ['coffee', 'culture', 1],
];

function priceFor(territory) {
  return territory.owner
    ? Math.max(territory.stake + 2, Math.ceil(territory.stake * 1.1))
    : territory.price;
}

function quickStartPositions(nodes) {
  const counts = Object.fromEntries(CATEGORY_ORDER.map((category) => [category, 0]));
  return Object.fromEntries(
    nodes.map((node) => {
      const index = counts[node.category]++;
      const [cx, cy] = CATEGORY_CENTRES[node.category] || [900, 530];
      const angle = index * 2.3999632297 + (node.price % 7) * 0.17;
      const radius = 55 + (index % 5) * 34;
      const x = cx + Math.cos(angle) * radius + Math.sin(index * 1.7) * 28;
      const y = cy + Math.sin(angle) * radius + Math.cos(index * 1.3) * 24;
      return [node.id, { ...node, x, y }];
    }),
  );
}

const initialPositions = quickStartPositions(territories);

function App() {
  const [items, setItems] = useState(territories);
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [zoom, setZoom] = useState(0.9);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [positions, setPositions] = useState(initialPositions);
  const dragRef = useRef(null);
  const mapRef = useRef(null);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return items.filter((territory) => {
      const categoryMatch = category === 'All' || territory.category === category;
      const queryMatch = !normalized || territory.name.toLowerCase().includes(normalized);
      return categoryMatch && queryMatch;
    });
  }, [items, category, query]);

  const visibleIds = useMemo(() => new Set(filtered.map((territory) => territory.id)), [filtered]);
  const linkedIds = useMemo(() => linkedNodeSet(hovered, LINKS), [hovered]);
  const activeTerritory = active ? items.find((territory) => territory.id === active) : null;
  const mapNodes = filtered.map((territory) => ({ ...territory, ...(positions[territory.id] || {}) }));
  const mapLinks = LINKS.filter(([a, b]) => visibleIds.has(a) && visibleIds.has(b));
  const totalValue = items.reduce((sum, territory) => sum + (territory.owner ? territory.stake : 0), 0);
  const owned = items.filter((territory) => territory.owner).length;
  const categories = ['All', ...CATEGORY_ORDER];

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = createOrganicLayout(items, LINKS);
      setPositions(Object.fromEntries(next.map((node) => [node.id, node])));
    }, 80);
    return () => clearTimeout(timer);
  }, [items, category, query]);

  useEffect(() => {
    const element = mapRef.current;
    if (!element) return undefined;
    const handleWheel = (event) => {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 0.93 : 1.075;
      setZoom((value) => Math.min(1.5, Math.max(0.62, +(value * factor).toFixed(3))));
    };
    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleWheel);
  }, []);

  function startDrag(event) {
    if (event.button !== 0 || event.target.closest('.map-node, .map-controls')) return;
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

  function resetView() {
    setZoom(0.9);
    setPan({ x: 0, y: 0 });
  }

  function changeZoom(delta) {
    setZoom((value) => Math.min(1.5, Math.max(0.62, +(value + delta).toFixed(3))));
  }

  function claim(territory) {
    const next = priceFor(territory);
    setItems((current) => current.map((item) => (
      item.id === territory.id ? { ...item, owner: '@you', stake: next } : item
    )));
    setPositions((current) => ({
      ...current,
      [territory.id]: { ...(current[territory.id] || {}), owner: '@you', stake: next },
    }));
    setActive(null);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top">EMPIRE<span>.LOL</span></a>
        <nav>
          <a href="#map">Map</a>
          <a href="#leaderboard">Leaderboard</a>
          <a href="#activity">Activity</a>
          <a href="#how">How it works</a>
        </nav>
        <button className="ghost-btn">
          Build your empire <ArrowUpRight size={15} />
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> THE INTERNET IS FOR SALE</div>
            <h1>OWN THE<br /><em>INTERNET.</em></h1>
            <p>A living map of ideas, places and culture. Find something you care about, then make it yours.</p>
            <div className="hero-actions">
              <a className="primary-btn" href="#map">Explore the map <ArrowUpRight size={16} /></a>
              <a className="text-link" href="#how">How it works <ArrowUpRight size={15} /></a>
            </div>
          </div>
          <div className="hero-stat-card">
            <div className="stat-card-label">LIVE EMPIRE VALUE</div>
            <div className="big-number">£{totalValue.toLocaleString()}</div>
            <div className="mini-grid">
              <span><b>{owned}</b> territories owned</span>
              <span><b>{items.length}</b> territories</span>
            </div>
            <div className="pulse-line"><span>●</span> Graph is live</div>
          </div>
        </section>

        <section id="map" className="map-section">
          <div className="section-head map-head">
            <div>
              <span className="kicker">01 / THE MAP</span>
              <h2>Explore the internet.</h2>
              <p className="map-subtitle">A living graph of ideas. Related things cluster naturally; distant niches drift apart.</p>
            </div>
            <div className="map-tools">
              <div className="search">
                <Search size={15} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a territory" />
              </div>
              <div className="zoom-readout">{Math.round(zoom * 100)}%</div>
            </div>
          </div>

          <div className="map-filter-bar">
            <div className="chips">
              {categories.map((option) => (
                <button
                  key={option}
                  className={category === option ? 'chip active' : 'chip'}
                  onClick={() => setCategory(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="map-help">
              <MousePointer2 size={13} /> hover to reveal connections <span>·</span> drag to roam <span>·</span> scroll to zoom
            </div>
          </div>

          <div
            ref={mapRef}
            className={`map-viewport ${dragging ? 'is-dragging' : ''}`}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div className="map-backdrop">
              <div className="glow glow-1" />
              <div className="glow glow-2" />
              <div className="glow glow-3" />
            </div>

            <div className="map-scene" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
              <svg className="connections" viewBox="0 0 1820 1080" preserveAspectRatio="none">
                {mapLinks.map(([a, b, weight], index) => {
                  const start = positions[a];
                  const end = positions[b];
                  if (!start || !end) return null;
                  const highlighted = hovered && linkedIds.has(a) && linkedIds.has(b);
                  const dx = end.x - start.x;
                  const dy = end.y - start.y;
                  const length = Math.hypot(dx, dy) || 1;
                  const bend = Math.min(90, length * 0.14) * (index % 2 ? 1 : -1);
                  const midX = (start.x + end.x) / 2;
                  const midY = (start.y + end.y) / 2;
                  const controlX = midX + (-dy / length) * bend;
                  const controlY = midY + (dx / length) * bend;
                  return (
                    <path
                      key={`${a}-${b}`}
                      d={`M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`}
                      className={highlighted ? 'thread hot' : 'thread'}
                      style={{ strokeWidth: highlighted ? 2 : 1 + Math.min(weight * 0.25, 0.7) }}
                    />
                  );
                })}
              </svg>

              {CATEGORY_ORDER.map((group) => {
                const [cx, cy] = CATEGORY_CENTRES[group];
                return (
                  <div key={group} className="cluster-title" style={{ left: cx, top: cy - 184 }}>
                    <span className={`cluster-dot ${CATEGORY_TONE[group]}`} />
                    <div>
                      <strong>{group}</strong>
                      <small>{items.filter((item) => item.category === group).length} territories</small>
                    </div>
                  </div>
                );
              })}

              {mapNodes.map((territory) => {
                const position = positions[territory.id];
                if (!position) return null;
                const size = bubbleSize(territory.price);
                const isHot = hovered === territory.id;
                const isLinked = linkedIds.has(territory.id);
                const isDim = Boolean(hovered) && !isLinked;
                return (
                  <button
                    key={territory.id}
                    className={`map-node bubble ${CATEGORY_TONE[territory.category]} ${territory.owner ? 'owned' : ''} ${isHot ? 'hot' : ''} ${isDim ? 'dim' : ''}`}
                    style={{ left: position.x, top: position.y, width: size, height: size, zIndex: isHot ? 50 : isLinked ? 15 : 5 }}
                    onMouseEnter={() => setHovered(territory.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={(event) => {
                      event.stopPropagation();
                      setActive(territory.id);
                    }}
                  >
                    <span className="bubble-glow" />
                    <span className="bubble-content">
                      <span className="bubble-name">{territory.name}</span>
                      <span className="bubble-meta">{territory.owner || `£${priceFor(territory)}`}</span>
                      {territory.owner && <span className="bubble-stake">£{territory.stake}</span>}
                    </span>
                    {territory.owner && <span className="bubble-crown">♛</span>}
                  </button>
                );
              })}
            </div>

            <div className="map-legend">
              <span><i className="legend-dot open" /> open</span>
              <span><i className="legend-dot owned" /> owned</span>
              <span><i className="legend-line" /> related</span>
            </div>
            <div className="map-hint">
              <Grip size={13} /><span>Drag to explore</span><span className="slash" /> <span>Scroll to zoom</span>
            </div>
            <div className="map-controls">
              <button className="map-control" onClick={() => changeZoom(0.12)} aria-label="Zoom in"><ZoomIn size={16} /></button>
              <button className="map-control" onClick={() => changeZoom(-0.12)} aria-label="Zoom out"><ZoomOut size={16} /></button>
              <button className="map-control" onClick={resetView} aria-label="Reset map"><RotateCcw size={15} /></button>
            </div>
          </div>
        </section>

        <section className="split-section">
          <div className="panel" id="activity">
            <div className="panel-head">
              <div><span className="kicker">02 / ACTIVITY</span><h3>Live conquests.</h3></div>
              <span className="live-badge">● LIVE</span>
            </div>
            {[
              ['@northstar', 'conquered', 'AI', '£32', '2m'],
              ['@orbital', 'defended', 'SPACE', '£47', '7m'],
              ['@foundry', 'conquered', 'IRELAND', '£27', '13m'],
              ['@pixelworks', 'conquered', 'GAMING', '£41', '21m'],
            ].map((row, index) => (
              <div className="activity-row" key={index}>
                <div className="activity-icon">{row[1] === 'defended' ? <Shield size={15} /> : <Flame size={15} />}</div>
                <div className="activity-copy"><b>{row[0]}</b> {row[1]} <strong>{row[2]}</strong><span>{row[4]} ago</span></div>
                <div className="activity-price">{row[3]}</div>
              </div>
            ))}
          </div>

          <div className="panel" id="leaderboard">
            <div className="panel-head">
              <div><span className="kicker">03 / RANKINGS</span><h3>Top empires.</h3></div>
              <Crown size={18} />
            </div>
            {[
              ['@orbital', '£482'],
              ['@northstar', '£321'],
              ['@pixelworks', '£241'],
              ['@foundry', '£187'],
              ['@luma', '£96'],
            ].map(([user, value], index) => (
              <div className="rank-row" key={user}>
                <span className="rank">0{index + 1}</span>
                <span className="rank-user">{user}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="how-section">
          <span className="kicker">04 / THE RULES</span>
          <h2>A simple game with<br />one brutal rule.</h2>
          <div className="how-grid">
            <div><span>01</span><h4>Claim</h4><p>Pick an open territory and become its first owner.</p></div>
            <div><span>02</span><h4>Conquer</h4><p>Anyone can take it by beating the current stake.</p></div>
            <div><span>03</span><h4>Defend</h4><p>Lose your territory? Pay the next stake and take it back.</p></div>
            <div><span>04</span><h4>Share</h4><p>Every conquest becomes a public moment worth sharing.</p></div>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand footer-brand">EMPIRE<span>.LOL</span></div>
        <div className="footer-copy">Own the internet. One territory at a time.</div>
        <div className="footer-links"><a href="#map">Map</a><a href="#leaderboard">Rankings</a><a href="#how">Rules</a></div>
      </footer>

      {activeTerritory && (
        <div className="modal-backdrop" onClick={() => setActive(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <button className="close-btn" onClick={() => setActive(null)}><X size={20} /></button>
            <div className="modal-icon"><Sparkles size={24} /></div>
            <span className="kicker">{activeTerritory.category.toUpperCase()} / TERRITORY</span>
            <h3>{activeTerritory.name}</h3>
            <div className="modal-owner"><span>Current owner</span><strong>{activeTerritory.owner || 'Unclaimed'}</strong></div>
            <div className="modal-price"><span>{activeTerritory.owner ? 'Next stake' : 'Starting price'}</span><b>£{priceFor(activeTerritory)}</b></div>
            <button className="primary-btn wide" onClick={() => claim(activeTerritory)}>
              {activeTerritory.owner ? 'Conquer territory' : 'Claim territory'} <ArrowUpRight size={17} />
            </button>
            <p className="demo-note"><Sparkles size={14} /> Prototype mode — checkout is mocked.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

createRoot(document.getElementById('root')).render(<App />);
