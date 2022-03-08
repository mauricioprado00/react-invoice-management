import type { NextPage } from 'next'
import PageWithStore from 'components/utility/PageWithStore';
import Signup from 'components/views/user/Signup';
import { useGoEditMe } from 'library/navigation';

const GetStarted: NextPage = () => {
    const goEditMe = useGoEditMe();

    return (<Signup onRegisteredAndLoggedIn={() => {goEditMe(); return true;}} />);
}

export default PageWithStore(GetStarted)
