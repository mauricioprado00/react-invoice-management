import React from 'react'
import PropTypes from "prop-types";
import Form from 'elements/Form'
import FieldsetRow from 'elements/FieldsetRow'
import InputText from 'elements/InputText'
import Button, { ButtonStyle, ClickHandler } from 'elements/Button'
import { emailValidator, emptyOr, ibanValidator, notBothEmpty, numberValidator, swiftValidator } from 'utility/validation'
import AvatarSelector from 'elements/AvatarSelector';
import { UseProfileFormReturn } from 'site-specific/hooks/use-profile-form';

export type ProfileFormProps = {
    disabled?: boolean,
    withBank?: boolean,
    message?: string | null,
    form: UseProfileFormReturn,
    onAvatarChange?: (selected: string) => void,
    onCancel?: ClickHandler,
    onSave?: ClickHandler,
}

const ProfileFormPropTypes = {
    disabled: PropTypes.bool,
    withBank: PropTypes.bool,
    message: PropTypes.string,
    form: PropTypes.any.isRequired,
    onAvatarChange: PropTypes.func,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
}

function ProfileForm({
    disabled = false,
    withBank = false,
    message,
    form,
    onAvatarChange,
    onCancel,
    onSave,
}: ProfileFormProps) {
    const { state } = form;
    return (
        <Form>
            <AvatarSelector selected={state.values.avatar} onChange={onAvatarChange}
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
                <Button onClick={onCancel} styled={ButtonStyle.PillSecondary} disabled={disabled}>Cancel</Button>
                <Button onClick={onSave} styled={ButtonStyle.PillPrimary} disabled={disabled}>Save</Button>
            </FieldsetRow>

            {message && <FieldsetRow>
                <span className="block text-gray-500">{message}</span>
            </FieldsetRow>}

        </Form>
    )
}

ProfileForm.propTypes = ProfileFormPropTypes

export default ProfileForm
