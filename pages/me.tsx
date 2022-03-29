import type { NextPage } from 'next'
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';
import UserShow from 'components/views/user/UserShow';
import Card from 'elements/Card';

const ClientDashboardPage: NextPage = () => {
    return <Card size='big' fullscreen={false} background="">
        <UserShow />
    </Card>
}

export default AuthPageWithStore(ClientDashboardPage)
