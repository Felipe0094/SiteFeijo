import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Car, Info, Wallet, Calendar, Trophy, Clock, Percent, User, Building, TrendingDown, ArrowRight } from 'lucide-react';

const CONSORTIUM_RATES = {
  taxaAdministrativa: 0.16,
  fundoReserva: 0.02,
  seguroVidaPF: 0.00038,
  seguroVidaPJ: 0,
} as const;

type PersonType = 'PF' | 'PJ';

interface SimulationInput {
  creditoContratado: number;
  prazoInicial: number;
  lanceProprio: number;
  lanceEmbutido: number;
  mesContemplacao: number;
  redutorGrupo: number;
  tipoPessoa: PersonType;
  campanhaParcelaOriginal: boolean;
}

interface ParcelaBreakdown {
  cotaCredito: number;
  taxaAdministrativa: number;
  fundoReserva: number;
  seguro: number;
  parcelaBruta: number;
  parcelaReduzida: number;
}

interface PostContemplationResult {
  saldoDevedor: number;
  prazoMantido: number;
  parcelaMantida: number;
  novoPrazo: number;
  creditoLiberado: number;
  representatividadeLance: number;
  saldoNormal: number;
  saldoReduzido: number;
  novoSeguroPF: number;
  parcelaTeoricaPJ: number;
  parcelaTeoricaPF: number;
  prazoSomenteNormal: number;
  prazoSomenteReduzida: number;
  novaParcelaReducao: number;
}

interface SimulationResult {
  parcelas: ParcelaBreakdown;
  posContemplacao: PostContemplationResult;
  categoria: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

function calculateParcelas(
  creditoContratado: number,
  prazoInicial: number,
  tipoPessoa: PersonType,
  redutorGrupo: number,
  campanhaParcelaOriginal: boolean
): ParcelaBreakdown {
  const cotaCredito = creditoContratado / prazoInicial;
  const taxaAdministrativa = (creditoContratado * CONSORTIUM_RATES.taxaAdministrativa) / prazoInicial;
  const fundoReserva = (creditoContratado * CONSORTIUM_RATES.fundoReserva) / prazoInicial;
  const categoria = creditoContratado * (1 + CONSORTIUM_RATES.taxaAdministrativa + CONSORTIUM_RATES.fundoReserva);
  const categoriaMensal = categoria / prazoInicial;
  const seguro = tipoPessoa === 'PF' ? categoria * CONSORTIUM_RATES.seguroVidaPF : 0;

  let parcelaBruta = 0;
  let parcelaReduzida = 0;

  if (campanhaParcelaOriginal) {
    const baseCampanha = categoria / 200;
    parcelaBruta = tipoPessoa === 'PF' ? baseCampanha + seguro : baseCampanha;
    parcelaReduzida = parcelaBruta;
  } else {
    if (tipoPessoa === 'PF') {
      parcelaBruta = categoriaMensal + seguro;
      parcelaReduzida = categoriaMensal * (1 - redutorGrupo) + seguro;
    } else {
      parcelaBruta = categoriaMensal;
      parcelaReduzida = categoriaMensal * (1 - redutorGrupo);
    }
  }
  return { cotaCredito, taxaAdministrativa, fundoReserva, seguro, parcelaBruta, parcelaReduzida };
}

function calculatePostContemplation(
  creditoContratado: number,
  prazoInicial: number,
  lanceProprio: number,
  lanceEmbutido: number,
  mesContemplacao: number,
  parcelas: ParcelaBreakdown,
): PostContemplationResult {
  const categoria = creditoContratado * (1 + CONSORTIUM_RATES.taxaAdministrativa + CONSORTIUM_RATES.fundoReserva);
  const parcelasPagas = mesContemplacao;
  const parcelasRestantes = prazoInicial - parcelasPagas;
  const categoriaMensal = categoria / prazoInicial;
  const saldoDevedorParcelaBruta = parcelas.parcelaBruta * parcelasRestantes;
  const ofertaTotal = lanceProprio + lanceEmbutido;
  const saldoAposLance = Math.max(0, saldoDevedorParcelaBruta - ofertaTotal);
  const representatividadeLance = (ofertaTotal / categoria) * 100;
  const creditoLiberado = Math.max(0, creditoContratado - lanceEmbutido);
  const prazoMantido = parcelasRestantes;
  const parcelaMantida = parcelas.parcelaBruta;
  const novoPrazo = parcelaMantida > 0 ? Math.ceil(saldoAposLance / parcelaMantida) : parcelasRestantes;

  const reducaoMensalCategoria = parcelas.parcelaBruta - parcelas.parcelaReduzida;
  const saldoNormal = Math.max(0, categoriaMensal * parcelasRestantes - ofertaTotal);
  const saldoReduzido = Math.max(0, saldoNormal + reducaoMensalCategoria * parcelasPagas);
  const parcelaTeoricaPJ = parcelasRestantes > 0 ? saldoReduzido / parcelasRestantes : 0;
  const novoSeguroPF = parcelas.seguro > 0 ? creditoLiberado * CONSORTIUM_RATES.seguroVidaPF : 0;
  const parcelaTeoricaPF = parcelas.seguro > 0 ? parcelaTeoricaPJ + novoSeguroPF : parcelaTeoricaPJ;
  const prazoSomenteNormal = parcelaMantida > 0 ? Math.ceil(saldoNormal / parcelaMantida) : 0;
  const prazoSomenteReduzida = parcelaMantida > 0 ? Math.ceil(saldoReduzido / parcelaMantida) : 0;
  const novaParcelaReducao = parcelas.seguro > 0 ? parcelaTeoricaPF : parcelaTeoricaPJ;
  return {
    saldoDevedor: saldoAposLance,
    prazoMantido,
    parcelaMantida,
    novoPrazo,
    creditoLiberado,
    representatividadeLance,
    saldoNormal,
    saldoReduzido,
    novoSeguroPF,
    parcelaTeoricaPJ,
    parcelaTeoricaPF,
    prazoSomenteNormal,
    prazoSomenteReduzida,
    novaParcelaReducao,
  };
}

const ConsortiumSimulator = () => {
  const DEFAULTS: SimulationInput = {
    creditoContratado: 10000,
    prazoInicial: 90,
    lanceProprio: 0,
    lanceEmbutido: 0,
    mesContemplacao: 10,
    redutorGrupo: 0.4,
    tipoPessoa: 'PF',
    campanhaParcelaOriginal: false,
  };

  const [input, setInput] = useState<SimulationInput>(DEFAULTS);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const result: SimulationResult = useMemo(() => {
    const parcelas = calculateParcelas(input.creditoContratado, input.prazoInicial, input.tipoPessoa, input.redutorGrupo, input.campanhaParcelaOriginal);
    const posContemplacao = calculatePostContemplation(input.creditoContratado, input.prazoInicial, input.lanceProprio, input.lanceEmbutido, input.mesContemplacao, parcelas);
    const categoria = input.creditoContratado * (1 + CONSORTIUM_RATES.taxaAdministrativa + CONSORTIUM_RATES.fundoReserva);
    return { parcelas, posContemplacao, categoria };
  }, [input]);

  const updateField = <K extends keyof SimulationInput>(field: K, value: SimulationInput[K]) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 md:px-8">
      <div className="min-h-screen flex flex-col my-4 md:my-8 bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl mx-auto">
        <Navbar />
        <main className="flex-grow pt-[56px] md:pt-[64px]">
          <div className="py-8 px-4 md:px-8">
            <header className="relative overflow-hidden border-b border-border/50 mb-6">
              <div className="container py-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Simulador</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-feijo-darkgray mb-3">Consórcio de Automóveis</h1>
                <p className="text-feijo-gray text-lg">Calcule sua parcela mensal e simule o impacto de um lance.</p>
              </div>
            </header>

            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 space-y-6 border rounded-xl">
                  <div className="flex items-center gap-2 pb-4 border-b">
                    <Wallet className="w-4 h-4 text-feijo-red" />
                    <h2 className="text-lg font-semibold text-feijo-darkgray">Dados da Simulação</h2>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm text-feijo-gray">Tipo de Contratação</Label>
                    <RadioGroup value={input.tipoPessoa} onValueChange={(v) => updateField('tipoPessoa', v as PersonType)} className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="PF" id="pf" />
                        <User className="w-4 h-4 text-feijo-gray" />
                        <span className="text-sm">Pessoa Física</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="PJ" id="pj" />
                        <Building className="w-4 h-4 text-feijo-gray" />
                        <span className="text-sm">Pessoa Jurídica</span>
                      </label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-feijo-gray flex items-center gap-2"><Wallet className="w-4 h-4" />Crédito Contratado</Label>
                      <span className="text-sm font-medium text-feijo-red">{formatCurrency(input.creditoContratado)}</span>
                    </div>
                    <Slider value={[input.creditoContratado]} onValueChange={([v]) => updateField('creditoContratado', v)} min={10000} max={500000} step={5000} />
                    <div className="flex justify-between text-xs text-feijo-gray"><span>R$ 10.000</span><span>R$ 500.000</span></div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-feijo-gray flex items-center gap-2"><Calendar className="w-4 h-4" />Prazo Inicial</Label>
                      <span className="text-sm font-medium text-feijo-red">{input.prazoInicial} meses</span>
                    </div>
                    <Slider value={[input.prazoInicial]} onValueChange={([v]) => updateField('prazoInicial', v)} min={24} max={120} step={1} />
                    <div className="flex justify-between text-xs text-feijo-gray"><span>24 meses</span><span>120 meses</span></div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-feijo-gray flex items-center gap-2"><Percent className="w-4 h-4" />Campanha de redução de Parcelas</Label>
                      <span className="text-sm font-medium text-feijo-red">{(input.redutorGrupo * 100).toFixed(0)}%</span>
                    </div>
                    <Slider value={[input.redutorGrupo * 100]} onValueChange={([v]) => updateField('redutorGrupo', v / 100)} min={0} max={50} step={5} />
                    <div className="flex justify-between text-xs text-feijo-gray"><span>0%</span><span>50%</span></div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-feijo-gray flex items-center gap-2"><Percent className="w-4 h-4" />Campanha Parcela Original</Label>
                      <Switch checked={input.campanhaParcelaOriginal} onCheckedChange={(v) => updateField('campanhaParcelaOriginal', v)} />
                    </div>
                    <div className="text-xs text-feijo-gray">Quando ativo, parcela calculada por campanha (categoria ÷ 200). Para PF, soma seguro.</div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center gap-2 pb-4">
                      <Trophy className="w-4 h-4 text-feijo-red" />
                      <h3 className="text-lg font-semibold text-feijo-darkgray">Oferta de Lance</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-feijo-gray flex items-center gap-2"><Trophy className="w-4 h-4" />Recurso próprio</Label>
                        <span className="text-sm font-medium text-feijo-red">{formatCurrency(input.lanceProprio)}</span>
                      </div>
                      <Slider
                        value={[input.lanceProprio]}
                        onValueChange={([v]) => updateField('lanceProprio', v)}
                        min={0}
                        max={Math.max(0, input.creditoContratado * 0.9 - input.lanceEmbutido)}
                        step={1000}
                      />
                      <div className="flex justify-between text-xs text-feijo-gray"><span>R$ 0</span><span>{formatCurrency(Math.max(0, input.creditoContratado * 0.9 - input.lanceEmbutido))}</span></div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-feijo-gray flex items-center gap-2"><Trophy className="w-4 h-4" />Recurso do crédito (Lance Embutido)</Label>
                        <span className="text-sm font-medium text-feijo-red">{formatCurrency(input.lanceEmbutido)}</span>
                      </div>
                      <Slider
                        value={[input.lanceEmbutido]}
                        onValueChange={([v]) => updateField('lanceEmbutido', v)}
                        min={0}
                        max={Math.max(0, Math.min(input.creditoContratado, input.creditoContratado * 0.9 - input.lanceProprio))}
                        step={1000}
                      />
                      <div className="flex justify-between text-xs text-feijo-gray"><span>R$ 0</span><span>{formatCurrency(Math.max(0, Math.min(input.creditoContratado, input.creditoContratado * 0.9 - input.lanceProprio)))}</span></div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <span className="text-sm text-feijo-gray">Total do Lance</span>
                        <span className="font-medium">{formatCurrency(input.lanceProprio + input.lanceEmbutido)}</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <span className="text-sm text-feijo-gray">Representatividade do Lance</span>
                        <span className="font-medium">{((input.lanceProprio + input.lanceEmbutido) / (input.creditoContratado * (1 + CONSORTIUM_RATES.taxaAdministrativa + CONSORTIUM_RATES.fundoReserva)) * 100).toFixed(2)}%</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <span className="text-sm text-feijo-gray">Crédito Liberado</span>
                        <span className="font-medium">{formatCurrency(Math.max(0, input.creditoContratado - input.lanceEmbutido))}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-feijo-gray flex items-center gap-2"><Clock className="w-4 h-4" />Mês de Contemplação</Label>
                      <span className="text-sm font-medium text-feijo-red">{input.mesContemplacao}º mês</span>
                    </div>
                    <Slider value={[input.mesContemplacao]} onValueChange={([v]) => updateField('mesContemplacao', v)} min={1} max={Math.min(input.prazoInicial - 1, 60)} step={1} />
                    <div className="flex justify-between text-xs text-feijo-gray"><span>1º mês</span><span>{Math.min(input.prazoInicial - 1, 60)}º mês</span></div>
                  </div>

                  <div className="mt-4">
                    <Button className="bg-[#cc2c32] text-white hover:bg-[#b02429]" onClick={() => setInput(DEFAULTS)}>Recalcular com novos valores</Button>
                  </div>
                </div>

                <div className="p-6 border rounded-xl">
                  <div className="flex items-center gap-2 mb-4"><Percent className="w-4 h-4 text-feijo-gray" /><h3 className="text-base font-semibold text-feijo-darkgray">Taxas do Grupo</h3></div>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-sm text-feijo-gray">Taxa Administrativa Diluída</span><span className="text-sm font-medium">{(CONSORTIUM_RATES.taxaAdministrativa * 100).toFixed(2)}%</span></div>
                    <div className="flex justify-between"><span className="text-sm text-feijo-gray">Fundo de Reserva</span><span className="text-sm font-medium">{(CONSORTIUM_RATES.fundoReserva * 100).toFixed(2)}%</span></div>
                    <div className="flex justify-between"><span className="text-sm text-feijo-gray">Seguro de Vida (apenas PF)</span><span className="text-sm font-medium">{(CONSORTIUM_RATES.seguroVidaPF * 100).toFixed(3)}% <span className="text-xs text-feijo-gray">(mensal)</span></span></div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="p-6 border rounded-xl">
                  <div className="flex items-center gap-2 pb-4 border-b mb-6"><TrendingDown className="w-4 h-4 text-feijo-red" /><h2 className="text-lg font-semibold text-feijo-darkgray">Resultado da Simulação</h2></div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <Card className="bg-gray-50 border"><CardHeader className="pb-2"><CardTitle className="text-sm text-feijo-gray">Saldo Devedor</CardTitle></CardHeader><CardContent><span className="text-2xl font-bold">{formatCurrency(result.categoria)}</span></CardContent></Card>
                    <Card className="bg-gray-50 border"><CardHeader className="pb-2"><CardTitle className="text-sm text-feijo-gray">Carta de Crédito</CardTitle></CardHeader><CardContent><span className="text-2xl font-bold text-green-600">{formatCurrency(result.posContemplacao.creditoLiberado)}</span></CardContent></Card>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <Card className="border-primary/20"><CardHeader className="pb-2"><CardTitle className="text-sm text-feijo-gray">Parcela {input.tipoPessoa}</CardTitle></CardHeader><CardContent><span className="text-3xl font-bold text-feijo-red">{formatCurrency(result.parcelas.parcelaBruta)}</span></CardContent></Card>
                    <Card className="border-gold/20"><CardHeader className="pb-2"><CardTitle className="text-sm text-feijo-gray">Parcela Reduzida {input.tipoPessoa}</CardTitle></CardHeader><CardContent><span className="text-3xl font-bold">{formatCurrency(result.parcelas.parcelaReduzida)}</span></CardContent></Card>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 className="text-sm font-medium mb-3">Composição da Parcela</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-feijo-gray">Cota de Crédito</span><span>{formatCurrency(result.parcelas.cotaCredito)}</span></div>
                      <div className="flex justify-between"><span className="text-feijo-gray">Taxa Administrativa</span><span>{formatCurrency(result.parcelas.taxaAdministrativa)}</span></div>
                      <div className="flex justify-between"><span className="text-feijo-gray">Fundo de Reserva</span><span>{formatCurrency(result.parcelas.fundoReserva)}</span></div>
                      {input.tipoPessoa === 'PF' && (<div className="flex justify-between"><span className="text-feijo-gray">Seguro de Vida</span><span>{formatCurrency(result.parcelas.seguro)}</span></div>)}
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <div className="flex items-center gap-2 mb-4"><Trophy className="w-5 h-5 text-feijo-red" /><h3 className="text-base font-semibold">Estimativa Pós-Contemplação</h3></div>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm text-feijo-gray">Crédito Liberado</span><span className="font-medium">{formatCurrency(result.posContemplacao.creditoLiberado)}</span></div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm text-feijo-gray">Pago / Quitado</span><span className="font-medium">{formatPercent(result.posContemplacao.representatividadeLance)}</span></div>
                    </div>
                    <Card className="mb-4"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-gray-200 text-feijo-red text-xs flex items-center justify-center font-bold">A</span>Reduzir Valor da Parcela</CardTitle></CardHeader><CardContent><div className="flex items-center gap-4"><div><span className="text-sm text-feijo-gray">Nova Parcela</span><p className="text-2xl font-bold text-feijo-red">{formatCurrency(result.posContemplacao.novaParcelaReducao)}</p></div><ArrowRight className="w-5 h-5 text-feijo-gray" /><div><span className="text-sm text-feijo-gray">Com Prazo de</span><p className="text-2xl font-bold">{result.posContemplacao.prazoMantido} meses</p></div></div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-gray-200 text-feijo-red text-xs flex items-center justify-center font-bold">B</span>Reduzir Prazo</CardTitle></CardHeader><CardContent><div className="flex items-center gap-4"><div><span className="text-sm text-feijo-gray">Com Parcelas de</span><p className="text-2xl font-bold">{formatCurrency(result.posContemplacao.parcelaMantida)}</p></div><ArrowRight className="w-5 h-5 text-feijo-gray" /><div><span className="text-sm text-feijo-gray">Novo Prazo</span><p className="text-2xl font-bold">{result.posContemplacao.novoPrazo} meses</p></div></div></CardContent></Card>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-4 rounded-xl bg-gray-50 border">
              <div className="flex gap-3"><Info className="w-5 h-5 text-feijo-gray" /><p className="text-sm text-feijo-gray"><strong className="text-feijo-darkgray">Aviso:</strong> Os valores da simulação são referência e podem variar conforme disponibilidade de vagas no grupo.</p></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ConsortiumSimulator;
