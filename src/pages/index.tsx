import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, signUp } from "@/src/pages/api/auth";
import {fetchBoardList} from "@/src/pages/api/board";

export default function AuthPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Android 네이티브 앱에서 저장된 토큰 정보를 가져옴
    useEffect(() => {
        if (window.Android) {
            const savedTokens = window.Android.getCredentials(); // 네이티브 저장된 토큰 가져오기
            if (savedTokens) {
                const { accessToken, refreshToken } = JSON.parse(savedTokens);
                if (accessToken && refreshToken) {
                    handleAutoLogin();
                }
            }
        }
    }, []);

    const handleAutoLogin = async () => {
        try {
            // Access Token으로 게시판 목록 가져오기 시도
            await fetchBoardList(1, 7); // page: 1, size: 7
            router.push("/board/list"); // 성공 시 페이지 이동
        } catch (error) {
            console.error("자동 로그인 실패:", error);
            alert("자동 로그인 실패. 로그인 페이지로 이동합니다.");
            router.push("/auth"); // 실패 시 로그인 페이지로 이동
        }
    };

    const handleAuth = async () => {
        try {
            if (isSignUp) {
                await signUp({ username, password });
                alert("회원가입 성공");
                setIsSignUp(false);
            } else {
                const { accessToken, refreshToken } = await signIn({ username, password });
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                // Android 네이티브 앱에도 토큰 저장
                if (window.Android) {
                    window.Android.saveToken(accessToken, refreshToken);
                }

                alert("로그인 성공");
                router.push("/board/list");
            }
        } catch (error) {
            console.error("Auth Error:", error);
            alert(error instanceof Error ? error.message : "오류 발생");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
            <h1>{isSignUp ? "회원가입" : "로그인"}</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAuth();
                }}
            >
                <div>
                    <label>아이디</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">{isSignUp ? "회원가입" : "로그인"}</button>
            </form>
            <div style={{ marginTop: "20px" }}>
                {isSignUp ? (
                    <p>
                        이미 회원이신가요?{" "}
                        <button onClick={() => setIsSignUp(false)}>로그인</button>
                    </p>
                ) : (
                    <p>
                        회원이 아니신가요?{" "}
                        <button onClick={() => setIsSignUp(true)}>회원가입</button>
                    </p>
                )}
            </div>
        </div>
    );
}
