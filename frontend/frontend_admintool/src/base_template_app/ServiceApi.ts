import axios from 'axios';
import { UiReactController } from './UiReactController';

export class ServiceApi {
    constructor(private uiReactController: UiReactController) { }

    async sendPosthogEvent(
        eventName: string,
        props?: any
    ) {
        if (window.location.hostname === "localhost") {
            console.log("sendPosthogEvent::debug", eventName, props)
            return false;
        }
        try {
            const _posthog = (window as any).posthog;
            if (_posthog !== undefined && _posthog !== null) {
                _posthog?.capture?.(eventName, { ...props });
                // console.log("sendPosthogEvent", eventName, props)
            }
        } catch (err) {
            // console.log("sendPosthogEvent error", eventName, props, err)
        }
    }

    api_get_calendar_data = async () => {
        const apiHost = this.uiReactController.initProps.apiHost ?? "";
        const url = `${apiHost}/api/get-calendar-data`;
        const response = await axios.get<{}>(url, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            }
        });
        return response;
    }
} 