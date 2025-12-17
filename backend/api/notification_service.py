from .models import Notification, User

class NotificationService:
    
    @staticmethod
    def create_notification(user, notification_type, title, message, link=None):
        """Create a new notification"""
        return Notification.objects.create(
            user=user,
            notification_type=notification_type,
            title=title,
            message=message,
            link=link
        )
    
    @staticmethod
    def notify_household_payment(payment):
        """Notify admin/manager when household makes payment"""
        admins = User.objects.filter(role__in=['Admin', 'Manager'])
        
        household_name = payment.bill.household.household_name
        amount = payment.amount_paid
        
        for admin in admins:
            NotificationService.create_notification(
                user=admin,
                notification_type='household_payment',
                title='New Household Payment',
                message=f'{household_name} paid {amount} RWF',
                link=f'/payments'
            )
    
    @staticmethod
    def notify_new_registration(household):
        """Notify admin/manager of new household registration"""
        admins = User.objects.filter(role__in=['Admin', 'Manager'])
        
        for admin in admins:
            NotificationService.create_notification(
                user=admin,
                notification_type='new_registration',
                title='New Household Registered',
                message=f'{household.household_name} ({household.household_code}) registered',
                link=f'/households'
            )
    
    @staticmethod
    def notify_tariff_change(tariff, action='updated'):
        """Notify all households of tariff rate change"""
        households = User.objects.filter(role='Household')
        
        message = f'The tariff rate for {tariff.rate_name} has been {action}. New rate: UGX {tariff.rate_per_liter}/liter.'
        
        for household_user in households:
            try:
                NotificationService.create_notification(
                    user=household_user,
                    notification_type='tariff_change',
                    title='Tariff Rate Updated',
                    message=message,
                    link=f'/tariff-rates'
                )
            except Exception as e:
                pass
    
    @staticmethod
    def notify_admin_payment(payment):
        """Notify household when admin records payment for them"""
        household_user = payment.bill.household.user
        
        if household_user and payment.received_by:  # Admin recorded it
            try:
                NotificationService.create_notification(
                    user=household_user,
                    notification_type='admin_payment',
                    title='Payment Recorded',
                    message=f'Payment of {payment.amount_paid} RWF recorded for bill {payment.bill.bill_number}',
                    link=f'/payments'
                )
            except Exception as e:
                pass
    
    @staticmethod
    def notify_new_bill(bill):
        """Notify household of new bill generation"""
        household_user = bill.household.user
        if household_user:
            NotificationService.create_notification(
                user=household_user,
                notification_type='new_bill',
                title='New Bill Generated',
                message=f'New bill {bill.bill_number} for {bill.total_amount} RWF. Due: {bill.due_date}',
                link=f'/bills'
            )
