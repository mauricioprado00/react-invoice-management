import React, { SyntheticEvent, useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Hamburger from './Hamburger'

export type HamburgerDropdownItem = {
    label: string,
    type: string,
    handler?: () => void,
}

export type HamburgerDropdownProps = {
    items: HamburgerDropdownItem[]
}

interface HamburgerActionMouseEvent extends React.MouseEvent<HTMLAnchorElement> {
    target: EventTarget & {
        dataset: {
            action: string
        }
    }
}

type DisplayState = [string, { (display: any): void }]

const HamburgetDropdownItemPropTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    handler: PropTypes.func,
}

const HamburgerDropdownPropTypes = {
    items: PropTypes.arrayOf(PropTypes.exact(HamburgetDropdownItemPropTypes))
}


const HamburgerDropdown = ({ items = [] }: HamburgerDropdownProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [display, setDisplay]: DisplayState = useState('none');
    const handleAction = useCallback((e: HamburgerActionMouseEvent) => {
        const action = e.target.dataset.action;
        items.forEach(item => {
            if (item.type === action && item.handler) {
                item.handler();
            }
        })
    }, [items])
    const clickHandler = useCallback(() => {
        setDisplay((display: string) => display == 'none' ? '' : 'none')
        if (ref.current) ref.current.focus();
    }, []);
    const blurHandler = useCallback((e) => {
        setTimeout(() => setDisplay('none'), 300);
    }, [])
    const keyupHandler = useCallback((e) => {
        switch (e.code) {
            case 'Escape':
                if (ref.current) ref.current.blur();

                break;
            case 'Enter':
                setDisplay((display: string) => display == 'none' ? '' : 'none')
                break;
        }

    }, []);

    if (items.length === 0) {
        return null;
    }

    return (
        <>
            <div className="text-lg text-center relative" tabIndex={0} ref={ref} onKeyUp={keyupHandler} onBlur={blurHandler}>
                <Hamburger onClick={clickHandler} />
                <div style={{ display }} className="z-10 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                    <div className="py-1" role="none">
                        {items.map(item =>
                            <a key={item.type} data-action={item.type} onClick={handleAction} href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-0">{item.label}</a>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

HamburgerDropdown.propTypes = HamburgerDropdownPropTypes

export default HamburgerDropdown