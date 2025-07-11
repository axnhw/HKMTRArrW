"use client";

import type { Line } from "@/types/mtr";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import * as React from "react";

interface StationSelectorProps {
  lines: Line[];
  selectedLineIndex: number | null;
  onLineChange: (index: number | null) => void;
  selectedStationIndex: number | null;
  onStationChange: (index: number | null) => void;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  lines,
  selectedLineIndex,
  onLineChange,
  selectedStationIndex,
  onStationChange,
}) => {
  const selectedLine = selectedLineIndex !== null ? lines[selectedLineIndex] : null;
  const stations = selectedLine ? selectedLine.stations : [];

  const handleLineChange = (value: number[]) => {
    onLineChange(value[0]);
    onStationChange(null);
  };
  
  const handleStationChange = (value: number[]) => {
    onStationChange(value[0]);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">MTR Arrival Time</CardTitle>
        <CardDescription>Select a line and station to see live arrival times.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label htmlFor="line-slider" className="text-sm font-medium">
              MTR Line
            </label>
            <div className="flex items-center gap-2">
                {selectedLine && (
                    <span
                    className="h-4 w-4 rounded-full inline-block border border-slate-300"
                    style={{ backgroundColor: selectedLine.color }}
                    />
                )}
                <span className="text-sm font-semibold w-48 text-right truncate">
                    {selectedLine ? selectedLine.lineName : "Select a line"}
                </span>
            </div>
          </div>
          <Slider
            id="line-slider"
            min={0}
            max={lines.length - 1}
            step={1}
            value={selectedLineIndex !== null ? [selectedLineIndex] : [0]}
            onValueChange={handleLineChange}
          />
        </div>

        {selectedLine && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <label htmlFor="station-slider" className="text-sm font-medium">
                Station
              </label>
              <span className="text-sm font-semibold w-48 text-right truncate">
                {selectedStationIndex !== null ? stations[selectedStationIndex].stationName : "Select a station"}
              </span>
            </div>
            <Slider
              id="station-slider"
              min={0}
              max={stations.length > 1 ? stations.length - 1 : 1}
              step={1}
              value={selectedStationIndex !== null ? [selectedStationIndex] : [0]}
              onValueChange={handleStationChange}
              disabled={!selectedLine}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StationSelector;
