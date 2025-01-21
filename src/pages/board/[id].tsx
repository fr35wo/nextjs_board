import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchBoard, deleteBoard } from "../api/board";
import { Board } from "../../types/board";

export default function BoardDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [board, setBoard] = useState<Board | null>(null);

    useEffect(() => {
        if (id) {
            fetchBoard(Number(id)).then(setBoard).catch((error) => {
                console.error("Failed to fetch board:", error);
            });
        }
    }, [id]);

    const handleDelete = async () => {
        if (id) {
            try {
                await deleteBoard(Number(id)); {/* id가 문자열로 제공되니까 Number이 기본형 값 반환하므로 사용 */}
                alert("삭제되었습니다.");
                router.push("/board/list");
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("삭제 실패");
            }
        }
    };

    const handleEdit = () => {
        router.push(`/form?id=${board?.boardId}`);
    };

    const handleComments = () => {
        router.push(`/board/${board?.boardId}/comment`);
    };

    if (!board) return <p>Loading...</p>;

    return (
        <div>
            <h1>{board.title}</h1>
            <p>{board.contents}</p>
            <button onClick={() => router.push("/board/list")}>목록으로 돌아가기</button>
            <button onClick={handleEdit}>수정</button>
            <button onClick={handleDelete}>삭제</button>
            <button onClick={handleComments}>댓글 보기</button>
        </div>
    );
}
