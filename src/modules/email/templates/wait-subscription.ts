export const WAIT_SUBSCRIPTION = `
<body style="background-color: #f5f5f5">
    <div style="max-width: 400px; margin: 0 auto; padding: 40px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <h1 style="font-size: 24px; color: #333333; margin-top: 0;">Lembrete: Assinar documento</h1>
        <p style="font-size: 16px; color: #555555; margin-bottom: 20px;">Olá #{name},</p>
        <p style="font-size: 16px; color: #555555; margin-bottom: 20px;">Estamos aguardando sua assinatura.</p>
        <p><a href="#{subscriptionLink}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px; transition: background-color 0.3s ease;">Assinar documento</a></p>
        <p style="font-size: 16px; color: #555555; margin-bottom: 20px;">Obrigado pela sua colaboração!</p>
    </div>
</body>
`;
