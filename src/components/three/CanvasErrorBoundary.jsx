"use client";

import { Component } from "react";

// A failed model/texture load inside a <Canvas> throws during render. Without a
// boundary React 19 unmounts the whole root, so the page goes blank. This keeps
// the failure local to the 3D slot and renders `fallback` (nothing by default).
export default class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error("[3d] scene failed to load:", error);
  }

  render() {
    if (this.state.error) return this.props.fallback ?? null;
    return this.props.children;
  }
}
