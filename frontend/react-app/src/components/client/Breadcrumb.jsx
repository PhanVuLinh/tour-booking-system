import React from "react";

function Breadcrumb({ title, list, image }) {
  return (
    <div className="box-breadcrumb">
      <div className="inner-image">
        <img src={image || "assets/images/default-banner.jpg"} alt={title} />
        <div className="overlay"></div>
      </div>

      <div className="inner-content">
        <div className="container">
          {/* Tiêu đề động */}
          <h1 className="inner-title">{title}</h1>

          <div className="inner-list">
            {list &&
              list.map((item, index) => (
                <React.Fragment key={index}>
                  <a href={item.url}>{item.title}</a>

                  {index < list.length - 1 && (
                    <span className="separator"> » </span>
                  )}
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Breadcrumb;
