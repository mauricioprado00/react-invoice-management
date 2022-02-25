import React, { useCallback, useState } from 'react'
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText, { InputChangeEvent } from 'components/ui/forms/InputText'
import Button, { ButtonStyle } from '../../ui/forms/Button'
import Card from '../../ui/layout/Card'
import { MapType, MapTypeFill, MapTypeSome } from 'models/UtilityModels'
import { emailValidator, numberValidator } from '../../../library/validation'

type AddClientState = {
    valid: MapType<boolean>,
    values: MapType<string>,
    reset: number,
    showErrors: boolean,
}

const elements = [
    "name",
    "email",
    "companyName",
    "address",
    "regNumber",
    "vatNumber",
];

const initialAddClientState: AddClientState = {
    valid: MapTypeFill(elements, false),
    values: MapTypeFill(elements, ''),
    reset: 0,
    showErrors: false,
}
function AddClient() {
    const [state, setState] = useState(initialAddClientState)
    const validHandler = useCallback((name: string, valid:boolean) => {
        console.log('valid state changed', name, valid)
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

    const shared = {
        reset: state.reset,
        onValid: validHandler,
        onChange: changeHandler,
    }

    const setShowErrors = (show:boolean) => {
        setState(prev => ({...prev, showErrors: show}));
    }

    const allValid = ():boolean => !MapTypeSome(state.valid, value => value !== true)
    const resetErrors = () => {
        setState(prev => {
            return {
                ...prev,
                reset: prev.reset+1
            }
        })
    }
    const reset = () => {
        setState(prev => ({...initialAddClientState, reset:prev.reset+1}))
    }

    const cancelHandler = () => {
        setShowErrors(false);
        reset();
    }

    const saveHandler = () => {
        if (!allValid()) {
            console.log('there are invalid values');
            setShowErrors(true);
            return;
        }

        console.log('senging data....');
    }
    console.log({ state });

    return (
        <Card title="Add Client">
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
                        {...shared}/>
                    <InputText name="vatNumber" label="Vat Number" required={true}
                        value={state.values.vatNumber} 
                        validators={[numberValidator('The % is not valid.')]}
                        error="This is wrong regardless (for async validations)."
                        {...shared}/>
                </FieldsetRow>
                <FieldsetRow alignRight={true}>
                    <Button onClick={cancelHandler} style={ButtonStyle.PillGray}>Cancel</Button>
                    <Button onClick={saveHandler} style={ButtonStyle.PillGreen}>Save</Button>
                </FieldsetRow>
            </Form>
        </Card>
    )
}

AddClient.propTypes = {}

export default AddClient
