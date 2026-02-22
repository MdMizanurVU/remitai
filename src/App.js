import React, { useState, useMemo, useEffect } from "react";
import { TrendingUp, RefreshCw, ExternalLink, Zap } from "lucide-react";

// Mock data for providers with receiver-type specific speeds
const INITIAL_PROVIDERS = [
  {
    id: "taptap",
    name: "Taptap Send",
    logo: "TT",
    rate: 85.97,
    fee: 0,
    minimumAmount: 1, // AUD
    speeds: {
      bank: "1-2 Hours",
      bkash: "Instant",
      nagad: "Instant",
    },
    links: {
      bank: "https://www.taptapsend.com/en-gb",
      bkash: "https://www.taptapsend.com/en-gb",
      nagad: "https://www.taptapsend.com/en-gb",
    },
    color: "bg-indigo-600",
  },
  {
    id: "remitly",
    name: "Remitly",
    logo: "RY",
    rate: 85.9,
    fee: 2.99,
    minimumAmount: 15, // AUD
    speeds: {
      bank: "30 Minutes",
      bkash: "Minutes",
      nagad: "Minutes",
    },
    links: {
      bank: "https://www.remitly.com/us/en/australia/bangladesh",
      bkash: "https://www.remitly.com/us/en/australia/bangladesh/bkash",
      nagad: "https://www.remitly.com/us/en/australia/bangladesh/nagad",
    },
    color: "bg-blue-500",
  },
  {
    id: "wise",
    name: "Wise",
    logo: "WS",
    rate: 86.25,
    fee: 4.5,
    minimumAmount: 1, // AUD
    speeds: {
      bank: "Seconds",
      bkash: "Not Available",
      nagad: "Not Available",
    },
    links: {
      bank: "https://wise.com/send-money/send-money-from-australia-to-bangladesh",
      bkash: "https://wise.com/",
      nagad: "https://wise.com/",
    },
    color: "bg-green-500",
  },
  {
    id: "moneygram",
    name: "MoneyGram",
    logo: "MG",
    rate: 84.8,
    fee: 0.99,
    minimumAmount: 10, // AUD
    speeds: {
      bank: "2-4 Hours",
      bkash: "1 Hour",
      nagad: "1 Hour",
    },
    links: {
      bank: "https://www.moneygram.com/mgo/us/en/send/how-to-send-money/online/australia/bangladesh",
      bkash:
        "https://www.moneygram.com/mgo/us/en/send/how-to-send-money/online/australia/bangladesh/bkash",
      nagad:
        "https://www.moneygram.com/mgo/us/en/send/how-to-send-money/online/australia/bangladesh/nagad",
    },
    color: "bg-red-600",
  },
  {
    id: "ria",
    name: "Ria Money",
    logo: "RI",
    rate: 85.1,
    fee: 1.99,
    minimumAmount: 5, // AUD
    speeds: {
      bank: "1-3 Hours",
      bkash: "Instant",
      nagad: "Instant",
    },
    links: {
      bank: "https://www.riamoneytransfer.com/en-au/australia/bangladesh",
      bkash:
        "https://www.riamoneytransfer.com/en-au/australia/bangladesh/bkash",
      nagad:
        "https://www.riamoneytransfer.com/en-au/australia/bangladesh/nagad",
    },
    color: "bg-orange-500",
  },
];

// Live Data Integration Functions
const EXCHANGE_RATE_API = "https://api.exchangerate-api.com/v4/latest/AUD";

// Function to fetch live exchange rates
const fetchLiveExchangeRates = async () => {
  try {
    const response = await fetch(EXCHANGE_RATE_API);
    const data = await response.json();
    return data.rates.BDT; // Get AUD to BDT rate
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    return null;
  }
};

// Function to simulate provider-specific rates (each provider has different margins)
const updateProvidersWithLiveRates = (baseRate, providers) => {
  const providerMargins = {
    taptap: 0.995, // Best rate (0.5% margin)
    wise: 0.99, // 1% margin
    ria: 0.985, // 1.5% margin
    remitly: 0.983, // 1.7% margin
    moneygram: 0.98, // 2% margin
  };

  return providers.map((provider) => ({
    ...provider,
    rate: baseRate * (providerMargins[provider.id] || 0.98),
    lastUpdated: new Date().toISOString(),
  }));
};

// Function to integrate with Wise API (requires API key)
const fetchWiseRate = async () => {
  // This is a simplified example - actual Wise API requires authentication
  try {
    // const response = await fetch('https://api.transferwise.com/v1/rates', {
    //   headers: {
    //     'Authorization': 'Bearer YOUR_API_KEY'
    //   }
    // });
    // For demo, we'll simulate a response
    return {
      rate: 86.25,
      fee: 4.5,
      estimatedDelivery: "Seconds",
    };
  } catch (error) {
    console.error("Failed to fetch Wise rate:", error);
    return null;
  }
};

// Function to integrate with Remitly API (hypothetical - requires partnership)
const fetchRemitlyRate = async (amount, receiverType) => {
  try {
    // This would be the actual Remitly API endpoint
    // const response = await fetch(`https://api.remitly.com/v1/quote`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer YOUR_REMITLY_API_KEY'
    //   },
    //   body: JSON.stringify({
    //     sendAmount: amount,
    //     sendCurrency: 'AUD',
    //     receiveCurrency: 'BDT',
    //     deliveryMethod: receiverType,
    //     sourceCountry: 'AU',
    //     destinationCountry: 'BD'
    //   })
    // });

    // Simulated response for demo
    return {
      rate: 85.9,
      fee: 2.99,
      estimatedDelivery: receiverType === "bank" ? "30 Minutes" : "Minutes",
      minimumAmount: 15,
    };
  } catch (error) {
    console.error("Failed to fetch Remitly rate:", error);
    return null;
  }
};

// Function to scrape rates (example with a hypothetical scraper)
const scrapeProviderRates = async () => {
  try {
    // This would use a web scraping service or your own scraper
    // const response = await fetch('/api/scrape-rates'); // Your backend endpoint

    // Simulated scraped data
    return {
      taptap: { rate: 86.5, fee: 0, lastScraped: new Date().toISOString() },
      wise: { rate: 86.25, fee: 4.5, lastScraped: new Date().toISOString() },
      remitly: { rate: 85.9, fee: 2.99, lastScraped: new Date().toISOString() },
    };
  } catch (error) {
    console.error("Failed to scrape rates:", error);
    return null;
  }
};

const RECEIVER_TYPES = [
  {
    value: "bank",
    label: "Bank Account",
  },
  {
    value: "bkash",
    label: "bKash",
  },
  {
    value: "nagad",
    label: "Nagad",
  },
];

const App = () => {
  const [amount, setAmount] = useState(1000);
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [includeIncentive, setIncludeIncentive] = useState(false);
  const [receiverType, setReceiverType] = useState("bank");

  // Function to refresh rates using live data
  const refreshRates = async () => {
    setLoading(true);
    try {
      // Method 1: Fetch live exchange rate and apply provider margins
      const baseRate = await fetchLiveExchangeRates();
      if (baseRate) {
        const updatedProviders = updateProvidersWithLiveRates(
          baseRate,
          INITIAL_PROVIDERS,
        );
        setProviders(updatedProviders);
        setLastUpdated(new Date().toISOString());
      }

      // Method 2: Fetch individual provider rates (if APIs are available)
      // const wiseData = await fetchWiseRate();
      // const remitlyData = await fetchRemitlyRate(amount, receiverType);

      // Method 3: Use scraped data
      // const scrapedData = await scrapeProviderRates();
    } catch (error) {
      console.error("Failed to refresh rates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh rates every 5 minutes
  useEffect(() => {
    refreshRates(); // Initial load

    const interval = setInterval(
      () => {
        refreshRates();
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Refresh when receiver type or amount changes (for provider-specific rates)
  useEffect(() => {
    // Optional: Refresh rates when parameters change
    // refreshRates();
  }, [receiverType, amount]);

  const sortedProviders = useMemo(() => {
    return [...providers]
      .filter((provider) => amount >= provider.minimumAmount) // Filter by minimum amount
      .sort((a, b) => b.rate - a.rate);
  }, [providers, amount]);

  const calculateRecipientGets = (provider) => {
    const baseAmount = amount * provider.rate;
    const incentive = includeIncentive ? baseAmount * 0.025 : 0;
    return (baseAmount + incentive).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  const calculateTotalCost = (provider) => {
    return (amount + provider.fee).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              RemitRate<span className="text-indigo-600">.io</span>
            </span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button className="hover:text-indigo-600 transition-colors">
              Compare
            </button>
            <button className="hover:text-indigo-600 transition-colors">
              How it works
            </button>
            <button className="hover:text-indigo-600 transition-colors">
              App Download
            </button>
          </div>
          <button className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-100 transition-colors">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white pt-12 pb-20 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-6 animate-pulse">
            <Zap className="w-3 h-3 fill-current" />
            LIVE MARKET RATES
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Send more home for <br />
            <span className="text-indigo-600">every dollar you earn.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Compare exchange rates, transfer fees, and total costs from
            Australia's top remittance providers in real-time.
          </p>

          {/* Main Calculator Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto relative overflow-hidden">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  You Send (AUD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl py-4 pl-8 pr-4 text-2xl font-bold outline-none transition-all"
                  />
                </div>
              </div>
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Receiver Type
                </label>
                <div className="relative">
                  <select
                    value={receiverType}
                    onChange={(e) => setReceiverType(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl py-4 px-4 text-lg font-bold outline-none transition-all appearance-none cursor-pointer"
                  >
                    {RECEIVER_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Recipient Gets
                </label>
                <div className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-4 flex items-center justify-between">
                  <span className="text-2xl font-bold">BDT</span>
                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-slate-200">
                    <img
                      src="https://flagcdn.com/w40/bd.png"
                      alt="BD"
                      className="w-5 h-3 shadow-sm"
                    />
                    <span className="font-bold text-sm">Bangladesh</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div
                  className="relative inline-flex items-center cursor-pointer"
                  onClick={() => setIncludeIncentive(!includeIncentive)}
                >
                  <div
                    className={`w-11 h-6 rounded-full transition-colors duration-200 ${includeIncentive ? "bg-indigo-600" : "bg-slate-200"}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${includeIncentive ? "translate-x-5" : "translate-x-0.5"} mt-0.5`}
                    ></div>
                  </div>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={includeIncentive}
                    onChange={() => setIncludeIncentive(!includeIncentive)}
                  />
                </div>
                <span
                  className="text-sm font-medium text-slate-700 cursor-pointer"
                  onClick={() => setIncludeIncentive(!includeIncentive)}
                >
                  Include 2.5% Gov Incentive
                </span>
              </div>

              <button
                onClick={refreshRates}
                disabled={loading}
                className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                {loading
                  ? "Fetching Live Rates..."
                  : lastUpdated
                    ? `Live: ${new Date(lastUpdated).toLocaleTimeString()}`
                    : "Click to Load Live Rates"}
              </button>
              {lastUpdated && (
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live Data Active
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Live Rate Comparison</h2>
            <p className="text-slate-500 text-sm">
              Real-time breakdown of fees and total costs
            </p>
          </div>
          <div className="hidden lg:block text-right">
            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
              Best Exchange Rate:
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
              {sortedProviders[0].rate.toFixed(2)} BDT / 1 AUD
            </span>
          </div>
        </div>

        {/* Show filtered providers message */}
        {providers.length > sortedProviders.length && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <span className="text-yellow-800 text-sm font-medium">
                {providers.length - sortedProviders.length} provider(s) filtered
                out due to minimum amount requirements.
                {amount < 15 &&
                  " Try increasing your send amount to see more options."}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {sortedProviders.map((provider, index) => (
            <div
              key={provider.id}
              className={`group bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                index === 0
                  ? "border-indigo-500 shadow-xl shadow-indigo-100"
                  : "border-slate-100 hover:border-indigo-200"
              }`}
            >
              {index === 0 && (
                <div className="bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest text-center py-1 flex items-center justify-center gap-2">
                  <Zap className="w-3 h-3 fill-current" /> BEST VALUE TRANSFER
                </div>
              )}
              <div className="p-5 grid grid-cols-1 md:grid-cols-12 items-center gap-6">
                {/* 1. Provider Brand (Col 3) */}
                <div className="md:col-span-3 flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0 ${provider.color}`}
                  >
                    {provider.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">
                      {provider.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          provider.speeds &&
                          provider.speeds[receiverType] === "Not Available"
                            ? "bg-red-100 text-red-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {provider.speeds && provider.speeds[receiverType]
                          ? provider.speeds[receiverType]
                          : "Unknown"}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-blue-100 text-blue-600">
                        Min: ${provider.minimumAmount} AUD
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Exchange Rate (Col 2) */}
                <div className="md:col-span-2 flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Exchange Rate
                  </span>
                  <div className="text-md font-bold text-indigo-600">
                    1 AUD = {provider.rate.toFixed(2)} BDT
                  </div>
                </div>

                {/* 3. Transfer Fee (Col 2) */}
                <div className="md:col-span-2 flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Transfer Fee
                  </span>
                  <div
                    className={`text-md font-bold ${provider.fee === 0 ? "text-green-600" : "text-slate-800"}`}
                  >
                    {provider.fee === 0
                      ? "Free"
                      : `$${provider.fee.toFixed(2)} AUD`}
                  </div>
                </div>

                {/* 4. Total Cost (Col 2) */}
                <div className="md:col-span-2 flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Total to Pay
                  </span>
                  <div className="text-md font-bold text-slate-800">
                    ${calculateTotalCost(provider)} AUD
                  </div>
                </div>

                {/* 5. Resulting Amount (Col 3) */}
                <div className="md:col-span-3 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Recipient Receives
                    </span>
                    <div className="text-xl font-black text-slate-900 leading-none">
                      {calculateRecipientGets(provider)}{" "}
                      <span className="text-xs font-bold text-slate-400 uppercase">
                        BDT
                      </span>
                    </div>
                  </div>
                  {provider.speeds &&
                  provider.speeds[receiverType] === "Not Available" ? (
                    <div className="mt-0 md:mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gray-200 text-gray-500 cursor-not-allowed">
                      Not Available
                    </div>
                  ) : (
                    <a
                      href={
                        provider.links && provider.links[receiverType]
                          ? provider.links[receiverType]
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-0 md:mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        index === 0
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Go to Site <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Banner */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">
                How we calculate total cost?
              </h2>
              <p className="text-indigo-100 text-lg">
                We add the transfer amount you entered to the provider's
                specific transaction fee. This gives you the full picture of
                exactly how much will leave your bank account.
              </p>
            </div>
            <div className="flex-shrink-0 grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center">
                <div className="text-2xl font-bold">$0.00</div>
                <div className="text-[10px] uppercase font-bold text-indigo-200">
                  Hidden Fees
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-[10px] uppercase font-bold text-indigo-200">
                  Transparent
                </div>
              </div>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-white/5 rounded-full"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-1 rounded-md">
              <TrendingUp className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">RemitRate.io</span>
          </div>
          <div className="text-slate-400 text-sm">
            © 2026 RemitRate Global. Fees and rates change constantly; verify on
            official site before sending.
          </div>
          <div className="flex gap-6">
            <button className="text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium">
              Privacy Policy
            </button>
            <button className="text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium">
              Terms of Use
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
