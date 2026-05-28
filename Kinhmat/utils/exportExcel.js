import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Lấy timestamp dạng YYYY-MM-DD cho tên file
 */
function getTimestamp() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Tạo header thông tin cửa hàng ở đầu sheet
 * @param {XLSX.WorkSheet} ws
 * @param {number} colCount - số lượng cột
 * @param {string} sheetTitle - tiêu đề báo cáo
 */
function addReportHeader(ws, colCount, sheetTitle) {
  const now = new Date().toLocaleString('vi-VN');
  XLSX.utils.sheet_add_aoa(ws, [
    ['KÍNH MẮT LUXURY'],
    ['Hệ thống quản lý bán hàng kính mắt cao cấp'],
    [`Báo cáo: ${sheetTitle}`],
    [`Ngày xuất: ${now}`],
    [], // dòng trống
  ], { origin: 'A1' });
}

/**
 * Xuất một sheet Excel đơn giản
 * @param {Array<Object>} data - Mảng dữ liệu
 * @param {Array<{key: string, label: string, width?: number}>} columns - Định nghĩa cột
 * @param {string} fileName - Tên file (không có .xlsx)
 * @param {string} sheetName - Tên sheet
 */
export function exportToExcel(data, columns, fileName, sheetName = 'Sheet1') {
  if (!data || data.length === 0) {
    alert('Không có dữ liệu để xuất!');
    return;
  }

  const HEADER_ROWS = 5; // số dòng header thông tin cửa hàng

  // Tạo workbook & worksheet
  const wb = XLSX.utils.book_new();
  const ws = {};

  // Thêm header cửa hàng
  addReportHeader(ws, columns.length, sheetName);

  // Thêm header cột
  const headerRow = columns.map((col) => col.label);
  XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: `A${HEADER_ROWS + 1}` });

  // Thêm dữ liệu
  const rows = data.map((item) =>
    columns.map((col) => {
      const val = item[col.key];
      return val !== undefined && val !== null ? val : '';
    })
  );
  XLSX.utils.sheet_add_aoa(ws, rows, { origin: `A${HEADER_ROWS + 2}` });

  // Thiết lập độ rộng cột
  ws['!cols'] = columns.map((col) => ({ wch: col.width || 20 }));

  // Merge cells cho tiêu đề cửa hàng
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } }, // Tên cửa hàng
    { s: { r: 1, c: 0 }, e: { r: 1, c: columns.length - 1 } }, // Mô tả
    { s: { r: 2, c: 0 }, e: { r: 2, c: columns.length - 1 } }, // Tiêu đề báo cáo
    { s: { r: 3, c: 0 }, e: { r: 3, c: columns.length - 1 } }, // Ngày xuất
  ];

  // Thiết lập range
  const lastRow = HEADER_ROWS + 1 + data.length;
  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: lastRow, c: columns.length - 1 },
  });

  XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));

  // Xuất file
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}_${getTimestamp()}.xlsx`);
}

/**
 * Xuất nhiều sheet cùng lúc (dùng cho Dashboard thống kê)
 * @param {Array<{name: string, data: Array, columns: Array}>} sheets
 * @param {string} fileName
 */
export function exportMultiSheet(sheets, fileName) {
  if (!sheets || sheets.length === 0) {
    alert('Không có dữ liệu để xuất!');
    return;
  }

  const HEADER_ROWS = 5;
  const wb = XLSX.utils.book_new();

  sheets.forEach(({ name, data, columns }) => {
    if (!data || data.length === 0) return;

    const ws = {};

    addReportHeader(ws, columns.length, name);

    const headerRow = columns.map((col) => col.label);
    XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: `A${HEADER_ROWS + 1}` });

    const rows = data.map((item) =>
      columns.map((col) => {
        const val = item[col.key];
        return val !== undefined && val !== null ? val : '';
      })
    );
    XLSX.utils.sheet_add_aoa(ws, rows, { origin: `A${HEADER_ROWS + 2}` });

    ws['!cols'] = columns.map((col) => ({ wch: col.width || 20 }));

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: columns.length - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: columns.length - 1 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: columns.length - 1 } },
    ];

    const lastRow = HEADER_ROWS + 1 + data.length;
    ws['!ref'] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: lastRow, c: columns.length - 1 },
    });

    XLSX.utils.book_append_sheet(wb, ws, name.substring(0, 31));
  });

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}_${getTimestamp()}.xlsx`);
}
