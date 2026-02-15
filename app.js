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
        name: 'TOEIC 12 buổi/tháng',
        price: 1600000,
        priceLabel: '1.600.000đ/tháng',
        note: 'Đóng theo tháng, không cam kết dài hạn',
        isMonthly: true
    },
    toeic20: {
        name: 'TOEIC 20 buổi/tháng',
        price: 2300000,
        priceLabel: '2.300.000đ/tháng',
        note: 'Đóng theo tháng, không cam kết dài hạn',
        isMonthly: true
    },
    toeic500: {
        name: 'TOEIC Trọn gói 500–600',
        price: 12000000,
        priceLabel: '12.000.000đ',
        note: 'Học không giới hạn trong 14 tháng hoặc đến khi đạt mục tiêu, tặng tư vấn CV + thiết kế CV 1 lần',
        isMonthly: false,
        months: 14
    },
    toeic610: {
        name: 'TOEIC Trọn gói 610–750',
        price: 15000000,
        priceLabel: '15.000.000đ',
        note: 'Học không giới hạn trong 14 tháng hoặc đến khi đạt mục tiêu, tặng tư vấn CV + thiết kế CV 1 lần',
        isMonthly: false,
        months: 14
    },
    giaotiep: {
        name: 'Giao tiếp phản xạ',
        price: 15000000,
        priceLabel: '15.000.000đ / 6 tháng',
        note: 'Học trong 6 tháng, tặng thêm 2 tháng nếu học đều nghỉ ≤10%',
        isMonthly: false,
        months: 6
    },
    combo500gt: {
        name: 'Combo TOEIC 500–600 + Giao tiếp',
        price: 20000000,
        priceLabel: '20.000.000đ',
        note: 'Học không giới hạn trong 14 tháng hoặc đến khi đạt mục tiêu',
        isMonthly: false,
        months: 14
    },
    combo650gt: {
        name: 'Combo TOEIC 650–700+ + Giao tiếp',
        price: 25000000,
        priceLabel: '25.000.000đ',
        note: 'Học không giới hạn trong 14 tháng hoặc đến khi đạt mục tiêu',
        isMonthly: false,
        months: 14
    },
    pvMatDat: {
        name: 'PV mặt đất 1-1',
        price: 5000000,
        priceLabel: '5.000.000đ / 12 buổi',
        note: 'Đảm bảo +10.000.000đ, free CV 1 lần',
        isMonthly: false,
        months: 3
    },
    pvTvhkTrong: {
        name: 'PV TVHK trong nước 1-1',
        price: 10000000,
        priceLabel: '10.000.000đ / 20 buổi',
        note: 'Đảm bảo +10.000.000đ, free CV 2 lần',
        isMonthly: false,
        months: 5
    },
    pvTvhkFull: {
        name: 'PV TVHK trong & ngoài nước 1-1',
        price: 15000000,
        priceLabel: '15.000.000đ / 30 buổi',
        note: 'Đảm bảo +10.000.000đ, free CV 5 lần',
        isMonthly: false,
        months: 7
    },
    engHK: {
        name: 'Tiếng Anh chuyên hàng không',
        price: 10000000,
        priceLabel: '10.000.000đ / 2 tháng',
        note: '',
        isMonthly: false,
        months: 2
    },
    aiHK: {
        name: 'Gói AI cho training HK',
        price: 3000000,
        priceLabel: '3.000.000đ / 10 buổi',
        note: '',
        isMonthly: false,
        months: 2
    },
    comboMatDat: {
        name: 'Combo trọn gói mặt đất (đảm bảo việc làm)',
        price: 35000000,
        priceLabel: '35.000.000đ',
        note: 'Học không giới hạn tới khi có việc',
        isMonthly: false,
        months: 14
    },
    comboTVHK: {
        name: 'Trọn gói tiếp viên HK (đảm bảo)',
        price: 45000000,
        priceLabel: '45.000.000đ',
        note: 'Học không giới hạn tới khi có việc',
        isMonthly: false,
        months: 14
    }
};

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
            { key: 'phongvan', label: 'Phỏng vấn hàng không', emoji: '✈️', next: 'q2_pv' },
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
            { key: 'interview', label: 'Chuẩn bị đi phỏng vấn', emoji: '🎤', next: 'q2_pv' }
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

    // ---- Phỏng vấn branch ----
    q2_pv: {
        id: 'q2_pv',
        title: 'Vị trí bạn muốn ứng tuyển?',
        subtitle: '',
        options: [
            { key: 'matdat', label: 'Mặt đất (lounge, duty free, check-in)', emoji: '🏢', next: 'q3_pv_guarantee' },
            { key: 'anninh', label: 'An ninh hàng không', emoji: '🛡️', next: 'q3_pv_guarantee' },
            { key: 'tvhk_nd', label: 'Tiếp viên hãng nội địa', emoji: '🇻🇳', next: 'q3_pv_guarantee' },
            { key: 'tvhk_qt', label: 'Tiếp viên hãng quốc tế', emoji: '🌏', next: 'q3_pv_guarantee' }
        ]
    },
    q3_pv_guarantee: {
        id: 'q3_pv_guarantee',
        title: 'Bạn có muốn gói "đảm bảo việc làm"?',
        subtitle: 'Học không giới hạn cho đến khi có việc',
        options: [
            { key: 'yes', label: 'Có – muốn đảm bảo, học đến khi có việc', emoji: '🛡️', next: 'q4_pv_when' },
            { key: 'no', label: 'Không – chỉ cần luyện PV 1-1 là đủ', emoji: '🎯', next: 'q4_pv_when' }
        ]
    },
    q4_pv_when: {
        id: 'q4_pv_when',
        title: 'Khi nào có đợt tuyển?',
        subtitle: '',
        options: [
            { key: '2-3m', label: 'Trong 2–3 tháng tới', emoji: '⚡', next: 'q6_budget' },
            { key: '3-6m', label: '3–6 tháng tới', emoji: '📅', next: 'q6_budget' },
            { key: '6-12m', label: '6–12 tháng (chuẩn bị dài hạn)', emoji: '🗓️', next: 'q6_budget' }
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
            { key: '<4m', label: 'Dưới 4 tháng (gấp)', emoji: '⚡', next: 'q6_budget' },
            { key: '4-6m', label: '4–6 tháng', emoji: '📅', next: 'q6_budget' },
            { key: '6-12m', label: '6–12 tháng (ổn định)', emoji: '🗓️', next: 'q6_budget' }
        ]
    },

    // ---- Common: Budget ----
    q6_budget: {
        id: 'q6_budget',
        title: 'Ngân sách bạn có thể đầu tư?',
        subtitle: 'Cho toàn bộ khóa học',
        options: [
            { key: '<5tr', label: 'Dưới 5 triệu', emoji: '💰', next: null },
            { key: '5-10tr', label: '5–10 triệu', emoji: '💰', next: null },
            { key: '10-20tr', label: '10–20 triệu', emoji: '💎', next: null },
            { key: '20-35tr', label: '20–35 triệu', emoji: '💎', next: null },
            { key: '35tr+', label: '35 triệu trở lên', emoji: '👑', next: null }
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
    contact: $('screen-contact'),
    success: $('screen-success')
};

// ==============================
// SCREEN NAVIGATION
// ==============================
function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    let rec = { best: null, backup: null, upsell: null, roadmap: [], payment: {} };

    // ---- TOEIC ----
    if (goal === 'toeic') {
        const level = a.q2_toeic;
        const target = a.q3_toeic_target || a.q3_toeic_target_high;
        const schedule = a.q4_toeic_schedule;
        const budget = a.q6_budget;

        if (target === '500-600') {
            if (schedule === 'unlimited' || budget === '10-20tr' || budget === '20-35tr' || budget === '35tr+') {
                rec.best = {
                    pkg: PACKAGES.toeic500,
                    reasons: [
                        '14 tháng không giới hạn – học đến khi đạt mục tiêu',
                        'Bình quân chỉ ~857.000đ/tháng – rẻ hơn học lẻ theo tháng!',
                        'Phù hợp mục tiêu 500–600, tặng kèm tư vấn CV + thiết kế CV'
                    ]
                };
                rec.backup = { pkg: PACKAGES.toeic20, reason: 'Nếu muốn trả theo tháng, linh hoạt hơn' };
                rec.upsell = {
                    pkg: PACKAGES.combo500gt, reasons: [
                        'Kết hợp TOEIC 500–600 + Giao tiếp phản xạ chỉ 20tr (tiết kiệm 7tr)',
                        'Giao tiếp tốt sẽ giúp phỏng vấn tự tin hơn'
                    ]
                };
            } else if (budget === '5-10tr' || schedule === '20bth') {
                rec.best = {
                    pkg: PACKAGES.toeic20,
                    reasons: [
                        '20 buổi/tháng = 5 buổi/tuần, cường độ cao kịp mục tiêu',
                        'Phù hợp ngân sách 5–10 triệu',
                        'Trả theo tháng, không cần đóng lớn 1 lần'
                    ]
                };
                rec.backup = { pkg: PACKAGES.toeic12, reason: 'Nếu ngân sách eo hẹp hơn, chấp nhận lộ trình chậm hơn' };
                rec.upsell = {
                    pkg: PACKAGES.toeic500, reasons: [
                        'Trọn gói 12tr tiết kiệm hơn nếu học dài hạn',
                        'Tặng tư vấn CV + thiết kế CV 1 lần'
                    ]
                };
            } else {
                rec.best = {
                    pkg: PACKAGES.toeic12,
                    reasons: [
                        'Chi phí thấp nhất: 1.600.000đ/tháng',
                        '12 buổi/tháng đủ để duy trì tiến bộ',
                        'Phù hợp ngân sách dưới 5 triệu'
                    ]
                };
                rec.backup = { pkg: PACKAGES.toeic20, reason: 'Nếu có thể tăng budget, 20 buổi/tháng sẽ tiến nhanh hơn' };
                rec.upsell = {
                    pkg: PACKAGES.toeic500, reasons: [
                        'Nếu gom đủ ngân sách, trọn gói 12tr tiết kiệm dài hạn',
                        'Tặng tư vấn CV + thiết kế CV miễn phí'
                    ]
                };
            }
        } else {
            // Target 610-750 or 700+
            if (budget === '10-20tr' || budget === '20-35tr' || budget === '35tr+' || schedule === 'unlimited') {
                rec.best = {
                    pkg: PACKAGES.toeic610,
                    reasons: [
                        '14 tháng không giới hạn – phù hợp target cao 610–750',
                        'Bình quân chỉ ~1.071.000đ/tháng – tiết kiệm hơn học lẻ!',
                        'Học với giáo viên chuyên luyện band cao, tặng tư vấn CV'
                    ]
                };
                rec.backup = { pkg: PACKAGES.toeic20, reason: 'Nếu muốn trả theo tháng thay vì đóng 1 lần' };
                rec.upsell = {
                    pkg: PACKAGES.combo650gt, reasons: [
                        'Combo TOEIC 650+ kèm Giao tiếp phản xạ chỉ 25tr (tiết kiệm 5tr)',
                        'Nâng cả TOEIC lẫn kỹ năng nói – hoàn thiện profile'
                    ]
                };
            } else {
                rec.best = {
                    pkg: PACKAGES.toeic20,
                    reasons: [
                        '20 buổi/tháng giúp luyện chuyên sâu, phù hợp target cao',
                        'Trả theo tháng, linh hoạt ngân sách',
                        'Phù hợp khi chưa sẵn sàng đóng trọn gói'
                    ]
                };
                rec.backup = { pkg: PACKAGES.toeic12, reason: 'Nếu ngân sách hạn chế, 12 buổi/tháng vẫn tiến bộ' };
                rec.upsell = {
                    pkg: PACKAGES.toeic610, reasons: [
                        'Trọn gói 15tr tiết kiệm hơn dài hạn, không lo giới hạn buổi',
                        'Tặng tư vấn CV + thiết kế CV 1 lần'
                    ]
                };
            }
        }

        rec.roadmap = buildToeicRoadmap(level, target);

        // ---- GIAO TIẾP ----
    } else if (goal === 'giaotiep') {
        const gtGoal = a.q2_gt;
        const budget = a.q6_budget;

        if (gtGoal === 'aviation') {
            rec.best = {
                pkg: PACKAGES.engHK,
                reasons: [
                    'Chuyên biệt cho ngành hàng không: từ vựng cabin, PA, safety',
                    'Hoàn thành trong 2 tháng – phù hợp trước training',
                    'Giáo viên có kinh nghiệm ngành bay'
                ]
            };
            rec.backup = { pkg: PACKAGES.giaotiep, reason: 'Nếu muốn nâng giao tiếp tổng hợp kèm chuyên ngành' };
            rec.upsell = {
                pkg: PACKAGES.aiHK, reasons: [
                    'Thêm 10 buổi AI practice chỉ 3tr – luyện phản xạ tình huống thực',
                    'Kết hợp English HK + AI = chuẩn bị toàn diện'
                ]
            };
        } else {
            if (budget === '10-20tr' || budget === '20-35tr' || budget === '35tr+') {
                rec.best = {
                    pkg: PACKAGES.giaotiep,
                    reasons: [
                        '6 tháng giao tiếp phản xạ – bình quân chỉ 2.500.000đ/tháng!',
                        'Phương pháp ORI độc quyền, học đều nghỉ ≤10% được tặng thêm 2 tháng',
                        'Phù hợp cho cả du lịch, công việc và đời sống'
                    ]
                };
                rec.backup = { pkg: PACKAGES.toeic12, reason: 'Nếu ngân sách hạn chế, bắt đầu TOEIC cơ bản + tự luyện nói' };
                rec.upsell = {
                    pkg: PACKAGES.combo500gt, reasons: [
                        'Kết hợp Giao tiếp + TOEIC 500–600 chỉ 20tr – bổ sung điểm TOEIC cho CV',
                        'Combo tiết kiệm hơn mua riêng từng gói'
                    ]
                };
            } else {
                rec.best = {
                    pkg: PACKAGES.toeic12,
                    reasons: [
                        'Bắt đầu với TOEIC 12 buổi/tháng để xây nền tảng',
                        'Chi phí chỉ 1.600.000đ/tháng – phù hợp ngân sách',
                        'Nâng nền tảng trước, lên giao tiếp sau khi sẵn sàng'
                    ]
                };
                rec.backup = { pkg: PACKAGES.toeic20, reason: 'Nếu muốn tiến nhanh hơn với 20 buổi/tháng' };
                rec.upsell = {
                    pkg: PACKAGES.giaotiep, reasons: [
                        'Khi ngân sách cho phép, Giao tiếp phản xạ 15tr là lựa chọn tốt nhất',
                        'Tặng thêm 2 tháng nếu học chuyên cần'
                    ]
                };
            }
        }

        rec.roadmap = [
            { phase: 'GĐ1 (Tháng 1–2)', desc: 'Xây phản xạ cơ bản, vocabulary theo chủ đề, nghe-nói hàng ngày' },
            { phase: 'GĐ2 (Tháng 3–4)', desc: 'Giao tiếp tình huống: công việc, du lịch, social' },
            { phase: 'GĐ3 (Tháng 5–6)', desc: 'Phản xạ nâng cao, debate, presentation, thực hành thực tế' }
        ];

        // ---- PHỎNG VẤN HK ----
    } else if (goal === 'phongvan') {
        const position = a.q2_pv;
        const guarantee = a.q3_pv_guarantee;
        const budget = a.q6_budget;

        if (position === 'matdat' || position === 'anninh') {
            if (guarantee === 'yes' && (budget === '20-35tr' || budget === '35tr+')) {
                rec.best = {
                    pkg: PACKAGES.comboMatDat,
                    reasons: [
                        'Học không giới hạn cho đến khi có việc – cam kết đảm bảo',
                        'Bao gồm luyện PV, CV, English, kỹ năng mềm',
                        'An tâm đầu tư 1 lần, không lo tốn thêm nếu trượt'
                    ]
                };
                rec.backup = { pkg: PACKAGES.pvMatDat, reason: 'Nếu tự tin 12 buổi PV 1-1 là đủ, chỉ cần 5tr' };
            } else {
                rec.best = {
                    pkg: PACKAGES.pvMatDat,
                    reasons: [
                        'PV 1-1 chuyên mặt đất: lounge, duty free, check-in, an ninh',
                        '12 buổi với coach riêng, đảm bảo +10tr nếu không đậu',
                        'Tặng free thiết kế CV 1 lần'
                    ]
                };
                rec.backup = { pkg: PACKAGES.comboMatDat, reason: 'Nếu muốn đảm bảo 100%, học tới khi có việc' };
            }
            rec.upsell = {
                pkg: PACKAGES.toeic12, reasons: [
                    'Nhiều vị trí mặt đất yêu cầu TOEIC ≥ 450, thêm TOEIC bổ trợ hồ sơ',
                    'Chi phí chỉ 1.600.000đ/tháng, học song song PV dễ dàng'
                ]
            };
            rec.roadmap = [
                { phase: 'GĐ1 (Tuần 1–3)', desc: 'CV + hồ sơ, PV cơ bản: tự giới thiệu, motivation, tại sao HK' },
                { phase: 'GĐ2 (Tuần 4–6)', desc: 'PV tình huống: handling passengers, teamwork, conflict resolution' },
                { phase: 'GĐ3 (Tuần 7–8+)', desc: 'Mock interview, phản hồi chi tiết, chỉnh sửa, sẵn sàng thi' }
            ];
        } else {
            // Tiếp viên
            if (guarantee === 'yes' && (budget === '35tr+' || budget === '20-35tr')) {
                rec.best = {
                    pkg: PACKAGES.comboTVHK,
                    reasons: [
                        'Học không giới hạn – apply bao nhiêu hãng cũng được',
                        'Full support: PV nội địa + quốc tế, CV, grooming, video',
                        'Cam kết đảm bảo việc làm – đầu tư 1 lần'
                    ]
                };
                rec.backup = {
                    pkg: position === 'tvhk_qt' ? PACKAGES.pvTvhkFull : PACKAGES.pvTvhkTrong,
                    reason: position === 'tvhk_qt' ? 'Nếu tự tin 30 buổi là đủ, đảm bảo +10tr, free CV 5 lần' : 'Nếu chỉ apply hãng nội địa, 20 buổi + đảm bảo +10tr'
                };
            } else if (position === 'tvhk_qt') {
                rec.best = {
                    pkg: PACKAGES.pvTvhkFull,
                    reasons: [
                        '30 buổi PV 1-1 cho cả hãng trong nước và quốc tế',
                        'Đảm bảo hoàn tiền +10tr nếu không đậu',
                        'Free CV 5 lần – chuẩn bị hồ sơ cho nhiều hãng'
                    ]
                };
                rec.backup = { pkg: PACKAGES.pvTvhkTrong, reason: 'Nếu muốn bắt đầu với hãng nội địa trước' };
                rec.upsell = {
                    pkg: PACKAGES.comboTVHK, reasons: [
                        'Trọn gói đảm bảo 45tr – an tâm apply không giới hạn',
                        'Tiết kiệm vs mua nhiều gói PV riêng lẻ'
                    ]
                };
            } else {
                rec.best = {
                    pkg: PACKAGES.pvTvhkTrong,
                    reasons: [
                        '20 buổi PV 1-1 chuyên hãng nội địa (VNA, VJ, Bamboo...)',
                        'Đảm bảo hoàn tiền +10tr nếu không đậu',
                        'Free CV 2 lần'
                    ]
                };
                rec.backup = { pkg: PACKAGES.pvMatDat, reason: 'Nếu cũng quan tâm vị trí mặt đất, chỉ 5tr/12 buổi' };
                rec.upsell = {
                    pkg: PACKAGES.pvTvhkFull, reasons: [
                        'Nâng lên gói quốc tế 15tr nếu muốn apply thêm hãng ngoài',
                        'Free CV 5 lần, đảm bảo +10tr'
                    ]
                };
            }
            rec.roadmap = [
                { phase: 'GĐ1 (Tháng 1–3)', desc: 'Xây nền tảng: English giao tiếp, từ vựng HK, CV & hồ sơ' },
                { phase: 'GĐ2 (Tháng 4–7)', desc: 'PV chuyên sâu: group discussion, final interview, grooming' },
                { phase: 'GĐ3 (Tháng 8–12)', desc: 'Thực chiến apply hãng, mock interview theo từng hãng' }
            ];
            if (!rec.upsell) {
                rec.upsell = {
                    pkg: PACKAGES.aiHK, reasons: [
                        'Luyện thêm AI practice cho cabin announcement, PA, safety',
                        'Bổ trợ tuyệt vời trong thời gian chờ giữa các đợt tuyển'
                    ]
                };
            }
        }

        // ---- COMBO TOEIC + GT ----
    } else if (goal === 'combo') {
        const comboTarget = a.q3_combo_target;
        const budget = a.q6_budget;

        if (comboTarget === 'combo500') {
            rec.best = {
                pkg: PACKAGES.combo500gt,
                reasons: [
                    'Kết hợp TOEIC 500–600 + Giao tiếp trong 1 gói tiết kiệm',
                    'Chỉ 20tr vs mua riêng: Trọn gói 12tr + GT 15tr = 27tr',
                    'Nâng cả điểm thi lẫn kỹ năng nói – hoàn thiện profile'
                ]
            };
            rec.backup = { pkg: PACKAGES.toeic500, reason: 'Nếu muốn tập trung TOEIC trước, 12tr + free CV' };
            rec.upsell = {
                pkg: PACKAGES.pvMatDat, reasons: [
                    'Nếu muốn apply mặt đất, thêm PV 1-1 chỉ 5tr',
                    'Bộ 3 hoàn hảo: TOEIC + Giao tiếp + PV'
                ]
            };
        } else {
            rec.best = {
                pkg: PACKAGES.combo650gt,
                reasons: [
                    'Combo TOEIC 650–700+ & Giao tiếp – mạnh mẽ nhất',
                    'Chỉ 25tr vs mua riêng: 15tr + 15tr = 30tr (tiết kiệm 5tr)',
                    'Phù hợp apply hãng quốc tế cần cả điểm + speaking'
                ]
            };
            rec.backup = { pkg: PACKAGES.toeic610, reason: 'Nếu muốn tập trung TOEIC trước, 15tr + free CV' };
            rec.upsell = {
                pkg: PACKAGES.pvTvhkTrong, reasons: [
                    'Muốn apply tiếp viên? Thêm PV 1-1 trong nước 10tr/20 buổi',
                    'Đảm bảo +10tr nếu không đậu, free CV 2 lần'
                ]
            };
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
    if (a.q6_budget) lines.push(`💰 Ngân sách: ${getAnswerLabel('q6_budget', a.q6_budget)}`);
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
        budget: a.q6_budget ? getAnswerLabel('q6_budget', a.q6_budget) : '—',
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
