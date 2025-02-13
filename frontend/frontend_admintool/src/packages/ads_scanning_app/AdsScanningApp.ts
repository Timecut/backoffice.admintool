
import { ServiceReactManager } from "./ServiceReactManager";
import { UiReactController } from "./UiReactController";

export type InitAppProps = {
    apiHost: string | null;
    userUuid: string | null;
    userJwtToken: string | null;
};

export class AdsScanningApp {
    public loggerEnabled: boolean = true;
    public factories: any;
    public appController: any | undefined;
    public rootCssSelector: string | undefined;
    public rootElement: HTMLElement | null | undefined;

    constructor(factories?: any) {
        this.factories = factories;
    }

    readTutorialPropsFromElement = (element: HTMLElement): InitAppProps => {
        const result: InitAppProps = {
            apiHost: element.getAttribute("data-api-host") ?? "/",
            userUuid: element.getAttribute("data-user-uuid"),
            userJwtToken: element.getAttribute("data-token"),
        };
        return result;
    }

    public async initialize(
        _rootCssSelector?: string,
        _rootElement?: HTMLElement
    ): Promise<void> {

        const _defaultRootCssSelector = ".ads_scanning_app";
        this.rootCssSelector = _rootCssSelector ?? _defaultRootCssSelector;
        if (_rootElement === undefined || _rootElement === null) {
            const foundHtmlElement = document.querySelector(
                _rootCssSelector ?? _defaultRootCssSelector
            );
            if (foundHtmlElement !== null) {
                this.rootElement = foundHtmlElement as HTMLElement;
            }
        } else {
            this.rootElement = _rootElement;
        }

        if (this.rootElement === undefined || this.rootElement === null) {
            throw new Error(
                `Root element not found with selector=${this.rootCssSelector}`
            );
        }

        let statusInfoEl: HTMLDivElement | null = null;

        try {
            this.loggerEnabled === true && console.log("initialize - start");

            statusInfoEl = this.rootElement.querySelector(".status-info");

            if (statusInfoEl === null) {
                statusInfoEl = document.createElement("div");
                statusInfoEl.classList.add("status-info");
                this.rootElement.appendChild(statusInfoEl);
            }

            statusInfoEl.innerHTML = "...";

            const _appInitProps = this.readTutorialPropsFromElement(this.rootElement);

            this.loggerEnabled === true && console.log(
                "initialize - _appInitProps",
                _appInitProps
            );

            const _uiReactController = new UiReactController(_appInitProps);
            const getUiReactComponent = async () => {
                const code = await import("./components/IndexUiReactModule");
                return code.default;
            }
            const uiReactComponent = await getUiReactComponent();

            const reactManager = new ServiceReactManager(this.rootElement as any, _uiReactController.getData, _uiReactController, uiReactComponent);

            await reactManager.prepareDomElements();

            await reactManager.start();

            _uiReactController.onStartPageMain();

            statusInfoEl.innerHTML = "loaded....";
            statusInfoEl.remove();

            this.loggerEnabled === true && console.log("AdsScanningApp_initialized");
            const event = new CustomEvent("AdsScanningApp_initialized");
            document.body.dispatchEvent(event);

            this.loggerEnabled === true && console.log("initialize - done");
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const msg: string = error?.toString() ?? "";
            this.loggerEnabled === true && console.error(`initialize - error: ${msg}`);
            if (statusInfoEl !== null) {
                statusInfoEl.innerHTML = `Error: ${msg}`;
            }
        }
    }
}