"use client";

import type { Line, Station } from "@/types/mtr";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { ArrowLeft } from "lucide-react";

interface StationSelectorProps {
  line: Line;
  onStationSelect: (station: Station) => void;
  onBack: () => void;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  line,
  onStationSelect,
  onBack,
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const stations = line.stations;

  return (
    <div className="flex flex-col h-screen bg-black/50 p-2">
      <div className="flex items-center mb-2">
         <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 text-white">
            <ArrowLeft />
         </Button>
         <h2 className="text-2xl font-bold text-white" style={{color: line.color}}>{line.lineName}</h2>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto space-y-2"
      >
        {stations.map((station) => (
          <Button
            key={station.stationCode}
            variant="secondary"
            className="w-full h-14 text-xl justify-start p-4"
            onClick={() => onStationSelect(station)}
          >
            {station.stationName}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default StationSelector;
