import React, { useState, useEffect, useRef } from 'react';
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
  Share2, 
  BarChart3, 
  Facebook, 
  Copy, 
  Check, 
  Heart,
  ShoppingCart,
  Fuel,
  Smartphone,
  Coffee,
  Ticket,
  ArrowRight
} from 'lucide-react';

// --- SMOOTH TRANSITION HOOK (Fixes the "Drop to 0" bug) ---
const useSmoothCount = (targetValue, duration = 500) => {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(targetValue);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    startValueRef.current = displayValue;
    startTimeRef.current = null;
    
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Easing function (easeOutQuart) for natural feel
      const ease = 1 - Math.pow(1 - progress, 4);
      
      const nextValue = Math.floor(startValueRef.current + (targetValue - startValueRef.current) * ease);
      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [targetValue, duration]);

  return displayValue;
};

const Calculator = () => {
  const [mode, setMode] = useState('annual'); // 'annual' or 'hourly'
  const [amount, setAmount] = useState(65000); // Standard starting salary
  const [annualSalary, setAnnualSalary] = useState(65000);
  const [inputFocused, setInputFocused] = useState(false);
  const [copied, setCopied] = useState(false);

  // Constants
  const GOVT_GROWTH_RATE = 2.30; // +130%
  const INFLATION_RATE = 1.32;   // +32%
  const HOURS_PER_YEAR = 2080;
  const WA_TAX_RATE = 0.09; 

  // --- LOGIC ---
  useEffect(() => {
    if (mode === 'annual') {
      setAnnualSalary(amount);
    } else {
      setAnnualSalary(amount * HOURS_PER_YEAR);
    }
  }, [amount, mode]);

  const handleAmountChange = (e) => {
    // Remove commas and non-numeric characters (keep decimals if needed, but usually salary is int)
    const rawValue = e.target.value.replace(/,/g, '');
    
    // Handle empty input gracefully (prevent NaN or 0 sticking)
    if (rawValue === '') {
      setAmount(0);
      return;
    }

    const val = parseFloat(rawValue);
    setAmount(isNaN(val) ? 0 : val);
  };

  const handleSliderChange = (e) => {
    setAmount(parseFloat(e.target.value));
  };

  const handleModeToggle = (newMode) => {
    if (newMode === mode) return;
    if (newMode === 'hourly') {
      setAmount(parseFloat((annualSalary / HOURS_PER_YEAR).toFixed(2)));
    } else {
      setAmount(Math.round(annualSalary));
    }
    setMode(newMode);
  };

  // Formatters
  const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatCents = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(val);

  // Calculations
  const taxBurden2015 = annualSalary * WA_TAX_RATE;
  
  // The "Fair" Cost (If gov only grew with inflation)
  const fairCost = taxBurden2015 * INFLATION_RATE;
  
  // The "Actual" Cost (Gov grew 130%)
  const actualCost = taxBurden2015 * GOVT_GROWTH_RATE;
  
  const taxGap = actualCost - fairCost;
  const taxGapHourly = taxGap / HOURS_PER_YEAR;

  // Animated Values for Display (Using new Smooth Hook)
  const animatedTaxGap = useSmoothCount(taxGap, 300);
  const animatedFairCost = useSmoothCount(fairCost, 300);
  const animatedActualCost = useSmoothCount(actualCost, 300);

  // Input Display Logic (Handles formatting for slider vs typing)
  const getInputDisplayValue = () => {
    if (amount === 0) return '';
    if (inputFocused) return amount; // Show raw number while typing
    if (mode === 'hourly') {
      return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return amount.toLocaleString();
  };

  // Sharing
  const getShareText = () => {
    return `The WA State budget grew 130% since 2015. My salary didn't. I'm losing ${formatMoney(taxGap)}/yr in hidden "Excess Spending Costs". See what you lost:`;
  };

  const handleShareX = () => {
    const text = getShareText();
    const url = "https://wa-budget-calc.vercel.app";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=AffordabilityFirst`, '_blank');
  };

  const handleShareFB = () => {
    const url = "https://wa-budget-calc.vercel.app";
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const handleCopy = () => {
    const text = `${getShareText()} https://wa-budget-calc.vercel.app`;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
    document.body.removeChild(textArea);
  };

  // --- BENCHMARKS DATA ---
  // Color Strategy: Villain (Red), Hero (Blue), Context (Slate - BRIGHTENED for visibility)
  const benchmarks = [
    { label: "State Budget Growth", growth: 130, color: "bg-red-600", text: "text-red-500", icon: AlertTriangle, width: "100%" },
    { label: "Health Insurance", growth: 112, color: "bg-slate-500", text: "text-slate-400", icon: Heart, width: "86%" },
    { label: "Housing Prices", growth: 85, color: "bg-slate-500", text: "text-slate-400", icon: Home, width: "65%" },
    { label: "The Economy (GDP)", growth: 65, color: "bg-slate-500", text: "text-slate-400", icon: BarChart3, width: "50%" },
    { label: "Avg. Wages", growth: 45, color: "bg-blue-500", text: "text-blue-400", icon: Briefcase, width: "35%" }, // User Highlight
    { label: "Inflation (CPI)", growth: 32, color: "bg-slate-600", text: "text-slate-500", icon: TrendingUp, width: "25%" },
    { label: "Population", growth: 14, color: "bg-slate-600", text: "text-slate-500", icon: Users, width: "11%" },
  ];

  // Helper to calculate relative thickness
  const getBarHeight = (growth) => {
    if (growth >= 130) return 'h-9'; // Thickest (Villain)
    if (growth >= 100) return 'h-8';
    if (growth >= 80) return 'h-7';
    if (growth >= 60) return 'h-6';
    if (growth >= 40) return 'h-5';
    if (growth >= 20) return 'h-4';
    return 'h-3'; // Thinnest
  };

  // --- OPPORTUNITY COST ITEMS ---
  const opportunityItems = [
    { label: "Tanks of Gas", cost: 65, icon: Fuel, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Weeks of Groceries", cost: 250, icon: ShoppingCart, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Months of Rent", cost: 1800, icon: Home, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  // --- HEADLINES / TILES DATA ---
  const headlines = [
    { icon: Cone, category: "Infrastructure", title: "#1 Worst Potholes", stat: "Ranked Worst in US", desc: "Despite billions in spending, Washington roads are failing commuters daily.", color: "red" },
    { icon: School, category: "Education", title: "Kindergarten Cuts", stat: "-1,816 Slots", desc: "Transition to Kindergarten program slashed from 7,266 to 5,450 slots.", color: "red" },
    { icon: Activity, category: "Healthcare", title: "Nursing Delayed", stat: "-$69.9 Million", desc: "Rate increases for assisted living delayed to 2028. Care for seniors is cut.", color: "red" },
    { icon: Home, category: "Housing", title: "Housing Failure", stat: "6th Worst in US", desc: "Underproduction rate doubled since 2012. We are building fewer homes per capita.", color: "red" },
    { icon: Anchor, category: "Transport", title: "Ferry Crisis", stat: "13 Vessels Aging Out", desc: "Fleet is crumbling. Service disruptions are the new normal.", color: "red" },
    { icon: ShieldAlert, category: "Public Safety", title: "Prisons Overcrowded", stat: "Critical Issues", desc: "Converting units due to overcrowding while early release programs expand.", color: "red" },
    { icon: Users, category: "Bureaucracy", title: "Admin Bloat", stat: "+52% Staff Growth", desc: "University admin staff skyrocketed while student enrollment dropped.", color: "blue" },
    { icon: XCircle, category: "Child Care", title: "Access Denied", stat: "Capped at 33k", desc: "Working Connections Child Care capped. New families turned away.", color: "red" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-2 md:p-6 flex items-center justify-center selection:bg-red-500 selection:text-white">
      
      <div className="max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* HERO HEADER */}
        <div className="bg-gradient-to-br from-red-950 via-slate-900 to-slate-900 p-8 border-b border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
             <AlertTriangle size={300} />
          </div>
          <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 animate-pulse">
              <AlertTriangle size={14} />
              <span>State Spending Crisis</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
              The Cost of <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Runaway Spending</span>
            </h1>
            <p className="text-slate-400 leading-relaxed max-w-2xl text-lg md:text-xl">
              Since 2015, the State Budget has grown by <strong className="text-white">130%</strong>. 
              If your income didn't grow that fast, you are paying the difference.
            </p>
          </div>
        </div>

        {/* INPUT SECTION - GAMIFIED */}
        <div className="p-6 md:p-10 bg-slate-900">
          
          <div className="flex flex-col items-center justify-center mb-16">
             <div className="flex gap-2 mb-6 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => handleModeToggle('annual')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'annual' ? 'bg-slate-800 text-white shadow-lg ring-1 ring-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Annual Salary
              </button>
              <button 
                onClick={() => handleModeToggle('hourly')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'hourly' ? 'bg-slate-800 text-white shadow-lg ring-1 ring-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Hourly Wage
              </button>
            </div>

            <div className="w-full max-w-md">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <DollarSign className={`transition-colors ${inputFocused ? 'text-blue-500' : 'text-slate-600'}`} size={32} />
                </div>
                <input
                  type="text" // Use text to allow formatting
                  inputMode="numeric" // Mobile keyboard optimization
                  value={getInputDisplayValue()} // Use new logic for formatting
                  onChange={handleAmountChange}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="0"
                  className={`w-full bg-slate-950 border-2 rounded-2xl py-6 pl-14 pr-6 text-5xl md:text-6xl font-black text-center text-white transition-all outline-none ${inputFocused ? 'border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.2)]' : 'border-slate-800 hover:border-slate-700'}`}
                />
                <div className="absolute -bottom-8 left-0 right-0 text-center text-slate-500 text-xs uppercase tracking-widest font-bold">
                  Enter your 2015 {mode === 'hourly' ? 'Hourly Rate' : 'Annual Income'}
                </div>
              </div>

              <div className="mt-12 px-2">
                <input 
                  type="range" 
                  min={mode === 'hourly' ? 15 : 30000} 
                  max={mode === 'hourly' ? 100 : 250000} 
                  step={mode === 'hourly' ? 0.5 : 1000}
                  value={amount}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                />
              </div>
            </div>
          </div>

          {/* --- DYNAMIC VISUALIZATION & RECEIPT --- */}
          {/* Removed overflow-hidden to fix tooltip clipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
            
            {/* Left: Dynamic Bar Chart (Replaces Static Leaderboard) */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 md:p-8 relative">
               <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                 <Scale className="text-blue-400"/> Your Real Burden
               </h3>
               
               <div className="flex gap-4 md:gap-8 items-end justify-center h-64 w-full px-4">
                  
                  {/* Bar 1: Inflation (Fair) - MADE THINNER */}
                  <div className="w-full max-w-[80px] flex flex-col justify-end h-full group">
                     <div className="text-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-blue-300 font-bold block">FAIR SHARE</span>
                     </div>
                     <div 
                        className="bg-blue-900/40 border border-blue-500/50 rounded-t-lg w-full relative transition-all duration-300 ease-out"
                        style={{ height: '40%' }} // Fixed visual ratio for comparison
                     >
                       <div className="absolute -top-8 left-0 right-0 text-center text-blue-200 font-mono font-bold">
                         ${animatedFairCost.toLocaleString()}
                       </div>
                       <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-blue-400 font-bold tracking-widest uppercase">
                         Inflation Only
                       </div>
                     </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-slate-600 mb-12">
                     <ArrowRight size={24} />
                  </div>

                  {/* Bar 2: Actual (Govt Growth) - MADE SIGNIFICANTLY THICKER */}
                  <div className="w-full max-w-[160px] flex flex-col justify-end h-full group">
                     <div className="text-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-red-300 font-bold block">ACTUAL COST</span>
                     </div>
                     <div 
                        className="bg-red-900/40 border border-red-500/50 rounded-t-lg w-full relative transition-all duration-300 ease-out shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                        style={{ height: '85%' }} // Fixed visual ratio (130/32 approx)
                     >
                       <div className="absolute -top-8 left-0 right-0 text-center text-red-200 font-mono font-bold text-lg">
                         ${animatedActualCost.toLocaleString()}
                       </div>
                       <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
                         <span className="bg-red-950 text-red-500 text-xs font-bold px-2 py-1 rounded">
                           +130% GROWTH
                         </span>
                       </div>
                       <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-red-400 font-bold tracking-widest uppercase">
                         WA Budget
                       </div>
                     </div>
                  </div>
               </div>
               
               <p className="text-center text-slate-500 text-xs mt-4">
                 Visualizing the gap between fair inflation (+32%) and actual state spending (+130%) on your specific tax burden.
               </p>
            </div>

            {/* Right: Simplified Receipt */}
            <div className="relative transform rotate-1 hover:rotate-0 transition-transform duration-500">
               <div className="bg-slate-100 text-slate-900 p-6 rounded-t-lg shadow-2xl relative font-mono text-sm max-w-sm mx-auto">
                  
                  {/* Jagged Bottom Edge */}
                  <div className="absolute top-full left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMiAxMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMGw2IDEwIDYtMTB2MTBIMHoiIGZpbGw9IiNmMTcyYTciLz48L3N2Zz4=')] bg-repeat-x bg-[length:12px_12px] text-slate-100 fill-current"></div>
                  
                  <div className="text-center border-b-2 border-slate-800 border-dashed pb-4 mb-4">
                    <div className="text-xl font-black uppercase tracking-widest text-slate-900">OVERPAYMENT NOTICE</div>
                    <div className="text-xs text-slate-500">{new Date().toLocaleDateString()}</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-600 text-xs font-bold">ACTUAL COST</span>
                      <span className="font-bold text-lg">{formatMoney(actualCost)}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-600 text-xs font-bold">LESS: FAIR SHARE</span>
                      <span className="text-slate-500 text-lg">-{formatMoney(fairCost)}</span>
                    </div>
                  </div>

                  <div className="border-t-4 border-slate-900 pt-4 mb-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-red-100 opacity-50"></div>
                    <div className="flex justify-between items-center relative z-10">
                      <span className="font-black text-red-700 uppercase text-xs w-1/2">YOU OVERPAID</span>
                      <span className="font-black text-3xl text-red-600">${animatedTaxGap.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                     <p className="text-[10px] text-slate-500 leading-tight mb-4">
                       This amount represents the "Excess Spending Cost" hidden in your cost of living due to state spending outpacing inflation.
                     </p>
                     <span className="text-[9px] text-slate-400">DO NOT PAY - ALREADY DEDUCTED</span>
                  </div>
               </div>
            </div>

          </div>

          {/* --- CONTEXT LEADERBOARD (Moved Down) --- */}
          <div className="mb-16 border-t border-slate-800 pt-12">
               <div className="mb-8">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                   <BarChart3 className="text-slate-400" /> The Race to the Bottom
                 </h3>
                 <p className="text-slate-400 text-sm mt-1">Comparing 10-year growth rates. The state is "winning" in the worst way.</p>
               </div>

               <div className="space-y-3">
                  {benchmarks.map((item, idx) => {
                    const heightClass = getBarHeight(item.growth);
                    const fontSize = item.growth >= 100 ? "text-sm" : "text-xs";
                    
                    return (
                      <div key={idx} className="relative">
                        <div className={`flex justify-between ${fontSize} font-bold uppercase tracking-wider mb-1 px-1`}>
                          <span className={`flex items-center gap-2 ${item.text}`}>
                            <item.icon size={item.growth >= 100 ? 18 : 14} /> {item.label}
                          </span>
                          <span className="text-slate-300">+{item.growth}%</span>
                        </div>
                        <div className={`${heightClass} bg-slate-900 rounded-full overflow-hidden relative border border-slate-800`}>
                          <div 
                            className={`absolute top-0 left-0 h-full ${item.color} transition-all duration-1000 ease-out`}
                            style={{ width: item.width }}
                          >
                          </div>
                        </div>
                      </div>
                    );
                  })}
               </div>
          </div>

          {/* --- OPPORTUNITY COST (THE "WHAT YOU LOST" SECTION) --- */}
          <div className="mb-16">
            <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
              <ShoppingCart size={20} className="text-green-400" />
              What could you have bought instead?
            </h3>
            
            <div className="flex flex-wrap justify-center gap-4">
              {opportunityItems.map((item, idx) => {
                const quantity = Math.floor(taxGap / item.cost);
                return (
                  <div key={idx} className={`${item.bg} border border-slate-800 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-200 w-full sm:w-64`}>
                    <div className={`mx-auto w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-3 ${item.color}`}>
                      <item.icon size={24} />
                    </div>
                    <div className="text-3xl font-black text-white mb-1">{quantity}</div>
                    <div className="text-xs uppercase font-bold text-slate-400">{item.label}</div>
                    <div className="text-[10px] text-slate-500 mt-1">(@ ${item.cost}/ea)</div>
                  </div>
                )
              })}
            </div>
            <p className="text-center text-slate-500 text-sm mt-4 italic">
              *Based on annual loss of {formatMoney(taxGap)}
            </p>
          </div>

          {/* HEADLINES WALL OF SHAME - FIXED HOVER JITTER */}
          <div className="border-t border-slate-800 pt-10 pb-10">
             <div className="text-center mb-10">
               <h3 className="text-3xl font-bold text-white">What did you get for that money?</h3>
               <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
                 The state budget more than doubled. Did your services improve? Or did they just get more expensive?
               </p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                {headlines.map((item, idx) => (
                  // Wrapper div to prevent hover jitter (keeps hit area stable)
                  <div key={idx} className="group relative">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] group-hover:border-red-500/50 cursor-default h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className={`flex items-center gap-2 font-bold mb-3 text-xs uppercase tracking-wider ${item.color === 'blue' ? 'text-blue-400' : 'text-red-400'}`}>
                            <div className={`p-2 rounded-lg ${item.color === 'blue' ? 'bg-blue-950' : 'bg-red-950'}`}>
                              <item.icon size={18}/> 
                            </div>
                            {item.category}
                          </div>
                          <h4 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-red-200 transition-colors">{item.title}</h4>
                          <div className={`inline-block px-2 py-1 rounded text-xs font-bold mb-3 ${item.color === 'blue' ? 'bg-blue-900/50 text-blue-200' : 'bg-red-900/50 text-red-200'}`}>
                            {item.stat}
                          </div>
                          <p className="text-slate-400 text-sm leading-snug group-hover:text-slate-300 transition-colors">{item.desc}</p>
                        </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* ACTIONS */}
          <div className="bg-slate-950 rounded-2xl p-8 text-center border border-slate-800">
             <h3 className="text-white font-bold text-lg mb-6">Share your Runaway WA State Spending Receipt</h3>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                <button 
                  onClick={handleShareX}
                  className="flex-1 max-w-xs flex items-center justify-center gap-2 bg-slate-900 text-white border border-slate-700 hover:bg-black hover:border-slate-500 py-4 px-6 rounded-xl font-bold transition-all"
                >
                  <Share2 size={20} /> Post on X
                </button>
                <button 
                  onClick={handleShareFB}
                  className="flex-1 max-w-xs flex items-center justify-center gap-2 bg-blue-900 text-white border border-blue-800 hover:bg-blue-800 hover:border-blue-600 py-4 px-6 rounded-xl font-bold transition-all"
                >
                  <Facebook size={20} /> Share on FB
                </button>
                <button 
                  onClick={handleCopy}
                  className="flex-1 max-w-xs flex items-center justify-center gap-2 bg-slate-800 text-white hover:bg-slate-700 py-4 px-6 rounded-xl font-bold transition-all border border-slate-700"
                >
                  {copied ? <Check size={20} className="text-green-400"/> : <Copy size={20} />}
                  {copied ? "Copied!" : "Copy Receipt"}
                </button>
             </div>
             <button 
                onClick={() => {
                  setAmount(65000);
                  setMode('annual');
                  window.scrollTo({top: 0, behavior: 'smooth'});
                }}
                className="mt-6 text-slate-500 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <RefreshCw size={14}/> Reset Calculator
              </button>
          </div>
          
          <div className="text-center mt-8 pb-2 text-xs text-slate-600 opacity-50 uppercase tracking-widest font-bold">
            Paid for by Vote Penner
          </div>

        </div>
      </div>
    </div>
  );
};

export default Calculator;
