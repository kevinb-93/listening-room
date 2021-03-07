export interface AppContextInterface extends AppContextState {
    actions: { hideDrawer: (hide: boolean) => void };
}

export interface AppContextState {
    isDrawerHidden: boolean;
}
