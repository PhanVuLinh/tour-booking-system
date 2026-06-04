function Pagination() {
  return (
    <div className="pagination">
      <button className="page-btn">
        <i className="fa-solid fa-angles-left"></i>
      </button>
      <button className="page-btn active">1</button>
      <button className="page-btn">2</button>
      <button className="page-btn">3</button>
      <button className="page-btn">4</button>
      <button className="page-btn">
        <i className="fa-solid fa-angles-right"></i>
      </button>
    </div>
  );
}

export default Pagination;
