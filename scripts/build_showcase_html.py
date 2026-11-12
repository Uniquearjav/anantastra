import os

def build_showcase():
    logos_dir = r"f:/Website/github-uniquearjav/anantastra/public/logos"
    
    # Read SVGs
    def read_svg(name):
        with open(os.path.join(logos_dir, name), "r", encoding="utf-8") as f:
            return f.read()

    icon_main = read_svg("anantastra-icon.svg")
    icon_dark = read_svg("anantastra-icon-dark.svg")
    icon_light = read_svg("anantastra-icon-light.svg")
    icon_white = read_svg("anantastra-icon-white.svg")
    icon_black = read_svg("anantastra-icon-black.svg")
    icon_app = read_svg("anantastra-icon-app.svg")
    lockup_dark = read_svg("anantastra-lockup-dark.svg")
    lockup_light = read_svg("anantastra-lockup-light.svg")
    favicon = read_svg("anantastra-favicon.svg")
    concept2 = read_svg("anantastra-concept2-dualblade.svg")
    concept3 = read_svg("anantastra-concept3-hexprism.svg")

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anantastra - Vector Brand Identity System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700;800&display=swap" rel="stylesheet">
<style>
  :root {{
    --bg: #090D16;
    --card: #111726;
    --border: #1E293B;
    --text: #F8FAFC;
    --muted: #94A3B8;
    --primary: #6366F1;
  }}
  
  body.theme-light {{
    --bg: #F8FAFC;
    --card: #FFFFFF;
    --border: #E2E8F0;
    --text: #0F172A;
    --muted: #64748B;
  }}

  body.theme-checker {{
    --bg: repeating-conic-gradient(#1E293B 0% 25%, #0F172A 0% 50%) 50% / 24px 24px;
    --card: rgba(17, 23, 38, 0.85);
    --border: #334155;
    --text: #F8FAFC;
    --muted: #94A3B8;
  }}

  * {{
    box-sizing: border-box;
  }}

  body {{
    margin: 0;
    padding: 40px 24px 100px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    transition: background 0.25s, color 0.25s;
    line-height: 1.5;
  }}

  .container {{
    max-width: 1200px;
    margin: 0 auto;
  }}

  header {{
    text-align: center;
    margin-bottom: 56px;
  }}

  .brand-badge {{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 9999px;
    background: rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(99, 102, 241, 0.3);
    color: #A5B4FC;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }}

  h1 {{
    font-family: 'Space Grotesk', sans-serif;
    font-size: 3.2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin: 0 0 16px 0;
    background: linear-gradient(135deg, #FFFFFF 40%, #A5B4FC 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }}
  body.theme-light h1 {{
    background: linear-gradient(135deg, #0F172A 40%, #4F46E5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }}

  p.lead {{
    font-size: 1.15rem;
    color: var(--muted);
    max-width: 680px;
    margin: 0 auto 28px;
  }}

  .theme-controls {{
    display: inline-flex;
    background: var(--card);
    border: 1px solid var(--border);
    padding: 4px;
    border-radius: 9999px;
    gap: 4px;
  }}

  .theme-btn {{
    padding: 8px 18px;
    border-radius: 9999px;
    border: none;
    background: transparent;
    color: var(--muted);
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }}
  .theme-btn:hover {{
    color: var(--text);
  }}
  .theme-btn.active {{
    background: #4F46E5;
    color: #FFFFFF;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }}

  /* Section Styling */
  .section-title {{
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    margin: 48px 0 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }}
  .section-title::after {{
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }}

  /* Hero Showcase Card */
  .hero-card {{
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 28px;
    padding: 48px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.4);
    margin-bottom: 40px;
  }}

  .hero-glyph {{
    width: 220px;
    height: 220px;
    margin-bottom: 28px;
    filter: drop-shadow(0 14px 28px rgba(99, 102, 241, 0.25));
    transition: transform 0.3s;
  }}
  .hero-glyph:hover {{
    transform: scale(1.05) rotate(1deg);
  }}

  .hero-title {{
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    margin: 0 0 8px;
  }}

  .hero-desc {{
    max-width: 640px;
    font-size: 0.98rem;
    color: var(--muted);
    margin: 0 auto 32px;
    line-height: 1.6;
  }}

  .anatomy-pills {{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-bottom: 32px;
  }}

  .anatomy-pill {{
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border);
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 0.85rem;
  }}
  body.theme-light .anatomy-pill {{
    background: #F1F5F9;
  }}
  .anatomy-pill strong {{
    color: #818CF8;
  }}

  /* Grid of Variants */
  .variants-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
  }}

  .variant-card {{
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    transition: all 0.25s;
  }}
  .variant-card:hover {{
    border-color: #6366F1;
    transform: translateY(-3px);
  }}

  .variant-preview {{
    width: 140px;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px 0 20px;
  }}

  .variant-card.card-light-preview .variant-preview {{
    background: #FFFFFF;
    border-radius: 16px;
    padding: 12px;
    border: 1px solid #E2E8F0;
  }}

  .variant-name {{
    font-weight: 700;
    font-size: 1.05rem;
    margin: 0 0 6px 0;
  }}

  .variant-spec {{
    font-size: 0.78rem;
    color: var(--muted);
    margin: 0 0 20px 0;
    text-align: center;
  }}

  .card-actions {{
    display: flex;
    width: 100%;
    gap: 8px;
    margin-top: auto;
  }}

  .action-btn {{
    flex: 1;
    padding: 9px 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid var(--border);
    color: var(--text);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    transition: all 0.2s;
  }}
  body.theme-light .action-btn {{
    background: #F1F5F9;
    color: #1E293B;
  }}
  .action-btn:hover {{
    background: #4F46E5;
    color: #FFFFFF;
    border-color: #4F46E5;
  }}

  /* Full Lockups */
  .lockup-container {{
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 48px;
  }}

  .lockup-card {{
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }}

  .lockup-preview {{
    width: 100%;
    max-width: 820px;
    margin: 16px 0 20px;
  }}
  .lockup-preview svg {{
    width: 100%;
    height: auto;
  }}

  /* Scalability Test Bar */
  .scale-strip {{
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 48px;
  }}

  .scale-item {{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }}

  .scale-label {{
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted);
  }}

  /* Toast Notification */
  #toast {{
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 12px 20px;
    background: #10B981;
    color: #FFFFFF;
    font-weight: 600;
    font-size: 0.88rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
    z-index: 1000;
  }}
  #toast.show {{
    opacity: 1;
    transform: translateY(0);
  }}
</style>
</head>
<body>

<div class="container">
  <header>
    <div class="brand-badge">⚡ Vector-Only Brand Identity</div>
    <h1>ANANTASTRA</h1>
    <p class="lead">A minimalist, aesthetic vector identity unifying the Letter <strong>'A'</strong>, the <strong>Infinity ($\infty$)</strong> of endless tools, and the <strong>Astra</strong> celestial precision arrow.</p>
    
    <div class="theme-controls">
      <button class="theme-btn active" onclick="setTheme('dark', this)">Dark Void</button>
      <button class="theme-btn" onclick="setTheme('light', this)">Crisp Light</button>
      <button class="theme-btn" onclick="setTheme('checker', this)">Transparency Grid</button>
    </div>
  </header>

  <!-- Hero Highlight Card -->
  <div class="hero-card">
    <div class="hero-glyph">
      {icon_main}
    </div>
    <div class="hero-title">The Anantastra Infinity Apex</div>
    <p class="hero-desc">
      Engineered as an authentic continuous Möbius ribbon. The upward delta apex embodies the <strong>Astra</strong> (the razor-sharp tool/instrument), the crossbar and base loops embody <strong>Ananta</strong> (mathematical infinity / unbounded utilities), and the negative-space core reveals a four-point celestial star.
    </p>

    <div class="anatomy-pills">
      <div class="anatomy-pill">
        <span>📐</span>
        <span><strong>Bilateral Geometry:</strong> Perfect golden ratio proportions</span>
      </div>
      <div class="anatomy-pill">
        <span>♾️</span>
        <span><strong>Ananta Lemniscate:</strong> Continuous 3D over-under weave</span>
      </div>
      <div class="anatomy-pill">
        <span>🗡️</span>
        <span><strong>Astra Crown:</strong> Sharp celestial precision apex</span>
      </div>
      <div class="anatomy-pill">
        <span>✨</span>
        <span><strong>Zero Bitmaps:</strong> 100% scalable SVG vector mathematics</span>
      </div>
    </div>

    <div class="card-actions" style="max-width: 420px;">
      <a href="anantastra-icon.svg" download class="action-btn">Download Primary SVG</a>
      <button onclick="copySvgCode('anantastra-icon.svg')" class="action-btn">Copy SVG Code</button>
    </div>
  </div>

  <!-- Scalability Test Strip -->
  <div class="section-title">Optical Scalability Verification (16px to 128px)</div>
  <div class="scale-strip">
    <div class="scale-item">
      <div style="width: 16px; height: 16px;">{favicon}</div>
      <span class="scale-label">16×16 Favicon</span>
    </div>
    <div class="scale-item">
      <div style="width: 24px; height: 24px;">{favicon}</div>
      <span class="scale-label">24×24 Nav Bar</span>
    </div>
    <div class="scale-item">
      <div style="width: 32px; height: 32px;">{icon_main}</div>
      <span class="scale-label">32×32 Header</span>
    </div>
    <div class="scale-item">
      <div style="width: 48px; height: 48px;">{icon_main}</div>
      <span class="scale-label">48×48 App Bar</span>
    </div>
    <div class="scale-item">
      <div style="width: 64px; height: 64px;">{icon_app}</div>
      <span class="scale-label">64×64 iOS / App</span>
    </div>
    <div class="scale-item">
      <div style="width: 96px; height: 96px;">{icon_dark}</div>
      <span class="scale-label">96×96 Profile</span>
    </div>
    <div class="scale-item">
      <div style="width: 128px; height: 128px;">{icon_main}</div>
      <span class="scale-label">128×128 Splash</span>
    </div>
  </div>

  <!-- Full Brand Lockups -->
  <div class="section-title">Horizontal Brand Lockups</div>
  <div class="lockup-container">
    <div class="lockup-card">
      <div class="lockup-preview">
        {lockup_dark}
      </div>
      <div class="card-actions" style="max-width: 400px;">
        <a href="anantastra-lockup-dark.svg" download class="action-btn">Download Dark Lockup SVG</a>
        <button onclick="copySvgCode('anantastra-lockup-dark.svg')" class="action-btn">Copy SVG</button>
      </div>
    </div>

    <div class="lockup-card">
      <div class="lockup-preview">
        {lockup_light}
      </div>
      <div class="card-actions" style="max-width: 400px;">
        <a href="anantastra-lockup-light.svg" download class="action-btn">Download Light Lockup SVG</a>
        <button onclick="copySvgCode('anantastra-lockup-light.svg')" class="action-btn">Copy SVG</button>
      </div>
    </div>
  </div>

  <!-- Core Variants Grid -->
  <div class="section-title">Logomark Variations & Formats</div>
  <div class="variants-grid">
    
    <!-- Variant: App Icon -->
    <div class="variant-card">
      <div class="variant-name">App Icon / Squircle</div>
      <div class="variant-spec">Rounded container with deep cosmic backdrop</div>
      <div class="variant-preview">
        {icon_app}
      </div>
      <div class="card-actions">
        <a href="anantastra-icon-app.svg" download class="action-btn">Download SVG</a>
        <button onclick="copySvgCode('anantastra-icon-app.svg')" class="action-btn">Copy</button>
      </div>
    </div>

    <!-- Variant: Dark Mode Badge -->
    <div class="variant-card">
      <div class="variant-name">Dark Mode Slate</div>
      <div class="variant-spec">Subtle boundary container for dark web UI</div>
      <div class="variant-preview">
        {icon_dark}
      </div>
      <div class="card-actions">
        <a href="anantastra-icon-dark.svg" download class="action-btn">Download SVG</a>
        <button onclick="copySvgCode('anantastra-icon-dark.svg')" class="action-btn">Copy</button>
      </div>
    </div>

    <!-- Variant: Light Mode Badge -->
    <div class="variant-card card-light-preview">
      <div class="variant-name">Light Mode Pure</div>
      <div class="variant-spec">Clean card container for light web themes</div>
      <div class="variant-preview">
        {icon_light}
      </div>
      <div class="card-actions">
        <a href="anantastra-icon-light.svg" download class="action-btn">Download SVG</a>
        <button onclick="copySvgCode('anantastra-icon-light.svg')" class="action-btn">Copy</button>
      </div>
    </div>

    <!-- Variant: Monochrome White -->
    <div class="variant-card">
      <div class="variant-name">Monochrome White</div>
      <div class="variant-spec">1-bit solid white glyph for dark stamping</div>
      <div class="variant-preview">
        {icon_white}
      </div>
      <div class="card-actions">
        <a href="anantastra-icon-white.svg" download class="action-btn">Download SVG</a>
        <button onclick="copySvgCode('anantastra-icon-white.svg')" class="action-btn">Copy</button>
      </div>
    </div>

    <!-- Variant: Monochrome Black -->
    <div class="variant-card card-light-preview">
      <div class="variant-name">Monochrome Black</div>
      <div class="variant-spec">1-bit solid obsidian glyph for light stamping / print</div>
      <div class="variant-preview">
        {icon_black}
      </div>
      <div class="card-actions">
        <a href="anantastra-icon-black.svg" download class="action-btn">Download SVG</a>
        <button onclick="copySvgCode('anantastra-icon-black.svg')" class="action-btn">Copy</button>
      </div>
    </div>

    <!-- Variant: Browser Favicon -->
    <div class="variant-card">
      <div class="variant-name">Vector Favicon</div>
      <div class="variant-spec">High-contrast, thicker strokes for browser tabs</div>
      <div class="variant-preview">
        {favicon}
      </div>
      <div class="card-actions">
        <a href="anantastra-favicon.svg" download class="action-btn">Download SVG</a>
        <button onclick="copySvgCode('anantastra-favicon.svg')" class="action-btn">Copy</button>
      </div>
    </div>

  </div>

  <!-- Alternative Concepts -->
  <div class="section-title">Alternative Design Explorations</div>
  <div class="variants-grid">
    <!-- Concept 2: Dual Blade -->
    <div class="variant-card">
      <div class="variant-name">Concept B: Astra Dual-Blade</div>
      <div class="variant-spec">Two aerodynamic curved wings in infinity orbital motion</div>
      <div class="variant-preview">
        {concept2}
      </div>
      <div class="card-actions">
        <a href="anantastra-concept2-dualblade.svg" download class="action-btn">Download SVG</a>
        <button onclick="copySvgCode('anantastra-concept2-dualblade.svg')" class="action-btn">Copy</button>
      </div>
    </div>

    <!-- Concept 3: Hex Prism -->
    <div class="variant-card">
      <div class="variant-name">Concept C: Hexagonal Prism A</div>
      <div class="variant-spec">Architectural faceted polygons forming A and infinity</div>
      <div class="variant-preview">
        {concept3}
      </div>
      <div class="card-actions">
        <a href="anantastra-concept3-hexprism.svg" download class="action-btn">Download SVG</a>
        <button onclick="copySvgCode('anantastra-concept3-hexprism.svg')" class="action-btn">Copy</button>
      </div>
    </div>
  </div>

</div>

<div id="toast">SVG code copied to clipboard!</div>

<script>
function setTheme(theme, btn) {{
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.body.className = 'theme-' + theme;
}}

async function copySvgCode(filename) {{
  try {{
    const res = await fetch(filename);
    const text = await res.text();
    await navigator.clipboard.writeText(text);
    showToast('Copied ' + filename + ' to clipboard!');
  }} catch(e) {{
    showToast('Failed to copy. Download file instead.');
  }}
}}

function showToast(msg) {{
  const t = document.getElementById('toast');
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}}
</script>

</body>
</html>
"""
    with open(os.path.join(logos_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print("Showcase index.html successfully created!")

build_showcase()
