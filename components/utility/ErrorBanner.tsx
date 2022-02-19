import React from 'react'
import PropTypes from 'prop-types'
import styles from '../../styles/MaterialIcons.module.css'
import { SerializedError, SerializedErrorPropTypes } from 'models/SerializedError'

export type ErrorBannerProps = {
    error: SerializedError
    children: any
}
export const ErrorBannerPropTypes = {
    error: PropTypes.exact(SerializedErrorPropTypes),
    children: PropTypes.node
}
function ErrorBanner({error, children}: ErrorBannerProps) {
    return (
        <div className="flex gap-4 bg-red-500 p-4 rounded-md">
            <div className="w-max">
                <div className="h-10 w-10 flex rounded-full bg-gradient-to-b from-red-100 to-red-300 text-red-700">
                    <span className={"material-icons-outlined m-auto " + styles['material-icons']} style={{ fontSize: "20px" }}>gpp_bad</span>
                </div>
            </div>
            <div className="space-y-1 text-sm">
                <h6 className="font-medium text-white font-bold">Fatal error</h6>
                <p className="text-red-100 leading-tight">{children}</p>
                {error.message && <p className="text-red-100 italic py-1">
                    <span className="font-bold">Details</span>: <span className="font-serif">{error.message}</span>
                </p>}
            </div>
        </div>
    )
}

ErrorBanner.propTypes = ErrorBannerPropTypes

export default ErrorBanner
