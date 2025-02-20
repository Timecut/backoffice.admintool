
import { useEffect, useRef } from 'preact/hooks';
import { useData } from '../useDataContext';
import { FunctionComponent } from 'preact';
import { CropCategory } from '../UiReactController';

export const EventDetails: FunctionComponent = () => {
    const { data, uiReactController } = useData();
    const canvasDivRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (canvasDivRef.current) {
            uiReactController.servicePageMain.setCanvasRef(canvasDivRef.current);
        }
    }, [canvasDivRef]);

    const handleFileChange = (e: any) => {
        const file = e.target?.files?.[0];
        if (file) {
            uiReactController.servicePageMain.uploadImage(file);
        }
    };

    const event = data.pageMain.selectedEvent;
    if (!event) return null;

    return (
        <div>
            <h2>Annons</h2>

            <p><strong>Nr.</strong> {event.id}</p>
            <p><strong>Införande</strong> - </p>
            <p><strong>Placering</strong> - </p>
            <p><strong>Orginal</strong> - </p>
            <p><strong>Status:</strong> {event.scannedStatus}</p>

            <p><strong>Pick file</strong></p>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} />
                <button onClick={() => uiReactController.servicePageMain.cropImage()}>Ladda upp</button>
            </div>


            <p><strong>Crop image</strong> </p>
            <div ref={canvasDivRef} style={{ width: "600px", height: "600px", border: "1px solid #000" }} />


            <div>
                <p><strong>Spara markering för</strong> </p>
                <label>
                    <input
                        type="radio"
                        name="category"
                        value="Annons"
                        checked={data.pageMain.cropCategory === CropCategory.ad}
                        onChange={() => uiReactController.servicePageMain.setCropCategory(CropCategory.ad)}
                    />
                    Annons
                </label>
                <label>
                    <input
                        type="radio"
                        name="category"
                        value="Sidhuvud/fot"
                        checked={data.pageMain.cropCategory === CropCategory.headline}
                        onChange={() => uiReactController.servicePageMain.setCropCategory(CropCategory.headline)}
                    />
                    Sidhuvud/fot
                </label>
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={data.pageMain.didNotFindAds}
                        onChange={(e: any) => uiReactController.servicePageMain.setDidNotFindAds(e.target.checked ?? undefined)}
                    />
                    Annons ej införd i tidning
                </label>
            </div>

            <button onClick={() => uiReactController.servicePageMain.saveCroppedImage()}>Spara markering</button>
            <br />
            <br />
            {data.pageMain.saveStatus === 'saving' && <p class="text-gray">saving...</p>}
            {data.pageMain.saveStatus === 'success' && <p class="text-green">saved with success!</p>}
            {data.pageMain.saveStatus === 'error' && <p class="text-red">saved with error.</p>}
        </div>
    );
};