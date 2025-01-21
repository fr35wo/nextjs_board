declare global {
    interface Window {
        Android?: {
            /**
             * Save tokens into Android SharedPreferences.
             * @param accessToken - The access token.
             * @param refreshToken - The refresh token.
             */
            saveToken(accessToken: string, refreshToken: string): void;

            /**
             * Retrieve user credentials stored in Android SharedPreferences.
             * @returns A JSON string containing username and password.
             * Example: '{"username":"user123", "password":"pass123"}'
             */
            getCredentials(): string;
        };
    }
}

export {};
