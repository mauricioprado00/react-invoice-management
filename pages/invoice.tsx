import type { NextPage } from 'next'
import InvoiceEdition from 'components/views/invoice/InvoiceEdition';
import { useGoBack, useGoInvoiceView, useParamInvoiceId } from 'library/navigation';
import AuthPageWithStore from 'components/utility/AuthPageWithStore';
import { useCallback } from 'react';
import { ClientInvoice } from 'models/Invoice';

const InvoicePage: NextPage = () => {
    const invoiceId = useParamInvoiceId();
    const goView = useGoInvoiceView();
    const goBack = useGoBack();
    const goViewSaved = useCallback((clientInvoice:ClientInvoice) => {
        goView(clientInvoice.invoice.id)
    }, [goView])

    return <InvoiceEdition onCancel={goBack} onSave={goViewSaved} invoiceId={invoiceId} />
}

export default AuthPageWithStore(InvoicePage)
