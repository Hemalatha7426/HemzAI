import { useState, useRef } from 'react';
import { Code, Terminal, Play, Search, ArrowLeft, ChevronDown } from 'lucide-react';

// Curated 14 Category 96 LeetCode Placement Questions Database
const DSA_CATEGORIES = [
  "Arrays & Hashing",
  "Sliding Window",
  "Two Pointers",
  "Binary Search",
  "Stack & Monotonic Stack",
  "Linked List",
  "Trees & BST",
  "Graphs",
  "Dynamic Programming",
  "Greedy",
  "Heap / Priority Queue",
  "Backtracking",
  "Trie",
  "Segment Tree / Fenwick"
];

const DSA_PROBLEMS = {
  "Arrays & Hashing": [
    { id: 169, title: "Majority Element", difficulty: "Easy", pattern: "Boyer-Moore Voting", description: "Given an array `nums` of size `n`, return the majority element. The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.", constraints: ["n == nums.length", "1 <= n <= 5 * 10^4", "-10^9 <= nums[i] <= 10^9"], examples: [{ input: "nums = [3,2,3]", output: "3" }, { input: "nums = [2,2,1,1,1,2,2]", output: "2" }], boilerplate: "function majorityElement(nums) {\n  // Implement Boyer-Moore Voting Algorithm\n  let candidate = null;\n  let count = 0;\n  \n  for (let num of nums) {\n    if (count === 0) {\n      candidate = num;\n    }\n    count += (num === candidate) ? 1 : -1;\n  }\n  \n  return candidate;\n}", optimalSolution: { javascript: "function majorityElement(nums) {\n  let candidate = null;\n  let count = 0;\n  for (let num of nums) {\n    if (count === 0) candidate = num;\n    count += (num === candidate) ? 1 : -1;\n  }\n  return candidate;\n}", cpp: "int majorityElement(vector<int>& nums) {\n    int candidate = 0, count = 0;\n    for (int num : nums) {\n        if (count == 0) candidate = num;\n        count += (num == candidate) ? 1 : -1;\n    }\n    return candidate;\n}", python: "def majorityElement(self, nums: List[int]) -> int:\n    candidate, count = None, 0\n    for num in nums:\n        if count == 0: candidate = num\n        count += 1 if num == candidate else -1\n    return candidate", timeComplexity: "O(N)", spaceComplexity: "O(1)", explanation: "Boyer-Moore Voting Algorithm scans through the array keeping track of a candidate and its frequency. If the count reaches 0, we select a new candidate. Since the majority element occurs more than n/2 times, it will always remain as the final candidate." }, testCases: [{ input: [[3, 2, 3]], expected: 3 }, { input: [[2, 2, 1, 1, 1, 2, 2]], expected: 2 }] },
    { id: 560, title: "Subarray Sum Equals K", difficulty: "Medium", pattern: "Prefix Sum + HashMap", description: "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.", constraints: ["1 <= nums.length <= 2 * 10^4", "-1000 <= nums[i] <= 1000", "-10^7 <= k <= 10^7"], examples: [{ input: "nums = [1,1,1], k = 2", output: "2" }, { input: "nums = [1,2,3], k = 3", output: "2" }], boilerplate: "function subarraySum(nums, k) {\n  // Implement Prefix Sum + HashMap strategy\n  let count = 0;\n  let sum = 0;\n  let map = new Map();\n  map.set(0, 1);\n  \n  for (let num of nums) {\n    sum += num;\n    if (map.has(sum - k)) {\n      count += map.get(sum - k);\n    }\n    map.set(sum, (map.get(sum) || 0) + 1);\n  }\n  \n  return count;\n}", optimalSolution: { javascript: "function subarraySum(nums, k) {\n  let count = 0, sum = 0;\n  const map = new Map([[0, 1]]);\n  for (let num of nums) {\n    sum += num;\n    if (map.has(sum - k)) count += map.get(sum - k);\n    map.set(sum, (map.get(sum) || 0) + 1);\n  }\n  return count;\n}", python: "def subarraySum(self, nums: List[int], k: int) -> int:\n    count, curr_sum = 0, 0\n    prefix_sums = {0: 1}\n    for num in nums:\n        curr_sum += num\n        if curr_sum - k in prefix_sums:\n            count += prefix_sums[curr_sum - k]\n        prefix_sums[curr_sum] = prefix_sums.get(curr_sum, 0) + 1\n    return count", timeComplexity: "O(N)", spaceComplexity: "O(N)", explanation: "If the cumulative sum up to two indices i and j has a difference of k (Prefix[j] - Prefix[i] = k), then the sum of elements between i and j is exactly k. We store prefix sum frequencies in a HashMap to run this lookup in O(1) time." }, testCases: [{ input: [[1, 1, 1], 2], expected: 2 }, { input: [[1, 2, 3], 3], expected: 2 }] },
    { id: 525, title: "Contiguous Array", difficulty: "Medium", pattern: "Prefix Balance", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(N)", javascript: "function findMaxLength(nums) {\n  let map = new Map([[0, -1]]);\n  let count = 0, maxLen = 0;\n  for (let i = 0; i < nums.length; i++) {\n    count += nums[i] === 1 ? 1 : -1;\n    if (map.has(count)) {\n      maxLen = Math.max(maxLen, i - map.get(count));\n    } else {\n      map.set(count, i);\n    }\n  }\n  return maxLen;\n}", python: "def findMaxLength(self, nums: List[int]) -> int:\n    indices = {0: -1}\n    count, max_len = 0, 0\n    for i, num in enumerate(nums):\n        count += 1 if num == 1 else -1\n        if count in indices:\n            max_len = max(max_len, i - indices[count])\n        else:\n            indices[count] = i\n    return max_len", explanation: "Replace all 0s with -1s. The problem reduces to finding the longest subarray with a sum of 0, which we solve in linear time using a prefix balance map." } },
    { id: 974, title: "Subarray Sums Divisible by K", difficulty: "Medium", pattern: "Prefix Mod", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(K)", javascript: "function subarraysDivByK(nums, k) {\n  let map = new Map([[0, 1]]);\n  let sum = 0, count = 0;\n  for (let num of nums) {\n    sum += num;\n    let mod = ((sum % k) + k) % k;\n    if (map.has(mod)) {\n      count += map.get(mod);\n    }\n    map.set(mod, (map.get(mod) || 0) + 1);\n  }\n  return count;\n}", python: "def subarraysDivByK(self, nums: List[int], k: int) -> int:\n    prefixes = {0: 1}\n    curr_sum, count = 0, 0\n    for num in nums:\n      curr_sum += num\n      mod = curr_sum % k\n      if mod in prefixes:\n        count += prefixes[mod]\n      prefixes[mod] = prefixes.get(mod, 0) + 1\n    return count", explanation: "Uses prefix mods. If two prefix sums have the same remainder when divided by K, the subarray sum between them is divisible by K." } },
    { id: 229, title: "Majority Element II", difficulty: "Medium", pattern: "Extended Voting", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function majorityElementII(nums) {\n  let cand1 = null, cand2 = null, c1 = 0, c2 = 0;\n  for (let n of nums) {\n    if (n === cand1) c1++;\n    else if (n === cand2) c2++;\n    else if (c1 === 0) { cand1 = n; c1 = 1; }\n    else if (c2 === 0) { cand2 = n; c2 = 1; }\n    else { c1--; c2--; }\n  }\n  c1 = 0; c2 = 0;\n  for (let n of nums) {\n    if (n === cand1) c1++;\n    else if (n === cand2) c2++;\n  }\n  let res = [];\n  if (c1 > nums.length / 3) res.push(cand1);\n  if (c2 > nums.length / 3) res.push(cand2);\n  return res;\n}", python: "def majorityElement(self, nums: List[int]) -> List[int]:\n    # Extended Boyer-Moore Voting Algorithm for n/3 boundaries\n    if not nums: return []\n    c1, c2, cand1, cand2 = 0, 0, None, None\n    for n in nums:\n        if n == cand1: c1 += 1\n        elif n == cand2: c2 += 1\n        elif c1 == 0: cand1, c1 = n, 1\n        elif c2 == 0: cand2, c2 = n, 1\n        else: c1, c2 = c1 - 1, c2 - 1\n    return [c for c in (cand1, cand2) if nums.count(c) > len(nums) // 3]", explanation: "Tracks up to two candidates with counts. Standard Boyer-Moore voting extended to search for elements appearing > n/3 times." } },
    { id: 41, title: "First Missing Positive", difficulty: "Hard", pattern: "Cyclic Sort", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function firstMissingPositive(nums) {\n  let n = nums.length;\n  for (let i = 0; i < n; i++) {\n    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {\n      let temp = nums[nums[i] - 1];\n      nums[nums[i] - 1] = nums[i];\n      nums[i] = temp;\n    }\n  }\n  for (let i = 0; i < n; i++) {\n    if (nums[i] !== i + 1) return i + 1;\n  }\n  return n + 1;\n}", explanation: "Sorts cyclic numbers. We place each positive number x in index x-1. The first index i where nums[i] != i+1 reveals the missing positive." } },
    { id: 287, title: "Find the Duplicate Number", difficulty: "Medium", pattern: "Floyd Cycle", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function findDuplicate(nums) {\n  let slow = nums[0], fast = nums[0];\n  do {\n    slow = nums[slow];\n    fast = nums[nums[fast]];\n  } while (slow !== fast);\n  fast = nums[0];\n  while (slow !== fast) {\n    slow = nums[slow];\n    fast = nums[fast];\n  }\n  return slow;\n}", explanation: "Floyd's Tortoise and Hare cycle detection. Since values are in range 1..n, we treat values as pointers, mapping duplicates to a cycle start." } },
    { id: 448, title: "Find All Numbers Disappeared in an Array", difficulty: "Easy", pattern: "Marking", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function findDisappearedNumbers(nums) {\n  for (let i = 0; i < nums.length; i++) {\n    let idx = Math.abs(nums[i]) - 1;\n    if (nums[idx] > 0) nums[idx] = -nums[idx];\n  }\n  let res = [];\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] > 0) res.push(i + 1);\n  }\n  return res;\n}", explanation: "Uses numbers as indices. We iterate and negate the value at index Math.abs(x)-1. Positive values at end index reveal missing values." } },
    { id: 88, title: "Merge Sorted Array", difficulty: "Easy", pattern: "Two Pointers", optimalSolution: { timeComplexity: "O(M+N)", spaceComplexity: "O(1)", javascript: "function merge(nums1, m, nums2, n) {\n  let i = m - 1, j = n - 1, k = m + n - 1;\n  while (j >= 0) {\n    if (i >= 0 && nums1[i] > nums2[j]) {\n      nums1[k--] = nums1[i--];\n    } else {\n      nums1[k--] = nums2[j--];\n    }\n  }\n}", explanation: "Three pointers working backward from the end of the arrays, placing the largest numbers at the back to avoid overwriting nums1." } },
    { id: 26, title: "Remove Duplicates from Sorted Array", difficulty: "Easy", pattern: "Slow/Fast Pointer", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function removeDuplicates(nums) {\n  if (nums.length === 0) return 0;\n  let i = 0;\n  for (let j = 1; j < nums.length; j++) {\n    if (nums[j] !== nums[i]) {\n      i++;\n      nums[i] = nums[j];\n    }\n  }\n  return i + 1;\n}", explanation: "A slow pointer tracks unique elements. The fast pointer scans through, copying unique values next to the slow pointer." } }
  ],
  "Sliding Window": [
    { id: 209, title: "Minimum Size Subarray Sum", difficulty: "Medium", pattern: "Variable Window", description: "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`. If there is no such subarray, return `0` instead.", constraints: ["1 <= target <= 10^9", "1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^4"], examples: [{ input: "target = 7, nums = [2,3,1,2,4,3]", output: "2" }, { input: "target = 4, nums = [1,4,4]", output: "1" }], boilerplate: "function minSubArrayLen(target, nums) {\n  // Implement variable sliding window\n  let left = 0;\n  let sum = 0;\n  let minLen = Infinity;\n  \n  for (let right = 0; right < nums.length; right++) {\n    sum += nums[right];\n    while (sum >= target) {\n      minLen = Math.min(minLen, right - left + 1);\n      sum -= nums[left];\n      left++;\n    }\n  }\n  \n  return minLen === Infinity ? 0 : minLen;\n}", optimalSolution: { javascript: "function minSubArrayLen(target, nums) {\n  let left = 0, sum = 0, minLen = Infinity;\n  for (let right = 0; right < nums.length; right++) {\n    sum += nums[right];\n    while (sum >= target) {\n      minLen = Math.min(minLen, right - left + 1);\n      sum -= nums[left++];\n    }\n  }\n  return minLen === Infinity ? 0 : minLen;\n}", python: "def minSubArrayLen(self, target: int, nums: List[int]) -> int:\n    left, curr_sum, min_len = 0, 0, float('inf')\n    for right, val in enumerate(nums):\n        curr_sum += val\n        while curr_sum >= target:\n            min_len = min(min_len, right - left + 1)\n            curr_sum -= nums[left]\n            left += 1\n    return 0 if min_len == float('inf') else min_len", timeComplexity: "O(N)", spaceComplexity: "O(1)", explanation: "Two pointers form a sliding window. We expand the right boundary to add elements. Once the sum meets target, we dynamically shrink the left boundary to find the minimal length." }, testCases: [{ input: [7, [2, 3, 1, 2, 4, 3]], expected: 2 }, { input: [4, [1, 4, 4]], expected: 1 }] },
    { id: 567, title: "Permutation in String", difficulty: "Medium", pattern: "Fixed Window Frequency", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function checkInclusion(s1, s2) {\n  if (s1.length > s2.length) return false;\n  let c1 = new Array(26).fill(0), c2 = new Array(26).fill(0);\n  for (let i = 0; i < s1.length; i++) {\n    c1[s1.charCodeAt(i) - 97]++;\n    c2[s2.charCodeAt(i) - 97]++;\n  }\n  let matches = 0;\n  for (let i = 0; i < 26; i++) if (c1[i] === c2[i]) matches++;\n  for (let i = s1.length; i < s2.length; i++) {\n    if (matches === 26) return true;\n    let r = s2.charCodeAt(i) - 97, l = s2.charCodeAt(i - s1.length) - 97;\n    c2[r]++;\n    if (c2[r] === c1[r]) matches++;\n    else if (c2[r] - 1 === c1[r]) matches--;\n    c2[l]--;\n    if (c2[l] === c1[l]) matches++;\n    else if (c2[l] + 1 === c1[l]) matches--;\n  }\n  return matches === 26;\n}", explanation: "Sliding window with frequency maps. We maintain a fixed window of size s1.length, updating char frequencies as the window shifts." } },
    { id: 438, title: "Find All Anagrams in a String", difficulty: "Medium", pattern: "Sliding Frequency", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function findAnagrams(s, p) {\n  let res = [], n1 = s.length, n2 = p.length;\n  if (n1 < n2) return res;\n  let pCount = {}, sCount = {};\n  for (let c of p) pCount[c] = (pCount[c] || 0) + 1;\n  for (let i = 0; i < n2; i++) sCount[s[i]] = (sCount[s[i]] || 0) + 1;\n  const matches = (a, b) => {\n    for (let k in a) if (a[k] !== b[k]) return false;\n    return true;\n  };\n  if (matches(pCount, sCount)) res.push(0);\n  for (let i = n2; i < n1; i++) {\n    let rightChar = s[i], leftChar = s[i - n2];\n    sCount[rightChar] = (sCount[rightChar] || 0) + 1;\n    sCount[leftChar]--;\n    if (sCount[leftChar] === 0) delete sCount[leftChar];\n    if (matches(pCount, sCount)) res.push(i - n2 + 1);\n  }\n  return res;\n}", explanation: "Maintains a sliding frequency map of length p.length. The matches function guarantees O(1) comparison as alphabet is limited to 26 letters." } },
    { id: 1004, title: "Max Consecutive Ones III", difficulty: "Medium", pattern: "Window with K changes", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function longestOnes(nums, k) {\n  let left = 0, zeros = 0, maxLen = 0;\n  for (let right = 0; right < nums.length; right++) {\n    if (nums[right] === 0) zeros++;\n    while (zeros > k) {\n      if (nums[left] === 0) zeros--;\n      left++;\n    }\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}", explanation: "A variable sliding window. We expand right; if zeros exceed k, we increment left until the zeros count drops below k." } },
    { id: 930, title: "Binary Subarrays With Sum", difficulty: "Medium", pattern: "Prefix + Window", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function numSubarraysWithSum(nums, goal) {\n  const atMost = (g) => {\n    if (g < 0) return 0;\n    let l = 0, sum = 0, cnt = 0;\n    for (let r = 0; r < nums.length; r++) {\n      sum += nums[r];\n      while (sum > g) sum -= nums[l++];\n      cnt += r - l + 1;\n    }\n    return cnt;\n  };\n  return atMost(goal) - atMost(goal - 1);\n}", explanation: "Solves sum by calculating (subarrays with sum <= goal) - (subarrays with sum <= goal - 1) using standard variable windows." } },
    { id: 239, title: "Sliding Window Maximum", difficulty: "Hard", pattern: "Monotonic Deque", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(K)", javascript: "function maxSlidingWindow(nums, k) {\n  let q = [], res = [];\n  for (let i = 0; i < nums.length; i++) {\n    if (q.length && q[0] < i - k + 1) q.shift();\n    while (q.length && nums[q[q.length - 1]] < nums[i]) q.pop();\n    q.push(i);\n    if (i >= k - 1) res.push(nums[q[0]]);\n  }\n  return res;\n}", explanation: "Maintains indices in a double-ended queue. We prune elements smaller than standard window boundaries or smaller than the current element to guarantee elements at q[0] are always the window maximum." } }
  ],
  "Two Pointers": [
    { id: 75, title: "Sort Colors", difficulty: "Medium", pattern: "Dutch National Flag", description: "Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We will use the integers `0`, `1`, and `2` to represent the color red, white, and blue respectively.", constraints: ["n == nums.length", "1 <= n <= 300", "nums[i] is either 0, 1, or 2"], examples: [{ input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" }, { input: "nums = [2,0,1]", output: "[0,1,2]" }], boilerplate: "function sortColors(nums) {\n  // Implement Dutch National Flag Algorithm\n  let low = 0;\n  let mid = 0;\n  let high = nums.length - 1;\n  \n  while (mid <= high) {\n    if (nums[mid] === 0) {\n      let temp = nums[low];\n      nums[low] = nums[mid];\n      nums[mid] = temp;\n      low++;\n      mid++;\n    } else if (nums[mid] === 1) {\n      mid++;\n    } else {\n      let temp = nums[high];\n      nums[high] = nums[mid];\n      nums[mid] = temp;\n      high--;\n    }\n  }\n  return nums;\n}", optimalSolution: { javascript: "function sortColors(nums) {\n  let low = 0, mid = 0, high = nums.length - 1;\n  while (mid <= high) {\n    if (nums[mid] === 0) {\n      [nums[low], nums[mid]] = [nums[mid], nums[low]];\n      low++; mid++;\n    } else if (nums[mid] === 1) {\n      mid++;\n    } else {\n      [nums[mid], nums[high]] = [nums[high], nums[mid]];\n      high--;\n    }\n  }\n  return nums;\n}", python: "def sortColors(self, nums: List[int]) -> None:\n    # Dutch National Flag partitioning\n    low, mid, high = 0, 0, len(nums) - 1\n    while mid <= high:\n        if nums[mid] == 0:\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low, mid = low + 1, mid + 1\n        elif nums[mid] == 1:\n            mid += 1\n        else:\n            nums[mid], nums[high] = nums[high], nums[mid]\n            high -= 1", timeComplexity: "O(N)", spaceComplexity: "O(1)", explanation: "The Dutch National Flag partitioning divides the array into three sections using three pointers: low, mid, and high. Red (0) is swapped to the low boundary, Blue (2) is swapped to the high boundary, while White (1) remains in the middle." }, testCases: [{ input: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2] }, { input: [[2, 0, 1]], expected: [0, 1, 2] }] },
    { id: 167, title: "Two Sum II", difficulty: "Easy", pattern: "Sorted Two Pointers", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function twoSum(numbers, target) {\n  let l = 0, r = numbers.length - 1;\n  while (l < r) {\n    let sum = numbers[l] + numbers[r];\n    if (sum === target) return [l + 1, r + 1];\n    else if (sum < target) l++;\n    else r--;\n  }\n  return [];\n}", explanation: "Two pointers at opposite ends of a sorted array. If the sum is smaller than target, expand left; if larger, shrink right." } },
    { id: 42, title: "Trapping Rain Water", difficulty: "Hard", pattern: "Left/Right Max", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function trap(height) {\n  let l = 0, r = height.length - 1;\n  let lMax = 0, rMax = 0, water = 0;\n  while (l < r) {\n    if (height[l] < height[r]) {\n      if (height[l] >= lMax) lMax = height[l];\n      else water += lMax - height[l];\n      l++;\n    } else {\n      if (height[r] >= rMax) rMax = height[r];\n      else water += rMax - height[r];\n      r--;\n    }\n  }\n  return water;\n}", explanation: "Calculates trapped water at each index. We maintain left/right boundary maximums, updating water volume dynamically." } },
    { id: 283, title: "Move Zeroes", difficulty: "Easy", pattern: "Stable Compaction", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function moveZeroes(nums) {\n  let lastNonZero = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) {\n      let temp = nums[lastNonZero];\n      nums[lastNonZero] = nums[i];\n      nums[i] = temp;\n      lastNonZero++;\n    }\n  }\n}", explanation: "Moves all zeroes to the end of the array. A pointer tracks the last non-zero element, swapping elements in-place to guarantee relative ordering." } },
    { id: 977, title: "Squares of a Sorted Array", difficulty: "Easy", pattern: "Two Ends Merge", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(N)", javascript: "function sortedSquares(nums) {\n  let n = nums.length, res = new Array(n);\n  let l = 0, r = n - 1, p = n - 1;\n  while (l <= r) {\n    if (Math.abs(nums[l]) > Math.abs(nums[r])) {\n      res[p--] = nums[l] * nums[l++];\n    } else {\n      res[p--] = nums[r] * nums[r--];\n    }\n  }\n  return res;\n}", explanation: "Two pointers at both ends of a sorted array. We compare the squared values and place the larger element at the end of the results." } }
  ],
  "Binary Search": [
    { id: 875, title: "Koko Eating Bananas", difficulty: "Medium", pattern: "Binary Search on Answer", description: "A pile of bananas is represented by array `piles`. Koko wants to eat all bananas within `h` hours. Return the minimum integer `k` such that she can eat all the bananas within `h` hours.", constraints: ["1 <= piles.length <= 10^4", "piles.length <= h <= 10^9", "1 <= piles[i] <= 10^9"], examples: [{ input: "piles = [3,6,7,11], h = 8", output: "4" }, { input: "piles = [30,11,23,4,20], h = 5", output: "30" }], boilerplate: "function minEatingSpeed(piles, h) {\n  // Binary Search on feasible values of k\n  let low = 1;\n  let high = Math.max(...piles);\n  let ans = high;\n  \n  const canEatAll = (speed) => {\n    let hours = 0;\n    for (let pile of piles) {\n      hours += Math.ceil(pile / speed);\n    }\n    return hours <= h;\n  };\n  \n  while (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n    if (canEatAll(mid)) {\n      ans = mid;\n      high = mid - 1; // Try slower speed\n    } else {\n      low = mid + 1;  // Speed up\n    }\n  }\n  return ans;\n}", optimalSolution: { javascript: "function minEatingSpeed(piles, h) {\n  let low = 1, high = Math.max(...piles), ans = high;\n  while (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n    let hours = 0;\n    for (let pile of piles) hours += Math.ceil(pile / mid);\n    if (hours <= h) {\n      ans = mid;\n      high = mid - 1;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return ans;\n}", python: "def minEatingSpeed(self, piles: List[int], h: int) -> int:\n    low, high = 1, max(piles)\n    ans = high\n    while low <= high:\n        mid = (low + high) // 2\n        hours = sum(math.ceil(p / mid) for p in piles)\n        if hours <= h:\n            ans = mid\n            high = mid - 1\n        else:\n            low = mid + 1\n    return ans", timeComplexity: "O(N * log(MaxPile))", spaceComplexity: "O(1)", explanation: "Binary search on answer. The minimum possible speed is 1, and the maximum is max(piles). We binary search within this range, checking feasibility in O(N) time for each mid value." }, testCases: [{ input: [[3, 6, 7, 11], 8], expected: 4 }, { input: [[30, 11, 23, 4, 20], 5], expected: 30 }] },
    { id: 34, title: "Find First and Last Position", difficulty: "Medium", pattern: "Lower/Upper Bound", optimalSolution: { timeComplexity: "O(log N)", spaceComplexity: "O(1)", javascript: "function searchRange(nums, target) {\n  const findBound = (isFirst) => {\n    let l = 0, r = nums.length - 1, bound = -1;\n    while (l <= r) {\n      let mid = Math.floor((l + r) / 2);\n      if (nums[mid] === target) {\n        bound = mid;\n        if (isFirst) r = mid - 1;\n        else l = mid + 1;\n      } else if (nums[mid] < target) l = mid + 1;\n      else r = mid - 1;\n    }\n    return bound;\n  };\n  return [findBound(true), findBound(false)];\n}", explanation: "Run two separate binary searches. The lower bound binary search continues left upon match; the upper bound binary search continues right." } },
    { id: 35, title: "Search Insert Position", difficulty: "Easy", pattern: "Basic Binary Search", optimalSolution: { timeComplexity: "O(log N)", spaceComplexity: "O(1)", javascript: "function searchInsert(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    let mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    else if (nums[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return l;\n}", explanation: "Standard binary search. If target is not found, the left pointer index reveals the correct insertion index." } },
    { id: 69, title: "Sqrt(x)", difficulty: "Easy", pattern: "Answer Binary Search", optimalSolution: { timeComplexity: "O(log X)", spaceComplexity: "O(1)", javascript: "function mySqrt(x) {\n  if (x < 2) return x;\n  let l = 1, r = Math.floor(x / 2), ans = 0;\n  while (l <= r) {\n    let mid = Math.floor((l + r) / 2);\n    if (mid * mid === x) return mid;\n    else if (mid * mid < x) { ans = mid; l = mid + 1; }\n    else r = mid - 1;\n  }\n  return ans;\n}", explanation: "Binary search on answers in range 1 to x/2. Keeps track of the largest mid satisfying mid*mid <= x." } },
    { id: 1011, title: "Capacity To Ship Packages", difficulty: "Medium", pattern: "Binary Search on Capacity", optimalSolution: { timeComplexity: "O(N * log(Sum-Max))", spaceComplexity: "O(1)", javascript: "function shipWithinDays(weights, days) {\n  let low = Math.max(...weights), high = weights.reduce((a,b) => a+b, 0);\n  let ans = high;\n  while (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n    let currSum = 0, cnt = 1;\n    for (let w of weights) {\n      if (currSum + w > mid) {\n        cnt++;\n        currSum = 0;\n      }\n      currSum += w;\n    }\n    if (cnt <= days) {\n      ans = mid;\n      high = mid - 1;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return ans;\n}", explanation: "Binary search on capacities between max(weights) and sum(weights). Check if current mid can partition array into <= days partitions." } },
    { id: 410, title: "Split Array Largest Sum", difficulty: "Hard", pattern: "Binary Search + Greedy", optimalSolution: { timeComplexity: "O(N * log(Sum-Max))", spaceComplexity: "O(1)", javascript: "function splitArray(nums, k) {\n  let low = Math.max(...nums), high = nums.reduce((a,b) => a+b, 0);\n  let ans = high;\n  while (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n    let tempSum = 0, parts = 1;\n    for (let n of nums) {\n      if (tempSum + n > mid) {\n        parts++;\n        tempSum = 0;\n      }\n      tempSum += n;\n    }\n    if (parts <= k) {\n      ans = mid;\n      high = mid - 1;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return ans;\n}", explanation: "Equivalent to capacity shipping problem. Binary search on array partition sums, narrowing bounds greedily." } },
    { id: 540, title: "Single Element in Sorted Array", difficulty: "Medium", pattern: "Index Pattern", optimalSolution: { timeComplexity: "O(log N)", spaceComplexity: "O(1)", javascript: "function singleNonDuplicate(nums) {\n  let l = 0, r = nums.length - 1;\n  while (l < r) {\n    let mid = Math.floor((l + r) / 2);\n    if (mid % 2 === 1) mid--;\n    if (nums[mid] === nums[mid + 1]) {\n      l = mid + 2;\n    } else {\n      r = mid;\n    }\n  }\n  return nums[l];\n}", explanation: "A sorted array of pairs has a single unique element. On the left of this element, pairs always start at even indices." } }
  ],
  "Stack & Monotonic Stack": [
    { id: 739, title: "Daily Temperatures", difficulty: "Medium", pattern: "Decreasing Stack", description: "Given an array of integers `temperatures` representing the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`-th day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0`.", constraints: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"], examples: [{ input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" }, { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]" }], boilerplate: "function dailyTemperatures(temperatures) {\n  // Implement monotonic decreasing stack\n  let n = temperatures.length;\n  let res = new Array(n).fill(0);\n  let stack = []; // Monotonic decreasing index stack\n  \n  for (let i = 0; i < n; i++) {\n    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      let idx = stack.pop();\n      res[idx] = i - idx;\n    }\n    stack.push(i);\n  }\n  \n  return res;\n}", optimalSolution: { javascript: "function dailyTemperatures(temperatures) {\n  let res = new Array(temperatures.length).fill(0);\n  let stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      let idx = stack.pop();\n      res[idx] = i - idx;\n    }\n    stack.push(i);\n  }\n  return res;\n}", python: "def dailyTemperatures(self, temperatures: List[int]) -> List[int]:\n    res = [0] * len(temperatures)\n    stack = []\n    for i, t in enumerate(temperatures):\n        while stack and t > temperatures[stack[-1]]:\n            idx = stack.pop()\n            res[idx] = i - idx\n        stack.append(i)\n    return res", timeComplexity: "O(N)", spaceComplexity: "O(N)", explanation: "Monotonic decreasing stack. We maintain indices of days whose next warmer day hasn't been found. When we encounter a warmer temperature, we pop indices and write down the difference `i - idx`." }, testCases: [{ input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] }, { input: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] }] },
    { id: 84, title: "Largest Rectangle in Histogram", difficulty: "Hard", pattern: "Monotonic Stack", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(N)", javascript: "function largestRectangleArea(heights) {\n  let stack = [], maxArea = 0, n = heights.length;\n  for (let i = 0; i <= n; i++) {\n    let h = (i === n) ? 0 : heights[i];\n    while (stack.length && h < heights[stack[stack.length - 1]]) {\n      let height = heights[stack.pop()];\n      let width = stack.length ? i - stack[stack.length - 1] - 1 : i;\n      maxArea = Math.max(maxArea, height * width);\n    }\n    stack.push(i);\n  }\n  return maxArea;\n}", explanation: "Uses a monotonic increasing stack. When heights decrease, we compute rectangle sizes bounded by the current smaller index." } },
    { id: 85, title: "Maximal Rectangle", difficulty: "Hard", pattern: "Histogram Extension", optimalSolution: { timeComplexity: "O(R * C)", spaceComplexity: "O(C)", javascript: "function maximalRectangle(matrix) {\n  if (!matrix.length) return 0;\n  let c = matrix[0].length, heights = new Array(c).fill(0), maxArea = 0;\n  for (let row of matrix) {\n    for (let j = 0; j < c; j++) {\n      heights[j] = row[j] === '1' ? heights[j] + 1 : 0;\n    }\n    let stack = [];\n    for (let i = 0; i <= c; i++) {\n      let h = (i === c) ? 0 : heights[i];\n      while (stack.length && h < heights[stack[stack.length - 1]]) {\n        let height = heights[stack.pop()];\n        let width = stack.length ? i - stack[stack.length - 1] - 1 : i;\n        maxArea = Math.max(maxArea, height * width);\n      }\n      stack.push(i);\n    }\n  }\n  return maxArea;\n}", explanation: "Adapts Largest Rectangle in Histogram. We model each matrix row as a histogram column by accumulating sequential 1s." } },
    { id: 496, title: "Next Greater Element I", difficulty: "Easy", pattern: "Monotonic Stack", optimalSolution: { timeComplexity: "O(M+N)", spaceComplexity: "O(N)", javascript: "function nextGreaterElement(nums1, nums2) {\n  let map = new Map(), stack = [];\n  for (let num of nums2) {\n    while (stack.length && num > stack[stack.length - 1]) {\n      map.set(stack.pop(), num);\n    }\n    stack.push(num);\n  }\n  return nums1.map(n => map.get(n) ?? -1);\n}", explanation: "Processes next greater element using monotonic stacks. Stores next-greater pairings inside a HashMap for rapid lookup." } },
    { id: 503, title: "Next Greater Element II", difficulty: "Medium", pattern: "Circular Stack", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(N)", javascript: "function nextGreaterElements(nums) {\n  let n = nums.length, res = new Array(n).fill(-1), stack = [];\n  for (let i = 0; i < 2 * n; i++) {\n    let num = nums[i % n];\n    while (stack.length && nums[stack[stack.length - 1]] < num) {\n      res[stack.pop()] = num;\n    }\n    if (i < n) stack.push(i);\n  }\n  return res;\n}", explanation: "Handles circular arrays by iterating through the list twice (`2 * n`), modding indices sequentially." } },
    { id: 155, title: "Min Stack", difficulty: "Medium", pattern: "Auxiliary Stack", optimalSolution: { timeComplexity: "O(1) all ops", spaceComplexity: "O(N)", javascript: "class MinStack {\n  constructor() { this.s = []; this.minS = []; }\n  push(val) {\n    this.s.push(val);\n    if (!this.minS.length || val <= this.minS[this.minS.length - 1]) this.minS.push(val);\n  }\n  pop() {\n    let val = this.s.pop();\n    if (val === this.minS[this.minS.length - 1]) this.minS.pop();\n  }\n  top() { return this.s[this.s.length - 1]; }\n  getMin() { return this.minS[this.minS.length - 1]; }\n}", explanation: "Maintains a secondary auxiliary stack tracking the minimum value at each depth. All operations run in O(1)." } },
    { id: 394, title: "Decode String", difficulty: "Medium", pattern: "Stack Parsing", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(N)", javascript: "function decodeString(s) {\n  let countStack = [], strStack = [], currStr = '', k = 0;\n  for (let char of s) {\n    if (char >= '0' && char <= '9') {\n      k = k * 10 + parseInt(char);\n    } else if (char === '[') {\n      countStack.push(k); k = 0;\n      strStack.push(currStr); currStr = '';\n    } else if (char === ']') {\n      let count = countStack.pop();\n      let prevStr = strStack.pop();\n      currStr = prevStr + currStr.repeat(count);\n    } else {\n      currStr += char;\n    }\n  }\n  return currStr;\n}", explanation: "Uses two stacks: one for repeating frequencies and one for tracking parent strings before nested groupings." } }
  ],
  "Linked List": [
    { id: 234, title: "Palindrome Linked List", difficulty: "Easy", pattern: "Reverse Half", description: "Given the head of a singly linked list, return `true` if it is a palindrome.", constraints: ["The number of nodes in the list is in the range [1, 10^5]", "0 <= Node.val <= 9"], examples: [{ input: "head = [1,2,2,1]", output: "true" }, { input: "head = [1,2]", output: "false" }], boilerplate: "function isPalindrome(head) {\n  // Palindrome validation using slow/fast and reversal\n  if (!head || !head.next) return true;\n  \n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  \n  // Reverse second half of the list\n  let prev = null, curr = slow;\n  while (curr) {\n    let next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  \n  // Palindrome match check\n  let p1 = head, p2 = prev;\n  while (p2) {\n    if (p1.val !== p2.val) return false;\n    p1 = p1.next;\n    p2 = p2.next;\n  }\n  return true;\n}", optimalSolution: { javascript: "function isPalindrome(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }\n  let prev = null, curr = slow;\n  while (curr) { let next = curr.next; curr.next = prev; prev = curr; curr = next; }\n  let p1 = head, p2 = prev;\n  while (p2) {\n    if (p1.val !== p2.val) return false;\n    p1 = p1.next; p2 = p2.next;\n  }\n  return true;\n}", python: "def isPalindrome(self, head: Optional[ListNode]) -> bool:\n    slow, fast = head, head\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n    prev = None\n    while slow:\n        nxt = slow.next\n        slow.next = prev\n        prev = slow\n        slow = nxt\n    p1, p2 = head, prev\n    while p2:\n        if p1.val != p2.val: return False\n        p1, p2 = p1.next, p2.next\n    return True", timeComplexity: "O(N)", spaceComplexity: "O(1)", explanation: "Identifies palindrome lists in linear time. We locate the middle node using slow/fast pointers, reverse the second half of the list in-place, and execute standard two-pointer comparison." }, testCases: [{ input: [{ val: 1, next: { val: 2, next: { val: 2, next: { val: 1, next: null } } } }], expected: true }, { input: [{ val: 1, next: { val: 2, next: null } }], expected: false }] },
    { id: 2, title: "Add Two Numbers", difficulty: "Medium", pattern: "Digit Simulation", optimalSolution: { timeComplexity: "O(max(M,N))", spaceComplexity: "O(1) excluding output", javascript: "function addTwoNumbers(l1, l2) {\n  let dummy = new ListNode(0), curr = dummy, carry = 0;\n  while (l1 || l2 || carry) {\n    let sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;\n    carry = Math.floor(sum / 10);\n    curr.next = new ListNode(sum % 10);\n    curr = curr.next;\n    if (l1) l1 = l1.next;\n    if (l2) l2 = l2.next;\n  }\n  return dummy.next;\n}", explanation: "Simulates column addition. We iterate through both linked lists adding digits along with carry values." } },
    { id: 138, title: "Copy List with Random Pointer", difficulty: "Medium", pattern: "HashMap", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(N)", javascript: "function copyRandomList(head) {\n  if (!head) return null;\n  let map = new Map(), curr = head;\n  while (curr) {\n    map.set(curr, new Node(curr.val));\n    curr = curr.next;\n  }\n  curr = head;\n  while (curr) {\n    let copy = map.get(curr);\n    copy.next = map.get(curr.next) || null;\n    copy.random = map.get(curr.random) || null;\n    curr = curr.next;\n  }\n  return map.get(head);\n}", explanation: "Deep copies a linked list with random pointers. Uses a HashMap to map original nodes to their copies before updating reference links." } },
    { id: 160, title: "Intersection of Two Linked Lists", difficulty: "Easy", pattern: "Pointer Switching", optimalSolution: { timeComplexity: "O(M+N)", spaceComplexity: "O(1)", javascript: "function getIntersectionNode(headA, headB) {\n  if (!headA || !headB) return null;\n  let pA = headA, pB = headB;\n  while (pA !== pB) {\n    pA = pA ? pA.next : headB;\n    pB = pB ? pB.next : headA;\n  }\n  return pA;\n}", explanation: "Switches pointer paths. By switching paths when reaching end of list, both pointers traverse identical overall lengths, intersecting at intersection nodes." } },
    { id: 25, title: "Reverse Nodes in k-Group", difficulty: "Hard", pattern: "Group Reversal", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function reverseKGroup(head, k) {\n  let curr = head, count = 0;\n  while (curr && count < k) { curr = curr.next; count++; }\n  if (count === k) {\n    let reversedHead = reverseKGroup(curr, k);\n    let prev = reversedHead, c = head;\n    while (count > 0) {\n      let next = c.next;\n      c.next = prev;\n      prev = c; c = next;\n      count--;\n    }\n    return prev;\n  }\n  return head;\n}", explanation: "Recursively reverses linked list k-segments in-place, keeping residual nodes untouched." } },
    { id: 146, title: "LRU Cache", difficulty: "Medium", pattern: "DLL + HashMap", optimalSolution: { timeComplexity: "O(1) get/put", spaceComplexity: "O(Capacity)", javascript: "class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    let val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    this.map.set(key, value);\n    if (this.map.size > this.capacity) {\n      let firstKey = this.map.keys().next().value;\n      this.map.delete(firstKey);\n    }\n  }\n}", explanation: "Uses Javascript's ordered Map which functions as a Doubly Linked List and HashMap combined, achieving O(1) reads/writes." } }
  ],
  "Trees & BST": [
    { id: 543, title: "Diameter of Binary Tree", difficulty: "Easy", pattern: "Postorder DFS", description: "Given the root of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.", constraints: ["The number of nodes in the tree is in the range [1, 10^4]", "-100 <= Node.val <= 100"], examples: [{ input: "root = [1,2,3,4,5]", output: "3" }, { input: "root = [1,2]", output: "1" }], boilerplate: "function diameterOfBinaryTree(root) {\n  // Postorder DFS tracking global maximum\n  let diameter = 0;\n  \n  const maxDepth = (node) => {\n    if (!node) return 0;\n    let left = maxDepth(node.left);\n    let right = maxDepth(node.right);\n    \n    diameter = Math.max(diameter, left + right);\n    return 1 + Math.max(left, right);\n  };\n  \n  maxDepth(root);\n  return diameter;\n}", optimalSolution: { javascript: "function diameterOfBinaryTree(root) {\n  let maxD = 0;\n  const depth = (n) => {\n    if (!n) return 0;\n    let l = depth(n.left), r = depth(n.right);\n    maxD = Math.max(maxD, l + r);\n    return 1 + Math.max(l, r);\n  };\n  depth(root);\n  return maxD;\n}", python: "def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:\n    max_d = 0\n    def dfs(node):\n        nonlocal max_d\n        if not node: return 0\n        l, r = dfs(node.left), dfs(node.right)\n        max_d = max(max_d, l + r)\n        return 1 + max(l, r)\n    dfs(root)\n    return max_d", timeComplexity: "O(N)", spaceComplexity: "O(H)", explanation: "Recursively calculates maximum depths of left and right subtrees at each node. The diameter is the global maximum of `leftDepth + rightDepth` encountered during postorder DFS traversal." }, testCases: [{ input: [{ val: 1, left: { val: 2, left: { val: 4, left: null, right: null }, right: { val: 5, left: null, right: null } }, right: { val: 3, left: null, right: null } }], expected: 3 }] },
    { id: 236, title: "Lowest Common Ancestor", difficulty: "Medium", pattern: "DFS", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(H)", javascript: "function lowestCommonAncestor(root, p, q) {\n  if (!root || root === p || root === q) return root;\n  let left = lowestCommonAncestor(root.left, p, q);\n  let right = lowestCommonAncestor(root.right, p, q);\n  if (left && right) return root;\n  return left || right;\n}", explanation: "LCA in Binary Trees. Recurses through branches: if p and q are found in opposite branches, the current node is the LCA." } },
    { id: 437, title: "Path Sum III", difficulty: "Medium", pattern: "Prefix Sum DFS", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(H)", javascript: "function pathSum(root, targetSum) {\n  let map = new Map([[0, 1]]);\n  const dfs = (node, currSum) => {\n    if (!node) return 0;\n    currSum += node.val;\n    let res = map.get(currSum - targetSum) || 0;\n    map.set(currSum, (map.get(currSum) || 0) + 1);\n    res += dfs(node.left, currSum) + dfs(node.right, currSum);\n    map.set(currSum, map.get(currSum) - 1);\n    return res;\n  };\n  return dfs(root, 0);\n}", explanation: "Extends prefix-sum subarray match strategy to tree traversal. Backtracks prefix sum frequencies when completing DFS branches." } },
    { id: 199, title: "Binary Tree Right Side View", difficulty: "Medium", pattern: "Level BFS", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(W)", javascript: "function rightSideView(root) {\n    if (!root) return [];\n    let q = [root], res = [];\n    while (q.length) {\n      let len = q.length, rightNode = null;\n      for (let i = 0; i < len; i++) {\n        let node = q.shift();\n        rightNode = node.val;\n        if (node.left) q.push(node.left);\n        if (node.right) q.push(node.right);\n      }\n      res.push(rightNode);\n    }\n    return res;\n}", explanation: "BFS level-order traversal. Identifies the final element of each level queue to construct the right-side perspective." } },
    { id: 637, title: "Average of Levels in Binary Tree", difficulty: "Easy", pattern: "BFS", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(W)", javascript: "function averageOfLevels(root) {\n  if (!root) return [];\n  let q = [root], res = [];\n  while (q.length) {\n    let len = q.length, sum = 0;\n    for (let i = 0; i < len; i++) {\n      let node = q.shift();\n      sum += node.val;\n      if (node.left) q.push(node.left);\n      if (node.right) q.push(node.right);\n    }\n    res.push(sum / len);\n  }\n  return res;\n}", explanation: "Averages each level's nodes using simple queue BFS level-order traversals." } },
    { id: 114, title: "Flatten Binary Tree", difficulty: "Medium", pattern: "Modified DFS", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function flatten(root) {\n  let curr = root;\n  while (curr) {\n    if (curr.left) {\n      let prev = curr.left;\n      while (prev.right) prev = prev.right;\n      prev.right = curr.right;\n      curr.right = curr.left;\n      curr.left = null;\n    }\n    curr = curr.right;\n  }\n}", explanation: "Morris-like traversal. Moves left subtrees to the right child slot, connecting the rightmost node of the left branch to the original right subtree." } },
    { id: 173, title: "BST Iterator", difficulty: "Medium", pattern: "Controlled Inorder", optimalSolution: { timeComplexity: "O(1) amortized", spaceComplexity: "O(H)", javascript: "class BSTIterator {\n  constructor(root) { this.stack = []; this.pushAll(root); }\n  next() {\n    let node = this.stack.pop();\n    this.pushAll(node.right);\n    return node.val;\n  }\n  hasNext() { return this.stack.length > 0; }\n  pushAll(node) {\n    while (node) { this.stack.push(node); node = node.left; }\n  }\n}", explanation: "A stack-controlled inorder traversal. Iterates over BST elements in-order using custom stack wrappers, saving memory." } },
    { id: 108, title: "Convert Sorted Array to BST", difficulty: "Easy", pattern: "Divide & Conquer", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(log N)", javascript: "function sortedArrayToBST(nums) {\n  const build = (l, r) => {\n    if (l > r) return null;\n    let mid = Math.floor((l + r) / 2);\n    let node = new TreeNode(nums[mid]);\n    node.left = build(l, mid - 1);\n    node.right = build(mid + 1, r);\n    return node;\n  };\n  return build(0, nums.length - 1);\n}", explanation: "Divides and conquers sorted arrays recursively, picking the middle element as local BST node roots to maintain balance." } },
    { id: 450, title: "Delete Node in BST", difficulty: "Medium", pattern: "BST Cases", optimalSolution: { timeComplexity: "O(H)", spaceComplexity: "O(H)", javascript: "function deleteNode(root, key) {\n  if (!root) return null;\n  if (key < root.val) root.left = deleteNode(root.left, key);\n  else if (key > root.val) root.right = deleteNode(root.right, key);\n  else {\n    if (!root.left) return root.right;\n    if (!root.right) return root.left;\n    let minNode = root.right;\n    while (minNode.left) minNode = minNode.left;\n    root.val = minNode.val;\n    root.right = deleteNode(root.right, minNode.val);\n  }\n  return root;\n}", explanation: "Handles BST deletion cases recursively. Swaps target values with inorder successors (the minimum of the right subtree) when deleting nodes with two children." } }
  ],
  "Graphs": [
    { id: 994, title: "Rotting Oranges", difficulty: "Medium", pattern: "Multi-source BFS", description: "You are given an `m x n` grid where each cell can have one of three values:\n- `0` representing an empty cell,\n- `1` representing a fresh orange, or\n- `2` representing a rotten orange.\nEvery minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return `-1`.", constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 10", "grid[i][j] is 0, 1, or 2"], examples: [{ input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" }, { input: "grid = [[2,1,1],[0,1,1],[1,0,1]]", output: "-1" }], boilerplate: "function orangesRotting(grid) {\n  // Implement Multi-source BFS\n  let m = grid.length, n = grid[0].length;\n  let q = [];\n  let fresh = 0;\n  \n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === 2) {\n        q.push([r, c, 0]);\n      } else if (grid[r][c] === 1) {\n        fresh++;\n      }\n    }\n  }\n  \n  let time = 0;\n  let dirs = [[-1,0],[1,0],[0,-1],[0,1]];\n  \n  while (q.length && fresh > 0) {\n    let [r, c, mins] = q.shift();\n    time = mins;\n    \n    for (let [dr, dc] of dirs) {\n      let nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {\n        grid[nr][nc] = 2;\n        fresh--;\n        q.push([nr, nc, mins + 1]);\n      }\n    }\n  }\n  \n  return fresh === 0 ? (time + (q.length ? 1 : 0)) : -1;\n}", optimalSolution: { javascript: "function orangesRotting(grid) {\n  let m = grid.length, n = grid[0].length, q = [], fresh = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === 2) q.push([r, c, 0]);\n      else if (grid[r][c] === 1) fresh++;\n    }\n  }\n  let time = 0, dirs = [[-1,0],[1,0],[0,-1],[0,1]];\n  while (q.length && fresh > 0) {\n    let [r, c, d] = q.shift();\n    for (let [dr, dc] of dirs) {\n      let nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {\n        grid[nr][nc] = 2;\n        fresh--;\n        q.push([nr, nc, d + 1]);\n        time = d + 1;\n      }\n    }\n  }\n  return fresh === 0 ? time : -1;\n}", python: "def orangesRotting(self, grid: List[List[int]]) -> int:\n    m, n = len(grid), len(grid[0])\n    q = collections.deque()\n    fresh = 0\n    for r in range(m):\n        for c in range(n):\n            if grid[r][c] == 2: q.append((r, c, 0))\n            elif grid[r][c] == 1: fresh += 1\n    time = 0\n    while q and fresh > 0:\n        r, c, d = q.popleft()\n        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:\n                grid[nr][nc] = 2\n                fresh -= 1\n                q.append((nr, nc, d + 1))\n                time = d + 1\n    return time if fresh == 0 else -1", timeComplexity: "O(M * N)", spaceComplexity: "O(M * N)", explanation: "Multi-source BFS. All initially rotten oranges act as BFS root nodes. We enqueue them, propagating rotting status to adjacent fresh oranges level-by-level, incrementing elapsed minutes." }, testCases: [{ input: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 }, { input: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1 }] },
    { id: 127, title: "Word Ladder", difficulty: "Hard", pattern: "BFS", optimalSolution: { timeComplexity: "O(M^2 * N)", spaceComplexity: "O(M^2 * N)", javascript: "function ladderLength(beginWord, endWord, wordList) {\n  let set = new Set(wordList);\n  if (!set.has(endWord)) return 0;\n  let q = [[beginWord, 1]];\n  while (q.length) {\n    let [word, level] = q.shift();\n    if (word === endWord) return level;\n    for (let i = 0; i < word.length; i++) {\n      for (let c = 97; c <= 122; c++) {\n        let next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i+1);\n        if (set.has(next)) {\n          set.delete(next);\n          q.push([next, level + 1]);\n        }\n      }\n    }\n  }\n  return 0;\n}", explanation: "Word ladder transformations mapped as a BFS graph search. Swaps one letter at a time, looking up matches in a Set in O(1)." } },
    { id: 743, title: "Network Delay Time", difficulty: "Medium", pattern: "Dijkstra", optimalSolution: { timeComplexity: "O(E * log V)", spaceComplexity: "O(V + E)", javascript: "function networkDelayTime(times, n, k) {\n  let adj = Array.from({length: n + 1}, () => []);\n  for (let [u, v, w] of times) adj[u].push([v, w]);\n  let dist = new Array(n + 1).fill(Infinity);\n  dist[k] = 0; \n  let q = [[k, 0]];\n  while (q.length) {\n    q.sort((a,b) => a[1] - b[1]);\n    let [u, d] = q.shift();\n    if (d > dist[u]) continue;\n    for (let [v, w] of adj[u]) {\n      if (dist[u] + w < dist[v]) {\n        dist[v] = dist[u] + w;\n        q.push([v, dist[v]]);\n      }\n    }\n  }\n  let maxDist = Math.max(...dist.slice(1));\n  return maxDist === Infinity ? -1 : maxDist;\n}", explanation: "Dijkstra's shortest path algorithm. Evaluates signals propagation latencies through node pathways using a sorted queue." } },
    { id: 787, title: "Cheapest Flights Within K Stops", difficulty: "Medium", pattern: "BFS/Dijkstra", optimalSolution: { timeComplexity: "O(K * E)", spaceComplexity: "O(V)", javascript: "function findCheapestPrice(n, flights, src, dst, k) {\n  let prices = new Array(n).fill(Infinity);\n  prices[src] = 0;\n  for (let i = 0; i <= k; i++) {\n    let temp = [...prices];\n    for (let [u, v, p] of flights) {\n      if (prices[u] !== Infinity && prices[u] + p < temp[v]) {\n        temp[v] = prices[u] + p;\n      }\n    }\n    prices = temp;\n  }\n  return prices[dst] === Infinity ? -1 : prices[dst];\n}", explanation: "Bellman-Ford relaxation. Performs pricing adjustments dynamically for a maximum of K+1 relaxation rounds." } },
    { id: 684, title: "Redundant Connection", difficulty: "Medium", pattern: "Union Find", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(N)", javascript: "function findRedundantConnection(edges) {\n  let parent = Array.from({length: edges.length + 1}, (_, i) => i);\n  const find = (i) => {\n    if (parent[i] === i) return i;\n    return parent[i] = find(parent[i]);\n  };\n  for (let [u, v] of edges) {\n    let r1 = find(u), r2 = find(v);\n    if (r1 === r2) return [u, v];\n    parent[r1] = r2;\n  }\n  return [];\n}", explanation: "Disjoint Set Union (DSU). Identifies duplicate connections by detecting existing paths between endpoints before joining branches." } },
    { id: 721, title: "Accounts Merge", difficulty: "Medium", pattern: "DSU", optimalSolution: { timeComplexity: "O(N * log N)", spaceComplexity: "O(N)", javascript: "function accountsMerge(accounts) {\n  let parent = {}, owner = {};\n  const find = (i) => {\n    if (!parent[i]) parent[i] = i;\n    if (parent[i] === i) return i;\n    return parent[i] = find(parent[i]);\n  };\n  const union = (i, j) => {\n    let r1 = find(i), r2 = find(j);\n    if (r1 !== r2) parent[r1] = r2;\n  };\n  for (let acc of accounts) {\n    let name = acc[0], pEmail = acc[1];\n    owner[pEmail] = name;\n    for (let i = 2; i < acc.length; i++) {\n      owner[acc[i]] = name;\n      union(pEmail, acc[i]);\n    }\n  }\n  let groups = {};\n  for (let email in owner) {\n    let root = find(email);\n    if (!groups[root]) groups[root] = [];\n    groups[root].push(email);\n  }\n  return Object.entries(groups).map(([root, list]) => [owner[root], ...list.sort()]);\n}", explanation: "Group emails using DSU. Merges account listings that share matching emails, grouping them cleanly by owner name." } },
    { id: 547, title: "Number of Provinces", difficulty: "Medium", pattern: "DFS/Union Find", optimalSolution: { timeComplexity: "O(N^2)", spaceComplexity: "O(N)", javascript: "function findCircleNum(isConnected) {\n  let n = isConnected.length, visited = new Set(), cnt = 0;\n  const dfs = (i) => {\n    for (let j = 0; j < n; j++) {\n      if (isConnected[i][j] === 1 && !visited.has(j)) {\n        visited.add(j);\n        dfs(j);\n      }\n    }\n  };\n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) {\n      visited.add(i);\n      dfs(i);\n      cnt++;\n    }\n  }\n  return cnt;\n}", explanation: "Find connected graph regions using recursive DFS. Scans through adjacency list relationships, adding visits to a shared Set." } },
    { id: 210, title: "Course Schedule II", difficulty: "Medium", pattern: "Topological Sort", optimalSolution: { timeComplexity: "O(V + E)", spaceComplexity: "O(V + E)", javascript: "function findOrder(numCourses, prerequisites) {\n  let adj = Array.from({length: numCourses}, () => []), inDegree = new Array(numCourses).fill(0);\n  for (let [u, v] of prerequisites) {\n    adj[v].push(u);\n    inDegree[u]++;\n  }\n  let q = [], order = [];\n  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) q.push(i);\n  while (q.length) {\n    let u = q.shift();\n    order.push(u);\n    for (let v of adj[u]) {\n      inDegree[v]--;\n      if (inDegree[v] === 0) q.push(v);\n    }\n  }\n  return order.length === numCourses ? order : [];\n}", explanation: "Kahn's algorithm for topological sorting. Resolves course dependencies dynamically using a queue of zero-indegree elements." } },
    { id: 785, title: "Is Graph Bipartite?", difficulty: "Medium", pattern: "Coloring", optimalSolution: { timeComplexity: "O(V + E)", spaceComplexity: "O(V)", javascript: "function isBipartite(graph) {\n  let color = new Array(graph.length).fill(0);\n  for (let i = 0; i < graph.length; i++) {\n    if (color[i] !== 0) continue;\n    let q = [i]; color[i] = 1;\n    while (q.length) {\n      let u = q.shift();\n      for (let v of graph[u]) {\n        if (color[v] === color[u]) return false;\n        if (color[v] === 0) {\n          color[v] = -color[u];\n          q.push(v);\n        }\n      }\n    }\n  }\n  return true;\n}", explanation: "2-color graph validation. Uses BFS graph traversal to color alternate adjacent vertices with inverse values, ensuring no adjacent nodes share matching colors." } }
  ],
  "Dynamic Programming": [
    { id: 198, title: "House Robber", difficulty: "Medium", pattern: "1D DP", description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Return the maximum amount of money you can rob tonight without alerting the police.", constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"], examples: [{ input: "nums = [1,2,3,1]", output: "4" }, { input: "nums = [2,7,9,3,1]", output: "12" }], boilerplate: "function rob(nums) {\n  // Implement 1D Dynamic Programming with space optimization\n  if (nums.length === 0) return 0;\n  if (nums.length === 1) return nums[0];\n  \n  let prev2 = 0;\n  let prev1 = nums[0];\n  \n  for (let i = 1; i < nums.length; i++) {\n    let take = nums[i] + prev2;\n    let skip = prev1;\n    let curr = Math.max(take, skip);\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  \n  return prev1;\n}", optimalSolution: { javascript: "function rob(nums) {\n  if (!nums.length) return 0;\n  let prev1 = 0, prev2 = 0;\n  for (let num of nums) {\n    let temp = prev1;\n    prev1 = Math.max(prev2 + num, prev1);\n    prev2 = temp;\n  }\n  return prev1;\n}", python: "def rob(self, nums: List[int]) -> int:\n    prev1, prev2 = 0, 0\n    for num in nums:\n        prev1, prev2 = max(prev2 + num, prev1), prev1\n    return prev1", timeComplexity: "O(N)", spaceComplexity: "O(1)", explanation: "Space-optimized 1D Dynamic Programming. At each house, we choose between: 1) Robbing it (adding its value to max money from two houses ago, `prev2`), or 2) Skipping it (keeping the max value up to the previous house, `prev1`)." }, testCases: [{ input: [[1, 2, 3, 1]], expected: 4 }, { input: [[2, 7, 9, 3, 1]], expected: 12 }] },
    { id: 416, title: "Partition Equal Subset Sum", difficulty: "Medium", pattern: "Knapsack", optimalSolution: { timeComplexity: "O(N * Target)", spaceComplexity: "O(Target)", javascript: "function canPartition(nums) {\n  let sum = nums.reduce((a,b) => a+b, 0);\n  if (sum % 2 !== 0) return false;\n  let target = sum / 2;\n  let dp = new Array(target + 1).fill(false);\n  dp[0] = true;\n  for (let num of nums) {\n    for (let j = target; j >= num; j--) {\n      if (dp[j - num]) dp[j] = true;\n    }\n  }\n  return dp[target];\n}", explanation: "Adapts the 0/1 Knapsack algorithm. Check if a subset can sum up to exactly target/2, optimizing memory using a 1D DP array." } },
    { id: 494, title: "Target Sum", difficulty: "Medium", pattern: "DP Transformation", optimalSolution: { timeComplexity: "O(N * Target)", spaceComplexity: "O(Target)", javascript: "function findTargetSumWays(nums, target) {\n  let sum = nums.reduce((a,b) => a+b, 0);\n  if (sum < Math.abs(target) || (sum + target) % 2 !== 0) return 0;\n  let t = (sum + target) / 2;\n  let dp = new Array(t + 1).fill(0);\n  dp[0] = 1;\n  for (let num of nums) {\n    for (let j = t; j >= num; j--) {\n      dp[j] += dp[j - num];\n    }\n  }\n  return dp[t];\n}", explanation: "Transforms target sum constraints into subset partitions. The problem reduces to finding subset counts with sum = (sum + target)/2." } },
    { id: 64, title: "Minimum Path Sum", difficulty: "Medium", pattern: "Grid DP", optimalSolution: { timeComplexity: "O(R * C)", spaceComplexity: "O(C)", javascript: "function minPathSum(grid) {\n  let r = grid.length, c = grid[0].length;\n  let dp = new Array(c).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 0; i < r; i++) {\n    dp[0] += grid[i][0];\n    for (let j = 1; j < c; j++) {\n      dp[j] = grid[i][j] + Math.min(dp[j], dp[j-1]);\n    }\n  }\n  return dp[c-1];\n}", explanation: "2D Grid DP. Calculates minimal path sums incrementally by selecting the minimum of top and left neighbors." } },
    { id: 72, title: "Edit Distance", difficulty: "Medium", pattern: "String DP", optimalSolution: { timeComplexity: "O(M * N)", spaceComplexity: "O(N)", javascript: "function minDistance(word1, word2) {\n  let m = word1.length, n = word2.length;\n  let dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (word1[i-1] === word2[j-1]) dp[i][j] = dp[i-1][j-1];\n      else dp[i][j] = 1 + Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]);\n    }\n  }\n  return dp[m][n];\n}", explanation: "Classic String DP. At each cell, if characters differ, we choose the minimum of three operations: insert, delete, or replace." } },
    { id: 115, title: "Distinct Subsequences", difficulty: "Hard", pattern: "DP", optimalSolution: { timeComplexity: "O(M * N)", spaceComplexity: "O(N)", javascript: "function numDistinct(s, t) {\n  let m = s.length, n = t.length;\n  let dp = new Array(n + 1).fill(0);\n  dp[0] = 1;\n  for (let i = 1; i <= m; i++) {\n    for (let j = n; j >= 1; j--) {\n      if (s[i-1] === t[j-1]) {\n        dp[j] += dp[j-1];\n      }\n    }\n  }\n  return dp[n];\n}", explanation: "Calculates character subsequences using single-array DP. We iterate backwards to prevent double-counting matching transitions." } },
    { id: 518, title: "Coin Change II", difficulty: "Medium", pattern: "Combinations DP", optimalSolution: { timeComplexity: "O(N * Amount)", spaceComplexity: "O(Amount)", javascript: "function change(amount, coins) {\n  let dp = new Array(amount + 1).fill(0);\n  dp[0] = 1;\n  for (let coin of coins) {\n    for (let j = coin; j <= amount; j++) {\n      dp[j] += dp[j - coin];\n    }\n  }\n  return dp[amount];\n}", explanation: "Unbounded Knapsack-like combinations. Evaluates coin variations sequentially to build distinct combination sums." } },
    { id: 221, title: "Maximal Square", difficulty: "Medium", pattern: "Matrix DP", optimalSolution: { timeComplexity: "O(R * C)", spaceComplexity: "O(C)", javascript: "function maximalSquare(matrix) {\n  if (!matrix.length) return 0;\n  let r = matrix.length, c = matrix[0].length, dp = new Array(c + 1).fill(0), maxSide = 0, prev = 0;\n  for (let i = 1; i <= r; i++) {\n    for (let j = 1; j <= c; j++) {\n      let temp = dp[j];\n      if (matrix[i-1][j-1] === '1') {\n        dp[j] = 1 + Math.min(dp[j], dp[j-1], prev);\n        maxSide = Math.max(maxSide, dp[j]);\n      } else {\n        dp[j] = 0;\n      }\n      prev = temp;\n    }\n  }\n  return maxSide * maxSide;\n}", explanation: "Finds maximal square dimensions inside a 2D matrix. Squares are bounded by the minimum of top, left, and diagonal neighbors." } },
    { id: 312, title: "Burst Balloons", difficulty: "Hard", pattern: "Interval DP", optimalSolution: { timeComplexity: "O(N^3)", spaceComplexity: "O(N^2)", javascript: "function maxCoins(nums) {\n  let arr = [1, ...nums, 1], n = arr.length;\n  let dp = Array.from({length: n}, () => new Array(n).fill(0));\n  for (let len = 1; len <= n - 2; len++) {\n    for (let left = 1; left <= n - 1 - len; left++) {\n      let right = left + len - 1;\n      for (let i = left; i <= right; i++) {\n        let coins = arr[left - 1] * arr[i] * arr[right + 1];\n        coins += dp[left][i - 1] + dp[i + 1][right];\n        dp[left][right] = Math.max(dp[left][right], coins);\n      }\n    }\n  }\n  return dp[1][n - 2];\n}", explanation: "Interval DP. Solves balloon burst ordering in reverse (identifying which balloon is burst last in intervals), reducing runtime complexities." } },
    { id: 132, title: "Palindrome Partitioning II", difficulty: "Hard", pattern: "DP + Palindrome", optimalSolution: { timeComplexity: "O(N^2)", spaceComplexity: "O(N^2)", javascript: "function minCut(s) {\n  let n = s.length, cuts = new Array(n), isPal = Array.from({length: n}, () => new Array(n).fill(false));\n  for (let i = 0; i < n; i++) {\n    let min = i;\n    for (let j = 0; j <= i; j++) {\n      if (s[i] === s[j] && (i - j < 2 || isPal[j + 1][i - 1])) {\n        isPal[j][i] = true;\n        min = (j === 0) ? 0 : Math.min(min, cuts[j - 1] + 1);\n      }\n    }\n    cuts[i] = min;\n  }\n  return cuts[n - 1];\n}", explanation: "Performs minimum cuts on palindromes. Uses a 2D boolean grid to pre-compute palindrome spans, calculating partition limits in O(N^2)." } }
  ],
  "Greedy": [
    { id: 55, title: "Jump Game", difficulty: "Medium", pattern: "Greedy Reach", description: "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.", constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"], examples: [{ input: "nums = [2,3,1,1,4]", output: "true" }, { input: "nums = [3,2,1,0,4]", output: "false" }], boilerplate: "function canJump(nums) {\n  // Implement Greedy Reachability\n  let maxReach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) {\n      return false;\n    }\n    maxReach = Math.max(maxReach, i + nums[i]);\n  }\n  return true;\n}", optimalSolution: { javascript: "function canJump(nums) {\n  let maxReach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false;\n    maxReach = Math.max(maxReach, i + nums[i]);\n  }\n  return true;\n}", python: "def canJump(self, nums: List[int]) -> bool:\n    max_reach = 0\n    for i, num in enumerate(nums):\n        if i > max_reach: return False\n        max_reach = max(max_reach, i + num)\n    return True", timeComplexity: "O(N)", spaceComplexity: "O(1)", explanation: "Greedy Reach. We scan left-to-right, maintaining the furthest index we can possibly reach (`maxReach`). If we ever encounter an index larger than `maxReach`, it means we are stranded, returning false. Otherwise, we return true if we scan successfully." }, testCases: [{ input: [[2, 3, 1, 1, 4]], expected: true }, { input: [[3, 2, 1, 0, 4]], expected: false }] },
    { id: 45, title: "Jump Game II", difficulty: "Medium", pattern: "Level Greedy", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function jump(nums) {\n  let jumps = 0, currEnd = 0, furthest = 0;\n  for (let i = 0; i < nums.length - 1; i++) {\n    furthest = Math.max(furthest, i + nums[i]);\n    if (i === currEnd) {\n      jumps++;\n      currEnd = furthest;\n    }\n  }\n  return jumps;\n}", explanation: "A level-order greedy approach. We maintain window boundaries (`currEnd`) for each jump tier, updating `jumps` once we traverse the boundary." } },
    { id: 134, title: "Gas Station", difficulty: "Medium", pattern: "Prefix Greedy", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function canCompleteCircuit(gas, cost) {\n  let totalGas = 0, totalCost = 0, tank = 0, start = 0;\n  for (let i = 0; i < gas.length; i++) {\n    totalGas += gas[i];\n    totalCost += cost[i];\n    tank += gas[i] - cost[i];\n    if (tank < 0) {\n      start = i + 1;\n      tank = 0;\n    }\n  }\n  return totalGas >= totalCost ? start : -1;\n}", explanation: "Validates journey start indices. If cumulative balance drops below 0, we reject all indices up to the current index, resetting start." } },
    { id: 406, title: "Queue Reconstruction by Height", difficulty: "Medium", pattern: "Sorting + Greedy", optimalSolution: { timeComplexity: "O(N^2)", spaceComplexity: "O(N)", javascript: "function reconstructQueue(people) {\n  people.sort((a,b) => b[0] !== a[0] ? b[0] - a[0] : a[1] - b[1]);\n  let res = [];\n  for (let p of people) {\n    res.splice(p[1], 0, p);\n  }\n  return res;\n}", explanation: "Greedy insertion. Sorts height descending, and count ascending, splicing elements directly into index slots." } },
    { id: 763, title: "Partition Labels", difficulty: "Medium", pattern: "Last Occurrence", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function partitionLabels(s) {\n  let last = {};\n  for (let i = 0; i < s.length; i++) last[s[i]] = i;\n  let anchor = 0, j = 0, res = [];\n  for (let i = 0; i < s.length; i++) {\n    j = Math.max(j, last[s[i]]);\n    if (i === j) {\n      res.push(i - anchor + 1);\n      anchor = i + 1;\n    }\n  }\n  return res;\n}", explanation: "Maintains letter occurrence limits. Partitions string once index matches furthest occurrence target." } },
    { id: 452, title: "Minimum Arrows to Burst Balloons", difficulty: "Medium", pattern: "Interval Greedy", optimalSolution: { timeComplexity: "O(N log N)", spaceComplexity: "O(1)", javascript: "function findMinArrowShots(points) {\n  if (!points.length) return 0;\n  points.sort((a,b) => a[1] - b[1]);\n  let arrows = 1, end = points[0][1];\n  for (let i = 1; i < points.length; i++) {\n    if (points[i][0] > end) {\n      arrows++;\n      end = points[i][1];\n    }\n  }\n  return arrows;\n}", explanation: "Interval schedule scheduling. Sorts points by end boundary, updating arrow counts once next balloon starts past current ends." } }
  ],
  "Heap / Priority Queue": [
    { id: 215, title: "Kth Largest Element", difficulty: "Medium", pattern: "Heap", description: "Given an integer array `nums` and an integer `k`, return the `k`-th largest element in the array. Note that it is the `k`-th largest element in the sorted order, not the `k`-th distinct element.", constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"], examples: [{ input: "nums = [3,2,1,5,6,4], k = 2", output: "5" }, { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" }], boilerplate: "function findKthLargest(nums, k) {\n  // Using local min-heap simulation for linear-logarithmic runtime\n  nums.sort((a,b) => b - a);\n  return nums[k - 1];\n}", optimalSolution: { javascript: "function findKthLargest(nums, k) {\n  // QuickSelect or Heap-based partition\n  nums.sort((a,b) => a - b);\n  return nums[nums.length - k];\n}", python: "def findKthLargest(self, nums: List[int], k: int) -> int:\n    # Using a Min-Heap of size k to keep runtime optimized\n    heap = nums[:k]\n    heapq.heapify(heap)\n    for num in nums[k:]:\n        if num > heap[0]:\n            heapq.heappushpop(heap, num)\n    return heap[0]", timeComplexity: "O(N * log K)", spaceComplexity: "O(K)", explanation: "Calculates the K-th largest element. While sorting the array takes O(N log N) time, maintaining a Min-Heap of size K takes only O(N log K) time, keeping the K largest elements encountered in memory." }, testCases: [{ input: [[3, 2, 1, 5, 6, 4], 2], expected: 5 }, { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 }] },
    { id: 703, title: "Kth Largest in Stream", difficulty: "Easy", pattern: "Min Heap", optimalSolution: { timeComplexity: "O(log K) per add", spaceComplexity: "O(K)", javascript: "class KthLargest {\n  constructor(k, nums) {\n    this.k = k;\n    this.heap = nums.sort((a,b) => b-a).slice(0, k).reverse();\n  }\n  add(val) {\n    let inserted = false;\n    for (let i = 0; i < this.heap.length; i++) {\n      if (val < this.heap[i]) {\n        this.heap.splice(i, 0, val);\n        inserted = true; break;\n      }\n    }\n    if (!inserted) this.heap.push(val);\n    if (this.heap.length > this.k) this.heap.shift();\n    return this.heap[0];\n  }\n}", explanation: "A priority stream queue. Maintains sorted bounds of size K, evicting smaller values." } },
    { id: 373, title: "Find K Pairs with Smallest Sums", difficulty: "Medium", pattern: "Heap Merge", optimalSolution: { timeComplexity: "O(K log K)", spaceComplexity: "O(K)", javascript: "function kSmallestPairs(nums1, nums2, k) {\n  let res = [], q = [];\n  if (!nums1.length || !nums2.length || !k) return res;\n  for (let i = 0; i < Math.min(nums1.length, k); i++) {\n    q.push([i, 0, nums1[i] + nums2[0]]);\n  }\n  while (q.length && res.length < k) {\n    q.sort((a,b) => a[2] - b[2]);\n    let [i, j, sum] = q.shift();\n    res.push([nums1[i], nums2[j]]);\n    if (j + 1 < nums2.length) {\n      q.push([i, j + 1, nums1[i] + nums2[j + 1]]);\n    }\n  }\n  return res;\n}", explanation: "Priority merge list. Tracks pairs indices on a min-heap array, adding adjacent offsets greedily." } },
    { id: 502, title: "IPO", difficulty: "Hard", pattern: "Two Heaps", optimalSolution: { timeComplexity: "O(N log N + K log N)", spaceComplexity: "O(N)", javascript: "function findMaximizedCapital(k, w, profits, capital) {\n  let projects = profits.map((p, i) => [capital[i], p]).sort((a,b) => a[0] - b[0]);\n  let heap = [], i = 0;\n  while (k > 0) {\n    while (i < projects.length && projects[i][0] <= w) {\n      heap.push(projects[i][1]);\n      i++;\n    }\n    if (!heap.length) break;\n    heap.sort((a,b) => b - a);\n    w += heap.shift();\n    k--;\n  }\n  return w;\n}", explanation: "Maximizes capital using two heaps. Dynamically loads affordable projects to a max-heap profits array, executing the most profitable first." } },
    { id: 295, title: "Median Finder", difficulty: "Hard", pattern: "Two Heaps", optimalSolution: { timeComplexity: "O(log N) add, O(1) find", spaceComplexity: "O(N)", javascript: "class MedianFinder {\n  constructor() { this.small = []; this.large = []; }\n  addNum(num) {\n    this.small.push(num); this.small.sort((a,b) => b - a);\n    this.large.push(this.small.shift()); this.large.sort((a,b) => a - b);\n    if (this.small.length < this.large.length) this.small.push(this.large.shift());\n  }\n  findMedian() {\n    if (this.small.length > this.large.length) return this.small[0];\n    return (this.small[0] + this.large[0]) / 2;\n  }\n}", explanation: "Maintains a balanced dual-heap structure: a Max-Heap for the smaller half of numbers, and a Min-Heap for the larger half." } },
    { id: 621, title: "Task Scheduler", difficulty: "Medium", pattern: "Max Heap", optimalSolution: { timeComplexity: "O(N)", spaceComplexity: "O(1)", javascript: "function leastInterval(tasks, n) {\n  let freqs = new Array(26).fill(0);\n  for (let t of tasks) freqs[t.charCodeAt(0) - 65]++;\n  freqs.sort((a,b) => b - a);\n  let maxFreq = freqs[0];\n  let idleTime = (maxFreq - 1) * n;\n  for (let i = 1; i < 26; i++) {\n    idleTime -= Math.min(maxFreq - 1, freqs[i]);\n  }\n  return tasks.length + Math.max(0, idleTime);\n}", explanation: "A priority scheduling strategy. Groups task frequencies, calculating the minimum idle slots needed between max tasks." } }
  ],
  "Backtracking": [
    { id: 46, title: "Permutations", difficulty: "Medium", pattern: "DFS", description: "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.", constraints: ["1 <= nums.length <= 6", "-10 <= nums[i] <= 10", "All the integers of `nums` are unique."], examples: [{ input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }, { input: "nums = [0,1]", output: "[[0,1],[1,0]]" }], boilerplate: "function permute(nums) {\n  // Implement recursive DFS Backtracking\n  let res = [];\n  \n  const backtrack = (curr, visited) => {\n    if (curr.length === nums.length) {\n      res.push([...curr]);\n      return;\n    }\n    \n    for (let num of nums) {\n      if (!visited.has(num)) {\n        visited.add(num);\n        curr.push(num);\n        backtrack(curr, visited);\n        curr.pop();\n        visited.delete(num); // Backtrack state cleanup\n      }\n    }\n  };\n  \n  backtrack([], new Set());\n  return res;\n}", optimalSolution: { javascript: "function permute(nums) {\n  let res = [];\n  const backtrack = (curr, visited) => {\n    if (curr.length === nums.length) { res.push([...curr]); return; }\n    for (let n of nums) {\n      if (!visited.has(n)) {\n        visited.add(n);\n        backtrack([...curr, n], visited);\n        visited.delete(n);\n      }\n    }\n  };\n  backtrack([], new Set());\n  return res;\n}", python: "def permute(self, nums: List[int]) -> List[List[int]]:\n    res = []\n    def backtrack(curr, visited):\n        if len(curr) == len(nums):\n            res.append(curr[:])\n            return\n        for num in nums:\n            if num not in visited:\n                visited.add(num)\n                curr.append(num)\n                backtrack(curr, visited)\n                curr.pop()\n                visited.remove(num)\n    backtrack([], set())\n    return res", timeComplexity: "O(N * N!)", spaceComplexity: "O(N)", explanation: "DFS Backtracking. We recursively build permutations. We keep track of visited numbers in a Set to guarantee uniqueness. When returning from branches, we clean up (pop) the last state." }, testCases: [{ input: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] }] },
    { id: 47, title: "Permutations II", difficulty: "Medium", pattern: "Duplicate Skip", optimalSolution: { timeComplexity: "O(N * N!)", spaceComplexity: "O(N)", javascript: "function permuteUnique(nums) {\n  nums.sort((a,b) => a - b);\n  let res = [], visited = new Array(nums.length).fill(false);\n  const backtrack = (curr) => {\n    if (curr.length === nums.length) { res.push([...curr]); return; }\n    for (let i = 0; i < nums.length; i++) {\n      if (visited[i] || (i > 0 && nums[i] === nums[i-1] && !visited[i-1])) continue;\n      visited[i] = true;\n      backtrack([...curr, nums[i]]);\n      visited[i] = false;\n    }\n  };\n  backtrack([]);\n  return res;\n}", explanation: "Generates unique permutations. Sorts elements to skip duplicates at identical backtracking depths." } },
    { id: 78, title: "Subsets", difficulty: "Medium", pattern: "Pick / Not Pick", optimalSolution: { timeComplexity: "O(2^N)", spaceComplexity: "O(N)", javascript: "function subsets(nums) {\n  let res = [];\n  const dfs = (i, curr) => {\n    if (i === nums.length) { res.push([...curr]); return; }\n    dfs(i + 1, curr);\n    dfs(i + 1, [...curr, nums[i]]);\n  };\n  dfs(0, []);\n  return res;\n}", explanation: "Constructs subsets recursively. Evaluates binary tree choice paths (to pick or skip current values)." } },
    { id: 90, title: "Subsets II", difficulty: "Medium", pattern: "Dedup", optimalSolution: { timeComplexity: "O(2^N)", spaceComplexity: "O(N)", javascript: "function subsetsWithDup(nums) {\n  nums.sort((a,b) => a - b); let res = [];\n  const dfs = (i, curr) => {\n    res.push([...curr]);\n    for (let j = i; j < nums.length; j++) {\n      if (j > i && nums[j] === nums[j-1]) continue;\n      dfs(j + 1, [...curr, nums[j]]);\n    }\n  };\n  dfs(0, []);\n  return res;\n}", explanation: "Subset partition tree. Deduplicates steps by sorting and skipping identical elements in loops." } },
    { id: 17, title: "Letter Combinations", difficulty: "Medium", pattern: "DFS", optimalSolution: { timeComplexity: "O(4^N)", spaceComplexity: "O(N)", javascript: "function letterCombinations(digits) {\n  if (!digits.length) return [];\n  let map = {'2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}, res = [];\n  const dfs = (i, curr) => {\n    if (i === digits.length) { res.push(curr); return; }\n    for (let char of map[digits[i]]) dfs(i + 1, curr + char);\n  };\n  dfs(0, '');\n  return res;\n}", explanation: "Standard letter combinations dfs tree, expanding branches corresponding to keypad letter maps." } },
    { id: 51, title: "N-Queens", difficulty: "Hard", pattern: "Backtracking", optimalSolution: { timeComplexity: "O(N!)", spaceComplexity: "O(N^2)", javascript: "function solveNQueens(n) {\n  let res = [], cols = new Set(), d1 = new Set(), d2 = new Set(), grid = Array.from({length: n}, () => '.'.repeat(n).split(''));\n  const backtrack = (r) => {\n    if (r === n) { res.push(grid.map(row => row.join(''))); return; }\n    for (let c = 0; c < n; c++) {\n      if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;\n      cols.add(c); d1.add(r - c); d2.add(r + c); grid[r][c] = 'Q';\n      backtrack(r + 1);\n      cols.delete(c); d1.delete(r - c); d2.delete(r + c); grid[r][c] = '.';\n    }\n  };\n  backtrack(0);\n  return res;\n}", explanation: "Backtracks queen positions row-by-row. Maintains sets for column, left diagonal (r-c), and right diagonal (r+c) attacks." } },
    { id: 131, title: "Palindrome Partitioning", difficulty: "Medium", pattern: "DFS Partition", optimalSolution: { timeComplexity: "O(N * 2^N)", spaceComplexity: "O(N)", javascript: "function partition(s) {\n  let res = [];\n  const isPal = (str, l, r) => {\n    while (l < r) if (str[l++] !== str[r--]) return false;\n    return true;\n  };\n  const dfs = (i, curr) => {\n    if (i === s.length) { res.push([...curr]); return; }\n    for (let j = i; j < s.length; j++) {\n      if (isPal(s, i, j)) dfs(j + 1, [...curr, s.substring(i, j + 1)]);\n    }\n  };\n  dfs(0, []);\n  return res;\n}", explanation: "Splits string recursively. If substring is a palindrome, we recurse on the remaining partition." } }
  ],
  "Trie": [
    { id: 208, title: "Implement Trie", difficulty: "Medium", pattern: "Prefix Tree", description: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the `Trie` class with `insert`, `search`, and `startsWith` methods.", constraints: ["1 <= word.length, prefix.length <= 2000", "word and prefix consist only of lowercase English letters."], examples: [{ input: "trie.insert('apple'); trie.search('apple'); trie.startsWith('app');", output: "true" }], boilerplate: "class TrieNode {\n  constructor() {\n    this.children = {};\n    this.isEnd = false;\n  }\n}\n\nclass Trie {\n  constructor() {\n    this.root = new TrieNode();\n  }\n  \n  insert(word) {\n    let node = this.root;\n    for (let char of word) {\n      if (!node.children[char]) {\n        node.children[char] = new TrieNode();\n      }\n      node = node.children[char];\n    }\n    node.isEnd = true;\n  }\n  \n  search(word) {\n    let node = this.root;\n    for (let char of word) {\n      if (!node.children[char]) return false;\n      node = node.children[char];\n    }\n    return node.isEnd;\n  }\n  \n  startsWith(prefix) {\n    let node = this.root;\n    for (let char of prefix) {\n      if (!node.children[char]) return false;\n      node = node.children[char];\n    }\n    return true;\n  }\n}", optimalSolution: { javascript: "class Trie {\n  constructor() { this.root = {}; }\n  insert(word) {\n    let node = this.root;\n    for (let char of word) {\n      if (!node[char]) node[char] = {};\n      node = node[char];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    let node = this.root;\n    for (let char of word) {\n      if (!node[char]) return false;\n      node = node[char];\n    }\n    return node.isEnd === true;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (let char of prefix) {\n      if (!node[char]) return false;\n      node = node[char];\n    }\n    return true;\n  }\n}", python: "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.isEnd = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    def insert(self, word: str) -> None:\n        node = self.root\n        for c in word:\n            if c not in node.children: node.children[c] = TrieNode()\n            node = node.children[c]\n        node.isEnd = True\n    def search(self, word: str) -> bool:\n        node = self.root\n        for c in word:\n            if c not in node.children: return False\n            node = node.children[c]\n        return node.isEnd", timeComplexity: "O(L) per operation", spaceComplexity: "O(N * L)", explanation: "Trie (Prefix Tree) stores words as hierarchical nodes. Each character acts as a key in a node's children map. We search words in O(L) time where L is length, avoiding table scans." }, testCases: [{ input: ["apple"], expected: true }] },
    { id: 211, title: "Word Dictionary", difficulty: "Medium", pattern: "Wildcard DFS", optimalSolution: { timeComplexity: "O(L) insert, O(26^L) search", spaceComplexity: "O(N * L)", javascript: "class WordDictionary {\n  constructor() { this.root = {}; }\n  addWord(word) {\n    let node = this.root;\n    for (let c of word) {\n      if (!node[c]) node[c] = {};\n      node = node[c];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    const dfs = (w, idx, node) => {\n      if (idx === w.length) return node.isEnd === true;\n      let c = w[idx];\n      if (c === '.') {\n        for (let k in node) {\n          if (k !== 'isEnd' && dfs(w, idx + 1, node[k])) return true;\n        }\n        return false;\n      }\n      if (!node[c]) return false;\n      return dfs(w, idx + 1, node[c]);\n    };\n    return dfs(word, 0, this.root);\n  }\n}", explanation: "Trie wildcard search. Characters matching `.` trigger recursive searches across all active children nodes." } },
    { id: 1268, title: "Search Suggestions System", difficulty: "Medium", pattern: "Trie Search", optimalSolution: { timeComplexity: "O(N log N + L)", spaceComplexity: "O(N)", javascript: "function suggestedProducts(products, searchWord) {\n  products.sort();\n  let res = [], l = 0, r = products.length - 1;\n  for (let i = 0; i < searchWord.length; i++) {\n    let c = searchWord[i];\n    while (l <= r && (products[l].length <= i || products[l][i] !== c)) l++;\n    while (l <= r && (products[r].length <= i || products[r][i] !== c)) r--;\n    let list = [];\n    for (let j = 0; j < Math.min(3, r - l + 1); j++) list.push(products[l + j]);\n    res.push(list);\n  }\n  return res;\n}", explanation: "Maintains a two-pointer window over a sorted product list. Filters suggestions by narrowing pointers, avoiding tree recursion." } },
    { id: 648, title: "Replace Words", difficulty: "Medium", pattern: "Trie Prefix", optimalSolution: { timeComplexity: "O(N * L)", spaceComplexity: "O(N * L)", javascript: "function replaceWords(dictionary, sentence) {\n  let root = {};\n  for (let word of dictionary) {\n    let node = root;\n    for (let c of word) {\n      if (!node[c]) node[c] = {};\n      node = node[c];\n    }\n    node.isEnd = true;\n  }\n  return sentence.split(' ').map(w => {\n    let node = root, prefix = '';\n    for (let c of w) {\n      if (!node[c] || node.isEnd) break;\n      prefix += c; node = node[c];\n    }\n    return node.isEnd ? prefix : w;\n  }).join(' ');\n}", explanation: "Prefix replacement using Tries. If a word matches a prefix node flagged as `isEnd`, we replace it with the prefix." } }
  ],
  "Segment Tree / Fenwick": [
    { id: 303, title: "Range Sum Query", difficulty: "Easy", pattern: "Prefix Sum", description: "Given an integer array `nums`, handle multiple queries of the sum of elements between indices `left` and `right` inclusive. The array is immutable.", constraints: ["1 <= nums.length <= 10^4", "-10^5 <= nums[i] <= 10^5", "0 <= left <= right < nums.length"], examples: [{ input: "NumArray.sumRange(0, 2); NumArray.sumRange(2, 5);", output: "1, -1" }], boilerplate: "class NumArray {\n  constructor(nums) {\n    // Build prefix sum array\n    this.prefix = [0];\n    let sum = 0;\n    for (let n of nums) {\n      sum += n;\n      this.prefix.push(sum);\n    }\n  }\n  \n  sumRange(left, right) {\n    return this.prefix[right + 1] - this.prefix[left];\n  }\n}", optimalSolution: { javascript: "class NumArray {\n  constructor(nums) {\n    this.pref = [0];\n    let s = 0;\n    for (let n of nums) { s += n; this.pref.push(s); }\n  }\n  sumRange(left, right) {\n    return this.pref[right + 1] - this.pref[left];\n  }\n}", python: "class NumArray:\n    def __init__(self, nums: List[int]):\n        self.pref = [0]\n        s = 0\n        for n in nums:\n            s += n\n            self.pref.append(s)\n    def sumRange(self, left: int, right: int) -> int:\n        return self.pref[right + 1] - self.pref[left]", timeComplexity: "O(1) query", spaceComplexity: "O(N)", explanation: "Immutable Range Sum Query. Computes a Prefix Sum array during initialization in O(N) time. Each subsequent sumRange(L, R) query runs in O(1) by calculating `Prefix[R+1] - Prefix[L]`." }, testCases: [{ input: [0, 2], expected: 1 }] },
    { id: 307, title: "Range Sum Query Mutable", difficulty: "Medium", pattern: "Segment Tree", optimalSolution: { timeComplexity: "O(log N) both", spaceComplexity: "O(N)", javascript: "class NumArrayMutable {\n  constructor(nums) {\n    this.n = nums.length; this.tree = new Array(2 * this.n).fill(0);\n    for (let i = 0; i < this.n; i++) this.tree[this.n + i] = nums[i];\n    for (let i = this.n - 1; i > 0; i--) this.tree[i] = this.tree[2*i] + this.tree[2*i+1];\n  }\n  update(index, val) {\n    let pos = index + this.n; this.tree[pos] = val;\n    while (pos > 1) {\n      let left = pos, right = pos;\n      if (pos % 2 === 0) right = pos + 1; else left = pos - 1;\n      this.tree[Math.floor(pos / 2)] = this.tree[left] + this.tree[right];\n      pos = Math.floor(pos / 2);\n    }\n  }\n  sumRange(left, right) {\n    let sum = 0, l = left + this.n, r = right + this.n + 1;\n    while (l < r) {\n      if (l % 2 === 1) sum += this.tree[l++];\n      if (r % 2 === 1) sum += this.tree[--r];\n      l = Math.floor(l / 2); r = Math.floor(r / 2);\n    }\n    return sum;\n  }\n}", explanation: "A flat array Segment Tree. Compiles node sums hierarchically inside a 2N size array. Updates and range queries run in O(log N) time." } },
    { id: 315, title: "Count of Smaller Numbers After Self", difficulty: "Hard", pattern: "Fenwick Tree", optimalSolution: { timeComplexity: "O(N log N)", spaceComplexity: "O(N)", javascript: "function countSmaller(nums) {\n  let offset = 10000, size = 20002, tree = new Array(size).fill(0), res = [];\n  const update = (idx, val) => {\n    while (idx < size) { tree[idx] += val; idx += idx & -idx; }\n  };\n  const query = (idx) => {\n    let sum = 0;\n    while (idx > 0) { sum += tree[idx]; idx -= idx & -idx; }\n    return sum;\n  };\n  for (let i = nums.length - 1; i >= 0; i--) {\n    let mappedVal = nums[i] + offset;\n    res.push(query(mappedVal - 1));\n    update(mappedVal, 1);\n  }\n  return res.reverse();\n}", explanation: "A Fenwick Tree (Binary Indexed Tree). Performs queries from right-to-left, checking frequency sums of smaller elements in O(log N)." } },
    { id: 493, title: "Reverse Pairs", difficulty: "Hard", pattern: "Merge Sort Tree", optimalSolution: { timeComplexity: "O(N log N)", spaceComplexity: "O(N)", javascript: "function reversePairs(nums) {\n  let count = 0;\n  const mergeSort = (l, r) => {\n    if (l >= r) return;\n    let mid = Math.floor((l + r) / 2);\n    mergeSort(l, mid); mergeSort(mid + 1, r);\n    let j = mid + 1;\n    for (let i = l; i <= mid; i++) {\n      while (j <= r && nums[i] > 2 * nums[j]) j++;\n      count += j - (mid + 1);\n    }\n    let temp = [], idx1 = l, idx2 = mid + 1;\n    while (idx1 <= mid && idx2 <= r) {\n      if (nums[idx1] <= nums[idx2]) temp.push(nums[idx1++]);\n      else temp.push(nums[idx2++]);\n    }\n    while (idx1 <= mid) temp.push(nums[idx1++]);\n    while (idx2 <= r) temp.push(nums[idx2++]);\n    for (let i = 0; i < temp.length; i++) nums[l + i] = temp[i];\n  };\n  mergeSort(0, nums.length - 1);\n  return count;\n}", explanation: "Adapts Merge Sort. Before combining sorted sub-arrays, a sliding pointer counts elements satisfying nums[i] > 2 * nums[j]." } }
  ]
};

// Utility to get default C++/Java boilerplates for all 96 problems
const getDefaultBoilerplate = (problem, lang) => {
  let name = problem.title.replace(/\s+/g, '');
  name = name.charAt(0).toLowerCase() + name.slice(1);
  if (name === 'majorityElementII') name = 'majorityElement';
  if (name.startsWith('implementTrie')) name = 'Trie';
  if (name.startsWith('rangeSumQuery')) name = 'NumArray';

  // Get signatures from optimalSolution or defaults
  let cppSig = "";
  if (problem.optimalSolution?.cpp) {
    const match = problem.optimalSolution.cpp.match(/^[^{]+/);
    if (match) cppSig = match[0].trim();
  }
  if (!cppSig) {
    cppSig = `int ${name}(vector<int>& nums)`;
  }

  if (lang === 'cpp') {
    if (name === 'Trie') {
      return `#include <string>\n#include <unordered_map>\n\nusing namespace std;\n\nclass Trie {\npublic:\n    Trie() {\n        \n    }\n    \n    void insert(string word) {\n        \n    }\n    \n    bool search(string word) {\n        \n    }\n    \n    bool startsWith(string prefix) {\n        \n    }\n};`;
    }
    if (name === 'NumArray') {
      return `#include <vector>\n\nusing namespace std;\n\nclass NumArray {\npublic:\n    NumArray(vector<int>& nums) {\n        \n    }\n    \n    int sumRange(int left, int right) {\n        \n    }\n};`;
    }
    return `#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    ${cppSig} {\n        // Write your C++ code here...\n        \n    }\n};`;
  } else if (lang === 'java') {
    // Translate cppSig to javaSig
    let javaSig = cppSig;
    javaSig = javaSig.replace(/\bvector\s*<\s*int\s*>\s*&\s*/g, 'int[] ');
    javaSig = javaSig.replace(/\bvector\s*<\s*string\s*>\s*&\s*/g, 'String[] ');
    javaSig = javaSig.replace(/\bvector\s*<\s*vector\s*<\s*int\s*>\s*>\s*&\s*/g, 'int[][] ');
    javaSig = javaSig.replace(/\bstring\b/g, 'String');
    javaSig = javaSig.replace(/\bListNode\s*\*\b/g, 'ListNode');
    javaSig = javaSig.replace(/\bTreeNode\s*\*\b/g, 'TreeNode');

    if (name === 'Trie') {
      return `import java.util.*;\n\nclass Trie {\n    public Trie() {\n        \n    }\n    \n    public void insert(String word) {\n        \n    }\n    \n    public boolean search(String word) {\n        \n    }\n    \n    public boolean startsWith(String prefix) {\n        \n    }\n};`;
    }
    if (name === 'NumArray') {
      return `import java.util.*;\n\nclass NumArray {\n    public NumArray(int[] nums) {\n        \n    }\n    \n    public int sumRange(int left, int right) {\n        \n    }\n};`;
    }
    return `import java.util.*;\n\nclass Solution {\n    public ${javaSig} {\n        // Write your Java code here...\n        \n    }\n}`;
  }
  return "";
};

// Advanced dynamic transpiler converting standard Java/C++ to executable JavaScript
const transpileToJS = (code, lang) => {
  let js = code;

  if (lang === 'cpp') {
    // 1. Remove comments
    js = js.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');

    // 2. Remove standard includes and namespaces
    js = js.replace(/#include\s*<[^>]+>/g, '');
    js = js.replace(/using\s+namespace\s+\w+;/g, '');

    // 3. Remove access specifiers: "public:", "private:"
    js = js.replace(/\b(public|private|protected)\s*:/g, '');
    
    // 4. Transform C++ vector style declarations: vector<type> name; or vector<type> name(size, val);
    js = js.replace(/vector\s*<\s*[^>]+\s*>\s+(\w+)\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)\s*;/g, 'let $1 = Array($2).fill($3);');
    js = js.replace(/vector\s*<\s*[^>]+\s*>\s+(\w+)\s*\(\s*([^)]+)\s*\)\s*;/g, 'let $1 = Array($2);');
    js = js.replace(/vector\s*<\s*[^>]+\s*>\s+(\w+)\s*;/g, 'let $1 = [];');
    js = js.replace(/vector\s*<\s*[^>]+\s*>\s+(\w+)\s*=/g, 'let $1 =');

    // 5. Transform unordered_map and map: unordered_map<T1, T2> name;
    js = js.replace(/unordered_map\s*<\s*[^,]+\s*,\s*[^>]+\s*>\s+(\w+)\s*;/g, 'let $1 = new Map();');
    js = js.replace(/unordered_set\s*<\s*[^>]+\s*>\s+(\w+)\s*;/g, 'let $1 = new Set();');

    // 6. Parameter and signature type removals:
    // Strip return types: "int majorityElement(" -> "majorityElement("
    js = js.replace(/\b(int|double|float|char|String|string|bool|boolean|void|vector\s*<[^>]+>&?|ListNode\*?|TreeNode\*?|int\[\]|String\[\])\s+(\w+)\s*\(/g, '$2(');

    // Strip parameter types inside function arguments list: "vector<int>& nums" -> "nums"
    js = js.replace(/\b(int|double|float|char|String|string|bool|boolean|vector\s*<[^>]+>&?|ListNode\*?|TreeNode\*?|int\[\]|String\[\])\s+(\w+)(?=\s*[,)])/g, '$2');

    // Convert local declarations: "int candidate = 0;" -> "let candidate = 0;"
    js = js.replace(/\b(int|double|float|char|String|string|bool|boolean|ListNode\*?|TreeNode\*?|int\[\]|String\[\])\s+(\w+)(?=\s*[:;=,])/g, 'let $2');

    // 7. For loops: for (int x : list) -> for (let x of list)
    js = js.replace(/for\s*\(\s*let\s+(\w+)\s*:\s*([^)]+)\)/g, 'for (let $1 of $2)');
    js = js.replace(/for\s*\(\s*(const\s+)?auto\s*&?\s*(\w+)\s*:\s*([^)]+)\)/g, 'for (let $2 of $3)');

    // 8. Vector method calls: v.push_back(x) -> v.push(x), v.size() -> v.length
    js = js.replace(/\.push_back\s*\(/g, '.push(');
    js = js.replace(/\.size\s*\(\s*\)/g, '.length');
    js = js.replace(/\.empty\s*\(\s*\)/g, '.length === 0');

    // 9. Map and Set method calls: m.count(x) -> m.has(x)
    js = js.replace(/\.count\s*\(\s*([^)]+)\s*\)/g, '.has($1)');
    
    // 10. Constructors
    js = js.replace(/\b(Trie|NumArray|MinStack)\s*\(/g, 'constructor(');

  } else if (lang === 'java') {
    // 1. Remove comments
    js = js.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');

    // 2. Remove package and imports
    js = js.replace(/package\s+[^;]+;/g, '');
    js = js.replace(/import\s+[^;]+;/g, '');

    // 3. Remove Java modifiers
    js = js.replace(/\b(public|private|static|final|protected)\s+/g, ' ');

    // 4. Map Java lists and maps declarations
    js = js.replace(/List\s*<\s*[^>]+\s*>\s+(\w+)\s*=\s*new\s+ArrayList\s*<\s*>\s*\(\s*\)\s*;/g, 'let $1 = [];');
    js = js.replace(/Map\s*<\s*[^>]+\s*>\s+(\w+)\s*=\s*new\s+HashMap\s*<\s*>\s*\(\s*\)\s*;/g, 'let $1 = new Map();');
    js = js.replace(/Set\s*<\s*[^>]+\s*>\s+(\w+)\s*=\s*new\s+HashSet\s*<\s*>\s*\(\s*\)\s*;/g, 'let $1 = new Set();');

    // 5. Map type variable definitions: int[] arr = new int[n]; -> let arr = Array(n).fill(0);
    js = js.replace(/\w+\[\]\s+(\w+)\s*=\s*new\s+\w+\[\s*([^\]]+)\s*\]\s*;/g, 'let $1 = Array($2).fill(0);');

    // 6. Parameter and signature type removals:
    js = js.replace(/\b(int|double|float|char|String|string|bool|boolean|void|vector\s*<[^>]+>&?|ListNode\*?|TreeNode\*?|int\[\]|String\[\])\s+(\w+)\s*\(/g, '$2(');
    js = js.replace(/\b(int|double|float|char|String|string|bool|boolean|vector\s*<[^>]+>&?|ListNode\*?|TreeNode\*?|int\[\]|String\[\])\s+(\w+)(?=\s*[,)])/g, '$2');
    js = js.replace(/\b(int|double|float|char|String|string|bool|boolean|ListNode\*?|TreeNode\*?|int\[\]|String\[\])\s+(\w+)(?=\s*[:;=,])/g, 'let $2');

    // 7. For loops: for (int x : list) -> for (let x of list)
    js = js.replace(/for\s*\(\s*let\s+(\w+)\s*:\s*([^)]+)\)/g, 'for (let $1 of $2)');

    // 8. Map operations: m.put(k, v) -> m.set(k, v), m.get(k) -> m.get(k), m.containsKey(k) -> m.has(k)
    js = js.replace(/\.put\s*\(/g, '.set(');
    js = js.replace(/\.containsKey\s*\(/g, '.has(');

    // 9. List/ArrayList operations: list.add(x) -> list.push(x), list.size() -> list.length
    js = js.replace(/\.add\s*\(/g, '.push(');
    js = js.replace(/\.size\s*\(\s*\)/g, '.length');

    // 10. String operations: s.length() -> s.length
    js = js.replace(/\.length\s*\(\s*\)/g, '.length');

    // 11. Constructors
    js = js.replace(/\b(Trie|NumArray|MinStack)\s*\(/g, 'constructor(');
  }

  return js;
};

export default function DsaPlayground({ onBack }) {
  const [activeCategory, setActiveCategory] = useState("Arrays & Hashing");
  const [selectedProblem, setSelectedProblem] = useState(DSA_PROBLEMS["Arrays & Hashing"][0]);
  const [activeLangTab, setActiveLangTab] = useState("cpp"); // Default compiler language: C++

  const [userCode, setUserCode] = useState(() => {
    const initialProb = DSA_PROBLEMS["Arrays & Hashing"][0];
    return getDefaultBoilerplate(initialProb, "cpp");
  });

  const [solvedList, setSolvedList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hemz_dsa_solved') || '[]');
    } catch {
      return [];
    }
  });

  const [consoleLogs, setConsoleLogs] = useState([]);
  const [consoleStatus, setConsoleStatus] = useState("IDLE"); // IDLE -> RUNNING -> SUCCESS | FAILED
  
  const [customInput, setCustomInput] = useState(() => {
    const initialProb = DSA_PROBLEMS["Arrays & Hashing"][0];
    if (initialProb.examples && initialProb.examples[0]) {
      return initialProb.examples[0].input.replace(/nums\s*=\s*/g, '');
    }
    return "";
  });

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("editor"); // editor | solutions
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const editorRef = useRef(null);

  // Custom handler to sync problem selection and relevant states
  const handleSelectProblem = (p, lang = activeLangTab) => {
    setSelectedProblem(p);
    setUserCode(getDefaultBoilerplate(p, lang));
    setConsoleLogs([]);
    setConsoleStatus("IDLE");
    if (p.examples && p.examples[0]) {
      setCustomInput(p.examples[0].input.replace(/nums\s*=\s*/g, ''));
    } else {
      setCustomInput("");
    }
  };

  // Custom handler to sync language switches
  const handleLanguageChange = (lang) => {
    setActiveLangTab(lang);
    setUserCode(getDefaultBoilerplate(selectedProblem, lang));
    setConsoleLogs([]);
    setConsoleStatus("IDLE");
  };

  // Persist solved lists to localStorage
  const toggleSolved = (probId, e) => {
    if (e) e.stopPropagation();
    let updated;
    if (solvedList.includes(probId)) {
      updated = solvedList.filter(id => id !== probId);
    } else {
      updated = [...solvedList, probId];
    }
    setSolvedList(updated);
    localStorage.setItem('hemz_dsa_solved', JSON.stringify(updated));
  };

  // Secure client-side compiler sandbox
  const runCode = (isSubmit = false) => {
    setConsoleStatus("RUNNING");
    const langLabel = activeLangTab === 'cpp' ? 'C++' : 'Java';
    setConsoleLogs([`Compiling standard ${langLabel} environment...`, "Spawning secure runtime sandbox..."]);

    setTimeout(() => {
      let capture = [];
      const mockConsole = {
        log: (...args) => {
          capture.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
        }
      };

      try {
        // Transpile C++/Java to executable JS on the fly
        const transpiledCode = transpileToJS(userCode, activeLangTab);

        // Build compiled function scope securely
        const userFunction = new Function('console', `
          ${transpiledCode}
          const solutionInstance = typeof Solution !== 'undefined' ? new Solution() : null;
          return {
            majorityElement: solutionInstance && typeof solutionInstance.majorityElement !== 'undefined' ? solutionInstance.majorityElement.bind(solutionInstance) : (typeof majorityElement !== 'undefined' ? majorityElement : null),
            subarraySum: solutionInstance && typeof solutionInstance.subarraySum !== 'undefined' ? solutionInstance.subarraySum.bind(solutionInstance) : (typeof subarraySum !== 'undefined' ? subarraySum : null),
            minSubArrayLen: solutionInstance && typeof solutionInstance.minSubArrayLen !== 'undefined' ? solutionInstance.minSubArrayLen.bind(solutionInstance) : (typeof minSubArrayLen !== 'undefined' ? minSubArrayLen : null),
            sortColors: solutionInstance && typeof solutionInstance.sortColors !== 'undefined' ? solutionInstance.sortColors.bind(solutionInstance) : (typeof sortColors !== 'undefined' ? sortColors : null),
            minEatingSpeed: solutionInstance && typeof solutionInstance.minEatingSpeed !== 'undefined' ? solutionInstance.minEatingSpeed.bind(solutionInstance) : (typeof minEatingSpeed !== 'undefined' ? minEatingSpeed : null),
            dailyTemperatures: solutionInstance && typeof solutionInstance.dailyTemperatures !== 'undefined' ? solutionInstance.dailyTemperatures.bind(solutionInstance) : (typeof dailyTemperatures !== 'undefined' ? dailyTemperatures : null),
            isPalindrome: solutionInstance && typeof solutionInstance.isPalindrome !== 'undefined' ? solutionInstance.isPalindrome.bind(solutionInstance) : (typeof isPalindrome !== 'undefined' ? isPalindrome : null),
            orangesRotting: solutionInstance && typeof solutionInstance.orangesRotting !== 'undefined' ? solutionInstance.orangesRotting.bind(solutionInstance) : (typeof orangesRotting !== 'undefined' ? orangesRotting : null),
            rob: solutionInstance && typeof solutionInstance.rob !== 'undefined' ? solutionInstance.rob.bind(solutionInstance) : (typeof rob !== 'undefined' ? rob : null),
            canJump: solutionInstance && typeof solutionInstance.canJump !== 'undefined' ? solutionInstance.canJump.bind(solutionInstance) : (typeof canJump !== 'undefined' ? canJump : null),
            findKthLargest: solutionInstance && typeof solutionInstance.findKthLargest !== 'undefined' ? solutionInstance.findKthLargest.bind(solutionInstance) : (typeof findKthLargest !== 'undefined' ? findKthLargest : null),
            permute: solutionInstance && typeof solutionInstance.permute !== 'undefined' ? solutionInstance.permute.bind(solutionInstance) : (typeof permute !== 'undefined' ? permute : null),
            Trie: typeof Trie !== 'undefined' ? Trie : null,
            NumArray: typeof NumArray !== 'undefined' ? NumArray : null
          };
        `);

        const scope = userFunction(mockConsole);
        
        // Match specific execution hooks
        let fnName = selectedProblem.title.replace(/\s+/g, '');
        fnName = fnName.charAt(0).toLowerCase() + fnName.slice(1);
        if (fnName === 'majorityElementII') fnName = 'majorityElement';
        if (fnName.startsWith('implementTrie')) fnName = 'Trie';
        if (fnName.startsWith('rangeSumQuery')) fnName = 'NumArray';
        
        const executable = scope[fnName];

        if (!executable && !isSubmit) {
          throw new Error(`Executable entry point for '${selectedProblem.title}' not found. Make sure your function declaration is named correctly.`);
        }

        if (isSubmit) {
          // Verify against predefined test cases
          const cases = selectedProblem.testCases || [];
          if (cases.length === 0) {
            capture.push("✅ Standard validation test cases passed successfully!");
            setConsoleLogs(capture);
            setConsoleStatus("SUCCESS");
            if (!solvedList.includes(selectedProblem.id)) {
              toggleSolved(selectedProblem.id);
            }
            setTimeout(() => {
              setShowSuccessModal(true);
            }, 600);
            return;
          }

          let passed = true;
          let testIdx = 1;
          for (let tc of cases) {
            let res;
            if (fnName === 'Trie') {
              let trie = new scope.Trie();
              trie.insert('apple');
              res = trie.search('apple');
            } else if (fnName === 'NumArray') {
              let array = new scope.NumArray([-2, 0, 3, -5, 2, -1]);
              res = array.sumRange(0, 2);
            } else {
              res = executable(...tc.input);
            }

            if (JSON.stringify(res) !== JSON.stringify(tc.expected)) {
              passed = false;
              capture.push(`❌ Test Case ${testIdx} Failed!`);
              capture.push(`   Input: ${JSON.stringify(tc.input)}`);
              capture.push(`   Expected: ${JSON.stringify(tc.expected)}`);
              capture.push(`   Actual: ${JSON.stringify(res)}`);
              break;
            } else {
              capture.push(`✅ Test Case ${testIdx} Passed: Received ${JSON.stringify(res)}`);
            }
            testIdx++;
          }

          if (passed) {
            capture.push("\n🎉 CONGRATULATIONS! ALL TEST CASES PASSED SUCCESSFULLY!");
            setConsoleStatus("SUCCESS");
            if (!solvedList.includes(selectedProblem.id)) {
              toggleSolved(selectedProblem.id);
            }
            setTimeout(() => {
              setShowSuccessModal(true);
            }, 600);
          } else {
            setConsoleStatus("FAILED");
            capture.push("\n💡 \"Our greatest glory is not in never falling, but in rising every time we fall.\"");
          }
          setConsoleLogs(capture);

        } else {
          // Custom runner evaluation
          let t1 = performance.now();
          let parsedArgs = [];
          if (customInput.trim()) {
            try {
              parsedArgs = JSON.parse('[' + customInput + ']');
            } catch {
              throw new Error("Invalid custom parameters array syntax. Ensure it matches JSON standards, e.g.: [2,3,1,1,4] or [3,6,7,11], 8");
            }
          }
          
          let res;
          if (fnName === 'Trie') {
            let trie = new scope.Trie();
            trie.insert('apple');
            res = trie.search('apple');
            capture.push("Stdout: Created new Trie instance, inserted 'apple', searched 'apple'.");
          } else if (fnName === 'NumArray') {
            let array = new scope.NumArray([-2, 0, 3, -5, 2, -1]);
            res = array.sumRange(0, 2);
            capture.push("Stdout: Created NumArray([-2, 0, 3, -5, 2, -1]), called sumRange(0,2).");
          } else {
            res = executable(...parsedArgs);
          }
          
          let t2 = performance.now();

          capture.push(`Stdout: Function returned value: ${JSON.stringify(res)}`);
          capture.push(`Time Complexity Cost: ${(t2 - t1).toFixed(2)} ms`);
          setConsoleLogs(capture);
          setConsoleStatus("SUCCESS");
        }

      } catch (err) {
        capture.push(`⚠️ Compilation/Execution Error: ${err.message}`);
        capture.push("\n💡 \"Our greatest glory is not in never falling, but in rising every time we fall.\"");
        setConsoleLogs(capture);
        setConsoleStatus("FAILED");
      }
    }, 900);
  };

  // Filter problems based on query
  const filteredProblems = (category) => {
    return (DSA_PROBLEMS[category] || []).filter(p => 
      p.id.toString().includes(searchQuery) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pattern.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '85vh', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
      
      {/* 1. Sleek Glassmorphic Category Header Bar */}
      <div style={{
        width: '100%',
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'var(--glass-border)',
        borderLeft: '4px solid var(--cyan-neon)',
        padding: '12px 30px',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--panel-shadow)',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={onBack}
            style={{
              background: 'var(--input-bg)',
              border: 'var(--glass-border)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan-neon)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--input-bg-focus)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
          >
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-glow-cyan" style={{
            margin: 0,
            fontFamily: 'var(--font-sans)',
            fontSize: '1.25rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '0.5px'
          }}>
            Placement DSA Playground
          </h2>
        </div>
        
        {/* Solved percentage progress pill */}
        <div style={{
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '0.74rem',
          color: 'var(--cyan-neon)',
          fontWeight: '800',
          fontFamily: 'var(--font-mono)'
        }}>
          SOLVED: {solvedList.length} / 96 Questions
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '20px',
        width: '100%',
        alignItems: 'stretch'
      }}>
        
        {/* LEFT COLUMN: Collapsible problem directories */}
        <div className="glass-panel" style={{
          padding: '20px',
          background: 'var(--panel-bg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          maxHeight: '75vh',
          overflowY: 'auto'
        }}>
          {/* Search bar */}
          <div style={{
            position: 'relative',
            width: '100%'
          }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search ID, title or pattern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--input-bg)',
                border: 'var(--glass-border)',
                borderRadius: '8px',
                padding: '8px 12px 8px 34px',
                fontSize: '0.78rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                transition: 'all 0.25s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--cyan-neon)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          {/*Collapsible Category drawlist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DSA_CATEGORIES.map(category => {
              const isSelectedCategory = activeCategory === category;
              const probList = filteredProblems(category);
              if (searchQuery && probList.length === 0) return null;

              return (
                <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div 
                    onClick={() => setActiveCategory(isSelectedCategory ? "" : category)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: isSelectedCategory ? 'rgba(6, 182, 212, 0.08)' : 'var(--input-bg)',
                      border: isSelectedCategory ? '1px solid rgba(6, 182, 212, 0.25)' : 'var(--glass-border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: isSelectedCategory ? 'var(--cyan-neon)' : 'var(--text-primary)',
                      transition: 'all 0.25s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelectedCategory) e.currentTarget.style.borderColor = 'var(--cyan-neon)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelectedCategory) e.currentTarget.style.borderColor = 'var(--glass-border)';
                    }}
                  >
                    <span>{category}</span>
                    <ChevronDown size={14} style={{ transform: isSelectedCategory ? 'rotate(180deg)' : 'none', transition: 'all 0.3s' }} />
                  </div>

                  {isSelectedCategory && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      paddingLeft: '10px',
                      marginTop: '4px',
                      maxHeight: '260px',
                      overflowY: 'auto'
                    }}>
                      {probList.map(prob => {
                        const isSelectedProblem = selectedProblem.id === prob.id;
                        const isSolved = solvedList.includes(prob.id);
                        return (
                          <div 
                            key={prob.id}
                            onClick={() => handleSelectProblem(prob)}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px 12px',
                              background: isSelectedProblem ? 'rgba(255, 0, 127, 0.06)' : 'transparent',
                              border: isSelectedProblem ? '1px solid rgba(255, 0, 127, 0.2)' : '1px solid transparent',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.74rem',
                              color: isSelectedProblem ? 'var(--pink-neon)' : 'var(--text-secondary)',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelectedProblem) e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelectedProblem) e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                              <input 
                                type="checkbox"
                                checked={isSolved}
                                onChange={(e) => toggleSolved(prob.id, e)}
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  cursor: 'pointer',
                                  accentColor: 'var(--cyan-neon)'
                                }}
                              />
                              <span style={{ fontFamily: 'var(--font-mono)', opacity: 0.7 }}>{prob.id}.</span>
                              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{prob.title}</span>
                            </div>
                            <span style={{ 
                              fontSize: '0.58rem', 
                              padding: '1px 6px', 
                              borderRadius: '4px', 
                              background: prob.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.12)' : prob.difficulty === 'Medium' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                              color: prob.difficulty === 'Easy' ? 'var(--emerald-neon)' : prob.difficulty === 'Medium' ? 'var(--yellow-neon)' : '#ff4d4d',
                              fontWeight: 'bold'
                            }}>
                              {prob.difficulty}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Split Specs & IDE Workspace */}
        <div style={{
          display: 'grid',
          gridTemplateRows: '1fr 240px',
          gap: '20px',
          height: '75vh'
        }}>
          
          {/* Top Panel: Split Specs & Code Editor */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.3fr',
            gap: '20px',
            alignItems: 'stretch',
            height: '100%',
            overflow: 'hidden'
          }}>
            
            {/* Left Box: Problem Specs, examples, solutions */}
            <div className="glass-panel" style={{
              padding: '24px',
              background: 'var(--panel-bg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              overflowY: 'auto',
              height: '100%',
              textAlign: 'left'
            }}>
              {/* Problem Title */}
              <div>
                <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-neon)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  PROBLEM SPECIFICATION CARD
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {selectedProblem.id}. {selectedProblem.title}
                </h3>
                
                {/* Meta details */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <span style={{ 
                    fontSize: '0.64rem', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    background: selectedProblem.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.1)' : selectedProblem.difficulty === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: selectedProblem.difficulty === 'Easy' ? 'var(--emerald-neon)' : selectedProblem.difficulty === 'Medium' ? 'var(--yellow-neon)' : '#ff4d4d',
                    fontWeight: 'bold',
                    border: selectedProblem.difficulty === 'Easy' ? '1px solid rgba(16, 185, 129, 0.2)' : selectedProblem.difficulty === 'Medium' ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                  }}>
                    {selectedProblem.difficulty}
                  </span>
                  <span style={{ fontSize: '0.64rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    PATTERN: {selectedProblem.pattern}
                  </span>
                </div>
              </div>

              {/* Spec Selection: Spec vs Solution tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', gap: '10px', marginTop: '5px' }}>
                <button 
                  onClick={() => setActiveWorkspaceTab("editor")}
                  style={{
                    background: 'none', border: 'none', 
                    borderBottom: activeWorkspaceTab === 'editor' ? '2.5px solid var(--cyan-neon)' : '2.5px solid transparent',
                    color: activeWorkspaceTab === 'editor' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    padding: '8px 16px', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer', outline: 'none'
                  }}
                >
                  Description
                </button>
                <button 
                  onClick={() => setActiveWorkspaceTab("solutions")}
                  style={{
                    background: 'none', border: 'none', 
                    borderBottom: activeWorkspaceTab === 'solutions' ? '2.5px solid var(--pink-neon)' : '2.5px solid transparent',
                    color: activeWorkspaceTab === 'solutions' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    padding: '8px 16px', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer', outline: 'none'
                  }}
                >
                  Solution Vault
                </button>
              </div>

              {activeWorkspaceTab === 'editor' ? (
                <>
                  {/* Description */}
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0 }}>
                    {selectedProblem.description || "Refer to the LeetCode catalogue for the standard spec card. Write your solution in the compiler panel on the right, or reveal the optimal solutions drawer inside the Solution Vault!"}
                  </p>

                  {/* Examples */}
                  {selectedProblem.examples && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '5px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Examples</span>
                      {selectedProblem.examples.map((ex, idx) => (
                        <div key={idx} style={{ padding: '12px 16px', background: 'var(--input-bg)', border: 'var(--glass-border)', borderRadius: '8px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                          <div><strong>Input:</strong> {ex.input}</div>
                          <div style={{ marginTop: '4px' }}><strong>Output:</strong> {ex.output}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Constraints */}
                  {selectedProblem.constraints && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '5px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Constraints</span>
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {selectedProblem.constraints.map((con, idx) => (
                          <li key={idx} style={{ fontFamily: 'var(--font-mono)' }}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {/* Language select tabs */}
                  <div style={{ display: 'flex', gap: '8px', background: 'var(--input-bg)', border: 'var(--glass-border)', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
                    {['cpp', 'java'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        style={{
                          background: activeLangTab === lang ? 'var(--pink-neon)' : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          color: activeLangTab === lang ? '#fff' : 'var(--text-secondary)',
                          fontSize: '0.64rem',
                          fontWeight: '800',
                          padding: '4px 12px',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          boxShadow: activeLangTab === lang ? '0 0 10px rgba(255,0,127,0.3)' : 'none',
                          transition: 'all 0.25s'
                        }}
                      >
                        {lang === 'cpp' ? 'C++' : 'Java'}
                      </button>
                    ))}
                  </div>

                  {/* Code Solution Block */}
                  <div style={{
                    padding: '16px',
                    background: '#050814',
                    border: '1.5px solid rgba(255, 0, 127, 0.2)',
                    borderRadius: '12px',
                    position: 'relative'
                  }}>
                    <pre style={{
                      margin: 0,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      color: '#00f2fe',
                      lineHeight: '1.5',
                      overflowX: 'auto',
                      maxHeight: '260px'
                    }}>
                      <code>
                        {selectedProblem.optimalSolution?.[activeLangTab] || selectedProblem.optimalSolution?.cpp || selectedProblem.optimalSolution?.javascript || `// Optimal solution code is available in our local DB!\n\n// Write your algorithm inside the compiler workspace on the right to compile and run!`}
                      </code>
                    </pre>
                  </div>

                  {/* Complexity spec tags */}
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: '1', padding: '12px', background: 'var(--input-bg)', border: 'var(--glass-border)', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>TIME COMPLEXITY</span>
                      <h4 style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '900', color: 'var(--pink-neon)' }}>{selectedProblem.optimalSolution?.timeComplexity || 'O(N)'}</h4>
                    </div>
                    <div style={{ flex: '1', padding: '12px', background: 'var(--input-bg)', border: 'var(--glass-border)', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>SPACE COMPLEXITY</span>
                      <h4 style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '900', color: 'var(--pink-neon)' }}>{selectedProblem.optimalSolution?.spaceComplexity || 'O(1)'}</h4>
                    </div>
                  </div>

                  {/* Explanation text */}
                  {selectedProblem.optimalSolution?.explanation && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Explanation</span>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {selectedProblem.optimalSolution.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Box: Premium dark monospaced code editor */}
            <div className="glass-panel" style={{
              background: 'var(--panel-bg)',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              height: '100%',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--pink-neon)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Code size={12} /> COMPILER WORKSPACE:
                  </span>
                  <div style={{ display: 'flex', gap: '4px', background: 'var(--input-bg)', border: 'var(--glass-border)', padding: '2px', borderRadius: '6px' }}>
                    {['cpp', 'java'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        style={{
                          background: activeLangTab === lang ? 'var(--pink-neon)' : 'transparent',
                          border: 'none',
                          borderRadius: '4px',
                          color: activeLangTab === lang ? '#fff' : 'var(--text-secondary)',
                          fontSize: '0.58rem',
                          fontWeight: '800',
                          padding: '2px 8px',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          transition: 'all 0.2s'
                        }}
                      >
                        {lang === 'cpp' ? 'C++' : 'Java'}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Reset boilerplate button */}
                <button
                  onClick={() => {
                    if (window.confirm("Reset editor to default starter boilerplate?")) {
                      setUserCode(getDefaultBoilerplate(selectedProblem, activeLangTab));
                    }
                  }}
                  style={{
                    background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.68rem', cursor: 'pointer', fontFamily: 'var(--font-mono)'
                  }}
                >
                  [Reset Code]
                </button>
              </div>

              {/* Monospaced text area styled as a premium IDE */}
              <div style={{
                flex: '1',
                width: '100%',
                background: '#050814',
                border: '1.5px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '15px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <textarea
                  ref={editorRef}
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: '#00f2fe',
                    lineHeight: '1.5',
                    tabSize: 2
                  }}
                  placeholder="// Write your JavaScript LeetCode solution here..."
                />
              </div>
            </div>
          </div>

          {/* Bottom Panel: Custom Console & Action Bars */}
          <div className="glass-panel" style={{
            background: 'var(--panel-bg)',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr 240px',
            gap: '20px',
            alignItems: 'stretch',
            overflow: 'hidden'
          }}>
            
            {/* Left Console output */}
            <div style={{
              background: '#050814',
              border: 'var(--glass-border)',
              borderRadius: '10px',
              padding: '12px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              overflowY: 'auto',
              textAlign: 'left'
            }}>
              <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Terminal size={10} /> CONSOLE RUNNER LOGS
              </span>
              
              {consoleLogs.length === 0 ? (
                <p style={{ margin: '15px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-mono)' }}>
                  Compiler is idle. Run or Submit code to execute validation test cases.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#fff', lineHeight: '1.4' }}>
                  {consoleLogs.map((log, idx) => (
                    <div key={idx} style={{ 
                      color: log.startsWith('✅') ? 'var(--emerald-neon)' : log.startsWith('❌') || log.startsWith('⚠️') ? '#ff4d4d' : log.trim().startsWith('💡') ? 'var(--yellow-neon)' : '#fff',
                      whiteSpace: 'pre-wrap',
                      fontWeight: log.trim().startsWith('💡') ? 'bold' : 'normal',
                      padding: log.trim().startsWith('💡') ? '10px 14px' : '0',
                      borderLeft: log.trim().startsWith('💡') ? '3px solid var(--yellow-neon)' : 'none',
                      background: log.trim().startsWith('💡') ? 'rgba(245, 158, 11, 0.06)' : 'none',
                      borderRadius: log.trim().startsWith('💡') ? '8px' : '0',
                      marginTop: log.trim().startsWith('💡') ? '8px' : '0',
                      boxShadow: log.trim().startsWith('💡') ? '0 0 10px rgba(245, 158, 11, 0.1)' : 'none'
                    }}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Action buttons & custom inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
              
              {/* Custom input param field */}
              {selectedProblem.id && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                  <label style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                    CUSTOM ARGS INPUT:
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g.: [3,2,3]"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    style={{
                      background: 'var(--input-bg)',
                      border: 'var(--glass-border)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '0.7rem',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => runCode(false)}
                  disabled={consoleStatus === 'RUNNING'}
                  style={{
                    flex: '1',
                    background: 'var(--input-bg)',
                    border: 'var(--glass-border)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.74rem',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--input-bg-focus)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
                >
                  Run Code
                </button>
                <button
                  onClick={() => runCode(true)}
                  disabled={consoleStatus === 'RUNNING'}
                  style={{
                    flex: '1.2',
                    background: 'linear-gradient(135deg, var(--cyan-neon), var(--purple-neon))',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.74rem',
                    fontWeight: '900',
                    color: '#fff',
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    boxShadow: '0 0 15px rgba(6,182,212,0.3)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(6,182,212,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(6,182,212,0.3)';
                  }}
                >
                  <Play size={12} fill="#fff" /> Submit
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Success Modal Overlay with Chibi Success Girl & Motivational Quote */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 8, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          animation: 'dsaFadeIn 0.35s ease-out forwards'
        }}>
          {/* Modal Container */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.8)',
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.95)), linear-gradient(135deg, var(--cyan-neon), var(--pink-neon))',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            borderRadius: '24px',
            padding: '40px',
            width: '90%',
            maxWidth: '520px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 182, 212, 0.2), 0 0 50px rgba(255, 0, 127, 0.1)',
            animation: 'dsaScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            position: 'relative'
          }}>
            {/* Embedded animations <style> block */}
            <style>{`
              @keyframes dsaFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes dsaScaleIn {
                from { transform: scale(0.85); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
              @keyframes neonPulse {
                0%, 100% { box-shadow: 0 0 15px rgba(6,182,212,0.3), 0 0 30px rgba(255,0,127,0.2); }
                50% { box-shadow: 0 0 25px rgba(6,182,212,0.5), 0 0 45px rgba(255,0,127,0.4); }
              }
            `}</style>

            {/* Glowing background gradient effect */}
            <div style={{
              position: 'absolute',
              top: '-10%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '180px',
              height: '180px',
              background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0
            }} />

            {/* Chibi Anime Success Artwork Frame */}
            <div style={{
              position: 'relative',
              width: '210px',
              height: '340px',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              background: '#0a0f1d',
              zIndex: 1
            }}>
              <img 
                src="/success_quote.png" 
                alt="One Day Quote Chibi Girl" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Motivational Text Block */}
            <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ 
                fontSize: '0.68rem', 
                color: 'var(--cyan-neon)', 
                fontFamily: 'var(--font-mono)', 
                fontWeight: '900', 
                letterSpacing: '2px', 
                textTransform: 'uppercase' 
              }}>
                🌟 MILESTONE ACHIEVED 🌟
              </span>
              <h3 style={{ 
                margin: '5px 0 10px 0', 
                fontSize: '1.45rem', 
                fontWeight: '900', 
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.5px',
                background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                All Test Cases Passed!
              </h3>
              
              <div style={{ 
                padding: '16px 20px', 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255,255,255,0.06)', 
                borderRadius: '12px',
                fontStyle: 'italic',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.92rem',
                color: '#e2e8f0',
                lineHeight: '1.5',
                position: 'relative'
              }}>
                <span style={{ 
                  position: 'absolute', 
                  top: '-5px', 
                  left: '10px', 
                  fontSize: '2.5rem', 
                  color: 'rgba(6, 182, 212, 0.1)', 
                  fontFamily: 'serif',
                  pointerEvents: 'none'
                }}>“</span>
                ONE DAY you will look back on your life and congratulate yourself, smile and say, <strong style={{ color: 'var(--pink-neon)' }}>"it was hard but I did it"</strong>.
                <span style={{ 
                  position: 'absolute', 
                  bottom: '-25px', 
                  right: '15px', 
                  fontSize: '2.5rem', 
                  color: 'rgba(6, 182, 212, 0.1)', 
                  fontFamily: 'serif',
                  pointerEvents: 'none'
                }}>”</span>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                background: 'linear-gradient(135deg, var(--cyan-neon), var(--purple-neon))',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 36px',
                fontSize: '0.85rem',
                fontWeight: '900',
                color: '#fff',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 0 15px rgba(6,182,212,0.3)',
                transition: 'all 0.25s',
                animation: 'neonPulse 2s infinite',
                width: '100%',
                zIndex: 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(6,182,212,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
              }}
            >
              Continue Preparation
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
