import React from 'react'
import PropTypes from 'prop-types'

export type HambugerProps = {
    onClick: {(...args:any):void}
}

const HamburgerPropTypes = {
    onClick: PropTypes.func
}

const Hamburger = ({onClick}:HambugerProps) => {
    
    return (<svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="12" cy="19" r="1"></circle>
        <circle cx="12" cy="5" r="1"></circle>
    </svg>)
}

Hamburger.propTypes = HamburgerPropTypes

export default Hamburger