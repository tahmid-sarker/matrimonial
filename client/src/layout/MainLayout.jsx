import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import DynamicTitle from '../components/shared/DynamicTitle';

const MainLayout = () => {
    return (
        <>
            <DynamicTitle />
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

export default MainLayout;