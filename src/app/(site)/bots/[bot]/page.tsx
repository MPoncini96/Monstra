"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function BotPage({ params }: { params: { bot: string } }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const start = "2026-01-01";

    fetch(`/api/bots/${params.bot}/equity?start=${start}&end=${today}`)
      .then((r) => r.json())
      .then(setData);
  }, [params.bot]);

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-bold capitalize">
        {params.bot} Performance
      </h1>

      <div className="w-full h-[400px] bg-white rounded-xl p-6">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="d" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Line type="monotone" dataKey="equity" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
