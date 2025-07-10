import { User } from './models/index.js';
import bcrypt from 'bcryptjs';

const createAdminUser = async () => {
  try {
    console.log('Creating admin user...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@storerating.com' } });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@storerating.com',
      password: hashedPassword,
      address: 'Admin Office',
      role: 'admin'
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@storerating.com');
    console.log('Password: admin123');
    console.log('User ID:', adminUser.id);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit();
  }
};

createAdminUser();
