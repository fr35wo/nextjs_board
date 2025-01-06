import { RspTemplate } from "../../types/RspTemplate";
import { JwtToken, SignInReqDto, SignUpReqDto, MemberTokenResDto } from "../../types/auth";

const BASE_URL = "http://localhost:8091/api/auth";

/**
 * 회원가입 요청
 * @param signUpData - 회원가입 데이터
 * @returns MemberTokenResDto
 */
export async function signUp(signUpData: SignUpReqDto): Promise<MemberTokenResDto> {
    const response = await fetch(`${BASE_URL}/sign-up`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "회원가입 실패");
    }

    const jsonResponse: RspTemplate<MemberTokenResDto> = await response.json();
    return jsonResponse.data;
}

/**
 * 로그인 요청
 * @param signInData - 로그인 데이터
 * @returns JwtToken
 */
export async function signIn(signInData: SignInReqDto): Promise<JwtToken> {
    const response = await fetch(`${BASE_URL}/sign-in`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(signInData),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "로그인 실패");
    }

    const jsonResponse: RspTemplate<JwtToken> = await response.json();
    return jsonResponse.data;
}

/**
 * 액세스 토큰 재발급 요청
 * @param refreshToken - 리프레쉬 토큰
 * @returns JwtToken
 */
export async function generateAccessToken(refreshToken: string): Promise<JwtToken> {
    const response = await fetch(`${BASE_URL}/access`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "토큰 재발급 실패");
    }

    const jsonResponse: RspTemplate<JwtToken> = await response.json();
    return jsonResponse.data;
}
