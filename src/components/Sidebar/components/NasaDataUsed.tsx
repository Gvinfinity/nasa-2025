
import { Layers } from "lucide-react";

export const NasaDataUsed = () => (
  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-800/40 cursor-pointer">
    <Layers size={20} />
    <span className="font-medium">NASA Data Used</span>
  </div>
);