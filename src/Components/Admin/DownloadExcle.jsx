import React from "react";
import * as XLSX from "xlsx";

const ExcelDownloadButton = ({ data, filename }) => {
  const downloadExcel = () => {
    // Convert data to Excel workbook
    const workbook = XLSX.utils.book_new();
    const sheetData = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheetData, "Sheet 1");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create a Blob from the Excel buffer
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "data.xlsx";

    // Initiate download
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadExcel}
      style={{
        margin: "10px 0",
        height: "36px",
        padding: "0px 10px",
        outline: "none",
        border: "1px solid black",
        background: "#cdc6eb",
        color: "black",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Download Excel
    </button>
  );
};

export default ExcelDownloadButton;
