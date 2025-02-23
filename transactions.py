import stripe
import os
from dotenv import load_dotenv

load_dotenv()

# Set your Stripe test secret key
stripe.api_key = os.getenv("STRIPE_API_KEY")

# Step 1: Create a test customer
def create_test_customer():
    customer = stripe.Customer.create(
        name="Jenny Rosen",
        email="jennyrosen@example.com",
    )
    print("Test Customer Created:")
    print(f"ID: {customer['id']}")
    print(f"Name: {customer['name']}")
    print(f"Email: {customer['email']}")
    print("-" * 40)
    return customer

# Step 2: Attach a test payment method (virtual card)
def attach_test_payment_method(customer_id):
    payment_method = stripe.PaymentMethod.create(
    type="card",
    card={"token": "tok_visa"}  # Use a test token
    )
    stripe.PaymentMethod.attach(
        payment_method.id,
        customer=customer_id
    )
    print("Test Payment Method Attached:")
    print(f"Payment Method ID: {payment_method['id']}")
    print("-" * 40)
    return payment_method

# Step 3: Simulate a charge (transaction)
def simulate_charge(customer_id, amount, currency="usd"):
    payment_intent = stripe.PaymentIntent.create(
        amount=amount,  # Amount in cents (e.g., $10.00 = 1000)
        currency=currency,
        customer=customer_id,
        payment_method="pm_card_visa",  # Use a Stripe test card
        confirm=True,  # Automatically confirm the payment
        automatic_payment_methods={
            "enabled": True,
            "allow_redirects": "never"  # Prevents redirect-based payment methods
        }
    )
    print("Charge Simulated:")
    print(f"Charge ID: {payment_intent.id}")
    print(f"Amount: {payment_intent.amount / 100} {payment_intent.currency}")
    print(f"Status: {payment_intent.status}")
    print(f"Description: {payment_intent.description}")
    print("-" * 40)
    return payment_intent


# Step 4: Retrieve transaction history (charges)
def retrieve_charge_history(customer_id=None, limit=10):
    if customer_id:
        charges = stripe.Charge.list(customer=customer_id, limit=limit)
    else:
        charges = stripe.Charge.list(limit=limit)
    print("Charge History:")
    for charge in charges.auto_paging_iter():
        print(f"ID: {charge['id']}")
        print(f"Amount: {charge['amount'] / 100} {charge['currency']}")
        print(f"Status: {charge['status']}")
        print(f"Description: {charge['description']}")
        print(f"Created: {charge['created']}")
        print("-" * 40)

# Main function to run the entire workflow
def main():
   customer = create_test_customer()
   if customer:
        print("Test Customer Created:")
        print(f"ID: {customer['id']}")
        print(f"Name: {customer['name']}")
        print(f"Email: {customer['email']}")
        print("-" * 40)

        attach_test_payment_method(customer['id'])

        print("Test Payment Method Attached:")
        print("-" * 40)

        # List of amounts to charge (e.g., $10, $20, $30)
        amounts = [1000, 2000, 3000]  # Amounts in cents

        charges = []
        for amount in amounts:
            charge = simulate_charge(customer['id'], amount)
            charges.append(charge)

        # Print charge history
        print("Charge History:")
        for charge in charges:
            print(f"Charge ID: {charge.id}, Amount: {charge.amount / 100} {charge.currency}, Status: {charge.status}")



# Run the script
if __name__ == "__main__":
    main()
