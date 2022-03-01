import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import { useGoRoute } from 'library/navigation'

type LinkProps = {
    children: any,
    href: string,
}

const LinkPropTypes = {
    children: PropTypes.node,
    href: PropTypes.string,
}

function Link({ children, href }: LinkProps) {
    const goRoute = useGoRoute(href);
    return (
        <>
            {React.cloneElement(children, { onClick: goRoute })}
        </>
    )
}

Link.propTypes = LinkPropTypes

export default Link
