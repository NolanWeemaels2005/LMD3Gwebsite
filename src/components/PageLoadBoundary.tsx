import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode; title: string; retry: string };
export class PageLoadBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <section className="route-pending" role="alert"><h1>{this.props.title}</h1><button className="button button--green" onClick={() => window.location.reload()}>{this.props.retry}</button></section>;
    return this.props.children;
  }
}
