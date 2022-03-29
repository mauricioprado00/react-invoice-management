import type { NextPage } from 'next'
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';
import UserEdition from 'site-specific/components/sections/user/UserEdition';
import { useGoMe } from 'site-specific/hooks/use-navigation';

const UpdateProfilePage: NextPage = () => {
    const goMe = useGoMe();
    return <UserEdition onCancel={goMe} onSave={goMe} />
}

export default AuthPageWithStore(UpdateProfilePage)
