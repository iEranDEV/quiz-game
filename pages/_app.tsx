import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import { AuthContextProvider } from '../context/AuthContext';
import { NotificationContextProvider } from '../context/NotificationContext';
import { WebContextProvider } from '../context/WebContext';

export default function App({ Component, pageProps }: AppProps) {


	return (
		<AuthContextProvider>
			<NotificationContextProvider>
				<WebContextProvider>
					<Component {...pageProps} />
				</WebContextProvider>
			</NotificationContextProvider>
		</AuthContextProvider>
	);
}
