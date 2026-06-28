export default function LandingPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; background: #F0F4F2; }
        .sans { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        nav { background: #0A5C47; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 60px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,0.18); }
        .nav-logo { display: flex; align-items: center; gap: 10px; }
        .nav-logo-icon { width: 34px; height: 34px; background: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-weight: 700; font-size: 12px; color: #0F6E56; }
        .nav-brand { color: #fff; font-family: sans-serif; font-weight: 600; font-size: 15px; }
        .nav-brand span { color: #EF9F27; font-size: 11px; display: block; font-weight: 400; letter-spacing: 1px; text-transform: uppercase; }
        .nav-links { display: flex; align-items: center; gap: 6px; }
        .nav-link { color: rgba(255,255,255,0.85); font-family: sans-serif; font-size: 13px; padding: 6px 12px; border-radius: 6px; cursor: pointer; text-decoration: none; border: none; background: none; }
        .nav-link:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .nav-admin { background: #EF9F27; color: #412402; font-family: sans-serif; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 6px; cursor: pointer; border: none; text-decoration: none; }
        .nav-admin:hover { background: #FAC775; }
        .hero { background: linear-gradient(135deg, #0A5C47 0%, #0F6E56 60%, #12805F 100%); padding: 5rem 2rem 4rem; text-align: center; }
        .hero-tag { display: inline-block; background: rgba(255,255,255,0.15); color: #E1F5EE; font-family: sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; padding: 5px 14px; border-radius: 99px; margin-bottom: 1.5rem; }
        .hero h1 { color: #fff; font-size: 2.4rem; font-weight: 700; line-height: 1.25; margin-bottom: 1rem; max-width: 560px; margin-left: auto; margin-right: auto; }
        .hero h1 em { color: #EF9F27; font-style: normal; }
        .hero p { color: rgba(255,255,255,0.85); font-family: sans-serif; font-size: 15px; line-height: 1.7; max-width: 480px; margin: 0 auto 2rem; }
        .hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-primary { background: #EF9F27; color: #412402; font-family: sans-serif; font-weight: 600; font-size: 14px; padding: 10px 24px; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        .btn-outline { background: transparent; color: #fff; font-family: sans-serif; font-weight: 500; font-size: 14px; padding: 10px 24px; border-radius: 8px; border: 1.5px solid rgba(255,255,255,0.5); cursor: pointer; }
        .section { padding: 4rem 2rem; background: #F0F4F2; }
        .section-tag { font-family: sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #0F6E56; font-weight: 600; margin-bottom: 0.5rem; }
        .section h2 { font-size: 1.9rem; color: #1a1a1a; margin-bottom: 0.75rem; font-weight: 700; }
        .section-sub { font-family: sans-serif; font-size: 15px; color: #444; line-height: 1.7; max-width: 500px; margin-bottom: 2.5rem; }
        .stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: #d4e4dc; border: 1px solid #d4e4dc; border-radius: 12px; overflow: hidden; margin-bottom: 3rem; box-shadow: 0 2px 10px rgba(15,110,86,0.08); }
        .stat-item { background: #ffffff; padding: 1.5rem; text-align: center; }
        .stat-num { font-size: 2rem; font-weight: 700; color: #0F6E56; font-family: sans-serif; }
        .stat-lbl { font-family: sans-serif; font-size: 12px; color: #777; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px,1fr)); gap: 16px; }
        .value-card { padding: 1.5rem; border: 1px solid #d4e4dc; border-radius: 12px; background: #ffffff; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
        .value-icon { width: 36px; height: 36px; background: #D6EEE6; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
        .value-title { font-family: sans-serif; font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; }
        .value-desc { font-family: sans-serif; font-size: 12px; color: #555; line-height: 1.6; }
        .apps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 16px; }
        .app-card { border: 1px solid #d4e4dc; border-radius: 14px; overflow: hidden; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; background: #ffffff; box-shadow: 0 1px 5px rgba(0,0,0,0.06); }
        .app-card:hover { border-color: #0F6E56; box-shadow: 0 4px 16px rgba(15,110,86,0.12); }
        .app-card-top { padding: 1.5rem 1.25rem 1rem; background: #F7FAF8; }
        .app-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; font-size: 22px; }
        .app-icon.green { background: #0F6E56; }
        .app-icon.blue { background: #185FA5; }
        .app-icon.amber { background: #854F0B; }
        .app-name { font-family: sans-serif; font-size: 15px; font-weight: 600; color: #1a1a1a; margin-bottom: 4px; }
        .app-status { font-family: sans-serif; font-size: 11px; padding: 2px 8px; border-radius: 99px; display: inline-block; }
        .status-live { background: #D6EEE6; color: #085041; }
        .status-dev { background: #FAEEDA; color: #633806; }
        .app-card-body { padding: 1rem 1.25rem; background: #ffffff; }
        .app-desc { font-family: sans-serif; font-size: 13px; color: #555; line-height: 1.6; margin-bottom: 1rem; }
        .app-link { font-family: sans-serif; font-size: 12px; color: #0F6E56; font-weight: 600; }
        .app-detail { background: #EAF4EF; border: 1px solid #b8dccb; border-radius: 14px; padding: 2rem; margin-top: 1.5rem; display: none; box-shadow: 0 2px 10px rgba(15,110,86,0.07); }
        .app-detail.open { display: block; }
        .app-detail h3 { font-size: 1.2rem; font-weight: 700; color: #085041; margin-bottom: 0.5rem; }
        .app-detail p { font-family: sans-serif; font-size: 14px; color: #085041; line-height: 1.7; margin-bottom: 1rem; }
        .feature-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px,1fr)); gap: 10px; }
        .feature-item { background: #fff; border: 1px solid #c8e8dc; border-radius: 10px; padding: 12px; font-family: sans-serif; font-size: 12px; color: #1a1a1a; line-height: 1.4; display: flex; gap: 8px; align-items: flex-start; }
        .fi-blue { border-color: #B5D4F4; }
        .fi-amber { border-color: #FAC775; }
        .contact-section { background: linear-gradient(135deg, #0A5C47 0%, #0F6E56 100%); padding: 3.5rem 2rem; text-align: center; }
        .contact-section h2 { color: #fff; font-size: 1.7rem; margin-bottom: 0.75rem; }
        .contact-section p { color: rgba(255,255,255,0.85); font-family: sans-serif; font-size: 14px; margin-bottom: 1.5rem; }
        .contact-email { color: #EF9F27; font-family: sans-serif; font-size: 15px; font-weight: 600; text-decoration: none; }
        footer { background: #073D2E; padding: 1.5rem 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
        .footer-txt { color: rgba(255,255,255,0.7); font-family: sans-serif; font-size: 12px; }
        .footer-txt strong { color: #fff; }
        .footer-links { display: flex; gap: 16px; }
        .footer-a { color: rgba(255,255,255,0.6); font-family: sans-serif; font-size: 12px; text-decoration: none; }
        .footer-a:hover { color: #EF9F27; }
        .divider { height: 1px; background: #d4e4dc; margin: 0 2rem; }
        @media (max-width: 600px) {
          .hero h1 { font-size: 1.7rem; }
          .nav-links { gap: 2px; }
          .nav-link { display: none; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <div className="nav-logo">
          <div className="nav-logo-icon">AFT</div>
          <div className="nav-brand">AFTech <span>Software Limited</span></div>
        </div>
        <div className="nav-links">
          <a className="nav-link" href="#about">About</a>
          <a className="nav-link" href="#apps">Apps</a>
          <a className="nav-link" href="#contact">Contact</a>
          <a className="nav-admin" href="/admin">Admin Login</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-tag">AFTech Software Limited</div>
        <h1>Building apps that <em>simplify</em> everyday life</h1>
        <p className="sans">We design and develop user-friendly mobile applications for individuals, communities, and organisations across India.</p>
        <div className="hero-btns">
          <a href="#apps"><button className="btn-primary">Explore our apps</button></a>
          <a href="#about"><button className="btn-outline">About AFTech</button></a>
        </div>
      </div>

      {/* ABOUT */}
      <div className="section" id="about">
        <div className="section-tag">Who we are</div>
        <h2 className="section">About AFTech</h2>
        <p className="section-sub sans">AFTech Software Limited is an independent mobile app development studio based in Andhra Pradesh, India. We build practical, affordable technology solutions for real people.</p>
        <div className="stats-row">
          <div className="stat-item"><div className="stat-num">3</div><div className="stat-lbl">Apps in pipeline</div></div>
          <div className="stat-item"><div className="stat-num">1</div><div className="stat-lbl">Live app</div></div>
          <div className="stat-item"><div className="stat-num">100%</div><div className="stat-lbl">Made in India</div></div>
        </div>
        <div className="values-grid">
          {[
            { icon: "📱", title: "Mobile first", desc: "Every app is designed for Android devices used by everyday Indians." },
            { icon: "👥", title: "Community focused", desc: "Our apps solve real problems faced by local communities and groups." },
            { icon: "🔒", title: "Secure & private", desc: "User data is protected with industry-standard encryption and secure backends." },
            { icon: "💰", title: "Affordable pricing", desc: "One-time lifetime pricing — no monthly subscriptions, no hidden fees." },
          ].map(v => (
            <div className="value-card" key={v.title}>
              <div className="value-icon" style={{ fontSize: 18 }}>{v.icon}</div>
              <div className="value-title">{v.title}</div>
              <div className="value-desc">{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* APPS */}
      <div className="section" id="apps">
        <div className="section-tag">Our applications</div>
        <h2 className="section">Apps we build</h2>
        <p className="section-sub sans">Click any app to learn more about what it does and why it matters.</p>
        <div className="apps-grid">
          {/* Contributions Manager */}
          <div className="app-card" onClick={() => {
            const el = document.getElementById('detail-cm');
            if (el) el.classList.toggle('open');
          }}>
            <div className="app-card-top">
              <div className="app-icon green" style={{ color: '#fff', fontSize: 22 }}>💰</div>
              <div className="app-name">Contributions Manager</div>
              <span className="app-status status-live">Live</span>
            </div>
            <div className="app-card-body">
              <div className="app-desc">Manage monthly contributions, collectors, pledges, and reports for your community or organisation.</div>
              <div className="app-link">▶ View details</div>
            </div>
          </div>

          {/* 3rd Eye */}
          <div className="app-card" onClick={() => {
            const el = document.getElementById('detail-eye');
            if (el) el.classList.toggle('open');
          }}>
            <div className="app-card-top">
              <div className="app-icon blue" style={{ color: '#fff', fontSize: 22 }}>👁</div>
              <div className="app-name">3rd Eye</div>
              <span className="app-status status-dev">In development</span>
            </div>
            <div className="app-card-body">
              <div className="app-desc">A smart surveillance and monitoring app that keeps a watchful eye on what matters most to you.</div>
              <div className="app-link">▶ View details</div>
            </div>
          </div>

          {/* Rank Your Neta */}
          <div className="app-card" onClick={() => {
            const el = document.getElementById('detail-neta');
            if (el) el.classList.toggle('open');
          }}>
            <div className="app-card-top">
              <div className="app-icon amber" style={{ color: '#fff', fontSize: 22 }}>🏆</div>
              <div className="app-name">Rank Your Neta</div>
              <span className="app-status status-dev">In development</span>
            </div>
            <div className="app-card-body">
              <div className="app-desc">Rate and rank your local political representatives based on performance, promises, and public opinion.</div>
              <div className="app-link">▶ View details</div>
            </div>
          </div>
        </div>

        {/* App Details */}
        <div className="app-detail" id="detail-cm">
          <h3>Contributions Manager</h3>
          <p>Helps mosques, societies, welfare groups, and community organisations track monthly donations, manage collectors, record pledges, and generate reports — all from a mobile app.</p>
          <div className="feature-list">
            {["Track monthly contributions per member","Manage collector staff with role access","Special pledge recording and follow-up","Missed payment alerts and reports","Secure cloud backup via Supabase","One-time lifetime purchase"].map(f => (
              <div className="feature-item" key={f}><span style={{color:'#0F6E56',flexShrink:0}}>✓</span> {f}</div>
            ))}
          </div>
          <div style={{marginTop:'1.25rem'}}>
            <a href="/app" style={{background:'#0F6E56',color:'#fff',fontFamily:'sans-serif',fontSize:13,fontWeight:600,padding:'10px 20px',borderRadius:8,textDecoration:'none'}}>Open app →</a>
          </div>
        </div>

        <div className="app-detail" id="detail-eye" style={{borderColor:'#B5D4F4',background:'#EBF4FD'}}>
          <h3 style={{color:'#0C447C'}}>3rd Eye</h3>
          <p style={{color:'#0C447C'}}>An upcoming monitoring app designed to give individuals and families a smarter way to stay aware, safe, and informed. Currently in active development.</p>
          <div className="feature-list">
            {["Real-time monitoring alerts","Smart push notifications","Privacy-first architecture","Coming soon in 2026"].map(f => (
              <div className="feature-item fi-blue" key={f}><span style={{color:'#185FA5',flexShrink:0}}>✓</span> {f}</div>
            ))}
          </div>
        </div>

        <div className="app-detail" id="detail-neta" style={{borderColor:'#FAC775',background:'#FEF7EC'}}>
          <h3 style={{color:'#633806'}}>Rank Your Neta</h3>
          <p style={{color:'#633806'}}>Empowers Indian citizens to publicly rate their local politicians based on work done, promises kept, and community feedback — bringing transparency to local governance.</p>
          <div className="feature-list">
            {["Rate MLAs, MPs, and corporators","Constituency-level rankings","Community voting and reviews","Coming soon in 2026"].map(f => (
              <div className="feature-item fi-amber" key={f}><span style={{color:'#854F0B',flexShrink:0}}>✓</span> {f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div className="contact-section" id="contact">
        <h2>Get in touch</h2>
        <p className="sans">Have a question about our apps or want to partner with us?</p>
        <a className="contact-email" href="mailto:admin@aftechs.in">admin@aftechs.in</a>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-txt"><strong>AFTech Software Limited</strong> &nbsp;·&nbsp; Andhra Pradesh, India &nbsp;·&nbsp; © 2026</div>
        <div className="footer-links">
          <a className="footer-a" href="#apps">Apps</a>
          <a className="footer-a" href="#about">About</a>
          <a className="footer-a" href="/admin">Admin</a>
        </div>
      </footer>
    </>
  );
}
