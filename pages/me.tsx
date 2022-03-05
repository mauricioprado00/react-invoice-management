import type { NextPage } from 'next'
import AuthPageWithStore from 'components/utility/AuthPageWithStore';
import UserShow from 'components/views/user/UserShow';

const ClientDashboard: NextPage = () => {
    return <UserShow />
}

export default AuthPageWithStore(ClientDashboard)
