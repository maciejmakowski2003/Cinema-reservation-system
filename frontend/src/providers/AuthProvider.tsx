import React, { useEffect } from "react";
import { API_URL } from "../config";
import axios from "axios";
type Props = {
    children: React.ReactNode;
}
interface AuthContextState {
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
}

interface User {
    email: string;
    role: string;
}

const AuthContext = React.createContext<AuthContextState | undefined>(undefined);

const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [token, setToken] = React.useState<string | null>(null);

    const getUserData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return

        try {
            const res = await axios.get(`${API_URL}/users/data`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            setUser(res.data);
            setToken(token);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        (async function () {
            await getUserData()
        })()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};
const useAuth = () => {
    const context = React.useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }

    return context;
};

export default useAuth;

export { AuthProvider, useAuth };