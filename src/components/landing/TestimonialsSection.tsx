import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, CheckCircle, Stethoscope, HeartPulse, Building, ShieldCheck } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 'test-1',
      name: 'Dr. Priya Rao',
      role: 'Chief Cardiologist, Heart & Vascular Sciences',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
      tag: 'Clinical Specialist',
      quote:
        'SmartCare Cloud has eliminated the friction of missing consultation records and manual phone scheduling. Reviewing longitudinal ECG trends and past prescriptions before an in-person consultation takes seconds instead of tracking paper charts.',
      rating: 5,
      institution: 'Metro Heart Institute',
    },
    {
      id: 'test-2',
      name: 'Aarav Kumar',
      role: 'Outpatient Cardiac & Preventive Care Patient',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      tag: 'Patient Experience',
      quote:
        'Booking an appointment with my cardiologist took less than a minute on my phone. Being able to download certified PDF consultation summaries and verify doctor instructions from home gives my family complete peace of mind.',
      rating: 5,
      institution: 'Patient since 2025',
    },
    {
      id: 'test-3',
      name: 'Dr. Vikram Sen',
      role: 'Head of Neurosciences & Spine Center',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
      tag: 'Department Head',
      quote:
        'The role-based security boundaries are exemplary. Clinicians obtain fast access to relevant neurology diagnostics while administrative audit logs guarantee patient privacy and statutory compliance at every step.',
      rating: 5,
      institution: 'Regional Neuroscience Center',
    },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-white border-b border-slate-200/80 relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-50 text-amber-900 border border-amber-200/80"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Clinical & Patient Testimonials</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Trusted by Doctors. Loved by Patients.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-base text-slate-600 leading-relaxed"
          >
            Discover how centralizing patient health records in the cloud elevates care delivery and patient outcomes.
          </motion.p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 border border-slate-200/80 rounded-3xl p-7 flex flex-col justify-between hover:border-slate-300 transition-all duration-200 shadow-xs hover:shadow-md"
            >
              <div>
                {/* Rating stars and quote mark */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-300" />
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80 flex items-center gap-3.5">
                <img
                  src={item.avatar}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 truncate">{item.role}</p>
                  <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                    {item.institution}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
