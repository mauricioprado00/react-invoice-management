import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from "prop-types";
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText, { InputChangeEvent } from 'components/ui/forms/InputText'
import Button, { ButtonStyle } from 'components/ui/forms/Button'
import { MapType, MapTypeFill, MapTypeSome } from 'models/UtilityModels'
import { confirmPasswordValidator, emailValidator, passwordValidator } from 'library/validation'
import produce from 'immer';
import { UserWithPassword, UserWithPasswordPropTypes } from 'models/User';

type SignupFormApi = {
    reset: () => void
}
export type SaveUserEvent = {
    user: UserWithPassword,
    signupFormApi: SignupFormApi
}

type SignupFormState = {
    valid: MapType<boolean>,
    values: MapType<string>,
    reset: number,
    showErrors: boolean,
}

type SignupFormProps = {
    onSave: (data: SaveUserEvent) => void,
    onCancel: () => boolean | void,
    disabled?: boolean
}

const SignupFormPropTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    user: PropTypes.exact(UserWithPasswordPropTypes),
}

const elements = [
    "name",
    "email",
    "password",
    "confirmPassword",
];

const initialSignupFormState: SignupFormState = {
    valid: MapTypeFill(elements, false),
    values: MapTypeFill(elements, ''),
    reset: 0,
    showErrors: false,
}
function SignupForm({ onSave, onCancel, disabled = false }: SignupFormProps) {
    const [state, setState] = useState(initialSignupFormState)
    const validHandler = useCallback((name: string, valid: boolean) => {
        setState(prev => produce(prev, draft => { draft.valid[name] = valid }))
    }, [])
    const changeHandler = useCallback((e: InputChangeEvent) => {
        setState(prev => produce(prev, draft => { draft.values[e.fieldName] = e.target.value }));
    }, []);

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
    const reset = () => {
        setState(prev => ({ ...initialSignupFormState, reset: prev.reset + 1 }))
    }

    const signupFormApi = {reset};

    const cancelHandler = () => {
        let result = onCancel();
        if (result !== true) { // true == handled
            reset();
        }
    }

    const saveHandler = () => {
        if (!allValid()) {
            setShowErrors(true);
            return;
        }
        onSave({
            user: {
                id: state.values.id,
                name: state.values.name,
                email: state.values.email,
                password: state.values.password,
                confirmPassword: state.values.confirmPassword,
            },
            signupFormApi
        });
    }

    return (
        <Form>
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
                <InputText name="password" label="Password" required={true}
                    type="password"
                    value={state.values.password}
                    validators={[passwordValidator()]}
                    {...shared} />

                <InputText name="confirmPassword" label="Confirm Password" required={true}
                    type="password"
                    value={state.values.confirmPassword}
                    validationExtra={state.values.password}
                    validators={[confirmPasswordValidator("Password does not match")]}
                    {...shared} />
            </FieldsetRow>
            <FieldsetRow alignRight={true}>
                <Button onClick={cancelHandler} styled={ButtonStyle.PillSecondary} disabled={disabled}>Cancel</Button>
                <Button onClick={saveHandler} styled={ButtonStyle.PillPrimary} disabled={disabled}>Save</Button>
            </FieldsetRow>
        </Form>
    )
}

SignupForm.propTypes = SignupFormPropTypes

export default SignupForm
