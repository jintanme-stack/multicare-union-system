'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
    try {
      localStorage.setItem('last_client_error', JSON.stringify({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      }));
    } catch (e) {
      // ignore
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          background: '#1e293b',
          color: '#ef4444',
          minHeight: '100vh',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          overflowY: 'auto'
        }}>
          <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ Application Rendering Crash</h1>
          <p style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1rem' }}>
            <strong>Error:</strong> {this.state.error?.message}
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
            <strong>Stack Trace:</strong>
            <br />
            {this.state.error?.stack}
          </p>
          {this.state.errorInfo && (
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              <strong>Component Stack:</strong>
              <br />
              {this.state.errorInfo.componentStack}
            </p>
          )}
          <button 
            onClick={() => {
              try {
                localStorage.clear();
                window.location.reload();
              } catch (e) {}
            }}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🚨 Clear Local Cache & Hard Reset
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
