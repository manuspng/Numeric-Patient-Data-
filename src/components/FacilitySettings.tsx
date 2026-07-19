import React, { useState, useEffect } from "react";
import { SlidersHorizontal, Info, ShieldCheck, DollarSign, ArrowRight } from "lucide-react";
import { UserProfile } from "../types";
import { getComponentTheme } from "../utils/theme";

interface FacilitySettingsProps {
  user: UserProfile;
  hospitalId: string;
  hospitalName: string;
  onSuccessToast: (msg: { title: string; content: string }) => void;
}

export const FacilitySettings: React.FC<FacilitySettingsProps> = ({
  user,
  hospitalId,
  hospitalName,
  onSuccessToast,
}) => {
  const ct = getComponentTheme(user.role);
  const [opdRate, setOpdRate] = useState<number>(5);
  const [ipdRate, setIpdRate] = useState<number>(10);
  const [hasIpd, setHasIpd] = useState<boolean>(true);
  const [hasPanchkarma, setHasPanchkarma] = useState<boolean>(true);
  const [alwaysAllowInventoryEdit, setAlwaysAllowInventoryEdit] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing settings on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`facility-settings-${hospitalId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setOpdRate(parsed.opd_levy_rate !== undefined ? Number(parsed.opd_levy_rate) : 5);
        setIpdRate(parsed.ipd_levy_rate !== undefined ? Number(parsed.ipd_levy_rate) : 10);
      } else {
        setOpdRate(5);
        setIpdRate(10);
      }

      const savedIpd = localStorage.getItem(`facility-has-ipd-${hospitalId}`);
      setHasIpd(savedIpd !== null ? savedIpd === "true" : true);

      const savedPk = localStorage.getItem(`facility-has-panchkarma-${hospitalId}`);
      setHasPanchkarma(savedPk !== null ? savedPk === "true" : true);

      const savedInvEdit = localStorage.getItem(`facility-always-allow-inventory-edit-${hospitalId}`);
      setAlwaysAllowInventoryEdit(savedInvEdit !== null ? savedInvEdit === "true" : false);
    } catch (e) {
      console.warn("Failed to load facility settings", e);
      setOpdRate(5);
      setIpdRate(10);
      setHasIpd(true);
      setHasPanchkarma(true);
      setAlwaysAllowInventoryEdit(false);
    }
  }, [hospitalId]);

  const handleSave = () => {
    setIsSaving(true);
    try {
      const settings = {
        opd_levy_rate: opdRate,
        ipd_levy_rate: ipdRate,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(`facility-settings-${hospitalId}`, JSON.stringify(settings));
      localStorage.setItem(`facility-has-ipd-${hospitalId}`, String(hasIpd));
      localStorage.setItem(`facility-has-panchkarma-${hospitalId}`, String(hasPanchkarma));
      localStorage.setItem(`facility-always-allow-inventory-edit-${hospitalId}`, String(alwaysAllowInventoryEdit));
      
      setTimeout(() => {
        setIsSaving(false);
        onSuccessToast({
          title: "🔧 Settings Saved Successfully",
          content: `Levy rates and active departments updated. Daily entry panels will dynamically adapt to these configurations.`,
        });
      }, 500);
    } catch (e) {
      console.error("Failed to save facility settings", e);
      setIsSaving(false);
    }
  };

  const rateOptions = [0, 5, 10, 15, 20];

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="facility-settings-tab-view">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10 border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] tracking-widest font-extrabold text-amber-400 uppercase block mb-1">
            System Configuration
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
            Facility Settings & Parameters
          </h2>
          <p className="text-xs text-emerald-100/80 max-w-xl font-medium leading-relaxed text-justify">
            Manage long-term hospital configuration properties for <span className="text-white font-bold underline decoration-amber-400">{hospitalName}</span>. These values rarely change (e.g. revised once in years) and are decoupled from your daily logs. Note: Levy rates should be only revised by the order of higher authorities; before starting entry data, please confirm the levy rates and select the appropriate option accordingly.
          </p>
        </div>
        <div className="w-12 h-12 bg-emerald-700/50 rounded-2xl flex items-center justify-center border border-emerald-600 shrink-0">
          <SlidersHorizontal className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className={`md:col-span-3 bg-white border ${ct.cardBorder} rounded-3xl p-6 sm:p-8 shadow-sm space-y-6`}>
          <h3 className={`text-xs font-black text-slate-400 uppercase tracking-widest border-b ${ct.cardBorder} pb-3`}>
            Levy Rate Configuration
          </h3>

          <div className="space-y-6">
            {/* OPD Rate selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${ct.accentText.replace('text-', 'bg-')}`}></span>
                  OPD Levy Rate (नवीन रोगी)
                </label>
                <span className={`text-xs font-black font-mono ${ct.accentText} ${ct.badgeBg} px-2.5 py-0.5 rounded-full`}>
                  ₹{opdRate} / card
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Select the government fee charged per newly registered OPD card.
              </p>
              
              <div className="grid grid-cols-5 gap-2">
                {rateOptions.map((rate) => (
                  <button
                    key={`opd-opt-${rate}`}
                    type="button"
                    onClick={() => setOpdRate(rate)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      opdRate === rate
                        ? `${ct.buttonBg} text-white border-current shadow-md scale-102`
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    ₹{rate}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1.5">
                <span className="text-xs font-medium text-slate-500">Custom Rate:</span>
                <div className="relative w-28">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={opdRate}
                    onChange={(e) => setOpdRate(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-6 pr-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-current/15 focus:border-current outline-none"
                  />
                </div>
              </div>
            </div>

            {/* IPD Rate selector */}
            <div className={`space-y-3 pt-4 border-t ${ct.cardBorder}`}>
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${ct.accentText.replace('text-', 'bg-')}`}></span>
                  IPD Levy Rate (नवीन रोगी भर्ती)
                </label>
                <span className={`text-xs font-black font-mono ${ct.accentText} ${ct.badgeBg} px-2.5 py-0.5 rounded-full`}>
                  ₹{ipdRate} / admission
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Select the government fee charged per newly admitted IPD patient.
              </p>

              <div className="grid grid-cols-5 gap-2">
                {rateOptions.map((rate) => (
                  <button
                    key={`ipd-opt-${rate}`}
                    type="button"
                    onClick={() => setIpdRate(rate)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      ipdRate === rate
                        ? `${ct.buttonBg} text-white border-current shadow-md scale-102`
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    ₹{rate}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1.5">
                <span className="text-xs font-medium text-slate-500">Custom Rate:</span>
                <div className="relative w-28">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={ipdRate}
                    onChange={(e) => setIpdRate(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-6 pr-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-current/15 focus:border-current outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Active Departments & Capabilities */}
            <div className={`space-y-4 pt-6 border-t ${ct.cardBorder}`} id="active-departments-config-section">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Active Facility Departments
                </label>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Toggle which departments are active in your hospital. Inactive departments will be hidden from your Daily Log entries to optimize your workspace.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* IPD Toggle Card */}
                <div className={`p-4 border rounded-2xl transition-all duration-200 ${
                  hasIpd 
                    ? `${ct.subSectionBg} shadow-xs` 
                    : "bg-slate-50/50 border-slate-200/60"
                }`}>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                      Inpatient Dept (IPD)
                    </span>
                    <button
                      type="button"
                      onClick={() => setHasIpd(!hasIpd)}
                      className={`${
                        hasIpd ? ct.accentText.replace('text-', 'bg-') : 'bg-slate-200'
                      } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                    >
                      <span
                        className={`${
                          hasIpd ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Enables admissions logging, IPD breakdown, and dynamic IPD levy calculations on the daily log entry.
                  </p>
                </div>

                {/* Panchkarma Toggle Card */}
                <div className={`p-4 border rounded-2xl transition-all duration-200 ${
                  hasPanchkarma 
                    ? `${ct.subSectionBg} shadow-xs` 
                    : "bg-slate-50/50 border-slate-200/60"
                }`}>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                      Panchkarma Dept
                    </span>
                    <button
                      type="button"
                      onClick={() => setHasPanchkarma(!hasPanchkarma)}
                      className={`${
                        hasPanchkarma ? ct.accentText.replace('text-', 'bg-') : 'bg-slate-200'
                      } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                    >
                      <span
                        className={`${
                          hasPanchkarma ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Enables Panchkarma gender-wise counts, procedure counters, and manual procedure levy tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Inventory & Stock Settings */}
            <div className={`space-y-4 pt-6 border-t ${ct.cardBorder}`} id="inventory-stock-rule-config-section">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${ct.accentText.replace('text-', 'bg-')}`}></span>
                  Inventory & Stock Settings
                </label>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                To maintain strict inventory auditing, opening balance values are normally only editable in the month of April (the start of the financial year). Toggle the switch below to allow manual override edits in any month of the year.
              </p>

              <div className={`p-4 border rounded-2xl transition-all duration-200 ${
                alwaysAllowInventoryEdit 
                  ? `${ct.subSectionBg} shadow-xs` 
                  : "bg-slate-50/50 border-slate-200/60"
              }`}>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                      Always Allow Stock Balance Edits
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      सत्र के बीच प्रारंभिक स्टॉक संपादन की अनुमति दें
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAlwaysAllowInventoryEdit(!alwaysAllowInventoryEdit)}
                    className={`${
                      alwaysAllowInventoryEdit ? ct.accentText.replace('text-', 'bg-') : 'bg-slate-200'
                    } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                  >
                    <span
                      className={`${
                        alwaysAllowInventoryEdit ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  When enabled, opening balances of diagnostic kits can be modified at any time. When disabled, they can only be changed for entries recorded in the month of April.
                </p>
              </div>
            </div>
          </div>

          <div className={`pt-6 border-t ${ct.cardBorder} flex justify-end`}>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`${ct.buttonBg} disabled:opacity-50 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg shadow-current/15 transition-all flex items-center gap-2 cursor-pointer`}
            >
              {isSaving ? "Saving Config..." : "Save Settings & Update Rates"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
