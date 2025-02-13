
import { ServiceListeners } from "./ServiceListeners";
import { ServiceApi } from "./ServiceApi";
import { ServicePageMain } from "./ServicePageMain";
import { InitAppProps } from "./AdsScanningApp";


export type UiReactControllerData = { }
export type Listener<X> = (data: X) => void;
export type ContextListener = Listener<UiReactControllerData>;

export class UiReactController {
    serviceListeners: ServiceListeners;
    dataRef: UiReactControllerData;
    initProps: InitAppProps;
    serviceApi: ServiceApi;
    servicePageMain: ServicePageMain;

    constructor(initProps: InitAppProps) {
        this.dataRef = {
            
        }
        this.initProps = initProps;
        this.serviceListeners = new ServiceListeners(this, this.dataRef);
        this.serviceApi = new ServiceApi(this);
        this.servicePageMain = new ServicePageMain(this);
    }

    onStartPageMain = async () => {
        let useDebug = false;
        if (window.location.hostname === "localhost") {
            useDebug = true;
        }

        if (useDebug) {
            await (this as any).debugStartupProcess();
        } else {
            await this.servicePageMain.onStartPageMain();
        }
    };

    debugStartupProcess = async () => {
        // await this.servicePageMain.getTestApiData();
    }

    getData = () => this.dataRef ?? {};
    subscribe = (listener: any) => this.serviceListeners.subscribe(listener);
    unsubscribe = (listener: any) => this.serviceListeners.unsubscribe(listener);
    refreshSubscribersUi = () => this.serviceListeners.refreshSubscribersUi();
}