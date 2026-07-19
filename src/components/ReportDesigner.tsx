/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { getComponentTheme } from "../utils/theme";
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  HelpCircle,
  Settings,
  Table,
  Layers,
  ArrowRight,
  BookOpen,
  Users,
  Activity,
  TrendingUp,
  HeartHandshake,
  Thermometer,
  Eye,
  Pencil,
  X,
  Info
} from "lucide-react";
import * as XLSX from "xlsx";
import { CustomReportTemplate, CustomReportField, CellMapping, UserProfile, UserRole } from "../types";
import PremiumReportModal from "./PremiumReportModal";

const SYSTEM_METRICS = [
  { id: "opd_male_new", name: "OPD Male - New" },
  { id: "opd_male_old", name: "OPD Male - Old" },
  { id: "opd_female_new", name: "OPD Female - New" },
  { id: "opd_female_old", name: "OPD Female - Old" },
  { id: "opd_child_new", name: "OPD Children - New" },
  { id: "opd_child_old", name: "OPD Children - Old" },
  { id: "opd_elderly_new", name: "OPD Elderly - New" },
  { id: "opd_elderly_old", name: "OPD Elderly - Old" },
  { id: "opd_total", name: "OPD Total Outpatients" },
  { id: "ipd_admissions", name: "IPD Total Admissions" },
  { id: "ipd_male_new", name: "IPD Male Admissions - New" },
  { id: "ipd_male_old", name: "IPD Male Admissions - Old" },
  { id: "ipd_female_new", name: "IPD Female Admissions - New" },
  { id: "ipd_female_old", name: "IPD Female Admissions - Old" },
  { id: "ipd_child_new", name: "IPD Child Admissions - New" },
  { id: "ipd_child_old", name: "IPD Child Admissions - Old" },
  { id: "ipd_bed_occupancy_percentage", name: "IPD Bed Occupancy %" },
  { id: "panchkarma_male", name: "Panchkarma - Male" },
  { id: "panchkarma_female", name: "Panchkarma - Female" },
  { id: "panchkarma_child", name: "Panchkarma - Child" },
  { id: "panchkarma_elderly", name: "Panchkarma - Elderly" },
  { id: "levy_charges", name: "Govt Levy Collected (INR)" },
  { id: "aadhaar_seeded_count", name: "Aadhaar Seeded Counts" },
  { id: "mobile_seeded_count", name: "Mobile Seeded Counts" },
  { id: "hemoglobin", name: "Labs - Hemoglobin" },
  { id: "blood_sugar", name: "Labs - Blood Sugar" },
  { id: "urine_sugar", name: "Labs - Urine Sugar" },
  { id: "urine_albumin", name: "Labs - Urine Albumin" },
  { id: "malaria", name: "Labs - Malaria RDT" },
  { id: "dengue", name: "Labs - Dengue" },
  { id: "typhoid", name: "Labs - Typhoid" },
  { id: "hepatitis_a", name: "Labs - Hep A" },
  { id: "hepatitis_b", name: "Labs - Hep B" },
  { id: "hepatitis_c", name: "Labs - Hep C" },
  { id: "pregnancy_tests", name: "Labs - Pregnancy UPT" },
  { id: "outreach_camps_conducted", name: "Camps - Conducted" },
  { id: "camp_beneficiaries_total", name: "Camps - Total Beneficiaries" },
  { id: "camp_medicines_distributed", name: "Camps - Meds Distributed" },
  { id: "camp_ncd_screenings", name: "Camps - NCD Screenings" },
  { id: "camp_ayurvidya_sessions", name: "Camps - Ayurvidya Sessions" }
];

const STANDARD_PROFORMAS = [
  {
    id: "proforma1",
    title: "Monthly Patient Report (Disease Wise)",
    subtitle: "State Facility Administrative Metrics",
    description: "Monthly transmission tracking facility administrative performance and yoga session counts.",
    icon: "BookOpen",
    metricsCount: "16 Core Attributes",
    language: "Hindi & English",
    format: "Govt. of India Standard",
    fields: [
      "Ayushman Arogya Mandir (AAM) details",
      "S.No. & Facility Code",
      "Facility Name (Hospital Name)",
      "Daily Avg OPD Patients",
      "Daily Avg IPD Patients",
      "Special Ayurvedic Procedures",
      "Stock/Availability of Medicines",
      "Yoga Session counts"
    ]
  },
  {
    id: "proforma2",
    title: "Annual Patient Report (Disease Wise)",
    subtitle: "Yearly Performance Consolidation",
    description: "Annual compilation of facility performance metrics and cumulative yearly patient counts.",
    icon: "Users",
    metricsCount: "16 Core Attributes",
    language: "Hindi & English",
    format: "Govt. of India Standard",
    fields: [
      "Ayushman Arogya Mandir (AAM) details",
      "S.No. & Facility Code",
      "Facility Name (Hospital Name)",
      "Daily Avg OPD Patients",
      "Daily Avg IPD Patients",
      "Special Ayurvedic Procedures",
      "Cumulative Annual Patient Counts",
      "Challan / Bank data locked as N/A"
    ]
  },
  {
    id: "camp",
    title: "Outreach & Wellness Camps Register",
    subtitle: "Camp Logs & Beneficiary Tracking",
    description: "Monthly record tracking outreach wellness camps, screenings, and public seminars.",
    icon: "HeartHandshake",
    metricsCount: "Camps, Meds, NCD, Seminars",
    language: "Bilingual (Hindi & English)",
    format: "Uttarakhand State Standard",
    fields: [
      "Number of Outreach Wellness Camps Conducted",
      "Total Camp Beneficiaries (Male, Female, Child)",
      "Free Ayurvedic Medicines Distributed counts",
      "Non-Communicable Diseases (NCD) Screenings",
      "Ayurvidya Public Seminars conducted"
    ]
  },
  {
    id: "testkit",
    title: "Diagnostic Test Kits Stock & Results",
    subtitle: "Hb, Blood Sugar & Vector stock tracking",
    description: "Monthly counts of diagnostic testing kit stock levels and screening results.",
    icon: "Thermometer",
    metricsCount: "Kit Inventory & Validations",
    language: "English",
    format: "National NHM Standard",
    fields: [
      "Hemoglobin (Hb) tests conducted & results",
      "Blood Sugar tests conducted & results",
      "Urine Sugar / Albumin tests conducted & results",
      "Malaria RDT and Dengue RDT tests conducted",
      "Enteric Fever (Typhoid / Hepatitis) tests conducted",
      "Pregnancy tests (UPT) conducted counts"
    ]
  }
];

interface ReportDesignerProps {
  user: UserProfile;
  onSuccessToast: (toast: { title: string; content: string }) => void;
  setActiveTab: (tab: string) => void;
}

export default function ReportDesigner({ user, onSuccessToast, setActiveTab }: ReportDesignerProps) {
  const ct = getComponentTheme(user.role);
  const [templates, setTemplates] = useState<CustomReportTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Gallery tab: official standard templates vs custom spreadsheet templates
  const [galleryTab, setGalleryTab] = useState<"official" | "custom" | "google-sheets">("official");
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  
  // Premium visual sheet preview state
  const [isPremiumPreviewOpen, setIsPremiumPreviewOpen] = useState(false);
  const [premiumPreviewType, setPremiumPreviewType] = useState<"proforma1" | "proforma2" | "mpr" | "apr" | "camp" | "testkit" | null>(null);
  
  // Create / Edit state
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [mappings, setMappings] = useState<CellMapping[]>([]);
  const [customFields, setCustomFields] = useState<CustomReportField[]>([]);
  
  // Excel Sheet Reading Preview State
  const [sheetPreview, setSheetPreview] = useState<string[][]>([]);
  const [sheetName, setSheetName] = useState("");
  const [activeCellRef, setActiveCellRef] = useState("");
  const [selectedMappingField, setSelectedMappingField] = useState("");
  const [isAutoMapping, setIsAutoMapping] = useState(false);

  // Google Sheets Sourcing State
  const [sheetUrl, setSheetUrl] = useState("");
  const [savedSheetUrl, setSavedSheetUrl] = useState("");
  const [isConfirmingDeleteSheet, setIsConfirmingDeleteSheet] = useState(false);
  const [confirmingDeleteTemplateId, setConfirmingDeleteTemplateId] = useState<string | null>(null);
  const [sheetHospitals, setSheetHospitals] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSavingUrl, setIsSavingUrl] = useState(false);

  // New custom field form state
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldCategory, setNewFieldCategory] = useState<any>("opd");
  const [newFieldType, setNewFieldType] = useState<"number" | "text">("number");

  const showError = (title: string, message: string) => {
    onSuccessToast({
      title: `❌ ${title}`,
      content: message
    });
  };

  useEffect(() => {
    fetchTemplates();
    fetchSheetConfig();
  }, []);

  const fetchSheetConfig = async () => {
    try {
      const res = await fetch(`/api/admin/hospitals/sheet-config?t=${Date.now()}`);
      const d = await res.json();
      if (d.success) {
        setSheetUrl(d.url || "");
        setSavedSheetUrl(d.url || "");
      }
    } catch (err) {
      console.error("Error fetching google sheet url config:", err);
    }
  };

  const parseBase64Excel = (base64Str: string) => {
    try {
      const binaryString = atob(base64Str);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const workbook = XLSX.read(bytes, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      setSheetName(firstSheetName);
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1, defval: "" });
      setSheetPreview(json.slice(0, 40)); // preview first 40 rows
    } catch (err) {
      console.error("Error parsing base64 excel", err);
    }
  };

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/templates");
      const d = await res.json();
      if (d.success) {
        setTemplates(d.templates);
      }
    } catch (e) {
      console.error("Failed to load templates", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSheetUrl = async () => {
    if (!sheetUrl) return;
    setIsSavingUrl(true);
    try {
      const res = await fetch("/api/admin/hospitals/sheet-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sheetUrl, adminEmail: user.email })
      });
      const d = await res.json();
      if (d.success) {
        setSavedSheetUrl(sheetUrl);
        onSuccessToast({
          title: "🔗 Spreadsheet Link Saved",
          content: "Google sheet link was safely stored in system configurations."
        });
        // Auto-fetch the latest data to keep the preview dynamically updated
        handleSyncGoogleSheet(true);
      } else {
        showError("Save Failed", d.message || "Failed to save spreadsheet link.");
      }
    } catch (err: any) {
      console.error(err);
      showError("Save Error", err.message || String(err));
    } finally {
      setIsSavingUrl(false);
    }
  };

  const handleDeleteSheetUrl = async () => {
    setIsSavingUrl(true);
    try {
      const res = await fetch(`/api/admin/hospitals/sheet-config?adminEmail=${encodeURIComponent(user.email)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      const d = await res.json();
      if (d.success) {
        setSheetUrl("");
        setSavedSheetUrl("");
        setSheetHospitals([]);
        onSuccessToast({
          title: "🗑️ Spreadsheet Link Removed",
          content: "Google sheet link was successfully deleted from system configurations."
        });
      } else {
        showError("Remove Failed", d.message || "Failed to remove spreadsheet link.");
      }
    } catch (err: any) {
      console.error(err);
      showError("Remove Error", err.message || String(err));
    } finally {
      setIsSavingUrl(false);
    }
  };

  const handleSyncGoogleSheet = async (previewOnly: boolean) => {
    if (!sheetUrl) return;
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/hospitals/sync-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sheetUrl, previewOnly, adminEmail: user.email })
      });
      
      if (!res.ok) {
         const errorText = await res.text();
         throw new Error(errorText || "Internal server error occurred.");
      }

      const d = await res.json();
      if (d.success) {
        setSheetHospitals(d.hospitals || []);
        if (previewOnly) {
          onSuccessToast({
            title: "🔍 Data Fetch Complete",
            content: `Loaded ${d.hospitals?.length || 0} facilities from your shared Google Sheet for preview.`
          });
        } else {
          onSuccessToast({
            title: "🔄 Directory Sync Successful",
            content: d.message || "Uttarakhand Ayush Facility Directory successfully overwritten."
          });
          // Dispatch custom event to trigger real-time updates everywhere
          window.dispatchEvent(new CustomEvent("hospitals-updated"));
        }
      } else {
        showError("Sync Failed", d.message || "Google Sheet sync failed.");
      }
    } catch (err: any) {
      console.error(err);
      showError("Sync Failed", err.message || String(err));
    } finally {
      setIsSyncing(false);
    }
  };

  // Real-time dynamic sync: auto-fetch/sync the Google Sheet preview on tab selection
  useEffect(() => {
    if (galleryTab === "google-sheets" && sheetUrl) {
      handleSyncGoogleSheet(true);
    }
  }, [galleryTab, sheetUrl]);

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    if (!templateName) {
      // Auto populate template name from file name
      setTemplateName(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;

      // Create base64 encoding to upload to server
      let base64 = "";
      if (typeof data === "string") {
        base64 = btoa(data);
      } else {
        const bytes = new Uint8Array(data);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        base64 = btoa(binary);
      }
      setFileBase64(base64);

      // Parse SheetJS preview
      try {
        const arr = new Uint8Array(data as ArrayBuffer);
        const workbook = XLSX.read(arr, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        setSheetName(firstSheetName);
        const worksheet = workbook.Sheets[firstSheetName];

        // Generate a 15x10 preview matrix
        const matrix: string[][] = [];
        const rows = 15;
        const cols = 10;
        
        for (let r = 0; r < rows; r++) {
          const rowData: string[] = [];
          for (let c = 0; c < cols; c++) {
            const cellRef = XLSX.utils.encode_cell({ r, c });
            const cell = worksheet[cellRef];
            rowData.push(cell ? String(cell.v || cell.w || "") : "");
          }
          matrix.push(rowData);
        }
        setSheetPreview(matrix);
      } catch (err) {
        console.error("Error previewing Excel", err);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCellClick = (rIdx: number, cIdx: number, val: string) => {
    const cellRef = XLSX.utils.encode_cell({ r: rIdx, c: cIdx });
    setActiveCellRef(cellRef);
    // Find existing mapping if any
    const existing = mappings.find(m => m.cellRef === cellRef);
    if (existing) {
      setSelectedMappingField(existing.systemField);
    } else {
      setSelectedMappingField("");
    }
  };

  const handleAddManualMapping = () => {
    if (!activeCellRef) {
      alert("Please select a cell from the spreadsheet preview first.");
      return;
    }
    if (!selectedMappingField) {
      alert("Please select a clinical field to map.");
      return;
    }

    setMappings(prev => {
      // Remove any existing mapping for this cell or field to keep it clean
      const filtered = prev.filter(m => m.cellRef !== activeCellRef && m.systemField !== selectedMappingField);
      return [...filtered, {
        sheetName: sheetName || "Sheet1",
        cellRef: activeCellRef,
        systemField: selectedMappingField
      }];
    });

    onSuccessToast({
      title: "📍 Cell Mapped Successfully",
      content: `Linked cell ${activeCellRef} to system field "${getFieldLabel(selectedMappingField)}"`
    });
  };

  const handleRemoveMapping = (cellRef: string) => {
    setMappings(prev => prev.filter(m => m.cellRef !== cellRef));
  };

  const handleAiAutoMap = async () => {
    if (!sheetPreview || sheetPreview.length === 0) {
      alert("Please upload an Excel sheet first.");
      return;
    }

    setIsAutoMapping(true);
    try {
      // Flatten sheet preview into list of cells with labels
      const cellsToSend: Array<{ ref: string; value: string }> = [];
      sheetPreview.forEach((row, rIdx) => {
        row.forEach((val, cIdx) => {
          if (val.trim()) {
            cellsToSend.push({
              ref: XLSX.utils.encode_cell({ r: rIdx, c: cIdx }),
              value: val.trim()
            });
          }
        });
      });

      const res = await fetch("/api/templates/auto-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cells: cellsToSend })
      });
      const d = await res.json();
      if (d.success && d.mappings && d.mappings.length > 0) {
        setMappings(d.mappings);
        onSuccessToast({
          title: "✨ Gemini AI Mapping Completed",
          content: `Automatically mapped ${d.mappings.length} clinical fields in your uploaded spreadsheet proforma.`
        });
      } else {
        alert(d.message || "Gemini could not identify clear mappings from the spreadsheet headers. Please map them manually.");
      }
    } catch (err) {
      console.error(err);
      alert("Auto-mapping failed. Ensure API key is configured.");
    } finally {
      setIsAutoMapping(false);
    }
  };

  const handleAddCustomField = () => {
    const name = newFieldName.trim();
    if (!name) {
      alert("Please enter a custom field name");
      return;
    }

    const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const field: CustomReportField = {
      id,
      name,
      type: newFieldType,
      category: newFieldCategory
    };

    setCustomFields(prev => [...prev, field]);
    setNewFieldName("");

    onSuccessToast({
      title: "📝 Custom Field Defined",
      content: `"${name}" added to custom tracking checklist. It will show up on daily data entries.`
    });
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(f => f.id !== id));
    // Remove mapping if mapping exists for this custom field
    setMappings(prev => prev.filter(m => m.systemField !== id));
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert("Please enter a template name");
      return;
    }
    if (!fileBase64) {
      alert("Please upload a proforma template file (.xlsx/.xls/.csv)");
      return;
    }
    if (mappings.length === 0) {
      alert("Please map at least one cell before saving the template.");
      return;
    }

    setIsLoading(true);
    try {
      const isEditing = !!editingTemplateId;
      const url = isEditing ? `/api/templates/${editingTemplateId}` : "/api/templates";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          fileName: uploadedFileName,
          fileBase64,
          mappings,
          customFields
        })
      });
      const d = await res.json();
      if (d.success) {
        onSuccessToast({
          title: isEditing ? "✏️ Template Updated" : "💾 Template Saved",
          content: isEditing 
            ? `"${templateName}" has been successfully updated.`
            : `"${templateName}" is now active and ready to furnish reports.`
        });
        resetForm();
        fetchTemplates();
      } else {
        alert(d.message || "Failed to save template");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save template");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTemplate = (tpl: CustomReportTemplate) => {
    setIsCreating(true);
    setEditingTemplateId(tpl.id);
    setTemplateName(tpl.name);
    setUploadedFileName(tpl.fileName);
    setFileBase64(tpl.fileBase64);
    setMappings(tpl.mappings || []);
    setCustomFields(tpl.customFields || []);
    
    if (tpl.fileBase64) {
      parseBase64Excel(tpl.fileBase64);
    } else {
      setSheetPreview([]);
      setSheetName("");
    }
    setActiveCellRef("");
    setSelectedMappingField("");
  };

  const handleDeleteTemplate = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) {
        onSuccessToast({
          title: "🗑️ Template Deleted",
          content: "The custom report proforma has been removed from your workspace."
        });
        fetchTemplates();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingTemplateId("");
    setTemplateName("");
    setUploadedFileName("");
    setFileBase64("");
    setMappings([]);
    setCustomFields([]);
    setSheetPreview([]);
    setSheetName("");
    setActiveCellRef("");
    setSelectedMappingField("");
  };

  const getFieldLabel = (fieldId: string) => {
    const std = SYSTEM_METRICS.find(m => m.id === fieldId);
    if (std) return std.name;
    const cust = customFields.find(f => f.id === fieldId);
    if (cust) return `[Custom] ${cust.name}`;
    return fieldId;
  };

  const getColumnLabel = (colIdx: number) => {
    let temp = "";
    let idx = colIdx;
    while (idx >= 0) {
      temp = String.fromCharCode((idx % 26) + 65) + temp;
      idx = Math.floor(idx / 26) - 1;
    }
    return temp;
  };

  const getProformaIcon = (id: string) => {
    switch (id) {
      case "proforma1":
        return <BookOpen className="w-5 h-5 text-emerald-700" />;
      case "proforma2":
        return <Users className="w-5 h-5 text-indigo-700" />;
      case "mpr":
        return <Activity className="w-5 h-5 text-amber-700" />;
      case "apr":
        return <TrendingUp className="w-5 h-5 text-rose-700" />;
      case "camp":
        return <HeartHandshake className="w-5 h-5 text-pink-700" />;
      case "testkit":
        return <Thermometer className="w-5 h-5 text-blue-700" />;
      default:
        return <FileSpreadsheet className="w-5 h-5 text-slate-700" />;
    }
  };

  const getProformaIconBg = (id: string) => {
    switch (id) {
      case "proforma1":
        return "bg-emerald-50 border-emerald-100";
      case "proforma2":
        return "bg-indigo-50 border-indigo-100";
      case "mpr":
        return "bg-amber-50 border-amber-100";
      case "apr":
        return "bg-rose-50 border-rose-100";
      case "camp":
        return "bg-pink-50 border-pink-100";
      case "testkit":
        return "bg-blue-50 border-blue-100";
      default:
        return "bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="space-y-6" id="report-customizer-root">
      
      {/* HEADER SECTION */}
      <div className={`bg-white border ${ct.cardBorder} rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl border border-current/10 ${ct.accentBg}`}>
            <Layers className={`w-6 h-6 ${ct.accentText} animate-spin-slow`} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Government Template & Proforma Gallery</h3>
            <p className="text-xs text-slate-500">Access official AYUSH formats, define custom clinical spreadsheets, and track state wellness parameters</p>
          </div>
        </div>

        {user.role === "SUPER_ADMIN" && !isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className={`${ct.buttonBg} text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all self-start md:self-auto`}
          >
            <Plus className="w-4 h-4" />
            Upload New Proforma Template
          </button>
        ) : isCreating ? (
          <button
            onClick={resetForm}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            Cancel & Go Back
          </button>
        ) : null}
      </div>

      {/* TABS SELECTOR */}
      {!isLoading && !isCreating && (
        <div className={`flex bg-white rounded-2xl p-1.5 border ${ct.cardBorder} shadow-sm max-w-xl`}>
          <button
            onClick={() => setGalleryTab("official")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              galleryTab === "official"
                ? `${ct.buttonBg} text-white shadow-md`
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Official State Proformas</span>
          </button>
          <button
            onClick={() => setGalleryTab("custom")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              galleryTab === "custom"
                ? `${ct.buttonBg} text-white shadow-md`
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Custom Excel Templates</span>
            {templates.length > 0 && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${galleryTab === "custom" ? "bg-white text-slate-800" : "bg-emerald-100 text-emerald-800"}`}>
                {templates.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setGalleryTab("google-sheets")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              galleryTab === "google-sheets"
                ? `${ct.buttonBg} text-white shadow-md`
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Google Sheets Sync</span>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className={`w-10 h-10 ${ct.accentText} animate-spin`} />
          <p className="text-xs font-semibold text-slate-500">Syncing database and configuring mappings...</p>
        </div>
      )}

      {/* RENDER ACTIVE TEMPLATES LIST */}
      {!isLoading && !isCreating && (
        <div>
          {galleryTab === "official" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {STANDARD_PROFORMAS.map((pro) => (
                <div key={pro.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3 hover:shadow-md transition-all flex flex-col justify-between max-w-[260px] w-full">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className={`p-2 rounded-xl border ${getProformaIconBg(pro.id)}`}>
                        {getProformaIcon(pro.id)}
                      </div>
                      <span className="bg-emerald-50 text-emerald-800 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-100/60">
                        Official State Format
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-slate-900 text-xs tracking-tight">{pro.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold">{pro.subtitle}</p>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-normal min-h-[32px] line-clamp-2">
                      {pro.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setPremiumPreviewType(pro.id as any);
                        setIsPremiumPreviewOpen(true);
                      }}
                      className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-[11px] py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      Visual Sheet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : galleryTab === "custom" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {templates.length === 0 ? (
                <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3 shadow-sm max-w-lg mx-auto w-full">
                  <div className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-xl mx-auto flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 text-xs">No Custom Spreadsheet Templates Found</h4>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      {user.role === "SUPER_ADMIN" 
                        ? "Upload your official state report format as a .xlsx spreadsheet to define custom metric cell-mappings." 
                        : "Custom templates designed by super administrators will appear here."}
                    </p>
                  </div>
                  {user.role === "SUPER_ADMIN" && (
                    <button
                      onClick={() => setIsCreating(true)}
                      className="bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs px-3.5 py-2 rounded-lg"
                    >
                      Upload First Custom Template
                    </button>
                  )}
                </div>
              ) : (
                templates.map((tpl) => (
                  <div key={tpl.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3 hover:shadow-md transition-all flex flex-col justify-between max-w-[260px] w-full">
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full text-[8px] font-black uppercase border border-amber-100">
                          Custom Spreadsheet
                        </div>
                        {user.role === "SUPER_ADMIN" && (
                          <div className="flex items-center gap-1.5">
                            {confirmingDeleteTemplateId === tpl.id ? (
                              <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-lg p-1 shrink-0 animate-fade-in">
                                <span className="text-[8px] text-rose-700 font-extrabold px-1">Delete?</span>
                                <button
                                  onClick={() => {
                                    setConfirmingDeleteTemplateId(null);
                                    handleDeleteTemplate(tpl.id);
                                  }}
                                  className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded transition-all"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setConfirmingDeleteTemplateId(null)}
                                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[8px] px-1.5 py-0.5 rounded transition-all"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEditTemplate(tpl)}
                                  className="text-emerald-700 hover:text-emerald-900 p-1 rounded-md hover:bg-emerald-50 transition-colors"
                                  title="Edit Template & Mappings"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setConfirmingDeleteTemplateId(tpl.id)}
                                  className="text-rose-600 hover:text-rose-800 p-1 rounded-md hover:bg-rose-50 transition-colors"
                                  title="Delete Template"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="font-extrabold text-slate-900 text-xs line-clamp-1">{tpl.name}</h4>
                        <p className="text-[9px] font-mono text-slate-400 truncate">{tpl.fileName}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1.5 text-[9px] font-bold text-slate-600 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-lg p-1.5">
                          <span className="text-[7px] text-slate-400 uppercase font-bold block mb-0.5">Cell Mappings</span>
                          {tpl.mappings?.length || 0} Cells
                        </div>
                        <div className="bg-slate-50 rounded-lg p-1.5">
                          <span className="text-[7px] text-slate-400 uppercase font-bold block mb-0.5">Custom Fields</span>
                          {tpl.customFields?.length || 0} Fields
                        </div>
                      </div>

                      {tpl.customFields && tpl.customFields.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[7px] text-slate-400 uppercase font-bold block">Extra Parameters Tracked:</span>
                          <div className="flex flex-wrap gap-1">
                            {tpl.customFields.map(f => (
                              <span key={f.id} className="bg-slate-100 text-slate-700 text-[8px] px-1.5 py-0.5 rounded-full font-semibold border border-slate-200/50">
                                {f.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-medium">
                      <span>Preserved Date</span>
                      <span>{new Date(tpl.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Info Card */}
              <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 shadow-md space-y-4 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 bg-white/5 w-48 h-48 rounded-full pointer-events-none" />
                <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 bg-white/5 w-36 h-36 rounded-full pointer-events-none" />
                
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/20 shrink-0">
                    <Table className="w-6 h-6 text-emerald-200" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-base tracking-tight">Dropdown Options Pool Preview (ड्रॉपडाउन विकल्प सूची पूर्वावलोकन)</h4>
                    <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl font-medium">
                      Centralize and maintain your facility directory on a Google Spreadsheet. S.No, Contact Information, Streams, Blocks, and Active status will update in real-time across the Uttarakhand Ayush MPR system once synchronized.
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-900/50 border border-emerald-700/60 rounded-2xl p-4 text-[11px] space-y-2">
                  <span className="font-black uppercase tracking-wider block text-emerald-300">💡 Sheet Guidelines</span>
                  <ul className="list-disc pl-4 space-y-1 text-emerald-100/95 font-medium">
                    <li>Create headers in the first row matching standard fields: <code className="bg-emerald-950/40 px-1 py-0.5 rounded text-emerald-300 font-bold">name</code>, <code className="bg-emerald-950/40 px-1 py-0.5 rounded text-emerald-300 font-bold">code</code>, <code className="bg-emerald-950/40 px-1 py-0.5 rounded text-emerald-300 font-bold">type</code>, <code className="bg-emerald-950/40 px-1 py-0.5 rounded text-emerald-300 font-bold">contactEmail</code>, <code className="bg-emerald-950/40 px-1 py-0.5 rounded text-emerald-300 font-bold">contactPhone</code>, <code className="bg-emerald-950/40 px-1 py-0.5 rounded text-emerald-300 font-bold">location</code>, <code className="bg-emerald-950/40 px-1 py-0.5 rounded text-emerald-300 font-bold">block</code>.</li>
                    <li>Ensure the spreadsheet is shared with <strong className="text-emerald-300 font-bold">"Anyone with link can view"</strong> so the system can parse the data.</li>
                  </ul>
                </div>
              </div>

              {/* Link pasting and action row */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                    Google Spreadsheet URL / Link
                  </label>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Paste the full web browser link of your Google Sheets document below:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0"
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-2xl px-4 py-3 text-xs text-slate-800 font-semibold outline-none transition-all placeholder:text-slate-400"
                    />
                    <button
                      onClick={handleSaveSheetUrl}
                      disabled={isSavingUrl || !sheetUrl}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 rounded-2xl border border-slate-200/80 transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                    >
                      {isSavingUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Link"}
                    </button>
                    {savedSheetUrl && (
                      <div className="relative flex items-center gap-1.5 shrink-0 animate-fade-in">
                        {isConfirmingDeleteSheet ? (
                          <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded-2xl p-1 pr-2">
                            <span className="text-[10px] text-rose-700 font-extrabold px-2">Delete link?</span>
                            <button
                              onClick={() => {
                                setIsConfirmingDeleteSheet(false);
                                handleDeleteSheetUrl();
                              }}
                              disabled={isSavingUrl}
                              className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-xl transition-all"
                            >
                              Yes, Remove
                            </button>
                            <button
                              onClick={() => setIsConfirmingDeleteSheet(false)}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[10px] px-3 py-1.5 rounded-xl transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsConfirmingDeleteSheet(true)}
                            disabled={isSavingUrl}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-4 py-2.5 rounded-2xl border border-rose-200/80 transition-all flex items-center gap-1.5"
                            title="Remove Google Sheet Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove Link
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100 justify-between items-center">
                  <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    Updates apply to all analytical aggregations and proforma spreadsheets.
                  </div>
                  
                  <div className="flex gap-2.5">
                    {user.role === "SUPER_ADMIN" ? (
                      <button
                        onClick={() => handleSyncGoogleSheet(false)}
                        disabled={isSyncing || !sheetUrl}
                        className="bg-emerald-800 hover:bg-emerald-950 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
                      >
                        {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-4 h-4 text-emerald-200" />}
                        Apply & Sync Directory
                      </button>
                    ) : (
                      <span className="text-[11px] text-rose-600 bg-rose-50 border border-rose-100 font-bold px-3 py-1.5 rounded-xl">
                        ⚠️ Sync permission restricted to Super Administrators
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              {sheetHospitals.length > 0 && (() => {
                const uniqueTypes = Array.from(new Set(sheetHospitals.map(h => h.type).filter(Boolean))).sort();
                const uniqueLocations = Array.from(new Set(sheetHospitals.map(h => h.location).filter(Boolean))).sort();
                const uniqueStreams = Array.from(new Set(sheetHospitals.map(h => h.stream).filter(Boolean))).sort();
                const uniqueBlocks = Array.from(new Set(sheetHospitals.map(h => h.block).filter(Boolean))).sort();
                const uniqueDistricts = Array.from(new Set(sheetHospitals.map(h => h.district).filter(Boolean))).sort();
                const uniqueEmails = Array.from(new Set(sheetHospitals.map(h => h.contactEmail).filter(Boolean))).sort();
                const uniqueCategories = Array.from(new Set(sheetHospitals.map(h => h.category).filter(Boolean))).sort();

                return (
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 uppercase">
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                          Dropdown Options Pool Preview (ड्रॉपडाउन विकल्प सूची पूर्वावलोकन)
                        </h4>
                        <p className="text-[11px] text-slate-500 font-semibold mt-1 max-w-2xl leading-relaxed">
                          Each column in the linked Google Sheet acts as an independent repository of options for the registration form dropdowns. Duplicate options have been automatically filtered out. Rows and adjacent cells do not have logical horizontal relationships.
                        </p>
                      </div>
                      <button
                        onClick={() => setSheetHospitals([])}
                        className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Options Categories Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Hospital Category Options */}
                      <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 flex flex-col space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                              <Sparkles className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="block font-extrabold text-slate-800 text-xs">Hospital Category</span>
                              <span className="block text-[9px] text-slate-400 font-bold uppercase">चिकित्सालय श्रेणी</span>
                            </div>
                          </div>
                          <span className="bg-emerald-100/80 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-black">
                            {uniqueCategories.length}
                          </span>
                        </div>
                        <div className="flex-1 max-h-48 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
                          {uniqueCategories.length === 0 ? (
                            <span className="text-slate-400 italic">No options found</span>
                          ) : (
                            uniqueCategories.map((opt, idx) => (
                              <div key={idx} className="bg-white border border-slate-100 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold hover:border-slate-300 transition-colors flex justify-between items-center">
                                <span>{opt}</span>
                                <span className="text-[9px] text-slate-400 font-mono font-bold">#{idx + 1}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Facility Type Options */}
                      <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 flex flex-col space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                              <Layers className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="block font-extrabold text-slate-800 text-xs">Facility Type</span>
                              <span className="block text-[9px] text-slate-400 font-bold uppercase">संस्थान प्रकार</span>
                            </div>
                          </div>
                          <span className="bg-emerald-100/80 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-black">
                            {uniqueTypes.length}
                          </span>
                        </div>
                        <div className="flex-1 max-h-48 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
                          {uniqueTypes.length === 0 ? (
                            <span className="text-slate-400 italic">No options found</span>
                          ) : (
                            uniqueTypes.map((opt, idx) => (
                              <div key={idx} className="bg-white border border-slate-100 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold hover:border-slate-300 transition-colors flex justify-between items-center">
                                <span>{opt}</span>
                                <span className="text-[9px] text-slate-400 font-mono font-bold">#{idx + 1}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Location Name Options */}
                      <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 flex flex-col space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                              <Table className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="block font-extrabold text-slate-800 text-xs">Location Name</span>
                              <span className="block text-[9px] text-slate-400 font-bold uppercase">स्थान नाम</span>
                            </div>
                          </div>
                          <span className="bg-emerald-100/80 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-black">
                            {uniqueLocations.length}
                          </span>
                        </div>
                        <div className="flex-1 max-h-48 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
                          {uniqueLocations.length === 0 ? (
                            <span className="text-slate-400 italic">No options found</span>
                          ) : (
                            uniqueLocations.map((opt, idx) => (
                              <div key={idx} className="bg-white border border-slate-100 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold hover:border-slate-300 transition-colors flex justify-between items-center">
                                <span>{opt}</span>
                                <span className="text-[9px] text-slate-400 font-mono font-bold">#{idx + 1}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Stream Options */}
                      <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 flex flex-col space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                              <Activity className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="block font-extrabold text-slate-800 text-xs">Stream</span>
                              <span className="block text-[9px] text-slate-400 font-bold uppercase">चिकित्सा विधा</span>
                            </div>
                          </div>
                          <span className="bg-emerald-100/80 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-black">
                            {uniqueStreams.length}
                          </span>
                        </div>
                        <div className="flex-1 max-h-48 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
                          {uniqueStreams.length === 0 ? (
                            <span className="text-slate-400 italic">No options found</span>
                          ) : (
                            uniqueStreams.map((opt: any, idx) => (
                              <div key={idx} className="bg-white border border-slate-100 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold hover:border-slate-300 transition-colors flex justify-between items-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${String(opt).toLowerCase() === "unani" ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"}`}>
                                  {opt}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono font-bold">#{idx + 1}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Block Options */}
                      <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 flex flex-col space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                              <Settings className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="block font-extrabold text-slate-800 text-xs">Block</span>
                              <span className="block text-[9px] text-slate-400 font-bold uppercase">विकासखंड</span>
                            </div>
                          </div>
                          <span className="bg-emerald-100/80 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-black">
                            {uniqueBlocks.length}
                          </span>
                        </div>
                        <div className="flex-1 max-h-48 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
                          {uniqueBlocks.length === 0 ? (
                            <span className="text-slate-400 italic">No options found</span>
                          ) : (
                            uniqueBlocks.map((opt, idx) => (
                              <div key={idx} className="bg-white border border-slate-100 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold hover:border-slate-300 transition-colors flex justify-between items-center">
                                <span>{opt}</span>
                                <span className="text-[9px] text-slate-400 font-mono font-bold">#{idx + 1}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* District Options */}
                      <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 flex flex-col space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                              <Sparkles className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="block font-extrabold text-slate-800 text-xs">District</span>
                              <span className="block text-[9px] text-slate-400 font-bold uppercase">जनपद</span>
                            </div>
                          </div>
                          <span className="bg-emerald-100/80 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-black">
                            {uniqueDistricts.length}
                          </span>
                        </div>
                        <div className="flex-1 max-h-48 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
                          {uniqueDistricts.length === 0 ? (
                            <span className="text-slate-400 italic">No options found</span>
                          ) : (
                            uniqueDistricts.map((opt, idx) => (
                              <div key={idx} className="bg-white border border-slate-100 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold hover:border-slate-300 transition-colors flex justify-between items-center">
                                <span>{opt}</span>
                                <span className="text-[9px] text-slate-400 font-mono font-bold">#{idx + 1}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Contact Email Options */}
                      <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 flex flex-col space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                              <Plus className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="block font-extrabold text-slate-800 text-xs">Email ID</span>
                              <span className="block text-[9px] text-slate-400 font-bold uppercase">ईमेल आईडी</span>
                            </div>
                          </div>
                          <span className="bg-emerald-100/80 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-black">
                            {uniqueEmails.length}
                          </span>
                        </div>
                        <div className="flex-1 max-h-48 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
                          {uniqueEmails.length === 0 ? (
                            <span className="text-slate-400 italic">No options found</span>
                          ) : (
                            uniqueEmails.map((opt, idx) => (
                              <div key={idx} className="bg-white border border-slate-100 rounded-lg px-2.5 py-1.5 text-slate-600 font-mono hover:border-slate-300 transition-colors flex justify-between items-center justify-between">
                                <span className="truncate" title={opt}>{opt}</span>
                                <span className="text-[9px] text-slate-400 font-mono font-bold shrink-0 ml-2">#{idx + 1}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* RENDER TEMPLATE DESIGNER FORM WORKSPACE */}
      {!isLoading && isCreating && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANELS: PROFORMA METRIC MAPPINGS AND METADATA */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* META DETAILS CARD */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 uppercase border-b border-slate-100 pb-3">
                <Layers className="w-4 h-4 text-emerald-600" />
                1. Template Parameters
              </h4>

              <div className="space-y-4 text-xs font-bold text-slate-700">
                <div>
                  <label className="block mb-1.5">Custom Template Name (e.g. State Ayush MPR Format)</label>
                  <input
                    type="text"
                    required
                    placeholder="Uttarakhand Ayurvedic State Proforma 2026"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1.5">Upload Spreadsheet Report Form (.xlsx / .csv)</label>
                  <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50 hover:bg-slate-100/50 hover:border-emerald-400 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleExcelUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-700 font-extrabold">
                      {uploadedFileName ? `Selected: ${uploadedFileName}` : "Drag and drop or browse spreadsheet file"}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Accepts standard Excel files formatted by your superiors</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DEFINE EXTRA CLINICAL PARAMETERS (MANY MORE INFORMATION) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 uppercase border-b border-slate-100 pb-3">
                <Plus className="w-4 h-4 text-emerald-600" />
                2. Track Custom Metrics
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Does your report require fields not tracked in our standard clinical log? Define custom metrics here! They will show up in the hospitals' Calendar Entry list and compile into this Excel.
              </p>

              <div className="space-y-4 text-xs font-bold text-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">Parameter Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Yoga Participants count"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Log Section</label>
                    <select
                      value={newFieldCategory}
                      onChange={(e) => setNewFieldCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:border-emerald-500 outline-none"
                    >
                      <option value="opd">OPD Department</option>
                      <option value="ipd">IPD Department</option>
                      <option value="panchkarma">Panchkarma Special</option>
                      <option value="lab">Lab Investigations</option>
                      <option value="camp">Outreach Camps</option>
                      <option value="general">General Administration</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="fieldType"
                        checked={newFieldType === "number"}
                        onChange={() => setNewFieldType("number")}
                        className="text-emerald-700 focus:ring-emerald-500"
                      />
                      Numeric Values
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="fieldType"
                        checked={newFieldType === "text"}
                        onChange={() => setNewFieldType("text")}
                        className="text-emerald-700 focus:ring-emerald-500"
                      />
                      Text Answers
                    </label>
                  </div>

                  <button
                    onClick={handleAddCustomField}
                    type="button"
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-3 py-2 rounded-xl flex items-center gap-1 border border-emerald-200 transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Register Parameter
                  </button>
                </div>

                {/* CUSTOM FIELDS REGISTERED LIST */}
                {customFields.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Registered Custom Parameters:</span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {customFields.map((f) => (
                        <div key={f.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-150 text-[11px]">
                          <div>
                            <span className="font-extrabold text-slate-800">{f.name}</span>
                            <span className="text-[9px] text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded-md ml-2 border border-emerald-100 uppercase">
                              {f.category}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveCustomField(f.id)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PERSIST ACTION PANEL */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-center">
              <p className="text-[11px] text-slate-400 mb-4 leading-normal font-medium">
                Ensure you have mapped all key cells on your Excel grid preview. Click below to verify and save your custom proforma template in the district server database.
              </p>
              <button
                onClick={handleSaveTemplate}
                className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-extrabold text-xs py-3 rounded-2xl shadow-lg shadow-emerald-800/10 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Preserve Report Format Template
              </button>
            </div>

          </div>

          {/* RIGHT PANELS: INTERACTIVE GRID PREVIEW & CELL MAPPER */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 uppercase">
                <Table className="w-4 h-4 text-emerald-600" />
                3. Interactive Excel Cell Mapper
              </h4>

              {sheetPreview.length > 0 && (
                <button
                  onClick={handleAiAutoMap}
                  disabled={isAutoMapping}
                  className="bg-slate-900 hover:bg-slate-950 text-white text-[11px] font-extrabold px-3 py-2 rounded-xl flex items-center gap-1 shadow-md transition-all disabled:opacity-50"
                >
                  {isAutoMapping ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                      Gemini Auto-mapping...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Gemini AI Auto-Map
                    </>
                  )}
                </button>
              )}
            </div>

            {sheetPreview.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6">
                <UploadCloud className="w-10 h-10 text-slate-300 mx-auto animate-bounce-slow" />
                <div>
                  <h5 className="font-bold text-slate-700 text-xs">Spreadsheet Not Loaded</h5>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-0.5 leading-normal">
                    Upload an official Ayurvedic proforma or excel template sheet in Step 1 to trigger the interactive cell mapper.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* INTERACTIVE CELL MAPPING TOOLBAR */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end text-xs font-bold text-slate-700">
                  <div className="md:col-span-3">
                    <label className="block mb-1">Active Cell</label>
                    <input
                      type="text"
                      disabled
                      placeholder="Click on grid"
                      value={activeCellRef}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-extrabold text-emerald-700 text-center outline-none"
                    />
                  </div>

                  <div className="md:col-span-6">
                    <label className="block mb-1">Map Clinical system Field</label>
                    <select
                      value={selectedMappingField}
                      onChange={(e) => setSelectedMappingField(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:border-emerald-500 outline-none"
                    >
                      <option value="">-- Choose system Parameter --</option>
                      
                      <optgroup label="Standard clinical Parameters">
                        {SYSTEM_METRICS.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </optgroup>

                      {customFields.length > 0 && (
                        <optgroup label="Your Custom Parameters (अतिरिक्त वांछित जानकारी)">
                          {customFields.map(f => (
                            <option key={f.id} value={f.id}>[Custom] {f.name}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <button
                      onClick={handleAddManualMapping}
                      type="button"
                      className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-extrabold text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-all h-9 shadow-sm"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Bind Cell
                    </button>
                  </div>
                </div>

                {/* SPREADSHEET MATRIX PREVIEW GRID */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>GRID PREVIEW: click on a cell to select and bind fields</span>
                    <span className="text-emerald-700 font-extrabold uppercase">active sheet: {sheetName}</span>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-96">
                    <table className="w-full border-collapse text-[11px] text-left">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-500">
                          <th className="p-1 border-r border-slate-200 text-center w-8 bg-slate-150 font-bold">#</th>
                          {sheetPreview[0]?.map((_, cIdx) => (
                            <th key={cIdx} className="p-1 border-r border-slate-200 text-center w-28 font-extrabold">
                              {getColumnLabel(cIdx)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {sheetPreview.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/50">
                            <td className="p-1 border-r border-slate-200 text-center bg-slate-100 text-slate-500 font-bold w-8 shrink-0">
                              {rIdx + 1}
                            </td>
                            {row.map((val, cIdx) => {
                              const cellRef = XLSX.utils.encode_cell({ r: rIdx, c: cIdx });
                              const isSelected = activeCellRef === cellRef;
                              const currentMapping = mappings.find(m => m.cellRef === cellRef);
                              
                              return (
                                <td
                                  key={cIdx}
                                  onClick={() => handleCellClick(rIdx, cIdx, val)}
                                  className={`p-1.5 border-r border-slate-200 max-w-[12rem] truncate cursor-pointer transition-all ${
                                    isSelected 
                                      ? "bg-emerald-50 text-emerald-950 border-2 border-emerald-500 font-extrabold" 
                                      : currentMapping 
                                        ? "bg-amber-50 text-amber-950 font-black" 
                                        : val 
                                          ? "font-semibold text-slate-800 bg-slate-50/20" 
                                          : "text-slate-300"
                                  }`}
                                  title={`Cell: ${cellRef} ${currentMapping ? `-> Mapped: ${getFieldLabel(currentMapping.systemField)}` : ''}`}
                                >
                                  {currentMapping ? (
                                    <div className="flex flex-col text-[10px]">
                                      <span className="text-amber-800 font-black truncate">{getFieldLabel(currentMapping.systemField)}</span>
                                      <span className="text-[8px] text-slate-400 uppercase truncate">Excel val: "{val}"</span>
                                    </div>
                                  ) : (
                                    val || <span className="italic text-slate-300 text-[10px]">empty</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ACTIVE MAPPINGS CHIP CHECKLIST */}
                {mappings.length > 0 && (
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Configured Cell Bindings ({mappings.length}):</span>
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                      {mappings.map((m) => (
                        <div key={m.cellRef} className="bg-amber-50 hover:bg-amber-100/50 text-amber-900 text-[10px] font-bold py-1 px-2.5 rounded-xl flex items-center gap-1.5 border border-amber-200/65 shadow-sm transition-all">
                          <span className="bg-amber-200/80 px-1.5 py-0.2 rounded-md font-mono text-xs">{m.cellRef}</span>
                          <span className="truncate max-w-[10rem]">{getFieldLabel(m.systemField)}</span>
                          <button
                            onClick={() => handleRemoveMapping(m.cellRef)}
                            className="hover:bg-rose-100 p-0.5 rounded text-rose-600 ml-1.5 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      )}

      {/* STANDARD PROFORMA DETAILED PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-slate-800 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-6 flex justify-between items-start">
              <div>
                <span className="bg-emerald-700/80 text-emerald-100 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit mb-2 border border-emerald-600/50">
                  Standard Government Format
                </span>
                <h4 className="text-lg font-black tracking-tight">{previewTemplate.title}</h4>
                <p className="text-xs text-emerald-100/80 mt-1 font-semibold">{previewTemplate.subtitle}</p>
              </div>
              <button 
                onClick={() => setPreviewTemplate(null)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600">
              <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50 space-y-1">
                <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                  Description & Context
                </span>
                <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{previewTemplate.description}</p>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                  <span className="text-[8px] text-slate-400 block uppercase font-black mb-0.5 tracking-wider">Parameters Count</span>
                  <span className="font-black text-slate-800 text-xs">{previewTemplate.metricsCount}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                  <span className="text-[8px] text-slate-400 block uppercase font-black mb-0.5 tracking-wider">Format Language</span>
                  <span className="font-black text-slate-800 text-xs">{previewTemplate.language}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                  <span className="text-[8px] text-slate-400 block uppercase font-black mb-0.5 tracking-wider">Authority Standard</span>
                  <span className="font-black text-emerald-800 text-xs">{previewTemplate.format}</span>
                </div>
              </div>

              {/* Fields List */}
              <div className="space-y-3">
                <span className="font-extrabold text-slate-800 block text-xs uppercase tracking-wide">Primary Attributes & Tracked Datapoints</span>
                <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 divide-y divide-slate-150 max-h-[220px] overflow-y-auto">
                  {previewTemplate.fields.map((f: string, i: number) => (
                    <div key={i} className="py-2.5 flex items-center gap-2.5 font-bold text-slate-700 first:pt-0 last:pb-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-3 flex-wrap">
              <button
                onClick={() => {
                  setPremiumPreviewType(previewTemplate.id as any);
                  setIsPremiumPreviewOpen(true);
                }}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-4 py-2 rounded-xl transition-all text-xs flex items-center gap-1.5 mr-auto"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                View Blank Visual Sheet
              </button>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl transition-all text-xs"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setPreviewTemplate(null);
                  if (user.role === "HOSPITAL_USER") {
                    setActiveTab("calendar");
                  } else {
                    setActiveTab("mpr");
                  }
                  onSuccessToast({
                    title: `📋 Furnishing ${previewTemplate.title}`,
                    content: "Redirecting you to complete data entry for the selected proforma."
                  });
                }}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md text-xs"
              >
                <ArrowRight className="w-4 h-4" />
                Furnish This Format
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREMIUM VISUAL SHEET MODAL */}
      <PremiumReportModal
        isOpen={isPremiumPreviewOpen}
        onClose={() => {
          setIsPremiumPreviewOpen(false);
          setPremiumPreviewType(null);
        }}
        initialReportType={
          premiumPreviewType === "proforma1"
            ? "mpr"
            : premiumPreviewType === "proforma2"
            ? "apr"
            : (premiumPreviewType as any) || "mpr"
        }
        initialMonth="2026-06"
        user={user}
        isPreviewMode={true}
        previewType={premiumPreviewType as any}
      />

    </div>
  );
}
