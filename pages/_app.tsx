import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import { AuthContextProvider } from '../context/AuthContext';
import { NotificationContextProvider } from '../context/NotificationContext';
import { GameContextProvider } from '../context/GameContext';

export default function App({ Component, pageProps }: AppProps) {


	return (
		<AuthContextProvider>
			<NotificationContextProvider>
				<GameContextProvider>
					<Component {...pageProps} />
				</GameContextProvider>
			</NotificationContextProvider>
		</AuthContextProvider>
	);
}
