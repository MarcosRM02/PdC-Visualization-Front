import { IBreadcrumbProps } from '../../Interfaces/BreadcrumbInterfaces';
import { Link } from 'react-router-dom';

const Breadcrumb: React.FC<IBreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              {!isLast ? (
                <>
                  <Link
                    to={item.path}
                    className="group text-l font-bold text-gray-500 transition duration-300 transform hover:scale-105 hover:text-gray-700"
                  >
                    <span className="relative">
                      {item.label}
                      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                  <span className="mx-2 text-l font-bold text-gray-500">
                    {'>'}
                  </span>
                </>
              ) : (
                <span className="text-l font-bold text-gray-800">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
