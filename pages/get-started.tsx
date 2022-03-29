import type { NextPage } from 'next'
import PageWithStore from 'site-specific/components/PageWithStore';
import Signup from 'site-specific/components/sections/user/Signup';
import { useGoEditMe } from 'site-specific/hooks/use-navigation';

const GetStartedPage: NextPage = () => {
    const goEditMe = useGoEditMe();

    return (<Signup onRegisteredAndLoggedIn={() => {goEditMe(); return true;}} />);
}

export default PageWithStore(GetStartedPage)
