import { AutoInsuranceFormData } from "./types";
import { sendEmail } from "../../lib/email-service";

// Função para enviar email diretamente usando o serviço de email
const sendEmailDirect = async ({
  to,
  subject,
  content,
  replyTo,
  attachments
}: {
  to: string[];
  subject: string;
  content: string;
  replyTo?: string;
  attachments?: {
    content: string;
    filename: string;
    type: string;
  }[];
}) => {
  try {
    const result = await sendEmail({
      to,
      subject,
      html: content,
      attachments: attachments || []
    });

    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};

// Função para obter destinatários do email
const getRecipients = (seller: string) => {
  const baseEmail = 'cotacoes.feijocorretora@gmail.com';
  return [baseEmail];
};

// Função para gerar o conteúdo HTML do email
const generateEmailContent = (quoteData: any) => {
  const sellerName = quoteData.seller || 'Não informado';
  
  // Helper functions to format enum values
  const formatMaritalStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'single': 'Solteiro(a)',
      'married': 'Casado(a)',
      'divorced': 'Divorciado(a)',
      'widowed': 'Viúvo(a)',
      'other': 'Outro'
    };
    return statusMap[status] || status || 'Não informado';
  };

  const formatGender = (gender: string) => {
    const genderMap: { [key: string]: string } = {
      'male': 'Masculino',
      'female': 'Feminino',
      'other': 'Outro'
    };
    return genderMap[gender] || gender || 'Não informado';
  };

  const formatFuelType = (fuel: string) => {
    const fuelMap: { [key: string]: string } = {
      'gasoline': 'Gasolina',
      'ethanol': 'Etanol',
      'flex': 'Flex',
      'diesel': 'Diesel',
      'electric': 'Elétrico',
      'hybrid': 'Híbrido'
    };
    return fuelMap[fuel] || fuel || 'Não informado';
  };

  const formatVehicleUsage = (usage: string) => {
    const usageMap: { [key: string]: string } = {
      'personal': 'Pessoal',
      'work': 'Trabalho',
      'passenger_transport': 'Transporte de passageiros'
    };
    return usageMap[usage] || usage || 'Não informado';
  };

  const formatResidenceType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'house': 'Casa',
      'apartment': 'Apartamento',
      'condominium': 'Condomínio'
    };
    return typeMap[type] || type || 'Não informado';
  };
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nova Cotação de Seguro Auto</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #FA0108;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .section {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .section-title {
          color: #544f4f;
          border-bottom: 2px solid #FA0108;
          padding-bottom: 10px;
          margin-bottom: 20px;
          font-size: 18px;
          font-weight: bold;
        }
        .info-row {
          display: flex;
          margin-bottom: 10px;
          padding: 5px 0;
        }
        .info-label {
          font-weight: bold;
          width: 200px;
          color: #666;
          flex-shrink: 0;
        }
        .info-value {
          flex: 1;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 14px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Nova Cotação de Seguro Auto</h1>
        <p>Vendedor: ${sellerName}</p>
      </div>
      <div class="content">
        <div class="section">
          <div class="section-title">Informações Pessoais</div>
          <div class="info-row">
            <div class="info-label">Nome/Razão Social:</div>
            <div class="info-value">${quoteData.full_name || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">CPF/CNPJ:</div>
            <div class="info-value">${quoteData.document_number || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Email:</div>
            <div class="info-value">${quoteData.email || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Telefone:</div>
            <div class="info-value">${quoteData.phone || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Data de Nascimento:</div>
            <div class="info-value">${quoteData.birth_date || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Estado Civil:</div>
            <div class="info-value">${formatMaritalStatus(quoteData.marital_status)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Gênero:</div>
            <div class="info-value">${formatGender(quoteData.gender)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tipo de Residência:</div>
            <div class="info-value">${formatResidenceType(quoteData.residence_type)}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Endereço</div>
          <div class="info-row">
            <div class="info-label">CEP:</div>
            <div class="info-value">${quoteData.zip_code || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Logradouro:</div>
            <div class="info-value">${quoteData.street || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Número:</div>
            <div class="info-value">${quoteData.number || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Complemento:</div>
            <div class="info-value">${quoteData.complement || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Bairro:</div>
            <div class="info-value">${quoteData.neighborhood || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Cidade:</div>
            <div class="info-value">${quoteData.city || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Estado:</div>
            <div class="info-value">${quoteData.state || 'Não informado'}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Informações do Veículo</div>
          <div class="info-row">
            <div class="info-label">Tipo de Seguro:</div>
            <div class="info-value">${quoteData.insurance_type === 'new' ? 'Novo' : 'Renovação'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Veículo Novo:</div>
            <div class="info-value">${quoteData.is_new_vehicle ? 'Sim' : 'Não'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Placa:</div>
            <div class="info-value">${quoteData.license_plate || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Chassi:</div>
            <div class="info-value">${quoteData.chassis_number || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Modelo:</div>
            <div class="info-value">${quoteData.model || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Ano de Fabricação:</div>
            <div class="info-value">${quoteData.manufacture_year || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Ano do Modelo:</div>
            <div class="info-value">${quoteData.model_year || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Combustível:</div>
            <div class="info-value">${formatFuelType(quoteData.fuel_type)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Financiado:</div>
            <div class="info-value">${quoteData.is_financed ? 'Sim' : 'Não'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Blindado:</div>
            <div class="info-value">${quoteData.is_armored ? 'Sim' : 'Não'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Kit Gás:</div>
            <div class="info-value">${quoteData.has_natural_gas ? 'Sim' : 'Não'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Teto Solar:</div>
            <div class="info-value">${quoteData.has_sunroof ? 'Sim' : 'Não'}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Informações de Garagem e Uso</div>
          <div class="info-row">
            <div class="info-label">Garagem Residencial:</div>
            <div class="info-value">${quoteData.has_home_garage ? 'Sim' : 'Não'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Portão Automático:</div>
            <div class="info-value">${quoteData.has_automatic_gate ? 'Sim' : 'Não'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Garagem no Trabalho:</div>
            <div class="info-value">${quoteData.has_work_garage === 'true' ? 'Sim' : quoteData.has_work_garage === 'false' ? 'Não' : 'Não se aplica'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Garagem na Escola:</div>
            <div class="info-value">${quoteData.has_school_garage === 'true' ? 'Sim' : quoteData.has_school_garage === 'false' ? 'Não' : 'Não se aplica'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Uso do Veículo:</div>
            <div class="info-value">${formatVehicleUsage(quoteData.vehicle_usage)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Veículos na Residência:</div>
            <div class="info-value">${quoteData.vehicles_at_residence || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">CEP de Pernoite:</div>
            <div class="info-value">${quoteData.parking_zip_code || 'Não informado'}</div>
          </div>
        </div>

        ${quoteData.is_driver_insured === false ? `
        <div class="section">
          <div class="section-title">Informações do Condutor Principal</div>
          <div class="info-row">
            <div class="info-label">Nome:</div>
            <div class="info-value">${quoteData.driver_full_name || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">CPF:</div>
            <div class="info-value">${quoteData.driver_document_number || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Data de Nascimento:</div>
            <div class="info-value">${quoteData.driver_birth_date || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Estado Civil:</div>
            <div class="info-value">${formatMaritalStatus(quoteData.driver_marital_status)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Gênero:</div>
            <div class="info-value">${formatGender(quoteData.driver_gender)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Parentesco:</div>
            <div class="info-value">${quoteData.driver_relationship || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Número da CNH:</div>
            <div class="info-value">${quoteData.driver_license_number || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Categoria da CNH:</div>
            <div class="info-value">${quoteData.driver_license_category || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Vencimento da CNH:</div>
            <div class="info-value">${quoteData.driver_license_expiration || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Profissão:</div>
            <div class="info-value">${quoteData.driver_profession || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Renda:</div>
            <div class="info-value">${quoteData.driver_income ? `R$ ${quoteData.driver_income.toLocaleString('pt-BR')}` : 'Não informado'}</div>
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>Esta é uma cotação automática gerada pelo sistema.</p>
          <p>Data de envio: ${new Date().toLocaleString('pt-BR')}</p>
          <p>© 2024 Feijó Corretora. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const submitQuote = async (values: AutoInsuranceFormData, policyFile?: File) => {
  try {
    console.log("Submitting quote data:", values);
    console.log("Policy file:", policyFile);

    // Campos obrigatórios
    const requiredFields = ['document_number', 'full_name', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !values[field]);
    
    if (missingFields.length > 0) {
      return { 
        success: false, 
        error: `Campos obrigatórios faltando: ${missingFields.join(', ')}` 
      };
    }

    // Preparar dados para o email
    const emailData = {
      ...values,
      created_at: new Date().toISOString()
    };

    const recipients = getRecipients(values.seller || '');

    // Preparar arquivo de apólice se existir
    let policyFileData = null;
    if (policyFile) {
      const reader = new FileReader();
      const base64File = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64String = reader.result as string;
          const base64Content = base64String.split(',')[1];
          resolve(base64Content);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(policyFile);
      });

      policyFileData = {
        content: base64File,
        filename: policyFile.name,
        type: policyFile.type
      };
    }

    // Enviar email diretamente
    const { success, error: emailError } = await sendEmailDirect({
      to: recipients,
      subject: `Nova Cotação de Seguro Auto - ${values.full_name}`,
      content: generateEmailContent(emailData),
      replyTo: values.email,
      attachments: policyFileData ? [policyFileData] : undefined
    });

    if (!success) {
      console.error("Error sending email notification:", emailError);
      return { success: false, error: "Erro ao enviar email. Tente novamente." };
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting auto insurance quote:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro desconhecido ao enviar cotação." 
    };
  }
};
