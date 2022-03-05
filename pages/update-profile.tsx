import type { NextPage } from 'next'
import AuthPageWithStore from 'components/utility/AuthPageWithStore';
import ProfileShow from 'components/views/user/ProfileShow';
import ProfileEdition from 'components/views/user/ProfileEdition';
import { useGoMe } from 'library/navigation';

const UpdateProfile: NextPage = () => {
    const goMe = useGoMe();
    return <ProfileEdition onCancel={goMe} onSave={goMe} />
}

export default AuthPageWithStore(UpdateProfile)
