"""
SMS Notification Service using Sandbox Mode
"""
import logging

logger = logging.getLogger(__name__)


class SMSService:
    """SMS service for sending notifications (Sandbox mode)"""
    
    def __init__(self):
        self.enabled = True
        logger.info("SMS Service initialized in SANDBOX mode")
    
    def send_sms(self, phone_number, message):
        """
        Send SMS (Sandbox mode - logs only)
        Returns: (success: bool, message: str)
        """
        try:
            # In sandbox mode, we just log the SMS
            logger.info(f"[SMS SANDBOX] To: {phone_number}")
            logger.info(f"[SMS SANDBOX] Message: {message}")
            
            # Save to database (we'll add this model next)
            from .models import SMSNotification
            SMSNotification.objects.create(
                phone_number=phone_number,
                message=message,
                status='Sent',
                notification_type='General'
            )
            
            return True, "SMS sent successfully (sandbox mode)"
        except Exception as e:
            logger.error(f"SMS Error: {str(e)}")
            return False, str(e)
    
    def send_bill_notification(self, bill):
        """Send SMS when bill is generated"""
        try:
            phone = bill.household.phone_number
            message = f"""Village Water System
Bill: {bill.bill_number}
Amount: {bill.total_amount} RWF
Period: {bill.billing_period}
Due: {bill.due_date.strftime('%Y-%m-%d')}
Pay at office or via Mobile Money"""
            
            success, msg = self.send_sms(phone, message)
            
            if success:
                # Update notification type
                from .models import SMSNotification
                SMSNotification.objects.filter(
                    phone_number=phone,
                    message=message
                ).update(notification_type='Bill Generated')
            
            return success, msg
        except Exception as e:
            logger.error(f"Bill SMS Error: {str(e)}")
            return False, str(e)
    
    def send_payment_confirmation(self, payment):
        """Send SMS when payment is received"""
        try:
            # Use payer phone if provided, otherwise default to household phone
            phone = payment.payer_phone if payment.payer_phone else payment.bill.household.phone_number
            message = f"""Village Water System
Payment Received!
Receipt: {payment.receipt_number}
Amount: {payment.amount_paid} RWF
Method: {payment.payment_method}
Thank you!"""
            
            success, msg = self.send_sms(phone, message)
            
            if success:
                # Update notification type
                from .models import SMSNotification
                SMSNotification.objects.filter(
                    phone_number=phone,
                    message=message
                ).update(notification_type='Payment Confirmation')
            
            return success, msg
        except Exception as e:
            logger.error(f"Payment SMS Error: {str(e)}")
            return False, str(e)


# Global SMS service instance
sms_service = SMSService()
