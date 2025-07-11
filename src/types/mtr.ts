export interface TrainArrival {
  ttnt: string; // time to next train in minutes
  valid: 'Y' | 'N';
  plat: string; // platform
  time: string; // ETA timestamp
  source: string;
  dest: string; // destination station code
  seq: string;
}

export interface ArrivalData {
  UP?: (TrainArrival & { direction: 'UP' })[];
  DOWN?: (TrainArrival & { direction: 'DOWN' })[];
}

export interface MtrApiResponse {
  status: 1 | 0;
  message?: string;
  curr_time: string;
  data?: {
    [key: string]: ArrivalData;
  };
  isdelay: 'Y' | 'N';
}

export interface Station {
  stationCode: string;
  stationName: string;
}

export interface Line {
  lineCode: string;
  lineName: string;
  color: string;
  stations: Station[];
}

export interface MergedArrival {
  destination: string;
  platform: string;
  arrivalTime: string;
  countdown: string;
  direction: 'UP' | 'DOWN';
}
