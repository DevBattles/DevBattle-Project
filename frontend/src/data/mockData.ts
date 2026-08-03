import { Question, Homework, Contest, Submission, AIReviewReport, User, College, Achievement, NotificationItem, AuditLog } from '../types';

export const mockColleges: College[] = [
  {
    id: 'col-1',
    name: 'KR Mangalam University',
    code: 'KRMU',
    branches: [
      {
        id: 'br-cs',
        name: 'Computer Science & Engineering',
        batches: [
          {
            id: 'batch-2025-a',
            name: 'Batch 2025 - Section A',
            year: 2025,
            sections: ['Section A', 'Section B'],
            studentCount: 64,
            mentorId: 'usr-mentor-1',
            mentorName: 'Prof. Rajesh Sharma',
          },
          {
            id: 'batch-2025-b',
            name: 'Batch 2025 - Section B',
            year: 2025,
            sections: ['Section A', 'Section B'],
            studentCount: 58,
            mentorId: 'usr-mentor-1',
            mentorName: 'Prof. Rajesh Sharma',
          },
        ],
      },
      {
        id: 'br-ai',
        name: 'Artificial Intelligence & Data Science',
        batches: [
          {
            id: 'batch-ai-2026',
            name: 'Batch 2026 - AI Core',
            year: 2026,
            sections: ['Section Alpha'],
            studentCount: 45,
            mentorId: 'usr-mentor-2',
            mentorName: 'Dr. Ananya Verma',
          },
        ],
      },
    ],
  },
  {
    id: 'col-2',
    name: 'IIT Delhi',
    code: 'IITD',
    branches: [
      {
        id: 'br-iitd-cs',
        name: 'Computer Science Department',
        batches: [
          {
            id: 'batch-iitd-2025',
            name: 'Batch 2025 - CS Main',
            year: 2025,
            sections: ['Group 1'],
            studentCount: 120,
            mentorId: 'usr-mentor-3',
            mentorName: 'Dr. Vikramaditya',
          },
        ],
      },
    ],
  },
];

export const mockUsers: User[] = [
  {
    id: 'usr-student-1',
    name: 'Aarav Patel',
    email: 'aarav.patel@krmangalam.edu.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    status: 'active',
    collegeId: 'col-1',
    collegeName: 'KR Mangalam University',
    branchName: 'Computer Science & Engineering',
    batchName: 'Batch 2025 - Section A',
    sectionName: 'Section A',
    joinedAt: '2024-08-15',
    xp: 4850,
    rank: 14,
    streak: 28,
    problemsSolved: 142,
    githubUrl: 'https://github.com/aaravpatel-dev',
    bio: 'Fullstack Dev & DSA enthusiast. Building high performance web apps.',
  },
  {
    id: 'usr-mentor-1',
    name: 'Prof. Rajesh Sharma',
    email: 'rajesh.sharma@krmangalam.edu.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'mentor',
    status: 'active',
    collegeId: 'col-1',
    collegeName: 'KR Mangalam University',
    branchName: 'Computer Science & Engineering',
    batchName: 'Batch 2025 - Section A',
    joinedAt: '2023-01-10',
    xp: 12500,
    rank: 2,
    streak: 120,
    problemsSolved: 480,
    githubUrl: 'https://github.com/rsharma-prof',
    bio: 'Lead Mentor at KRMU CSE Dept. Ex-Senior SDE at Amazon.',
  },
  {
    id: 'usr-admin-1',
    name: 'Sarah Connor (Super Admin)',
    email: 'admin@devbattles.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    status: 'active',
    joinedAt: '2022-05-01',
    xp: 99999,
    rank: 1,
    streak: 365,
    problemsSolved: 950,
    githubUrl: 'https://github.com/devbattles-admin',
    bio: 'DevBattles Platform Architect & Global Super Administrator.',
  },
];

export const mockPendingApprovals: User[] = [
  {
    id: 'usr-pending-1',
    name: 'Rohan Mehta',
    email: 'rohan.m@krmangalam.edu.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    status: 'pending',
    collegeId: 'col-1',
    collegeName: 'KR Mangalam University',
    branchName: 'Computer Science & Engineering',
    batchName: 'Batch 2025 - Section A',
    joinedAt: '2026-08-02',
    xp: 0,
    rank: 999,
    streak: 0,
    problemsSolved: 0,
  },
  {
    id: 'usr-pending-2',
    name: 'Dr. Priya Nambiar',
    email: 'pnambiar@iitd.ac.in',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'mentor',
    status: 'pending',
    collegeId: 'col-2',
    collegeName: 'IIT Delhi',
    branchName: 'Computer Science Department',
    joinedAt: '2026-08-01',
    xp: 0,
    rank: 999,
    streak: 0,
    problemsSolved: 0,
  },
];

export const mockQuestions: Question[] = [
  {
    id: 'q-101',
    title: 'Two Sum & Target Pointer',
    slug: 'two-sum-target-pointer',
    type: 'dsa',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    tags: ['Hash Table', 'Two Pointers', 'Arrays'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft'],
    technology: ['JavaScript', 'TypeScript', 'Python', 'C++'],
    acceptanceRate: 84.5,
    estimatedMinutes: 15,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
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
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
    },
    testCases: [
      { id: 'tc-1', input: '[2,7,11,15], target = 9', expectedOutput: '[0,1]' },
      { id: 'tc-2', input: '[3,2,4], target = 6', expectedOutput: '[1,2]' },
      { id: 'tc-3', input: '[3,3], target = 6', expectedOutput: '[0,1]' },
    ],
    solvedStatus: 'solved',
    isBookmarked: true,
  },
  {
    id: 'q-102',
    title: 'React Kanban Board with Drag & Drop',
    slug: 'react-kanban-board-dnd',
    type: 'frontend',
    difficulty: 'Medium',
    category: 'Frontend Architecture',
    tags: ['React', 'State Management', 'UI Components', 'Drag and Drop'],
    companies: ['Linear', 'Notion', 'Atlassian', 'Vercel'],
    technology: ['React', 'TypeScript', 'TailwindCSS'],
    acceptanceRate: 62.1,
    estimatedMinutes: 45,
    description: `Build an interactive **Kanban Task Board** component in React.

The board should feature 3 columns:
1. **To Do**
2. **In Progress**
3. **Done**

Users must be able to add new task cards, move tasks between columns, filter tasks by priority, and persist changes locally.`,
    requirements: [
      'Accessible keyboard controls for moving tasks',
      'Smooth Framer Motion state transitions',
      'Filter bar for high/medium/low priority tasks',
      'W3C WCAG AA contrast compliance',
    ],
    constraints: ['Must run with zero external UI libraries beyond React & TailwindCSS'],
    examples: [
      {
        input: 'User clicks "+ Add Task" under To Do column',
        output: 'A modal or inline input opens to input Title & Priority',
      },
    ],
    starterCode: {
      javascript: `import React, { useState } from 'react';

export default function KanbanBoard() {
  const [columns, setColumns] = useState({
    todo: [{ id: '1', title: 'Implement Auth Flow', priority: 'High' }],
    inProgress: [{ id: '2', title: 'Optimize Monaco Bundle', priority: 'Medium' }],
    done: [{ id: '3', title: 'Design Tokens Setup', priority: 'Low' }],
  });

  return (
    <div className="p-6 bg-slate-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">DevBattles Kanban</h1>
      {/* Build Board Layout Here */}
    </div>
  );
}`,
      typescript: `import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
}

export default function KanbanBoard(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold">Interactive Kanban Board</h1>
    </div>
  );
}`,
    },
    testCases: [
      { id: 'tc-201', input: 'Initial state renders 3 columns', expectedOutput: 'Rendered' },
      { id: 'tc-202', input: 'Add new task button works', expectedOutput: 'Task Added' },
    ],
    solvedStatus: 'unsolved',
    isBookmarked: false,
  },
  {
    id: 'q-103',
    title: 'LRU Cache Design & O(1) Operations',
    slug: 'lru-cache-design',
    type: 'dsa',
    difficulty: 'Hard',
    category: 'System & Data Structures',
    tags: ['Doubly Linked List', 'Hash Map', 'Design'],
    companies: ['Google', 'Meta', 'Stripe', 'Netflix'],
    technology: ['TypeScript', 'C++', 'Java', 'Python'],
    acceptanceRate: 48.9,
    estimatedMinutes: 40,
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) Cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with positive size capacity.
- \`int get(int key)\` Return the value of the key if key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update or insert the value. If capacity is exceeded, evict the least recently used key.

Both \`get\` and \`put\` must run in **O(1)** average time complexity.`,
    requirements: ['O(1) time complexity for get and put', 'Thread-safe logical implementation'],
    constraints: ['1 <= capacity <= 3000', '0 <= key <= 10^4', '0 <= value <= 10^5'],
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
      },
    ],
    starterCode: {
      typescript: `class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}`,
    },
    testCases: [
      { id: 'tc-301', input: 'capacity=2, put(1,1), put(2,2), get(1)', expectedOutput: '1' },
    ],
    solvedStatus: 'attempted',
    isBookmarked: true,
  },
  {
    id: 'q-104',
    title: 'Virtual Scrollable List with Infinite Loading',
    slug: 'virtual-scrollable-list',
    type: 'frontend',
    difficulty: 'Hard',
    category: 'Performance & Architecture',
    tags: ['Virtualization', 'React Hooks', 'DOM Performance'],
    companies: ['Figma', 'Linear', 'GitHub'],
    technology: ['React', 'TypeScript'],
    acceptanceRate: 51.3,
    estimatedMinutes: 50,
    description: `Build a custom Virtualized List component in React capable of rendering 100,000 items smoothly at 60 FPS without DOM lagging. Calculate visible indexes dynamically based on container scrollTop.`,
    requirements: [
      'Render only visible DOM nodes + buffer pool',
      'Dynamic item heights support',
      'Zero jitter during rapid scroll',
    ],
    constraints: ['Max DOM nodes rendered at any moment <= 30'],
    examples: [],
    starterCode: {
      typescript: `import React, { useState, useRef } from 'react';

export default function VirtualList({ itemsCount = 100000, itemHeight = 40 }) {
  const [scrollTop, setScrollTop] = useState(0);
  return <div className="h-96 overflow-auto">Virtualized List</div>;
}`,
    },
    testCases: [],
    solvedStatus: 'unsolved',
    isBookmarked: false,
  },
  {
    id: 'q-105',
    title: 'Token Bucket Rate Limiter',
    slug: 'token-bucket-rate-limiter',
    type: 'dsa',
    difficulty: 'Medium',
    category: 'System Design & Algorithms',
    tags: ['System Design', 'Algorithms', 'Concurrency'],
    companies: ['Stripe', 'Cloudflare', 'AWS'],
    technology: ['JavaScript', 'Python', 'Go'],
    acceptanceRate: 68.4,
    estimatedMinutes: 30,
    description: `Implement a Rate Limiter class using the **Token Bucket** algorithm. Support burst capacity and refill rate per second.`,
    requirements: ['Atomic-like credit refill handling', 'Provide consume(tokens) boolean response'],
    constraints: ['Refill rate > 0'],
    examples: [],
    starterCode: {
      javascript: `class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  allowRequest(tokens = 1) {
    // Refill tokens
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }
}`,
    },
    testCases: [],
    solvedStatus: 'solved',
    isBookmarked: false,
  },
];

export const mockAIReviewSample: AIReviewReport = {
  id: 'rev-9921',
  overallScore: 92,
  metrics: {
    architecture: 94,
    readability: 90,
    performance: 96,
    accessibility: 88,
    security: 98,
    optimization: 92,
    naming: 91,
    folderStructure: 89,
    reactBestPractices: 95,
  },
  summary: 'Outstanding submission! The O(n) space-time algorithm demonstrates optimal efficiency. Component structures adhere to strict solid principles with seamless memoization.',
  improvements: [
    {
      title: 'Optimize Map lookup during iteration',
      category: 'Performance',
      severity: 'low',
      description: 'You can combine the Map existence check and insertion into a single lookup step to reduce hashtable collisions.',
      originalCodeSnippet: `if (map.has(diff)) {\n  return [map.get(diff), i];\n}`,
      suggestedCodeSnippet: `const prevIndex = map.get(diff);\nif (prevIndex !== undefined) {\n  return [prevIndex, i];\n}`,
    },
    {
      title: 'Explicit return types on public helper functions',
      category: 'Readability',
      severity: 'medium',
      description: 'Add TypeScript return annotations to prevent implicit any leaks across module boundaries.',
      originalCodeSnippet: `function twoSum(nums, target) {`,
      suggestedCodeSnippet: `function twoSum(nums: number[], target: number): [number, number] | [] {`,
    },
  ],
  learningResources: [
    { title: 'Vercel React Performance Guide', url: 'https://vercel.com/docs', type: 'doc' },
    { title: 'Linear Engineering: Building UI at 60 FPS', url: 'https://linear.app/readme', type: 'article' },
    { title: 'Hashmaps & Collisions in JS V8 Engine', url: 'https://v8.dev', type: 'article' },
  ],
  personalizedRoadmap: [
    'Master LRU Cache with Doubly Linked Lists for O(1) operations',
    'Explore React 19 UseActionState & Server Actions pattern',
    'Deep dive into WebAssembly module optimization for heavy DSA workloads',
  ],
};

export const mockHomework: Homework[] = [
  {
    id: 'hw-1',
    title: 'Data Structures Sprint: Maps & Two Pointers',
    description: 'Solve 3 core array and hashtable problems. Focus on achieving O(n) runtime complexity.',
    collegeId: 'col-1',
    collegeName: 'KR Mangalam University',
    branchName: 'Computer Science & Engineering',
    batchName: 'Batch 2025 - Section A',
    sectionName: 'Section A',
    mentorName: 'Prof. Rajesh Sharma',
    dueDate: '2026-08-08T23:59:00Z',
    questions: [mockQuestions[0], mockQuestions[2]],
    totalQuestions: 2,
    submittedCount: 42,
    totalStudents: 64,
    status: 'in_progress',
    myGrade: undefined,
  },
  {
    id: 'hw-2',
    title: 'Frontend Mastery: Component Architecture & State',
    description: 'Build a production-grade Kanban Board with accessible keyboard controls and drag-and-drop state.',
    collegeId: 'col-1',
    collegeName: 'KR Mangalam University',
    branchName: 'Computer Science & Engineering',
    batchName: 'Batch 2025 - Section A',
    sectionName: 'Section A',
    mentorName: 'Prof. Rajesh Sharma',
    dueDate: '2026-08-12T23:59:00Z',
    questions: [mockQuestions[1]],
    totalQuestions: 1,
    submittedCount: 18,
    totalStudents: 64,
    status: 'assigned',
  },
  {
    id: 'hw-3',
    title: 'System Design: Rate Limiting & Concurrency',
    description: 'Implement Token Bucket algorithm with thread-safe refill timing.',
    collegeId: 'col-1',
    collegeName: 'KR Mangalam University',
    branchName: 'Computer Science & Engineering',
    batchName: 'Batch 2025 - Section A',
    sectionName: 'Section A',
    mentorName: 'Prof. Rajesh Sharma',
    dueDate: '2026-07-28T23:59:00Z',
    questions: [mockQuestions[4]],
    totalQuestions: 1,
    submittedCount: 64,
    totalStudents: 64,
    status: 'graded',
    myGrade: 98,
  },
];

export const mockContests: Contest[] = [
  {
    id: 'cnt-1',
    title: 'DevBattles Weekly Sprint #42',
    description: '4 Algorithmic challenges in 90 minutes. Global leaderboard ranking with XP rewards.',
    startTime: '2026-08-05T18:00:00Z',
    endTime: '2026-08-05T19:30:00Z',
    durationMinutes: 90,
    status: 'upcoming',
    registeredCount: 1420,
    questionsCount: 4,
    prizes: '$500 AWS Credits + DevBattles Diamond Badge',
    isRegistered: true,
  },
  {
    id: 'cnt-2',
    title: 'Inter-College AI & Frontend Cup 2026',
    description: 'Battle against top students from KRMU, IIT Delhi, BITS Pilani & DTU.',
    startTime: '2026-08-03T10:00:00Z',
    endTime: '2026-08-03T22:00:00Z',
    durationMinutes: 720,
    status: 'live',
    registeredCount: 3890,
    questionsCount: 3,
    prizes: 'Paid Internship at Vercel / Stripe + $2,000 Cash Prize',
    isRegistered: true,
  },
  {
    id: 'cnt-3',
    title: 'KRMU CS Batch 2025 Internal Clash',
    description: 'Exclusive speed-coding battle for Section A & B students.',
    startTime: '2026-07-20T14:00:00Z',
    endTime: '2026-07-20T16:00:00Z',
    durationMinutes: 120,
    status: 'ended',
    registeredCount: 112,
    questionsCount: 5,
    batchSpecific: 'Batch 2025 - Section A',
    isRegistered: true,
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: 'sub-801',
    questionId: 'q-101',
    questionTitle: 'Two Sum & Target Pointer',
    userId: 'usr-student-1',
    userName: 'Aarav Patel',
    language: 'TypeScript',
    code: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    status: 'Accepted',
    runtimeMs: 42,
    memoryMb: 41.2,
    submittedAt: '2026-08-03T11:20:00Z',
    testsPassed: 3,
    totalTests: 3,
    aiReview: mockAIReviewSample,
  },
  {
    id: 'sub-802',
    questionId: 'q-103',
    questionTitle: 'LRU Cache Design',
    userId: 'usr-student-1',
    userName: 'Aarav Patel',
    language: 'TypeScript',
    code: `class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;
  constructor(capacity: number) { this.capacity = capacity; this.cache = new Map(); }
  get(key: number) { return this.cache.get(key) ?? -1; }
}`,
    status: 'Wrong Answer',
    runtimeMs: 110,
    memoryMb: 52.1,
    submittedAt: '2026-08-02T16:45:00Z',
    testsPassed: 1,
    totalTests: 4,
  },
];

export const mockLeaderboard = [
  { rank: 1, name: 'Siddharth V.', college: 'IIT Delhi', xp: 14200, solved: 382, streak: 94, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'Neha Gupta', college: 'KR Mangalam University', xp: 12850, solved: 341, streak: 62, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'Rohan Sharma', college: 'DTU Delhi', xp: 11400, solved: 298, streak: 45, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
  { rank: 4, name: 'Ananya Roy', college: 'BITS Pilani', xp: 9800, solved: 260, streak: 31, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80' },
  { rank: 14, name: 'Aarav Patel (You)', college: 'KR Mangalam University', xp: 4850, solved: 142, streak: 28, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', isCurrentUser: true },
];

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Battle Victory',
    description: 'Win your first live coding battle in a DevBattles Sprint.',
    icon: 'Trophy',
    category: 'battle',
    xpReward: 500,
    progress: 100,
    isUnlocked: true,
    unlockedAt: '2024-09-10',
  },
  {
    id: 'ach-2',
    title: 'Algorithm Wizard',
    description: 'Solve 100 DSA problems with an average AI score > 90.',
    icon: 'Zap',
    category: 'dsa',
    xpReward: 1000,
    progress: 100,
    isUnlocked: true,
    unlockedAt: '2025-02-14',
  },
  {
    id: 'ach-3',
    title: '30-Day Unstoppable Streak',
    description: 'Maintain a daily problem solving streak for 30 consecutive days.',
    icon: 'Flame',
    category: 'streak',
    xpReward: 1500,
    progress: 93,
    isUnlocked: false,
  },
  {
    id: 'ach-4',
    title: 'AI Code Refactor Master',
    description: 'Implement 50 AI code review suggestions across submissions.',
    icon: 'Cpu',
    category: 'ai',
    xpReward: 800,
    progress: 64,
    isUnlocked: false,
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Homework Assigned',
    message: 'Prof. Rajesh Sharma assigned "Data Structures Sprint: Maps & Two Pointers" due in 5 days.',
    timestamp: '2026-08-03T09:00:00Z',
    read: false,
    type: 'homework',
    link: '/homework',
  },
  {
    id: 'notif-2',
    title: 'AI Code Review Ready',
    message: 'AI Review report generated for Two Sum submission. Overall score: 92/100.',
    timestamp: '2026-08-03T11:22:00Z',
    read: false,
    type: 'review',
    link: '/ai-reviews',
  },
  {
    id: 'notif-3',
    title: 'Upcoming Battle Starting Soon',
    message: 'DevBattles Weekly Sprint #42 starts in 2 days. Don\'t forget to prepare!',
    timestamp: '2026-08-02T14:30:00Z',
    read: true,
    type: 'contest',
    link: '/contests',
  },
];

export const mockAuditLogs: AuditLog[] = [
  { id: 'log-1', actor: 'Sarah Connor (Admin)', action: 'Approved User Registration', target: 'Aarav Patel (Student)', timestamp: '2026-08-03 08:30:12', ipAddress: '192.168.1.42', status: 'success' },
  { id: 'log-2', actor: 'Prof. Rajesh Sharma', action: 'Created Homework Batch', target: 'Batch 2025 - Section A', timestamp: '2026-08-03 09:15:00', ipAddress: '10.0.4.12', status: 'success' },
  { id: 'log-3', actor: 'System AI Worker', action: 'Generated AI Review Report', target: 'Submission #sub-801', timestamp: '2026-08-03 11:21:45', ipAddress: '127.0.0.1', status: 'success' },
  { id: 'log-4', actor: 'Sarah Connor (Admin)', action: 'Updated College Batch Mapping', target: 'KR Mangalam University', timestamp: '2026-08-02 16:00:22', ipAddress: '192.168.1.42', status: 'success' },
];
