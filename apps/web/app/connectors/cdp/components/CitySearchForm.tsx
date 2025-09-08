"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";

export default function CitySearchForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [city, setCity] = useState(params.get("city") ?? "London");
  const [country, setCountry] = useState(params.get("country") ?? "");
  const [from, setFrom] = useState(params.get("from") ?? "2018");
  const [to, setTo] = useState(params.get("to") ?? "2024");
  const [pending, start] = useTransition();

  useEffect(() => {
    setCity(params.get("city") ?? "London");
    setCountry(params.get("country") ?? "");
    setFrom(params.get("from") ?? "2018");
    setTo(params.get("to") ?? "2024");
  }, [params]);

  return (
    <form
      onSubmit={(e)=>{ e.preventDefault();
        const q = new URLSearchParams(params.toString());
        q.set("tab","cities");
        q.set("city", city);
        if (country) q.set("country", country); else q.delete("country");
        q.set("from", from); q.set("to", to);
        start(()=>router.replace(`/connectors/cdp?${q.toString()}`));
      }}
      className="grid md:grid-cols-5 gap-2"
      aria-label="Search CDP city emissions"
    >
      <input className="border rounded px-2 py-1" value={city} onChange={e=>setCity(e.target.value)} placeholder="City (e.g., London)" aria-label="City"/>
      <input className="border rounded px-2 py-1" value={country} onChange={e=>setCountry(e.target.value)} placeholder="Country (optional)" aria-label="Country"/>
      <input className="border rounded px-2 py-1" value={from} onChange={e=>setFrom(e.target.value)} placeholder="From year" aria-label="From year"/>
      <input className="border rounded px-2 py-1" value={to} onChange={e=>setTo(e.target.value)} placeholder="To year" aria-label="To year"/>
      <button className="border rounded px-3 py-1" disabled={pending} aria-busy={pending}>{pending ? "Searching…" : "Search"}</button>
    </form>
  );
}
