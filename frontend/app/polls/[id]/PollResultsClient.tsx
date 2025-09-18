"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function PollResultsClient({ pollId }: { pollId: string }) {
  const [results, setResults] = useState<{ id: number; label: string; votes: number }[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("✅ Connecté au serveur WebSocket");
    });

    socket.on("poll-results", (data: { pollId: number; results: any[] }) => {
      if (data.pollId.toString() === pollId) {
        setResults(data.results);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [pollId]);

  return (
    <div>
      <h1>Résultats en direct – Sondage {pollId}</h1>
      <ul>
        {results.map(opt => (
          <li key={opt.id}>
            {opt.label}: {opt.votes} votes
          </li>
        ))}
      </ul>
    </div>
  );
}
