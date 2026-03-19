import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './PaymentSuccessPage.css';

export default function PaymentSuccessPage() {
	const [params] = useSearchParams();
	const ref = params.get('ref');
	const { clearCart } = useCart();

	// Clear the cart once we land on the success page
	useEffect(() => {
		clearCart();
	}, [clearCart]);

	return (
		<div className="payment-success">
			<div className="payment-success__card">
				<div className="payment-success__icon">✓</div>
				<h1 className="payment-success__title">Payment Successful!</h1>
				<p className="payment-success__message">
					Your enrollment has been confirmed. You'll receive a confirmation email shortly with your course details.
				</p>
				{ref && (
					<p className="payment-success__ref">
						Transaction Reference: <strong>{ref}</strong>
					</p>
				)}
				<div className="payment-success__actions">
					<Link to="/" className="payment-success__btn payment-success__btn--primary">
						Back to Home
					</Link>
					<Link to="/contact" className="payment-success__btn payment-success__btn--secondary">
						Contact Us
					</Link>
				</div>
			</div>
		</div>
	);
}
