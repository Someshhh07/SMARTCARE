import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Appointment } from '../../types';
import { api } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { BookAppointmentModal } from './BookAppointmentModal';

export const AppointmentsView: React.FC = () => {
  const { user, role, showToast } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [searchFilter, setSearchFilter] = useState('');
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await api.getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment in the Cloud Database?')) return;
    try {
      const updated = await api.updateAppointmentStatus(id, 'cancelled');
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('Appointment cancelled successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to cancel appointment');
    }
  };

  const handleMarkCompleted = async (id: string) => {
    try {
      const updated = await api.updateAppointmentStatus(id, 'completed');
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('Appointment marked as completed.');
    } catch (err: any) {
      alert(err.message || 'Failed to update appointment');
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    // Tab filter
    if (activeTab === 'upcoming' && appt.status !== 'confirmed') return false;
    if (activeTab === 'completed' && appt.status !== 'completed') return false;
    if (activeTab === 'cancelled' && appt.status !== 'cancelled') return false;

    // Search filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchDoc = appt.doctorName.toLowerCase().includes(q);
      const matchPatient = appt.patientName.toLowerCase().includes(q);
      const matchDept = appt.department.toLowerCase().includes(q);
      return matchDoc || matchPatient || matchDept;
    }
    return true;
  });

  return (
    <div id="appointments-view" className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Appointments</h2>
          <p className="text-xs text-slate-500">
            Manage consultations, outpatient slots, and telemedicine appointments.
          </p>
        </div>

        <button
          id="book-new-appointment-btn"
          onClick={() => setBookModalOpen(true)}
          className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all duration-150 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming (
            {appointments.filter((a) => a.status === 'confirmed').length}
            )
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed (
            {appointments.filter((a) => a.status === 'completed').length}
            )
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              activeTab === 'cancelled'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled (
            {appointments.filter((a) => a.status === 'cancelled').length}
            )
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search by doctor or specialty..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-150"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Appointment Cards List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading appointments...</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No appointments in this view</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are no {activeTab} appointments matching your current filter criteria.
          </p>
          <button
            onClick={() => setBookModalOpen(true)}
            className="px-4.5 py-2 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-semibold hover:bg-blue-100/80 cursor-pointer transition-colors duration-150"
          >
            Schedule New Visit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAppointments.map((appt) => {
            const isConfirmed = appt.status === 'confirmed';
            const isCompleted = appt.status === 'completed';
            const isCancelled = appt.status === 'cancelled';

            return (
              <div
                key={appt.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
                      {appt.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        isConfirmed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                          : isCompleted
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/80'
                          : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>

                  <div className="py-3 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                      {appt.doctorName.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{appt.doctorName}</h4>
                      <p className="text-xs text-slate-500 font-medium">{appt.department}</p>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>Patient: {appt.patientName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{appt.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{appt.time}</span>
                    </div>
                    {appt.notes && (
                      <p className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60 italic">
                        "{appt.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedAppointment(appt)}
                    className="text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer transition-colors duration-150"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {isConfirmed && (
                      <>
                        {role === 'doctor' && (
                          <button
                            onClick={() => handleMarkCompleted(appt.id)}
                            className="text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer transition-colors duration-150"
                          >
                            Mark Done
                          </button>
                        )}
                        <button
                          onClick={() => handleCancel(appt.id)}
                          className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer transition-colors duration-150"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Appointment Record
              </span>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Appointment ID:</span>
                <span className="font-mono font-bold text-slate-900">{selectedAppointment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold uppercase text-blue-700">{selectedAppointment.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Attending Doctor:</span>
                <span className="font-semibold text-slate-900">{selectedAppointment.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-semibold text-slate-900">{selectedAppointment.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient:</span>
                <span className="font-semibold text-slate-900">{selectedAppointment.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled Time:</span>
                <span className="font-bold text-blue-800">
                  {selectedAppointment.date} at {selectedAppointment.time}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1 font-medium">Clinical Notes:</span>
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-slate-700">
                  {selectedAppointment.notes || 'Routine consultation.'}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors duration-150"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSuccess={() => {
          loadAppointments();
        }}
      />
    </div>
  );
};
