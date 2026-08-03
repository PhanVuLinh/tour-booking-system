import { useSearchParams } from 'react-router-dom';

function Pagination({ currentPage = 1, totalPages = 1 }) {
  const [searchParams, setSearchParams] = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', page);
      setSearchParams(newParams);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button 
        className="page-btn" 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="fa-solid fa-angles-left"></i>
      </button>

      {pages.map(page => (
        <button 
          key={page}
          className={`page-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      <button 
        className="page-btn" 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="fa-solid fa-angles-right"></i>
      </button>
    </div>
  );
}

export default Pagination;
