import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg p-8">
          <div className="glass p-8 max-w-md text-center">
            <span className="text-[48px] block mb-4">⚠️</span>
            <h2 className="text-[18px] font-bold text-wtext mb-2">Something went wrong</h2>
            <p className="text-[13px] text-muted mb-6 leading-relaxed">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-accent text-bg font-bold text-[13px] px-6 py-2.5 rounded-lg hover:opacity-85 transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
