import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Comment } from "../../../types/comment";
import {
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
} from "../../api/comment";

const CommentsPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query; // boardId

    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadComments = async (boardId: number, page: number) => {
        try {
            const data = await fetchComments(boardId, page, 5);
            setComments(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    };

    useEffect(() => {
        if (id) {
            loadComments(Number(id), page);
        }
    }, [id, page]);

    const handleCreateComment = async () => {
        try {
            await createComment(Number(id), newComment); // 댓글 등록
            setNewComment("");
            if (id) {
                loadComments(Number(id), page); // 등록 후 목록 재조회
            }
        } catch (error) {
            console.error("Failed to create comment:", error);
        }
    };

    const handleUpdateComment = async (commentId: number) => {
        try {
            const updatedComment = await updateComment(commentId, editingContent);
            setComments((prev) =>
                prev.map((comment) =>
                    comment.commentId === commentId ? updatedComment : comment
                )
            );
            setEditingCommentId(null);
            setEditingContent("");
        } catch (error) {
            console.error("Failed to update comment:", error);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await deleteComment(commentId);
            setComments((prev) =>
                prev.filter((comment) => comment.commentId !== commentId)
            );
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    const changePage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const getVisiblePages = () => {
        const groupSize = 5;
        const currentGroup = Math.ceil(page / groupSize);
        const startPage = (currentGroup - 1) * groupSize + 1;
        const endPage = Math.min(currentGroup * groupSize, totalPages);
        return Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx);
    };

    return (
        <div>
            <h2>댓글 목록</h2>
            {comments.map((comment) => (
                <div key={comment.commentId}>
                    {editingCommentId === comment.commentId ? (
                        <div>
                            <input
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                            />
                            <button onClick={() => handleUpdateComment(comment.commentId)}>
                                저장
                            </button>
                            <button onClick={() => setEditingCommentId(null)}>취소</button>
                        </div>
                    ) : (
                        <div>
                            <p>{comment.content}</p>
                            <p>작성자: {comment.writer}</p>
                            <button
                                onClick={() => {
                                    setEditingCommentId(comment.commentId);
                                    setEditingContent(comment.content);
                                }}
                            >
                                수정
                            </button>
                            <button onClick={() => handleDeleteComment(comment.commentId)}>
                                삭제
                            </button>
                        </div>
                    )}
                </div>
            ))}
            <div>
                <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                />
                <button onClick={handleCreateComment}>등록</button>
            </div>
            <div>
                <button onClick={() => changePage(page - 1)} disabled={page === 1}>
                    이전
                </button>
                {getVisiblePages().map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => changePage(pageNum)}
                        disabled={page === pageNum}
                    >
                        {pageNum}
                    </button>
                ))}
                <button onClick={() => changePage(page + 1)} disabled={page === totalPages}>
                    다음
                </button>
            </div>
        </div>
    );
};

export default CommentsPage;
