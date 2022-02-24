import React, { useState } from 'react'
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText, { InputChangeEvent } from 'components/ui/forms/InputText'
import Button, { ButtonStyle } from '../../ui/forms/Button'
import Card from '../../ui/layout/Card'
import { MapType, MapTypeFill } from 'models/UtilityModels'

type AddClientState = {
    valid: MapType<boolean>,
    values: MapType<string>,
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
    valid: MapTypeFill(elements, true),
    values: MapTypeFill(elements, '')
}
function AddClient() {
    const [state, setState] = useState(initialAddClientState)
    const validHandler = (e: Event) => {
        console.log('validation changed', e)
    }
    const changeHandler = (e: InputChangeEvent) => {
        setState(prev => ({
            ...prev,
            values: {
                ...prev.values,
                [e.fieldName]: e.target.value
            }
        }))
    }

    const handlers = {
        onValid: validHandler,
        onChange: changeHandler,
    }
    console.log({ state });

    return (
        <Card title="Add Client">
            <Form>
                <FieldsetRow>
                    <InputText name="name" label="Name" required={true}
                        value={state.values.name} {...handlers} />

                    <InputText name="email" label="Email" placeholder="Email ID"
                        required={true} value={state.values.email} {...handlers} />
                </FieldsetRow>
                <FieldsetRow>
                    <InputText name="companyName" label="Company Name" required={true}
                        value={state.values.companyName} {...handlers} />

                    <InputText name="address" label="Address" required={true} 
                        value={state.values.address} {...handlers} />
                </FieldsetRow>
                <FieldsetRow>
                    <InputText name="regNumber" label="Reg Number" required={true} 
                        value={state.values.regNumber} {...handlers}/>
                    <InputText name="vatNumber" label="Vat Number" required={true}
                        value={state.values.vatNumber} {...handlers}/>
                </FieldsetRow>
                <FieldsetRow alignRight={true}>
                    <Button style={ButtonStyle.PillGray}>Cancel</Button>
                    <Button style={ButtonStyle.PillGreen}>Save</Button>
                </FieldsetRow>
            </Form>
        </Card>
    )
}

AddClient.propTypes = {}

export default AddClient
