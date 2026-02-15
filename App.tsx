import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Building, 
  HandCoins, 
  Settings as SettingsIcon, 
  BellRing, 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  Download, 
  MessageCircle, 
  PhoneCall,
  ChevronLeft,
  CreditCard,
  ArrowDownRight,
  Home, 
  Search, 
  Printer,
  Lock,
  UserSearch,
  ReceiptText,
  Mail,
  AlertTriangle,
  X,
  Landmark,
  PlusCircle,
  MinusCircle,
  TrendingUp,
  TrendingDown,
  Calculator,
  BarChart3,
  Users,
  FilePieChart,
  ChevronDown,
  CalendarDays,
  ShieldAlert,
  History,
  CheckCircle2,
  XCircle,
  Calendar,
  Contact2,
  ClipboardList,
  FileUser,
  WalletCards,
  CalendarRange,
  UserRound,
  Layers,
  ChevronRight,
  ArrowRight,
  Pencil,
  PieChart,
  FileBarChart,
  UserCheck,
  UserPlus,
  Save,
  Undo2,
  Banknote,
  MapPin,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Vault,
  FileStack,
  Check,
  Ban,
  Camera,
  Eye,
  ImageIcon,
  SlidersHorizontal,
  FileUp,
  FileSpreadsheet,
  Wrench,
  ShieldCheck,
  Share2,
  Bolt,
  Loader2,
  BookUser,
  RotateCcw
} from 'lucide-react';
import { Page, AppSettings, Resident, Collection, Transaction } from './types';

const STORAGE_KEYS = {
  SETTINGS: 'tower_settings_v4',
  RESIDENTS: 'tower_residents_v4',
  COLLECTIONS: 'tower_collections_v4',
  TRANSACTIONS: 'tower_transactions_v4',
  EXPENSE_CATEGORIES: 'tower_expense_cats_v4'
};

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center border border-slate-100">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 font-medium mb-8 leading-relaxed">{message}</p>
        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => { onConfirm(); onCancel(); }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-100 transition-all active:scale-95"
          >
            تأكيد المسح النهائي
          </button>
          <button 
            onClick={onCancel}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all"
          >
            إلغاء التراجع
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : { 
      appName: 'أبراج الإعلاميين - برج ٤', 
      appIcon: '🏢', 
      defaultSubscription: 150,
      adminPassword: '123',
      backupEmail: ''
    };
  });

  const [residents, setResidents] = useState<Resident[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESIDENTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [expenseCategories, setExpenseCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSE_CATEGORIES);
    return saved ? JSON.parse(saved) : ['صيانة مصاعد', 'نظافة', 'كهرباء خدمات', 'حراسة'];
  });

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents)); }, [residents]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections)); }, [collections]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EXPENSE_CATEGORIES, JSON.stringify(expenseCategories)); }, [expenseCategories]);

  const toEnglishDigits = (str: string | number) => {
    if (str === null || str === undefined) return "";
    return str.toString().replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
  };

  const triggerConfirm = (title: string, message: string, action: () => void) => {
    setModal({ isOpen: true, title, message, onConfirm: action });
  };

  const handleDeleteResident = (id: number) => {
    triggerConfirm(
      'مسح ساكن؟',
      'سيتم إزالة الساكن من القائمة نهائياً، مع الإبقاء على سجل مدفوعاته في التقارير التاريخية فقط.',
      () => setResidents(prev => prev.filter(r => r.id !== id))
    );
  };

  const handlePrint = () => { 
    window.print(); 
  };

  const MainHub = () => {
    const today = new Intl.DateTimeFormat('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());

    const navItems = [
      { page: Page.Residents, label: 'السكان', icon: Users, color: 'bg-blue-600', shadow: 'shadow-blue-100', showCount: true },
      { page: Page.Collection, label: 'التحصيل', icon: Banknote, color: 'bg-green-500', shadow: 'shadow-green-100' },
      { page: Page.Alerts, label: 'المتأخرين', icon: ShieldAlert, color: 'bg-red-500', shadow: 'shadow-red-100' },
      { page: Page.ResidentReport, label: 'سجل ساكن', icon: BookUser, color: 'bg-cyan-500', shadow: 'shadow-cyan-100' },
      { page: Page.Expenses, label: 'المصروفات', icon: WalletCards, color: 'bg-rose-500', shadow: 'shadow-rose-100' },
      { page: Page.Treasury, label: 'الخزينة', icon: Vault, color: 'bg-amber-500', shadow: 'shadow-amber-100' },
      { page: Page.Reports, label: 'التقارير', icon: FileBarChart, color: 'bg-indigo-500', shadow: 'shadow-indigo-100' },
      { page: Page.Settings, label: 'الإعدادات', icon: Bolt, color: 'bg-slate-600', shadow: 'shadow-slate-100' },
    ];

    const NavButton = ({ item }: { item: any }) => (
      <button
        key={item.page}
        onClick={() => {
          if (item.page === Page.Settings) setIsAuthorized(false);
          setCurrentPage(item.page);
        }}
        className="flex flex-col items-center group active:scale-90 transition-all flex-1 max-w-[100px]"
      >
        <div className="relative mb-3">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${item.color} ${item.shadow} shadow-xl flex items-center justify-center text-white transition-all group-hover:scale-110 group-hover:-translate-y-1`}>
            <item.icon size={30} sm:size={34} strokeWidth={2.5} />
          </div>
          {item.showCount && residents.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              {residents.length}
            </div>
          )}
        </div>
        <span className="font-black text-slate-800 text-[11px] sm:text-sm text-center leading-tight h-8 flex items-start justify-center">
          {item.label}
        </span>
      </button>
    );

    const collectionsSum = collections.reduce((acc, curr) => acc + curr.amount, 0);
    const expensesSum = transactions.filter(t => t.type === 'expense' && t.category !== 'treasury').reduce((acc, curr) => acc + curr.amount, 0);
    const netBalance = collectionsSum - expensesSum;

    return (
      <div className="flex flex-col space-y-6 animate-in fade-in duration-500 pt-6 sm:pt-10">
        <div className="flex justify-between items-end px-3 mb-2 print:hidden">
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">تطبيق إدارة</span>
            <h2 className="text-xl font-black text-slate-800 leading-none">{settings.appName}</h2>
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-4 py-1.5 rounded-full border border-blue-200">{today}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden print:bg-slate-50 print:text-slate-900 print:shadow-none print:border print:rounded-3xl">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-full space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 bg-white/10 backdrop-blur-md rounded-[1.8rem] p-4 border border-white/20 text-center shadow-inner print:bg-slate-100 print:border-slate-200">
                  <p className="text-[10px] font-bold opacity-80 mb-2">إجمالي التحصيلات</p>
                  <div className="text-xl font-black">{collectionsSum.toLocaleString()} <span className="text-xs opacity-60">جم</span></div>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur-md rounded-[1.8rem] p-4 border border-white/20 text-center shadow-inner print:bg-slate-100 print:border-slate-200">
                  <p className="text-[10px] font-bold opacity-80 mb-2">إجمالي المصروفات</p>
                  <div className="text-xl font-black">{expensesSum.toLocaleString()} <span className="text-xs opacity-60">جم</span></div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-[1.8rem] p-5 border border-white/30 text-center shadow-xl print:bg-blue-50 print:border-blue-200 print:text-blue-900">
                <p className="text-sm font-black uppercase mb-1 flex items-center justify-center gap-2">
                  <TrendingUp size={14} /> صافي التحصيل (بدون الخزينة)
                </p>
                <div className="text-3xl font-black tracking-tighter">
                  {netBalance.toLocaleString()} <span className="text-sm font-bold opacity-90">جم</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -left-12 -bottom-12 opacity-10 print:hidden">
            <Building size={160} />
          </div>
        </div>

        <div className="flex flex-col space-y-8 py-6 print:hidden">
          <div className="flex justify-around items-start gap-2">
            <NavButton item={navItems[0]} />
            <NavButton item={navItems[1]} />
            <NavButton item={navItems[2]} />
          </div>
          <div className="flex justify-around items-start gap-2">
            <NavButton item={navItems[3]} />
            <NavButton item={navItems[4]} />
            <NavButton item={navItems[5]} />
          </div>
          <div className="flex justify-center items-start gap-12 sm:gap-20">
            <NavButton item={navItems[6]} />
            <NavButton item={navItems[7]} />
          </div>
        </div>
      </div>
    );
  };

  const AdminLock = ({ children }: { children?: React.ReactNode }) => {
    if (isAuthorized) return <>{children}</>;
    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center animate-in zoom-in-95">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <Lock size={32} />
        </div>
        <h3 className="text-xl font-black mb-4">كلمة مرور الإدارة</h3>
        <p className="text-xs text-slate-400 font-bold mb-6 italic">يرجى إدخال كلمة المرور للوصول للإعدادات</p>
        <input 
          type="password" 
          value={passwordInput} 
          onChange={(e) => setPasswordInput(toEnglishDigits(e.target.value))}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center text-2xl font-black mb-6 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="***"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
               if (passwordInput === settings.adminPassword) {
                  setIsAuthorized(true);
                  setPasswordInput('');
               } else {
                  alert('كلمة المرور خاطئة');
               }
            }
          }}
        />
        <button 
          onClick={() => {
            if (passwordInput === settings.adminPassword) {
              setIsAuthorized(true);
              setPasswordInput('');
            } else {
              alert('كلمة المرور خاطئة');
            }
          }}
          className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-blue-700"
        >
          دخول
        </button>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden font-cairo text-slate-900">
      <style>{`
        @media print {
          html, body, #root, main, .flex-1, .overflow-y-auto, .h-screen {
            height: auto !important;
            overflow: visible !important;
            display: block !important;
            position: static !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          header, .print-hidden, button, select, input, .lucide, nav, .bg-slate-900\/60 {
            display: none !important;
          }
          .max-w-4xl, .max-w-3xl, .container {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 5mm !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-top: 10pt !important;
            direction: rtl !important;
          }
          th {
            background-color: #f1f5f9 !important;
            color: #0f172a !important;
            border: 1pt solid #cbd5e1 !important;
            padding: 8pt !important;
            font-size: 11pt !important;
            font-weight: 900 !important;
            text-align: right !important;
          }
          td {
            border: 1pt solid #e2e8f0 !important;
            padding: 8pt !important;
            font-size: 10pt !important;
            color: #334155 !important;
          }
          tr:nth-child(even) { background-color: #fafafa !important; }
          tr { page-break-inside: avoid !important; }
          .report-header {
            text-align: center !important;
            margin-bottom: 20pt !important;
            border-bottom: 2pt solid #0f172a !important;
            padding-bottom: 10pt !important;
          }
          .report-header h3 { font-size: 18pt !important; font-weight: 900 !important; }
          .date-cell { color: #000000 !important; font-weight: 900 !important; }
        }
      `}</style>

      <ConfirmationModal 
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal({...modal, isOpen: false})}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {currentPage !== Page.Dashboard && (
          <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b border-slate-200 print:hidden">
            <div className="flex items-center">
              <button 
                onClick={() => setCurrentPage(Page.Dashboard)}
                className="ml-4 p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex items-center space-x-reverse space-x-3">
                <span className="text-2xl">{settings.appIcon}</span>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                  {currentPage === Page.Residents ? "إدارة السكان" :
                    currentPage === Page.Collection ? "تحصيل اشتراكات" :
                    currentPage === Page.Alerts ? "تنبيه المتأخرين" :
                    currentPage === Page.Treasury ? "الخزينة" :
                    currentPage === Page.Expenses ? "المصروفات" :
                    currentPage === Page.Reports ? "مركز التقارير" :
                    currentPage === Page.ResidentReport ? "سجل الساكن" : "الإعدادات"}
                </h2>
              </div>
            </div>
            <div className="flex space-x-reverse space-x-2">
              <button onClick={handlePrint} className="p-2 text-slate-400 hover:text-slate-900"><Printer size={20} /></button>
              <button onClick={() => setCurrentPage(Page.Dashboard)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors">
                <Home size={22} />
              </button>
            </div>
          </header>
        )}

        <div className={`flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth ${currentPage === Page.Dashboard ? 'pt-6' : ''}`}>
          <div className="max-w-4xl mx-auto pb-8">
            {currentPage === Page.Dashboard && <MainHub />}
            {currentPage === Page.Residents && (
              <ResidentsPage 
                residents={residents} 
                setResidents={setResidents} 
                onDelete={handleDeleteResident} 
                settings={settings} 
                toEnglishDigits={toEnglishDigits} 
              />
            )}
            {currentPage === Page.Collection && <CollectionPage residents={residents} collections={collections} setCollections={setCollections} toEnglishDigits={toEnglishDigits} />}
            {currentPage === Page.Alerts && <AlertsPage residents={residents} collections={collections} toEnglishDigits={toEnglishDigits} />}
            {currentPage === Page.Treasury && <FinancialPage type="treasury" transactions={transactions} collections={collections} setTransactions={setTransactions} toEnglishDigits={toEnglishDigits} triggerConfirm={triggerConfirm} />}
            {currentPage === Page.Expenses && (
              <ExpensesPage 
                transactions={transactions} 
                setTransactions={setTransactions} 
                categories={expenseCategories} 
                setCategories={setExpenseCategories} 
                toEnglishDigits={toEnglishDigits} 
                triggerConfirm={triggerConfirm} 
              />
            )}
            {currentPage === Page.Reports && <ReportsHub residents={residents} collections={collections} transactions={transactions} categories={expenseCategories} settings={settings} />}
            {currentPage === Page.ResidentReport && <ResidentHistoryPage residents={residents} collections={collections} setCollections={setCollections} toEnglishDigits={toEnglishDigits} triggerConfirm={triggerConfirm} settings={settings} />}
            {currentPage === Page.Settings && <AdminLock><SettingsPage settings={settings} setSettings={setSettings} toEnglishDigits={toEnglishDigits} residents={residents} collections={collections} setResidents={setResidents} setCollections={setCollections} transactions={transactions} setTransactions={setTransactions} /></AdminLock>}
          </div>
        </div>
      </main>
    </div>
  );
};

const ResidentsPage = ({ residents, setResidents, onDelete, settings, toEnglishDigits }: any) => {
  const [formData, setFormData] = useState({ name: '', floorNumber: '', flatNumber: '', countryCode: '+20', phoneNumber: '', sub: settings.defaultSubscription });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (nameInputRef.current) nameInputRef.current.focus(); }, [editingId, residents.length]);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', floorNumber: '', flatNumber: '', countryCode: '+20', phoneNumber: '', sub: settings.defaultSubscription });
  };

  const handleImportContact = async () => {
    if (!('contacts' in navigator && 'ContactsManager' in window)) {
      alert('خاصية استيراد جهات الاتصال غير مدعومة في متصفحك. يرجى استخدام متصفح حديث (Chrome على Android).');
      return;
    }
    try {
      const props = ['name', 'tel'];
      const opts = { multiple: false };
      const contacts = await (navigator as any).contacts.select(props, opts);
      if (contacts && contacts.length > 0) {
        const contact = contacts[0];
        const rawName = contact.name && contact.name.length > 0 ? contact.name[0] : '';
        const rawTel = contact.tel && contact.tel.length > 0 ? contact.tel[0] : '';
        if (rawTel) {
          const cleanTel = rawTel.replace(/[^0-9+]/g, '');
          let countryCode = '+20';
          let phoneNumber = cleanTel;
          if (cleanTel.startsWith('+')) {
            countryCode = cleanTel.substring(0, 3);
            phoneNumber = cleanTel.substring(3);
          } else if (cleanTel.startsWith('00')) {
             countryCode = '+' + cleanTel.substring(2, 4);
             phoneNumber = cleanTel.substring(4);
          }
          setFormData(prev => ({
            ...prev,
            name: prev.name || rawName,
            countryCode,
            phoneNumber
          }));
        }
      }
    } catch (err) { console.error('Contact error:', err); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subscriptionValue = Number(toEnglishDigits(formData.sub.toString()));
    const fullMobile = `${formData.countryCode}${formData.phoneNumber}`;
    if (editingId !== null) {
      setResidents((prev: Resident[]) => prev.map((r: Resident) => r.id === editingId ? { ...r, name: formData.name, floorNumber: formData.floorNumber, flatNumber: formData.flatNumber, mobile: fullMobile, subscriptionValue } : r ));
    } else {
      const newId = residents.length > 0 ? Math.max(...residents.map((r: any) => r.id)) + 1 : 1;
      setResidents((prev: Resident[]) => [...prev, { id: newId, name: formData.name, floorNumber: formData.floorNumber, flatNumber: formData.flatNumber, mobile: fullMobile, subscriptionValue }]);
    }
    resetForm();
  };

  const filteredResidents = useMemo(() => {
    const normalizedFilter = toEnglishDigits(filterText).toLowerCase().trim();
    return residents.filter((r: any) => r.name.toLowerCase().includes(normalizedFilter) || toEnglishDigits(r.floorNumber).includes(normalizedFilter) || toEnglishDigits(r.flatNumber).includes(normalizedFilter)).sort((a: any, b: any) => a.name.localeCompare(b.name, 'ar'));
  }, [residents, filterText]);

  const handleEdit = (r: Resident) => {
    setEditingId(r.id);
    let cCode = '+20', pNum = r.mobile;
    if (r.mobile.startsWith('+')) { cCode = r.mobile.substring(0, 3); pNum = r.mobile.substring(3); }
    setFormData({ name: r.name, floorNumber: r.floorNumber, flatNumber: r.flatNumber, countryCode: cCode, phoneNumber: pNum, sub: r.subscriptionValue });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrintResidentsList = () => {
    const reportTitle = "كشف سكان البرج - القائمة الكاملة";
    const reportDate = new Date().toLocaleString('ar-EG');
    const headers = ["م", "الاسم بالكامل", "الوحدة (دور/شقة)", "الموبايل", "الاشتراك"];
    const rows = filteredResidents.map((r: any, idx: number) => [
      idx + 1,
      r.name,
      `دور ${r.floorNumber} - شقة ${r.flatNumber}`,
      r.mobile,
      `${r.subscriptionValue.toLocaleString()} جم`
    ]);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>${reportTitle}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Cairo', sans-serif; padding: 20px; color: #334155; background: #fff; direction: rtl; }
          .report-container { max-width: 900px; margin: 0 auto; border: 1.5px solid #000; padding: 30px; border-radius: 15px; box-shadow: 0 0 20px rgba(0,0,0,0.05); }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 4px double #1e40af; padding-bottom: 15px; }
          .header h1 { font-size: 28px; font-weight: 900; margin: 0; color: #1e40af; }
          .header p { font-size: 18px; margin: 10px 0 0 0; color: #4b5563; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; direction: rtl; overflow: hidden; border-radius: 8px; }
          th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: right; }
          th { background-color: #1e40af; color: white; font-weight: 900; font-size: 14px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          td { font-size: 14px; font-weight: bold; }
          .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; font-size: 11px; display: flex; justify-content: space-between; color: #94a3b8; }
          .print-btn { display: block; width: 100%; max-width: 250px; margin: 30px auto 0; background: #1e40af; color: #fff; padding: 12px; border-radius: 6px; text-align: center; text-decoration: none; font-weight: 900; cursor: pointer; border: none; font-family: 'Cairo', sans-serif; transition: background 0.3s; }
          .print-btn:hover { background: #1d4ed8; }
          @media print { .print-btn { display: none; } .report-container { border: none; padding: 0; box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <h1>${settings.appName}</h1>
            <p>${reportTitle}</p>
          </div>
          <table>
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
          <div class="footer">
            <span>تاريخ الإصدار: ${reportDate}</span>
            <span>نظام مدير البرج الذكي</span>
          </div>
        </div>
        <button class="print-btn" onclick="window.print()">تأكيد الطباعة / حفظ كـ PDF</button>
        <script>window.onload = function() { setTimeout(() => { window.print(); }, 500); }</script>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWin = window.open(url, '_blank');
    if (!printWin) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `كشف_السكان.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("تم تجهيز ملف الطباعة للتحميل.");
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm print:hidden">
        <h3 className="text-lg font-bold mb-4 flex items-center text-blue-600"><PlusCircle className="ml-2" size={20} />{editingId ? 'تعديل بيانات ساكن' : 'إضافة ساكن جديد'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col"><label className="text-xs font-bold text-slate-400 mb-1 mr-1">الاسم بالكامل</label><input ref={nameInputRef} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold" /></div>
          <div className="grid grid-cols-2 gap-2"><div className="flex flex-col"><label className="text-xs font-bold text-slate-400 mb-1 mr-1">رقم الشقة</label><input required value={formData.flatNumber} onChange={e => setFormData({...formData, flatNumber: toEnglishDigits(e.target.value)})} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-center" /></div><div className="flex flex-col"><label className="text-xs font-bold text-slate-400 mb-1 mr-1">رقم الدور</label><input required value={formData.floorNumber} onChange={e => setFormData({...formData, floorNumber: toEnglishDigits(e.target.value)})} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-center" /></div></div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-400 mb-1 mr-1 flex justify-between items-center">
              رقم الموبايل
              <button type="button" onClick={handleImportContact} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-1 font-black">
                <BookUser size={12} /> استيراد من الهاتف
              </button>
            </label>
            <div className="flex gap-2" dir="ltr">
              <input required placeholder="+20" value={formData.countryCode} onChange={e => setFormData({...formData, countryCode: e.target.value})} className="w-20 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold" />
              <input required placeholder="1234567890" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: toEnglishDigits(e.target.value)})} className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
            </div>
          </div>
          <div className="flex flex-col"><label className="text-xs font-bold text-slate-400 mb-1 mr-1">الاشتراك الشهري</label><input type="text" value={formData.sub === 0 ? '' : formData.sub} onChange={e => setFormData({...formData, sub: Number(toEnglishDigits(e.target.value))})} className="bg-slate-50 border rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none font-black text-center" /></div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className={`flex-1 ${editingId ? 'bg-amber-500' : 'bg-blue-600'} text-white font-black py-4 rounded-2xl shadow-lg transition-all`}>
              {editingId ? 'حفظ التعديلات' : 'تأكيد إضافة الساكن'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-6 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl border border-slate-200 hover:bg-slate-200 transition-all">
                إلغاء التعديل
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 print:hidden">
        <div className="flex-1 bg-white p-4 rounded-2xl border flex items-center shadow-sm">
          <Search className="ml-2 text-slate-400" size={18} />
          <input placeholder="ابحث بالاسم أو رقم الشقة..." value={filterText} onChange={(e) => setFilterText(e.target.value)} className="flex-1 bg-transparent outline-none font-bold" />
        </div>
        <button 
          onClick={handlePrintResidentsList}
          className="bg-slate-800 text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
        >
          <Printer size={20} />
          <span>طباعة كشف السكان</span>
        </button>
      </div>
      
      <div className="bg-white rounded-3xl border overflow-hidden shadow-sm max-w-5xl mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-[12px] sm:text-sm">
            <thead className="bg-slate-50 border-b">
              <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest">
                <th className="px-3 py-4 text-center w-12">م</th>
                <th className="px-3 py-4">الاسم</th>
                <th className="px-2 py-4 text-center">دور</th>
                <th className="px-2 py-4 text-center">شقة</th>
                <th className="px-3 py-4 text-center">الموبايل</th>
                <th className="px-3 py-4 text-center">الاشتراك</th>
                <th className="px-3 py-4 text-left print:hidden">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResidents.map((r: Resident, index: number) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-3 text-center text-slate-400 font-bold">{index + 1}</td>
                  <td className="px-3 py-3 font-bold text-slate-800 whitespace-nowrap">{r.name}</td>
                  <td className="px-2 py-3 text-center font-bold text-slate-500">{r.floorNumber}</td>
                  <td className="px-2 py-3 text-center font-bold text-slate-500">{r.flatNumber}</td>
                  <td className="px-3 py-3 text-center font-bold text-slate-400 tracking-tighter" dir="ltr">{r.mobile}</td>
                  <td className="px-3 py-3 text-center font-black text-blue-600">{r.subscriptionValue} جم</td>
                  <td className="px-3 py-3 text-left print:hidden">
                    <div className="flex items-center justify-end space-x-reverse space-x-1">
                      <button onClick={() => handleEdit(r)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit size={14} /></button>
                      <button onClick={() => onDelete(r.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredResidents.length === 0 && (
                <tr><td colSpan={7} className="p-10 text-center text-slate-300 font-bold italic">لا يوجد سكان مسجلين يطابقون البحث</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CollectionPage = ({ residents, collections, setCollections, toEnglishDigits }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'monthly' | 'annually'>('monthly');
  const [showSuccess, setShowSuccess] = useState(false);
  const filteredResidents = useMemo(() => residents.filter((r: any) => r.name.toLowerCase().includes(searchTerm.toLowerCase())), [residents, searchTerm]);
  const selectedResident = useMemo(() => residents.find((r:any) => r.id === selectedId), [selectedId, residents]);
  const isPaid = useMemo(() => { if (!selectedId) return false; if (paymentMode === 'annually') return collections.some((c: any) => c.residentId === selectedId && c.year === year); return collections.some((c: any) => c.residentId === selectedId && c.month === month && c.year === year); }, [selectedId, month, year, collections, paymentMode]);
  useEffect(() => { if (selectedResident) setAmount(paymentMode === 'annually' ? selectedResident.subscriptionValue * 12 : selectedResident.subscriptionValue); }, [selectedResident, paymentMode]);
  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return alert('برجاء اختيار ساكن');
    if (isPaid) return alert('هذا الساكن مسدد بالفعل!');
    if (paymentMode === 'annually') {
      const monthlyAmt = amount / 12;
      const newEntries: Collection[] = [];
      let nextId = collections.length > 0 ? Math.max(...collections.map((c: any) => c.id)) + 1 : 1;
      for (let m = 1; m <= 12; m++) if (!collections.some((c: any) => c.residentId === selectedId && c.month === m && c.year === year)) newEntries.push({ id: nextId++, residentId: selectedId, month: m, year, amount: monthlyAmt, date: new Date().toISOString().split('T')[0] });
      setCollections((prev: Collection[]) => [...prev, ...newEntries]);
    } else {
      const newId = collections.length > 0 ? Math.max(...collections.map((c: any) => c.id)) + 1 : 1;
      setCollections((prev: Collection[]) => [...prev, { id: newId, residentId: selectedId, month, year, amount, date: new Date().toISOString().split('T')[0] }]);
    }
    setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000);
  };
  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in slide-in-from-bottom-4">
      {showSuccess && <div className="bg-green-500 text-white p-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 animate-bounce"><CheckCircle2 size={24} /> <span className="font-black">تم تسجيل عملية التحصيل بنجاح ✅</span></div>}
      <div className="bg-white p-8 rounded-[2rem] border shadow-xl relative overflow-hidden print:hidden">
        <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black text-slate-800">تسجيل تحصيل</h3><div className="flex bg-slate-100 p-1 rounded-xl"><button onClick={() => setPaymentMode('monthly')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${paymentMode === 'monthly' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>دفع شهري</button><button onClick={() => setPaymentMode('annually')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${paymentMode === 'annually' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>دفع سنوي</button></div></div>
        <form onSubmit={handlePay} className="space-y-6">
          <div className="relative"><Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input placeholder="ابحث عن الساكن..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); if(selectedId) setSelectedId(null); }} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pr-12 font-bold outline-none" />{selectedId && <button type="button" onClick={() => { setSelectedId(null); setSearchTerm(''); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500">تغيير</button>}</div>
          {searchTerm && !selectedId && <div className="max-h-40 overflow-y-auto bg-white rounded-2xl border p-2 space-y-1 shadow-lg absolute z-20 w-full left-0 mt-1">{filteredResidents.map((r: any) => (<button key={r.id} type="button" onClick={() => { setSelectedId(r.id); setSearchTerm(r.name); }} className="w-full text-right p-3 rounded-xl hover:bg-slate-50 font-bold text-sm flex justify-between"><span>{r.name}</span><span className="text-slate-400 text-xs">شقة {r.flatNumber}</span></button>))}</div>}
          <div className="grid grid-cols-2 gap-4">
            {paymentMode === 'monthly' && <div className="flex flex-col"><label className="text-[10px] font-bold text-slate-400 mb-1 mr-2 italic">شهر السداد</label><select value={month} onChange={e => setMonth(Number(e.target.value))} className="bg-slate-50 border rounded-2xl p-4 font-bold outline-none">{Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}</select></div>}
            <div className={`flex flex-col ${paymentMode === 'annually' ? 'col-span-2' : ''}`}><label className="text-[10px] font-bold text-slate-400 mb-1 mr-2 italic">السنة</label><select value={year} onChange={e => setYear(Number(e.target.value))} className="bg-slate-50 border rounded-2xl p-4 font-bold outline-none">{[year, year - 1, year + 1].map(y => <option key={y} value={y}>{y}</option>)}</select></div>
          </div>
          <div className="text-center bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200 relative"><label className="text-xs font-bold text-slate-400 mb-2 block italic">المبلغ المستحق (جم)</label><input type="text" value={amount === 0 ? '' : amount} onChange={e => setAmount(Number(toEnglishDigits(e.target.value)))} className={`w-full bg-transparent text-center font-black text-4xl outline-none ${isPaid ? 'text-slate-300' : 'text-green-600'}`} />{isPaid && <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-3xl"><span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-black flex items-center gap-2 shadow-sm"><CheckCircle2 size={16} /> تم السداد مسبقاً</span></div>}</div>
          <button type="submit" disabled={isPaid || !selectedId} className={`w-full font-black py-4 rounded-2xl shadow-lg transition-all ${isPaid || !selectedId ? 'bg-slate-100 text-slate-400' : 'bg-green-600 hover:bg-green-700 text-white'}`}>{isPaid ? 'السداد مسجل مسبقاً' : 'تأكيد تسجيل السداد'}</button>
        </form>
      </div>
    </div>
  );
};

const ExpensesPage = ({ transactions, setTransactions, categories, setCategories, toEnglishDigits, triggerConfirm }: any) => {
  const [newCat, setNewCat] = useState('');
  const [selectedMainCat, setSelectedMainCat] = useState<string | null>(null);
  const [subDesc, setSubDesc] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [renamingCat, setRenamingCat] = useState<string | null>(null);
  const [renamingValue, setRenamingValue] = useState('');
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLInputElement>(null);

  // التركيز التلقائي عند اختيار تصنيف
  useEffect(() => {
    if (selectedMainCat && descInputRef.current) {
      descInputRef.current.focus();
    }
  }, [selectedMainCat]);

  const totalGeneralExpenses = useMemo(() => 
    transactions.filter((t: any) => t.type === 'expense' && t.category !== 'treasury')
      .reduce((acc: number, curr: any) => acc + curr.amount, 0),
    [transactions]
  );

  const resetSubForm = () => {
    setEditingId(null);
    setSubDesc('');
    setAmount(0);
    setImage(null);
    setDate(new Date().toISOString().split('T')[0]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    // إرجاع المؤشر تلقائياً لخانة البيان بعد التسجيل
    setTimeout(() => {
      descInputRef.current?.focus();
    }, 10);
  };

  const addCategory = () => {
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      setCategories([...categories, newCat.trim()]);
      setNewCat('');
    }
  };

  const handleRenameCategory = (oldCat: string) => {
    if (renamingValue.trim() && !categories.includes(renamingValue.trim())) {
      setCategories(categories.map((c: string) => c === oldCat ? renamingValue.trim() : c));
      setTransactions(transactions.map((t: any) => t.category === oldCat ? { ...t, category: renamingValue.trim() } : t));
      setRenamingCat(null);
      setRenamingValue('');
    }
  };

  const handleDeleteCategory = (cat: string) => {
    triggerConfirm(
      'حذف البند الرئيسي؟',
      `سيتم حذف البند "${cat}" وجميع العمليات المسجلة تحته نهائياً.`,
      () => {
        setCategories(categories.filter((c: string) => c !== cat));
        setTransactions(transactions.filter((t: any) => t.category !== cat));
        if (selectedMainCat === cat) setSelectedMainCat(null);
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMainCat || !subDesc.trim() || amount <= 0) return;
    
    if (editingId !== null) {
      setTransactions((prev: Transaction[]) => prev.map((t: any) => 
        t.id === editingId ? { ...t, description: subDesc.trim(), amount: Number(amount), date, image: image || undefined } : t
      ));
    } else {
      const newId = transactions.length > 0 ? Math.max(...transactions.map((t: any) => t.id)) + 1 : 1;
      setTransactions((prev: Transaction[]) => [...prev, { 
        id: newId, 
        category: selectedMainCat, 
        type: 'expense', 
        description: subDesc.trim(), 
        amount: Number(amount), 
        date,
        image: image || undefined
      }]);
    }
    resetSubForm();
  };

  const handleEditSubExpense = (t: Transaction) => {
    setEditingId(t.id);
    setSubDesc(t.description);
    setAmount(t.amount);
    setDate(t.date);
    setImage(t.image || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // فوكس عند التعديل أيضاً
    setTimeout(() => descInputRef.current?.focus(), 100);
  };

  const handleDeleteSubExpense = (id: number) => {
    triggerConfirm(
      'حذف المصروف؟',
      'سيتم مسح هذا القيد تماماً من السجلات.',
      () => setTransactions(transactions.filter((t: any) => t.id !== id))
    );
  };

  const currentCatExpenses = useMemo(() => transactions.filter((t: any) => t.type === 'expense' && t.category === selectedMainCat).sort((a: any, b: any) => b.date.localeCompare(a.date)), [transactions, selectedMainCat]);

  if (!selectedMainCat) return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 print:hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Layers className="text-rose-500" size={24} />
            إدارة بنود المصروفات
          </h3>
          <div className="bg-rose-50 px-4 py-2 rounded-2xl border border-rose-100 shadow-sm flex flex-col items-end">
            <span className="text-[9px] font-black text-rose-400 uppercase tracking-tighter mb-0.5">إجمالي المصروفات العامة</span>
            <span className="text-lg font-black text-rose-600 leading-none">{totalGeneralExpenses.toLocaleString()} <span className="text-xs">جم</span></span>
          </div>
        </div>
        <div className="space-y-4 mb-8">
          {categories.map((cat: string) => {
            const catTotal = transactions
              .filter((t: any) => t.type === 'expense' && t.category === cat)
              .reduce((acc: number, curr: any) => acc + curr.amount, 0);

            return (
              <div key={cat} className="flex gap-2">
                {renamingCat === cat ? (
                  <div className="flex-1 flex gap-2">
                    <input autoFocus value={renamingValue} onChange={e => setRenamingValue(e.target.value)} className="flex-1 bg-white border border-blue-500 rounded-2xl p-4 font-bold outline-none" />
                    <button onClick={() => handleRenameCategory(cat)} className="bg-green-500 text-white p-4 rounded-2xl"><Save size={20} /></button>
                    <button onClick={() => setRenamingCat(null)} className="bg-slate-200 text-slate-500 p-4 rounded-2xl"><X size={20} /></button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => setSelectedMainCat(cat)} className="flex-1 flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-sm"><ReceiptText size={20} /></div>
                        <div className="text-right">
                          <h4 className="font-black text-slate-700 leading-tight">{cat}</h4>
                          <p className="text-[10px] font-black text-rose-500 mt-1">إجمالي: {catTotal.toLocaleString()} جم</p>
                        </div>
                      </div>
                      <ChevronLeft size={20} className="text-slate-300" />
                    </button>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => { setRenamingCat(cat); setRenamingValue(cat); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteCategory(cat)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 pt-6 border-t"><input placeholder="بند رئيسي جديد..." value={newCat} onChange={e => setNewCat(e.target.value)} className="flex-1 bg-slate-50 border rounded-xl px-4 py-4 font-bold outline-none" /><button onClick={addCategory} className="bg-slate-800 text-white font-black px-6 rounded-xl"><Plus size={20} /></button></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 relative">
      {viewingImage && (
        <div className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setViewingImage(null)}>
          <img src={viewingImage} className="max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in-95" alt="إيصال مصروف" />
          <button className="absolute top-6 left-6 text-white p-2 bg-white/10 rounded-full"><X size={32} /></button>
        </div>
      )}

      <button onClick={() => { setSelectedMainCat(null); resetSubForm(); }} className="flex items-center gap-2 text-blue-600 font-black text-sm hover:bg-blue-50 px-4 py-2 rounded-xl print:hidden"> <ChevronRight size={18} /> <span>رجوع للبنود</span> </button>
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border text-center"> <h3 className="text-2xl font-black mb-2 text-slate-800">{selectedMainCat}</h3> <div className="text-4xl font-black text-rose-600">{currentCatExpenses.reduce((a:number,c:any)=>a+c.amount,0).toLocaleString()} <span className="text-sm font-bold">جم</span></div> </div>
      
      <form onSubmit={addExpense} className="bg-white p-6 rounded-3xl border shadow-sm space-y-4 max-w-2xl mx-auto print:hidden">
        <h4 className="font-black text-slate-700 text-sm flex items-center gap-2">{editingId ? <Edit size={16} /> : <PlusCircle size={16} />} {editingId ? 'تعديل المصروف فرعي' : 'تسجيل مصروف فرعي جديد'}</h4>
        <input ref={descInputRef} placeholder="البيان / الوصف..." value={subDesc} onChange={e => setSubDesc(e.target.value)} className="w-full bg-slate-50 border p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-rose-500" />
        <div className="grid grid-cols-2 gap-4">
          <input type="text" value={amount === 0 ? '' : amount} onChange={e => setAmount(Number(toEnglishDigits(e.target.value)))} placeholder="المبلغ" className="bg-slate-50 border p-4 rounded-2xl font-black text-center text-xl outline-none" />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-slate-50 border p-4 rounded-2xl font-bold outline-none" />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200">
          <label className="flex-1 flex items-center justify-center gap-3 cursor-pointer group">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200 transition-all">
              <Camera size={24} />
            </div>
            <div className="text-right">
              <span className="block text-xs font-black text-slate-600">إضافة صورة إيصال (اختياري)</span>
              <span className="text-[10px] text-slate-400 font-bold">اضغط للاختيار أو التصوير</span>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          
          {image && (
            <div className="relative group">
              <img src={image} className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-md" alt="Preview" />
              <button type="button" onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"><X size={12} /></button>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-xl cursor-pointer" onClick={() => setViewingImage(image)}>
                <Eye size={20} className="text-white" />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all">{editingId ? 'حفظ التعديلات' : 'تأكيد تسجيل المصروف'}</button>
          {editingId && (
            <button type="button" onClick={resetSubForm} className="px-6 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all">إلغاء التعديل</button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden max-w-3xl mx-auto">
        <div className="overflow-x-auto touch-pan-x">
          <table className="w-full text-right min-w-[450px] text-[11px] sm:text-xs">
            <thead className="bg-slate-50 text-[10px] text-slate-400 font-black uppercase">
              <tr>
                <th className="px-3 py-3">التاريخ</th>
                <th className="px-3 py-3">البيان</th>
                <th className="px-3 py-3 text-center">المبلغ</th>
                <th className="px-3 py-3 text-center print:hidden">صورة</th>
                <th className="px-3 py-3 text-left print:hidden">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentCatExpenses.map((t: Transaction) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2 font-black text-black whitespace-nowrap">{t.date}</td>
                  <td className="px-3 py-2 font-black text-slate-700">{t.description}</td>
                  <td className="px-3 py-2 font-black text-center text-red-600">-{t.amount.toLocaleString()}</td>
                  <td className="px-3 py-2 text-center print:hidden">
                    {t.image ? (
                      <button onClick={() => setViewingImage(t.image!)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-all"><ImageIcon size={14} /></button>
                    ) : (
                      <span className="text-slate-200">---</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-left print:hidden">
                    <div className="flex items-center justify-end space-x-reverse space-x-1">
                      <button onClick={() => handleEditSubExpense(t)} className="p-1 text-blue-400 hover:bg-blue-50 rounded-lg transition-all"><Edit size={14} /></button>
                      <button onClick={() => handleDeleteSubExpense(t.id)} className="p-1 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentCatExpenses.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-slate-300 font-bold italic">لا توجد عمليات صرف مسجلة لهذا البند بعد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AlertsPage = ({ residents, collections, toEnglishDigits }: any) => {
  const [fMonth, setFMonth] = useState(new Date().getMonth() + 1);
  const [fYear, setFYear] = useState(new Date().getFullYear());
  const debtors = useMemo(() => residents.filter((r: any) => !collections.find((c: any) => c.residentId === r.id && c.month === fMonth && c.year === fYear)), [residents, collections, fMonth, fYear]);
  const sendMessage = (r: any, type: 'wa' | 'sms' | 'call') => {
    const msg = `السيد/ة ${r.name} نذكر سيادتكم باشتراك البرج لشهر ${fMonth}/${fYear}. القيمة المستحقة: ${r.subscriptionValue} جم.`;
    const phone = r.mobile.replace(/[\s\+]/g, '');
    if (type === 'wa') window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    else if (type === 'sms') window.open(`sms:${phone}?body=${encodeURIComponent(msg)}`, '_blank');
    else if (type === 'call') window.open(`tel:${phone}`, '_blank');
  };
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="bg-white p-6 rounded-3xl border flex justify-between gap-4 shadow-sm items-center print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center animate-pulse">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">تصفية المتأخرين</h3>
            <p className="text-xs text-slate-400 font-bold">لفترة {fMonth} / {fYear}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select value={fMonth} onChange={e => setFMonth(Number(e.target.value))} className="p-3 bg-slate-50 border rounded-xl font-black text-sm outline-none focus:ring-2 focus:ring-red-500">
            {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>) }
          </select>
          <select value={fYear} onChange={e => setFYear(Number(e.target.value))} className="p-3 bg-slate-50 border rounded-xl font-black text-sm outline-none focus:ring-2 focus:ring-red-500">
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{debtors.length > 0 ? debtors.map((r: any) => ( <div key={r.id} className="bg-white rounded-[2rem] border shadow-xl p-6 group"><div className="flex justify-between items-start mb-6"><div className="flex items-center gap-3"><div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-400"><UserRound size={30} /></div><div><h4 className="font-black text-lg text-slate-800">{r.name}</h4><div className="text-xs font-bold text-slate-400">شقة {r.flatNumber} • دور {r.floorNumber}</div></div></div><div className="text-left text-xl font-black text-red-600">{r.subscriptionValue} جم</div></div><div className="grid grid-cols-3 gap-3 print:hidden"><button onClick={() => sendMessage(r, 'wa')} className="flex flex-col items-center gap-1 bg-green-500 text-white py-3 rounded-2xl text-[10px] font-black"><MessageCircle size={18} />واتساب</button><button onClick={() => sendMessage(r, 'sms')} className="flex flex-col items-center gap-1 bg-blue-500 text-white py-3 rounded-2xl text-[10px] font-black"><Mail size={18} />رسالة</button><button onClick={() => sendMessage(r, 'call')} className="flex flex-col items-center gap-1 bg-slate-800 text-white py-3 rounded-2xl text-[10px] font-black"><PhoneCall size={18} />اتصال</button></div></div> )) : <div className="md:col-span-2 py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200"><h3 className="text-xl font-black text-slate-800 mb-2">ممتاز! لا يوجد متأخرين</h3></div>}</div>
    </div>
  );
};

const FinancialPage = ({ type, transactions, collections, setTransactions, toEnglishDigits, triggerConfirm }: any) => {
  const [formData, setFormData] = useState({ desc: '', amount: 0, date: new Date().toISOString().split('T')[0], tType: 'expense' as 'income' | 'expense' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLInputElement>(null);

  // التركيز التلقائي عند فتح نموذج الإدخال
  useEffect(() => {
    if (showForm && descInputRef.current) {
      setTimeout(() => descInputRef.current?.focus(), 10);
    }
  }, [showForm]);

  const manualTreasuryIncome = useMemo(() => transactions.filter((t: any) => t.category === 'treasury' && t.type === 'income').reduce((acc: number, curr: any) => acc + curr.amount, 0), [transactions]);
  const manualTreasuryExpense = useMemo(() => transactions.filter((t: any) => t.category === 'treasury' && t.type === 'expense').reduce((acc: number, curr: any) => acc + curr.amount, 0), [transactions]);
  const netBalance = manualTreasuryIncome - manualTreasuryExpense;

  const currentManualTransactions = useMemo(() => transactions.filter((t: any) => t.category === 'treasury').sort((a: any, b: any) => b.date.localeCompare(a.date)), [transactions]);

  const resetForm = () => {
    setFormData({ desc: '', amount: 0, date: new Date().toISOString().split('T')[0], tType: 'expense' });
    setEditingId(null);
    setImage(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (t: Transaction) => {
    setFormData({ desc: t.description, amount: t.amount, date: t.date, tType: t.type });
    setEditingId(t.id);
    setImage(t.image || null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    triggerConfirm(
      'حذف عملية الخزينة؟',
      'سيتم مسح هذه العملية اليدوية نهائياً من سجل الخزينة.',
      () => setTransactions(transactions.filter((t: any) => t.id !== id))
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.desc || !formData.amount) return;
    
    if (editingId !== null) {
      setTransactions((prev: Transaction[]) => prev.map((t: any) => 
        t.id === editingId ? { ...t, description: formData.desc, amount: Number(formData.amount), date: formData.date, type: formData.tType, image: image || undefined } : t
      ));
    } else {
      const newId = transactions.length > 0 ? Math.max(...transactions.map((t: any) => t.id)) + 1 : 1;
      setTransactions((prev: Transaction[]) => [...prev, { 
        id: newId, 
        category: type, 
        type: formData.tType, 
        description: formData.desc, 
        amount: Number(formData.amount), 
        date: formData.date,
        image: image || undefined
      }]);
    }
    resetForm();
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 pb-10 relative">
      {viewingImage && (
        <div className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setViewingImage(null)}>
          <img src={viewingImage} className="max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in-95" alt="إيصال الخزينة" />
          <button className="absolute top-6 left-6 text-white p-2 bg-white/10 rounded-full"><X size={32} /></button>
        </div>
      )}

      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border overflow-hidden relative">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Vault size={24} /></div>
            <div>
              <h3 className="text-xl font-black text-slate-800">صافي الخزينة اليدوية</h3>
              <p className="text-xs text-slate-400 font-bold">العمليات اليدوية فقط</p>
            </div>
          </div>
          <div className={`text-4xl font-black ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>{netBalance.toLocaleString()} جم</div>
        </div>
      </div>

      {!showForm ? (
        <div className="grid grid-cols-2 gap-4 print:hidden">
          <button onClick={() => { setShowForm(true); setFormData({...formData, tType: 'income'}); }} className="bg-white p-6 rounded-[2rem] border-2 border-green-500 text-green-600 font-black flex flex-col items-center gap-2 hover:bg-green-50 transition-all"><PlusCircle size={32} />إيراد يدوي</button>
          <button onClick={() => { setShowForm(true); setFormData({...formData, tType: 'expense'}); }} className="bg-white p-6 rounded-[2rem] border-2 border-red-500 text-red-600 font-black flex flex-col items-center gap-2 hover:bg-red-50 transition-all"><MinusCircle size={32} />مصروف يدوي</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border shadow-xl space-y-4 animate-in zoom-in-95 print:hidden">
          <h4 className="font-black text-slate-700 flex items-center gap-2">
            {editingId ? <Edit size={18} /> : (formData.tType === 'income' ? <PlusCircle size={18} /> : <MinusCircle size={18} />)}
            {editingId ? 'تعديل عملية الخزينة' : (formData.tType === 'income' ? 'تسجيل إيراد يدوي جديد' : 'تسجيل مصروف يدوي جديد')}
          </h4>
          <input ref={descInputRef} placeholder="البيان (مثال: عهدة حارس، تبرع، قرض...)" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-amber-500" />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" value={formData.amount === 0 ? '' : formData.amount} onChange={e => setFormData({...formData, amount: Number(toEnglishDigits(e.target.value))})} placeholder="المبلغ" className="bg-slate-50 border p-4 rounded-2xl text-center font-black text-2xl outline-none" />
            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="bg-slate-50 border p-4 rounded-2xl font-bold outline-none" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200">
            <label className="flex-1 flex items-center justify-center gap-3 cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200 transition-all">
                <Camera size={24} />
              </div>
              <div className="text-right">
                <span className="block text-xs font-black text-slate-600">صورة مستند/إيصال (اختياري)</span>
                <span className="text-[10px] text-slate-400 font-bold">اضغط للاختيار أو التصوير</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            
            {image && (
              <div className="relative group">
                <img src={image} className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-md" alt="Preview" />
                <button type="button" onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"><X size={12} /></button>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-xl cursor-pointer" onClick={() => setViewingImage(image)}>
                  <Eye size={20} className="text-white" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-slate-900 transition-all">حفظ البيانات</button>
            <button type="button" onClick={resetForm} className="px-6 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all">إلغاء</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b print:bg-transparent">
          <h4 className="text-sm font-black text-slate-600">سجل حركات الخزينة اليدوية</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100/50 text-slate-400 font-black uppercase">
              <tr>
                <th className="px-6 py-3">م</th>
                <th className="px-6 py-3">التاريخ</th>
                <th className="px-6 py-3">البيان</th>
                <th className="px-6 py-3 text-center">المبلغ</th>
                <th className="px-6 py-3 text-center print:hidden">صورة</th>
                <th className="px-6 py-3 text-left print:hidden">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentManualTransactions.map((t: Transaction, idx: number) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 text-slate-400 font-bold">{idx + 1}</td>
                  <td className="px-6 py-3 text-[#000000] font-black whitespace-nowrap">{t.date}</td>
                  <td className="px-6 py-3 font-black text-slate-700">{t.description}</td>
                  <td className={`px-6 py-3 text-center font-black ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-center print:hidden">
                    {t.image ? (
                      <button onClick={() => setViewingImage(t.image!)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-all"><ImageIcon size={14} /></button>
                    ) : (
                      <span className="text-slate-200">---</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-left print:hidden">
                    <div className="flex items-center justify-end space-x-reverse space-x-1">
                      <button onClick={() => handleEdit(t)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentManualTransactions.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-slate-300 font-bold italic">لا توجد حركات يدوية مسجلة</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ReportsHub = ({ residents, collections, transactions, categories, settings }: any) => {
  const [activeReport, setActiveReport] = useState<'residents' | 'treasury' | 'expenses' | null>(null);
  const [fMonth, setFMonth] = useState(new Date().getMonth() + 1);
  const [fYear, setFYear] = useState(new Date().getFullYear());
  const [fCategory, setFCategory] = useState<string>('all');
  
  // حقول الفترة لتقرير الخزينة والمصروفات
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const ReportIconCard = ({ title, icon: Icon, color, onClick }: any) => (
    <button onClick={onClick} className={`flex flex-col items-center p-8 bg-white rounded-[2.5rem] border shadow-lg hover:-translate-y-1 transition-all w-full`}>
      <div className={`w-20 h-20 ${color} text-white rounded-full flex items-center justify-center mb-6 shadow-lg`}>
        <Icon size={40} />
      </div>
      <span className="font-black text-slate-700 text-lg">{title}</span>
    </button>
  );

  const filterTransactions = (list: any[]) => {
    const filtered = list.filter(t => {
      if (activeReport === 'treasury' || activeReport === 'expenses') {
        const dateInRange = t.date >= startDate && t.date <= endDate;
        if (activeReport === 'expenses') {
          const cMatch = fCategory === 'all' || t.category === fCategory;
          return dateInRange && cMatch;
        }
        return dateInRange;
      }
      const tDate = new Date(t.date);
      const mMatch = tDate.getMonth() + 1 === fMonth;
      const yMatch = tDate.getFullYear() === fYear;
      return mMatch && yMatch;
    });
    // ترتيب العمليات من الأحدث للأقدم
    return filtered.sort((a, b) => b.date.localeCompare(a.date));
  };

  const totalMonthlyCollected = useMemo(() => {
    return collections
      .filter((c: any) => c.month === fMonth && c.year === fYear)
      .reduce((acc: number, curr: any) => acc + curr.amount, 0);
  }, [collections, fMonth, fYear]);

  const exportReportAsHTML = (reportTitle: string, headers: string[], rows: any[][], footer: string = "") => {
    const reportDate = new Date().toLocaleString('ar-EG');
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>${reportTitle}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Cairo', sans-serif; padding: 20px; color: #334155; background: #fff; direction: rtl; }
          .report-container { max-width: 900px; margin: 0 auto; border: 1.5px solid #000; padding: 30px; border-radius: 15px; box-shadow: 0 0 20px rgba(0,0,0,0.05); }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 4px double #1e40af; padding-bottom: 15px; }
          .header h1 { font-size: 28px; font-weight: 900; margin: 0; color: #1e40af; }
          .header p { font-size: 18px; margin: 10px 0 0 0; color: #4b5563; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; direction: rtl; overflow: hidden; border-radius: 8px; }
          th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: right; }
          th { background-color: #1e40af; color: white; font-weight: 900; font-size: 14px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          td { font-size: 14px; font-weight: bold; }
          .income { color: #16a34a !important; }
          .expense { color: #dc2626 !important; }
          .date-cell { color: #000000 !important; font-weight: 900 !important; }
          .total-row { background-color: #f1f5f9 !important; border-top: 2px solid #1e40af; }
          .total-row td { font-weight: 900; color: #0f172a; font-size: 15px; }
          .summary-box { margin-top: 30px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 20px; border-radius: 12px; }
          .summary-box h3 { margin: 0 0 10px 0; color: #1e40af; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
          .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; font-size: 11px; display: flex; justify-content: space-between; color: #94a3b8; }
          .print-btn { display: block; width: 100%; max-width: 250px; margin: 30px auto 0; background: #1e40af; color: #fff; padding: 12px; border-radius: 6px; text-align: center; text-decoration: none; font-weight: 900; cursor: pointer; border: none; font-family: 'Cairo', sans-serif; transition: background 0.3s; }
          .print-btn:hover { background: #1d4ed8; }
          @media print { .print-btn { display: none; } .report-container { border: none; padding: 0; box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <h1>${settings.appName}</h1>
            <p>${reportTitle}</p>
          </div>
          <table>
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.map((row, idx) => {
                const isTotal = row.some(cell => cell.toString().includes("الإجمالي"));
                return `<tr class="${isTotal ? 'total-row' : ''}">${row.map((cell, cellIdx) => {
                  let className = "";
                  const val = cell.toString();
                  
                  // Color Date column specifically BLACK (index 1 is Date in our standard report rows)
                  if (cellIdx === 1 && (reportTitle.includes("الخزينة") || reportTitle.includes("المصروفات"))) {
                    className = "date-cell";
                  }

                  // Coloring for other status/monetary columns
                  if (activeReport === 'residents' && cellIdx === 3) {
                    if (val.includes("✔")) className = "income";
                    if (val.includes("✖")) className = "expense";
                  } else if (activeReport !== 'residents') {
                    if (val.includes("+")) className = "income";
                    if (val.includes("-") && !val.includes("---")) className = "expense";
                  }
                  return `<td class="${className}">${cell}</td>`;
                }).join('')}</tr>`;
              }).join('')}
            </tbody>
          </table>
          <div class="summary-box">
             ${footer}
          </div>
          <div class="footer">
            <span>تاريخ الاستخراج: ${reportDate}</span>
            <span>نظام مدير البرج الذكي</span>
          </div>
        </div>
        <button class="print-btn" onclick="window.print()">تأكيد الطباعة / حفظ PDF</button>
        <script>window.onload = function() { setTimeout(() => { window.print(); }, 500); }</script>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWin = window.open(url, '_blank');
    if (!printWin) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقرير_${reportTitle.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("تم تجهيز ملف الطباعة. يرجى فتحه من مدير الملفات لطباعته.");
    }
  };

  const handleSmartPrintTrigger = () => {
    let title = "";
    let headers: string[] = [];
    let rows: any[][] = [];
    let footerText = "";
    
    if (activeReport === 'residents') {
      title = `كشف سداد السكان - شهر ${fMonth} سنة ${fYear}`;
      headers = ["م", "اسم الساكن", "الوحدة", "الحالة", "المبلغ"];
      rows = residents.map((r: any, idx: number) => {
        const payment = collections.find((c: any) => c.residentId === r.id && c.month === fMonth && c.year === fYear);
        return [idx + 1, r.name, `دور ${r.floorNumber} - شقة ${r.flatNumber}`, payment ? "مسدد ✔" : "غير مسدد ✖", payment ? `+${payment.amount.toLocaleString()} جم` : "---"];
      });
      footerText = `<h3>ملخص الشهر:</h3><b>إجمالي المحصل لشهر ${fMonth}/${fYear}:</b> <span class="income">${totalMonthlyCollected.toLocaleString()} جم</span>`;
    } else if (activeReport === 'treasury') {
      title = `تقرير حركات الخزينة اليدوية - الفترة من ${startDate} إلى ${endDate}`;
      headers = ["م", "التاريخ", "البيان", "الإيراد (+)", "المصروف (-)"];
      const filtered = filterTransactions(transactions.filter(t => t.category === 'treasury'));
      
      rows = filtered.map((t: any, idx: number) => [
        idx + 1,
        t.date, 
        t.description, 
        t.type === 'income' ? `+${t.amount.toLocaleString()} جم` : "---",
        t.type === 'expense' ? `-${t.amount.toLocaleString()} جم` : "---"
      ]);

      const totalInc = filtered.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
      const totalExp = filtered.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
      const net = totalInc - totalExp;

      rows.push([
        "---",
        "---",
        "إجمالي أعمدة الخزينة",
        `+${totalInc.toLocaleString()} جم`,
        `-${totalExp.toLocaleString()} جم`
      ]);

      footerText = `
        <h3>الخلاصة المالية للخزينة:</h3>
        <p><b>إجمالي الإيداعات (إيراد):</b> <span class="income">+${totalInc.toLocaleString()} جم</span></p>
        <p><b>إجمالي المسحوبات (مصروف):</b> <span class="expense">-${totalExp.toLocaleString()} جم</span></p>
        <p style="font-size: 18px; border-top: 1px solid #ccc; padding-top: 10px;">
          <b>صافي حركة الخزينة للفترة:</b> <span class="${net >= 0 ? 'income' : 'expense'}">${net.toLocaleString()} جم</span>
        </p>
      `;
    } else if (activeReport === 'expenses') {
      title = `تقرير المصروفات التشغيلية - من ${startDate} إلى ${endDate}`;
      headers = ["م", "التاريخ", "البند الرئيسي", "البيان / الوصف", "المبلغ (-)"];
      const filtered = filterTransactions(transactions.filter(t => t.type === 'expense' && t.category !== 'treasury'));
      
      rows = filtered.map((t: any, idx: number) => [
        idx + 1,
        t.date, 
        t.category, 
        t.description, 
        `-${t.amount.toLocaleString()} جم`
      ]);
      
      const total = filtered.reduce((a, c) => a + c.amount, 0);
      
      rows.push([
        "---",
        "---",
        "إجمالي الكلي",
        "---",
        `-${total.toLocaleString()} جم`
      ]);

      footerText = `<h3>ملخص المصروفات:</h3><b>إجمالي المصروفات التشغيلية للفترة المحددة:</b> <span class="expense">-${total.toLocaleString()} جم</span>`;
    }

    if (rows.length > 0) exportReportAsHTML(title, headers, rows, footerText);
    else alert("لا توجد بيانات لهذه الفترة");
  };

  if (!activeReport) return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 print:hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportIconCard title="كشف سداد السكان" icon={UserCheck} color="bg-blue-600" onClick={() => setActiveReport('residents')} />
        <ReportIconCard title="معاملات الخزينة" icon={Vault} color="bg-amber-500" onClick={() => setActiveReport('treasury')} />
        <ReportIconCard title="تقرير المصروفات" icon={ReceiptText} color="bg-rose-500" onClick={() => setActiveReport('expenses')} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-left-6 pb-20">
      <div className="flex justify-between items-center print:hidden">
        <button onClick={() => { setActiveReport(null); setFCategory('all'); }} className="flex items-center gap-2 text-blue-600 font-black text-sm"><ChevronRight size={20} /><span>رجوع</span></button>
        <button onClick={handleSmartPrintTrigger} className="bg-slate-900 text-white px-6 py-4 rounded-2xl text-sm font-black shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2"><Printer size={20} /><span>تصدير للطباعة (بألوان احترافية)</span></button>
      </div>
      {activeReport === 'residents' && (
        <div className="bg-white p-6 rounded-[2.5rem] border shadow-xl">
          <div className="report-header">
            <h3 className="text-xl font-black text-slate-800">{settings.appName}</h3>
            <p className="text-sm font-bold text-slate-500">كشف سداد السكان - شهر {fMonth} لسنة {fYear}</p>
          </div>
          <div className="flex flex-wrap gap-4 items-center mb-6 print:hidden">
            <div className="flex gap-2">
              <select value={fMonth} onChange={e => setFMonth(Number(e.target.value))} className="p-2 border rounded-lg font-black text-xs outline-none focus:ring-2 focus:ring-blue-500">{Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={fYear} onChange={e => setFYear(Number(e.target.value))} className="p-2 border rounded-lg font-black text-xs outline-none focus:ring-2 focus:ring-blue-500">{[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}</select>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 shadow-sm flex items-center gap-2">
                <span className="text-[10px] font-black text-green-600 uppercase leading-none">إجمالي المحصل:</span>
                <span className="text-sm font-black text-green-700 leading-none">{totalMonthlyCollected.toLocaleString()} <span className="text-[10px] opacity-60">جم</span></span>
            </div>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-right text-sm"><thead><tr><th className="py-3 px-4 w-12 text-center">م</th><th className="py-3 px-4">اسم الساكن</th><th className="py-3 px-4 text-center">الدور / الشقة</th><th className="py-3 px-4 text-center">حالة السداد</th><th className="py-3 px-4 text-left">المبلغ المسدد</th></tr></thead><tbody>{residents.map((r: any, idx: number) => { const payment = collections.find((c: any) => c.residentId === r.id && c.month === fMonth && c.year === fYear); return (<tr key={r.id}><td className="py-4 px-4 text-center text-slate-400 font-bold">{idx + 1}</td><td className="py-4 px-4 font-black">{r.name}</td><td className="py-4 px-4 text-center">دور {r.floorNumber} - شقة {r.flatNumber}</td><td className="py-4 px-4 text-center">{payment ? <span className="text-green-600 font-black">مسدد ✔</span> : <span className="text-red-500 font-black">لم يسدد ✖</span>}</td><td className="py-4 px-4 text-left font-black">{payment ? `${payment.amount.toLocaleString()} جم` : '---'}</td></tr>); })}</tbody></table></div>
        </div>
      )}
      {activeReport === 'treasury' && (
        <div className="bg-white p-6 rounded-[2.5rem] border shadow-xl">
          <div className="report-header">
            <h3 className="text-xl font-black text-slate-800">{settings.appName}</h3>
            <p className="text-sm font-bold text-slate-500">تقرير حركات الخزينة (بحث بالفترة)</p>
          </div>
          <div className="flex flex-wrap gap-4 items-center mb-6 print:hidden">
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black text-slate-400">من:</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border rounded-lg font-black text-xs outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black text-slate-400">إلى:</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border rounded-lg font-black text-xs outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-right text-sm"><thead><tr><th className="py-3 px-4 w-12 text-center">م</th><th className="py-3 px-4">التاريخ</th><th className="py-3 px-4">البيان</th><th className="py-3 px-4 text-center">النوع</th><th className="py-3 px-4 text-left">المبلغ</th></tr></thead><tbody>{filterTransactions(transactions.filter(t => t.category === 'treasury')).map((t: any, idx: number) => (<tr key={t.id}><td className="py-4 px-4 text-center text-slate-400 font-bold">{idx + 1}</td><td className="py-4 px-4 font-black text-[#000000]">{t.date}</td><td className="py-4 px-4 font-black">{t.description}</td><td className="py-4 px-4 text-center">{t.type === 'income' ? 'إيراد' : 'مصروف'}</td><td className={`py-4 px-4 text-left font-black ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} جم</td></tr>))}</tbody></table></div>
        </div>
      )}
      {activeReport === 'expenses' && (
        <div className="bg-white p-6 rounded-[2.5rem] border shadow-xl">
          <div className="report-header">
            <h3 className="text-xl font-black text-slate-800">{settings.appName}</h3>
            <p className="text-sm font-bold text-slate-500">تقرير المصروفات التشغيلية (بحث بالفترة)</p>
          </div>
          <div className="flex flex-wrap gap-4 items-center mb-6 print:hidden">
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black text-slate-400">التصنيف:</label>
              <select value={fCategory} onChange={e => setFCategory(e.target.value)} className="p-2 border rounded-lg font-black text-[10px] outline-none focus:ring-2 focus:ring-rose-500">
                <option value="all">كل التصنيفات</option>
                {categories.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black text-slate-400">من:</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border rounded-lg font-black text-xs outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black text-slate-400">إلى:</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border rounded-lg font-black text-xs outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-right text-sm"><thead><tr><th className="py-3 px-4 w-12 text-center">م</th><th className="py-3 px-4">التاريخ</th><th className="py-3 px-4">البند الرئيسي</th><th className="py-3 px-4">البيان / الوصف</th><th className="py-3 px-4 text-left">القيمة</th></tr></thead><tbody>{filterTransactions(transactions.filter(t => t.type === 'expense' && t.category !== 'treasury')).map((t: any, idx: number) => (<tr key={t.id}><td className="py-4 px-4 text-center text-slate-400 font-bold">{idx + 1}</td><td className="py-4 px-4 font-black text-[#000000]">{t.date}</td><td className="py-4 px-4 font-black text-rose-600">{t.category}</td><td className="py-4 px-4">{t.description}</td><td className="py-4 px-4 text-left font-black text-red-600">-{t.amount.toLocaleString()} جم</td></tr>))}</tbody></table></div>
        </div>
      )}
    </div>
  );
};

const ResidentHistoryPage = ({ residents, collections, setCollections, toEnglishDigits, triggerConfirm, settings }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const selectedResident = residents.find((r: any) => r.id === selectedId);
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const handleDeletePayment = (collectionId: number) => {
    triggerConfirm('حذف سجل السداد؟', 'سيتم إزالة عملية السداد لهذا الشهر نهائياً من سجل الساكن.', () => setCollections((prev: Collection[]) => prev.filter(c => c.id !== collectionId)));
  };

  const startEditing = (month: number, currentAmount: number) => {
    setEditingMonth(month);
    setEditValue(currentAmount.toString());
  };

  const saveEdit = (month: number) => {
    const amount = Number(toEnglishDigits(editValue));
    if (isNaN(amount) || amount < 0) return alert('برجاء إدخل مبلغ صحيح');
    setCollections((prev: Collection[]) => {
      const existing = prev.find(c => c.residentId === selectedId && c.month === month && c.year === selectedYear);
      if (existing) return prev.map(c => c.id === existing.id ? { ...c, amount } : c);
      const newId = prev.length > 0 ? Math.max(...prev.map(c => c.id)) + 1 : 1;
      return [...prev, { id: newId, residentId: selectedId!, month, year: selectedYear, amount, date: new Date().toISOString().split('T')[0] }];
    });
    setEditingMonth(null);
  };

  const totalPaidInYear = useMemo(() => {
    if (!selectedId) return 0;
    return collections.filter(c => c.residentId === selectedId && c.year === selectedYear).reduce((acc, curr) => acc + curr.amount, 0);
  }, [collections, selectedId, selectedYear]);

  const handlePrintResidentHistory = () => {
    if (!selectedResident) return;
    const reportTitle = `سجل سداد الساكن: ${selectedResident.name} - عام ${selectedYear}`;
    const reportDate = new Date().toLocaleString('ar-EG');
    const headers = ["الشهر", "حالة السداد", "المبلغ المسدد", "التاريخ"];
    const rows = months.map(m => {
      const pay = collections.find(c => c.residentId === selectedId && c.month === m && c.year === selectedYear);
      return [m, pay ? "تم السداد ✔" : "لم يسدد ✖", pay ? `${pay.amount.toLocaleString()} جم` : "---", pay ? pay.date : "---"];
    });
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>${reportTitle}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Cairo', sans-serif; padding: 20px; color: #334155; background: #fff; direction: rtl; }
          .report-container { max-width: 900px; margin: 0 auto; border: 1.5px solid #000; padding: 30px; border-radius: 15px; box-shadow: 0 0 20px rgba(0,0,0,0.05); }
          .header { text-align: center; margin-bottom: 25px; border-bottom: 4px double #1e40af; padding-bottom: 15px; }
          .header h1 { font-size: 24px; font-weight: 900; margin: 0; color: #1e40af; }
          .header p { font-size: 16px; margin: 10px 0 0 0; color: #4b5563; font-weight: 700; }
          .resident-info { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 12px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; font-weight: 700; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; direction: rtl; overflow: hidden; border-radius: 8px; }
          th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: center; }
          th { background-color: #1e40af; color: white; font-weight: 900; font-size: 13px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          td { font-size: 13px; font-weight: bold; }
          .income { color: #16a34a !important; }
          .expense { color: #dc2626 !important; }
          .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; font-size: 11px; display: flex; justify-content: space-between; color: #94a3b8; }
          .print-btn { display: block; width: 100%; max-width: 250px; margin: 30px auto 0; background: #1e40af; color: #fff; padding: 12px; border-radius: 6px; text-align: center; text-decoration: none; font-weight: 900; cursor: pointer; border: none; font-family: 'Cairo', sans-serif; transition: background 0.3s; }
          .print-btn:hover { background: #1d4ed8; }
          @media print { .print-btn { display: none; } .report-container { border: none; padding: 0; box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header"><h1>${settings.appName}</h1><p>${reportTitle}</p></div>
          <div class="resident-info"><div>الساكن: ${selectedResident.name}</div><div>الوحدة: دور ${selectedResident.floorNumber} - شقة ${selectedResident.flatNumber}</div><div>الموبايل: ${selectedResident.mobile}</div><div>الاشتراك المعتمد: ${selectedResident.subscriptionValue} جم</div></div>
          <table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => {
            const isPaid = row[1].includes("تم السداد");
            return `<tr>
              <td>${row[0]}</td>
              <td class="${isPaid ? 'income' : 'expense'}">${row[1]}</td>
              <td>${row[2]}</td>
              <td>${row[3]}</td>
            </tr>`;
          }).join('')}</tbody></table>
          <div style="margin-top: 20px; text-align: left; font-weight: 900; font-size: 16px; background: #f1f5f9; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1;">إجمالي المسدد خلال العام: <span class="income">${totalPaidInYear.toLocaleString()} جم</span></div>
          <div class="footer"><span>تاريخ الإصدار: ${reportDate}</span><span>نظام إدارة الأبراج الذكي</span></div>
        </div>
        <button class="print-btn" onclick="window.print()">تأكيد الطباعة</button>
        <script>window.onload = function() { setTimeout(() => { window.print(); }, 500); }</script>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWin = window.open(url, '_blank');
    if (!printWin) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `سجل_سداد_${selectedResident.name}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("تم تجهيز ملف الطباعة للتحميل.");
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="bg-white p-6 rounded-3xl shadow-sm border print:hidden flex flex-col md:flex-row gap-4 relative">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            autoFocus
            placeholder="ابحث عن الساكن لعرض تفاصيل سداده..." 
            value={searchTerm} 
            onChange={e => { setSearchTerm(e.target.value); if(selectedId) setSelectedId(null); }} 
            className="w-full bg-slate-50 border p-4 pr-12 rounded-2xl font-bold outline-none border-slate-200 focus:ring-2 focus:ring-cyan-500" 
          />
          {searchTerm && (
            <button 
              onClick={() => { setSearchTerm(''); setSelectedId(null); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          )}
          {searchTerm && !selectedId && (
            <div className="absolute top-full right-0 mt-2 w-full z-50 bg-white rounded-2xl border shadow-xl p-2 max-h-48 overflow-y-auto">
              {residents.filter((r: any) => r.name.toLowerCase().includes(searchTerm.toLowerCase())).map((r: any) => (
                <button key={r.id} onClick={() => { setSelectedId(r.id); setSearchTerm(r.name); }} className="w-full text-right p-4 rounded-xl hover:bg-slate-50 font-bold text-sm border-b border-slate-50 flex justify-between items-center"><span>{r.name}</span><span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">شقة {r.flatNumber}</span></button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3"><label className="text-xs font-black text-slate-400">العام:</label><select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="bg-white border border-slate-200 rounded-xl p-3 font-black text-slate-700 outline-none focus:ring-2 focus:ring-cyan-500">{[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}</select></div>
      </div>
      {selectedResident && (
        <div className="space-y-6 animate-in zoom-in-95">
          <div className="bg-gradient-to-l from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden print:bg-slate-50 print:text-slate-900 print:shadow-none print:border print:rounded-3xl">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-5"><div className="w-20 h-20 bg-blue-500/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/10 print:bg-blue-100 print:border-blue-200"><UserRound size={44} className="text-blue-400 print:text-blue-600" /></div><div><h3 className="text-2xl font-black mb-2 tracking-tight">{selectedResident.name}</h3><div className="flex flex-wrap gap-4 opacity-90 text-xs font-bold"><span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full print:bg-slate-200"><MapPin size={14} className="text-blue-400 print:text-blue-600" /> دور {selectedResident.floorNumber} • شقة {selectedResident.flatNumber}</span><span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full print:bg-slate-200" dir="ltr"><PhoneCall size={14} className="text-green-400 print:text-green-600" /> {selectedResident.mobile}</span></div></div></div>
              <div className="flex flex-col md:items-end justify-center border-r md:border-r-0 md:border-r border-white/10 md:pr-8 print:border-slate-200"><p className="text-[10px] font-black uppercase opacity-50 mb-1 tracking-[0.2em]">الاشتراك الشهري المعتمد</p><div className="text-4xl font-black text-blue-400 print:text-blue-600">{selectedResident.subscriptionValue} <span className="text-sm font-bold text-white/60 print:text-slate-400">جم</span></div></div>
            </div>
            <Building size={200} className="absolute -left-12 -bottom-12 opacity-[0.03] pointer-events-none print:hidden" />
          </div>
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="bg-slate-50/80 p-5 border-b flex justify-between items-center print:bg-transparent print:border-b-2"><h4 className="font-black text-slate-800 flex items-center gap-2"><History className="text-blue-600 print:hidden" size={22} /> كشف سداد عام {selectedYear}</h4><button onClick={handlePrintResidentHistory} className="print:hidden bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[11px] font-black shadow-lg hover:bg-slate-900 transition-all flex items-center gap-2"><Printer size={18} /><span>طباعة السجل (جدول ملون)</span></button></div>
            <div className="overflow-x-auto"><table className="w-full text-right"><thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest print:bg-transparent print:border-b"><tr><th className="px-6 py-4 text-center w-24">الشهر</th><th className="px-6 py-4 text-center">حالة السداد</th><th className="px-6 py-4 text-center">المبلغ المسدد</th><th className="px-6 py-4 text-left print:hidden">إجراءات</th></tr></thead><tbody className="divide-y divide-slate-50">{months.map(m => {
              const pay = collections.find(c => c.residentId === selectedId && c.month === m && c.year === selectedYear);
              const isEditing = editingMonth === m;
              return (<tr key={m} className={`group hover:bg-slate-50/80 transition-colors ${pay ? 'bg-green-50/5' : ''}`}><td className="px-6 py-4 font-black text-slate-600 text-center text-sm">{m}</td><td className="px-6 py-4 text-center">{pay ? <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm print:bg-transparent print:text-green-600"><CheckCircle2 size={15} className="print:hidden" /> تم السداد</div> : <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm opacity-60 print:bg-transparent print:text-red-600"><XCircle size={15} className="print:hidden" /> غير مسدد</div>}</td><td className="px-6 py-4 text-center">{isEditing ? <input autoFocus type="text" value={editValue} onChange={e => setEditValue(toEnglishDigits(e.target.value))} className="w-28 text-center bg-white border-2 border-blue-500 p-2 rounded-xl font-black text-blue-700 outline-none shadow-inner" /> : <span className={`font-black text-lg ${pay ? 'text-blue-600' : 'text-slate-200'}`}>{pay ? `${pay.amount.toLocaleString()} جم` : '---'}</span>}</td><td className="px-6 py-4 text-left print:hidden"><div className="flex items-center justify-end space-x-reverse space-x-2">{isEditing ? <><button onClick={() => saveEdit(m)} className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl shadow-md bg-white border border-green-100 transition-all active:scale-90"><Check size={20} /></button><button onClick={() => setEditingMonth(null)} className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl shadow-md bg-white border border-slate-100 transition-all active:scale-90"><X size={20} /></button></> : <><button onClick={() => startEditing(m, pay ? pay.amount : 0)} className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-blue-100"><Edit size={18} /></button>{pay && <button onClick={() => handleDeletePayment(pay.id)} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-100"><Trash2 size={18} /></button>}</>}</div></td></tr>);
            })}</tbody></table></div>
            <div className="bg-slate-50 p-6 border-t flex justify-between items-center shadow-inner print:bg-transparent print:border-t-2"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 print:hidden"><Calculator size={18} /></div><span className="font-black text-slate-600 text-sm">إجمالي سداد العام المختار:</span></div><div className="text-2xl font-black text-blue-600 tracking-tighter">{totalPaidInYear.toLocaleString()} <span className="text-xs font-bold text-slate-400 mr-1">جم</span></div></div>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsPage = ({ settings, setSettings, toEnglishDigits, residents, collections, setResidents, setCollections, transactions, setTransactions }: any) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [importStatus, setImportStatus] = useState<{ msg: string; type: 'success' | 'error' | 'loading' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const restoreFileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const headers = ["اسم الساكن", "رقم الدور", "رقم الشقة", "رقم الموبايل", "قيمة الاشتراك"];
    const sampleRow = ["محمد أحمد", "1", "101", "+201234567890", "150"];
    const csvContent = "\ufeff" + [headers, sampleRow].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "نموذج_استيراد_سكان.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSVBackup = (quiet = false) => {
    const timestamp = new Date().toLocaleString('ar-EG').replace(/[\/\:\s]/g, '-');
    const fileName = `نسخة_احتياطية_شاملة_${settings.appName.replace(/\s+/g, '_')}_${timestamp}.csv`;
    const header = ["النوع", "الاسم/البيان", "الدور", "الشقة", "الموبايل", "المبلغ/الاشتراك", "التاريخ/الشهر", "السنة", "التصنيف"];
    
    const rows = [
      ...residents.map((r: any) => ["ساكن", r.name, r.floorNumber, r.flatNumber, r.mobile, r.subscriptionValue, "-", "-", "-"]),
      ...collections.map((c: any) => {
        const res = residents.find((r: any) => r.id === c.residentId);
        return ["تحصيل", res?.name || "محذوف", res?.floorNumber || "-", res?.flatNumber || "-", "-", c.amount, c.month, c.year, "اشتراك"];
      }),
      ...transactions.map((t: any) => [
        t.category === 'treasury' ? "خزينة" : "مصروف",
        t.description,
        "-", "-", "-",
        t.amount,
        t.date,
        "-",
        t.category
      ])
    ];

    const csvContent = "\ufeff" + [header, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (!quiet) {
        setImportStatus({ msg: 'تم إنشاء نسخة احتياطية شاملة (CSV) بنجاح ✅', type: 'success' });
        setTimeout(() => setImportStatus(null), 4000);
    }
  };

  const handleSaveSettings = () => {
    setImportStatus({ msg: 'جاري الحفظ...', type: 'loading' });
    setTimeout(() => {
        setSettings(formData);
        setImportStatus({ msg: `تم حفظ الإعدادات بنجاح ✅`, type: 'success' });
        setTimeout(() => setImportStatus(null), 3000);
    }, 1000);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const header = lines[0].split(',').map(h => h.trim());
      const newResidents: Resident[] = [];
      let nextId = residents.length > 0 ? Math.max(...residents.map((r: any) => r.id)) + 1 : 1;
      let count = 0;
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map(v => v.trim());
        const nameIdx = header.indexOf('الاسم') !== -1 ? header.indexOf('الاسم') : header.indexOf('اسم الساكن');
        const floorIdx = header.indexOf('الدور') !== -1 ? header.indexOf('الدور') : header.indexOf('رقم الدور');
        const flatIdx = header.indexOf('الشقة') !== -1 ? header.indexOf('الشقة') : header.indexOf('رقم الشقة');
        const mobileIdx = header.indexOf('الموبايل') !== -1 ? header.indexOf('الموبايل') : header.indexOf('رقم الموبايل');
        const subIdx = header.indexOf('الاشتراك') !== -1 ? header.indexOf('الاشتراك') : header.indexOf('قيمة الاشتراك');
        if (nameIdx === -1 || floorIdx === -1 || flatIdx === -1) {
          setImportStatus({ msg: 'الملف غير مطابق للمسميات المطلوبة (الاسم، الدور، الشقة)', type: 'error' });
          return;
        }
        const name = values[nameIdx];
        const floorNumber = values[floorIdx];
        const flatNumber = values[flatIdx];
        const mobile = values[mobileIdx] || 'غير متوفر';
        const subscriptionValue = Number(toEnglishDigits(values[subIdx] || settings.defaultSubscription));
        const isDuplicate = residents.some((r: any) => r.floorNumber === floorNumber && r.flatNumber === flatNumber) || newResidents.some((r: any) => r.floorNumber === floorNumber && r.flatNumber === flatNumber);
        if (!isDuplicate && name) {
          newResidents.push({ id: nextId++, name, floorNumber, flatNumber, mobile, subscriptionValue });
          count++;
        }
      }
      if (count > 0) {
        setResidents((prev: Resident[]) => [...prev, ...newResidents]);
        setImportStatus({ msg: `تم استيراد ${count} ساكن بنجاح ✅`, type: 'success' });
      } else {
        setImportStatus({ msg: 'لم يتم إضافة سكان جدد (ربما مكررين أو البيانات ناقصة)', type: 'error' });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRestoreCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatus({ msg: 'جاري استعادة كافة البيانات...', type: 'loading' });
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        
        const newResidents: Resident[] = [];
        const newCollections: Collection[] = [];
        const newTransactions: Transaction[] = [];
        const residentIdMap: Record<string, number> = {}; 
        let nextResId = 1;
        let nextCollId = 1;
        let nextTransId = 1;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          const values = line.split(',').map(v => v.trim());
          const type = values[0];
          
          if (type === 'ساكن') {
            const name = values[1];
            const floor = values[2];
            const flat = values[3];
            const mobile = values[4];
            const sub = Number(toEnglishDigits(values[5]));
            const id = nextResId++;
            newResidents.push({ id, name, floorNumber: floor, flatNumber: flat, mobile, subscriptionValue: sub });
            residentIdMap[`${floor}-${flat}`] = id;
          } else if (type === 'تحصيل') {
            const floor = values[2];
            const flat = values[3];
            const amt = Number(toEnglishDigits(values[5]));
            const month = Number(toEnglishDigits(values[6]));
            const year = Number(toEnglishDigits(values[7]));
            const resId = residentIdMap[`${floor}-${flat}`];
            if (resId) {
              newCollections.push({
                id: nextCollId++,
                residentId: resId,
                month,
                year,
                amount: amt,
                date: new Date().toISOString().split('T')[0]
              });
            }
          } else if (type === 'مصروف' || type === 'خزينة') {
             newTransactions.push({
               id: nextTransId++,
               type: type === 'خزينة' ? 'income' : 'expense',
               category: values[8] || (type === 'خزينة' ? 'treasury' : 'others'),
               description: values[1],
               amount: Number(toEnglishDigits(values[5])),
               date: values[6]
             });
          }
        }
        
        if (newResidents.length > 0) {
          setResidents(newResidents);
          setCollections(newCollections);
          setTransactions(newTransactions);
          setImportStatus({ msg: `تم استعادة البيانات الشاملة بنجاح ✅`, type: 'success' });
        } else {
          setImportStatus({ msg: 'لم يتم العثور على بيانات صالحة في الملف ❌', type: 'error' });
        }
      } catch (err) {
        setImportStatus({ msg: 'حدث خطأ أثناء معالجة الملف ❌', type: 'error' });
      }
    };
    reader.readAsText(file);
    setTimeout(() => setImportStatus(null), 5000);
    if (restoreFileInputRef.current) restoreFileInputRef.current.value = '';
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 print:hidden pb-10">
      {importStatus && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md p-4 rounded-2xl font-black text-sm text-center shadow-2xl animate-in slide-in-from-top-4 duration-300 ${importStatus.type === 'success' ? 'bg-green-600 text-white' : importStatus.type === 'loading' ? 'bg-slate-800 text-white' : 'bg-red-600 text-white'}`}><div className="flex items-center justify-center gap-3">{importStatus.type === 'loading' && <Loader2 className="animate-spin" size={20} />}{importStatus.msg}</div></div>
      )}
      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <h3 className="text-xl font-black mb-8 flex items-center gap-2"><Bolt className="text-blue-600" /> إعدادات التحكم البرمجية</h3>
        <div className="space-y-6">
          <div className="flex flex-col"><label className="text-xs font-bold text-slate-400 mb-2">اسم البرج المعتمد</label><input value={formData.appName} onChange={e => setFormData({...formData, appName: e.target.value})} className="bg-slate-50 border rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div className="flex flex-col"><label className="text-xs font-bold text-slate-400 mb-2">إيميل استلام النسخ الاحتياطية (آلياً)</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input type="email" dir="ltr" placeholder="example@mail.com" value={formData.backupEmail} onChange={e => setFormData({...formData, backupEmail: e.target.value})} className="w-full bg-slate-50 border rounded-2xl p-4 pl-12 font-bold outline-none focus:ring-2 focus:ring-blue-500 text-left" /></div></div>
          <div className="flex flex-col"><label className="text-xs font-bold text-slate-400 mb-2">كلمة مرور الإدارة (لحماية الإعدادات)</label><input type="password" value={formData.adminPassword} onChange={e => setFormData({...formData, adminPassword: toEnglishDigits(e.target.value)})} className="bg-slate-50 border rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <button onClick={handleSaveSettings} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"><Save size={20} />حفظ التغييرات</button>
        </div>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4"><ShieldCheck size={32} /></div>
        <h4 className="font-black text-slate-800 mb-2">أداة النسخة الاحتياطية الشاملة</h4>
        <p className="text-xs text-slate-400 font-bold mb-6 italic leading-relaxed">توليد ملف CSV يحتوي على كافة بيانات النظام (سكان، تحصيل، مصروفات، خزينة)</p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button onClick={() => generateCSVBackup()} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-black text-sm hover:bg-slate-900 transition-all flex items-center justify-center gap-2"><Share2 size={18} />تحميل نسخة شاملة (CSV)</button>
          <label className="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-sm border border-blue-200 cursor-pointer hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
            <RotateCcw size={18} /> استرجاع كافة البيانات
            <input ref={restoreFileInputRef} type="file" accept=".csv" onChange={handleRestoreCSV} className="hidden" />
          </label>
        </div>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-black text-slate-700 flex items-center gap-2">
            <FileSpreadsheet className="text-green-600" size={20} /> استيراد قائمة سكان (جدد فقط)
          </h4>
          <button 
            onClick={downloadTemplate}
            className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-1 font-black"
          >
            <Download size={12} />
            تحميل نموذج البيانات (Template)
          </button>
        </div>
        <p className="text-xs font-bold text-slate-400 mb-6 leading-relaxed">إضافة سكان جدد من ملف CSV دون حذف السجلات الحالية.</p>
        <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl p-8 bg-slate-50/50 cursor-pointer hover:bg-white hover:border-blue-200 transition-all group"><div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 mb-4 transition-all"><FileUp size={32} /></div><span className="text-sm font-black text-slate-600">اختيار ملف السكان</span><input ref={fileInputRef} type="file" accept=".csv" onChange={handleImportCSV} className="absolute inset-0 opacity-0 cursor-pointer" /></label>
      </div>
    </div>
  );
};

export default App;