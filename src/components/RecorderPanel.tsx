import { useRecorder } from "../hooks/useRecorder";
import { formatTime, cx } from "../lib/ui";
import { useEffect, useRef } from "react";

type Props = {
  /** Called whenever a new recording finishes, with the audio blob. */
  onRecorded?: (blob: Blob) => void;
  compact?: boolean;
};

/** Self-contained record / stop / playback widget with a live timer. */
export default function RecorderPanel({ onRecorded, compact }: Props) {
  const rec = useRecorder();
  const lastBlob = useRef<Blob | null>(null);

  // Notify the parent once per completed recording.
  useEffect(() => {
    if (rec.blob && rec.blob !== lastBlob.current) {
      lastBlob.current = rec.blob;
      onRecorded?.(rec.blob);
    }
  }, [rec.blob, onRecorded]);

  return (
    <div className={cx("rounded-xl border border-slate-200 bg-white p-4", compact && "p-3")}>
      <div className="flex flex-wrap items-center gap-3">
        {rec.status !== "recording" ? (
          <button
            type="button"
            onClick={() => void rec.start()}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white" aria-hidden="true" />
            {rec.status === "recorded" ? "Record again" : "Record"}
          </button>
        ) : (
          <button
            type="button"
            onClick={rec.stop}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            <span className="h-2.5 w-2.5 bg-white" aria-hidden="true" />
            Stop
          </button>
        )}

        {rec.status === "recording" && (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-rose-600">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-600" aria-hidden="true" />
            Recording… {formatTime(rec.elapsed)}
          </span>
        )}

        {rec.status === "recorded" && rec.audioUrl && (
          <audio controls src={rec.audioUrl} className="h-9 max-w-full" />
        )}

        {rec.status === "recorded" && (
          <button
            type="button"
            onClick={rec.reset}
            className="text-sm font-medium text-slate-500 underline-offset-2 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {rec.error && (
        <p className="mt-3 text-sm text-rose-600" role="alert">
          {rec.error}
        </p>
      )}
    </div>
  );
}
