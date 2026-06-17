import type { TabId } from "../types";
import { cx } from "../lib/ui";

export const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: "learn", label: "Learn", icon: "📖" },
  { id: "practice", label: "Practice", icon: "🎙️" },
  { id: "flashcards", label: "Flashcards", icon: "🃏" },
  { id: "pairs", label: "Minimal Pairs", icon: "👂" },
  { id: "progress", label: "Progress", icon: "📊" },
];

type Props = {
  active: TabId;
  onChange: (tab: TabId) => void;
};

/**
 * Responsive navigation: a left sidebar on desktop, a bottom tab bar on mobile.
 */
export default function Nav({ active, onChange }: Props) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <span className="ipa text-3xl text-indigo-600" aria-hidden="true">
            ə
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-900">
              IPA Trainer
            </h1>
            <p className="text-xs text-slate-500">British English</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                active === tab.id
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              )}
              aria-current={active === tab.id ? "page" : undefined}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
        <p className="mt-auto px-2 pt-4 text-[11px] leading-relaxed text-slate-400">
          Practice runs entirely in your browser. Recordings and progress stay on
          this device.
        </p>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-stretch justify-around border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cx(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition",
              active === tab.id ? "text-indigo-600" : "text-slate-500"
            )}
            aria-current={active === tab.id ? "page" : undefined}
          >
            <span className="text-lg" aria-hidden="true">
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </nav>
    </>
  );
}
