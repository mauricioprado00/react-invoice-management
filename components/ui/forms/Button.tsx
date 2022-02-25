import PropTypes from 'prop-types'
import { useCallback } from 'react'

type ClickHandler =  (e:React.MouseEvent<HTMLButtonElement>) => void

export enum ButtonStyle {
    PillGray,
    PillGreen,
    FlatGreen,
}
export type ButtonProps = {
    children: any,
    onClick?: ClickHandler,
    style: ButtonStyle
}
export const ButtonPropTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.any,
    style: PropTypes.number
}

const styles = {
    [ButtonStyle.PillGray]: 'mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100',
    [ButtonStyle.PillGreen]: 'mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500',
    [ButtonStyle.FlatGreen]: 'bg-emerald-700 rounded-lg font-bold text-white text-center px-4 py-1 transition duration-300 ease-in-out hover:bg-blue-600 mr-6',
}

const Button = ({ children, onClick, style }: ButtonProps) => {
    const clickHandler = useCallback((e) => {
        e.preventDefault();
        if (onClick) {
            onClick(e);
        }
    }, [onClick]);
    const classNames = styles[style];

    return (<a href="" onClick={clickHandler} className={classNames}>
        {children}
    </a>)
}

Button.propTypes = ButtonPropTypes;

export default Button;