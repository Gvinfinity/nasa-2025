import React, { useEffect } from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  // optional quiz props
  questionText?: string;
  options?: string[];
  correctAnswer?: string;
  onAnswer?: (isCorrect: boolean, selected?: string) => void;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  title,
  children,
  onClose,
  footer,
  questionText,
  options,
  correctAnswer,
  onAnswer,
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const [selected, setSelected] = React.useState<string | null>(null);
  const [answered, setAnswered] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    // reset selection when dialog opens
    if (open) {
      setSelected(null);
      setAnswered(null);
    }
  }, [open, questionText]);

  if (!open) return null;

  const submitAnswer = (choice: string) => {
    setSelected(choice);
    const isCorrect = choice === correctAnswer;
    setAnswered(isCorrect);
    if (onAnswer) onAnswer(isCorrect, choice);
  };

  return (
    <div
      aria-modal
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onClose()}
      />
      <div className="relative z-10 w-full max-w-xl rounded-md bg-blue-800 shadow-lg">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-lg font-semibold">{title}</div>
          <X className="w-5 h-5 cursor-pointer" onClick={onClose} />
        </div>
        <div className="p-4">
          {questionText ? (
            <div>
              <div className="mb-3 text-white font-medium">{questionText}</div>
              <div className="space-y-2">
                {options?.map((opt) => {
                  const correct = answered === true && opt === correctAnswer;
                  const incorrect = answered === false && opt === selected;
                  return (
                    <button
                      key={opt}
                      onClick={() => submitAnswer(opt)}
                      className={`w-full text-left p-2 rounded ${
                        correct
                          ? "bg-green-600 text-white"
                          : incorrect
                          ? "bg-red-600 text-white"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answered !== null && (
                <div className="mt-3">
                  {answered ? (
                    <div className="text-sm text-green-200">Correct ✅</div>
                  ) : (
                    <div className="text-sm text-red-200">Incorrect ❌</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-white">{children}</div>
          )}
        </div>
        {footer && <div className="border-t px-4 py-3">{footer}</div>}
      </div>
    </div>
  );
};

export default Dialog;
