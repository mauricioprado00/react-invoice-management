import React from 'react'
import PropTypes from 'prop-types'
import { InputLabel, MenuItem, Select } from '@mui/material'
import classNames from 'classnames'
import { styled } from '@mui/system'
import { PaymentType, PaymentTypePropTypes } from 'models/Invoice'

export type PaymentSelectorProps = {
    label: string,
    required?: boolean,
    name: string,
    paymentTypes: PaymentType[],
    value: string,
}

export const PaymentSelectorPropTypes = {
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    name: PropTypes.string.isRequired,
    paymentTypes: PropTypes.arrayOf(PropTypes.exact(PaymentTypePropTypes)),
    value: PropTypes.string.isRequired,
}

const classes = {
    label: {
        invalid: 'text-red-700 dark:text-red-500',
        valid: 'text-green-700 dark:text-green-500',
        default: 'font-semibold py-2',
        noerror: 'text-gray-600',
    },
    input: {
        invalid: 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:bg-red-100 dark:border-red-400',
        valid: 'bg-green-50 border border-green-500 text-green-900 placeholder-green-700 focus:ring-green-500 focus:border-green-500 dark:bg-green-100 dark:border-green-400',
        default: 'appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4',
        noerror: '',
    }
}

const CustomSelect = styled(Select)(`
width: 100%;
height: 2.5rem;
`)

function PaymentSelector({ label, required, paymentTypes, value }: PaymentSelectorProps) {
    const labelClasses = [classes.label.default, classes.label.noerror];
    return (
        <div className="mb-3 space-y-2 w-full text-xs">
            <label className={classNames(...labelClasses)}>
                {label + " "}
                {required && <abbr title="required">*</abbr>}
            </label>
            <CustomSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
            >
                {paymentTypes.map(paymentType =>
                    <MenuItem key={paymentType.accountNumber}
                        value={paymentType.accountNumber}>
                        {paymentType.accountType} {paymentType.accountNumber}
                    </MenuItem>)}

            </CustomSelect>
        </div>
    )
}

PaymentSelector.propTypes = PaymentSelectorPropTypes

export default PaymentSelector
