import { UiReactController } from "./UiReactController";

export class ServicePageMain {
    constructor(private uiReactController: UiReactController) { }

    getTestApiData = async () => {
        console.log("getTestApiData")
        this.uiReactController.serviceApi.api_get_calendar_data();
    }
    
    onStartPageMain = async () => {
        this.uiReactController.serviceApi.sendPosthogEvent("AdsScanningApp::onStartPageMain")
        console.log("onStartPageMain")
    }
    
}