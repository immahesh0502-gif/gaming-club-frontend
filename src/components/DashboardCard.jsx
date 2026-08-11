function DashboardCard({ title, value, color = "#212529" }) {

    return (
        <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

                <small
                    className="text-uppercase text-secondary"
                    style={{
                        fontSize: "12px",
                        letterSpacing: "1px"
                    }}
                >
                    {title}
                </small>

                <h2
                    className="fw-bold mt-3 mb-0"
                    style={{
                        color: color || "#212529"
                    }}
                >
                    {value}
                </h2>

            </div>

        </div>
    );

}

export default DashboardCard;