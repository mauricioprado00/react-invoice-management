import React from 'react'
import PropTypes from "prop-types";
import Form from 'elements/Form'
import FieldsetRow from 'elements/FieldsetRow'
import InputText from 'elements/InputText'
import Button, { ButtonStyle } from 'elements/Button'
import { confirmPasswordValidator, emailValidator, passwordValidator } from 'utility/validation'
import { UserWithPassword, UserWithPasswordPropTypes } from 'site-specific/models/User';
import useForm from 'hooks/use-form';

type SignupFormApi = {
    reset: () => void
}
export type SaveUserEvent = {
    user: UserWithPassword,
    signupFormApi: SignupFormApi
}

type SignupFormProps = {
    onSave: (data: SaveUserEvent) => void,
    disabled?: boolean
}

const SignupFormPropTypes = {
    onSave: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    user: PropTypes.exact(UserWithPasswordPropTypes),
}

const elements = [
    "name",
    "email",
    "password",
    "confirmPassword",
];

function SignupForm({ onSave, disabled = false }: SignupFormProps) {
    const form = useForm({elements, disabled});
    const signupFormApi = {reset: form.reset};

    const saveHandler = () => {
        if (!form.allValid()) {
            form.setShowErrors(true);
            return;
        }
        onSave({
            user: {
                id: form.state.values.id,
                name: form.state.values.name,
                email: form.state.values.email,
                password: form.state.values.password,
                confirmPassword: form.state.values.confirmPassword,
            },
            signupFormApi
        });
    }

    return (
        <Form>
            <FieldsetRow>
                <InputText name="name" label="Name" required={true}
                    value={form.state.values.name}
                    {...form.inputProps} />

                <InputText name="email" label="Email" placeholder="Email ID"
                    required={true} value={form.state.values.email}
                    validators={[emailValidator("wrong email")]}
                    {...form.inputProps} />
            </FieldsetRow>
            <FieldsetRow>
                <InputText name="password" label="Password" required={true}
                    type="password"
                    value={form.state.values.password}
                    validators={[passwordValidator()]}
                    {...form.inputProps} />

                <InputText name="confirmPassword" label="Confirm Password" required={true}
                    type="password"
                    value={form.state.values.confirmPassword}
                    validationExtra={form.state.values.password}
                    validators={[confirmPasswordValidator("Password does not match")]}
                    {...form.inputProps} />
            </FieldsetRow>
            <FieldsetRow alignRight={true}>
                <Button onClick={saveHandler} styled={ButtonStyle.PillPrimary} disabled={disabled}>Register</Button>
            </FieldsetRow>
        </Form>
    )
}

SignupForm.propTypes = SignupFormPropTypes

export default SignupForm
