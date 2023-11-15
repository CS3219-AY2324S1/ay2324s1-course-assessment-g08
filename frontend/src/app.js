import { useEffect, useState } from "react";
import AuthenticatedRoutes from "./routes/AuthenticatedRoutes";
import UnauthenticatedRoutes from "./routes/UnauthenticatedRoutes";
import { useRecoilState } from "recoil";
import { isLoggedInState } from './recoil/UserAtom';
import styles from './styles/app.module.css';
import { ToastContainer } from "react-toastify";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            if (localStorage.getItem('credentials')) {
                setIsLoggedIn(true);
            }
            setIsLoading(false);
        }, 1000);
    }, [setIsLoggedIn]);

    if (isLoading) {
        return (
            <div className={styles["loading"]}>
                Loading...
            </div>
        );
    }

    return (
        <div>
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
            {
                isLoggedIn
                    ? <AuthenticatedRoutes />
                    : <UnauthenticatedRoutes />
            }
        </div>
    );
};

export default App;