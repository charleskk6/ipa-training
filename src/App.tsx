import { useEffect, useState } from "react";
import type { TabId } from "./types";
import Nav, { TABS } from "./components/Nav";
import LearnView from "./views/LearnView";
import PracticeView from "./views/PracticeView";
import FlashcardsView from "./views/FlashcardsView";
import MinimalPairsView from "./views/MinimalPairsView";
import ProgressView from "./views/ProgressView";

const TAB_KEY = "ipa.activeTab.v1";

function readInitialTab(): TabId {
  // Allow deep-linking via hash (e.g. #practice) and remember the last tab.
  const hash = window.location.hash.replace("#", "");
  if (TABS.some((t) => t.id === hash)) return hash as TabId;
  const stored = localStorage.getItem(TAB_KEY);
  if (stored && TABS.some((t) => t.id === stored)) return stored as TabId;
  return "learn";
}

export default function App() {
  const [tab, setTab] = useState<TabId>(readInitialTab);

  useEffect(() => {
    try {
      localStorage.setItem(TAB_KEY, tab);
    } catch {
      /* ignore */
    }
    window.location.hash = tab;
  }, [tab]);

  return (
    <div className="flex min-h-full bg-slate-50">
      <Nav active={tab} onChange={setTab} />

      <main className="flex-1 overflow-x-hidden pb-20 md:pb-0">
        {/* Mobile header */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <span className="ipa text-2xl text-indigo-600" aria-hidden="true">
            ə
          </span>
          <h1 className="text-base font-bold text-slate-900">IPA Trainer</h1>
          <span className="ml-auto text-xs text-slate-400">British English</span>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          {tab === "learn" && <LearnView />}
          {tab === "practice" && <PracticeView />}
          {tab === "flashcards" && <FlashcardsView />}
          {tab === "pairs" && <MinimalPairsView />}
          {tab === "progress" && <ProgressView />}
        </div>
      </main>
    </div>
  );
}
