import { useEffect, useState } from "react";
import { getAllResources } from "../services/resourceService";

function Resources() {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("ALL");
    const [selectedStatus, setSelectedStatus] = useState("ALL");

    const [resources, setResources] = useState([]);

    const loadResources = async () => {
        try {
            const response = await getAllResources();

            console.log("API Response:", response.data);

            setResources(response.data);
        } catch (error) {
            console.error("Error loading resources:", error);
        }
    };
    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await getAllResources();
                setResources(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchResources();
    }, []);


    const filteredResources = resources.filter((resource) => {

        const matchesSearch =
            resource.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType =
            selectedType === "ALL" || resource.type === selectedType;

        const matchesStatus =
            selectedStatus === "ALL" || resource.status === selectedStatus;

        return matchesSearch && matchesType && matchesStatus;

    });

    return (
        <>

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="fw-bold">Resource Management</h2>


            </div>

            {/* Search */}
                <div className="row g-3 mb-4">

                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Resource..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    {/*dropdown*/}
                    <select
                        className="form-select"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value="ALL">All Types</option>
                        <option value="TABLE">Table</option>
                        <option value="PS5">PS5</option>
                        <option value="PS4">PS4</option>
                        <option value="CARROM">Carrom</option>
                    </select>
                </div>

                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="AVAILABLE">Available</option>
                        <option value="OCCUPIED">Occupied</option>
                        <option value="MAINTENANCE">Maintenance</option>
                    </select>
                </div>

            </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body">
            {/* Table */}

           <table className="table table-hover align-middle mb-0">

                            <thead className="table-dark">
                            <tr>
                                <th className="text-center">ID</th>
                                <th>Name</th>
                                <th className="text-center">Type</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Day Rate</th>
                                <th className="text-center">Night Rate</th>
                            </tr>
                            </thead>

                <tbody>

                {filteredResources.map((resource) => (

                    <tr key={resource.id}>

                        <td className="text-center">
                            {resource.id}
                        </td>

                        <td>
                            {resource.name}
                        </td>

                        <td className="text-center">
                            {resource.type === "TABLE"
                                ? "Table"
                                : resource.type === "CARROM"
                                    ? "Carrom"
                                    : resource.type === "PS5"
                                        ? "PS5"
                                        : resource.type === "PS4"
                                            ? "PS4"
                                            : resource.type}
                        </td>

                        <td className="text-center">
        <span
            className={
                resource.status === "AVAILABLE"
                    ? "badge bg-success px-3 py-2"
                    : resource.status === "OCCUPIED"
                        ? "badge bg-danger px-3 py-2"
                        : "badge bg-warning text-dark px-3 py-2"
            }
        >
            {resource.status.charAt(0) + resource.status.slice(1).toLowerCase()}
        </span>
                        </td>

                        <td className="text-center fw-semibold">
                            ₹{resource.dayRate}
                        </td>

                        <td className="text-center fw-semibold">
                            ₹{resource.nightRate}
                        </td>

                    </tr>

                ))}

                </tbody>

            </table>

                    </div>
                </div>


        </>
    );
}

export default Resources;