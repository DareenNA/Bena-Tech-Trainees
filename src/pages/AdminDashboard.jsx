import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import gsap from 'gsap';

const TIME_PRESETS = [
  '09:30 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '09:30 PM'
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'slots'
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Form State for Adding Slots
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [customTime, setCustomTime] = useState('');
  const [addingSlots, setAddingSlots] = useState(false);

  // Message notifications
  const [notification, setNotification] = useState(null);

  // Form State for Sending Emails
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailName, setEmailName] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('general'); // 'general' or 'acceptance'
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    // Initial fetch
    fetchBookings();
    fetchSlots();

    gsap.fromTo('.reveal-up', 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out' }
    );
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      // Query bookings and join availability slots to get the date and time
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          available_slots (
            date,
            time_slot
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      showNotification(err.message, 'error');
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const { data, error } = await supabase
        .from('available_slots')
        .select('*')
        .order('date', { ascending: true })
        .order('time_slot', { ascending: true });

      if (error) throw error;
      setSlots(data || []);
    } catch (err) {
      console.error('Error fetching slots:', err);
      showNotification(err.message, 'error');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleTimeToggle = (time) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(t => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const handleAddCustomTime = (e) => {
    e.preventDefault();
    if (!customTime.trim()) return;
    if (!selectedTimes.includes(customTime.trim())) {
      setSelectedTimes([...selectedTimes, customTime.trim()]);
    }
    setCustomTime('');
  };

  const handleCreateSlots = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      showNotification('Please select a date', 'error');
      return;
    }
    if (selectedTimes.length === 0) {
      showNotification('Please select or add at least one time slot', 'error');
      return;
    }

    setAddingSlots(true);
    try {
      // Construct slot entries
      const slotEntries = selectedTimes.map(time => ({
        date: selectedDate,
        time_slot: time,
        is_booked: false
      }));

      const { error } = await supabase
        .from('available_slots')
        .insert(slotEntries);

      if (error) throw error;

      showNotification(`Successfully created ${selectedTimes.length} slots for ${selectedDate}`);
      setSelectedDate('');
      setSelectedTimes([]);
      fetchSlots();
    } catch (err) {
      console.error('Error creating slots:', err);
      showNotification(err.message, 'error');
    } finally {
      setAddingSlots(false);
    }
  };

  const handleDeleteSlot = async (slotId, isBooked) => {
    const confirmMessage = isBooked 
      ? "Warning: This slot is already booked by a client. Deleting it will delete the booking record as well. Are you sure?" 
      : "Are you sure you want to delete this available slot?";
      
    if (!window.confirm(confirmMessage)) return;

    try {
      const { error } = await supabase
        .from('available_slots')
        .delete()
        .eq('id', slotId);

      if (error) throw error;

      showNotification('Slot deleted successfully');
      fetchSlots();
      fetchBookings(); // Refetch bookings in case a booked slot was deleted
    } catch (err) {
      console.error('Error deleting slot:', err);
      showNotification(err.message, 'error');
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailRecipient.trim()) {
      showNotification('Please enter a recipient email address', 'error');
      return;
    }
    if (!emailSubject.trim()) {
      showNotification('Please enter a subject', 'error');
      return;
    }
    if (!emailMessage.trim()) {
      showNotification('Please enter a message body', 'error');
      return;
    }

    setSendingEmail(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-custom-email', {
        body: {
          to: emailRecipient.trim(),
          name: emailName.trim(),
          subject: emailSubject.trim(),
          message: emailMessage,
          templateType: emailTemplate
        }
      });

      if (error) throw error;

      showNotification('🎉 Email sent successfully!');
      // Clear fields on success except the sender info
      setEmailRecipient('');
      setEmailName('');
      setEmailSubject('');
      setEmailMessage('');
    } catch (err) {
      console.error('Error sending email:', err);
      showNotification(err.message || 'Failed to send email. Ensure the Edge Function is deployed.', 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-color)',
      color: 'var(--text-white)',
      padding: '2rem',
      position: 'relative'
    }}>
      <div className="ambient-light" style={{ opacity: 0.7 }}></div>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          zIndex: 9999,
          background: notification.type === 'error' ? 'rgba(231, 73, 4, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          color: notification.type === 'error' ? '#fff' : '#000',
          padding: '1rem 2rem',
          borderRadius: '12px',
          fontWeight: 500,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {notification.message}
          <style>{`
            @keyframes slideIn {
              from { transform: translateY(-20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* Header */}
      <header className="reveal-up" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div>
          <h1 className="display-2" style={{ fontSize: '2rem', margin: 0 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-grey)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>Bena Tech Meeting Administration</p>
        </div>
        <button onClick={handleSignOut} className="btn btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
          Sign Out
        </button>
      </header>

      {/* Main Grid */}
      <div className="bento-grid">
        
        {/* Navigation / Actions Card */}
        <div className="bento-card reveal-up" style={{ gridColumn: 'span 12', padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <button 
              onClick={() => setActiveTab('bookings')} 
              style={{
                padding: '0.8rem 1.8rem',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'bookings' ? 'var(--text-white)' : 'transparent',
                color: activeTab === 'bookings' ? '#000' : 'var(--text-white)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Client Bookings ({bookings.length})
            </button>
            <button 
              onClick={() => setActiveTab('slots')} 
              style={{
                padding: '0.8rem 1.8rem',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'slots' ? 'var(--text-white)' : 'transparent',
                color: activeTab === 'slots' ? '#000' : 'var(--text-white)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Manage Slots ({slots.length})
            </button>
            <button 
              onClick={() => setActiveTab('email')} 
              style={{
                padding: '0.8rem 1.8rem',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'email' ? 'var(--text-white)' : 'transparent',
                color: activeTab === 'email' ? '#000' : 'var(--text-white)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Send Email
            </button>
          </div>
        </div>

        {/* Tab 1: Bookings List */}
        {activeTab === 'bookings' && (
          <div className="bento-card reveal-up" style={{ gridColumn: 'span 12', minHeight: '400px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 500, marginBottom: '2rem' }}>Confirmed Meetings</h3>

            {loadingBookings ? (
              <p style={{ color: 'var(--text-grey)' }}>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p style={{ color: 'var(--text-grey)', textAlign: 'center', padding: '4rem 0' }}>No bookings scheduled yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-grey)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '1rem' }}>Client</th>
                      <th style={{ padding: '1rem' }}>Interest</th>
                      <th style={{ padding: '1rem' }}>Type</th>
                      <th style={{ padding: '1rem' }}>Date</th>
                      <th style={{ padding: '1rem' }}>Time</th>
                      <th style={{ padding: '1rem' }}>Google Calendar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '1.2rem 1rem' }}>
                          <div style={{ fontWeight: 500 }}>{booking.first_name} {booking.last_name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-grey)' }}>{booking.email}</div>
                        </td>
                        <td style={{ padding: '1.2rem 1rem', textTransform: 'capitalize' }}>{booking.interest}</td>
                        <td style={{ padding: '1.2rem 1rem' }}>
                          <span style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            background: booking.meeting_type === 'online' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: booking.meeting_type === 'online' ? '#60a5fa' : '#34d399'
                          }}>
                            {booking.meeting_type === 'online' ? 'Remote' : 'On-site'}
                          </span>
                        </td>
                        <td style={{ padding: '1.2rem 1rem' }}>
                          {booking.available_slots ? new Date(booking.available_slots.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Deleted Slot'}
                        </td>
                        <td style={{ padding: '1.2rem 1rem', fontWeight: 500 }}>
                          {booking.available_slots ? booking.available_slots.time_slot : 'Deleted Slot'}
                        </td>
                        <td style={{ padding: '1.2rem 1rem' }}>
                          {booking.google_event_id ? (
                            <span style={{ color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              ● Synced
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-grey)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              ○ Pending/No Sync
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Slots Manager */}
        {activeTab === 'slots' && (
          <>
            {/* Create Slots Form */}
            <div className="bento-card reveal-up" style={{ gridColumn: 'span 4' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '1.5rem' }}>Add Available Slots</h3>
              
              <form onSubmit={handleCreateSlots} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Select Date */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>1. Select Date</label>
                  <input 
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      color: 'var(--text-white)',
                      fontSize: '1rem',
                      outline: 'none',
                      colorScheme: 'dark'
                    }}
                  />
                </div>

                {/* Pre-defined Times */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>2. Select Times</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {TIME_PRESETS.map((time) => {
                      const isSelected = selectedTimes.includes(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleTimeToggle(time)}
                          style={{
                            padding: '0.8rem',
                            borderRadius: '10px',
                            border: `1px solid ${isSelected ? 'var(--primary-orange)' : 'var(--border-color)'}`,
                            background: isSelected ? 'rgba(231, 73, 4, 0.1)' : 'transparent',
                            color: isSelected ? 'var(--primary-orange)' : 'var(--text-white)',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add Custom Time */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or Add Custom Time</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      placeholder="e.g. 02:30 PM"
                      style={{
                        flex: 1,
                        padding: '0.8rem 1rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        color: 'var(--text-white)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                    <button 
                      type="button"
                      onClick={handleAddCustomTime}
                      style={{
                        padding: '0.8rem 1.2rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-white)',
                        cursor: 'pointer',
                        fontWeight: 500
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Show current selected times */}
                {selectedTimes.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                    {selectedTimes.map(time => (
                      <span key={time} style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid var(--border-color)',
                        padding: '0.3rem 0.7rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {time}
                        <button type="button" onClick={() => handleTimeToggle(time)} style={{ background: 'none', border: 'none', color: 'var(--text-grey)', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                      </span>
                    ))}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={addingSlots}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '1rem', marginTop: '1rem', opacity: addingSlots ? 0.7 : 1 }}
                >
                  {addingSlots ? 'Creating Slots...' : 'Publish Slots'}
                </button>
              </form>
            </div>

            {/* Slots List */}
            <div className="bento-card reveal-up" style={{ gridColumn: 'span 8', minHeight: '400px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '1.5rem' }}>Active & Past Slots</h3>

              {loadingSlots ? (
                <p style={{ color: 'var(--text-grey)' }}>Loading slots...</p>
              ) : slots.length === 0 ? (
                <p style={{ color: 'var(--text-grey)', textAlign: 'center', padding: '4rem 0' }}>No availability slots published yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Group slots by date */}
                  {Object.entries(
                    slots.reduce((groups, slot) => {
                      const date = slot.date;
                      if (!groups[date]) groups[date] = [];
                      groups[date].push(slot);
                      return groups;
                    }, {})
                  ).map(([date, dateSlots]) => (
                    <div key={date} style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      background: 'rgba(255,255,255,0.01)'
                    }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-orange)', marginBottom: '1rem' }}>
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                        {dateSlots.map((slot) => (
                          <div 
                            key={slot.id} 
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.8rem',
                              padding: '0.6rem 1rem',
                              borderRadius: '12px',
                              border: '1px solid var(--border-color)',
                              background: slot.is_booked ? 'rgba(231,73,4,0.03)' : 'rgba(255,255,255,0.02)',
                              position: 'relative'
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: slot.is_booked ? 'var(--text-grey)' : 'var(--text-white)' }}>
                                {slot.time_slot}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: slot.is_booked ? 'var(--primary-orange)' : '#8a8f98' }}>
                                {slot.is_booked ? 'Booked' : 'Available'}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteSlot(slot.id, slot.is_booked)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255, 0, 0, 0.4)',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                padding: '0.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'color 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.color = 'rgba(255, 0, 0, 1)'}
                              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 0, 0, 0.4)'}
                              title="Delete Slot"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Tab 3: Custom Email Sender */}
        {activeTab === 'email' && (
          <div className="bento-card reveal-up" style={{ gridColumn: 'span 12', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 500, marginBottom: '0.5rem' }}>Send Official Email</h3>
            <p style={{ color: 'var(--text-grey)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Send an email styled with the Bena Tech banner and layout to anyone. Perfect for trainee acceptances, client announcements, or general announcements.
            </p>

            <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Template Style */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Style / Template</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setEmailTemplate('general')}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      borderRadius: '12px',
                      border: `1px solid ${emailTemplate === 'general' ? 'var(--primary-orange)' : 'var(--border-color)'}`,
                      background: emailTemplate === 'general' ? 'rgba(231, 73, 4, 0.1)' : 'rgba(255,255,255,0.02)',
                      color: emailTemplate === 'general' ? 'var(--primary-orange)' : 'var(--text-white)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    General Announcement
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailTemplate('acceptance')}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      borderRadius: '12px',
                      border: `1px solid ${emailTemplate === 'acceptance' ? 'var(--primary-orange)' : 'var(--border-color)'}`,
                      background: emailTemplate === 'acceptance' ? 'rgba(231, 73, 4, 0.1)' : 'rgba(255,255,255,0.02)',
                      color: emailTemplate === 'acceptance' ? 'var(--primary-orange)' : 'var(--text-white)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Trainee Acceptance 🎉
                  </button>
                </div>
              </div>

              {/* Recipient Email & Name Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recipient Email(s)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. trainee@example.com (comma separated for multiple)"
                      value={emailRecipient}
                      onChange={(e) => setEmailRecipient(e.target.value)}
                      style={{
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        color: 'var(--text-white)',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recipient Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Ahmad"
                      value={emailName}
                      onChange={(e) => setEmailName(e.target.value)}
                      style={{
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        color: 'var(--text-white)',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Your Bena Tech Training Acceptance Notice"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-white)',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Message Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message Body</label>
                <textarea
                  required
                  rows={8}
                  placeholder={`Write your message here...\nUse new lines to separate paragraphs.\nExample:\nWe are pleased to inform you...\n\nPlease check the attachments...`}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-white)',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sendingEmail}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginTop: '1rem',
                  opacity: sendingEmail ? 0.7 : 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {sendingEmail ? (
                  <>
                    <span className="spinner" style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></span>
                    Sending Email...
                  </>
                ) : 'Send Email ✉'}
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
