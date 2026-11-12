import os
from PIL import Image, ImageDraw

def render_anantastra_raster(size=512):
    # Supersample 4x for extreme antialiasing quality
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background Squircle
    # Background color: #090D16 with subtle indigo border #312E81
    rx = int(canvas_size * 0.25)
    bg_color = (9, 13, 22, 255)
    border_color = (49, 46, 129, 255)
    border_w = max(2, int(8 * scale))
    
    # Rounded rect background
    draw.rounded_rectangle(
        [(0, 0), (canvas_size - 1, canvas_size - 1)],
        radius=rx,
        fill=bg_color,
        outline=border_color,
        width=border_w
    )

    # Let's draw the Anantastra glyph inside
    # Coordinate system scaled to canvas_size
    def pt(x, y):
        return (x * canvas_size / 512.0, y * canvas_size / 512.0)

    # We will draw the loops using high-res lines and polygons
    # Left wing & apex
    # In 512x512 space:
    # Apex: (256, 76)
    # Left flank: (124, 316)
    # Bottom left loop: (188, 442) -> (238, 408)
    # Cross: (256, 336) -> right flank (388, 316)...
    
    # We can use cubic bezier interpolation
    def cubic_bezier(p0, p1, p2, p3, steps=100):
        points = []
        for i in range(steps + 1):
            t = i / float(steps)
            u = 1 - t
            x = u**3 * p0[0] + 3 * u**2 * t * p1[0] + 3 * u * t**2 * p2[0] + t**3 * p3[0]
            y = u**3 * p0[1] + 3 * u**2 * t * p1[1] + 3 * u * t**2 * p2[1] + t**3 * p3[1]
            points.append(pt(x, y))
        return points

    stroke_w = int(44 * canvas_size / 512.0)

    # Under-Ribbon: Right wing through center weave
    # M 256,76 C 256,76 388,210 388,316
    # C 388,402 330,442 276,412
    # C 240,392 216,344 186,294
    curve_under_1 = cubic_bezier((256, 76), (256, 76), (388, 210), (388, 316))
    curve_under_2 = cubic_bezier((388, 316), (388, 402), (330, 442), (276, 412))
    curve_under_3 = cubic_bezier((276, 412), (240, 392), (216, 344), (186, 294))
    
    under_pts = curve_under_1 + curve_under_2[1:] + curve_under_3[1:]
    
    # Secondary color: Electric violet-indigo (129, 140, 248)
    color_accent = (129, 140, 248, 255)
    
    # Draw under ribbon
    for i in range(len(under_pts) - 1):
        draw.line([under_pts[i], under_pts[i+1]], fill=color_accent, width=stroke_w, joint="curve")

    # Over-Ribbon: Left flank and over-crossbar
    # M 326,294 C 296,344 272,392 236,412
    # C 182,442 124,402 124,316
    # C 124,210 256,76 256,76
    curve_over_1 = cubic_bezier((326, 294), (296, 344), (272, 392), (236, 412))
    curve_over_2 = cubic_bezier((236, 412), (182, 442), (124, 402), (124, 316))
    curve_over_3 = cubic_bezier((124, 316), (124, 210), (256, 76), (256, 76))
    
    over_pts = curve_over_1 + curve_over_2[1:] + curve_over_3[1:]
    
    # Main color: Bright indigo-cyan gradient / electric indigo (99, 102, 241)
    color_main = (99, 102, 241, 255)
    
    # Knockout gap around center crossing: (260, 336)
    cx, cy = pt(260, 336)
    cr = int(34 * canvas_size / 512.0)
    draw.ellipse([(cx - cr, cy - cr), (cx + cr, cy + cr)], fill=bg_color)
    
    # Draw over ribbon
    for i in range(len(over_pts) - 1):
        draw.line([over_pts[i], over_pts[i+1]], fill=color_main, width=stroke_w, joint="curve")

    # Apex precision crown: M 242,94 L 256,66 L 270,94 Z
    apex_pts = [pt(242, 94), pt(256, 66), pt(270, 94)]
    draw.polygon(apex_pts, fill=color_main)

    # Core celestial spark / star at (256, 212)
    # M 256,176 L 264,204 L 292,212 L 264,220 L 256,248 L 248,220 L 220,212 L 248,204 Z
    spark_pts = [
        pt(256, 176), pt(264, 204), pt(292, 212), pt(264, 220),
        pt(256, 248), pt(248, 220), pt(220, 212), pt(248, 204)
    ]
    draw.polygon(spark_pts, fill=(56, 189, 248, 255))

    # Downsample using high-quality LANCZOS resampling
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

# Generate sizes for multi-resolution .ico
img_16 = render_anantastra_raster(16)
img_32 = render_anantastra_raster(32)
img_48 = render_anantastra_raster(48)
img_64 = render_anantastra_raster(64)
img_180 = render_anantastra_raster(180) # Apple touch icon
img_512 = render_anantastra_raster(512)

# Save .ico containing (16, 32, 48, 64)
img_32.save(
    "f:/Website/github-uniquearjav/anantastra/app/favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
)
img_32.save(
    "f:/Website/github-uniquearjav/anantastra/public/favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
)

# Save apple touch icon png and high-res png
img_180.save("f:/Website/github-uniquearjav/anantastra/public/apple-touch-icon.png", format="PNG")
img_180.save("f:/Website/github-uniquearjav/anantastra/app/apple-icon.png", format="PNG")
img_512.save("f:/Website/github-uniquearjav/anantastra/public/icon-512.png", format="PNG")

print("Favicon.ico (multi-resolution), apple-touch-icon.png, and icon-512.png generated!")
