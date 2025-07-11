"use client";

import type { Line, Station } from "@/types/mtr";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { cn } from "@/lib/utils";

interface StationSelectorProps {
  lines: Line[];
  selectedLine: Line | null;
  onLineSelect: (line: Line) => void;
  selectedStation: Station | null;
  onStationSelect: (station: Station) => void;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  lines,
  selectedLine,
  onLineSelect,
  selectedStation,
  onStationSelect,
}) => {
  const stations = selectedLine ? selectedLine.stations : [];

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">MTR Arrival Time</CardTitle>
        <CardDescription>Select a line and station to see live arrival times.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="space-y-3">
          <label className="text-sm font-medium">MTR Line</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {lines.map((line) => (
              <Button
                key={line.lineCode}
                variant={selectedLine?.lineCode === line.lineCode ? "default" : "outline"}
                onClick={() => onLineSelect(line)}
                className="justify-start"
              >
                <span
                  className="h-4 w-4 rounded-full inline-block border border-slate-300 mr-2"
                  style={{ backgroundColor: line.color }}
                />
                <span className="truncate">{line.lineName}</span>
              </Button>
            ))}
          </div>
        </div>

        {selectedLine && (
          <div className="space-y-3 animate-in fade-in duration-500">
            <label className="text-sm font-medium">Station</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {stations.map((station) => (
                <Button
                  key={station.stationCode}
                  variant={selectedStation?.stationCode === station.stationCode ? "default" : "outline"}
                  onClick={() => onStationSelect(station)}
                  className="justify-start"
                >
                   <span className="truncate">{station.stationName}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StationSelector;
