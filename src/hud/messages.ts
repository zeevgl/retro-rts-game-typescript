export enum MessageType {
  ERROR = "error",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
}

export interface Message {
  text: string;
  type: MessageType;
}

export interface Messages {
  [name: string]: Message;
}

export const Messages: Messages = {
  unavailable: {
    text: "Unit unavailable",
    type: MessageType.ERROR,
  },
  insufficientFunds: {
    text: "Insufficient funds",
    type: MessageType.ERROR,
  },
  buildingInProgress: {
    text: "unable to comply building in progress",
    type: MessageType.ERROR,
  },
  trainingInProgress: {
    text: "unable to comply training in progress",
    type: MessageType.ERROR,
  },
};
