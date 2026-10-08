import React, { useState, useMemo } from 'react';
import { Database, X, Search, CheckCircle } from 'lucide-react';
import { STUDENTS } from '../data/students';

export default function DatasetModal({ isOpen, onClose, onSelect, targetMode = 'prn' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('all'); // 'all', 'TY', 'SY'
  const [divFilter, setDivFilter] = useState('all'); // 'all', 'A', 'B', 'C', 'D'

  const filteredStudents = useMemo(() => {
    return STUDENTS.filter((s) => {
      if (yearFilter !== 'all' && s.year !== yearFilter) return false;
      if (divFilter !== 'all' && s.division !== divFilter) return false;
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        s.enrollNo.toLowerCase().includes(q) ||
        s.studentName.toLowerCase().includes(q) ||
        s.emailId.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, yearFilter, divFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Official RIT Student Dataset
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold">
                  {STUDENTS.length} Records Loaded
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Two Cohorts: Third Year (TY Div A, B, C — 222) and Second Year (SY Div D — 60)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-3 sm:p-4 bg-slate-950/50 border-b border-slate-800 space-y-3">
          {/* Cohort Year Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-semibold">Cohort:</span>
            <button
              onClick={() => { setYearFilter('all'); setDivFilter('all'); }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                yearFilter === 'all'
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-950'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              All Cohorts ({STUDENTS.length})
            </button>
            <button
              onClick={() => { setYearFilter('TY'); setDivFilter('all'); }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                yearFilter === 'TY'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-950'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              TY (Third Year — 222)
            </button>
            <button
              onClick={() => { setYearFilter('SY'); setDivFilter('D'); }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                yearFilter === 'SY'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              SY (Second Year — 60)
            </button>
          </div>

          {/* Division Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-semibold">Division:</span>
            <button
              onClick={() => setDivFilter('all')}
              className={`px-2.5 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                divFilter === 'all'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Divs
            </button>
            <button
              onClick={() => { setYearFilter('TY'); setDivFilter('A'); }}
              className={`px-2.5 py-0.5 rounded text-xs font-mono transition-all cursor-pointer ${
                divFilter === 'A'
                  ? 'bg-sky-500/25 text-sky-300 border border-sky-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              TY · Div A (79)
            </button>
            <button
              onClick={() => { setYearFilter('TY'); setDivFilter('B'); }}
              className={`px-2.5 py-0.5 rounded text-xs font-mono transition-all cursor-pointer ${
                divFilter === 'B'
                  ? 'bg-sky-500/25 text-sky-300 border border-sky-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              TY · Div B (74)
            </button>
            <button
              onClick={() => { setYearFilter('TY'); setDivFilter('C'); }}
              className={`px-2.5 py-0.5 rounded text-xs font-mono transition-all cursor-pointer ${
                divFilter === 'C'
                  ? 'bg-sky-500/25 text-sky-300 border border-sky-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              TY · Div C (69)
            </button>
            <button
              onClick={() => { setYearFilter('SY'); setDivFilter('D'); }}
              className={`px-2.5 py-0.5 rounded text-xs font-mono transition-all cursor-pointer ${
                divFilter === 'D'
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              SY · Div D (60)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, PRN, or college email..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-sky-500 transition-colors shadow-inner"
            />
          </div>
        </div>

        {/* Student Records List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-slate-800/60 max-h-[500px]">
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 font-mono">
              No students found matching your filter criteria.
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={`${student.enrollNo}-${student.division}`}
                className="py-2.5 px-2 hover:bg-slate-800/50 rounded-lg flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[11px] font-mono text-slate-500 w-8 shrink-0">
                    #{student.srNo}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white truncate">
                        {student.studentName}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                          student.division === 'D'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-sky-950 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {student.year} · Div {student.division}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-0.5">
                      <span>
                        PRN: <strong className="text-slate-300">{student.enrollNo}</strong>
                      </span>
                      <span className="text-slate-500 truncate">{student.emailId}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onSelect(student);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1 shadow-sm shadow-sky-950 whitespace-nowrap active:scale-95"
                >
                  <span>Select & Draw DFA</span>
                  <span className="font-mono">→</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>
            Showing {filteredStudents.length} of {STUDENTS.length} enrolled students
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
