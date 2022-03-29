import type { NextPage } from 'next'
import PageWithStore from 'site-specific/components/PageWithStore';
import Signup from 'components/views/user/Signup';
import { useGoEditMe } from 'library/navigation';

const GetStartedPage: NextPage = () => {
    const goEditMe = useGoEditMe();

    return (<Signup onRegisteredAndLoggedIn={() => {goEditMe(); return true;}} />);
}

export default PageWithStore(GetStartedPage)
