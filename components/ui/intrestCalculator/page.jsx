'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatIndianCurrency } from '@/lib/formatters';

const InterestCalculator = () => {
    // States for form inputs
    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(5);
    const [time, setTime] = useState(5);
    const [timeUnit, setTimeUnit] = useState('years');
    const [compoundFrequency, setCompoundFrequency] = useState(1);
    
    // States for results
    const [simpleInterest, setSimpleInterest] = useState(0);
    const [compoundInterest, setCompoundInterest] = useState(0);
    const [yearlyData, setYearlyData] = useState([]);
    const [effectiveTime, setEffectiveTime] = useState(5); // Time in years for calculations
    
    // State for dark mode and graph size
    const [darkMode, setDarkMode] = useState(false);
    const [graphSize, setGraphSize] = useState('medium'); // 'small', 'medium', 'large'
    
    // States for download status
    const [csvDownloaded, setCsvDownloaded] = useState(false);
    const [imageDownloaded, setImageDownloaded] = useState(false);
    
    // Canvas ref to handle resizing
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);
    
    // Apply dark mode effect
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);
    
    // Convert time to years based on selected unit
    useEffect(() => {
        let timeInYears = Number(time);
        
        if (timeUnit === 'months') {
            timeInYears = timeInYears / 12;
        } else if (timeUnit === 'days') {
            timeInYears = timeInYears / 365;
        }
        
        setEffectiveTime(timeInYears);
    }, [time, timeUnit]);
    
    // Calculate interests whenever inputs change
    useEffect(() => {
        calculateInterest();
    }, [principal, rate, effectiveTime, compoundFrequency]);
    
    // Handle window resize to redraw graph
    useEffect(() => {
        const handleResize = () => {
            drawGraph();
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [yearlyData, darkMode, graphSize]);
    
    // Reset download status when inputs change
    useEffect(() => {
        setCsvDownloaded(false);
        setImageDownloaded(false);
    }, [principal, rate, time, timeUnit, compoundFrequency]);
    
    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };
    
    // Get time period label based on data points
    const getTimePeriodLabel = (index, totalPeriods) => {
        // For very short periods (days/weeks), show more detailed labels
        if (effectiveTime < 1/12) { // Less than a month
            return `Day ${Math.round(index * effectiveTime * 365)}`;
        } else if (effectiveTime <= 1) { // Up to a year
            return `Month ${Math.round(index * effectiveTime * 12)}`;
        } else {
            return `Year ${Math.round(index * effectiveTime)}`;
        }
    };
    
    // Get appropriate x-axis title based on period
    const getXAxisTitle = () => {
        if (effectiveTime < 1/12) {
            return 'Days';
        } else if (effectiveTime <= 1) {
            return 'Months';
        } else {
            return 'Years';
        }
    };
    
    // Get the number of data points to display based on time period
    const getDataPointCount = () => {
        if (effectiveTime <= 1/12) { // Less than a month
            return Math.min(30, Math.max(5, Math.ceil(effectiveTime * 365))); // Daily points up to 30
        } else if (effectiveTime <= 1) { // Up to a year
            return Math.min(12, Math.max(4, Math.ceil(effectiveTime * 12))); // Monthly points
        } else {
            return Math.min(50, Math.max(5, Math.ceil(effectiveTime))); // Yearly points up to 50
        }
    };
    
    // Calculate both simple and compound interest
    const calculateInterest = () => {
        // Validate inputs
        const p = Number(principal) || 0;
        const r = Number(rate) / 100 || 0;
        const t = effectiveTime || 0;
        const n = Number(compoundFrequency) || 1;
        
        // Calculate simple interest: P * r * t
        const si = p * r * t;
        setSimpleInterest(si);
        
        // Calculate compound interest: P * (1 + r/n)^(n*t) - P
        const ci = p * Math.pow(1 + r / n, n * t) - p;
        setCompoundInterest(ci);
        
        // Generate data for graph
        const dataPoints = getDataPointCount();
        const data = [];
        
        for (let i = 0; i <= dataPoints; i++) {
            const timeFraction = i / dataPoints * t;
            const siAmount = p + (p * r * timeFraction);
            const ciAmount = p * Math.pow(1 + r / n, n * timeFraction);
            const simpleInt = siAmount - p;
            const compoundInt = ciAmount - p;
            const difference = compoundInt - simpleInt;
            
            data.push({
                period: i,
                periodLabel: getTimePeriodLabel(i / dataPoints, dataPoints),
                simpleAmount: siAmount,
                compoundAmount: ciAmount,
                simpleInterest: simpleInt,
                compoundInterest: compoundInt,
                difference: difference,
                timeFraction: timeFraction
            });
        }
        
        setYearlyData(data);
        
        // Draw the graph after data is updated
        setTimeout(() => drawGraph(), 0);
    };
    
    // Format number as INR currency
    const formatINR = (number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(number);
    };
    
    // Draw the graph using canvas
    const drawGraph = () => {
        if (yearlyData.length === 0 || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const container = canvasContainerRef.current;
        
        if (!container) return;
        
        // Set canvas dimensions based on container size for sharpness
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        // Set the canvas dimensions with device pixel ratio for sharpness
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        // Set the display size to match the container
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        
        const ctx = canvas.getContext('2d');
        
        // Scale the context to account for the device pixel ratio
        ctx.scale(dpr, dpr);
        
        const width = rect.width;
        const height = rect.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Set colors based on theme
        const gridColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        const siColor = 'rgba(59, 130, 246, 0.8)'; // Blue
        const ciColor = 'rgba(139, 92, 246, 0.8)'; // Purple
        
        // Find max value for scaling
        const maxAmount = Math.max(
            ...yearlyData.map(d => Math.max(d.simpleAmount, d.compoundAmount))
        );
        
        // Padding
        const padding = { left: 60, right: 20, top: 20, bottom: 60 }; // Increased bottom padding for legend
        const graphWidth = width - padding.left - padding.right;
        const graphHeight = height - padding.top - padding.bottom;
        
        // Draw grid
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.5;
        
        // Horizontal grid lines
        const numYLines = 5;
        for (let i = 0; i <= numYLines; i++) {
            const y = padding.top + (i / numYLines) * graphHeight;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
            
            // Y-axis labels
            const value = Math.round(maxAmount - (i / numYLines) * maxAmount);
            ctx.fillStyle = textColor;
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'right';
            const formattedValue = value >= 1000 ? `₹${(value/1000).toFixed(0)}K` : `₹${value}`;
            ctx.fillText(formattedValue, padding.left - 5, y + 3);
        }
        
        // Vertical grid lines
        const periods = yearlyData.length - 1;
        const skipFactor = Math.ceil(periods / 10); // Show approximately 10 labels
        
        for (let i = 0; i <= periods; i++) {
            if (i % skipFactor === 0 || i === periods) {
                const x = padding.left + (i / periods) * graphWidth;
                ctx.beginPath();
                ctx.moveTo(x, padding.top);
                ctx.lineTo(x, height - padding.bottom);
                ctx.stroke();
                
                // X-axis labels
                ctx.fillStyle = textColor;
                ctx.font = '9px sans-serif';
                ctx.textAlign = 'center';
                
                // Display label based on time period
                if (effectiveTime < 1) {
                    // For periods less than a year, show the period number directly
                    ctx.fillText(i.toString(), x, height - padding.bottom + 15);
                } else {
                    // For years, show actual year number
                    const yearNum = Math.round(i / periods * effectiveTime);
                    ctx.fillText(yearNum.toString(), x, height - padding.bottom + 15);
                }
            }
        }
        
        // X-axis title
        ctx.fillStyle = textColor;
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(getXAxisTitle(), width / 2, height - padding.bottom + 30);
        
        // Y-axis title
        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = textColor;
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Amount (₹)', 0, 0);
        ctx.restore();
        
        // Draw simple interest line
        ctx.beginPath();
        ctx.strokeStyle = siColor;
        ctx.lineWidth = 2;
        yearlyData.forEach((data, index) => {
            const x = padding.left + (index / periods) * graphWidth;
            const y = padding.top + graphHeight - (data.simpleAmount / maxAmount) * graphHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Draw compound interest line
        ctx.beginPath();
        ctx.strokeStyle = ciColor;
        ctx.lineWidth = 2;
        yearlyData.forEach((data, index) => {
            const x = padding.left + (index / periods) * graphWidth;
            const y = padding.top + graphHeight - (data.compoundAmount / maxAmount) * graphHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Add legend at bottom right
        const legendY = height - padding.bottom + 15;
        const legendX = width - padding.right - 80;
        
        // Background for legend
        ctx.fillStyle = darkMode ? 'rgba(50, 50, 50, 0.7)' : 'rgba(240, 240, 240, 0.7)';
        ctx.fillRect(legendX - 10, legendY - 10, 90, 35);
        ctx.strokeStyle = darkMode ? 'rgba(150, 150, 150, 0.5)' : 'rgba(100, 100, 100, 0.3)';
        ctx.strokeRect(legendX - 10, legendY - 10, 90, 35);
        
        // Simple interest legend
        ctx.beginPath();
        ctx.strokeStyle = siColor;
        ctx.lineWidth = 2;
        ctx.moveTo(legendX, legendY);
        ctx.lineTo(legendX + 25, legendY);
        ctx.stroke();
        
        ctx.fillStyle = textColor;
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Simple', legendX + 30, legendY + 3);
        
        // Compound interest legend
        ctx.beginPath();
        ctx.strokeStyle = ciColor;
        ctx.lineWidth = 2;
        ctx.moveTo(legendX, legendY + 15);
        ctx.lineTo(legendX + 25, legendY + 15);
        ctx.stroke();
        
        ctx.fillStyle = textColor;
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Compound', legendX + 30, legendY + 18);
    };
    
    // Draw graph when data changes
    useEffect(() => {
        drawGraph();
    }, [yearlyData, darkMode, graphSize]);
    
    // Format period label based on timeUnit
    const formatPeriodLabel = (period) => {
        if (timeUnit === 'days') {
            return `Day ${period}`;
        } else if (timeUnit === 'months') {
            return `Month ${period}`;
        } else {
            return `Year ${period}`;
        }
    };
    
    // Function to save canvas as image
    const saveGraphAsImage = () => {
        if (!canvasRef.current) return;
        
        try {
            // Create a temporary link element
            const link = document.createElement('a');
            
            // Get the canvas data as URL
            const imageData = canvasRef.current.toDataURL('image/png');
            
            // Set link properties
            link.href = imageData;
            link.download = `interest-comparison-${Date.now()}.png`;
            
            // Append to body, click to download, then remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show success status for 3 seconds
            setImageDownloaded(true);
            setTimeout(() => setImageDownloaded(false), 3000);
        } catch (error) {
            console.error('Error saving graph as image:', error);
            alert('Failed to save graph. Please try again.');
        }
    };
    
    // Function to convert table data to CSV and download
    const saveTableAsCSV = () => {
        try {
            // Prepare CSV header
            let csvContent = "data:text/csv;charset=utf-8,";
            
            // Add headers for CSV
            const headers = [
                timeUnit === 'years' ? 'Year' : timeUnit === 'months' ? 'Month' : 'Day',
                'Simple Interest (₹)', 
                'Simple Total (₹)', 
                'Compound Interest (₹)', 
                'Compound Total (₹)', 
                'Difference (₹)'
            ];
            csvContent += headers.join(',') + '\n';
            
            // Add all data rows to CSV
            yearlyData.forEach(data => {
                const row = [
                    data.period,
                    Math.round(data.simpleInterest),
                    Math.round(data.simpleAmount),
                    Math.round(data.compoundInterest),
                    Math.round(data.compoundAmount),
                    Math.round(data.difference)
                ];
                csvContent += row.join(',') + '\n';
            });
            
            // Create download link
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `interest-data-${Date.now()}.csv`);
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show success status for 3 seconds
            setCsvDownloaded(true);
            setTimeout(() => setCsvDownloaded(false), 3000);
        } catch (error) {
            console.error('Error saving table as CSV:', error);
            alert('Failed to save table data. Please try again.');
        }
    };
    
    return (
        <main className={`p-5 min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className='text-3xl md:text-4xl font-extrabold text-center md:text-left'>Interest Calculator</h1>
                <Button 
                    onClick={toggleDarkMode} 
                    className={`py-2 px-4 rounded-full transition-all ${darkMode ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                >
                    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </Button>
            </div>
            
            {/* Input Section */}
            <div className={`mb-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className='text-lg mb-4'>Enter values to calculate simple and compound interest</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium">Principal Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                            <Input
                                type="number"
                                value={principal}
                                onChange={(e) => setPrincipal(e.target.value)}
                                className={`pl-7 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                min="0"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block mb-2 text-sm font-medium">Interest Rate (per annum)</label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                className={`pr-7 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                min="0"
                                step="0.1"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2">%</span>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block mb-2 text-sm font-medium">Time Period</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    type="number"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className={`${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                    min={timeUnit === 'years' ? '1' : timeUnit === 'months' ? '1' : '1'}
                                    max={timeUnit === 'years' ? '50' : timeUnit === 'months' ? '600' : '18250'}
                                />
                            </div>
                            <select
                                value={timeUnit}
                                onChange={(e) => setTimeUnit(e.target.value)}
                                className={`h-9 px-3 py-1 rounded-md border min-w-[100px] ${
                                    darkMode 
                                        ? 'bg-gray-700 text-white border-gray-600' 
                                        : 'bg-white text-black border-gray-300'
                                } outline-none transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`}
                            >
                                <option value="years">Years</option>
                                <option value="months">Months</option>
                                <option value="days">Days</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block mb-2 text-sm font-medium">Compound Frequency</label>
                        <select
                            value={compoundFrequency}
                            onChange={(e) => setCompoundFrequency(e.target.value)}
                            className={`w-full h-9 px-3 py-1 rounded-md border ${
                                darkMode 
                                    ? 'bg-gray-700 text-white border-gray-600' 
                                    : 'bg-white text-black border-gray-300'
                            } outline-none transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`}
                        >
                            <option value="1">Annually (1/year)</option>
                            <option value="2">Semi-Annually (2/year)</option>
                            <option value="4">Quarterly (4/year)</option>
                            <option value="12">Monthly (12/year)</option>
                            <option value="365">Daily (365/year)</option>
                        </select>
                    </div>
                </div>
                
                {/* Time period explanation */}
                <div className={`p-3 rounded-md text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    {timeUnit === 'years' ? (
                        <p>Calculating interest for {time} year{time !== 1 ? 's' : ''} at {rate}% per annum.</p>
                    ) : timeUnit === 'months' ? (
                        <p>Calculating interest for {time} month{time !== 1 ? 's' : ''} (equivalent to {(time / 12).toFixed(2)} years) at {rate}% per annum.</p>
                    ) : (
                        <p>Calculating interest for {time} day{time !== 1 ? 's' : ''} (equivalent to {(time / 365).toFixed(2)} years) at {rate}% per annum.</p>
                    )}
                </div>
            </div>
            
            {/* Results Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Interests Display */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <h2 className="text-xl font-bold mb-4">Results</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                            <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">Simple Interest</h3>
                            <p className="text-2xl font-bold mt-1">{formatIndianCurrency(simpleInterest)}</p>
                            <p className="text-sm mt-1">Total: {formatIndianCurrency(Number(principal) + simpleInterest)}</p>
                        </div>
                        
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                            <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400">Compound Interest</h3>
                            <p className="text-2xl font-bold mt-1">{formatIndianCurrency(compoundInterest)}</p>
                            <p className="text-sm mt-1">Total: {formatIndianCurrency(Number(principal) + compoundInterest)}</p>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <h3 className="font-medium mb-2">Difference</h3>
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <p className="font-medium">
                                {compoundInterest > simpleInterest ? 
                                    `Compound interest earns you ${formatIndianCurrency(compoundInterest - simpleInterest)} more.` :
                                    `Simple interest earns you ${formatIndianCurrency(simpleInterest - compoundInterest)} more.`
                                }
                            </p>
                            <p className="text-sm mt-1 opacity-80">
                                That's {simpleInterest === 0 ? '0' : Math.abs(((compoundInterest - simpleInterest) / simpleInterest) * 100).toFixed(2)}% {compoundInterest > simpleInterest ? 'more' : 'less'} than simple interest.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Graph Display */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Interest Growth Over Time</h2>
                        <div className="flex items-center gap-2">
                            <label className="text-sm mr-2">Size:</label>
                            <select
                                value={graphSize}
                                onChange={(e) => setGraphSize(e.target.value)}
                                className={`h-8 px-2 py-0 rounded-md border text-sm ${
                                    darkMode 
                                        ? 'bg-gray-700 text-white border-gray-600' 
                                        : 'bg-white text-black border-gray-300'
                                } outline-none transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`}
                            >
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                    </div>
                    <div 
                        ref={canvasContainerRef} 
                        className={`w-full transition-all duration-300 relative ${
                            graphSize === 'small' ? 'aspect-[4/2.5]' : 
                            graphSize === 'medium' ? 'aspect-[4/3]' : 
                            'aspect-[4/3.5]'
                        }`}
                    >
                        <canvas 
                            ref={canvasRef}
                            className="w-full h-full"
                        ></canvas>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button 
                            onClick={saveGraphAsImage}
                            className={`text-sm py-1 px-3 ${
                                darkMode 
                                    ? 'bg-blue-600 hover:bg-blue-700' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            {imageDownloaded ? '✓ Saved!' : '📥 Save as Image'}
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Data Table Section */}
            <div className={`mb-8 p-4 rounded-lg overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {timeUnit === 'years' ? 'Yearly Breakdown' : 
                         timeUnit === 'months' ? 'Monthly Breakdown' : 'Daily Breakdown'}
                    </h2>
                    <Button 
                        onClick={saveTableAsCSV}
                        className={`text-sm py-1 px-3 ${
                            darkMode 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {csvDownloaded ? '✓ Saved!' : '📊 Save as CSV'}
                    </Button>
                </div>
                
                <table className={`w-full min-w-[700px] ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <tr>
                            <th className="p-2 text-left">{timeUnit === 'years' ? 'Year' : timeUnit === 'months' ? 'Month' : 'Day'}</th>
                            <th className="p-2 text-right">Simple Interest</th>
                            <th className="p-2 text-right">Simple Total</th>
                            <th className="p-2 text-right">Compound Interest</th>
                            <th className="p-2 text-right">Compound Total</th>
                            <th className="p-2 text-right">Difference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {yearlyData.filter((_, index) => {
                            // Limiting data rows for readability
                            const total = yearlyData.length - 1;
                            return index === 0 || 
                                   index === total || 
                                   index % Math.max(1, Math.floor(total / 10)) === 0;
                        }).map((data) => (
                            <tr key={data.period} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                                <td className="p-2">{data.period}</td>
                                <td className="p-2 text-right text-blue-600 dark:text-blue-400">{formatIndianCurrency(data.simpleInterest)}</td>
                                <td className="p-2 text-right">{formatIndianCurrency(data.simpleAmount)}</td>
                                <td className="p-2 text-right text-purple-600 dark:text-purple-400">{formatIndianCurrency(data.compoundInterest)}</td>
                                <td className="p-2 text-right">{formatIndianCurrency(data.compoundAmount)}</td>
                                <td className={`p-2 text-right ${
                                    data.difference > 0 
                                        ? 'text-green-600 dark:text-green-400' 
                                        : data.difference < 0 
                                            ? 'text-red-600 dark:text-red-400'
                                            : ''
                                }`}>
                                    {data.difference > 0 ? '+' : ''}{formatIndianCurrency(data.difference)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3">
                    <p className="text-sm opacity-70 mb-2 sm:mb-0">
                        Note: Difference = Compound Interest - Simple Interest. Positive values indicate compound interest is higher.
                    </p>
                    <p className="text-sm opacity-70">
                        {csvDownloaded ? 'CSV includes all data points, not just the ones shown above.' : ''}
                    </p>
                </div>
            </div>
            
            {/* Tips Section */}
            <div className="mt-10 text-center text-sm opacity-70">
                <p>Tips: Compound interest generally yields higher returns over longer time periods. The more frequently interest is compounded, the greater the final amount.</p>
            </div>
        </main>
    );
};

export default InterestCalculator;