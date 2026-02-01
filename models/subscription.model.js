import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription Name is required"],
        trim: true,
        minLength: 2,
        maxLength: 1000,
    },
    price: {
        type: Number,
        required: [true, "Subscription Price is required"],
        min: [0, "Price must be greater than 0"],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'],
        default: 'USD',
        // required: [true, "Currency is required"],
    },
    frequency: {
        type: String,
        enum: ['monthly', 'yearly', 'weekly', 'daily'],
        // default: 'monthly',
        // required: [true, "Frequency is required"],
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'productivity', 'education', 'health', 'lifestyle', 'politics', 'other'],
        required: [true, "Category is required"],
    },
    paymentMethod: {
        type: String,
        required: [true, "Payment Method is required"],
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'canceled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, "Start Date is required"],
        validate: {
            validator: (value) => value <= new Date(),
            message: "Start Date must be in the past"
        }
    },
    renewalDate: {
        type: Date,
        required: [true, "Renewal Date is required"],
        validate: {
            validator: function (value) { return value > this.startDate; },
            message: "Renewal Date must be after the Start Date"
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Associated User is required"],
        index: true
    }
}, { timestamps: true });

// auto-calculate renewalDate based on frequency

subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            'daily': 1,
            'weekly': 7,
            'monthly': 30,
            'yearly': 365
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }
    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;

// {sub: 'John Doe', email: 'john.doe@example.com', password: 'securepassword123'}