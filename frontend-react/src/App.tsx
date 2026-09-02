import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Registro {
  id: number;
  nome: string;
  departamento: string;
  data_referencia: string;
  quantidade_entregas: number;
  observacao?: string;
}

interface Resumo {
  total_registros: number;
  total_entregas: number;
}

export function App() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [resumo, setResumo] = useState<Resumo>({ total_registros: 0, total_entregas: 0 });
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // Função para o clique manual do botão
  const handleAtualizar = () => {
    setCarregando(true);
    setErro(null);
    Promise.all([
      axios.get('http://localhost:8001/records'),
      axios.get('http://localhost:8001/summary')
    ])
      .then(([resRecords, resSummary]) => {
        setRegistros(resRecords.data);
        setResumo(resSummary.data);
      })
      .catch(() => {
        setErro('Erro ao conectar com a API. Verifique se o backend FastAPI está em execução.');
      })
      .finally(() => {
        setCarregando(false);
      });
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      axios.get('http://localhost:8001/records'),
      axios.get('http://localhost:8001/summary')
    ])
      .then(([resRecords, resSummary]) => {
        if (isMounted) {
          setRegistros(resRecords.data);
          setResumo(resSummary.data);
          setErro(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setErro('Erro ao conectar com a API. Verifique se o backend FastAPI está em execução.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setCarregando(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Painel Gerencial de Entregas</h1>
            <p className="text-sm text-slate-500">Visão consolidada em tempo real</p>
          </div>
          <button 
            onClick={handleAtualizar}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition-colors text-sm cursor-pointer"
          >
            Atualizar Dados
          </button>
        </header>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-sm">
            <p className="font-medium">Falha na integração</p>
            <p className="text-sm">{erro}</p>
          </div>
        )}

        {/* Estado de Carregamento */}
        {carregando ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-slate-600 font-medium">Carregando indicadores...</span>
          </div>
        ) : (
          <>
            {/* 1. RESUMO (CARTOES) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-indigo-500">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total de Registros</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{resumo.total_registros}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total de Entregas</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{resumo.total_entregas}</p>
              </div>
            </div>

            {/* 2. GRAFICO */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Entregas por Departamento</h2>
              {registros.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Sem dados para exibir o gráfico.</p>
              ) : (
                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={registros}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="departamento" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantidade_entregas" fill="#6366f1" radius={[4, 4, 0, 0]} name="Entregas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* 3. TABELA */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Listagem de Registros</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                      <th className="py-3 px-6">Nome</th>
                      <th className="py-3 px-6">Departamento</th>
                      <th className="py-3 px-6">Data</th>
                      <th className="py-3 px-6 text-right">Quantidade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {registros.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">
                          Nenhum registro encontrado.
                        </td>
                      </tr>
                    ) : (
                      registros.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-medium text-slate-900">{item.nome}</td>
                          <td className="py-4 px-6 text-slate-600">{item.departamento}</td>
                          <td className="py-4 px-6 text-slate-600">{item.data_referencia}</td>
                          <td className="py-4 px-6 text-right font-bold text-slate-900">{item.quantidade_entregas}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}