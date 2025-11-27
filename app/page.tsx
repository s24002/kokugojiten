"use client";

import { useState, useEffect } from "react";

interface WordData {
  id: string;
  word: string;
  reading?: string;
  meaning?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WordData[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // クライアントサイドでlocalStorageから履歴を読み込む
  useEffect(() => {
    try {
      const saved = localStorage.getItem("searchHistory");
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // エラー時は無視
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = async (q?: string) => {
    const keyword = q ?? query;
    if (!keyword.trim()) return;

    const res = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`);
    const data = await res.json();
    setResults(data.data || []);

    // 履歴更新
    setHistory((prevHistory) => {
      const newHistory = [
        keyword,
        ...prevHistory.filter((h) => h !== keyword),
      ].slice(0, 10);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") search();
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#000000" : "#ffffff",
        color: darkMode ? "#ffffff" : "#000000",
      }}
    >
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
                border: darkMode ? "1px solid #555" : "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                marginBottom: 10,
                backgroundColor: darkMode ? "#2c2c2c" : "#fafafa",
              }}
            >
              <h2 style={{ margin: 0 }}>
                {item.word}{" "}
                <span
                  style={{
                    fontSize: "0.9em",
                    color: darkMode ? "#aaa" : "#555",
                  }}
                >
                  ({item.reading})
                </span>
              </h2>
              <p>{item.meaning}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
