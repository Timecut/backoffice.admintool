import axios from 'axios';
import { useState } from "preact/hooks";
import { Fragment, FunctionComponent } from "preact";

interface ResponseType {
    success: boolean;
    message: string;
}

const TestComponent: FunctionComponent = () => {
    const [response, setResponse] = useState<string>('');

    const handleClick = async () => {
        try {
            const result = await axios.get<ResponseType>(
                'https://backend-admintool.backoffice.mhub.se/api/test',
                { withCredentials: true }
            );
            setResponse(result.data.message);
        } catch (error) {
            setResponse('Error occurred');
        }
    };

    return (<div>
        <button onClick={handleClick}>Test Connection</button>
        {response && <p>Response: {response}</p>}
    </div>
    );
};

export default TestComponent;