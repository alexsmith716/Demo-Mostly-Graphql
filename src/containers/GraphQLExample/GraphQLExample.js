import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
	useQuery,
	useLazyQuery,
	useApolloClient,
	// useReactiveVar,
	NetworkStatus,
	gql,
} from '@apollo/client';

import { characterLastSearchStringVar } from '../../apollo/apolloClient';
import { Loading } from '../../components/Loading';
import Button from '../../components/Button';
import { RickAndMortyCharacter } from '../../components/RickAndMortyCharacter';
import { GET_RICK_AND_MORTY_CHARACTERS, GET_CHARACTERS_LAST_SEARCH_STRING } from '../../graphql/queries/queries.js';
import { reactiveVariableMutations } from '../../graphql/operations/mutations'

const GraphQLExample = () => {

	const { setCharactersLastSearchStringVar } = reactiveVariableMutations;

	//  const [errorMessage, setErrorMessage] = useState(null);
	const inputElement = useRef(null);
	const [clientExtract, setClientExtract] = useState(null);
	const [rickAndMortyCharactersInfo, setRickAndMortyCharactersInfo] = useState(false);
	const [rickAndMortyCharactersFilterName, setRickAndMortyCharactersFilterName] = useState('');
	const [rickAndMortyCharactersCurrentPage, setRickAndMortyCharactersCurrentPage] = useState(null);
	const [rickAndMortyResults, setRickAndMortyResults] = useState(false);
	const [toggleCacheView, setToggleCacheView] = useState(false);
	// const lastSearchStringReactiveVar = useReactiveVar(charactersLastSearchStringVar);

	const client = useApolloClient();

	const {
			loading: lastSearchStringLOADING, 
			error: lastSearchStringERROR,
			data: lastSearchStringDATA,
		} = useQuery(
			GET_CHARACTERS_LAST_SEARCH_STRING
	);

	const onCompleted = () => {
		console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > QUERY > Completed ++++++++++++++++++++');
	};

	const variables = {
		filter: { name: `${rickAndMortyCharactersFilterName}`},
	};

	const [getRickAndMortyCharacters, {
			loading: rickAndMortyCharactersLoading, 
			error: rickAndMortyCharactersError,
			data: rickAndMortyCharactersData,
			previousData,
			refetch,
			fetchMore,
			networkStatus,
		}] = useLazyQuery(
			gql`${GET_RICK_AND_MORTY_CHARACTERS}`,
			{
				//  fetchPolicy: 'cache-and-network',
				//  nextFetchPolicy: 'cache-first',
				//  variables,
				notifyOnNetworkStatusChange: true,
				onCompleted,
			}
	);

	//  =====================================================================

	useEffect(() => {
			// console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > lastSearchStringReactiveVar: ', lastSearchStringReactiveVar);
			if (rickAndMortyCharactersData) {
				const { characters: { info }} = rickAndMortyCharactersData;
				const { characters: { results }} = rickAndMortyCharactersData;
				if (info) {
					setRickAndMortyCharactersInfo(info);
					if (!info.prev && info.next) {
						setRickAndMortyCharactersCurrentPage(1);
					} else if (info.next && info.prev) {
						setRickAndMortyCharactersCurrentPage(info.next - 1);
					} else {
						setRickAndMortyCharactersCurrentPage(info.pages);
					}
				}
				if (results.length > 0) {
					setRickAndMortyResults(true);
				}
			}
			if (toggleCacheView) {
				setClientExtract(client.extract());
			}
			if (lastSearchStringDATA) {
				const { charactersLastSearchString: { lastSearchString }} = lastSearchStringDATA;
				console.log('>>>>>>>>>>>>>>>>>>>>>>>> GraphQLExample > lastSearchString!!!!!: ', lastSearchString);
			}
		},
		[rickAndMortyCharactersData, lastSearchStringDATA, toggleCacheView]
	);

	return (
		<>
			<Helmet title="GraphQL Example" />

			{/* ---------------------------------------------- */}

			<div className="container">
				{/* ---------------------------------------------- */}

				<h1 className="mt-4 mb-3">GraphQL Example</h1>

				{/* ---------------------------------------------- */}

				<div className="bg-color-ivory container-padding-border-radius-1 text-break mb-5">
					<div className="mb-3">

						<div className="mb-3">
							<h5>rickAndMortyCharactersData Data:</h5>
						</div>

						<div className="mb-3">
							{networkStatus === NetworkStatus.refetch && (
								<b><Loading text="Refetching" /></b>
							)}

							{rickAndMortyCharactersLoading && (
								<b><Loading text="Loading" /></b>
							)}

							{rickAndMortyCharactersError && (
								<b>Query Error: {rickAndMortyCharactersError.message}</b>
							)}
						</div>

						<div>
							{rickAndMortyCharactersData && rickAndMortyResults && (
								<div>
									{rickAndMortyCharactersData.characters.results.map((character, index) => (
										<div key={index} className="mb-3 container-padding-border-radius-2">
											<RickAndMortyCharacter character={ character } />
										</div>
									))}
								</div>
							)}
							{rickAndMortyCharactersData && !rickAndMortyResults && (
								<div><p>Query Error: No data.</p></div>
							)}
						</div>

						{clientExtract && (
							<div className={!toggleCacheView ? 'text-overflow-ellipsis-one' : ''}>
								<h5>ApolloClient Cache:</h5>
								<div>{JSON.stringify(clientExtract)}</div>
							</div>
						)}
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => setToggleCacheView(!toggleCacheView)}
							buttonText={!clientExtract ? "View Apollo Cache" : "Toggle Cache View"}
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => setCharactersLastSearchStringVar({lastSearchString: 'Morty'})}
							buttonText={"Test Reactive var"}
						/>
					</div>

					<div className="mb-3">
						<div className="row-flex">
							<div className="col-four">
								<input
									ref={inputElement}
									type="text"
									className="form-control"
									name="rickAndMortyCharactersFilterName"
									defaultValue={rickAndMortyCharactersFilterName}
									onChange={e => setRickAndMortyCharactersFilterName(e.target.value)}
									placeholder="Rick, Morty, Beth..."
								/>
							</div>
						</div>
					</div>

					{rickAndMortyCharactersCurrentPage && (
						<div className="mb-3">
							<b>Page {rickAndMortyCharactersCurrentPage} of {rickAndMortyCharactersInfo.pages}</b>
						</div>
					)}

					<div className="mb-3">
						<Button
							type="button"
							className={`btn-success btn-md`}
							onClick={() => getRickAndMortyCharacters({variables: {filter: {name: rickAndMortyCharactersFilterName }},})}
							buttonText="Get Characters"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className={`btn-success btn-md`}
							onClick={() => getRickAndMortyCharacters({variables: {filter: {name: 'Rick' }},})}
							buttonText="get rick chars"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className={`btn-success btn-md`}
							onClick={() => getRickAndMortyCharacters({variables: {filter: {name: 'Beth' }},})}
							buttonText="get beth chars"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className={`btn-success btn-md`}
							onClick={() => getRickAndMortyCharacters({variables: {filter: {name: 'Morty' }},})}
							buttonText="get morty chars"
						/>
					</div>

					{rickAndMortyCharactersData && rickAndMortyCharactersInfo && (
						<div className="mb-3">
							<Button
								type="button"
								className={`btn-primary btn-md ${rickAndMortyCharactersInfo ? rickAndMortyCharactersInfo.next ? '' : 'disabled' : null}`}
								onClick={ () => {
									fetchMore({
										variables: {page: rickAndMortyCharactersInfo.next,},
									});
								}}
								buttonText="Fetch More"
							/>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default GraphQLExample;
