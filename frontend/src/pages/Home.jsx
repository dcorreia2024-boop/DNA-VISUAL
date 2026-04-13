import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <nav className="hnav">
        <div className="hnav-l">
          <div className="v4">V4</div>
          <div className="brand">
            <div className="brand-n">DNA Visual</div>
            <div className="brand-s">by V4 Ruston &amp; Co.</div>
          </div>
        </div>
        <div className="hnav-r">
          <button className="btn btn-r" onClick={() => navigate('/form')}>Come&ccedil;ar</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-grain" />
        <div className="hero-lines" />
        <div className="hero-content">
          <div className="hero-badge">Ferramenta de Identidade Visual</div>
          <div className="hero-title">
            <span className="tw">DNA </span><span className="tr">Visual</span>
          </div>
          <div className="hero-sub">Tudo que o designer precisa saber sobre o cliente. Gerado na hora.</div>
          <div className="action-grid" style={{ marginTop: 16 }}>
            <div className="acard glass">
              <div className="acard-t">Preencher ao Vivo</div>
              <div className="acard-d">Responda as perguntas durante ou ap&oacute;s a reuni&atilde;o com o cliente e gere o dossi&ecirc; na hora.</div>
              <button className="btn btn-r" onClick={() => navigate('/form')}>Iniciar Preenchimento &rarr;</button>
            </div>
            <div className="acard glass">
              <div className="acard-t">Enviar Documento</div>
              <div className="acard-d">Suba um arquivo &mdash; formul&aacute;rio, planilha ou transcri&ccedil;&atilde;o. A IA analisa o que foi preenchido e o que falta.</div>
              <button className="btn btn-o" onClick={() => navigate('/upload')}>Enviar Arquivo &rarr;</button>
            </div>
          </div>
        </div>
        <div className="metrics-bar">
          <div className="met glass"><div className="met-n">0 min</div><div className="met-l">de busca manual</div></div>
          <div className="met-s" />
          <div className="met glass"><div className="met-n">8 se&ccedil;&otilde;es</div><div className="met-l">de identidade visual</div></div>
          <div className="met-s" />
          <div className="met glass"><div className="met-n">1 clique</div><div className="met-l">para gerar o dossi&ecirc;</div></div>
        </div>
      </section>

      <div className="home-ft">
        <div className="home-ft-l"><div className="v4">V4</div> DNA Visual &nbsp;&middot;&nbsp; V4 Ruston &amp; Co.</div>
        <div>Ferramenta Interna &mdash; Uso Exclusivo V4 &nbsp;&middot;&nbsp; Vertical de Design &mdash; 2026</div>
      </div>
    </div>
  );
}
