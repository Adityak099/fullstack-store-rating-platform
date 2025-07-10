import { User } from './models/index.js';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createNewAdmin = async () => {
  try {
    console.log('🔧 Create New Admin User');
    console.log('=========================\n');
    
    // Get admin details
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');
    const address = await question('Enter admin address (optional): ');

    // Validate input
    if (!name || !email || !password) {
      console.log('❌ Name, email, and password are required!');
      return;
    }

    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters long!');
      return;
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email } });
    if (existingAdmin) {
      console.log('❌ User with this email already exists!');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const adminUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address: address || null,
      role: 'admin'
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('================================');
    console.log('Name:', adminUser.name);
    console.log('Email:', adminUser.email);
    console.log('Address:', adminUser.address || 'Not provided');
    console.log('Role:', adminUser.role);
    console.log('User ID:', adminUser.id);
    console.log('\n🎉 The new admin can now login to the system!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    rl.close();
    process.exit();
  }
};

createNewAdmin();
