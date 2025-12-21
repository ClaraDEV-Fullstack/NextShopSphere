import threading
import logging
import os
import requests

logger = logging.getLogger(__name__)

# Environment variables
BREVO_API_KEY = os.getenv("c084a571955f1a3e7e2fe3deb7ae16e2d43e79897e86f015ff6ef0320aacfef5-ABAntTPut6h4yhLv")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "claraberi63@gmail.com")
DEFAULT_FROM_NAME = os.getenv("DEFAULT_FROM_NAME", "NextShopSphere")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://nextshopsphere-ui.onrender.com")

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def send_email_async(subject, text_content, html_content, recipient_email):
    """Send email via Brevo API asynchronously"""
    def send():
        payload = {
            "sender": {"name": DEFAULT_FROM_NAME, "email": DEFAULT_FROM_EMAIL},
            "to": [{"email": recipient_email}],
            "subject": subject,
            "htmlContent": html_content,
            "textContent": text_content,
        }
        headers = {
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(BREVO_API_URL, json=payload, headers=headers)
            response.raise_for_status()
            logger.info(f"✅ Email sent to {recipient_email}")
        except Exception as e:
            logger.error(f"❌ Failed to send email to {recipient_email}: {e}")

    thread = threading.Thread(target=send)
    thread.daemon = True
    thread.start()
    return True


def send_order_confirmation_email(order):
    """Send order confirmation email via Brevo API"""
    user_name = order.user.first_name or order.user.username or "Customer"
    user_email = order.user.email
    is_paid = order.payment_status == "paid"

    # Build plain text content
    text_content = f"""
Order Confirmed - #{order.id}

Hi {user_name}!

Thank you for your order!

Order Number: #{order.id}
Total: ${order.total:,.2f}
Status: {order.get_status_display()}
Payment: {'Paid' if is_paid else 'Awaiting Payment'}

View your order: {FRONTEND_URL}/orders/{order.id}

Thank you for shopping with NextShopSphere!
"""

    # Build HTML items table
    items_html = ""
    for item in order.items.all():
        items_html += f"""
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">{item.product_name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">{item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.get_subtotal():,.2f}</td>
        </tr>
        """

    # Build HTML content
    html_content = f"""
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0;">🛍️ Order Confirmed!</h1>
        </div>
        <div style="background: white; padding: 30px;">
            <h2>Hi {user_name}! 👋</h2>
            <p>Thank you for your order!</p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Order #:</strong> {order.id}</p>
                <p><strong>Status:</strong> {order.get_status_display()}</p>
                <p><strong>Payment:</strong> {'✅ Paid' if is_paid else '⏳ Awaiting Payment'}</p>
            </div>
            
            <h3>Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f9fafb;">
                        <th style="padding: 12px; text-align: left;">Item</th>
                        <th style="padding: 12px; text-align: center;">Qty</th>
                        <th style="padding: 12px; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>{items_html}</tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" style="padding: 12px; text-align: right;"><strong>Total:</strong></td>
                        <td style="padding: 12px; text-align: right; color: #3b82f6; font-size: 20px;"><strong>${order.total:,.2f}</strong></td>
                    </tr>
                </tfoot>
            </table>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{FRONTEND_URL}/orders/{order.id}" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">View Order →</a>
            </div>
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="color: #9ca3af; margin: 0;">© 2025 NextShopSphere</p>
        </div>
    </div>
</body>
</html>
"""

    return send_email_async(
        f"🛍️ Order Confirmation - #{order.id} | NextShopSphere",
        text_content,
        html_content,
        user_email
    )
