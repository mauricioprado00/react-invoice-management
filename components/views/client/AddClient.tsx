import React from 'react'
import PropTypes from 'prop-types'
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText from 'components/ui/forms/InputText'
import Button, { ButtonStyle } from '../../ui/forms/Button'
import Card from '../../ui/layout/Card'

function AddClient(props) {

    return (
        <Card title="Add Client">
            <Form>
                <FieldsetRow>
                    <InputText label="Name" required={true} />
                    <InputText label="Email" placeholder="Email ID" required={true} />
                </FieldsetRow>
                <FieldsetRow>
                    <InputText label="Company Name" required={true} />
                    <InputText label="Address" required={true} />
                </FieldsetRow>
                <FieldsetRow>
                    <InputText label="Reg Number" required={true} />
                    <InputText label="Vat Number" required={true} />
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
