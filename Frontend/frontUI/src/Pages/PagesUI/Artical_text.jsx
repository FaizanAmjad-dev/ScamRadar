



function Artical_text({ letter }) {
    let number = 81
    if (!letter) return null
    const text_cut = letter.length > number
    return (
        <>
            <span>
                {!text_cut ? letter : `${letter.slice(0, number)} ....`}
            </span>
        </>
    )
}
export default Artical_text