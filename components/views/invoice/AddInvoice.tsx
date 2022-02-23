import React from 'react'
import PropTypes from 'prop-types'
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText from 'components/ui/forms/InputText'
import Select from '../../ui/forms/Select'
import Button, { ButtonStyle } from '../../ui/forms/Button'
import Card from '../../ui/layout/Card'

function AddInvoice(props) {

    return (
        <Card title="Add Invoice">
            <Form>
                <FieldsetRow>
                    <InputText label="Company Name" required={true} />
                    <InputText label="Company Mail" placeholder="Email ID" required={true} />
                </FieldsetRow>
                <FieldsetRow>
                    <InputText label="Company Address" required={true} />
                    <Select label="Location" required={true} options={[
                        { value: "1", label: "Chochin,KL" },
                        { value: "2", label: "Mumbai,MH" },
                        { value: "3", label: "Bangalore,KA" },
                    ]} />
                </FieldsetRow>
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
