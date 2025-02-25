export interface JwtToken  {
    accessToken: string;
    refreshToken: string;
}

export interface MemberTokenResDto {
    memberId: number;
    username: string;
    token: JwtToken;
}

export interface SignInReqDto {
    username: string;
    password: string;
}

export interface SignUpReqDto {
    username: string;
    nickname: string;
    password: string;
    passwordCheck: string;
}

export interface RefreshTokenReqDto {
    refreshToken: string;
}
