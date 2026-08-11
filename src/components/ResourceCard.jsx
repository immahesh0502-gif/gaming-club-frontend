function ResourceCard({
                          title,
                          image,
                          resources
                      }) {

    return (

        <div className="card shadow-sm border-0 h-100">

            <div className="card-body">

                <h5 className="fw-bold mb-3">
                    {title}
                </h5>

                <img
                    src={image}
                    alt={title}
                    className="img-fluid mb-3 rounded"
                    style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover"
                    }}
                />

                {resources.map((resource) => (

                    <div
                        key={resource.name}
                        className="d-flex justify-content-between align-items-center border-bottom py-2"
                    >

                        <span>{resource.name}</span>

                        <span
                            className={`badge ${
                                resource.running
                                    ? "bg-success"
                                    : "bg-secondary"
                            }`}
                        >
                        {resource.running
                            ? "Running"
                            : "Available"}
                    </span>

                    </div>

                ))}

            </div>

        </div>

    );

}
export default ResourceCard;