export interface ILeftBarProps {
  selectedPanel: string | null;
  togglePanel: (panelId: string) => void;
}
