import type { NextPage } from 'next'
import InvoiceEdition from 'components/views/invoice/InvoiceEdition';
import { useGoDashboard, useGoInvoiceView, useParamInvoiceId } from 'library/navigation';
import AuthPageWithStore from 'components/utility/AuthPageWithStore';
import { useCallback } from 'react';
import { ClientInvoice, Invoice } from 'models/Invoice';

const InvoicePage: NextPage = () => {
    const invoiceId = useParamInvoiceId();
    const goDashboard = useGoDashboard();
    const goView = useGoInvoiceView();
    const goBack = useCallback((clientInvoice:Partial<ClientInvoice>|null) => {
        if (clientInvoice?.invoice?.id) {
            goView(clientInvoice?.invoice?.id); //goInvoiceDashboard(clientInvoice.invoice.id);
        } else {
            goDashboard();
        }
    }, [goDashboard, goView]);
    const goViewSaved = useCallback((clientInvoice:ClientInvoice) => {
        goView(clientInvoice.invoice.id)
    }, [goView])

    return <InvoiceEdition onCancel={goBack} onSave={goViewSaved} invoiceId={invoiceId} />
}

export default AuthPageWithStore(InvoicePage)
