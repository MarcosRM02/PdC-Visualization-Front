export interface ICreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void; // Callback para notificar al padre
}

export interface IDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void; // Callback para notificar al padre
  id: number;
}

export interface IEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdited: (edited?: any) => void; // Callback para notificar al padre
  id: number;
}
