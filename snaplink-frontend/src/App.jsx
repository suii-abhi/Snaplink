import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: url,
          password: "",
          expiryDays: 7,
        }),
      });
      const data = await response.json();
      console.log(data);
      setShortUrl(`http://localhost:8080/${data.shortCode}`);
    } catch (error) {
      alert("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>SnapLink 🔗</h1>
      <p>Shorten your URLs instantly</p>

      <input
        type="text"
        placeholder="Paste your long URL here..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      />

      <button
        onClick={handleShorten}
        disabled={loading}
        style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        {loading ? "Shortening..." : "Shorten URL"}
      </button>

      {shortUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>Your short URL:</p>
          <a href={shortUrl} target="_blank">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
