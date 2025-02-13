import { render, h } from 'preact';
import { setup } from 'goober';

export class ServiceReactManager {
    private rootUiReactElement?: HTMLDivElement;
    rootHtmlElement: HTMLDivElement;
    dataRef: any;
    uiReactControllerRef: any;
    uiReactComponent: any;

    constructor(
        rootHtmlElement: HTMLDivElement,
        dataRef: any,
        uiReactControllerRef: any,
        uiReactComponent: any
    ) {
        this.uiReactControllerRef = uiReactControllerRef;
        this.dataRef = dataRef;
        this.uiReactComponent = uiReactComponent;
        this.rootHtmlElement = rootHtmlElement;
    }

    async prepareDomElements() {
        if (this.rootHtmlElement === undefined) {
            console.warn("start: rootHtmlElement is undefined");
            return false;
        }
        const rootUiReactElement = document.createElement("div");
        rootUiReactElement.classList.add("ui-react-module");
        this.rootUiReactElement = rootUiReactElement;
        this.rootHtmlElement.appendChild(rootUiReactElement);

        // const montserratUrl = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap';
        // this.loadFontIfMissing('Montserrat', montserratUrl);

        // const openSansUrl = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap';
        // this.loadFontIfMissing('Open Sans', openSansUrl);
        return true;
    }

    public  loadFontIfMissing = (fontName: string, fontUrl: string) => {
        const link = document.createElement('link');
        link.href = fontUrl;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    };

    start = async () => {
        if (this.rootUiReactElement === undefined) {
            console.warn("start: this.rootUiReactElement");
            return false;
        }
        if (this.uiReactControllerRef === undefined) {
            console.warn("start: uiReactControllerRef is undefined");
            return false;
        }
        this.dataRef.lastChangeDate = new Date().toISOString();
        setup(h);
        const reactComponent = h(this.uiReactComponent, {
            uiReactController: this.uiReactControllerRef
        });
        render(h("div", { children: [reactComponent] }), this.rootUiReactElement);

        try {
            const event = new CustomEvent('App_started');
            document.body.dispatchEvent(event);
        } catch (err) {
            console.warn("start:: ERROR: ", err);
        }

        return true;
    }

    async closeApp(): Promise<void> {
        await this.removeReactElement();
        await this.addButtonShowAppAgain();
    }

    async addButtonShowAppAgain(): Promise<boolean> {
        if (this.rootUiReactElement === undefined) {
            console.warn("stop: this.rootUiReactElement is undefined");
            return false;
        }

        const buttonShowAgainApp = document.createElement("button");
        buttonShowAgainApp.classList.add("show-app-again-button");
        buttonShowAgainApp.innerText = "Show app again";
        buttonShowAgainApp.onclick = async () => {
            buttonShowAgainApp.remove();
        };
        this.rootHtmlElement?.appendChild(buttonShowAgainApp);
        return true;
    }

    async removeReactElement() {
        if (this.rootUiReactElement === undefined) {
            console.warn("stop: this.rootUiReactElement is undefined");
            return false;
        }
        render(null, this.rootUiReactElement);
        this.rootUiReactElement.remove();
        this.dataRef.currentPageName = undefined;
        return true;
    }
}
