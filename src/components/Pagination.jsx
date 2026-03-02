function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const goPrev = () => onPageChange(Math.max(page - 1, 1));
  const goNext = () => onPageChange(Math.min(page + 1, totalPages));

  return (
    <div className="pagination">
      <button type="button" className="btn btn-secondary" onClick={goPrev} disabled={page === 1}>
        Previous
      </button>
      <p>
        Page {page} of {totalPages}
      </p>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={goNext}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
