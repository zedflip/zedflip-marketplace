import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// User Schema (simplified for script)
const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  city: { type: String, required: true },
  role: { type: String, enum: ['user', 'moderator', 'super_admin'], default: 'user' },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://admin_db_user:5UV8jFFVlObkl2KJ@zedflip-cluster.08k5t1k.mongodb.net/zedflip';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully');

    // Admin credentials
    const adminData = {
      email: 'admin@zedflip.com',
      phone: '+260954737344',
      password: 'Werdon@1903',
      fullName: 'Enes Admin',
      city: 'Lusaka',
      role: 'super_admin',
      isEmailVerified: true,
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log('Admin account already exists');
      console.log('Email:', existingAdmin.email);
      
      // Update to super_admin if not already
      if (existingAdmin.role !== 'super_admin') {
        existingAdmin.role = 'super_admin';
        existingAdmin.isEmailVerified = true;
        await existingAdmin.save();
        console.log('Updated existing admin to super_admin role');
      } else {
        console.log('Admin already has super_admin role');
      }
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(adminData.password, 10);

      // Create new admin
      const admin = new User({
        ...adminData,
        password: hashedPassword,
      });

      await admin.save();
      console.log('\n✅ Super Admin created successfully!');
      console.log('\nCredentials:');
      console.log('Email:', adminData.email);
      console.log('Password:', adminData.password);
      console.log('Phone:', adminData.phone);
      console.log('\nLogin at: https://zedflip.com/admin');
      console.log('\n⚠️  IMPORTANT: Change password after first login!');
    }

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
};

// Run the script
createSuperAdmin();
