import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from "prop-types";
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText from 'components/ui/forms/InputText'
import Button, { ButtonStyle } from 'components/ui/forms/Button'
import { emailValidator, emptyOr, ibanValidator, notBothEmpty, numberValidator, swiftValidator } from 'library/validation'
import { AnyClient, AnyClientPropTypes } from 'models/Client'
import AvatarSelector, { someAvatar } from 'components/ui/forms/AvatarSelector';
import produce from 'immer';
import useForm from 'hooks/use-form';
import { Me, MePropTypes } from 'models/User';

type ProfileFormApi = {
    reset: () => void
}
export type SaveProfileEvent = {
    profile: Omit<AnyClient & Me, 'password'>,
    profileFormApi: ProfileFormApi
}

type ProfileFormProps = {
    onSave: (data: SaveProfileEvent) => void,
    onCancel: () => boolean | void,
    disabled?: boolean,
    profile: AnyClient | Me | null,
    disabledFields?: string[],
    withBank?: boolean,
    message?: string | null,
}

const ProfileFormPropTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    profile: PropTypes.oneOfType([
        PropTypes.exact(AnyClientPropTypes),
        PropTypes.exact(MePropTypes),
    ]),
    disabledFields: PropTypes.arrayOf(PropTypes.string),
    withBank: PropTypes.bool,
    message: PropTypes.string,
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

const elements_bank = elements.concat([
    "iban",
    "swift",
]);

function ProfileForm({
    onSave,
    onCancel,
    disabled = false,
    profile,
    disabledFields,
    withBank = false,
    message
}: ProfileFormProps) {
    const form = useForm({ elements: withBank ? elements_bank : elements, disabled, disabledFields });
    const { state, reset, setState } = form;
    const profileFormApi = { reset };
    const selectAvatar = useCallback((avatar: string) => {
        setState(prev => produce(prev, draft => { draft.values.avatar = avatar }));
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
            profile: {
                id: form.state.values.id,
                name: form.state.values.name,
                email: form.state.values.email,
                avatar: form.state.values.avatar,
                companyDetails: Object.assign({
                    name: form.state.values.companyName,
                    address: form.state.values.address,
                    vatNumber: form.state.values.vatNumber,
                    regNumber: form.state.values.regNumber,
                }, !withBank ? {} : {
                    iban: form.state.values.iban,
                    swift: form.state.values.swift,
                })
            },
            profileFormApi
        });
    }

    useEffect(() => {
        if (profile) {
            reset();
            setState(prev => ({
                ...prev,
                values: {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    avatar: someAvatar(profile.avatar),
                    companyName: profile.companyDetails ? profile.companyDetails.name : '',
                    address: profile.companyDetails ? profile.companyDetails.address : '',
                    vatNumber: profile.companyDetails ? profile.companyDetails.vatNumber : '',
                    regNumber: profile.companyDetails ? profile.companyDetails.regNumber : '',
                    iban: profile.companyDetails ? profile.companyDetails.iban || '' : '',
                    swift: profile.companyDetails ? profile.companyDetails.swift || '' : '',
                }
            }));
        }
    }, [setState, reset, profile]);

    return (
        <Form>
            <AvatarSelector selected={state.values.avatar} onChange={selectAvatar}
                disabled={state.disabled.avatar} />
            <FieldsetRow>
                <InputText name="name" label="Name" required={true}
                    value={state.values.name}
                    {...form.resolveProps('name')} />

                <InputText name="email" label="Email" placeholder="Email ID"
                    required={true} value={state.values.email}
                    validators={[emailValidator("wrong email")]}
                    {...form.resolveProps('email')} />
            </FieldsetRow>
            <FieldsetRow>
                <InputText name="companyName" label="Company Name" required={true}
                    value={state.values.companyName}
                    {...form.resolveProps('companyName')} />

                <InputText name="address" label="Address" required={true}
                    value={state.values.address}
                    {...form.resolveProps('address')} />
            </FieldsetRow>
            <FieldsetRow>
                <InputText name="regNumber" label="Reg Number" required={true}
                    value={state.values.regNumber}
                    validators={[numberValidator('Please provide a valid %.')]}
                    {...form.resolveProps('regNumber')} />
                <InputText name="vatNumber" label="Vat Number" required={true}
                    value={state.values.vatNumber}
                    validators={[numberValidator('The % is not valid.')]}
                    {...form.resolveProps('vatNumber')} />
            </FieldsetRow>

            {withBank && <FieldsetRow>
                <InputText name="iban" label="IBAN" required={false}
                    value={state.values.iban}
                    validationExtra={form.state.values.swift}
                    validators={[emptyOr(ibanValidator()), notBothEmpty("Provide one payment method")]}
                    {...form.resolveProps('iban')} />
                <InputText name="swift" label="Swift Code" required={false}
                    value={state.values.swift}
                    validationExtra={form.state.values.iban}
                    validators={[emptyOr(swiftValidator()), notBothEmpty("Provide one payment method")]}
                    {...form.resolveProps('swift')} />
            </FieldsetRow>}
            <FieldsetRow alignRight={true}>
                <Button onClick={cancelHandler} styled={ButtonStyle.PillSecondary} disabled={disabled}>Cancel</Button>
                <Button onClick={saveHandler} styled={ButtonStyle.PillPrimary} disabled={disabled}>Save</Button>
            </FieldsetRow>

            {message && <FieldsetRow>                
                    <span className="block text-gray-500">{message}</span>
            </FieldsetRow>}

        </Form>
    )
}

ProfileForm.propTypes = ProfileFormPropTypes

export default ProfileForm
