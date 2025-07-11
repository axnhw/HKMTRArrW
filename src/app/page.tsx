"use client";

import * as React from "react";
import { mtrData } from "@/data/mtr";
import { hexToRgba } from "@/lib/utils";
import type { Line, Station, MtrApiResponse, MergedArrival } from "@/types/mtr";
import StationSelector from "@/components/station-selector";
import EtaDisplay from "@/components/eta-display";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedLineIndex, setSelectedLineIndex] = React.useState<number | null>(null);
  const [selectedStationIndex, setSelectedStationIndex] = React.useState<number | null>(null);
  
  const [bgColor, setBgColor] = React.useState("var(--background)");
  const [arrivalData, setArrivalData] = React.useState<MergedArrival[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState("--:--:--");
  const [stationName, setStationName] = React.useState("");

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

  React.useEffect(() => {
    if (selectedLineIndex !== null) {
      const color = mtrData[selectedLineIndex].color;
      setBgColor(hexToRgba(color, 0.5));
      setSelectedStationIndex(null); // Reset station when line changes
    } else {
      setBgColor("hsl(var(--background))");
    }
  }, [selectedLineIndex]);

  React.useEffect(() => {
    const fetchArrivalData = async (lineCode: string, stationCode: string) => {
      setIsLoading(true);
      setArrivalData([]);
      try {
        const response = await fetch(
          `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${lineCode}&sta=${stationCode}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: MtrApiResponse = await response.json();

        if (data.status === 0 || !data.data) {
          throw new Error(data.message || "No arrival data available.");
        }
        
        setCurrentTime(new Date(data.curr_time).toLocaleTimeString('en-GB'));
        const schedule = data.data[`${lineCode}-${stationCode}`];
        if (!schedule) {
          setArrivalData([]);
          return;
        }

        const upArrivals = (schedule.UP || []).map(arr => ({...arr, direction: 'UP' as const}));
        const downArrivals = (schedule.DOWN || []).map(arr => ({...arr, direction: 'DOWN' as const}));

        const allArrivals = [...upArrivals, ...downArrivals]
            .sort((a,b) => new Date(a.time).getTime() - new Date(b.time).getTime())
            .map(arr => ({
                destination: stationCodeToNameMap.get(arr.dest) || arr.dest,
                platform: arr.plat,
                arrivalTime: new Date(arr.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                countdown: arr.ttnt,
                direction: arr.direction,
            }));
        
        setArrivalData(allArrivals);

      } catch (error) {
        console.error("Failed to fetch MTR data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch arrival times. Please try again later.",
        });
        setArrivalData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedLineIndex !== null && selectedStationIndex !== null) {
      const line = mtrData[selectedLineIndex];
      const station = line.stations[selectedStationIndex];
      setStationName(station.stationName);
      fetchArrivalData(line.lineCode, station.stationCode);
    } else {
      setArrivalData([]);
      setStationName("");
    }
  }, [selectedLineIndex, selectedStationIndex, stationCodeToNameMap, toast]);

  const selectedLine = selectedLineIndex !== null ? mtrData[selectedLineIndex] : null;

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 transition-colors duration-500"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-4xl space-y-8">
        <StationSelector
          lines={mtrData}
          selectedLineIndex={selectedLineIndex}
          onLineChange={setSelectedLineIndex}
          selectedStationIndex={selectedStationIndex}
          onStationChange={setSelectedStationIndex}
        />

        {selectedLine && selectedStationIndex !== null && (
          <EtaDisplay
            stationName={stationName}
            currentTime={currentTime}
            arrivals={arrivalData}
            isLoading={isLoading}
            lineColor={selectedLine.color}
          />
        )}
      </div>
    </main>
  );
}
