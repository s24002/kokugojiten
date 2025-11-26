"use client";

import { useState } from "react";

interface Sense {
  english_definitions: string[];
  parts_of_speech: string[];
}

interface Japanese {
  word?: string;
  reading?: string;
}

interface JishoData {
  slug: string;
  japanese: Japanese[];
  senses: Sense[];
}

export default function Home() {
  const getInitialHistory = () => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("searchHistory");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const [input, setInput] = useState("");
  const [results, setResults] = useState<JishoData[]>([]);
  const [history, setHistory] = useState<string[]>(getInitialHistory);
  const [showResults, setShowResults] = useState(false);

  const search = async (keyword?: string) => {
    const query = keyword || input;
    if (!query.trim()) return;

    try {
      const res = await fetch(`/api/jisho?q=${query}`);
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        setResults(data.data);
        setShowResults(true);

        // 履歴更新
        const newHistory = [query, ...history.filter((h) => h !== query)].slice(
          0,
          10
        );
        setHistory(newHistory);
        localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      } else {
        setResults([]);
        setShowResults(true);
      }
    } catch (err) {
      console.error("検索失敗:", err);
      setResults([]);
      setShowResults(true);
    }
  };

  const handleHistoryClick = (word: string) => {
    setInput(word);
    search(word);
  };

  const handleBack = () => {
    setShowResults(false);
  };

  return (
    <main style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>国語辞典</h1>

      {!showResults && (
        <div style={{ marginBottom: 20 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="検索ワードを入力"
            style={{ padding: 8, marginRight: 10 }}
          />
          <button onClick={() => search()} style={{ padding: "8px 12px" }}>
            検索
          </button>
        </div>
      )}

      {!showResults && history.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <strong>検索履歴:</strong>{" "}
          {history.map((word) => (
            <button
              key={word}
              onClick={() => handleHistoryClick(word)}
              style={{
                margin: "0 5px",
                padding: "2px 6px",
                cursor: "pointer",
                backgroundColor: "#eee",
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
            >
              {word}
            </button>
          ))}
        </div>
      )}

      {showResults && (
        <div>
          <button
            onClick={handleBack}
            style={{ marginBottom: 20, padding: "6px 10px" }}
          >
            一覧に戻る
          </button>

          {results.length === 0 ? (
            <p>検索結果はありません</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              {results.map((item) => (
                <div
                  key={item.slug}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <h2 style={{ margin: 0 }}>
                    {item.japanese[0]?.word || item.slug}{" "}
                    <span style={{ fontSize: "0.9em", color: "#555" }}>
                      ({item.japanese[0]?.reading})
                    </span>
                  </h2>
                  <ul style={{ marginTop: 8 }}>
                    {item.senses.map((sense, idx) => (
                      <li key={idx}>
                        <strong>意味:</strong>{" "}
                        {sense.english_definitions.join(", ")} <br />
                        <strong>品詞:</strong>{" "}
                        {sense.parts_of_speech.join(", ")}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
