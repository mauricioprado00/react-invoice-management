import type { NextPage } from 'next'
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';
import UserEdition from 'components/views/user/UserEdition';
import { useGoMe } from 'library/navigation';

const UpdateProfilePage: NextPage = () => {
    const goMe = useGoMe();
    return <UserEdition onCancel={goMe} onSave={goMe} />
}

export default AuthPageWithStore(UpdateProfilePage)
