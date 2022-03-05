import React, { useCallback, useState } from 'react'
import PropTypes from "prop-types";
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText from 'components/ui/forms/InputText'
import Button, { ButtonStyle } from 'components/ui/forms/Button'
import { emailValidator } from 'library/validation'
import { LoginCredentials, LoginCredentialsPropTypes } from 'models/User';
import useForm from 'hooks/use-form';

type SigninFormApi = {
    reset: () => void
}
export type LoginUserEvent = {
    loginCredentials: LoginCredentials,
    signinFormApi: SigninFormApi
}

type SigninFormProps = {
    onLogin: (data: LoginUserEvent) => void,
    disabled?: boolean
}

const SigninFormPropTypes = {
    onLogin: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}

const elements = [
    "email",
    "password",
];

function SigninForm({ onLogin, disabled = false }: SigninFormProps) {
    const form = useForm({elements, disabled});
    const [signinFormApi] = useState({reset: form.reset});

    const saveHandler = useCallback(() => {
        if (!form.allValid()) {
            form.setShowErrors(true);
            return;
        }
        onLogin({
            loginCredentials: {
                email: form.state.values.email,
                password: form.state.values.password,
            },
            signinFormApi
        });
    }, [onLogin, form, signinFormApi]);

    const keyupHandler = useCallback((e:React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter') {
            saveHandler();
        }
    }, [saveHandler]);

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
                    onKeyUp={keyupHandler}
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
