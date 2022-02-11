import PropTypes from 'prop-types'

type HeaderContentProps = {
    children: any
}
const HeaderContentPropTypes = {
    children: PropTypes.node
}

const HeaderContent = (props: HeaderContentProps) => {
    const { children } = props;
    return (<>
        {children}
    </>)
}

HeaderContent.propTypes = HeaderContentPropTypes;

export default HeaderContent;