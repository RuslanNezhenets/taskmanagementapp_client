import React from 'react'

const DotsButton = ({onClick, isMenuVisible}) => {
    return (
        <div
            className={`dots-button${isMenuVisible ? ' active' : ''}`}
            aria-label="More options"
            onClick={onClick}
        >
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
        </div>
    )
}

export default DotsButton