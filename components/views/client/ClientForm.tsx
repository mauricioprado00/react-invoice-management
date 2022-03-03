import React, { useCallback, useEffect} from 'react'
import PropTypes from "prop-types";
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText from 'components/ui/forms/InputText'
import Button, { ButtonStyle } from 'components/ui/forms/Button'
import { emailValidator, numberValidator } from 'library/validation'
import { AnyClient, AnyClientPropTypes } from 'models/Client'
import AvatarSelector from 'components/ui/forms/AvatarSelector';
import produce from 'immer';
import useForm from 'hooks/use-form';

type ClientFormApi = {
    reset: () => void
}
export type SaveClientEvent = {
    client: AnyClient,
    clientFormApi: ClientFormApi
}

type ClientFormProps = {
    onSave: (data: SaveClientEvent) => void,
    onCancel: () => boolean | void,
    disabled?: boolean,
    client: AnyClient | null
}

const ClientFormPropTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    client: PropTypes.exact(AnyClientPropTypes),
}

const elements = [
    "name",
    "email",
    "companyName",
    "address",
    "regNumber",
    "vatNumber",
    //"avatar", NO because vhe state. Valid is not handled for the custom Avatar Selector
];

function ClientForm({ onSave, onCancel, disabled = false, client }: ClientFormProps) {
    const form = useForm({elements, disabled});
    const {state, reset, setState} = form;
    const clientFormApi = {reset};
    const selectAvatar = useCallback((avatar: string) => {
        setState(prev => produce(prev, draft => { draft.values.avatar = avatar } ));
    }, [setState])


    const cancelHandler = () => {
        let result = onCancel();
        if (result !== true) { // true == handled
            reset();
        }
    }

    const saveHandler = () => {
        if (!form.allValid()) {
            form.setShowErrors(true);
            return;
        }
        onSave({
            client: {
                id: form.state.values.id,
                name: form.state.values.name,
                email: form.state.values.email,
                avatar: form.state.values.avatar,
                companyDetails: {
                    name: form.state.values.companyName,
                    address: form.state.values.address,
                    vatNumber: form.state.values.vatNumber,
                    regNumber: form.state.values.regNumber,
                }
            },
            clientFormApi
        });
    }

    useEffect(() => {
        if (client) {
            reset();
            setState(prev => ({
                ...prev,
                values: {
                    id: client.id,
                    name: client.name,
                    email: client.email,
                    avatar: client.avatar || '',
                    companyName: client.companyDetails.name,
                    address: client.companyDetails.address,
                    vatNumber: client.companyDetails.vatNumber,
                    regNumber: client.companyDetails.regNumber,
                }
            }));
        }
    }, [setState, reset, client]);

    return (
        <Form>
            <AvatarSelector selected={state.values.avatar} onChange={selectAvatar} />
            <FieldsetRow>
                <InputText name="name" label="Name" required={true}
                    value={state.values.name}
                    {...form.inputProps} />

                <InputText name="email" label="Email" placeholder="Email ID"
                    required={true} value={state.values.email}
                    validators={[emailValidator("wrong email")]}
                    {...form.inputProps} />
            </FieldsetRow>
            <FieldsetRow>
                <InputText name="companyName" label="Company Name" required={true}
                    value={state.values.companyName}
                    {...form.inputProps} />

                <InputText name="address" label="Address" required={true}
                    value={state.values.address}
                    {...form.inputProps} />
            </FieldsetRow>
            <FieldsetRow>
                <InputText name="regNumber" label="Reg Number" required={true}
                    value={state.values.regNumber}
                    validators={[numberValidator('Please provide a valid %.')]}
                    {...form.inputProps} />
                <InputText name="vatNumber" label="Vat Number" required={true}
                    value={state.values.vatNumber}
                    validators={[numberValidator('The % is not valid.')]}
                    {...form.inputProps} />
            </FieldsetRow>
            <FieldsetRow alignRight={true}>
                <Button onClick={cancelHandler} styled={ButtonStyle.PillSecondary} disabled={disabled}>Cancel</Button>
                <Button onClick={saveHandler} styled={ButtonStyle.PillPrimary} disabled={disabled}>Save</Button>
            </FieldsetRow>
        </Form>
    )
}

ClientForm.propTypes = ClientFormPropTypes

export default ClientForm
