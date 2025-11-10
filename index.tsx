import React, { useState, useEffect } from 'react';
import { Home, Users, Calendar, UserPlus, Clock, Plus, Edit2, Trash2, Save, X, Languages } from 'lucide-react';

// Types
interface Resident {
  id: string;
  name: string;
  condition: string;
  room: string;
  specialNeeds: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
}

interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  staffIds: string[];
  notes: string;
}

interface AppData {
  residents: Resident[];
  staff: Staff[];
  shifts: Shift[];
  language?: string;
}

// Translations
const translations = {
  it: {
    appTitle: 'La Casa di Sara',
    appSubtitle: 'Prendersi cura di chi ne ha più bisogno 💜',
    dashboard: 'Pannello',
    residents: 'Ospiti',
    staff: 'Personale',
    shifts: 'Turni',
    residentsCount: 'Ospiti',
    staffCount: 'Membri del Personale',
    todayShifts: 'Turni di Oggi',
    todaySchedule: 'Programma di Oggi',
    noShiftsToday: 'Nessun turno programmato per oggi',
    staffLabel: 'Personale',
    noStaffAssigned: 'Nessun personale assegnato',
    addResident: 'Aggiungi Ospite',
    addStaff: 'Aggiungi Personale',
    addShift: 'Aggiungi Turno',
    editResident: 'Modifica',
    newResident: 'Nuovo',
    resident: 'Ospite',
    editStaff: 'Modifica',
    newStaff: 'Nuovo',
    staffMember: 'Membro del Personale',
    editShift: 'Modifica',
    newShift: 'Nuovo',
    shift: 'Turno',
    name: 'Nome',
    required: '*',
    room: 'Camera',
    roomNumber: 'Numero camera',
    condition: 'Condizione',
    conditionPlaceholder: 'es. Alzheimer, Demenza',
    specialNeeds: 'Necessità Speciali',
    specialNeedsPlaceholder: 'Dieta, mobilità, ecc.',
    role: 'Ruolo',
    rolePlaceholder: 'es. Operatore, Infermiere',
    phone: 'Telefono',
    contactNumber: 'Numero di contatto',
    date: 'Data',
    startTime: 'Ora Inizio',
    endTime: 'Ora Fine',
    assignStaff: 'Assegna Personale',
    notes: 'Note',
    notesPlaceholder: 'Note speciali per questo turno...',
    save: 'Salva',
    cancel: 'Annulla',
    delete: 'Elimina',
    loading: 'Caricamento...',
    noResidents: 'Nessun ospite ancora. Clicca "Aggiungi Ospite" per iniziare.',
    noStaff: 'Nessun membro del personale ancora. Clicca "Aggiungi Personale" per iniziare.',
    noShifts: 'Nessun turno programmato ancora. Clicca "Aggiungi Turno" per iniziare.',
    deleteConfirmResident: 'Sei sicuro di voler eliminare questo ospite?',
    deleteConfirmStaff: 'Sei sicuro di voler eliminare questo membro del personale?',
    deleteConfirmShift: 'Sei sicuro di voler eliminare questo turno?',
    enterName: 'Inserisci un nome',
    needStaffFirst: '⚠️ Devi prima aggiungere membri del personale prima di creare turni. Vai alla scheda Personale per aggiungerli.',
    fullName: 'Nome completo',
    unknown: 'Sconosciuto',
    installPrompt: '💡 Aggiungi questa app alla schermata Home del tuo iPhone per un accesso rapido!',
    installInstructions: 'In Safari: tocca il pulsante Condividi (quadrato con freccia) → "Aggiungi a Home"',
    gotIt: 'Ho capito'
  },
  en: {
    appTitle: 'Sara\'s Home',
    appSubtitle: 'Caring for those who need it most 💜',
    dashboard: 'Dashboard',
    residents: 'Residents',
    staff: 'Staff',
    shifts: 'Shifts',
    residentsCount: 'Residents',
    staffCount: 'Staff Members',
    todayShifts: "Today's Shifts",
    todaySchedule: "Today's Schedule",
    noShiftsToday: 'No shifts scheduled for today',
    staffLabel: 'Staff',
    noStaffAssigned: 'No staff assigned',
    addResident: 'Add Resident',
    addStaff: 'Add Staff',
    addShift: 'Add Shift',
    editResident: 'Edit',
    newResident: 'New',
    resident: 'Resident',
    editStaff: 'Edit',
    newStaff: 'New',
    staffMember: 'Staff Member',
    editShift: 'Edit',
    newShift: 'New',
    shift: 'Shift',
    name: 'Name',
    required: '*',
    room: 'Room',
    roomNumber: 'Room number',
    condition: 'Condition',
    conditionPlaceholder: 'e.g., Alzheimer\'s, Dementia',
    specialNeeds: 'Special Needs',
    specialNeedsPlaceholder: 'Dietary, mobility, etc.',
    role: 'Role',
    rolePlaceholder: 'e.g., Caregiver, Nurse',
    phone: 'Phone',
    contactNumber: 'Contact number',
    date: 'Date',
    startTime: 'Start Time',
    endTime: 'End Time',
    assignStaff: 'Assign Staff',
    notes: 'Notes',
    notesPlaceholder: 'Any special notes for this shift...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    loading: 'Loading...',
    noResidents: 'No residents yet. Click "Add Resident" to get started.',
    noStaff: 'No staff members yet. Click "Add Staff" to get started.',
    noShifts: 'No shifts scheduled yet. Click "Add Shift" to get started.',
    deleteConfirmResident: 'Are you sure you want to delete this resident?',
    deleteConfirmStaff: 'Are you sure you want to delete this staff member?',
    deleteConfirmShift: 'Are you sure you want to delete this shift?',
    enterName: 'Please enter a name',
    needStaffFirst: '⚠️ You need to add staff members first before creating shifts. Go to the Staff tab to add them.',
    fullName: 'Full name',
    unknown: 'Unknown',
    installPrompt: '💡 Add this app to your iPhone Home Screen for quick access!',
    installInstructions: 'In Safari: tap the Share button (square with arrow) → "Add to Home Screen"',
    gotIt: 'Got it'
  }
};

const CareHomeManager: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'residents' | 'staff' | 'shifts'>('dashboard');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [language, setLanguage] = useState<'it' | 'en'>('it');
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  const t = translations[language];

  // Load data on mount
  useEffect(() => {
    loadData();
    setupPWA();
  }, []);

  const setupPWA = () => {
    // Set document title
    document.title = 'La Casa di Sara';
    
    // Add PWA meta tags
    const metaTags = [
      { name: 'application-name', content: 'La Casa di Sara' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'La Casa di Sara' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'theme-color', content: '#9333ea' }
    ];

    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    });

    // Create and add manifest
    const manifest = {
      name: 'La Casa di Sara',
      short_name: 'Casa Sara',
      description: 'Gestione Casa di Riposo per Sara',
      start_url: window.location.href,
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#9333ea',
      icons: [
        {
          src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect fill="%239333ea" width="200" height="200" rx="40"/><text x="100" y="140" font-size="120" text-anchor="middle" fill="white" font-family="Arial">🏠</text></svg>',
          sizes: '512x512',
          type: 'image/svg+xml'
        }
      ]
    };

    const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const manifestURL = URL.createObjectURL(manifestBlob);
    
    let link = document.querySelector('link[rel="manifest"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'manifest';
      document.head.appendChild(link);
    }
    link.href = manifestURL;

    // Add apple touch icon
    let appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleIcon) {
      appleIcon = document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      document.head.appendChild(appleIcon);
    }
    appleIcon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect fill="%239333ea" width="200" height="200" rx="40"/><text x="100" y="140" font-size="120" text-anchor="middle" fill="white" font-family="Arial">🏠</text></svg>';
  };

  const loadData = async () => {
    try {
      const result = await window.storage.get('care-home-data');
      if (result && result.value) {
        const data: AppData = JSON.parse(result.value);
        setResidents(data.residents || []);
        setStaff(data.staff || []);
        setShifts(data.shifts || []);
        setLanguage(data.language as 'it' | 'en' || 'it');
      }
    } catch (error) {
      console.log('No existing data, starting fresh');
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    try {
      const data: AppData = { residents, staff, shifts, language };
      await window.storage.set('care-home-data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  // Auto-save whenever data changes
  useEffect(() => {
    if (!loading) {
      saveData();
    }
  }, [residents, staff, shifts, language]);

  // Resident functions
  const addResident = () => {
    const newResident: Resident = {
      id: Date.now().toString(),
      name: '',
      condition: '',
      room: '',
      specialNeeds: ''
    };
    setEditingResident(newResident);
  };

  const saveResident = () => {
    if (editingResident) {
      if (!editingResident.name.trim()) {
        alert(t.enterName);
        return;
      }
      const exists = residents.find(r => r.id === editingResident.id);
      if (exists) {
        setResidents(residents.map(r => r.id === editingResident.id ? editingResident : r));
      } else {
        setResidents([...residents, editingResident]);
      }
      setEditingResident(null);
    }
  };

  const deleteResident = (id: string) => {
    if (confirm(t.deleteConfirmResident)) {
      setResidents(residents.filter(r => r.id !== id));
    }
  };

  // Staff functions
  const addStaff = () => {
    const newStaff: Staff = {
      id: Date.now().toString(),
      name: '',
      role: '',
      phone: ''
    };
    setEditingStaff(newStaff);
  };

  const saveStaff = () => {
    if (editingStaff) {
      if (!editingStaff.name.trim()) {
        alert(t.enterName);
        return;
      }
      const exists = staff.find(s => s.id === editingStaff.id);
      if (exists) {
        setStaff(staff.map(s => s.id === editingStaff.id ? editingStaff : s));
      } else {
        setStaff([...staff, editingStaff]);
      }
      setEditingStaff(null);
    }
  };

  const deleteStaff = (id: string) => {
    if (confirm(t.deleteConfirmStaff)) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  // Shift functions
  const addShift = () => {
    const today = new Date().toISOString().split('T')[0];
    const newShift: Shift = {
      id: Date.now().toString(),
      date: today,
      startTime: '08:00',
      endTime: '16:00',
      staffIds: [],
      notes: ''
    };
    setEditingShift(newShift);
  };

  const saveShift = () => {
    if (editingShift) {
      const exists = shifts.find(s => s.id === editingShift.id);
      if (exists) {
        setShifts(shifts.map(s => s.id === editingShift.id ? editingShift : s));
      } else {
        setShifts([...shifts, editingShift]);
      }
      setEditingShift(null);
    }
  };

  const deleteShift = (id: string) => {
    if (confirm(t.deleteConfirmShift)) {
      setShifts(shifts.filter(s => s.id !== id));
    }
  };

  const toggleStaffInShift = (staffId: string) => {
    if (editingShift) {
      const isAssigned = editingShift.staffIds.includes(staffId);
      setEditingShift({
        ...editingShift,
        staffIds: isAssigned
          ? editingShift.staffIds.filter(id => id !== staffId)
          : [...editingShift.staffIds, staffId]
      });
    }
  };

  // Get today's shifts
  const getTodayShifts = () => {
    const today = new Date().toISOString().split('T')[0];
    return shifts.filter(s => s.date === today).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getStaffName = (staffId: string) => {
    return staff.find(s => s.id === staffId)?.name || t.unknown;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Home className="text-purple-600" />
                {t.appTitle}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{t.appSubtitle}</p>
            </div>
            <button
              onClick={() => setLanguage(language === 'it' ? 'en' : 'it')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Languages size={18} />
              <span className="font-medium">{language === 'it' ? 'IT' : 'EN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Install Banner */}
      {showInstallBanner && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold mb-1">{t.installPrompt}</p>
                <p className="text-sm text-purple-100">{t.installInstructions}</p>
              </div>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                {t.gotIt}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: t.dashboard, icon: Home },
              { id: 'residents', label: t.residents, icon: Users },
              { id: 'staff', label: t.staff, icon: UserPlus },
              { id: 'shifts', label: t.shifts, icon: Calendar }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                  activeView === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Dashboard */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{residents.length}</div>
                    <div className="text-sm text-gray-500">{t.residentsCount}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <UserPlus className="text-green-600" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{staff.length}</div>
                    <div className="text-sm text-gray-500">{t.staffCount}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Clock className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{getTodayShifts().length}</div>
                    <div className="text-sm text-gray-500">{t.todayShifts}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.todaySchedule}</h2>
              {getTodayShifts().length === 0 ? (
                <p className="text-gray-500">{t.noShiftsToday}</p>
              ) : (
                <div className="space-y-3">
                  {getTodayShifts().map(shift => (
                    <div key={shift.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-gray-800">
                            {shift.startTime} - {shift.endTime}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {t.staffLabel}: {shift.staffIds.length > 0 
                              ? shift.staffIds.map(getStaffName).join(', ')
                              : t.noStaffAssigned}
                          </div>
                          {shift.notes && (
                            <div className="text-sm text-gray-500 mt-1">{shift.notes}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Residents */}
        {activeView === 'residents' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t.residents}</h2>
              <button
                onClick={addResident}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
                {t.addResident}
              </button>
            </div>

            {editingResident && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {residents.find(r => r.id === editingResident.id) ? t.editResident : t.newResident} {t.resident}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.name} {t.required}</label>
                    <input
                      type="text"
                      value={editingResident.name}
                      onChange={(e) => setEditingResident({...editingResident, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={t.fullName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.room}</label>
                    <input
                      type="text"
                      value={editingResident.room}
                      onChange={(e) => setEditingResident({...editingResident, room: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={t.roomNumber}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.condition}</label>
                    <input
                      type="text"
                      value={editingResident.condition}
                      onChange={(e) => setEditingResident({...editingResident, condition: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={t.conditionPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.specialNeeds}</label>
                    <input
                      type="text"
                      value={editingResident.specialNeeds}
                      onChange={(e) => setEditingResident({...editingResident, specialNeeds: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={t.specialNeedsPlaceholder}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={saveResident}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
                  >
                    <Save size={18} />
                    {t.save}
                  </button>
                  <button
                    onClick={() => setEditingResident(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-400 transition-colors"
                  >
                    <X size={18} />
                    {t.cancel}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {residents.map(resident => (
                <div key={resident.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{resident.name}</h3>
                      {resident.room && (
                        <p className="text-sm text-gray-600 mt-1">{t.room}: {resident.room}</p>
                      )}
                      {resident.condition && (
                        <p className="text-sm text-gray-600">{t.condition}: {resident.condition}</p>
                      )}
                      {resident.specialNeeds && (
                        <p className="text-sm text-gray-500 mt-2">{resident.specialNeeds}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingResident(resident)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteResident(resident.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {residents.length === 0 && !editingResident && (
              <div className="text-center py-12 text-gray-500">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>{t.noResidents}</p>
              </div>
            )}
          </div>
        )}

        {/* Staff */}
        {activeView === 'staff' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t.staff}</h2>
              <button
                onClick={addStaff}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
                {t.addStaff}
              </button>
            </div>

            {editingStaff && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {staff.find(s => s.id === editingStaff.id) ? t.editStaff : t.newStaff} {t.staffMember}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.name} {t.required}</label>
                    <input
                      type="text"
                      value={editingStaff.name}
                      onChange={(e) => setEditingStaff({...editingStaff, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={t.fullName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.role}</label>
                    <input
                      type="text"
                      value={editingStaff.role}
                      onChange={(e) => setEditingStaff({...editingStaff, role: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={t.rolePlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                    <input
                      type="tel"
                      value={editingStaff.phone}
                      onChange={(e) => setEditingStaff({...editingStaff, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={t.contactNumber}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={saveStaff}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
                  >
                    <Save size={18} />
                    {t.save}
                  </button>
                  <button
                    onClick={() => setEditingStaff(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-400 transition-colors"
                  >
                    <X size={18} />
                    {t.cancel}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staff.map(member => (
                <div key={member.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{member.name}</h3>
                      {member.role && (
                        <p className="text-sm text-gray-600 mt-1">{member.role}</p>
                      )}
                      {member.phone && (
                        <p className="text-sm text-gray-500 mt-2">📞 {member.phone}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingStaff(member)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteStaff(member.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {staff.length === 0 && !editingStaff && (
              <div className="text-center py-12 text-gray-500">
                <UserPlus size={48} className="mx-auto mb-4 opacity-50" />
                <p>{t.noStaff}</p>
              </div>
            )}
          </div>
        )}

        {/* Shifts */}
        {activeView === 'shifts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t.shifts}</h2>
              <button
                onClick={addShift}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
                {t.addShift}
              </button>
            </div>

            {staff.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  {t.needStaffFirst}
                </p>
              </div>
            )}

            {editingShift && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {shifts.find(s => s.id === editingShift.id) ? t.editShift : t.newShift} {t.shift}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.date}</label>
                    <input
                      type="date"
                      value={editingShift.date}
                      onChange={(e) => setEditingShift({...editingShift, date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.startTime}</label>
                    <input
                      type="time"
                      value={editingShift.startTime}
                      onChange={(e) => setEditingShift({...editingShift, startTime: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.endTime}</label>
                    <input
                      type="time"
                      value={editingShift.endTime}
                      onChange={(e) => setEditingShift({...editingShift, endTime: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.assignStaff}</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {staff.map(member => (
                      <label
                        key={member.id}
                        className="flex items-center gap-2 border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={editingShift.staffIds.includes(member.id)}
                          onChange={() => toggleStaffInShift(member.id)}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                        />
                        <div>
                          <div className="font-medium text-gray-800">{member.name}</div>
                          {member.role && (
                            <div className="text-xs text-gray-500">{member.role}</div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.notes}</label>
                  <textarea
                    value={editingShift.notes}
                    onChange={(e) => setEditingShift({...editingShift, notes: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder={t.notesPlaceholder}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={saveShift}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
                  >
                    <Save size={18} />
                    {t.save}
                  </button>
                  <button
                    onClick={() => setEditingShift(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-400 transition-colors"
                  >
                    <X size={18} />
                    {t.cancel}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {shifts
                .sort((a, b) => {
                  const dateCompare = b.date.localeCompare(a.date);
                  if (dateCompare !== 0) return dateCompare;
                  return a.startTime.localeCompare(b.startTime);
                })
                .map(shift => (
                  <div key={shift.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-800">
                            {new Date(shift.date + 'T00:00:00').toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="text-gray-600">
                            {shift.startTime} - {shift.endTime}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {t.staffLabel}: {shift.staffIds.length > 0 
                            ? shift.staffIds.map(getStaffName).join(', ')
                            : t.noStaffAssigned}
                        </div>
                        {shift.notes && (
                          <div className="text-sm text-gray-500 mt-2 italic">{shift.notes}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingShift(shift)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteShift(shift.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {shifts.length === 0 && !editingShift && (
              <div className="text-center py-12 text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>{t.noShifts}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareHomeManager;