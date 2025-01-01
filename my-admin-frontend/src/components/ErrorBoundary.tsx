// frontend/src/components/ErrorBoundary.tsx
import React from 'react';

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
    constructor(props: React.PropsWithChildren<{}>) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div style={{ color: 'white' }}>Произошла ошибка, попробуйте обновить страницу.</div>;
        }
        return this.props.children;
    }
}
