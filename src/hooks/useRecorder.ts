import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderStatus = "idle" | "recording" | "recorded" | "denied" | "unsupported";

export type UseRecorder = {
  status: RecorderStatus;
  /** Elapsed seconds while recording. */
  elapsed: number;
  /** Object URL of the last recording, or null. */
  audioUrl: string | null;
  /** The raw recorded blob, for passing to comparePronunciation(). */
  blob: Blob | null;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
};

/**
 * Microphone recording via MediaRecorder. Handles permission, a live timer,
 * playback URL lifecycle and cleanup. Degrades gracefully when the API or
 * a microphone is unavailable.
 */
export function useRecorder(): UseRecorder {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const urlRef = useRef<string | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const revokeUrl = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setStatus("unsupported");
      setError("Recording isn't supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      revokeUrl();
      setAudioUrl(null);
      setBlob(null);
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const recorded = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(recorded);
        urlRef.current = url;
        setBlob(recorded);
        setAudioUrl(url);
        setStatus("recorded");
        stopStream();
      };

      recorder.start();
      setElapsed(0);
      setStatus("recording");
      timerRef.current = window.setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);
    } catch (err) {
      setStatus("denied");
      setError(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone permission was denied."
          : "Couldn't access the microphone."
      );
      stopStream();
    }
  }, [revokeUrl, stopStream]);

  const stop = useCallback(() => {
    clearTimer();
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    revokeUrl();
    setStatus("idle");
    setElapsed(0);
    setAudioUrl(null);
    setBlob(null);
    setError(null);
  }, [clearTimer, revokeUrl]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      clearTimer();
      revokeUrl();
      stopStream();
    };
  }, [clearTimer, revokeUrl, stopStream]);

  return { status, elapsed, audioUrl, blob, error, start, stop, reset };
}
