'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Loader2, ChevronDown } from 'lucide-react';

/**
 * ExportButton — Nút xuất Excel dùng chung với dropdown tùy chọn
 * 
 * Props:
 * @param {string}   label       - Nhãn hiển thị (mặc định: "Xuất Excel")
 * @param {Array}    options     - Mảng tùy chọn xuất: [{ label, onClick }]
 *                                 Nếu chỉ có 1 option, không hiển thị dropdown
 * @param {boolean}  loading     - Trạng thái đang xử lý
 * @param {string}   className   - Class CSS bổ sung
 */
export default function ExportButton({ label = 'Xuất Excel', options = [], loading = false, className = '' }) {
  const [open, setOpen] = useState(false);
  const hasOptions = options.length > 1;

  const handleSingleClick = () => {
    if (options.length === 1) {
      options[0].onClick();
    } else {
      setOpen((v) => !v);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.button
        id="export-excel-btn"
        onClick={handleSingleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl font-heading font-bold text-xs tracking-widest bg-emerald-600 hover:bg-emerald-700 active:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer shadow-md shadow-emerald-600/20 text-white flex-shrink-0"
        whileHover={!loading ? { scale: 1.01 } : {}}
        whileTap={!loading ? { scale: 0.99 } : {}}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-4 h-4" />
        )}
        <span>{loading ? 'ĐANG XUẤT...' : label.toUpperCase()}</span>
        {hasOptions && !loading && (
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
        )}
      </motion.button>

      {/* Dropdown Menu */}
      {hasOptions && open && (
        <>
          {/* Overlay để đóng dropdown khi click ngoài */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
            {options.map((option, idx) => (
              <button
                key={idx}
                id={`export-option-${idx}`}
                onClick={() => {
                  setOpen(false);
                  option.onClick();
                }}
                className="w-full text-left px-4 py-3 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-100 flex items-center gap-2 border-b border-gray-100 last:border-0"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
