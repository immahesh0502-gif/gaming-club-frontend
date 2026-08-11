import { useEffect, useState } from "react";

import {
    getAllCustomers,
    saveCustomer,
    updateCustomer,
    deleteCustomer
} from "../services/customerService";
function Customers() {

    const [customers, setCustomers] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [newCustomer, setNewCustomer] = useState({
        name: "",
        mobileNumber: ""
    });
    const [search, setSearch] = useState("");
    const fetchCustomers = async () => {

        try {

            const response = await getAllCustomers();

            setCustomers(response.data);

        } catch (error) {

            console.error(error);

        }

    };
    useEffect(() => {

        fetchCustomers();

    }, []);
    const handleSaveCustomer = async () => {
        if (
            newCustomer.name.trim() === "" ||
            newCustomer.mobileNumber.trim() === ""
        ) {
            alert("Please fill all fields");
            return;
        }

        if (editingId === null) {

            try {

                await saveCustomer(newCustomer);

                fetchCustomers();

            } catch (error) {

                console.error(error);

            }

        } else {

            try {

                await updateCustomer(editingId, newCustomer);

                fetchCustomers();

            } catch (error) {

                console.error(error);

            }

        }

        setNewCustomer({
            name: "",
            mobileNumber: ""
        });

        setEditingId(null);

        setShowModal(false);
    };
    const handleDeleteCustomer = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteCustomer(id);

            fetchCustomers();

        } catch (error) {

            console.error(error);
            alert("Unable to delete customer");

        }

    };

    return (
        <>
            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>👤 Customer Management</h2>

                <button
                    className="btn btn-warning"
                    onClick={() => {
                        setEditingId(null);

                        setNewCustomer({
                            name: "",
                            mobileNumber: ""
                        });

                        setShowModal(true);
                    }}
                >
                    + Add Customer
                </button>

            </div>

            {/* Search */}

            <div className="mb-3">

                <input
                    type="text"
                    className="form-control"
                    placeholder="🔍 Search Customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            {/* Table */}

            <table className="table table-bordered table-hover align-middle">

                <thead className="table-dark">

                <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Mobile Number</th>
                    <th width="180">Actions</th>
                </tr>

                </thead>

                <tbody>

                {customers
                    .filter(customer =>
                        customer.name
                            .toLowerCase()
                            .includes(search.toLowerCase())
                    )
                    .map((customer) => (

                    <tr key={customer.id}>

                        <td>{customer.id}</td>

                        <td>{customer.name}</td>

                        <td>{customer.mobileNumber}</td>

                        <td>

                            <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => {

                                    setEditingId(customer.id);

                                    setNewCustomer({
                                        name: customer.name,
                                        mobileNumber: customer.mobileNumber
                                    });

                                    setShowModal(true);

                                }}
                            >
                                Edit
                            </button>

                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteCustomer(customer.id)}
                            >
                                Delete
                            </button>

                        </td>

                    </tr>

                ))}

                </tbody>

            </table>
            {/* Customer Modal */}

            {showModal && (

                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >

                    <div className="modal-dialog">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">
                                    {editingId === null ? "Add Customer" : "Edit Customer"}
                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>

                            </div>

                            <div className="modal-body">

                                <div className="mb-3">

                                    <label className="form-label">
                                        Customer Name
                                    </label>

                                    <input
                                        className="form-control"
                                        placeholder="Enter Customer Name"
                                        value={newCustomer.name}
                                        onChange={(e) =>
                                            setNewCustomer({
                                                ...newCustomer,
                                                name: e.target.value
                                            })
                                        }
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Mobile Number
                                    </label>

                                    <input
                                        className="form-control"
                                        placeholder="Enter Mobile Number"
                                        value={newCustomer.mobileNumber}
                                        onChange={(e) =>
                                            setNewCustomer({
                                                ...newCustomer,
                                                mobileNumber: e.target.value
                                            })
                                        }
                                    />

                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-warning"
                                    onClick={handleSaveCustomer}
                                >
                                    {editingId === null
                                        ? "Save Customer"
                                        : "Update Customer"}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}
        </>
    );
}

export default Customers;