declare global {
  interface Window {
    RPGUI: {
      create: (element: HTMLElement, type: string) => void;
      set_value: (element: HTMLElement, value: unknown) => void;
      get_value: (element: HTMLElement) => unknown;
      on_load: (callback: () => void) => void;
    };
  }
}

export {};