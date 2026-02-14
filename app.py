import streamlit as st
import pandas as pd
import json
import os
from datetime import datetime

# --- إعدادات الصفحة ---
st.set_page_config(
    page_title="مدير البرج الاحترافي",
    page_icon="🏢",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- دعم اللغة العربية والتنسيق (CSS) ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
    
    html, body, [class*="css"], .stMarkdown, .stText, .stButton {
        font-family: 'Cairo', sans-serif !important;
        direction: rtl !important;
        text-align: right !important;
    }
    
    .stApp { background-color: #f8fafc; }
    
    /* بطاقات الملخص المالي */
    .metric-card {
        background: white;
        padding: 25px;
        border-radius: 20px;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        border: 1px solid #e2e8f0;
        text-align: center;
        margin-bottom: 15px;
    }
    .income-text { color: #16a34a; font-weight: 900; font-size: 2em; }
    .expense-text { color: #dc2626; font-weight: 900; font-size: 2em; }
    .balance-text { color: #1d4ed8; font-weight: 900; font-size: 2.2em; }
    
    /* شارة الإجمالي المحصل */
    .total-badge {
        background-color: #f0fdf4;
        color: #166534;
        padding: 12px 25px;
        border-radius: 15px;
        border: 1px solid #bbf7d0;
        font-weight: 900;
        font-size: 1.3em;
        display: inline-block;
        margin: 15px 0;
    }

    /* القائمة الجانبية */
    [data-testid="stSidebar"] {
        background-color: #ffffff;
        border-left: 1px solid #e2e8f0;
    }

    /* تنسيق الجداول لتسهيل القراءة */
    .stTable {
        background: white;
        border-radius: 15px;
        overflow: hidden;
    }
    </style>
    """, unsafe_allow_html=True)

# --- إدارة البيانات (Persistence) ---
DB_FILE = "tower_data.json"

def load_data():
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            pass
    return {
        "residents": [],
        "collections": [],
        "transactions": [],
        "categories": ["صيانة مصاعد", "نظافة", "كهرباء خدمات", "حراسة"],
        "settings": {
            "appName": "برج السعادة السكني",
            "defaultSubscription": 150,
            "adminPassword": "123"
        }
    }

def save_data(data):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

if 'db' not in st.session_state:
    st.session_state.db = load_data()

db = st.session_state.db

# --- دوال الطباعة مع تحسين الألوان وإضافة عمود م ---
def export_html(title, headers, rows, report_type="standard", footer=""):
    report_date = datetime.now().strftime("%Y-%m-%d %H:%M")
    html = f"""
    <div dir="rtl" style="font-family: 'Cairo', sans-serif; padding: 30px; border: 2px solid #1e40af; border-radius: 15px; background: #fff; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
        <h1 style="text-align:center; color: #1e40af; border-bottom: 3px double #1e40af; padding-bottom: 10px;">{db['settings']['appName']}</h1>
        <h2 style="text-align:center; color: #444;">{title}</h2>
        <p style="text-align:left; font-size: 12px; color: #64748b;">تاريخ التقرير: {report_date}</p>
        <table border="1" style="width:100%; border-collapse:collapse; text-align:right; margin-top:20px; border-color: #e2e8f0;">
            <thead style="background-color:#1e40af; color: white;">
                <tr>{"".join([f"<th style='padding:12px; border: 1px solid #e2e8f0;'>{h}</th>" for h in headers])}</tr>
            </thead>
            <tbody style="color: #334155;">
    """
    
    for i, row in enumerate(rows):
        bg_color = '#f8fafc' if i % 2 == 0 else '#fff'
        html += f"<tr style='background-color: {bg_color}'>"
        for cell_idx, cell in enumerate(row):
            style = "padding:10px; border: 1px solid #e2e8f0; font-weight: bold;"
            cell_str = str(cell)
            
            # لون التاريخ أسود في عمود التاريخ (الفهرس 1 في التقارير المعيارية)
            if cell_idx == 1 and report_type != "residents_status":
                style += " color: #000000 !important; font-weight: 900;"

            # تطبيق منطق الألوان بناءً على المحتوى
            if report_type == "residents_status" and cell_idx == 3: # عمود "الحالة"
                if "مسدد" in cell_str and "غير" not in cell_str:
                    style += " color: #16a34a !important;"
                elif "لم يسدد" in cell_str or "غير مسدد" in cell_str:
                    style += " color: #dc2626 !important;"
            elif report_type != "residents_status" and cell_idx > 1:
                if "+" in cell_str:
                    style += " color: #16a34a !important;"
                elif "-" in cell_str and "---" not in cell_str:
                    style += " color: #dc2626 !important;"
            
            html += f"<td style='{style}'>{cell}</td>"
        html += "</tr>"

    html += f"""
            </tbody>
        </table>
        <div style="margin-top:30px; padding: 15px; background: #f1f5f9; border-radius: 8px; border: 1px solid #cbd5e1; font-weight: 900;">
            {footer}
        </div>
        <div style="margin-top: 20px; font-size: 11px; text-align: center; color: #94a3b8;">نظام مدير البرج الذكي v5.0</div>
    </div>
    """
    return html

# --- القائمة الجانبية ---
with st.sidebar:
    st.markdown("<h1 style='text-align:center;'>🏢</h1>", unsafe_allow_html=True)
    st.markdown(f"<h3 style='text-align:center;'>{db['settings']['appName']}</h3>", unsafe_allow_html=True)
    st.divider()
    
    menu = st.radio(
        "القائمة الرئيسية",
        ["🏠 لوحة التحكم", "👥 إدارة السكان", "💰 تسجيل تحصيل", "⚠️ المتأخرين", "📜 سجل الساكن", "💳 المصروفات", "🔐 الخزينة اليدوية", "📊 التقارير والطباعة", "🛠️ الإعدادات"]
    )
    st.divider()
    st.caption("نظام إدارة الأبراج v5.0")

# --- الصفحات ---

if "لوحة التحكم" in menu:
    st.header("📊 ملخص الحالة المالية")
    
    total_col = sum(c['amount'] for c in db['collections'])
    total_exp = sum(t['amount'] for t in db['transactions'] if t['type'] == 'expense' and t['category'] != 'treasury')
    net_bal = total_col - total_exp
    
    c1, c2, c3 = st.columns(3)
    with c1:
        st.markdown(f'<div class="metric-card"><p>إجمالي التحصيلات</p><div class="income-text">{total_col:,.0f} جم</div></div>', unsafe_allow_html=True)
    with c2:
        st.markdown(f'<div class="metric-card"><p>إجمالي المصروفات</p><div class="expense-text">{total_exp:,.0f} جم</div></div>', unsafe_allow_html=True)
    with c3:
        st.markdown(f'<div class="metric-card"><p>الرصيد الصافي</p><div class="balance-text">{net_bal:,.0f} جم</div></div>', unsafe_allow_html=True)
    
    st.divider()
    st.subheader("آخر العمليات المالية")
    if db['transactions'] or db['collections']:
        # ترتيب العمليات من الأحدث للأقدم للمعاينة في لوحة التحكم
        recent_trans = sorted(db['transactions'], key=lambda x: x['date'], reverse=True)[:5]
        if recent_trans:
            st.table(pd.DataFrame(recent_trans)[['date', 'description', 'amount', 'type']])
        else:
            st.info("لا توجد حركات حديثة")
    else:
        st.info("ابدأ بإضافة بيانات السكان أو التحصيلات")

elif "إدارة السكان" in menu:
    st.header("👥 إدارة سكان البرج")
    
    t1, t2 = st.tabs(["إضافة ساكن", "قائمة السكان"])
    
    with t1:
        with st.form("add_resident"):
            name = st.text_input("اسم الساكن بالكامل")
            c1, c2 = st.columns(2)
            floor = c1.text_input("رقم الدور")
            flat = c2.text_input("رقم الشقة")
            mobile = st.text_input("رقم الموبايل", value="+20")
            sub = st.number_input("قيمة الاشتراك الشهري", value=db['settings']['defaultSubscription'])
            if st.form_submit_button("حفظ بيانات الساكن"):
                if name and floor and flat:
                    new_id = max([r['id'] for r in db['residents']] + [0]) + 1
                    db['residents'].append({
                        "id": new_id, "name": name, "floorNumber": floor,
                        "flatNumber": flat, "mobile": mobile, "subscriptionValue": sub
                    })
                    save_data(db)
                    st.success(f"تمت إضافة {name} بنجاح!")
                    st.rerun()

    with t2:
        if db['residents']:
            df_res = pd.DataFrame(db['residents']).sort_values(by='name')
            st.dataframe(df_res[["name", "floorNumber", "flatNumber", "mobile", "subscriptionValue"]], use_container_width=True)
        else:
            st.warning("لا يوجد سكان مسجلون")

elif "تسجيل تحصيل" in menu:
    st.header("💰 تسجيل تحصيل اشتراك")
    if not db['residents']:
        st.error("يرجى إضافة سكان أولاً")
    else:
        res_map = {r['id']: f"{r['name']} (شقة {r['flatNumber']})" for r in db['residents']}
        rid = st.selectbox("اختر الساكن", options=list(res_map.keys()), format_func=lambda x: res_map[x])
        
        c1, c2 = st.columns(2)
        m = c1.selectbox("الشهر", range(1, 13), index=datetime.now().month-1)
        y = c2.selectbox("السنة", [2024, 2025, 2026], index=0)
        
        selected_res = next(r for r in db['residents'] if r['id'] == rid)
        amt = st.number_input("المبلغ المحصل", value=selected_res['subscriptionValue'])
        
        if st.button("تأكيد السداد ✅"):
            exists = any(c for c in db['collections'] if c['residentId'] == rid and c['month'] == m and c['year'] == y)
            if exists:
                st.warning("هذا الساكن مسدد بالفعل لهذا الشهر")
            else:
                db['collections'].append({
                    "id": len(db['collections'])+1, "residentId": rid,
                    "month": m, "year": y, "amount": amt, "date": str(datetime.now().date())
                })
                save_data(db)
                st.success(f"تم تسجيل سداد {selected_res['name']} لشهر {m}")

elif "المتأخرين" in menu:
    st.header("⚠️ قائمة المتأخرين عن السداد")
    c1, c2 = st.columns(2)
    m = c1.selectbox("عن شهر", range(1, 13), index=datetime.now().month-1)
    y = c2.selectbox("سنة", [2024, 2025, 2026], index=0)
    
    paid_ids = [c['residentId'] for c in db['collections'] if c['month'] == m and c['year'] == y]
    debtors = [r for r in db['residents'] if r['id'] not in paid_ids]
    
    if debtors:
        st.error(f"يوجد {len(debtors)} ساكن لم يسددوا لشهر {m}/{y}")
        st.table(pd.DataFrame(debtors)[['name', 'floorNumber', 'flatNumber', 'mobile', 'subscriptionValue']])
    else:
        st.success("جميع السكان مسددون لهذا الشهر 🎉")

elif "سجل الساكن" in menu:
    st.header("📜 السجل التاريخي لسداد الساكن")
    if db['residents']:
        res_map = {r['id']: r['name'] for r in db['residents']}
        rid = st.selectbox("اختر الساكن للبحث", options=list(res_map.keys()), format_func=lambda x: res_map[x])
        ry = st.selectbox("السنة", [2024, 2025, 2026])
        
        history = [c for c in db['collections'] if c['residentId'] == rid and c['year'] == ry]
        # ترتيب تاريخ السداد الشهري
        history.sort(key=lambda x: x['month'], reverse=True)
        
        paid_months = {c['month']: c['amount'] for c in history}
        
        data = []
        for month in range(1, 13):
            data.append({
                "الشهر": month,
                "الحالة": "✅ مسدد" if month in paid_months else "🛑 لم يسدد",
                "المبلغ": f"{paid_months[month]} جم" if month in paid_months else "-"
            })
        st.table(pd.DataFrame(data))
        
        st.divider()
        st.subheader("تعديل مبلغ مسدد سابقاً")
        with st.form("edit_history_form"):
            e_month = st.selectbox("اختر الشهر المراد تعديله", range(1, 13))
            existing_pay = next((c for c in db['collections'] if c['residentId'] == rid and c['month'] == e_month and c['year'] == ry), None)
            e_amount = st.number_input("المبلغ الجديد", value=float(existing_pay['amount']) if existing_pay else 0.0)
            
            if st.form_submit_button("تحديث السجل المالي"):
                if existing_pay:
                    for c in db['collections']:
                        if c['residentId'] == rid and c['month'] == e_month and c['year'] == ry:
                            c['amount'] = e_amount
                            break
                    save_data(db)
                    st.success(f"تم تحديث مبلغ شهر {e_month} بنجاح ✅")
                    st.rerun()
                else:
                    st.error("لا يوجد سداد مسجل لهذا الشهر لتعديله")
    else:
        st.error("لا يوجد سكان")

elif "المصروفات" in menu:
    st.header("💳 تسجيل مصروفات البرج")
    with st.form("exp_form"):
        cat = st.selectbox("بند المصروف", db['categories'])
        desc = st.text_input("البيان / الوصف")
        amt = st.number_input("القيمة", min_value=0.0)
        dt = st.date_input("تاريخ الصرف")
        if st.form_submit_button("تسجيل المصروف"):
            if desc and amt > 0:
                db['transactions'].append({
                    "id": len(db['transactions'])+1, "type": "expense",
                    "category": cat, "description": desc, "amount": amt, "date": str(dt)
                })
                save_data(db)
                st.success("تم تسجيل المصروف")
                st.rerun()

elif "الخزينة اليدوية" in menu:
    st.header("🏦 إدارة عمليات الخزينة")
    with st.form("treasury_form"):
        t_type = st.radio("نوع العملية", ["income", "expense"], format_func=lambda x: "إيداع (إيراد)" if x=="income" else "سحب (مصروف)")
        desc = st.text_input("البيان")
        amt = st.number_input("المبلغ", min_value=0.0)
        dt = st.date_input("التاريخ")
        if st.form_submit_button("تسجيل في الخزينة"):
            db['transactions'].append({
                "id": len(db['transactions'])+1, "type": t_type,
                "category": "treasury", "description": desc, "amount": amt, "date": str(dt)
            })
            save_data(db)
            st.success("تم التحديث")

elif "التقارير والطباعة" in menu:
    st.header("📊 مركز التقارير والطباعة")
    
    t_rep1, t_rep2 = st.tabs(["سداد السكان", "المصروفات والخزينة"])
    
    with t_rep1:
        c1, c2, c3 = st.columns([1,1,2])
        rm = c1.selectbox("عن شهر", range(1, 13), key="rm", index=datetime.now().month-1)
        ry = c2.selectbox("عن سنة", [2024, 2025, 2026], key="ry")
        
        m_total = sum(c['amount'] for c in db['collections'] if c['month'] == rm and c['year'] == ry)
        c3.markdown(f'<div class="total-badge">إجمالي المحصل للشهر: {m_total:,.0f} جم</div>', unsafe_allow_html=True)
        
        rep_data = []
        for idx, r in enumerate(db['residents']):
            p = next((c for c in db['collections'] if c['residentId'] == r['id'] and c['month'] == rm and c['year'] == ry), None)
            rep_data.append({
                "م": idx + 1, "الاسم": r['name'], "الوحدة": f"دور {r['floorNumber']} شقة {r['flatNumber']}",
                "الحالة": "✅ مسدد" if p else "❌ لم يسدد", "المبلغ": p['amount'] if p else 0
            })
        df_rep = pd.DataFrame(rep_data)
        st.table(df_rep)
        
        if st.button("تجهيز كشف الطباعة (HTML)"):
            html = export_html(f"كشف سداد شهر {rm}/{ry}", ["م", "الاسم", "الوحدة", "الحالة", "المبلغ"], df_rep.values.tolist(), "residents_status", f"إجمالي الشهر: {m_total:,.0f} جم")
            st.download_button("تحميل ملف الطباعة", html, file_name=f"residents_status_{rm}_{ry}.html", mime="text/html")

    with t_rep2:
        st.subheader("تقرير بالفترة الزمنية (مرتب من الأحدث للأقدم)")
        col1, col2 = st.columns(2)
        sd = col1.date_input("من تاريخ", value=datetime.now().date().replace(day=1))
        ed = col2.date_input("إلى تاريخ")
        
        # جلب البيانات وترتيبها من الأحدث للأقدم
        filtered = [t for t in db['transactions'] if str(sd) <= t['date'] <= str(ed)]
        filtered.sort(key=lambda x: x['date'], reverse=True)
        
        if filtered:
            df_f = pd.DataFrame(filtered)
            df_f['م'] = range(1, len(df_f) + 1)
            # عرض التاريخ باللون الأسود في معاينة Streamlit
            st.table(df_f[['م', 'date', 'category', 'description', 'type', 'amount']])
            
            inc_total = df_f[df_f['type'] == 'income']['amount'].sum()
            exp_total = df_f[df_f['type'] == 'expense']['amount'].sum()
            net = inc_total - exp_total
            
            st.markdown(f"**إجمالي الحركة:** {net:,.0f} جم")
            
            if st.button("تجهيز تقرير الخزينة الملون (التاريخ بالأسود)"):
                headers = ["م", "التاريخ", "البيان", "إيراد (+)", "مصروف (-)"]
                rows = []
                for i, row in df_f.iterrows():
                    rows.append([
                        i + 1,
                        row['date'],
                        row['description'],
                        f"+{row['amount']:,.0f} جم" if row['type'] == 'income' else "---",
                        f"-{row['amount']:,.0f} جم" if row['type'] == 'expense' else "---"
                    ])
                rows.append(["---", "---", "إجمالي الأعمدة", f"+{inc_total:,.0f} جم", f"-{exp_total:,.0f} جم"])
                footer = f"إجمالي الإيداعات: +{inc_total:,.0f} جم | إجمالي المصروفات: -{exp_total:,.0f} جم <br> صافي الرصيد للفترة: {net:,.0f} جم"
                # سيتم استخدام "standard" في export_html الذي يطبق اللون الأسود على عمود التاريخ
                html = export_html(f"تقرير الخزينة من {sd} إلى {ed}", headers, rows, "standard", footer)
                st.download_button("تحميل التقرير الملون", html, file_name=f"treasury_report.html", mime="text/html")
        else:
            st.info("لا توجد بيانات للفترة المختارة")

elif "الإعدادات" in menu:
    st.header("⚙️ إعدادات النظام")
    pw = st.text_input("كلمة مرور الإدارة", type="password")
    if pw == db['settings']['adminPassword']:
        st.success("تم التحقق من الصلاحيات ✅")
        
        t_set1, t_set2 = st.tabs(["بيانات البرج", "النسخ الاحتياطي الشامل"])
        
        with t_set1:
            new_app_name = st.text_input("اسم البرج المعتمد", value=db['settings']['appName'])
            new_def_sub = st.number_input("الاشتراك الشهري الافتراضي", value=db['settings']['defaultSubscription'])
            new_password = st.text_input("تغيير كلمة مرور الإدارة", value=db['settings']['adminPassword'], type="password")
            
            if st.button("حفظ التغييرات"):
                db['settings']['appName'] = new_app_name
                db['settings']['defaultSubscription'] = new_def_sub
                db['settings']['adminPassword'] = new_password
                save_data(db)
                st.success("تم حفظ إعدادات النظام")
                st.rerun()

        with t_set2:
            st.subheader("إدارة البيانات والنسخ الاحتياطي")
            st.info("النسخة الاحتياطية تشمل كافة بيانات النظام (سكان، تحصيل، مصروفات، وخزينة).")
            
            # تصدير النسخة
            timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M")
            backup_data = {
                "residents": db['residents'],
                "collections": db['collections'],
                "transactions": db['transactions'],
                "settings": db['settings']
            }
            json_str = json.dumps(backup_data, ensure_ascii=False, indent=4)
            st.download_button(
                label="توليد نسخة احتياطية شاملة (JSON) وتحميلها",
                data=json_str,
                file_name=f"tower_data_comprehensive_backup_{timestamp}.json",
                mime="application/json",
            )

            st.divider()
            # استرجاع النسخة
            st.warning("تحذير: استرجاع نسخة احتياطية سيمسح البيانات الحالية تماماً ويعوضها ببيانات الملف!")
            uploaded_file = st.file_uploader("اختر ملف النسخة الاحتياطية الشاملة (JSON)", type=["json"])
            if uploaded_file is not None:
                if st.button("تأكيد استرجاع كافة البيانات الآن"):
                    try:
                        restore_data = json.load(uploaded_file)
                        if all(k in restore_data for k in ["residents", "collections"]):
                            db['residents'] = restore_data['residents']
                            db['collections'] = restore_data['collections']
                            if 'transactions' in restore_data:
                                db['transactions'] = restore_data['transactions']
                            if 'settings' in restore_data:
                                db['settings'] = restore_data['settings']
                            save_data(db)
                            st.success("تم استرجاع كافة البيانات بنجاح ✅")
                            st.rerun()
                        else:
                            st.error("الملف المرفوع غير صالح أو لا يحتوي على البيانات الأساسية ❌")
                    except Exception as e:
                        st.error(f"حدث خطأ أثناء الاسترجاع: {e} ❌")
    else:
        st.info("أدخل كلمة المرور للوصول للإعدادات")
