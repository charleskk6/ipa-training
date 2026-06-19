import type { IPASound } from "../types";
import PlayButton from "./PlayButton";

type Props = {
  sound: IPASound;
  className?: string;
};

/**
 * The pair of play buttons used throughout the app: one for the isolated IPA
 * sound, one for the full example word.
 */
export default function SoundButtons({ sound, className }: Props) {
  return (
    <div className={"flex flex-wrap gap-2 " + (className ?? "")}>
      <PlayButton sound={sound} mode="phoneme" />
      <PlayButton sound={sound} mode="word" />
    </div>
  );
}
