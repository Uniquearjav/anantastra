'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeftRight, 
  Ruler, 
  HardDrive, 
  Scale, 
  Thermometer, 
  Gauge, 
  Clock, 
  Boxes, 
  Maximize2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

const CATEGORIES = {
  length: {
    name: 'Length & Distance',
    icon: Ruler,
    base: 'meter',
    units: {
      kilometer: { name: 'Kilometer', symbol: 'km', toBase: 1000 },
      meter: { name: 'Meter', symbol: 'm', toBase: 1 },
      centimeter: { name: 'Centimeter', symbol: 'cm', toBase: 0.01 },
      millimeter: { name: 'Millimeter', symbol: 'mm', toBase: 0.001 },
      mile: { name: 'Mile', symbol: 'mi', toBase: 1609.344 },
      yard: { name: 'Yard', symbol: 'yd', toBase: 0.9144 },
      foot: { name: 'Foot', symbol: 'ft', toBase: 0.3048 },
      inch: { name: 'Inch', symbol: 'in', toBase: 0.0254 },
      nautical_mile: { name: 'Nautical Mile', symbol: 'nmi', toBase: 1852 },
    },
    defaultFrom: 'meter',
    defaultTo: 'foot',
  },
  storage: {
    name: 'Digital Storage',
    icon: HardDrive,
    base: 'byte',
    units: {
      bit: { name: 'Bit', symbol: 'b', toBase: 0.125 },
      byte: { name: 'Byte', symbol: 'B', toBase: 1 },
      kilobyte: { name: 'Kilobyte', symbol: 'KB', toBase: 1024 },
      megabyte: { name: 'Megabyte', symbol: 'MB', toBase: 1024 ** 2 },
      gigabyte: { name: 'Gigabyte', symbol: 'GB', toBase: 1024 ** 3 },
      terabyte: { name: 'Terabyte', symbol: 'TB', toBase: 1024 ** 4 },
      petabyte: { name: 'Petabyte', symbol: 'PB', toBase: 1024 ** 5 },
    },
    defaultFrom: 'gigabyte',
    defaultTo: 'megabyte',
  },
  weight: {
    name: 'Weight & Mass',
    icon: Scale,
    base: 'gram',
    units: {
      metric_ton: { name: 'Metric Ton', symbol: 't', toBase: 1000000 },
      kilogram: { name: 'Kilogram', symbol: 'kg', toBase: 1000 },
      gram: { name: 'Gram', symbol: 'g', toBase: 1 },
      milligram: { name: 'Milligram', symbol: 'mg', toBase: 0.001 },
      pound: { name: 'Pound', symbol: 'lb', toBase: 453.59237 },
      ounce: { name: 'Ounce', symbol: 'oz', toBase: 28.34952 },
      stone: { name: 'Stone', symbol: 'st', toBase: 6350.29318 },
    },
    defaultFrom: 'kilogram',
    defaultTo: 'pound',
  },
  temperature: {
    name: 'Temperature',
    icon: Thermometer,
    isSpecial: true,
    units: {
      celsius: { name: 'Celsius', symbol: '°C' },
      fahrenheit: { name: 'Fahrenheit', symbol: '°F' },
      kelvin: { name: 'Kelvin', symbol: 'K' },
    },
    defaultFrom: 'celsius',
    defaultTo: 'fahrenheit',
  },
  speed: {
    name: 'Speed',
    icon: Gauge,
    base: 'mps',
    units: {
      mps: { name: 'Meters per second', symbol: 'm/s', toBase: 1 },
      kmh: { name: 'Kilometers per hour', symbol: 'km/h', toBase: 1 / 3.6 },
      mph: { name: 'Miles per hour', symbol: 'mph', toBase: 0.44704 },
      knot: { name: 'Knot', symbol: 'kn', toBase: 0.514444 },
    },
    defaultFrom: 'kmh',
    defaultTo: 'mph',
  },
  area: {
    name: 'Area',
    icon: Maximize2,
    base: 'sqm',
    units: {
      sqm: { name: 'Square Meter', symbol: 'm²', toBase: 1 },
      sqkm: { name: 'Square Kilometer', symbol: 'km²', toBase: 1000000 },
      sqft: { name: 'Square Foot', symbol: 'ft²', toBase: 0.092903 },
      acre: { name: 'Acre', symbol: 'ac', toBase: 4046.85642 },
      hectare: { name: 'Hectare', symbol: 'ha', toBase: 10000 },
      sqmi: { name: 'Square Mile', symbol: 'mi²', toBase: 2589988.11 },
    },
    defaultFrom: 'sqm',
    defaultTo: 'sqft',
  },
  volume: {
    name: 'Volume',
    icon: Boxes,
    base: 'liter',
    units: {
      cubic_meter: { name: 'Cubic Meter', symbol: 'm³', toBase: 1000 },
      liter: { name: 'Liter', symbol: 'L', toBase: 1 },
      milliliter: { name: 'Milliliter', symbol: 'mL', toBase: 0.001 },
      gallon_us: { name: 'Gallon (US)', symbol: 'gal', toBase: 3.78541 },
      quart_us: { name: 'Quart (US)', symbol: 'qt', toBase: 0.946353 },
      pint_us: { name: 'Pint (US)', symbol: 'pt', toBase: 0.473176 },
      cup_us: { name: 'Cup (US)', symbol: 'cup', toBase: 0.236588 },
      floz_us: { name: 'Fluid Ounce (US)', symbol: 'fl oz', toBase: 0.0295735 },
    },
    defaultFrom: 'liter',
    defaultTo: 'gallon_us',
  },
  time: {
    name: 'Time',
    icon: Clock,
    base: 'second',
    units: {
      second: { name: 'Second', symbol: 's', toBase: 1 },
      minute: { name: 'Minute', symbol: 'min', toBase: 60 },
      hour: { name: 'Hour', symbol: 'h', toBase: 3600 },
      day: { name: 'Day', symbol: 'd', toBase: 86400 },
      week: { name: 'Week', symbol: 'wk', toBase: 604800 },
      month: { name: 'Month (30d)', symbol: 'mo', toBase: 2592000 },
      year: { name: 'Year (365d)', symbol: 'yr', toBase: 31536000 },
    },
    defaultFrom: 'hour',
    defaultTo: 'minute',
  },
};

export default function UnitConverter() {
  const [categoryKey, setCategoryKey] = useState('length');
  const [valInput, setValInput] = useState('1');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');
  const [copied, setCopied] = useState(false);

  const activeCategory = CATEGORIES[categoryKey];

  // Helper for temperature conversions
  const convertTemp = (v, from, to) => {
    let c = v;
    if (from === 'fahrenheit') c = (v - 32) * (5 / 9);
    else if (from === 'kelvin') c = v - 273.15;

    if (to === 'celsius') return c;
    if (to === 'fahrenheit') return (c * 9) / 5 + 32;
    if (to === 'kelvin') return c + 273.15;
    return c;
  };

  const handleCategorySwitch = (catKey) => {
    setCategoryKey(catKey);
    setFromUnit(CATEGORIES[catKey].defaultFrom);
    setToUnit(CATEGORIES[catKey].defaultTo);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const parsedVal = parseFloat(valInput);
  const isValidVal = !isNaN(parsedVal);

  const formatNumber = (num) => {
    if (num === null || isNaN(num)) return '';
    if (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-4 && num !== 0)) {
      return num.toExponential(6);
    }
    return Number(num.toPrecision(8)).toString();
  };

  // Compute conversion
  const conversion = useMemo(() => {
    if (!isValidVal) return null;

    let targetValue = 0;
    if (activeCategory.isSpecial && categoryKey === 'temperature') {
      targetValue = convertTemp(parsedVal, fromUnit, toUnit);
    } else {
      const fromFactor = activeCategory.units[fromUnit]?.toBase || 1;
      const toFactor = activeCategory.units[toUnit]?.toBase || 1;
      const baseValue = parsedVal * fromFactor;
      targetValue = baseValue / toFactor;
    }

    // All units matrix
    const matrix = Object.entries(activeCategory.units).map(([uKey, uData]) => {
      let val = 0;
      if (activeCategory.isSpecial && categoryKey === 'temperature') {
        val = convertTemp(parsedVal, fromUnit, uKey);
      } else {
        const fromFactor = activeCategory.units[fromUnit]?.toBase || 1;
        const toFactor = uData.toBase || 1;
        val = (parsedVal * fromFactor) / toFactor;
      }
      return {
        key: uKey,
        name: uData.name,
        symbol: uData.symbol,
        value: val,
        formatted: formatNumber(val)
      };
    });

    return {
      targetValue,
      formattedTarget: formatNumber(targetValue),
      matrix
    };
  }, [parsedVal, isValidVal, fromUnit, toUnit, activeCategory, categoryKey]);

  const handleCopy = () => {
    if (!conversion) return;
    const text = `${valInput} ${activeCategory.units[fromUnit]?.symbol} = ${conversion.formattedTarget} ${activeCategory.units[toUnit]?.symbol}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
          <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5 text-primary" />
          Universal Measurement Engine
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Unit Converter
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xl mx-auto">
          Convert length, storage, weight, temperature, speed, area, volume, and time with high precision and simultaneous multi-unit matrix.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-8">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const Icon = cat.icon;
          const isCurrent = categoryKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleCategorySwitch(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isCurrent
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-card text-foreground hover:bg-muted border-border/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Card */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <label htmlFor="unit-val" className="text-sm font-semibold text-foreground block mb-2">
              Value to Convert
            </label>
            <Input
              id="unit-val"
              type="number"
              step="any"
              value={valInput}
              onChange={(e) => setValInput(e.target.value)}
              placeholder="1"
              className="font-mono text-xl py-6"
            />

            {/* From / To Unit Selectors */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
              {/* From Unit */}
              <div className="sm:col-span-5 space-y-1.5">
                <label htmlFor="from-unit-select" className="text-xs font-medium text-muted-foreground">
                  From Unit
                </label>
                <select
                  id="from-unit-select"
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.entries(activeCategory.units).map(([code, item]) => (
                    <option key={code} value={code}>
                      {item.name} ({item.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center pt-5">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwap}
                  className="rounded-full h-10 w-10 shrink-0"
                  title="Swap Units"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>
              </div>

              {/* To Unit */}
              <div className="sm:col-span-5 space-y-1.5">
                <label htmlFor="to-unit-select" className="text-xs font-medium text-muted-foreground">
                  To Unit
                </label>
                <select
                  id="to-unit-select"
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.entries(activeCategory.units).map(([code, item]) => (
                    <option key={code} value={code}>
                      {item.name} ({item.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Presets for Current Category */}
            <div className="mt-5 pt-4 border-t border-border/60">
              <span className="text-xs font-medium text-muted-foreground block mb-2">Quick Values:</span>
              <div className="flex flex-wrap gap-1.5 font-mono">
                {['0.1', '1', '5', '10', '50', '100', '1024'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setValInput(p)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                      valInput === p
                        ? 'bg-primary text-primary-foreground border-primary font-bold'
                        : 'bg-muted/30 hover:bg-muted border-border/60 text-foreground'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Copy button */}
            <div className="mt-5 flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!conversion}
                className="text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied Result' : 'Copy Conversion'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Output & Multi-Unit Matrix */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <h2 className="text-base font-bold text-foreground mb-4">
              Conversion Result
            </h2>

            {conversion ? (
              <div className="space-y-4">
                {/* Highlight Result */}
                <div className="p-5 rounded-2xl border border-border/70 bg-card">
                  <div className="text-xs text-muted-foreground font-mono">
                    {valInput} {activeCategory.units[fromUnit]?.name} =
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-primary font-mono tracking-tight mt-1.5 break-all">
                    {conversion.formattedTarget}{' '}
                    <span className="text-lg font-bold text-muted-foreground">
                      {activeCategory.units[toUnit]?.symbol}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {activeCategory.units[toUnit]?.name}
                  </div>
                </div>

                {/* All Units Live Matrix */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-2">
                    <span>All {activeCategory.name} Units:</span>
                    <span className="text-muted-foreground font-mono">Base: {valInput} {activeCategory.units[fromUnit]?.symbol}</span>
                  </div>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {conversion.matrix.map((item) => (
                      <div
                        key={item.key}
                        onClick={() => setToUnit(item.key)}
                        className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors text-xs ${
                          item.key === toUnit
                            ? 'border-primary bg-primary/5 font-semibold'
                            : 'border-border/40 hover:bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-muted-foreground w-10">{item.symbol}</span>
                          <span className="text-foreground">{item.name}</span>
                        </div>
                        <span className="font-mono font-bold text-foreground">
                          {item.formatted}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm border border-dashed border-border/60 rounded-xl">
                Please enter a valid numeric value.
              </div>
            )}
          </Card>

          {/* Privacy badge */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Strictly client-side calculations using standard IEEE 754 precision.</span>
          </div>
        </div>
      </div>

      {/* Standards Guide */}
      <Card className="mt-8 p-6 border-border/60 shadow-xs">
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Measurement Standards & Conventions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">SI Metric vs Imperial</h3>
            <p className="text-xs text-muted-foreground">
              The International System of Units (SI) is based on powers of 10. Imperial units (US Customary) use historical multiples (12 inches/ft, 3 ft/yd).
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Binary Storage (1024)</h3>
            <p className="text-xs text-muted-foreground">
              Digital computing uses binary prefixes where 1 KB = 1,024 Bytes (2¹⁰) and 1 MB = 1,024 KB.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Temperature Scales</h3>
            <p className="text-xs text-muted-foreground">
              Celsius is pegged to water phase changes (0°C to 100°C), Kelvin is absolute thermodynamic temperature (0 K = -273.15°C).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}