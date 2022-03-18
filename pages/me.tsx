import type { NextPage } from 'next'
import AuthPageWithStore from 'components/utility/AuthPageWithStore';
import UserShow from 'components/views/user/UserShow';

const ClientDashboardPage: NextPage = () => {
    return <UserShow />
}

export default AuthPageWithStore(ClientDashboardPage)
