const allowedMinValue = 1;
const allowedMaxValue = 300;
const countMin = 5;
const countMax = 1000;
const serializedNumberOfBits = 7; // bits per a symbol of ASCII (total 128 symbols)
const maxLengthOfAllowedMaxValueInBinaryForm = allowedMaxValue.toString(2).length;
const maxLengthOfPrefixInBinaryForm = maxLengthOfAllowedMaxValueInBinaryForm.toString(2).length;

function serialize(arrOfIntegers) {
  if (!(arrOfIntegers instanceof Array)
    || !arrOfIntegers?.length
  ) {

    const errorMessage = [
      `Serialization failed.`,
      `The provided value should be an array of numbers`
    ].join(' ');

    throw new Error(errorMessage);
  }

  let maxLengthOfBitsInIntegerValueInBinaryForm = 1;
  const arrayOfBinaries = arrOfIntegers.map(item => {
    if (typeof item !== 'number'
      || !Number.isInteger(item)
      || item < 1
    ) {

      const errorMessage = [
        `Serialization failed.`,
        `The provided array should contain only positive integer numbers`,
        `value "${item}" was found`
      ].join(' ');
      throw new Error(errorMessage);
    }

    const valueInBinaryForm = item.toString(2);
    if (valueInBinaryForm.length > maxLengthOfBitsInIntegerValueInBinaryForm) {
      maxLengthOfBitsInIntegerValueInBinaryForm = valueInBinaryForm.length;
    }

    return valueInBinaryForm;
  });

  const maxLengthOfBitsPrefix = maxLengthOfBitsInIntegerValueInBinaryForm.toString(2).padStart(maxLengthOfPrefixInBinaryForm, '0');
  let binaryStringWithMaxLengthOfBitsPrefix = maxLengthOfBitsPrefix;
  
  arrayOfBinaries.forEach(binaryValueAsString => {
    binaryStringWithMaxLengthOfBitsPrefix += binaryValueAsString.padStart(maxLengthOfBitsInIntegerValueInBinaryForm, '0');
  });

  let result = '';
  let i = 0;
  while (i < binaryStringWithMaxLengthOfBitsPrefix.length) {
    let part = '';
    let j = 0;
    while (j < serializedNumberOfBits) {
      const bitValue = binaryStringWithMaxLengthOfBitsPrefix[i + j];

      if (bitValue !== undefined) {
        part += bitValue;
        j++;
      } else {
        part = part.padEnd(serializedNumberOfBits, '0');
        break;
      }
    }

    const charCode = Number.parseInt(part, 2);
    const char = String.fromCharCode(charCode);
    result += char;
    i += j;
  }

  return result;
}

function deserialize(stringOfChars) {
  if (typeof stringOfChars !== 'string'
    || !stringOfChars?.length
    || !stringOfChars?.[0]
  ) {

    const errorMessage = [
      `Deserialization failed.`,
      `The provided serialized string is empty`
    ].join(' ');

    throw new Error(errorMessage);
  }

  let binaryString = '';
  for (let i = 0; i < stringOfChars.length; i++) {
    const char = stringOfChars[i].charCodeAt(0).toString(2).padStart(serializedNumberOfBits, '0');
    binaryString += char;
  }

  const maxLengthOfBitsInBinaryForm = binaryString.substring(0, maxLengthOfPrefixInBinaryForm);
  const maxLengthOfBitsInInteger = Number.parseInt(maxLengthOfBitsInBinaryForm, 2);
  const binaryStringWithoutPrefix = binaryString.substring(maxLengthOfPrefixInBinaryForm);

  const restoredArrayOfValues = [];
  let i = 0;
  while (i < binaryStringWithoutPrefix.length) {
    let part = '';
    let j = 0;
    while (j < maxLengthOfBitsInInteger) {
      const bitValue = binaryStringWithoutPrefix[i + j];

      if (bitValue !== undefined) {
        part += bitValue;
        j++;
      } else {
        break;
      }
    }

    const restoredValue = Number.parseInt(part, 2);
    if (restoredValue > 0) {
      restoredArrayOfValues.push(restoredValue);
    }

    i += j;
  }

  return restoredArrayOfValues;
}

// ----------------------------------------------------------------------------
// test-utils
// ----------------------------------------------------------------------------
//
function getRandomIntegerInRange(startIncluded, endIncluded) {
  const range = Math.abs((endIncluded + 1) - startIncluded);
  return Math.trunc(Math.random() * range) + startIncluded;
}

// test-utils: test of function getRandomIntegerInRange
function testGetRandomIntegerInRange(log = false) {
  const values = new Array(10_000).fill(0).map(_ => getRandomIntegerInRange(0, 10));
  const minValue = Math.min.apply(undefined, values);
  const maxValue = Math.max.apply(undefined, values);
  const isLimitMinCorrect = minValue === 0;
  const isLimitMaxCorrect = maxValue === 10;
  console.log('test-utils: test of function getRandomIntegerInRange:', (isLimitMinCorrect && isLimitMaxCorrect) ? 'passed' : 'failed');
  log && console.log({
    minValue,
    maxValue,
    values,
  });
}

function isOutsideOfRange(value, min, max) {
  return (value < min) || (value > max);
}

function areAllNumbersInRange(arrOfIntegers, min, max) {
  if (arrOfIntegers.filter(v => isOutsideOfRange(v, min, max)).length > 0) {
    const errorMessage = [
      `ERROR!`,
      `Serialization impossible!`,
      `Every number in array should be`,
      `greater or equal ${allowedMinValue}`,
      `and be less or equal ${allowedMaxValue}.`,
      `Number ${arrOfIntegers.find(v => isOutsideOfRange(v, min, max))} was found in the array`,
    ].join(' ');
    console.log('');
    console.error(errorMessage);
    return false;
  }
  return true;
}

function areArraysEqual(a, b) {
  if (!(a instanceof Array)
    || !(b instanceof Array)) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  return a.every((_, i) => a[i] === b[i]);
}

function prepareInfo(source, simple, ascii) {
  return {
    ratio: simple.length / ascii.length,
    source,
    simple,
    ascii,
  };
}

function getSerializationRunInfo(sourceArray, log = false) {
  const sourceArrayAsString = sourceArray.toString();
  if (!areAllNumbersInRange(sourceArray, allowedMinValue, allowedMaxValue)) {
    return undefined;
  }
  const serializedString = serialize(sourceArray);
  const deserializedValue = deserialize(serializedString);
  const isCorrectDeserializedData = areArraysEqual(deserializedValue, sourceArray);
  if (!isCorrectDeserializedData) {
    console.log('');
    console.error('ERROR! Decode. incorrect data', {
      expected: sourceArray.toString(),
      provided: deserializedValue.toString(),
      serializedString,
    });
    return undefined;
  }
  const info = prepareInfo(sourceArray, sourceArrayAsString, serializedString);
  const infos = [info];
  log && printStatistics('', infos);
  return info;
}

function getAverageValue(values) {
  let ratioSum = values.reduce((prev, curr) => prev + curr, 0);
  return ratioSum / values.length;
}

function getMedianValue(values) {
  const sortedValues = new Array().concat(values).sort((a, b) => a - b);
  const length = sortedValues.length;
  if ((length % 2) === 1) {
    const middleIndex = Math.floor(length / 2);
    return sortedValues[middleIndex];
  }
  const middleIndex = length / 2;
  return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2.0;
}

function printStatistics(testName, runs, log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
  const existingRunsInfos = runs.filter(v => !!v);
  if (!existingRunsInfos?.length || !existingRunsInfos?.[0]) {
    console.log('');
    console.log(`Warning! "${testName}" has no the run info`);
    return;
  }
  if (runs.length > 1) {
    let exampleWithMinRatio = existingRunsInfos[0];
    let exampleWithMaxRatio = existingRunsInfos[0];
    existingRunsInfos.forEach(runInfo => {
      if (runInfo.ratio < exampleWithMinRatio.ratio) {
        exampleWithMinRatio = runInfo;
      }
      if (runInfo.ratio > exampleWithMaxRatio.ratio) {
        exampleWithMaxRatio = runInfo;
      }
    });
    const ratioValues = existingRunsInfos.map(v => v.ratio);
    const avgRatio = getAverageValue(ratioValues);
    const medianRatio = getMedianValue(ratioValues);
    const report = {
      test: testName,
      minRatio: exampleWithMinRatio.ratio,
      maxRatio: exampleWithMaxRatio.ratio,
      avgRatio,
      medianRatio,
    };
    if (printRatioInfoDetails
      || (exampleWithMinRatio.ratio < printRatioInfoDetailsWhenRatioLessThan)) {
      const { simple: minRatioSimple, ascii: minRatioAscii } = exampleWithMinRatio;
      const { simple: maxRatioSimple, ascii: maxRatioAscii } = exampleWithMaxRatio;
      report.minRatioInfo = {
        simple: minRatioSimple,
        ascii: minRatioAscii,
      };
      report.maxRatioInfo = {
        simple: maxRatioSimple,
        ascii: maxRatioAscii,
      };
    }
    console.log(report);
  } else {
    const runInfo = existingRunsInfos[0];
    const report = {
      test: testName,
      ratio: runInfo.ratio,
    };
    if (printRatioInfoDetails
      || (runInfo.ratio < printRatioInfoDetailsWhenRatioLessThan)) {
      const { simple, ascii } = runInfo;
      report.details = {
        simple,
        ascii,
      };
    }
    console.log(report);
  }
  log && console.log({
    runs
  });
}

function runTestSuit(suit, params) {
  const runsInfos = [];
  for (const functionName of Object.keys(suit)) {
    const fn = (suit)[functionName];
    if (typeof fn === 'function') {
      const runInfo = fn.apply(undefined, params);
      runsInfos.push(runInfo);
    }
  }
  return runsInfos;
}

function runWithNRandomNumbersInRange(minValue = 0, maxValue = 10, countMin = 1, countMax = 10, log = false, countOfRuns = 1) {
  const runs = new Array(countOfRuns).fill(0);
  const infos = runs.map(_ => {
    const arrayLength = getRandomIntegerInRange(countMin, countMax);
    const arrayOfRandomIntegers = new Array(arrayLength).fill(0)
      .map(_ => getRandomIntegerInRange(minValue, maxValue));
    return getSerializationRunInfo(arrayOfRandomIntegers, false);
  });
  log && printStatistics('runWithNRandomNumbersInRange()', infos);
  return infos;
}

// @ts-ignore
function runUtilsTests(log = false) {
  console.log('');
  testGetRandomIntegerInRange(log);
}

// ========================================================
// verifications tests
//
function verificationAllPossibleValuesRepeatingWithMinimalAllowedCount(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
  const integers = new Array(allowedMaxValue).fill(0).map((_, i) => i + 1);
  const infos = integers.map(v => {
    const sourceArray = new Array(countMin).fill(v);
    const info = getSerializationRunInfo(sourceArray);
    return info;
  });
  log && printStatistics('verificationAllPossibleValuesRepeatingWithMinimalAllowedCount', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
  return infos;
}

function verificationAllPossibleValuesRepeatingWithMaximalAllowedCount(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
  const integers = new Array(allowedMaxValue).fill(0).map((_, i) => i + 1);
  const infos = integers.map(v => {
    const sourceArray = new Array(countMax).fill(v);
    const info = getSerializationRunInfo(sourceArray);
    return info;
  });
  log && printStatistics('verificationAllPossibleValuesRepeatingWithMaximalAllowedCount', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
  return infos;
}

function verificationRepeatingSingleDigit(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
  const sourceArray = new Array(1000).fill(9);
  const info = getSerializationRunInfo(sourceArray);
  const infos = [info];
  log && printStatistics('verificationRepeatingSingleDigit', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
  return [info];
}

function verificationRepeatingDoubleDigit(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
  const sourceArray = new Array(1000).fill(99);
  const info = getSerializationRunInfo(sourceArray);
  const infos = [info];
  log && printStatistics('verificationRepeatingDoubleDigit', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
  return infos;
}

function verificationRepeatingTripleDigits(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
  const sourceArray = new Array(1000).fill(300);
  const info = getSerializationRunInfo(sourceArray);
  const infos = [info];
  log && printStatistics('verificationRepeatingTripleDigits', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
  return infos;
}

// NOTE: long test
function verificationRandomValuesInRange10_000Runs(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
  const infos = runWithNRandomNumbersInRange(allowedMinValue, allowedMaxValue, countMin, countMax, false, 10_000);
  log && printStatistics('verificationRandomValuesInRange10_000Runs', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
  return infos;
}

// @ts-ignore
function runVerificationsTests(log = true, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
  console.log('');
  console.log('verifications test');
  verificationAllPossibleValuesRepeatingWithMinimalAllowedCount(log, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
  verificationAllPossibleValuesRepeatingWithMaximalAllowedCount(log, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
  verificationRepeatingSingleDigit(log, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
  verificationRepeatingDoubleDigit(log, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
  verificationRepeatingTripleDigits(log, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
  verificationRandomValuesInRange10_000Runs(log, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
}

// ========================================================
// tests
//
const tests = {
  simple: {
    testSimpleLongOfRepeatingNumber300(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = new Array(countMax).fill(300);
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics('suit simple: test long array of repeating number 300', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    testSimpleLongOfRepeatingNumber1(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = new Array(countMax).fill(1);
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics('suit simple: test long array of repeating number 1', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    testSimpleShortOfRepeatingNumber1(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = [1, 1, 1, 1, 1];
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics('suit simple: test short array of repeating number 1', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    testSimpleShort(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = [1, 300, 237, 188, 15];
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics('suit simple: test short array of numbers', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    // NOTE: this test should fail
    // testSimpleShortOfNumbersFromOutsideOfAllowedRange(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
    //   const sourceArray = [0, 0, 0, 0, 0]
    //   const info = getSerializationRunInfo(sourceArray)
    //   const infos = [info]
    //   log && printStatistics('suit simple: test short array of numbers from outside of allowed range (1, 300)', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan)
    //
    //   return infos
    // },
    testSimpleShortWithRatioLessThanRequiredThresholdValue_Variant1(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = [3, 74, 297, 47, 43, 90];
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics('suit simple: test short array of numbers with ratio less than 2.0 (1.889)', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    testSimpleShortWithRatioLessThanRequiredThresholdValue_Variant2(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = [117, 258, 57, 7, 15, 2];
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics('suit simple: test short array of numbers with ratio less than 2.0 (1.889)', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    testSimpleShortWithRatioLessThanRequiredThresholdValue_Variant3(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = [291, 7, 39, 108, 5, 46];
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics('suit simple: test short array of numbers with ratio less than 2.0 (1.889)', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    testSimpleShortWithRatioLessThanRequiredThresholdValue_Variant4(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = [5, 9, 174, 29, 50];
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics('suit simple: test short array of numbers with ratio less than 2.0 (1.857)', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    testSimpleShortWithRatioLessThanRequiredThresholdValue_Variant5(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = [300, 99, 2, 8, 1];
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics('suit simple: test short array of numbers with ratio less than 2.0 (1.714)', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    testSimpleShortWithRatioLessThanRequiredThresholdValue_Variant6(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = [1, 1, 1, 1, 99];
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics('suit simple: test short array of numbers with ratio less than 2.0 (1.667)', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    testSimpleShortWithRatioLessThanRequiredThresholdValue_Variant7(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = [1, 1, 1, 1, 300];
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics('suit simple: test short array of numbers with ratio less than 2.0 (1.571)', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
  },
  random: {
    test50RandomNumbers(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const infos = runWithNRandomNumbersInRange(allowedMinValue, allowedMaxValue, 50, 50, false, 1);
      log && printStatistics('suit random: test 50 random numbers', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    test100RandomNumbers(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const infos = runWithNRandomNumbersInRange(allowedMinValue, allowedMaxValue, 100, 100, false, 1);
      log && printStatistics('suit random: test 100 random numbers', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    test500RandomNumbers(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const infos = runWithNRandomNumbersInRange(allowedMinValue, allowedMaxValue, 500, 500, false, 1);
      log && printStatistics('suit random: test 500 random numbers', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    test1000RandomNumbers(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const infos = runWithNRandomNumbersInRange(allowedMinValue, allowedMaxValue, 1000, 1000, false, 1);
      log && printStatistics('suit random: test 1000 random numbers', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    }
  },
  edges: {
    testOneDigit(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = new Array(9).fill(0).map((_, i) => i + 1);
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics('suit edges: all numbers with one digit', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    testTwoDigits(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = new Array(100 - 10).fill(0).map((_, i) => i + 10);
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics('suit edges: all numbers with two digits', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    },
    testThreeDigits(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = new Array(allowedMaxValue - (100 - 1)).fill(0).map((_, i) => i + 100);
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics('suit edges: all numbers with three digits', infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    }
  },
  repeating: {
    tripledNumbers(log = false, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
      const sourceArray = new Array(allowedMaxValue * 3).fill(0);
      for (let i = 0; i < allowedMaxValue; i++) {
        const j = i * 3;
        const value = i + allowedMinValue;
        sourceArray[j] = value;
        sourceArray[j + 1] = value;
        sourceArray[j + 2] = value;
      }
      const info = getSerializationRunInfo(sourceArray);
      const infos = [info];
      log && printStatistics(`suit repeating: all allowed numbers (min: ${allowedMinValue}, max: ${allowedMaxValue}) every of those repeats three times`, infos, false, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan);
      return infos;
    }
  }
};

function runTests(log = true, printRatioInfoDetails = false, printRatioInfoDetailsWhenRatioLessThan = 1) {
  console.log('');
  console.log('tests');
  console.log('');
  console.log('suit: simple');
  const simpleRunsInfos = runTestSuit(tests.simple, [log, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan]);
  console.log('');
  console.log('suit: random');
  const randomRunsInfos = runTestSuit(tests.random, [log, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan]);
  console.log('');
  console.log('suit: edge cases');
  const edgesRunsInfos = runTestSuit(tests.edges, [log, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan]);
  console.log('');
  console.log('suit: repeated numbers');
  const repeatingRunsInfos = runTestSuit(tests.repeating, [log, printRatioInfoDetails, printRatioInfoDetailsWhenRatioLessThan]);
  console.log('');
  printStatistics('total statistics of the executed runs of the tests', (new Array()).concat(simpleRunsInfos.flat(), randomRunsInfos.flat(), edgesRunsInfos.flat(), repeatingRunsInfos.flat()));
}

function main() {
  // const requiredRatioThreshold = 2.0
  //
  // NOTE: additional tests
  // runUtilsTests()
  // runVerificationsTests(true, false, requiredRatioThreshold)
  //
  // runTests(true, false) // NOTE: does NOT print source string and serialized string
  runTests(true, true); // NOTE: prints source string and serialized string ***
  // runTests(true, false, requiredRatioThreshold) // NOTE: prints source string and serialized string ONLY if compression ratio less than value of requiredRatioThreshold
}

main();
