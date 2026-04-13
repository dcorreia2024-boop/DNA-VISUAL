import { useForm } from '../context/FormContext';

export default function Toast() {
  const { toastVisible } = useForm();
  return (
    <div className={`toast ${toastVisible ? 'on' : ''}`}>
      <span className="dot"></span> Salvo automaticamente
    </div>
  );
}
