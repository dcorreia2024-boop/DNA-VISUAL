import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Erro capturado:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: 40, color: '#c62828', fontSize: 14, textAlign: 'center' }}>
          <strong>Algo deu errado ao renderizar esta se&ccedil;&atilde;o.</strong>
          <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
            {this.state.error?.message || 'Erro desconhecido'}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
