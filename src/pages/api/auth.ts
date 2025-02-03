import api from "./api";
import { RspTemplate } from "../../types/RspTemplate";
import { JwtToken, SignInReqDto, SignUpReqDto, MemberTokenResDto } from "../../types/auth";

/**
 * 회원가입 요청
 */
export async function signUp(signUpData: SignUpReqDto): Promise<MemberTokenResDto> {

        const response = await api.post<RspTemplate<MemberTokenResDto>>("/auth/sign-up", signUpData);
        return response.data.data;

}

/**
 * 로그인 요청
 */
export async function signIn(signInData: SignInReqDto): Promise<JwtToken> {

        const response = await api.post<RspTemplate<JwtToken>>("/auth/sign-in", signInData);
        return response.data.data;

}

/**
 * 액세스 토큰 재발급 요청
 */
export async function generateAccessToken(refreshToken: string): Promise<JwtToken> {

        const response = await api.post<RspTemplate<JwtToken>>("/auth/access", { refreshToken });
        return response.data.data;

}
