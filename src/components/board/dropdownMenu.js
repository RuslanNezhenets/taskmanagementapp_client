import React, {useRef, useState} from 'react'
import useOutsideClick from "../../utils/useOutsideClick"

const DropdownMenu = ({toggleComponent, children}) => {
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef()

    useOutsideClick(menuRef, () => {
        if (showMenu) setShowMenu(false)
    })

    const toggleMenu = (e) => {
        e.preventDefault()
        setShowMenu(true)
    }

    const handleMenuItemClick = (e, action) => {
        e.stopPropagation()
        action()
        setShowMenu(false)
    }

    const renderMenuItems = () => {
        return React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                    onClick: (e) => handleMenuItemClick(e, child.props.onClick)
                })
            }
            return child
        })
    }

    return (
        <div ref={menuRef}>
            <div onClick={toggleMenu} style={{position: "relative"}}>{toggleComponent}</div>
            {showMenu &&
                <div className="my-dropdown-menu scrollable-dropdown">
                    {renderMenuItems()}
                </div>
            }
        </div>
    )
}

export default DropdownMenu
