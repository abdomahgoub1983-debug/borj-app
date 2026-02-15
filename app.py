
import streamlit as st
import pandas as pd
import json
import os
from datetime import datetime

# --- إعدادات الصفحة الفنية ---
st.set_page_config(
    page_title="برج 4 | لوحة التحكم",
    page_icon="🏢",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- محرك التنسيق البصري الاحترافي (CSS) ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
    
    /* الأساسيات والخطوط */
    html, body, [class*="css"], .stMarkdown, .stText, .stButton, .stSelectbox, .stTextInput, .stNumberInput {
        font-family: 'Cairo', sans-serif !important;
        direction: rtl !important;
        text-align: right !important;
    }
    
    .stApp {
        background-color: #ffffff;
    }

    /* إخفاء عناصر ستريم ليت */
    header, footer, #MainMenu {visibility: hidden;}

    /* ضبط حاوية الصفحة لتكون ملمومة */
    .block-container {
        padding-top: 0.5rem !important;
        padding-bottom: 0.5rem !important;
        max-width: 450px !important;
        margin: 0 auto !important;
    }

    /* الهيدر العلوي */
    .app-header {
        text-align: right;
        margin-bottom: 10px;
    }
    .header-title { font-size: 22px; font-weight: 900; color: #1e293b; margin: 0; line-height: 1.2; }
    .date-badge {
        background: #f1f5f9;
        color: #475569;
        padding: 2px 10px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 700;
        display: inline-block;
        margin-top: 5px;
    }

    /* بطاقة التوازن المتدرجة (Compact) */
    .balance-card {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        border-radius: 20px;
        padding: 15px;
        color: white;
        text-align: center;
        box-shadow: 0 8px 16px rgba(37, 99, 235, 0.2);
        margin-bottom: 20px;
    }
    .balance-label { font-size: 11px; font-weight: 600; opacity: 0.9; margin-bottom: 2px; }
    .balance-value { font-size: 24px; font-weight: 900; }
    
    .sub-metrics {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 8px;
    }
    .sub-metric-item { flex: 1; text-align: center; }
    .sub-metric-label { font-size: 9px; opacity: 0.8; font-weight: 600; }
    .sub-metric-value { font-size: 14px; font-weight: 800; }

    /* شبكة الأيقونات (Grid) */
    .stButton > button {
        border-radius: 15px !important;
        width: 100% !important;
        height: 65px !important;
        font-size: 24px !important;
        border: none !important;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05) !important;
        background: white !important;
        color: #1e293b !important;
        transition: transform 0.1s !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    .stButton > button:active {
        transform: scale(0.95) !important;
    }

    /* تسميات الأيقونات */
    .icon-label {
        font-size: 11px;
        font-weight: 700;
        color: #475569;
        margin-top: 4px;
        text-align: center;
        display: block;
        margin-bottom: 12px;
    }

    /* تقليل المسافات بين الأعمدة في الموبايل */
    [data-testid="column"] {
        padding: 0 4px !important;
    }
    
    /* جعل الحقول ملمومة */
    .stTextInput, .stNumberInput, .stSelectbox {
        margin-bottom: -10px !important;
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
        <span style="font-size: 9px; color: #94a3b8; font-weight: 700;">تطبيق إدارة</span>
        <h1 class="header-title">{db['settings']['appName']}</h1>
        <div class="date-badge">{datetime.now().strftime("%A %d %B")}</div>
    </div>
    """, unsafe_allow_html=True)

    # حساب الأرقام
    total_coll = sum(c['amount'] for c in db['collections'])
    total_exp = sum(t['amount'] for t in db['transactions'] if t['type'] == 'expense' and t['category'] != 'treasury')
    net = total_coll - total_exp

    # بطاقة التوازن (Compact)
    st.markdown(f"""
    <div class="balance-card">
        <div class="sub-metrics">
            <div class="sub-metric-item">
                <div class="sub-metric-label">إجمالي التحصيلات</div>
                <div class="sub-metric-value">{total_coll:,.0f} ج.م</div>
            </div>
            <div class="sub-metric-item">
                <div class="sub-metric-label">إجمالي المصروفات</div>
                <div class="sub-metric-value">{total_exp:,.0f} ج.م</div>
            </div>
        </div>
        <div class="balance-label">صافي التحصيل المتاح</div>
        <div class="balance-value">{net:,.0f} ج.م</div>
    </div>
    """, unsafe_allow_html=True)

    # شبكة الأيقونات (3 أعمدة منظمة)
    # الصف الأول
    c1, c2, c3 = st.columns(3)
    with c1:
        if st.button("👥", key="nav_res"): st.session_state.page = "residents"; st.rerun()
        st.markdown('<span class="icon-label">السكان</span>', unsafe_allow_html=True)
    with c2:
        if st.button("💵", key="nav_coll"): st.session_state.page = "collection"; st.rerun()
        st.markdown('<span class="icon-label">التحصيل</span>', unsafe_allow_html=True)
    with c3:
        if st.button("🚨", key="nav_debt"): st.session_state.page = "alerts"; st.rerun()
        st.markdown('<span class="icon-label">المتأخرين</span>', unsafe_allow_html=True)

    # الصف الثاني
    c4, c5, c6 = st.columns(3)
    with c4:
        if st.button("🔍", key="nav_hist"): st.session_state.page = "history"; st.rerun()
        st.markdown('<span class="icon-label">سجل سداد</span>', unsafe_allow_html=True)
    with c5:
        if st.button("📉", key="nav_exp"): st.session_state.page = "expenses"; st.rerun()
        st.markdown('<span class="icon-label">المصروفات</span>', unsafe_allow_html=True)
    with c6:
        if st.button("🏦", key="nav_trea"): st.session_state.page = "treasury"; st.rerun()
        st.markdown('<span class="icon-label">الخزينة</span>', unsafe_allow_html=True)

    # الصف الثالث
    c7, c8, c9 = st.columns(3)
    with c7:
        if st.button("📊", key="nav_rep"): st.session_state.page = "reports"; st.rerun()
        st.markdown('<span class="icon-label">التقارير</span>', unsafe_allow_html=True)
    with c8:
        if st.button("⚙️", key="nav_set"): st.session_state.page = "settings"; st.rerun()
        st.markdown('<span class="icon-label">الإعدادات</span>', unsafe_allow_html=True)
    with c9:
        pass

# --- صفحات التطبيق الفرعية ---

def back_home():
    if st.button("🔙 العودة للرئيسية"):
        st.session_state.page = "main"
        st.rerun()

if st.session_state.page == "main":
    main_hub()

elif st.session_state.page == "residents":
    st.markdown("### **إدارة السكان**")
    back_home()
    with st.form("res_add"):
        name = st.text_input("الاسم بالكامل")
        floor = st.text_input("رقم الدور")
        flat = st.text_input("رقم الشقة")
        if st.form_submit_button("حفظ"):
            db['residents'].append({"id": len(db['residents'])+1, "name": name, "floorNumber": floor, "flatNumber": flat, "subscriptionValue": 150})
            save_data(db)
            st.success("تم الحفظ")
    if db['residents']:
        st.dataframe(pd.DataFrame(db['residents'])[['name', 'flatNumber']], use_container_width=True)

elif st.session_state.page == "collection":
    st.markdown("### **تسجيل تحصيل**")
    back_home()
    if not db['residents']: st.warning("أضف سكان أولاً")
    else:
        res_map = {r['id']: r['name'] for r in db['residents']}
        rid = st.selectbox("اختر الساكن", options=list(res_map.keys()), format_func=lambda x: res_map[x])
        m = st.selectbox("الشهر", range(1, 13), index=datetime.now().month-1)
        if st.button("تأكيد التحصيل"):
            db['collections'].append({"id": len(db['collections'])+1, "residentId": rid, "month": m, "year": 2024, "amount": 150, "date": str(datetime.now().date())})
            save_data(db)
            st.success("تم التسجيل ✅")

elif st.session_state.page == "reports":
    st.markdown("### **التقارير المالية**")
    back_home()
    all_t = sorted(db['transactions'], key=lambda x: x['date'], reverse=True)
    if all_t:
        st.table(pd.DataFrame(all_t)[['date', 'description', 'amount']])
    else:
        st.write("لا توجد بيانات حالياً")
