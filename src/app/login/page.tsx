"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Container
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    password: '',
    role: 'member' as 'member' | 'admin'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const { login, register } = useAuth();
  const router = useRouter();

  const validateField = (name: string, value: string) => {
    const errors: {[key: string]: string} = {};
    
    switch (name) {
      case 'name':
        if (!value.trim()) errors.name = 'Name is required';
        break;
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
          errors.email = 'Please add a valid email';
        }
        break;
      case 'tel':
        if (!value.trim()) errors.tel = 'Phone number is required';
        break;
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        }
        break;
    }
    
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    
    // Validate all fields for registration
    if (!isLogin) {
      const allErrors: {[key: string]: string} = {};
      
      Object.assign(allErrors, validateField('name', formData.name));
      Object.assign(allErrors, validateField('email', formData.email));
      Object.assign(allErrors, validateField('tel', formData.tel));
      Object.assign(allErrors, validateField('password', formData.password));
      
      if (Object.keys(allErrors).length > 0) {
        setValidationErrors(allErrors);
        return;
      }
    } else {
      // Validate email and password for login
      const allErrors: {[key: string]: string} = {};
      Object.assign(allErrors, validateField('email', formData.email));
      Object.assign(allErrors, validateField('password', formData.password));
      
      if (Object.keys(allErrors).length > 0) {
        setValidationErrors(allErrors);
        return;
      }
    }

    setLoading(true);

    try {
      let success = false;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(formData.name, formData.email, formData.tel, formData.password, formData.role);
      }

      if (success) {
        router.push('/');
      } else {
        setError(isLogin ? 'Invalid email or password' : 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {isLogin ? 'Sign In' : 'Register'}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {!isLogin && (
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                margin="normal"
                required
                error={!!validationErrors.name}
                helperText={validationErrors.name}
              />
            )}
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            
            {!isLogin && (
              <TextField
                fullWidth
                label="Phone Number"
                name="tel"
                value={formData.tel}
                onChange={handleInputChange}
                margin="normal"
                required
                error={!!validationErrors.tel}
                helperText={validationErrors.tel}
              />
            )}
            
            {!isLogin && (
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'member' | 'admin' })}
                >
                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            )}
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required
              error={!!validationErrors.password}
              helperText={validationErrors.password}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: 'black', '&:hover': { backgroundColor: '#333' } }}
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Register')}
            </Button>
            
            <Box textAlign="center">
              <Button
                variant="text"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ name: '', email: '', tel: '', password: '', role: 'member' });
                }}
                sx={{ color: 'black' }}
              >
                {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}