import { Board, BoardList } from "../../types/board";
import { RspTemplate } from "../../types/RspTemplate";
import { generateAccessToken } from "../api/auth";

const BASE_URL = "http://localhost:8091/api/board";

async function handleUnauthorized(res: Response) {
    if (res.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            try {
                const { accessToken, refreshToken: newRefreshToken } = await generateAccessToken(refreshToken);
                console.log("재발급")
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);
                return accessToken;
            } catch (error) {
                console.error("Failed to refresh token:", error);
                throw new Error("Unauthorized");
            }
        } else {
            const errorResponse = await res.json();
            throw new Error(errorResponse || "No refresh token available");
        }
    }
    return null;
}

export async function fetchBoardList(page: number, size: number): Promise<BoardList> {
    let token = localStorage.getItem("accessToken");
    let res = await fetch(`${BASE_URL}/list?page=${page}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        token = await handleUnauthorized(res); // 액세스 토큰 만료 처리
        if (token) {
            res = await fetch(`${BASE_URL}/list?page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
        if (!res.ok) {
            const errorResponse = await res.json();
            throw new Error(errorResponse || "Failed to fetch board list");
        }
    }

    const jsonResponse: RspTemplate<BoardList> = await res.json();
    return jsonResponse.data;
}

export async function fetchBoard(boardId: number): Promise<Board> {
    let token = localStorage.getItem("accessToken");
    let res = await fetch(`${BASE_URL}?boardId=${boardId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        token = await handleUnauthorized(res);
        if (token) {
            res = await fetch(`${BASE_URL}?boardId=${boardId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
        if (!res.ok) {
            const errorResponse = await res.json();
            throw new Error(errorResponse || "Failed to fetch board details");
        }
    }

    const jsonResponse: RspTemplate<Board> = await res.json();
    return jsonResponse.data;
}

export async function updateBoard(boardId: number, board: { title: string; contents: string }): Promise<Board> {
    let token = localStorage.getItem("accessToken");
    let res = await fetch(`${BASE_URL}?boardId=${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(board),
    });

    if (!res.ok) {
        token = await handleUnauthorized(res);
        if (token) {
            res = await fetch(`${BASE_URL}?boardId=${boardId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(board),
            });
        }
        if (!res.ok) {
            const errorResponse = await res.json();
            throw new Error(errorResponse || "Failed to update board");
        }
    }

    const jsonResponse: RspTemplate<Board> = await res.json();
    return jsonResponse.data;
}

export async function createBoard(board: { title: string; contents: string }): Promise<Board> {
    let token = localStorage.getItem("accessToken");
    let res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(board),
    });

    if (!res.ok) {
        token = await handleUnauthorized(res);
        if (token) {
            res = await fetch(BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(board),
            });
        }
        if (!res.ok) {
            const errorResponse = await res.json();
            throw new Error(errorResponse || "Failed to create board");
        }
    }

    const jsonResponse: RspTemplate<Board> = await res.json();
    return jsonResponse.data;
}

export async function deleteBoard(boardId: number): Promise<void> {
    let token = localStorage.getItem("accessToken");
    let res = await fetch(`${BASE_URL}?boardId=${boardId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        token = await handleUnauthorized(res);
        if (token) {
            res = await fetch(`${BASE_URL}?boardId=${boardId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
        }
        if (!res.ok) {
            const errorResponse = await res.json();
            throw new Error(errorResponse.message || "Failed to delete board");
        }
    }
}
