import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useEmployees } from '../../hooks/useEmployees';
import './AddEmployeeDialog.css';

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { addEmployee, loading, error } = useEmployees();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    position: '',
    employment_type: '',
    start_date: '',
    salary: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmploymentTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      employment_type: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        department: formData.department,
        position: formData.position,
        employment_type: formData.employment_type,
        start_date: formData.start_date,
        salary: parseFloat(formData.salary)
      };
      console.log('Submitting employee data:', data);
      
      // Call onSubmit directly instead of addEmployee
      onSubmit(data);
      onClose();
    } catch (error: any) {
      console.error('Error adding employee:', error);
      // Only show error if it's not a successful response
      if (error.message !== 'Email already exists') {
        alert(error.message || 'Failed to add employee. Please try again.');
      }
    }
  };

  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>Add New Employee</h2>
          <Button variant="ghost" onClick={onClose}>
            ×
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Position *</label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="employment_type">Employment Type *</label>
              <select
                id="employment_type"
                name="employment_type"
                value={formData.employment_type}
                onChange={(e) => handleEmploymentTypeChange(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select employment type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="start_date">Start Date *</label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="salary">Monthly Salary (₱) *</label>
              <Input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="dialog-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeDialog; 