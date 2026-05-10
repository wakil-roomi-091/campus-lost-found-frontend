import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiDownload,
  FiFileText,
  FiFile,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiLoader,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import AlertModal from "../components/common/AlertModal";
import axios from "axios";

const AdminExport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }
  }, [user, navigate]);

  const handleExport = async (endpoint, filename, format) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://https://web-production-c29aa.up.railway.app/api/export/${endpoint}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setAlertConfig({
        title: "Success",
        message: `${filename.toUpperCase()} exported successfully!`,
        type: "success",
      });
      setShowAlert(true);
    } catch (err) {
      setAlertConfig({
        title: "Error",
        message: "Failed to export data",
        type: "error",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const exportOptions = [
    {
      title: "Users Data",
      icon: FiUsers,
      color: "blue",
      bgClass: "bg-blue-500/20",
      textClass: "text-blue-400",
      formats: [
        {
          name: "CSV",
          endpoint: "users/csv",
          filename: "users",
          format: "csv",
        },
        {
          name: "Excel",
          endpoint: "users/excel",
          filename: "users",
          format: "xlsx",
        },
      ],
    },
    {
      title: "Items Data",
      icon: FiPackage,
      color: "green",
      bgClass: "bg-green-500/20",
      textClass: "text-green-400",
      formats: [
        {
          name: "CSV",
          endpoint: "items/csv",
          filename: "items",
          format: "csv",
        },
        {
          name: "Excel",
          endpoint: "items/excel",
          filename: "items",
          format: "xlsx",
        },
      ],
    },
    {
      title: "Statistics Report",
      icon: FiBarChart2,
      color: "purple",
      bgClass: "bg-purple-500/20",
      textClass: "text-purple-400",
      formats: [
        {
          name: "PDF",
          endpoint: "report/pdf",
          filename: "report",
          format: "pdf",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition"
          >
            <FiArrowLeft /> Back
          </button>
          <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            </div>
            <div className="relative z-10 px-6 py-3">
              <h1 className="text-2xl font-bold text-white">Export Data</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exportOptions.map((option, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 ${option.bgClass} rounded-xl flex items-center justify-center`}
                >
                  <option.icon className={`w-6 h-6 ${option.textClass}`} />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {option.title}
                </h2>
              </div>

              <div className="space-y-3">
                {option.formats.map((format, fmtIndex) => (
                  <button
                    key={fmtIndex}
                    onClick={() =>
                      handleExport(
                        format.endpoint,
                        format.filename,
                        format.format,
                      )
                    }
                    disabled={loading}
                    className="w-full flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <FiFile className="text-gray-500" />
                      <span className="text-gray-300">{format.name}</span>
                    </div>
                    <FiDownload className="text-emerald-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-2xl p-6 flex items-center gap-3 border border-gray-700 shadow-xl">
              <FiLoader className="w-6 h-6 text-emerald-400 animate-spin" />
              <span className="text-gray-300">Exporting data...</span>
            </div>
          </div>
        )}
      </div>

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
};

export default AdminExport;
