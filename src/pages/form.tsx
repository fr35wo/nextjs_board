import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { createBoard, fetchBoard, updateBoard } from "./api/board";

export default function BoardForm() {
    const router = useRouter();
    const { id } = router.query;
    const isEditMode = Boolean(id);

    const [title, setTitle] = useState(""); //리액트 상태 값은 immutable 해야한다. 객체 내부값을 수정하기 보단 새 객체 만드는게 나을듯
    const [contents, setContents] = useState("");

    useEffect(() => {
        if (isEditMode && id) {
            fetchBoard(Number(id)).then((board) => {
                setTitle(board.title);
                setContents(board.contents);
            });
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await updateBoard(Number(id), { title, contents });
                alert("게시글이 수정되었습니다.");
            } else {
                await createBoard({ title, contents });
                alert("게시글이 작성되었습니다.");
            }
            router.push("/board/list");
        } catch (error) {
            console.error(isEditMode ? "수정 실패" : "작성 실패", error);
            alert(isEditMode ? "게시글 수정 실패" : "게시글 작성 실패");
        }
    };

    return (
        <div>
            <h1>{isEditMode ? "게시글 수정" : "새 게시글 작성"}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} //제목이 입력 될때마다 BoardForm전체가 재랜더링. 분리해야함. title 상태를 input의 value 속성에 바인딩했기 때문
                        required
                    />
                </div>
                <div>
                    <label>내용</label>
                    <textarea
                        value={contents}
                        onChange={(e) => setContents(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit">{isEditMode ? "수정" : "작성"}</button>
            </form>
        </div>
    );
}
