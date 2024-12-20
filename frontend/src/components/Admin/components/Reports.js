import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBooking, setFilteredBooking] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Show 5 items per page
  const [show, setShow] = useState(true)
  const navigate = useNavigate();

  

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:4000/Abookings/Reports');
      setBookings(response.data.rows || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = bookings.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleFilter = () => {
    const booking = bookings.find((b) => b.bookingid === parseInt(filterValue));
    setFilteredBooking(booking || null);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 20 }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 20, color: 'red' }}>{error}</p>;

     return (
    <div style={{ margin: 20 }}>

      {/* Filter Section */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Enter Booking ID"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: 5,
            width: '300px',
            marginRight: 10,
          }}
        />
        <button
          onClick={handleFilter}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>
    
    

      {/* Filtered Booking Details */}
      {filteredBooking && (
        <div style={{ marginTop: 30, border: '1px solid #ddd', padding: 20, borderRadius: 5 }}>
          <h2>Booking Details</h2>
          <p><strong>Booking ID:</strong> {filteredBooking.bookingid}</p>
          <p><strong>Report ID:</strong> {filteredBooking.reportid}</p>
          <p><strong>User ID:</strong> {filteredBooking.user_id}</p>
          <p><strong>Status:</strong> {filteredBooking.status}</p>
          <p><strong>Message:</strong> {filteredBooking.message}</p>
          <p><strong>Report Date:</strong> {new Date(filteredBooking.created_at).toLocaleDateString()}</p>
        </div>
      )}
      {/* All Bookings Table */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ textAlign: 'center' }}>All Bookings</h2>
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Report ID</th>
              <th>User ID</th>
              <th>Message</th>
              <th>Report Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.bookingid}</td>
                <td>{booking.reportid}</td>
                <td>{booking.user_id}</td>
                <td>{booking.message}</td>
                <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          style={{
            padding: '10px 20px',
            marginRight: 10,
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          style={{
            padding: '10px 20px',
            marginLeft: 10,
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          Next
        </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;