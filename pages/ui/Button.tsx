import PropTypes from 'prop-types'

type ButtonProps = {
    children: any,
    onClick?: {
        (e: any): void
    }
}
const ButtonPropTypes = {
    children: PropTypes.node,
    onClick: PropTypes.any
}

const Button = (props: ButtonProps) => {
    const { children, onClick } = props;
    return (<a href="" onClick={onClick} className="bg-emerald-700 rounded-lg font-bold text-white text-center px-4 py-1 transition duration-300 ease-in-out hover:bg-blue-600 mr-6">
        {children}
    </a>)
}

Button.propTypes = ButtonPropTypes;

export default Button;