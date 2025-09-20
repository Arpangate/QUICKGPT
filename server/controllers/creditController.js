import Transaction from "../models/Transaction.js";
import Stripe from "stripe";
// import User from "../models/User.js"
// import stripeWebhooks from "../controllers/webhooks.js"

const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
]

// API Controller to get all subscription plans
export const getPlans = async (req, res) => {
    try {
        res.status(200).json({ success: true, plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// API Controller to purchase a plan (mock implementation)
export const purchasePlan = async (req, res) => {
    try {
        // <stripeWebhooks />
        const { planId } = req.body;
        const userId = req.user._id;

        const plan = plans.find(p => p._id === planId);
        if (!plan) return res.status(400).json({ success: false, message: "Invalid plan ID" });

        // Create Transaction (not yet paid)
        const transaction = await Transaction.create({
            userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            isPaid: false
        });

        const { origin } = req.headers;

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        unit_amount: plan.price * 100,
                        product_data: { name: plan.name },
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/loading?transactionId=${transaction._id}`,
            cancel_url: `${origin}/purchase?transactionId=${transaction._id}`,
            metadata: {
                transactionId: transaction._id.toString(),
                appId: 'quickgpt'
            },
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
