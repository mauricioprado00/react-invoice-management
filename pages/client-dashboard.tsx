import type { NextPage } from 'next'
import ClientShow from 'site-specific/components/sections/client/ClientShow';
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';
import InvoiceTable from 'site-specific/components/sections/invoice/InvoiceTable';
import Card from 'elements/Card';
import { useParamId } from 'hooks/use-url';

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
