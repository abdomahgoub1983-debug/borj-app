import streamlit as st
import pandas as pd
import json
import os
from datetime import datetime

# --- إعدادات الصفحة الفنية ---
st.set_page_config(
    page_title="مدير البرج 4 | الإدارة الاحترافية",
    page_icon="🏢",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- محرك التنسيق البصري (Custom CSS) ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
    
    /* الأساسيات والخطوط */
    html, body, [class*="css"], .stMarkdown, .stText, .stButton, .stSelectbox {
        font-family: 'Cairo', sans-serif !important;
        direction: rtl !important;
        text-align: right !important;
    }
    
    .stApp {
        background-color: #ffffff;
    }

    /* إخفاء عناصر ستريم ليت الافتراضية للتركيز على التصميم */
    header {visibility: hidden;}
    footer {visibility: hidden;}
    #MainMenu {visibility: hidden;}

    /* الحاوية الرئيسية للهاتف */
    .app-container {
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
        background: white;
        min-height: 100vh;
    }

    /* بطاقة التوازن المتدرجة (مثل الصورة تماماً) */
    .balance-card {
        background: linear-gradient(135deg, #3b82f6 0%, #4338ca 100%);
        border-radius: 30px;
        padding: 30px;
        color: white;
        text-align: center;
        box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.3);
        margin-bottom: 40px;
        position: relative;
        overflow: hidden;
    }
    .balance-card::after {
        content: '🏢';
        position: absolute;
        bottom: -20px;
        left: -20px;
        font-size: 100px;
        opacity: 0.1;
    }
    .balance-label { font-size: 14px; font-weight: 700; opacity: 0.9; margin-bottom: 5px; }
    .balance-value { font-size: 32px; font-weight: 900; letter-spacing: -1px; }
    
    .sub-metrics {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(255,255,255,0.2);
        padding-bottom: 15px;
    }
    .sub-metric-item { text-align: center; }
    .sub-metric-label { font-size: 10px; font-weight: 700; opacity: 0.8; }
    .sub-metric-value { font-size: 18px; font-weight: 800; }

    /* شبكة الأيقونات الدائرية الملونة */
    .icon-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        text-align: center;
        margin-top: 20px;
    }
    
    /* تنسيق أزرار ستريم ليت لتصبح دائرية وملونة */
    .stButton > button {
        border-radius: 50% !important;
        width: 80px !important;
        height: 80px !important;
        padding: 0 !important;
        font-size: 24px !important;
        border: none !important;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1) !important;
        transition: transform 0.2s !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 0 auto !important;
    }
    .stButton > button:hover {
        transform: scale(1.1) !important;
    }
    
    /* ألوان الأيقونات المخصصة */
    div[data-testid="stHorizontalBlock"] > div:nth-child(1) button { background-color: #3b82f6 !important; color: white !important; } /* سكان - أزرق */
    div[data-testid="stHorizontalBlock"] > div:nth-child(2) button { background-color: #10b981 !important; color: white !important; } /* تحصيل - أخضر */
    div[data-testid="stHorizontalBlock"] > div:nth-child(3) button { background-color: #ef4444 !important; color: white !important; } /* متأخرين - أحمر */

    /* تسميات الأيقونات */
    .icon-label {
        font-size: 12px;
        font-weight: 800;
        color: #1e293b;
        margin-top: 8px;
        display: block;
    }

    /* تعديل الجداول */
    .stTable {
        border-radius: 15px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
    }
    
    /* لون التاريخ أسود صريح */
    .black-date {
        color: #000000 !important;
        font-weight: 900 !important;
    }

    /* شارة التاريخ في الهيدر */
    .date-badge {
        background-color: #dbeafe;
        color: #1e40af;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 11px;
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

# --- دوال المعالجة ---
def navigate_to(page_name):
    st.session_state.page = page_name
    st.rerun()

# --- واجهة المستخدم الرئيسية (The Hub) ---
def main_hub():
    # الهيدر
    col_h1, col_h2 = st.columns([2, 1])
    with col_h1:
        st.caption("تطبيق إدارة")
        st.markdown(f"### **{db['settings']['appName']}**")
    with col_h2:
        today = datetime.now().strftime("%A %d فبراير %Y")
        st.markdown(f'<div style="text-align:left"><span class="date-badge">{today}</span></div>', unsafe_allow_html=True)

    # حساب الأرقام
    total_coll = sum(c['amount'] for c in db['collections'])
    total_exp = sum(t['amount'] for t in db['transactions'] if t['type'] == 'expense' and t['category'] != 'treasury')
    net = total_coll - total_exp

    # بطاقة التوازن الكبيرة (Premium Card)
    st.markdown(f"""
    <div class="balance-card">
        <div class="sub-metrics">
            <div class="sub-metric-item">
                <div class="sub-metric-label">إجمالي التحصيلات</div>
                <div class="sub-metric-value">{total_coll:,.0f} جم</div>
            </div>
            <div class="sub-metric-item">
                <div class="sub-metric-label">إجمالي المصروفات</div>
                <div class="sub-metric-value">{total_exp:,.0f} جم</div>
            </div>
        </div>
        <div class="balance-label">↗️ صافي التحصيل (بدون الخزينة)</div>
        <div class="balance-value">{net:,.0f} جم</div>
    </div>
    """, unsafe_allow_html=True)

    # شبكة الأيقونات (Row 1)
    c1, c2, c3 = st.columns(3)
    with c1:
        if st.button("👥", key="btn_res"): navigate_to("residents")
        st.markdown('<span class="icon-label">السكان</span>', unsafe_allow_html=True)
    with c2:
        if st.button("💵", key="btn_coll"): navigate_to("collection")
        st.markdown('<span class="icon-label">التحصيل</span>', unsafe_allow_html=True)
    with c3:
        if st.button("🛡️", key="btn_alert"): navigate_to("alerts")
        st.markdown('<span class="icon-label">المتأخرين</span>', unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # شبكة الأيقونات (Row 2)
    c4, c5, c6 = st.columns(3)
    with c4:
        st.markdown("""<style>div[key="btn_hist"] button { background-color: #06b6d4 !important; }</style>""", unsafe_allow_html=True)
        if st.button("🔍", key="btn_hist"): navigate_to("history")
        st.markdown('<span class="icon-label">سجل ساكن</span>', unsafe_allow_html=True)
    with c5:
        st.markdown("""<style>div[key="btn_exp"] button { background-color: #ec4899 !important; }</style>""", unsafe_allow_html=True)
        if st.button("📉", key="btn_exp"): navigate_to("expenses")
        st.markdown('<span class="icon-label">المصروفات</span>', unsafe_allow_html=True)
    with c6:
        st.markdown("""<style>div[key="btn_trea"] button { background-color: #f59e0b !important; }</style>""", unsafe_allow_html=True)
        if st.button("🏦", key="btn_trea"): navigate_to("treasury")
        st.markdown('<span class="icon-label">الخزينة</span>', unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # شبكة الأيقونات (Row 3)
    c7, c8, c9 = st.columns(3)
    with c7:
        st.markdown("""<style>div[key="btn_rep"] button { background-color: #8b5cf6 !important; }</style>""", unsafe_allow_html=True)
        if st.button("📊", key="btn_rep"): navigate_to("reports")
        st.markdown('<span class="icon-label">التقارير</span>', unsafe_allow_html=True)
    with c8:
        st.markdown("""<style>div[key="btn_set"] button { background-color: #64748b !important; }</style>""", unsafe_allow_html=True)
        if st.button("⚙️", key="btn_set"): navigate_to("settings")
        st.markdown('<span class="icon-label">الإعدادات</span>', unsafe_allow_html=True)

# --- صفحات التطبيق ---

def show_back_button():
    if st.button("🔙 رجوع للقائمة الرئيسية", key="back_btn"):
        navigate_to("main")
    st.divider()

if st.session_state.page == "main":
    main_hub()

elif st.session_state.page == "residents":
    st.header("👥 إدارة السكان")
    show_back_button()
    with st.expander("➕ إضافة ساكن جديد"):
        with st.form("res_form"):
            name = st.text_input("الاسم بالكامل")
            c1, c2 = st.columns(2)
            floor = c1.text_input("رقم الدور")
            flat = c2.text_input("رقم الشقة")
            mobile = st.text_input("الموبايل", value="+20")
            sub = st.number_input("قيمة الاشتراك", value=db['settings']['defaultSubscription'])
            if st.form_submit_button("حفظ"):
                db['residents'].append({"id": len(db['residents'])+1, "name": name, "floorNumber": floor, "flatNumber": flat, "mobile": mobile, "subscriptionValue": sub})
                save_data(db)
                st.success("تم الحفظ")
    
    if db['residents']:
        df = pd.DataFrame(db['residents'])
        st.table(df[['name', 'floorNumber', 'flatNumber', 'mobile', 'subscriptionValue']])

elif st.session_state.page == "collection":
    st.header("💵 تحصيل الاشتراكات")
    show_back_button()
    if db['residents']:
        res_map = {r['id']: f"{r['name']} (شقة {r['flatNumber']})" for r in db['residents']}
        rid = st.selectbox("اختر الساكن", options=list(res_map.keys()), format_func=lambda x: res_map[x])
        c1, c2 = st.columns(2)
        m = c1.selectbox("الشهر", range(1,13), index=datetime.now().month-1)
        y = c2.selectbox("السنة", [2024, 2025, 2026])
        amt = st.number_input("المبلغ", value=float(next(r for r in db['residents'] if r['id']==rid)['subscriptionValue']))
        if st.button("تسجيل السداد"):
            db['collections'].append({"id": len(db['collections'])+1, "residentId": rid, "month": m, "year": y, "amount": amt, "date": str(datetime.now().date())})
            save_data(db)
            st.success("تم التسجيل")

elif st.session_state.page == "expenses":
    st.header("📉 المصروفات العامة")
    show_back_button()
    with st.form("exp_form"):
        cat = st.selectbox("البند", db['categories'])
        desc = st.text_input("البيان")
        amt = st.number_input("المبلغ", min_value=0.0)
        dt = st.date_input("التاريخ")
        if st.form_submit_button("تسجيل المصروف"):
            db['transactions'].append({"id": len(db['transactions'])+1, "type": "expense", "category": cat, "description": desc, "amount": amt, "date": str(dt)})
            save_data(db)
            st.success("تم التسجيل")

elif st.session_state.page == "reports":
    st.header("📊 مركز التقارير")
    show_back_button()
    
    rep_type = st.radio("نوع التقرير", ["سداد السكان", "المصروفات والخزينة"], horizontal=True)
    
    if rep_type == "سداد السكان":
        c1, c2 = st.columns(2)
        rm = c1.selectbox("الشهر", range(1,13), index=datetime.now().month-1)
        ry = c2.selectbox("السنة", [2024, 2025, 2026])
        
        data = []
        for r in db['residents']:
            paid = next((c for c in db['collections'] if c['residentId']==r['id'] and c['month']==rm and c['year']==ry), None)
            data.append({
                "الاسم": r['name'],
                "الوحدة": f"شقة {r['flatNumber']}",
                "الحالة": "✅ مسدد" if paid else "❌ لم يسدد",
                "المبلغ": paid['amount'] if paid else 0
            })
        st.table(pd.DataFrame(data))

    else:
        st.subheader("سجل العمليات (مرتب من الأحدث للأقدم)")
        # ترتيب البيانات من الأحدث للأقدم
        all_trans = sorted(db['transactions'], key=lambda x: x['date'], reverse=True)
        if all_trans:
            df = pd.DataFrame(all_trans)
            # تنسيق عرض الجدول مع جعل التاريخ أسود
            st.markdown("""
                <style>
                table td:nth-child(2) { color: #000000 !important; font-weight: 900; }
                </style>
            """, unsafe_allow_html=True)
            st.table(df[['date', 'category', 'description', 'amount', 'type']])
        else:
            st.info("لا توجد بيانات")

elif st.session_state.page == "treasury":
    st.header("🏦 الخزينة اليدوية")
    show_back_button()
    with st.form("treas_form"):
        ttype = st.radio("نوع العملية", ["income", "expense"], format_func=lambda x: "إيداع" if x=="income" else "سحب")
        desc = st.text_input("البيان")
        amt = st.number_input("المبلغ")
        dt = st.date_input("التاريخ")
        if st.form_submit_button("تسجيل"):
            db['transactions'].append({"id": len(db['transactions'])+1, "type": ttype, "category": "treasury", "description": desc, "amount": amt, "date": str(dt)})
            save_data(db)
            st.success("تم الحفظ")

elif st.session_state.page == "settings":
    st.header("⚙️ الإعدادات")
    show_back_button()
    new_name = st.text_input("اسم البرج", value=db['settings']['appName'])
    new_sub = st.number_input("الاشتراك الافتراضي", value=db['settings']['defaultSubscription'])
    if st.button("حفظ الإعدادات"):
        db['settings']['appName'] = new_name
        db['settings']['defaultSubscription'] = new_sub
        save_data(db)
        st.success("تم الحفظ")
    
    st.divider()
    if st.button("📥 تحميل نسخة احتياطية (JSON)"):
        b_data = json.dumps(db, ensure_ascii=False, indent=4)
        st.download_button("تأكيد تحميل الملف", b_data, file_name="tower_backup.json", mime="application/json")
