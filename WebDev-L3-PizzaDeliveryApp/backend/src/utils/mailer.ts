import nodemailer from "nodemailer";

export interface LowStockItem {
  _id?: any;
  name: string;
  quantity: number;
  minThreshold: number;
  unit?: string;
  category?: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends a low stock alert email to all admin recipients.
 * @param adminEmails Array of admin email addresses
 * @param items Array of low stock inventory items
 */
export async function sendLowStockAlert(adminEmails: string[], items: LowStockItem[]): Promise<boolean> {
  if (!adminEmails || adminEmails.length === 0) {
    console.warn("[Mailer] No admin emails provided for low stock notification.");
    return false;
  }

  if (!items || items.length === 0) {
    return false;
  }

  const transporter = getTransporter();

  const itemNamesStr = items.map((i) => `${i.name} (${i.quantity}/${i.minThreshold} ${i.unit || ""})`).join(", ");

  if (!transporter) {
    console.log(
      `[Mailer] Low Stock Alert Triggered! (SMTP credentials not configured in .env). Recipients: ${adminEmails.join(
        ", "
      )} | Items: ${itemNamesStr}`
    );
    return false;
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || "noreply@pizzapoint.com";
  const subject = `🚨 Low Stock Alert: ${items.length} item(s) below threshold`;

  const tableRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">${item.name}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0;">${item.category || "N/A"}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; color: #e53e3e; font-weight: bold;">
          ${item.quantity} ${item.unit || ""}
        </td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; color: #4a5568;">
          ${item.minThreshold} ${item.unit || ""}
        </td>
      </tr>
    `
    )
    .join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #c53030; margin-top: 0;">🍕 PizzaPoint Low Stock Warning</h2>
      <p style="color: #4a5568; font-size: 15px;">
        Attention Admin, the following inventory item(s) have reached or fallen below their set minimum limit:
      </p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; text-align: left;">
        <thead>
          <tr style="background-color: #fff5f5; color: #9b2c2c;">
            <th style="padding: 10px; border: 1px solid #e2e8f0;">Item Name</th>
            <th style="padding: 10px; border: 1px solid #e2e8f0;">Category</th>
            <th style="padding: 10px; border: 1px solid #e2e8f0;">Current Stock</th>
            <th style="padding: 10px; border: 1px solid #e2e8f0;">Min Threshold</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      <p style="color: #718096; font-size: 13px;">
        Please log into the PizzaPoint Admin Dashboard to restock these items promptly.
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from,
      to: adminEmails.join(", "),
      subject,
      text: `Low Stock Warning for ${items.length} item(s): ${itemNamesStr}. Please restock immediately.`,
      html: htmlContent,
    });

    console.log(`[Mailer] Low stock alert email sent successfully to ${adminEmails.join(", ")}. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[Mailer] Failed to send low stock alert email:", error);
    return false;
  }
}
