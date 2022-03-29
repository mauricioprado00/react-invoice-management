import type { NextPage } from 'next'
import { useParamId } from 'library/navigation';
import ClientShow from 'site-specific/containers/client/ClientShow';
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';
import InvoiceTable from 'site-specific/containers/invoice/InvoiceTable';
import Card from 'elements/Card';

const ClientDashboardPage: NextPage = () => {
    const clientId = useParamId();

    return <Card size='big' fullscreen={false} background="">
        <ClientShow clientId={clientId} />
        <div className="pt-5"></div>
        <a id="invoices"></a>
        {clientId && <InvoiceTable title="Latest Invoices" latest={true} clientId={clientId} />}
    </Card>
}

export default AuthPageWithStore(ClientDashboardPage)
