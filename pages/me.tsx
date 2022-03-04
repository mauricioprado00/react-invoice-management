import type { NextPage } from 'next'
import { useParamClientId } from 'library/navigation';
import AuthPageWithStore from 'components/utility/AuthPageWithStore';
import ProfileShow from 'components/views/user/ProfileShow';

const ClientDashboard: NextPage = () => {
    const clientId = useParamClientId();

    return <ProfileShow clientId={clientId} />
}

export default AuthPageWithStore(ClientDashboard)
