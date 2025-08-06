"use client";

import * as React from "react";
import { mtrData } from "@/data/mtr";
import { hexToRgba } from "@/lib/utils";
import type { Line, Station, MtrApiResponse, MergedArrival } from "@/types/mtr";
import StationSelector from "@/components/station-selector";
import EtaDisplay from "@/components/eta-display";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedLine, setSelectedLine] = React.useState<Line | null>(null);
  const [selectedStation, setSelectedStation] = React.useState<Station | null>(
    null
  );

  const [bgColor, setBgColor] = React.useState("var(--background)");
  const [arrivalData, setArrivalData] = React.useState<MergedArrival[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState<string | null>(null);
  const [stationName, setStationName] = React.useState("");
  const etaDisplayRef = React.useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  const stationCodeToNameMap = React.useMemo(() => {
    const map = new Map<string, string>();
    mtrData.forEach((line) => {
      line.stations.forEach((station) => {
        map.set(station.stationCode, station.stationName);
      });
    });
    return map;
  }, []);

  const fetchArrivalData = React.useCallback(async () => {
    if (!selectedLine || !selectedStation) return;

    setIsLoading(true);
    // Don't clear arrival data on auto-refresh to avoid flicker
    // setArrivalData([]); 
    try {
      const response = await fetch(
        `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${selectedLine.lineCode}&sta=${selectedStation.stationCode}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: MtrApiResponse = await response.json();

      if (data.status === 0 || !data.data) {
        // Don't throw error on auto-refresh, just keep stale data
        console.warn(data.message || "No arrival data available.");
        if (arrivalData.length === 0) {
             setArrivalData([]);
        }
        return;
      }

      setCurrentTime(data.curr_time);
      const schedule = data.data[`${selectedLine.lineCode}-${selectedStation.stationCode}`];
      if (!schedule) {
        setArrivalData([]);
        return;
      }

      const upArrivals = (schedule.UP || []).map((arr) => ({
        ...arr,
        direction: "UP" as const,
      }));
      const downArrivals = (schedule.DOWN || []).map((arr) => ({
        ...arr,
        direction: "DOWN" as const,
      }));

      const allArrivals = [...upArrivals, ...downArrivals]
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        .map((arr) => ({
          destination: stationCodeToNameMap.get(arr.dest) || arr.dest,
          platform: arr.plat,
          arrivalTime: new Date(arr.time).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          countdown: arr.ttnt,
          direction: arr.direction,
        }));

      setArrivalData(allArrivals);
    } catch (error) {
      console.error("Failed to fetch MTR data:", error);
       if (arrivalData.length === 0) { // Only toast if there's no data at all
         toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch arrival times.",
          });
          setArrivalData([]);
       }
    } finally {
      setIsLoading(false);
    }
  }, [selectedLine, selectedStation, stationCodeToNameMap, toast, arrivalData.length]);
  
  React.useEffect(() => {
    const intervalId = setInterval(() => {
        if (selectedLine && selectedStation) {
            fetchArrivalData();
        }
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [selectedLine, selectedStation, fetchArrivalData]);


  React.useEffect(() => {
    if (selectedLine) {
      const color = selectedLine.color;
      setBgColor(hexToRgba(color, 0.5));
    } else {
      setBgColor("hsl(var(--background))");
    }
  }, [selectedLine]);

  React.useEffect(() => {
    if (selectedLine && selectedStation) {
      setStationName(selectedStation.stationName);
      fetchArrivalData();
    } else {
      setArrivalData([]);
      setStationName("");
      setCurrentTime(null);
    }
  }, [selectedLine, selectedStation, fetchArrivalData]);
  
  React.useEffect(() => {
    if (selectedStation && etaDisplayRef.current) {
        setTimeout(() => {
            etaDisplayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [selectedStation]);

  const handleLineSelect = (line: Line) => {
    setSelectedLine(line);
    setSelectedStation(null);
  };

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
  };

  const resetSelection = () => {
    setSelectedLine(null);
    setSelectedStation(null);
  }

  const renderContent = () => {
    if (!selectedLine) {
      return (
          <div className="grid grid-cols-3 gap-1 p-1">
             {mtrData.map((line) => (
                <button
                    key={line.lineCode}
                    onClick={() => handleLineSelect(line)}
                    className="flex items-center justify-center aspect-square rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: line.color, color: getContrastColor(line.color) }}
                >
                    <span className="text-xl font-bold">{line.lineCode}</span>
                </button>
             ))}
          </div>
      );
    }

    if (!selectedStation) {
      return (
        <StationSelector
          line={selectedLine}
          onStationSelect={handleStationSelect}
          onBack={resetSelection}
        />
      );
    }
    
    return (
        <div ref={etaDisplayRef}>
            <EtaDisplay
              stationName={stationName}
              currentTime={currentTime}
              arrivals={arrivalData}
              isLoading={isLoading}
              lineColor={selectedLine.color}
              onRefresh={fetchArrivalData}
              onBack={() => setSelectedStation(null)}
            />
          </div>
    )
  }

  const getContrastColor = (hexcolor: string) => {
    if (hexcolor.startsWith('#')) {
      hexcolor = hexcolor.slice(1);
    }
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 4), 16);
    const b = parseInt(hexcolor.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  };


  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center transition-colors duration-500"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-sm h-screen">
          {renderContent()}
      </div>
    </main>
  );
}
