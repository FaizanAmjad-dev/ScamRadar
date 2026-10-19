import { useState } from "react";


function ReadMore({ letter }) {
    // text limit set kary ka leya 
    const limit = 200;
    if (!letter) return null;

    const long = letter.length > limit;

    return (
        <>
            <span className="">
                {!long ? letter :`${letter.slice(0,limit)} ...more`}
            </span>
        </>
    )
}
export default ReadMore