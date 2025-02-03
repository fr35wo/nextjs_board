import { useEffect, useState } from "react";

const GlobalErrorHandler = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const handleError = (event: CustomEvent) => {
            setErrorMessage(event.detail);
            setTimeout(() => setErrorMessage(null), 3000);
        };

        window.addEventListener("globalError", handleError as EventListener);

        return () => {
            window.removeEventListener("globalError", handleError as EventListener);
        };
    }, []);

    if (!errorMessage) return null;

    return (
        <div style={{
            position: "fixed", top: "10px", right: "10px", background: "red",
            color: "white", padding: "10px", borderRadius: "5px", zIndex: 1000
        }}>
            {errorMessage}
        </div>
    );
};

export default GlobalErrorHandler;
