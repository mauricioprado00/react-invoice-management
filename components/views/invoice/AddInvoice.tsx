import React from 'react'
import PropTypes from 'prop-types'
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText from 'components/ui/forms/InputText'
import Select from '../../ui/forms/Select'
import Button, { ButtonStyle } from '../../ui/forms/Button'
import Card from '../../ui/layout/Card'
import { useClientOptions } from 'store/ClientSlice'

function AddInvoice(props:any) {
    const clientOptions = useClientOptions();
    return (
        <Card title="Add Invoice">
            <Form>
                <FieldsetRow>
                    <InputText label="Invoice Number" required={true} />
                    <Select label="Client" required={true} options={clientOptions} />
                </FieldsetRow>
                <FieldsetRow>
                    <InputText type="date" label="Date" placeholder="Date" required={true} />
                    <InputText type="date" label="Due Date" placeholder="Due Date" required={true} />
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
