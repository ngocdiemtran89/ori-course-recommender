/* ============================================
   ORI Course Recommender – App Logic
   Quiz Engine + Recommendation + Google Sheets
   ============================================ */

// ==============================
// CONFIG – Paste your Google Apps Script URL here
// ==============================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxdsWITIWEEv8wyAKZZ-dhuoRs0tFRdRQ0HIRlTwpDQ3M0FFr91obrs8zfyJgZHPOcN0Q/exec';

// ==============================
// COURSE DATA
// ==============================
const PACKAGES = {
    toeic12: {
        name: 'TOEIC Buổi Tối 3 buổi/tuần',
        price: 1600000,
        priceLabel: '1.600.000đ/tháng',
        note: 'Đóng theo tháng — học bao nhiêu đóng bấy nhiêu, có test mỗi cuối tháng',
        isMonthly: true,
        category: 'toeic_monthly',
        tag: 'Phù hợp người đi làm',
        subtitle: 'Lớp buổi tối, linh hoạt thời gian',
        perHour: '≈75.000đ/giờ',
        schedule: '3 buổi/tuần • Buổi tối',
        duration: 'Theo tháng',
        sessions: '12 buổi/tháng',
        sessionLength: '1.5 giờ/buổi',
        totalHours: '18 giờ/tháng',
        highlight: 'Siêu tiết kiệm!',
        features: [
            'Lớp buổi tối 3 buổi/tuần — phù hợp người đi làm',
            '12 buổi/tháng, mỗi buổi 1.5 giờ (18 giờ/tháng)',
            'Đóng theo tháng — học bao nhiêu đóng bấy nhiêu',
            'Có test đánh giá mỗi cuối tháng',
            'Giáo viên chuyên môn TOEIC',
            'Tài liệu học tập đầy đủ',
            'Ưu đãi khi đăng ký theo nhóm'
        ]
    },
    toeic20: {
        name: 'TOEIC Buổi Sáng 5 buổi/tuần',
        price: 2300000,
        priceLabel: '2.300.000đ/tháng',
        note: 'Đóng theo tháng — học bao nhiêu đóng bấy nhiêu, có test mỗi cuối tháng',
        isMonthly: true,
        category: 'toeic_monthly',
        tag: '🏆 PHỔ BIẾN NHẤT',
        subtitle: 'Tiến độ nhanh, giá rẻ nhất/giờ',
        perHour: '≈76.000đ/giờ — Rẻ nhất!',
        schedule: '5 buổi/tuần • Buổi sáng',
        duration: 'Theo tháng',
        sessions: '20 buổi/tháng',
        sessionLength: '1.5 giờ/buổi',
        totalHours: '30 giờ/tháng',
        highlight: '🏆 Rẻ nhất thị trường!',
        features: [
            'Lớp buổi sáng 5 buổi/tuần — tiến độ nhanh nhất',
            '20 buổi/tháng, mỗi buổi 1.5 giờ (30 giờ/tháng)',
            'Đóng theo tháng — học bao nhiêu đóng bấy nhiêu',
            'Có test đánh giá mỗi cuối tháng',
            'Chỉ ≈76.000đ/giờ — rẻ nhất thị trường!',
            'Giáo viên chuyên môn TOEIC',
            'Ưu đãi khi đăng ký theo nhóm'
        ]
    },
    toeic500: {
        name: 'TOEIC Trọn gói 500–600',
        price: 12000000,
        priceLabel: '12.000.000đ',
        note: 'Học không giới hạn trong 14 tháng hoặc đến khi đạt mục tiêu, tặng tư vấn CV + thiết kế CV 1 lần',
        isMonthly: false,
        months: 14,
        category: 'toeic_full',
        tag: 'Trung Cấp 500–600',
        subtitle: 'TOEIC 600 trở xuống — Mục tiêu 500+',
        perHour: '',
        schedule: 'Học không giới hạn',
        duration: '14 tháng hoặc đạt mục tiêu',
        highlight: '🎁 Tặng tư vấn CV & thiết kế CV 1 lần',
        features: [
            'Học không giới hạn trong 14 tháng',
            'Hoặc đến khi đạt mục tiêu — không giới hạn số buổi',
            'Tặng tư vấn CV & thiết kế CV 1 lần',
            'Giáo viên chuyên TOEIC, lộ trình cá nhân',
            'Thi thử định kỳ, đánh giá tiến độ',
            'Trả góp 5 lần — không lãi suất'
        ]
    },
    toeic610: {
        name: 'TOEIC Trọn gói 610–750',
        price: 15000000,
        priceLabel: '15.000.000đ',
        note: 'Học không giới hạn trong 14 tháng hoặc đến khi đạt mục tiêu, tặng tư vấn CV + thiết kế CV 1 lần',
        isMonthly: false,
        months: 14,
        category: 'toeic_full',
        tag: '🔥 HOT — Cao Cấp 610–750+',
        subtitle: 'TOEIC 600–750+ — Mục tiêu cao',
        perHour: '',
        schedule: 'Học không giới hạn đến đủ target',
        duration: '14 tháng hoặc đạt mục tiêu',
        highlight: '🎯 Đạt chứng chỉ TOEIC 610–750',
        features: [
            'Đạt chứng chỉ TOEIC 610–750',
            'Học không giới hạn trong 14 tháng',
            'Học không giới hạn đến khi đạt mục tiêu',
            'Tặng tư vấn CV & thiết kế CV 1 lần',
            'Giáo viên chuyên TOEIC, lộ trình nâng cao',
            'Trả góp 5 lần — không lãi suất'
        ]
    },
    giaotiep: {
        name: 'Giao tiếp Thành Thạo',
        price: 15000000,
        priceLabel: '15.000.000đ / 6 tháng',
        note: 'Học trong 6 tháng, tặng thêm 2 tháng nếu học đều nghỉ ≤10%',
        isMonthly: false,
        months: 6,
        category: 'giaotiep',
        tag: '6 tháng',
        subtitle: 'Luyện tập giao tiếp đạt mức thành thạo',
        perHour: '≈2.500.000đ/tháng',
        schedule: 'Lịch linh hoạt',
        duration: '6 tháng (+ 2 tháng bonus)',
        highlight: '🎁 Tặng thêm 2 tháng miễn phí nếu học đều, nghỉ ≤10%',
        features: [
            'Giao tiếp phản xạ 6 tháng — bình quân 2.5tr/tháng',
            'Phương pháp ORI độc quyền — luyện phản xạ thực tế',
            'Tặng thêm 2 tháng miễn phí nếu học đều, nghỉ ≤10%',
            'Chủ đề đa dạng: công việc, du lịch, đời sống',
            'Giáo viên hướng dẫn 1-1 và nhóm nhỏ',
            'Trả góp 5 lần — không lãi suất'
        ]
    },
    combo500gt: {
        name: 'Combo TOEIC 500–600 + Giao tiếp',
        price: 20000000,
        priceLabel: '20.000.000đ',
        note: 'Học không giới hạn trong 14 tháng hoặc đến khi đạt mục tiêu',
        isMonthly: false,
        months: 14,
        category: 'combo',
        tag: '💰 TIẾT KIỆM 7 TRIỆU',
        subtitle: 'Kết hợp TOEIC 500 và giao tiếp',
        perHour: '',
        schedule: 'Học không giới hạn',
        duration: '14 tháng',
        highlight: 'Tiết kiệm 7 triệu so với mua riêng (12tr + 15tr = 27tr)',
        features: [
            'Không giới hạn TOEIC — học đến khi đạt 500–600',
            'Giao tiếp không giới hạn 12 tháng',
            'Đầu ra TOEIC + Giao tiếp nhanh nhất',
            'Tặng tư vấn CV & thiết kế CV 1 lần',
            'Tiết kiệm 7 triệu so với mua riêng!',
            'Trả góp 5 lần — không lãi suất'
        ]
    },
    combo650gt: {
        name: 'Combo TOEIC 650–700+ + Giao tiếp',
        price: 25000000,
        priceLabel: '25.000.000đ',
        note: 'Học không giới hạn trong 14 tháng hoặc đến khi đạt mục tiêu',
        isMonthly: false,
        months: 14,
        category: 'combo',
        tag: '💰 TIẾT KIỆM 10 TRIỆU',
        subtitle: 'Kết hợp TOEIC 600+ và giao tiếp nâng cao',
        perHour: '',
        schedule: 'Học không giới hạn',
        duration: '14 tháng',
        highlight: 'Tiết kiệm 10 triệu so với mua riêng (15tr + 15tr = 30tr)',
        features: [
            'Không giới hạn TOEIC — học đến khi đạt 650–700+',
            'Giao tiếp không giới hạn 12 tháng',
            'Đầu ra TOEIC + Giao tiếp nhanh nhất',
            'Tặng tư vấn CV & thiết kế CV 1 lần',
            'Tiết kiệm 10 triệu so với mua riêng!',
            'Trả góp 5 lần — không lãi suất'
        ]
    },

    engHK: {
        name: 'Tiếng Anh chuyên Hàng Không',
        price: 10000000,
        priceLabel: '10.000.000đ / 2 tháng',
        note: 'Duy nhất tại ORI — từ vựng cabin, PA, safety',
        isMonthly: false,
        months: 2,
        category: 'chuyennganh',
        tag: 'DUY NHẤT TẠI ORI',
        subtitle: 'Học sách chuyên về Hàng Không',
        perHour: '',
        schedule: '2 tháng • Max 15 học viên/lớp',
        duration: '2 tháng',
        highlight: '✈️ Duy nhất tại ORI — chuyên biệt ngành bay',
        features: [
            'Học sách chuyên về Hàng Không',
            '2 tháng — Max 15 học viên/lớp',
            'Chuẩn bị kỹ năng chuyên ngành',
            'Từ vựng cabin, PA announcement, safety',
            'Đối tác trên 10 học viên được mở lớp riêng',
            'Giáo viên có kinh nghiệm ngành bay'
        ]
    },
    aiHK: {
        name: 'Gói AI Học Training',
        price: 3000000,
        priceLabel: '3.000.000đ / 10 buổi',
        note: 'Bộ công cụ 7 AI chuyên dùng cho học tập',
        isMonthly: false,
        months: 2,
        category: 'chuyennganh',
        tag: 'BỘ CÔNG CỤ 7 AI',
        subtitle: '7 AI chuyên dùng cho học tập hàng không',
        perHour: '',
        schedule: '10 buổi',
        duration: '10 buổi',
        highlight: '🎁 Tặng AI Gemini Pro + tài khoản nghe ghi chép (1.5 triệu)',
        features: [
            '7 AI chuyên dùng cho học tập hàng không',
            'Hướng dẫn từng case thực tế',
            '10 buổi practice với AI',
            'Tặng AI Gemini Pro + tài khoản nghe ghi chép (trị giá 1.5tr)',
            'Luyện phản xạ cabin announcement, PA, safety',
            'Bổ trợ tuyệt vời kết hợp với English HK'
        ]
    },
    comboMatDat: {
        name: 'Combo Trọn Gói Mặt Đất',
        price: 35000000,
        priceLabel: '35.000.000đ',
        note: 'Đảm bảo có việc làm mặt đất — học không giới hạn',
        isMonthly: false,
        months: 14,
        category: 'career',
        tag: '💼 ĐẢM BẢO VIỆC LÀM',
        subtitle: 'Đảm bảo có việc làm mặt đất',
        perHour: '',
        schedule: 'Học không giới hạn',
        duration: 'Đến khi có việc',
        highlight: 'Tiết kiệm 15 triệu — Đảm bảo việc làm 100%',
        features: [
            'TOEIC 500 + Giao tiếp — nền tảng vững chắc',
            'Tiếng Anh chuyên Hàng Không',
            'Luyện PV mặt đất 1-1 chuyên sâu',
            'Học KHÔNG GIỚI HẠN từ TOEIC đến khi có việc',
            'Hỗ trợ làm CV miễn phí 3 lần',
            'Đồng hành làm hồ sơ ứng tuyển',
            'Soạn sửa script phỏng vấn chi tiết',
            'Mô phỏng interview + nhận xét qua video'
        ]
    },
    comboTVHK: {
        name: 'Trọn Gói Tiếp Viên Hàng Không',
        price: 45000000,
        priceLabel: '45.000.000đ',
        note: 'Đảm bảo có việc làm trong sân bay — học không giới hạn',
        isMonthly: false,
        months: 14,
        category: 'career',
        tag: '👑 PREMIUM — ĐẢM BẢO VIỆC LÀM',
        subtitle: 'Đảm bảo có việc làm trong sân bay',
        perHour: '',
        schedule: 'Học không giới hạn',
        duration: 'Đến khi có việc',
        highlight: 'Trọn gói Premium — Bay cả đời!',
        features: [
            'TOEIC 600 + Giao tiếp nâng cao',
            'Tiếng Anh chuyên Hàng Không',
            'PV tiếp viên trong + ngoài nước',
            'Học KHÔNG GIỚI HẠN đến khi có việc',
            'Hỗ trợ thi mặt đất miễn phí (nếu chưa xin được)',
            'Hỗ trợ làm CV miễn phí 3 lần',
            'Đồng hành làm hồ sơ ứng tuyển',
            'Mô phỏng interview + nhận xét qua video'
        ]
    }
};

// ==============================
// COURSE CATEGORIES for catalog
// ==============================
const COURSE_CATEGORIES = [
    {
        id: 'toeic_monthly',
        title: 'TOEIC Theo Tháng',
        icon: '🌙☀️',
        desc: 'Đóng theo tháng, không cam kết — phù hợp bắt đầu',
        packages: ['toeic12', 'toeic20']
    },
    {
        id: 'toeic_full',
        title: 'TOEIC Trọn Gói',
        icon: '🎯',
        desc: 'Học không giới hạn đến khi đạt mục tiêu',
        packages: ['toeic500', 'toeic610']
    },
    {
        id: 'giaotiep',
        title: 'Giao Tiếp Thành Thạo',
        icon: '💬',
        desc: 'Nói lưu loát trong 6 tháng',
        packages: ['giaotiep']
    },
    {
        id: 'combo',
        title: 'Combo TOEIC + Giao Tiếp',
        icon: '💰',
        desc: 'Tiết kiệm 7–10 triệu — có cả bằng lẫn kỹ năng nói',
        packages: ['combo500gt', 'combo650gt']
    },
    {
        id: 'chuyennganh',
        title: 'Chuyên Ngành Hàng Không',
        icon: '✈️',
        desc: 'English HK + AI Practice — DUY NHẤT tại ORI',
        packages: ['engHK', 'aiHK']
    },

    {
        id: 'career',
        title: 'Combo Trọn Gói Hàng Không',
        icon: '👑',
        desc: 'Đảm bảo việc làm — học đến khi có việc',
        packages: ['comboMatDat', 'comboTVHK']
    }
];

// ==============================
// QUESTION DEFINITIONS (branching tree)
// ==============================
const QUESTIONS = {
    q1: {
        id: 'q1',
        title: 'Mục tiêu chính của bạn là gì?',
        subtitle: 'Chọn 1 mục tiêu quan trọng nhất với bạn lúc này',
        options: [
            { key: 'toeic', label: 'Luyện TOEIC lấy điểm', emoji: '🎯', next: 'q2_toeic' },
            { key: 'giaotiep', label: 'Giao tiếp tiếng Anh', emoji: '💬', next: 'q2_gt' },
            { key: 'phongvan', label: 'Phỏng vấn hàng không', emoji: '✈️', next: null, externalLink: 'https://ori-interview-courses.replit.app' },
            { key: 'combo', label: 'TOEIC + Giao tiếp (cả hai)', emoji: '🔥', next: 'q2_combo' },
            { key: 'training', label: 'Sắp đi training hàng không', emoji: '🛫', next: 'q2_training' }
        ]
    },

    // ---- TOEIC branch ----
    q2_toeic: {
        id: 'q2_toeic',
        title: 'Trình độ TOEIC hiện tại của bạn?',
        subtitle: 'Nếu chưa thi, chọn mức bạn tự đánh giá',
        options: [
            { key: '0-300', label: 'Mất gốc / chưa thi bao giờ (0–300)', emoji: '📕', next: 'q3_toeic_target' },
            { key: '300-450', label: 'Có nền tảng, còn yếu (300–450)', emoji: '📙', next: 'q3_toeic_target' },
            { key: '450-550', label: 'Trung bình, muốn lên cao (450–550)', emoji: '📒', next: 'q3_toeic_target' },
            { key: '550-650', label: 'Kha khá, cần breakthrough (550–650)', emoji: '📗', next: 'q3_toeic_target_high' },
            { key: '650+', label: 'Đã 650+, muốn nâng thêm / giữ điểm', emoji: '📘', next: 'q3_toeic_target_high' }
        ]
    },
    q3_toeic_target: {
        id: 'q3_toeic_target',
        title: 'Điểm mục tiêu bạn muốn đạt?',
        subtitle: '',
        options: [
            { key: '500-600', label: '500–600 (đủ apply HK nội địa)', emoji: '🎯', next: 'q4_toeic_schedule' },
            { key: '610-750', label: '610–750 (apply hãng quốc tế / thăng tiến)', emoji: '🚀', next: 'q4_toeic_schedule' }
        ]
    },
    q3_toeic_target_high: {
        id: 'q3_toeic_target_high',
        title: 'Điểm mục tiêu bạn muốn đạt?',
        subtitle: '',
        options: [
            { key: '610-750', label: '610–750 (apply hãng quốc tế / thăng tiến)', emoji: '🚀', next: 'q4_toeic_schedule' },
            { key: '700+', label: '700+ (target cao nhất)', emoji: '🏆', next: 'q4_toeic_schedule' }
        ]
    },
    q4_toeic_schedule: {
        id: 'q4_toeic_schedule',
        title: 'Lịch học bạn mong muốn?',
        subtitle: '',
        options: [
            { key: '12bth', label: '12 buổi/tháng (3 buổi/tuần)', emoji: '📅', next: 'q5_time' },
            { key: '20bth', label: '20 buổi/tháng (5 buổi/tuần)', emoji: '📆', next: 'q5_time' },
            { key: 'unlimited', label: 'Không giới hạn (học thoải mái)', emoji: '♾️', next: 'q5_time' }
        ]
    },

    // ---- Giao tiếp branch ----
    q2_gt: {
        id: 'q2_gt',
        title: 'Mục tiêu giao tiếp của bạn?',
        subtitle: '',
        options: [
            { key: 'travel', label: 'Du lịch / đời sống hàng ngày', emoji: '🌍', next: 'q3_gt_level' },
            { key: 'work', label: 'Công việc / văn phòng', emoji: '💼', next: 'q3_gt_level' },
            { key: 'aviation', label: 'Chuyên ngành hàng không (Aviation)', emoji: '✈️', next: 'q5_time' },
            { key: 'interview', label: 'Chuẩn bị đi phỏng vấn', emoji: '🎤', next: null, externalLink: 'https://ori-interview-courses.replit.app' }
        ]
    },
    q3_gt_level: {
        id: 'q3_gt_level',
        title: 'Mức tự tin giao tiếp hiện tại?',
        subtitle: '',
        options: [
            { key: 'beginner', label: 'Mất gốc, gần như không nói được', emoji: '😰', next: 'q5_time' },
            { key: 'basic', label: 'Nói được câu cơ bản nhưng chậm', emoji: '🙂', next: 'q5_time' },
            { key: 'ok', label: 'Kha khá, muốn phản xạ tốt hơn', emoji: '💪', next: 'q5_time' }
        ]
    },



    // ---- Combo branch ----
    q2_combo: {
        id: 'q2_combo',
        title: 'Trình độ TOEIC hiện tại?',
        subtitle: '',
        options: [
            { key: '0-300', label: 'Mất gốc / chưa thi (0–300)', emoji: '📕', next: 'q3_combo_target' },
            { key: '300-450', label: 'Có nền tảng, còn yếu (300–450)', emoji: '📙', next: 'q3_combo_target' },
            { key: '450-550', label: 'Trung bình (450–550)', emoji: '📒', next: 'q3_combo_target' },
            { key: '550+', label: '550+ (khá–giỏi)', emoji: '📗', next: 'q3_combo_target' }
        ]
    },
    q3_combo_target: {
        id: 'q3_combo_target',
        title: 'Bạn muốn combo nào?',
        subtitle: 'Bao gồm TOEIC + Giao tiếp phản xạ',
        options: [
            { key: 'combo500', label: 'TOEIC 500–600 + Giao tiếp', emoji: '📦', next: 'q5_time' },
            { key: 'combo650', label: 'TOEIC 650–700+ + Giao tiếp', emoji: '🎁', next: 'q5_time' }
        ]
    },

    // ---- Training HK branch ----
    q2_training: {
        id: 'q2_training',
        title: 'Bạn cần hỗ trợ gì cho training?',
        subtitle: '',
        options: [
            { key: 'eng_only', label: 'Chỉ English chuyên hàng không', emoji: '📖', next: 'q5_time' },
            { key: 'eng_ai', label: 'English chuyên HK + AI practice', emoji: '🤖', next: 'q5_time' }
        ]
    },

    // ---- Common: Time ----
    q5_time: {
        id: 'q5_time',
        title: 'Bạn muốn đạt mục tiêu trong bao lâu?',
        subtitle: '',
        options: [
            { key: '<4m', label: 'Dưới 4 tháng (gấp)', emoji: '⚡', next: 'q6_value' },
            { key: '4-6m', label: '4–6 tháng', emoji: '📅', next: 'q6_value' },
            { key: '6-12m', label: '6–12 tháng (ổn định)', emoji: '🗓️', next: 'q6_value' }
        ]
    },

    // ---- Common: Kết quả mong muốn (thay thế câu hỏi ngân sách) ----
    q6_value: {
        id: 'q6_value',
        title: 'Bạn muốn đạt được kết quả nào sau khóa học?',
        subtitle: 'Chọn mức kết quả bạn kỳ vọng — ORI sẽ tư vấn gói phù hợp nhất',
        options: [
            { key: 'basic', label: 'Có bằng / chứng chỉ — đủ để bổ sung vào CV', emoji: '📜', next: null },
            { key: 'premium', label: 'Có bằng + giao tiếp lưu loát — tự tin phỏng vấn bằng tiếng Anh', emoji: '🌟', next: null },
            { key: 'ultimate', label: 'Có bằng + giao tiếp + được đảm bảo việc làm sau khóa học', emoji: '🚀', next: null }
        ]
    }
};

// ==============================
// APP STATE
// ==============================
let state = {
    history: [],     // [{ questionId, answerKey }]
    answers: {},     // { q1: 'toeic', q2_toeic: '0-300', ... }
    currentQ: 'q1',
    recommendation: null,
    contact: null
};

// ==============================
// DOM REFERENCES
// ==============================
const $ = id => document.getElementById(id);

const screens = {
    welcome: $('screen-welcome'),
    quiz: $('screen-quiz'),
    result: $('screen-result'),
    catalog: $('screen-catalog'),
    contact: $('screen-contact'),
    success: $('screen-success')
};

// ==============================
// SCREEN NAVIGATION
// ==============================
function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    if (name === 'catalog') renderCatalog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==============================
// CATALOG & COURSE DETAIL
// ==============================
function renderCatalog() {
    const container = $('catalog-content');
    if (!container) return;

    let html = '';
    COURSE_CATEGORIES.forEach(cat => {
        html += `
        <div class="cat-section">
            <div class="cat-header">
                <span class="cat-icon">${cat.icon}</span>
                <div>
                    <h3 class="cat-title">${cat.title}</h3>
                    <p class="cat-desc">${cat.desc}</p>
                </div>
            </div>
            <div class="cat-packages">`;

        cat.packages.forEach(pkgKey => {
            const pkg = PACKAGES[pkgKey];
            if (!pkg) return;
            html += `
            <div class="cat-pkg-card" onclick="openDetailModal('${pkgKey}')">
                ${pkg.tag ? `<span class="cat-pkg-tag">${pkg.tag}</span>` : ''}
                <div class="cat-pkg-name">${pkg.name}</div>
                <div class="cat-pkg-subtitle">${pkg.subtitle || ''}</div>
                <div class="cat-pkg-price">${pkg.priceLabel}</div>
                ${pkg.perHour ? `<div class="cat-pkg-perhour">${pkg.perHour}</div>` : ''}
                <div class="cat-pkg-highlight">${pkg.highlight || ''}</div>
                <ul class="cat-pkg-features">
                    ${(pkg.features || []).slice(0, 3).map(f => `<li>✅ ${f}</li>`).join('')}
                </ul>
                <div class="cat-pkg-cta">Xem chi tiết →</div>
            </div>`;
        });

        html += `
            </div>`;

        // Comparison table for categories with 2+ packages
        if (cat.packages.length >= 2) {
            html += renderComparisonTable(cat);
        }

        html += `
        </div>`;
    });

    container.innerHTML = html;
}

function renderComparisonTable(cat) {
    const pkgs = cat.packages.map(k => PACKAGES[k]).filter(Boolean);
    if (pkgs.length < 2) return '';

    // Determine comparison rows based on category
    let rows = [
        { label: 'Giá', getValue: p => p.priceLabel },
        { label: 'Thời lượng', getValue: p => p.duration || '—' },
        { label: 'Lịch học', getValue: p => p.schedule || '—' }
    ];

    if (cat.id === 'toeic_monthly') {
        rows.push(
            { label: 'Số buổi/tháng', getValue: p => p.sessions || '—' },
            { label: 'Giờ/tháng', getValue: p => p.totalHours || '—' },
            { label: 'Chi phí/giờ', getValue: p => p.perHour || '—' }
        );
    } else if (cat.id === 'toeic_full') {
        rows.push(
            { label: 'Mục tiêu', getValue: p => p.tag || '—' },
            { label: 'CV Support', getValue: p => p.note.includes('CV') ? '✅ Có' : '—' }
        );
    } else if (cat.id === 'combo') {
        rows.push(
            { label: 'Tiết kiệm', getValue: p => p.highlight || '—' },
            { label: 'CV Support', getValue: p => '✅ Có' }
        );
    } else if (cat.id === 'career') {
        rows.push(
            { label: 'Cam kết', getValue: p => '✅ Đảm bảo việc làm' },
            { label: 'Free CV', getValue: p => '✅ 3 lần' },
            { label: 'Học giới hạn', getValue: p => '♾️ Không giới hạn' }
        );
    }

    rows.push({ label: 'Nổi bật', getValue: p => p.highlight || '—' });

    let html = `
    <div class="compare-section">
        <div class="compare-title">📊 So sánh nhanh</div>
        <div class="compare-table-wrap">
            <table class="compare-table">
                <thead>
                    <tr>
                        <th></th>
                        ${pkgs.map(p => `<th>${p.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(r => `
                        <tr>
                            <td class="compare-label">${r.label}</td>
                            ${pkgs.map(p => `<td>${r.getValue(p)}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>`;

    return html;
}

function openDetailModal(pkgKey) {
    const pkg = PACKAGES[pkgKey];
    if (!pkg) return;

    const modal = $('modal-detail');
    const body = $('modal-body');

    let html = `
    <div class="detail-card">
        ${pkg.tag ? `<span class="detail-tag">${pkg.tag}</span>` : ''}
        <h2 class="detail-name">${pkg.name}</h2>
        <p class="detail-subtitle">${pkg.subtitle || ''}</p>
        <div class="detail-price">${pkg.priceLabel}</div>
        ${pkg.perHour ? `<div class="detail-perhour">${pkg.perHour}</div>` : ''}

        <div class="detail-meta">
            <div class="detail-meta-item">
                <span class="detail-meta-icon">📅</span>
                <div>
                    <div class="detail-meta-label">Lịch học</div>
                    <div class="detail-meta-value">${pkg.schedule || '—'}</div>
                </div>
            </div>
            <div class="detail-meta-item">
                <span class="detail-meta-icon">⏱️</span>
                <div>
                    <div class="detail-meta-label">Thời lượng</div>
                    <div class="detail-meta-value">${pkg.duration || '—'}</div>
                </div>
            </div>
            ${pkg.isMonthly ? '' : `
            <div class="detail-meta-item">
                <span class="detail-meta-icon">💳</span>
                <div>
                    <div class="detail-meta-label">Thanh toán</div>
                    <div class="detail-meta-value">Trả góp 5 lần (0% lãi)</div>
                </div>
            </div>`}
        </div>

        ${pkg.highlight ? `<div class="detail-highlight">${pkg.highlight}</div>` : ''}

        <div class="detail-features">
            <h3>✨ Quyền lợi chi tiết</h3>
            <ul>
                ${(pkg.features || []).map(f => `<li>✅ ${f}</li>`).join('')}
            </ul>
        </div>

        ${!pkg.isMonthly && pkg.price >= 10000000 ? `
        <div class="detail-installment">
            <h3>💳 Trả góp 5 lần</h3>
            <div class="installment-grid">
                ${[1, 2, 3, 4, 5].map(i => {
        const amount = Math.round(pkg.price / 5);
        return `<div class="installment-step">
                        <div class="installment-num">Lần ${i}</div>
                        <div class="installment-amount">${amount.toLocaleString('vi-VN')}đ</div>
                    </div>`;
    }).join('')}
            </div>
        </div>` : ''}

        <div class="detail-trial">
            <h3>🎓 Chương trình học thử</h3>
            <p>Học 1 tuần miễn phí (2 buổi) — không bắt buộc đăng ký. Hài lòng mới đăng ký!</p>
        </div>

        <div class="detail-actions">
            <button class="btn btn-primary btn-glow" onclick="closeDetailModal(); showScreen('contact');">
                Đăng ký tư vấn gói này
                <span class="btn-arrow">→</span>
            </button>
            <a href="tel:0906303373" class="btn btn-secondary">📞 Gọi ngay: 0906 303 373</a>
        </div>
    </div>`;

    body.innerHTML = html;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
    const modal = $('modal-detail');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ==============================
// QUIZ ENGINE
// ==============================
function renderQuestion() {
    const q = QUESTIONS[state.currentQ];
    if (!q) return;

    const totalSteps = 6;
    const currentStep = state.history.length + 1;
    const pct = Math.round((currentStep / totalSteps) * 100);

    $('progress-fill').style.width = pct + '%';
    $('progress-text').textContent = `${currentStep} / ${totalSteps}`;

    // Animate question
    const container = $('question-container');
    container.style.animation = 'none';
    container.offsetHeight; // reflow
    container.style.animation = 'fadeSlideIn 0.35s ease-out';

    $('question-title').textContent = q.title;
    $('question-subtitle').textContent = q.subtitle || '';

    const list = $('options-list');
    list.innerHTML = '';

    const letters = 'ABCDEF';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
            <span class="option-letter">${letters[i]}</span>
            <span class="option-label">${opt.label}</span>
            <span class="option-emoji">${opt.emoji}</span>
        `;
        btn.addEventListener('click', () => selectOption(q.id, opt));
        list.appendChild(btn);
    });
}

function selectOption(questionId, option) {
    // Highlight briefly
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(b => b.classList.remove('selected'));
    event.currentTarget.classList.add('selected');

    // Store answer
    state.answers[questionId] = option.key;
    state.history.push({ questionId, answerKey: option.key });

    // Delay for visual feedback
    setTimeout(() => {
        if (option.externalLink) {
            // Redirect to external site for interview courses
            window.open(option.externalLink, '_blank');
            return;
        }
        if (option.next === null) {
            // Quiz done → generate recommendation
            generateRecommendation();
            showScreen('result');
        } else {
            state.currentQ = option.next;
            renderQuestion();
        }
    }, 300);
}

function goBack() {
    if (state.history.length <= 0) {
        showScreen('welcome');
        return;
    }

    const last = state.history.pop();
    delete state.answers[last.questionId];

    if (state.history.length === 0) {
        state.currentQ = 'q1';
    } else {
        // Find what question led to the current one: it's the next of the previous answer
        const prevEntry = state.history[state.history.length - 1];
        const prevQ = QUESTIONS[prevEntry.questionId];
        const prevOpt = prevQ.options.find(o => o.key === prevEntry.answerKey);
        state.currentQ = prevOpt.next;
    }

    renderQuestion();
}

// ==============================
// RECOMMENDATION ENGINE
// ==============================
function generateRecommendation() {
    const a = state.answers;
    const goal = a.q1;
    const value = a.q6_value; // basic | premium | ultimate
    let rec = { best: null, backup: null, upsell: null, roadmap: [], payment: {} };

    // ---- TOEIC ----
    if (goal === 'toeic') {
        const level = a.q2_toeic;
        const target = a.q3_toeic_target || a.q3_toeic_target_high;
        const schedule = a.q4_toeic_schedule;

        if (value === 'ultimate') {
            // Muốn bằng + giao tiếp + việc làm → Combo + PV đảm bảo
            const combo = target === '500-600' ? PACKAGES.combo500gt : PACKAGES.combo650gt;
            rec.best = {
                pkg: combo,
                reasons: [
                    'Kết hợp TOEIC + Giao tiếp phản xạ — nâng toàn diện cả bằng lẫn kỹ năng nói',
                    'Học không giới hạn trong 14 tháng hoặc đến khi đạt mục tiêu',
                    'Tặng kèm tư vấn CV — chuẩn bị sẵn sàng ứng tuyển ngay sau khi hoàn thành'
                ]
            };
            rec.backup = {
                pkg: target === '500-600' ? PACKAGES.toeic500 : PACKAGES.toeic610,
                reason: 'Nếu muốn tập trung TOEIC trước, lên giao tiếp sau'
            };
            rec.upsell = {
                pkg: PACKAGES.comboMatDat, reasons: [
                    'Muốn đảm bảo việc làm? Trọn gói mặt đất — học đến khi có việc',
                    'Bao gồm luyện PV, CV chuyên nghiệp, English — yên tâm 100%'
                ]
            };
        } else if (value === 'premium') {
            // Muốn bằng + giao tiếp → Combo TOEIC + GT
            const combo = target === '500-600' ? PACKAGES.combo500gt : PACKAGES.combo650gt;
            rec.best = {
                pkg: combo,
                reasons: [
                    'Combo hoàn hảo: vừa có điểm TOEIC, vừa nói lưu loát',
                    'Tiết kiệm hơn mua riêng từng gói — học cả hai song song',
                    'Giao tiếp tốt + TOEIC cao = profile hoàn thiện cho mọi cơ hội'
                ]
            };
            rec.backup = {
                pkg: target === '500-600' ? PACKAGES.toeic500 : PACKAGES.toeic610,
                reason: 'Nếu muốn lấy bằng TOEIC trước, bổ sung giao tiếp sau'
            };
            rec.upsell = {
                pkg: PACKAGES.comboMatDat, reasons: [
                    'Muốn đảm bảo việc làm? Trọn gói mặt đất — học đến khi có việc',
                    'Bao gồm luyện PV, CV, English — yên tâm 100%'
                ]
            };
        } else {
            // basic: Muốn có bằng
            const time = a.q5_time;
            const isShortTimeline = (time === '<4m' || time === '4-6m');

            if (isShortTimeline) {
                // Dưới 6 tháng → luôn đề xuất 2 gói lẻ
                rec.best = {
                    pkg: PACKAGES.toeic20,
                    reasons: [
                        '5 buổi/tuần — tiến độ nhanh nhất, phù hợp mục tiêu ngắn hạn',
                        'Đóng theo tháng — học bao nhiêu đóng bấy nhiêu',
                        'Có test đánh giá mỗi cuối tháng',
                        'Chỉ ≈76.000đ/giờ — rẻ nhất thị trường!'
                    ]
                };
                rec.backup = {
                    pkg: PACKAGES.toeic12,
                    reason: 'Nếu bận buổi sáng → lớp buổi tối 3 buổi/tuần, chỉ 1.600.000đ/tháng'
                };
                rec.upsell = {
                    pkg: target === '500-600' ? PACKAGES.toeic500 : PACKAGES.toeic610,
                    reasons: [
                        'Nếu muốn cam kết lâu dài: trọn gói 14 tháng — bình quân rẻ hơn gói lẻ!',
                        'Học không giới hạn đến khi đạt mục tiêu + tặng tư vấn CV'
                    ]
                };
            } else if (target === '500-600') {
                rec.best = {
                    pkg: PACKAGES.toeic500,
                    reasons: [
                        '14 tháng không giới hạn — yên tâm học đến khi đạt mục tiêu 500–600',
                        'Bình quân chỉ ~857.000đ/tháng — rẻ hơn học lẻ từng tháng!',
                        'Tặng kèm tư vấn CV + thiết kế CV miễn phí'
                    ]
                };
                rec.backup = { pkg: PACKAGES.toeic20, reason: 'Nếu muốn bắt đầu nhẹ, trả theo tháng trước' };
                rec.upsell = {
                    pkg: PACKAGES.combo500gt, reasons: [
                        'Nâng cấp lên Combo: TOEIC + Giao tiếp — biết nói tự tin hơn chỉ có bằng',
                        'Giao tiếp lưu loát là lợi thế mà bằng cấp không thể thay thế!'
                    ]
                };
            } else {
                rec.best = {
                    pkg: PACKAGES.toeic610,
                    reasons: [
                        '14 tháng không giới hạn — phù hợp target cao 610–750',
                        'Bình quân chỉ ~1.071.000đ/tháng — tiết kiệm hơn học lẻ!',
                        'Giáo viên chuyên luyện band cao, tặng tư vấn CV'
                    ]
                };
                rec.backup = { pkg: PACKAGES.toeic20, reason: 'Nếu muốn bắt đầu nhẹ, trả theo tháng trước' };
                rec.upsell = {
                    pkg: PACKAGES.combo650gt, reasons: [
                        'Nâng lên Combo TOEIC 650+ kèm Giao tiếp — nói lưu loát + điểm cao',
                        'Profile hoàn thiện cho ứng tuyển hãng quốc tế!'
                    ]
                };
            }
        }

        rec.roadmap = buildToeicRoadmap(level, target);

        // ---- GIAO TIẾP ----
    } else if (goal === 'giaotiep') {
        const gtGoal = a.q2_gt;

        if (gtGoal === 'aviation') {
            rec.best = {
                pkg: PACKAGES.engHK,
                reasons: [
                    'Chuyên biệt cho ngành hàng không: từ vựng cabin, PA, safety',
                    'Hoàn thành trong 2 tháng — phù hợp trước training',
                    'Giáo viên có kinh nghiệm ngành bay'
                ]
            };
            rec.backup = { pkg: PACKAGES.giaotiep, reason: 'Nếu muốn nâng giao tiếp tổng hợp kèm chuyên ngành' };
            rec.upsell = {
                pkg: PACKAGES.aiHK, reasons: [
                    'Thêm AI practice luyện phản xạ tình huống thực tế',
                    'English HK + AI = chuẩn bị toàn diện trước training'
                ]
            };
        } else if (value === 'ultimate') {
            // Muốn giao tiếp + bằng + việc làm → Combo + PV
            rec.best = {
                pkg: PACKAGES.combo500gt,
                reasons: [
                    'Combo TOEIC + Giao tiếp — có cả bằng lẫn kỹ năng nói thực tế',
                    'Học không giới hạn trong 14 tháng — không lo bị giới hạn',
                    'Tặng tư vấn CV — sẵn sàng ứng tuyển ngay khi hoàn thành'
                ]
            };
            rec.backup = { pkg: PACKAGES.giaotiep, reason: 'Nếu muốn tập trung giao tiếp trước' };
            rec.upsell = {
                pkg: PACKAGES.comboMatDat, reasons: [
                    'Muốn đảm bảo có việc? Trọn gói mặt đất — học đến khi có việc',
                    'Bao gồm PV + English + CV — an tâm 100%'
                ]
            };
        } else if (value === 'premium') {
            // Muốn bằng + giao tiếp lưu loát → Combo
            rec.best = {
                pkg: PACKAGES.combo500gt,
                reasons: [
                    'Combo hoàn hảo: TOEIC lấy bằng + Giao tiếp phản xạ lưu loát',
                    'Tiết kiệm hơn mua riêng — có cả hai cùng lúc',
                    'Giao tiếp lưu loát + điểm TOEIC = hồ sơ ấn tượng'
                ]
            };
            rec.backup = { pkg: PACKAGES.giaotiep, reason: 'Nếu muốn tập trung giao tiếp trước, bổ sung TOEIC sau' };
            rec.upsell = {
                pkg: PACKAGES.combo650gt, reasons: [
                    'Nâng lên Combo 650+ — điểm TOEIC cao hơn cho cơ hội tốt hơn',
                    'Profile mạnh mẽ khi apply hãng quốc tế'
                ]
            };
        } else {
            // basic: Chỉ muốn giao tiếp
            rec.best = {
                pkg: PACKAGES.giaotiep,
                reasons: [
                    '6 tháng giao tiếp phản xạ — bình quân chỉ 2.500.000đ/tháng',
                    'Phương pháp ORI độc quyền, nghỉ ≤10% được tặng thêm 2 tháng',
                    'Phù hợp cho du lịch, công việc và đời sống hàng ngày'
                ]
            };
            rec.backup = { pkg: PACKAGES.toeic12, reason: 'Nếu muốn bắt đầu nhẹ với nền tảng TOEIC trước' };
            rec.upsell = {
                pkg: PACKAGES.combo500gt, reasons: [
                    'Thêm bằng TOEIC — giao tiếp giỏi + có bằng = profile vượt trội!',
                    'Combo tiết kiệm hơn mua riêng từng gói'
                ]
            };
        }

        rec.roadmap = [
            { phase: 'GĐ1 (Tháng 1–2)', desc: 'Xây phản xạ cơ bản, vocabulary theo chủ đề, nghe-nói hàng ngày' },
            { phase: 'GĐ2 (Tháng 3–4)', desc: 'Giao tiếp tình huống: công việc, du lịch, social' },
            { phase: 'GĐ3 (Tháng 5–6)', desc: 'Phản xạ nâng cao, debate, presentation, thực hành thực tế' }
        ];


        // ---- COMBO TOEIC + GT ----
    } else if (goal === 'combo') {
        const comboTarget = a.q3_combo_target;

        if (value === 'ultimate') {
            // Muốn tất cả: bằng + nói + việc → Combo + PV đảm bảo
            const combo = comboTarget === 'combo500' ? PACKAGES.combo500gt : PACKAGES.combo650gt;
            rec.best = {
                pkg: combo,
                reasons: [
                    'Combo TOEIC + Giao tiếp — có cả bằng lẫn kỹ năng nói',
                    'Học không giới hạn trong 14 tháng hoặc đến khi đạt mục tiêu',
                    'Tặng tư vấn CV — sẵn sàng ứng tuyển ngay khi hoàn thành'
                ]
            };
            rec.backup = {
                pkg: comboTarget === 'combo500' ? PACKAGES.toeic500 : PACKAGES.toeic610,
                reason: 'Nếu muốn tập trung TOEIC trước'
            };
            rec.upsell = {
                pkg: PACKAGES.comboMatDat, reasons: [
                    'Muốn đảm bảo việc làm? Trọn gói mặt đất — học đến khi có việc',
                    'Bao gồm tất cả: PV + English + CV — yên tâm tuyệt đối'
                ]
            };
        } else {
            // premium & basic → vẫn recommend combo (vì user đã chọn combo)
            if (comboTarget === 'combo500') {
                rec.best = {
                    pkg: PACKAGES.combo500gt,
                    reasons: [
                        'Kết hợp TOEIC 500–600 + Giao tiếp trong 1 gói tiết kiệm',
                        'Tiết kiệm hơn mua riêng từng gói — học cả hai song song',
                        'Nâng cả điểm thi lẫn kỹ năng nói — hoàn thiện profile'
                    ]
                };
                rec.backup = { pkg: PACKAGES.toeic500, reason: 'Nếu muốn tập trung TOEIC trước, free CV' };
                rec.upsell = {
                    pkg: PACKAGES.comboMatDat, reasons: [
                        'Muốn đảm bảo việc làm? Trọn gói mặt đất — học đến khi có việc',
                        'Bao gồm PV + English + CV — yên tâm 100%'
                    ]
                };
            } else {
                rec.best = {
                    pkg: PACKAGES.combo650gt,
                    reasons: [
                        'Combo TOEIC 650–700+ & Giao tiếp — gói mạnh mẽ nhất',
                        'Tiết kiệm hơn mua riêng — có cả điểm cao lẫn kỹ năng nói',
                        'Phù hợp apply hãng quốc tế cần cả điểm + speaking'
                    ]
                };
                rec.backup = { pkg: PACKAGES.toeic610, reason: 'Nếu muốn tập trung TOEIC trước, free CV' };
                rec.upsell = {
                    pkg: PACKAGES.comboTVHK, reasons: [
                        'Muốn apply tiếp viên? Trọn gói TVHK — học đến khi có việc',
                        'Full support: PV + CV + grooming + English'
                    ]
                };
            }
        }

        rec.roadmap = [
            { phase: 'GĐ1 (Tháng 1–3)', desc: 'TOEIC chuyên sâu: ngữ pháp, từ vựng, luyện đề' },
            { phase: 'GĐ2 (Tháng 4–6)', desc: 'Song song Giao tiếp phản xạ + TOEIC luyện đề nâng cao' },
            { phase: 'GĐ3 (Tháng 7–9)', desc: 'Giao tiếp nâng cao + mock test, thi TOEIC chính thức' }
        ];

        // ---- TRAINING HK ----
    } else if (goal === 'training') {
        const trainingType = a.q2_training;

        if (trainingType === 'eng_ai') {
            rec.best = {
                pkg: { name: 'English chuyên HK + AI Practice', price: 13000000, priceLabel: '13.000.000đ (10tr + 3tr)', note: 'English chuyên HK 2 tháng + AI 10 buổi' },
                reasons: [
                    'English chuyên HK: từ vựng cabin, PA, briefing, safety',
                    'AI practice: luyện phản xạ tình huống thực tế bằng AI',
                    'Tổng 13tr – hoàn thành trong 2 tháng trước training'
                ]
            };
            rec.backup = { pkg: PACKAGES.engHK, reason: 'Nếu chỉ cần core English HK, tiết kiệm 3tr' };
        } else {
            rec.best = {
                pkg: PACKAGES.engHK,
                reasons: [
                    'Chuyên biệt cho ngành hàng không: từ vựng thực tế',
                    '2 tháng hoàn thành – kịp trước training',
                    'Giáo viên có kinh nghiệm ngành bay'
                ]
            };
            rec.backup = { pkg: PACKAGES.aiHK, reason: 'Nếu đã có nền tảng, chỉ cần AI practice 3tr/10 buổi' };
        }

        rec.upsell = {
            pkg: PACKAGES.giaotiep, reasons: [
                'Sau training muốn nâng giao tiếp tổng thể, GT phản xạ 15tr/6th',
                'Học đều nghỉ ≤10% được tặng thêm 2 tháng (tổng 8 tháng)'
            ]
        };

        rec.roadmap = [
            { phase: 'GĐ1 (Tháng 1)', desc: 'Từ vựng chuyên ngành HK, PA phrase, cabin crew communication' },
            { phase: 'GĐ2 (Tháng 2)', desc: 'Tình huống thực tế: emergency, service, complaint + AI practice' },
            { phase: 'Sau training', desc: 'Tùy chọn: Giao tiếp phản xạ để nâng tổng hợp' }
        ];
    }

    // Build payment info
    const pkg = rec.best.pkg;
    const price = pkg.price;
    if (pkg.isMonthly) {
        // Gói lẻ theo tháng – không trả góp
        rec.payment = {
            type: 'monthly',
            monthly: formatVND(price)
        };
    } else {
        // Trọn gói – có trả góp 5 lần, có bình quân/tháng
        rec.payment = {
            type: 'lumpsum',
            full: formatVND(price),
            installment: formatVND(Math.ceil(price / 5)) + '/lần × 5 lần (mỗi lần cách nhau 1 tháng)',
            avgMonthly: pkg.months ? formatVND(Math.round(price / pkg.months)) + '/tháng' : null,
            months: pkg.months || null
        };
    }

    state.recommendation = rec;
    renderResult(rec);
}

function buildToeicRoadmap(level, target) {
    if ((level === '0-300' || level === '300-450') && target === '500-600') {
        return [
            { phase: 'GĐ1 (Tháng 1–2)', desc: 'Xây nền tảng ngữ pháp + từ vựng cơ bản, làm quen format TOEIC' },
            { phase: 'GĐ2 (Tháng 3–4)', desc: 'Luyện Part 5-6-7 Reading + Part 1-2-3-4 Listening chuyên sâu' },
            { phase: 'GĐ3 (Tháng 5–6)', desc: 'Mock test hàng tuần, rà lỗi, thi thử và thi thật' }
        ];
    }
    return [
        { phase: 'GĐ1 (Tháng 1–3)', desc: 'Củng cố nền tảng, nâng vốn từ + ngữ pháp nâng cao' },
        { phase: 'GĐ2 (Tháng 4–6)', desc: 'Chiến lược từng Part, luyện đề chuyên sâu' },
        { phase: 'GĐ3 (Tháng 7–9)', desc: 'Mock test, phân tích lỗi, đạt target và thi chính thức' }
    ];
}

// ==============================
// RENDER RESULT
// ==============================
function renderResult(rec) {
    const content = $('result-content');
    let html = '';

    // Best match
    html += `
    <div class="pkg-card best-match">
        <span class="pkg-badge best">⭐ Phù hợp nhất</span>
        <div class="pkg-name">${rec.best.pkg.name}</div>
        <div class="pkg-price">${rec.best.pkg.priceLabel}</div>
        ${rec.best.pkg.note ? `<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;">${rec.best.pkg.note}</p>` : ''}
        <ul class="pkg-reasons">
            ${rec.best.reasons.map(r => `<li>${r}</li>`).join('')}
        </ul>
    </div>`;

    // Backup
    if (rec.backup) {
        html += `
        <div class="pkg-card backup">
            <span class="pkg-badge alt">🔄 Phương án thay thế</span>
            <div class="pkg-name">${rec.backup.pkg.name}</div>
            <div class="pkg-price">${rec.backup.pkg.priceLabel}</div>
            <ul class="pkg-reasons">
                <li>${rec.backup.reason}</li>
            </ul>
        </div>`;
    }

    // Upsell
    if (rec.upsell) {
        html += `
        <div class="pkg-card upsell">
            <span class="pkg-badge up">🚀 Gợi ý nâng cấp</span>
            <div class="pkg-name">${rec.upsell.pkg.name}</div>
            <div class="pkg-price">${rec.upsell.pkg.priceLabel}</div>
            <ul class="pkg-reasons">
                ${rec.upsell.reasons.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>`;
    }

    // Auto-show interview link if any trọn gói is recommended
    const hasFullPackage = [
        rec.best && rec.best.pkg,
        rec.backup && rec.backup.pkg,
        rec.upsell && rec.upsell.pkg
    ].some(pkg => pkg && !pkg.isMonthly);

    if (hasFullPackage) {
        html += `
        <div class="pkg-card interview-link" style="border: 1px solid rgba(0,200,255,0.3); background: linear-gradient(135deg, rgba(0,200,255,0.08), rgba(100,50,255,0.08)); cursor: pointer;" onclick="window.open('https://ori-interview-courses.replit.app', '_blank')">
            <span class="pkg-badge" style="background: linear-gradient(135deg, #00c8ff, #6432ff); color: #fff;">✈️ Luyện PV Chuyên Nghiệp</span>
            <div class="pkg-name">✈️ Tiếng Anh Phỏng Vấn Hàng Không 1-1</div>
            <p style="font-size:0.85rem;color:var(--text-muted);margin:6px 0;">Coaching PV chuyên nghiệp: mặt đất, tiếp viên nội địa & quốc tế — đảm bảo +10tr nếu không đậu</p>
            <div style="font-size:0.85rem;color:#00c8ff;margin-top:8px;font-weight:600;">Xem chi tiết gói PV →</div>
        </div>`;
    }

    // Roadmap
    if (rec.roadmap.length > 0) {
        html += `
        <div class="result-section">
            <div class="result-section-title">📋 Lộ trình ước tính</div>
            ${rec.roadmap.map(s => `
                <div class="roadmap-step">
                    <div class="roadmap-dot"></div>
                    <div class="roadmap-info">
                        <h4>${s.phase}</h4>
                        <p>${s.desc}</p>
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    // Payment
    if (rec.payment.type === 'monthly') {
        html += `
        <div class="result-section">
            <div class="result-section-title">💳 Thanh toán</div>
            <div class="payment-row">
                <span class="payment-label">Đóng theo tháng</span>
                <span class="payment-value highlight">${rec.payment.monthly}</span>
            </div>
            <div style="font-size:0.8rem;color:var(--text-muted);padding:4px 0 0;">
                Không cần cam kết dài hạn – học tháng nào đóng tháng đó
            </div>
        </div>`;
    } else {
        html += `
        <div class="result-section">
            <div class="result-section-title">💳 Tùy chọn thanh toán</div>
            <div class="payment-row">
                <span class="payment-label">Trả 1 lần</span>
                <span class="payment-value highlight">${rec.payment.full}</span>
            </div>
            ${rec.payment.avgMonthly ? `
            <div class="payment-row" style="background:rgba(99,102,241,0.08);border-radius:8px;padding:8px 12px;margin:4px 0;">
                <span class="payment-label">📊 Bình quân chỉ</span>
                <span class="payment-value" style="color:#10b981;font-weight:700;">${rec.payment.avgMonthly} <small style="font-weight:400;opacity:0.7;">trong ${rec.payment.months} tháng</small></span>
            </div>` : ''}
            <div class="payment-row">
                <span class="payment-label">Trả góp 5 lần</span>
                <span class="payment-value">${rec.payment.installment}</span>
            </div>
        </div>`;
    }

    content.innerHTML = html;
}

// ==============================
// CONTACT FORM + GOOGLE SHEETS
// ==============================
function buildFormSummary() {
    const a = state.answers;
    const rec = state.recommendation;
    let lines = [];

    lines.push(`📌 Mục tiêu: ${getAnswerLabel('q1', a.q1)}`);

    // Add relevant details
    if (a.q2_toeic) lines.push(`📊 Trình độ: ${getAnswerLabel('q2_toeic', a.q2_toeic)}`);
    if (a.q2_combo) lines.push(`📊 Trình độ: ${getAnswerLabel('q2_combo', a.q2_combo)}`);
    if (a.q3_toeic_target) lines.push(`🎯 Điểm mục tiêu: ${getAnswerLabel('q3_toeic_target', a.q3_toeic_target)}`);
    if (a.q3_toeic_target_high) lines.push(`🎯 Điểm mục tiêu: ${getAnswerLabel('q3_toeic_target_high', a.q3_toeic_target_high)}`);
    if (a.q4_toeic_schedule) lines.push(`📅 Lịch học: ${getAnswerLabel('q4_toeic_schedule', a.q4_toeic_schedule)}`);
    if (a.q2_gt) lines.push(`💬 Mục tiêu GT: ${getAnswerLabel('q2_gt', a.q2_gt)}`);
    if (a.q3_gt_level) lines.push(`📊 Mức tự tin: ${getAnswerLabel('q3_gt_level', a.q3_gt_level)}`);
    if (a.q2_pv) lines.push(`✈️ Vị trí: ${getAnswerLabel('q2_pv', a.q2_pv)}`);
    if (a.q3_pv_guarantee) lines.push(`🛡️ Đảm bảo: ${getAnswerLabel('q3_pv_guarantee', a.q3_pv_guarantee)}`);
    if (a.q4_pv_when) lines.push(`⏰ Khi nào tuyển: ${getAnswerLabel('q4_pv_when', a.q4_pv_when)}`);
    if (a.q2_training) lines.push(`🛫 Loại training: ${getAnswerLabel('q2_training', a.q2_training)}`);
    if (a.q3_combo_target) lines.push(`📦 Combo: ${getAnswerLabel('q3_combo_target', a.q3_combo_target)}`);
    if (a.q5_time) lines.push(`⏱️ Thời gian: ${getAnswerLabel('q5_time', a.q5_time)}`);
    if (a.q6_value) lines.push(`🎯 Kỳ vọng: ${getAnswerLabel('q6_value', a.q6_value)}`);
    // Payment info from recommendation (no longer a quiz question)
    if (rec.payment.type === 'monthly') {
        lines.push(`💳 Thanh toán: Đóng theo tháng`);
    } else {
        lines.push(`💳 Thanh toán: Trọn gói (trả 1 lần hoặc trả góp 5 lần)`);
    }

    lines.push(`\n⭐ Gói đề xuất: ${rec.best.pkg.name} – ${rec.best.pkg.priceLabel}`);

    const summaryDiv = $('form-summary');
    summaryDiv.innerHTML = `
        <div class="summary-title">📋 Tóm tắt nhu cầu của bạn</div>
        ${lines.map(l => `<div>${l}</div>`).join('')}
    `;
}

function getAnswerLabel(qId, answerKey) {
    const q = QUESTIONS[qId];
    if (!q) return answerKey;
    const opt = q.options.find(o => o.key === answerKey);
    return opt ? opt.label : answerKey;
}

async function submitToGoogleSheets(formData) {
    // Build row data
    const a = state.answers;
    const rec = state.recommendation;

    const payload = {
        timestamp: new Date().toLocaleString('vi-VN'),
        name: formData.name,
        phone: formData.phone,
        goal: getAnswerLabel('q1', a.q1),
        level: a.q2_toeic ? getAnswerLabel('q2_toeic', a.q2_toeic) :
            a.q2_combo ? getAnswerLabel('q2_combo', a.q2_combo) :
                a.q3_gt_level ? getAnswerLabel('q3_gt_level', a.q3_gt_level) : '—',
        targetScore: a.q3_toeic_target ? getAnswerLabel('q3_toeic_target', a.q3_toeic_target) :
            a.q3_toeic_target_high ? getAnswerLabel('q3_toeic_target_high', a.q3_toeic_target_high) :
                a.q3_combo_target ? getAnswerLabel('q3_combo_target', a.q3_combo_target) : '—',
        position: a.q2_pv ? getAnswerLabel('q2_pv', a.q2_pv) : '—',
        guarantee: a.q3_pv_guarantee ? getAnswerLabel('q3_pv_guarantee', a.q3_pv_guarantee) : '—',
        timeline: a.q5_time ? getAnswerLabel('q5_time', a.q5_time) :
            a.q4_pv_when ? getAnswerLabel('q4_pv_when', a.q4_pv_when) : '—',
        budget: a.q6_value ? getAnswerLabel('q6_value', a.q6_value) : '—',
        payment: rec.payment.type === 'monthly' ? 'Đóng theo tháng' : 'Trọn gói (trả 1 lần / trả góp 5 lần)',
        recommendedPackage: rec.best.pkg.name + ' – ' + rec.best.pkg.priceLabel,
        note: formData.note || '',
        allAnswers: JSON.stringify(a)
    };

    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        // Demo mode – simulate success
        console.log('📊 Demo mode – data would be sent:', payload);
        await new Promise(r => setTimeout(r, 1000));
        return { success: true, demo: true };
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    return { success: true };
}

// ==============================
// UTILITY
// ==============================
function formatVND(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
}

function resetQuiz() {
    state = {
        history: [],
        answers: {},
        currentQ: 'q1',
        recommendation: null,
        contact: null
    };
}

// ==============================
// EVENT LISTENERS
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    // Start button
    $('btn-start').addEventListener('click', () => {
        resetQuiz();
        renderQuestion();
        showScreen('quiz');
    });

    // Back button
    $('btn-back').addEventListener('click', goBack);

    // To contact form
    $('btn-to-contact').addEventListener('click', () => {
        buildFormSummary();
        showScreen('contact');
    });

    // Retake
    $('btn-retake').addEventListener('click', () => {
        resetQuiz();
        renderQuestion();
        showScreen('quiz');
    });

    // Restart
    $('btn-restart').addEventListener('click', () => {
        resetQuiz();
        showScreen('welcome');
    });

    // Contact form submit
    $('contact-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = $('input-name').value.trim();
        const phone = $('input-phone').value.trim();
        const note = $('input-note').value.trim();

        if (!name || !phone) return;

        // Phone validation (Vietnamese)
        const phoneClean = phone.replace(/[\s-]/g, '');
        if (!/^(0|\+84)\d{9,10}$/.test(phoneClean)) {
            alert('Vui lòng nhập số điện thoại hợp lệ (VD: 0901234567)');
            return;
        }

        // Show loading
        const btnText = document.querySelector('.btn-text');
        const btnLoading = document.querySelector('.btn-loading');
        const btnSubmit = $('btn-submit');
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        btnSubmit.disabled = true;

        try {
            await submitToGoogleSheets({ name, phone, note });
            showScreen('success');
        } catch (err) {
            console.error('Submit error:', err);
            alert('Có lỗi xảy ra, vui lòng thử lại hoặc gọi Hotline 0906 303 373');
        } finally {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            btnSubmit.disabled = false;
        }
    });
});
