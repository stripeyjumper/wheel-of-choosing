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
  selectedWheelId?: string;
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

export interface ResetWheelAction extends Action {
  type: "RESET_WHEEL";
  id: string;
}

export interface CreateWheelAction extends Action {
  type: "CREATE_WHEEL";
  label: string;
}

export interface UpdateWheelAction extends Action {
  type: "UPDATE_WHEEL";
  id: string;
  label: string;
}

export interface DeleteWheelAction extends Action {
  type: "DELETE_WHEEL";
  id: string;
}

export interface SelectWheelAction extends Action {
  type: "SELECT_WHEEL";
  id: string;
}

export interface UpdateWheelAction extends Action {
  type: "UPDATE_WHEEL";
  id: string;
  label: string;
}
