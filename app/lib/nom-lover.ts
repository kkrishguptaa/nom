type ReturnType = Array<{
  score: number;
  type:
    | "vowel"
    | "consonant"
    | "combination"
    | "consecutiveCombination"
    | "startLetter";
  description: string;
  position: number;
}>;

const vowels = {
  a: 10,
  e: 10,
  i: 5,
  o: 5,
  u: 0,
};

const consonants = {
  b: 0,
  c: -1,
  d: 2,
  f: -1,
  g: 2,
  h: 2,
  j: -1,
  k: 25,
  l: 1,
  m: 1,
  n: 10,
  p: -1,
  q: -2,
  r: 3,
  s: 3,
  t: 10,
  v: 0,
  w: 1,
  x: -2,
  y: 1,
  z: -1,
};

const combinations = {
  bb: -3,
  dd: -3,
  pt: -2,
  xt: -2,
  ngl: -2,
  rst: -2,
  ngr: -2,
  sch: -2,
  gg: -2,
  pp: -2,
  tt: -2,
  cc: -2,
  ff: -2,
  kt: -2,
  ft: -2,
  bh: -2,
  gh: -1,
  ck: -1,

  ph: -1,
  wh: -1,
  ll: -1,
  mm: -1,
  nn: -1,
  rr: -1,
  ss: -1,
  scr: -1,
  spr: -1,
  str: -1,
  tch: -1,
  dge: -1,
  ug: -1,
  ew: -1,
  aw: -1,
  ow: -1,
  mb: -1,
  nk: -1,
  mp: -1,
  nd: -1,
  nt: -1,

  na: 2,
  ta: 2,
  ka: 2,
  la: 3,
  ma: 3,
  ra: 3,
  sa: 2,
  va: 2,
  wa: 1,
  li: 2,
  mi: 2,
  vi: 2,
  th: 3,
  sh: 4,
  ch: 3,
  ha: 2,
  he: 2,
  hi: 1,
  ho: 1,
  ar: 3,
  er: 2,
  ir: 2,
  or: 2,
  ur: 1,
  an: 3,
  en: 2,
  in: 3,
  on: 2,
  un: 1,
  rya: 3,
  kya: 3,
  ya: 4,
  dh: 4,
  ri: 4,
  ei: 8,
  oe: 8,
  au: 8,
  shi: 8,
  nya: 8,
  ita: 8,
  ish: 25,
  ate: 50,
};

const startLetters = {
  a: 50,
  i: 50,
  k: 100,
  n: 25,
  t: 25,
};

const consecutiveCombinations = Object.keys(combinations);

function checkLetterPoints(name: string): ReturnType {
  const results: ReturnType = [];

  for (let i = 0; i < name.length; i++) {
    const char = name[i];
    if (char in vowels) {
      // Include all vowels, even those with 0 or negative points
      results.push({
        score: vowels[char as keyof typeof vowels],
        type: "vowel",
        description: `Vowel "${char}"`,
        position: i,
      });
    } else if (char in consonants) {
      // Include all consonants, even those with 0 or negative points
      results.push({
        score: consonants[char as keyof typeof consonants],
        type: "consonant",
        description: `Consonant "${char}"`,
        position: i,
      });
    }
  }

  return results;
}

function checkConsecutiveVowels(name: string): ReturnType {
  const results: ReturnType = [];
  for (let i = 0; i < name.length - 1; i++) {
    const current = name[i];
    const next = name[i + 1];
    if (current in vowels && next in vowels) {
      const points =
        vowels[current as keyof typeof vowels] *
        vowels[next as keyof typeof vowels];
      results.push({
        score: points,
        type: "vowel",
        description: `Consecutive vowels "${current}${next}"`,
        position: i,
      });
    }
  }
  return results;
}

function checkConsecutiveConsonants(name: string): ReturnType {
  const results: ReturnType = [];
  for (let i = 0; i < name.length - 1; i++) {
    const current = name[i];
    const next = name[i + 1];
    if (current in consonants && next in consonants) {
      const points =
        consonants[current as keyof typeof consonants] *
        consonants[next as keyof typeof consonants];
      results.push({
        score: points,
        type: "consonant",
        description: `Consecutive consonants "${current}${next}"`,
        position: i,
      });
    }
  }
  return results;
}

function checkCombinations(name: string): ReturnType {
  const results: ReturnType = [];
  Object.entries(combinations).forEach(([combination, points]) => {
    const regex = new RegExp(combination, "g");
    let match;
    while ((match = regex.exec(name)) !== null) {
      results.push({
        score: points,
        type: "combination",
        description: `Combination "${combination}"`,
        position: match.index,
      });
      // Reset regex lastIndex to find overlapping matches
      if (combination.length === 1) regex.lastIndex = match.index + 1;
    }
  });
  return results;
}

function checkConsecutiveCombinations(name: string): ReturnType {
  const results: ReturnType = [];

  for (let i = 0; i < consecutiveCombinations.length; i++) {
    for (let j = i + 1; j < consecutiveCombinations.length; j++) {
      const combo1 = consecutiveCombinations[i];
      const combo2 = consecutiveCombinations[j];
      const pattern1 = combo1 + combo2;
      const pattern2 = combo2 + combo1;

      [pattern1, pattern2].forEach((pattern) => {
        const index = name.indexOf(pattern);
        if (index !== -1) {
          results.push({
            score:
              combinations[combo1 as keyof typeof combinations] *
              combinations[combo2 as keyof typeof combinations],
            type: "consecutiveCombination",
            description: `Pairwise consecutive combinations "${combo1}" + "${combo2}"`,
            position: index,
          });
        }
      });
    }
  }

  return results;
}

function checkStartLetters(name: string): ReturnType {
  const results: ReturnType = [];
  const firstLetter = name[0];
  if (firstLetter in startLetters) {
    results.push({
      score: startLetters[firstLetter as keyof typeof startLetters],
      type: "startLetter",
      description: `Name starts with "${firstLetter}"`,
      position: 0,
    });
  }
  return results;
}

export function nomLover(name: string): { score: number; details: ReturnType } {
  const lowerName = name.toLowerCase();

  const allResults: ReturnType = [];

  const letterPoints = checkLetterPoints(lowerName);
  allResults.push(...letterPoints);

  const vowelResult = checkConsecutiveVowels(lowerName);
  allResults.push(...vowelResult);

  const consonantResult = checkConsecutiveConsonants(lowerName);
  allResults.push(...consonantResult);

  const combinationResult = checkCombinations(lowerName);
  allResults.push(...combinationResult);

  const consecutiveResult = checkConsecutiveCombinations(lowerName);
  allResults.push(...consecutiveResult);

  const startLetterResult = checkStartLetters(lowerName);
  allResults.push(...startLetterResult);

  // Sort all results by score in descending order
  const sortedResults = allResults.sort((a, b) => b.score - a.score);

  // Calculate total score
  const totalScore = sortedResults.reduce(
    (sum, result) => sum + result.score,
    0
  );

  return {
    score: totalScore,
    details: sortedResults.filter((result) => result.score !== 0),
  };
}
