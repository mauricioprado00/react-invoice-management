import PropTypes from 'prop-types'
import { useCallback } from 'react'

type ClickHandler =  (e:React.MouseEvent<HTMLButtonElement>) => void

export enum ButtonStyle {
    PillSecondary,
    PillPrimary,
    FlatPrimary,
}
export interface ButtonProps extends  React.ComponentPropsWithoutRef<'button'> {
    children: any,
    onClick?: ClickHandler,
    styled: ButtonStyle
}
export const ButtonPropTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.any,
    style: PropTypes.number
}

const styles = {
    [ButtonStyle.PillSecondary]: 'mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100',
    [ButtonStyle.PillPrimary]: 'mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500',
    [ButtonStyle.FlatPrimary]: 'bg-purple-500 rounded-lg font-bold text-white text-center px-4 py-1 transition duration-300 ease-in-out hover:bg-blue-600 mr-6',
}

const disabledStyles = {
    [ButtonStyle.PillSecondary]: 'mb-2 md:mb-0 bg-gray-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-gray-500',
    [ButtonStyle.PillPrimary]: 'mb-2 md:mb-0 bg-gray-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-gray-500',
    [ButtonStyle.FlatPrimary]: 'bg-purple-500 rounded-lg font-bold text-white text-center px-4 py-1 transition duration-300 ease-in-out hover:bg-blue-600 mr-6',
}

const Button = ({ children, onClick, styled, ...buttonProps }: ButtonProps) => {
    const clickHandler = useCallback((e) => {
        e.preventDefault();
        if (onClick) {
            onClick(e);
        }
    }, [onClick]);
    const classNames = buttonProps.disabled ? disabledStyles[styled]: styles[styled];

    return (<button onClick={clickHandler} className={classNames} {...buttonProps}>
        {children}
    </button>)
}

Button.propTypes = ButtonPropTypes;

export default Button;