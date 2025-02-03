import axios from 'axios';
import { generateAccessToken } from "./auth";

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: "http://localhost:8091/api",
    headers: { "Content-Type": "application/json" },
    timeout: 5000,
});

// 전역 에러 이벤트 발생 함수 (사용자에게 메시지 표시)
function handleGlobalError(errorMessage: string) {
    window.dispatchEvent(new CustomEvent("globalError", { detail: errorMessage }));
}

// 401 Unauthorized 발생 시 액세스 토큰 재발급 및 요청 재시도
async function handleUnauthorized(error: any) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        handleGlobalError("세션이 만료되었습니다. 다시 로그인해주세요.");
        return new Promise(() => {});
    }

    try {
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessToken(refreshToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // 기존 요청을 새로운 액세스 토큰으로 다시 실행
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return api.request(error.config);
    } catch (err) {
        handleGlobalError("토큰 갱신 실패. 다시 로그인해주세요.");
        return new Promise(() => {});
    }
}

// 요청 인터셉터: Authorization 헤더 자동 추가
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 응답 인터셉터: 모든 API 요청 실패 시 `console.error()`를 자동 실행
api.interceptors.response.use(
    response => response,  // 정상 응답은 그대로 반환
    error => {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // 🔹 서버에서 반환한 에러 메시지 가져오기
                const errorMessage = error.response.data?.message || `요청 실패 (HTTP ${error.response.status})`;

                // 🔹 사용자에게 에러 메시지를 UI에서 표시
                handleGlobalError(errorMessage);

                console.error("API 요청 실패:", {
                    url: error.config.url,
                    method: error.config.method,
                    status: error.response.status,
                    responseMessage: error.response.data?.message || "서버에서 메시지를 반환하지 않았습니다.",
                    responseData: error.response.data,
                });

            } else if (error.request) {
                handleGlobalError("네트워크 오류가 발생했습니다.");
                console.error("네트워크 오류:", error);

                return new Promise(() => {});
            }
        } else {
            handleGlobalError("알 수 없는 오류가 발생했습니다.");
            console.error("알 수 없는 오류:", error);
            return new Promise(() => {});
        }

        return new Promise(() => {});
    }
);

export default api;
