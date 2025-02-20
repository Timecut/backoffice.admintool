import { EventDetails } from './EventDetails';
import { useData } from '../useDataContext';
import { Fragment, FunctionComponent } from 'preact';
import { CalendarEvent } from '../UiReactController';

interface EventTableProps {
    events: CalendarEvent[];
}

export const EventTable: FunctionComponent<EventTableProps> = ({ events }) => {
    const { data, uiReactController } = useData();
    return (
        <div>
            <br />
            {data.pageMain.calendarLoadStatus !== "idle" ? (
                <Fragment>
                    {data.pageMain.calendarLoadStatus === 'pending' && <p class="text-gray">laddar...</p>}
                    {data.pageMain.calendarLoadStatus === 'error' && <p class="text-red">laddades med fel</p>}
                    {data.pageMain.calendarLoadStatus === 'success' && <p class="text-green">lästes in med framgång</p>}
                </Fragment>
            ) : null}
            <br />

            {events.length === 0 && <p class="text-red">listan är tom</p>}


            <table style={{ width: "600px" }}>
                <thead>
                    <tr>
                        <th>Nr.</th>
                        <th>Tidning</th>
                        <th>Placering</th>
                        <th>Företag</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event.id}>
                            <td>{event.id}</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>{event.scannedStatus === "done" ? <p style={{ margin: "0" }} class="text-green">Klar</p> : <p style={{ margin: "0" }} class="text-red">Väntande</p>}</td>
                            <td>
                                <button onClick={() => uiReactController.servicePageMain.selectEvent(event.id)}>
                                    Välj
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.pageMain.selectedEvent && <EventDetails />}
        </div>
    );
};