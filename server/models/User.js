import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Basic Auth
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Additional Profile Details
    phone: {
      type: String,
      default: null,
    },
    pan: {
      type: String,
      default: null,
      sparse: true,
    },
    aadhar: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    pincode: {
      type: String,
      default: null,
    },
    income: {
      type: Number,
      default: null,
    },
    occupation: {
      type: String,
      default: null,
    },

    // Profile Completion Tracking
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    profileCompletionPercentage: {
      type: Number,
      default: 0,
    },

    // Demo User Flag (for John Doe)
    isDemo: {
      type: Boolean,
      default: false,
    },

    // Role & Status
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Credit Data
    paymentHistory: {
      missedPayments: { type: Number, default: 0 },
      onTimePayments: { type: Number, default: 0 },
    },
    creditUtilization: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    creditMix: {
      creditCard: Boolean,
      autoLoan: Boolean,
      homeLoan: Boolean,
      personalLoan: Boolean,
    },
    creditHistory: {
      yearsActive: { type: Number, default: 0 },
      accountAge: { type: Date },
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (passwordToCompare) {
  return await bcryptjs.compare(passwordToCompare, this.password);
};

// Method to calculate profile completion percentage
userSchema.methods.calculateProfileCompletion = function () {
  const profileFields = [
    "phone",
    "pan",
    "aadhar",
    "dob",
    "address",
    "city",
    "state",
    "pincode",
    "income",
    "occupation",
  ];

  let completedFields = 0;
  profileFields.forEach((field) => {
    if (this[field]) completedFields++;
  });

  const percentage = Math.round((completedFields / profileFields.length) * 100);
  this.profileCompletionPercentage = percentage;
  this.profileCompleted = percentage >= 80; // 80% completion required
  return percentage;
};

// Method to return user data without password
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
