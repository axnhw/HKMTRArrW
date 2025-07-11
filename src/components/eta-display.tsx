"use client";

import type { MergedArrival } from "@/types/mtr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Train, Clock, RefreshCw } from "lucide-react";
import * as React from "react";
import { hexToRgba } from "@/lib/utils";

interface EtaDisplayProps {
  stationName: string;
  currentTime: string | null;
  arrivals: MergedArrival[];
  isLoading: boolean;
  lineColor: string;
  onRefresh: () => void;
}

const EtaDisplay: React.FC<EtaDisplayProps> = ({
  stationName,
  currentTime,
  arrivals,
  isLoading,
  lineColor,
  onRefresh
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
    if (isLoading) {
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
      const countdownText = parseInt(arrival.countdown) <= 1 ? "Arriving" : `${arrival.arrivalTime} [${arrival.countdown} min]`;
      return (
        <div key={index} className="flex flex-col sm:flex-row items-baseline justify-between py-4 px-2 border-b border-gray-700/50 last:border-b-0 animate-in fade-in duration-500">
          <div className="flex items-center gap-3">
            <Train className="w-6 h-6 text-yellow-300" />
            <div className="flex flex-col">
                 <p className="text-xl md:text-2xl font-medium tracking-wide text-white">To {arrival.destination}</p>
                 <p className="text-base font-semibold text-white sm:hidden">
                    <span className="text-sm text-gray-400 mr-1">Plat.</span>
                    {arrival.platform}
                 </p>
            </div>
          </div>
          <div className="flex items-baseline gap-6 text-right mt-2 sm:mt-0 w-full sm:w-auto justify-end">
            <p className="text-xl md:text-2xl font-semibold text-white hidden sm:block">
              <span className="text-sm text-gray-400 mr-1">Plat.</span>
              {arrival.platform}
            </p>
            <p className="text-lg md:text-xl font-bold text-yellow-300 w-full sm:w-48 text-right">{countdownText}</p>
          </div>
        </div>
      );
    });
  };

  const dynamicCardStyle = {
    backgroundColor: hexToRgba(lineColor, 0.1),
    borderTop: `4px solid ${lineColor}`,
    boxShadow: `0 10px 15px -3px ${hexToRgba(lineColor, 0.2)}, 0 4px 6px -2px ${hexToRgba(lineColor, 0.1)}`
  };


  return (
    <Card className="dark w-full bg-slate-900 border-t-4 shadow-2xl transition-all duration-500" style={{borderColor: lineColor}}>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4" style={{borderColor: hexToRgba(lineColor, 0.3)}}>
        <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tighter text-white">{stationName}</CardTitle>
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-md mt-2 sm:mt-0">
            <div className="flex items-center gap-2 text-lg font-mono text-gray-300 ">
                <Clock className="w-5 h-5"/>
                <span>{displayTime}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:bg-slate-700 hover:text-white" onClick={onRefresh} disabled={isLoading}>
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2 md:p-4">
        <div className="flow-root">
            {renderArrivals()}
        </div>
      </CardContent>
    </Card>
  );
};

export default EtaDisplay;
