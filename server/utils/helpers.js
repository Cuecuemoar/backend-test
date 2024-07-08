export const sumCosts = (responseBody) => {
    return responseBody.reduce((prev, curr) => {
        return prev + parseFloat(curr.total_cost);
    }, 0);
};

export const calculateDiscrepancy = (sum1, sum2) => {
    return Math.abs(1 - (sum1 / sum2));
};