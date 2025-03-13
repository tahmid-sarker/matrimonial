import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import useAuth from '../../hooks/useAuth';

const DynamicTitle = () => {
    const { id, biodataId } = useParams();
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        const currentPath = location.pathname;
        let title = 'Bengal Matrimony';

        if (currentPath === '/') {
            title = 'Home | Bengal Matrimony';
        } else if (currentPath === '/about-us') {
            title = 'About Us | Bengal Matrimony';
        } else if (currentPath === '/contact-us') {
            title = 'Contact Us | Bengal Matrimony';
        } else if (currentPath === '/biodatas') {
            title = "All Bio Data's | Bengal Matrimony";
        } else if (currentPath === `/biodata/${id}`) {
            title = 'Bio Data Details | Bengal Matrimony';
        } else if (currentPath === `/checkout/${biodataId}`) {
            title = 'Payment Gateway | Bengal Matrimony';
        } else if (currentPath === '/my-profile') {
            title = `${user?.displayName || 'My Profile'} | Bengal Matrimony`;
        } else if (currentPath === '/my-biodata') {
            title = 'My Bio Data | Bengal Matrimony';
        } else if (currentPath === '/dashboard') {
            title = 'Dashboard | Bengal Matrimony';
        } else if (currentPath === '/dashboard/manage-users') {
            title = 'Manage Users | Bengal Matrimony';
        } else if (currentPath === '/dashboard/approve-premium') {
            title = 'Approve Premium Requests | Bengal Matrimony';
        } else if (currentPath === '/dashboard/stories') {
            title = 'Success Stories | Bengal Matrimony';
        } else if (currentPath === '/dashboard/payment-list') {
            title = 'Payment List | Bengal Matrimony';
        } else if (currentPath === '/dashboard/contact-messages') {
            title = 'Contact Messages | Bengal Matrimony';
        } else if (currentPath === '/dashboard/update-profile') {
            title = 'Update Profile | Bengal Matrimony';
        } else if (currentPath === '/dashboard/edit') {
            title = 'Edit Bio Data | Bengal Matrimony';
        } else if (currentPath === '/dashboard/favorites') {
            title = "Favorite Bio Data's | Bengal Matrimony";
        } else if (currentPath === '/dashboard/married') {
            title = 'Married Couples | Bengal Matrimony';
        } else {
            title = '404 Not Found | Bengal Matrimony';
        }
        
        document.title = title;
    }, [location.pathname, biodataId, id, user]);

    return null;
};

export default DynamicTitle;