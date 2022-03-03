import React from 'react'
import PropTypes from "prop-types";
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText from 'components/ui/forms/InputText'
import Button, { ButtonStyle } from 'components/ui/forms/Button'
import { emailValidator, passwordValidator } from 'library/validation'
import { UserLogin, UserLoginPropTypes } from 'models/User';
import useForm from 'hooks/use-form';

type SigninFormApi = {
    reset: () => void
}
export type LoginUserEvent = {
    userLogin: UserLogin,
    signinFormApi: SigninFormApi
}

type SigninFormProps = {
    onLogin: (data: LoginUserEvent) => void,
    disabled?: boolean
}

const SigninFormPropTypes = {
    onLogin: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    userLogin: PropTypes.exact(UserLoginPropTypes),
}

const elements = [
    "email",
    "password",
];

function SigninForm({ onLogin, disabled = false }: SigninFormProps) {
    const form = useForm({elements, disabled});
    const signinFormApi = {reset: form.reset};

    const saveHandler = () => {
        if (!form.allValid()) {
            form.setShowErrors(true);
            return;
        }
        onLogin({
            userLogin: {
                email: form.state.values.email,
                password: form.state.values.password,
            },
            signinFormApi
        });
    }

    return (
        <Form>
            <FieldsetRow>
                <InputText name="email" label="Email" placeholder="Email ID"
                    required={true} value={form.state.values.email}
                    validators={[emailValidator("wrong email")]}
                    {...form.inputProps} />
            </FieldsetRow>
            <FieldsetRow>
                <InputText name="password" label="Password" required={true}
                    type="password"
                    value={form.state.values.password}
                    {...form.inputProps} />
            </FieldsetRow>
            <FieldsetRow alignRight={true}>
                <Button onClick={saveHandler} styled={ButtonStyle.PillPrimary} disabled={disabled}>Sign In</Button>
            </FieldsetRow>
        </Form>
    )
}

SigninForm.propTypes = SigninFormPropTypes

export default SigninForm
