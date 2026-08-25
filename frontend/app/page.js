"use client";

import { useEffect, useState } from "react";

const siteId = "site_demo_8fk2";
const points = [36, 48, 42, 69, 55, 77, 64, 91, 82, 109, 96, 124, 118, 141];
const installSnippet = `<script defer src="https://cdn.signalist.dev/tracker.js"
  data-site-id="${siteId}"></script>`;

function Icon({ children }) { return <span className="icon">{children}</span>; }

export default function Dashboard() {
  const [copied, setCopied] = useState(false);
  const [overview, setOverview] = useState({ pageviews: 1842, customEvents: 376, topPages: [{ path: "/", views: 742 }, { path: "/pricing", views: 318 }, { path: "/blog/launch", views: 201 }] });
  const [active, setActive] = useState("Overview");

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/sites/${siteId}/overview`).then(response => response.ok && response.json())
      .then(data => data && (data.pageviews || data.customEvents) && setOverview(data)).catch(() => {});
  }, []);

  const copy = async () => { await navigator.clipboard?.writeText(installSnippet); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const max = Math.max(...points);

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="logo"><i /><i /><i /></span>signalist</div>
      <div className="workspace"><span className="workspace-dot" /> ACME STUDIO <span>⌄</span></div>
      <nav>{["Overview", "Live", "Events", "Goals", "Settings"].map(item => <button key={item} className={active === item ? "selected" : ""} onClick={() => setActive(item)}><Icon>{item === "Overview" ? "⊞" : item === "Live" ? "◉" : item === "Events" ? "⌁" : item === "Goals" ? "◎" : "⚙"}</Icon>{item}{item === "Live" && <b>4</b>}</button>)}</nav>
      <div className="site-card"><span className="site-icon">S</span><div><strong>signalist.dev</strong><small>Production</small></div><span>⌄</span></div>
      <div className="profile"><span>AD</span><div><strong>Alex Doe</strong><small>Free plan</small></div><button>•••</button></div>
    </aside>
    <main>
      <header><div><p className="eyebrow">OVERVIEW</p><h1>{active === "Overview" ? "Good morning, Alex." : active}</h1><p className="sub">{active === "Overview" ? "Here’s how your site is performing." : "Your Signalist workspace."}</p></div><button className="range">Last 30 days <span>⌄</span></button></header>
      {active === "Overview" ? <>
        <section className="metrics">
          <Metric label="Pageviews" value={overview.pageviews.toLocaleString()} trend="+18.6%" icon="↗" />
          <Metric label="Visitors" value="1,294" trend="+12.4%" icon="♙" />
          <Metric label="Bounce rate" value="32.8%" trend="−4.1%" icon="↘" good />
          <Metric label="Custom events" value={overview.customEvents.toLocaleString()} trend="+24.8%" icon="⌁" />
        </section>
        <section className="panel chart-panel"><div className="panel-head"><div><h2>Traffic</h2><p>Pageviews over the selected period</p></div><button className="more">•••</button></div><div className="chart"><div className="axis"><span>150</span><span>100</span><span>50</span><span>0</span></div><div className="bars">{points.map((point, i) => <div className="bar-wrap" key={i}><div className="bar" style={{ height: `${(point / max) * 178}px` }} /></div>)}</div></div><div className="dates"><span>Jun 01</span><span>Jun 06</span><span>Jun 11</span><span>Jun 16</span><span>Jun 21</span><span>Jun 26</span><span>Jun 30</span></div></section>
        <section className="lower"><div className="panel pages"><div className="panel-head"><div><h2>Top pages</h2><p>Most visited paths</p></div><button className="text-button">View report →</button></div><table><thead><tr><th>PAGE</th><th>VIEWS</th><th /></tr></thead><tbody>{overview.topPages.map((page, index) => <tr key={page.path}><td><span className="page-rank">0{index + 1}</span>{page.path}</td><td>{page.views.toLocaleString()}</td><td><span className="mini-bar"><i style={{ width: `${Math.max(18, page.views / 7.42)}%` }} /></span></td></tr>)}</tbody></table></div>
          <div className="panel install"><span className="install-mark">⌘</span><h2>Start tracking in minutes</h2><p>Add the snippet to your website. Signalist will automatically track page views and referrers.</p><pre>{installSnippet}</pre><button onClick={copy}>{copied ? "Copied!" : "Copy tracking snippet"}</button><a href="#react">Using React? View the SDK →</a></div></section>
      </> : <section className="panel blank"><span className="blank-icon">{active === "Live" ? "◉" : "⌁"}</span><h2>{active} is ready for your data</h2><p>Connect the tracker, then watch your product activity appear here.</p></section>}
    </main>
  </div>;
}

function Metric({ label, value, trend, icon, good }) { return <article className="metric"><div><span>{label}</span><strong>{value}</strong><em className={good ? "good" : ""}>{trend} <small>vs previous</small></em></div><Icon>{icon}</Icon></article>; }
