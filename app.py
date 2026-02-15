
import streamlit as st
import pandas as pd
import json
import os
from datetime import datetime

# --- إعدادات الصفحة الفنية ---
st.set_page_config(
    page_title="مدير البرج 4 | Premium",
    page_icon="🏢",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- محرك التنسيق البصري المتطور (CSS) ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
    
    /* الأساسيات والخطوط */
    html, body, [class*="css"], .stMarkdown, .stText, .stButton, .stSelectbox, .stTextInput, .stNumberInput {
        font-family: 'Cairo', sans-serif !important;
        direction: rtl !important;
        text-align: right !important;
    }
    
    .stApp {
        background-color: #f8fafc;
    }

    /* إخفاء عناصر ستريم ليت غير الضرورية */
    header, footer, #MainMenu {visibility: hidden;}

    /* الحاوية المركزية (للمحاكاة شكل الموبايل الأنيق) */
    .block-container {
        padding-top: 1rem !important;
        padding-bottom: 1rem !important;
        max-width: 550px !important;
        margin: 0 auto !important;
    }

    /* بطاقة التوازن المتدرجة (Compact Version) */
    .balance-card {
        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        border-radius: 24px;
        padding: 20px;
        color: white;
        text-align: center;
        box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);
        margin-bottom: 25px;
        position: relative;
    }
    .balance-label { font-size: 13px; font-weight: 700; opacity: 0.8; margin-bottom: 2px; }
    .balance-value { font-size: 28px; font-weight: 900; letter-spacing: -1px; }
    
    .sub-metrics {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        border-bottom: 1px solid rgba(255,255,255,0.15);
        padding-bottom: 10px;
    }
    .sub-metric-item { flex: 1; }
    .sub-metric-label { font-size: 10px; font-weight: 700; opacity: 0.7; }
    .sub-metric-value { font-size: 16px; font-weight: 800; }

    /* شبكة الأيقونات (تنسيق ملموم) */
    .stButton > button {
        border-radius: 20px !important;
        width: 70px !important;
        height: 70px !important;
        min-width: 70px !important;
        padding: 0 !important;
        font-size: 28px !important;
        border: none !important;
        box-shadow: 0 4px 10px rgba(0,0,0,0.08) !important;
        margin: 0 auto !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: transform 0.2s, box-shadow 0.2s !important;
    }
    .stButton > button:hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 8px 15px rgba(0,0,0,0.12) !important;
    }
    
    /* ألوان الأيقونات المخصصة */
    .btn-blue button { background: #3b82f6 !important; color: white !important; }
    .btn-green button { background: #10b981 !important; color: white !important; }
    .btn-red button { background: #ef4444 !important; color: white !important; }
    .btn-cyan button { background: #06b6d4 !important; color: white !important; }
    .btn-pink button { background: #ec4899 !important; color: white !important; }
    .btn-amber button { background: #f59e0b !important; color: white !important; }
    .btn-purple button { background: #8b5cf6 !important; color: white !important; }
    .btn-slate button { background: #64748b !important; color: white !important; }

    /* تسميات الأيقونات */
    .icon-label {
        font-size: 12px;
        font-weight: 800;
        color: #334155;
        margin-top: 5px;
        text-align: center;
        display: block;
    }

    /* تحسين شكل المدخلات */
    .stTextInput input, .stSelectbox select, .stNumberInput input {
        border-radius: 12px !important;
        border: 1px solid #e2e8f0 !important;
        padding: 10px !important;
    }

    /* الهيدر */
    .app-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    .header-title { font-size: 18px; font-weight: 900; color: #1e293b; margin: 0; }
    .date-badge {
        background: #eff6ff;
        color: #2563eb;
        padding: 4px 12px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 700;
    }
    </style>
    """, unsafe_allow_html=True)

# --- إدارة البيانات ---
DB_FILE = "tower_data_v4.json"

def load_data():
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except: pass
    return {
        "residents": [], "collections": [], "transactions": [],
        "categories": ["صيانة مصاعد", "نظافة", "كهرباء", "حراسة"],
        "settings": {"appName": "أبراج الإعلاميين - برج ٤", "defaultSubscription": 150, "adminPassword": "123"}
    }

def save_data(data):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

if 'db' not in st.session_state:
    st.session_state.db = load_data()
if 'page' not in st.session_state:
    st.session_state.page = "main"

db = st.session_state.db

# --- واجهة المستخدم الرئيسية (The Hub) ---
def main_hub():
    # الهيدر الملموم
    st.markdown(f"""
    <div class="app-header">
        <div>
            <span style="font-size: 10px; color: #94a3b8; font-weight: 700; display: block; margin-bottom: -5px;">تطبيق إدارة</span>
            <h1 class="header-title">{db['settings']['appName']}</h1>
        </div>
        <div class="date-badge">{datetime.now().strftime("%A %d %B")}</div>
    </div>
    """, unsafe_allow_html=True)

    # حساب الأرقام
    total_coll = sum(c['amount'] for c in db['collections'])
    total_exp = sum(t['amount'] for t in db['transactions'] if t['type'] == 'expense' and t['category'] != 'treasury')
    net = total_coll - total_exp

    # بطاقة التوازن (Premium & Compact)
    st.markdown(f"""
    <div class="balance-card">
        <div class="sub-metrics">
            <div class="sub-metric-item">
                <div class="sub-metric-label">إجمالي التحصيلات</div>
                <div class="sub-metric-value">{total_coll:,.0f} ج.م</div>
            </div>
            <div style="width: 1px; background: rgba(255,255,255,0.2); margin: 0 10px;"></div>
            <div class="sub-metric-item">
                <div class="sub-metric-label">إجمالي المصروفات</div>
                <div class="sub-metric-value">{total_exp:,.0f} ج.م</div>
            </div>
        </div>
        <div class="balance-label">صافي التحصيل المتاح</div>
        <div class="balance-value">{net:,.0f} ج.م</div>
    </div>
    """, unsafe_allow_html=True)

    # شبكة الأيقونات (توزيع 3 أعمدة متناسقة)
    # Row 1
    c1, c2, c3 = st.columns(3)
    with c1:
        st.markdown('<div class="btn-blue">', unsafe_allow_html=True)
        if st.button("👥", key="nav_res"): st.session_state.page = "residents"; st.rerun()
        st.markdown('</div><span class="icon-label">السكان</span>', unsafe_allow_html=True)
    with c2:
        st.markdown('<div class="btn-green">', unsafe_allow_html=True)
        if st.button("💵", key="nav_coll"): st.session_state.page = "collection"; st.rerun()
        st.markdown('</div><span class="icon-label">التحصيل</span>', unsafe_allow_html=True)
    with c3:
        st.markdown('<div class="btn-red">', unsafe_allow_html=True)
        if st.button("🚨", key="nav_debt"): st.session_state.page = "alerts"; st.rerun()
        st.markdown('</div><span class="icon-label">المتأخرين</span>', unsafe_allow_html=True)

    st.write("") # فاصل بسيط

    # Row 2
    c4, c5, c6 = st.columns(3)
    with c4:
        st.markdown('<div class="btn-cyan">', unsafe_allow_html=True)
        if st.button("🔍", key="nav_hist"): st.session_state.page = "history"; st.rerun()
        st.markdown('</div><span class="icon-label">سجل سداد</span>', unsafe_allow_html=True)
    with c5:
        st.markdown('<div class="btn-pink">', unsafe_allow_html=True)
        if st.button("📉", key="nav_exp"): st.session_state.page = "expenses"; st.rerun()
        st.markdown('</div><span class="icon-label">المصروفات</span>', unsafe_allow_html=True)
    with c6:
        st.markdown('<div class="btn-amber">', unsafe_allow_html=True)
        if st.button("🏦", key="nav_trea"): st.session_state.page = "treasury"; st.rerun()
        st.markdown('</div><span class="icon-label">الخزينة</span>', unsafe_allow_html=True)

    st.write("") # فاصل بسيط

    # Row 3
    c7, c8, c9 = st.columns(3)
    with c7:
        st.markdown('<div class="btn-purple">', unsafe_allow_html=True)
        if st.button("📊", key="nav_rep"): st.session_state.page = "reports"; st.rerun()
        st.markdown('</div><span class="icon-label">التقارير</span>', unsafe_allow_html=True)
    with c8:
        st.markdown('<div class="btn-slate">', unsafe_allow_html=True)
        if st.button("⚙️", key="nav_set"): st.session_state.page = "settings"; st.rerun()
        st.markdown('</div><span class="icon-label">الإعدادات</span>', unsafe_allow_html=True)
    with c9:
        # مساحة فارغة أو أيقونة إضافية
        pass

# --- وظائف الصفحات الفرعية ---

def back_home():
    if st.button("🔙 العودة للرئيسية"):
        st.session_state.page = "main"
        st.rerun()
    st.divider()

if st.session_state.page == "main":
    main_hub()

elif st.session_state.page == "residents":
    st.markdown("### **إدارة السكان**")
    back_home()
    with st.expander("إضافة ساكن جديد"):
        with st.form("res_add"):
            name = st.text_input("الاسم بالكامل")
            c1, c2 = st.columns(2)
            floor = c1.text_input("رقم الدور")
            flat = c2.text_input("رقم الشقة")
            sub = st.number_input("الاشتراك", value=db['settings']['defaultSubscription'])
            if st.form_submit_button("حفظ"):
                db['residents'].append({"id": len(db['residents'])+1, "name": name, "floorNumber": floor, "flatNumber": flat, "subscriptionValue": sub, "mobile": "+20"})
                save_data(db)
                st.success("تم الحفظ")
    
    if db['residents']:
        st.table(pd.DataFrame(db['residents'])[['name', 'floorNumber', 'flatNumber']])

elif st.session_state.page == "collection":
    st.markdown("### **تسجيل تحصيل**")
    back_home()
    if not db['residents']: st.warning("أضف سكان أولاً")
    else:
        res_map = {r['id']: r['name'] for r in db['residents']}
        rid = st.selectbox("الساكن", options=list(res_map.keys()), format_func=lambda x: res_map[x])
        m = st.selectbox("الشهر", range(1, 13), index=datetime.now().month-1)
        amt = st.number_input("المبلغ", value=float(next(r for r in db['residents'] if r['id']==rid)['subscriptionValue']))
        if st.button("تأكيد التحصيل"):
            db['collections'].append({"id": len(db['collections'])+1, "residentId": rid, "month": m, "year": 2024, "amount": amt, "date": str(datetime.now().date())})
            save_data(db)
            st.success("تم التسجيل ✅")

elif st.session_state.page == "reports":
    st.markdown("### **التقارير المالية**")
    back_home()
    st.info("سجل العمليات (الأحدث أولاً)")
    all_t = sorted(db['transactions'], key=lambda x: x['date'], reverse=True)
    if all_t:
        df = pd.DataFrame(all_t)[['date', 'category', 'description', 'amount']]
        # تلوين عمود التاريخ بالأسود
        st.markdown("<style>table td:nth-child(1) { color: black !important; font-weight: 700; }</style>", unsafe_allow_html=True)
        st.table(df)
    else:
        st.write("لا توجد بيانات حالياً")

# (بقية الصفحات يمكن إضافتها بنفس النمط الملموم)
