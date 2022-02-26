import React, { useCallback, useState } from 'react'
import PropTypes from "prop-types";
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText, { InputChangeEvent } from 'components/ui/forms/InputText'
import Button, { ButtonStyle } from 'components/ui/forms/Button'
import { MapType, MapTypeFill, MapTypeSome } from 'models/UtilityModels'
import { emailValidator, numberValidator } from 'library/validation'
import { Client } from 'models/Client'
import AvatarSelector from 'components/ui/forms/AvatarSelector';

export type SaveClientEvent = {
    client: Client,
}

type ClientFormState = {
    valid: MapType<boolean>,
    values: MapType<string>,
    reset: number,
    showErrors: boolean,
    avatar?: string,
}

type ClientFormProps = {
    onSave: (data: SaveClientEvent) => void,
    onCancel: () => void,
    disabled?: boolean
}

const ClientFormPropTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}

const elements = [
    "name",
    "email",
    "companyName",
    "address",
    "regNumber",
    "vatNumber",
];

const initialClientFormState: ClientFormState = {
    valid: MapTypeFill(elements, false),
    values: MapTypeFill(elements, ''),
    reset: 0,
    showErrors: false,
}
function ClientForm({ onSave, onCancel, disabled = false }: ClientFormProps) {
    const [state, setState] = useState(initialClientFormState)
    const validHandler = useCallback((name: string, valid: boolean) => {
        setState(prev => ({
            ...prev,
            valid: {
                ...prev.valid,
                [name]: valid,
            }
        }))
    }, [])
    const changeHandler = useCallback((e: InputChangeEvent) => {
        setState(prev => ({
            ...prev,
            values: {
                ...prev.values,
                [e.fieldName]: e.target.value
            }
        }))
    }, []);

    const selectAvatar = useCallback((avatar: string) => {
        setState(prev => ({
            ...prev,
            avatar
        }));
    }, [])

    const shared = {
        reset: state.reset,
        onValid: validHandler,
        onChange: changeHandler,
        showErrors: state.showErrors,
        disabled,
    }

    const setShowErrors = (show: boolean) => {
        setState(prev => ({ ...prev, showErrors: show }));
    }

    const allValid = (): boolean => !MapTypeSome(state.valid, value => value !== true)
    const resetErrors = () => {
        setState(prev => {
            return {
                ...prev,
                reset: prev.reset + 1
            }
        })
    }
    const reset = () => {
        setState(prev => ({ ...initialClientFormState, reset: prev.reset + 1 }))
    }

    const cancelHandler = () => {
        onCancel();
        setShowErrors(false);
        reset();
    }

    const saveHandler = () => {
        if (!allValid()) {
            setShowErrors(true);
            return;
        }
        onSave({
            client: {
                id: -1,
                name: state.values.name,
                email: state.values.email,
                avatar: state.avatar,
                companyDetails: {
                    name: state.values.companyName,
                    address: state.values.address,
                    vatNumber: state.values.vatNumber,
                    regNumber: state.values.regNumber,
                }
            }
        });
    }
    console.log({ state });

    return (
        <Form>
            <AvatarSelector selected={state.avatar} onChange={selectAvatar} />
            <FieldsetRow>
                <InputText name="name" label="Name" required={true}
                    value={state.values.name}
                    {...shared} />

                <InputText name="email" label="Email" placeholder="Email ID"
                    required={true} value={state.values.email}
                    validators={[emailValidator("wrong email")]}
                    {...shared} />
            </FieldsetRow>
            <FieldsetRow>
                <InputText name="companyName" label="Company Name" required={true}
                    value={state.values.companyName}
                    {...shared} />

                <InputText name="address" label="Address" required={true}
                    value={state.values.address}
                    {...shared} />
            </FieldsetRow>
            <FieldsetRow>
                <InputText name="regNumber" label="Reg Number" required={true}
                    value={state.values.regNumber}
                    validators={[numberValidator('Please provide a valid %.')]}
                    {...shared} />
                <InputText name="vatNumber" label="Vat Number" required={true}
                    value={state.values.vatNumber}
                    validators={[numberValidator('The % is not valid.')]}
                    error="This is wrong regardless (for async validations)."
                    {...shared} />
            </FieldsetRow>
            <FieldsetRow alignRight={true}>
                <Button onClick={cancelHandler} styled={ButtonStyle.PillGray} disabled={disabled}>Cancel</Button>
                <Button onClick={saveHandler} styled={ButtonStyle.PillGreen} disabled={disabled}>Save</Button>
            </FieldsetRow>
        </Form>
    )
}

ClientForm.propTypes = ClientFormPropTypes

export default ClientForm
