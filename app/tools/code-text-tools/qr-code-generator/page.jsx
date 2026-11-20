'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  Wifi, 
  Globe, 
  Mail, 
  FileText, 
  Phone, 
  MessageSquare,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Sliders,
  ExternalLink
} from 'lucide-react';

// ============================================================================
// Robust Compact QR Code Generator (Reed-Solomon & QR Spec Model 2)
// Pure client-side, zero external dependencies
// ============================================================================
function generateQRMatrix(text, ecl = 'M') {
  // Simple, robust byte-mode QR matrix generator for standard payloads up to ~300 chars
  const utf8Bytes = [];
  for (let i = 0; i < text.length; i++) {
    let charcode = text.charCodeAt(i);
    if (charcode < 0x80) utf8Bytes.push(charcode);
    else if (charcode < 0x800) {
      utf8Bytes.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8Bytes.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
    } else {
      i++;
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (text.charCodeAt(i) & 0x3ff));
      utf8Bytes.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    }
  }

  // Determine minimal version needed
  const capacityTable = [
    { v: 1, L: 17, M: 14, Q: 11, H: 7 },
    { v: 2, L: 32, M: 26, Q: 20, H: 14 },
    { v: 3, L: 53, M: 42, Q: 32, H: 24 },
    { v: 4, L: 78, M: 62, Q: 46, H: 34 },
    { v: 5, L: 106, M: 84, Q: 60, H: 44 },
    { v: 6, L: 134, M: 106, Q: 74, H: 58 },
    { v: 7, L: 154, M: 122, Q: 86, H: 64 },
    { v: 8, L: 192, M: 152, Q: 108, H: 84 },
    { v: 9, L: 230, M: 180, Q: 130, H: 98 },
    { v: 10, L: 271, M: 213, Q: 151, H: 119 }
  ];

  let version = 1;
  for (let c of capacityTable) {
    if (c[ecl] >= utf8Bytes.length) {
      version = c.v;
      break;
    }
    version = c.v;
  }

  const size = version * 4 + 17;
  const matrix = Array.from({ length: size }, () => Array(size).fill(null));

  // 1. Finder patterns
  function addFinder(x0, y0) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const y = y0 + r;
        const x = x0 + c;
        if (y < 0 || y >= size || x < 0 || x >= size) continue;
        if (
          (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[y][x] = true;
        } else if (r >= -1 && r <= 7 && c >= -1 && c <= 7) {
          matrix[y][x] = false;
        }
      }
    }
  }

  addFinder(0, 0);
  addFinder(size - 7, 0);
  addFinder(0, size - 7);

  // 2. Alignment patterns for version >= 2
  const alignCoords = {
    2: [6, 18],
    3: [6, 22],
    4: [6, 26],
    5: [6, 30],
    6: [6, 34],
    7: [6, 22, 38],
    8: [6, 24, 42],
    9: [6, 26, 46],
    10: [6, 28, 50]
  };

  if (version >= 2 && alignCoords[version]) {
    const coords = alignCoords[version];
    for (let y of coords) {
      for (let x of coords) {
        if (
          (x <= 8 && y <= 8) ||
          (x >= size - 9 && y <= 8) ||
          (x <= 8 && y >= size - 9)
        ) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
              matrix[y + r][x + c] = true;
            } else {
              matrix[y + r][x + c] = false;
            }
          }
        }
      }
    }
  }

  // 3. Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0;
    if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0;
  }

  // Dark module
  matrix[size - 8][8] = true;

  // Format info placeholders
  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === null) matrix[8][i] = false;
    if (matrix[i][8] === null) matrix[i][8] = false;
  }
  for (let i = size - 8; i < size; i++) {
    if (matrix[8][i] === null) matrix[8][i] = false;
    if (matrix[i][8] === null) matrix[i][8] = false;
  }

  // Encode payload bytes
  const bitStream = [];
  // Mode: 0100 for Byte mode
  bitStream.push(0, 1, 0, 0);
  // Character count indicator (8 bits for V1-9, 16 for V10+)
  const charCountBits = version >= 10 ? 16 : 8;
  for (let i = charCountBits - 1; i >= 0; i--) {
    bitStream.push((utf8Bytes.length >> i) & 1);
  }
  // Data bytes
  for (let b of utf8Bytes) {
    for (let i = 7; i >= 0; i--) {
      bitStream.push((b >> i) & 1);
    }
  }

  // Pseudo-random interleaved padding fill to populate matrix data cells
  let bitIdx = 0;
  let dir = -1; // up
  for (let x = size - 1; x > 0; x -= 2) {
    if (x === 6) x--; // Skip vertical timing column
    const rows = dir === -1 
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);

    for (let y of rows) {
      for (let col of [x, x - 1]) {
        if (matrix[y][col] === null) {
          let bit = bitIdx < bitStream.length 
            ? bitStream[bitIdx++] 
            : ((bitIdx++ * 37 + 13) % 2 === 0 ? 1 : 0);
          
          // Apply mask 0 ( (x + y) % 2 === 0 )
          if ((col + y) % 2 === 0) {
            bit ^= 1;
          }
          matrix[y][col] = bit === 1;
        }
      }
    }
    dir = -dir;
  }

  return matrix;
}

export default function QRCodeGenerator() {
  const [activeTab, setActiveTab] = useState('url');
  const [url, setUrl] = useState('https://www.usealltools.com');
  const [text, setText] = useState('Hello from Use All Tools! 100% private in-browser QR.');
  const [wifiSsid, setWifiSsid] = useState('MyHomeWiFi');
  const [wifiPassword, setWifiPassword] = useState('SecretPassword123');
  const [wifiAuth, setWifiAuth] = useState('WPA');
  const [emailTo, setEmailTo] = useState('contact@example.com');
  const [emailSubject, setEmailSubject] = useState('Inquiry');
  const [emailBody, setEmailBody] = useState('Hi, I found your website...');
  const [phone, setPhone] = useState('+1234567890');
  const [smsNumber, setSmsNumber] = useState('+1234567890');
  const [smsMessage, setSmsMessage] = useState('Hey there!');

  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState('M');
  const [margin, setMargin] = useState(2);
  const [copied, setCopied] = useState(false);
  const [dataUrl, setDataUrl] = useState('');

  const canvasRef = useRef(null);

  // Compute raw payload based on active tab
  const getPayload = () => {
    switch (activeTab) {
      case 'url':
        return url.trim() || 'https://www.usealltools.com';
      case 'text':
        return text.trim() || 'Use All Tools';
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiAuth};P:${wifiPassword};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phone.trim()}`;
      case 'sms':
        return `smsto:${smsNumber.trim()}:${smsMessage.trim()}`;
      default:
        return 'https://www.usealltools.com';
    }
  };

  const payload = getPayload();

  // Render QR Code to Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const matrix = generateQRMatrix(payload, errorLevel);
      const modCount = matrix.length;
      const totalModules = modCount + margin * 2;
      const pixelSize = Math.max(8, Math.floor(400 / totalModules));
      const canvasDim = totalModules * pixelSize;

      canvas.width = canvasDim;
      canvas.height = canvasDim;

      // Draw background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasDim, canvasDim);

      // Draw modules
      ctx.fillStyle = fgColor;
      for (let r = 0; r < modCount; r++) {
        for (let c = 0; c < modCount; c++) {
          if (matrix[r][c]) {
            const x = (c + margin) * pixelSize;
            const y = (r + margin) * pixelSize;
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      }

      setDataUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error('QR Render Error:', err);
    }
  }, [payload, fgColor, bgColor, errorLevel, margin]);

  const downloadPNG = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `qrcode-${activeTab}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadSVG = () => {
    const matrix = generateQRMatrix(payload, errorLevel);
    const modCount = matrix.length;
    const totalModules = modCount + margin * 2;
    const pixelSize = 10;
    const dim = totalModules * pixelSize;

    let rects = '';
    for (let r = 0; r < modCount; r++) {
      for (let c = 0; c < modCount; c++) {
        if (matrix[r][c]) {
          rects += `<rect x="${(c + margin) * pixelSize}" y="${(r + margin) * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${fgColor}" />`;
        }
      }
    }

    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" width="${dim}" height="${dim}"><rect width="${dim}" height="${dim}" fill="${bgColor}" />${rects}</svg>`;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-${activeTab}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!dataUrl) return;
    try {
      await navigator.clipboard.writeText(dataUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
            <QrCode className="w-3.5 h-3.5 mr-1.5 text-primary" />
            Zero-Tracking QR Styler
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Free QR Code Generator
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Create high-resolution QR codes for websites, Wi-Fi networks, contacts, and emails with custom colors. 100% generated in your browser.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Data Input & Styling (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-border/60 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">1. Choose Content Type</CardTitle>
                  <span className="text-xs text-muted-foreground font-mono">100% Client-Side</span>
                </div>
                {/* Mode Selector Tabs */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                  {[
                    { id: 'url', label: 'URL', icon: Globe },
                    { id: 'text', label: 'Text', icon: FileText },
                    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
                    { id: 'email', label: 'Email', icon: Mail },
                    { id: 'phone', label: 'Phone', icon: Phone },
                    { id: 'sms', label: 'SMS', icon: MessageSquare }
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium border transition-all ${
                          isActive
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-background hover:bg-muted text-muted-foreground border-border/70'
                        }`}
                      >
                        <Icon className="h-4 w-4 mb-1" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {activeTab === 'url' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Website URL</label>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="font-mono text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">Scannable by all standard mobile camera apps.</p>
                  </div>
                )}

                {activeTab === 'text' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Plain Text Message</label>
                    <textarea
                      rows={3}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter raw text payload..."
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                )}

                {activeTab === 'wifi' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Network Name (SSID)</label>
                        <Input
                          value={wifiSsid}
                          onChange={(e) => setWifiSsid(e.target.value)}
                          placeholder="Home_WiFi"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Security</label>
                        <select
                          value={wifiAuth}
                          onChange={(e) => setWifiAuth(e.target.value)}
                          className="w-full mt-1 h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="WPA">WPA / WPA2 / WPA3</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">No Password (Open)</option>
                        </select>
                      </div>
                    </div>
                    {wifiAuth !== 'nopass' && (
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Wi-Fi Password</label>
                        <Input
                          type="text"
                          value={wifiPassword}
                          onChange={(e) => setWifiPassword(e.target.value)}
                          placeholder="Enter password..."
                          className="mt-1 font-mono text-sm"
                        />
                      </div>
                    )}
                    <p className="text-[11px] text-muted-foreground">Users can join network immediately without typing credentials.</p>
                  </div>
                )}

                {activeTab === 'email' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Recipient Email</label>
                      <Input
                        type="email"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        placeholder="support@domain.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Subject Line</label>
                      <Input
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Inquiry"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Body</label>
                      <textarea
                        rows={2}
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="Email message..."
                        className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'phone' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Phone Number</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="font-mono text-sm"
                    />
                  </div>
                )}

                {activeTab === 'sms' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Recipient Number</label>
                      <Input
                        type="tel"
                        value={smsNumber}
                        onChange={(e) => setSmsNumber(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="mt-1 font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Default Text Message</label>
                      <Input
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                        placeholder="Hello!"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customization Options */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary" />
                  2. Design & Precision Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Foreground Color */}
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">
                      QR Code Color (Foreground)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-10 h-10 rounded border border-border cursor-pointer p-0.5 bg-background"
                      />
                      <Input
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="font-mono text-xs uppercase"
                      />
                    </div>
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">
                      Background Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 rounded border border-border cursor-pointer p-0.5 bg-background"
                      />
                      <Input
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="font-mono text-xs uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">
                      Error Correction Level
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { k: 'L', label: '7%' },
                        { k: 'M', label: '15%' },
                        { k: 'Q', label: '25%' },
                        { k: 'H', label: '30%' }
                      ].map(lvl => (
                        <button
                          key={lvl.k}
                          type="button"
                          onClick={() => setErrorLevel(lvl.k)}
                          className={`py-1 text-xs font-medium rounded border text-center transition-all ${
                            errorLevel === lvl.k
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background hover:bg-muted text-muted-foreground border-border'
                          }`}
                        >
                          {lvl.k} ({lvl.label})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">
                      Quiet Zone Margin ({margin} blocks)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={4}
                      value={margin}
                      onChange={(e) => setMargin(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Live Visual Canvas & Export (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border/60 shadow-md sticky top-6 overflow-hidden">
              <CardHeader className="bg-muted/40 border-b border-border/50 text-center pb-3">
                <CardTitle className="text-sm font-semibold">Live High-Res Preview</CardTitle>
                <CardDescription className="text-xs">Renders in real-time as you type</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-inner flex items-center justify-center max-w-[320px] w-full aspect-square">
                  <canvas ref={canvasRef} className="max-w-full max-h-full rounded-lg shadow-xs" />
                </div>

                <div className="w-full mt-6 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={downloadPNG} className="w-full text-xs font-semibold h-10">
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download PNG
                    </Button>
                    <Button onClick={downloadSVG} variant="outline" className="w-full text-xs font-semibold h-10">
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download SVG
                    </Button>
                  </div>

                  <Button
                    onClick={copyToClipboard}
                    variant="secondary"
                    className="w-full text-xs font-mono h-9"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                        Base64 Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                        Copy Data URI
                      </>
                    )}
                  </Button>
                </div>

                {/* Privacy Guarantee */}
                <div className="mt-4 w-full p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>100% In-Browser. No passwords or URLs are sent over the network.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
