import api from "./api";
import { RspTemplate } from "../../types/RspTemplate";
import { Comment, CommentList } from "../../types/comment";

/**
 * 댓글 목록 조회
 */
export async function fetchComments(boardId: number, page: number, size: number): Promise<CommentList> {
        const response = await api.post<RspTemplate<CommentList>>(
            `/comment/${boardId}/comments`,
            {page, size}
        );

        return response.data.data;
}

/**
 * 댓글 생성
 */
export async function createComment(boardId: number, content: string) {
    const response = await api.post<RspTemplate<Comment>>(`/comment/${boardId}`, { content });
    return response.data.data;
}

/**
 * 댓글 수정
 */
export async function updateComment(commentId: number, content: string) {
    const response = await api.put<RspTemplate<Comment>>(`/comment/${commentId}`, { content });
    return response.data.data;
}

/**
 * 댓글 삭제
 */
export async function deleteComment(commentId: number) {
    await api.delete(`/comment/${commentId}`);
}
