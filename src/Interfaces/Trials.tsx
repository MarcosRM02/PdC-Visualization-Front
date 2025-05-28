export interface ITrial {
  id?: number;
  code: string | null;
  date?: string | null;
  description?: string | null;
  annotation?: string | null;
}

export interface ITrialCardProps {
  trials: ITrial[];
  experimentId: number;
  onTrialEdited: () => void;
  onTrialDeleted: () => void;
}

export interface ITrialSingleCardProps {
  trials: any;
  experimentId: number;
  onTrialEdited: () => void;
  onTrialDeleted: () => void;
}

export interface ITemplate {
  name: string;
  description?: string | null;
}

export interface ITrialTemplateCardProps {
  trials: ITrial[];
  onTrialEdited: () => void;
  onTrialDeleted: () => void;
}

export interface ITrialTemplateSingleCardProps {
  trials: any;
  onTrialEdited: () => void;
  onTrialDeleted: () => void;
}