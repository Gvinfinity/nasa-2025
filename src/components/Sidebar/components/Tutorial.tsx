import { useState } from 'react';
import { NotebookPen } from "lucide-react";
import { Slides } from '../../ui/Slides';
import { TUTORIAL_SLIDES } from '../../../data/mock/tutorialSlides';

export const Tutorial = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-800/40 cursor-pointer">
        <NotebookPen size={20} />
        <span className="font-medium">Tutorial</span>
      </div>
      {open && <Slides slides={TUTORIAL_SLIDES} onClose={() => setOpen(false)} />}
    </>
  );
};