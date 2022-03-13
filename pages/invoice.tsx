import type { NextPage } from 'next'
import InvoiceEdition from 'components/views/invoice/InvoiceEdition';
import { useGoInvoiceDashboard, useGoDashboard, useParamInvoiceId } from 'library/navigation';
import AuthPageWithStore from 'components/utility/AuthPageWithStore';
import { useCallback } from 'react';
import { ClientInvoice, Invoice } from 'models/Invoice';

const Invoice: NextPage = () => {
    const invoiceId = useParamInvoiceId();
    const goInvoiceDashboard = useGoInvoiceDashboard();
    const goDashboard = useGoDashboard();
    const goBack = useCallback((clientInvoice:Partial<ClientInvoice>|null) => {
        if (clientInvoice?.invoice?.id) {
            goInvoiceDashboard(clientInvoice.invoice.id);
        } else {
            goDashboard();
        }
    }, [goInvoiceDashboard, goDashboard]);

    return <InvoiceEdition onCancel={goBack} onSave={goBack} invoiceId={invoiceId} />
}

export default AuthPageWithStore(Invoice)
