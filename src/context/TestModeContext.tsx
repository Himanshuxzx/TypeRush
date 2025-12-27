'use client'
import { useState , createContext, useContext} from "react";

const TestModeContext = createContext<any>(null);

export const TestModeContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [testTime, setTestTime] = useState(30);

    const values = {
        testTime,
        setTestTime
    }
    return (<TestModeContext.Provider value={values}>{children}</TestModeContext.Provider>)
}

export const useTestModeContext = () => {
    return useContext(TestModeContext);
}
