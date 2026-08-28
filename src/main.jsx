import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Crown, Flame, Globe2, Menu, Search, Shield, Sparkles, X } from 'lucide-react';
import './styles.css';

const territories = [
  ['ai', 'AI', 'Technology', 25], ['software', 'Software', 'Technology', 10], ['programming', 'Programming', 'Technology', 10],
  ['javascript', 'JavaScript', 'Technology', 10], ['python', 'Python', 'Technology', 10], ['web-development', 'Web Development', 'Technology', 10],
  ['cybersecurity', 'Cybersecurity', 'Technology', 10], ['robotics', 'Robotics', 'Technology', 25], ['3d-printing', '3D Printing', 'Technology', 10],
  ['hardware', 'Hardware', 'Technology', 10], ['cloud', 'Cloud', 'Technology', 10], ['open-source', 'Open Source', 'Technology', 10],
  ['apps', 'Apps', 'Technology', 10], ['startups', 'Startups', 'Technology', 25], ['saas', 'SaaS', 'Technology', 25],
  ['data', 'Data', 'Technology', 10], ['ar-vr', 'AR/VR', 'Technology', 10], ['blockchain', 'Blockchain', 'Technology', 10],
  ['bitcoin', 'Bitcoin', 'Technology', 25], ['tech', 'Tech', 'Technology', 100],
  ['marketing', 'Marketing', 'Business', 10], ['advertising', 'Advertising', 'Business', 10], ['ecommerce', 'E-commerce', 'Business', 10],
  ['finance', 'Finance', 'Business', 25], ['investing', 'Investing', 'Business', 10], ['entrepreneurship', 'Entrepreneurship', 'Business', 10],
  ['consulting', 'Consulting', 'Business', 10], ['freelancing', 'Freelancing', 'Business', 5], ['real-estate', 'Real Estate', 'Business', 10],
  ['banking', 'Banking', 'Business', 25], ['venture-capital', 'Venture Capital', 'Business', 25], ['productivity', 'Productivity', 'Business', 10],
  ['jobs', 'Jobs', 'Business', 10], ['money', 'Money', 'Business', 25], ['business', 'Business', 'Business', 100],
  ['space', 'Space', 'Science', 25], ['rockets', 'Rockets', 'Science', 10], ['aerospace', 'Aerospace', 'Science', 25],
  ['aviation', 'Aviation', 'Science', 10], ['engineering', 'Engineering', 'Science', 25], ['physics', 'Physics', 'Science', 10],
  ['chemistry', 'Chemistry', 'Science', 10], ['biology', 'Biology', 'Science', 10], ['astronomy', 'Astronomy', 'Science', 10],
  ['nuclear', 'Nuclear', 'Science', 10], ['energy', 'Energy', 'Science', 10], ['climate', 'Climate', 'Science', 10],
  ['science', 'Science', 'Science', 25], ['mars', 'Mars', 'Science', 25], ['earth', 'Earth', 'Science', 100],
  ['gaming', 'Gaming', 'Culture', 25], ['music', 'Music', 'Culture', 25], ['movies', 'Movies', 'Culture', 10], ['anime', 'Anime', 'Culture', 10],
  ['memes', 'Memes', 'Culture', 25], ['youtube', 'YouTube', 'Culture', 25], ['streaming', 'Streaming', 'Culture', 10], ['tiktok', 'TikTok', 'Culture', 25],
  ['football', 'Football', 'Culture', 25], ['sports', 'Sports', 'Culture', 25], ['photography', 'Photography', 'Culture', 10], ['art', 'Art', 'Culture', 10],
  ['fashion', 'Fashion', 'Culture', 10], ['travel', 'Travel', 'Culture', 10], ['culture', 'Culture', 'Culture', 25],
  ['ireland', 'Ireland', 'Places', 25], ['dublin', 'Dublin', 'Places', 25], ['belfast', 'Belfast', 'Places', 10], ['uk', 'UK', 'Places', 50],
  ['london', 'London', 'Places', 50], ['europe', 'Europe', 'Places', 50], ['usa', 'USA', 'Places', 50], ['new-york', 'New York', 'Places', 25],
  ['california', 'California', 'Places', 25], ['canada', 'Canada', 'Places', 25], ['australia', 'Australia', 'Places', 25], ['japan', 'Japan', 'Places', 25],
  ['south-korea', 'South Korea', 'Places', 10], ['china', 'China', 'Places', 25], ['india', 'India', 'Places', 25], ['singapore', 'Singapore', 'Places', 10],
  ['germany', 'Germany', 'Places', 25], ['france', 'France', 'Places', 25], ['italy', 'Italy', 'Places', 10], ['world', 'World', 'Places', 100],
  ['cars', 'Cars', 'Wildcard', 10], ['coffee', 'Coffee', 'Wildcard', 5], ['food', 'Food', 'Wildcard', 10], ['fitness', 'Fitness', 'Wildcard', 10],
  ['education', 'Education', 'Wildcard', 10], ['university', 'University', 'Wildcard', 10], ['work', 'Work', 'Wildcard', 5], ['internet', 'Internet', 'Wildcard', 100],
  ['future', 'Future', 'Wildcard', 25], ['freedom', 'Freedom', 'Wildcard', 10], ['luxury', 'Luxury', 'Wildcard', 10], ['everything', 'Everything', 'Wildcard', 100], ['nothing', 'Nothing', 'Wildcard', 10]
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

function App() {
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [mobileNav, setMobileNav] = useState(false);
  const [items, setItems] = useState(initialTerritories);

  const filtered = useMemo(() => items.filter(t =>
    (category === 'All' || t.category === category) &&
    t.name.toLowerCase().includes(query.toLowerCase())
  ), [items, query, category]);

  const activeTerritory = active ? items.find(x => x.id === active) : null;
  const total = items.reduce((sum, t) => sum + (t.owner ? t.stake : 0), 0);
  const owned = items.filter(t => t.owner).length;
  const priceFor = (t) => t.owner ? Math.max(t.stake + 2, Math.ceil(t.stake * 1.1)) : t.price;

  function demoClaim(t) {
    const price = priceFor(t);
    setItems(prev => prev.map(item => item.id === t.id ? ({ ...item, owner: '@you', stake: price }) : item));
    setActive(null);
  }

  const categories = ['All', 'Technology', 'Business', 'Science', 'Culture', 'Places', 'Wildcard'];

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
            <div className="big-number">£{total.toLocaleString()}</div>
            <div className="mini-grid"><span><b>{owned}</b> territories owned</span><span><b>100</b> total territories</span></div>
            <div className="pulse-line"><span>●</span> Live map activity</div>
          </div>
        </section>

        <section id="map" className="map-section">
          <div className="section-head"><div><span className="kicker">01 / THE MAP</span><h2>Build your empire.</h2></div><div className="map-tools"><div className="search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search territories"/></div></div></div>
          <div className="category-row">{categories.map(c => <button key={c} className={category === c ? 'chip active' : 'chip'} onClick={() => setCategory(c)}>{c}</button>)}</div>
          <div className="territory-grid">{filtered.map((t, i) => <button key={t.id} className={t.owner ? 'territory-card owned' : 'territory-card'} onClick={() => setActive(t.id)}><div className="territory-top"><span className="territory-index">#{String(i + 1).padStart(2,'0')}</span><span className={t.owner ? 'owned-pill' : 'claim-pill'}>{t.owner ? 'OWNED' : 'OPEN'}</span></div><div className="territory-name">{t.name}</div><div className="territory-bottom"><span>{t.owner || 'Unclaimed'}</span><strong>£{priceFor(t)}</strong></div></button>)}</div>
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
