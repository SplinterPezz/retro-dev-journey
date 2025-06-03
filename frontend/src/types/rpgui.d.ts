declare global {
  interface Window {
    RPGUI: {
      create: (element: HTMLElement, type: string) => void;
      set_value: (element: HTMLElement, value: any) => void;
      get_value: (element: HTMLElement) => any;
      on_load: (callback: () => void) => void;
    };
  }
}

export {};