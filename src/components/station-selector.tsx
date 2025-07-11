"use client";

import type { Line, Station } from "@/types/mtr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as React from "react";

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
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">MTR Arrival Time</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">MTR Line</label>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {lines.map((line) => (
              <Button
                key={line.lineCode}
                onClick={() => onLineSelect(line)}
                className={`h-10 text-sm font-bold transition-transform duration-200 ease-in-out hover:scale-110 focus:ring-2 focus:ring-offset-2 ${
                  selectedLine?.lineCode === line.lineCode ? 'ring-2 ring-primary ring-offset-2' : 'ring-1 ring-inset ring-black/10'
                }`}
                style={{ 
                    backgroundColor: line.color,
                    color: getContrastColor(line.color)
                }}
              >
                {line.lineCode}
              </Button>
            ))}
          </div>
        </div>

        {selectedLine && (
          <div className="space-y-3 animate-in fade-in duration-500">
            <label className="text-sm font-medium">Station</label>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {stations.map((station) => (
                <Button
                  key={station.stationCode}
                  variant={selectedStation?.stationCode === station.stationCode ? "default" : "outline"}
                  onClick={() => onStationSelect(station)}
                >
                   <span className="truncate">{station.stationCode}</span>
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
