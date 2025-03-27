import { useNavigate } from 'react-router';

const Error = () => {
  const navigate = useNavigate();

  return (
    <section className="h-screen flex items-center justify-center bg-base-100">
      <div className="text-center p-8 rounded-xl shadow-lg bg-base-200 max-w-lg w-11/12">
        <h1 className="text-5xl md:text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-2">Page Not Found</h2>
        <p className="text-base md:text-lg text-neutral mb-6">Sorry, the page you're looking for doesn't exist or has been moved.</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 rounded-md bg-primary hover:bg-primary-focus text-white text-base md:text-lg font-semibold transition-colors cursor-pointer">
          Go Back Home
        </button>
      </div>
    </section>
  );
};

export default Error;