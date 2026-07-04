import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import gsap from 'gsap';

const Booking = () => {
  // Database States
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selection States
  const [selectedDate, setSelectedDate] = useState(null); // stores date string, e.g. '2026-06-25'
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // stores slot object
  const [meetingType, setMeetingType] = useState('online');

  // Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('');
  const [guests, setGuests] = useState([]);

  // UI Status
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSlots();

    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-up', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );
    });
    return () => ctx.revert();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('available_slots')
        .select('*')
        .eq('is_booked', false)
        .gte('date', today)
        .order('date', { ascending: true })
        .order('time_slot', { ascending: true });

      if (error) throw error;
      setSlots(data || []);
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group slots by date
  const uniqueDates = [...new Set(slots.map(slot => slot.date))];

  // Times available for the selected date
  const timesForSelectedDate = selectedDate
    ? slots.filter(slot => slot.date === selectedDate)
    : [];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTimeSlot) return;

    setSubmitting(true);
    try {
      // 1. Insert booking record
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          slot_id: selectedTimeSlot.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          interest: interest,
          meeting_type: meetingType,
          guests: guests
        });

      if (bookingError) throw bookingError;

      // 2. Mark the slot as booked
      const { error: slotError } = await supabase
        .from('available_slots')
        .update({ is_booked: true })
        .eq('id', selectedTimeSlot.id);

      if (slotError) throw slotError;

      setSuccess(true);
      setTimeout(() => {
        gsap.fromTo('.success-reveal', 
          { scale: 0.9, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );
      }, 50);

    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Booking failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setInterest('');
    setGuests([]);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setSuccess(false);
    fetchSlots();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      
      {/* Left Pane - Sticky Visual (Hidden on Mobile) */}
      <div className="d-none d-md-flex" style={{ 
        flex: 1, 
        position: 'sticky', 
        top: 0, 
        height: '100vh', 
        padding: '3rem', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        borderRight: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src="/assets/hero_3d.png" alt="Architecture" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)' }}></div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, marginTop: '80px' }}>
          <h1 className="display-1 reveal-up" style={{ marginBottom: '1rem' }}>Book a meeting.</h1>
          <p className="text-grey reveal-up" style={{ fontSize: '1.2rem', maxWidth: '400px', lineHeight: 1.6 }}>
            Schedule a technical alignment with our architecture team. We don't do sales pitches, we architect solutions.
          </p>
        </div>

        <div className="reveal-up" style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: 'var(--text-grey)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Duration</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>2 Hours</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-grey)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Email us</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}><a href="mailto:info@bena-tech.com" style={{ color: 'inherit', textDecoration: 'none' }}>info@bena-tech.com</a></p>
          </div>
          <div>
            <p style={{ color: 'var(--text-grey)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>WhatsApp</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}><a href="https://wa.me/966502600558" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>+966 50 260 0558</a></p>
          </div>
        </div>
      </div>

      {/* Right Pane - Scrollable Booking Flow */}
      <div style={{ flex: 1, padding: '8rem 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          
          <h2 className="reveal-up d-md-none display-2" style={{ marginBottom: '3rem' }}>Book Meeting</h2>

          {success ? (
            /* Success State */
            <div className="success-reveal" style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ 
                width: '72px', 
                height: '72px', 
                borderRadius: '50%', 
                background: 'rgba(231, 73, 4, 0.1)', 
                border: '1px solid var(--primary-orange)', 
                color: 'var(--primary-orange)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '2.5rem',
                margin: '0 auto 2rem auto'
              }}>
                ✓
              </div>
              <h3 className="display-2" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Booking Confirmed.</h3>
              <p style={{ color: 'var(--text-grey)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                Your meeting has been locked in for <strong>{new Date(selectedTimeSlot?.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong> at <strong>{selectedTimeSlot?.time_slot}</strong>. A Google Calendar invitation has been queued for your inbox.
              </p>
              <button onClick={resetForm} className="btn btn-secondary" style={{ padding: '0.8rem 2rem' }}>
                Schedule Another Meeting
              </button>
            </div>
          ) : (
            /* Booking Form Flow */
            <form onSubmit={handleBookingSubmit}>
              {/* Step 1: Details */}
              <div className="reveal-up" style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--text-white)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>1</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 500 }}>Client Details</h3>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <input 
                    type="text" 
                    required 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name" 
                    style={{ flex: 1, padding: '1.2rem', background: 'transparent', border: '1px solid var(--border-color)', borderBottom: '1px solid var(--text-grey)', color: 'var(--text-white)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }} 
                  />
                  <input 
                    type="text" 
                    required 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name" 
                    style={{ flex: 1, padding: '1.2rem', background: 'transparent', border: '1px solid var(--border-color)', borderBottom: '1px solid var(--text-grey)', color: 'var(--text-white)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }} 
                  />
                </div>
                
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work Email" 
                  style={{ width: '100%', padding: '1.2rem', background: 'transparent', border: '1px solid var(--border-color)', borderBottom: '1px solid var(--text-grey)', color: 'var(--text-white)', fontSize: '1rem', outline: 'none', marginBottom: '1.5rem', transition: 'border-color 0.3s' }} 
                />

                {/* Guest List Section */}
                <div style={{ marginBottom: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: guests.length > 0 ? '1.2rem' : '0' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Additional Guests</span>
                    <button 
                      type="button" 
                      onClick={() => setGuests([...guests, { name: '', email: '' }])}
                      style={{ background: 'transparent', border: 'none', color: 'var(--primary-orange)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', outline: 'none' }}
                    >
                      + Add Guest
                    </button>
                  </div>

                  {guests.map((guest, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: index === guests.length - 1 ? '0' : '1rem' }}>
                      <input 
                        type="text" 
                        required 
                        value={guest.name}
                        onChange={(e) => {
                          const newGuests = [...guests];
                          newGuests[index].name = e.target.value;
                          setGuests(newGuests);
                        }}
                        placeholder="Guest Name" 
                        style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid var(--border-color)', borderBottom: '1px solid var(--text-grey)', color: 'var(--text-white)', fontSize: '0.9rem', outline: 'none' }} 
                      />
                      <input 
                        type="email" 
                        required 
                        value={guest.email}
                        onChange={(e) => {
                          const newGuests = [...guests];
                          newGuests[index].email = e.target.value;
                          setGuests(newGuests);
                        }}
                        placeholder="Guest Email" 
                        style={{ flex: 1.2, padding: '0.8rem', background: 'transparent', border: '1px solid var(--border-color)', borderBottom: '1px solid var(--text-grey)', color: 'var(--text-white)', fontSize: '0.9rem', outline: 'none' }} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setGuests(guests.filter((_, i) => i !== index))}
                        style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.4rem', outline: 'none', display: 'flex', alignItems: 'center' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <select 
                  required 
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  style={{ width: '100%', padding: '1.2rem', background: 'transparent', border: '1px solid var(--border-color)', borderBottom: '1px solid var(--text-grey)', color: 'var(--text-white)', fontSize: '1rem', outline: 'none', appearance: 'none' }}
                >
                  <option value="" disabled style={{ background: '#000' }}>Select Primary Interest...</option>
                  <option value="web" style={{ background: '#000' }}>Web Development</option>
                  <option value="automation" style={{ background: '#000' }}>Business Automation</option>
                  <option value="mobile" style={{ background: '#000' }}>Mobile Systems</option>
                  <option value="erp" style={{ background: '#000' }}>Enterprise Resource Planning</option>
                </select>
              </div>

              {/* Step 2: Time */}
              <div className="reveal-up" style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--text-white)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>2</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 500 }}>Select Availability</h3>
                </div>

                {loading ? (
                  <p style={{ color: 'var(--text-grey)', fontSize: '0.9rem' }}>Loading open sessions...</p>
                ) : uniqueDates.length === 0 ? (
                  <p style={{ color: 'var(--text-grey)', fontSize: '0.9rem', padding: '1rem 0' }}>No available dates published at the moment. Please contact us directly at info@bena-tech.com.</p>
                ) : (
                  <>
                    {/* Date horizontal selector */}
                    <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem', scrollbarWidth: 'none' }}>
                      {uniqueDates.map((dateStr) => {
                        const dateObj = new Date(dateStr);
                        const isSelected = selectedDate === dateStr;
                        return (
                          <button 
                            key={dateStr} 
                            type="button"
                            onClick={() => {
                              setSelectedDate(dateStr);
                              setSelectedTimeSlot(null); // Reset time when date changes
                            }} 
                            style={{ 
                              minWidth: '80px', 
                              padding: '1rem 0', 
                              borderRadius: '12px', 
                              border: `1px solid ${isSelected ? 'var(--primary-orange)' : 'var(--border-color)'}`, 
                              background: isSelected ? 'rgba(231,73,4,0.1)' : 'transparent', 
                              color: isSelected ? 'var(--primary-orange)' : 'var(--text-white)', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              gap: '8px', 
                              cursor: 'pointer', 
                              transition: 'all 0.2s' 
                            }}
                          >
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <span style={{ fontSize: '1.4rem', fontWeight: 500 }}>{dateObj.getDate()}</span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Time slots selector */}
                    <div style={{ opacity: selectedDate !== null ? 1 : 0.3, pointerEvents: selectedDate !== null ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                        {timesForSelectedDate.map((slot) => {
                          const isSelected = selectedTimeSlot?.id === slot.id;
                          return (
                            <button 
                              key={slot.id} 
                              type="button"
                              onClick={() => setSelectedTimeSlot(slot)} 
                              style={{ 
                                padding: '1.2rem', 
                                borderRadius: '12px', 
                                border: `1px solid ${isSelected ? 'var(--primary-orange)' : 'var(--border-color)'}`, 
                                background: isSelected ? 'var(--primary-orange)' : 'transparent', 
                                color: 'var(--text-white)', 
                                cursor: 'pointer', 
                                transition: 'all 0.2s', 
                                fontWeight: 500 
                              }}
                            >
                              {slot.time_slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button 
                type="submit"
                className="btn btn-primary reveal-up" 
                disabled={submitting || !selectedTimeSlot}
                style={{ 
                  width: '100%', 
                  opacity: selectedTimeSlot ? 1 : 0.5, 
                  pointerEvents: selectedTimeSlot ? 'auto' : 'none', 
                  padding: '1.2rem' 
                }}
              >
                {submitting ? 'Initiating...' : 'Confirm Schedule'}
              </button>
            </form>
          )}

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .d-md-flex { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Booking;
