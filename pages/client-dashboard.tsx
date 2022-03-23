import type { NextPage } from 'next'
import { useParamId } from 'library/navigation';
import ClientShow from 'components/views/client/ClientShow';
import AuthPageWithStore from 'components/utility/AuthPageWithStore';
import InvoiceTable from 'components/views/invoice/InvoiceTable';
import Card from 'components/ui/layout/Card';

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
