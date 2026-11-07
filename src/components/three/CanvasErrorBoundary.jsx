"use client";

import { Component, Fragment } from "react";

// A failed model/texture load inside a <Canvas> throws during render. Without a
// boundary React 19 unmounts the whole root, so the page goes blank. This keeps
// the failure local to the 3D slot and renders `fallback` (nothing by default).
//
// `retries` remounts the scene that many times after an error; `onRetry` runs
// first so the caller can clear loader caches (e.g. useGLTF.clear(url)),
// otherwise the cached rejection would be thrown again immediately.
export default class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, attempt: 0 };
    this.timer = null;
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    const { retries = 0, onRetry } = this.props;
    const { attempt } = this.state;
    console.error(`[3d] scene failed to load (attempt ${attempt + 1}/${retries + 1}):`, error);
    if (attempt >= retries) return;

    this.timer = setTimeout(() => {
      onRetry?.();
      this.setState({ error: null, attempt: attempt + 1 });
    }, 500);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    if (this.state.error) return this.props.fallback ?? null;
    // Changing the key remounts the subtree so loaders run again.
    return <Fragment key={this.state.attempt}>{this.props.children}</Fragment>;
  }
}
