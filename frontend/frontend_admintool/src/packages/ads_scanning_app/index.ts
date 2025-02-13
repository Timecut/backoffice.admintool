import { AdsScanningApp } from "./AdsScanningApp";

export const runApp = async () => {
    const _app = new AdsScanningApp();
    await _app.initialize();
    return { app: _app }
}

(window as any).AdsScanningApp = runApp();
