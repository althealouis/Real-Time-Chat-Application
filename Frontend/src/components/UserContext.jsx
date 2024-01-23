import { createContext, useState, useEffect } from 'react'
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider ({children}) {
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);
    const token = localStorage.getItem("token") || null
    // console.log(token);

    const config = {
        headers: {Authorization: token}
    }

    useEffect(() => {
        axios.get('http://localhost:5000/api/v1/current-user', config)
        .then(response => {
            const userData = response.data.data;  //because inside currentUser function we are return in this manner -> data: userData check the function for more info
            setUsername(userData.username);
            setId(userData._id);
        });
    }, []);

    return (
        <UserContext.Provider value={{username, setUsername, id, setId}}>
            {children}
        </UserContext.Provider>
    )
}