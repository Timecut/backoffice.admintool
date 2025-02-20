let APP_PATH = "./"
let BUILD_TARGET = "ads_scanning_app"

if (window.location.hostname.includes("mhub.se")) {
    APP_PATH = `https://frontend-admintool.backoffice.mhub.se/${BUILD_TARGET}/`;
} else if (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")) {
    APP_PATH = "./"
}

async function loadModule(moduleName) {
    try {
        const manifestResponse = await fetch(`${APP_PATH}manifest.json`);
        if (!manifestResponse.ok) {
            throw new Error(`HTTP error! status: ${manifestResponse.status}`);
        }

        const manifest = await manifestResponse.json();

        const moduleInfo = manifest[moduleName];
        if (!moduleInfo || !moduleInfo.file) {
            throw new Error('Module path not found in manifest.');
        }

        const modulePath = `${APP_PATH}${moduleInfo.file}`;
        const module = await import(modulePath);
        return module;
    } catch (error) {
        console.error('Failed to load module:', error);
    }
}

loadModule(`src/builds/${BUILD_TARGET}/index.ts`);