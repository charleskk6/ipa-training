import { useEffect, useMemo, useState } from "react";
import { VOWELS, CONSONANTS, SOUND_BY_SYMBOL } from "../data/ipaData";
import type { IPASound } from "../types";
import IPACard from "../components/IPACard";
import SoundDetail from "../components/SoundDetail";

type Filter = "all" | "vowel" | "consonant";

export default function LearnView() {
  const [selected, setSelected] = useState<string>(VOWELS[0].symbol);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const sound = SOUND_BY_SYMBOL[selected];

  const matches = (s: IPASound) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.symbol.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.examples.some((w) => w.toLowerCase().includes(q))
    );
  };

  const vowels = useMemo(() => VOWELS.filter(matches), [query]);
  const consonants = useMemo(() => CONSONANTS.filter(matches), [query]);

  // Keep the detail panel scrolled into view when selecting on mobile.
  useEffect(() => {
    const el = document.getElementById("sound-detail");
    if (el && window.innerWidth < 768) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Learn the sounds</h2>
        <p className="mt-1 text-sm text-slate-600">
          Tap any symbol to see how to make it, hear a model and view example
          words. British English (RP) throughout.
        </p>
      </header>

      <div id="sound-detail">
        {sound && <SoundDetail sound={sound} onSelectSymbol={setSelected} />}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-sm">
          {(["all", "vowel", "consonant"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={
                "rounded-md px-3 py-1.5 font-medium capitalize transition " +
                (filter === f
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100")
              }
            >
              {f === "all" ? "All" : f + "s"}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search symbol or word…"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {(filter === "all" || filter === "vowel") && vowels.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-vowel-700">
            <span className="h-2.5 w-2.5 rounded-full bg-vowel-500" aria-hidden="true" />
            Vowels
          </h3>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {vowels.map((s) => (
              <IPACard
                key={s.symbol}
                sound={s}
                selected={s.symbol === selected}
                onSelect={() => setSelected(s.symbol)}
              />
            ))}
          </div>
        </section>
      )}

      {(filter === "all" || filter === "consonant") && consonants.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-consonant-700">
            <span className="h-2.5 w-2.5 rounded-full bg-consonant-500" aria-hidden="true" />
            Consonants
          </h3>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {consonants.map((s) => (
              <IPACard
                key={s.symbol}
                sound={s}
                selected={s.symbol === selected}
                onSelect={() => setSelected(s.symbol)}
              />
            ))}
          </div>
        </section>
      )}

      {vowels.length === 0 && consonants.length === 0 && (
        <p className="text-sm text-slate-500">No sounds match “{query}”.</p>
      )}
    </div>
  );
}
