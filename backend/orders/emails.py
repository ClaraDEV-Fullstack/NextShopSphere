from django.core.mail import EmailMultiAlternatives
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_order_confirmation_email(order):
    """Send order confirmation email when order is created"""
    try:
        subject = f'🛍️ Order Confirmation - #{order.id} | NextShopSphere'

        # Get user info
        user_name = order.user.first_name or order.user.username or 'Customer'
        user_email = order.user.email

        # Check payment status
        is_paid = order.payment_status == 'paid'

        # Get order items
        items_text = ""
        items_html = ""
        for item in order.items.all():
            item_total = item.get_subtotal()
            items_text += f"  • {item.product_name} × {item.quantity} = ${item_total:,.2f}\n"
            items_html += f'''
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">{item.product_name}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">{item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item_total:,.2f}</td>
            </tr>'''

        # Build shipping address display
        shipping_display = f"{order.shipping_address}\n{order.shipping_city}, {order.shipping_country}\nPhone: {order.shipping_phone}"

        # Plain text version
        message = f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       NEXTSHOPSPHERE - ORDER CONFIRMED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {user_name}!

Thank you for your order! We're getting it ready for you.

ORDER DETAILS
─────────────
Order Number: #{order.id}
Order Date: {order.created_at.strftime('%B %d, %Y at %I:%M %p')}
Status: {order.get_status_display()}
Payment: {'Paid ✓' if is_paid else 'Awaiting Payment'}

ITEMS ORDERED
─────────────
{items_text}
─────────────
Subtotal:  ${order.subtotal:,.2f}
Shipping:  ${order.shipping_cost:,.2f}
Tax:       ${order.tax:,.2f}
─────────────
TOTAL:     ${order.total:,.2f}

SHIPPING ADDRESS
────────────────
{shipping_display}

WHAT'S NEXT?
────────────
{'✓ Payment received! Your order is being processed.' if is_paid else '→ Please complete payment to process your order.'}

Questions? Reply to this email or contact support@nextshopsphere.com

Thank you for shopping with NextShopSphere!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

        # HTML version
        html_message = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🛍️ NextShopSphere</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Order Confirmed!</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: white; padding: 40px 30px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
            
            <!-- Greeting -->
            <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hi {user_name}! 👋</h2>
            <p style="color: #6b7280; line-height: 1.6; margin: 0 0 30px 0;">
                Thank you for your order! We're excited to get it ready for you.
            </p>
            
            <!-- Order Info Card -->
            <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <table style="width: 100%;">
                    <tr>
                        <td>
                            <p style="color: #6b7280; margin: 0; font-size: 14px;">Order Number</p>
                            <p style="color: #1f2937; margin: 4px 0 0 0; font-size: 20px; font-weight: bold;">#{order.id}</p>
                        </td>
                        <td style="text-align: right;">
                            <p style="color: #6b7280; margin: 0; font-size: 14px;">Status</p>
                            <span style="display: inline-block; margin-top: 4px; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; {'background: #d1fae5; color: #059669;' if is_paid else 'background: #fef3c7; color: #d97706;'}">
                                {'✓ Paid' if is_paid else '⏳ Awaiting Payment'}
                            </span>
                        </td>
                    </tr>
                </table>
                <p style="color: #6b7280; margin: 16px 0 0 0; font-size: 14px;">
                    📅 {order.created_at.strftime('%B %d, %Y at %I:%M %p')}
                </p>
            </div>
            
            <!-- Order Items -->
            <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px;">📦 Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background: #f9fafb;">
                        <th style="padding: 12px; text-align: left; font-weight: 600; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Item</th>
                        <th style="padding: 12px; text-align: center; font-weight: 600; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Qty</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {items_html}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" style="padding: 8px 12px; text-align: right; color: #6b7280;">Subtotal:</td>
                        <td style="padding: 8px 12px; text-align: right; color: #1f2937;">${order.subtotal:,.2f}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 8px 12px; text-align: right; color: #6b7280;">Shipping:</td>
                        <td style="padding: 8px 12px; text-align: right; color: #1f2937;">${order.shipping_cost:,.2f}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 8px 12px; text-align: right; color: #6b7280;">Tax:</td>
                        <td style="padding: 8px 12px; text-align: right; color: #1f2937;">${order.tax:,.2f}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 16px 12px; text-align: right; font-weight: bold; color: #1f2937; font-size: 18px; border-top: 2px solid #e5e7eb;">Total:</td>
                        <td style="padding: 16px 12px; text-align: right; font-weight: bold; color: #3b82f6; font-size: 20px; border-top: 2px solid #e5e7eb;">${order.total:,.2f}</td>
                    </tr>
                </tfoot>
            </table>
            
            <!-- Shipping Address -->
            <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px;">🚚 Shipping Address</h3>
            <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <p style="color: #4b5563; margin: 0; line-height: 1.8;">
                    {order.shipping_address}<br>
                    {order.shipping_city}, {order.shipping_country}<br>
                    📞 {order.shipping_phone}
                </p>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/orders/{order.id}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    View Order Details →
                </a>
            </div>
            
        </div>
        
        <!-- Footer -->
        <div style="background: #1f2937; padding: 30px; text-align: center; border-radius: 0 0 16px 16px;">
            <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@nextshopsphere.com" style="color: #60a5fa;">support@nextshopsphere.com</a>
            </p>
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
                © 2025 NextShopSphere. All rights reserved.
            </p>
        </div>
        
    </div>
</body>
</html>
"""

        # Send email
        email = EmailMultiAlternatives(
            subject=subject,
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user_email]
        )
        email.attach_alternative(html_message, "text/html")
        email.send()

        logger.info(f"✅ Order confirmation email sent to {user_email} for order #{order.id}")
        return True

    except Exception as e:
        logger.error(f"❌ Failed to send order confirmation email: {str(e)}")
        return False


def send_payment_confirmation_email(order):
    """Send payment confirmation email when payment is successful"""
    try:
        subject = f'💳 Payment Confirmed - Order #{order.id} | NextShopSphere'

        # Get user info
        user_name = order.user.first_name or order.user.username or 'Customer'
        user_email = order.user.email

        # Plain text version
        message = f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      NEXTSHOPSPHERE - PAYMENT CONFIRMED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {user_name}!

Great news! Your payment has been successfully processed.

PAYMENT DETAILS
───────────────
Order Number: #{order.id}
Amount Paid: ${order.total:,.2f}
Payment Status: Paid ✓
Order Status: {order.get_status_display()}

WHAT'S NEXT?
────────────
✓ Your order is now being processed
✓ You'll receive shipping confirmation soon
✓ Track your order at: http://localhost:3000/orders/{order.id}

Thank you for shopping with NextShopSphere!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

        # HTML version
        html_message = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
            <div style="font-size: 60px; margin-bottom: 10px;">✅</div>
            <h1 style="color: white; margin: 0; font-size: 28px;">Payment Confirmed!</h1>
        </div>
        
        <!-- Main Content -->
        <div style="background: white; padding: 40px 30px; text-align: center; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
            
            <h2 style="color: #1f2937; margin: 0 0 10px 0;">Thank you, {user_name}!</h2>
            <p style="color: #6b7280; margin: 0 0 30px 0;">Your payment has been successfully processed.</p>
            
            <!-- Amount Card -->
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 16px; padding: 30px; margin-bottom: 30px;">
                <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px;">Amount Paid</p>
                <p style="color: #059669; margin: 0; font-size: 42px; font-weight: bold;">${order.total:,.2f}</p>
            </div>
            
            <!-- Order Info -->
            <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 30px; text-align: left;">
                <table style="width: 100%;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Order Number</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: 600; text-align: right;">#{order.id}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Order Status</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: 600; text-align: right;">{order.get_status_display()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; color: #6b7280;">Payment Status</td>
                        <td style="padding: 12px 0; text-align: right;">
                            <span style="background: #d1fae5; color: #059669; padding: 4px 12px; border-radius: 12px; font-weight: 600; font-size: 14px;">✓ Paid</span>
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Status Steps -->
            <div style="margin-bottom: 30px;">
                <table style="width: 100%; max-width: 300px; margin: 0 auto;">
                    <tr>
                        <td style="text-align: center;">
                            <div style="background: #059669; color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold;">✓</div>
                        </td>
                        <td style="width: 60px;">
                            <div style="height: 3px; background: #059669;"></div>
                        </td>
                        <td style="text-align: center;">
                            <div style="background: #3b82f6; color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold;">2</div>
                        </td>
                        <td style="width: 60px;">
                            <div style="height: 3px; background: #e5e7eb;"></div>
                        </td>
                        <td style="text-align: center;">
                            <div style="background: #e5e7eb; color: #9ca3af; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold;">3</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; font-size: 12px; color: #059669; padding-top: 8px;">Paid</td>
                        <td></td>
                        <td style="text-align: center; font-size: 12px; color: #3b82f6; font-weight: 600; padding-top: 8px;">Processing</td>
                        <td></td>
                        <td style="text-align: center; font-size: 12px; color: #9ca3af; padding-top: 8px;">Shipped</td>
                    </tr>
                </table>
            </div>
            
            <!-- CTA Button -->
            <a href="http://localhost:3000/orders/{order.id}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Track Your Order →
            </a>
            
        </div>
        
        <!-- Footer -->
        <div style="background: #1f2937; padding: 30px; text-align: center; border-radius: 0 0 16px 16px;">
            <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                Thank you for shopping with <strong style="color: white;">NextShopSphere</strong>
            </p>
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
                © 2025 NextShopSphere. All rights reserved.
            </p>
        </div>
        
    </div>
</body>
</html>
"""

        # Send email
        email = EmailMultiAlternatives(
            subject=subject,
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user_email]
        )
        email.attach_alternative(html_message, "text/html")
        email.send()

        logger.info(f"✅ Payment confirmation email sent to {user_email} for order #{order.id}")
        return True

    except Exception as e:
        logger.error(f"❌ Failed to send payment confirmation email: {str(e)}")
        return False