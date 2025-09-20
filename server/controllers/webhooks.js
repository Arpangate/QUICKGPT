import Stripe from "stripe"
import Transaction from "../models/Transaction.js"
import User from "../models/User.js"

export const stripeWebhooks = async (request, response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = request.headers["stripe-signature"]

    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`)
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object
                console.log("Payment Intent:", paymentIntent.id);
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                })

                const session = sessionList.data[0]
                console.log("Session:", session);
                if (!session) {
                    console.log("No session found for this paymentIntent");
                    break;
                }
                const { transactionId, appId } = session.metadata
                 console.log("Metadata:", transactionId, appId);

                if (appId === 'quickgpt') {
                    const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false })
                      console.log("Transaction before update:", transaction);
                    if (transaction) {
                        // Update credits in user account
                        await User.updateOne(
                            { _id: transaction.userId },
                            { $inc: { credits: transaction.credits } }
                        )
                        // console.log(transaction._id)
                        // Update credit Payment status
                        transaction.isPaid = true;
                        console.log("Transaction after update:", transaction);
                        await transaction.save()
                    }
                } else {
                    return response.json({ received: true, message: "Ignored event: Invalid app" })
                }
                break
            }
            default:
                console.log("Unhandled event type:", event.type)
                break
        }
        response.json({ received: true })
    } catch (error) {
        console.log("Webhook processing error:", error)
        response.status(500).send("Internal Server Error")
    }
}
