import React, {useState} from 'react'
import ReactQuill from 'react-quill'
import {Button} from "react-bootstrap"

const DescriptionRedactor = ({description, setDescription}) => {
    const [isActive, setIsActive] = useState(false)

    let initialDescription = description

    const confirmEdit = () => {
        if (initialDescription === '<p><br></p>') initialDescription = null
        setDescription(initialDescription)
        setIsActive(false)
    }

    const cancelEdit = () => {
        setIsActive(false)
    }

    return (
        isActive ? (
            <div>
                <ReactQuill value={description} onChange={(value) => initialDescription = value}/>
                <div className="viewTask_description_control">
                    <Button variant="primary" onClick={confirmEdit}>Зберегти</Button>
                    <Button variant="light" onClick={cancelEdit}>Відміна</Button>
                </div>
            </div>
        ) : (
            <div
                className="viewTask_description_display"
                onClick={() => setIsActive(true)}
            >
                <div dangerouslySetInnerHTML={{__html: description || "Редагувати опис"}}/>
            </div>
        )
    )
}

export default DescriptionRedactor
