'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, TrendingUp, Award } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import DashboardSkeleton from './DashboardSkeleton';

// Lazy load the chart for better performance
const ChartSection = dynamic(() => import('./ChartSection'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false
});

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } }
};

export default function Dashboard() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch agent data from API
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      
      if (!response.ok) {
        if (data.details === 'NOT_AUTHORIZED') {
          throw new Error('Airtable API key is not authorized. Please check your API key and permissions.');
        }
        throw new Error(data.message || 'Failed to fetch agents');
      }
      
      setAgents(data.agents || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter agents based on search term
  const filteredAgents = agents.filter(agent =>
    agent.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.agency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get top 3 agents
  const top3Agents = agents.slice(0, 3);

  // Get top 25 agents for table
  const top25Agents = filteredAgents.slice(0, 25);

  // Pagination
  const totalPages = Math.ceil(top25Agents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgents = top25Agents.slice(startIndex, startIndex + itemsPerPage);

  // Calculate agency distribution for pie chart
  const agencyDistribution = agents.reduce((acc, agent) => {
    acc[agent.agency] = (acc[agent.agency] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(agencyDistribution).map(([agency, count]) => ({
    name: agency,
    value: count,
    percentage: ((count / agents.length) * 100).toFixed(1)
  }));

  // Loading state with skeleton
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
      >
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-red-500 text-5xl mb-4"
          >
            ⚠️
          </motion.div>
          <p className="text-red-600 mb-4">Error: {error}</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAgents}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Retry
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <a 
              href="https://handdi.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
            >
              <Image 
                src="/logo.png" 
                alt="Handdi.io Logo" 
                width={120} 
                height={120}
                className="drop-shadow-2xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div 
                className="hidden w-[120px] h-[120px] bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full items-center justify-center text-4xl font-bold text-white shadow-2xl"
                style={{ display: 'none' }}
              >
                H
              </div>
            </a>
          </div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-gray-900 mb-2"
          >
            Handdi.io
          </motion.h1>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600"
          >
            Agent Leaderboard
          </motion.h3>
        </motion.div>

        {/* Top 3 Agents with stagger animation */}
        <motion.section 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="mb-12"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2"
          >
            <Award className="text-yellow-500" />
            Top 3 Agents by Referral Earned
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {top3Agents.map((agent, index) => (
              <motion.div
                key={agent.rank}
                variants={scaleIn}
                whileHover="hover"
                className={`relative overflow-hidden rounded-2xl p-8 text-center shadow-2xl transform transition-all duration-300 hover:shadow-3xl
                  ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' : ''}
                  ${index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' : ''}
                  ${index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' : ''}
                `}
              >
                <motion.div 
                  className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="text-5xl mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">{agent.agentName}</h3>
                <p className="opacity-90 mb-4">{agent.agency}</p>
                <motion.div 
                  className="text-3xl font-bold flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <TrendingUp className="w-6 h-6" />
                  ${agent.earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Animated Table */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-95">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h2 className="text-3xl font-bold mb-4 sm:mb-0 flex items-center gap-2">
                📊 Top 25 Agents
              </h2>
              <motion.div 
                className="relative w-full sm:w-64"
                whileHover={{ scale: 1.02 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or agency..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent shadow-md transition-all"
                />
              </motion.div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                    <th className="px-6 py-4 text-left rounded-tl-lg">Rank</th>
                    <th className="px-6 py-4 text-left">Agent Name</th>
                    <th className="px-6 py-4 text-left">Agency</th>
                    <th className="px-6 py-4 text-right rounded-tr-lg">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="wait">
                    {paginatedAgents.map((agent, index) => (
                      <motion.tr 
                        key={agent.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-200"
                      >
                        <td className="px-6 py-4">
                          {agent.rank <= 3 ? (
                            <motion.span 
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white font-bold shadow-lg
                                ${agent.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : ''}
                                ${agent.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : ''}
                                ${agent.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' : ''}
                              `}
                            >
                              {agent.rank}
                            </motion.span>
                          ) : (
                            <span className="text-gray-600 font-medium pl-2">{agent.rank}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">{agent.agentName}</td>
                        <td className="px-6 py-4 text-gray-600">{agent.agency}</td>
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          ${agent.earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Animated Pagination */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center mt-8 space-x-2"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                
                <span className="px-6 py-3 bg-gray-100 rounded-lg font-medium shadow-md">
                  Page {currentPage} of {totalPages}
                </span>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Lazy loaded Chart Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <ChartSection chartData={chartData} totalAgents={agents.length} />
          </Suspense>
        </motion.section>
      </div>
    </div>
  );
}