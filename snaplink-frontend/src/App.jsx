import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [password, setPassword] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);
  const [customAlias, setCustomAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleShorten = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: url,
          password: password,
          expiryDays: expiryDays,
          customAlias: customAlias,
        }),
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
        setLoading(false);
        return;
      }
      setShortCode(data.shortCode);
      setShortUrl(`http://localhost:8080/${data.shortCode}`);
      setCustomAlias("");
    } catch (error) {
      alert("Something went wrong!");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-3">
            Snap<span className="text-purple-400">Link</span> 🔗
          </h1>
          <p className="text-purple-300 text-lg">
            Shorten, protect and track your URLs
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-white/10 text-white placeholder-purple-300 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handleShorten}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "..." : "Shorten ✂️"}
            </button>
          </div>

          <button
            onClick={() => setShowOptions(!showOptions)}
            className="mt-4 text-purple-300 hover:text-white text-sm transition-colors"
          >
            {showOptions ? "▲ Hide options" : "▼ Show advanced options"}
          </button>

          {showOptions && (
            <div className="mt-4 grid grid-cols-1 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <label className="text-purple-300 text-sm mb-1 block">
                  Custom Alias
                </label>
                <input
                  type="text"
                  placeholder="e.g. myportfolio"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="w-full bg-white/10 text-white placeholder-purple-400 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
              <div>
                <label className="text-purple-300 text-sm mb-1 block">
                  Password Protection
                </label>
                <input
                  type="password"
                  placeholder="Leave empty for no password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 text-white placeholder-purple-400 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
              <div>
                <label className="text-purple-300 text-sm mb-1 block">
                  Expires in (days)
                </label>
                <input
                  type="number"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
            </div>
          )}

          {shortUrl && (
            <div className="mt-6 p-6 bg-white/5 rounded-xl border border-purple-400/30">
              <p className="text-purple-300 text-sm mb-2">Your short URL:</p>
              <div className="flex gap-3 items-center mb-6">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white font-medium hover:text-purple-300 transition-colors flex-1 truncate"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-purple-500 hover:bg-purple-600 text-white"
                  }`}
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-purple-300 text-sm mb-3">QR Code</p>
                <div className="bg-white p-3 rounded-xl">
                  <img
                    src={`http://localhost:8080/qr/${shortCode}`}
                    alt="QR Code"
                    className="w-40 h-40"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-purple-400 text-sm mt-6">
          Built with Spring Boot + React
        </p>
      </div>
    </div>
  );
}

export default App;
