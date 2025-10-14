const express = require('express');
const bcrypt = require('bcryptjs');
const database = require('../config/database');

// Test the exact code that was failing
async function testDriverLogin() {
  try {
    console.log('🧪 Testing the exact login flow that was failing...');
    
    const username = 'saman';
    const password = 'password123';
    const role = 'driver';
    
    // This is the exact code from auth.js that was failing
    let table, userIdField, usernameField;
    
    switch (role) {
      case 'admin':
        table = 'admin';
        userIdField = 'admin_id';
        usernameField = 'admin_id'; // Admin uses admin_id as username
        break;
      case 'customer':
        table = 'customer';
        userIdField = 'customer_id';
        usernameField = 'user_name';
        break;
      case 'driver':
        table = 'driver';
        userIdField = 'driver_id';
        usernameField = 'user_name';
        break;
      case 'assistant':
        table = 'assistant';
        userIdField = 'assistant_id';
        usernameField = 'user_name';
        break;
    }
    
    console.log(`🔍 Query: SELECT ${userIdField} as id, name, ${usernameField} as username, password FROM ${table} WHERE ${usernameField} = '${username}'`);
    
    // This is the EXACT query that was failing before
    const [userRecord] = await database.query(
      `SELECT ${userIdField} as id, name, ${usernameField} as username, password FROM ${table} WHERE ${usernameField} = ?`,
      [username]
    );
    
    if (!userRecord) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', {
      id: userRecord.id,
      name: userRecord.name,
      username: userRecord.username,
      hasPassword: !!userRecord.password
    });
    
    // Test password verification
    const isValidPassword = await bcrypt.compare(password, userRecord.password);
    console.log('✅ Password verification:', isValidPassword ? 'SUCCESS' : 'FAILED');
    
    if (isValidPassword) {
      console.log('🎉 LOGIN SUCCESSFUL! The database error has been fixed.');
    } else {
      console.log('❌ Password verification failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

testDriverLogin();