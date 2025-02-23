
import { ServiceListeners } from "./ServiceListeners";
import { ServiceApi } from "./ServiceApi";
import { ServicePageMain } from "./ServicePageMain";
import { InitAppProps } from "./AdsScanningApp";

export interface CalendarEventCropped {
    x: number,
    y: number,
    w: number,
    h: number;
}

export interface CalendarEvent {
    id: string;
    thumbUrl?: string;
    scannedStatus: 'pending' | 'done';
    date: string;
    cropped?: CalendarEventCropped | undefined;
}

export enum CropCategory {
    "ad" = "ad",
    "headline" = "headline"
}

export interface CalendarData {
    events: CalendarEvent[];
    selectedDate: Date;
    selectedEvent?: CalendarEvent;
    calendarLoadStatus: "success" | "error" | "pending" | "idle";
    saveStatus: string;
    cropCategory?: CropCategory
    didNotFindAds?: boolean;
}

export type UiReactControllerData = {
    pageMain: CalendarData;
}
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
            pageMain: {
                calendarLoadStatus: "idle",
                events: [],
                selectedDate: new Date(),
                selectedEvent: undefined,
                cropCategory: CropCategory.ad,
                didNotFindAds: undefined,
                saveStatus: "",
            }
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
    refreshContext = () => this.serviceListeners.refreshContext();
}