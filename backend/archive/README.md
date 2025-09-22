# Archive Directory

This directory contains database setup and migration scripts that were used during development but are no longer needed for regular operation.

## Files Archived

### Table Creation Scripts
- `create-tables.js` - Initial table creation script for truck, routes, warehouses, inventory tables
- `create-additional-tables.js` - Additional tables for train_shipments and truck_deliveries
- `insert-sample-data.js` - Script to populate sample data during development

### Database Migration Scripts  
- `update-driver-table.js` - One-time script to add missing columns to driver table
- `fix-destructuring.js` - One-time script to fix query destructuring patterns

### Diagnostic Scripts
- `check-tables.js` - Script to verify table existence during setup
- `check_credentials.js` - Script to verify user credentials during setup  
- `check_driver_assistant.js` - Script to check driver and assistant data

### Authentication & User Management Utilities
- `generate_password_hashes.js` - Utility to generate bcrypt hashes for development
- `get_all_users.js` - Script to retrieve all users from database
- `insert_simple_credentials.sql` - SQL script for inserting test credentials

### Test & Validation Scripts
- `test_all_logins.js` - Test script for validating all user logins
- `test_login.js` - Individual login validation test
- `test_passwords.js` - Password hashing and validation tests

## Current Active Database Files

The following files remain active in the main backend directory:
- `setup_database.sql` - Main database schema setup
- `scripts/setup-database.js` - Comprehensive database setup script
- `test-db.js` - Simple database connection test
- `config/database.js` - Database connection configuration

## Notes

These archived files are preserved for reference but should not be run against the production database as they may contain outdated schema definitions or could overwrite existing data.