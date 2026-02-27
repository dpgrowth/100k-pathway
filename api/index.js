  // ═══════════════════════════════════════════════════════════════
  //  100K PATHWAY — Single-file Vercel Serverless Function
  //  GET  /api  → serves the full HTML page
  //  POST /api  → receives form data, logs it, returns JSON
  // ═══════════════════════════════════════════════════════════════

  export default function handler(req, res) {

    // ─────────────────────────────────────────────
    //  POST — Save / log form submission
    // ─────────────────────────────────────────────
    if (req.method === 'POST') {
      try {
        const {
          full_name,
          email,
          country_code,
          phone,
          plan,
          experience,
        } = req.body;

        // Validate required fields
        if (!full_name || !email || !phone || !plan || !experience) {
          return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const submission = {
          id           : `APP-${Date.now()}`,
          full_name,
          email,
          country_code : country_code || '+1',
          phone,
          plan,
          experience,
          submitted_at : new Date().toISOString(),
          ip           : req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown',
        };

        // ── Logs appear in Vercel Dashboard → Project → Functions → Logs ──
        console.log('═══════════════════════════════════════');
        console.log('  NEW APPLICATION RECEIVED');
        console.log('═══════════════════════════════════════');
        console.log(`  ID          : ${submission.id}`);
        console.log(`  Name        : ${submission.full_name}`);
        console.log(`  Email       : ${submission.email}`);
        console.log(`  Phone       : ${submission.country_code} ${submission.phone}`);
        console.log(`  Plan        : ${submission.plan}`);
        console.log(`  Experience  : ${submission.experience}`);
        console.log(`  Submitted   : ${submission.submitted_at}`);
        console.log(`  IP          : ${submission.ip}`);
        console.log('═══════════════════════════════════════');

        return res.status(200).json({ success: true, message: 'Application received!', id: submission.id });

      } catch (err) {
        console.error('Submission error:', err);
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
      }
    }

    // ─────────────────────────────────────────────
    //  GET — Serve the full HTML page
    // ─────────────────────────────────────────────
    if (req.method === 'GET') {
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(/* html */`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Apply – 100K Pathway | Start Your Journey</title>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --bg:       #0a0d14;
        --surface:  #111520;
        --card:     #161c2d;
        --border:   rgba(255,255,255,0.07);
        --input-bg: #0e1322;
        --accent:   #4f6ef7;
        --accent2:  #7c3aed;
        --green:    #00e5a0;
        --text:     #e8eaf0;
        --muted:    #6b7494;
        --label:    #7b9ef4;
        --error:    #ff5e7a;
      }

      html, body { min-height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

      body::before {
        content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.45;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
      }

      .blob { position: fixed; border-radius: 50%; filter: blur(110px); pointer-events: none; z-index: 0; }
      .blob-1 { width: 540px; height: 540px; background: rgba(79,110,247,0.13); top: -130px; left: -130px; }
      .blob-2 { width: 440px; height: 440px; background: rgba(124,58,237,0.10); bottom: -80px; right: -90px; }
      .blob-3 { width: 300px; height: 300px; background: rgba(0,229,160,0.07); top: 42%; left: 52%; }

      /* NAV */
      nav {
        position: sticky; top: 0; z-index: 200;
        display: flex; align-items: center; justify-content: space-between;
        padding: 0 40px; height: 64px;
        background: rgba(10,13,20,0.88);
        backdrop-filter: blur(22px);
        border-bottom: 1px solid var(--border);
      }
      .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.1rem; color: var(--accent); letter-spacing: -0.02em; }
      .nav-links { display: flex; gap: 32px; }
      .nav-links a { text-decoration: none; color: var(--muted); font-size: 0.82rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; transition: color .2s; }
      .nav-links a:hover { color: var(--text); }
      .btn-nav { border: none; border-radius: 8px; padding: 9px 20px; font-size: 0.82rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; cursor: pointer; transition: all .2s; font-family: 'DM Sans', sans-serif; background: var(--accent); color: #fff; }
      .btn-nav:hover { background: #3b5ce4; transform: translateY(-1px); }

      /* PAGE */
      .page { position: relative; z-index: 1; min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 60px 20px; }

      /* CARD */
      .card {
        width: 100%; max-width: 520px;
        background: var(--card); border: 1px solid var(--border); border-radius: 20px;
        padding: 44px 44px 36px;
        box-shadow: 0 40px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(79,110,247,.08);
        animation: fadeUp .55s ease both;
      }
      @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }

      .card-title { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; color: #fff; margin-bottom: 8px; text-align: center; }
      .card-sub   { font-size: .88rem; color: var(--muted); text-align: center; margin-bottom: 32px; }

      /* FIELDS */
      .form-group { margin-bottom: 20px; }
      label { display: block; font-size: .78rem; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; color: var(--label); margin-bottom: 7px; }

      input, select {
        width: 100%; background: var(--input-bg); border: 1px solid var(--border);
        border-radius: 10px; padding: 12px 16px; color: var(--text);
        font-family: 'DM Sans', sans-serif; font-size: .92rem;
        outline: none; transition: border-color .2s, box-shadow .2s; appearance: none;
      }
      input::placeholder { color: var(--muted); }
      input:focus, select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(79,110,247,.15); }
      input.err,  select.err   { border-color: var(--error);  box-shadow: 0 0 0 3px rgba(255,94,122,.12); }

      .phone-row { display: flex; gap: 10px; }
      .phone-row .sw { width: 118px; flex-shrink: 0; }
      .phone-row input { flex: 1; }

      .sw { position: relative; }
      .sw::after { content: '▾'; position: absolute; right: 13px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; font-size: .85rem; }
      .sw select { padding-right: 34px; width: 100%; }
      select option { background: #1a2035; }

      /* BUTTON */
      .btn-submit {
        width: 100%; padding: 14px;
        background: linear-gradient(135deg, var(--accent), var(--accent2));
        border: none; border-radius: 10px; color: #fff;
        font-family: 'Syne', sans-serif; font-size: .95rem; font-weight: 700; letter-spacing: .04em;
        cursor: pointer; margin-top: 8px;
        transition: opacity .2s, transform .15s, box-shadow .2s;
      }
      .btn-submit:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(79,110,247,.35); }
      .btn-submit:disabled { opacity: .55; cursor: not-allowed; }

      .spinner { display: inline-block; width: 15px; height: 15px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; vertical-align: middle; margin-right: 8px; }
      @keyframes spin { to { transform: rotate(360deg); } }

      /* ALERTS */
      .alert { margin-top: 16px; padding: 13px 18px; border-radius: 10px; font-size: .88rem; font-weight: 500; text-align: center; display: none; }
      .alert.success { background: rgba(0,229,160,.09); border: 1px solid rgba(0,229,160,.35); color: var(--green); }
      .alert.fail    { background: rgba(255,94,122,.09); border: 1px solid rgba(255,94,122,.35); color: var(--error); }
      .alert.show    { display: block; animation: fadeUp .3s ease; }

      .ferr { font-size: .74rem; color: var(--error); margin-top: 4px; display: none; }
      .ferr.show { display: block; }

      .legal { margin-top: 18px; text-align: center; font-size: .75rem; color: var(--muted); }
      .legal a { color: var(--label); text-decoration: none; }
      .legal a:hover { text-decoration: underline; }

      /* FOOTER */
      footer { position: relative; z-index: 1; background: var(--surface); border-top: 1px solid var(--border); padding: 52px 80px 36px; }
      .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 36px; }
      .footer-brand .logo { font-size: 1rem; display: block; margin-bottom: 12px; }
      .footer-desc { font-size: .82rem; color: var(--muted); line-height: 1.75; max-width: 250px; }
      .footer-col h4 { font-family: 'Syne', sans-serif; font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; }
      .footer-col a { display: block; text-decoration: none; color: var(--muted); font-size: .83rem; margin-bottom: 8px; transition: color .2s; }
      .footer-col a:hover { color: var(--text); }
      .footer-bottom { border-top: 1px solid var(--border); padding-top: 22px; font-size: .74rem; color: var(--muted); text-align: center; }

      @media (max-width: 700px) {
        nav { padding: 0 18px; }
        .nav-links { display: none; }
        .card { padding: 30px 22px 26px; }
        .card-title { font-size: 1.6rem; }
        footer { padding: 38px 22px 26px; }
        .footer-grid { grid-template-columns: 1fr 1fr; }
      }
    </style>
  </head>
  <body>

    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>

    <nav>
      <span class="logo">100K Pathway</span>
      <div class="nav-links">
        <a href="#">How It Works</a>
        <a href="#">Pricing</a>
        <a href="#">Case Studies</a>
        <a href="#">Blog</a>
      </div>
      <button class="btn-nav">Apply</button>
    </nav>

    <main class="page">
      <div class="card">
        <h1 class="card-title">Start Your Application</h1>
        <p class="card-sub">We'll reach out within 24 hours to schedule your strategy call</p>

        <form id="applyForm" novalidate>

          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" placeholder="Jane Smith" autocomplete="name"/>
            <span class="ferr" id="err-fullName">Please enter your full name.</span>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" placeholder="jane@example.com" autocomplete="email"/>
            <span class="ferr" id="err-email">Please enter a valid email address.</span>
          </div>

          <div class="form-group">
            <label>Contact Number</label>
            <div class="phone-row">
              <div class="sw">
                <select id="countryCode">
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+55">🇧🇷 +55</option>
                </select>
              </div>
              <input type="tel" id="phone" placeholder="(555) 000-0000" autocomplete="tel"/>
            </div>
            <span class="ferr" id="err-phone">Please enter a valid phone number.</span>
          </div>

          <div class="form-group">
            <label for="plan">Interested Plan</label>
            <div class="sw">
              <select id="plan">
                <option value="" disabled selected>Select a plan</option>
                <option value="starter">Starter – $2,000/mo</option>
                <option value="growth">Growth – $5,000/mo</option>
                <option value="accelerator">Accelerator – $10,000/mo</option>
                <option value="elite">Elite – Custom</option>
              </select>
            </div>
            <span class="ferr" id="err-plan">Please select a plan.</span>
          </div>

          <div class="form-group">
            <label for="experience">Years of Tech Experience</label>
            <div class="sw">
              <select id="experience">
                <option value="" disabled selected>Select experience level</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1-2 years">1 – 2 years</option>
                <option value="3-5 years">3 – 5 years</option>
                <option value="6-10 years">6 – 10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
            <span class="ferr" id="err-experience">Please select your experience level.</span>
          </div>

          <button type="submit" class="btn-submit" id="submitBtn">Submit Application</button>

          <div class="alert success" id="alertSuccess">✅ Application submitted successfully! We'll be in touch within 24 hours.</div>
          <div class="alert fail"    id="alertFail"   >⚠️ Something went wrong. Please try again.</div>

        </form>

        <p class="legal">By applying, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
      </div>
    </main>

    <footer>
      <div class="footer-grid">
        <div class="footer-brand">
          <span class="logo">100K Pathway</span>
          <p class="footer-desc">Connecting professionals with performance-based training and placement. We handle applications. You handle your career.</p>
        </div>
        <div class="footer-col">
          <h4>Product</h4>
          <a href="#">How It Works</a>
          <a href="#">Pricing</a>
          <a href="#">Case Studies</a>
          <a href="#">Blog</a>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Hire</a>
          <a href="#">News</a>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
      <div class="footer-bottom">© 2025 100K Pathway. All rights reserved.</div>
    </footer>

    <script>
      // ── Validation helpers ──
      function setErr(id, show) {
        document.getElementById(id).classList.toggle('err', show);
        document.getElementById('err-' + id).classList.toggle('show', show);
      }
      function isEmail(v) { return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v); }
      function isPhone(v) { return /^[\\d\\s\\-()+]{6,16}$/.test(v); }

      function validate(d) {
        let ok = true;
        if (d.full_name.length < 2) { setErr('fullName', true);   ok = false; } else setErr('fullName', false);
        if (!isEmail(d.email))       { setErr('email', true);      ok = false; } else setErr('email', false);
        if (!isPhone(d.phone))       { setErr('phone', true);      ok = false; } else setErr('phone', false);
        if (!d.plan)                 { setErr('plan', true);       ok = false; } else setErr('plan', false);
        if (!d.experience)           { setErr('experience', true); ok = false; } else setErr('experience', false);
        return ok;
      }

      // ── Form submit — calls the serverless POST /api ──
      document.getElementById('applyForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        document.getElementById('alertSuccess').classList.remove('show');
        document.getElementById('alertFail').classList.remove('show');

        const payload = {
          full_name    : document.getElementById('fullName').value.trim(),
          email        : document.getElementById('email').value.trim(),
          country_code : document.getElementById('countryCode').value,
          phone        : document.getElementById('phone').value.trim(),
          plan         : document.getElementById('plan').value,
          experience   : document.getElementById('experience').value,
        };

        if (!validate(payload)) return;

        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span>Submitting…';

        try {
          const res  = await fetch('/', {
            method  : 'POST',
            headers : { 'Content-Type': 'application/json' },
            body    : JSON.stringify(payload),
          });
          const data = await res.json();

          if (res.ok && data.success) {
            document.getElementById('alertSuccess').classList.add('show');
            document.getElementById('applyForm').reset();
          } else {
            const failEl = document.getElementById('alertFail');
            failEl.textContent = '⚠️ ' + (data.message || 'Something went wrong.');
            failEl.classList.add('show');
          }
        } catch (err) {
          document.getElementById('alertFail').textContent = '⚠️ Network error. Please try again.';
          document.getElementById('alertFail').classList.add('show');
        } finally {
          btn.disabled = false;
          btn.innerHTML = 'Submit Application';
        }
      });

      // Live clear errors
      ['fullName','email','phone','plan','experience'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', () => setErr(id, false));
      });
    </script>

  </body>
  </html>`);
    }

    // Any other method
    return res.status(405).json({ error: 'Method not allowed' });
  }
