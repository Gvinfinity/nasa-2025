import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Users } from "lucide-react";
import Logo from "../../../assets/logo.svg";
import { SidebarContext } from "../Sidebar";

type MeetProps = {
  forcedOpen?: boolean;
};

export const MeetTheTeam = ({ forcedOpen }: MeetProps) => {
  const [openMenu, setOpenMenu] = useState(false);
  const { openTab } = useContext(SidebarContext);

  useEffect(() => {
    if (forcedOpen) setOpenMenu(true);
    else setOpenMenu(false);
  }, [forcedOpen]);

  return (
    <div className="flex flex-col w-full">
      <div
        onClick={() => {
          setOpenMenu((s) => !s);
          if (!openMenu) openTab?.("meet");
        }}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
      >
        <Users className="text-neutral-100" size={18} />
        <span className="font-semibold text-neutral-100 tracking-wide">
          Meet the Team
        </span>
        <motion.div
          animate={{ rotate: openMenu ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-auto"
        >
          <ChevronDown size={18} className="text-neutral-100" />
        </motion.div>
      </div>

      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="ml-4 mt-3 grid grid-cols-1 gap-2 overflow-hidden"
          >
            <div className="mt-1 grid grid-cols-1 gap-2 text-neutral-200">
              <div className="flex items-center justify-between px-2 py-1 rounded bg-white/5">
                <div>Heitor Leite de Almeida</div>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded bg-white/5">
                <div>Gabriel Soares</div>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded bg-white/5">
                <div>Giulliano Teixeira</div>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded bg-white/5">
                <div>João Mafra</div>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded bg-white/5">
                <div>Milena Furuta</div>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded bg-white/5">
                <div>Thales Scarpato</div>
              </div>
              <p className="mx-auto w-fit text-xs font-semibold text center">
                Shark Seer Logo Designer: nile D. art
              </p>
              <img src={Logo} alt="Coding in Lua Logo" className="mx-auto h-20 w-20" />
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
