import { questionRepository } from '../repositories/question.repository';
import { CreateQuestionDto, QuestionStatus } from '../types';
import { db, schema } from './db';
import logger from '../utils/logger';

/**
 * Seeds demo questions so the service is usable immediately after migration.
 * Run: npm run db:seed   (or npm run db:seed -- --reset to wipe first)
 *
 * The questions mirror the mock question bank used by the DevBattle frontend
 * so the API and the UI stay consistent during development.
 */

const MENTOR_AUTH_USER_ID = '33333333-3333-4333-8333-333333333333'; // Prof. Rajesh Sharma (user-service seed)

const QUESTIONS: Array<CreateQuestionDto & { slug: string; status: QuestionStatus }> = [
  {
    slug: 'two-sum-target-pointer',
    title: 'Two Sum & Target Pointer',
    description:
      'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    type: 'dsa',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    tags: ['Hash Table', 'Two Pointers', 'Arrays'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft'],
    technology: ['JavaScript', 'TypeScript', 'Python', 'C++'],
    requirements: [
      'Time complexity should be O(n)',
      'Space complexity should be O(n)',
      'Must handle negative integers and zeroes',
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    estimatedMinutes: 15,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    status: 'published',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    starterCode: {
      javascript:
        'function twoSum(nums, target) {\n  // Your code here\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) {\n      return [map.get(diff), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      typescript:
        'function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement)!, i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      python:
        'def two_sum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []',
    },
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isSample: true, isHidden: false },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]', isSample: true, isHidden: false },
      { input: '[3,3]\n6', expectedOutput: '[0,1]', isSample: true, isHidden: false },
      { input: '[-1,-2,-3,-4,-5]\n-8', expectedOutput: '[2,4]', isHidden: true },
      { input: '[1,1,1,1,1,1,1,1,1,1]\n2', expectedOutput: '[0,1]', isHidden: true },
      { input: '[0,4,3,0]\n0', expectedOutput: '[0,3]', isHidden: true },
    ],
  },
  {
    slug: 'reverse-linked-list',
    title: 'Reverse a Linked List',
    description:
      'Given the `head` of a singly linked list, reverse the list and return its new head.\n\nImplement the `reverseList` function. The linked list is defined with `val` and `next` properties.',
    type: 'dsa',
    difficulty: 'Medium',
    category: 'Linked Lists',
    tags: ['Linked List', 'Recursion'],
    companies: ['Microsoft', 'Adobe', 'Amazon'],
    technology: ['JavaScript', 'TypeScript', 'Python', 'C++'],
    requirements: [
      'Solve iteratively and recursively',
      'Must not allocate a new list — reverse in place',
    ],
    constraints: ['The number of nodes is in the range [0, 5000]', '-5000 <= Node.val <= 5000'],
    estimatedMinutes: 25,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    status: 'published',
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
      },
      {
        input: 'head = [1,2]',
        output: '[2,1]',
      },
      {
        input: 'head = []',
        output: '[]',
      },
    ],
    starterCode: {
      javascript:
        'function reverseList(head) {\n  // Your code here\n  let prev = null;\n  let curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}',
      typescript:
        'class ListNode {\n  val: number;\n  next: ListNode | null;\n  constructor(val?: number, next?: ListNode | null) {\n    this.val = val ?? 0;\n    this.next = next ?? null;\n  }\n}\n\nfunction reverseList(head: ListNode | null): ListNode | null {\n  let prev: ListNode | null = null;\n  let curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}',
      python:
        'def reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev',
    },
    testCases: [
      { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', isSample: true, isHidden: false },
      { input: '[1,2]', expectedOutput: '[2,1]', isSample: true, isHidden: false },
      { input: '[]', expectedOutput: '[]', isSample: true, isHidden: false },
      { input: '[1]', expectedOutput: '[1]', isHidden: true },
      { input: '[1,2,3,4,5,6,7,8,9,10]', expectedOutput: '[10,9,8,7,6,5,4,3,2,1]', isHidden: true },
    ],
  },
  {
    slug: 'build-a-todo-app',
    title: 'Build a Todo App (React)',
    description:
      'Build a minimal React todo list component. It must support adding todos, toggling completion, and deleting todos.\n\nImplement the `TodoApp` component. Each todo is `{ id, text, completed }`. Render an input with a placeholder "Add a todo", a button "Add", and the list. Completed todos must render with a line-through style.',
    type: 'frontend',
    difficulty: 'Easy',
    category: 'React Fundamentals',
    tags: ['React', 'State Management', 'UI'],
    companies: ['Meta', 'Flipkart'],
    technology: ['React', 'JavaScript', 'TypeScript'],
    requirements: [
      'Use useState for state',
      'No external state libraries allowed',
      'Accessible button labels',
    ],
    constraints: ['No backend required', 'Plain CSS classes: todo-item, todo-completed'],
    estimatedMinutes: 30,
    timeLimitMs: 4000,
    memoryLimitMb: 512,
    status: 'published',
    examples: [
      {
        input: 'add("Buy milk") -> list shows "Buy milk"',
        output: 'Todo rendered in the list',
        explanation: 'The new todo appears at the end of the list.',
      },
      {
        input: 'toggle(todo) -> completed',
        output: 'todo-completed class applied',
      },
    ],
    starterCode: {
      javascript:
        'export default function TodoApp() {\n  // Your code here\n  return <div>Implement the todo app</div>;\n}',
      typescript:
        'interface Todo {\n  id: number;\n  text: string;\n  completed: boolean;\n}\n\nexport default function TodoApp() {\n  // Your code here\n  return <div>Implement the todo app</div>;\n}',
    },
    testCases: [
      {
        input: 'render -> type "Buy milk" -> click Add',
        expectedOutput: 'List contains a todo with text "Buy milk"',
        isSample: true,
        isHidden: false,
      },
      {
        input: 'add 2 todos -> toggle the first one',
        expectedOutput: 'First todo has class todo-completed, second does not',
        isSample: true,
        isHidden: false,
      },
      {
        input: 'add 1 todo -> click delete',
        expectedOutput: 'List is empty',
        isHidden: true,
      },
    ],
  },
  {
    slug: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    description:
      'Given a string `s`, find the length of the longest substring without repeating characters.',
    type: 'dsa',
    difficulty: 'Hard',
    category: 'Sliding Window',
    tags: ['Hash Set', 'Sliding Window', 'String'],
    companies: ['Amazon', 'Google', 'Apple', 'Adobe'],
    technology: ['JavaScript', 'TypeScript', 'Python', 'C++', 'Java'],
    requirements: ['Must run in O(n) time', 'Must handle unicode characters'],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
    estimatedMinutes: 35,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    status: 'draft',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    starterCode: {
      javascript:
        'function lengthOfLongestSubstring(s) {\n  // Your code here\n  let left = 0;\n  const seen = new Set();\n  let best = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (seen.has(s[right])) {\n      seen.delete(s[left]);\n      left++;\n    }\n    seen.add(s[right]);\n    best = Math.max(best, right - left + 1);\n  }\n  return best;\n}',
      python:
        'def length_of_longest_substring(s: str) -> int:\n    seen = set()\n    left = best = 0\n    for right, ch in enumerate(s):\n        while ch in seen:\n            seen.remove(s[left])\n            left += 1\n        seen.add(ch)\n        best = max(best, right - left + 1)\n    return best',
    },
    testCases: [
      { input: '"abcabcbb"', expectedOutput: '3', isSample: true, isHidden: false },
      { input: '"bbbbb"', expectedOutput: '1', isSample: true, isHidden: false },
      { input: '"pwwkew"', expectedOutput: '3', isSample: true, isHidden: false },
      { input: '""', expectedOutput: '0', isHidden: true },
      { input: '" "', expectedOutput: '1', isHidden: true },
      { input: '"au"', expectedOutput: '2', isHidden: true },
    ],
  },
  {
    slug: 'deploy-a-serverless-api',
    title: 'Deploy a Serverless REST API',
    description:
      'Build and deploy a serverless REST API with a single `GET /ping` route that returns `{ "pong": true }`. Include a health check, environment-based configuration, and CI-ready tests. You may use any serverless provider (AWS Lambda, Vercel, Cloudflare Workers, etc.).',
    type: 'fullstack',
    difficulty: 'Expert',
    category: 'Cloud & DevOps',
    tags: ['Serverless', 'API', 'CI/CD'],
    companies: ['AWS', 'Vercel'],
    technology: ['AWS Lambda', 'Vercel', 'Cloudflare', 'Node.js'],
    requirements: [
      'Route must be publicly reachable',
      'Repository must include automated tests',
      'Document the deployment steps in a README',
    ],
    constraints: ['Free tier resources only', 'No infrastructure-as-code requirement'],
    estimatedMinutes: 60,
    timeLimitMs: 8000,
    memoryLimitMb: 1024,
    status: 'archived',
    examples: [
      {
        input: 'GET https://<your-endpoint>/ping',
        output: '200 {"pong": true}',
      },
    ],
    starterCode: {
      javascript:
        'export async function handler(event) {\n  return {\n    statusCode: 200,\n    headers: { "content-type": "application/json" },\n    body: JSON.stringify({ pong: true }),\n  };\n}',
      typescript:
        'export async function handler(event: any): Promise<{ statusCode: number; body: string }> {\n  return {\n    statusCode: 200,\n    body: JSON.stringify({ pong: true }),\n  };\n}',
    },
    testCases: [
      {
        input: 'GET /ping',
        expectedOutput: '200 with JSON body {"pong": true}',
        isSample: true,
        isHidden: false,
      },
      {
        input: 'GET /unknown-route',
        expectedOutput: '404',
        isHidden: true,
      },
    ],
  },
];

const run = async (): Promise<void> => {
  const reset = process.argv.includes('--reset');
  if (reset) {
    // Ensure the schema exists, then wipe existing questions (children cascade).
    await import('./migrate');
    await db.delete(schema.questions);
    logger.info('Existing questions wiped (--reset).');
  }

  let created = 0;
  for (const q of QUESTIONS) {
    try {
      await questionRepository.create({ ...q, createdBy: MENTOR_AUTH_USER_ID });
      created += 1;
    } catch (err: any) {
      if (err?.code === '23505') {
        logger.info(`Skipping existing question "${q.title}" (slug already present).`);
      } else {
        throw err;
      }
    }
  }
  logger.info(`Seed complete. Created ${created} question(s).`);
  process.exit(0);
};

run().catch((err) => {
  logger.error('Seed failed', { error: err.message });
  process.exit(1);
});
