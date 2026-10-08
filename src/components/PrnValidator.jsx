import React, { useState, useMemo } from 'react';
import {
  Database,
  CheckCircle2,
  XCircle,
  Play,
  StepForward,
  RotateCcw,
  Network,
  Table2,
  Info,
  ShieldCheck,
  X,
  ExternalLink
} from 'lucide-react';
import {
  DFA_PRN_DIV_A,
  DFA_PRN_DIV_B,
  DFA_PRN_DIV_C,
  DFA_PRN_DIV_D,
  DFA_PRN_ALL,
  findStudentByPrn
} from '../data/divisionDfa';
import { STUDENTS } from '../data/students';
import DatasetModal from './DatasetModal';

export default function PrnValidator({
  DfaGraph,
  TransitionTable,
  ReadingTape,
  VivaQuestions,
  DFARunner,
  logHistory
}) {
  const [inputVal, setInputVal] = useState('2403001');
  const [division, setDivision] = useState('A'); // 'A', 'B', 'C', 'D', 'ALL'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('graph'); // 'graph' or 'table'
  const [stepIndex, setStepIndex] = useState(-1);

  // Active DFA based on division selection
  const activeDfa = useMemo(() => {
    switch (division) {
      case 'A': return DFA_PRN_DIV_A;
      case 'B': return DFA_PRN_DIV_B;
      case 'C': return DFA_PRN_DIV_C;
      case 'D': return DFA_PRN_DIV_D;
      default: return DFA_PRN_ALL;
    }
  }, [division]);

  // Execute DFA simulation
  const runner = useMemo(() => new DFARunner(activeDfa), [activeDfa, DFARunner]);
  const simResult = useMemo(() => runner.process(inputVal), [runner, inputVal]);
  const matchedStudent = useMemo(() => selectedStudent || findStudentByPrn(inputVal), [selectedStudent, inputVal]);

  const handleNextStep = () => {
    if (stepIndex < simResult.steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setStepIndex(-1);
  };

  const handleValidateFull = () => {
    setStepIndex(simResult.steps.length - 1);
    if (logHistory) {
      logHistory({
        input: inputVal,
        dfaId: activeDfa.id,
        dfaName: activeDfa.name,
        isAccepted: simResult.isAccepted,
        finalState: simResult.finalState,
        processedLength: simResult.processedLength,
        totalLength: simResult.totalLength,
        path: simResult.path,
        rejectionReason: simResult.rejectionReason,
      });
    }
  };

  const currentStep = stepIndex >= 0 ? simResult.steps[stepIndex] : null;
  const currentState = currentStep ? currentStep.toState : activeDfa.startState;
  const previousState = currentStep ? currentStep.fromState : undefined;
  const pointerPos = stepIndex >= 0 ? stepIndex + 1 : 0;
  const isFinished = stepIndex === simResult.steps.length - 1;

  // Samples by division
  const samplesByDiv = {
    A: [
      { val: '2403001', label: '2403001 (SHINGAN)' },
      { val: '2403040', label: '2403040 (PATIL)' },
      { val: '2553001', label: '2553001 (BHORE - DSE)' }
    ],
    B: [
      { val: '2403070', label: '2403070 (MULIK)' },
      { val: '2403100', label: '2403100 (NIKAM)' },
      { val: '2553020', label: '2553020 (MHALUNGEKAR - DSE)' }
    ],
    C: [
      { val: '2403140', label: '2403140 (MANE)' },
      { val: '2403180', label: '2403180 (PATIL)' },
      { val: '2403801', label: '2403801 (DESHMUKH - DSE)' }
    ],
    D: [
      { val: '2503801', label: '2503801 (PATHAN)' },
      { val: '2653001', label: '2653001 (BAJABALE - DSE)' },
      { val: '2403091', label: '2403091 (MANSI SAWANT)' }
    ],
    ALL: [
      { val: '2403001', label: 'Div A (2403001)' },
      { val: '2403070', label: 'Div B (2403070)' },
      { val: '2403140', label: 'Div C (2403140)' },
      { val: '2503801', label: 'Div D (2503801)' }
    ]
  };

  const currentSamples = samplesByDiv[division] || samplesByDiv.ALL;

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-sky-400 font-semibold uppercase tracking-wider">
              RITAGE Portal · Permanent Registration Number (PRN)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              RIT PRN Validator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Formal DFA verifying 7-digit PRN numbers with non-zero start, drawn according to selected student division:{' '}
              <code className="text-sky-300 font-mono">^[1-9][0-9]{'{6}'}$</code>. Two official datasets: TY (Div A, B, C) and SY (Div D).
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 hover:text-white border border-sky-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-sky-950/40"
            >
              <Database className="w-4 h-4 text-sky-400" />
              <span>Browse Dataset ({STUDENTS.length} Students)</span>
            </button>
          </div>
        </div>

        {/* Division Selection Bar */}
        <div className="mt-5 p-4 bg-slate-950/90 rounded-xl border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400">DFA Division Mode:</span>
              <span className="text-xs text-slate-400">
                DFA graph diagram is drawn specifically for the selected division
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 font-semibold">
                TY Dataset (Div A, B, C)
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-semibold">
                SY Dataset (Div D)
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setDivision('A'); setStepIndex(-1); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                division === 'A'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950 ring-1 ring-sky-400/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
              TY · Division A (79)
            </button>
            <button
              onClick={() => { setDivision('B'); setStepIndex(-1); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                division === 'B'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950 ring-1 ring-sky-400/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
              TY · Division B (74)
            </button>
            <button
              onClick={() => { setDivision('C'); setStepIndex(-1); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                division === 'C'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950 ring-1 ring-sky-400/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
              TY · Division C (69)
            </button>
            <button
              onClick={() => { setDivision('D'); setStepIndex(-1); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                division === 'D'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 ring-1 ring-emerald-400/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              SY · Division D (60)
            </button>
            <button
              onClick={() => { setDivision('ALL'); setStepIndex(-1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                division === 'ALL'
                  ? 'bg-slate-700 text-white font-bold ring-1 ring-slate-500/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              All Divisions (282)
            </button>
          </div>
        </div>

        {/* Input Form & Controls */}
        <div className="mt-4 p-4 sm:p-5 bg-slate-950/80 rounded-xl border border-slate-800/90 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setSelectedStudent(null);
                  setStepIndex(-1);
                }}
                placeholder={`Enter 7-digit PRN for ${activeDfa.name}...`}
                className="w-full bg-slate-900 border border-slate-700/80 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 rounded-xl px-4 py-3 text-sm font-mono text-white tracking-wider outline-none transition-all shadow-inner"
              />
              {inputVal && (
                <button
                  onClick={() => {
                    setInputVal('');
                    setSelectedStudent(null);
                    setStepIndex(-1);
                  }}
                  className="absolute right-16 top-3.5 text-slate-500 hover:text-slate-300 p-0.5 rounded cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="absolute right-3.5 top-3.5 text-[10px] font-mono text-slate-500">
                {inputVal.length} / 7
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleValidateFull}
                className="px-4 py-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-sky-950 whitespace-nowrap active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Validate Full PRN</span>
              </button>
              <button
                onClick={handleNextStep}
                disabled={stepIndex >= simResult.steps.length - 1}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <StepForward className="w-4 h-4" />
                <span>Next Step ({stepIndex + 1}/{simResult.steps.length})</span>
              </button>
              <button
                onClick={handleReset}
                title="Reset simulation"
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Pick Samples for active division */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[11px] font-mono text-slate-400">
              Sample {division === 'ALL' ? 'PRNs' : `Div ${division} PRNs`}:
            </span>
            {currentSamples.map((smp) => (
              <button
                key={smp.val}
                onClick={() => {
                  setInputVal(smp.val);
                  setSelectedStudent(null);
                  setStepIndex(-1);
                }}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 text-slate-300 font-mono text-[11px] transition-colors cursor-pointer"
              >
                {smp.label}
              </button>
            ))}
          </div>

          {/* Matched Enrolled Student Card */}
          {matchedStudent && (
            <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs font-mono animate-in fade-in duration-150">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400">Student #{matchedStudent.srNo}:</span>
                    <strong className="text-white text-sm">{matchedStudent.studentName}</strong>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        matchedStudent.division === 'D'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-sky-950 text-sky-300 border border-sky-500/40'
                      }`}
                    >
                      {matchedStudent.year} · Division {matchedStudent.division}
                    </span>
                  </div>
                  <span className="text-emerald-300 text-[11px] block mt-0.5">
                    PRN: <code className="font-bold">{matchedStudent.enrollNo}</code> · Official Email:{' '}
                    <code className="font-bold">{matchedStudent.emailId}</code>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Cross-division Switch Prompt */}
          {matchedStudent && division !== 'ALL' && matchedStudent.division !== division && (
            <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="text-amber-200">
                <span className="font-bold font-mono mr-1.5">Notice:</span>
                This student belongs to {matchedStudent.year} Division {matchedStudent.division}. Currently drawing Division {division} DFA.
              </div>
              <button
                onClick={() => {
                  setDivision(matchedStudent.division);
                  setStepIndex(-1);
                }}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap self-start sm:self-center"
              >
                Draw Division {matchedStudent.division} DFA →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reading Tape */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Automaton Character Reading Tape
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Pointer: {pointerPos} of {inputVal.length}
          </span>
        </div>
        {ReadingTape && (
          <ReadingTape
            input={inputVal}
            pointer={stepIndex >= 0 ? stepIndex : 0}
            isFinished={isFinished}
            isAccepted={simResult.isAccepted}
          />
        )}
      </div>

      {/* Step / Verdict Banner */}
      {stepIndex >= 0 && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isFinished
              ? simResult.isAccepted
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              : 'bg-sky-950/30 border-sky-500/30 text-sky-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {isFinished ? (
              simResult.isAccepted ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
              )
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-sky-400 border-t-transparent animate-spin shrink-0" />
            )}
            <div>
              <div className="text-sm font-bold">
                {isFinished
                  ? simResult.isAccepted
                    ? `ACCEPTED: Valid PRN for ${activeDfa.name}`
                    : `REJECTED: PRN Validation Failed for ${activeDfa.name}`
                  : `Processing Step ${stepIndex + 1} of ${simResult.steps.length}`}
              </div>
              <div className="text-xs opacity-90 mt-0.5 font-mono">
                {isFinished && !simResult.isAccepted
                  ? simResult.rejectionReason
                  : currentStep
                  ? currentStep.explanation
                  : `Current machine state: ${currentState}`}
              </div>
            </div>
          </div>
          <div className="text-right text-xs font-mono shrink-0">
            <span className="opacity-75 block">Halt State</span>
            <strong className="text-sm font-bold">{currentState}</strong>
          </div>
        </div>
      )}

      {/* DFA Graph Diagram & Transition Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              DFA Diagram ({activeDfa.name}): {activeDfa.startState} → ... → (({activeDfa.finalStates[0]}))
            </h2>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'graph' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              Graph View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              Transition Table
            </button>
          </div>
        </div>

        {viewMode === 'graph' ? (
          DfaGraph && (
            <DfaGraph
              config={activeDfa}
              currentState={currentState}
              previousState={previousState}
              isAccepted={isFinished && simResult.isAccepted}
              isDead={currentState === activeDfa.deadState}
              activeSymbol={currentStep?.currentChar}
            />
          )
        ) : (
          TransitionTable && (
            <TransitionTable
              config={activeDfa}
              currentState={currentState}
              activeSymbol={currentStep?.currentChar}
            />
          )
        )}
      </div>

      {/* Instantaneous Description Trace */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            State Machine Instantaneous Description (ID) Trace
          </h3>
          <span className="text-[11px] font-mono text-sky-400 font-bold">(q, w) ⊢ (q', w')</span>
        </div>
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-purple-400 font-bold">
            ({activeDfa.startState}, "{inputVal.trim() || 'ε'}")
          </span>
          {simResult.steps.map((stp, idx) => {
            const rest = inputVal.trim().slice(idx + 1) || 'ε';
            return (
              <React.Fragment key={idx}>
                <span className="text-slate-600 font-bold">⊢</span>
                <span
                  className={
                    stp.isFinalState && idx === simResult.steps.length - 1
                      ? 'text-emerald-400 font-bold'
                      : stp.isDeadState
                      ? 'text-rose-400 font-bold'
                      : 'text-sky-300'
                  }
                >
                  ({stp.toState}, "{rest}")
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Viva / Theory Section */}
      {VivaQuestions && <VivaQuestions config={activeDfa} currentInput={inputVal} />}

      {/* Dataset Modal */}
      <DatasetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(student) => {
          setSelectedStudent(student);
          setInputVal(student.enrollNo);
          setDivision(student.division);
          setStepIndex(-1);
        }}
        targetMode="prn"
      />
    </div>
  );
}
