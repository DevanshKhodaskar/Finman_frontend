import React, { useState } from "react";
import jsPDF from "jspdf";
import { useTheme } from "../context/ThemeContext.jsx";

const DownloadReportModal = ({ isOpen, onClose, transactions }) => {
  const { isDark } = useTheme();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownloadPDF = async () => {
    try {
      setError("");
      setLoading(true);

      if (!startDate || !endDate) {
        setError("Please select both start and end dates");
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        setError("Start date must be before end date");
        return;
      }

      // Filter transactions by date range
      const filteredTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.time);
        return transactionDate >= start && transactionDate <= end;
      });

      if (filteredTransactions.length === 0) {
        setError("No transactions found in the selected date range");
        return;
      }

      // Calculate stats for filtered data
      const totalExpenses = filteredTransactions
        .filter((t) => !t.isIncome)
        .reduce((sum, t) => sum + Number(t.price), 0);

      const totalIncome = filteredTransactions
        .filter((t) => t.isIncome)
        .reduce((sum, t) => sum + Number(t.price), 0);

      const balance = totalIncome - totalExpenses;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 15;

      // Helper function to add text
      const addText = (text, size, color, weight = 'normal', align = 'left') => {
        pdf.setFontSize(size);
        pdf.setTextColor(...color);
        if (weight === 'bold') {
          pdf.setFont(undefined, 'bold');
        } else {
          pdf.setFont(undefined, 'normal');
        }
        
        const maxWidth = pageWidth - 20;
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, align === 'center' ? pageWidth / 2 : 10, yPosition, { align });
        yPosition += lines.length * 6 + 3;
      };

      // Helper function to check and add new page
      const checkNewPage = (requiredSpace = 30) => {
        if (yPosition + requiredSpace > pageHeight - 10) {
          pdf.addPage();
          yPosition = 15;
        }
      };

      // Header
      pdf.setFillColor(147, 51, 234); // Purple background
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      pdf.setFontSize(28);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont(undefined, 'bold');
      pdf.text('FinMan', pageWidth / 2, 18, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      pdf.text('Expense Report', pageWidth / 2, 28, { align: 'center' });

      yPosition = 45;

      // Report Period
      pdf.setDrawColor(147, 51, 234);
      pdf.setLineWidth(0.5);
      pdf.rect(10, yPosition - 5, pageWidth - 20, 25);

      addText('Report Period', 12, [126, 34, 206], 'bold');
      yPosition -= 3;
      addText(`From: ${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, 10, [107, 33, 168]);
      addText(`To: ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, 10, [107, 33, 168]);
      addText(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 10, [107, 33, 168]);

      yPosition += 5;

      // Summary Stats
      checkNewPage(45);
      
      // Income Box
      pdf.setFillColor(220, 252, 231);
      pdf.rect(10, yPosition, 55, 20, 'F');
      pdf.setFontSize(10);
      pdf.setTextColor(22, 163, 74);
      pdf.setFont(undefined, 'bold');
      pdf.text('TOTAL INCOME', 12, yPosition + 6);
      pdf.setFontSize(14);
      pdf.text(`₹${totalIncome.toLocaleString()}`, 12, yPosition + 15);

      // Expenses Box
      pdf.setFillColor(254, 226, 226);
      pdf.rect(70, yPosition, 55, 20, 'F');
      pdf.setFontSize(10);
      pdf.setTextColor(220, 38, 38);
      pdf.setFont(undefined, 'bold');
      pdf.text('TOTAL EXPENSES', 72, yPosition + 6);
      pdf.setFontSize(14);
      pdf.text(`₹${totalExpenses.toLocaleString()}`, 72, yPosition + 15);

      // Balance Box
      const balanceBgColor = balance >= 0 ? [219, 234, 254] : [254, 243, 199];
      const balanceTextColor = balance >= 0 ? [30, 64, 175] : [180, 83, 9];
      pdf.setFillColor(...balanceBgColor);
      pdf.rect(130, yPosition, 55, 20, 'F');
      pdf.setFontSize(10);
      pdf.setTextColor(...balanceTextColor);
      pdf.setFont(undefined, 'bold');
      pdf.text('NET BALANCE', 132, yPosition + 6);
      pdf.setFontSize(14);
      pdf.text(`₹${balance.toLocaleString()}`, 132, yPosition + 15);

      yPosition += 30;

      // Transactions Table
      checkNewPage(40);

      addText(`Transactions (${filteredTransactions.length})`, 12, [126, 34, 206], 'bold');
      yPosition += 3;

      // Table Header
      pdf.setFillColor(243, 232, 255);
      pdf.rect(10, yPosition, pageWidth - 20, 8, 'F');

      pdf.setFontSize(9);
      pdf.setTextColor(126, 34, 206);
      pdf.setFont(undefined, 'bold');
      pdf.text('Date', 12, yPosition + 6);
      pdf.text('Category', 40, yPosition + 6);
      pdf.text('Name', 75, yPosition + 6);
      pdf.text('Type', 135, yPosition + 6);
      pdf.text('Amount', pageWidth - 20, yPosition + 6, { align: 'right' });

      yPosition += 10;

      // Table Rows
      pdf.setFontSize(8);
      filteredTransactions.forEach((t, index) => {
        checkNewPage(12);

        // Alternate row colors
        if (index % 2 === 0) {
          pdf.setFillColor(249, 240, 255);
          pdf.rect(10, yPosition - 3, pageWidth - 20, 8, 'F');
        }

        pdf.setTextColor(107, 33, 168);
        pdf.setFont(undefined, 'normal');

        const date = new Date(t.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
        pdf.text(date, 12, yPosition + 2);
        pdf.text(t.category || 'Other', 40, yPosition + 2);

        const name = t.name || 'N/A';
        const nameWidth = 50;
        const nameLines = pdf.splitTextToSize(name, nameWidth);
        pdf.text(nameLines[0] || '', 75, yPosition + 2);

        const type = t.isIncome ? 'Income' : 'Expense';
        const typeColor = t.isIncome ? [22, 163, 74] : [220, 38, 38];
        pdf.setTextColor(...typeColor);
        pdf.setFont(undefined, 'bold');
        pdf.text(type, 135, yPosition + 2);

        const amount = `${t.isIncome ? '+' : '-'}₹${Number(t.price).toLocaleString()}`;
        pdf.text(amount, pageWidth - 12, yPosition + 2, { align: 'right' });

        yPosition += 8;
      });

      // Footer
      yPosition = pageHeight - 15;
      pdf.setDrawColor(219, 234, 254);
      pdf.setLineWidth(0.3);
      pdf.line(10, yPosition - 5, pageWidth - 10, yPosition - 5);

      pdf.setFontSize(8);
      pdf.setTextColor(147, 51, 234);
      pdf.setFont(undefined, 'normal');
      pdf.text('Generated by FinMan • Financial Management System', pageWidth / 2, yPosition, { align: 'center' });
      pdf.text('This is a confidential report. Please keep it secure.', pageWidth / 2, yPosition + 5, { align: 'center' });

      // Download the PDF
      const fileName = `FinMan_Report_${start.toISOString().split('T')[0]}_to_${end.toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      // Close modal and reset
      onClose();
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Error generating PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className={`rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto transition-colors duration-300 border-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-purple-100'}`}>
              <span className="text-lg sm:text-xl">📥</span>
            </div>
            <h2 className={`text-lg sm:text-xl font-bold truncate ${isDark ? 'text-white' : 'text-purple-900'}`}>Download Report</h2>
          </div>
          <button
            onClick={onClose}
            className={`text-2xl sm:text-3xl font-bold flex-shrink-0 transition-colors ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ×
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-3 sm:mb-4 p-3 sm:p-4 border-2 rounded-lg ${isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-100 border-red-300'}`}>
            <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
          </div>
        )}

        {/* Date Range Selection */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div>
            <label className="block text-purple-700 font-semibold text-xs sm:text-sm mb-1 sm:mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 border-2 rounded-lg focus:outline-none text-sm transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' : 'border-purple-200 text-gray-700 focus:border-purple-500'}`}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-purple-700 font-semibold text-xs sm:text-sm mb-1 sm:mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 border-2 rounded-lg focus:outline-none text-sm transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' : 'border-purple-200 text-gray-700 focus:border-purple-500'}`}
              disabled={loading}
            />
          </div>
        </div>

        {/* Info Message */}
        <div className={`mb-4 sm:mb-6 p-3 sm:p-4 border-2 rounded-lg ${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-200'}`}>
          <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
            ℹ️ Select the date range for your expense report. The PDF will include all transactions within this period.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 font-semibold text-sm sm:text-base rounded-lg transition-all duration-200 disabled:opacity-50 ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={loading || !startDate || !endDate}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold text-sm sm:text-base rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-3 sm:w-4 h-3 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Generating...</span>
                <span className="sm:hidden text-xs">Gen...</span>
              </>
            ) : (
              <>
                <span className="text-sm sm:text-base">📥</span>
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden text-xs">Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadReportModal;
