import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function EmployeeTable() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fetchEmployee = await axios.get(
        "http://localhost:3000/api/employeeSalary/read",
      );
      const response = fetchEmployee.data;
      const updatedEmployees = response.employee.map((emp) => {
        if (new Date(emp.expiredAt) < new Date()) {
          emp.status = "Inactive";
          axios
            .put(`http://localhost:3000/api/employee/update/${emp._id}`, {
              status: "Inactive",
            })
            .then((response) => {
              console.log("Employee status updated:", response);
            })
            .catch((error) => {
              console.error("Error updating employee status:", error);
            });
        }
        return emp;
      });
      setData(response);
      setSearchResults(updatedEmployees);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = data.employee?.filter((elem) => {
      return (
        elem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        elem.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        elem.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setSearchResults(filtered || []);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteId(id);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/employeeSalary/delete/${deleteId}`,
      );
      setData((prevState) => ({
        ...prevState,
        employee: prevState.employee.filter((emp) => emp._id !== deleteId),
      }));
      setDeleteId(null);
      toast.success("Employee deleted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  return (
    <div>
      <div>
        <form className="px-6 py-4 flex justify-end" onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search employee salary..."
              className="bg-zinc-800 border border-zinc-700 rounded-lg placeholder-zinc-500 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-56 p-2 pl-10 text-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
            <FaSearch className="text-zinc-500 absolute top-1/2 transform -translate-y-1/2 left-3" />
          </div>
          <button type="submit" className="btn-primary ml-2 text-sm">
            Search
          </button>
        </form>
      </div>
      <div className="px-6">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-900/50">
              <th className="table-th">ID</th>
              <th className="table-th">Name</th>
              <th className="table-th">Email</th>
              <th className="table-th">NIC</th>
              <th className="table-th">Gender</th>
              <th className="table-th">Contact No</th>
              <th className="table-th">Job Role</th>
              <th className="table-th">Salary</th>
              <th className="table-th">Date</th>
              <th className="table-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchResults?.map((elem, index) => {
              return (
                <tr key={index} className="table-row">
                  <td className="table-td">{elem._id}</td>
                  <td className="table-td">{elem.name}</td>
                  <td className="table-td">{elem.email}</td>
                  <td className="table-td">{elem.NIC}</td>
                  <td className="table-td">{elem.gender}</td>
                  <td className="table-td">{elem.contactNo}</td>
                  <td className="table-td">{elem.empRole}</td>
                  <td className="table-td">{elem.address}</td>
                  <td className="table-td">{formatDate(elem.DOB)}</td>
                  <td className="table-td">
                    <div className="flex gap-2 text-sm">
                      <Link to={`/update-Salary-employee/${elem._id}`}>
                        <button className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-all rounded px-3 py-1 text-xs font-medium">
                          Update
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteConfirmation(elem._id)}
                        className="bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all rounded px-3 py-1 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {deleteId && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black/80 z-50">
          <div className="bg-zinc-900 border border-zinc-700 text-zinc-100 p-8 rounded-xl shadow-xl">
            <p className="text-base font-semibold mb-4">
              Delete this salary assignment?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleDeleteConfirmed}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeTable;
