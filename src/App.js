import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/predict");
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="App">
      <h1>Custom Vision App</h1>
      <h2>Image Classification Results</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            {result.tagName}: {(result.probability * 100).toFixed(2)}%
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
