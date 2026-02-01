import React, { useState, useEffect, useMemo } from 'react';
import { getEmployees, getAttendance, markAttendance } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Calendar, CheckCircle, XCircle, AlertCircle, Filter, BarChart3 } from 'lucide-react';

const AttendancePage = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empData, attData] = await Promise.all([getEmployees(), getAttendance()]);
      setEmployees(empData);
      setAttendanceRecords(attData);
      // Set default employee if available
      if (empData.length > 0) {
        setFormData(prev => ({ ...prev, employee_id: empData[0].id }));
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newAttendance = await markAttendance(formData);
      setAttendanceRecords([...attendanceRecords, newAttendance]);
      toast.success('Attendance marked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to mark attendance.');
      console.error(err);
    }
  };

  // Helper to find employee name by ID
  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.full_name : 'Unknown Employee';
  };

  // Helper to find employee details by ID for the ID column
  const getEmployeeDetails = (id) => {
      return employees.find(e => e.id === id);
  };

  // Filter attendance records by date (empty filterDate = show all)
  const filteredRecords = useMemo(() => {
    if (!filterDate) return attendanceRecords.slice().reverse();
    return attendanceRecords
      .filter((record) => record.date === filterDate)
      .slice()
      .reverse();
  }, [attendanceRecords, filterDate]);

  // Total present days per employee (from all records)
  const presentDaysByEmployee = useMemo(() => {
    const counts = {};
    attendanceRecords.forEach((record) => {
      if (record.status === 'Present') {
        counts[record.employee_id] = (counts[record.employee_id] || 0) + 1;
      }
    });
    return employees.map((emp) => ({
      ...emp,
      presentDays: counts[emp.id] || 0,
    })).sort((a, b) => b.presentDays - a.presentDays);
  }, [attendanceRecords, employees]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Attendance Management</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mark Attendance Form */}
        <div className="bg-white shadow rounded-lg p-6 border border-gray-200 h-fit">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Mark Attendance
          </h2>
          
          {employees.length === 0 ? (
            <p className="text-sm text-gray-500">Please add employees first to mark attendance.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee</label>
                <select
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.employee_id})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Attendance
              </button>
            </form>
          )}
        </div>

        {/* Attendance Records List */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Attendance Records</h2>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <label htmlFor="filter-date" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by date
              </label>
              <input
                id="filter-date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
              {filterDate && (
                <button
                  type="button"
                  onClick={() => setFilterDate('')}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredRecords.length === 0 ? (
             <div className="text-center py-12">
               <p className="text-sm text-gray-500">
                 {filterDate ? `No attendance records for ${filterDate}.` : 'No attendance records found.'}
               </p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => {
                      const empDetails = getEmployeeDetails(record.employee_id);
                      return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {getEmployeeName(record.employee_id)}
                            </div>
                            <div className="text-sm text-gray-500">
                                {empDetails?.employee_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status === 'Present' ? (
                              <span className="flex items-center gap-1">
                                  <CheckCircle size={12} /> Present
                              </span>
                          ) : (
                              <span className="flex items-center gap-1">
                                  <XCircle size={12} /> Absent
                              </span>
                          )}
                        </span>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Total present days per employee */}
      <div className="mt-8 bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <BarChart3 size={20} />
            Total Present Days per Employee
          </h2>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : presentDaysByEmployee.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No employees yet. Add employees and mark attendance to see totals.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Present days
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {presentDaysByEmployee.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {emp.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {emp.employee_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {emp.presentDays}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
