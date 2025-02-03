import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchBoardList } from "../api/board";
import { Board, BoardList } from "../../types/board";

export default function BoardListPage() {
    const router = useRouter();
    const [boards, setBoards] = useState<Board[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            router.push("/auth");
            return;
        }

        fetchBoardList(page, 7)
            .then((data: BoardList) => {
                setBoards(data.content);
                setTotalPages(data.totalPages);
            })
            .catch((error) => {

                setBoards([]);
            });
    }, [page, router]);

    const changePage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const getVisiblePages = () => {
        const groupSize = 10;
        const currentGroup = Math.ceil(page / groupSize);
        const startPage = (currentGroup - 1) * groupSize + 1;
        const endPage = Math.min(currentGroup * groupSize, totalPages);
        return Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx);
    };

    const handleCreateBoard = () => {
        router.push("/form");
    };

    return (
        <div>
            <h1>게시판</h1>
            <button onClick={handleCreateBoard}>새 게시글 작성</button>
            {boards.length === 0 ? (
                <p>게시물이 없습니다.</p>
            ) : (
                <ul>
                    {boards.map((board) => (
                        <li key={board.boardId}>
                            {board.nickName}:
                            <a href={`/board/${board.boardId}`}>{board.title}</a>
                        </li>
                    ))}
                </ul>
            )}
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
}
