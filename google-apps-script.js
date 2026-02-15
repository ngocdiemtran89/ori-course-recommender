/**
 * ===================================================
 * ORI Course Recommender – Google Apps Script
 * ===================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT:
 * 
 * 1. Tạo 1 Google Sheet mới (hoặc dùng Sheet có sẵn)
 * 2. Đặt tên Sheet tab đầu tiên: "Leads"
 * 3. Vào menu Extensions → Apps Script
 * 4. Xóa code mặc định, paste toàn bộ code bên dưới
 * 5. Nhấn Deploy → New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy URL deployment, paste vào file app.js dòng:
 *    const GOOGLE_SCRIPT_URL = 'paste_url_here';
 * 7. Xong! Dữ liệu từ web app sẽ tự ghi vào Sheet.
 * 
 * ===================================================
 */

// Tạo header row khi chạy lần đầu
function setupSheet() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
    if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Leads');
    }

    var headers = [
        'Timestamp',
        'Họ tên',
        'SĐT',
        'Mục tiêu',
        'Trình độ',
        'Điểm mục tiêu',
        'Vị trí HK',
        'Đảm bảo',
        'Thời hạn',
        'Ngân sách',
        'Thanh toán',
        'Gói đề xuất',
        'Ghi chú',
        'Tình trạng chăm sóc', // New column
        'Người chăm sóc',      // New column
        'Chi tiết (JSON)'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#1a73e8')
        .setFontColor('#ffffff');

    // Auto-fit columns
    for (var i = 1; i <= headers.length; i++) {
        sheet.autoResizeColumn(i);
    }
}

// Nhận POST request từ web app
function doPost(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
        if (!sheet) {
            setupSheet();
            sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
        }

        // Nếu Sheet chưa có header
        if (sheet.getLastRow() === 0) {
            setupSheet();
        }

        var data = JSON.parse(e.postData.contents);

        var row = [
            data.timestamp || new Date().toLocaleString('vi-VN'),
            data.name || '',
            data.phone || '',
            data.goal || '',
            data.level || '',
            data.targetScore || '',
            data.position || '',
            data.guarantee || '',
            data.timeline || '',
            data.budget || '',
            data.payment || '',
            data.recommendedPackage || '',
            data.note || '',
            'Mới', // Tình trạng chăm sóc (Default: Mới)
            '',    // Người chăm sóc (Empty for manual entry)
            data.allAnswers || ''
        ];

        sheet.appendRow(row);

        return ContentService
            .createTextOutput(JSON.stringify({ success: true, message: 'Data saved!' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Cho phép GET request (test)
function doGet(e) {
    return ContentService
        .createTextOutput(JSON.stringify({ status: 'OK', message: 'ORI Course Recommender API is running.' }))
        .setMimeType(ContentService.MimeType.JSON);
}
