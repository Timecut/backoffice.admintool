import { ContextListener, UiReactController, UiReactControllerData } from './UiReactController';

export class ServiceListeners {
    private listeners: ContextListener[] = [];

    private dataRef: UiReactControllerData;
    uiReactController: UiReactController;

    constructor(
        uiReactController: UiReactController,
        dataRef: UiReactControllerData,
    ) {
        this.uiReactController = uiReactController;
        this.dataRef = dataRef;
    }

    public subscribe(listener: ContextListener): void {
        this.listeners.push(listener);
    }

    public unsubscribe(listener: ContextListener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    public refreshSubscribersUi(): void {
        this.listeners.forEach(listener => listener(this.dataRef));
    }
}
