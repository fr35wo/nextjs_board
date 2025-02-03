export interface Comment {
    commentId: number;
    content: string;
    createdAt: string;
    writer: string;
}

export interface CommentList {
    content: Comment[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
}