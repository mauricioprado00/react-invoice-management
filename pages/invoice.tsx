import type { NextPage } from 'next'
import InvoiceEdition from 'site-specific/containers/invoice/InvoiceEdition';
import { useGoBack, useGoInvoiceView, useParamClientId, useParamId } from 'site-specific/hooks/use-navigation';
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';
import { useCallback } from 'react';
import { ClientInvoice } from 'models/Invoice';

const InvoicePage: NextPage = () => {
    const invoiceId = useParamId();
    const clientId = useParamClientId();
    const goView = useGoInvoiceView();
    const goBack = useGoBack();
    const goViewSaved = useCallback((clientInvoice:ClientInvoice) => {
        goView(clientInvoice.invoice.id)
    }, [goView])

    return <InvoiceEdition onCancel={goBack} onSave={goViewSaved} invoiceId={invoiceId} clientId={clientId} />
}

export default AuthPageWithStore(InvoicePage)
