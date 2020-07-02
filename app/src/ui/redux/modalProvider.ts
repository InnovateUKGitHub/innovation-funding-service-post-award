import React from "react";

interface IModal {
  id: string;
  children: React.ReactNode;
}

export class ModalRegister {
  private readonly modals: Map<string, IModal> = new Map();
  private readonly listeners: Map<string, () => void> = new Map();
  public registerModal(modal: IModal) {
    this.modals.set(modal.id, modal);
    this.alertSubscribers();
  }
  public getModals() {
    return Array.from(this.modals.values());
  }
  public removeModal(id: string) {
    this.modals.delete(id);
    this.alertSubscribers();
  }
  public subscribe(id: string, fn: () => void) {
    this.listeners.set(id, fn);
  }
  private alertSubscribers() {
    Array.from(this.listeners.values()).forEach(x => x());
  }
}

const ModalContext = React.createContext<ModalRegister>(null as any);

export const ModalProvider = ModalContext.Provider;
export const ModalConsumer = ModalContext.Consumer;
