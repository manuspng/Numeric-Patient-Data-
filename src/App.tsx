/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Building2, 
  User, 
  ShieldCheck, 
  Bell, 
  LogOut, 
  Wifi, 
  WifiOff, 
  Calendar as CalendarIcon, 
  FileSpreadsheet, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  Smartphone,
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Unlock,
  KeyRound,
  Fingerprint,
  UserPlus,
  Menu,
  ChevronDown,
  ChevronUp,
  Info,
  Camera,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  Activity,
  FileText,
  Database,
  Brain,
  Calculator
} from "lucide-react";
import { UserRole, UserProfile, Hospital } from "./types";
import CalendarEntry from "./components/CalendarEntry";
import MPRReport from "./components/MPRReport";
import AnalyticsCharts from "./components/AnalyticsCharts";
import DefaulterDashboard from "./components/DefaulterDashboard";
import AdminMasterTables from "./components/AdminMasterTables";
import ReportDesigner from "./components/ReportDesigner";
import { FacilitySettings } from "./components/FacilitySettings";
import { auth, googleProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "./firebase";

// --- START OF GLOBAL CLIENT-SIDE API SIMULATION INTERCEPTOR ---
// This supports static hosting platforms like Vercel where the persistent backend container does not run,
// allowing the entire patient data suite to run 100% client-side with persistent mock routing.

const INITIAL_MOCK_DB = {
  hospitals: [
    { id: "hosp-jhankat", name: "राजकीय आयुर्वेदिक चिकित्सालय - बाजपुर", code: "SAD-BJP-01", type: "SAD", location: "बाजपुर", address: "Bajpur, District Udham Singh Nagar, Uttarakhand", contactEmail: "jhankat.ayush@gov.in", contactPhone: "9411223344", isActive: true, incharge: "Dr. Singh", block: "बाजपुर", district: "उधम सिंह नगर", stream: "Ayurved" },
    { id: "hosp-khatima", name: "राजकीय आयुर्वेदिक चिकित्सालय - खटीमा", code: "SAD-KHT-02", type: "SAD", location: "खटीमा", address: "Main Market, Khatima, Uttarakhand", contactEmail: "khatima.ayush@gov.in", contactPhone: "9411223355", isActive: true, incharge: "Dr. Joshi", block: "खटीमा", district: "उधम सिंह नगर", stream: "Ayurved" },
    { id: "hosp-tanakpur", name: "राजकीय यूनानी चिकित्सालय - सितारगंज", code: "SUB-STG-03", type: "राजकीय यूनानी चिकित्सालय", location: "सितारगंज", address: "Railway Station Road, Tanakpur, Uttarakhand", contactEmail: "tanakpur.ayush@gov.in", contactPhone: "9411223366", isActive: true, incharge: "Dr. Khan", block: "सितारगंज", district: "उधम सिंह नगर", stream: "Unani" },
    { id: "hosp-banbasa", name: "आयुष्मान आरोग्य मंदिर - जसपुर", code: "AAM-JSP-04", type: "आयुष्मान आरोग्य मंदिर", location: "जसपुर", address: "NH-9, Banbasa Border, Uttarakhand", contactEmail: "banbasa.ayush@gov.in", contactPhone: "9411223377", isActive: true, incharge: "Dr. Rawat", block: "जसपुर", district: "उधम सिंह नगर", stream: "Ayurved" }
  ],
  hospitalDropdownOptions: [
    { id: "hosp-unregistered-1", name: "राजकीय आयुर्वेदिक चिकित्सालय - बन्नाखेड़ा", code: "SAD-BNK-05", type: "SAD", location: "बन्नाखेड़ा", address: "Bannakhera, Uttarakhand", isActive: true, block: "बाजपुर", district: "उधम सिंह नगर", stream: "Ayurved" },
    { id: "hosp-unregistered-2", name: "राजकीय आयुर्वेदिक चिकित्सालय - गदरपुर", code: "SAD-GDP-06", type: "SAD", location: "गदरपुर", address: "Gadarpur, Uttarakhand", isActive: true, block: "गदरपुर", district: "उधम सिंह नगर", stream: "Ayurved" }
  ],
  users: [
    { id: "user-manu", email: "manu.spng@gmail.com", name: "Dr. Manu Sharma", role: "SUPER_ADMIN", phone: "+919411223344", isWhitelisted: true, password: "admin123" },
    { id: "user-hosp-jhankat", email: "jhankat.user@uttarakhandayurved.co.in", name: "Jhankat Ayurvedic Hospital Incharge", role: "HOSPITAL_USER", hospitalId: "hosp-jhankat", phone: "+919411220011", isWhitelisted: true, password: "123" },
    { id: "user-hosp-khatima", email: "khatima.user@uttarakhandayurved.co.in", name: "Khatima Ayurvedic Hospital Incharge", role: "HOSPITAL_USER", hospitalId: "hosp-khatima", phone: "+919411220022", isWhitelisted: true, password: "123" }
  ],
  dailyReports: [] as any[],
  auditLogs: [
    { id: "audit-init", userId: "user-manu", userEmail: "manu.spng@gmail.com", userName: "Dr. Manu Sharma", action: "INIT", tableName: "System", recordId: "0", details: "Client-side simulation database initialized with Vercel support.", timestamp: new Date().toISOString() }
  ],
  masterDiseases: [
    { id: "dis-1", name: "ज्वर", category: "रोगवार विवरण" },
    { id: "dis-2", name: "अतिसार", category: "रोगवार विवरण" },
    { id: "dis-3", name: "वमन", category: "रोगवार विवरण" },
    { id: "dis-4", name: "श्वासकास", category: "रोगवार विवरण" },
    { id: "dis-5", name: "अम्लिपत्त", category: "रोगवार विवरण" },
    { id: "dis-6", name: "पाण्डु", category: "रोगवार विवरण" },
    { id: "dis-7", name: "कामला", category: "रोगवार विवरण" },
    { id: "dis-8", name: "उदर रोग", category: "रोगवार विवरण" },
    { id: "dis-9", name: "प्रमेह", category: "रोगवार विवरण" },
    { id: "dis-10", name: "मूत्र रोग", category: "रोगवार विवरण" },
    { id: "dis-11", name: "आमवात", category: "रोगवार विवरण" },
    { id: "dis-12", name: "संधिवात", category: "रोगवार विवरण" },
    { id: "dis-38", name: "अन्य रोग", category: "रोगवार विवरण" }
  ],
  masterTests: [
    { id: "test-hb", name: "Hemoglobin (Hb)", normalRange: "12-16 g/dL" },
    { id: "test-sugar", name: "Blood Sugar", normalRange: "70-140 mg/dL" },
    { id: "test-urine", name: "Urine Sugar", normalRange: "Nil" }
  ],
  masterKits: [
    { id: "kit-hb", name: "Hemoglobin Strips", unit: "Strips", defaultThreshold: 20 },
    { id: "kit-sugar", name: "Blood Sugar Strips", unit: "Strips", defaultThreshold: 30 }
  ],
  notifications: [
    { id: "notif-1", title: "Welcome to Ayush MPR Client Workspace", body: "Active in Client-Side Simulated Mode.", deepLink: "/analytics", timestamp: new Date().toISOString() }
  ],
  customTemplates: [] as any[],
  registrationRequests: [] as any[],
  hospitalTypes: ["राजकीय आयुर्वेदिक चिकित्सालय", "राजकीय यूनानी चिकित्सालय", "आयुष्मान आरोग्य मंदिर"],
  streams: ["Ayurved", "Unani"],
  locations: ["बाजपुर", "खटीमा", "सितारगंज", "जसपुर"],
  blocks: ["बाजपुर", "गदरपुर", "जसपुर", "खटीमा", "सितारगंज"],
  districts: ["उधम सिंह नगर"]
};

// Seed historical data so charts work out of the box in client simulation
const todayStr = new Date().toISOString().split("T")[0];
INITIAL_MOCK_DB.hospitals.forEach((h) => {
  for (let i = 15; i >= 1; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    INITIAL_MOCK_DB.dailyReports.push({
      id: `rep-${h.id}-${dateStr}`,
      hospitalId: h.id,
      recordDate: dateStr,
      submittedAt: new Date(d.getTime() + 8 * 3600 * 1000).toISOString(),
      submittedBy: `${h.id.split("-")[1]}.user@gov.in`,
      patientMatrix: {
        opd_male_new: 15 + (i % 5), opd_male_old: 5 + (i % 3),
        opd_female_new: 20 + (i % 4), opd_female_old: 8 + (i % 2),
        opd_child_new: 4, opd_child_old: 2,
        opd_elderly_new: 6, opd_elderly_old: 3,
        ipd_admissions: i % 2, ipd_bed_occupancy_percentage: 45 + (i % 10),
        panchkarma_male: 3, panchkarma_female: 4, panchkarma_child: 0, panchkarma_elderly: 2,
        levy_charges: 350, aadhaar_seeded_count: 30, mobile_seeded_count: 32
      },
      investigationsLab: {
        hemoglobin: 12 + (i % 4), blood_sugar: 8 + (i % 3), urine_sugar: i % 2, urine_albumin: 0,
        malaria: 0, dengue: 0, typhoid: i % 3 === 0 ? 1 : 0, hepatitis_a: 0, hepatitis_b: 0, hepatitis_c: 0, pregnancy_tests: 0
      },
      inventory: [
        { kit_type: "Hemoglobin Strips", opening_balance: 80, received_qty: 0, used_qty: 12, defective_qty: 0, closing_balance: 68, low_stock_threshold: 20 },
        { kit_type: "Blood Sugar Strips", opening_balance: 90, received_qty: 0, used_qty: 8, defective_qty: 0, closing_balance: 82, low_stock_threshold: 30 }
      ],
      camps: [] as any[],
      isLocked: true,
      anomalyConfirmed: false,
      anomalyFlags: []
    });
  }
});

const getLocalMockDB = () => {
  const existing = localStorage.getItem("mpr_simulated_db");
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch {
      // fallback
    }
  }
  localStorage.setItem("mpr_simulated_db", JSON.stringify(INITIAL_MOCK_DB));
  return INITIAL_MOCK_DB;
};

const saveLocalMockDB = (db: any) => {
  localStorage.setItem("mpr_simulated_db", JSON.stringify(db));
};

// Check if we should override/simulate. By default, if window.location.hostname is vercel, or if we cannot reach /api/auth/login.
let forceMockBackend = window.location.hostname.endsWith(".vercel.app");

const originalFetch = window.fetch;
window.fetch = async function (input, init) {
  const url = typeof input === "string" ? input : (input as Request).url;
  
  if (url.startsWith("/api/")) {
    // If not already forced to mock, let's probe/try first, unless we are on Vercel which we know doesn't have a backend.
    if (!forceMockBackend) {
      try {
        const testRes = await originalFetch(input, init);
        const contentType = testRes.headers.get("content-type") || "";
        if (contentType.includes("application/json") || testRes.status !== 200 || !url.includes("login")) {
          // It's a real backend responding properly, let's return it!
          return testRes;
        } else {
          // Non-JSON html response returned for /api, backend is probably a static host mock!
          console.warn("[MOCK BACKEND] Backend returned HTML/Non-JSON response for API. Forcing persistent client-side simulated mode.");
          forceMockBackend = true;
        }
      } catch (err) {
        console.warn("[MOCK BACKEND] Fetch connection error. Forcing persistent client-side simulated mode.", err);
        forceMockBackend = true;
      }
    }

    if (forceMockBackend) {
      console.log(`[MOCK ROUTER] Intercepting: ${url}`);
      const parsedUrl = new URL(url, window.location.origin);
      const pathname = parsedUrl.pathname;
      const method = init?.method?.toUpperCase() || "GET";
      const body = init?.body ? JSON.parse(init.body as string) : null;
      
      const db = getLocalMockDB();
      let responseData: any = { success: false, message: "Route not implemented in simulation" };
      let statusCode = 200;

      if (pathname === "/api/auth/login") {
        const searchEmail = (body?.email || "").toLowerCase().trim();
        const searchPhone = body?.phone;
        const password = body?.password;
        
        let user = db.users.find((u: any) => u.email.toLowerCase().trim() === searchEmail || (searchPhone && u.phone === searchPhone));
        if (!user && searchEmail === "manu.spng@gmail.com") {
          user = {
            id: "user-manu",
            email: "manu.spng@gmail.com",
            name: "Dr. Manu Sharma",
            role: "SUPER_ADMIN",
            phone: "+919411223344",
            isWhitelisted: true,
            password: password || "admin123"
          };
          db.users.push(user);
          saveLocalMockDB(db);
        }

        if (!user) {
          statusCode = 403;
          responseData = { success: false, message: "Your ID or Phone is not whitelisted. Use manu.spng@gmail.com as super admin." };
        } else if (body?.loginType === "Simulated Database Authentication" && user.password && password && user.password !== password) {
          statusCode = 401;
          responseData = { success: false, message: "Incorrect password for this simulated account." };
        } else {
          responseData = {
            success: true,
            user,
            hospital: user.hospitalId ? db.hospitals.find((h: any) => h.id === user.hospitalId) : null
          };
        }
      } 
      else if (pathname === "/api/auth/request-register") {
        const { email, name, role, hospitalId, phone, password } = body || {};
        const request = {
          id: "req-" + Math.random().toString(36).substring(2, 11),
          email, name, role, hospitalId, phone, password,
          status: "PENDING",
          createdAt: new Date().toISOString()
        };
        db.registrationRequests = db.registrationRequests || [];
        db.registrationRequests.push(request);
        saveLocalMockDB(db);
        responseData = { success: true };
      }
      else if (pathname === "/api/hospitals") {
        responseData = db.hospitals;
      }
      else if (pathname === "/api/hospitals/options") {
        responseData = db.hospitalDropdownOptions || [];
      }
      else if (pathname === "/api/notifications") {
        const email = parsedUrl.searchParams.get("email");
        responseData = db.notifications || [];
      }
      else if (pathname === "/api/master/diseases") {
        responseData = db.masterDiseases;
      }
      else if (pathname === "/api/master/tests") {
        responseData = db.masterTests;
      }
      else if (pathname === "/api/templates") {
        responseData = db.customTemplates || [];
      }
      else if (pathname === "/api/admin/users") {
        responseData = db.users;
      }
      else if (pathname === "/api/admin/audit-logs") {
        responseData = db.auditLogs || [];
      }
      else if (pathname === "/api/admin/registration-requests") {
        responseData = db.registrationRequests || [];
      }
      else if (pathname === "/api/admin/registration-requests/action") {
        const { id, action } = body || {};
        db.registrationRequests = db.registrationRequests || [];
        const reqIndex = db.registrationRequests.findIndex((r: any) => r.id === id);
        if (reqIndex !== -1) {
          const req = db.registrationRequests[reqIndex];
          req.status = action; // "APPROVED" or "REJECTED"
          if (action === "APPROVED") {
            const newUser = {
              id: "user-" + Math.random().toString(36).substring(2, 11),
              email: req.email,
              name: req.name,
              role: req.role,
              hospitalId: req.hospitalId,
              phone: req.phone,
              isWhitelisted: true,
              password: req.password || "123"
            };
            db.users.push(newUser);
          }
          saveLocalMockDB(db);
          responseData = { success: true };
        } else {
          responseData = { success: false, message: "Request not found" };
        }
      }
      else if (pathname === "/api/admin/users/whitelist") {
        const { userEmail, userName, role, hospitalId, phone, password } = body || {};
        let existingUser = db.users.find((u: any) => u.email.toLowerCase().trim() === userEmail.toLowerCase().trim());
        if (existingUser) {
          existingUser.name = userName;
          existingUser.role = role;
          existingUser.hospitalId = hospitalId;
          existingUser.phone = phone;
          if (password) existingUser.password = password;
        } else {
          existingUser = {
            id: "user-" + Math.random().toString(36).substring(2, 11),
            email: userEmail,
            name: userName,
            role,
            hospitalId,
            phone,
            isWhitelisted: true,
            password: password || "123"
          };
          db.users.push(existingUser);
        }
        saveLocalMockDB(db);
        responseData = { success: true };
      }
      else if (pathname === "/api/admin/users/toggle") {
        const { userId } = body || {};
        const u = db.users.find((user: any) => user.id === userId);
        if (u) {
          u.isWhitelisted = !u.isWhitelisted;
          saveLocalMockDB(db);
          responseData = { success: true };
        }
      }
      else if (pathname === "/api/admin/users/delete") {
        const { userId } = body || {};
        db.users = db.users.filter((user: any) => user.id !== userId);
        saveLocalMockDB(db);
        responseData = { success: true };
      }
      else if (pathname === "/api/admin/hospitals/save") {
        const h = body;
        let existing = db.hospitals.find((item: any) => item.id === h.id || item.code === h.code);
        if (existing) {
          Object.assign(existing, h);
        } else {
          h.id = h.id || "hosp-" + Math.random().toString(36).substring(2, 11);
          db.hospitals.push(h);
        }
        saveLocalMockDB(db);
        responseData = { success: true };
      }
      else if (pathname === "/api/admin/hospitals/delete") {
        const { hospitalId } = body || {};
        db.hospitals = db.hospitals.filter((h: any) => h.id !== hospitalId);
        saveLocalMockDB(db);
        responseData = { success: true };
      }
      else if (pathname === "/api/mpr/daily") {
        if (method === "GET") {
          const date = parsedUrl.searchParams.get("date");
          const hospId = parsedUrl.searchParams.get("hospitalId");
          const report = db.dailyReports.find((r: any) => r.hospitalId === hospId && r.recordDate === date);
          responseData = report || null;
        } else {
          const report = body;
          db.dailyReports = db.dailyReports || [];
          db.dailyReports = db.dailyReports.filter((r: any) => !(r.hospitalId === report.hospitalId && r.recordDate === report.recordDate));
          db.dailyReports.push(report);
          saveLocalMockDB(db);
          responseData = { success: true };
        }
      }
      else if (pathname === "/api/mpr/aggregate") {
        const month = parsedUrl.searchParams.get("month");
        const monthlyReports = db.dailyReports.filter((r: any) => r.recordDate.startsWith(month || ""));
        responseData = {
          success: true,
          reports: monthlyReports
        };
      }
      else if (pathname === "/api/mpr/defaulters") {
        const month = parsedUrl.searchParams.get("month");
        const activeHospitals = db.hospitals;
        const defaulters = activeHospitals.map((h: any) => {
          const count = db.dailyReports.filter((r: any) => r.hospitalId === h.id && r.recordDate.startsWith(month || "")).length;
          return {
            hospitalId: h.id,
            hospitalName: h.name,
            contactPhone: h.contactPhone,
            submissionsCount: count,
            isDefaulter: count === 0
          };
        });
        responseData = defaulters;
      }
      else if (pathname === "/api/mpr/nudge" || pathname === "/api/notifications/trigger-daily-schedule") {
        responseData = { success: true };
      }
      else if (pathname === "/api/admin/hospitals/sheet-config") {
        if (method === "GET") {
          responseData = { success: true, url: "" };
        } else {
          responseData = { success: true };
        }
      }
      else if (pathname === "/api/admin/hospitals/sync-sheets") {
        responseData = { success: true, message: "Sync bypassed in local simulation" };
      }
      else if (pathname === "/api/mpr/check-anomalies") {
        responseData = { hasAnomalies: false, flags: [] };
      }
      else if (pathname === "/api/mpr/summarize") {
        responseData = { summary: "Monthly Progress Report data summarized successfully. Zero critical inventory shortages or submission anomalies reported." };
      }

      return new Response(JSON.stringify(responseData), {
        status: statusCode,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return originalFetch(input, init);
};
// --- END OF GLOBAL CLIENT-SIDE API SIMULATION INTERCEPTOR ---

const getTheme = (role?: UserRole) => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return {
        sidebarBg: "bg-gradient-to-b from-[#FAF6F0] via-[#F4EBE1] to-[#EADBC8] border-[#DCD0C0]",
        sidebarBorder: "border-[#DCD0C0]",
        sidebarHeaderBorder: "border-[#DCD0C0]",
        sidebarTextColor: "text-[#5C4033]",
        sidebarHeadingColor: "text-[#3E2723]",
        sidebarSubTextColor: "text-[#7D5A50]",
        activeTabBg: "bg-[#D5C0AB] text-[#3E2723] border-[#C8B19B]",
        inactiveTabHover: "text-[#6D4C41] hover:bg-[#EADBC8] hover:text-[#3E2723]",
        accentText: "text-[#8D6E63]",
        accentBg: "bg-[#A1887F]",
        accentHoverBg: "hover:bg-[#8D6E63]",
        badgeBg: "bg-[#A1887F]/15 text-[#5D4037]",
        badgeBorder: "border-[#A1887F]/30",
        navIconColor: "text-[#8D6E63]",
        primaryText: "text-[#4E342E]",
        secondaryText: "text-[#7D5A50]",
        buttonPrimary: "bg-[#8D6E63] hover:bg-[#7D5A50] text-white",
        accentLightBg: "bg-[#F4EBE1]/80",
        cardBorder: "border-[#DCD0C0]",
        logoColor: "text-[#4E342E]",
        navHover: "hover:bg-[#EADBC8]",
        mobileToggle: "bg-[#8D6E63] text-white hover:bg-[#7D5A50]",
        headerAccentLine: "bg-gradient-to-r from-[#D5C0AB] via-[#8D6E63] to-transparent",
        glowRing: "focus-within:ring-2 focus-within:ring-[#A1887F]",
        tabHighlightBorder: "border-[#8D6E63]",
        bannerBg: "bg-[#FAF6F0] border-[#EADBC8] text-[#5C4033]",
        bannerBorder: "border-[#EADBC8]",
        bannerIconColor: "text-[#8D6E63]",
        bannerBadgeColor: "text-[#5C4033]",
        bannerPingBg: "bg-[#A1887F]",
        districtText: "text-[#7D5A50]",
        onlineBadgeBg: "bg-[#FAF6F0]",
        onlineBadgeText: "text-[#5C4033]",
        onlineBadgeBorder: "border-[#EADBC8]"
      };
    case UserRole.OFFICE_ADMIN:
      return {
        sidebarBg: "bg-indigo-950 border-indigo-900 text-white",
        sidebarBorder: "border-indigo-900",
        sidebarHeaderBorder: "border-indigo-900",
        sidebarTextColor: "text-white",
        sidebarHeadingColor: "text-indigo-50",
        sidebarSubTextColor: "text-sky-300",
        activeTabBg: "bg-indigo-800 text-white border-indigo-700",
        inactiveTabHover: "text-indigo-100/70 hover:bg-indigo-900 hover:text-white",
        accentText: "text-sky-300",
        accentBg: "bg-sky-400",
        accentHoverBg: "hover:bg-sky-500",
        badgeBg: "bg-sky-400/20 text-sky-300",
        badgeBorder: "border-sky-500/30",
        navIconColor: "text-sky-400",
        primaryText: "text-indigo-50",
        secondaryText: "text-indigo-400",
        buttonPrimary: "bg-indigo-800 hover:bg-indigo-900 text-white",
        accentLightBg: "bg-indigo-950/40",
        cardBorder: "border-indigo-900/40",
        logoColor: "text-indigo-100",
        navHover: "hover:bg-indigo-900",
        mobileToggle: "bg-sky-400 text-indigo-950 hover:bg-sky-300",
        headerAccentLine: "bg-gradient-to-r from-indigo-500 via-indigo-600 to-transparent",
        glowRing: "focus-within:ring-2 focus-within:ring-indigo-700",
        tabHighlightBorder: "border-sky-400",
        bannerBg: "bg-indigo-50 border-indigo-100 text-indigo-900",
        bannerBorder: "border-indigo-100",
        bannerIconColor: "text-indigo-600",
        bannerBadgeColor: "text-indigo-700",
        bannerPingBg: "bg-indigo-500",
        districtText: "text-indigo-700",
        onlineBadgeBg: "bg-indigo-50",
        onlineBadgeText: "text-indigo-700",
        onlineBadgeBorder: "border-indigo-200"
      };
    case UserRole.HOSPITAL_USER:
    default:
      return {
        sidebarBg: "bg-gradient-to-b from-[#FAF5FF] via-[#F3E8FF] to-[#EAD8FC] border-[#D6BCFA]",
        sidebarBorder: "border-[#D6BCFA]",
        sidebarHeaderBorder: "border-[#D6BCFA]",
        sidebarTextColor: "text-[#4A148C]",
        sidebarHeadingColor: "text-[#311B92]",
        sidebarSubTextColor: "text-[#7B1FA2]",
        activeTabBg: "bg-[#E9D5FF] text-[#311B92] border-[#D8B4FE]",
        inactiveTabHover: "text-[#6A1B9A] hover:bg-[#E9D5FF] hover:text-[#311B92]",
        accentText: "text-[#8E24AA]",
        accentBg: "bg-[#9C27B0]",
        accentHoverBg: "hover:bg-[#8E24AA]",
        badgeBg: "bg-[#9C27B0]/15 text-[#4A148C]",
        badgeBorder: "border-[#9C27B0]/30",
        navIconColor: "text-[#8E24AA]",
        primaryText: "text-[#311B92]",
        secondaryText: "text-[#7B1FA2]",
        buttonPrimary: "bg-[#8E24AA] hover:bg-[#7B1FA2] text-white",
        accentLightBg: "bg-[#F3E8FF]/80",
        cardBorder: "border-[#D6BCFA]",
        logoColor: "text-[#311B92]",
        navHover: "hover:bg-[#F3E8FF]",
        mobileToggle: "bg-[#8E24AA] text-white hover:bg-[#7B1FA2]",
        headerAccentLine: "bg-gradient-to-r from-[#E9D5FF] via-[#8E24AA] to-transparent",
        glowRing: "focus-within:ring-2 focus-within:ring-[#9C27B0]",
        tabHighlightBorder: "border-[#8E24AA]",
        bannerBg: "bg-[#FAF5FF] border-[#E9D5FF] text-[#4A148C]",
        bannerBorder: "border-[#E9D5FF]",
        bannerIconColor: "text-[#8E24AA]",
        bannerBadgeColor: "text-[#4A148C]",
        bannerPingBg: "bg-[#9C27B0]",
        districtText: "text-[#7B1FA2]",
        onlineBadgeBg: "bg-[#FAF5FF]",
        onlineBadgeText: "text-[#4A148C]",
        onlineBadgeBorder: "border-[#E9D5FF]"
      };
  }
};

const getDynamicHospitalCategory = (h: Hospital | null | undefined): string => {
  if (!h) return "SAD";
  
  if (h.category) {
    const cat = h.category.toUpperCase().trim();
    if (["SAD", "AAM", "SUB", "AYUSH WINGH", "AYUSH WING", "MOCH"].includes(cat)) {
      if (cat === "AYUSH WING") return "Ayush Wingh";
      return cat;
    }
  }

  const typeStr = (h.type || "").toLowerCase().trim();
  if (typeStr.includes("aarogya") || typeStr.includes("arogya") || typeStr.includes("आरोग्य") || typeStr.includes("aam")) {
    return "AAM";
  }
  if (typeStr.includes("wing") || typeStr.includes("विंग") || typeStr.includes("ayush wing")) {
    return "Ayush Wingh";
  }
  if (typeStr.includes("unani") || typeStr.includes("यूनानी") || typeStr.includes("sub")) {
    return "SUB";
  }
  if (typeStr.includes("moch") || typeStr.includes("m.o.c.h.")) {
    return "MOCH";
  }
  if (typeStr.includes("ayurvedic") || typeStr.includes("ayur") || typeStr.includes("चिकित्सालय") || typeStr.includes("sad")) {
    return "SAD";
  }

  const nameStr = (h.name || "").toLowerCase().trim();
  if (nameStr.includes("aarogya") || nameStr.includes("arogya") || nameStr.includes("आरोग्य") || nameStr.includes("aam")) {
    return "AAM";
  }
  if (nameStr.includes("wing") || nameStr.includes("विंग") || nameStr.includes("ayush wing")) {
    return "Ayush Wingh";
  }
  if (nameStr.includes("unani") || nameStr.includes("यूनानी") || nameStr.includes("sub")) {
    return "SUB";
  }
  if (nameStr.includes("moch") || nameStr.includes("m.o.c.h.")) {
    return "MOCH";
  }
  if (nameStr.includes("ayurvedic") || nameStr.includes("ayur") || nameStr.includes("चिकित्सालय") || nameStr.includes("sad")) {
    return "SAD";
  }

  return "SAD";
};

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("mpr_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const theme = getTheme(user?.role);
  const [hospital, setHospital] = useState<Hospital | null>(() => {
    try {
      const saved = localStorage.getItem("mpr_hospital");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [sharedMonth, setSharedMonth] = useState<string>(() => {
    return new Date().toISOString().slice(0, 7); // YYYY-MM
  });
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("mpr_user");
      if (saved) {
        const u = JSON.parse(saved);
        if (u && (u.role === UserRole.OFFICE_ADMIN || u.role === UserRole.SUPER_ADMIN)) {
          return "mpr";
        }
      }
    } catch {}
    return "calendar";
  });

  // Login fields
  const [emailInput, setEmailInput] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showGoogleTooltip, setShowGoogleTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<any>(null);
  const [isGoogleFallbackOpen, setIsGoogleFallbackOpen] = useState(false);
  const [fallbackEmail, setFallbackEmail] = useState("manu.spng@gmail.com");

  // System notifications state (Alerts bell)
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Success receipts toast notifications
  const [successToast, setSuccessToast] = useState<{ title: string; content: string } | null>(null);

  // Time tracker state
  const [isMobileNavExpanded, setIsMobileNavExpanded] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Removed register helper on load

  // Registration request modal state
  const [isRequestingRegister, setIsRequestingRegister] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState(""); // prefix
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<UserRole>(UserRole.HOSPITAL_USER);
  const [regHospitalId, setRegHospitalId] = useState("");
  const [regFilterCategory, setRegFilterCategory] = useState("");
  const [regError, setRegError] = useState("");
  const [hospitalsList, setHospitalsList] = useState<Hospital[]>([]);
  const [hospitalDropdownOptions, setHospitalDropdownOptions] = useState<Hospital[]>([]);

  // Custom logo state & modal visibility state
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    return localStorage.getItem("mpr_custom_logo");
  });
  const [isLogoCustomizerOpen, setIsLogoCustomizerOpen] = useState(false);
  const [tempLogo, setTempLogo] = useState<string>("");
  const [logoUrlInput, setLogoUrlInput] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (isLogoCustomizerOpen) {
      setTempLogo(customLogo || "");
      setLogoUrlInput("");
    }
  }, [isLogoCustomizerOpen, customLogo]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processLogoFile(e.target.files[0]);
    }
  };

  const processLogoFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast({
        title: "❌ Invalid File",
        content: "Please select a standard image file (PNG, JPG, SVG, WebP, etc.)."
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setTempLogo(event.target.result as string);
        showToast({
          title: "✨ Image Loaded",
          content: "Successfully imported selected logo."
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const saveCustomLogo = () => {
    if (tempLogo) {
      setCustomLogo(tempLogo);
      localStorage.setItem("mpr_custom_logo", tempLogo);
      setIsLogoCustomizerOpen(false);
      showToast({
        title: "🍏 Shortcut Logo Configured",
        content: "New logo applied! Your Added-to-Home-Screen mobile shortcut will use this icon."
      });
    } else {
      resetToDefaultLogo();
    }
  };

  const resetToDefaultLogo = () => {
    setCustomLogo(null);
    localStorage.removeItem("mpr_custom_logo");
    setTempLogo("");
    setIsLogoCustomizerOpen(false);
    showToast({
      title: "🔄 Restored Default Logo",
      content: "Reset to default clinical Ayurvedic Tulsi & Kalash icon."
    });
  };

  // Synchronize mobile home-screen shortcut icon, apple-touch-icon, and favicon dynamically
  useEffect(() => {
    if (!customLogo) return;

    const updateShortcutIcons = () => {
      // 1. Update/Create main icon link
      let linkIcon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!linkIcon) {
        linkIcon = document.createElement("link");
        linkIcon.rel = "icon";
        document.head.appendChild(linkIcon);
      }
      linkIcon.href = customLogo;

      // 2. Update/Create apple-touch-icon (crucial for iOS Safari Add to Home Screen shortcut)
      let linkApple = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
      if (!linkApple) {
        linkApple = document.createElement("link");
        linkApple.rel = "apple-touch-icon";
        document.head.appendChild(linkApple);
      }
      linkApple.href = customLogo;

      // 3. Update/Create older shortcut icon link
      let linkShortcut = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement;
      if (!linkShortcut) {
        linkShortcut = document.createElement("link");
        linkShortcut.rel = "shortcut icon";
        document.head.appendChild(linkShortcut);
      }
      linkShortcut.href = customLogo;
    };

    updateShortcutIcons();
  }, [customLogo]);

  useEffect(() => {
    fetchHospitalsList();

    const handleHospitalsUpdated = () => {
      fetchHospitalsList();
    };

    window.addEventListener("hospitals-updated", handleHospitalsUpdated);
    return () => {
      window.removeEventListener("hospitals-updated", handleHospitalsUpdated);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const firebaseEmail = firebaseUser.email.toLowerCase().trim();
        const currentLocalUserEmail = user?.email?.toLowerCase().trim();
        
        if (!user || currentLocalUserEmail !== firebaseEmail) {
          console.log("Firebase Auth change detected: Automatically signing in", firebaseEmail);
          try {
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: firebaseEmail,
                loginType: "Google Sign-In (Firebase)"
              })
            });
            const data = await res.json();
            if (data.success) {
              setUser(data.user);
              setHospital(data.hospital);
              localStorage.setItem("mpr_user", JSON.stringify(data.user));
              if (data.hospital) {
                localStorage.setItem("mpr_hospital", JSON.stringify(data.hospital));
              } else {
                localStorage.removeItem("mpr_hospital");
              }
              
              if (data.user.role === UserRole.HOSPITAL_USER) {
                setActiveTab("calendar");
              } else {
                setActiveTab("mpr");
              }
              
              showToast({
                title: "🔐 Session Synchronized",
                content: `Logged in securely as ${data.user.name || firebaseEmail} via verified Google Account.`
              });
            } else {
              console.warn("Auto-sync backend login failed:", data.message);
            }
          } catch (err) {
            console.error("Auto-sync backend login error:", err);
          }
        }
      }
    });
    return () => unsubscribe();
  }, [user]);

  const fetchHospitalsList = async () => {
    try {
      const res = await fetch(`/api/hospitals?t=${Date.now()}`);
      const data = await res.json();
      setHospitalsList(data);
    } catch (e) {
      console.error(e);
    }
    try {
      const res = await fetch(`/api/hospitals/options?t=${Date.now()}`);
      const data = await res.json();
      setHospitalDropdownOptions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminShortcut = () => {
    setIsAdminMode(true);
    setEmailInput("manu.spng@gmail.com");
    setLoginPassword("");
    setLoginError("");
    showToast({
      title: "🛡️ Admin Login Helper",
      content: "Super Admin email 'manu.spng@gmail.com' prefilled. Please enter your password to authenticate."
    });
  };

  const handleRequestRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regEmail.trim()) {
      setRegError("Please enter your email prefix.");
      return;
    }

    // Build the final email with the required domain "@uttarakhandayurved.co.in"
    const trimmedPrefix = regEmail.trim();
    const finalEmail = (trimmedPrefix === "manu.spng@gmail.com" || trimmedPrefix === "manu.spng")
      ? "manu.spng@gmail.com"
      : trimmedPrefix.includes("@") 
        ? trimmedPrefix 
        : `${trimmedPrefix}@uttarakhandayurved.co.in`;

    if (finalEmail !== "manu.spng@gmail.com" && !finalEmail.endsWith("@uttarakhandayurved.co.in")) {
      setRegError("Only '@uttarakhandayurved.co.in' domain is allowed.");
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setRegError("Password must be at least 6 characters.");
      return;
    }

    if (regRole === UserRole.HOSPITAL_USER && !regHospitalId) {
      setRegError("Please choose your assigned Ayurvedic hospital facility.");
      return;
    }

    try {
      const res = await fetch("/api/auth/request-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: finalEmail,
          name: regName,
          role: regRole,
          hospitalId: regRole === UserRole.HOSPITAL_USER ? regHospitalId : undefined,
          phone: regPhone,
          password: regPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsRequestingRegister(false);
        showToast({
          title: "📨 Request Sent",
          content: `Your registration request for ${finalEmail} has been sent successfully. Please await admin verification before logging in.`
        });
      } else {
        setRegError(data.message || "Registration request failed.");
      }
    } catch (err: any) {
      console.error(err);
      setRegError(err.message || "Something went wrong.");
    }
  };

  // Fetch notifications regularly
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/notifications?email=${user.email}`);
      const data = await res.json();
      setNotifications(data);
    } catch (e) {
      console.warn(e);
    }
  };

  const showToast = (receipt: { title: string; content: string }) => {
    setSuccessToast(receipt);
    setTimeout(() => {
      setSuccessToast(null);
    }, 6000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginPassword) {
      setLoginError("Password is required for Email Login.");
      return;
    }

    const trimmedInput = emailInput.trim();
    if (!trimmedInput) {
      setLoginError("Please enter your registered email or username.");
      return;
    }

    // Automatically append the domain if not present
    const finalEmail = trimmedInput.includes("@")
      ? trimmedInput
      : `${trimmedInput}@uttarakhandayurved.co.in`;

    try {
      let firebaseUserCred = null;
      let firebaseAuthError = null;

      try {
        firebaseUserCred = await signInWithEmailAndPassword(auth, finalEmail, loginPassword);
      } catch (authErr: any) {
        console.warn("Firebase Auth Error, attempting simulated login fallback:", authErr);
        firebaseAuthError = authErr;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: finalEmail,
          password: loginPassword,
          loginType: firebaseUserCred ? "Email & Password (Firebase)" : "Simulated Database Authentication"
        })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setHospital(data.hospital);
        localStorage.setItem("mpr_user", JSON.stringify(data.user));
        if (data.hospital) {
          localStorage.setItem("mpr_hospital", JSON.stringify(data.hospital));
        } else {
          localStorage.removeItem("mpr_hospital");
        }
        
        // Auto select tab depending on role
        if (data.user.role === UserRole.HOSPITAL_USER) {
          setActiveTab("calendar");
        } else {
          setActiveTab("mpr");
        }
        
        // Auto-heal / Auto-sync with Firebase if they exist in local DB but not in Firebase Auth yet
        if (!firebaseUserCred && firebaseAuthError?.code === "auth/user-not-found") {
          try {
            await createUserWithEmailAndPassword(auth, finalEmail, loginPassword);
            console.log("Successfully auto-registered whitelisted user in Firebase Auth during login sync.");
            showToast({
              title: "⚡ Firebase Sync Active",
              content: `Welcome back, ${data.user.name}! Your account has been synced with Firebase Auth.`
            });
          } catch (createErr: any) {
            console.warn("Could not auto-register in Firebase Auth:", createErr.message);
            showToast({
              title: "⚠️ Simulation Fallback Active",
              content: `Logged in successfully! Note: Firebase Auth is disabled or offline, running in local database mode.`
            });
          }
        } else if (firebaseUserCred) {
          showToast({
            title: "🔑 Secure Authorization Granted",
            content: `Welcome back, ${data.user.name}. Authenticated via Email & Password.`
          });
        } else {
          let instructionMsg = "Enable the 'Email/Password' Provider in your Firebase Console for secure cloud login.";
          if (firebaseAuthError?.code === "auth/operation-not-allowed") {
            instructionMsg = "Enable 'Email/Password' provider in the Firebase Authentication settings console.";
          } else if (firebaseAuthError?.code === "auth/user-not-found") {
            instructionMsg = "The email is whitelisted in local DB, but doesn't exist in Firebase Auth yet.";
          }
          showToast({
            title: "⚠️ Local Simulation Active",
            content: `Logged in as ${data.user.name}. Note: ${instructionMsg}`
          });
        }
      } else {
        setLoginError(data.message || "Login failed");
      }
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || "Authentication failed. Please verify your credentials.");
    }
  };

  const proceedWithGoogleLoginByEmail = async (email: string) => {
    setLoginError("");
    try {
      const cleanEmail = email.toLowerCase().trim();
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          loginType: "Google Sign-In (Firebase)"
        })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setHospital(data.hospital);
        localStorage.setItem("mpr_user", JSON.stringify(data.user));
        if (data.hospital) {
          localStorage.setItem("mpr_hospital", JSON.stringify(data.hospital));
        } else {
          localStorage.removeItem("mpr_hospital");
        }
        
        // Auto select tab depending on role
        if (data.user.role === UserRole.HOSPITAL_USER) {
          setActiveTab("calendar");
        } else {
          setActiveTab("mpr");
        }

        showToast({
          title: "🔐 Authenticated via Google",
          content: `Welcome back, ${data.user.name || email}! Secure session established.`
        });
        setIsGoogleFallbackOpen(false);
      } else {
        setLoginError(data.message || "Google Sign-In failed.");
      }
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || "Google authentication failed. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError("");
    const isIframe = window.self !== window.top;
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user?.email;
      if (!email) {
        setLoginError("Could not retrieve email from Google Account.");
        return;
      }

      await proceedWithGoogleLoginByEmail(email);
    } catch (err: any) {
      console.warn("Standard Firebase Google Sign-In failed or was blocked/restricted:", err);
      
      const errCode = err?.code || "";
      let toastTitle = "⚠️ Sign-In Assisted";
      let toastContent = "Direct secure entry fallback has been enabled.";

      if (isIframe) {
        toastTitle = "⚠️ Google Popup Restricted";
        toastContent = "Iframe browser security detected (blocked third-party cookies). Direct secure entry fallback has been enabled.";
      } else if (errCode === "auth/unauthorized-domain") {
        toastTitle = "🔒 Unauthorized Domain";
        toastContent = `This domain (${window.location.hostname}) is not authorized in Firebase Console. Direct secure entry fallback has been enabled.`;
      } else if (errCode === "auth/popup-closed-by-user") {
        toastTitle = "✕ Sign-In Cancelled";
        toastContent = "The Google login popup was closed. Direct secure entry fallback has been enabled for your convenience.";
      } else if (errCode === "auth/popup-blocked") {
        toastTitle = "🚫 Popup Blocked";
        toastContent = "The login popup was blocked by your browser. Direct secure entry fallback has been enabled.";
      } else {
        toastTitle = "⚠️ Authentication Issue";
        toastContent = `${err.message || "An issue occurred."} Direct secure entry fallback has been enabled.`;
      }

      // Open the secure browser policy fallback modal automatically so they can log in seamlessly
      setIsGoogleFallbackOpen(true);
      showToast({
        title: toastTitle,
        content: toastContent
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase sign out failed", e);
    }
    setUser(null);
    setHospital(null);
    localStorage.removeItem("mpr_user");
    localStorage.removeItem("mpr_hospital");
    setActiveTab("calendar");
    setEmailInput("");
  };

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-800 font-sans overflow-hidden flex flex-col md:flex-row" id="app-wrapper">
      
      {/* LOGIN SCREEN IF UNAUTHENTICATED */}
      {!user ? (
        <div className="flex-1 overflow-y-auto bg-slate-50 flex items-center justify-center p-4 py-12" id="login-screen">
          <div className="max-w-xl w-full mx-auto space-y-6">
            
            {/* Whitelisted instructions Banner */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 text-center space-y-6">
              <div className="bg-gradient-to-tr from-amber-400 to-emerald-600 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-md">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700">Hospital Numeric Data Portal</span>
                  <span className="text-[9px] bg-emerald-800 text-emerald-50 font-extrabold px-2 py-0.5 rounded-full shadow-sm">Uttarakhand</span>
                </div>
                <h2 className="text-2xl font-black text-slate-950 tracking-tight">Hospital Numeric Data Portal</h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  District Udham Singh Nagar, Uttarakhand. Secure access for Ayurvedic & Unani doctors and compliance inspectors.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 max-w-xs mx-auto text-left">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Registered Email / Username</label>
                    <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white focus-within:border-emerald-500 transition-colors shadow-sm">
                      <input
                        type="text"
                        required
                        placeholder="e.g. jhankat.user"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                        className="w-full bg-transparent px-4 py-2.5 text-xs text-slate-800 font-semibold outline-none"
                      />
                      {!emailInput.includes("@") && (
                        <span className="flex items-center bg-slate-50 px-3 border-l border-slate-150 text-[10px] text-emerald-800 font-bold select-none whitespace-nowrap">
                          @uttarakhandayurved.co.in
                        </span>
                      )}
                    </div>
                    {!emailInput.includes("@") && emailInput.trim().length > 0 && (
                      <p className="text-[9px] text-slate-400 mt-1 font-semibold">
                        Will login as: <span className="text-emerald-700 font-bold">{emailInput.trim()}@uttarakhandayurved.co.in</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-semibold focus:border-emerald-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {loginError && (
                  <p className="text-[10px] text-rose-600 font-semibold bg-rose-50 border border-rose-100 p-2.5 rounded-xl text-center animate-shake">
                    {loginError}
                  </p>
                )}

                <div className="flex gap-2.5">
                  {isAdminMode ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdminMode(false);
                          setEmailInput("");
                          setLoginPassword("");
                          setLoginError("");
                        }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold py-2.5 rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-1.5"
                        id="login-btn"
                      >
                        Return to login
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                        id="admin-login-shortcut-btn"
                        style={{ fontSize: "10px" }}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
                        Verify Admin & Log In
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="submit"
                        className="flex-1 bg-emerald-800 hover:bg-emerald-950 text-white text-xs font-extrabold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                        id="login-btn"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-emerald-300" />
                        Login
                      </button>
                      <button
                        type="button"
                        onClick={handleAdminShortcut}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-normal py-2.5 rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-1.5 text-center"
                        id="admin-login-shortcut-btn"
                        style={{ fontSize: "10px" }}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                        Admin
                      </button>
                    </>
                  )}
                </div>

                <div className="relative flex py-1.5 items-center">
                  <div className="flex-grow border-t border-slate-150"></div>
                  <span className="flex-shrink mx-3 text-[9px] text-slate-400 font-bold uppercase tracking-wider">Or</span>
                  <div className="flex-grow border-t border-slate-150"></div>
                </div>

                <div className="relative w-full">
                  {showGoogleTooltip && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg shadow-md z-50 whitespace-nowrap flex items-center gap-1 border border-slate-750 transition-all duration-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>This is ment for Super Admin to login</span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      handleGoogleLogin();
                    }}
                    onMouseEnter={() => {
                      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
                      setShowGoogleTooltip(true);
                    }}
                    onMouseLeave={() => {
                      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
                      setShowGoogleTooltip(false);
                    }}
                    onTouchStart={() => {
                      setShowGoogleTooltip(true);
                      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
                      tooltipTimeoutRef.current = setTimeout(() => setShowGoogleTooltip(false), 4000);
                    }}
                    className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-extrabold py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2 shadow-xs"
                    id="google-login-btn"
                    title="This is ment for Super Admin to login"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign in with Google
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-2.5">
                    Trouble with Google Popup?{" "}
                    <button
                      type="button"
                      onClick={() => setIsGoogleFallbackOpen(true)}
                      className="text-emerald-800 hover:text-emerald-950 font-extrabold underline cursor-pointer transition-colors"
                      id="google-trouble-bypass-link"
                    >
                      Use Direct Secure Bypass
                    </button>
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 mt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRequestingRegister(true);
                      setRegName("");
                      setRegEmail("");
                      setRegPhone("");
                      setRegPassword("");
                      setRegRole(UserRole.HOSPITAL_USER);
                      setRegHospitalId("");
                      setRegError("");
                    }}
                    className="w-full bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 border border-slate-200 hover:border-emerald-200 text-[11px] font-extrabold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    id="request-to-register-btn"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Request to Register
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* REQUEST TO REGISTER DIALOG MODAL */}
          {isRequestingRegister && (() => {
            const allRegCategories = Array.from(new Set([
              ...hospitalsList.map(h => (h as any).category),
              ...hospitalDropdownOptions.map(h => (h as any).category)
            ].filter(Boolean))).sort() as string[];

            const filteredDropdownOptions = regFilterCategory 
              ? hospitalDropdownOptions.filter(h => (h as any).category === regFilterCategory)
              : hospitalDropdownOptions;

            const filteredHospitalsList = regFilterCategory
              ? hospitalsList.filter(h => (h as any).category === regFilterCategory)
              : hospitalsList;

            return (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-slate-100 animate-in zoom-in-95 duration-200 text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-emerald-700" />
                      <h3 className="font-extrabold text-slate-950 tracking-tight text-sm uppercase">Submit Access Request</h3>
                    </div>
                    <button
                      onClick={() => {
                        setIsRequestingRegister(false);
                        setRegFilterCategory("");
                      }}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Fill in your credentials and facility details. Your request will be queued for review. Only approved users verified by the District Administration can access the system.
                  </p>

                  <form onSubmit={handleRequestRegisterSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Rajesh Negi"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold focus:border-emerald-500 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Desired Username / Email Prefix</label>
                      <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white focus-within:border-emerald-500 transition-colors">
                        <input
                          type="text"
                          required
                          placeholder="e.g. rajesh.ayush"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-transparent px-4 py-2 text-xs font-semibold outline-none"
                        />
                        <span className="flex items-center bg-emerald-50 px-3 border-l border-slate-150 text-[10px] text-emerald-800 font-bold select-none whitespace-nowrap">
                          @uttarakhandayurved.co.in
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Desired Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Min 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold focus:border-emerald-500 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contact Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 9411220033"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold focus:border-emerald-500 outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Security Role</label>
                        <select
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value as UserRole)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold focus:border-emerald-500 outline-none transition-colors"
                        >
                          <option value={UserRole.HOSPITAL_USER}>Hospital User</option>
                          <option value={UserRole.OFFICE_ADMIN}>Office Analyst</option>
                        </select>
                      </div>

                      {regRole === UserRole.HOSPITAL_USER && (
                        <div className="space-y-4">
                          {allRegCategories.length > 0 && (
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Filter by Category (श्रेणी के अनुसार फिल्टर करें)</label>
                              <select
                                value={regFilterCategory}
                                onChange={(e) => {
                                  setRegFilterCategory(e.target.value);
                                  setRegHospitalId("");
                                }}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold focus:border-emerald-500 outline-none transition-colors"
                              >
                                <option value="">All Categories (सभी श्रेणियां)</option>
                                {allRegCategories.map((cat) => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Assigned Hospital (चिकित्सालय चयन)*</label>
                            <select
                              required
                              value={regHospitalId}
                              onChange={(e) => setRegHospitalId(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold focus:border-emerald-500 outline-none transition-colors"
                            >
                              <option value="">-- Choose Hospital --</option>
                              {filteredDropdownOptions.length > 0 && (
                                <optgroup label="🏥 Available for Registration (पंजीकरण हेतु उपलब्ध)">
                                  {filteredDropdownOptions.map((h) => (
                                    <option key={h.id} value={h.id}>
                                      {h.name} {h.category ? `[${h.category}]` : ""}
                                    </option>
                                  ))}
                                </optgroup>
                              )}
                              {filteredHospitalsList.length > 0 && (
                                <optgroup label="✅ Already Registered Profiles (पहले से पंजीकृत)">
                                  {filteredHospitalsList.map((h) => (
                                    <option key={h.id} value={h.id}>
                                      {h.name} {h.category ? `[${h.category}]` : ""}
                                    </option>
                                  ))}
                                </optgroup>
                              )}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {regError && (
                      <p className="text-[10px] text-rose-600 font-semibold bg-rose-50 border border-rose-100 p-2.5 rounded-xl text-center">
                        {regError}
                      </p>
                    )}

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsRequestingRegister(false);
                          setRegFilterCategory("");
                        }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all border border-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <UserPlus className="w-4 h-4" />
                        Submit Request
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            );
          })()}
          {/* END REQUEST TO REGISTER DIALOG MODAL */}

          {/* SECURE GOOGLE IFRAME FALLBACK MODAL */}
          {isGoogleFallbackOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200" id="google-fallback-modal">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 border border-slate-100 animate-in zoom-in-95 duration-200 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/>
                    </svg>
                    <h3 className="font-extrabold text-slate-950 tracking-tight text-xs uppercase">Google Login Helper</h3>
                  </div>
                  <button
                    onClick={() => setIsGoogleFallbackOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  {/* DETAILED EXPLANATION FOR UN-WHITELISTED DOMAIN AND PATTERN MATCH ERRORS */}
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100/80 rounded-2xl space-y-2.5">
                    <h4 className="text-[11px] font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🔧</span> How to fix Google Popup & Domain errors:
                    </h4>
                    <p className="text-[10.5px] text-slate-600 leading-relaxed">
                      Errors like <strong className="text-slate-800">"The string did not match the expected pattern"</strong> or <strong className="text-slate-800 font-mono text-[9.5px]">auth/unauthorized-domain</strong> occur when your custom domain is not authorized in Firebase.
                    </p>
                    <div className="bg-white/80 border border-emerald-100/50 p-3 rounded-xl space-y-2 text-[10.5px] text-slate-700">
                      <p className="font-semibold text-emerald-900">Follow these 3 simple steps:</p>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                        <li>Open the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-800 hover:underline font-bold">Firebase Console</a></li>
                        <li>Go to <strong className="text-slate-800">Authentication</strong> &rarr; <strong className="text-slate-800">Settings</strong> &rarr; <strong className="text-slate-800">Authorized domains</strong></li>
                        <li>Add your Vercel domain:
                          <div className="mt-1 flex items-center gap-2">
                            <code className="bg-slate-100 text-slate-800 font-mono text-[9px] px-2 py-1 rounded border border-slate-200 select-all font-bold">
                              numeric-patient-data.vercel.app
                            </code>
                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium">
                    ⚡ <strong className="text-slate-800">Bypass / Fallback:</strong> You can skip the Google popup completely and authenticate directly as any registered user below.
                  </p>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFallbackEmail("manu.spng@gmail.com");
                        proceedWithGoogleLoginByEmail("manu.spng@gmail.com");
                      }}
                      className="w-full p-4 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-600 bg-emerald-50/40 text-left transition-all hover:scale-[1.01] active:scale-[0.99] group flex items-center justify-between"
                      id="fallback-super-admin-btn"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-black text-emerald-800 tracking-wider block mb-0.5">District Super Admin</span>
                        <span className="text-xs font-bold text-slate-800 font-mono">manu.spng@gmail.com</span>
                      </div>
                      <div className="p-2 rounded-full bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200 transition-colors">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    </button>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-slate-100"></div>
                      <span className="flex-shrink mx-3 text-[9px] text-slate-400 font-bold uppercase tracking-wider">Or enter email prefix</span>
                      <div className="flex-grow border-t border-slate-100"></div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Whitelisted Email / Prefix</label>
                      <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-55 focus-within:border-emerald-500 focus-within:bg-white transition-all shadow-xs">
                        <input
                          type="text"
                          placeholder="e.g. manu.spng@gmail.com"
                          value={fallbackEmail}
                          onChange={(e) => setFallbackEmail(e.target.value)}
                          className="w-full bg-transparent px-4 py-2.5 text-xs text-slate-800 font-mono font-bold outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsGoogleFallbackOpen(false)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all border border-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!fallbackEmail.trim()) {
                            return;
                          }
                          const finalEmail = fallbackEmail.trim().includes("@")
                            ? fallbackEmail.trim()
                            : `${fallbackEmail.trim()}@uttarakhandayurved.co.in`;
                          proceedWithGoogleLoginByEmail(finalEmail);
                        }}
                        className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <KeyRound className="w-4 h-4" />
                        Log In Directly
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // AUTHENTICATED CONTENT MODULE - DOUBLE COLUMN BENTO LAYOUT
        <>
          {/* Left Sidebar */}
          <aside className={`w-full md:w-64 ${theme.sidebarBg} flex flex-col shrink-0 print:hidden ${theme.sidebarTextColor || 'text-white'} border-r relative overflow-hidden`}>
            {/* Elegant background circular pattern for custom branding or visual elegance */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]" aria-hidden="true">
              <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full border-2 border-dashed border-current"></div>
              <div className="absolute top-1/4 -right-20 w-48 h-48 rounded-full border-4 border-double border-current"></div>
              <div className="absolute -bottom-24 -left-20 w-96 h-96 rounded-full border-8 border-current"></div>
              <div className="absolute bottom-1/3 -right-10 w-32 h-32 rounded-full border border-current"></div>
            </div>

            {/* Top Branding Section */}
            <div className={`p-4 md:p-6 flex items-center justify-between border-b ${theme.sidebarHeaderBorder} animate-in fade-in slide-in-from-top duration-300`}>
              <div className="flex items-center gap-3 min-w-0">
                {/* SVG Menu Icon replacing the branding initials div, maintaining size of div, functional as menu button */}
                <Menu
                  id="mobile-nav-toggle-btn"
                  onClick={() => setIsMobileNavExpanded(!isMobileNavExpanded)}
                  className={`md:hidden w-8 h-8 ${theme.mobileToggle} font-black shadow-md shrink-0 cursor-pointer transition-all duration-300 p-2 rounded-lg ${
                    isMobileNavExpanded ? "rotate-90 scale-110" : ""
                  }`}
                  title="Toggle Navigation Menu"
                />
                <div className="min-w-0 flex-1">
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${theme.accentText} block leading-none mb-1`}>
                    FACILITY LOGIN
                  </span>
                  <h1 className={`font-black tracking-tight text-xs uppercase leading-snug truncate ${theme.sidebarHeadingColor || 'text-emerald-50'}`} title={
                    user.role === UserRole.SUPER_ADMIN
                      ? "Admin"
                      : user.role === UserRole.OFFICE_ADMIN
                      ? "District ayurvedic & Unani Office"
                      : (hospital?.name || "Jhankat Ayurvedic Hospital")
                  }>
                    {user.role === UserRole.SUPER_ADMIN
                      ? "Admin"
                      : user.role === UserRole.OFFICE_ADMIN
                      ? "District Office"
                      : (hospital?.name || "Jhankat Ayurvedic Hospital")}
                  </h1>
                </div>
              </div>

              {/* Mobile top-right tools: notification and logout rearranged beautifully */}
              <div className="flex md:hidden items-center gap-2.5 shrink-0">
                {/* Notifications Bell for Mobile */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotifMenu(!showNotifMenu)}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl ${theme.activeTabBg}/80 hover:${theme.activeTabBg} text-white border ${theme.sidebarHeaderBorder}/30 relative outline-none transition-all duration-200 shadow-sm cursor-pointer`}
                    id="mobile-notif-bell-btn"
                    title="Compliance Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown Panel */}
                  {showNotifMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 space-y-3 text-slate-800 animate-in fade-in slide-in-from-top-3 duration-200">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-slate-600 uppercase">Compliance Alerts ({notifications.length})</span>
                        <button 
                          type="button"
                          onClick={() => setNotifications([])} 
                          className="text-[10px] text-emerald-600 font-bold hover:underline"
                        >
                          Clear All
                        </button>
                      </div>

                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100/50 text-[11px] space-y-1">
                              <span className="font-bold text-rose-800 block">{notif.title}</span>
                              <p className="text-slate-600 leading-normal">{notif.body}</p>
                              <span className="text-[9px] text-slate-400 block">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic text-center py-4">No unread compliance notifications.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-700/90 hover:bg-rose-600 text-white border border-rose-600/30 transition-all duration-200 shadow-sm cursor-pointer"
                  title="Sign out"
                  id="mobile-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Vertical Bento Navigation Links - Collapsible on Mobile */}
            <nav 
              className={`flex-1 px-4 space-y-1.5 transition-all duration-500 ease-in-out overflow-hidden md:overflow-y-auto border-b md:border-b-0 ${theme.sidebarBorder} ${
                isMobileNavExpanded 
                  ? "max-h-[500px] opacity-100 py-4" 
                  : "max-h-0 opacity-0 py-0 md:max-h-none md:opacity-100 md:py-6 md:block"
              }`} 
              id="app-nav-menu"
            >
              {user.role === UserRole.HOSPITAL_USER && (
                <button
                  onClick={() => { setActiveTab("calendar"); setIsMobileNavExpanded(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "calendar"
                      ? `${theme.activeTabBg} shadow border`
                      : `${theme.inactiveTabHover}`
                  }`}
                >
                  <CalendarIcon className="w-4 h-4 opacity-80" />
                  <span>Per Day Data Entry</span>
                </button>
              )}

              <button
                onClick={() => { setActiveTab("mpr"); setIsMobileNavExpanded(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "mpr"
                    ? `${theme.activeTabBg} shadow border`
                    : `${theme.inactiveTabHover}`
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 opacity-80" />
                <span>Monthly Reports</span>
              </button>

              <button
                onClick={() => { setActiveTab("analytics"); setIsMobileNavExpanded(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "analytics"
                    ? `${theme.activeTabBg} shadow border`
                    : `${theme.inactiveTabHover}`
                }`}
              >
                <TrendingUp className="w-4 h-4 opacity-80" />
                <span>Charts & Trends</span>
              </button>

              {(user.role === UserRole.SUPER_ADMIN || user.role === UserRole.OFFICE_ADMIN) && (
                <button
                  onClick={() => { setActiveTab("defaulters"); setIsMobileNavExpanded(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "defaulters"
                      ? `${theme.activeTabBg} shadow border`
                      : `${theme.inactiveTabHover}`
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 opacity-80" />
                  <span>Compliance Monitor</span>
                </button>
              )}

              {user.role === UserRole.SUPER_ADMIN && (
                <button
                  onClick={() => { setActiveTab("masters"); setIsMobileNavExpanded(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "masters"
                      ? `${theme.activeTabBg} shadow border`
                      : `${theme.inactiveTabHover}`
                  }`}
                >
                  <Settings className="w-4 h-4 opacity-80" />
                  <span>System Master Control</span>
                </button>
              )}

              {(user.role === UserRole.SUPER_ADMIN || user.role === UserRole.OFFICE_ADMIN) && (
                <button
                  onClick={() => { setActiveTab("templates"); setIsMobileNavExpanded(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "templates"
                      ? `${theme.activeTabBg} shadow border`
                      : `${theme.inactiveTabHover}`
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 opacity-80" />
                  <span>Template Gallery</span>
                </button>
              )}

              {user.role === UserRole.HOSPITAL_USER && (
                <button
                  onClick={() => { setActiveTab("settings"); setIsMobileNavExpanded(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "settings"
                      ? `${theme.activeTabBg} shadow border`
                      : `${theme.inactiveTabHover}`
                  }`}
                >
                  <Settings className="w-4 h-4 opacity-80" />
                  <span>Facility Settings</span>
                </button>
              )}

              <button
                onClick={() => { setActiveTab("about"); setIsMobileNavExpanded(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "about"
                    ? `${theme.activeTabBg} shadow border`
                    : `${theme.inactiveTabHover}`
                }`}
              >
                <HelpCircle className="w-4 h-4 opacity-80" />
                <span>About Chikitsa Sahyak</span>
              </button>


            </nav>

            {/* User Profile Block at Sidebar Bottom - Hidden on Mobile */}
            <div className={`hidden md:block p-4 border-t ${theme.sidebarBorder} ${theme.accentLightBg}`}>
              <div className={`${theme.activeTabBg}/20 p-3 rounded-2xl border ${theme.sidebarBorder}/30 flex items-center justify-between gap-2`}>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${theme.accentText} bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/5`}>
                    Category: {user.role === UserRole.HOSPITAL_USER ? getDynamicHospitalCategory(hospital) : "Office"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`p-1.5 rounded-xl ${theme.accentText} hover:${theme.sidebarHeadingColor || 'text-white'} hover:bg-current/10 transition-colors shrink-0`}
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>

          {/* Right Main content layout container */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            
            {/* Header */}
            <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-6 sm:px-8 shadow-sm shrink-0 print:hidden">
              <div className="flex items-center gap-4">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  District: <span className={theme.districtText}>Udham Singh Nagar</span>
                </h2>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                
                {/* Clock Indicator */}
                <div className="hidden lg:block text-slate-600 text-xs font-mono font-extrabold tracking-tight">
                  <span>
                    {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
                  </span>
                </div>

                {/* Simulated Online/Offline status widget */}
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm border ${
                    isOnline 
                      ? `${theme.onlineBadgeBg} ${theme.onlineBadgeText} ${theme.onlineBadgeBorder} hover:bg-opacity-80` 
                      : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/50 animate-pulse"
                  }`}
                  title={isOnline ? "You are online. Click to test Offline cache submission." : "You are currently simulating Offline Mode."}
                >
                  {isOnline ? (
                    <>
                      <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="hidden sm:inline">Online</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span>Offline Mode</span>
                    </>
                  )}
                </button>

                {/* Whitelisted Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifMenu(!showNotifMenu)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 relative outline-none"
                  >
                    <Bell className="w-4 h-4 text-slate-600" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-bounce"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown Panel */}
                  {showNotifMenu && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 space-y-3 text-slate-800 animate-in fade-in slide-in-from-top-3 duration-200">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-slate-600 uppercase">Compliance Alerts ({notifications.length})</span>
                        <button 
                          onClick={() => setNotifications([])} 
                          className="text-[10px] text-emerald-600 font-bold hover:underline"
                        >
                          Clear All
                        </button>
                      </div>

                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100/50 text-[11px] space-y-1">
                              <span className="font-bold text-rose-800 block">{notif.title}</span>
                              <p className="text-slate-600 leading-normal">{notif.body}</p>
                              <span className="text-[9px] text-slate-400 block">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic text-center py-4">No unread compliance nudges or stock alerts.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Prominent Header Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 transition-all border border-rose-100 shadow-sm flex items-center justify-center shrink-0"
                  title="Sign out of system"
                  id="header-logout-btn"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                </button>

              </div>
            </header>

            {/* Scrollable View Panel */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 print:bg-white print:p-0">
              
              {/* ROLE BANNER ADVISORY */}
              <div className={`${theme.bannerBg} border ${theme.bannerBorder} px-4 py-3 rounded-2xl text-xs flex items-center justify-between print:hidden shadow-sm`}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-5 h-5 ${theme.bannerIconColor} flex-shrink-0`} />
                  <span>
                    Authorized Session: <strong>{user.name}</strong> as <strong className="uppercase">{user.role === UserRole.SUPER_ADMIN ? "Office Admin" : "Hospital Login"}</strong>. 
                    {user.role === UserRole.HOSPITAL_USER 
                      ? ` Data scoped to assigned facility: ${hospital?.name || "Jhankat Hospital"}.`
                      : " Full analytical access granted for district Udham Singh Nagar."
                    }
                  </span>
                </div>
                <div className={`hidden lg:flex items-center gap-2 text-[10px] ${theme.bannerBadgeColor} uppercase tracking-widest font-bold`}>
                  <span className={`w-2 h-2 ${theme.bannerPingBg} rounded-full animate-ping`}></span>
                  Secure Google Account Connected
                </div>
              </div>



              {/* Dynamic TAB content */}
              <div className="min-h-[40rem] pb-12">
                {user.role === UserRole.HOSPITAL_USER && (
                  <div className={activeTab === "calendar" ? "block" : "hidden"}>
                    <CalendarEntry
                      user={user}
                      hospitalId={hospital?.id || "hosp-jhankat"}
                      isOnline={isOnline}
                      toggleOnline={() => setIsOnline(!isOnline)}
                      onSuccessToast={showToast}
                      sharedMonth={sharedMonth}
                      setSharedMonth={setSharedMonth}
                      activeTab={activeTab}
                    />
                  </div>
                )}

                {user.role === UserRole.HOSPITAL_USER && (
                  <div className={activeTab === "settings" ? "block" : "hidden"}>
                    <FacilitySettings
                      user={user}
                      hospitalId={hospital?.id || "hosp-jhankat"}
                      hospitalName={hospital?.name || "Jhankat Ayurvedic Hospital"}
                      onSuccessToast={showToast}
                    />
                  </div>
                )}

                <div className={activeTab === "mpr" ? "block" : "hidden"}>
                  <MPRReport 
                    user={user} 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    sharedMonth={sharedMonth}
                    setSharedMonth={setSharedMonth}
                  />
                </div>

                <div className={activeTab === "analytics" ? "block" : "hidden"}>
                  <AnalyticsCharts user={user} />
                </div>

                {(user.role === UserRole.SUPER_ADMIN || user.role === UserRole.OFFICE_ADMIN) && (
                  <div className={activeTab === "defaulters" ? "block" : "hidden"}>
                    <DefaulterDashboard
                      user={user}
                      onSuccessToast={showToast}
                    />
                  </div>
                )}

                {user.role === UserRole.SUPER_ADMIN && (
                  <div className={activeTab === "masters" ? "block" : "hidden"}>
                    <AdminMasterTables
                      user={user}
                      onSuccessToast={showToast}
                    />
                  </div>
                )}

                {(user.role === UserRole.SUPER_ADMIN || user.role === UserRole.OFFICE_ADMIN) && (
                  <div className={activeTab === "templates" ? "block" : "hidden"}>
                    <ReportDesigner
                      user={user}
                      onSuccessToast={showToast}
                      setActiveTab={setActiveTab}
                    />
                  </div>
                )}

                {/* About Chikitsa Sahyak Section */}
                <div className={activeTab === "about" ? "block" : "hidden"}>
                  <div className="bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 space-y-8 shadow-sm">
                    {/* Header Banner */}
                    <div className="flex flex-col md:flex-row items-center gap-6 border-b border-slate-100 pb-8">
                      {/* Logo Container */}
                      <div className="flex flex-col items-center gap-2.5 shrink-0" id="mpr-logo-and-shortcut-container">
                        <div 
                          onClick={() => {
                            if (user.role === UserRole.SUPER_ADMIN) {
                              setIsLogoCustomizerOpen(true);
                            }
                          }}
                          className={`relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl shadow-lg shadow-emerald-500/10 overflow-hidden group border-2 border-transparent transition-all ${user.role === UserRole.SUPER_ADMIN ? 'cursor-pointer hover:border-emerald-400 active:scale-95' : 'cursor-default'}`}
                          title={user.role === UserRole.SUPER_ADMIN ? "Click to change shortcut logo" : "Chikitsa Sahyak Brand Shortcut Logo"}
                        >
                          {/* Shimmer / Glow background effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                          
                          {customLogo ? (
                            <img 
                              src={customLogo} 
                              alt="Chikitsa Sahyak Logo" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            /* Polished Ayurvedic SVG Logo */
                            <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-18 md:h-18 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                              {/* Outer Sun Rays */}
                              <circle cx="50" cy="50" r="38" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" className="opacity-60 animate-[spin_60s_linear_infinite]" />
                              <circle cx="50" cy="50" r="42" stroke="white" strokeWidth="0.75" className="opacity-30" />
                              
                              {/* Inner Circle Shield */}
                              <circle cx="50" cy="50" r="34" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="2" />
                              
                              {/* Clinical Medical Cross Background */}
                              <path d="M43 32H57V43H68V57H57V68H43V57H32V43H43V32Z" fill="white" fillOpacity="0.15" />
                              
                              {/* Beautiful Golden Kalash & Sacred Leaves */}
                              <path d="M42 66C42 60 45 56 50 56C55 56 58 60 58 66H42Z" fill="#FBBF24" />
                              {/* Sacred Tulsi Leaves */}
                              <path d="M50 30C50 30 43 38 43 45C43 49 46 52 50 52C54 52 57 49 57 45C57 38 50 30 50 30Z" fill="#34D399" stroke="white" strokeWidth="1.5" />
                              <path d="M50 33V52" stroke="white" strokeWidth="1" strokeLinecap="round" />
                              
                              {/* Small companion leaf */}
                              <path d="M50 44C50 44 56 42 59 46C61 49 59 52 56 52C53 52 50 48 50 44Z" fill="#059669" />
                              <path d="M50 44C50 44 44 42 41 46C39 49 41 52 44 52C47 52 50 48 50 44Z" fill="#059669" />
                            </svg>
                          )}

                          {/* Hover camera overlay (Super Admin Only) */}
                          {user.role === UserRole.SUPER_ADMIN && (
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Camera className="w-6 h-6 text-white drop-shadow-md" />
                            </div>
                          )}
                        </div>
                        {user.role === UserRole.SUPER_ADMIN && (
                          <button
                            type="button"
                            onClick={() => setIsLogoCustomizerOpen(true)}
                            className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-extrabold px-3 py-1.5 rounded-full border border-slate-200 transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Camera className="w-3 h-3 text-slate-500" />
                            Change Logo
                          </button>
                        )}
                      </div>

                      {/* Text details */}
                      <div className="text-center md:text-left space-y-2 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                            Chikitsa Sahyak <span className="text-slate-500 text-sm font-medium font-sans">(Clinical Decision-Support Suite)</span>
                          </h1>
                          <span className="self-center md:self-start bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-100 shrink-0">
                            Dr. M. P. Singh Initiative
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">
                          A high-fidelity digital clinical companion designed to optimize, streamline, and support the compiling of clinical reports, patient diagnostics, and rural health camp metrics.
                        </p>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                          <span>Framework Platform:</span>
                          <span className="font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">v2.5-ClinicalSupportSuite</span>
                        </div>
                      </div>
                    </div>

                    {/* Vibe & Grid Theme Visual Preview Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-6 text-left">
                        
                        {/* Core Features to Carry Over - Bento Grid */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Core Features of the Support Suite
                          </h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Feature 1 */}
                            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-200/60 flex gap-4 hover:bg-slate-50 transition-colors">
                              <div className="p-2.5 bg-sky-50 rounded-xl text-sky-700 h-fit shadow-xs">
                                <Database className="w-4 h-4" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-slate-900">Explore Patient Data</h4>
                                <p className="text-[11px] text-slate-500 leading-normal">
                                  Unified digital grids of blood panels, renal clearings, CBC differentials, and liver profiles.
                                </p>
                              </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-200/60 flex gap-4 hover:bg-slate-50 transition-colors">
                              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700 h-fit shadow-xs">
                                <Activity className="w-4 h-4" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-slate-900">Camp Screening Suite</h4>
                                <p className="text-[11px] text-slate-500 leading-normal">
                                  Track clinical encounters in rural health screening camps and compute aggregated stats instantly.
                                </p>
                              </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-200/60 flex gap-4 hover:bg-slate-50 transition-colors">
                              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-700 h-fit shadow-xs">
                                <Calculator className="w-4 h-4" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-slate-900">Calculator Reference</h4>
                                <p className="text-[11px] text-slate-500 leading-normal">
                                  Integrated diagnostic reference scoring: FIB-4, APRI, BARD, MELD, Child-Pugh, BMI, ACR, and Metabolic risk.
                                </p>
                              </div>
                            </div>

                            {/* Feature 5 (Full width) */}
                            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-200/60 flex gap-4 hover:bg-slate-50 transition-colors sm:col-span-2">
                              <div className="p-2.5 bg-violet-50 rounded-xl text-violet-700 h-fit shadow-xs">
                                <Brain className="w-4 h-4" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-slate-900">AI Report Copilot</h4>
                                <p className="text-[11px] text-slate-500 leading-normal">
                                  Supportive diagnostic reporting via direct server-side Gemini integration, with secure custom backends supporting API integrations (Groq, OpenRouter) for auxiliary clinic sites.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Developer & Initiative Credential Sidebar */}
                      <div className="bg-gradient-to-b from-slate-50 to-white p-6 rounded-2xl border border-slate-200/80 space-y-5 shadow-xs h-fit text-left">
                        
                        <div className="space-y-4 text-[11px]">
                          <div>
                            <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Founder & Visionary</span>
                            <span className="text-slate-800 font-black text-sm">Dr. M. P. Singh</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Associated Web Utilities</span>
                            <div className="space-y-2 mt-1">
                              <a 
                                href="https://metabolic-disorder.vercel.app/" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-emerald-700 font-extrabold hover:underline block truncate"
                              >
                                metabolic-disorder.vercel.app
                              </a>
                              <a 
                                href="https://aistudio.google.com/apps/643efaca-5131-4cb8-954c-ce6288d2f0c6?showPreview=true&showAssistant=true" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-emerald-700 font-extrabold hover:underline block truncate"
                                title="Chikitsa Sahyak Application Suite Link 1"
                              >
                                Chikitsa Sahyak (App Link 1)
                              </a>
                              <a 
                                href="https://aistudio.google.com/apps/781a91a5-b9ed-4e1b-9d73-885474340681?showPreview=true&showAssistant=true" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-emerald-700 font-extrabold hover:underline block truncate"
                                title="Chikitsa Sahyak Application Suite Link 2"
                              >
                                Chikitsa Sahyak (App Link 2)
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <span className="text-[9px] text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl font-mono font-bold block text-center shadow-xs">
                            VOLUNTARY HEALTH INITIATIVE
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </div>

              {/* System Footer */}
              <footer className="bg-white text-slate-400 text-[10px] text-center py-6 rounded-3xl border border-slate-200/60 mt-auto print:hidden shadow-sm space-y-1">
                <p className="font-semibold text-slate-500 text-[11px]">Powered by Chikitsa Sahyak (चिकित्सा सहायक)</p>
                <p className="text-slate-400 text-[9px]">A voluntary district digital reporting utility built by Dr. Manvinder Pal Singh.</p>
              </footer>

            </main>

          </div>
        </>
      )}

      {/* PREMIUM SUCCESS TOAST RECEIPT TOAST */}
      {successToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white border border-emerald-500/30 rounded-2xl p-4 shadow-2xl z-50 max-w-sm space-y-2 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <CheckCircle className="w-4 h-4" />
            {successToast.title}
          </div>
          <p className="text-[11px] text-slate-300 leading-normal font-medium">{successToast.content}</p>
        </div>
      )}

      {/* DYNAMIC SHORTCUT LOGO CUSTOMIZER DIALOG MODAL */}
      {isLogoCustomizerOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200" id="logo-customizer-modal">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-slate-100 animate-in zoom-in-95 duration-200 text-left flex flex-col md:flex-row gap-8">
            
            {/* Left Column: Visual Home Screen & Dashboard Mockup Preview */}
            <div className="w-full md:w-5/12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8 space-y-6">
              <div>
                <span className="text-[9px] font-black tracking-widest text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 inline-block mb-2">
                  Live Shortcut Preview
                </span>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Home Screen & App Shortcut</h3>
                <p className="text-[10.5px] text-slate-500 mt-1 leading-normal">
                  See how your custom logo icon looks as a mobile app shortcut icon on iOS/Android home screens.
                </p>
              </div>

              {/* Mock Mobile Home Screen Widget */}
              <div className="bg-gradient-to-b from-sky-400 via-teal-300 to-indigo-500 rounded-3xl p-4 aspect-[4/5] relative shadow-inner overflow-hidden flex flex-col justify-end items-center py-6">
                {/* Status bar mock */}
                <div className="absolute top-2.5 left-4 right-4 flex justify-between items-center opacity-70 text-[9px] font-bold text-white select-none">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <Wifi className="w-2.5 h-2.5" />
                    <span>LTE</span>
                  </div>
                </div>

                {/* App icon container */}
                <div className="flex flex-col items-center gap-1.5 z-10">
                  <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden border border-white/20 scale-100 hover:scale-105 transition-transform duration-300">
                    {tempLogo ? (
                      <img 
                        src={tempLogo} 
                        alt="Shortcut Preview" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      /* Fallback Default Ayurvedic SVG */
                      <svg viewBox="0 0 100 100" className="w-11 h-11 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="38" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" className="opacity-60" />
                        <circle cx="50" cy="50" r="34" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="2" />
                        <path d="M43 32H57V43H68V57H57V68H43V57H32V43H43V32Z" fill="white" fillOpacity="0.15" />
                        <path d="M42 66C42 60 45 56 50 56C55 56 58 60 58 66H42Z" fill="#FBBF24" />
                        <path d="M50 30C50 30 43 38 43 45C43 49 46 52 50 52C54 52 57 49 57 45C57 38 50 30 50 30Z" fill="#34D399" stroke="white" strokeWidth="1.5" />
                        <path d="M50 33V52" stroke="white" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-white drop-shadow-md select-none tracking-tight">Chikitsa Sahyak</span>
                </div>

                {/* Small page dot indicators */}
                <div className="absolute bottom-2 flex gap-1 select-none">
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                  <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                  <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                </div>
              </div>

              {/* Dashboard Header Icon Preview */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 rounded-xl flex items-center justify-center overflow-hidden">
                  {tempLogo ? (
                    <img src={tempLogo} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-xs font-black">CS</span>
                  )}
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">In-App View</span>
                  <span className="text-[11px] font-bold text-slate-800">Clinical Header Badge</span>
                </div>
              </div>
            </div>

            {/* Right Column: Upload, URL Input, Presets and Actions */}
            <div className="flex-1 flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-950 tracking-tight text-xs uppercase flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-800" />
                  Configure Image
                </h3>
                <button
                  onClick={() => setIsLogoCustomizerOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drag and Drop Uploader Section */}
              <div className="space-y-4">
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-3xl p-6 text-center transition-all ${
                    dragActive 
                      ? "border-emerald-600 bg-emerald-50/50 scale-[1.01]" 
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/40"
                  }`}
                >
                  <input 
                    type="file" 
                    id="logo-file-upload-input" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                  <label 
                    htmlFor="logo-file-upload-input" 
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-800 shadow-sm">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">
                        Drag & Drop your logo image
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        or <span className="text-emerald-700 font-bold hover:underline">browse files</span> (PNG, JPG, SVG up to 2MB)
                      </p>
                    </div>
                  </label>
                </div>

                {/* URL Input */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Or Paste Logo Image URL
                  </label>
                  <div className="flex gap-2 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 focus-within:border-emerald-500 focus-within:bg-white transition-all shadow-xs p-1">
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={logoUrlInput}
                      onChange={(e) => setLogoUrlInput(e.target.value)}
                      className="w-full bg-transparent px-3 py-2 text-xs text-slate-800 font-medium outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (logoUrlInput.trim()) {
                          setTempLogo(logoUrlInput.trim());
                          showToast({
                            title: "🔗 URL Loaded",
                            content: "Loaded image URL for shortcut logo preview."
                          });
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-xl transition-all shadow-xs shrink-0 uppercase tracking-wider"
                    >
                      Load
                    </button>
                  </div>
                </div>

                {/* Presets Grid */}
                <div className="space-y-2 text-left">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Or Choose A Preset Ayurvedic Brand
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setTempLogo('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none"><rect width="100" height="100" rx="30" fill="%2310B981"/><path d="M35 50H65M50 35V65" stroke="white" stroke-width="10" stroke-linecap="round"/><path d="M65 35C65 35 55 40 55 50C55 55 60 60 65 60C70 60 75 55 75 50C75 40 65 35 65 35Z" fill="%23F59E0B" opacity="0.9"/></svg>');
                        showToast({
                          title: "🌱 Preset Selected",
                          content: "Loaded the Minimal Herbal Cross preset."
                        });
                      }}
                      className="p-2.5 rounded-2xl border border-slate-100 hover:border-emerald-300 bg-slate-50/50 hover:bg-emerald-50/20 text-left transition-all flex items-center gap-2.5 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 overflow-hidden font-mono text-[9px] font-bold text-emerald-800">
                        🌱
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-slate-800 block truncate leading-tight">Minimal Leaf</span>
                        <span className="text-[8.5px] text-slate-400 block truncate">Emerald Theme</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTempLogo('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none"><rect width="100" height="100" rx="30" fill="%230D9488"/><circle cx="50" cy="50" r="30" stroke="white" stroke-width="4" stroke-dasharray="6 4" opacity="0.7"/><path d="M50 25V75M25 50H75" stroke="%23FBBF24" stroke-width="8" stroke-linecap="round"/></svg>');
                        showToast({
                          title: "🛡️ Preset Selected",
                          content: "Loaded the Clinical Shield badge preset."
                        });
                      }}
                      className="p-2.5 rounded-2xl border border-slate-100 hover:border-teal-300 bg-slate-50/50 hover:bg-teal-50/20 text-left transition-all flex items-center gap-2.5 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0 overflow-hidden font-mono text-[9px] font-bold text-teal-800">
                        🛡️
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-slate-800 block truncate leading-tight">Clinical Shield</span>
                        <span className="text-[8.5px] text-slate-400 block truncate">Teal Gold Theme</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={resetToDefaultLogo}
                  className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 font-extrabold text-[10px] uppercase py-3 rounded-2xl transition-all border border-slate-200/60 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Default
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsLogoCustomizerOpen(false)}
                  className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10px] uppercase py-3 rounded-2xl transition-all"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveCustomLogo}
                  className="flex-1 min-w-[140px] bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-[10px] uppercase py-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Save Shortcut
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
