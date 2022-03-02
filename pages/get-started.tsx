import type { NextPage } from 'next'
import PageWithStore from 'components/utility/PageWithStore';
import Signup from 'components/views/user/Signup';

const GetStarted: NextPage = () => {

    return (<Signup />);
}

export default PageWithStore(GetStarted)
