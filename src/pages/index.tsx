import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, signUp } from "@/src/pages/api/auth";
import { fetchBoardList } from "@/src/pages/api/board";

export default function AuthPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");

    // Android 네이티브 앱에서 저장된 토큰 정보를 가져옴
    useEffect(() => {
        if (window.Android) {
            const savedTokens = window.Android.getCredentials();
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
            await fetchBoardList(1, 7); // 자동 로그인 시도
            router.push("/board/list");
        } catch {
            router.push("/auth"); // 실패 시 로그인 페이지로 이동
        }
    };

    const handleAuth = async () => {
            if (isSignUp) {
                // 비밀번호 일치 여부 확인
                if (password !== passwordCheck) {
                    alert("비밀번호가 일치하지 않습니다.");
                    return;
                }

                await signUp({ username, nickname, password, passwordCheck });
                alert("회원가입 성공");
                setIsSignUp(false);
            } else {
                const { accessToken, refreshToken } = await signIn({ username, password });
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                router.push("/board/list");
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

                {isSignUp && (
                    <>
                        <div>
                            <label>닉네임</label>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>비밀번호 확인</label>
                            <input
                                type="password"
                                value={passwordCheck}
                                onChange={(e) => setPasswordCheck(e.target.value)}
                                required
                            />
                        </div>
                    </>
                )}

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
