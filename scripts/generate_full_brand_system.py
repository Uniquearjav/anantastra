import os
import math

out_dir = "f:/Website/github-uniquearjav/anantastra/public/logos"
os.makedirs(out_dir, exist_ok=True)

# Helper function to generate clean standalone SVGs
def save_svg(filename, content):
    path = os.path.join(out_dir, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Generated: {filename}")

# ------------------------------------------------------------------------------
# 1. FLAGSHIP LOGOMARK: "The Anantastra Infinity Apex"
# ------------------------------------------------------------------------------
def build_flagship(variant="gradient", bg_color=None, rx=112):
    bg_svg = ""
    if bg_color == "dark":
        bg_svg = '<rect width="512" height="512" rx="112" fill="#090D16" /><rect width="508" height="508" x="2" y="2" rx="110" stroke="#1E293B" stroke-width="2" fill="none" />'
    elif bg_color == "light":
        bg_svg = '<rect width="512" height="512" rx="112" fill="#FFFFFF" /><rect width="508" height="508" x="2" y="2" rx="110" stroke="#E2E8F0" stroke-width="2" fill="none" />'
    elif bg_color == "squircle":
        bg_svg = '<rect width="512" height="512" rx="128" fill="url(#bg_dark_grad)" /><rect width="508" height="508" x="2" y="2" rx="126" stroke="#312E81" stroke-width="2" fill="none" />'

    if variant == "gradient":
        stroke_main = "url(#ananta_primary)"
        stroke_accent = "url(#ananta_secondary)"
        spark_fill = "url(#ananta_primary)"
        apex_fill = "url(#ananta_primary)"
    elif variant == "white":
        stroke_main = "#FFFFFF"
        stroke_accent = "#E2E8F0"
        spark_fill = "#FFFFFF"
        apex_fill = "#FFFFFF"
    elif variant == "black":
        stroke_main = "#0F172A"
        stroke_accent = "#1E293B"
        spark_fill = "#0F172A"
        apex_fill = "#0F172A"

    defs = """  <defs>
    <!-- Vibrant Indigo/Violet/Cyan Electric Tech Gradient -->
    <linearGradient id="ananta_primary" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="32%" stop-color="#6366F1" />
      <stop offset="68%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#D946EF" />
    </linearGradient>

    <linearGradient id="ananta_secondary" x1="90%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#818CF8" />
      <stop offset="45%" stop-color="#4F46E5" />
      <stop offset="100%" stop-color="#06B6D4" />
    </linearGradient>

    <linearGradient id="bg_dark_grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F19" />
      <stop offset="50%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#1E1B4B" />
    </linearGradient>

    <!-- Knockout mask for authentic vector over-under ribbon weave -->
    <mask id="cross_weave_mask">
      <rect width="512" height="512" fill="#FFFFFF" />
      <circle cx="260" cy="336" r="34" fill="#000000" />
    </mask>
  </defs>"""

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
{defs}
  {bg_svg}

  <g id="anantastra-mark">
    <!-- Under-Ribbon: Right wing through center weave (masked at cross) -->
    <path d="M 256,76 
             C 256,76 388,210 388,316 
             C 388,402 330,442 276,412 
             C 240,392 216,344 186,294"
          stroke="{stroke_accent}" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"
          mask="url(#cross_weave_mask)" />

    <!-- Over-Ribbon: Sweeps from center crossbar through left loop and up to apex -->
    <path d="M 326,294 
             C 296,344 272,392 236,412 
             C 182,442 124,402 124,316 
             C 124,210 256,76 256,76"
          stroke="{stroke_main}" stroke-width="44" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Apex Precision Crown: Sharp Astra Point joining at (256, 76) -->
    <path d="M 242,94 L 256,66 L 270,94 Z"
          fill="{apex_fill}" stroke-linejoin="round" />

    <!-- Astra Spark / Celestial Star in the Inner Triangular Counter -->
    <path d="M 256,176 L 264,204 L 292,212 L 264,220 L 256,248 L 248,220 L 220,212 L 248,204 Z"
          fill="{spark_fill}" opacity="0.95" />
  </g>
</svg>"""
    return svg

# ------------------------------------------------------------------------------
# 2. FULL HORIZONTAL BRAND LOCKUP (Mark + Vector Typography)
# ViewBox: 0 0 960 240
# ------------------------------------------------------------------------------
def build_horizontal_lockup(theme="dark"):
    if theme == "dark":
        text_primary = "#FFFFFF"
        text_secondary = "#94A3B8"
        bg_svg = '<rect width="960" height="240" fill="#090D16" rx="28" />'
        stroke_main = "url(#ananta_primary_lockup)"
        stroke_accent = "url(#ananta_secondary_lockup)"
        spark_fill = "url(#ananta_primary_lockup)"
        border_svg = '<rect width="958" height="238" x="1" y="1" rx="27" stroke="#1E293B" stroke-width="2" fill="none" />'
    elif theme == "light":
        text_primary = "#0F172A"
        text_secondary = "#64748B"
        bg_svg = '<rect width="960" height="240" fill="#FFFFFF" rx="28" />'
        stroke_main = "url(#ananta_primary_lockup)"
        stroke_accent = "url(#ananta_secondary_lockup)"
        spark_fill = "url(#ananta_primary_lockup)"
        border_svg = '<rect width="958" height="238" x="1" y="1" rx="27" stroke="#E2E8F0" stroke-width="2" fill="none" />'
    else: # transparent
        text_primary = "#FFFFFF"
        text_secondary = "#94A3B8"
        bg_svg = ""
        border_svg = ""
        stroke_main = "url(#ananta_primary_lockup)"
        stroke_accent = "url(#ananta_secondary_lockup)"
        spark_fill = "url(#ananta_primary_lockup)"

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 240" width="960" height="240" fill="none">
  <defs>
    <linearGradient id="ananta_primary_lockup" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="32%" stop-color="#6366F1" />
      <stop offset="68%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#D946EF" />
    </linearGradient>
    <linearGradient id="ananta_secondary_lockup" x1="90%" y1="0%" x2="10%" y2="100%">
      <stop offset="0%" stop-color="#818CF8" />
      <stop offset="45%" stop-color="#4F46E5" />
      <stop offset="100%" stop-color="#06B6D4" />
    </linearGradient>
    <mask id="cross_weave_mask_lockup">
      <rect width="200" height="200" fill="#FFFFFF" />
      <circle cx="100" cy="132" r="14" fill="#000000" />
    </mask>
  </defs>
  {bg_svg}
  {border_svg}

  <!-- Scaled Logomark (approx 160x160 positioned at x=40, y=40) -->
  <g transform="translate(48, 20) scale(0.39)">
    <mask id="mask_lk">
      <rect width="512" height="512" fill="#FFFFFF" />
      <circle cx="260" cy="336" r="34" fill="#000000" />
    </mask>
    <!-- Under-Ribbon -->
    <path d="M 256,76 C 256,76 388,210 388,316 C 388,402 330,442 276,412 C 240,392 216,344 186,294"
          stroke="{stroke_accent}" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"
          mask="url(#mask_lk)" />
    <!-- Over-Ribbon -->
    <path d="M 326,294 C 296,344 272,392 236,412 C 182,442 124,402 124,316 C 124,210 256,76 256,76"
          stroke="{stroke_main}" stroke-width="44" stroke-linecap="round" stroke-linejoin="round" />
    <!-- Crown -->
    <path d="M 242,94 L 256,66 L 270,94 Z" fill="{stroke_main}" stroke-linejoin="round" />
    <!-- Spark -->
    <path d="M 256,176 L 264,204 L 292,212 L 264,220 L 256,248 L 248,220 L 220,212 L 248,204 Z"
          fill="{spark_fill}" opacity="0.95" />
  </g>

  <!-- Typography: Vector Text with Modern Geometric Proportions -->
  <g id="brand-typography">
    <!-- Brand Name: ANANTASTRA -->
    <text x="270" y="118" 
          font-family="system-ui, -apple-system, 'Space Grotesk', 'Plus Jakarta Sans', sans-serif" 
          font-size="64" 
          font-weight="800" 
          letter-spacing="5" 
          fill="{text_primary}">ANANTASTRA</text>
    
    <!-- Tagline: INFINITE TOOLS • PRIVACY FIRST -->
    <text x="274" y="166" 
          font-family="system-ui, -apple-system, 'Space Grotesk', 'Plus Jakarta Sans', sans-serif" 
          font-size="16" 
          font-weight="600" 
          letter-spacing="6.5" 
          fill="{text_secondary}">INFINITE TOOLS • USEALLTOOLS</text>

    <!-- Accent Geometric Dash -->
    <rect x="274" y="184" width="72" height="3" rx="1.5" fill="url(#ananta_primary_lockup)" />
  </g>
</svg>"""
    return svg

# ------------------------------------------------------------------------------
# 3. FAVICON SPECIALIZED VECTOR
# ViewBox: 0 0 64 64, optimized stroke weight for 16x16 / 32x32 crispness
# ------------------------------------------------------------------------------
def build_favicon():
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="fav_grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="40%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#D946EF" />
    </linearGradient>
    <linearGradient id="fav_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#090D16" />
    </linearGradient>
  </defs>
  <!-- Background Squircle -->
  <rect width="64" height="64" rx="16" fill="url(#fav_bg)" />
  <rect width="62" height="62" x="1" y="1" rx="15" stroke="#312E81" stroke-width="1.5" fill="none" />

  <!-- High-contrast bold mark scaled for favicon -->
  <g transform="translate(32, 32) scale(0.088) translate(-256, -260)">
    <!-- Right loop -->
    <path d="M 256,86 C 256,86 380,210 380,312 C 380,396 326,432 276,406 C 242,388 220,344 190,298"
          stroke="#818CF8" stroke-width="54" stroke-linecap="round" stroke-linejoin="round" />
    <!-- Left loop -->
    <path d="M 322,298 C 292,344 270,388 236,406 C 186,432 132,396 132,312 C 132,210 256,86 256,86"
          stroke="url(#fav_grad)" stroke-width="54" stroke-linecap="round" stroke-linejoin="round" />
    <!-- Apex -->
    <path d="M 238,106 L 256,70 L 274,106 Z" fill="url(#fav_grad)" />
    <!-- Core star -->
    <circle cx="256" cy="216" r="14" fill="#38BDF8" />
  </g>
</svg>"""
    return svg

# ------------------------------------------------------------------------------
# 4. ALTERNATIVE MASTER CONCEPT: "The Astra Dual Blade" (Aerodynamic Wings)
# ------------------------------------------------------------------------------
def build_dual_blade():
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="blade_grad_left" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="60%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#4F46E5" />
    </linearGradient>
    <linearGradient id="blade_grad_right" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#C084FC" />
      <stop offset="50%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#4F46E5" />
    </linearGradient>
  </defs>

  <g id="dual-blade-mark">
    <!-- Left Blade (Sweeps from apex down left, loops inward to center) -->
    <path d="M 256,64 
             C 214,140 112,240 112,336 
             C 112,420 180,452 236,420 
             C 276,396 290,344 256,280 
             C 226,220 236,130 256,64 Z"
          fill="url(#blade_grad_left)" />

    <!-- Right Blade (Interlocks symmetrically, sweeping from apex down right) -->
    <path d="M 256,64 
             C 298,140 400,240 400,336 
             C 400,420 332,452 276,420 
             C 236,396 222,344 256,280 
             C 286,220 276,130 256,64 Z"
          fill="url(#blade_grad_right)" opacity="0.92" style="mix-blend-mode: screen;" />

    <!-- Central Astra Precision Diamond -->
    <polygon points="256,190 270,224 256,258 242,224" fill="#FFFFFF" opacity="0.95" />
  </g>
</svg>"""
    return svg

# ------------------------------------------------------------------------------
# 5. ALTERNATIVE CONCEPT: "The Astra Hex Prism" (Linear / Minimalist High-Tech)
# ------------------------------------------------------------------------------
def build_hex_prism():
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="prism_1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <linearGradient id="prism_2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#D946EF" />
    </linearGradient>
    <linearGradient id="prism_3" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="100%" stop-color="#06B6D4" />
    </linearGradient>
  </defs>

  <g id="hex-prism-mark" transform="translate(0, 8)">
    <!-- Architectural Facet 1: Left Wing & Apex -->
    <polygon points="256,64 300,140 180,348 108,348 200,188" fill="url(#prism_1)" />

    <!-- Architectural Facet 2: Right Wing & Apex -->
    <polygon points="256,64 312,188 404,348 332,348 212,140" fill="url(#prism_2)" />

    <!-- Architectural Facet 3: Infinity Crossbar Loop -->
    <polygon points="144,388 256,236 368,388 320,448 256,360 192,448" fill="url(#prism_3)" />
  </g>
</svg>"""
    return svg

# Generate all individual assets
save_svg("anantastra-icon.svg", build_flagship(variant="gradient"))
save_svg("anantastra-icon-dark.svg", build_flagship(variant="gradient", bg_color="dark"))
save_svg("anantastra-icon-light.svg", build_flagship(variant="gradient", bg_color="light"))
save_svg("anantastra-icon-app.svg", build_flagship(variant="gradient", bg_color="squircle"))
save_svg("anantastra-icon-white.svg", build_flagship(variant="white"))
save_svg("anantastra-icon-black.svg", build_flagship(variant="black"))
save_svg("anantastra-lockup-dark.svg", build_horizontal_lockup("dark"))
save_svg("anantastra-lockup-light.svg", build_horizontal_lockup("light"))
save_svg("anantastra-lockup-transparent.svg", build_horizontal_lockup("transparent"))
save_svg("anantastra-favicon.svg", build_favicon())
save_svg("anantastra-concept2-dualblade.svg", build_dual_blade())
save_svg("anantastra-concept3-hexprism.svg", build_hex_prism())

print("All standalone vector files successfully generated!")
