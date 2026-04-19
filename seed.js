const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config();

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/loan_admin_db';
    await mongoose.connect(uri);
    console.log(`Connected to MongoDB: ${mongoose.connection.host}`);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log(`  Email: admin@example.com`);
      console.log(`  Password: admin123`);
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'shreejiquickfunds6@gmail.com',
      password: 'shreeji@6767',
      role: 'admin',
    });

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Admin Account:');
    console.log('  Email: shreejiquickfunds6@gmail.com');
    console.log('  Password: shreeji@6767\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
