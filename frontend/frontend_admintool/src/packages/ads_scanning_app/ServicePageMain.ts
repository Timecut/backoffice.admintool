import { CalendarEvent, CalendarEventCropped, CropCategory, UiReactController } from "./UiReactController";
import { startOfMonth, endOfMonth, formatISO } from 'date-fns';

import Konva from 'konva'

export class ServicePageMain {
    private stage: Konva.Stage | null = null;
    private layer: Konva.Layer | null = null;
    private image: Konva.Image | null = null;
    private cropRect: Konva.Rect | null = null;
    canvasRef: HTMLCanvasElement | null = null;
    canvasDivRef: HTMLDivElement | null = null;

    stageRef: Konva.Stage | null = null;
    baseLayerRef: Konva.Layer | null = null;
    bgRectRef: Konva.Rect | null = null;
    croppingBoxRef: Konva.Rect | null = null;
    transformerCroppingBoxRef: Konva.Transformer | null = null;
    transformerLayerRef: any;
    aspectRatio: number = 1;
    maskRef: any;
    konvaImageRef: Konva.Image | null = null;

    constructor(private uiReactController: UiReactController) { }

    private refreshContext() {
        this.uiReactController.refreshContext();
    }

    getTestApiData = async () => {
        console.log("getTestApiData")
        this.uiReactController.serviceApi.api_get_calendar_data();
    }

    onStartPageMain = async () => {
        this.uiReactController.serviceApi.sendPosthogEvent("AdsScanningApp::onStartPageMain")
        console.log("onStartPageMain")
    }

    public async fetchEvents(startAt: string, endAt: string) {
        const dataRef = this.uiReactController.dataRef.pageMain;
        dataRef.calendarLoadStatus = "pending"
        this.refreshContext()

        try {
            // const response = await fetch(`/api/events?startAt=${startAt}&endAt=${endAt}`);
            // const events: CalendarEvent[] = await response.json();
            const events = await getMockedEvents(startAt, endAt);
            dataRef.events = events;
            dataRef.calendarLoadStatus = "success"
            this.refreshContext();
            setTimeout(() => {
                dataRef.calendarLoadStatus = "idle"
                this.refreshContext();
            }, 5000);
        } catch (err) {
            dataRef.calendarLoadStatus = "error"
            this.refreshContext();
        }
    }

    public fetchEventsForMonth(date: Date) {
        const startAt = formatISO(startOfMonth(date), { representation: 'complete' });
        const endAt = formatISO(endOfMonth(date), { representation: 'complete' });
        // const startAt = formatDate(new Date(date.getFullYear(), date.getMonth(), 1));
        // const endAt = formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
        this.fetchEvents(startAt, endAt);
    }

    public selectDate(date: Date) {
        const dataRef = this.uiReactController.dataRef.pageMain;
        dataRef.selectedDate = date;
        dataRef.selectedEvent = undefined;
        this.refreshContext();
    }

    public selectEvent(eventId: string) {
        const dataRef = this.uiReactController.dataRef.pageMain;
        const event = dataRef.events.find(e => e.id === eventId);
        dataRef.selectedEvent = event;
        this.refreshContext();

    }

    public getEventsByDay(date: Date): CalendarEvent[] {
        const dataRef = this.uiReactController.dataRef.pageMain;
        const dayString = date.toDateString();
        return dataRef.events.filter(event => new Date(event.date).toDateString() === dayString);
    }

    public handleActiveStartDateChange(activeStartDate: Date | null) {
        if (activeStartDate === null) {
            throw new Error("activeStartDate === null")
        }
        this.fetchEventsForMonth(activeStartDate);
    }

    public getTileClassName = ({ date, view }: { date: Date; view: string }): string | null => {
        if (view !== 'month') return null;

        // const dateString = date.toISOString().split('T')[0];
        // const event = events.find(e => e.date.split('T')[0] === dateString);

        // if (event) {
        // switch (event.status) {
        //     case 'pending':
        //         return 'pending'; // Czarny
        //     case 'done':
        //         return 'done'; // Zielony
        //     case 'error':
        //         return 'error'; // Czerwony
        // }
        // }
        return 'default'; // Domyślny (czarny)
    }

    public setCanvasRef(canvasDivRef: HTMLDivElement) {
        this.canvasDivRef = canvasDivRef
        this.initCropping();
        const dataRef = this.uiReactController.dataRef.pageMain;
        if (dataRef.selectedEvent?.thumbUrl !== undefined) {
            this.loadImage(dataRef.selectedEvent?.thumbUrl, dataRef.selectedEvent?.cropped);
        } else {
            if (this.konvaImageRef !== null) {
                this.konvaImageRef.destroy();
                this.konvaImageRef = null;
                this.baseLayerRef!.batchDraw();
            }
        }
    }

    public initCropping() {
        const _canvasDivRef = this.canvasDivRef!;
        this.stageRef = new Konva.Stage({
            container: _canvasDivRef,
            width: 600,
            height: 600,
        });

        this.baseLayerRef = new Konva.Layer();

        const transformerLayer = new Konva.Layer();
        this.transformerLayerRef = transformerLayer;
        this.stageRef.add(this.baseLayerRef, transformerLayer);

        const rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.stageRef.width(),
            height: this.stageRef.height(),
            fill: "#ffffff",
            draggable: false,
        });
        this.bgRectRef = rect;
        this.baseLayerRef.add(rect);
        this.baseLayerRef.draw();

        const croppingBox = new Konva.Rect({
            x: 10,
            y: 10,
            width: 120,
            height: 80 / this.aspectRatio,
            fill: 'rgba(255,255,255,0.0)',
            draggable: true,
        });
        this.croppingBoxRef = croppingBox;
        this.baseLayerRef.add(croppingBox);

        const mask = new Konva.Shape({
            sceneFunc: (ctx, shape) => {
                if (this.transformerCroppingBoxRef === null) {
                    return;
                }
                if (this.stageRef === null) {
                    return;
                }
                ctx.beginPath();
                ctx.rect(0, 0, this.stageRef!.width(), this.stageRef!.height());

                ctx.rect(
                    this.transformerCroppingBoxRef!.x(),
                    this.transformerCroppingBoxRef!.y(),
                    this.transformerCroppingBoxRef!.width(),
                    this.transformerCroppingBoxRef!.height()
                );

                ctx.fillStyle = 'black';
                ctx.fill('evenodd');

                ctx.fillStrokeShape(shape);
            },
            opacity: 0.4,
            listening: false, 
        });
        this.maskRef = mask;
        this.baseLayerRef.add(mask);

        const transformerCroppingBox = new Konva.Transformer({
            nodes: [croppingBox],
            keepRatio: false,
            rotateEnabled: false,
            enabledAnchors: [
                'top-left', 'top-right',
                'bottom-left', 'bottom-right'
            ],
            boundBoxFunc: (oldBox, newBox) => {
                const image = this.konvaImageRef;
                if (image === null) {
                    return {
                        height: 20,
                        width: 20,
                        rotation: 0,
                        x: 0,
                        y: 0,
                    };
                }

                const imageX = image.x();
                const imageY = image.y();
                const imageWidth = image.width() * image.scaleX();
                const imageHeight = image.height() * image.scaleY();

                const minX = imageX;
                const minY = imageY;
                const maxX = imageX + imageWidth;
                const maxY = imageY + imageHeight;

                if (newBox.x < minX) newBox.x = minX;
                if (newBox.y < minY) newBox.y = minY;
                if (newBox.x + newBox.width > maxX) {
                    newBox.width = maxX - newBox.x;
                }
                if (newBox.y + newBox.height > maxY) {
                    newBox.height = maxY - newBox.y;
                }

                const minSize = 10; 
                if (newBox.width < minSize) newBox.width = minSize;
                if (newBox.height < minSize) newBox.height = minSize;

                return newBox;
            },
        });
        this.transformerLayerRef!.add(transformerCroppingBox);
        this.transformerLayerRef!.draw();
        this.transformerCroppingBoxRef = transformerCroppingBox;


        mask.moveToTop();
        croppingBox.moveToTop();
        transformerCroppingBox.moveToTop();

        this.baseLayerRef!.batchDraw();
        this.transformerLayerRef!.batchDraw();

        croppingBox.on("dragmove transform touchmove", this.onCropMove);
        croppingBox.on("dragend transformend touchend", () => this.onCropEnd());
        transformerCroppingBox.on('transform', this.onCropMove);

        transformerCroppingBox.on('dragmove', () => {
            const croppingBox = this.croppingBoxRef!; 
            const image = this.konvaImageRef!;

            const imageX = image.x();
            const imageY = image.y();
            const imageWidth = image.width() * image.scaleX();
            const imageHeight = image.height() * image.scaleY();

            const minX = imageX;
            const minY = imageY;
            const maxX = imageX + imageWidth;
            const maxY = imageY + imageHeight;

            const boxX = croppingBox.x();
            const boxY = croppingBox.y();
            const boxWidth = croppingBox.width() * croppingBox.scaleX();
            const boxHeight = croppingBox.height() * croppingBox.scaleY();

            if (boxX < minX) {
                croppingBox.x(minX);
            }
            if (boxY < minY) {
                croppingBox.y(minY);
            }
            if (boxX + boxWidth > maxX) {
                croppingBox.x(maxX - boxWidth);
            }
            if (boxY + boxHeight > maxY) {
                croppingBox.y(maxY - boxHeight);
            }

            this.baseLayerRef!.batchDraw();
        });
    }

    addImageToKonva = async (
        imageObj: HTMLImageElement,
        cropped?: CalendarEventCropped | null
    ) => {
        if (this.konvaImageRef !== null) {
            this.konvaImageRef.destroy();
            this.konvaImageRef = null;
            this.baseLayerRef!.batchDraw();
        }

        const stageWidth = this.stageRef!.width() - this.stageRef!.width() * 0.1;
        const stageHeight = this.stageRef!.height() - this.stageRef!.height() * 0.1;

        const aspectRatio = imageObj.width / imageObj.height;
        let newWidth, newHeight;
        if (stageWidth / stageHeight > aspectRatio) {
            newHeight = stageHeight;
            newWidth = stageHeight * aspectRatio;
        } else {
            newWidth = stageWidth;
            newHeight = stageWidth / aspectRatio;
        }

        const newX = (stageWidth - newWidth) / 2;
        const newY = (stageHeight - newHeight) / 2;

        const konvaImage = new Konva.Image({
            image: imageObj,
            x: newX,
            y: newY,

            width: newWidth,
            height: newHeight,

            draggable: false,
        });
        konvaImage.setAttr("customUUID", null);
        konvaImage.setAttr("baseWidth", newWidth);
        konvaImage.setAttr("baseHeight", newHeight);
        konvaImage.setAttr("baseX", newX);
        konvaImage.setAttr("baseY", newY);
        konvaImage.setAttr('stroke', 'black'); 
        konvaImage.setAttr('strokeWidth', 1);
        this.baseLayerRef!.add(konvaImage);

        this.maskRef!.moveToTop();
        this.croppingBoxRef!.moveToTop();
        this.transformerCroppingBoxRef!.moveToTop();
        this.konvaImageRef = konvaImage;

        this.baseLayerRef!.batchDraw();
        this.transformerLayerRef!.batchDraw();

        const croppingBox = this.croppingBoxRef!; 
        croppingBox?.x(cropped?.x ?? newX)
        croppingBox?.y(cropped?.y ?? newY)
        croppingBox?.width(cropped?.w ?? 100)
        croppingBox?.height(cropped?.h ?? 100)
        this.baseLayerRef!.batchDraw();
        this.transformerLayerRef!.batchDraw()
        this.transformerCroppingBoxRef!.fire('dragmove', {});
    }

    onCropMove = async () => {
        this.baseLayerRef!.batchDraw();
        this.transformerLayerRef!.batchDraw();
    }

    onCropEnd = async () => { }

    public uploadImage(file: File) {
        const dataRef = this.uiReactController.dataRef.pageMain;
        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target!.result as string;
            this.loadImage(url);
            if (dataRef.selectedEvent !== undefined) {
                dataRef.selectedEvent.thumbUrl = url;
                this.refreshContext();
            }
        };
        reader.readAsDataURL(file);
    }

    public cropImage() {
        if (this.image && this.cropRect) {
            const cropX = this.cropRect.x();
            const cropY = this.cropRect.y();
            const cropWidth = this.cropRect.width();
            const cropHeight = this.cropRect.height();
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = cropWidth;
            tempCanvas.height = cropHeight;
            const ctx = tempCanvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(
                    this.image.image() as HTMLImageElement,
                    cropX,
                    cropY,
                    cropWidth,
                    cropHeight,
                    0,
                    0,
                    cropWidth,
                    cropHeight
                );
                const croppedUrl = tempCanvas.toDataURL();
                const dataRef = this.uiReactController.dataRef.pageMain;
                if (dataRef.selectedEvent) {
                    dataRef.selectedEvent.thumbUrl = croppedUrl;
                    this.loadImage(croppedUrl);
                    this.refreshContext();
                }
            }
        }
    }

    private loadImage(url: string, cropped?: CalendarEventCropped | null) {
        const imageObj = new Image();
        imageObj.onload = () => {
            this.addImageToKonva(imageObj, cropped)
        };
        imageObj.src = url;
    }

    public setCropCategory(category: CropCategory) {
        const dataRef = this.uiReactController.dataRef.pageMain;
        dataRef.cropCategory = category;
        this.refreshContext();
    }

    public setDidNotFindAds(value: boolean) {
        const dataRef = this.uiReactController.dataRef.pageMain;
        dataRef.didNotFindAds = value;
        this.refreshContext();
    }

    public saveCroppedImage = async () => {

        console.log("saveCroppedImage")
        const dataRef = this.uiReactController.dataRef.pageMain;
        if (dataRef.selectedEvent === undefined) return;

        dataRef.saveStatus = 'saving';
        this.refreshContext();

        const { x, y, width, height } = this.croppingBoxRef!.getAttrs();
        const eventId = dataRef.selectedEvent.id;
        const originalImageBase64 = this.konvaImageRef || '';
        const cropData = { x, y, width, height };
        const category = dataRef.cropCategory;
        const didNotFindAds = dataRef.didNotFindAds ?? undefined;

        console.log("saveCroppedImage::send request with data", {
            didNotFindAds,
            category,
            cropData,
            originalImageBase64,
            eventId
        })

        try {
            setTimeout(() => {
                dataRef.saveStatus = 'success';
                this.refreshContext();
            }, 3000)
            // const response = await fetch('/api/update-event', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         eventId,
            //         originalImageBase64,
            //         cropData,
            //         category,
            //         didNotFindAds,
            //     }),
            // });

            // if (response.ok) {
            //     // const updatedEvent = await response.json();
            //     // Aktualizacja statusu wydarzenia w data.events
            //     // const eventIndex = this.data.events.findIndex(e => e.id === updatedEvent.id);
            //     // if (eventIndex !== -1) {
            //     //     this.data.events[eventIndex] = updatedEvent; // Backend zwraca zaktualizowane dane, w tym nowy status
            //     // }
            //     dataRef.saveStatus = 'success';
            // } else {
            //     dataRef.saveStatus = 'error';
            // }
        } catch (error) {
            dataRef.saveStatus = 'error';
            this.refreshContext();
        }

    }

}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}


export const getMockedEvents = async (startAt: string, endAt: string): Promise<CalendarEvent[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Przykładowe dane mockowe
    const mockEvents: CalendarEvent[] = [
        {
            id: "evt_001",
            scannedStatus: "done",
            date: "2025-02-01T10:00:00Z",
            thumbUrl: "https://goods-photos.static1-sima-land.com/items/6256793/2/700-nw.jpg",
            cropped: {
                x: 200,
                y: 200,
                w: 100,
                h: 100
            }
        },
        {
            id: "evt_003",
            scannedStatus: "pending",
            date: "2025-02-02T09:15:00Z"
        },
        {
            id: "evt_0020a",
            scannedStatus: "done",
            date: "2025-02-03T14:30:00Z",
            thumbUrl: "https://i.pinimg.com/originals/8a/1e/77/8a1e77dc4bb34fd3e000d8b4ec3206b2.jpg",
            cropped: {
                x: 400,
                y: 400,
                w: 50,
                h: 100
            }
        },
        {
            id: "evt_0020b",
            scannedStatus: "pending",
            date: "2025-02-03T14:32:00Z"
        },
        {
            id: "evt_0001b",
            scannedStatus: "done",
            date: "2025-01-03T14:32:00Z",
            thumbUrl: "https://tvorcha.com/image/catalog/img_catalog/32026_2.jpg",
            cropped: {
                x: 300,
                y: 300,
                w: 50,
                h: 20
            }
        },
        {
            id: "evt_0001c",
            scannedStatus: "pending",
            date: "2025-01-03T14:32:00Z",
        },
    ];

    // Filtrowanie wydarzeń w zakresie dat
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    return mockEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= startDate && eventDate <= endDate;
    });
}