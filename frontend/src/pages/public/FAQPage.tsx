import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Accordion, AccordionItem } from '../../components/ui/Accordion';
import { Footer } from '../../components/layout/Footer';

export const FAQPage: React.FC = () => {
  const [query, setQuery] = useState('');

  const faqs = [
    {
      id: 'faq-1',
      question: 'How does DevBattles AI Code Review work?',
      answer: 'Our neural code review engine analyzes your AST (Abstract Syntax Tree), runtime complexities, security flaws, and WCAG AA accessibility rules in under 3 seconds. It provides actionable line-by-line diffs and improvement suggestions.',
    },
    {
      id: 'faq-2',
      question: 'What coding languages are supported in the Monaco IDE?',
      answer: 'DevBattles IDE supports TypeScript, JavaScript, Python 3, C++, Java, Rust, and Go with full syntax highlighting, autocompletion, and custom test case execution.',
    },
    {
      id: 'faq-3',
      question: 'How do Colleges and Mentors use DevBattles?',
      answer: 'Colleges set up their campus hierarchy (College -> Branch -> Batch -> Section). Mentors assign homework, schedule batch contests, and monitor AI risk indicators for students requiring extra assistance.',
    },
    {
      id: 'faq-4',
      question: 'Can students participate in global contests without a college subscription?',
      answer: 'Yes! All individual students can register for free global DevBattles Sprints and compete on the global leaderboard.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <main className="max-w-4xl mx-auto px-4 py-12 flex-1 space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="cyan">Help Center</Badge>
          <h1 className="text-4xl font-black text-white">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-sm">Everything you need to know about the DevBattles platform.</p>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FAQs (e.g., AI Review, IDE, College)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <Accordion>
          {filteredFaqs.map((faq) => (
            <AccordionItem key={faq.id} id={faq.id} title={faq.question}>
              {faq.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <Footer />
    </div>
  );
};
