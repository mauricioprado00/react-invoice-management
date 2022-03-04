import type { NextPage } from 'next'
import AuthPageWithStore from 'components/utility/AuthPageWithStore';
import ProfileShow from 'components/views/user/ProfileShow';

const ClientDashboard: NextPage = () => {
    return <ProfileShow />
}

export default AuthPageWithStore(ClientDashboard)
