// Using for-loop
var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Using Sum of an Arithmetic Series
var sum_to_n_b = function(n) {
    return n * (n + 1) / 2;
};

// Using recursion
var sum_to_n_c = function(n) {
    if (n === 1) {
        return 1;
    }
    return n + sum_to_n_c(n - 1);
};

// Test cases to verify the implementations
console.log(sum_to_n_a(5)); // Output: 15
console.log(sum_to_n_b(5)); // Output: 15
console.log(sum_to_n_c(5)); // Output: 15
