"use client";

import { useState } from "react";

interface WordData {
  id: string;
  word: string;
  reading?: string;
  meaning?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WordData[]>([]);
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("searchHistory");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [darkMode, setDarkMode] = useState(false);

  const search = async (q?: string) => {
    const keyword = q ?? query;
    if (!keyword.trim()) return;

    const res = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`);
    const data = await res.json();
    setResults(data.data || []);

    // 履歴更新
    const newHistory = [keyword, ...history.filter((h) => h !== keyword)].slice(
      0,
      10
    );
    setHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") search();
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return (
    <main className={darkMode ? "dark" : ""}>
      <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
        <h1>国語辞典</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "ライトモード" : "ダークモード"}
        </button>

        <div style={{ margin: "10px 0" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="検索ワードを入力"
            style={{ padding: 8, marginRight: 10 }}
          />
          <button onClick={() => search()}>検索</button>
        </div>

        {history.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <strong>検索履歴:</strong>{" "}
            {history.map((word) => (
              <button
                key={word}
                onClick={() => search(word)}
                style={{ margin: "0 5px", padding: "2px 6px" }}
              >
                {word}
              </button>
            ))}
            <button
              onClick={clearHistory}
              style={{
                marginLeft: 10,
                color: "white",
                backgroundColor: "red",
                padding: "2px 6px",
              }}
            >
              全削除
            </button>
          </div>
        )}

        <div>
          {results.length === 0 ? (
            <p>検索結果はありません</p>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 10,
                }}
              >
                <h2 style={{ margin: 0 }}>
                  {item.word}{" "}
                  <span style={{ fontSize: "0.9em", color: "#555" }}>
                    ({item.reading})
                  </span>
                </h2>
                <p>{item.meaning}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
