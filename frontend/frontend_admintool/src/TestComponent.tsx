import { useState } from 'react';
import axios from 'axios';

interface ResponseType {
    success: boolean;
    message: string;
}

const TestComponent: React.FC = () => {
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