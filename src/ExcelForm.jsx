import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";

export default function ExcelForm() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedCols, setSelectedCols] = useState([]);
const [addDate, setAddDate] = useState(false);
const [dateColumnName, setDateColumnName] = useState("Generated Date");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length > 0) {
        setData(jsonData);
        setColumns(Object.keys(jsonData[0]));
      }
    };
    reader.readAsBinaryString(file);
  };

  const toggleColumn = (col) => {
    setSelectedCols((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const generateExcel = () => {
    const today = new Date().toISOString().split("T")[0];

    const filteredData = data.map((row) => {
      const obj = {};
      selectedCols.forEach((col) => (obj[col] = row[col]));

      if (addDate) {
        obj[dateColumnName || "Generated Date"] = today;
      }

      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredData");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Filtered_Excel.xlsx"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0b1c3f] to-[#020617] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-xl rounded-3xl p-8
        bg-white/10 backdrop-blur-xl border border-white/20
        shadow-[0_0_40px_rgba(59,130,246,0.25)]"
      >
        {/* Glow */}
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20 blur-xl"></div>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white tracking-wide"
          >
            Excel AI Column Filter
          </motion.h2>

          <p className="text-sm text-blue-200 mb-6">
            Upload → Select → Generate futuristic Excel
          </p>

          {/* Upload */}
          <motion.label
            whileHover={{ scale: 1.02 }}
            className="block mb-6"
          >
            <span className="text-xs text-blue-200 uppercase tracking-widest">
              Upload Excel File
            </span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="mt-3 block w-full text-sm text-white
              file:mr-4 file:py-3 file:px-5
              file:rounded-xl file:border-0
              file:bg-gradient-to-r file:from-blue-500 file:to-indigo-600
              file:text-white hover:file:opacity-90 cursor-pointer"
            />
          </motion.label>

          {/* Columns */}
          <AnimatePresence>
            {columns.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-sm text-blue-200 mb-2">
                  Select Columns
                </h3>

                <div className="max-h-56 overflow-y-auto rounded-xl border border-white/20 p-3 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    {columns.map((col) => (
                      <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        key={col}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm
                        transition-all
                        ${
                          selectedCols.includes(col)
                            ? "bg-blue-500/20 text-blue-300 border border-blue-400/40"
                            : "text-gray-200 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCols.includes(col)}
                          onChange={() => toggleColumn(col)}
                        />
                        {col}
                      </motion.label>
                    ))}
                  </div>
                </div>

                <div className="mb-6 space-y-3">
                  <label className="flex items-center gap-3 text-sm text-blue-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addDate}
                      onChange={() => setAddDate(!addDate)}
                    />
                    Add Current Date Column
                  </label>

                  {addDate && (
                    <input
                      type="text"
                      value={dateColumnName}
                      onChange={(e) => setDateColumnName(e.target.value)}
                      placeholder="Date column name"
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20
                      text-white placeholder:text-gray-400 text-sm"
                    />
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={selectedCols.length === 0}
                  onClick={generateExcel}
                  className={`w-full py-3 rounded-xl font-semibold tracking-wide
                  transition-all
                  ${
                    selectedCols.length === 0
                      ? "bg-white/20 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                  }`}
                >
                  Generate New Excel
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
