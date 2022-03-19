import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useUrlParam } from 'library/navigation';

export type UrlInputFilterProps = {
    name: string,
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const UrlInputFilterPropTypes = {
    name: PropTypes.string.isRequired
}
type ChangeEvent = {
    target: {
        value: string,
    }
}
export const useUrlInputFilter = <T extends string | undefined,>(name: string, def?: T) => {
    const [value, setValue] = useUrlParam<string | undefined>(name, def);
    const onChange = useCallback((e: ChangeEvent) => {
        setValue(e.target.value ? e.target.value : def);
    }, [setValue, def])

    return {
        name,
        value: value || def,
        onChange,
    }
}
function UrlInputFilter({ name, ...inputProps }: UrlInputFilterProps) {
    return <input {...inputProps} {...useUrlInputFilter(name, '')} />
}

UrlInputFilter.propTypes = UrlInputFilterPropTypes

export default UrlInputFilter
