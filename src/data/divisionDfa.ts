import { STUDENTS, DIV_A_STUDENTS, DIV_B_STUDENTS, DIV_C_STUDENTS, DIV_D_STUDENTS, Student } from "./students";

function checkPrnFormat(prn: string): { isValid: boolean; reason?: string } {
  if (prn.length !== 7) {
    return { isValid: false, reason: `PRN must have exactly 7 digits (received ${prn.length})` };
  }
  if (/^(\d)\1{6}$/.test(prn)) {
    return { isValid: false, reason: `PRN cannot consist of identical repeated digits (${prn})` };
  }
  if (prn.split("").every((ch, i, arr) => i === 0 || Number(ch) === Number(arr[i - 1]) + 1)) {
    return { isValid: false, reason: `PRN cannot be consecutive sequential numbers (${prn})` };
  }
  if (prn.split("").every((ch, i, arr) => i === 0 || Number(ch) === Number(arr[i - 1]) - 1)) {
    return { isValid: false, reason: `PRN cannot be reverse consecutive sequential numbers (${prn})` };
  }
  if (/^[1-9]0{5,6}$/.test(prn)) {
    return { isValid: false, reason: `PRN cannot be a dummy number with all trailing zeros (${prn})` };
  }
  return { isValid: true };
}

export function findStudentByPrn(prn: string): Student | undefined {
  const clean = prn.trim();
  return STUDENTS.find(s => s.enrollNo === clean);
}

export function findStudentByEmail(email: string): Student | undefined {
  const clean = email.trim().toLowerCase();
  return STUDENTS.find(s => s.emailId.toLowerCase() === clean);
}

// -------------------------------------------------------------
// 1. TY DIVISION A DFA (PRN)
// -------------------------------------------------------------
export const DFA_PRN_DIV_A = {
  id: "rit_prn_div_a",
  name: "RIT PRN Validator — TY Division A",
  category: "student_id",
  division: "A",
  year: "TY",
  description: "Validates 7-digit PRNs belonging to TY Division A (2403001–2403069, 2410033, and DSE 2553001–2553019).",
  states: ["q0", "q1", "q2", "q3", "q4_divA", "q5_divA", "q6_divA", "q7_divA", "q_trap"],
  alphabet: ["[1-9]", "[0-9]"],
  startState: "q0",
  finalStates: ["q7_divA"],
  deadState: "q_trap",
  stateLabels: {
    q0: "Start: Awaiting PRN 1st digit [1-9] (non-zero start)",
    q1: "PRN Digit 1 read: Awaiting batch 2nd digit [0-9] (4 for regular, 5 for DSE)",
    q2: "Batch YY verified: Awaiting 3rd digit (0 for CS, 5 for DSE CS, 1 for IT)",
    q3: "Dept verified: Awaiting 4th digit (3 for CS, 0 for IT)",
    q4_divA: "Div A Indicator: Awaiting roll tens prefix \"0\" for Div A (range 001–069 / 001–019)",
    q5_divA: "Div A Roll Sequence: Awaiting roll range tens digit [0-6]",
    q6_divA: "Div A Roll Sequence: Awaiting final unit digit [0-9]",
    q7_divA: "Accepted: Valid TY Division A Student (Roll 001–069 / DSE 001–019)",
    q_trap: "Trap State: Non-Div A student, invalid format, or dummy sequence"
  },
  transitions: {
    q0: { "[1-9]": "q1", 0: "q_trap" },
    q1: { "[0-9]": "q2" },
    q2: { "[0-9]": "q3" },
    q3: { "[0-9]": "q4_divA" },
    q4_divA: { "[0-9]": "q5_divA" },
    q5_divA: { "[0-9]": "q6_divA" },
    q6_divA: { "[0-9]": "q7_divA" },
    q7_divA: { "*": "q_trap" },
    q_trap: { "*": "q_trap" }
  },
  transitionGuard: (fromState: string, symbol: string, inputPrefix: string, toState: string) => {
    if (fromState === "q6_divA" && toState === "q7_divA") {
      const fmt = checkPrnFormat(inputPrefix);
      if (!fmt.isValid) return { nextState: "q_trap", explanation: `Rejected: ${fmt.reason}` };
      const student = findStudentByPrn(inputPrefix);
      if (!student) {
        return { nextState: "q_trap", explanation: `Rejected: PRN ${inputPrefix} is not in RIT enrollment dataset` };
      }
      if (student.division !== "A") {
        return {
          nextState: "q_trap",
          explanation: `Rejected: PRN ${inputPrefix} belongs to ${student.year} Division ${student.division} (${student.studentName}), not Division A.`
        };
      }
    }
    return null;
  },
  rejectionReasons: {
    q0: "PRN must start with [1-9]. Cannot start with 0 or letters.",
    q1: "Expected 2nd digit of 7-digit PRN",
    q2: "Expected 3rd digit of PRN",
    q3: "Expected 4th digit of PRN",
    q4_divA: "Expected 5th digit (Division A sequence prefix)",
    q5_divA: "Expected 6th digit of Division A roll sequence",
    q6_divA: "Expected 7th digit of Division A roll sequence",
    q7_divA: "PRN length exceeded 7 digits",
    q_trap: "Rejected: Must be valid TY Division A student PRN (2403001–2403069, 2410033, 2553001–2553019)"
  },
  layoutCoordinates: {
    q0: { x: 80, y: 150 },
    q1: { x: 200, y: 150 },
    q2: { x: 320, y: 150 },
    q3: { x: 440, y: 150 },
    q4_divA: { x: 560, y: 150 },
    q5_divA: { x: 680, y: 150 },
    q6_divA: { x: 800, y: 150 },
    q7_divA: { x: 930, y: 150 },
    q_trap: { x: 500, y: 280 }
  }
};

// -------------------------------------------------------------
// 2. TY DIVISION B DFA (PRN)
// -------------------------------------------------------------
export const DFA_PRN_DIV_B = {
  id: "rit_prn_div_b",
  name: "RIT PRN Validator — TY Division B",
  category: "student_id",
  division: "B",
  year: "TY",
  description: "Validates 7-digit PRNs belonging to TY Division B (2403070–2403139 and DSE 2553016–2553026).",
  states: ["q0", "q1", "q2", "q3", "q4_divB", "q5_divB", "q6_divB", "q7_divB", "q_trap"],
  alphabet: ["[1-9]", "[0-9]"],
  startState: "q0",
  finalStates: ["q7_divB"],
  deadState: "q_trap",
  stateLabels: {
    q0: "Start: Awaiting PRN 1st digit [1-9] (non-zero start)",
    q1: "PRN Digit 1 read: Awaiting batch 2nd digit [0-9]",
    q2: "Batch YY verified: Awaiting 3rd digit [0-9]",
    q3: "Dept verified: Awaiting 4th digit [0-9]",
    q4_divB: "Div B Indicator: Awaiting roll sequence (range 070–139 / DSE 016–026)",
    q5_divB: "Div B Roll Sequence: Awaiting tens digit",
    q6_divB: "Div B Roll Sequence: Awaiting final unit digit",
    q7_divB: "Accepted: Valid TY Division B Student (Roll 070–139 / DSE 016–026)",
    q_trap: "Trap State: Non-Div B student, invalid format, or dummy sequence"
  },
  transitions: {
    q0: { "[1-9]": "q1", 0: "q_trap" },
    q1: { "[0-9]": "q2" },
    q2: { "[0-9]": "q3" },
    q3: { "[0-9]": "q4_divB" },
    q4_divB: { "[0-9]": "q5_divB" },
    q5_divB: { "[0-9]": "q6_divB" },
    q6_divB: { "[0-9]": "q7_divB" },
    q7_divB: { "*": "q_trap" },
    q_trap: { "*": "q_trap" }
  },
  transitionGuard: (fromState: string, symbol: string, inputPrefix: string, toState: string) => {
    if (fromState === "q6_divB" && toState === "q7_divB") {
      const fmt = checkPrnFormat(inputPrefix);
      if (!fmt.isValid) return { nextState: "q_trap", explanation: `Rejected: ${fmt.reason}` };
      const student = findStudentByPrn(inputPrefix);
      if (!student) {
        return { nextState: "q_trap", explanation: `Rejected: PRN ${inputPrefix} is not in RIT enrollment dataset` };
      }
      if (student.division !== "B") {
        return {
          nextState: "q_trap",
          explanation: `Rejected: PRN ${inputPrefix} belongs to ${student.year} Division ${student.division} (${student.studentName}), not Division B.`
        };
      }
    }
    return null;
  },
  rejectionReasons: {
    q0: "PRN must start with [1-9]. Cannot start with 0 or letters.",
    q1: "Expected 2nd digit of 7-digit PRN",
    q2: "Expected 3rd digit of PRN",
    q3: "Expected 4th digit of PRN",
    q4_divB: "Expected 5th digit (Division B sequence prefix)",
    q5_divB: "Expected 6th digit of Division B roll sequence",
    q6_divB: "Expected 7th digit of Division B roll sequence",
    q7_divB: "PRN length exceeded 7 digits",
    q_trap: "Rejected: Must be valid TY Division B student PRN (2403070–2403139, 2553016–2553026)"
  },
  layoutCoordinates: {
    q0: { x: 80, y: 150 },
    q1: { x: 200, y: 150 },
    q2: { x: 320, y: 150 },
    q3: { x: 440, y: 150 },
    q4_divB: { x: 560, y: 150 },
    q5_divB: { x: 680, y: 150 },
    q6_divB: { x: 800, y: 150 },
    q7_divB: { x: 930, y: 150 },
    q_trap: { x: 500, y: 280 }
  }
};

// -------------------------------------------------------------
// 3. TY DIVISION C DFA (PRN)
// -------------------------------------------------------------
export const DFA_PRN_DIV_C = {
  id: "rit_prn_div_c",
  name: "RIT PRN Validator — TY Division C",
  category: "student_id",
  division: "C",
  year: "TY",
  description: "Validates 7-digit PRNs belonging to TY Division C (2403140–2403216 and DSE 2403801–2403803).",
  states: ["q0", "q1", "q2", "q3", "q4_divC", "q5_divC", "q6_divC", "q7_divC", "q_trap"],
  alphabet: ["[1-9]", "[0-9]"],
  startState: "q0",
  finalStates: ["q7_divC"],
  deadState: "q_trap",
  stateLabels: {
    q0: "Start: Awaiting PRN 1st digit [1-9] (non-zero start)",
    q1: "PRN Digit 1 read: Awaiting batch 2nd digit [0-9]",
    q2: "Batch YY verified: Awaiting 3rd digit [0-9]",
    q3: "Dept verified: Awaiting 4th digit [0-9]",
    q4_divC: "Div C Indicator: Awaiting roll sequence (range 140–216 / DSE 801–803)",
    q5_divC: "Div C Roll Sequence: Awaiting tens digit",
    q6_divC: "Div C Roll Sequence: Awaiting final unit digit",
    q7_divC: "Accepted: Valid TY Division C Student (Roll 140–216 / DSE 801–803)",
    q_trap: "Trap State: Non-Div C student, invalid format, or dummy sequence"
  },
  transitions: {
    q0: { "[1-9]": "q1", 0: "q_trap" },
    q1: { "[0-9]": "q2" },
    q2: { "[0-9]": "q3" },
    q3: { "[0-9]": "q4_divC" },
    q4_divC: { "[0-9]": "q5_divC" },
    q5_divC: { "[0-9]": "q6_divC" },
    q6_divC: { "[0-9]": "q7_divC" },
    q7_divC: { "*": "q_trap" },
    q_trap: { "*": "q_trap" }
  },
  transitionGuard: (fromState: string, symbol: string, inputPrefix: string, toState: string) => {
    if (fromState === "q6_divC" && toState === "q7_divC") {
      const fmt = checkPrnFormat(inputPrefix);
      if (!fmt.isValid) return { nextState: "q_trap", explanation: `Rejected: ${fmt.reason}` };
      const student = findStudentByPrn(inputPrefix);
      if (!student) {
        return { nextState: "q_trap", explanation: `Rejected: PRN ${inputPrefix} is not in RIT enrollment dataset` };
      }
      if (student.division !== "C") {
        return {
          nextState: "q_trap",
          explanation: `Rejected: PRN ${inputPrefix} belongs to ${student.year} Division ${student.division} (${student.studentName}), not Division C.`
        };
      }
    }
    return null;
  },
  rejectionReasons: {
    q0: "PRN must start with [1-9]. Cannot start with 0 or letters.",
    q1: "Expected 2nd digit of 7-digit PRN",
    q2: "Expected 3rd digit of PRN",
    q3: "Expected 4th digit of PRN",
    q4_divC: "Expected 5th digit (Division C sequence prefix)",
    q5_divC: "Expected 6th digit of Division C roll sequence",
    q6_divC: "Expected 7th digit of Division C roll sequence",
    q7_divC: "PRN length exceeded 7 digits",
    q_trap: "Rejected: Must be valid TY Division C student PRN (2403140–2403216, 2403801–2403803)"
  },
  layoutCoordinates: {
    q0: { x: 80, y: 150 },
    q1: { x: 200, y: 150 },
    q2: { x: 320, y: 150 },
    q3: { x: 440, y: 150 },
    q4_divC: { x: 560, y: 150 },
    q5_divC: { x: 680, y: 150 },
    q6_divC: { x: 800, y: 150 },
    q7_divC: { x: 930, y: 150 },
    q_trap: { x: 500, y: 280 }
  }
};

// -------------------------------------------------------------
// 4. SY DIVISION D DFA (PRN)
// -------------------------------------------------------------
export const DFA_PRN_DIV_D = {
  id: "rit_prn_div_d",
  name: "RIT PRN Validator — SY Division D",
  category: "student_id",
  division: "D",
  year: "SY",
  description: "Validates 7-digit PRNs belonging to SY Division D (25038xx, 26530xx, 2403091, and allied SY branches).",
  states: ["q0", "q1", "q2_sy", "q3_sy", "q4_divD", "q5_divD", "q6_divD", "q7_divD", "q_trap"],
  alphabet: ["[1-9]", "[0-9]"],
  startState: "q0",
  finalStates: ["q7_divD"],
  deadState: "q_trap",
  stateLabels: {
    q0: "Start: Awaiting PRN 1st digit [1-9] (non-zero start)",
    q1: "PRN Digit 1 read: Awaiting batch 2nd digit (5 for 2025, 6 for 2026 DSE, 4 for 2024)",
    q2_sy: "SY Batch verified: Awaiting branch/dept digit",
    q3_sy: "SY Program verified: Awaiting category/program digit",
    q4_divD: "SY Div D Indicator: Awaiting roll prefix (8 for 25038xx, 0 for 26530xx)",
    q5_divD: "SY Div D Sequence: Awaiting roll tens digit",
    q6_divD: "SY Div D Sequence: Awaiting final unit digit",
    q7_divD: "Accepted: Valid SY Division D Student (Batch 25038xx / 26530xx)",
    q_trap: "Trap State: Non-Div D student, invalid format, or dummy sequence"
  },
  transitions: {
    q0: { "[1-9]": "q1", 0: "q_trap" },
    q1: { "[0-9]": "q2_sy" },
    q2_sy: { "[0-9]": "q3_sy" },
    q3_sy: { "[0-9]": "q4_divD" },
    q4_divD: { "[0-9]": "q5_divD" },
    q5_divD: { "[0-9]": "q6_divD" },
    q6_divD: { "[0-9]": "q7_divD" },
    q7_divD: { "*": "q_trap" },
    q_trap: { "*": "q_trap" }
  },
  transitionGuard: (fromState: string, symbol: string, inputPrefix: string, toState: string) => {
    if (fromState === "q6_divD" && toState === "q7_divD") {
      const fmt = checkPrnFormat(inputPrefix);
      if (!fmt.isValid) return { nextState: "q_trap", explanation: `Rejected: ${fmt.reason}` };
      const student = findStudentByPrn(inputPrefix);
      if (!student) {
        return { nextState: "q_trap", explanation: `Rejected: PRN ${inputPrefix} is not in RIT enrollment dataset` };
      }
      if (student.division !== "D") {
        return {
          nextState: "q_trap",
          explanation: `Rejected: PRN ${inputPrefix} belongs to ${student.year} Division ${student.division} (${student.studentName}), not Division D.`
        };
      }
    }
    return null;
  },
  rejectionReasons: {
    q0: "PRN must start with [1-9]. Cannot start with 0 or letters.",
    q1: "Expected 2nd digit of 7-digit PRN",
    q2_sy: "Expected 3rd digit of SY PRN",
    q3_sy: "Expected 4th digit of SY PRN",
    q4_divD: "Expected 5th digit (SY Division D sequence prefix)",
    q5_divD: "Expected 6th digit of SY Division D roll sequence",
    q6_divD: "Expected 7th digit of SY Division D roll sequence",
    q7_divD: "PRN length exceeded 7 digits",
    q_trap: "Rejected: Must be valid SY Division D student PRN (25038xx, 26530xx, 2403091)"
  },
  layoutCoordinates: {
    q0: { x: 80, y: 150 },
    q1: { x: 200, y: 150 },
    q2_sy: { x: 320, y: 150 },
    q3_sy: { x: 440, y: 150 },
    q4_divD: { x: 560, y: 150 },
    q5_divD: { x: 680, y: 150 },
    q6_divD: { x: 800, y: 150 },
    q7_divD: { x: 930, y: 150 },
    q_trap: { x: 500, y: 280 }
  }
};

// -------------------------------------------------------------
// 5. ALL DIVISIONS DFA (PRN)
// -------------------------------------------------------------
export const DFA_PRN_ALL = {
  id: "rit_prn_all",
  name: "RIT PRN Validator — All Divisions (TY & SY)",
  category: "student_id",
  division: "ALL",
  year: "ALL",
  description: "Validates official 7-digit RIT Permanent Registration Numbers across all 282 enrolled students (TY Div A, B, C and SY Div D).",
  states: ["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q_trap"],
  alphabet: ["[1-9]", "[0-9]"],
  startState: "q0",
  finalStates: ["q7"],
  deadState: "q_trap",
  stateLabels: {
    q0: "Start: Awaiting PRN 1st digit [1-9] (non-zero start)",
    q1: "PRN Digit 1 (Batch YY[0]): Awaiting 2nd digit [0-9]",
    q2: "PRN Digit 2 (Batch YY[1]): Awaiting 3rd digit [0-9] (Course/Branch)",
    q3: "PRN Digit 3 (Course/Branch): Awaiting 4th digit [0-9] (Program/Category)",
    q4: "PRN Digit 4 (Program): Awaiting 5th digit [0-9] (Sequence SSS[0])",
    q5: "PRN Digit 5 (Sequence SSS[1]): Awaiting 6th digit [0-9]",
    q6: "PRN Digit 6 (Sequence SSS[2]): Awaiting 7th digit [0-9]",
    q7: "Accepted: Valid 7-Digit RIT PRN (^[1-9][0-9]{6}$)",
    q_trap: "Trap State: Invalid digit, consecutive/repeated sequence, dummy zeros, or wrong length"
  },
  transitions: {
    q0: { "[1-9]": "q1", 0: "q_trap" },
    q1: { "[0-9]": "q2" },
    q2: { "[0-9]": "q3" },
    q3: { "[0-9]": "q4" },
    q4: { "[0-9]": "q5" },
    q5: { "[0-9]": "q6" },
    q6: { "[0-9]": "q7" },
    q7: { "*": "q_trap" },
    q_trap: { "*": "q_trap" }
  },
  transitionGuard: (fromState: string, symbol: string, inputPrefix: string, toState: string) => {
    if (fromState === "q6" && toState === "q7") {
      const fmt = checkPrnFormat(inputPrefix);
      if (!fmt.isValid) return { nextState: "q_trap", explanation: `Rejected: ${fmt.reason}` };
    }
    return null;
  },
  rejectionReasons: {
    q0: "PRN must start with a non-zero digit [1-9]. Cannot start with 0 or letters.",
    q1: "Expected 2nd digit [0-9] of 7-digit PRN",
    q2: "Expected 3rd digit [0-9] of PRN (Course/Branch identifier)",
    q3: "Expected 4th digit [0-9] of PRN (Program/Category identifier)",
    q4: "Expected 5th digit [0-9] of PRN (Sequence number SSS[0])",
    q5: "Expected 6th digit [0-9] of PRN (Sequence number SSS[1])",
    q6: "Expected 7th digit [0-9] of PRN (Sequence number SSS[2]). If only 6 digits, PRN is incomplete.",
    q7: "PRN exceeded exactly 7 digits (length > 7)",
    q_trap: "Input rejected: invalid digit, starts with 0, consecutive numbers, repeated digits, or dummy zeros"
  },
  layoutCoordinates: {
    q0: { x: 80, y: 150 },
    q1: { x: 200, y: 150 },
    q2: { x: 320, y: 150 },
    q3: { x: 440, y: 150 },
    q4: { x: 560, y: 150 },
    q5: { x: 680, y: 150 },
    q6: { x: 800, y: 150 },
    q7: { x: 920, y: 150 },
    q_trap: { x: 500, y: 280 }
  }
};

// Helper generator for Email DFAs with division checking
function createEmailDfaForDivision(div: "A" | "B" | "C" | "D" | "ALL", prnDfa: any) {
  const divName = div === "ALL" ? "All Divisions (TY & SY)" : div === "D" ? "SY Division D" : `TY Division ${div}`;
  const acceptState = div === "ALL" ? "q20" : `q20_div${div}`;

  // Division-specific state names for PRN portion
  const prnStates = div === "D"
    ? ["q0", "q1", "q2_sy", "q3_sy", "q4_divD", "q5_divD", "q6_divD", "q7_divD"]
    : div === "A" || div === "B" || div === "C"
    ? ["q0", "q1", "q2", "q3", `q4_div${div}`, `q5_div${div}`, `q6_div${div}`, `q7_div${div}`]
    : ["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7"];

  const domainStates = [
    "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16", "q17", "q18", "q19",
    acceptState, "q_trap"
  ];
  
  const allStates = [...prnStates, ...domainStates];

  const stateLabels: Record<string, string> = {
    [prnStates[0]]: `Start: Awaiting 1st PRN digit [1-9] for ${divName}`,
    [prnStates[1]]: "PRN Digit 1 read: Awaiting 2nd digit",
    [prnStates[2]]: "PRN Digit 2 read: Awaiting 3rd digit",
    [prnStates[3]]: "PRN Digit 3 read: Awaiting 4th digit",
    [prnStates[4]]: `PRN Digit 4 read: Awaiting 5th digit (${divName})`,
    [prnStates[5]]: `PRN Digit 5 read: Awaiting 6th digit (${divName})`,
    [prnStates[6]]: `PRN Digit 6 read: Awaiting 7th digit (${divName})`,
    [prnStates[7]]: `7-Digit PRN verified for ${divName}: Awaiting separator "@"`,
    q8: "Separator \"@\" read: Awaiting domain \"r\"",
    q9: "Domain: Read \"r\", awaiting \"i\"",
    q10: "Domain: Read \"ri\", awaiting \"t\"",
    q11: "Domain: Read \"rit\", awaiting \"i\"",
    q12: "Domain: Read \"riti\", awaiting \"n\"",
    q13: "Domain: Read \"ritin\", awaiting \"d\"",
    q14: "Domain: Read \"ritind\", awaiting \"i\"",
    q15: "Domain: Read \"ritindi\", awaiting \"a\"",
    q16: "Domain \"ritindia\" verified: Awaiting dot \".\"",
    q17: "Dot \".\" read: Awaiting academic TLD \"e\"",
    q18: "TLD: Read \"e\", awaiting \"d\"",
    q19: "TLD: Read \"ed\", awaiting \"u\"",
    [acceptState]: `Accepted: Valid ${divName} Institutional Email`,
    q_trap: `Trap State: Non-${divName} student, invalid domain, or illegal format`
  };

  const transitions: Record<string, Record<string, string>> = {
    [prnStates[0]]: { "[1-9]": prnStates[1], 0: "q_trap" },
    [prnStates[1]]: { "[0-9]": prnStates[2] },
    [prnStates[2]]: { "[0-9]": prnStates[3] },
    [prnStates[3]]: { "[0-9]": prnStates[4] },
    [prnStates[4]]: { "[0-9]": prnStates[5] },
    [prnStates[5]]: { "[0-9]": prnStates[6] },
    [prnStates[6]]: { "[0-9]": prnStates[7] },
    [prnStates[7]]: { "@": "q8" },
    q8: { r: "q9", R: "q9" },
    q9: { i: "q10", I: "q10" },
    q10: { t: "q11", T: "q11" },
    q11: { i: "q12", I: "q12" },
    q12: { n: "q13", N: "q13" },
    q13: { d: "q14", D: "q14" },
    q14: { i: "q15", I: "q15" },
    q15: { a: "q16", A: "q16" },
    q16: { ".": "q17" },
    q17: { e: "q18", E: "q18" },
    q18: { d: "q19", D: "q19" },
    q19: { u: acceptState, U: acceptState },
    [acceptState]: { "*": "q_trap" },
    q_trap: { "*": "q_trap" }
  };

  const layoutCoordinates: Record<string, { x: number; y: number }> = {
    [prnStates[0]]: { x: 70, y: 110 },
    [prnStates[1]]: { x: 170, y: 110 },
    [prnStates[2]]: { x: 270, y: 110 },
    [prnStates[3]]: { x: 370, y: 110 },
    [prnStates[4]]: { x: 470, y: 110 },
    [prnStates[5]]: { x: 570, y: 110 },
    [prnStates[6]]: { x: 670, y: 110 },
    [prnStates[7]]: { x: 770, y: 110 },
    q8: { x: 870, y: 110 },
    q9: { x: 970, y: 110 },
    q10: { x: 1070, y: 110 },
    q11: { x: 1170, y: 110 },
    q12: { x: 1170, y: 220 },
    q13: { x: 1070, y: 220 },
    q14: { x: 970, y: 220 },
    q15: { x: 870, y: 220 },
    q16: { x: 770, y: 220 },
    q17: { x: 670, y: 220 },
    q18: { x: 570, y: 220 },
    q19: { x: 470, y: 220 },
    [acceptState]: { x: 370, y: 220 },
    q_trap: { x: 620, y: 320 }
  };

  return {
    id: `rit_email_div_${div.toLowerCase()}`,
    name: `RIT College Email Validator — ${divName}`,
    category: "email",
    division: div,
    description: `Validates official institutional emails [PRN]@ritindia.edu for ${divName}.`,
    states: allStates,
    alphabet: ["[1-9]", "[0-9]", "@", "r", "i", "t", "n", "d", "a", ".", "e", "u"],
    startState: prnStates[0],
    finalStates: [acceptState],
    deadState: "q_trap",
    stateLabels,
    transitions,
    transitionGuard: (fromState: string, symbol: string, inputPrefix: string, toState: string) => {
      if (fromState === prnStates[6] && toState === prnStates[7]) {
        const prn = inputPrefix;
        const fmt = checkPrnFormat(prn);
        if (!fmt.isValid) return { nextState: "q_trap", explanation: `Email rejected: ${fmt.reason}` };
        if (div !== "ALL") {
          const student = findStudentByPrn(prn);
          if (!student) {
            return { nextState: "q_trap", explanation: `Email rejected: PRN ${prn} not found in student records` };
          }
          if (student.division !== div) {
            return {
              nextState: "q_trap",
              explanation: `Email rejected: Student ${student.studentName} is in ${student.year} Division ${student.division}, not Division ${div}.`
            };
          }
        }
      }
      return null;
    },
    rejectionReasons: {
      [prnStates[0]]: "Email must begin with a 7-digit PRN starting with [1-9]. Cannot start with 0.",
      [prnStates[1]]: "Expected 2nd digit of 7-digit PRN",
      [prnStates[2]]: "Expected 3rd digit of 7-digit PRN",
      [prnStates[3]]: "Expected 4th digit of 7-digit PRN",
      [prnStates[4]]: `Expected 5th digit of 7-digit PRN (${divName})`,
      [prnStates[5]]: `Expected 6th digit of 7-digit PRN (${divName})`,
      [prnStates[6]]: `Expected 7th digit of PRN before "@" (${divName})`,
      [prnStates[7]]: `Expected separator "@" after ${divName} PRN`,
      q8: "Expected official domain \"ritindia.edu\" (read \"r\")",
      q9: "Expected \"i\" in \"ritindia.edu\"",
      q10: "Expected \"t\" in \"ritindia.edu\"",
      q11: "Expected \"i\" in \"ritindia.edu\"",
      q12: "Expected \"n\" in \"ritindia.edu\"",
      q13: "Expected \"d\" in \"ritindia.edu\"",
      q14: "Expected \"i\" in \"ritindia.edu\"",
      q15: "Expected \"a\" in \"ritindia.edu\"",
      q16: "Expected \".\" before academic TLD",
      q17: "Expected \"e\" in \"edu\"",
      q18: "Expected \"d\" in \"edu\"",
      q19: "Expected \"u\" in \"edu\"",
      [acceptState]: "Trailing characters after \".edu\" are prohibited",
      q_trap: `Email failed validation for ${divName}`
    },
    layoutCoordinates
  };
}

export const DFA_EMAIL_DIV_A = createEmailDfaForDivision("A", DFA_PRN_DIV_A);
export const DFA_EMAIL_DIV_B = createEmailDfaForDivision("B", DFA_PRN_DIV_B);
export const DFA_EMAIL_DIV_C = createEmailDfaForDivision("C", DFA_PRN_DIV_C);
export const DFA_EMAIL_DIV_D = createEmailDfaForDivision("D", DFA_PRN_DIV_D);
export const DFA_EMAIL_ALL = createEmailDfaForDivision("ALL", DFA_PRN_ALL);
