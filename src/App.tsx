/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';

import { AppProvider, useApp } from './context/AppContext';

import { Header } from './components/Header';
import { PushBanner } from './components/PushBanner';
import { NotificationModal } from './components/NotificationModal';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { TableView } from './components/TableView';
import { CardView } from './components/CardView';
import { KanbanView } from './components/KanbanView';
import { TimelineView } from './components/TimelineView';
import { SparePartFormModal } from './components/SparePartFormModal';
import { QuickStatusModal } from './components/QuickStatusModal';
import { SparePartDetailModal } from './components/SparePartDetailModal';
import { PrintSlipModal } from './components/PrintSlipModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { LoginModal } from './components/LoginModal';
import { AppInstallModal } from './components/AppInstallModal';
import { AuthLandingPage } from './components/AuthLandingPage';

import { SparePart } from './types/sparePart';

import {
  Anchor,
  HardDrive,
  BellRing,
  ShieldCheck,
  HardHat,
  ArrowRightLeft,
  Download,
  LogOut,
} from 'lucide-react';


const SparePartsDashboard: React.FC = () => {
  const {
    spareParts,
    accessibleSpareParts,
    currentUser,
    logout,
    isDark,
    themeConfig,
    isLoginModalOpen,
    setIsLoginModalOpen,
    searchQuery,
    selectedJobFilter,
    selectedStatusFilter,
    selectedTypeFilter,
    viewMode,
    selectedPart,
    setSelectedPart,
    isAddModalOpen,
    setIsAddModalOpen,
    isQuickStatusModalOpen,
    setIsQuickStatusModalOpen,
    partToUpdateStatus,
    isPrintModalOpen,
    setIsPrintModalOpen,
    language,
  } = useApp();

  const [partToEdit, setPartToEdit] =
    useState<SparePart | null>(null);

  const [isInstallModalOpen, setIsInstallModalOpen] =
    useState(false);


  // ============================================================
  // FILTER SHIPMENT DATA
  // ============================================================

  const filteredParts = useMemo(() => {
    return accessibleSpareParts.filter((p) => {

      // SEARCH
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();

        const searchableText = [
          p.bookingNo,
          p.bookingDate,
          p.po,
          p.awbBl,
          p.flightVessel,
          p.srm,
          p.job,
          p.descriptionOfGoods,
          p.shipperSupplier,
          p.from,
          p.to,
          p.package,
          p.weight?.toString(),
          p.etd,
          p.eta,
          p.receiveDoAndOpenContainerDate,
          p.deliveryDate,
          p.term,
          p.type,
          p.status,
          p.yardLocation,
          p.priorityNotes,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(q)) {
          return false;
        }
      }


      // JOB FILTER
      if (
        selectedJobFilter !== 'ALL' &&
        p.job !== selectedJobFilter
      ) {
        return false;
      }


      // STATUS FILTER
      if (selectedStatusFilter !== 'ALL') {

        if (selectedStatusFilter === 'URGENT') {

          if (
            !p.isUrgent &&
            p.status !== 'URGENT_HOLD'
          ) {
            return false;
          }

        } else if (
          p.status !== selectedStatusFilter
        ) {
          return false;
        }
      }


      // TYPE FILTER
      if (
        selectedTypeFilter !== 'ALL' &&
        p.type !== selectedTypeFilter
      ) {
        return false;
      }

      return true;
    });

  }, [
    accessibleSpareParts,
    searchQuery,
    selectedJobFilter,
    selectedStatusFilter,
    selectedTypeFilter,
  ]);


  // ============================================================
  // EDIT SHIPMENT
  // ============================================================

  const handleEditPart = (part: SparePart) => {
    setPartToEdit(part);
    setSelectedPart(null);
  };


  // ============================================================
  // LOGIN CHECK
  // ============================================================

  if (!currentUser) {
    return <AuthLandingPage />;
  }


  // ============================================================
  // MAIN DASHBOARD
  // ============================================================

  return (
    <div
      className={`
        min-h-screen
        ${themeConfig.appBg}
        ${isDark ? 'text-slate-100' : 'text-slate-800'}
        flex flex-col
        font-sans
        transition-colors
        duration-200
      `}
    >

      {/* PUSH NOTIFICATION */}
      <PushBanner />


      {/* HEADER */}
      <Header />


      {/* USER / ADMIN STATUS BAR */}

      <div
        className={`
          border-b
          py-2.5
          px-4
          sm:px-6
          lg:px-8
          transition-colors
          ${
            isDark
              ? 'bg-[#051122] border-blue-900/60'
              : 'bg-slate-50 border-slate-200 shadow-sm'
          }
        `}
      >

        <div
          className="
            max-w-7xl
            mx-auto
            flex
            flex-col
            sm:flex-row
            sm:items-center
            justify-between
            gap-2.5
          "
        >

          {/* USER INFORMATION */}

          <div
            className="
              flex
              items-center
              gap-2.5
              min-w-0
            "
          >

            {/* ROLE */}

            {currentUser?.role === 'ADMIN' ? (

              <span
                className={`
                  inline-flex
                  items-center
                  gap-1.5
                  px-2.5
                  py-1
                  rounded-lg
                  text-xs
                  font-bold
                  shrink-0
                  border
                  ${
                    isDark
                      ? 'bg-red-600/20 text-red-300 border-red-500/40'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }
                `}
              >

                <ShieldCheck
                  className="
                    w-3.5
                    h-3.5
                    text-red-500
                  "
                />

                <span>
                  👑 ADMIN PORTAL
                </span>

              </span>

            ) : (

              <span
                className={`
                  inline-flex
                  items-center
                  gap-1.5
                  px-2.5
                  py-1
                  rounded-lg
                  text-xs
                  font-bold
                  shrink-0
                  border
                  ${
                    isDark
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }
                `}
              >

                <HardHat
                  className="
                    w-3.5
                    h-3.5
                    text-blue-500
                  "
                />

                <span>
                  👷 USER PORTAL (
                  {currentUser?.position || 'STAFF'}
                  )
                </span>

              </span>
            )}


            {/* USER DETAILS */}

            <div
              className={`
                text-xs
                truncate
                ${
                  isDark
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }
              `}
            >

              {currentUser?.role === 'ADMIN' ? (

                <span>
                  {language === 'TH'
                    ? `เข้าสู่ระบบในฐานะแอดมิน (${currentUser.name}) • มีสิทธิ์ดูแลและควบคุมทุก Job ในอู่เรือ (${spareParts.length} รายการ)`
                    : `Logged in as Admin (${currentUser.name}) • Full access to all shipyard jobs (${spareParts.length} items)`}
                </span>

              ) : (

                <span>

                  {language === 'TH' ? (

                    <>
                      อีเมล:{' '}

                      <strong
                        className={`
                          font-mono
                          ${
                            isDark
                              ? 'text-white'
                              : 'text-slate-900'
                          }
                        `}
                      >
                        {currentUser?.email}
                      </strong>

                      {' '}

                      ({currentUser?.name})

                      {' '}• กำลังแสดงเฉพาะ Job
                      ที่คุณรับผิดชอบ (
                      {accessibleSpareParts.length}
                      {' '}รายการ)
                    </>

                  ) : (

                    <>

                      Scoped to{' '}

                      <strong
                        className={`
                          font-mono
                          ${
                            isDark
                              ? 'text-white'
                              : 'text-slate-900'
                          }
                        `}
                      >
                        {currentUser?.email}
                      </strong>

                      {' '}

                      (
                      {accessibleSpareParts.length}
                      {' '}assigned items)
                    </>

                  )}

                </span>
              )}

            </div>

          </div>


          {/* ACTION BUTTONS */}

          <div
            className="
              flex
              items-center
              gap-2
              self-start
              sm:self-auto
              shrink-0
              flex-wrap
            "
          >

            {/* INSTALL APP */}

            <button
              onClick={() =>
                setIsInstallModalOpen(true)
              }
              className="
                inline-flex
                items-center
                gap-1.5
                px-3
                py-1.5
                rounded-lg
                bg-emerald-600/20
                hover:bg-emerald-600/30
                text-emerald-600
                dark:text-emerald-300
                border
                border-emerald-500/30
                text-xs
                font-bold
                transition
                shadow-sm
              "
              title="ดาวน์โหลดและติดตั้งแอพลงบนมือถือของคุณ"
            >

              <Download
                className="
                  w-3.5
                  h-3.5
                "
              />

              <span>
                {language === 'TH'
                  ? '📲 ดาวน์โหลดแอพ'
                  : '📲 Install App'}
              </span>

            </button>


            {/* SWITCH USER */}

            <button
              onClick={() =>
                setIsLoginModalOpen(true)
              }
              className={`
                inline-flex
                items-center
                gap-1.5
                px-3
                py-1.5
                rounded-lg
                text-xs
                font-semibold
                border
                transition
                ${
                  isDark
                    ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-500'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm'
                }
              `}
            >

              <ArrowRightLeft
                className="
                  w-3.5
                  h-3.5
                  text-blue-500
                "
              />

              <span>
                {language === 'TH'
                  ? 'สลับผู้ใช้งาน / เลือก Job'
                  : 'Switch User / Job'}
              </span>

            </button>


            {/* LOGOUT */}

            <button
              onClick={logout}
              className={`
                inline-flex
                items-center
                gap-1.5
                px-3
                py-1.5
                rounded-lg
                text-xs
                font-semibold
                border
                transition
                ${
                  isDark
                    ? 'bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border-red-800/60'
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                }
              `}
              title="ออกจากระบบ เพื่อกลับไปหน้า Sign In / ลงทะเบียน"
            >

              <LogOut
                className="
                  w-3.5
                  h-3.5
                  text-red-500
                "
              />

              <span>
                {language === 'TH'
                  ? 'ออกจากระบบ'
                  : 'Sign Out'}
              </span>

            </button>

          </div>

        </div>

      </div>


      {/* KPI */}

      {filteredParts.length > 0 && (
        <StatsBar />
      )}


      {/* FILTER */}

      {filteredParts.length > 0 && (
        <FilterBar />
      )}


      {/* MAIN CONTENT */}

      <main
        className="
          flex-1
          max-w-7xl
          w-full
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
        "
      >

        {filteredParts.length === 0 ? (

          /* EMPTY STATE */

          <div
            className="
              min-h-[420px]
              flex
              items-center
              justify-center
            "
          >

            <div
              className="
                text-center
                max-w-md
              "
            >

              <div
                className="
                  mx-auto
                  mb-5
                  w-16
                  h-16
                  rounded-2xl
                  bg-blue-50
                  dark:bg-blue-950/40
                  flex
                  items-center
                  justify-center
                "
              >

                <HardDrive
                  className="
                    w-8
                    h-8
                    text-blue-500
                  "
                />

              </div>


              <h2
                className={`
                  text-xl
                  font-bold
                  mb-2
                  ${
                    isDark
                      ? 'text-white'
                      : 'text-slate-800'
                  }
                `}
              >
                {language === 'TH'
                  ? 'ยังไม่มีข้อมูล Shipment'
                  : 'No Shipment Data'}
              </h2>


              <p
                className={`
                  text-sm
                  mb-6
                  ${
                    isDark
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }
                `}
              >
                {language === 'TH'
                  ? 'กรุณาเพิ่มหรือนำเข้าข้อมูล Shipment เพื่อเริ่มใช้งานระบบ'
                  : 'Add or import shipment data to get started.'}
              </p>


              <button
                onClick={() =>
                  setIsAddModalOpen(true)
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  font-semibold
                  shadow-sm
                  transition
                "
              >
                +{' '}
                {language === 'TH'
                  ? 'เพิ่ม Shipment'
                  : 'Add Shipment'}
              </button>

            </div>

          </div>

        ) : (

          /* DATA EXISTS */

          <>
            {viewMode === 'table' && (
              <TableView
                parts={filteredParts}
              />
            )}

            {viewMode === 'cards' && (
              <CardView
                parts={filteredParts}
              />
            )}

            {viewMode === 'kanban' && (
              <KanbanView
                parts={filteredParts}
              />
            )}

            {viewMode === 'timeline' && (
              <TimelineView
                parts={filteredParts}
              />
            )}
          </>

        )}

      </main>


      {/* OFFLINE */}

      <OfflineIndicator />


      {/* FOOTER */}

      <footer
        className={`
          border-t
          py-6
          text-xs
          transition-colors
          ${
            isDark
              ? 'border-slate-800 bg-slate-950/80 text-slate-400'
              : 'border-slate-200 bg-white text-slate-500 shadow-sm'
          }
        `}
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <Anchor
              className="
                w-4
                h-4
                text-blue-500
              "
            />

            <span
              className={`
                font-semibold
                ${
                  isDark
                    ? 'text-white'
                    : 'text-slate-900'
                }
              `}
            >
              UNITHAI SHIPYARD AND ENGINEERING
            </span>

            <span>•</span>

            <span>
              {language === 'TH'
                ? 'แผนกคลังสินค้าและโลจิสติกส์อู่เรือแหลมฉบัง'
                : 'Logistics & Warehousing Division, Laem Chabang'}
            </span>

          </div>


          <div
            className="
              flex
              items-center
              gap-4
              text-[11px]
              text-slate-400
            "
          >

            <span
              className="
                flex
                items-center
                gap-1
              "
            >

              <HardDrive
                className="
                  w-3.5
                  h-3.5
                  text-emerald-500
                "
              />

              <span>
                Offline Database Ready
              </span>

            </span>

            <span>•</span>

            <span
              className="
                flex
                items-center
                gap-1
              "
            >

              <BellRing
                className="
                  w-3.5
                  h-3.5
                  text-blue-500
                "
              />

              <span>
                Instant Push Active
              </span>

            </span>

            <span>•</span>

            <span>
              {language === 'TH'
                ? 'มาตรฐาน ISO 9001 / Maritime Ship Repair'
                : 'ISO 9001 Certified Maritime Ship Repair'}
            </span>

          </div>

        </div>

      </footer>


      {/* ========================================================
          NOTIFICATION MODAL
      ======================================================== */}

      <NotificationModal />


      {/* ========================================================
          ADD SHIPMENT
      ======================================================== */}

      {isAddModalOpen && (
        <SparePartFormModal
          onClose={() =>
            setIsAddModalOpen(false)
          }
        />
      )}


      {/* ========================================================
          EDIT SHIPMENT
      ======================================================== */}

      {partToEdit && (
        <SparePartFormModal
          partToEdit={partToEdit}
          onClose={() =>
            setPartToEdit(null)
          }
        />
      )}


      {/* ========================================================
          QUICK STATUS
      ======================================================== */}

      {isQuickStatusModalOpen &&
        partToUpdateStatus && (
          <QuickStatusModal
            part={partToUpdateStatus}
            onClose={() =>
              setIsQuickStatusModalOpen(false)
            }
          />
        )}


      {/* ========================================================
          DETAIL
      ======================================================== */}

      {selectedPart && (
        <SparePartDetailModal
          part={selectedPart}
          onClose={() =>
            setSelectedPart(null)
          }
          onEdit={() =>
            handleEditPart(selectedPart)
          }
        />
      )}


      {/* ========================================================
          PRINT
      ======================================================== */}

      {isPrintModalOpen && (
        <PrintSlipModal
          onClose={() =>
            setIsPrintModalOpen(false)
          }
        />
      )}


      {/* ========================================================
          INSTALL APP
      ======================================================== */}

      {isInstallModalOpen && (
        <AppInstallModal
          onClose={() =>
            setIsInstallModalOpen(false)
          }
        />
      )}


      {/* ========================================================
          LOGIN
      ======================================================== */}

      {isLoginModalOpen && (
        <LoginModal />
      )}

    </div>
  );
};


// ============================================================
// ROOT APP
// ============================================================

const App: React.FC = () => {
  return (
    <AppProvider>
      <SparePartsDashboard />
    </AppProvider>
  );
};


export default App;
