import React from "react";
import PropTypes from "prop-types";

// styles taken from https://tailwindcomponents.com/component/forms

type SelectOption = {
    value: string,
    label: string,
}

export type SelectProps = {
    label: string,
    required?: boolean,
    placeholder?: string,
    options: Array<SelectOption>
};

export const SelectOptionPropTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
}

export const SelectPropTypes = {
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    placeholder: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.exact(SelectOptionPropTypes))
}

function Select({ label, required = false, placeholder="select option", options }: SelectProps) {
    return <div className="w-full flex flex-col mb-3">
        <label className="font-semibold text-gray-600 py-2">
            {label}
            {required && <abbr title="required">*</abbr>}
        </label>
        <select className="block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4 md:w-full "
            required={required} >
            <option value="">{placeholder}</option>
            {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        {required && <p className="text-sm text-red-500 hidden mt-3" id="error">Please fill out this field.</p>}
    </div>;
}

Select.propTypes = SelectPropTypes;

export default Select;
