import React, { ReactNode } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

// styles taken from https://tailwindcomponents.com/component/forms
export enum CardBackground {
    OceanWater=1,
    pepe
}

export type CardProps = {
    children: ReactNode,
    title?: string,
    fullscreen?: boolean,
    center?: boolean,
    background?: string | boolean | number,
    bgopacity?: boolean,
};

export const CardPropTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    fullscreen: PropTypes.bool,
    center: PropTypes.bool,
    background: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    bgopacity: PropTypes.bool,
}

const styles = {
    base: 'relative flex bg-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover relative'
}

type CardStyle = {
    backgroundImage?: string
}

const defaultBackground = CardBackground.OceanWater;
const backgrounds = {
    [CardBackground.OceanWater as number]: 'https://images.unsplash.com/photo-1532423622396-10a3f979251a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80'
}

function Card({ children, title, fullscreen=false, center=true, background=false, bgopacity=false }: CardProps) {
    const mainClassnames = [styles.base];
    const style:CardStyle = {}

    if (fullscreen) {
        mainClassnames.push('min-h-screen');
    }

    if (center) {
        mainClassnames.push('items-center justify-center')
    }

    if (background) {
        let type = typeof background
        let backgroundUrl
        if (type === 'number') {
            backgroundUrl = backgrounds[background as number];
        } else if(type === 'boolean') {
            backgroundUrl = backgrounds[defaultBackground as number]
        } else {
            backgroundUrl = background
        }
        style.backgroundImage = `url(${backgroundUrl})`;
    }

    return <div className={classNames(...mainClassnames)} style={style}>
        {bgopacity && <div className="absolute bg-black opacity-60 inset-0 z-0" />}


        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
            <div className="grid  gap-8 grid-cols-1">
                <div className="flex flex-col ">
                    {title && <div className="flex flex-col sm:flex-row items-center">
                        <h2 className="font-semibold text-lg mr-auto">{title}</h2>
                        <div className="w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0" />
                    </div>}
                    <div className="mt-5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

Card.propTypes = CardPropTypes;

export default Card;
