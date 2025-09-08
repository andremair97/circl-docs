"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function TabToggle() {
  const router = useRouter();
  const params = useSearchParams();
  const tab = params.get("tab") || "cities";
  const setTab = (t: string) => {
    const q = new URLSearchParams(params.toString());
    q.set("tab", t);
    router.replace(`/connectors/cdp?${q.toString()}`);
  };
  const btn = "px-3 py-1 rounded-md border text-sm";
  return (
    <div className="inline-flex gap-2" role="tablist" aria-label="CDP data tabs">
      <button className={`${btn} ${tab==="cities"?"bg-gray-100":""}`} onClick={()=>setTab("cities")} role="tab" aria-selected={tab==="cities"}>Cities & Regions (Open)</button>
      <button className={`${btn} ${tab==="corporate"?"bg-gray-100":""}`} onClick={()=>setTab("corporate")} role="tab" aria-selected={tab==="corporate"}>Corporate Scores (Licensed)</button>
    </div>
  );
}
