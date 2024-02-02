import React, { useState } from 'react';
import axios from 'axios';

const MyForm = () => {
    const [name, setName] = useState('');
    const [saveDirectory, setSaveDirectory] = useState('');
    const [banlist, setBanlist] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/Servers', {
                name,
                saveDirectory,
                banlist,
                uptime: 0,
                status: 'Down',
                players: 0,
                lastrestart: new Date(),
                lastupdate: new Date()
            });

            console.log(response.data); // Handle the response as needed
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <br />
            <label>
                Save Directory:
                <input
                    type="text"
                    value={saveDirectory}
                    onChange={(e) => setSaveDirectory(e.target.value)}
                />
            </label>
            <br />
            <label>
                Banlist:
                <input
                    type="text"
                    value={banlist}
                    onChange={(e) => setBanlist(e.target.value)}
                />
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
    );
};

export default MyForm;