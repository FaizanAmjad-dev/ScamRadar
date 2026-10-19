import PostFrom from "./PagesUI/PostForm"





function MainForm({ onPostCreated }) {
    return (
        <>
                <PostFrom
                    onPostCreated={onPostCreated}
                />
        </>
    )
}
export default MainForm