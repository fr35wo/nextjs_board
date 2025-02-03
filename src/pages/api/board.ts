import api from "./api";
import { Board, BoardList } from "../../types/board";
import { RspTemplate } from "../../types/RspTemplate";

/**
 * 게시판 목록 조회
 */
export async function fetchBoardList(page: number, size: number): Promise<BoardList> {
    const response = await api.post<RspTemplate<BoardList>>("/board/list", { page, size });
    return response.data.data;
}

/**
 * 게시판 상세 조회
 */
export async function fetchBoard(boardId: number): Promise<Board> {
    const response = await api.get<RspTemplate<Board>>(`/board?boardId=${boardId}`);
    return response.data.data;
}

/**
 * 게시판 수정
 */
export async function updateBoard(boardId: number, board: { title: string; contents: string }): Promise<Board> {
    const response = await api.put<RspTemplate<Board>>(`/board?boardId=${boardId}`, board);
    return response.data.data;
}

/**
 * 게시판 생성
 */
export async function createBoard(board: { title: string; contents: string }): Promise<Board> {
    const response = await api.post<RspTemplate<Board>>("/board", board);
    return response.data.data;
}

/**
 * 게시판 삭제
 */
export async function deleteBoard(boardId: number): Promise<void> {
    await api.delete(`/board?boardId=${boardId}`);
}
