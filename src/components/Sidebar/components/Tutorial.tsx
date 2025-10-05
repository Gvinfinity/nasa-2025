import { useState } from "react";
import { NotebookPen } from "lucide-react";
import { Slides } from "../../ui/Slides";
import { TUTORIAL_SLIDES } from "../../../data/mock/tutorialSlides";

export const Tutorial = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
      >
        <NotebookPen size={22} className="text-neutral-100" />
        <span className="font-semibold text-neutral-100 tracking-wide">
          Tutorial
        </span>
      </div>
      {open && (
        <Slides slides={TUTORIAL_SLIDES} onClose={() => setOpen(false)} />
      )}
    </>
  );
};
