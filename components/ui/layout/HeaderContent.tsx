import PropTypes from 'prop-types'

type HeaderContentProps = {
    children: any
}
const HeaderContentPropTypes = {
    children: PropTypes.node
}

const HeaderContent = ({children}: HeaderContentProps) => {
    return (<>
        {children}
    </>)
}

HeaderContent.propTypes = HeaderContentPropTypes;

export default HeaderContent;