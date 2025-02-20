import { BaseTemplateApp } from "./BaseTemplateApp";

export const runApp = async () => {
    const _app = new BaseTemplateApp();
    await _app.initialize();
    return { app: _app }
}

(window as any).BaseTemplateApp = runApp();
