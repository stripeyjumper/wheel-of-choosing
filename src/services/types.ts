export interface SegmentInfo {
  id: string;
  label: string;
  removed?: boolean;
}

export interface Action {
  type: string;
}

export interface WheelSegment {
  id: string;
  label: string;
  selected?: boolean;
  removed?: boolean;
  shufflePosition: number;
}

export interface Wheel {
  id: string;
  label?: string;
  segments: WheelSegment[];
  isSpinning: boolean;
}

export interface WheelManagerState {
  wheels: Wheel[];
  selectedWheelIndex: number;
  prevSelectedWheelIndex?: number;
  showDataUrl: boolean;
}

export interface LegacyWheelManagerState {
  wheels: Wheel[];
  selectedWheelId: string;
  isSpinning: boolean;
}
