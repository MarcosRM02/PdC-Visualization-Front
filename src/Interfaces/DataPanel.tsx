import ReactPlayer from 'react-player';

interface IDataFrameRow {
  [key: string]: number[];
}

export interface IWearableData {
  wearablesId: string;
  wearableType: string;
  dataframe: IDataFrameRow;
  frequency: number;
}

export interface IWearableDataProps {
  wearables: IWearableData[];
  trialId: number;
  experimentId: number;
  participantId: number;
  swId: number;
}

export interface IActionButtonProps {
  onClick: () => void;
  label: string;
  color?: 'blue' | 'red' | 'green' | 'orange';
}

export interface IPlaybackButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

export interface IControlPanelProps {
  videoSrc: string;
  videoName: string;
  playbackRate: number;
  playbackRates: { label: string; rate: number }[];
  changePlaybackRate: (rate: number) => void;
  videoAvailable: boolean;
  handlePlay: () => void;
  isPlaying: boolean;
  handleReset: () => void;
  resetGraphs: () => void;
  updateHz: number;
  handleUpdateHzChange: (newHz: number) => void;
  descargarDatos: () => void;
}

export interface IFloatingWindowProps {
  playerRef1: React.RefObject<any>;
  videoSrc: string;
  playbackRate: number;
  handleProgress: (progress: any) => void;
  handleSeek: (time: number) => void;
  setDuration1: (duration: number) => void;
  playTime: number;
  globalDuration: number;
  playbackRates: any;
  changePlaybackRate: (rate: number) => void;
  videoAvailable: boolean;
  handlePlay: () => void;
  isPlaying: boolean;
  handleReset: () => void;
  resetGraphs: () => void;
  updateHz: number;
  handleUpdateHzChange: (value: number) => void;
  descargarDatosVisibles: any;
  refs: {
    leftPressureSensor: any;
    rightPressureSensor: any;
  };
  leftWearables: any;
  rightWearables: any;
  experimentId: number;
  participantId: number;
  trialId: number;
  swId: number;
  parentRef: React.RefObject<HTMLDivElement>;
  onEnded: () => void;
}

export interface IHeatmapControlPanelProps {
  updateHz: number;
  onUpdateHzChange: (newHz: number) => void;
}

export interface IIconActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  color?: 'blue' | 'red' | 'green' | 'orange';
  tooltip?: string;
}

export interface IPlaybackRateDropdownProps {
  playbackRate: number;
  playbackRates: { label: string; rate: number }[];
  changePlaybackRate: (rate: number) => void;
  videoAvailable: boolean;
  updateHz: number;
  onUpdateHzChange: (newHz: number) => void;
}

export interface ITimeProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export interface IVideoSectionProps {
  playerRef1: React.RefObject<ReactPlayer>;
  videoFile: string;
  playbackRate: number;
  isPlaying: boolean;
  handleProgress: (state: { playedSeconds: number }) => void;
  handleSeek: (newTime: number) => void;
  onDuration1: (duration: number) => void;
  onEnded: () => void;
}
