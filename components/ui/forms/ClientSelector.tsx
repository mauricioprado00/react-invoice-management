import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Client, ClientPropTypes } from 'models/Client'
import SelectUnstyled, {
  SelectUnstyledProps,
  selectUnstyledClasses,
} from '@mui/base/SelectUnstyled';
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled';
import { styled } from '@mui/system';
import { PopperUnstyled } from '@mui/base';
import { getAvatarImageUrl } from './AvatarSelector';
import { FormElementProps, FormElementPropTypes } from 'hooks/use-form';
import classNames from 'classnames';


export type ClientSelectorProps = {
  label?: string,
  emptyOptionLabel?: string,
  required?: boolean,
  name: string,
  clientList: Client[],
} & Omit<SelectUnstyledProps<string>, 'onChange'> & FormElementProps

export const ClientSelectorPropTypes = Object.assign(
  {},
  FormElementPropTypes,
  {
    label: PropTypes.string,
    emptyOptionLabel: PropTypes.string,
    required: PropTypes.bool,
    name: PropTypes.string.isRequired,
    clientList: PropTypes.arrayOf(PropTypes.shape(ClientPropTypes))
  },
)

const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  100: '#E7EBF0',
  200: '#E0E3E7',
  300: '#CDD2D7',
  400: '#B2BAC2',
  500: '#A0AAB4',
  600: '#6F7E8C',
  700: '#3E5060',
  800: '#2D3843',
  900: '#1A2027',
};

const red = {
  50: 'rgb(254 242 242)',
  900: 'rgb(239 68 68)',
}

const StyledErrorButton = styled('button')(
  ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    background: ${red[50]};
    border: 1px solid ${red[900]};
    border-radius: 0.75em;
    margin: 0.5em;
    padding: 10px;
    text-align: left;
    line-height: 1.5;
    width: 100%;
    height: 2.5rem;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  
    &:hover {
      background: ${theme.palette.mode === 'dark' ? '' : grey[100]};
      border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
    }
  
    &.${selectUnstyledClasses.focusVisible} {
      outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[100]};
    }
  
    &.${selectUnstyledClasses.expanded} {
      &::after {
        content: '▴';
      }
    }
  
    &::after {
      content: '▾';
      float: right;
    }
  
    & img {
      margin-right: 10px;
      display: inline-block;
    }
    `,
);

const StyledButton = styled('button')(
  ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
    border-radius: 0.75em;
    margin: 0.5em;
    padding: 10px;
    text-align: left;
    line-height: 1.5;
    width: 100%;
    height: 2.5rem;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  
    &:hover {
      background: ${theme.palette.mode === 'dark' ? '' : grey[100]};
      border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
    }
  
    &.${selectUnstyledClasses.focusVisible} {
      outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[100]};
    }
  
    &.${selectUnstyledClasses.expanded} {
      &::after {
        content: '▴';
      }
    }
  
    &::after {
      content: '▾';
      float: right;
    }
  
    & img {
      margin-right: 10px;
      display: inline-block;
    }
    `,
);

const StyledListbox = styled('ul')(
  ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 5px;
    margin: 10px 0;
    min-width: 200px;
    max-height: 400px;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
    border-radius: 0.75em;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    overflow: auto;
    outline: 0px;
    `,
);

const StyledOption = styled(OptionUnstyled)(
  ({ theme }) => `
    list-style: none;
    padding: 8px;
    border-radius: 0.45em;
    cursor: default;
  
    &:last-of-type {
      border-bottom: none;
    }
  
    &.${optionUnstyledClasses.selected} {
      background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
      color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
    }
  
    &.${optionUnstyledClasses.highlighted} {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    }
  
    &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
      background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
      color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
    }
  
    &.${optionUnstyledClasses.disabled} {
      color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
    }
  
    &:hover:not(.${optionUnstyledClasses.disabled}) {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    }
  
    & img {
      margin-right: 10px;
      display: inline-block;
    }
    `,
);

const StyledPopper = styled(PopperUnstyled)`
    z-index: 1;
  `;

type CustomSelectProps = SelectUnstyledProps<string> & {
  hasError?: boolean,
}
const CustomSelect = React.forwardRef(function CustomSelect(
  { hasError, ...props }: CustomSelectProps,
  ref: React.ForwardedRef<any>,
) {
  const components: SelectUnstyledProps<string>['components'] = {
    Root: hasError ? StyledErrorButton : StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} ref={ref} components={components} />;
});

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

function ClientSelector({
  value, name, label, required, clientList, emptyOptionLabel,
  reset, onValid, onChange, showErrors, disabled,
  ...selectPops
}: ClientSelectorProps) {
  let [valid, setValid] = useState(() => {
    const valid = !required || Boolean(value);
    if (onValid) {
      onValid(name, valid);
    }

    return valid;
  });
  const labelClasses = [classes.label.default];
  const inputClasses = [classes.input.default];
  const [touch, setTouch] = useState(-1);
  const changeHandler = useCallback((value: string | null) => {
    setTouch(reset === 0 || reset ? reset : -1);
    setValid(value ? true : false);
    if (onChange) {
      onChange({
        fieldName: name,
        target: {
          value: value || '',
        }
      });
      if (onValid && required) {
        onValid(name, value ? true : false);
      }
    }
  }, [onChange, name, onValid, required, reset]);

  const sortedClients = useMemo(() =>
    [...clientList].sort((a, b) => a.name > b.name ? 1 : -1), [clientList])

  const errorMessages = [] as string[];
  let expressErrors = true;

  if (!valid) {
    errorMessages.push('Please select a Client');
  }

  if (touch !== reset) {
    expressErrors = false;
  }

  if (showErrors) { // requested by parent component, must show
    expressErrors = true;
  }

  if (expressErrors) {
    if (errorMessages.length > 0) {
      labelClasses.push(classes.label.invalid);
      inputClasses.push(classes.input.invalid);
    } else {
      labelClasses.push(classes.label.valid);
      inputClasses.push(classes.input.valid);
    }
  } else {
    labelClasses.push(classes.label.noerror);
    inputClasses.push(classes.input.noerror);
  }

  return (
    <div data-testid="client-selector" data-value={value} className="mb-3 space-y-2 w-full text-xs" data-name={name}>
      {label && <label className={classNames(...labelClasses)}>
        {label + " "}
        {required && <abbr title="required">*</abbr>}
      </label>}
      <CustomSelect value={value} hasError={expressErrors && !valid} {...selectPops} onChange={changeHandler}>
        {emptyOptionLabel && <StyledOption value="">{emptyOptionLabel}</StyledOption>}
        {!emptyOptionLabel && value === "" && <OptionUnstyled value="">Select a Client</OptionUnstyled>}
        {sortedClients.map(client =>
          <StyledOption key={client.id} value={client.id}>
            <img
              loading="lazy"
              width="20"
              src={getAvatarImageUrl(client.avatar)}
              srcSet={getAvatarImageUrl(client.avatar)}
              alt={`Client ${client.name}`}
            />
            <span data-clientid={client.id}>{client.name}</span>
          </StyledOption>
        )}
      </CustomSelect>
      {expressErrors && <p className="text-red text-xs text-red-600 dark:text-red-500">{errorMessages.join(' ')}</p>}
    </div>
  )
}

ClientSelector.propTypes = ClientSelectorPropTypes

export default ClientSelector
