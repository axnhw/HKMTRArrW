"use client";

import type { MergedArrival } from "@/types/mtr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Train, Clock, RefreshCw, ArrowLeft } from "lucide-react";
import * as React from "react";
import { hexToRgba } from "@/lib/utils";

interface EtaDisplayProps {
  stationName: string;
  currentTime: string | null;
  arrivals: MergedArrival[];
  isLoading: boolean;
  lineColor: string;
  onRefresh: () => void;
  onBack: () => void;
}

const EtaDisplay: React.FC<EtaDisplayProps> = ({
  stationName,
  currentTime,
  arrivals,
  isLoading,
  lineColor,
  onRefresh,
  onBack
}) => {
    const [displayTime, setDisplayTime] = React.useState("--:--:--");

    React.useEffect(() => {
      let timer: NodeJS.Timeout | null = null;
  
      if (currentTime) {
        let time = new Date(currentTime);
        
        const updateClock = () => {
          time.setSeconds(time.getSeconds() + 1);
          setDisplayTime(time.toLocaleTimeString('en-GB'));
        };
  
        // Set initial time immediately
        setDisplayTime(time.toLocaleTimeString('en-GB'));
        
        // Then start the interval
        timer = setInterval(updateClock, 1000);
      } else {
        setDisplayTime("--:--:--");
      }
  
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    }, [currentTime]);

  const renderArrivals = () => {
    if (isLoading && arrivals.length === 0) {
      return Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-4 px-2 border-b border-gray-700">
          <Skeleton className="h-6 w-2/5 bg-gray-600" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-12 bg-gray-600" />
            <Skeleton className="h-6 w-32 bg-gray-600" />
          </div>
        </div>
      ));
    }

    if (arrivals.length === 0) {
      return (
        <div className="text-center py-10 text-gray-400">
          <p>No train data available for this station.</p>
          <p>This may be the last station on the line.</p>
        </div>
      );
    }

    return arrivals.map((arrival, index) => {
      const countdownText = parseInt(arrival.countdown) <= 1 ? "Arriving" : `${arrival.arrivalTime} (${arrival.countdown} min)`;
      return (
        <div key={index} className="flex flex-col items-baseline justify-between py-3 px-1 border-b border-gray-700/50 last:border-b-0">
          <div className="flex items-center gap-3 w-full">
            <Train className="w-5 h-5 text-yellow-300" />
            <p className="text-lg font-medium tracking-wide text-white truncate">To {arrival.destination}</p>
          </div>
          <div className="flex items-baseline justify-between w-full mt-1">
             <p className="text-lg font-semibold text-white">
                <span className="text-sm text-gray-400 mr-1">Plat.</span>
                {arrival.platform}
             </p>
            <p className="text-base font-bold text-yellow-300 text-right">{countdownText}</p>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="dark w-full h-screen bg-slate-900 flex flex-col p-2">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-2 px-1" style={{borderColor: hexToRgba(lineColor, 0.3)}}>
        <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:bg-slate-700 hover:text-white mr-1" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-2xl font-bold tracking-tighter text-white truncate">{stationName}</CardTitle>
        </div>
        <div className="flex items-center gap-2 text-lg font-mono text-gray-300 ">
            <Clock className="w-4 h-4"/>
            <span className="text-base">{displayTime}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-1 overflow-y-auto">
        <div className="flow-root">
            {renderArrivals()}
        </div>
      </CardContent>
    </div>
  );
};

export default EtaDisplay;
