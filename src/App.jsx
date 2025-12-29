import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Info,
  RefreshCw,
  Clock,
  Briefcase,
  School,
  Activity,
  Cone,
  Users,
  Home,
  Anchor,
  ShieldAlert,
  XCircle,
  Scale,
  ArrowRight,
  Share2,
  BarChart3,
  Facebook,
  Copy,
  Check,
  Heart
} from 'lucide-react';

const Calculator = () => {
  const [mode, setMode] = useState('annual'); // 'annual' or 'hourly'
  const [amount, setAmount] = useState(50000); // Stores the raw input value
  const [annualSalary, setAnnualSalary] = useState(50000); // Always stores the computed annual
  const [inputFocused, setInputFocused] = useState(false);
  const [copied, setCopied] = useState(false);

  // Constants based on the thesis & economic data (2015-2025 approx)
  const GOVT_GROWTH_RATE = 2.30; // +130%
  const INFLATION_RATE = 1.32;   // +32% (CPI)
  const POPULATION_RATE = 1.14;  // +14% (Approx WA Pop Growth)
  const WAGE_RATE = 1.45;        // +45% (Median Wage Growth)
  const ECONOMY_RATE = 1.65;     // +65% (Approx GDP Growth - Thesis: Govt grew 2x economy)
  const HOUSING_RATE = 1.85;     // +85% (Avg Home Price Index)
  const INSURANCE_RATE = 2.12;   // +112% (Health Insurance Exchange Premium Growth)
  
  const WA_TAX_RATE = 0.09;      // Approx 9% effective state/local tax burden
  const HOURS_PER_YEAR = 2080;

  // Sync annual salary when input changes
  useEffect(() => {
    if (mode === 'annual') {
      setAnnualSalary(amount);
    } else {
      setAnnualSalary(amount * HOURS_PER_YEAR);
    }
  }, [amount, mode]);

  const handleAmountChange = (e) => {
    const val = parseFloat(e.target.value);
    setAmount(isNaN(val) ? 0 : val);
  };

  const handleModeToggle = (newMode) => {
    if (newMode === mode) return;
    if (newMode === 'hourly') {
      setAmount((annualSalary / HOURS_PER_YEAR).toFixed(2));
    } else {
      setAmount(Math.round(annualSalary));
    }
    setMode(newMode);
  };

  const formatMoney = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatCents = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(val);
  };

  // Calculated Values
  const govtSalary = annualSalary * GOVT_GROWTH_RATE;
  const inflationSalary = annualSalary * INFLATION_RATE;
  
  // Tax Calculations
  const taxBurden2015 = annualSalary * WA_TAX_RATE;
  const taxBurdenInflation = taxBurden2015 * INFLATION_RATE;
  const taxBurdenGovtGrowth = taxBurden2015 * GOVT_GROWTH_RATE;
  
  // The "Hidden Liability" Gap
  const taxGap = taxBurdenGovtGrowth - taxBurdenInflation;
  const taxGapHourly = taxGap / HOURS_PER_YEAR;
  const taxGapMonthly = taxGap / 12;

  // Helper to capitalize mode
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // Benchmarks Array
  const benchmarks = [
    {
      label: "Inflation (CPI)",
      growth: "+32%",
      rate: INFLATION_RATE,
      icon: TrendingUp,
      colorClass: "text-slate-400"
    },
    {
      label: "Population",
      growth: "+14%",
      rate: POPULATION_RATE,
      icon: Users,
      colorClass: "text-slate-400"
    },
    {
      label: "Avg. Wages",
      growth: "+45%",
      rate: WAGE_RATE,
      icon: Briefcase,
      colorClass: "text-blue-400"
    },
    {
      label: "Health Insurance",
      growth: "+112%",
      rate: INSURANCE_RATE,
      icon: Heart,
      colorClass: "text-red-400"
    },
    {
      label: "The Economy",
      growth: "+65%",
      rate: ECONOMY_RATE,
      icon: BarChart3,
      colorClass: "text-green-400"
    },
    {
      label: "Housing Prices",
      growth: "+85%",
      rate: HOUSING_RATE,
      icon: Home,
      colorClass: "text-orange-400"
    }
  ];

  // Sharing Logic
  const getShareText = () => {
    const growthDiff = govtSalary - (annualSalary * WAGE_RATE); // Defaulting to wage difference
    return `I just checked. The WA State Budget grew ${formatMoney(growthDiff)} faster than my salary. I'm paying ${formatCents(taxGapHourly)}/hr in 'Bloat Tax'. Check your cost here:`;
  };

  const handleShareX = () => {
    const text = getShareText();
    const url = "https://YourWebsite.com";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=AffordabilityFirst`, '_blank');
  };

  const handleShareFB = () => {
    const url = "https://YourWebsite.com";
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const handleCopy = () => {
    const text = `${getShareText()} https://YourWebsite.com`;
    
    // Create a temporary text area element to use execCommand
    // This is more robust in iframe environments than navigator.clipboard
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Ensure it's not visible but part of the DOM
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
         console.error('Copy command failed.');
      }
    } catch (err) {
      console.error('Unable to copy', err);
    }
    
    document.body.removeChild(textArea);
  };

  // Headline Data (from PDF/Thesis)
  const headlines = [
    {
      icon: Cone,
      category: "Infrastructure",
      title: "#1 Worst Potholes",
      stat: "Ranked Worst in US",
      desc: "Despite billions in spending, Washington roads are failing commuters daily.",
      color: "red"
    },
    {
      icon: School,
      category: "Education",
      title: "Kindergarten Cuts",
      stat: "-1,816 Slots",
      desc: "Transition to Kindergarten program slashed from 7,266 to 5,450 slots.",
      color: "red"
    },
    {
      icon: Activity,
      category: "Healthcare",
      title: "Nursing Delayed",
      stat: "-$69.9 Million",
      desc: "Rate increases for assisted living delayed to 2028. Care for seniors is cut.",
      color: "red"
    },
    {
      icon: Home,
      category: "Housing",
      title: "Housing Failure",
      stat: "6th Worst in US",
      desc: "Underproduction rate doubled since 2012. We are building fewer homes per capita.",
      color: "red"
    },
    {
      icon: Anchor,
      category: "Transport",
      title: "Ferry Crisis",
      stat: "13 Vessels Aging Out",
      desc: "Fleet is crumbling. Service disruptions are the new normal.",
      color: "red"
    },
    {
      icon: ShieldAlert,
      category: "Public Safety",
      title: "Prisons Overcrowded",
      stat: "Critical Issues",
      desc: "Converting units due to overcrowding while early release programs expand.",
      color: "red"
    },
     {
      icon: Users,
      category: "Bureaucracy",
      title: "Admin Bloat",
      stat: "+52% Staff Growth",
      desc: "University admin staff skyrocketed while student enrollment dropped.",
      color: "blue"
    },
     {
      icon: XCircle,
      category: "Child Care",
      title: "Access Denied",
      stat: "Capped at 33k",
      desc: "Working Connections Child Care capped. New families turned away.",
      color: "red"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 flex items-center justify-center">
      
      <div className="max-w-7xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900/40 to-slate-900 p-8 border-b border-slate-800">
          <div className="flex items-center gap-2 text-red-400 font-mono text-sm uppercase tracking-widest mb-3">
            <AlertTriangle size={16} />
            <span>The 130% Reality Check</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            The Cost of Addiction
          </h1>
          <p className="text-slate-400 leading-relaxed max-w-2xl text-lg">
            Since 2015, the State Operating Budget has grown by roughly <strong>130%</strong>. 
            Enter your 2015 income to see just how far "out of touch" that spending really is.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="p-6 md:p-8 bg-slate-900/50">
          
          {/* Controls */}
          <div className="flex flex-col items-center justify-center mb-10">
             <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 inline-flex mb-6">
              <button 
                onClick={() => handleModeToggle('annual')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'annual' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Briefcase size={16} /> Annual Salary
              </button>
              <button 
                onClick={() => handleModeToggle('hourly')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'hourly' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Clock size={16} /> Hourly Wage
              </button>
            </div>

            <div className="relative w-full max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="text-slate-500" size={24} />
              </div>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className={`w-full bg-slate-950 border-2 rounded-xl py-4 pl-12 pr-4 text-4xl font-bold text-center text-white transition-all outline-none ${inputFocused ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-slate-800'}`}
              />
              <div className="text-center text-slate-500 text-xs mt-2 uppercase tracking-widest font-bold">
                Enter your 2015 {mode === 'hourly' ? 'Hourly Rate' : 'Annual Income'}
              </div>
            </div>
          </div>

          {/* --- THE GROWTH GAP VISUALIZATION --- */}
          <div className="mb-16 space-y-6">
            <h3 className="text-white font-bold flex items-center gap-2 border-b border-slate-800 pb-2">
                <TrendingUp size={18} className="text-blue-400"/>
                The Growth Gap: Your Wallet vs. The State
            </h3>
            
            {/* Bar 1: 2015 Baseline */}
            <div className="relative">
                <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Your 2015 Baseline</span>
                <span className="text-white font-mono">{formatMoney(annualSalary)}</span>
                </div>
                <div className="h-10 bg-slate-800 rounded-md relative overflow-hidden w-full">
                <div className="absolute top-0 left-0 h-full bg-slate-600 w-[43%]"></div>
                 <div className="absolute inset-0 flex items-center pl-4 text-xs text-slate-400 opacity-50 font-mono">
                    BASELINE
                    </div>
                </div>
            </div>

            {/* Bar 2: Inflation */}
            <div className="relative opacity-75">
                <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 flex items-center gap-1">
                    If You Kept Up With Inflation <Info size={12}/>
                </span>
                <span className="text-white font-mono">{formatMoney(inflationSalary)}</span>
                </div>
                <div className="h-10 bg-slate-800 rounded-md relative overflow-hidden w-full">
                <div 
                    className="absolute top-0 left-0 h-full bg-blue-900/50 border-r-2 border-blue-500/50 transition-all duration-500"
                    style={{ width: '57%' }} 
                ></div>
                <div className="absolute inset-0 flex items-center pl-3 text-[10px] text-blue-300 font-mono tracking-widest">
                    +32% CPI INFLATION
                </div>
                </div>
            </div>

            {/* Bar 3: Govt Growth */}
            <div className="relative">
                <div className="flex justify-between text-sm mb-2">
                <span className="text-red-400 font-bold">If You Grew Like The State Budget</span>
                <span className="text-red-400 font-mono font-bold">{formatMoney(govtSalary)}</span>
                </div>
                <div className="h-14 bg-slate-800 rounded-md relative overflow-hidden w-full border border-red-900/30 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
                <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
                    style={{ width: '100%' }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-between px-3">
                    <span className="text-white font-bold text-xs tracking-wider">
                    +130% GROWTH
                    </span>
                    <span className="text-red-100 font-mono text-sm bg-red-900/30 px-2 py-1 rounded">
                        {formatMoney(govtSalary)}/yr
                    </span>
                </div>
                </div>
            </div>
         </div>

         {/* --- THE JUSTIFICATION GAP (Alternative Timelines) --- */}
         <div className="mb-16">
            <h3 className="text-white font-bold flex items-center gap-2 border-b border-slate-800 pb-2 mb-6">
                <Scale size={18} className="text-purple-400"/>
                The Justification Gap: What benchmark does the state use to justify its massive growth?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benchmarks.map((item, idx) => {
                    const benchSalary = annualSalary * item.rate;
                    const diff = govtSalary - benchSalary;
                    const isPositive = diff > 0;
                    
                    return (
                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`bg-slate-800 p-2 rounded-lg ${item.colorClass}`}>
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Benchmark</div>
                                    <div className="text-white font-bold">{item.label} ({item.growth})</div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col mb-4 text-sm">
                                <div className="text-slate-400 mb-1">If your {capitalize(mode)} salary grew at this pace:</div>
                                <div className="text-white font-mono font-bold text-lg">{formatMoney(benchSalary)}</div>
                            </div>

                            <div className={`rounded-lg p-3 border ${isPositive ? 'bg-red-950/20 border-red-900/30' : 'bg-green-950/20 border-green-900/30'}`}>
                                <div className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${isPositive ? 'text-red-400' : 'text-green-400'}`}>
                                    {isPositive ? 'The state would have beat you by' : 'The state fell short by'}
                                </div>
                                <div className={`text-xl font-mono font-bold ${isPositive ? 'text-red-400' : 'text-green-400'}`}>
                                    {formatMoney(Math.abs(diff))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
         </div>

          {/* --- THE HIDDEN LIABILITY SECTION --- */}
          <div className="mb-16">
            <div className="bg-gradient-to-b from-red-950/40 to-slate-900 border border-red-500/30 rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
              
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  
                  {/* Left: The Concept */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                      <AlertTriangle size={14} /> The Hidden Liability
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Your "Bloat Tax"</h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      You don't have an income tax <em>yet</em>, but you are already paying this.
                      This is the cost buried in property taxes, fees, fines, and usage taxes just to fund the 
                      government's 130% growth.
                    </p>
                    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800 inline-block text-left">
                      <div className="text-xs text-slate-500 mb-1">Annual Excess Burden</div>
                      <div className="text-2xl font-mono font-bold text-red-400">{formatMoney(taxGap)} / yr</div>
                    </div>
                  </div>

                  {/* Right: The Hourly Reality */}
                  <div className="flex-1 w-full">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-red-500/50 transition-colors">
                      <div className="absolute -right-6 -top-6 text-slate-800 opacity-50 group-hover:text-red-900/20 transition-colors">
                        <Clock size={140} />
                      </div>
                      
                      <div className="relative z-10 text-center">
                        <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">
                          You pay this every hour you work
                        </div>
                        <div className="text-5xl md:text-6xl font-mono font-bold text-white mb-4 drop-shadow-lg">
                          {formatCents(taxGapHourly)}
                          <span className="text-lg text-slate-500 ml-1">/hr</span>
                        </div>
                        
                        <div className="bg-red-950/40 border border-red-500/20 rounded-lg p-3 text-sm text-red-200 leading-snug mx-auto max-w-sm">
                            You pay this much <strong>now</strong> just to fund the growth in government these last 10 years. 
                            Why should the state implement an Income Tax when they've already taken this from you in property taxes, fees, fines, and usage taxes?
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-slate-500 text-xs">Monthly Cost</span>
                            <span className="block text-white font-mono">{formatMoney(taxGapMonthly)}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 text-xs">Lifetime (30yr)</span>
                            <span className="block text-white font-mono">{formatMoney(taxGap * 30)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* --- HEADLINES GRID --- */}
          <div className="border-t border-slate-800 pt-10">
             <div className="text-center mb-10">
               <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Where Did The Money Go?</h3>
               <p className="text-slate-400 max-w-2xl mx-auto">
                 The state beat your wage growth by <strong>~3x (130% vs 45%)</strong> — and these are the results. 
                 Why should they get more?
               </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {headlines.map((item, idx) => (
                 <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:bg-slate-800/50 hover:border-slate-700 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                     <div className={`p-2 rounded-lg ${item.color === 'red' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                       <item.icon size={20} />
                     </div>
                     <div className={`text-xs font-bold px-2 py-1 rounded ${item.color === 'red' ? 'bg-red-950 text-red-400' : 'bg-blue-950 text-blue-400'}`}>
                       {item.stat}
                     </div>
                   </div>
                   <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">{item.category}</div>
                   <h4 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-red-200 transition-colors">
                     {item.title}
                   </h4>
                   <p className="text-sm text-slate-400 leading-snug">
                     {item.desc}
                   </p>
                 </div>
               ))}
             </div>
          </div>

          {/* Reset Button */}
          <div className="text-center pt-12 pb-4">
             <button 
                onClick={() => {
                  setAmount(50000);
                  setMode('annual');
                  setCopied(false);
                }}
                className="text-slate-500 text-sm flex items-center justify-center gap-2 hover:text-white transition-colors mx-auto mb-6"
              >
               <RefreshCw size={14} /> Reset Calculator
             </button>

             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button 
                  onClick={handleShareX}
                  className="flex-1 max-w-xs flex items-center justify-center gap-2 text-white bg-slate-800 hover:bg-black transition-colors border border-slate-700 hover:border-slate-500 px-6 py-3 rounded-lg font-bold"
               >
                  <Share2 size={18} /> Share on X
               </button>
               
               <button 
                  onClick={handleShareFB}
                  className="flex-1 max-w-xs flex items-center justify-center gap-2 text-white bg-blue-900 hover:bg-blue-800 transition-colors border border-blue-800 hover:border-blue-600 px-6 py-3 rounded-lg font-bold"
               >
                  <Facebook size={18} /> Share on FB
               </button>

               <button 
                  onClick={handleCopy}
                  className="flex-1 max-w-xs flex items-center justify-center gap-2 text-white bg-green-900 hover:bg-green-800 transition-colors border border-green-800 hover:border-green-600 px-6 py-3 rounded-lg font-bold"
               >
                  {copied ? <Check size={18} /> : <Copy size={18} />} 
                  {copied ? "Copied!" : "Copy Receipt"}
               </button>
             </div>
             <p className="text-xs text-slate-500 mt-4">
                *Facebook does not allow pre-filled text. Use "Copy Receipt" to paste your results manually.
             </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-6 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm mb-4">
            *Estimates based on ~9% effective state/local tax burden and budget growth relative to CPI inflation.
          </p>
          <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-10 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all transform hover:scale-105 w-full md:w-auto text-lg">
            Stop The Bleeding. Demand Reform.
          </button>
        </div>

      </div>
    </div>
  );
};

export default Calculator;
