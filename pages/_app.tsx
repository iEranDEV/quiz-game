import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { store } from '../store/store';
import { Provider } from 'react-redux';
import React from 'react';
import { AuthContextProvider } from '../context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {


	return (
		<AuthContextProvider>
			<Provider store={store}>
				<Component {...pageProps} />
			</Provider>
		</AuthContextProvider>
	);
}
