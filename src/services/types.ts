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
  isSpinning: boolean;
  showDataUrl: boolean;
}

export interface LegacyWheelManagerState {
  wheels: Wheel[];
  selectedWheelId: string;
  isSpinning: boolean;
}