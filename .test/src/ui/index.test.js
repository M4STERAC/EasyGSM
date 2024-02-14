import React from 'react';
import { render } from '@testing-library/react';
import App from '../src/ui/App';

describe("React - Happy Path", () => {
    test('renders the React app without crashing', () => {
        const { getByText } = render(<App />);
        const linkElement = getByText(/SERVER LIST/i);
        expect(linkElement).toBeInTheDocument();
    }, 500);
})
