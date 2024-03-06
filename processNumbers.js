const fs = require('fs');

function calculateMinandMax(num, minValue, maxValue) {
    if (num < minValue) {
        minValue = num;
    }
    if (num > maxValue) {
        maxValue = num;
    }
    return { minValue, maxValue };
};

function calculateMean(sum, numbersCount) {
    const mean = sum / numbersCount;
    return mean;
};

function calculateMedian(allNumbers) {
    const sortedNumbers = allNumbers.sort((a, b) => a - b);
    const middle = Math.floor(sortedNumbers.length / 2);
    const median = sortedNumbers.length % 2 === 0
        ? (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2
        : sortedNumbers[middle];
    return median;
};

function calculateIncreasingSequence(num, currentIncreasingSeq, increasingSequence) {
    if (num > currentIncreasingSeq[currentIncreasingSeq.length - 1]) {
        currentIncreasingSeq.push(num);
    } else {
        currentIncreasingSeq = [num];
    }

    if (currentIncreasingSeq.length > increasingSequence.length) {
        increasingSequence = [...currentIncreasingSeq];
    }
    
    return { currentSequence: currentIncreasingSeq, longestIncreasingSequence: increasingSequence };
};

function calculateDecreasingSequence(num, currentDecreasingSeq, decreasingSequence) {
    if (num < currentDecreasingSeq[currentDecreasingSeq.length - 1]) {
        currentDecreasingSeq.push(num);
    } else {
        currentDecreasingSeq = [num];
    }

    if (currentDecreasingSeq.length > decreasingSequence.length) {
        decreasingSequence = [...currentDecreasingSeq];
    }

    return { currentSequence: currentDecreasingSeq, longestDecreasingSequence: decreasingSequence };
};

async function processFile(filePath) {
    try {
        const fileData = fs.createReadStream(filePath, 'utf-8');

        let sum = 0;
        let numbersCount = 0;

        let minValue = Infinity;
        let maxValue = -Infinity;
        
        let increasingSequence = [];
        let decreasingSequence = [];

        let currentIncreasingSeq = [];
        let currentDecreasingSeq = [];

        fileData.on('data', (chunk) => {
            const partialData = chunk.split('\n').map(Number).filter(num => !isNaN(num));
            if (partialData.length > 0) {
                for (const num of partialData) {
                
                    //Update minimun and maximum values
                    ({ minValue, maxValue } = calculateMinandMax(num, minValue, maxValue));

                    //Update values for calculation of Arithmetic mean
                    numbersCount++;
                    sum += num;

                    // Update longest increasing sequence
                    const { currentSequence: updatedIncreasingSeq, longestIncreasingSequence: updatedIncreasingLongest } = calculateIncreasingSequence(num, currentIncreasingSeq, increasingSequence);
                    currentIncreasingSeq = updatedIncreasingSeq;
                    increasingSequence = updatedIncreasingLongest;

                    // Update longest decreasing sequence
                    const { currentSequence: updatedDecreasingSeq, longestDecreasingSequence: updatedDecreasingLongest } = calculateDecreasingSequence(num, currentDecreasingSeq, decreasingSequence);
                    currentDecreasingSeq = updatedDecreasingSeq;
                    decreasingSequence = updatedDecreasingLongest;
                }
            }
        });

        fileData.on('end', () => {
            if (numbersCount === 0) {
                console.log('No valid numbers found in the file.');
                return;
            }

            const allNumbers = [...increasingSequence, ...decreasingSequence];
            const median =calculateMedian(allNumbers);
            const mean = calculateMean(sum, numbersCount);

            console.log('Min:', minValue);
            console.log('Max:', maxValue);
            console.log('Median:', median);
            console.log('Arithmetic Mean:', mean);
            console.log('Longest Increasing Sequence:', increasingSequence);
            console.log('Longest Decreasing Sequence:', decreasingSequence);

            process.stdin.resume();
        });

    } catch (error) {
        console.error('Error processing file:', error);
    }
};

module.exports = { processFile };