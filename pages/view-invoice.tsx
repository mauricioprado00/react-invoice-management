import type { NextPage } from 'next'
import { useGoInvoices, useParamId } from 'library/navigation';
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';
import InvoiceView from 'components/views/invoice/InvoiceView';

const ViewInvoicePage: NextPage = () => {
    const invoiceId = useParamId();
    const goInvoices = useGoInvoices();
    if (!invoiceId) {
        goInvoices();
    }
    return <>
    {invoiceId && <InvoiceView invoiceId={invoiceId} />}
    </>
}

export default AuthPageWithStore(ViewInvoicePage)
