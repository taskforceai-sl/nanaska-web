import { Link, useSearchParams } from 'react-router-dom';
import './PaymentCancelPage.css';

export default function PaymentCancelPage() {
	const [params] = useSearchParams();
	const reason = params.get('reason');

	return (
		<div className="payment-cancel">
			<div className="payment-cancel__card">
				<div className="payment-cancel__icon">✕</div>
				<h1 className="payment-cancel__title">Payment Unsuccessful</h1>
				<p className="payment-cancel__message">
					Your payment could not be completed. No charges have been made to your account.
					{reason && reason !== 'error' && reason !== 'missing_reqid' && (
						<> Reason: <em>{decodeURIComponent(reason)}</em>.</>
					)}
				</p>
				<p className="payment-cancel__help">
					Please try again or contact us if the problem persists.
				</p>
				<div className="payment-cancel__actions">
					<Link to="/enrollment" className="payment-cancel__btn payment-cancel__btn--primary">
						Try Again
					</Link>
					<Link to="/contact" className="payment-cancel__btn payment-cancel__btn--secondary">
						Contact Us
					</Link>
				</div>
			</div>
		</div>
	);
}
