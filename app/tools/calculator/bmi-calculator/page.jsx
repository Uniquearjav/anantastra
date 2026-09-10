'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Scale, 
  Activity, 
  Heart, 
  Check, 
  Copy, 
  Info, 
  TrendingDown, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';

export default function BMICalculator() {
  const [unitSystem, setUnitSystem] = useState('metric'); // 'metric' (cm/kg) | 'imperial' (ft+in/lbs)
  
  // Metric states
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);

  // Imperial states
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(9);
  const [weightLbs, setWeightLbs] = useState(154);

  const [copied, setCopied] = useState(false);

  // Derive standardized values (meters and kg)
  const { heightMeters, weightInKg } = useMemo(() => {
    if (unitSystem === 'metric') {
      const hM = Math.max(0.5, heightCm / 100);
      const wK = Math.max(10, weightKg);
      return { heightMeters: hM, weightInKg: wK };
    } else {
      const totalInches = (feet * 12) + inches;
      const hM = Math.max(0.5, totalInches * 0.0254);
      const wK = Math.max(10, weightLbs * 0.45359237);
      return { heightMeters: hM, weightInKg: wK };
    }
  }, [unitSystem, heightCm, weightKg, feet, inches, weightLbs]);

  // BMI Math
  const bmiData = useMemo(() => {
    const bmiVal = weightInKg / (heightMeters * heightMeters);
    const roundedBmi = parseFloat(bmiVal.toFixed(1));

    let category = 'Normal';
    let colorClass = 'text-emerald-500';
    let badgeVariant = 'success';
    let description = 'Healthy weight range. Maintain balanced nutrition and regular physical activity.';

    if (roundedBmi < 18.5) {
      category = 'Underweight';
      colorClass = 'text-amber-500';
      badgeVariant = 'warning';
      description = 'Below optimal body weight. Consider nutrient-rich caloric intake and strength training.';
    } else if (roundedBmi < 25) {
      category = 'Normal Weight';
      colorClass = 'text-emerald-500';
      badgeVariant = 'success';
      description = 'Optimal body weight associated with lower risk of chronic metabolic conditions.';
    } else if (roundedBmi < 30) {
      category = 'Overweight';
      colorClass = 'text-amber-500';
      badgeVariant = 'warning';
      description = 'Slightly above optimal weight. Regular cardiovascular exercise is recommended.';
    } else if (roundedBmi < 35) {
      category = 'Obese (Class I)';
      colorClass = 'text-rose-500';
      badgeVariant = 'destructive';
      description = 'Elevated health risks. Consult healthcare professionals for structured lifestyle guidance.';
    } else {
      category = 'Obese (Class II/III)';
      colorClass = 'text-rose-600';
      badgeVariant = 'destructive';
      description = 'High cardiovascular risk. Medical consultation and structured intervention advised.';
    }

    // Healthy weight range for this height (BMI 18.5 to 24.9)
    const minHealthyKg = (18.5 * heightMeters * heightMeters).toFixed(1);
    const maxHealthyKg = (24.9 * heightMeters * heightMeters).toFixed(1);

    // Difference from ideal BMI (22.0)
    const idealWeightKg = 22 * heightMeters * heightMeters;
    const diffKg = (weightInKg - idealWeightKg).toFixed(1);

    // Position percentage for gauge (15 to 35 clamp)
    const clampedBmi = Math.min(35, Math.max(15, roundedBmi));
    const gaugePosition = ((clampedBmi - 15) / (35 - 15)) * 100;

    return {
      bmi: roundedBmi,
      category,
      colorClass,
      badgeVariant,
      description,
      minHealthyKg,
      maxHealthyKg,
      diffKg,
      gaugePosition
    };
  }, [heightMeters, weightInKg]);

  const handleCopy = () => {
    const report = `BODY MASS INDEX (BMI) REPORT - ANANTASTRA
------------------------------------------
Height: ${heightMeters.toFixed(2)} m (${unitSystem === 'imperial' ? `${feet}ft ${inches}in` : `${heightCm} cm`})
Weight: ${weightInKg.toFixed(1)} kg (${unitSystem === 'imperial' ? `${weightLbs} lbs` : `${weightKg} kg`})
Calculated BMI: ${bmiData.bmi} (${bmiData.category})
Healthy Weight Range: ${bmiData.minHealthyKg} kg - ${bmiData.maxHealthyKg} kg
------------------------------------------
100% Client-Side Health Assessment
`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-lg bg-foreground text-background">
              <Scale className="h-4 w-4" />
            </span>
            <Badge variant="contrast">Health Calculator</Badge>
            <Badge variant="subtle">WHO Standards</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            BMI Calculator
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Calculate your Body Mass Index, identify healthy weight ranges, and visualize health categories
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Unit Toggle */}
          <div className="p-1 rounded-xl bg-muted/40 border border-border/50 flex">
            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                unitSystem === 'metric'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Metric (cm, kg)
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                unitSystem === 'imperial'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Imperial (ft, lbs)
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 text-xs gap-1 border-border/70"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sliders & Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Height Input Card */}
          <Card className="p-5 border-border/60 bg-card text-card-foreground space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Your Height
              </label>
              <span className="text-sm font-bold text-foreground">
                {unitSystem === 'metric' ? `${heightCm} cm` : `${feet} ft ${inches} in`}
              </span>
            </div>

            {unitSystem === 'metric' ? (
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type="number"
                    min="100"
                    max="250"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Math.max(50, parseInt(e.target.value) || 0))}
                    className="pr-12 text-base font-semibold h-11 rounded-xl"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    cm
                  </span>
                </div>
                <Slider
                  value={[heightCm]}
                  min={120}
                  max={220}
                  step={1}
                  onValueChange={([val]) => setHeightCm(val)}
                  className="py-1"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">Feet</label>
                  <Input
                    type="number"
                    min="3"
                    max="8"
                    value={feet}
                    onChange={(e) => setFeet(Math.max(1, parseInt(e.target.value) || 0))}
                    className="h-11 font-semibold rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">Inches</label>
                  <Input
                    type="number"
                    min="0"
                    max="11"
                    value={inches}
                    onChange={(e) => setInches(Math.max(0, parseInt(e.target.value) || 0))}
                    className="h-11 font-semibold rounded-xl"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Weight Input Card */}
          <Card className="p-5 border-border/60 bg-card text-card-foreground space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Your Weight
              </label>
              <span className="text-sm font-bold text-foreground">
                {unitSystem === 'metric' ? `${weightKg} kg` : `${weightLbs} lbs`}
              </span>
            </div>

            {unitSystem === 'metric' ? (
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type="number"
                    min="20"
                    max="300"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Math.max(10, parseFloat(e.target.value) || 0))}
                    className="pr-12 text-base font-semibold h-11 rounded-xl"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    kg
                  </span>
                </div>
                <Slider
                  value={[weightKg]}
                  min={30}
                  max={160}
                  step={0.5}
                  onValueChange={([val]) => setWeightKg(val)}
                  className="py-1"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type="number"
                    min="40"
                    max="600"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Math.max(20, parseFloat(e.target.value) || 0))}
                    className="pr-12 text-base font-semibold h-11 rounded-xl"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    lbs
                  </span>
                </div>
                <Slider
                  value={[weightLbs]}
                  min={60}
                  max={350}
                  step={1}
                  onValueChange={([val]) => setWeightLbs(val)}
                  className="py-1"
                />
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Results & Gauge (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Result Card */}
          <Card className="p-6 border-border/60 bg-card text-card-foreground shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Your BMI Result
              </h2>
              <Badge variant={bmiData.badgeVariant}>{bmiData.category}</Badge>
            </div>

            {/* Score Big Display */}
            <div className="my-5 p-5 rounded-xl border border-border/80 bg-muted/30 text-center">
              <span className="text-5xl font-black tracking-tight text-foreground font-mono">
                {bmiData.bmi}
              </span>
              <span className={`text-sm font-bold block mt-1 ${bmiData.colorClass}`}>
                {bmiData.category}
              </span>
            </div>

            {/* Visual Continuous Segmented Gauge */}
            <div className="space-y-2 mb-6">
              <div className="relative h-3 w-full rounded-full overflow-hidden flex bg-muted/40">
                <div className="h-full w-[17.5%] bg-amber-500/80" title="Underweight (<18.5)" />
                <div className="h-full w-[32.5%] bg-emerald-500/80" title="Normal (18.5-24.9)" />
                <div className="h-full w-[25%] bg-amber-500/80" title="Overweight (25-29.9)" />
                <div className="h-full w-[25%] bg-rose-500/80" title="Obese (>=30)" />
              </div>

              {/* Marker Arrow */}
              <div className="relative w-full h-4">
                <div 
                  className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                  style={{ left: `${bmiData.gaugePosition}%` }}
                >
                  <span className="h-2 w-2 rotate-45 bg-foreground" />
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>15</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>35+</span>
              </div>
            </div>

            {/* Healthy Weight Guidance */}
            <div className="space-y-2.5 text-xs border-t border-border/40 pt-4">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Healthy Weight Range</span>
                <span className="font-bold text-foreground">
                  {bmiData.minHealthyKg} - {bmiData.maxHealthyKg} kg
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Optimal Target BMI</span>
                <span className="font-bold text-foreground">22.0 kg/m²</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                {bmiData.description}
              </p>
            </div>
          </Card>

          {/* Reference Card */}
          <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-sm text-card-foreground text-xs space-y-2">
            <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px]">
              WHO BMI Classifications
            </h3>
            <div className="space-y-1 text-muted-foreground text-[11px]">
              <div className="flex justify-between"><span>&lt; 18.5</span><span>Underweight</span></div>
              <div className="flex justify-between"><span>18.5 – 24.9</span><span className="text-foreground font-semibold">Normal weight</span></div>
              <div className="flex justify-between"><span>25.0 – 29.9</span><span>Overweight</span></div>
              <div className="flex justify-between"><span>≥ 30.0</span><span>Obesity</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}