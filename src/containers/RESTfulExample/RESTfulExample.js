import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
	useQuery,
	useLazyQuery,
	useApolloClient,
	NetworkStatus,
	gql,
} from '@apollo/client';

import Button from '../../components/Button';
import { GoogleBookBook, } from '../../components/GoogleBookBook';
import { GET_GOOGLE_BOOKS, GET_GOOGLE_BOOK } from '../../graphql/queries/queries.js';


const RESTfulExample = () => {

	const [clientExtract, setClientExtract] = useState(null);
	const [googleBooksSearch, setGoogleBooksSearch] = useState(null);
	const [googleBooksSearchInput, setGoogleBooksSearchInput] = useState('');
	const [toggleCacheView, setToggleCacheView] = useState(false);
	const [googleBooksReadCacheDATA, setGoogleBooksReadCacheDATA] = useState(null);
	const [lastSearch, setLastSearch] = useState(null);

	const client = useApolloClient();

	const onCompleted = () => {
		console.log('>>>>>>>>>>>>>>>>>>>>>>>> RESTfulExample > QUERY > Completed ++++++++++++++++++++');
	};

	const variables = {
		searchString: googleBooksSearch,
		orderBy: 'newest',
	};

	const [getGoogleBooks, {
			loading, 
			error,
			data: googleBooksDATA,
			previousData: googleBooksPreviousData,
			refetch,
			fetchMore: fetchMore,
			networkStatus,
		}] = useLazyQuery(
			GET_GOOGLE_BOOKS,
			{
				variables,
				//	fetchPolicy: 'cache-and-network',
				//	nextFetchPolicy: 'cache-first',
				notifyOnNetworkStatusChange: true,
				onCompleted,
				//	partialRefetch,
			}
	);

	const [getGoogleBook, {
			loading: googleBookLoading, 
			error: googleBookError,
			data: googleBookDATA,
		}] = useLazyQuery(
			GET_GOOGLE_BOOK,
	);

	useEffect(() => {
			if (!googleBooksReadCacheDATA) {
				setGoogleBooksReadCacheDATA(client.readQuery({ query: gql`${GET_GOOGLE_BOOKS}` }));
			}
			if (googleBooksReadCacheDATA) {
				const search = googleBooksReadCacheDATA?.googleBooks?.lastSearchString;

				if (googleBooksSearch) {
					if (googleBooksSearch !== search) {
						setLastSearch(googleBooksSearch);
					} else {
						setLastSearch(search);
					}
				} else {
					setLastSearch(search);
				}
			}

			if (lastSearch) {
				if (!googleBooksDATA) {
					setGoogleBooksSearch(lastSearch);
				}
			}

			if (googleBooksSearch) {
				if (lastSearch) {
					if (!googleBooksDATA) {
						getGoogleBooks({ variables: { searchString: googleBooksSearch },})
					}
					if (googleBooksSearch !== lastSearch) {
						refetch({ searchString: googleBooksSearch });
					}
				} else {
					getGoogleBooks({ variables: { searchString: googleBooksSearch },})
				}
			}

			if (toggleCacheView) {
				setClientExtract(client.extract());
			}
		},
		[googleBooksReadCacheDATA, lastSearch, googleBooksDATA, googleBooksSearch, toggleCacheView,]
	);

	return (
		<>
			<Helmet title="REST Example" />

			{/* ---------------------------------------------- */}

			<div className="container">
				{/* ---------------------------------------------- */}

				<h1 className="mt-4 mb-3">REST Example</h1>

				{/* ---------------------------------------------- */}

				<div className="bg-color-ivory container-padding-border-radius-1 text-break mb-5">
					<div className="mb-3">

						<div className="mb-3">
							<h5>getGoogleBooks Data:</h5>
						</div>

						{networkStatus === NetworkStatus.refetch && (
							<p>
								Refetching...
							</p>
						)}

						{loading && (
							<p>
								Loading...
							</p>
						)}

						{googleBookLoading && (
							<p>
								Loading...
							</p>
						)}

						{error && (
							<p>
								Query Error: {error.message}
							</p>
						)}

						{googleBookError && (
							<p>
								Query Error: {googleBookError.message}
							</p>
						)}

						{googleBooksDATA && (
							<div>
								{googleBooksDATA.googleBooks.books.map((book, index) => (
									<div key={index} className="mb-3 container-padding-border-radius-2">
										<GoogleBookBook book={ book } />
									</div>
								))}
							</div>
						)}

						{googleBookDATA && googleBookDATA.googleBook && (
							<div>
								<div className="mb-3">
									<h5>getGoogleBook Data:</h5>
								</div>
									<div key={googleBookDATA.googleBook.id} className="mb-3 container-padding-border-radius-2">
										<GoogleBookBook book={ googleBookDATA.googleBook } />
									</div>
							</div>
						)}

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

					{googleBooksDATA && (
						<div className="mb-3">
							<Button
								type="button"
								className="btn-success btn-md"
								onClick={() => refetch()}
								buttonText="RefetchQueryResults"
							/>
						</div>
					)}

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={ () => getGoogleBook({ variables: { id: 'uW_zzQEACAAJ' }}) }
							buttonText="Get Book ID: uW_zzQEACAAJ"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => setGoogleBooksSearch('kaplan usmle')}
							buttonText="Search USMLE"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => setGoogleBooksSearch('kaplan mcat')}
							buttonText="Search MCAT"
						/>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => setGoogleBooksSearch('kaplan lsat')}
							buttonText="Search LSAT"
						/>
					</div>

					<div className="mb-3">
						<div className="row-flex">
							<div className="col-four">
								<input
									type="text"
									className="form-control"
									name="googleBooksSearchInput"
									value={googleBooksSearchInput}
									onChange={e => setGoogleBooksSearchInput(e.target.value)}
									placeholder="Search Google Books"
								/>
							</div>
						</div>
					</div>

					<div className="mb-3">
						<Button
							type="button"
							className="btn-success btn-md"
							onClick={() => setGoogleBooksSearch(googleBooksSearchInput)}
							buttonText="Get Google Books"
						/>
					</div>

					{googleBooksDATA && (
						<div className="mb-3">
							<Button
								type="button"
								className="btn-primary btn-md"
								onClick={ async () => {
									await fetchMore({
										variables: {
											after: googleBooksDATA.googleBooks.cursor,
										},
									});
								}}
								buttonText="fetchMore Google Books"
							/>
						</div>
					)}

				</div>
			</div>
		</>
	);
};

export default RESTfulExample;
