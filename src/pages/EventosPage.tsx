import React, { useState, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  getDay,
  parseISO,
  isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, Camera, DollarSign, Calendar as CalendarIcon, MoreVertical, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { useFinance } from '../hooks/useFinance';
import { FinancialEvent, PaymentStatus } from '../types';
import { formatCurrency } from '../utils/helpers';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const EventosPage: React.FC = () => {
  const { events, actions } = useFinance();
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FinancialEvent | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<FinancialEvent>>({
    name: '',
    clientOrigin: '',
    type: 'Ensaio',
    location: '',
    time: '14:00',
    description: '',
    totalValue: 0,
    status: 'PENDING',
  });

  // Derived Data
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const startingDayIndex = getDay(startOfMonth(currentDate));

  const getEventsForDay = (day: Date) => {
    return events.filter(e => {
      if (e.date) {
        return isSameDay(parseISO(e.date), day);
      }
      const [mes, ano] = e.monthReference.split('/');
      const eventDate = new Date(parseInt(ano), parseInt(mes) - 1, 1);
      return isSameDay(eventDate, day) && day.getDate() === 1; 
    });
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleOpenNewEvent = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      clientOrigin: '',
      type: 'Ensaio',
      location: '',
      time: '14:00',
      description: '',
      totalValue: 0,
      status: 'PENDING',
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      monthReference: selectedDate ? format(selectedDate, 'MM/yyyy') : format(new Date(), 'MM/yyyy')
    });
    setIsModalOpen(true);
  };

  const handleEditEvent = (evt: FinancialEvent) => {
    setEditingEvent(evt);
    setFormData({ ...evt });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.totalValue || !formData.date) return alert('Preencha os dados obrigatórios');

    const dateObj = parseISO(formData.date);
    const monthRef = format(dateObj, 'MM/yyyy');

    const newEvent: FinancialEvent = {
      id: editingEvent?.id || crypto.randomUUID(),
      name: formData.name || 'Job Sem Nome',
      clientOrigin: formData.clientOrigin || 'Cliente',
      type: formData.type || 'Job',
      location: formData.location,
      time: formData.time,
      description: formData.description,
      date: formData.date,
      monthReference: monthRef,
      totalValue: Number(formData.totalValue),
      monthlyValue: Number(formData.totalValue),
      status: formData.status as PaymentStatus,
      history: editingEvent?.history || [{ date: new Date().toISOString(), status: formData.status as PaymentStatus }]
    };

    if (editingEvent) {
      actions.updateEvent(newEvent);
    } else {
      actions.addEvent(newEvent);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if(confirm("Remover este job da agenda?")) {
      actions.deleteEvent(id);
    }
  };

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-200px)] min-h-[650px]">
      
      {/* Calendar Card */}
      <div className="flex-[2] flex flex-col bg-white dark:bg-[#1E293B] rounded-[24px] border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-700/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize font-sans tracking-tight">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h2>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-lg">
            <button onClick={handlePrevMonth} className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm text-slate-500 transition-all">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="text-xs font-semibold px-3 py-1.5 text-slate-600 dark:text-slate-300">
              Hoje
            </button>
            <button onClick={handleNextMonth} className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm text-slate-500 transition-all">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Calendar Body */}
        <div className="flex-1 flex flex-col p-6">
          <div className="grid grid-cols-7 mb-4">
            {WEEKDAYS.map(day => (
              <div key={day} className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 flex-1 auto-rows-fr gap-2">
            {Array.from({ length: startingDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {daysInMonth.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDay = isToday(day);
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <div 
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  className={`
                    relative p-2 rounded-xl cursor-pointer transition-all duration-200 group flex flex-col items-center justify-start gap-1.5 border border-transparent
                    ${!isCurrentMonth ? 'opacity-25' : ''}
                    ${isSelected 
                        ? 'bg-[#C7B8FF]/20 border-violet-200 dark:border-violet-800 dark:bg-violet-900/20' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'}
                  `}
                >
                  <span className={`
                    w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors
                    ${isTodayDay 
                        ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-500/30' 
                        : isSelected 
                            ? 'text-violet-700 dark:text-violet-300 font-bold' 
                            : 'text-slate-600 dark:text-slate-400 font-medium'}
                  `}>
                    {format(day, 'd')}
                  </span>

                  {/* Tiny Dots for Events */}
                  <div className="flex gap-1 flex-wrap justify-center content-center w-full px-1">
                    {dayEvents.map((evt, idx) => (
                      <div 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full ${evt.status === 'PAID' ? 'bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)]' : 'bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.5)]'}`} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details Side Panel */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#1E293B] rounded-[24px] border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {/* Side Panel Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-[#F9FAFB] dark:bg-slate-800/50">
           <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">
                {selectedDate ? format(selectedDate, 'EEEE', { locale: ptBR }) : 'Agenda'}
              </p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedDate ? format(selectedDate, 'd MMM', { locale: ptBR }) : 'Selecionar'}
              </h3>
           </div>
           {selectedDate && (
             <Button onClick={handleOpenNewEvent} className="h-10 w-10 !p-0 rounded-full shadow-md bg-violet-600 hover:bg-violet-700 text-white">
               <Plus className="h-5 w-5" />
             </Button>
           )}
        </div>

        {/* Event List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-white dark:bg-[#1E293B]">
          {!selectedDate ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <CalendarIcon className="h-12 w-12 text-slate-300 mb-3" />
              <p className="text-slate-400 text-sm font-medium">Toque em um dia para ver</p>
            </div>
          ) : selectedDayEvents.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4">
                <Camera className="h-7 w-7 text-slate-300 dark:text-slate-500" />
              </div>
              <p className="text-slate-900 dark:text-white text-sm font-semibold">Nenhum job agendado</p>
              <p className="text-slate-400 text-xs mt-1">Aproveite o dia livre!</p>
            </div>
          ) : (
            selectedDayEvents.map(evt => (
              <div key={evt.id} className="group relative bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-4 transition-all duration-200 hover:border-violet-200 dark:hover:border-violet-900 hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${evt.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30'}`}>
                        {evt.status === 'PAID' ? 'PAGO' : 'PENDENTE'}
                    </span>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{evt.name}</h4>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => handleEditEvent(evt)} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-violet-600 transition">
                        <Edit2 className="h-3.5 w-3.5" />
                     </button>
                     <button onClick={() => handleDelete(evt.id)} className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-600 transition">
                        <Trash2 className="h-3.5 w-3.5" />
                     </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-50 dark:border-slate-700/30">
                   {evt.time && (
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                      {evt.time}
                    </div>
                   )}
                   <div className="flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <DollarSign className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                      {formatCurrency(evt.totalValue)}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingEvent ? "Editar Job" : "Novo Job"}
        footer={
          <div className="flex w-full gap-3">
             <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
             <Button onClick={handleSave} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20">{editingEvent ? 'Salvar' : 'Agendar Job'}</Button>
          </div>
        }
      >
        <div className="space-y-5 py-2">
          <Input 
            label="Nome do Job / Cliente" 
            placeholder="Ex: Casamento Julia & Marcos" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
          
          <div className="grid grid-cols-2 gap-4">
             <Input 
              label="Data" 
              type="date"
              value={formData.date} 
              onChange={e => setFormData({...formData, date: e.target.value})} 
            />
            <Input 
              label="Horário" 
              type="time"
              value={formData.time} 
              onChange={e => setFormData({...formData, time: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Valor Total (R$)" 
              type="number" 
              value={formData.totalValue} 
              onChange={e => setFormData({...formData, totalValue: Number(e.target.value)})} 
            />
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">Status</label>
              <div className="relative">
                <select 
                    className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:bg-slate-950 dark:border-slate-800 appearance-none"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as PaymentStatus})}
                >
                    <option value="PENDING">Pendente</option>
                    <option value="PAID">Pago</option>
                    <option value="PARTIAL">Parcial</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
             <label className="text-sm font-medium text-slate-900 dark:text-slate-100">Observações</label>
             <textarea 
                className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:bg-slate-950 dark:border-slate-800 min-h-[80px] resize-none"
                placeholder="Detalhes, local, equipamentos..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
             />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventosPage;