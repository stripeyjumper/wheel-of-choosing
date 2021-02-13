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
  name?: string;
  segments: WheelSegment[];
}

export interface WheelManagerState {
  wheels: Wheel[];
  currentWheelId: string;
  isSpinning: boolean;
}

export interface CreateSegmentAction extends Action {
  type: "CREATE_SEGMENT";
  wheelId: string;
  label: string;
}

export interface UpdateSegmentAction extends Action {
  type: "UPDATE_SEGMENT";
  wheelId: string;
  id: string;
  label: string;
}

export interface DeleteSegmentAction extends Action {
  type: "DELETE_SEGMENT";
  wheelId: string;
  id: string;
}
