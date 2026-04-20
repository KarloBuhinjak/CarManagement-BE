import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

const getTransporter = (): Transporter => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "Email service not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env.",
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return transporter;
};

interface InvitationEmailParams {
  to: string;
  invitationLink: string;
}

export const sendMechanicInvitationEmail = async ({
  to,
  invitationLink,
}: InvitationEmailParams): Promise<void> => {
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "no-reply";
  const t = getTransporter();

  await t.sendMail({
    from: `"AutoLedger" <${from}>`,
    to,
    subject: "You're invited to AutoLedger",
    text: [
      "Welcome to AutoLedger.",
      "",
      "A superadmin has just created a mechanic account for this email.",
      "Click the link below to set your password and activate your account:",
      invitationLink,
      "",
      "This link expires in 24 hours.",
      "",
      "— The AutoLedger team",
    ].join("\n"),
    html: `
<!doctype html>
<html>
  <body style="margin:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#f1f5f9;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#0f0f1a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.06);">
                <div style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">AutoLedger</div>
                <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#00d4ff;margin-top:4px;">MECHANIC INVITATION</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 14px;font-size:22px;color:#f1f5f9;">Welcome to the trusted network</h1>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.55;color:#94a3b8;">
                  A superadmin has just created a mechanic account for <strong style="color:#ffffff;">${to}</strong>.
                  Click the button below to set your password and activate your account.
                </p>
                <a href="${invitationLink}" style="display:inline-block;padding:13px 22px;font-size:15px;font-weight:700;color:#0a0a0f;background:linear-gradient(135deg,#00d4ff,#3b82f6);border-radius:10px;text-decoration:none;">
                  Set my password →
                </a>
                <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#64748b;">
                  Or open this link directly:<br/>
                  <a href="${invitationLink}" style="color:#00d4ff;word-break:break-all;">${invitationLink}</a>
                </p>
                <p style="margin:24px 0 0;font-size:12px;color:#64748b;">
                  This link expires in 24 hours. If you weren't expecting this email, you can safely ignore it.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#080810;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;color:#64748b;">
                Sealed on blockchain · Verified in seconds · AutoLedger
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  });
};
