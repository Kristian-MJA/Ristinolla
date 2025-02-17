import React, { useEffect, useState, useContext } from 'react';
//import { useEffect } from 'react/cjs/react.development';
import './App.css';
import RuutuCtx from './RuutuCtx.js';
//import { render } from 'react-dom';
import { store } from './store.js';

const io = require('socket.io-client');
const ioHost = 'http://localhost:4000';
const ioHostOptions = {
	transports: ['websocket', 'polling', 'flashsocket']
};

const Pelitila = {
	NIMI_X_MUUTTUI: 'NIMI_X_MUUTTUI',
	NIMI_O_MUUTTUI: 'NIMI_O_MUUTTUI',
	ALOITA_PAINETTU: 'ALOITA_PAINETTU',
	RUUTU_VALITTU: 'RUUTU_VALITTU',
	PELI_OHI: 'PELI_OHI',
	UUSIPELI_PAINETTU: 'UUSIPELI_PAINETTU',
	TILAN_VALITYS: 'TILAN_VALITYS'
};

const nap = { x: "X", o: "O", tyhja: " " };


// TÄRKEÄÄ OLLA APPIFUNKTION ULKOPUOLELLA!
const socket = io(ioHost, ioHostOptions);


const App6 = () => {

	/*
	const foo = () => {
		console.log('bar');
	};
	*/

	// const [state, dispatch] = useReducer(reducer, initialState);
	const globalState = useContext(store);
	const { dispatch, state } = globalState;

	const [OmaID, setOmaID] = useState('');
	const [OmaNimi, setOmaNimi] = useState('');
	//const [Nimimerkki, setNimimerkki] = useState('');
	const [VierasID, setVierasID] = useState('');
	const [VierasNimi, setVierasNimi] = useState('');
	//const [VastustajaNimi, setVastustajaNimi] = useState('');
	//const [VastustajaID, setVastustajaID] = useState('');
	const [HuoneID, setHuoneID] = useState('');
	const [LuotuHuone, setLuotuHuone] = useState('');

	const nimiOMuuttui = (tapahtuma) => {
		dispatch({
			type: Pelitila.NIMI_O_MUUTTUI,
			data: tapahtuma.target.value
		});
	};
	const nimiXMuuttui = (tapahtuma) => {
		dispatch({
			type: Pelitila.NIMI_X_MUUTTUI,
			data: tapahtuma.target.value
		});
	};
	const aloitaNappiPainettu = () => {
		dispatch({ type: Pelitila.ALOITA_PAINETTU })
	};
	const uusiPeliNappiPainettu = () => {
		dispatch({ type: Pelitila.UUSIPELI_PAINETTU })
	};
	const ruutuValittu = (indeksi) => {
		dispatch({ type: Pelitila.RUUTU_VALITTU, data: indeksi });
	};
	const luovutaNappiPainettu = () => {
		dispatch({ type: Pelitila.PELI_OHI, data: state.pelivuoroX });
	};
	const kenenVuoro = () => {
		if (state.pelivuoroX) {
			return nap.x;
		} else {
			return nap.o;
		};
	};
	const liityHuoneeseen = () => {
		if (OmaNimi.length > 0) {
			socket.emit(
				'joinRoom',
				{ nick: OmaNimi, playerId: OmaID, roomId: HuoneID }
			);
		} else {
			console.log('Anna nimimerkki!');
		};
	};
	const luoHuone = () => {
		if (LuotuHuone.length > 0) {
			socket.emit('createRoom', { room: LuotuHuone });
		};
	};


	useEffect(() => {
		socket.on('gameId', (id) => {
			console.log('Sinun socket-ID:', id);
			setOmaID(id);
		});

		socket.on('serverMessage', (msg) => {
			console.log(msg);
		});
	}, []);

	useEffect(() => {
		socket.on('joinedMyRoom', (data) => {
			setVierasNimi(data.nick);
			setVierasID(data.playerId);
		});

		if (VierasNimi.length > 0) {
			console.log(
				`${VierasNimi} liittyi huoneeseesi ${LuotuHuone}`
			);
		};
	}, [LuotuHuone, VierasNimi]);

	useEffect(() => {
		/*
		// --- asdasdasddagfkds alla oleva on väärin
		// Dataa vastaanottaa vain huoneeseen liittynyt vieraspelaaja
		socket.on('gameData', (gameState) => {
			dispatch({
				type: Pelitila.TILAN_VALITYS,
				data: gameState
			});
			console.log('Vastaanotit pelidataa:', gameState);
		});
		*/
	}, [dispatch]);

	useEffect(() => {
		console.log('Nimimerkkisi:', OmaNimi);
	}, [OmaNimi]);

	useEffect(() => {
		console.log('Syötetty huone:', HuoneID)
	}, [HuoneID]);

	useEffect(() => {
		console.log('Luotu huone:', LuotuHuone)
	}, [LuotuHuone]);

	useEffect(() => {
		if (OmaNimi.length > 0 && VierasNimi.length > 0) {
			dispatch({
				type: Pelitila.NIMI_X_MUUTTUI,
				data: OmaNimi
			});
			dispatch({
				type: Pelitila.NIMI_O_MUUTTUI,
				data: VierasNimi
			});
		};
	}, [dispatch, OmaNimi, VierasNimi]);

	/*
	useEffect(() => {
		if (Nimimerkki.length > 0 && VastustajaNimi.length > 0) {
			dispatch({
				type: Pelitila.NIMI_X_MUUTTUI,
				data: Nimimerkki
			});
			dispatch({
				type: Pelitila.NIMI_O_MUUTTUI,
				data: VastustajaNimi
			});
		};
	}, [dispatch, Nimimerkki, VastustajaNimi]);
	*/

	// TODO: pelidatan välitys: pelaaja 1 <--> huone <--> pelaaja 2
	useEffect(() => {
		if (state.peliKaynnissa) {
			//socket.emit('gameData', state);
		};
	}, [state]);


	//  {voittikoX() && 'X voitti'}
	return (
		<div className='App'>
			<header className='App-header'>

				{/*
					(state.pelaajat[0].length < 1
						|| state.pelaajat[1].length < 1)
					&& <div>Kirjoita pidemmät nimet!</div>
				*/}
				<div className='div-aula'>
					Nimimerkkisi (X): &nbsp;
					<input
						className='input-xo'
						type='text'
						//value={Nimimerkki}
						value={OmaNimi}
						onChange={(event) =>
							setOmaNimi(event.target.value)
						}>
					</input>
					&nbsp; Vastustaja (O): {VierasNimi}
					{
						//Nimimerkki.length === 0
						OmaNimi.length === 0
						&&
						<div>Syötä nimimerkki!</div>
					}
					{
						!state.peliKaynnissa
						&&
						<div>
							<div>Sinun ID: {OmaID}</div>
							{/*<div>
								Vastustaja: {VastustajaNimi}
							</div>*/}
							{
								<div>
									Luo huone: &nbsp;
									<input
										className='input-xo'
										type='text'
										value={LuotuHuone}
										onChange={(event) =>
											setLuotuHuone(event.target.value)
										}>
									</input>
									<div className='div-nappula'>
										<button
											className='button-xo'
											onClick={() => luoHuone()}>
											Luo huone
										</button>
									</div>
								</div>
							}
							{
								//VastustajaNimi.length > 0
								VierasNimi.length > 0
								&& <div className='div-nappula'>
									<button
										className='button-xo'
										onClick={() => aloitaNappiPainettu()}>
										Aloita peli
									</button>
								</div>
							}
							{
								//VastustajaNimi.length === 0
								VierasNimi.length === 0
								&& <div>
									Huoneen ID: &nbsp;
									<input
										className='input-xo'
										type='text'
										value={HuoneID}
										onChange={(event) =>
											setHuoneID(event.target.value)
										}>
									</input>
									<div className='div-nappula'>
										<button
											className='button-xo'
											onClick={() => liityHuoneeseen()}>
											Liity peliin
										</button>
									</div>
								</div>
							}
						</div>
					}
				</div>
				{
					state.peliKaynnissa
					&& state.voittaja === -1
					&& <div>VUORO: {kenenVuoro()}</div>
				}
				{
					state.voittaja !== -1
					&& <div>VOITTAJA: {state.pelaajat[state.voittaja]}</div>
				}

				<div className='ristinollapeli'>
					{
						state.peliKaynnissa
						&& state.pelilauta.map((alkio, indeksi) =>
							<RuutuCtx key={indeksi} ruuduntila={alkio} />
						)
					}
				</div>

				{
					<div>
						{
							state.voittaja !== -1
							&& <button
								className='button-xo'
								onClick={uusiPeliNappiPainettu}>
								Uusi peli
							</button>
						}
						{
							state.peliKaynnissa
							&& state.voittaja === -1
							&& <button
								className='button-xo-red'
								onClick={luovutaNappiPainettu}>
								Luovuta
							</button>
						}
					</div>
				}

				{/*
					(state.pelaajat[0].length < 1
						|| state.pelaajat[1].length < 1)
					&& <div>Kirjoita pidemmät nimet!</div>
				}
				<div>
					Pelaaja X: &nbsp;
					<input
						className='input-xo'
						type='text'
						value={state.pelaajat[1]}
						onChange={(event) => nimiXMuuttui(event)}>
					</input>
					&nbsp;
					Pelaaja O: &nbsp;
					<input
						className='input-xo'
						type='text'
						value={state.pelaajat[0]}
						onChange={(event) => nimiOMuuttui(event)}>
					</input>
				</div>
				{
					state.peliKaynnissa
					&& state.voittaja === -1
					&& <div>VUORO: {kenenVuoro()}</div>
				}
				{
					state.voittaja !== -1
					&& <div>VOITTAJA: {state.pelaajat[state.voittaja]}</div>
				}

				<div className='ristinollapeli'>
					{
						state.peliKaynnissa
						&& state.pelilauta.map((alkio, indeksi) =>
							<RuutuCtx key={indeksi} ruuduntila={alkio} />
						)
					}
				</div>

				{
					!state.peliKaynnissa
					&& <div>Pelin ID: {OmaID}</div>
				}
				{
					<div>
						{
							!state.peliKaynnissa
							&& <button
								className='button-xo'
								onClick={aloitaNappiPainettu}>
								Aloita peli
							</button>
						}
						{
							state.voittaja !== -1
							&& <button
								className='button-xo'
								onClick={uusiPeliNappiPainettu}>
								Uusi peli
							</button>
						}
						{
							state.peliKaynnissa
							&& state.voittaja === -1
							&& <button
								className='button-xo-red'
								onClick={luovutaNappiPainettu}>
								Luovuta
							</button>
						}
					</div>
			*/}

			</header >
		</div >
	);
};


export default App6;
