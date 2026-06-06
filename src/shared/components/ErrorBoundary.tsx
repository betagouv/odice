// ErrorBoundary React qui capture les erreurs de rendu / lifecycle.
// Délègue au reporter et affiche le fallback fourni par le parent.

import { Component, type ErrorInfo, type ReactNode } from "react";
import { reportError } from "@shared/monitoring/error-reporter";

type Props = {
  children: ReactNode;
  fallback: ReactNode;
};

type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    reportError(error, {
      source: "react.ErrorBoundary",
      componentStack: info.componentStack ?? "",
    });
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
