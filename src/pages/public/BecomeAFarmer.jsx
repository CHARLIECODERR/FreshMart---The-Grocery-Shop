import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Package,
  BadgeCheck,
  ArrowRight,
  Truck,
  LineChart,
  Banknote,
  HeartHandshake,
  Star,
  ChevronRight
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const steps = [
  {
    step: '01',
    icon: Sprout,
    title: 'Sign Up as a Farmer',
    desc: 'Create an account and choose the "Join as Farmer / Supplier" option on the registration page.',
  },
  {
    step: '02',
    icon: ShieldCheck,
    title: 'Submit Your KYC',
    desc: 'Fill a quick verification form with your farm details and upload a government ID or farm license.',
  },
  {
    step: '03',
    icon: BadgeCheck,
    title: 'Get Admin Approval',
    desc: 'Our team reviews your application (usually within 1–2 business days) and verifies your credentials.',
  },
  {
    step: '04',
    icon: TrendingUp,
    title: 'Start Selling Wholesale',
    desc: 'Once approved, list your produce as wholesale offers. Admin reviews and adds them to the storefront.',
  },
];

const benefits = [
  {
    icon: Banknote,
    color: 'bg-emerald-500',
    title: 'Guaranteed Wholesale Payments',
    desc: 'Receive fixed wholesale prices for every approved supply offer — no haggling, no delays.',
  },
  {
    icon: LineChart,
    color: 'bg-blue-500',
    title: 'Earnings Dashboard',
    desc: 'Track all your wholesale payouts, accepted offers, and revenue trends in real time.',
  },
  {
    icon: Package,
    color: 'bg-violet-500',
    title: 'Simple Offer Management',
    desc: 'Submit produce with photos, pricing, and quantities. We handle the storefront and customers.',
  },
  {
    icon: Truck,
    color: 'bg-amber-500',
    title: 'Zero Logistics Hassle',
    desc: 'Focus on growing — admin coordinates dispatch and delivery directly with end customers.',
  },
  {
    icon: HeartHandshake,
    color: 'bg-rose-500',
    title: 'Trusted Partner Network',
    desc: 'Join a vetted community of quality-first farmers supplying fresh produce directly to urban families.',
  },
  {
    icon: Star,
    color: 'bg-orange-500',
    title: 'Featured Listing Opportunity',
    desc: 'Top-performing suppliers get featured placement that drives more admin wholesale demand.',
  },
];

const faqs = [
  {
    q: 'Is there a fee to join as a farmer?',
    a: 'No. Joining the FreshMart Farmer network is completely free. We only partner with quality-vetted suppliers.',
  },
  {
    q: 'How long does the verification take?',
    a: "Most applications are reviewed within 1-2 business days. You'll be notified via your registered email.",
  },
  {
    q: 'What documents do I need for KYC?',
    a: 'You need a valid Government-issued ID (Aadhar, PAN, Voter ID) or a Farm / Business License.',
  },
  {
    q: 'Can I submit multiple types of produce?',
    a: 'Absolutely! Once verified, you can list as many different wholesale supply offers as your farm produces.',
  },
  {
    q: 'Who handles payments?',
    a: 'The admin manages all end-customer transactions. You receive wholesale payouts directly from FreshMart.',
  },
];

const BecomeAFarmer = () => {
  return (
    <div className="bg-white overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[160px] opacity-10" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-green-400 rounded-full blur-[120px] opacity-10" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-40 flex flex-col lg:flex-row items-center gap-16">
          <motion.div className="flex-1 text-center lg:text-left" initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-emerald-500/30 mb-8">
              <Sprout size={14} /> Supplier Partner Program
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
              Grow Your Farm<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                Business With Us
              </span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
              Partner with FreshMart as a verified wholesale supplier. Submit your produce, get approved, and start earning — while we handle everything else.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                to="/farmer-signup"
                className="group inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm uppercase tracking-widest px-8 py-5 rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all hover:-translate-y-1"
              >
                Join as a Farmer
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-bold text-sm transition-colors"
              >
                See How It Works <ChevronRight size={16} />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 grid grid-cols-2 gap-4 max-w-sm w-full"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            {[
              { label: 'Verified Partners', value: '200+', icon: BadgeCheck },
              { label: 'Avg. Payout Time', value: '48 hrs', icon: Banknote },
              { label: 'Product Accepted', value: '95%', icon: TrendingUp },
              { label: 'Cities Served', value: '30+', icon: Truck },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mx-auto mb-3">
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-black text-white mb-1">{value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <motion.div className="text-center mb-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-4">Simple Process</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">How It Works</h2>
          <p className="text-slate-500 text-lg font-medium mt-4 max-w-xl mx-auto">From signup to your first approved supply offer in just 4 easy steps.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="relative bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <span className="text-[80px] font-black text-slate-100 leading-none absolute top-4 right-6 select-none group-hover:text-emerald-100 transition-colors">{s.step}</span>
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200 relative z-10">
                <s.icon size={26} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3 relative z-10">{s.title}</h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed relative z-10">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── BENEFITS ─── */}
      <section className="bg-slate-900 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[160px] opacity-5" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-4">Why Join Us</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Benefits for Farmers</h2>
            <p className="text-slate-400 text-lg font-medium mt-4 max-w-xl mx-auto">Everything you need to grow a successful supply business — on your terms.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className={`w-14 h-14 ${b.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <b.icon size={24} />
                </div>
                <h3 className="text-lg font-black text-white mb-3">{b.title}</h3>
                <p className="text-sm font-medium text-slate-400 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-4">FAQs</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Common Questions</h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <motion.details
              key={f.q}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group bg-slate-50 border border-slate-100 rounded-3xl p-6 cursor-pointer open:shadow-xl open:bg-white open:border-emerald-100 transition-all"
            >
              <summary className="text-base font-black text-slate-900 list-none flex items-center justify-between gap-4">
                {f.q}
                <ChevronRight size={18} className="text-slate-400 shrink-0 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-4 text-sm font-medium text-slate-500 leading-relaxed">{f.a}</p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="relative bg-gradient-to-r from-emerald-600 to-green-500 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full opacity-5" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-black rounded-full opacity-10" />
        </div>
        <motion.div
          className="relative max-w-3xl mx-auto px-6 text-center text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <Sprout size={56} className="mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Ready to Partner With Us?</h2>
          <p className="text-green-100 text-lg font-medium leading-relaxed mb-10 max-w-xl mx-auto">
            Join hundreds of verified farmers already supplying fresh produce on FreshMart. It&apos;s free, fast, and fair.
          </p>
          <Link
            to="/signup?role=farmer"
            className="group inline-flex items-center gap-3 bg-white text-emerald-700 font-black text-sm uppercase tracking-widest px-10 py-5 rounded-2xl shadow-2xl hover:shadow-emerald-800/30 hover:-translate-y-1 transition-all"
          >
            Get Started — It&apos;s Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
};

export default BecomeAFarmer;
