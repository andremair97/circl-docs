"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProviderTabs({ current }: { current: "EU_ECOLABEL" | "GREEN_SEAL" }) {
  const params = useSearchParams();
  const router = useRouter();

  function setProvider(p: "EU_ECOLABEL" | "GREEN_SEAL") {
    const next = new URLSearchParams(params.toString());
    next.set("provider", p);
    router.replace(`/connectors/ecolabels?${next.toString()}`);
  }

  const base = "px-3 py-1 border rounded-md text-sm";
  const active = "bg-gray-100";

  return (
    <div className="flex gap-2">
      <button
        className={`${base} ${current === "EU_ECOLABEL" ? active : ""}`}
        onClick={() => setProvider("EU_ECOLABEL")}
      >
        EU Ecolabel
      </button>
      <button
        className={`${base} ${current === "GREEN_SEAL" ? active : ""}`}
        onClick={() => setProvider("GREEN_SEAL")}
      >
        Green Seal
      </button>
    </div>
  );
}
