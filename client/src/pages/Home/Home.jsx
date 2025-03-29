import Banner from "./Banner";
import FeaturedMembers from "./FeaturedMembers";
import HowItWorks from "./HowItWorks";
import Stats from "./Stats";
import SuccessStory from "./SuccessStory";

const Home = () => {
    return (
        <div className="bg-base-100">
            {/* Banner */}
            <Banner />
            {/* Featured Members */}
            <FeaturedMembers />
            {/* How It Works */}
            <HowItWorks />
            {/* Stats */}
            <Stats />
            {/* Success Story */}
            <SuccessStory />
        </div>
    );
};

export default Home;