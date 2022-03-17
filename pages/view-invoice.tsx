import type { NextPage } from 'next'
import { useParamInvoiceId } from 'library/navigation';
import AuthPageWithStore from 'components/utility/AuthPageWithStore';
import InvoiceView from 'components/views/invoice/InvoiceView';

const ViewInvoice: NextPage = () => {
    const invoiceId = useParamInvoiceId();
    return <InvoiceView invoiceId={invoiceId} />
}

export default AuthPageWithStore(ViewInvoice)
