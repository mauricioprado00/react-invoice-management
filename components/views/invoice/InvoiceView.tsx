import PropTypes from 'prop-types'
import React from 'react'
import { useInvoiceById, useInvoiceLoading } from 'store/InvoiceSlice'
import InvoicePrint from './InvoicePrint'
import { useMe, useMeLoading } from 'store/UserSlice'
import ErrorBanner from 'components/utility/ErrorBanner'
import Card from 'components/ui/layout/Card'

type InvoiceViewProps = {
    invoiceId: string,
}
const InvoicePropTypes = {
    invoiceId: PropTypes.string,
}
function InvoiceView({ invoiceId }: InvoiceViewProps) {
    const invoice = useInvoiceById(invoiceId);
    const me = useMe();
    const loading = [useInvoiceLoading(), useMeLoading()].some(Boolean);
    let content;

    if (!invoice && loading) {
        content = "loading data";
    } else if (invoice !== null && me !== null) {
        content = <InvoicePrint clientInvoice={invoice} me={me} />;
    } else {
        content = <Card fullscreen={false}><ErrorBanner>sorry we could not find the invoice</ErrorBanner></Card>;
    }

    return (
        <div className="pt-20 print:pt-0 bg-gray-100">
            {content}
        </div>
    )
}

InvoiceView.propTypes = InvoicePropTypes;

export default InvoiceView
