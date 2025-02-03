import GlobalErrorHandler from "../components/GlobalErrorHandler";

function MyApp({ Component, pageProps }) {
    return (
        <>

            <GlobalErrorHandler />
            <Component {...pageProps} />


        </>
    );
}

export default MyApp;
