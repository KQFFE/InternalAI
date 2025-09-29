import React, { useState } from 'react';
import ExcelJS from 'exceljs'; // For .xlsx and .xls files
import Papa from 'papaparse'; // For .csv files
import '../License.css'; //

function License() {
  const [excelData, setExcelData] = useState(null); // State to store the parsed data

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the first file selected by the user

    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (fileExtension === 'csv') {
        // Handle CSV file
        Papa.parse(file, {
          header: true, // Assumes the first row is your header
          dynamicTyping: true, // Tries to convert values to numbers/booleans
          complete: (results) => {
            setExcelData(results.data);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            setExcelData(null); // Clear data on error
          }
        });
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // Handle XLSX/XLS file (existing logic)
        const reader = new FileReader();

        reader.onload = async (e) => {
          const buffer = e.target.result;
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(buffer);

          const worksheet = workbook.getWorksheet(1);
          const json = [];
          const header = [];
          worksheet.getRow(1).eachCell((cell) => {
            header.push(cell.value);
          });

          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
              const rowData = {};
              row.eachCell((cell, colNumber) => {
                rowData[header[colNumber - 1]] = cell.value;
              });
              json.push(rowData);
            }
          });
          setExcelData(json);
        };

        reader.readAsArrayBuffer(file);
      } else {
        alert("Unsupported file type. Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.");
        setExcelData(null); // Clear data if unsupported
      }
    }
  };

  return (
    // Apply the main container class here
    <div className="license-container">
      <h1>License Page</h1>
      <p>This is the content of your license page.</p>

      <h2>Upload Data File</h2>
      <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />

      {excelData && (
        <div>
          <h3>Data from File:</h3>
          {/* Optional: You can remove this <pre> tag if you only want the table */}
          {/* <pre>{JSON.stringify(excelData, null, 2)}</pre> */}

          {/* Example of displaying in a basic table */}
          {/* Ensure excelData.length > 0 before trying to access excelData[0] */}
          {excelData.length > 0 && excelData[0] && (
            <table className="data-table"> {/* Apply table class here */}
              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((key, index) => (
                    <th key={index}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((row, rowIndex) => (
                  // Filter out rows that might be empty or null
                  row && Object.values(row).some(value => value !== null && value !== '') ? (
                    <tr key={rowIndex}>
                      {Object.values(row).map((value, colIndex) => (
                        <td key={colIndex}>{value !== undefined && value !== null ? String(value) : ''}</td>
                      ))}
                    </tr>
                  ) : null // Don't render empty/null rows
                ))}
              </tbody>
            </table>
          )}
          {/* Optional: Message if no data or empty rows */}
          {excelData.length === 0 && <p>No data found in the selected file or sheet.</p>}
        </div>
      )}
    </div>
  );
}

export default License;