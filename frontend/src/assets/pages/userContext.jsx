import React, { createContext, useContext, useState } from 'react';

// Create the context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [email, setEmail] = useState("");
    const [userType, setUserType] = useState("");
    const [userName, setUserName] = useState("");

    return (
        <UserContext.Provider value={{ email, setEmail, userType, setUserType, userName, setUserName}}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);
