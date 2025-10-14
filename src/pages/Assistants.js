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

const Assistants = () => {
  const [assistants, setAssistants] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newAssistant, setNewAssistant] = useState({
    assistant_id: '',
    name: '',
    address: '',
    phone_no: '',
    email: ''
  });

  const columns = [
    { id: 'assistant_id', label: 'Assistant ID' },
    { id: 'name', label: 'Name' },
    { id: 'address', label: 'Address' },
    { id: 'phone_no', label: 'Phone Number' },
    { id: 'email', label: 'Email' }
  ];

  useEffect(() => {
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      const response = await axios.get('/api/assistants');
      setAssistants(response.data);
    } catch (error) {
      console.error('Error fetching assistants:', error);
    }
  };

  const handleAddAssistant = async () => {
    try {
      await axios.post('/api/assistants', newAssistant);
      setAddDialogOpen(false);
      setNewAssistant({
        assistant_id: '',
        name: '',
        address: '',
        phone_no: '',
        email: ''
      });
      fetchAssistants();
    } catch (error) {
      console.error('Error adding assistant:', error);
    }
  };

  const handleEditAssistant = async (id, updatedData) => {
    try {
      await axios.put(`/api/assistants/${id}`, updatedData);
      fetchAssistants();
    } catch (error) {
      console.error('Error updating assistant:', error);
    }
  };

  const handleDeleteAssistant = async (id) => {
    try {
      await axios.delete(`/api/assistants/${id}`);
      fetchAssistants();
    } catch (error) {
      console.error('Error deleting assistant:', error);
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4, mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Assistants</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Assistant
        </Button>
      </Box>

      <StaffTable
        data={assistants}
        columns={columns}
        onEdit={handleEditAssistant}
        onDelete={handleDeleteAssistant}
        type="assistant"
      />

      {/* Add Assistant Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Assistant</DialogTitle>
        <DialogContent>
          {columns.map((column) => (
            <TextField
              key={column.id}
              margin="dense"
              label={column.label}
              fullWidth
              value={newAssistant[column.id]}
              onChange={(e) => setNewAssistant({ ...newAssistant, [column.id]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddAssistant} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Assistants;