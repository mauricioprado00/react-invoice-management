import React from 'react'
import PropTypes from 'prop-types'
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText, { InputTextType } from 'components/ui/forms/InputText'
import Select from '../../ui/forms/Select'
import Button, { ButtonStyle } from '../../ui/forms/Button'
import Card from '../../ui/layout/Card'

function AddInvoice(props) {

    return (
        <Card title="Add Invoice">
            <Form>
                <FieldsetRow>
                    <InputText label="Invoice Number" required={true} />
                    <Select label="Client" required={true} options={[
                        { value: "1", label: "Chochin,KL" },
                        { value: "2", label: "Mumbai,MH" },
                        { value: "3", label: "Bangalore,KA" },
                    ]} />
                </FieldsetRow>
                <FieldsetRow>
                    <InputText type={InputTextType.Date} label="Date" placeholder="Date" required={true} />
                    <InputText type={InputTextType.Date} label="Due Date" placeholder="Due Date" required={true} />
                </FieldsetRow>
                <InputText label="Value" required={true} />
                <FieldsetRow alignRight={true}>
                    <Button style={ButtonStyle.PillGray}>Cancel</Button>
                    <Button style={ButtonStyle.PillGreen}>Save</Button>
                </FieldsetRow>
            </Form>
        </Card>
    )
}

AddInvoice.propTypes = {}

export default AddInvoice
