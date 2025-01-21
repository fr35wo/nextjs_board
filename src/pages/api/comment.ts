import { RspTemplate } from "../../types/RspTemplate";
import { Comment } from "../../types/comment";

const BASE_URL = "http://localhost:8091/api/comment";

export async function fetchComments(boardId: number, page: number, size: number) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BASE_URL}/${boardId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ page, size }), // PageRequestDto와 매핑
    });

    if (!res.ok) {
        throw new Error("Failed to fetch comments");
    }

    const jsonResponse: RspTemplate<{
        content: Comment[];
        page: number;
        size: number;
        totalPages: number;
        totalElements: number;
    }> = await res.json();
    return jsonResponse.data;
}

export async function createComment(boardId: number, content: string) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BASE_URL}/${boardId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        throw new Error("Failed to create comment");
    }

    const jsonResponse: RspTemplate<Comment> = await res.json();
    return jsonResponse.data;
}

export async function updateComment(commentId: number, content: string) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BASE_URL}/${commentId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        throw new Error("Failed to update comment");
    }

    const jsonResponse: RspTemplate<Comment> = await res.json();
    return jsonResponse.data;
}

export async function deleteComment(commentId: number) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BASE_URL}/${commentId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to delete comment");
    }
}
