'use client';

import React, { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { isValidEmail } from "../utils/validate";

const FileUploader = () => {
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const fileType = file.name.split(".").pop().toLowerCase();

    reader.onload = (event) => {
      const content = event.target.result;
      let rows = [];

      if (fileType === "csv") {
        const parsed = Papa.parse(content, { header: true });
        rows = parsed.data;
      } else if (fileType === "xlsx") {
        const workbook = XLSX.read(content, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        rows = XLSX.utils.sheet_to_json(worksheet);
      } else {
        alert("Unsupported file type.");
        return;
      }

      validateData(rows);
    };

    if (fileType === "csv") {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const validateData = (rows) => {
    const errorsList = [];
    const emailSet = new Set();

    rows.forEach((row, index) => {
      const rowErrors = [];

      if (!row.email || typeof row.email !== 'string') {
        rowErrors.push("Missing email");
      } else if (!isValidEmail(row.email)) {
        rowErrors.push("Invalid email format");
      } else if (emailSet.has(row.email)) {
        rowErrors.push("Duplicate email");
      }

      emailSet.add(row.email);

      if (rowErrors.length > 0) {
        errorsList.push({ row: index + 2, errors: rowErrors }); // +2 because of header row + 1-based index
      }
    });

    setErrors(errorsList);
    setData(rows);
  };

  return (
    <div>
      <input type="file" accept=".csv,.xlsx" onChange={handleFile} className="mb-4" />

      {errors.length > 0 && (
        <div className="mb-6">
          <h2 className="text-red-600 text-xl font-semibold">Validation Errors:</h2>
          <ul className="list-disc pl-6 text-red-500">
            {errors.map((error, idx) => (
              <li key={idx}>Row {error.row}: {error.errors.join(", ")}</li>
            ))}
          </ul>
        </div>
      )}

      {data.length > 0 && errors.length === 0 && (
        <div>
          <h2 className="text-green-600 text-xl font-semibold mb-2">Valid Data:</h2>
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                {Object.keys(data[0]).map((key, i) => (
                  <th key={i} className="border px-4 py-2">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-t">
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="border px-4 py-2">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileUploader;