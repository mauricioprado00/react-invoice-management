import type { NextPage } from 'next'
import { useGoInvoices, useParamInvoiceId } from 'library/navigation';
import AuthPageWithStore from 'components/utility/AuthPageWithStore';
import InvoiceView from 'components/views/invoice/InvoiceView';

const ViewInvoicePage: NextPage = () => {
    const invoiceId = useParamInvoiceId();
    const goInvoices = useGoInvoices();
    if (!invoiceId) {
        goInvoices();
    }
    return <>
    {invoiceId && <InvoiceView invoiceId={invoiceId} />}
    </>
}

export default AuthPageWithStore(ViewInvoicePage)
