import type { NextPage } from 'next'
import InvoiceEdition from 'site-specific/components/sections/invoice/InvoiceEdition';
import { useGoInvoiceView, useGoNewClientForInvoice, useParamClientId } from 'site-specific/hooks/use-navigation';
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';
import { useCallback } from 'react';
import { ClientInvoice } from 'site-specific/models/Invoice';
import { useGoBack, useParamId } from 'hooks/use-url';

const InvoicePage: NextPage = () => {
    const invoiceId = useParamId();
    const clientId = useParamClientId();
    const goView = useGoInvoiceView();
    const goBack = useGoBack();
    const goViewSaved = useCallback((clientInvoice:ClientInvoice) => {
        goView(clientInvoice.invoice.id)
    }, [goView]);
    const goAddClient = useGoNewClientForInvoice();

    return <InvoiceEdition
        onCancel={goBack}
        onSave={goViewSaved}
        onNoClients={goAddClient}
        invoiceId={invoiceId} clientId={clientId} />
}

export default AuthPageWithStore(InvoicePage)
