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
                    <InputText name="invoiceNumber" label="Invoice Number" required={true} />
                    <Select label="Client" required={true} options={clientOptions} />
                </FieldsetRow>
                <FieldsetRow>
                    <InputText name="date" type="date" label="Date" placeholder="Date" required={true} />
                    <InputText name="dueDate" type="date" label="Due Date" placeholder="Due Date" required={true} />
                </FieldsetRow>
                <InputText name="something" label="Value" required={true} />
                <FieldsetRow alignRight={true}>
                    <Button styled={ButtonStyle.PillSecondary}>Cancel</Button>
                    <Button styled={ButtonStyle.PillPrimary}>Save</Button>
                </FieldsetRow>
            </Form>
        </Card>
    )
}

AddInvoice.propTypes = {}

export default AddInvoice
