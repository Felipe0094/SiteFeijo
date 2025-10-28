import { supabase } from '@/integrations/supabase/client';

const emailStyles = `
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 600px;
    margin: 0 auto;
  }
  .header {
    background-color: #000000;
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
  h1, h2 {
    color: #b22222;
    margin-top: 25px;
  }
  .info-section {
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  .info-row {
    display: flex;
    padding: 8px 0;
  }
  .info-label {
    font-weight: bold;
    width: 180px;
  }
  .info-value {
    flex: 1;
  }
  .footer {
    margin-top: 30px;
    font-size: 14px;
    color: #666;
    font-style: italic;
  }
`;

export const getRecipients = (seller: string) => {
  const baseEmail = 'cotacoes.feijocorretora@gmail.com';
  return [baseEmail];
};

export const sendEmail = async ({
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
  // Esta função não é mais usada - o envio de email agora é feito diretamente
  // através do email-service.ts
  console.warn('sendEmail function is deprecated - use email-service.ts instead');
  return { 
    success: false, 
    error: 'This function is deprecated. Use email-service.ts instead.' 
  };
};

export const generateAutoInsuranceEmailContent = (quoteData: any) => {
  const sellerName = quoteData.seller;
  
  // Helper function to format boolean values
  const formatBoolean = (value: boolean | undefined) => {
    if (value === undefined || value === null) return 'Não informado';
    return value ? 'Sim' : 'Não';
  };

  // Helper function to format enum values
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

  const formatResidenceType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'house': 'Casa',
      'apartment': 'Apartamento',
      'condominium': 'Condomínio'
    };
    return typeMap[type] || type || 'Não informado';
  };

  const formatYoungDriverCoverage = (coverage: string) => {
    const coverageMap: { [key: string]: string } = {
      'sim': 'Sim',
      'nao': 'Não. Estou ciente que não haverá cobertura para condutores entre 18 e 25 anos.'
    };
    return coverageMap[coverage] || coverage || 'Não informado';
  };

  const formatInsuranceType = (type: string) => {
    return type === 'new' ? 'Novo' : 'Renovação';
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

  const formatGarageOption = (option: string) => {
    const optionMap: { [key: string]: string } = {
      'not_applicable': 'Não se aplica',
      'true': 'Sim',
      'false': 'Não'
    };
    return optionMap[option] || option || 'Não informado';
  };
  
  return `
    <div class="header">
      <h1>Nova Cotação de Seguro Auto</h1>
      <p>Vendedor: ${sellerName}</p>
    </div>
    <div class="content">
      <div class="info-section">
        <h2>Informações Pessoais</h2>
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

      <div class="info-section">
        <h2>Endereço</h2>
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

      <div class="info-section">
        <h2>Informações do Veículo</h2>
        <div class="info-row">
          <div class="info-label">Tipo de Seguro:</div>
          <div class="info-value">${formatInsuranceType(quoteData.insurance_type)}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Veículo Novo:</div>
          <div class="info-value">${formatBoolean(quoteData.is_new_vehicle)}</div>
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
          <div class="info-value">${formatBoolean(quoteData.is_financed)}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Blindado:</div>
          <div class="info-value">${formatBoolean(quoteData.is_armored)}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Kit Gás:</div>
          <div class="info-value">${formatBoolean(quoteData.has_natural_gas)}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Teto Solar:</div>
          <div class="info-value">${formatBoolean(quoteData.has_sunroof)}</div>
        </div>
      </div>

      <div class="info-section">
        <h2>Informações de Garagem e Uso</h2>
        <div class="info-row">
          <div class="info-label">Garagem Residencial:</div>
          <div class="info-value">${formatBoolean(quoteData.has_home_garage)}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Portão Automático:</div>
          <div class="info-value">${formatBoolean(quoteData.has_automatic_gate)}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Garagem no Trabalho:</div>
          <div class="info-value">${formatGarageOption(quoteData.has_work_garage)}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Garagem na Escola:</div>
          <div class="info-value">${formatGarageOption(quoteData.has_school_garage)}</div>
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

      ${quoteData.covers_young_drivers ? `
      <div class="info-section">
        <h2>Cobertura para Menores de 26 Anos</h2>
        <div class="info-row">
          <div class="info-label">Cobertura para menores de 26 anos:</div>
          <div class="info-value">${formatYoungDriverCoverage(quoteData.covers_young_drivers)}</div>
        </div>
        ${quoteData.condutor_menor ? `
        <div class="info-row">
          <div class="info-label">Informações do Condutor Menor:</div>
          <div class="info-value">${quoteData.condutor_menor}</div>
        </div>
        ` : ''}
      </div>
      ` : ''}

      ${!quoteData.is_driver_insured ? `
      <div class="info-section">
        <h2>Informações do Principal Condutor</h2>
        <div class="info-row">
          <div class="info-label">Nome do Condutor:</div>
          <div class="info-value">${quoteData.driver_full_name || 'Não informado'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">CPF do Condutor:</div>
          <div class="info-value">${quoteData.driver_document_number || 'Não informado'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Data de Nascimento do Condutor:</div>
          <div class="info-value">${quoteData.driver_birth_date || 'Não informado'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Estado Civil do Condutor:</div>
          <div class="info-value">${formatMaritalStatus(quoteData.driver_marital_status)}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Gênero do Condutor:</div>
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
      </div>
    </div>
  `;
};