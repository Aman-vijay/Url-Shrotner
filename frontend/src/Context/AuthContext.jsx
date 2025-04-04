import { useContext,createContext,useState,useEffect } from "react";

const AuthContext = createContext();

export const AuthProider = ({children})=>{
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const storedUser = localStorage.getItem('user');
        if(storedUser){
            setUser(JSON.parse(storedUser));
        }
    },[]);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.clear()
      };
    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
       
    )
}

export const useAuth = () => useContext(AuthContext);