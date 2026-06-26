import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import {
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers,
  ShieldCheck,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveBookingConflict } from "@/lib/conflict-resolver";
import { useNotificationStore } from "@/stores/notificationStore";

// Mock Room for version check demonstration
const MOCK_ROOM = {
  id: "RM-A101",
  name: "Seminar Room A101",
  capacity: 8,
  floor: 1,
  status: "available" as const,
  version: 1,
};

export default function Workflow() {
  const [animationKey, setAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [conflictMode, setConflictMode] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [roomState, setRoomState] = useState(MOCK_ROOM);
  
  // Connect to Zustand notification store to show live feed
  const notifications = useNotificationStore((state) => state.notifications);

  // Restart flow animation
  const handleStartFlow = () => {
    setConflictMode(false);
    setIsAnimating(true);
    setAnimationKey((prev) => prev + 1);
    setCurrentStep(1);
    
    // Reset room state
    setRoomState(MOCK_ROOM);
  };

  // Trigger Conflict Simulation
  const handleStartConflictDemo = () => {
    setConflictMode(true);
    setIsAnimating(true);
    setAnimationKey((prev) => prev + 1);
    setCurrentStep(1);
    
    // Simulate room version update by Student A (who wins the booking race)
    setRoomState(MOCK_ROOM);

    // Timeout triggers to guide visual progress of the split paths
    
    // At t = 1.0s: Student A's booking is finalized first.
    setTimeout(() => {
      // Student A successfully books, room version increments to 2
      setRoomState((prev) => ({ ...prev, version: 2 }));
      toast.success("Student A booking successful! Room A101 version updated to v2.", {
        icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
        duration: 3000,
      });
    }, 1000);

    // At t = 2.2s: Student B's attempt converges. Since Student B is trying to book v1,
    // they trigger a version conflict!
    setTimeout(() => {
      // Call Role 2's resolveBookingConflict with old version (1)
      const success = resolveBookingConflict(
        { ...MOCK_ROOM, version: 2 }, // room on server is now v2
        1, // Student B requested v1
        "USR-102" // Student B (Jane Smith)
      );

      if (!success) {
        toast.error("Conflict Detected! Student B's request was rejected.", {
          icon: <AlertTriangle className="h-5 w-5 text-rose-500" />,
          duration: 4000,
        });
      }
    }, 2200);
  };

  // Keep track of the active step in normal flow based on timing
  useEffect(() => {
    if (!isAnimating) return;

    let timers: any[] = [];

    if (!conflictMode) {
      // Normal flow step transition timings
      const steps = [
        { step: 1, delay: 0 },    // Student Request
        { step: 2, delay: 1000 },  // Availability Check
        { step: 3, delay: 2000 },  // Booking Created
        { step: 4, delay: 3000 },  // QR Generated
        { step: 5, delay: 4000 },  // Staff Scan
        { step: 6, delay: 5200 },  // Check In
        { step: 7, delay: 6400 },  // Return
        { step: 8, delay: 7600 },  // Waitlist Advance
      ];

      steps.forEach((s) => {
        const t = setTimeout(() => {
          setCurrentStep(s.step);
          if (s.step === 8) {
            // End of flow
            setTimeout(() => setIsAnimating(false), 1500);
          }
        }, s.delay);
        timers.push(t);
      });
    } else {
      // Conflict mode steps
      const steps = [
        { step: 1, delay: 0 },    // Parallel Student Requests
        { step: 2, delay: 1000 },  // Concurrency Check
        { step: 3, delay: 2200 },  // Resolution / Conflict Red Path
      ];

      steps.forEach((s) => {
        const t = setTimeout(() => {
          setCurrentStep(s.step);
          if (s.step === 3) {
            setTimeout(() => setIsAnimating(false), 2000);
          }
        }, s.delay);
        timers.push(t);
      });
    }

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [isAnimating, conflictMode, animationKey]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Toaster position="top-right" theme="dark" closeButton />

      {/* CSS Styles for dash offset animations */}
      <style>{`
        @keyframes drawFlow {
          from {
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .flow-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          transition: stroke 0.3s ease, stroke-width 0.3s ease;
        }
        .animate-flow .flow-path {
          animation: drawFlow 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .pulse-glow {
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
          animation: pulse 2s infinite alternate;
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 15px rgba(99, 102, 241, 0.4); }
          100% { transform: scale(1.02); box-shadow: 0 0 25px rgba(99, 102, 241, 0.7); }
        }
      `}</style>

      {/* Header section */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800/80 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Role 5 (Data & Logic)
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs text-slate-400">Interactive Flowchart</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-2">
            LibraLink System Workflow
          </h1>
          <p className="text-slate-400 mt-1 max-w-2xl">
            Visualizing the transactional lifecycle of academic room and hardware resource bookings.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleStartFlow}
            disabled={isAnimating && !conflictMode}
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-md",
              isAnimating && !conflictMode
                ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-102 hover:shadow-indigo-500/15"
            )}
          >
            <Play className="h-4 w-4 fill-current" />
            Animate Normal Flow
          </button>

          <button
            onClick={handleStartConflictDemo}
            disabled={isAnimating && conflictMode}
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-md",
              isAnimating && conflictMode
                ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                : "bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 hover:scale-102"
            )}
          >
            <AlertTriangle className="h-4 w-4" />
            Conflict Simulation Demo
          </button>

          <button
            onClick={() => {
              setIsAnimating(false);
              setConflictMode(false);
              setCurrentStep(null);
              setRoomState(MOCK_ROOM);
            }}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all duration-200 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Flow Canvas Card */}
        <div className="lg:col-span-3 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between shadow-2xl relative overflow-hidden">
          
          {/* Background grid details */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 -z-10"></div>
          
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-6">
            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-400" />
              {conflictMode ? "Simultaneous Transaction Simulation" : "Transactional Lifecycle Diagram"}
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-slate-400 font-mono">
                {conflictMode ? "Mode: Concurrency Conflict" : "Mode: Normal Queue"}
              </span>
            </div>
          </div>

          {/* SVG Flowchart Section */}
          <div className="w-full overflow-x-auto py-8">
            <svg
              className={cn("w-full min-w-[900px] h-[360px]", isAnimating && "animate-flow")}
              key={animationKey}
            >
              {/* Definitions for arrow markers */}
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
                </marker>
                <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
                </marker>
                <marker id="arrow-success" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                </marker>
                <marker id="arrow-error" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
                </marker>
              </defs>

              {!conflictMode ? (
                // ==========================================
                // NORMAL LIFE-CYCLE FLOWCHART
                // ==========================================
                <g>
                  {/* Connecting Paths with stroke-dashoffset staggered delay */}
                  
                  {/* 1. Student Request -> Availability Check */}
                  <path
                    d="M 170 120 L 230 120"
                    fill="none"
                    stroke={currentStep && currentStep >= 2 ? "#6366f1" : "#334155"}
                    strokeWidth="3"
                    markerEnd={currentStep && currentStep >= 2 ? "url(#arrow-active)" : "url(#arrow)"}
                    className="flow-path"
                    style={{ animationDelay: "0s", strokeDasharray: "100" }}
                  />

                  {/* 2. Availability Check -> Booking Created */}
                  <path
                    d="M 370 120 L 430 120"
                    fill="none"
                    stroke={currentStep && currentStep >= 3 ? "#6366f1" : "#334155"}
                    strokeWidth="3"
                    markerEnd={currentStep && currentStep >= 3 ? "url(#arrow-active)" : "url(#arrow)"}
                    className="flow-path"
                    style={{ animationDelay: "1.0s", strokeDasharray: "100" }}
                  />

                  {/* 3. Booking Created -> QR Generated */}
                  <path
                    d="M 570 120 L 630 120"
                    fill="none"
                    stroke={currentStep && currentStep >= 4 ? "#6366f1" : "#334155"}
                    strokeWidth="3"
                    markerEnd={currentStep && currentStep >= 4 ? "url(#arrow-active)" : "url(#arrow)"}
                    className="flow-path"
                    style={{ animationDelay: "2.0s", strokeDasharray: "100" }}
                  />

                  {/* 4. QR Generated -> Staff Scan */}
                  <path
                    d="M 770 120 L 830 120"
                    fill="none"
                    stroke={currentStep && currentStep >= 5 ? "#6366f1" : "#334155"}
                    strokeWidth="3"
                    markerEnd={currentStep && currentStep >= 5 ? "url(#arrow-active)" : "url(#arrow)"}
                    className="flow-path"
                    style={{ animationDelay: "3.0s", strokeDasharray: "100" }}
                  />

                  {/* 5. Staff Scan -> Check In (Vertical downward path) */}
                  <path
                    d="M 890 155 L 890 245"
                    fill="none"
                    stroke={currentStep && currentStep >= 6 ? "#6366f1" : "#334155"}
                    strokeWidth="3"
                    markerEnd={currentStep && currentStep >= 6 ? "url(#arrow-active)" : "url(#arrow)"}
                    className="flow-path"
                    style={{ animationDelay: "4.0s", strokeDasharray: "100" }}
                  />

                  {/* 6. Check In -> Return */}
                  <path
                    d="M 830 280 L 730 280"
                    fill="none"
                    stroke={currentStep && currentStep >= 7 ? "#6366f1" : "#334155"}
                    strokeWidth="3"
                    markerEnd={currentStep && currentStep >= 7 ? "url(#arrow-active)" : "url(#arrow)"}
                    className="flow-path"
                    style={{ animationDelay: "5.2s", strokeDasharray: "200" }}
                  />

                  {/* 7. Return -> Waitlist Advance */}
                  <path
                    d="M 630 280 L 470 280"
                    fill="none"
                    stroke={currentStep && currentStep >= 8 ? "#6366f1" : "#334155"}
                    strokeWidth="3"
                    markerEnd={currentStep && currentStep >= 8 ? "url(#arrow-active)" : "url(#arrow)"}
                    className="flow-path"
                    style={{ animationDelay: "6.4s", strokeDasharray: "200" }}
                  />

                  {/* 8. Waitlist Advance -> Student Request (Loopback Curve) */}
                  <path
                    d="M 330 280 C 230 280, 110 250, 110 160"
                    fill="none"
                    stroke={currentStep && currentStep >= 8 && !isAnimating ? "#6366f1" : "#334155"}
                    strokeWidth="2.5"
                    strokeDasharray="8,8"
                    markerEnd={currentStep && currentStep >= 8 && !isAnimating ? "url(#arrow-active)" : "url(#arrow)"}
                    className="flow-path"
                    style={{ animationDelay: "7.6s", strokeDasharray: "500" }}
                  />

                  {/* Flow Nodes (Rectangles/Circles) */}

                  {/* Node 1: Student Request */}
                  <g transform="translate(50, 95)" className="cursor-pointer">
                    <rect
                      width="120"
                      height="50"
                      rx="8"
                      className={cn(
                        "transition-all duration-300 stroke-2",
                        currentStep === 1
                          ? "fill-indigo-950/80 stroke-indigo-500 shadow-lg"
                          : "fill-slate-900/60 stroke-slate-700"
                      )}
                    />
                    <text x="60" y="30" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="600">
                      1. Student Request
                    </text>
                  </g>

                  {/* Node 2: Availability Check */}
                  <g transform="translate(250, 95)">
                    <rect
                      width="120"
                      height="50"
                      rx="8"
                      className={cn(
                        "transition-all duration-300 stroke-2",
                        currentStep === 2
                          ? "fill-indigo-950/80 stroke-indigo-500"
                          : "fill-slate-900/60 stroke-slate-700"
                      )}
                    />
                    <text x="60" y="30" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="600">
                      2. Availability Check
                    </text>
                  </g>

                  {/* Node 3: Booking Created */}
                  <g transform="translate(450, 95)">
                    <rect
                      width="120"
                      height="50"
                      rx="8"
                      className={cn(
                        "transition-all duration-300 stroke-2",
                        currentStep === 3
                          ? "fill-indigo-950/80 stroke-indigo-500"
                          : "fill-slate-900/60 stroke-slate-700"
                      )}
                    />
                    <text x="60" y="30" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="600">
                      3. Booking Created
                    </text>
                  </g>

                  {/* Node 4: QR Generated */}
                  <g transform="translate(650, 95)">
                    <rect
                      width="120"
                      height="50"
                      rx="8"
                      className={cn(
                        "transition-all duration-300 stroke-2",
                        currentStep === 4
                          ? "fill-indigo-950/80 stroke-indigo-500"
                          : "fill-slate-900/60 stroke-slate-700"
                      )}
                    />
                    <text x="60" y="30" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="600">
                      4. QR Generated
                    </text>
                  </g>

                  {/* Node 5: Staff Scan */}
                  <g transform="translate(830, 95)">
                    <rect
                      width="120"
                      height="50"
                      rx="8"
                      className={cn(
                        "transition-all duration-300 stroke-2",
                        currentStep === 5
                          ? "fill-indigo-950/80 stroke-indigo-500"
                          : "fill-slate-900/60 stroke-slate-700"
                      )}
                    />
                    <text x="60" y="30" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="600">
                      5. Staff Scan
                    </text>
                  </g>

                  {/* Node 6: Check In */}
                  <g transform="translate(830, 255)">
                    <rect
                      width="120"
                      height="50"
                      rx="8"
                      className={cn(
                        "transition-all duration-300 stroke-2",
                        currentStep === 6
                          ? "fill-indigo-950/80 stroke-indigo-500"
                          : "fill-slate-900/60 stroke-slate-700"
                      )}
                    />
                    <text x="60" y="30" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="600">
                      6. Checked In
                    </text>
                  </g>

                  {/* Node 7: Return */}
                  <g transform="translate(630, 255)">
                    <rect
                      width="120"
                      height="50"
                      rx="8"
                      className={cn(
                        "transition-all duration-300 stroke-2",
                        currentStep === 7
                          ? "fill-indigo-950/80 stroke-indigo-500"
                          : "fill-slate-900/60 stroke-slate-700"
                      )}
                    />
                    <text x="60" y="30" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="600">
                      7. Resource Returned
                    </text>
                  </g>

                  {/* Node 8: Waitlist Advance */}
                  <g transform="translate(330, 255)">
                    <rect
                      width="120"
                      height="50"
                      rx="8"
                      className={cn(
                        "transition-all duration-300 stroke-2",
                        currentStep === 8
                          ? "fill-indigo-950/80 stroke-indigo-500"
                          : "fill-slate-900/60 stroke-slate-700"
                      )}
                    />
                    <text x="60" y="30" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="600">
                      8. Waitlist Advance
                    </text>
                  </g>
                </g>
              ) : (
                // ==========================================
                // CONCURRENCY CONFLICT SPLIT-SCREEN FLOW
                // ==========================================
                <g>
                  {/* SPLIT PATHS FOR STUDENT A AND B */}

                  {/* STUDENT A (TOP ROW - WINNER) */}
                  {/* Path A1: Request A -> Check A */}
                  <path
                    d="M 170 60 L 230 60"
                    fill="none"
                    stroke={currentStep && currentStep >= 1 ? "#10b981" : "#334155"}
                    strokeWidth="3"
                    markerEnd={currentStep && currentStep >= 1 ? "url(#arrow-success)" : "url(#arrow)"}
                    className="flow-path"
                    style={{ animationDelay: "0s", strokeDasharray: "100" }}
                  />

                  {/* Path A2: Check A -> Booking Created (Converging to Center) */}
                  <path
                    d="M 370 60 C 410 60, 430 100, 460 110"
                    fill="none"
                    stroke={currentStep && currentStep >= 2 ? "#10b981" : "#334155"}
                    strokeWidth="3"
                    markerEnd={currentStep && currentStep >= 2 ? "url(#arrow-success)" : "url(#arrow)"}
                    className="flow-path"
                    style={{ animationDelay: "0.8s", strokeDasharray: "200" }}
                  />

                  {/* STUDENT B (BOTTOM ROW - CONFLICT LOSER) */}
                  {/* Path B1: Request B -> Check B */}
                  <path
                    d="M 170 180 L 230 180"
                    fill="none"
                    stroke={currentStep && currentStep >= 1 ? "#f43f5e" : "#334155"}
                    strokeWidth="3"
                    markerEnd={currentStep && currentStep >= 1 ? "url(#arrow-error)" : "url(#arrow)"}
                    className="flow-path"
                    style={{ animationDelay: "0s", strokeDasharray: "100" }}
                  />

                  {/* Path B2: Check B -> Booking Created (Converging to Center - turns RED on conflict check) */}
                  <path
                    d="M 370 180 C 410 180, 430 140, 460 130"
                    fill="none"
                    stroke={currentStep && currentStep >= 3 ? "#f43f5e" : currentStep && currentStep >= 2 ? "#a8a29e" : "#334155"}
                    strokeWidth="3"
                    markerEnd={currentStep && currentStep >= 3 ? "url(#arrow-error)" : "url(#arrow)"}
                    className="flow-path"
                    style={{ animationDelay: "1.2s", strokeDasharray: "200" }}
                  />

                  {/* SUCCESS PATH FROM BOOKING CREATED TO QR GENERATED */}
                  <path
                    d="M 600 120 L 660 120"
                    fill="none"
                    stroke={currentStep && currentStep >= 2 ? "#10b981" : "#334155"}
                    strokeWidth="3"
                    markerEnd={currentStep && currentStep >= 2 ? "url(#arrow-success)" : "url(#arrow)"}
                    className="flow-path"
                    style={{ animationDelay: "1.6s", strokeDasharray: "100" }}
                  />

                  {/* Node 1A: Student A Request (Successful) */}
                  <g transform="translate(50, 35)">
                    <rect
                      width="120"
                      height="50"
                      rx="8"
                      className={cn(
                        "stroke-2 transition-colors duration-300",
                        currentStep && currentStep >= 1
                          ? "fill-emerald-950/75 stroke-emerald-500"
                          : "fill-slate-900/60 stroke-slate-700"
                      )}
                    />
                    <text x="60" y="25" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="600">
                      Student A (Ex: USR-193)
                    </text>
                    <text x="60" y="38" textAnchor="middle" fill="#a7f3d0" fontSize="9" opacity="0.8">
                      Locks v1 Request
                    </text>
                  </g>

                  {/* Node 2A: Check A */}
                  <g transform="translate(250, 35)">
                    <rect
                      width="120"
                      height="50"
                      rx="8"
                      className={cn(
                        "stroke-2 transition-colors duration-300",
                        currentStep && currentStep >= 2
                          ? "fill-emerald-950/75 stroke-emerald-500"
                          : "fill-slate-900/60 stroke-slate-700"
                      )}
                    />
                    <text x="60" y="25" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="600">
                      Commit A (Success)
                    </text>
                    <text x="60" y="38" textAnchor="middle" fill="#a7f3d0" fontSize="9" opacity="0.8">
                      DB version matches
                    </text>
                  </g>

                  {/* Node 1B: Student B Request (Conflicting) */}
                  <g transform="translate(50, 155)">
                    <rect
                      width="120"
                      height="50"
                      rx="8"
                      className={cn(
                        "stroke-2 transition-colors duration-300",
                        currentStep && currentStep >= 1
                          ? "fill-rose-950/70 stroke-rose-500"
                          : "fill-slate-900/60 stroke-slate-700"
                      )}
                    />
                    <text x="60" y="25" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="600">
                      Student B (Ex: USR-102)
                    </text>
                    <text x="60" y="38" textAnchor="middle" fill="#fecdd3" fontSize="9" opacity="0.8">
                      Locks v1 Request
                    </text>
                  </g>

                  {/* Node 2B: Check B (Lock check fails) */}
                  <g transform="translate(250, 155)">
                    <rect
                      width="120"
                      height="50"
                      rx="8"
                      className={cn(
                        "stroke-2 transition-colors duration-300",
                        currentStep && currentStep >= 3
                          ? "fill-rose-950/70 stroke-rose-500"
                          : currentStep && currentStep >= 2
                          ? "fill-slate-800/80 stroke-slate-600"
                          : "fill-slate-900/60 stroke-slate-700"
                      )}
                    />
                    <text x="60" y="25" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="600">
                      Commit B (Conflict)
                    </text>
                    <text x="60" y="38" textAnchor="middle" fill="#fecdd3" fontSize="9" opacity="0.8">
                      DB is now v2! (Rejects v1)
                    </text>
                  </g>

                  {/* Node 3: Converged Resource Booking Created (For Student A) */}
                  <g transform="translate(470, 95)">
                    <rect
                      width="130"
                      height="50"
                      rx="8"
                      className={cn(
                        "stroke-2 transition-all duration-300",
                        currentStep && currentStep >= 2
                          ? "fill-emerald-950/75 stroke-emerald-500 shadow-md"
                          : "fill-slate-900/60 stroke-slate-700"
                      )}
                    />
                    <text x="65" y="25" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="600">
                      Booking: Room A101
                    </text>
                    <text x="65" y="38" textAnchor="middle" fill="#a7f3d0" fontSize="9">
                      Saved (Version: {roomState.version})
                    </text>
                  </g>

                  {/* Node 4: Student A QR Generated */}
                  <g transform="translate(660, 95)">
                    <rect
                      width="120"
                      height="50"
                      rx="8"
                      className={cn(
                        "stroke-2 transition-all duration-300",
                        currentStep && currentStep >= 2
                          ? "fill-emerald-950/75 stroke-emerald-500"
                          : "fill-slate-900/60 stroke-slate-700"
                      )}
                    />
                    <text x="60" y="25" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="600">
                      A: QR Created
                    </text>
                    <text x="60" y="38" textAnchor="middle" fill="#94a3b8" fontSize="9">
                      LBK:B-001:USR-193...
                    </text>
                  </g>

                  {/* Error Indicator Box */}
                  {currentStep === 3 && (
                    <g transform="translate(390, 220)">
                      <rect
                        width="280"
                        height="45"
                        rx="6"
                        className="fill-rose-950/90 stroke-rose-800/80 stroke-1"
                      />
                      <path d="M 12 15 L 20 28 L 4 28 Z" fill="#f43f5e" transform="translate(5, -2)" />
                      <text x="35" y="20" fill="#fecdd3" fontSize="10" fontWeight="600">
                        Version Mismatch Detected!
                      </text>
                      <text x="35" y="34" fill="#fda4af" fontSize="9">
                        resolveBookingConflict() triggered conflict notification.
                      </text>
                    </g>
                  )}
                </g>
              )}
            </svg>
          </div>

          {/* Stepper info banner */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 mt-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Current Transaction Phase
            </h3>
            {!conflictMode ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "Student Request",
                  "Availability Check",
                  "Booking Created",
                  "QR Generated",
                  "Staff Scan",
                  "Checked In",
                  "Returned",
                  "Waitlist Advanced",
                ].map((name, idx) => {
                  const stepNum = idx + 1;
                  const isActive = currentStep === stepNum;
                  const isPassed = currentStep ? currentStep > stepNum : false;
                  return (
                    <div
                      key={name}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 border",
                        isActive
                          ? "bg-indigo-950/60 border-indigo-500/50 text-indigo-300 font-medium"
                          : isPassed
                          ? "bg-slate-900 border-slate-800/80 text-emerald-500"
                          : "bg-transparent border-transparent text-slate-500"
                      )}
                    >
                      {isPassed ? (
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <span
                          className={cn(
                            "h-4 w-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold border",
                            isActive ? "bg-indigo-500 text-slate-950 border-indigo-400" : "bg-slate-800 text-slate-500 border-slate-700"
                          )}
                        >
                          {stepNum}
                        </span>
                      )}
                      <span className="truncate">{name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></div>
                  <p className="text-xs text-rose-300">
                    <strong>Optimistic Concurrency Control:</strong> Two requests locks Room A101 at v1. Student A commits first (DB becomes v2). Student B commits next but fails because they requested v1.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 text-[10px] border border-emerald-800/50">
                    A: Success (v2)
                  </span>
                  <span className="px-2.5 py-1 rounded bg-rose-950/60 text-rose-400 text-[10px] border border-rose-800/50">
                    B: Rejected (Conflict)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info/Log Panel */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          {/* Concurrency Check Card */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4.5 w-4.5 text-indigo-400" />
              Concurrency Model
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              LibraLink implements <strong>Optimistic Locking</strong> via a <code>version</code> field. Resources check for modifications prior to transaction commits.
            </p>
            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 text-[11px] font-mono flex flex-col gap-1 text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-1.5 mb-1.5 text-slate-400 font-semibold">
                <span>Property</span>
                <span>Value</span>
              </div>
              <div className="flex justify-between">
                <span>Room ID</span>
                <span className="text-indigo-400">{roomState.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Room Name</span>
                <span>{roomState.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Capacity</span>
                <span>{roomState.capacity} Pax</span>
              </div>
              <div className="flex justify-between">
                <span>Server Version</span>
                <span className={cn("px-1 rounded font-bold", roomState.version > 1 ? "bg-emerald-950 text-emerald-400" : "bg-indigo-950 text-indigo-400")}>
                  v{roomState.version}
                </span>
              </div>
            </div>
          </div>

          {/* Live Notification Logs */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex-1 flex flex-col min-h-[300px]">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800/60 pb-3 mb-3">
              <Info className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
              Live Notification Feed
            </h3>

            {notifications.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <Clock className="h-8 w-8 text-slate-700 mb-2" />
                <p className="text-xs text-slate-500">No events dispatched yet.</p>
                <p className="text-[10px] text-slate-600 mt-1">Animations populate this feed dynamically.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto max-h-[340px] flex flex-col gap-2.5 pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "p-3 rounded-xl border text-[11px] leading-relaxed transition-all duration-300",
                      n.type === "conflict"
                        ? "bg-rose-950/20 border-rose-900/30 text-rose-300"
                        : "bg-slate-950/60 border-slate-800/80 text-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                        n.type === "conflict" ? "bg-rose-900/60 text-rose-300" : "bg-indigo-950 text-indigo-400"
                      )}>
                        {n.type}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {new Date(n.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-sans">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
