import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedSection = ({ children, variants }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}>
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // SVG Icon Components for clarity - updated with new theme colors
  const ReportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const ReceiptIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const TeamIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );


  return (
    <div className="bg-[#073737] text-[#FDFFD4]">
      {/* Hero Section */}
      <div className="text-center py-24 px-4 sm:px-6 lg:px-8 bg-[#0a4f4f] rounded-lg">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-6xl font-extrabold text-[#FDFFD4]">
          Welcome to <span className="text-emerald-400">Expense Manager</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-[#FDFFD4]/80">
          The simplest way to track, manage, and report your team's business expenses. Focus on your work, not on paperwork.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-10 flex justify-center gap-4">
          <Link
            to="/signup"
            className="inline-block bg-emerald-500 text-white font-semibold py-4 px-10 rounded-lg shadow-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-110 animate-pulse"
          >
            Get Started for Free
          </Link>
          <Link
            to="/login"
            className="inline-block bg-transparent border-2 border-[#FDFFD4] text-[#FDFFD4] font-semibold py-4 px-10 rounded-lg hover:bg-[#FDFFD4]/10 transition-colors duration-300"
          >
            Login
          </Link>
        </motion.div>
      </div>
      
      {/* Features Section */}
      <div className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection variants={fadeInUp}>
            <div className="text-center">
              <h2 className="text-base font-semibold text-emerald-400 tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-4xl font-extrabold text-[#FDFFD4] tracking-tight sm:text-5xl">
                Everything you need, nothing you don't.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection variants={staggerContainer}>
            <div className="mt-20 grid gap-10 md:grid-cols-3">
              <motion.div variants={fadeInUp} className="text-center p-8 border border-[#FDFFD4]/20 rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-400/50">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 mx-auto">
                  <ReceiptIcon />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#FDFFD4]">Easy Expense Logging</h3>
                <p className="mt-3 text-base text-[#FDFFD4]/80">
                  Quickly add expenses from anywhere. Snap receipts or enter details manually in seconds.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="text-center p-8 border border-[#FDFFD4]/20 rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-400/50">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 mx-auto">
                  <TeamIcon />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#FDFFD4]">Team Management</h3>
                <p className="mt-3 text-base text-[#FDFFD4]/80">
                  Invite team members, set roles, and manage expenses collaboratively in one centralized dashboard.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="text-center p-8 border border-[#FDFFD4]/20 rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-400/50">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 mx-auto">
                  <ReportIcon />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#FDFFD4]">Insightful Reports</h3>
                <p className="mt-3 text-base text-[#FDFFD4]/80">
                  Generate detailed spending reports by category, team member, or date range with a single click.
                </p>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-28 bg-[#0a4f4f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection variants={fadeInUp}>
              <div className="text-center mb-20">
                  <h2 className="text-base font-semibold text-emerald-400 tracking-wide uppercase">How It Works</h2>
                  <p className="mt-2 text-4xl font-extrabold text-[#FDFFD4] tracking-tight sm:text-5xl">Get started in 3 simple steps</p>
              </div>
            </AnimatedSection>
            <AnimatedSection variants={staggerContainer}>
              <div className="grid md:grid-cols-3 gap-12 relative">
                  {/* Dotted line connector for desktop */}
                  <div className="hidden md:block absolute top-12 left-0 w-full h-px">
                    <div className="border-t-2 border-dashed border-[#FDFFD4]/30 h-full w-full" style={{ transform: 'translateY(-50%)' }}></div>
                  </div>

                  <motion.div variants={fadeInUp} className="text-center z-10">
                      <div className="flex items-center justify-center mx-auto w-24 h-24 rounded-full bg-[#073737] border-4 border-emerald-400 text-3xl font-bold text-emerald-400">1</div>
                      <h3 className="mt-6 text-xl font-semibold text-[#FDFFD4]">Create Your Account</h3>
                      <p className="mt-3 text-base text-[#FDFFD4]/80">Sign up in seconds and set up your company profile. No credit card required.</p>
                  </motion.div>
                  <motion.div variants={fadeInUp} className="text-center z-10">
                      <div className="flex items-center justify-center mx-auto w-24 h-24 rounded-full bg-[#073737] border-4 border-emerald-400 text-3xl font-bold text-emerald-400">2</div>
                      <h3 className="mt-6 text-xl font-semibold text-[#FDFFD4]">Invite Your Team</h3>
                      <p className="mt-3 text-base text-[#FDFFD4]/80">Easily add team members to your workspace so they can start submitting expenses.</p>
                  </motion.div>
                  <motion.div variants={fadeInUp} className="text-center z-10">
                      <div className="flex items-center justify-center mx-auto w-24 h-24 rounded-full bg-[#073737] border-4 border-emerald-400 text-3xl font-bold text-emerald-400">3</div>
                      <h3 className="mt-6 text-xl font-semibold text-[#FDFFD4]">Start Tracking</h3>
                      <p className="mt-3 text-base text-[#FDFFD4]/80">Log expenses, review submissions, and generate reports from one simple dashboard.</p>
                  </motion.div>
              </div>
            </AnimatedSection>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="py-28">
        <AnimatedSection variants={fadeInUp}>
          <div className="max-w-4xl mx-auto text-center px-4">
              <p className="text-3xl md:text-4xl font-medium text-[#FDFFD4]">
                  "Expense Manager has saved us over 10 hours a week on financial admin. It's incredibly intuitive and has streamlined our entire process."
              </p>
              <div className="mt-8">
                  <p className="font-semibold text-xl text-[#FDFFD4]">Priya Sharma</p>
                  <p className="text-[#FDFFD4]/80 text-lg">CFO, InnovateTech India</p>
              </div>
          </div>
        </AnimatedSection>
      </div>


      {/* Final CTA Section */}
      <div className="bg-[#0a4f4f] py-28">
        <AnimatedSection variants={fadeInUp}>
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-extrabold text-[#FDFFD4] sm:text-5xl">
              Ready to simplify your expenses?
            </h2>
            <p className="mt-6 text-lg text-[#FDFFD4]/80">
              Create an account in minutes and take control of your company's spending today.
            </p>
            <div className="mt-10">
              <Link
                to="/signup"
                className="inline-block bg-emerald-500 text-white font-semibold py-4 px-12 rounded-lg shadow-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-110"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default HomePage;
