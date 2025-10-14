import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import StaffTable from '../Components/StaffTable';
import axios from 'axios';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newDriver, setNewDriver] = useState({
    driver_id: '',
    name: '',
    address: '',
    phone_no: '',
    email: ''
  });

  const columns = [
    { id: 'driver_id', label: 'Driver ID' },
    { id: 'name', label: 'Name' },
    { id: 'address', label: 'Address' },
    { id: 'phone_no', label: 'Phone Number' },
    { id: 'email', label: 'Email' }
  ];

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('/api/drivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleAddDriver = async () => {
    try {
      await axios.post('/api/drivers', newDriver);
      setAddDialogOpen(false);
      setNewDriver({
        driver_id: '',
        name: '',
        address: '',
        phone_no: '',
        email: ''
      });
      fetchDrivers();
    } catch (error) {
      console.error('Error adding driver:', error);
    }
  };

  const handleEditDriver = async (id, updatedData) => {
    try {
      await axios.put(`/api/drivers/${id}`, updatedData);
      fetchDrivers();
    } catch (error) {
      console.error('Error updating driver:', error);
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      await axios.delete(`/api/drivers/${id}`);
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4, mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Drivers</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Driver
        </Button>
      </Box>

      <StaffTable
        data={drivers}
        columns={columns}
        onEdit={handleEditDriver}
        onDelete={handleDeleteDriver}
        type="driver"
      />

      {/* Add Driver Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Driver</DialogTitle>
        <DialogContent>
          {columns.map((column) => (
            <TextField
              key={column.id}
              margin="dense"
              label={column.label}
              fullWidth
              value={newDriver[column.id]}
              onChange={(e) => setNewDriver({ ...newDriver, [column.id]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddDriver} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Drivers;