export interface EmailData {
  to: string[];
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: string;
    type: string;
  }[];
}

export const sendEmail = async (emailData: EmailData) => {
  try {
    // Envio via endpoint de formulário (compatível com sites estáticos em GitHub Pages)
    const formsEndpoint = import.meta.env.VITE_FORMS_ENDPOINT_URL || 'https://send-email-worker.felipepmerj.workers.dev';
    if (!formsEndpoint) {
      throw new Error('URL do endpoint de formulário não configurada: defina VITE_FORMS_ENDPOINT_URL');
    }

    // Converte DataURL (base64) em Blob
    const dataUrlToBlob = (dataUrl: string) => {
      const [meta, base64] = dataUrl.split(',');
      const mime = meta.match(/data:(.*?);base64/)?.[1] || 'application/octet-stream';
      const binary = atob(base64);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
      return new Blob([array], { type: mime });
    };

    const formData = new FormData();
    formData.append('subject', emailData.subject);
    formData.append('message', emailData.html);
    formData.append('to', emailData.to.join(','));

    // Anexos (se existirem)
    if (emailData.attachments && emailData.attachments.length > 0) {
      for (const att of emailData.attachments) {
        const blob = att.content.startsWith('data:') ? dataUrlToBlob(att.content) : new Blob([att.content], { type: att.type });
        formData.append('files[]', blob, att.filename);
      }
    }

    const response = await fetch(formsEndpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Muitos provedores de formulários retornam 200/201 com corpo simples
    let result: any = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      result = { success: true, data: text };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};