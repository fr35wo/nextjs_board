export interface Board {
    boardId: number;
    title: string;
    contents: string;
    nickName: string;
}

export interface BoardList {
    content: Board[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
}
