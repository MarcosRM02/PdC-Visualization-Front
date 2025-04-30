export interface IParticipant {
  id: number;
  code: string;
  personalDataId: number;
}

export interface IParticipantCardProp {
  participants: IParticipant[];
  onParticipantDeleted: () => void;
  onParticipantEdited: () => void;
}

export interface IParticipantSingleCardProps {
  participants: IParticipant;
  onParticipantDeleted: () => void;
  onParticipantEdited: () => void;
}

export interface IUserModalProps {
  user: any;
  onClose: () => void;
}
