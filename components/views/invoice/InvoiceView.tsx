import PropTypes from 'prop-types'
import React from 'react'
import Card from 'components/ui/layout/Card'
import { useInvoiceById, useInvoiceLoading } from 'store/InvoiceSlice'
import InvoicePrint from './InvoicePrint'
import { useMe, useMeLoading } from 'store/UserSlice'

type InvoiceViewProps = {
    invoiceId: string | null,
}
const InvoicePropTypes = {
    invoiceId: PropTypes.string,
}
function InvoiceView({ invoiceId }: InvoiceViewProps) {
    const invoice = useInvoiceById(invoiceId);
    const me = useMe();
    const loading = [useInvoiceLoading(), useMeLoading()].some(Boolean);
    const title = 'View Invoice';
    let content;

    if (loading) {
        content = "loading data";
    } else if (invoice !== null) {
        content = <InvoicePrint clientInvoice={invoice} me={me} />;
    } else {
        content = "sorry we could not find the invoice";
    }

    return (
        <>
            {content}
        </>
    )
}

InvoiceView.propTypes = InvoicePropTypes;

export default InvoiceView
