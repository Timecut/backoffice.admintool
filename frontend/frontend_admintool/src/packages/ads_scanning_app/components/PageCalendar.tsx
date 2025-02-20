import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { EventTable } from './EventTable';
import { useData } from '../useDataContext';
import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';


import { styled } from "goober";
import stylesFile from "./PageCalendar.css?raw";
import { endOfMonth, startOfYear } from 'date-fns';
const DivStyles = styled('div')`
    ${stylesFile}
`;


export const PageCalendar: FunctionComponent = () => {
    const { data, uiReactController } = useData();

    useEffect(() => {
        uiReactController.servicePageMain.fetchEventsForMonth(new Date());
    }, [])
    return (
        <div>
            <DivStyles>
                <Calendar
                    locale='sv'
                    onChange={(value: any, _: any) => {
                        uiReactController.servicePageMain.selectDate((value as Date))
                    }}
                    value={data.pageMain.selectedDate}
                    onActiveStartDateChange={({ activeStartDate }) => {
                        uiReactController.servicePageMain.handleActiveStartDateChange(activeStartDate)
                    }}
                    maxDate={endOfMonth(new Date())}
                    tileClassName={uiReactController.servicePageMain.getTileClassName}
                    tileContent={({ date, view }) => {
                        if (view === 'month') {
                            const dayEvents = uiReactController.servicePageMain.getEventsByDay(date);
                            const pendingEvents = dayEvents.filter((e) => e.scannedStatus === "pending")
                            const anyPendingEvents = pendingEvents.length > 0;
                            return dayEvents.length > 0 ? <div class="badge-wrapper">
                                <div class={`badge-item ${anyPendingEvents ? "text-red" : "text-green"}`}>
                                    {dayEvents.length}
                                </div>
                            </div> : null;
                        }
                        return null;
                    }}
                />
                <EventTable events={uiReactController.servicePageMain.getEventsByDay(data.pageMain.selectedDate)} />
            </DivStyles>
        </div>
    );
};