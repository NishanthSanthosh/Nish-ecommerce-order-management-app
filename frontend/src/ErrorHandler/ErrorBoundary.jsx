import React from "react";
function FallbackUI({ reset }) {
  return (
    <div>
      <h2>Oops! Something went wrong.</h2>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) return <FallbackUI reset={this.reset} />;
    return this.props.children;
  }
}
export default ErrorBoundary;
