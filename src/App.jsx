import React, { useMemo, useState } from 'react';
import { ArrowRight, Search, MapPin, Star, ShieldCheck, Wrench, Sparkles, Zap, Truck, Laptop, Heart, CalendarDays, Plus, Menu, X, MessageCircle, CheckCircle2, UserRound, BriefcaseBusiness } from 'lucide-react';

const providers = [
  { id: 1, name: 'Lebo Home Care', category: 'Cleaning', rating: 4.9, reviews: 128, price: 'From R250', location: 'Pretoria East', initials: 'LH', color: 'mint', description: 'Reliable home and office cleaning with flexible bookings.' },
  { id: 2, name: 'Thabo Electrical', category: 'Electrical', rating: 4.8, reviews: 86, price: 'From R350', location: 'Centurion', initials: 'TE', color: 'gold', description: 'Qualified electrical repairs, installations and fault finding.' },
  { id: 3, name: 'Mpho Tech Studio', category: 'Technology', rating: 5.0, reviews: 54, price: 'From R300', location: 'Hatfield', initials: 'MT', color: 'lavender', description: 'Laptop support, Wi-Fi setup and small-business IT help.' },
  { id: 4, name: 'Kasi Move Crew', category: 'Moving', rating: 4.7, reviews: 73, price: 'From R450', location: 'Pretoria CBD', initials: 'KM', color: 'peach', description: 'Careful, friendly help for moves and furniture delivery.' },
  { id: 5, name: 'Neo Fix & Build', category: 'Repairs', rating: 4.8, reviews: 92, price: 'From R280', location: 'Brooklyn', initials: 'NF', color: 'blue', description: 'Handyman jobs, fixtures, painting and minor home repairs.' },
  { id: 6, name: 'Dineo Garden Works', category: 'Gardening', rating: 4.9, reviews: 41, price: 'From R220', location: 'Moreleta Park', initials: 'DG', color: 'mint', description: 'Garden clean-ups, lawn care and seasonal maintenance.' }
];
const categories = [
  { name: 'Cleaning', icon: Sparkles }, { name: 'Repairs', icon: Wrench },
  { name: 'Electrical', icon: Zap }, { name: 'Moving', icon: Truck },
  { name: 'Technology', icon: Laptop }, { name: 'Gardening', icon: Heart }
];

export default function App() {
  const [mode, setMode] = useState('Request');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All services');
  const [activeTab, setActiveTab] = useState('Discover');
  const [showRequest, setShowRequest] = useState(false);
  const [showProfile, setShowProfile] = useState(null);
  const [requests, setRequests] = useState(() => JSON.parse(localStorage.getItem('thuso-requests') || '[]'));
  const [bookings, setBookings] = useState(() => JSON.parse(localStorage.getItem('thuso-bookings') || '[]'));
  const [favorites, setFavorites] = useState([]);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ title: '', category: 'Cleaning', location: 'Pretoria', details: '', budget: '' });

  const visible = useMemo(() => providers.filter(p =>
    (category === 'All services' || p.category === category) &&
    (p.name + ' ' + p.category + ' ' + p.location + ' ' + p.description).toLowerCase().includes(query.toLowerCase())
  ), [category, query]);

  function saveRequests(next) { setRequests(next); localStorage.setItem('thuso-requests', JSON.stringify(next)); }
  function saveBookings(next) { setBookings(next); localStorage.setItem('thuso-bookings', JSON.stringify(next)); }
  function createRequest(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    saveRequests([{ ...form, id: Date.now(), status: 'Open', createdAt: new Date().toLocaleDateString() }, ...requests]);
    setShowRequest(false); setForm({ title: '', category: 'Cleaning', location: 'Pretoria', details: '', budget: '' });
    setNotice('Your request has been added to the demo request board.');
    setActiveTab('Requests');
  }
  function book(provider) {
    saveBookings([{ id: Date.now(), provider: provider.name, category: provider.category, location: provider.location, status: 'Requested', date: 'Date to be agreed' }, ...bookings]);
    setShowProfile(null); setNotice('Booking request saved. No provider has been contacted.');
    setActiveTab('Bookings');
  }
  const tabs = [{ name: 'Discover', icon: Search }, { name: 'Requests', icon: Plus }, { name: 'Bookings', icon: CalendarDays }];

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => { setActiveTab('Discover'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><span className="brand-mark">t.</span><span>thuso<span className="brand-dot">.</span></span></button>
      <nav className="desktop-nav">{tabs.map(t => <button key={t.name} className={activeTab === t.name ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab(t.name)}>{t.name}</button>)}</nav>
      <div className="top-actions"><button className="mode-switch" onClick={() => setMode(mode === 'Request' ? 'Engage' : 'Request')}><span className={mode === 'Request' ? 'switch-dot request-dot' : 'switch-dot engage-dot'}></span>{mode}</button><button className="avatar-button" aria-label="Switch role" onClick={() => setNotice('Demo profile: signed in as a customer. Authentication is not connected.')}><UserRound size={18}/></button></div>
    </header>

    <main>
      {notice && <div className="notice"><CheckCircle2 size={17}/><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss"><X size={16}/></button></div>}

      {activeTab === 'Discover' && <>
        <section className="hero">
          <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot"></span> YOUR COMMUNITY, CONNECTED</div><h1>Good help is<br/>closer than <em>you think.</em></h1><p>Find trusted local people to get things done — or grow your service business with the people around you.</p>
            <div className="hero-cta"><button className="primary-button" onClick={() => mode === 'Request' ? setShowRequest(true) : document.getElementById('providers')?.scrollIntoView({ behavior: 'smooth' })}>{mode === 'Request' ? 'Request a service' : 'Explore providers'}<ArrowRight size={18}/></button><button className="text-button" onClick={() => setMode(mode === 'Request' ? 'Engage' : 'Request')}>I'm here to {mode === 'Request' ? 'offer a service' : 'request help'}</button></div>
            <div className="trust-row"><div className="trust-avatars"><span>LM</span><span>TK</span><span>AN</span></div><div><strong>Built around local trust</strong><small>Real people. Useful services. One place.</small></div></div>
          </div>
          <div className="hero-art"><div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div><div className="art-sun"></div><div className="art-card art-card-top"><span className="art-icon mint"><Sparkles size={19}/></span><div><strong>Home cleaning</strong><small>Available this week</small></div><span className="art-check"><CheckCircle2 size={17}/></span></div><div className="art-card art-card-bottom"><div className="art-person">L</div><div><strong>Lebo Home Care</strong><small><Star size={12} fill="currentColor"/> 4.9 · Verified-style demo</small></div><span className="art-price">R250+</span></div><div className="art-center"><span>t.</span><small>help starts here</small></div><div className="floating-bubble bubble-one"><ShieldCheck size={20}/></div><div className="floating-bubble bubble-two"><Heart size={19}/></div></div>
        </section>

        <section className="journeys"><div className="section-heading"><div><span className="eyebrow">TWO WAYS TO GET STARTED</span><h2>What brings you here?</h2></div><p>One community, two simple ways to make progress.</p></div>
          <div className="journey-grid"><button className={mode === 'Request' ? 'journey-card request-card selected' : 'journey-card request-card'} onClick={() => { setMode('Request'); setShowRequest(true); }}><span className="journey-icon"><Search size={23}/></span><span className="journey-label">01 / REQUEST</span><strong>Get the help<br/>you need.</strong><small>Describe the job, compare offers, and choose who feels right.</small><span className="journey-arrow"><ArrowRight size={19}/></span></button>
            <button className={mode === 'Engage' ? 'journey-card engage-card selected' : 'journey-card engage-card'} onClick={() => { setMode('Engage'); document.getElementById('providers')?.scrollIntoView({ behavior: 'smooth' }); }}><span className="journey-icon"><BriefcaseBusiness size={23}/></span><span className="journey-label">02 / ENGAGE</span><strong>Put your skills<br/>to work.</strong><small>Discover local talent, connect directly, and plan the next step.</small><span className="journey-arrow"><ArrowRight size={19}/></span></button></div>
        </section>

        <section className="provider-section" id="providers"><div className="section-heading provider-heading"><div><span className="eyebrow">{mode === 'Request' ? 'LOCAL PEOPLE, READY TO HELP' : 'MEET YOUR NEXT CUSTOMER OR PARTNER'}</span><h2>{mode === 'Request' ? 'Find your kind of help.' : 'People with skills to share.'}</h2></div><button className="outline-button" onClick={() => setCategory('All services')}>View all services <ArrowRight size={16}/></button></div>
          <div className="search-row"><div className="search-box"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Try “electrician” or “cleaning”"/></div><div className="location-chip"><MapPin size={17}/> Pretoria, South Africa <span className="location-caret">⌄</span></div></div>
          <div className="category-row"><button className={category === 'All services' ? 'category-pill active' : 'category-pill'} onClick={() => setCategory('All services')}>All services</button>{categories.map(c => <button key={c.name} className={category === c.name ? 'category-pill active' : 'category-pill'} onClick={() => setCategory(c.name)}><c.icon size={15}/>{c.name}</button>)}</div>
          <div className="provider-grid">{visible.map(p => <article className="provider-card" key={p.id}><div className={'provider-cover '+p.color}><span className="provider-initials">{p.initials}</span><button className={favorites.includes(p.id) ? 'favorite saved' : 'favorite'} onClick={() => setFavorites(favorites.includes(p.id) ? favorites.filter(x => x !== p.id) : [...favorites, p.id])} aria-label="Save provider"><Heart size={17} fill={favorites.includes(p.id) ? 'currentColor' : 'none'}/></button><span className="cover-category">{p.category}</span></div><div className="provider-content"><div className="provider-name-row"><h3>{p.name}</h3><span className="rating"><Star size={13} fill="currentColor"/>{p.rating.toFixed(1)}</span></div><p className="provider-description">{p.description}</p><div className="provider-meta"><span><MapPin size={14}/>{p.location}</span><span>{p.reviews} reviews (demo)</span></div><div className="provider-footer"><strong>{p.price}</strong><button onClick={() => setShowProfile(p)}>View profile <ArrowRight size={15}/></button></div></div></article>)}</div>
          {visible.length === 0 && <div className="empty-state"><Search size={26}/><h3>No matches yet</h3><p>Try another search or choose a different category.</p><button className="outline-button" onClick={() => { setQuery(''); setCategory('All services'); }}>Clear filters</button></div>}
        </section>
        <section className="bottom-banner"><div className="banner-mark">t.</div><div><span className="eyebrow">GOOD WORK TRAVELS LOCALLY</span><h2>Your skills could be<br/>someone's solution.</h2><p>Make your next connection count.</p></div><button className="primary-button" onClick={() => setMode('Engage')}>Explore Engage <ArrowRight size={17}/></button><div className="banner-shape"></div></section>
      </>}

      {activeTab === 'Requests' && <section className="workspace"><div className="section-heading"><div><span className="eyebrow">YOUR REQUEST BOARD</span><h2>Requests, in one place.</h2><p className="subheading">Demo requests saved in this browser.</p></div><button className="primary-button" onClick={() => setShowRequest(true)}><Plus size={18}/> New request</button></div>{requests.length ? <div className="request-list">{requests.map(r => <article className="request-item" key={r.id}><div className="request-symbol"><Wrench size={20}/></div><div className="request-info"><span className="status">{r.status}</span><h3>{r.title}</h3><p>{r.category} · {r.location} · Added {r.createdAt}</p>{r.details && <small>{r.details}</small>}</div><strong>{r.budget ? 'Budget: R'+r.budget : 'Budget flexible'}</strong></article>)}</div> : <div className="empty-state"><Plus size={28}/><h3>No requests yet</h3><p>Describe what you need and keep your service requests together.</p><button className="primary-button" onClick={() => setShowRequest(true)}>Create a request <ArrowRight size={17}/></button></div>}</section>}

      {activeTab === 'Bookings' && <section className="workspace"><div className="section-heading"><div><span className="eyebrow">YOUR PLANS</span><h2>Bookings & connections.</h2><p className="subheading">Booking requests are demo-only and have not been sent to providers.</p></div></div>{bookings.length ? <div className="request-list">{bookings.map(b => <article className="request-item" key={b.id}><div className="request-symbol"><CalendarDays size={20}/></div><div className="request-info"><span className="status">{b.status}</span><h3>{b.provider}</h3><p>{b.category} · {b.location}</p><small>{b.date}</small></div><button className="outline-button" onClick={() => setNotice('Messaging is not connected in this prototype.')}> <MessageCircle size={15}/> Message</button></article>)}</div> : <div className="empty-state"><CalendarDays size={28}/><h3>Your next connection starts here</h3><p>Choose a provider and request a booking to see it here.</p><button className="outline-button" onClick={() => setActiveTab('Discover')}>Explore providers <ArrowRight size={16}/></button></div>}</section>}

      <footer><div className="footer-brand"><span className="brand-mark">t.</span><strong>thuso.</strong></div><p>Making local services easier to find, offer and trust.</p><div className="footer-links"><span>Request</span><span>Engage</span><span>Community first</span></div><small>© 2026 Thuso Marketplace · Early prototype</small></footer>
    </main>

    {showRequest && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowRequest(false)}><section className="modal"><div className="modal-heading"><div><span className="eyebrow">REQUEST / START HERE</span><h2>What do you need done?</h2><p>Give local providers enough detail to understand the job.</p></div><button className="icon-button" onClick={() => setShowRequest(false)} aria-label="Close"><X size={20}/></button></div><form onSubmit={createRequest}><label>Request title<input required value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="e.g. Fix a leaking kitchen tap"/></label><div className="form-row"><label>Service category<select value={form.category} onChange={e => setForm({...form, category:e.target.value})}>{categories.map(c => <option key={c.name}>{c.name}</option>)}</select></label><label>Location<input required value={form.location} onChange={e => setForm({...form, location:e.target.value})} placeholder="Your area"/></label></div><label>Describe the job<textarea value={form.details} onChange={e => setForm({...form, details:e.target.value})} placeholder="What should the provider know?" rows="3"/></label><label>Estimated budget (R, optional)<input type="number" min="0" value={form.budget} onChange={e => setForm({...form, budget:e.target.value})} placeholder="e.g. 500"/></label><div className="form-note"><ShieldCheck size={17}/><span>Prototype only: this request is saved on this device, not published to providers.</span></div><button className="primary-button submit-button" type="submit">Save request <ArrowRight size={17}/></button></form></section></div>}

    {showProfile && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowProfile(null)}><section className="modal profile-modal"><div className={'profile-cover '+showProfile.color}><span className="profile-initials">{showProfile.initials}</span><button className="icon-button" onClick={() => setShowProfile(null)} aria-label="Close"><X size={20}/></button></div><div className="profile-body"><span className="eyebrow">{showProfile.category.toUpperCase()} / LOCAL PROVIDER</span><h2>{showProfile.name}</h2><div className="profile-rating"><Star size={15} fill="currentColor"/>{showProfile.rating} <span>· {showProfile.reviews} demo reviews</span></div><p>{showProfile.description}</p><div className="profile-detail"><MapPin size={17}/>{showProfile.location}<span className="price-detail">{showProfile.price}</span></div><div className="form-note"><ShieldCheck size={17}/><span>Provider details and reviews are sample data, not verified listings.</span></div><button className="primary-button submit-button" onClick={() => book(showProfile)}>Request a booking <ArrowRight size={17}/></button><button className="outline-button full-width" onClick={() => setNotice('Direct messaging is not connected yet.')}> <MessageCircle size={16}/> Message provider</button></div></section></div>}
  </div>;
}