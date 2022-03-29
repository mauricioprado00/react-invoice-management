import type { NextPage } from 'next'
import { useGoInvoices } from 'site-specific/hooks/use-navigation';
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';
import InvoiceView from 'site-specific/containers/invoice/InvoiceView';
import { useParamId } from 'hooks/use-url';

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
